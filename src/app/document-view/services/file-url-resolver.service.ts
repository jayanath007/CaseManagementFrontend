import { catchError, switchMap, map } from 'rxjs/operators';
import { Injectable, Inject, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, Observable, combineLatest, throwError as _throw, from } from 'rxjs';
import { FileAttachment, Message, DriveItem, Drive } from '../../core/lib/microsoft-graph';
import { AuthInfoStateService } from '../../auth';
import { GetPDFURL, MsgReplyResponse, FileManagerType } from '../models/interfaces';
import { getExtention, toQueryParams } from '../../utils/file';
import { FileUrlCache } from '../../core/lib/files';
import { ViewOutputDocumentRequest } from '../../workflow-core';
import {
  AppConfig, MsgraphClientBase, ApiClientWrapper, DriveMailIntegration, OutlookClientBase,
  allSupportedExtentions, v3CanViewExtensions, wopiExtensions, imageExtensions,
  browserCompatibleExtensions, msgExtensions
} from '../../core';
import { BillingGuideViewModel } from '../../billing-guide-core/models/interfaces';
import { MatterData, AllGridFilterModel } from '../../ledger-card-core/models/interfce';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { Base64 } from '../../utils/base64';
import { IDocumentCheckin } from '../models/interfaces';
import { IS_GOOGLE, SemaphoresService } from '../../shared';
import { GridDocumentData } from '../../core/lib/matter';
import { ReplyForwardType } from '../../mail-item-core';
import { Mime } from '../../utils/mime-message';
import { WebViewService } from '../../azure-storage';

