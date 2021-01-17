
import { catchError, switchMap, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { from, Observable, of, throwError as _throw } from 'rxjs';
import * as _ from 'lodash';

import { MsgraphClientBase, AppConfig, ApiClientWrapper, DriveMailIntegration, MgGraphBatchRequest } from '../../core';
import { AuthInfoStateService } from '../../auth';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { MgGraphBatchResponse } from '../../core/lib/graph-client-interfaces';
import { CalendarGroup, Calendar, Event, Message, FileAttachment, Drive, DriveItem, EmailAddress } from '../../core/lib/microsoft-graph';
import { ReplyForwardType } from '../../mail-item-core';
import { CreateReplyForwardResponse } from '../../compose-mail-core/models/interface';
import { CreateFileAttachmentReqest, CreateFileAttachmentResponse } from '../models/interfaces';
import { SemaphoresService } from '../../shared';

@Injectable()
export class MSGraphCalendarClientService {

    private msGraphClient: MsgraphClientBase = null;

    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient, private configs: ServiceEndpointConfig,
        private appConfig: AppConfig, private driveService: DriveMailIntegration, private semaphoresService: SemaphoresService) {
    }

    private getOrCreateClient() {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient;
    }
    private getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        return this.getOrCreateClient().getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }
    private getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
        return this.getOrCreateClient().getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }
    private batchRequest<T>(requests: MgGraphBatchRequest[]): Observable<MgGraphBatchResponse<T>> {
        return this.getOrCreateClient().batchRequest<T>(requests, this.semaphoresService.getMsgraphSemaphoree());
    }

    public listCalendarGroups() {
        return this.getBetaApiClient<{ value: CalendarGroup[] }>().pipe(
            switchMap(client => client.api('/me/calendarGroups')
                .top(999)
                .get().pipe(
                    map(result => {
                        return result.value;
                    }))
            ));
    }
    public listCalendars() {
        return this.getBetaApiClient<{ value: Calendar[] }>().pipe(
            switchMap(client => client.api('/me/calendars')
                .top(999)
                .expand([
                    `singleValueExtendedProperties($filter=
                         id eq 'Binary 0x6850' or
                         id eq 'Integer 0x6852' or
                         id eq 'Integer 0x6849' or
                         id eq 'Integer 0x6852')`
                ])
                .get().pipe(
                    map(result => {
                        return result.value;
                    }))
            ));
    }

    private getCalendarsByGroupIds(itemPerReq: number, calendarGroups: CalendarGroup[]) {
        const requests = calendarGroups.map<MgGraphBatchRequest>((group) => ({
            id: group.id,
            method: 'GET',
            url: `/me/calendargroups/${group.id}/calendars?$top=999`
        }));

        return this.batchRequest<{ value: Calendar[] }>(requests).pipe(map(
            (result) => {
                return { calenders: result.responses, calendarGroups: calendarGroups };
            }
        ));
    }

    public getAllcalendarFolders() {
        return this.getBetaApiClient().pipe(
            switchMap(client =>
                client.api('/me/calendarGroups')
                    .top(50)
                    .count(true)
                    .get().pipe(map((result: any) => (result.value)))
            ),
            mergeMap((calendarGroups: CalendarGroup[]) => {
                return this.getCalendarsByGroupIds(100, calendarGroups);
            }));
    }

    public updateCalendarGroup(id: string, displayName: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/calendarGroups/${id}`)
                .patch({ name: displayName }).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
        ));
    }

    public createCalendarGroup(dispalyName: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`me/calendarGroups`)
                .post({ name: dispalyName }).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
        ));
    }

    public deleteCalendarGroup(id: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/calendarGroups/${id}`)
                .delete().pipe(map(result => {
                    return true;
                }))
        ));
    }

    public createCalendar(groupId: string, dispalyName: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`me/calendarGroups/${groupId}/calendars`)
                .post({ name: dispalyName }).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
        ));
    }

    public updateCalendar(id: string, update) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/calendars/${id}`)
                .patch(update).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
        ));
    }

    public deleteCalendar(id: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/calendars/${id}`)
                .delete().pipe(map(result => {
                    return true;
                }))
        ));
    }

    public loadCalendarEvent(calendarId: string, start: string, end: string, timeZone: string) {
        const headers = {};
        headers['Prefer'] = `outlook.timezone="${timeZone}"`;
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/calendars/${calendarId}/calendarView?startDateTime=${start}&endDateTime=${end}`)
                .top(500)
                .count(true)
                .expand([
                    `attachments($select=microsoft.graph.fileAttachment/contentId,id,isInline,contentType,name,size)`,
                ])
                .get(headers).pipe(map((result: any) => {
                    return result.value;
                }))
        ));
    }

    public loadSingleCalendarEvent(eventId: string, timeZone: string) {
        const headers = {};
        headers['Prefer'] = `outlook.timezone="${timeZone}"`;
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/events/${eventId}`)
                .expand([
                    `attachments($select=microsoft.graph.fileAttachment/contentId,id,isInline,contentType,name,size)`,
                ])
                .get(headers).pipe(map((result: any) => {
                    return result;
                }))
        ));
    }

    public createEvent(calenderId: string, event: Event) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/calendars/${calenderId}/events`)
                .post(event).pipe(map(result => {
                    return result;
                }))
        ));
    }

    public updateEvet(id: string, event: Event) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}`)
                .patch(event).pipe(map(result => {
                    return result;
                }))
        ));
    }

    public deleteEvent(id: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}`)
                .delete().pipe(map(result => {
                    return result;
                }))
        ));
    }

    public uploadAttachment(eventId: string, attachment: FileAttachment) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/events/${eventId}/attachments`)
                .post(attachment).pipe(map(result => {
                    return result;
                }))));
    }
    public addDriveAttachment(itemId: string, attachment): Observable<any> {
        return this.driveService.attachDriveFilesToMail(attachment.driveId, [attachment.itemId], itemId);
    }

    public addFileAttachment(itemId: string, attachments: CreateFileAttachmentReqest[]): Observable<CreateFileAttachmentResponse> {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/CreateAttachment',
            { ParentItemId: { Id: itemId, ChangeKey: null }, Attachments: attachments, TimeZone: '' }).pipe(
                map(response => response));
    }

    public deleteAttachment(eventId: string, attachmentId) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/events/${eventId}/attachments/${attachmentId}`)
                .delete().pipe(map(result => {
                    return result;
                }))
        ));
    }

    public responseEvent(id: string, comment: string, sendResponse: boolean, type: string): Observable<boolean> {
        return this.getBetaApiClient<string>().pipe(switchMap(client =>
            client.api(`/me/events/${id}/${type}`)
                .post({ comment: sendResponse ? (comment ? comment : '') : null, sendResponse: sendResponse },
                    { 'Content-Type': 'application/json' }, 'text').pipe(
                        map(result => {
                            return true;
                        }))
        ));
    }
    public getRooms() {
        return this.getBetaApiClient<{ value: EmailAddress[] }>().pipe(
            switchMap(client => client.api('/me/findRooms')
                .get().pipe(map(result => result.value))
            )
        );
    }
    public createReplyForward(id: string, changeKey: string, type: ReplyForwardType, message?: Message,
        comment?: string): Observable<CreateReplyForwardResponse> {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/CreateReplyForward',
            { Type: type, Id: id, ChangeKey: changeKey, Body: comment, BodyType: 'html' }).pipe(
                map(response => response));
    }
    public downloadMailAttachmentToOneDrive(fileId: string, name: string): Observable<any> {
        return this.getSharedPersonalDownloadFolder(name).pipe(switchMap(item => {
            return this.driveService.downloadMailAttachmentToOneDrive(item.parentReference.driveId, item.id, [fileId]);
        }));
    }

    public getSharedPersonalDownloadFolder(name: string): Observable<DriveItem> {
        return this.getBetaApiClient().pipe(switchMap((client) => {
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
                return this.getPersonalFolder(name, drive.id).pipe(
                    switchMap((item: DriveItem) => this.getDownloadFolder(name, item.id, drive.id)));
            }
            return of(null);
        }));
    }

    private getDownloadFolder(name: string, itemId: string, driveId: string) {
        return this.getBetaApiClient().pipe(switchMap((client) => {
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
        return this.getBetaApiClient().pipe(switchMap((client) => {
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




}

