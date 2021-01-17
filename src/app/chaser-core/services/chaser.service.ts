
import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Folder, FeeEarnerResponce, FolderResponce, TimeTypeResponce, MatterInfo, ItemIdTypeDTO } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { ApiClientWrapper, AppConfig, MsgraphClientBase } from '../../core';
import { Message, Recipient } from '../../core/lib/microsoft-graph';
import { ChaserRequest, UnMapEmail } from '../models/interfaces';
import { XMLFileTypes } from '../../core/lib/matter';
import { CrimeClassIdentityViewModel, AttTypeResponse } from '../../core/lib/timeRecord';
import { ClassListRequest } from '../../core/lib/crime-managment';
import { ClassObj } from '../../crime-management-core/models/interfaces';
import { AttachmentWrapper } from '../../compose-mail-core';
import { from, Observable } from 'rxjs';
import { AuthInfoStateService } from '../../auth';
import { SemaphoresService } from '../../shared';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { Mime } from '../../utils/mime-message';
import { CivilClassObj } from '../../civil-class-management';
import { CivilDropDownData } from '../../civil-time-recording-desktop';
import { AzureStorageService } from '../../azure-storage';
import { dpsNewDate } from '../../utils/javascriptDate';
import { DatePipe } from '@angular/common';
import { DiaryRecType } from '../../add-note-core';

declare var gapi;

@Injectable()
export class ChaserService {

    private msGraphClient: MsgraphClientBase = null;

    constructor(private http: HttpClient, private appConfig: AppConfig, private configs: ServiceEndpointConfig,
        private authInfo: AuthInfoStateService, private semaphoresService: SemaphoresService,
        private azureStorageService: AzureStorageService, private datePipe: DatePipe) { }