declare var gapi;
@Injectable()
export class FileUrlResolverService extends DriveMailIntegration {
  private msGraphClient: MsgraphClientBase = null;
  private outlookClient: OutlookClientBase = null;
  constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient, private webViewService: WebViewService,
    private appConfig: AppConfig, private configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService,
    @Inject(IS_GOOGLE) public isGoogle: boolean, private injector: Injector) {
    super();
  }
  public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
  }

  private getOrCreateOutlookClient() {
    if (!this.outlookClient) {
      this.outlookClient = new OutlookClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.outlookClient;
  }
  public createAttachemntRawContentPath(owner: string, itemId: string, attId: string, type?: string) {
    return this.getOrCreateOutlookClient().createAttachemntRawContentPath(owner, itemId, attId, type)
      .pipe(map(path => this.appConfig.inlineAttachmentBase + path));
  }

  checkOutFileWithDiaryEntry(diaryId: number): Observable<IDocumentCheckin> {
    const params = {
      diaryId: diaryId,
    };

    return this.httpClient.post(`${this.appConfig.serviceBase}/Drive/CheckOutFileWithDiaryEntry`, params,
      { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(
        map((data: any) => {
          return {
            fileManagerType: FileManagerType.FileWithDiaryEntryManager,
            url: data.data.url,
            name: data.data.fileName,
            path: data.data.parentReferencePath,
            hashKey: data.data.hashKey
          };
        }));
  }

  checkOutFileWithOutDiaryEntry(branchId: number, appId: number, fileId: number, fileName: string): Observable<IDocumentCheckin> {
    const params = {
      branchId: branchId,
      appId: appId,
      fileId: fileId,
      fileName: fileName,
    };

    return this.httpClient.post(`${this.appConfig.serviceBase}/Drive/CheckOutFileWithOutDiaryEntry`, params,
      { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(
        map((data: any) => {
          return {
            fileManagerType: FileManagerType.FileWithOutDiaryEntryManager,
            url: data.data.url,
            name: data.data.fileName,
            path: data.data.parentReferencePath,
            hashKey: data.data.hashKey
          };
        }));
  }

  checkOutDpsTempalte(appId: number, fileName: string, isCommon: boolean) {
    const params = {
      appId: appId,
      fileName: fileName,
    };
    return this.httpClient.post(`${this.appConfig.serviceBase}/Drive/${isCommon ? 'CheckOutCommonTemplate' : 'CheckOutTemplate'}`, params,
      { headers: new HttpHeaders().set('Accept', 'application/json').set('X-dps', 'suppressErrors') }).pipe(
        map((data: any) => {
          return data;
        }));
  }

  public generateTemplate(appId: number, templateName: string) {
    return this.httpClient.get<any>
      (this.appConfig.serviceBase + '/File/GenerateTemplate?appId=' + appId + '&templateName=' + templateName).pipe(
        map(response => response.data));
  }

  checkinFile(hashKey: string, fileManagerType: FileManagerType) {
    const params = {
      fileManagerType: fileManagerType,
      hashKey: hashKey,
    };
    return this.httpClient.post(`${this.appConfig.serviceBase}/Drive/CheckInFile`, params,
      { headers: new HttpHeaders().set('Accept', 'application/json') });
  }

  discardCheckout(hashKeys: string[]) {
    return this.httpClient.request('DELETE', `${this.appConfig.serviceBase}/Drive/DiscardCheckInFiles`,
      { headers: new HttpHeaders().set('Accept', 'application/json'), body: hashKeys });
  }

  getTemplateDataUrl(appId: number, fileName: string, isCommon?: boolean) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        appId: appId,
        fileName: fileName,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = toQueryParams(params);
      return `${this.appConfig.absoluteServiceBase}/Drive/${isCommon ? 'GetCommonTemplateData' : 'GetTemplateData'}/?${qs}`;
    }));
  }

  getAttachmentDataUrlInMail(attachementId: string): Observable<string> {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        attachmentId: attachementId,
        dps_selected_database: this.authInfo.getSelectedDatabase(),
        access_token: token
      };
      const qs = toQueryParams(params);
      return `${this.appConfig.absoluteServiceBase}/Drive/GetAttachmentDataInMail/?${qs}`;
    }));
  }

  attachDriveFilesToMail(driveId: string, driveItems: string[], mailItemId: string) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Drive/AttachDriveFilesToMail',
      {
        mailItemId: { Id: mailItemId, ChangeKey: null },
        driveId: driveId, fileIds: driveItems
      }).pipe(
        map(response => response));
  }

  downloadMailAttachmentToOneDrive(driveId: string, parentFolderId: string, attachementIds: string[]) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Drive/UploadAttachmentDataInMail',
      {
        driveId: driveId,
        parentFolderId: parentFolderId,
        attachmentIds: attachementIds.map((id) => ({ id: id })),
        serviceBase: this.appConfig.serviceBase
      });
  }

  cleanCheckedOutFiles() {
    return this.httpClient.get(`${this.appConfig.serviceBase}/Drive/CleanCheckedOutFiles`);
  }

  getAttachementDownloadUrl(owner: string, itemId: string, attachmentId: string, att: FileAttachment, isEmail: boolean) {
    if (isEmail && !this.authInfo.isGoogle()) {

      if (attachmentId && attachmentId !== att.id) {
        return this.webViewService.getMailAttachementWebViewUrlForInlineAttachment(owner, itemId,
          attachmentId, 'eml', att.name, att['originalReference'])
          .pipe(map(url => url));
      }

      return this.createAttachemntRawContentPath(owner, itemId, att.id)
        .pipe(map(url => url));

    }
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      if (this.authInfo.isGoogle()) {
        return Base64().createObjectURL(att.contentBytes, att.contentType);
      }
      const params = {
        attachmentId: att.id, access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.serviceBase}/Drive/DownloadAttachmentDataInMail/?${qs}`;
    }));
  }

  getDiaryMsgAttachemntDownloadUrl(diaryId: number, fileName: string) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        diaryId: diaryId, access_token: token,
        fileName: fileName,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.serviceBase}/Drive/DownloadAttachmentDataInMsg/?${qs}`;
    }));
  }

  // to view browser compatible file types
  getAttachementDownloadView(att: FileAttachment) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        attachmentId: att.id, access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase(),
        downloadable: false, serviceBase: this.appConfig.serviceBase, timeZone: ''
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.serviceBase}/MailBox/GetAttachment/?${qs}`;
    }));
  }

  // fallback to aspose convertion, to remove in the future
  getAttachementConvertedUrl(att: FileAttachment) {
    const params = { attachmentId: att.id, downloadable: false, serviceBase: this.appConfig.serviceBase, timeZone: '' };
    const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
    const url = `${this.appConfig.serviceBase}/MailBox/GetAttachment/?${qs}`;
    return this.httpClient.get<{ data: string }>(url, { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(
      map(result => {
        return result.data;
      }));
  }

  // to view msg files as message model in attachements
  getMailBoxMSGAttachment(att: FileAttachment) {
    // if (itemId) {
    //   return this.httpClient.post<{ body: Message }>(
    //     `${this.appConfig.apiv3DocumentHandler}/Office365/Messages/ParseMessageAttachments/${att.name.split('.').pop()}`,
    //     { body: { itemId, attachmentId: att.id } }
    //   ).pipe(map(response => response.body));
    // }

    const params = { attachmentId: att.id, downloadable: false, serviceBase: this.appConfig.serviceBase, timeZone: '' };
    const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
    const url = `${this.appConfig.serviceBase}/MailBox/GetAttachment/?${qs}`;
    return this.httpClient.get<{ data: Message }>(url, { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(
      map(result => {
        return result.data;
      }));
  }

  public doCacheUrl(att: FileAttachment) {
    // NO need to cache any type of files since we don't have wopi or convertions
    return false;

    // return !Const.browserCompatibleExtentions.includes(getExtention(att.name).toLowerCase()) &&
    //   !Const.imageExtentions.includes(getExtention(att.name).toLowerCase());
  }

  public isCacheValid(urlCache: FileUrlCache) {

    // always invalidate cache since we don't cache


    // if (!!urlCache && !!urlCache.view) {
    //   if (!urlCache.ttl || (parseInt(urlCache.ttl, 10) - (new Date().getTime() / 1000)) > 120) {
    //     return true;
    //   }
    // }
    return false;
  }

  isSupportedFile(fileName) {
    return allSupportedExtentions.includes(getExtention(fileName).toLowerCase());
  }
  isV3CanViewFile(fileName) {
    return v3CanViewExtensions.includes(getExtention(fileName).toLowerCase());
  }
  isConvertionFile(fileName) {
    return wopiExtensions.includes(getExtention(fileName).toLowerCase());
  }

  deriveAttachmentUrl(att: FileAttachment): Observable<FileUrlCache> {
    if (wopiExtensions.includes(getExtention(att.name).toLowerCase())) {
      return this.getAttachmentDataUrlInMail(att.id).pipe(
        switchMap((url) => {
          return this.getAttachementDownloadUrl('me', null, null, att, false).pipe(map((downloadLink: string) => {
            return { view: url, ttl: null, download: downloadLink } as FileUrlCache;
          }));
        }));

    } else if (imageExtensions.includes(getExtention(att.name).toLowerCase())) {

      return combineLatest(this.getAttachementDownloadUrl('me', null, null, att, false),
        this.getAttachementDownloadView(att),
        (download, view) => {
          return { view: this.getImageHostUrl(view), ttl: null, download: download } as FileUrlCache;
        });

    } else if (browserCompatibleExtensions.includes(getExtention(att.name).toLowerCase())) {

      return combineLatest(this.getAttachementDownloadUrl('me', null, null, att, false),
        this.getAttachementDownloadView(att),
        (download, view) => {
          return { view: view, ttl: null, download: download } as FileUrlCache;
        });

    } else if (msgExtensions.includes(getExtention(att.name).toLowerCase())) {
      return combineLatest(this.getMailBoxMSGAttachment(att),
        this.getAttachementDownloadUrl('me', null, null, att, false),
        (url, download) => {
          return { view: url, ttl: null, download: download } as FileUrlCache;
        }
      );
    } else {
      // this is the aspos convertion
      return combineLatest(this.getAttachementConvertedUrl(att),
        this.getAttachementDownloadUrl('me', null, null, att, false),
        (url, download) => {
          return { view: url, ttl: null, download: download } as FileUrlCache;
        }
      );
    }
  }

  // getDpsFileUrlByDiaryEntryFile(infor: DiaryEntryFileInfo, mode: string = 'view') {
  //   if (this.isGoogle) {
  //     const params = {
  //       diaryId: infor.diaryId,
  //       leatterName: infor.fileName,
  //     };
  //     return this.httpClient.post<DocumentLink>(`${this.appConfig.serviceBase}/GoogleFile/GetDpsFileUrlWithDiaryEntry`, params,
  //       { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(map((data: any) => data.data));
  //   } else {
  //     const params = {
  //       diaryId: infor.diaryId,
  //       fileName: infor.fileName,
  //       password: infor.password,
  //       wopiActionType: mode
  //     };
  //     return this.httpClient.post<DocumentLink>(`${this.appConfig.wopiBase}/Link/GetDpsFileUrlWithDiaryEntry`, params,
  //       { headers: new HttpHeaders().set('Accept', 'application/json') });
  //   }
  // }

  // new drive change
  // getDpsFileUrlByDiaryEntryFile(request: any, mode: string = Const.FileOpenType.View) {
  //   const params = {
  //     diaryId: request.diaryId,
  //     fileUrlType: mode
  //   };
  //   return this.httpClient.post(`${this.appConfig.serviceBase}/Drive/GetDpsFileUrlWithDiaryEntry`, params,
  //     { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(
  //       map((data: any) => {
  //         if (mode === Const.FileOpenType.Edit) {
  //           try {
  //             const temp = DocumentCheckin.create(data.data, Const.FileManagerType.FileWithDiaryEntryManager, this.injector);
  //             return temp;
  //           } catch (e) {
  //             console.log(e);
  //           }
  //         }
  //         return data.data;
  //       }));
  // }

  // getWopiHostUrl(url: string, accessToken: string, tokenTtl: string) {
  //   if (this.isGoogle) {
  //     return of(url);
  //   } else {
  //     const params = { wopi_url: url, at: accessToken, ttl: tokenTtl };
  //     const qs = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
  //     return of(`/assets/wopi-host.html?${qs}`);
  //   }
  // }

  // getWorkFlowDocumentUrl(request: ViewOutputDocumentRequest, mode: string = 'edit') {
  //   const params = {
  //     branchId: request.branchId,
  //     appId: request.appId,
  //     fileId: request.fileNumber,
  //     fileName: request.letterName,
  //     fileUrlType: mode,
  //     // access_token: token
  //   };
  //   return this.httpClient.post<any>(`${this.appConfig.serviceBase}/Drive/GetDpsFileUrlWithOutDiaryEntry`, params,
  //     { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(
  //       map(linkInfo => {
  //         return DocumentCheckin.create(linkInfo.data, Const.FileManagerType.FileWithOutDiaryEntryManager, this.injector);
  //       }));
  // }

  // use in workflow in case we have unsupported files:
  getWorkFlowConversionUrl(request: ViewOutputDocumentRequest) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(switchMap((token) => {
      const params = {
        branchId: request.branchId,
        appId: request.appId,
        fileId: request.fileNumber,
        letterName: request.letterName,
        downloadable: false,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return this.httpClient.get<{ data: string }>(`${this.appConfig.serviceBase}/File/GetDpsFileWithoutDiaryEntry/?${qs}`,
        { headers: new HttpHeaders().set('Accept', 'application/json') });
    }));
  }

  getSignAndSendPDFDocumentUrl(diaryId: number, signToken: string) {
    // return this.authInfo.acquireDpsWebServiceToken().map((token) => {
    return this.authInfo.getPDFViewerJwtToken().pipe(map((token) => {
      const params = {
        diaryId: diaryId,
        access_token: token,
        signature_token: signToken
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.pdfviwer}/SingAndSend?${qs}`;
      // return `http://localhost:52102/SingAndSend?${qs}`;
    }));
  }
  getBillingGuideReportUrl2(request: BillingGuideViewModel) {


    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        branchId: request.caseFileIdentityWithAppIdViewModel.branchId,
        appId: request.caseFileIdentityWithAppIdViewModel.appId,
        fileId: request.caseFileIdentityWithAppIdViewModel.fileId,
        matterRef: request.matterRef,
        fromDate: request.fromDate,
        toDate: request.toDate,
        activity: request.activity,
        clientName: request.clientName,
        analysisType: request.analysisType,
        sortBy: request.billingGuideSortBy,
        showTime: request.billingGuideShowTime,
        chkFeeEarner: request.chkFeeEarner,
        chkType: request.chkType,
        chkActivity: request.chkActivity,
        chkHideZeroValues: request.chkHideZeroValues,
        chkBillingSummaryReport: request.chkBillingSummaryReport,
        chkIncludeDisbursement: request.chkIncludeDisbursement,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      // window.location.origin +
      return window.location.origin + `${this.appConfig.serviceBase}/EChit/GetBillingGuideReport/?${qs}`;
    }));

  }



  getGlobalSearchDocumentUrl(request: GridDocumentData) {
    // return this.authInfo.acquireDpsWebServiceToken().map((token) => {
    return this.authInfo.getPDFViewerJwtToken().pipe(map((token) => {
      let highlights = '';
      if (request.highlights && request.highlights.content) {
        request.highlights.content.forEach((val, i) => {
          highlights += val + (i === (request.highlights.content.length - 1) ? '' : '&highlightKeys=');
        });
      }
      const params = {
        token: request.token,
        highlightKeys: highlights || null,
        access_token: token
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.pdfviwer}/GlobalSearch?${qs}`;
      //  return `http://localhost:52102/GlobalSearch?${qs}`;
    }));
  }


  getLedgerCardPrintReportUrl(request: MatterData, allGridFilterData: AllGridFilterModel) {

    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        // view model
        matRef: request.matterReferenceNo,
        matterDetails: request.matterDetails,
        clientRef: request.clientRef,
        clientDetails: request.clientName,
        branchRef: request.branchID,
        branchDetails: request.branchName,
        fE: request.feeEarner,
        closeDate: request.closed > 0 ? request.closedDate : '',
        showDDA: allGridFilterData.showDDA,
        showCOS: allGridFilterData.showCOS,
        showReversal: allGridFilterData.showReversal,
        hideSystemBills: allGridFilterData.showSysBills,
        showOnlyOfficeTrans: allGridFilterData.showOnlyOfficeTrans,
        showOnlyDisbuersements: allGridFilterData.showOnlyDisbuersements,
        period: allGridFilterData.showTransPeriods,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      // window.location.origin +
      return window.location.origin + `${this.appConfig.serviceBase}/LedgerCard/LedgerCardPrint/?${qs}`;
    }));

  }
  getDocumentURLWithoutDiaryEntry(request: GetPDFURL) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        branchId: request.branchId,
        appId: request.appId,
        fileId: request.fileId,
        letterName: request.letterName,
        downloadable: false,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return window.location.origin + `${this.appConfig.serviceBase}/File/GetDpsFileWithoutDiaryEntry/?${qs}`;
    }));

  }


  getPostOfficeDocumentUrl(inbox: number) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        inboxId: inbox,
        access_token: token,
        downloadable: false,
        dps_selected_database: this.authInfo.getSelectedDatabase(),
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      // window.location.origin +
      return window.location.origin + `${this.appConfig.serviceBase}/PostOffice/GetPostOfficeFile/?${qs}`;
    }));
  }




  getBillingGuideReportUrl(request: BillingGuideViewModel) {
    // diaryId: Number, letterName: string, fileName: string, password: string, downloadable, wopiActionType: string
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        activity: request.activity,
        fromDate: request.fromDate,
        toDate: request.toDate,
        clientName: request.clientName,
        matterRef: request.matterRef,
        analysisType: request.analysisType,
        billingGuideSortBy: request.billingGuideSortBy,
        billingGuideShowTime: request.billingGuideShowTime,
        chkFeeEarner: request.chkFeeEarner,
        chkActivity: request.chkActivity,
        chkType: request.chkType,
        chkHideZeroValues: request.chkHideZeroValues,
        chkBillingSummaryReport: request.chkBillingSummaryReport,
        chkIncludeDisbursement: request.chkIncludeDisbursement,

      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return window.location.origin + `${this.appConfig.serviceBase}/EChit/GetBillingGuideReport/?${qs}`;
    }));
  }

  getImageHostUrl(url: string) {
    const params = { url: url };
    const qs = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
    return `/assets/image-viwer.html?${qs}`;
  }

  getPdfViwerUrl(url: string) {
    const params = { url: url };
    const qs = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&');
    return `/assets/pdf-viwer.html?${qs}`;
  }

  getEditablePDFUrl(fileInfo: string) {
    // return this.authInfo.acquireDpsWebServiceToken().map((token) => {
    return this.authInfo.getPDFViewerJwtToken().pipe(map((token) => {
      const params = {
        info: fileInfo,
        access_token: token,
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.pdfviwer}/PDF?${qs}`;
    }));
  }

  getEditablePDFUrlByLetterName(branchId: number, appId: number, fileId: number, letterName: string) {
    // return this.authInfo.acquireDpsWebServiceToken().map((token) => {
    return this.authInfo.getPDFViewerJwtToken().pipe(map((token) => {
      const params = {
        branchId: branchId,
        appId: appId,
        fileId: fileId,
        letterName: letterName,
        access_token: token,
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.pdfviwer}/PDFDocumentEdit?${qs}`;
    }));
  }

  getTemplateDownloadUrl(data: { appId: string, templateName: string, convertToDocx: boolean }) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        appId: data.appId, access_token: token, templateName: data.templateName,
        downloadable: true, convertToDocx: data.convertToDocx,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.serviceBase}/File/GetDpsTemplate/?${qs}`;
    }));
  }

  downloadTemplateData(appId: number, fileName: string, isCommon: boolean) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        appId, access_token: token, fileName,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.serviceBase}/Drive/${isCommon ? 'DownloadCommonTemplateData' : 'DownloadTemplateData'}/?${qs}`;
    }));
  }


  mapAccessTokenOnly(url: string) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return `${this.appConfig.serviceBase + url}?${qs}`;
    }));
  }

  getEChiteportReportWithpath(path: any) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        dps_selected_database: this.authInfo.getSelectedDatabase(),
        access_token: token,
        path: path,
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      // window.location.origin +
      return `${this.appConfig.serviceBase}/EChit/GetEChitReportFromPath/?${qs}`;
    }));
  }

  getMsgAttacmentData(url: string) {
    return this.httpClient.get<any>(`${url}`,
      { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(
        map(result => result));
  }


  public downloadDPSFileToOneDrive(diaryId: number, name: string): Observable<any> {
    return this.getSharedPersonalDownloadFolder(name).pipe(switchMap(item => {
      return this.httpClient.post<any>(this.appConfig.serviceBase + '/Drive/UploadDpsFileDataWithDiaryEntry',
        {
          DriveId: item.parentReference.driveId,
          ParentFolderId: item.id,
          DiaryId: diaryId
        });
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
        return this.getPersonalFolder(name, drive.id).pipe(switchMap((item: DriveItem) => this.getDownloadFolder(name, item.id, drive.id)));
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


  getBundleViewLogFileUrl(bundleID: number) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        bundleID: bundleID,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return window.location.origin + `${this.appConfig.serviceBase}/PDFBundle/GetPdfLogFile/?${qs}`;
    }));
  }

  getOppertunityLogFile(id: number) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        opportunityTransId: id,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return window.location.origin + `${this.appConfig.serviceBase}/Opportunity/GetOpportunityFile/?${qs}`;
    }));
  }
  getChitAuthorisationsLogFile(supplierRef: string, fileName: string) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        supplierRef: supplierRef,
        fileName: fileName,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      return window.location.origin + `${this.appConfig.serviceBase}/Drive/GetEchitSupplierFileData/?${qs}`;
    }));
  }

  getTeamTalkPDFUrl(jobId: number) {

    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        jobId: jobId,
        access_token: token,
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      // window.location.origin +
      return window.location.origin + `${this.appConfig.serviceBase}/dictation/GetTeamTalkFile/?${qs}`;
    }));
  }
  downloadMSGFileToCloud(diaryId: number | string, fileName: string, userName: string) {
    return this.getSharedPersonalDownloadFolder(userName).pipe(switchMap(item => {
      return this.httpClient.post<any>(this.appConfig.serviceBase + '/Drive/UploadAttachmentDataInMsg',
        {
          diaryId: diaryId,
          fileName: fileName,
          driveId: item.parentReference.driveId,
          parentFolderId: item.id,
        });
    }));
  }

  public getDraftMailId(diaryUID: any, password: string, type: ReplyForwardType): Observable<MsgReplyResponse> {
    const params = new HttpParams({
      fromObject: {
        diaryId: diaryUID,
        password: password,
      }
    });
    if (type === 'createForward') {
      return this.httpClient.post<any>(`${this.appConfig.serviceBase}/MailBox/CreateForwardForDPSFile`,
        { DiaryId: diaryUID, Password: password }).pipe(
          map(response => response.data));
    } else {
      return this.httpClient.post<any>(`${this.appConfig.serviceBase}/MailBox/CreateReplyForDPSFile`,
        { DiaryId: diaryUID, Password: password }).pipe(
          map(response => response.data));
    }

  }

  public getMailItem(id: string): Observable<Message> {
    if (this.authInfo.isGoogle()) {
      return from(this.getDraftGmail(id)).pipe(map((res: any) => res));
    }
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/me/messages/${id}`)
        .get().pipe(map(result => result))
    ));
  }

  public updateMailItem(id: string, message: Message, _massage: Message): Observable<boolean> {
    if (this.authInfo.isGoogle()) {
      return from(this.updateGmail({ ..._massage, body: message.body })).pipe(map((res: any) => res));
    }
    return this.getAuthClient().pipe(switchMap(client =>
      client.api(`/me/messages/${id}`)
        .patch(message).pipe(map(result => {
          return true;
        }))
    ));
  }
  public getDraftGmail(id: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      const request = gapi.client.gmail.users.drafts.get({
        'userId': 'me',
        'id': id,
        'format': 'raw'
      });
      return request.execute((resp) => {
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

  getPreviousTransPrintReportUrl(request: MatterData) {
    return this.authInfo.acquireDpsWebServiceToken().pipe(map((token) => {
      const params = {
        matterRef: request.matterReferenceNo,
        access_token: token,
        dps_selected_database: this.authInfo.getSelectedDatabase()
      };
      const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
      // window.location.origin +
      return window.location.origin + `${this.appConfig.serviceBase}/LedgerCard/LedgerPreviousTransDataPrint/?${qs}`;
    }));

  }
}
