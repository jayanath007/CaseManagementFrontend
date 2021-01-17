import { Message } from './../../core/lib/microsoft-graph';
import { ClassObj } from './../../crime-management-core/models/interfaces';
import { ServiceEndpointConfig } from './../../core/configs/service-configs';
import { take, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Grade, FeeEarner, ExtraTimeType, UpdateDeletePostEntriesRequest,
  DiaryType, AddNoteItemData, MatterInfo, DiaryInput, EditViewData, Attachments
} from '../models/interfaces';
import {
  FolderResponse, DiaryTypeResponse, FeeEarnerResponse, UserGradeResponse, UserGradeListResponse,
  ActionListResponse, FolderListResponse, ExtraTimeTypeListResponse, EditViewResponse, GetItemRateResponse, GetLetterNameResponse
} from '../models/responses';
import { AppConfig, ApiClientWrapper, MsgraphClientBase } from '../../core';
import { AuthInfoStateService } from '../../auth';
import { AttTypeResponse, CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { XMLFileTypes, MatterAppCode } from '../../core/lib/matter';
import { AzureStorageService, WebViewService, EmailItem, DriveItem, DiaryItem, InboxItem } from '../../azure-storage';
import { AddNoteInPutData, AddNoteItemsType } from '../../core/lib/addNote';
import { BodyHandlerService } from '../../organizer-desktop-shared';
import { SemaphoresService } from '../../shared';
import { ClassListRequest } from '../../core/lib/crime-managment';
import { DiaryRecType } from '../models/enumeration';
import { CivilClassObj } from './../../civil-class-management';
import { CivilDropDownData, CivilRates, CivilRateType, CivilTimeRecordInitData } from '../../civil-time-recording-desktop';
@Injectable()
export class AddNoteService {

  private msGraphClient: MsgraphClientBase = null;

  constructor(private http: HttpClient, private appConfig: AppConfig, private authHelper: AuthInfoStateService,
    private configs: ServiceEndpointConfig, private azureStorageService: AzureStorageService, private webViewService: WebViewService,
    private bodyHandler: BodyHandlerService, private semaphoresService: SemaphoresService) { }
  private getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authHelper, this.http, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
  }
  public getMatterFromMatRef(matterRef: string) {
    return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetMatterFromMatRef?matterRef=' + matterRef)
      .pipe(map(response => {
        if (response && response.data) {
          return response.data.rateCategory ? response.data.rateCategory : 0;
        } else {
          return 0;
        }
      }));
  }
  public getTimeUseFeeEarnerRatesValueDisable(): Observable<boolean> {
    return this.http.get<boolean>(this.appConfig.serviceBase + '/Diary/GetTimeUseFeeEarnerGradesValueDisable');
  }
  private getUserGradeList(appId: number): Observable<Grade[]> {
    return this.http.get<UserGradeListResponse>(this.appConfig.serviceBase + '/Diary/getGradesByAppId?appId=' + appId).pipe(
      map(response => response.data));
  }
  private getDefaultGrade(materFeeEarner: string, appId: number) {
    return this.http.get<UserGradeResponse>(this.appConfig.serviceBase + '/Diary/getUserGradeByAppId?feeEarner=' +
      materFeeEarner + '&appId=' + appId).pipe(
        map(response => response.data));
  }
  public getUserGradeFullData(materFeeEarner: string, appId: number) {
    return combineLatest(this.getUserGradeList(appId), this.getDefaultGrade(materFeeEarner, appId),
      (gradeListResponse, defualtGradeResponse) => ({ gradeListResponse, defualtGradeResponse })).pipe(
        take(1));
  }
  public getExtraTimeTypeList(appId: number) {
    return this.http.get<ExtraTimeTypeListResponse>(this.appConfig.serviceBase + '/Diary/GetExtraTimeTypes?appId=' + appId).pipe(
      map(response => response.data));
  }
  public getFeeEarnerList(appId: string) {
    return this.http.get<FeeEarnerResponse>(this.appConfig.serviceBase + '/TimeRecording/GetFeeEarnerList').pipe(
      map(response => response.data));
  }
  public getFolderListFullData(appId: number) {
    return combineLatest(this.getFolderList(appId), this.getDefaultFolder(appId),
      (folderListResponse, defualtFolderResponse) => ({ folderListResponse, defualtFolderResponse })).pipe(
        take(1));
  }
  public getFolderList(appId: number) {
    return this.http.get<any>(this.appConfig.serviceBase + '/Diary/GetFoldersAsync?appId=' + appId).pipe(
      map(response => response.data));
  }
  public getDefaultFolder(appId: number) {
    return this.http.get<FolderResponse>(this.appConfig.serviceBase + '/Diary/GetDiaryDefaultFolderIdByAppId?appId=' + appId).pipe(
      map(response => response.data));
  }
  public getIsTimeRecordingEnabled(MatterReferenceNo: string) {
    // return this.http.get< Folder[]>(this.baseUrl + 'Diary/GetFolders?appId=3');
    return this.http.get<any>(this.appConfig.serviceBase + '/TimeRecording/IsTimeRecordingEnabled?MatterRef=' + MatterReferenceNo).pipe(
      map(response => response.data.isTimeRecordingEnabled));
  }
  public getDiaryTypeList(appId) {
    return this.http.get<DiaryTypeResponse>(`${this.appConfig.apiv3DiaryApi}/Diary/GetDiaryRecTypes/${appId}`).pipe(
      map(response => (response.body || []).map<DiaryType>(val => ({ value: val.typeId, text: val.description, selected: false })))
    );
  }
  // Get Action List
  public getActionList() {
    return this.http.get<ActionListResponse>(this.appConfig.serviceBase + '/Diary/GetActions').pipe(
      map(response => response.data));
  }
  public getItemRate(appID, feeEarner, RateCategory, diaryRecType: DiaryRecType, gradValue,
    isLegalAid, appCode, branchId, fileId, classId, subClassId, weekendWork, telephoneAdvice, classType: number, judgeLevel) {
    // civil
    if ((isLegalAid && appCode === MatterAppCode.MA) || diaryRecType === null) {
      if (subClassId === null || classId === null || diaryRecType === null) {
        return of({ rate: 0, error: null });
      }
      return this.getCivilRate(subClassId, classId, diaryRecType, judgeLevel);
    }

    // crime
    if ((isLegalAid && appCode === MatterAppCode.CR) || diaryRecType === null) {
      if (subClassId === null || classId === null || diaryRecType === null) {
        return of({ rate: 0, error: null });
      }
      return this.http.post<GetItemRateResponse>(this.appConfig.serviceBase + '/CrimeDiarySupport/GetCrimeRatesForDiary', {
        branchId, fileId, classId, subClassId, weekendWork, telephoneAdvice, diaryRecType
      }).pipe(map(response => ({ rate: response.data, error: response.detailStatus ? response.detailStatus : null })));
    }

    //others 
    return this.http.get<GetItemRateResponse>(this.appConfig.serviceBase + '/Diary/GetItemRate?appId=' +
      appID + '&diaryRecType=' + this.convertDiaryType(diaryRecType) + '&feeEarner=' + feeEarner + '&matterRateCatCode=' + RateCategory
      + '&itemGrade=' + gradValue).pipe(
        map(response => ({ rate: response.data, error: null })));
  }

  getCivilRate(level: number, classId: number, diaryRecType: DiaryRecType, judgeLevel: number): Observable<{ rate: number, error: any }> {
    let rateItems = null;
    let param = '';

    switch (diaryRecType) {
      case DiaryRecType.EMAIL_IN: { rateItems = CivilRateType.EmailIn; break; }
      case DiaryRecType.EMAIL_OUT: { rateItems = CivilRateType.EmailOut; break; }
      case DiaryRecType.CALL_IN: { rateItems = CivilRateType.CallIn; break; }
      case DiaryRecType.LETTER_OUT: { rateItems = CivilRateType.LetterOut; break; }
      case DiaryRecType.LETTER_IN: { rateItems = CivilRateType.Letterin; break; }
      case DiaryRecType.CALL_OUT: { rateItems = CivilRateType.CallOut; break; }
    }

    if (!rateItems) {
      return of({ rate: 0, error: null });
    }
    param = `${param}legalAidCaseId=${classId}&fundingType=${level}&rateItems=${rateItems}&judgeLevel=${judgeLevel}`;


    return this.http.get<{ body: CivilRates[] }>
      (`${this.appConfig.apiv3CivilApi}/CivilTime/GetItemRates?${param}`)
      .pipe(map(responce => {
        if (responce && responce.body && responce.body[0]) {
          return { rate: responce.body[0].value, error: null }
        }
        return { rate: 0, error: null }
      }));
  }

  public getExtraRate(appID, feeEarner, RateCategory, extraRecTypeValue) {
    return this.http.get<GetItemRateResponse>(this.appConfig.serviceBase + '/Diary/GetExtraRate?appId=' +
      appID + '&extraRecTypeValue=' + extraRecTypeValue + '&feeEarner=' + feeEarner + '&matterRateCatCode=' + RateCategory).pipe(
        map(response => response.data));
  }
  public getLetterName(appID, branchId, fileId) {
    return this.http.get<GetLetterNameResponse>(this.appConfig.serviceBase + '/Diary/GetLetterName?appId=' +
      appID + '&branchId=' + branchId + '&fileId=' + fileId).pipe(
        map(response => response.data));
  }
  public getCalculateItemValue(appId: number, branchID, fileID, unit, rate, uncharged, diaryRecType, isLegalAid, appCode) {
    if (isLegalAid && appCode === MatterAppCode.CR && uncharged === false) {
      return of(rate);
    }
    return this.http.get<any>(this.appConfig.serviceBase + '/Diary/GetCalculateItemValue?appId=' +
      appId + '&branchId=' + branchID + '&diaryRecType= ' + this.convertDiaryType(diaryRecType) + '&fileId=' + fileID + '&itemRate=' +
      rate + '&itemUnits=' + unit + '&uncharged=' + uncharged).pipe(
        map(response => response.data));
  }
  public getcalculateExtraItemValue(appId, feeEarner: FeeEarner, rateCategory, extraUnit, extraRate, extraType: ExtraTimeType) {
    const temExtraType = !!extraType ? extraType.dtL_RecType : null;
    return this.http.get<any>(this.appConfig.serviceBase + '/Diary/GetExtraValue?appId=' +
      appId + '&extraRate=' + extraRate + '&extraRecTypeValue=' + temExtraType + '&extraUnits=' +
      extraUnit + '&feeEarner=' + feeEarner.groupName + '&matterRateCatCode=' + rateCategory).pipe(
        map(response => response.data));
  }
  public addNoteDataSubmit(data, url) {
    return this.http.post<any>(this.appConfig.serviceBase + url, data).pipe(
      map(response => response));
  }
  public addNoteMuiltipleDataSubmit(datalist) {
    datalist.forEach(element => {
      this.http.post<any>(this.appConfig.serviceBase + element.url, element.data).pipe(
        map(response => response));
    });
  }
  public getMsgAndEmlFileAttachments(data) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Diary/GetMsgAndEmlFileAttachments', data).pipe(
      map((response) => response.data));
  }

  public getEditViewData(uid) {
    return this.http.get<EditViewResponse>(this.appConfig.serviceBase + '/Diary/GetDiaryRecordInfo?uid=' + uid).pipe(
      map(response => response.data));
  }
  public getMsgAndEmlFileAttachmentUrl(attachment) {
    const headers = new Headers({ 'Content-Type': undefined });
    return this.http.post<any>(this.appConfig.serviceBase + '/Diary/GetMsgAndEmlFileAttachmentUrl', attachment).pipe(
      map((response) => response.data));
  }

  public getSingToken(password: string, diaryId: number) {
    return this.http.post<any>(this.appConfig.serviceBase + '/File/GetSignatureTokenForFileWithDiaryEntry?hideFailMassge=true', {
      DiaryId: diaryId,
      SignaturePassword: password
    }).pipe(map(res => res.data));
  }
  getSignAndSendPDFDocumentUrl(diaryId: number, signToken: string, accessToken) {
    // return this.authHelper.getPDFViewerJwtToken().pipe(map((token) => {
    //   const params = {
    //     diaryId: diaryId,
    //     access_token: token,
    //     signature_token: signToken
    //   };
    //   const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
    //   return `${this.appConfig.pdfviwer}/SingAndSend?${qs}`;
    // }));

    // return this.authHelper.getPDFViewerJwtToken().pipe(map((token) => {
    const params = {
      diaryId: diaryId,
      access_token: accessToken,
      signature_token: signToken
    };
    const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
    return `${this.appConfig.pdfviwer}/SingAndSend?${qs}`;
    // }));
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
        map(response => response.data));
  }

  getCivilClassList(data: { appId: number, branchId: number, fileId: number }): Observable<CivilClassObj[]> {
    const param = `appId=${data.appId}&branchId=${data.branchId}&fileId=${data.fileId}`;
    return this.http.get<{ body: CivilClassObj[] }>(`${this.appConfig.apiv3CivilApi}/CivilClassInfor/GetAllOpenClass?${param}`)
      .pipe(map(responce => responce.body));
  }

  getCivilClassLevels(classObj: CivilClassObj): Observable<CivilDropDownData[]> {
    return this.http.get<{ body: CivilDropDownData[] }>
      (`${this.appConfig.apiv3CivilApi}/CivilTime/GetLevels?legalAidCaseId=${classObj ? classObj.legalAidCaseId : 0}`)
      .pipe(map(responce => responce.body));
  }

  public getCrimeWorkTypes(model: CrimeClassIdentityViewModel) {
    return this.http.post<AttTypeResponse>(this.appConfig.serviceBase + '/CrimeTime/GetCrimeWorkTypes',
      model).pipe(
        map(response => response.data));
  }

  public updateDeletePostEntries(request: UpdateDeletePostEntriesRequest) {
    return this.http.post<any>(`${this.appConfig.serviceBase}/PostOffice/UpdateDeletePostEntries`, request.toPost()).pipe(
      map(response => response));
  }

  public uploadItems(inPutData: AddNoteInPutData, dateDone: string | Date): Observable<AddNoteItemData[]> {
    const appCode = inPutData.matterData.AppCode;
    const branchId = inPutData.matterData.BranchID;
    const fileId = inPutData.matterData.FileID;
    const url = `${this.appConfig.apiv3DiaryApi}/Diary/Files/TransferToken/${appCode}/${branchId}/${fileId}`;

    if (inPutData.addNoteItemsType === AddNoteItemsType.FileItems) {
      const items = inPutData.fileItemList;
      const types = items.map(item => item.name.split('.').pop());

      return this.azureStorageService.requestSasTokenWithStorage(url, 'post', { body: { types } })
        .uploadLocalFiles(items).pipe(
          map(itemUpload => itemUpload.map<AddNoteItemData>((val, i) => ({
            token: val.token,
            name: val.fileName,
            note: val.fileName.slice(0, val.fileName.lastIndexOf('.' + types[i])),
            letterName: val.letterName,
            extension: types[i],
            attachments: [],
            dateDn: dateDone
          })))
        );
    } else if (inPutData.addNoteItemsType === AddNoteItemsType.MailItems) {
      const items = inPutData.mailItemList.map<EmailItem>(val => ({
        itemId: val.data.id, subject: val.data.subject, userEmail: val.owner
      }));
      const types = items.map(item => 'msg');

      return this.azureStorageService.requestSasTokenWithStorage(url, 'post', { body: { types } })
        .uploadEmailsAsMsg(items, 'diary').pipe(
          map(itemUpload => itemUpload.map<AddNoteItemData>((val, i) => ({
            token: val.token,
            name: val.fileName,
            note: val.fileName.slice(0, val.fileName.lastIndexOf('.' + types[i])),
            letterName: val.letterName,
            extension: types[i],
            attachments: [],
            dateDn: dateDone,
            internetMessageId: inPutData.mailItemList[i].data.internetMessageId
          })))
        );
    } else if (inPutData.addNoteItemsType === AddNoteItemsType.DriveItems) {
      const items = inPutData.driveItemList.map<DriveItem>(val => ({
        itemRef: val.id, name: val.name
      }));
      const types = items.map(item => item.name.split('.').pop());

      return this.azureStorageService.requestSasTokenWithStorage(url, 'post', { body: { types } })
        .uploadDriveItems(items, inPutData.driveItemList[0].parentReference.driveId, 'diary').pipe(
          map(itemUpload => itemUpload.map<AddNoteItemData>((val, i) => ({
            token: val.token,
            name: val.fileName,
            note: val.fileName.slice(0, val.fileName.lastIndexOf('.' + types[i])),
            letterName: val.letterName,
            extension: types[i],
            attachments: [],
            dateDn: dateDone
          })))
        );
    } else if (inPutData.addNoteItemsType === AddNoteItemsType.DiaryItems) {
      const items = inPutData.diaryItemList.map<DiaryItem>(val => ({
        diaryId: val.diaryId.toString(), name: val.letterName
      }));
      const types = items.map(item => item.name.split('.').pop());

      return this.azureStorageService.requestSasTokenWithStorage(url, 'post', { body: { types } })
        .uploadDiaryItems(items, inPutData.diaryItemList[0].appCode,
          inPutData.diaryItemList[0].branchId, inPutData.diaryItemList[0].fileId).pipe(
            map(itemUpload => itemUpload.map<AddNoteItemData>((val, i) => ({
              token: val.token,
              name: val.fileName,
              note: val.fileName.slice(0, val.fileName.lastIndexOf('.' + types[i])),
              letterName: val.letterName,
              extension: types[i],
              attachments: [],
              dateDn: dateDone
            })))
          );
    } else if (inPutData.addNoteItemsType === AddNoteItemsType.InboxItems) {
      const items = inPutData.inboxItemList.map<InboxItem>(val => {
        const docNames = val.inboxDocPath.split('\\');
        const name = docNames[docNames.length - 1];
        return {
          inboxId: val.inboxId, name
        };
      });
      const types = items.map(item => item.name.split('.').pop());

      return this.azureStorageService.requestSasTokenWithStorage(url, 'post', { body: { types } })
        .uploadInboxItems(items, 'diary').pipe(
          map(itemUpload => itemUpload.map<AddNoteItemData>((val, i) => ({
            token: val.token,
            name: val.fileName,
            note: val.fileName.slice(0, val.fileName.lastIndexOf('.' + types[i])),
            letterName: val.letterName,
            extension: types[i],
            attachments: [],
            dateDn: dateDone
          })))
        );
    } else if (inPutData.addNoteItemsType === AddNoteItemsType.LetterEnginItems) {
      const items = inPutData.letterEnginItemList.map<AddNoteItemData>(val => ({
        name: val.letter,
        note: val.note,
        letterName: val.letter,
        extension: val.letter.split('.').pop(),
        attachments: null,
        dateDn: dateDone
      }));
      return of(items);
    }
    throw new Error('items not found');
  }

  public getMsgData(itemData: AddNoteItemData, matterData: MatterInfo) {
    return this.webViewService.getDiaryWebView(matterData.AppCode, matterData.BranchID,
      matterData.FileID, itemData.letterName, itemData.letterName).pipe(
        map((data: Message) => ({
          ...itemData, note: data.subject, dateDn: data.receivedDateTime,
          attachments: data.attachments.filter(att => !att.isInline) as Attachments[]
        }
        ))
      );
  }

  public getInlineAttachmentUrl(letterName: string, attachmentName: string, attachmentRef: string, matterData: MatterInfo) {
    return this.webViewService.getDiaryWebViewUrlForInlineAttachment(
      matterData.AppCode, matterData.BranchID,
      matterData.FileID, letterName, attachmentRef, attachmentName
    ).pipe(
      map((data: string) => data)
    );
  }
  public getInlineAttachmentDownloadUrl(letterName: string, attachmentName: string, attachmentRef: string, matterData: MatterInfo) {
    return this.webViewService.getDiaryInlineAttachmentDownloadUrl(
      matterData.AppCode, matterData.BranchID,
      matterData.FileID, letterName, attachmentRef, attachmentName
    ).pipe(
      map((data: string) => data)
    );
  }
  public getInlineMsgAttachment(letterName: string, attachmentName: string, attachmentRef: string, matterData: MatterInfo) {
    return this.webViewService.getDiaryWebViewForInlineAttachment(
      matterData.AppCode, matterData.BranchID,
      matterData.FileID, letterName, attachmentRef, attachmentName
    ).pipe(
      switchMap((data: Message) =>
        from(this.bodyHandler.substituteInlineAttachementPathForDiary(
          data.body.content, data.attachments as Attachments[],
          matterData.AppCode, matterData.BranchID,
          matterData.FileID, letterName)
        ).pipe(map(body => ({ ...data, body: { ...data.body, content: body } })))
      )
    );
  }

  public saveDiary(diaryInput: DiaryInput) {
    return this.http.post<{ body: { diaryId: number, letterName: string }[] }>(`${this.appConfig.apiv3DiaryApi}/Diary/SaveDiary`,
      { body: diaryInput }).pipe(
        map(response => response.body));
  }

  public getDiaryRecordById(diaryId: number) {
    return this.http.get<{ body: EditViewData }>(`${this.appConfig.apiv3DiaryApi}/Diary/GetDiaryRecordById/${diaryId}`).pipe(
      map(response => response.body));
  }

  public updateCrimeClassTotals(branchId: number, fileId: number, classId: number, isRecursiveFormDisplay = false) {
    return this.http.post<any>(this.appConfig.serviceBase + '/CrimeDiarySupport/UpdateCrimeClassTotals', {
      branchId, fileId, classId, isRecursiveFormDisplay
    }).pipe(map(response => response.data));
  }

  private convertDiaryType(type: number) {
    return Object.keys(DiaryRecType).find(key => DiaryRecType[key] === type);
  }
}
