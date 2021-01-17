
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, combineLatest, Observable, throwError as _throw } from 'rxjs';
import * as _ from 'lodash';

import { AuthInfoStateService } from '../../auth';
import { MsgraphClientBase, AppConfig, ApiClientWrapper } from '../../core';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { DriveItem, Drive, ItemReference, UploadSession } from '../../core/lib/microsoft-graph';
import { MgGraphBatchResponse } from '../../core/lib/graph-client-interfaces';
import { CopyingItemOperation } from '../models/interfaces';
import { SemaphoresService } from '../../shared';

@Injectable()
export class MSGraphClientService {

  private msGraphClient: MsgraphClientBase = null;

  constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
    private configs: ServiceEndpointConfig, private appConfig: AppConfig, private semaphoresService: SemaphoresService) {
  }
  public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
  }

  public batchRequest(requests): Observable<MgGraphBatchResponse<{}>> {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient.batchRequest(requests, this.semaphoresService.getMsgraphSemaphoree());
  }
  // public getSpitfireRoot() {
  //   return this.getAuthClient().switchMap((client) => {
  //     return client.api('/me/drive/root:/Documents').get().map((data) => {
  //       return data;
  //     });
  //   });
  // }

  public ensureSpitfireSpecialFolders(): Observable<DriveItem[]> {
    // const $downlaod = this.getAuthClient().switchMap((client) => {
    //   return client.api('/me/drive/root:/Downloads').get().map((data) => {
    //     return data;
    //   });
    // }).catch((error) => {
    //   try {
    //     if (error.error.error.code === 'itemNotFound') {
    //       return this.getAuthClient().switchMap((client) => {
    //         return client.api('/me/drive/root/children').post({ 'name': 'Downloads', 'folder': {} });
    //       });
    //     }
    //   } catch (e) {
    //   }
    //   return _throw(error);
    // });

    const $documents = this.getAuthClient().pipe(switchMap((client) => {
      return client.api('/me/drive/root:/Documents').get().pipe(map((data) => {
        return data;
      }));
    }));
    return $documents.pipe(map(data => [data]));
    // return combineLatest($downlaod, $documents, (a, b) => [a, b]);
  }

  public getSharedDrive(name: string) {
    return this.getAuthClient().pipe(switchMap((client) => {
      return client.api('groups')
        .filter(`displayName eq 'SpitfireShare'`)
        .get().pipe(map((data) => {
          if (data['value'] && data['value'].length === 1) {
            return { group: data['value'][0], client: client };
          }
          return null;
        }));
    }), switchMap((info) => {
      if (info != null) {
        return info.client.api(`/groups/${info.group.id}/drive`).get();
      }
      return of(null);
    }), switchMap((drive: Drive) => {
      if (drive != null) {

        const $root = this.getRootFolder(drive.id).pipe(
          map((root) => ({ drive: { ...drive, name: 'Shared Drive' }, root: root })));
        const $personal = this.getPersonalFolder(name, drive.id);
        return combineLatest($root, $personal, (root, folder) => ({ ...root, folders: [folder] }));
      }
      return of(null);
    }));
  }
  private getPersonalFolder(name: string, driveId: string) {
    return this.getAuthClient().pipe(switchMap((client) => {
      return client.api(`/drives/${driveId}/root:/${name}`).get().pipe(map((data) => {
        return data;
      }));
    }), catchError((error) => {
      try {
        if (error.error.error.code === 'itemNotFound') {
          return this.getAuthClient().pipe(switchMap((client) => {
            return client.api(`/drives/${driveId}/root/children`).post({ 'name': name, 'folder': {} });
          }));
        }
      } catch (e) {
      }
      return _throw(error);
    }));
  }
  // public listItems(currentCount: number = 0,  parentId: string = null, itemPerPage: number = 200, groupId?: string):
  //   Observable<{ value: DriveItem[], count: number }> {
  //   return this.getAuthClient().switchMap((client) => {
  //     const qString = groupId ? `/groups/${groupId}` : '/me';
  //     const path = parentId ? `${qString}/drive/items/${parentId}/children` : `/me/drive/root/children`;
  //     return client.api(path)
  //       .top(itemPerPage)
  //       .skip(currentCount).count(true)
  //       .get()
  //       .map(result => ({ value: result['value'], count: result['@odata.count'] }));
  //   });
  // }

  public getMyDrive() {
    return this.getAuthClient<Drive>().pipe(
      switchMap((client) => {
        return client.api('/me/drive').get().pipe(map((value: Drive) => ({ ...value, name: 'My Drive' })));
      }));
  }

  public getRootFolder(driveId: string) {
    return this.getAuthClient<DriveItem>().pipe(switchMap((client) => {
      return client.api(`/drives/${driveId}/root`).get();
    }));
  }

  private driveItemLister(path: string, itemPerPage: number = 200, skipToken = null, sortby: string, orderby: string):
    Observable<{ items: DriveItem[], skipToken: string }> {
    return this.getAuthClient<any>().pipe(switchMap(client => {
      const url = skipToken ? `${path}?$skiptoken=${skipToken}` : path;
      return client.api(url)
        .top(itemPerPage)
        .orderby(sortby + ' ' + orderby)
        .get().pipe(
          map(result => {
            let nextSkipToken = null;
            if ('@odata.nextLink' in result) {
              const tmp = new URL(result['@odata.nextLink']);
              nextSkipToken = tmp.searchParams.get('$skiptoken');
            }
            return {
              items: result['value'],
              skipToken: nextSkipToken
            };
          }));
    }));
  }

  public listChildrenByPath(sortby: string, orderby: string, fullPath: string, skipToken: string = null, itemPerPage: number = 200) {
    const path = `${fullPath}/children`;
    return this.driveItemLister(path, itemPerPage, skipToken, sortby, orderby);
  }

  public searchByPath(sortby: string, orderby: string, fullPath: string, skipToken: string = null, itemPerPage: number = 200) {
    const path = `${fullPath}`;
    return this.driveItemLister(path, itemPerPage, skipToken, sortby, orderby);
  }

  public getItemByPath(path: string) {
    return this.getAuthClient<DriveItem>().pipe(
      switchMap((client) => {
        return client.api(`${path}`).get();
      }));
  }

  public listRootItems(driveId: string, skipToken: string = null, itemPerPage: number = 200, sortby: string, orderby: string) {
    const path = `/drives/${driveId}/root/children`;
    return this.driveItemLister(path, itemPerPage, skipToken, sortby, orderby);
  }

  public listChilren(folderId: string, currentCount: number, groupId: string = null, itemPerPage: number = 200):
    Observable<{ value: DriveItem[], count: number }> {
    const qString = groupId ? `/groups/${groupId}` : '/me';
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`${qString}/drive/items/${folderId}/children`)
        .top(itemPerPage)
        .skip(currentCount)
        .count(true)
        .get().pipe(
          map(result => ({ value: result['value'], count: result['@odata.count'] })))
    ));
  }

  public bulkCopy(items: DriveItem[], parentRef: ItemReference): Observable<{ location: string, id: string }[]> {
    const requests = items.map((item) => ({
      url: `/drives/${item.parentReference.driveId}/items/${item.id}/copy`,
      method: 'POST',
      id: item.id,
      body: {
        parentReference: { id: parentRef.id, driveId: parentRef.driveId },
        '@microsoft.graph.conflictBehavior': 'rename'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }));
    return this.batchRequest(requests).pipe(
      map(value => value.responses.filter(res => res.headers && res.headers.Location)
        .map(res => ({ location: res.headers.Location, id: res.id }))
      ));
  }
  public copyItem(folderId: string, driveId: string, itemId: string, newName: string, groupId?: string): Observable<string> {
    const qString = groupId ? `/groups/${groupId}` : '/me';
    return this.getAuthClient<string>().pipe(switchMap(client =>
      client.api(`${qString}/drive/items/${itemId}/copy`)
        .post({
          parentReference: { driveId, id: folderId },
          name: newName,
          '@microsoft.graph.conflictBehavior': 'rename'
        }).pipe(
          map(result => result))
    ));
  }
  public retrieveCopyItemStatusReport(location: string): Observable<CopyingItemOperation> {
    return this.httpClient.get(location).pipe(map(result => result));
  }

  public bulkMove(items: DriveItem[], parentRef: ItemReference) {
    const requests = items.map((item) => ({
      url: `/drives/${item.parentReference.driveId}/items/${item.id}`,
      method: 'PATCH',
      id: item.id,
      body: {
        parentReference: { id: parentRef.id, driveId: parentRef.driveId },
        name: item.name,
        '@microsoft.graph.conflictBehavior': 'rename'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }));
    return this.batchRequest(requests);
  }
  public moveItem(folderId: string, itemId: string, newName: string, groupId?: string): Observable<DriveItem> {
    const qString = groupId ? `/groups/${groupId}` : '/me';
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`${qString}/drive/items/${itemId}`)
        .patch({ parentReference: { id: folderId }, name: newName }).pipe(
          map(result => result))
    ));
  }
  public bulkDelete(items: DriveItem[]) {
    const requests = items.map((item) => ({
      url: `/drives/${item.parentReference.driveId}/items/${item.id}`,
      method: 'DELETE',
      id: item.id,
      headers: {
        'Content-Type': 'application/json'
      }
    }));
    return this.batchRequest(requests);
  }
  public deleteItem(itemId: string, groupId?: string): Observable<any> {
    const qString = groupId ? `/groups/${groupId}` : '/me';
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`${qString}/drive/items/${itemId}`)
        .delete().pipe(
          map(result => result))
    ));
  }
  public createFolder(folderId: string, name: string, driveId?: string): Observable<DriveItem> {
    // const qString = groupId ? `/groups/${groupId}` : '/me';
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/drives/${driveId}/items/${folderId}/children`)
        .post({
          name, folder: {}, '@microsoft.graph.conflictBehavior': 'rename'
        }).pipe(
          map(result => result))
    ));
  }
  public renameItem(itemId: string, newName: string, driveId?: string): Observable<DriveItem> {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/drives/${driveId}/items/${itemId}`)
        .patch({ name: newName }).pipe(
          map(result => result))
    ));
  }
  public addNewFile(itemId: string, name: string, driveId: string): Observable<DriveItem> {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Drive/CreateEmptyFile',
      { driveId: driveId, fileName: name, parentFolderId: itemId }).pipe(
        switchMap(response => this.getItem(driveId, response.data)));
  }
  public getItem(driveId: string, itemId: string) {
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/drives/${driveId}/items/${itemId}`)
        .get().pipe(
          map((result: DriveItem) => result))
    ));
  }
  public createUploadSession(path: string, name: string) {
    return this.getAuthClient().pipe(mergeMap(client =>
      client.api(`${path}/${name}:/createUploadSession`)
        .post({
          item: {
            '@microsoft.graph.conflictBehavior': 'rename'
          }
        })
        .pipe(map((result: { uploadUrl: string }) => result.uploadUrl))
    ));
  }
  public uploadBytesToTheSession(file: File, uploadUrl: string, max: number, min: number) {
    const header = {};
    header['Content-Range'] = `bytes ${min}-${max}/${file.size}`;
    header['Content-Length'] = max - min + 1;

    return this.httpClient.put<UploadSession>(uploadUrl, file.slice(min, max + 1), { headers: header });
  }
  // public renameItem(itemId: string, newName: string, groupId?: string): Observable<DriveItem> {
  //   const qString = groupId ? `/groups/${groupId}` : '/me';
  //   return this.getAuthClient().switchMap(client =>
  //     client.api(`${qString}/drive/items/${itemId}`)
  //       .patch({ name: newName })
  //       .map(result => result)
  //   );
  // }
  // public getRootFolders(groupId?: string): Observable<DriveItem[]> {
  //   const qString = groupId ? `/groups/${groupId}` : '/me';
  //   const names = ['Spitfire_Documents', 'Spitfire_Downloads'];
  //   return this.getAuthClient().switchMap(client =>
  //     client.api(`${qString}/drive/root/children`)
  //       .filter(`name eq ${names[0]} or name eq ${names[1]}`)
  //       .get()
  //       .map(result => <DriveItem[]>result['value'])
  //   ).switchMap(value => {
  //     if (value.length === 0) {
  //       const requests = names.map((name) => ({
  //         id: name,
  //         method: 'POST',
  //         url: `${qString}/drive/root/children`,
  //         body: { name, folder: {} },
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }));
  //       return this.splitedBatch<DriveItem>(requests).map(response => response.responses.map(val => val.body));
  //     } else if (value.length === 1) {
  //       return this.createRootFolder(value[0].name === names[0] ? names[1] : names[0], groupId)
  //         .map(val => value.concat([val]));
  //     }
  //     return of(value);
  //   });
  // }

  public createRootFolder(name: string, groupId?: string): Observable<DriveItem> {
    const qString = groupId ? `/groups/${groupId}` : '/me';
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`${qString}/drive/root/children`)
        .post({ name, folder: {} }).pipe(
          map(result => result))
    ));
  }

  public copyTemplateFileToDrive(appId: number, files: string[], driveId: string, parentFolderId: string) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Drive/CopyTemplateFileToDrive',
      { appId, files, driveId, parentFolderId }).pipe(
        map(response => response.data));
  }

}
