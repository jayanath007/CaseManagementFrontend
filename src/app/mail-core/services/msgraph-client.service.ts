
import { reduce, mergeAll, filter, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable, from } from 'rxjs';
import * as _ from 'lodash';

import { MailFolder, Message, User, ConversationThread, Post, Group } from '../../core/lib/microsoft-graph';

import { AuthInfoStateService, MessageFormat } from '../../auth';
import { MailItemRequest, MailItemResponse } from '../models/requests';
import { MsgraphClientBase, AppConfig, ApiClientWrapper, MgGraphBatchRequest } from '../../core';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { MgGraphBatchResponse } from '../../mail-item-core/models/interface';
import { MsgraphClientMailItemService } from '../../mail-item-core';
import { FolderPermissions, GroupItem } from '../models/interfaces';
import { SemaphoresService } from '../../shared';

@Injectable()
export class MSGraphClientService {

  private hiddenFolders = ['conflicts', 'syncissues', 'outbox', 'serverfailures', 'localfailures', 'conversationhistory'];
  private msGraphClient: MsgraphClientBase = null;

  constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient, private configs: ServiceEndpointConfig,
    public mailItemServies: MsgraphClientMailItemService, private appConfig: AppConfig, private semaphoresService: SemaphoresService) {

  }

  private getOrCreateClient() {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient;
  }

  public getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
    return this.getOrCreateClient().getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
  }

  public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    return this.getOrCreateClient().getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
  }

  public getMailFoldersByIds(ids: string[], owner: string) {
    const requests = ids.map<MgGraphBatchRequest>((id) => ({
      id: id,
      method: 'GET',
      url: `/${(!owner || owner === 'me') ? 'me' : ('users/' + owner)}/mailFolders/${id}`,
      headers: {
        'Content-Type': 'application/json'
      }
    }));
    return this.mailItemServies.batchRequestBeta<MgGraphBatchResponse<MailFolder>>(requests).pipe(map(
      (result) => {
        return result.responses.map(item => item.body)
          .map(folder => _.omitBy(folder, (__, key) => key.startsWith('@')) as MailFolder);
      }
    ));
  }

  private fetchNextRootFolders(client, step, total, inital = [], owner: string) {
    return from(_.range(step, total, step)).pipe(
      map(skip =>
        client.api(`/${(!owner || owner === 'me') ? 'me' : ('users/' + owner)}/mailFolders`)
          .top(step)
          .skip(skip)
          .get().pipe(map(result => ({ skip, data: result })))
      ),
      mergeAll(3),
      reduce((acc: any[], current) => [...acc, current], inital),
      map((all: any[]) => all),
      map((all: any[]) => all.reduce((acc, current) => [...acc, ...current.data.value], [])));
  }

  public getAllRootMessageFolders(owner: string): Observable<MailFolder[]> {
    const itemPerReq = 200;
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/${(!owner || owner === 'me') ? 'me' : ('users/' + owner)}/mailFolders/msgfolderroot/childFolders`)
        .top(itemPerReq)
        .count(true)
        .get().pipe(map(result => ({ client, result })))
    ),
      switchMap(({ result, client }) => {
        if (result['@odata.count'] > itemPerReq) {
          return this.fetchNextRootFolders(client, itemPerReq, result['@odata.count'], [{ skip: 0, data: result }], owner);
        } else {
          return of(result['value']);
        }
      }),
      map((folders: any[]) => {
        const _folders = folders.filter((item) => {
          if (item.wellKnownName) {
            if (this.hiddenFolders.indexOf(item.wellKnownName) !== -1) {
              return false;
            }
          }
          return true;
        });
        // if (owner !== 'me') {
        //   return _folders.map(val => ({ ...val, wellKnownName: null }));
        // }
        return _folders;
      }
      ));
  }
  public getChildMailFolder(owner, parentFolder): Observable<MailFolder[]> {
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/mailFolders/${parentFolder}/childFolders`)
        .get().pipe(map(result => result['value']))
    ));
  }
  public getListMessageItems(request: MailItemRequest, isSuppressErrors: boolean): Observable<MailItemResponse> {
    const header = {};
    if (isSuppressErrors) {
      header['X-dps'] = 'suppressErrors';
    }
    const owner = request && request.folderOwner !== 'me' ? `users/${request.folderOwner}` : 'me';
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/${owner}/mailFolders/${request.folderId}/messages`)
        .top(request.size)
        .skip(request.start)
        .orderby(request.oDataOrderBy)
        .filter(request.oDataFilter)
        .count(true)
        .expand([`Microsoft.Graph.EventMessage/event($select=id)`,
          `attachments($select=microsoft.graph.fileAttachment/contentId,id,isInline,contentType,name,size)`,
          `singleValueExtendedProperties($filter=id eq 'Integer 0x1080' or id eq 'SystemTime 0x1082')`
        ])
        // .filter('isRead eq false')
        .get(header).pipe(map(result =>
          new MailItemResponse(result['value'], result['@odata.count'])
        ))
    ));
  }
  public searchMailFolderItems(request: MailItemRequest, isSuppressErrors: boolean): Observable<MailItemResponse> {
    // get few for first page and then get all fo next page
    const max = request.start === 0 ? request.start + request.size : 250;
    const header = {};
    if (isSuppressErrors) {
      header['X-dps'] = 'suppressErrors';
    }
    return this.getAuthClient<{ value: Message[] }>().pipe(switchMap(client =>
      client.api(`/me${request.folder}/messages`)
        .top(max)
        // .skip(request.start)
        .search(request.oDataSearch)
        .count(true)
        .expand([`Microsoft.Graph.EventMessage/event($select=id)`,
          `attachments($select=microsoft.graph.fileAttachment/contentId,id,isInline,contentType,name,size)`,
          `singleValueExtendedProperties($filter=id eq 'Integer 0x1080' or id eq 'SystemTime 0x1082')`
        ])
        // .filter('isRead eq false')
        .get(header).pipe(map(result => {
          const totalCount = result['value'].length === (request.start + request.size) ?
            result['value'].length + request.size : result['value'].length;
          const values = result.value.slice(request.start);
          return new MailItemResponse(values, totalCount);
        }))
    ));
  }

  public listOrSearchMessageItems(request: MailItemRequest, isSuppressErrors: boolean) {
    if (request.isSearching) {
      return this.searchMailFolderItems(request, isSuppressErrors);
    }
    return this.getListMessageItems(request, isSuppressErrors);
  }

  public createRootMailFolder(owner: string, dispalyName: string) {
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/mailFolders`)
        .post({ displayName: dispalyName }).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
    ));
  }

  public createChildMailFolder(owner: string, parentFolder, displayName: string) {
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/mailFolders/${parentFolder}/childFolders`)
        .post({ displayName: displayName }).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
    ));
  }

  public createMailFolder(owner: string, displayName: string, parentId?: string) {
    if (!!parentId) {
      return this.createChildMailFolder(owner, parentId, displayName);
    } else {
      return this.createRootMailFolder(owner, displayName);
    }
  }

  public updateMailFolder(owner: string, id: string, displayName: string) {
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/mailFolders/${id}`)
        .patch({ displayName: displayName }).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
    ));
  }

  public moveMailFolder(owner: string, id: string, destinationId: string): Observable<MailFolder> {
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/mailFolders/${id}/move`)
        .post({ destinationId: destinationId }).pipe(map(result => {
          return result;
        }))
    ));
  }
  public deleteMailFolder(owner: string, id: string): Observable<boolean> {
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/mailFolders/${id}`)
        .delete().pipe(map(result => {
          return true;
        }))
    ));
  }

  public createExtensions(isChaserEnable: boolean, isSignaturAutoAdd: boolean, dpsSharedMailBoxes: User[],
    reminderSoundEnable: boolean, newMailSoundEnable: boolean, messageFormat: MessageFormat): Observable<any> {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/me/extensions`)
        .post({
          '@odata.type': 'microsoft.graph.openTypeExtension',
          extensionName: 'organizerSettings',
          isChaserEnable,
          isSignaturAutoAdd,
          dpsSharedMailBoxes,
          reminderSoundEnable,
          newMailSoundEnable,
          messageFormat
        }).pipe(map(result => {
          return result;
        }))
    ));
  }
  public getExtensions() {
    return this.getAuthClient().pipe(switchMap(client => client.api('/me?$select=id&$expand=extensions').get()),
      filter((result: any) => !result.extensions.find(ext => ext.id === 'organizerSettings')),
      switchMap(result => this.createExtensions(true, false, [], true, true, {
        contentType: 'html',
        fontFamily: 'Arial,Helvetica,sans-serif',
        fontSize: '12pt',
        isBold: false,
        isItalic: false,
        isUnderline: false,
        fontColor: '',
      })));
  }
  public updateExtensions(isChaserEnable: boolean, isSignaturAutoAdd: boolean, dpsSharedMailBoxes: User[],
    reminderSoundEnable: boolean, newMailSoundEnable: boolean, messageFormat: MessageFormat, useGlobalSignature: boolean) {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/me/extensions/organizerSettings`)
        .patch({
          isChaserEnable,
          isSignaturAutoAdd,
          dpsSharedMailBoxes,
          reminderSoundEnable,
          newMailSoundEnable,
          messageFormat,
          useGlobalSignature
        }).pipe(
          map(result => result))
    ));
  }
  public getFolderPermissionSet(ids: string[]) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/GetFolderPermissionSet',
      { FolderIds: ids.map(id => ({ Id: id, ChangeKey: null })) }).pipe(
        map(response => response.data));
  }
  public saveFolderPermissionSet(permissions: FolderPermissions) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/ShareMailFolder',
      permissions).pipe(
        map(response => response.data));
  }

  public getjoinedGroups(): Observable<GroupItem[]> {
    return this.getBetaApiClient().pipe(switchMap(client =>
      client.api(`/me/joinedGroups`)
        .top(200)
        .count(true)
        .get().pipe(map(result => result['value']))
    ));
  }

  public getConversations(groupId: string, currentCount: number, itemPerPage: number):
    Observable<{ value: ConversationThread[], count: number }> {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`groups/${groupId}/threads`)
        .top(itemPerPage)
        .skip(currentCount)
        .count(true)
        .get().pipe(map(result => ({ value: result['value'], count: result['@odata.count'] })))
    ));
  }
  public getPosts(threadId: string, groupId: string): Observable<Post[]> {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`groups/${groupId}/threads/${threadId}/posts`)
        .top(200)
        .count(true)
        .expand([
          `attachments($select=microsoft.graph.fileAttachment/contentId,id,isInline,contentType,name,size)`
        ])
        .get().pipe(map(result => result['value']))
    ));
  }
  public loadMembers(id: string): Observable<{ members, owners }> {
    const requests: MgGraphBatchRequest[] = [{
      id: 'members',
      method: 'GET',
      url: `/groups/${id}/members`,
      headers: {
        'Content-Type': 'application/json'
      }
    },
    {
      id: 'owners',
      method: 'GET',
      url: `/groups/${id}/owners`,
      headers: {
        'Content-Type': 'application/json'
      }
    }];
    return this.mailItemServies.batchRequest<MgGraphBatchResponse<User>>(requests).pipe(map(
      (result) => {
        const temp: any = {};
        result.responses.forEach(item => {
          temp[item.id] = item.body['value'];
        });
        return temp;
      }
    ));
  }
  public deleteConversation(groupId: string, id: string) {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`groups/${groupId}/threads/${id}`)
        .delete().pipe(map(result => result))
    ));
  }
  public getGroup(groupId: string) {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/groups/${groupId}`)
        .select(['id', 'displayName', 'description', 'visibility', 'allowExternalSenders', 'mailEnabled'])
        .get().pipe(map(result => result))
    ));
  }
  public editGroup(group: Group): any {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/groups/${group.id}`)
        .patch(group).pipe(
          map(result => result))
    ));
  }
  public createGroup(group: Group): any {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/groups`)
        .post(group).pipe(
          map(result => result))
    ));
  }
  public test() {
    return this.getAuthClient().pipe(switchMap(client => client.api('/me').get()));
  }

}