    private getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.http, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }

    public saveDiary(chaserRequest: ChaserRequest, ids: { internetMessageId: string, id: string },
        subject: string, dateTimeOffset: number) {
        const appCode = chaserRequest.chaserModel.appCode;
        const branchId = chaserRequest.chaserModel.branchId;
        const fileId = chaserRequest.chaserModel.fileId;
        const url = `${this.appConfig.apiv3DiaryApi}/Diary/Files/TransferToken/${appCode}/${branchId}/${fileId}`;
        const item = {
            itemId: ids.id || null,
            messageId: ids.internetMessageId || null,
            userEmail: chaserRequest.from ? chaserRequest.from.emailAddress.address : null,
            subject,
        };

        return this.azureStorageService.requestSasTokenWithStorage(url, 'post', { body: { types: ['msg'] } })
            .uploadEmailsAsMsg([item], 'diary', !!ids.id).pipe(
                switchMap(itemUpload => {
                    const dateDn = this.datePipe.transform(dpsNewDate(dateTimeOffset), 'yyyy-MM-ddTHH:mm:ss');
                    const diaryInput = {
                        fileInfo: [{
                            inlineAttachments: [],
                            token: itemUpload[0].token,
                            note: chaserRequest.chaserModel.note,
                            letterName: itemUpload[0].letterName,
                            dateDn
                        }],
                        recType: DiaryRecType.EMAIL_OUT,
                        putOnBy: null,
                        branchId: chaserRequest.chaserModel.branchId,
                        appId: chaserRequest.chaserModel.appId,
                        fileId: chaserRequest.chaserModel.fileId,
                        taskFor: chaserRequest.chaserModel.feeEarner,
                        dateDn,
                        columnFolderId: chaserRequest.chaserModel.diaryFoldersValue,
                        note: chaserRequest.chaserModel.note,
                        appCode: chaserRequest.chaserModel.appCode,
                        itemUnits: Number(chaserRequest.chaserModel.itemUnits),
                        itemRate: Number(chaserRequest.chaserModel.itemRate),
                        itemValue: 0,
                        matterReferenceNo: chaserRequest.chaserModel.matterReferenceNo,
                        workflowActions: 'Complete',
                        useDefaultNote: false,
                        anchorType: null,
                        classId: chaserRequest.chaserModel.classId,
                        subClassId: chaserRequest.chaserModel.subClassId,
                        uncharge: chaserRequest.chaserModel.uncharge,
                        // telephoneAdvice: null,
                        extraItemUnits: Number(chaserRequest.chaserModel.extraTimeUnits),
                        extraItemRate: 0,
                        extraItemValue: 0,
                        extraRecTypeValue: Number(chaserRequest.chaserModel.extraTimeTypeValue),
                        eBillingPhaseId: chaserRequest.chaserModel.eBillingPhaseId,
                        eBillingTaskId: chaserRequest.chaserModel.eBillingTaskId,
                        eBillingActivityId: chaserRequest.chaserModel.eBillingActivityId,
                        diaryFromChaser: true,
                        legalAidCaseInfoId: chaserRequest.chaserModel.legalAidCaseInfoId,
                        lafundLevel: chaserRequest.chaserModel.lafundLevel
                    };
                    return this.http.post<{ body: { diaryId: number, letterName: string }[] }>(
                        `${this.appConfig.apiv3DiaryApi}/Diary/SaveDiary`,
                        { body: diaryInput }).pipe(
                            map(response => response.body));
                })
            );
        // return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/SendMailViaProfileEmail?suppressFail=true',
        //     { itemIdTypeDTO: emailModel, chaserViewModel: modelData.chaserModel }).pipe(
        //         map(response => response));
    }

    public sendChaserEmail(message: Message, attachments: AttachmentWrapper[], fromRecipient: Recipient, subjectPrefix: string) {
        return this.updateMail(message.id, {
            id: message.id,
            body: {
                ...message.body,
                content: (!message.body.content && message.body.contentType !== 'text' ? `<p></p>` : message.body.content)
            },
            subject: subjectPrefix,
            toRecipients: message.toRecipients || [],
            ccRecipients: message.ccRecipients || [],
            bccRecipients: message.bccRecipients || [],
            importance: message.importance,
            flag: message.flag,
            from: fromRecipient
        }, attachments).pipe(
            switchMap(data => this.sendDraftItem(data.id).pipe(
                map(value => value ? { id: value.id, internetMessageId: '' } : { internetMessageId: data.internetMessageId, id: '' })
            ))
        );
    }

    private updateMail(id: string, message: Message, attachments: AttachmentWrapper[], isSuppressErrors?: boolean): Observable<Message> {
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
                .patch(message, header).pipe(map((result: Message) => {
                    return result;
                }))
        ));
    }
    private updateGmail(email?: Message) {
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

    private sendDraftItem(id: string): Observable<{ id: string, threadId: string }> {
        if (this.authInfo.isGoogle()) {
            return from(this.sendDraftGmail(id));
        }
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages/${id}/send`)
                .post(null).pipe(map(result => {
                    return null;
                }))
        ));
    }
    private sendDraftGmail(id: string) {
        return new Promise<{ id: string, threadId: string }>((resolve, reject) => {
            const request = gapi.client.gmail.users.drafts.send({
                'userId': 'me',
                'id': id,
                'resource': {
                    'id': id
                }
            });
            return request.execute((resp) => {
                if (resp) {
                    resolve(resp);

                } else {
                    reject('');
                }
            });

        });
    }

    public getMailSubjectPrefix(branchId: number, appId: number, fileId: number, subject: string) {
        return this.http.get<{ body }>(this.appConfig.apiv3DiaryApi +
            `/Diary/GetMailSubjectPrefix/${branchId}/${appId}/${fileId
            }/false?existingSubject=${encodeURIComponent(subject)}&removeCurrentDPSSubject=true`)
            .pipe(
                map(res => res.body.subjectPrefix)
            );
    }

    public getTimeUseFeeEarnerRatesValueDisable() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Diary/GetTimeUseFeeEarnerGradesValueDisable').pipe(
            map(response => response.data));
    }
    public getFileNo(matterInfo: MatterInfo) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/Diary/GetFileLabel?appId=' + matterInfo.AppID
                + '&branchId=' + matterInfo.BranchID + '&fileId=' + matterInfo.FileID).pipe(
                    map(response => response.data));
    }
    public getFeeEarners() {
        return this.http.get<FeeEarnerResponce>(this.appConfig.serviceBase + '/MailBox/GetFeeEarnerList').pipe(
            map(response => response.data));
    }
    public getFolders(appId: number) {
        return this.http.get<FolderResponce>(this.appConfig.serviceBase2 + '/Diary/GetFolders?appId=' + appId).pipe(
            map(response => response.data));
        // .do((response) => console.log('FolderResponce456', response));
    }
    public getTimeTypes(appId: number) {
        return this.http.get<TimeTypeResponce>(this.appConfig.serviceBase + '/Diary/GetExtraTimeTypes?appId=' + appId).pipe(
            map(response => response.data));
    }
    public getDefaultFolder(appId: number) {
        return this.http
            .get<Folder>(this.appConfig.serviceBase + '/Diary/GetDiaryDefaultFolderIdByAppId?appId=' + appId).pipe(
                map((response: any) => {
                    return { value: response.data, selected: true, text: '' };
                }));
    }
    public isTimeRecordingEnabled(matterRefNo) {
        return this.http.get<any>(this.appConfig.serviceBase + '/TimeRecording/IsTimeRecordingEnabled?MatterRef=' + matterRefNo).pipe(
            // .do(response => console.log('****************getIsTimeRecordingEnabled', response.data))
            map(response => response.data.isTimeRecordingEnabled));
    }
    public getMatterListByMail(emailAddress: Recipient[]) {
        if (emailAddress.length > 0) {
            const email: string[] = emailAddress.map(item => item.emailAddress.address);
            return this.http.post<any>(this.appConfig.serviceBase + '/Matters/GetAssociatedMattersByEmail',
                { emailAddress: email }).pipe(
                    map(response => response.data));
            // return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAssociatedMattersByEmail?emailAddress=' + email)
            //     .map(response =>
            //         response.data);
        } else {
            return null;
        }
    }
    public getMaterDataFromMailSubject(mailSubject: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetMatterByNewMailSubject?subject=' +
            encodeURIComponent(mailSubject),
        ).pipe(map((data) => {
            if (data && data.data) {
                const newData: any = {
                    ClientName: data.data.clientName,
                    MatterReferenceNo: data.data.matterReferenceNo,
                    BranchID: data.data.branchID,
                    AppID: data.data.appID,
                    AppCode: data.data.app_Code,
                    FileID: data.data.fileID,
                    FeeEarner: data.data.feeEarner,
                    eBilling: data.data.eBilling,
                    var1: '',
                    var2: '',
                    var3: '',
                    selected: false,
                    RateCategory: '',
                    isLegalAid: data.data.isLegalAid
                };
                return newData;
            } else {
                return null;
            }
        }));
    }

    public getUnmapEmialAddress(matterInfo: MatterInfo, emailAddress: Recipient[]) {
        const email: string[] = emailAddress.map(item => item.emailAddress.address);
        return this.http.post<UnMapEmail>(this.appConfig.serviceBase + '/Matters/FilterEmailListByMatterAssociatedContacts',
            {
                appId: matterInfo.AppID,
                branchId: matterInfo.BranchID,
                fileId: matterInfo.FileID,
                emailList: email,
            }).pipe(
                map(response => response.data));
    }
    // Link Contact With Mattar
    public linkContactWithMattar(info) {
        return this.http.post<UnMapEmail>(this.appConfig.serviceBase + '/Contacts/AddContactsAndContactLink',
            {
                AppId: info.matterInfo.AppID,
                BranchId: info.matterInfo.BranchID,
                FileId: info.matterInfo.FileID,
                ContactEmailsViewModels: info.emailList
            }).pipe(
                map(response => response));
    }

    public getContactRole(appId: number) {
        return this.http
            .get<string[]>(this.appConfig.serviceBase + '/Diary/GetDiaryDefaultFolderIdByAppId?appId=' + appId).pipe(
                map((response: any) => {
                    return response.data;
                }));
    }
    // eBilling Comment
    public getWorkTypeList() {
        return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentHWorkTypeList').pipe(
            map(response => response.data));
    }
    public getPhaseList() {
        return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Phases).pipe(
            map(response => response.data));
    }
    public getActivitiList() {
        return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Activities).pipe(
            map(response => response.data));
    }
    public getTaskList() {
        return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Tasks).pipe(
            map(response => response.data));
    }

    public getClassType(data: { branchId: number, appId: number, fileId: number }) {
        const model = new ClassListRequest(data.branchId, data.appId, data.fileId);
        return this.http.post<{ data: ClassObj[] }>
            (`${this.appConfig.serviceBase}/CrimeTime/GetClassList`, model.DataRequestToPost()).pipe(
                map(responce => responce.data));
    }

    public getCrimeWorkTypes(model: CrimeClassIdentityViewModel) {
        return this.http.post<AttTypeResponse>(this.appConfig.serviceBase + '/CrimeTime/GetCrimeWorkTypes',
            model).pipe(
                map(response => response.data));
    }

    public addDiaryRecordsForPlot(request: any) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Diary/AddDiaryRecordsForPlotMattters', request.toPost());
    }


    // Civil
    getCivilClassList(data: { appId: number, branchId: number, fileId: number }): Observable<CivilClassObj[]> {
        const param = `appId=${data.appId}&branchId=${data.branchId}&fileId=${data.fileId}`;
        return this.http.get<{ body: CivilClassObj[] }>(`${this.appConfig.apiv3CivilApi}/CivilClassInfor/GetAllOpenClass?${param}`)
            .pipe(map(responce => responce.body));
    }
    getCivilClassLevels(classObj: CivilClassObj): Observable<CivilDropDownData[]> {
        return this.http.get<{ body: CivilDropDownData[] }>
            (`${this.appConfig.apiv3CivilApi}/CivilTime/GetLevels?legalAidCaseId=${classObj.legalAidCaseId}`)
            .pipe(map(responce => responce.body));
    }
}
