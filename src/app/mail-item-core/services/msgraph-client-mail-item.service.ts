
import { switchMap, catchError, map } from 'rxjs/operators';
import { CreateReplyForwardResponse } from '../../compose-mail-core/models/interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, throwError as _throw, from as fromPromise } from 'rxjs';
import * as _ from 'lodash';
import {
    Message as GraphMessage, MailFolder, Event, Drive, DriveItem,
    EventMessage, EventMessageRequest, OutlookItem, ItemAttachment
} from '../../core/lib/microsoft-graph';
import { AuthInfoStateService } from '../../auth';
import { ReplyForwardType, Draft } from '../models/interface';
import { MsgraphClientBase, AppConfig, ApiClientWrapper, DriveMailIntegration, MgGraphBatchRequest } from '../../core';
import { MgGraphBatchResponse } from '../models/interface';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { CreateItemAttachmentResponse, CreateItemAttachmentReqest } from '../../compose-mail-core/models/interface';
import { Mime } from '../../utils/mime-message';
import { TimezonePipe, SemaphoresService } from '../../shared';
import { DatePipe } from '@angular/common';
import { WebViewService } from '../../azure-storage';

declare var gapi;

@Injectable()
export class MsgraphClientMailItemService {

    private msGraphClient: MsgraphClientBase = null;

    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient, private configs: ServiceEndpointConfig,
        private appConfig: AppConfig, private driveService: DriveMailIntegration, private timezonePipe: TimezonePipe,
        private datePipe: DatePipe, private semaphoresService: SemaphoresService, private webViewService: WebViewService) {
    }

    private getOrCreateClient() {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient;
    }

    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        return this.getOrCreateClient().getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }
    public getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
        return this.getOrCreateClient().getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }
    public splitedBatch<T>(requests): Observable<MgGraphBatchResponse<T>> {
        return this.getOrCreateClient().splitedBatch<T>(requests, this.semaphoresService.getMsgraphSemaphoree());
    }
    public splitedBatchBeta<T>(requests): Observable<MgGraphBatchResponse<T>> {
        return this.getOrCreateClient().splitedBatchBeta<T>(requests, this.semaphoresService.getMsgraphBetaSemaphore());
    }

    // public createAttachemntRawContentPath(itemId: string, attId: string) {
    //   return this.getOrCreateClient().createAttachemntRawContentPath(itemId, attId)
    //     .pipe(map(path => this.appConfig.inlineAttachmentBase + path));
    // }
    // ------------ item operations --------------------
    public batchRequest<T>(requests: MgGraphBatchRequest[]) {
        return this.splitedBatch<T>(requests);
    }
    public batchRequestBeta<T>(requests: MgGraphBatchRequest[]) {
        return this.splitedBatchBeta<T>(requests);
    }

    // public batchAndRetryRequest<T>(requests: any) {
    //     return this.splitedBatchAndRetry<T>(requests);
    // }

    // private splitedBatchAndRetry<T>(requests: MgGraphBatchRequest[]) {
    //     const maxBatchSize = 4;
    //     return from(_.range(0, requests.length, maxBatchSize)).pipe(
    //         map((start: number) => {
    //             const currentBatch = requests.slice(start, start + maxBatchSize);
    //             return this.getAuthClient<MgGraphBatchResponse<T>>().pipe(mergeMap(client =>
    //                 client.api(`/$batch`)
    //                     .post({ requests: currentBatch }).pipe(
    //                         map(result => {
    //                             return result;
    //                         }),
    //                         catchError((errors: HttpErrorResponse) => {
    //                             const result: MgGraphBatchResponse<T> = {
    //                                 responses: currentBatch.map((req) => {
    //                                     return { id: req.id, status: errors.status, body: errors.error };
    //                                 })
    //                             };
    //                             return of((result));
    //                         }))
    //             ));
    //         }),
    //         mergeAll(3),
    //         reduce((responses: MgGraphBatchResponseItem<T>[], current: any) => responses.concat(current.responses), []),
    //         mergeMap(responses => {
    //             const errors = responses.filter((result: any) => (result.status < 200 || result.status >= 300)
    //                 && !([400, 404, 403, 409].includes(result.status) || result.body.error.code === 'ErrorMoveCopyFailed'));
    //             if (errors.length > 0) {
    //                 const reqHash = requests.reduce((hashMap, req) => ({ ...hashMap, ...{ [req.id]: req } }), {});

    //                 return this.getAuthClient<MgGraphBatchResponse<T>>().pipe(map(client => {
    //                     return errors.filter((_error) => !!_error.id)
    //                         .map((_error) => ({ req: reqHash[_error.id], client, _error }))
    //                         .filter(({ req }) => !!req.method && !!req.id);
    //                 }),
    //                     mergeMap(bulk => from(bulk)),
    //                     map((data: { req: any, client: any, _error: any }) => {
    //                         return data.client.api(data.req.url)
    //                             .request(data.req.method, data.req.body ? data.req.body : null)
    //                             .map((normalResponse) =>
    //                                 ({ id: data.req.id, status: 200, body: normalResponse })
    //                             )
    //                             .catch((err) => {
    //                                 return of(data._error);
    //                             });
    //                     }),
    //                     mergeAll(3),
    //                     reduce((allResponses: any, current) => allResponses.concat([current]), []),
    //                     map((allResponses) => [...allResponses,
    //                     ...responses.filter((result) => result.status >= 200 && result.status < 300)]));
    //             } else {
    //                 return of(responses);
    //             }
    //         }),
    //         map((responses) =>
    //             ({ responses: responses } as MgGraphBatchResponse<T>)
    //         ));
    // }

    public getOutlookJournalStatus(ids: string[]) {
        if (ids && ids.length > 0) {
            return this.httpClient.post<{ body: { items: { diaryId: number, emailId: string }[] } }>
                (`${this.appConfig.apiv3DocumentHandler}/OutlookJournal/GetStatus`, { body: { mailSmtpIds: ids } })
                .pipe(map(responce => responce.body.items));
        }
        return of([]);
    }

    public getEventMessageEvent(message: EventMessage): Observable<Event> {
        if (message.event && !message.event.id) {
            const header = {};
            header['X-dps'] = 'suppressErrors';

            return this.getBetaApiClient().pipe(switchMap(client =>
                client.api(`/me/messages/${message.id}`)
                    .get(header).pipe(map<any, Event>((result: EventMessageRequest) => {
                        if (result) {
                            return {
                                start: result.startDateTime,
                                end: result.endDateTime,
                                location: result.location,
                                recurrence: result.recurrence,
                                type: result.type,
                                responseRequested: result.responseRequested
                            };
                        }
                        return {};
                    }))
            ));
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/events/${message.event.id}`)
                .select(['id', 'attendees', 'isOrganizer', 'type', 'start',
                    'end', 'sensitivity', 'recurrence', 'responseRequested', 'location'])
                .get().pipe(map(result => {
                    return result;
                }))
        ));
    }
    public deleteEventMessageEvent(id: string) {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}`)
                .delete().pipe(map(result => {
                    return result;
                }))
        ));
    }
    public deleteMailItem(id: string, owner: string): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/messages/${id}`)
                .delete().pipe(map(result => {
                    return true;
                }))
        ));
    }
    public moveMailItem(owner: string, itemId: string, folderId: string): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/messages/${itemId}/move`)
                .post({ DestinationId: folderId }).pipe(map(result => {
                    return true;
                }))
        ));
    }
    public updateMailItem(owner: string, id: string, message: GraphMessage, isSuppressErrors?: boolean): Observable<boolean> {
        const header = {};
        if (isSuppressErrors) {
            header['X-dps'] = 'suppressErrors';
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/messages/${id}`)
                .patch(message, header).pipe(map(result => {
                    return true;
                }))
        ));
    }

    // ------------ item operations --------------------

    public getMailItem(owner: string, id: string, isSuppressErrors?: boolean): Observable<GraphMessage> {
        if (this.authInfo.isGoogle()) {
            return fromPromise(this.getDraftGmail(id)).pipe(map((res: any) => res));
        }
        const header = {};
        if (isSuppressErrors) {
            header['X-dps'] = 'suppressErrors';
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/messages/${id}`)
                .expand([
                    `Microsoft.Graph.EventMessage/event
          ($select=id,attendees,isOrganizer,type,start,end,sensitivity,recurrence,responseRequested,location)`,
                    `attachments($select=microsoft.graph.fileAttachment/contentId,id,isInline,contentType,name,size)`,
                    `singleValueExtendedProperties($filter=id eq 'Integer 0x1080' or id eq 'SystemTime 0x1082')`
                ])
                .get(header).pipe(map(result => result))
        ));
    }
    public getDraftGmail(id: string): Promise<GraphMessage> {
        return new Promise((resolve, reject) => {
            const request = gapi.client.gmail.users.drafts.get({
                'userId': 'me',
                'id': id,
                'format': 'raw'
            });
            return request.execute((resp: Draft) => {
                if (resp && resp.id) {
                    const object = Mime().toMimeObj(atob(resp.message.raw.replace(/-/g, '+').replace(/_/g, '/')));
                    resolve({ ...object, id: resp.id });
                    // this.getMessagefromGmail(id, resp.message)
                    // Base64().decode(resp.message.raw)

                } else {
                    reject(resp);
                }
            });

        });
    }

    public getItemAttachment(owner: string, itemId: string, attachmentId: string): Observable<ItemAttachment> {
        return this.webViewService.getMailAttachementWebView(owner, itemId, attachmentId, 'ItemAttachment.eml').pipe(
            map((item: OutlookItem) => ({
                item,
                id: attachmentId,
            }))
        );
    }


    public createItem(message?: GraphMessage): Observable<GraphMessage> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages`)
                .post(message ? message : {}).pipe(map(result => {
                    return result;
                }))
        ));
    }
    public addItemAttachment(itemId: string, attachments: CreateItemAttachmentReqest[]): Observable<CreateItemAttachmentResponse> {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/CreateItemAttachment',
            { ParentItemId: { Id: itemId, ChangeKey: null }, Attachments: attachments, TimeZone: '' }).pipe(
                map(response => response));
    }
    public sendDraftItem(id: string): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}/send`)
                .post({}).pipe(map(result => {
                    return true;
                }))
        ));
    }
    public sendNewItem(message: GraphMessage, saveToSentItems = true): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/sendMail`)
                .post({ message: message, saveToSentItems }).pipe(map(result => {
                    return true;
                }))
        ));
    }
    public createReplyForward(id: string, type: ReplyForwardType, userTimeZone: string,
        message?: GraphMessage, comment?: string): Observable<GraphMessage> {
        return this.getBetaApiClient<GraphMessage>().pipe(switchMap(client =>
            client.api(`/me/messages/${id}/${type}`)
                .post({ message: message ? message : {}, comment: comment }).pipe(
                    map(result => {
                        const body = { ...result.body, content: this.changeTimezoneRplyFwdMsg(result.body.content, userTimeZone) };
                        return {
                            ...result,
                            body: body
                        };
                    })
                )
        ));
    }
    public createReplyForwardForItemAttachement(id: string, type: ReplyForwardType, message?: GraphMessage,
        comment?: string): Observable<CreateReplyForwardResponse> {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/CreateReplyForward',
            { Type: type, Id: id, Body: comment, BodyType: 'html' }).pipe(
                map(response => response));
    }
    public createReply(id: string, message?: GraphMessage, comment?: string): Observable<GraphMessage> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}/createReply`)
                .post({ message: message ? message : {}, comment: comment }).pipe(map(result => {
                    return result;
                }))
        ));
    }
    public createReplyAll(id: string, message?: GraphMessage, comment?: string): Observable<GraphMessage> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}/createReplyAll`)
                .post({ message: message ? message : {}, comment: comment }).pipe(map(result => {
                    return result;
                }))
        ));
    }
    public createForward(id: string, message?: GraphMessage, comment?: string): Observable<GraphMessage> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}/createForward`)
                .post({ message: message ? message : {}, comment: comment }).pipe(map(result => {
                    return result;
                }))
        ));
    }

    // ------------ attachments operations --------------------

    public getAttachment(itemId: string, attachmentId: string): Observable<any> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${itemId}/attachments/${attachmentId}`)
                .get().pipe(map(result => {
                    return result;
                }))
        ));
    }

    // ---------------- event operation -------------------

    public responseEvent(id: string, comment: string, sendResponse: boolean, type: string): Observable<boolean> {
        return this.getAuthClient<string>().pipe(switchMap(client =>
            client.api(`/me/events/${id}/${type}`)
                .post({ comment: sendResponse ? (comment ? comment : '') : null, sendResponse: sendResponse },
                    { 'Content-Type': 'application/json' }, 'text').pipe(
                        map(result => {
                            return true;
                        }))
        ));
    }
    public acceptEvent(id: string, comment: string, sendResponse: boolean): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}/accept`)
                .post({ comment: comment ? comment : '', sendResponse: sendResponse }, { 'Content-Type': 'application/json' }, 'text').pipe(
                    map(result => {
                        return true;
                    }))
        ));
    }

    public declineEvent(id: string, comment: string, sendResponse: boolean): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}/decline`)
                .post({ comment: comment ? comment : '', sendResponse: sendResponse }, { 'Content-Type': 'application/json' }, 'text').pipe(
                    map(result => {
                        return true;
                    }))
        ));
    }

    public tentativelyAcceptEvent(id: string, comment: string, sendResponse: boolean): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}/tentativelyAccept`)
                .post({ comment: comment ? comment : '', sendResponse: sendResponse }, { 'Content-Type': 'application/json' }, 'text').pipe(
                    map(result => {
                        return true;
                    }))
        ));
    }

    public getMailFolderByParentId(owner: string, id: string): Observable<MailFolder> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/${owner === 'me' ? owner : ('users/' + owner)}/mailFolders/${id}`)
                .get().pipe(map(result => {
                    return result;
                }))));
    }
    public downloadMailAttachmentToOneDrive(fileId: string, name: string): Observable<any> {
        return this.getSharedPersonalDownloadFolder(name).pipe(switchMap(item => {
            return this.driveService.downloadMailAttachmentToOneDrive(item.parentReference.driveId, item.id, [fileId]);
        }));
    }
    public getSharedPersonalDownloadFolder(name: string): Observable<DriveItem> {
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
                return this.getPersonalFolder(name, drive.id)
                    .pipe(switchMap((item: DriveItem) => this.getDownloadFolder(name, item.id, drive.id)));
            }
            return of(null);
        }));
    }
    private getDownloadFolder(name: string, itemId: string, driveId: string) {
        return this.getAuthClient().pipe(switchMap((client) => {
            return client.api(`/drives/${driveId}/root:/${name}/Downloads`).get().pipe(map((data) => {
                return data;
            }));
        }), catchError((error) => {
            try {
                if (error.error.error.code === 'itemNotFound') {
                    return this.getAuthClient().pipe(switchMap((client) => {
                        return client.api(`/drives/${driveId}/items/${itemId}/children`).post({ 'name': 'Downloads', 'folder': {} });
                    }));
                }
            } catch (e) {
            }
            return _throw(error);
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

    private changeTimezoneRplyFwdMsg(body: string, timeZone: string) {
        const div = document.createElement('div');
        let temp = '';
        div.innerHTML = body;
        div.querySelectorAll('div#divRplyFwdMsg').forEach(node => {
            const fonts = node.getElementsByTagName('font');
            if (!temp && fonts.length === 1) {
                fonts[0].childNodes.forEach((val, index) => {
                    if (!temp && val.textContent === 'Sent:') {
                        temp = fonts[0].childNodes[index + 1].textContent.trim() + ' UTC';
                        if (isNaN(Date.parse(temp))) {
                            temp = '';
                        } else {
                            fonts[0].childNodes[index + 1].textContent = this.datePipe.transform(this.timezonePipe
                                .transform(new Date(temp).toISOString(), timeZone), ' EEEE, MMMM d, y h:mm:ss a');
                        }
                    }
                });
            }
        });
        temp = div.innerHTML;
        div.remove();
        return temp;
    }
}

