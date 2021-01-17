import { FileHistory } from './../../file-history-core';
import { catchError, switchMap, map } from 'rxjs/operators';
import {
    CreateItemAttachmentReqest, CreateItemAttachmentResponse,
    CreateFileAttachmentReqest,
    AttachmentWrapper
} from './../models/interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, from } from 'rxjs';
import * as _ from 'lodash';
import { AuthInfoStateService } from '../../auth';
import { Message, Attachment, Drive, DriveItem } from '../../core/lib/microsoft-graph';
import { MsgraphClientBase, AppConfig, ApiClientWrapper, DriveMailIntegration, ServiceEndpointConfig } from '../../core';
import { Mime } from '../../utils/mime-message';
import { SemaphoresService } from '../../shared';
import { getMessageString } from '../../utils/organizer';

declare var gapi;
@Injectable()
export class ComposeMailService {
    private msGraphClient: MsgraphClientBase = null;

    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient, private configs: ServiceEndpointConfig,
        private appConfig: AppConfig, private driveService: DriveMailIntegration, private semaphoresService: SemaphoresService) {

    }

    private getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }

    private getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }

    public deleteMailItem(id: string): Observable<boolean> {
        if (this.authInfo.isGoogle()) {
            return from(this.deleteGmail(id)).pipe(map((res: any) => res));
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}`)
                .delete().pipe(map(result => {
                    return true;
                }))
        ));
    }
    public deleteGmail(id: string) {
        return new Promise((resolve, reject) => {
            const request = gapi.client.gmail.users.drafts.delete({
                'userId': 'me',
                'id': id
            });
            return request.execute(resp => {
                if (resp) {
                    resolve(true);

                } else {
                    reject('');
                }
            });

        });
    }

    public updateMailItem(id: string, message: Message, attachments: AttachmentWrapper[], isSuppressErrors?: boolean): Observable<Message> {
        if (this.authInfo.isGoogle()) {
            return from(this.updateGmail({
                ...message, attachments: attachments.map(val => val.attachment)
            })).pipe(map((res: any) => res));
        }
        const header = {};
        if (isSuppressErrors) {
            header['X-dps'] = 'suppressErrors';
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}`)
                .patch(message, header).pipe(map(result => {
                    return result;
                }))
        ));
    }
    public updateGmail(email?: Message) {
        return new Promise((resolve, reject) => {

            const encodedEmail = btoa(Mime().toMimeTxt(email)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            const request = gapi.client.gmail.users.drafts.update({
                'userId': 'me',
                'id': email.id,
                'resource': {
                    'message': {
                        'id': email.id,
                        'raw': encodedEmail
                    }
                }
            });
            return request.execute(resp => {
                if (resp) {
                    resolve(resp);

                } else {
                    reject('');
                }
            });

        });
    }

    public createItem(message?: Message): Observable<Message> {
        if (this.authInfo.isGoogle()) {
            return from(this.createGmail(message)).pipe(map((res: any) => res));
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages`)
                .post(message ? message : {}).pipe(map(result => {
                    return result;
                }))
        ));
    }
    public createGmail(email?: Message) {
        return new Promise((resolve, reject) => {

            const encodedEmail = btoa(getMessageString(email)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            const request = gapi.client.gmail.users.drafts.create({
                'userId': 'me',
                'resource': {
                    'message': {
                        'raw': encodedEmail
                    }
                }
            });
            return request.execute(resp => {
                if (resp) {
                    resolve({ ...email, id: resp.id });

                } else {
                    reject('');
                }
            });

        });
    }
    public sendDraftItem(id: string): Observable<boolean> {
        if (this.authInfo.isGoogle()) {
            return from(this.sendDraftGmail(id)).pipe(map((res: any) => res));
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}/send`)
                .post(null).pipe(map(result => {
                    return true;
                }))
        ));
    }
    public sendDraftGmail(id: string) {
        return new Promise((resolve, reject) => {
            const request = gapi.client.gmail.users.drafts.send({
                'userId': 'me',
                'id': id,
                'resource': {
                    'id': id
                }
            });
            return request.execute(resp => {
                if (resp) {
                    resolve(true);

                } else {
                    reject('');
                }
            });

        });
    }
    public sendNewItem(message: Message, saveToSentItems = true): Observable<boolean> {
        if (this.authInfo.isGoogle()) {
            return from(this.sendNewGmail(message)).pipe(map((res: any) => res));
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/sendMail`)
                .post({ message: message, saveToSentItems }).pipe(map(result => {
                    return true;
                }))
        ));
    }
    public sendNewGmail(email: Message) {
        return new Promise((resolve, reject) => {

            const encodedEmail = btoa(getMessageString(email)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            const request = gapi.client.gmail.users.messages.send({
                'userId': 'me',
                'resource': {
                    'message': {
                        'raw': encodedEmail
                    }
                }
            });
            return request.execute(resp => {
                if (resp) {
                    resolve(true);

                } else {
                    reject('');
                }
            });

        });
    }
    public getAttachment(itemId: string, attachmentId: string): Observable<any> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${itemId}/attachments/${attachmentId}`)
                .get().pipe(map(result => {
                    return result;
                }))
        ));
    }
    public deleteAttachment(itemId: string, attachmentId: string): Observable<boolean> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${itemId}/attachments/${attachmentId}`)
                .delete().pipe(map(result => {
                    return true;
                }))
        ));
    }
    public addAttachment(itemId: string, attachment: Attachment,
        uid: string,
        attachments: AttachmentWrapper[], message: Message): Observable<Attachment> {
        if (this.authInfo.isGoogle()) {
            return from(this.updateGmail({
                ...message, attachments: attachments.map(val => val.attachment)
            })).pipe(map((res: any) => ({ ...attachment, id: uid })));
        }
        return this.getAuthClient<Attachment>().pipe(switchMap(
            client => client.api(`/me/messages/${itemId}/attachments`)
                .post(attachment).pipe(map(result => {
                    return result;
                }))
        ));
    }

    public addItemAttachment(itemId: string, attachments: CreateItemAttachmentReqest[]): Observable<CreateItemAttachmentResponse> {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/CreateItemAttachment',
            { ParentItemId: { Id: itemId, ChangeKey: null }, Attachments: attachments, TimeZone: '' }).pipe(
                map(response => response));
    }
    public addDiaryAttachment(itemId: string, diary: FileHistory): Observable<string> {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/DPSDocumentAttachToCreatedMail',
            {
                id: itemId,
                asPDF: false,
                dpsFileCredentials: [{ diaryId: diary.diary_UID, password: null }],
                sendSilently: false,
            }).pipe(
                map(response => response.data.id));
    }
    public addDriveAttachment(itemId: string, attachment): Observable<CreateItemAttachmentResponse> {
        return this.driveService.attachDriveFilesToMail(attachment.driveId, [attachment.itemId], itemId);
    }
    public addFileAttachment(itemId: string, attachments: CreateFileAttachmentReqest[], uid: string,
        _attachments: AttachmentWrapper[], message: Message): Observable<CreateItemAttachmentResponse> {
        if (this.authInfo.isGoogle()) {
            return from(this.updateGmail({
                ...message, attachments: _attachments.map(val => val.attachment)
            })).pipe(map((res: any) => (<any>{ data: [{ attachmentId: uid }] })));
        }
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/CreateAttachment',
            { ParentItemId: { Id: itemId, ChangeKey: null }, Attachments: attachments, TimeZone: '' }).pipe(
                map(response => response));
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
                return this.getPersonalFolder(name, drive.id).pipe(
                    switchMap((item: DriveItem) => this.getDownloadFolder(name, item.id, drive.id)));
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
            return throwError(error);
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
            return throwError(error);
        }));
    }
}
