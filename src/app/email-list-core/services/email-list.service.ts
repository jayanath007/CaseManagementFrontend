
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiClientWrapper, AppConfig, MsgraphClientBase, ServiceEndpointConfig } from '../../core';
import { MatterInfo } from '../../add-note-core';
import { AzureSasTokenResponse } from '../../azure-storage';
import { from, Observable } from 'rxjs';
import { SemaphoresService } from '../../shared';
import { AuthInfoStateService } from '../../auth';
import { Message } from '../../core/lib/microsoft-graph';
import { getMessageString } from '../../utils/organizer';
declare var gapi;
interface GetFileShareTokenResponce {
    mailSubjectPrefix: string;
    transferTokenOutputs: AzureSasTokenResponse[];
}

interface ShareFilesResponce<T> {
    data: T;
    hubName: string;
    instanceId: string;
}

@Injectable()
export class EmailListService {

    private msGraphClient: MsgraphClientBase = null;

    constructor(private authInfo: AuthInfoStateService, private http: HttpClient, private configs: ServiceEndpointConfig,
        private appConfig: AppConfig, private semaphoresService: SemaphoresService) { }

    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.http, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }

    getEmailList(branchId: number, appId: number, fileId: number) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Contacts/GetEmailLookupListByCase', {
            BranchId: branchId,
            AppId: appId,
            FileId: fileId,
            DisplayDataString: 'EmailAddress'
        }).pipe(map(res => res.data));
    }
    shareSafeBoxDocument(filePathList: string[], sendSilently: boolean,
        toRecipients: [string], ccRecipients: [string], htmlBody: string, message: string) {
        return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/ShareSafeBoxDocument', {
            filePathList: filePathList,
            toRecipients: toRecipients,
            ccRecipients: ccRecipients,
            htmlEmailSignature: htmlBody,
            sendSilently: sendSilently,
            message: message
        }).pipe(map(res => res.data));
    }
    shareSignedDPSFileViaSafeBox(matterRef: string, signatureTokenList: string[], sendSilently: boolean,
        reviewDate: string, reviewNote: string,
        toRecipients: [string], ccRecipients: [string], htmlBody: string, message: string,
        dpsFileCredentials: { diaryId: number, password: string }[]) {
        if (dpsFileCredentials && dpsFileCredentials.length > 0) {
            return this.http.post<any>(this.appConfig.serviceBase +
                '/MailBox/ShareSignedDPSDocumentAndDpsFilesAsMailAttachmentViaSafeBox', {
                matterRef: matterRef,
                signatureTokenList: signatureTokenList,
                dpsFileCredentials: dpsFileCredentials,
                toRecipients: toRecipients,
                ccRecipients: ccRecipients,
                htmlEmailSignature: htmlBody,
                sendSilently: sendSilently,
                reviewDate: reviewDate,
                reviewNote: reviewNote,
                message: message
            }).pipe(map(res => res.data));
        }
        return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/ShareSignedDPSFileViaSafeBox', {
            matterRef: matterRef,
            signatureTokenList: signatureTokenList,
            toRecipients: toRecipients,
            ccRecipients: ccRecipients,
            htmlEmailSignature: htmlBody,
            sendSilently: sendSilently,
            reviewDate: reviewDate,
            reviewNote: reviewNote,
            message: message
        }).pipe(map(res => res.data));
    }
    shareDPSFileWithDiaryEntryViaSafeBox(matterData: MatterInfo, toRecipients: string[], ccRecipients: string[], sendSilently: boolean,
        reviewDate: string, reviewNote: string, subjectNote: string,
        dpsFileCredentials: { diaryId: number, password: string, letterName: string }[], htmlBody: string, message: string) {

        return this.getFileShareToken(matterData.AppCode, matterData.BranchID, matterData.FileID,
            dpsFileCredentials.map(val => val.letterName))
            .pipe(
                switchMap(res =>
                    this.http.post<{ body: ShareFilesResponce<{ mailBody: string }> }>(
                        this.appConfig.apiv3SafeboxApi + `/SafeBox/Sharing/ShareFiles/diary`,
                        {
                            body: {
                                itemAccessRefs: res.transferTokenOutputs.map(val => ({ token: val.token })),
                                message,
                                queueName: 'diary-file-vars-sync',
                                data: {
                                    appId: matterData.AppID,
                                    branchId: matterData.BranchID,
                                    fileId: matterData.FileID,
                                    reviewDate,
                                    reviewNote
                                }
                            }
                        }
                    ).pipe(
                        switchMap(data => this.sendOrCreateMail(sendSilently, data.body.data.mailBody + htmlBody,
                            `${res.mailSubjectPrefix} ${subjectNote} (DPS file sharing on safebox)`, toRecipients, ccRecipients))
                    )
                )
            );
        // return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/ShareDPSFileWithDiaryEntryViaSafeBox', {
        //     matterRef: matterRef,
        //     dpsFileCredentials: dpsFileCredentials,
        //     toRecipients: toRecipients,
        //     ccRecipients: ccRecipients,
        //     htmlEmailSignature: htmlBody,
        //     sendSilently: sendSilently,
        //     reviewDate: reviewDate,
        //     reviewNote: reviewNote,
        //     message: message
        // }).pipe(map(res => res.data));
    }

    private sendOrCreateMail(sendSilently: boolean, body: string, subject: string,
        toRecipients: string[] = [], ccRecipients: string[] = []) {

        const message: Message = {
            subject,
            toRecipients: toRecipients.map(val => ({ emailAddress: { address: val } })),
            ccRecipients: ccRecipients.map(val => ({ emailAddress: { address: val } })),
            body: { contentType: 'html', content: body }
        };

        if (sendSilently) {
            this.sendNewItem(message).pipe(map(data => ({})));
        }

        return this.createEmail(message).pipe(map(data => ({ id: data.id })));

    }

    private createEmail(message?: Message): Observable<Message> {
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

    private createGmail(email?: Message) {
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

    private sendNewItem(message: Message, saveToSentItems = true): Observable<boolean> {
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
    private sendNewGmail(email: Message) {
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

    private getFileShareToken(appCode: string, branchId: number, fileId: number, letterNames: string[]) {
        return this.http.get<{ body: GetFileShareTokenResponce }>(this.appConfig.apiv3DiaryApi +
            `/Diary/Files/GetFileShareToken/${appCode}/${branchId}/${fileId}?letterNames=${letterNames.toString()}`)
            .pipe(
                map(res => res.body)
            );
    }

    sendSignedDocumentAsMailAttachment(matterRef: string, signatureTokenList: string[], sendSilently: boolean,
        reviewDate: string, reviewNote: string,
        toRecipients: [string], ccRecipients: [string], htmlBody: string, message: string,
        dpsFileCredentials: { diaryId: number, password: string }[]) {
        if (dpsFileCredentials && dpsFileCredentials.length > 0) {
            return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/SendSignedDocumentAndDpsFilesAsMailAttachment', {
                matterRef: matterRef,
                signatureTokenList: signatureTokenList,
                dpsFileCredentials: dpsFileCredentials,
                toRecipients: toRecipients,
                ccRecipients: ccRecipients,
                htmlEmailSignature: htmlBody,
                sendSilently: sendSilently,
                reviewDate: reviewDate,
                reviewNote: reviewNote,
                message: message
            }).pipe(map(res => res.data));
        }
        return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/SendSignedDocumentAsMailAttachment', {
            matterRef: matterRef,
            signatureTokenList: signatureTokenList,
            toRecipients: toRecipients,
            ccRecipients: ccRecipients,
            htmlEmailSignature: htmlBody,
            sendSilently: sendSilently,
            reviewDate: reviewDate,
            reviewNote: reviewNote,
            message: message
        }).pipe(map(res => res.data));
    }
    sendDocumentAsMailAttachment(matterRef: string, asPDF: boolean, sendSilently: boolean, reviewDate: string, reviewNote: string,
        toRecipients: [string], ccRecipients: [string], dpsFileCredentials: { diaryId: number, password: string }[],
        htmlBody: string, message: string) {
        return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/DPSDocumentAsMailAttachment', {
            matterRef: matterRef,
            asPDF: asPDF,
            dpsFileCredentials: dpsFileCredentials,
            toRecipients: toRecipients,
            ccRecipients: ccRecipients,
            htmlBody: htmlBody,
            sendSilently: sendSilently,
            reviewDate: reviewDate,
            reviewNote: reviewNote,
            message: message
        }).pipe(map(res => res.data));
    }

    sendDocumentsToMLS(matterRef: string, reviewDate: string, reviewNote: string, message: string,
        toRecipients: [string], dpsFileCredentials: { diaryId: number, password: string }[], isEditable: boolean) {
        return this.http.post<any>(this.appConfig.serviceBase + '/MLS/SendDocsToMLSAsync', {
            matterRef: matterRef,
            dpsFileCredentials: dpsFileCredentials,
            emailAddresses: toRecipients,
            // ccEmailAddresses: ccRecipients,
            // htmlEmailSignature: htmlBody,
            reviewDate: reviewDate,
            reviewNote: reviewNote,
            message: message,
            editable: isEditable
            // sendSilently: true
        }).pipe(map(res => res.data));
    }
    sendDocumentsToMLSBySigToken(matterRef: string, reviewDate: string, reviewNote: string, message: string,
        toRecipients: [string], signatureTokenList: string[], isEditable: boolean,
        dpsFileCredentials: { diaryId: number, password: string }[]) {
        return this.http.post<any>(this.appConfig.serviceBase + '/MLS/SendDocsToMLSBySigToken', {
            matterRef: matterRef,
            signatureTokenList: signatureTokenList,
            dpsFileCredentials: dpsFileCredentials,
            emailAddresses: toRecipients,
            // ccEmailAddresses: ccRecipients,
            // htmlEmailSignature: htmlBody,
            reviewDate: reviewDate,
            message: message,
            reviewNote: reviewNote,
            editable: isEditable
            // sendSilently: true
        }).pipe(map(res => res.data));
    }

    // eBilling Comment
    // public getWorkTypeList() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentHWorkTypeList')
    //         .map(response => response.data);
    // }
    // public getPhaseList() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Phases)
    //         .map(response => response.data);
    // }
    // public getActivitiList() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Activities)
    //         .map(response => response.data);
    // }
    // public getTaskList() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Tasks)
    //         .map(response => response.data);
    // }
}
