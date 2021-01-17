
import { scan, switchMap, map, mergeAll, reduce } from 'rxjs/operators';
import { Injectable, NgZone, Inject } from '@angular/core';
import { HttpClient, XhrFactory } from '@angular/common/http';
import { Observable, timer, from, of } from 'rxjs';










import { OutlookClientBase, ApiClientWrapper } from '../../core';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { AuthInfoStateService } from '../../auth';
import { StreamingConnection } from './streaming-connection';
import { GenericNotification, NotificationGroups } from '../../core/notifications';
import { Reminder } from '../../core/lib/microsoft-graph';
import { SemaphoresService } from '../../shared';

@Injectable()
export class NotificationClientService {
  private outlookClient: OutlookClientBase;
  constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient, private xhrFactory: XhrFactory,
    private zone: NgZone, private configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService) {
  }
  private getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    if (!this.outlookClient) {
      this.outlookClient = new OutlookClientBase(this.authInfo, this.httpClient, this.configs.getOutlookApiConfig());
    }
    return this.outlookClient.getAuthClient(this.semaphoresService.getOutlookSemaphore());
  }
  get config() {
    return this.configs.getOutlookApiConfig();
  }

  private getApibaseUrl() {
    return `${this.config.baseUrl}/${this.config.defaultVersion}`;
  }

  subscribeToMailNotification() {
    return this.getAuthClient<{ Id: string }>().pipe(switchMap(client => client.api('/me/subscriptions').post({
      '@odata.type': '#Microsoft.OutlookServices.StreamingSubscription',
      Resource: `me/messages?$select=Id,ParentFolderId, IsDraft, IsRead, Flag`,
      ChangeType: 'Created,Updated,Deleted'
    })), map((data) =>
      ({ kind: NotificationGroups.AllMail, id: data.Id })));
  }

  subscribeToInboxMailNotification() {
    return this.getAuthClient<{ Id: string }>().pipe(switchMap(client => client.api('/me/subscriptions').post({
      '@odata.type': '#Microsoft.OutlookServices.StreamingSubscription',
      Resource: `me/mailfolders('inbox')/messages?$select=Id,ParentFolderId,Subject,From,IsDraft,
      IsRead,Flag,LastModifiedDateTime,ReceivedDateTime,BodyPreview
      &$expand=SingleValueExtendedProperties($filter=PropertyId eq 'Integer 0x1080')`,
      ChangeType: 'Created,Updated,Deleted'
    })), map((data) =>
      ({ kind: NotificationGroups.Inbox, id: data.Id })));
  }

  // subscribeToNewMailNotification() {
  //   return this.getAuthClient<{ Id: string }>().switchMap(client => client.api('/me/subscriptions').post({
  //     '@odata.type': '#Microsoft.OutlookServices.StreamingSubscription',
  //     Resource: `me/mailfolders('inbox')/messages?$select=Id,ParentFolderId,Subject,From,IsDraft,IsRead,Flag,ReceivedDateTime,
  //                 BodyPreview&filter=SingleValueExtendedProperties/
  //                  Any(ep: ep/PropertyId eq 'Integer 0x1080' and ep/Value eq '0xFFFFFFFF')`,
  //     ChangeType: 'Created'
  //   })).map((data) =>
  //     ({ kind: NotificationGroups.NewMail, id: data.Id }));
  // }

  getNotifications(subsid: string[], isReconnect = false): Observable<GenericNotification> {
    return new StreamingConnection(this.getApibaseUrl(),
      () => this.authInfo.getOutlookApiToken(), subsid, this.xhrFactory, this.zone, isReconnect).connect().pipe(
        map<any, GenericNotification>((a) => a));
  }

  getAllSubscription() {
    return of(this.subscribeToMailNotification(),
      this.subscribeToInboxMailNotification()).pipe(
        mergeAll(1),
        reduce((accu, current: any) => accu.concat(current), []));
  }

  startNotification(isReconnect = false) {
    return this.getAllSubscription().pipe(switchMap(((allSubs: any) =>
      this.getNotifications(allSubs.map(sub => sub.id), isReconnect).pipe(
        scan((info: any, event: GenericNotification) => ({ ...info, event }),
          {
            groups: allSubs.reduce((accu, current) =>
              ({ ...accu, ...{ [current.id]: current.kind } }), {}),
            event: null
          }
        ),
        map(({ groups, event }: any) => ({
          ...event,
          Group: groups[event.SubscriptionId] ? groups[event.SubscriptionId] : NotificationGroups.Internal
        })))
    )));
  }

}
