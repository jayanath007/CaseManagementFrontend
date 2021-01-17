import { switchMap, tap, take, map, catchError, distinctUntilKeyChanged } from 'rxjs/operators';
import { SaveLinkedLettersScreenComponent } from '../components/save-linked-letters-screen/save-linked-letters-screen.component';


import { Injectable, Inject } from '@angular/core';
import { Observable, from as fromPromise, of, Subject, empty, from } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import {
  OpenByUrl, FileUrlResolverService, GetPDFURL, IDocumentCheckin, OpenByOfficeUriSchemes
} from '../../document-view';
import { fitWindow } from '../../utils/bounds';
import { SESSION_TOKEN } from '../../core/lib/workflow-tokens';
import * as _ from 'lodash';
import { MatterLinkedType } from './../../matter-linked-core';
import {
  UIContext, MessageBoxMediator, DialogResult, UserScreenResult, UserScreenMediator,
  LinkedLettersMediator,
  LinkedLettersScreenResult,
  ComposeEmailMediator,
  ShowXMmenuRequest,
  InputBoxMediator,
  InputBoxResult,
  PostCodeMatchingPopupMediator,
  OptionDialogBoxMediator,
  OptionDialogResult,
  DiaryScreenMediator,
  DiaryScreenResult,
  TemplateSession,
  ViewOutputDocumentRequest,
  ContactSearchMediator,
  BaseWorkflowSession,
  LoadPdfViewerRequest,
  ShowEmailRequest, LinkedLettersSaveConfirmMediator, ShowEChitScreenResult, ShowEChitScreenMediator,
  ShareScreenMediator,
  ShareScreenResult,
  PlotSyncMediator,
  CDS7ReportDialogBoxResponse,
  CDS7ReportScreenMediator

} from '../../workflow-core';

import { MessageBoxComponent } from '../components/message-box/message-box.component';
import { InputBoxComponent } from '../components/input-box/input-box.component';
import { OptionBoxComponent } from '../components/option-box/option-box.component';
import { PostCodeMatchingBoxComponent } from '../components/post-code-matching-box/post-code-matching-box.component';
import { ShowLinkedLettersScreenComponent } from '../components/show-linked-letters-screen/show-linked-letters-screen.component';
import { Message, Recipient } from '../../core/lib/microsoft-graph';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { LegalAid, SubmitType } from '../../add-note-core';
import { AddNoteInPutData, AddNoteCloseInfo, AddNoteItemsType } from '../../core/lib/addNote';
import { getExtention } from '../../utils/file';
import { uuid } from '../../utils/uuid';
import { AuthInfoStateService, getUser } from '../../auth';
import {
  MsgraphClientBase, LocalStorageKey, AppConfig, ApiClientWrapper, WorkflowXmCommondExecuted,
  browserCompatibleExtensions, imageExtensions, wopiExtensions
} from '../../core';
import { HttpClient } from '@angular/common/http';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { InforDialogComponent, InforDialogData, SemaphoresService } from '../../shared';
import { WorkflowSessionManagerService } from './workflow-session-manager.service';
import { EChitPopupInputType } from '../../e-chit-core/models/enum';
import { InputData } from '../../email-list-core';
import { MatterSearchGridData } from './../../core/lib/matter';
import { MatterDataInput } from '../../matter-linked-core/models/interfaces';
import { OfficeUriSchemes } from '../../core/lib/office-uri-schemes';
import { getDefaultMessageFormat, getMessageString } from '../../utils/organizer';
import { Mime } from '../../utils/mime-message';
import { CDS7CloseInfo } from '../../cds7-report-info-core/models/cds7-report-info';

declare var gapi;

@Injectable()
export class GenericUiContextService implements UIContext {
  constructor(private dialog: MatDialog, private store: Store<any>,
    @Inject(SESSION_TOKEN) private token: string, private urlPopupService: UrlPopupService,
    private popupService: SystemJsPopupLoaderService, private urlResolver: FileUrlResolverService,
    private sessionManager: WorkflowSessionManagerService,
    private authInfo: AuthInfoStateService, private httpClient: HttpClient,
    private configs: ServiceEndpointConfig, private appConfig: AppConfig, private semaphoresService: SemaphoresService) {
  }
  private msGraphClient: MsgraphClientBase = null;
  public documetLoaded = new Subject<{ session: TemplateSession, url: string }>();
  private documentUrl: string;
  private docCheckin: IDocumentCheckin;
  public confirmSave = new Subject<DialogResult>();

  public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
    if (!this.msGraphClient) {
      this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
    }
    return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
  }

  public showMessageBox(mediator: MessageBoxMediator): Observable<{ dialogResult: DialogResult, isReply: boolean }> {
    const dialogData = {
      mediator: mediator
    };
    const dialogRef = this.dialog.open(MessageBoxComponent, {
      data: dialogData,
      width: '350px',
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    return dialogRef.afterClosed();
  }

  showUserScreen(medator: UserScreenMediator): Observable<UserScreenResult> {
    const token = 'screenView' + uuid();
    return this.popupService.openScreenView(token, medator);
  }

  showLinkedLettersScreen(mediator: LinkedLettersMediator): Observable<LinkedLettersScreenResult> {
    const dialogData = {
      mediator: mediator
    };
    const dialogRef = this.dialog.open(ShowLinkedLettersScreenComponent, {
      data: dialogData,
      width: '500px',
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    return dialogRef.afterClosed();
  }

  showListLetterSaveButton(mediator: LinkedLettersSaveConfirmMediator): Observable<DialogResult> {
    const dialogData = {
      mediator: mediator
    };
    const dialogRef = this.dialog.open(SaveLinkedLettersScreenComponent, {
      data: dialogData,
      width: '615px',
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    return dialogRef.afterClosed();
  }

  showComposeEmailPopup(mediator: ComposeEmailMediator): void {
    from(mediator.ready()).pipe(
      switchMap(item => this.store.select(getUser).pipe(take(1), map(user => ({ item, messageFormat: user.messageFormat }))))
    ).subscribe(({ item, messageFormat }) => {
      const body = getDefaultMessageFormat(messageFormat);
      const toRecipients: Recipient[] = item.toRecipients ? item.toRecipients.map(val => {
        return { emailAddress: { address: val } };
      }) : [];
      const ccRecipients: Recipient[] = item.cCRecipients ? item.cCRecipients.map(val => {
        return { emailAddress: { address: val } };
      }) : [];
      const bccRecipients: Recipient[] = item.bCCRecipients ? item.bCCRecipients.map(val => {
        return { emailAddress: { address: val } };
      }) : [];
      const itemId = item.id ? item.id.replace(/\+/g, '_').replace(/\//g, '-') : undefined;
      if (itemId) {
        if (this.authInfo.isGoogle()) {
          this.showCompseWithEmailList(item, itemId);
        } else {
          const message: Partial<Message> = {
            id: itemId,
            body: {
              content: body + item.body,
              contentType: 'html'
            }
          };
          this.updateMailItem(itemId, message, item.attachments)
            .subscribe(data => {
              this.showCompseWithEmailList(item, itemId);
            });
        }
      } else {
        const message: Partial<Message> = {
          hasAttachments: item.attachments ? true : false,
          subject: item.subject,
          body: {
            content: body + item.body,
            contentType: 'html'
          },
          toRecipients: toRecipients,
          ccRecipients: ccRecipients,
          bccRecipients: bccRecipients,
          attachments: item.attachments
        };
        this.createItem(message)
          .subscribe(data => {
            this.showCompseWithEmailList(item, data.id);
          });
      }
    });
  }

  showEmailUrlPopup(id) {
    const encodeId = encodeURIComponent(id);
    const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
    this.urlPopupService.openWithUrlPoup(urlPath, id, false, false);
  }
  getEmailLookupList(dataViewModel) {
    return this.httpClient.post<any>(this.appConfig.serviceBase + '/Contacts/GetEmailLookupList', dataViewModel).pipe(
      map(response => response.data));
  }
  showCompseWithEmailList(item: ShowEmailRequest, itemId: string) {
    if (item.lookupID > 0) {
      const dataViewModel = {
        AppId: item.appID,
        BranchId: item.branchID,
        FileId: item.fileID,
        LookupId: item.lookupID
      };
      this.getEmailLookupList(dataViewModel).subscribe(data => {
        if (data) {
          localStorage.setItem(
            LocalStorageKey.SECommandEmailList,
            JSON.stringify(data.filter(val => !!val.email).map(val => {
              return { contactType: val.contactType, recipient: { emailAddress: { address: val.email, name: val.name || val.email } } };
            }))
          );
        }
        this.showEmailUrlPopup(itemId);
      });
    } else {
      this.showEmailUrlPopup(itemId);
    }

  }

  public createItem(message?: Message): Observable<Message> {
    if (this.authInfo.isGoogle()) {
      return fromPromise(this.createGmail(message)).pipe(map((res: any) => res));
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

  public updateMailItem(id: string, message: Message, attachments: any[], isSuppressErrors?: boolean): Observable<Message> {
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

  showXMmenu(session: BaseWorkflowSession, initData: ShowXMmenuRequest): void {
    this.store.dispatch(new WorkflowXmCommondExecuted(initData.menuName, this.token));
  }

  showInputBox(mediator: InputBoxMediator): Observable<InputBoxResult> {
    const dialogData = {
      mediator: mediator
    };

    const dialogRef = this.dialog.open(InputBoxComponent, {
      data: dialogData,
      width: '350px',
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });

    return dialogRef.afterClosed();
  }

  showPostCodeMatchingPopup(mediator: PostCodeMatchingPopupMediator): Observable<InputBoxResult> {
    const dialogData = {
      mediator: mediator
    };

    const dialogRef = this.dialog.open(PostCodeMatchingBoxComponent, {
      data: dialogData,
      width: '650px',
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });

    return dialogRef.afterClosed();
  }

  showOptionDialogBox(mediator: OptionDialogBoxMediator): Observable<OptionDialogResult> {
    const dialogData = {
      mediator: mediator
    };
    const dialogRef = this.dialog.open(OptionBoxComponent, {
      data: dialogData,
      width: '450px',
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'

    });
    return dialogRef.afterClosed();
  }

  showDiaryScreen(mediator: DiaryScreenMediator): Observable<DiaryScreenResult> {
    return fromPromise(mediator.ready().then(item => {
      const input: AddNoteInPutData = {
        isEdit: false,
        matterData: {
          MatterReferenceNo: item.matterRef,
          BranchID: item.branchId,
          AppID: item.appId,
          ClientName: '',
          RateCategory: null,
          FileID: item.fileId,
          AppCode: item.appCode,
          FeeEarner: item.feeEarner,
          eBilling: item.eBilling,
          isPlotMasterMatter: item.isMasterMatter,
          isProspectMatter: item.isProspectMatter,
          isLegalAid: item.isLegalAid
        },
        diaryType: Number(item.diaryRecType),
        legalAid: LegalAid.NotLegalAid,
        addNoteItemsType: AddNoteItemsType.LetterEnginItems,
        letterEnginItemList: [item],
      };
      return input;
    })).pipe(
      switchMap(data =>
        this.popupService.openAddNotePopup('letterEngingAddNotePopUp', data)
      ),
      map(data => {
        if (data === AddNoteCloseInfo.ExitWithSaveSuccess) {
          return ({ dialogResult: DialogResult.Ok });
        } else {
          return ({ dialogResult: DialogResult.Cancel });
        }
      }),
      switchMap((result) => {
        if (result.dialogResult !== DialogResult.Ok && this.docCheckin && this.docCheckin.hashKey && this.docCheckin.hashKey !== '') {
          return this.urlResolver.discardCheckout([this.docCheckin.hashKey]).pipe(map(() => result), catchError(() => of(result)));
        }
        return of(result);
      }),
      tap(
        () => {
          this.docCheckin = null;
          mediator.destroy();
        })
    );
  }

  showEChitScreenScreen(mediator: ShowEChitScreenMediator): Observable<ShowEChitScreenResult> {
    return fromPromise(mediator.ready().then(item => {
      return { type: EChitPopupInputType.Workflow, data: item };
    })).pipe(
      switchMap(data =>
        this.popupService.openEChitPopup('eChitPopupActor', data)
      ),
      map((data: any) => {
        // return ({ dialogResult: DialogResult.Ok , data : data });
        if (data.action === AddNoteCloseInfo.ExitWithSaveSuccess) {
          return ({ dialogResult: DialogResult.Ok, data: data.data });
        } else {
          return ({ dialogResult: DialogResult.Cancel, data: null });
        }
      }),
      tap(() => mediator.destroy()));
  }



  // abstract showEChitScreenScreen(mediator: Mediators.ShowEChitScreenMediator): Observable<Messages.ShowEChitScreenResult>;








  viewDocument(session: TemplateSession, initData: ViewOutputDocumentRequest) {
    const extention = getExtention(initData.letterName).toLowerCase();
    // const extention = 'pdf';
    if (wopiExtensions.includes(extention)) {

      this.urlResolver.checkOutFileWithOutDiaryEntry(initData.branchId, initData.appId, initData.fileNumber, initData.letterName)
        .subscribe(docInfo => {
          this.documentUrl = this.loadWebpage(this.handleRelativeUrl(docInfo.url), docInfo.name, docInfo.path);
          this.docCheckin = docInfo;
          this.documetLoaded.next({ session: session, url: this.documentUrl });
        });

    } else if (browserCompatibleExtensions.includes(extention)) {
      const request: GetPDFURL = {
        branchId: initData.branchId,
        appId: initData.appId,
        fileId: initData.fileNumber,
        letterName: initData.letterName,
        downloadable: false,
      };
      this.urlResolver.getDocumentURLWithoutDiaryEntry(request)
        .subscribe(link => {
          if (imageExtensions.includes(extention)) {
            link = this.urlResolver.getImageHostUrl(link);
          }
          this.documentUrl = this.loadWebpage(this.handleRelativeUrl(link), null, null);
          this.documetLoaded.next({ session: session, url: this.documentUrl });
        });

    } else if (extention) {
      this.urlResolver.getWorkFlowConversionUrl(initData)
        .subscribe(link => {
          this.documentUrl = this.loadWebpage(this.handleRelativeUrl(link.data), null, null);
          this.documetLoaded.next({ session: session, url: this.documentUrl });
        });
    } else {
      this.documetLoaded.next({ session: session, url: null });
    }
    return null;
  }

  showContactSearchScreen<TResult, TCallbackData>(mediator: ContactSearchMediator,
    callbackData: TCallbackData): Observable<TResult> {
    return fromPromise(mediator.ready().then((item) => {
      const searchParams = <any>callbackData;
      const params = { ...searchParams, contactLockedPermission: item.contactLockedPermission };
      return params;
    })).pipe(
      switchMap((data) => {
        console.log(data);
        return this.popupService.openContactSearchPoup(data.token, data);
      }),
      tap(() => mediator.destroy()));
  }

  confirmSaveToDiary(session: BaseWorkflowSession): Observable<DialogResult> {
    return this.confirmSave.pipe(
      map(result => ({ result, hashKey: (this.docCheckin && this.docCheckin.hashKey) ? this.docCheckin.hashKey : uuid() })),
      distinctUntilKeyChanged('hashKey'),
      switchMap(({ result }) => {
        if (!this.docCheckin || !this.docCheckin.hashKey || this.docCheckin.hashKey === '') {
          return of(result);
        }

        if (result !== DialogResult.Yes) {
          return this.urlResolver.discardCheckout([this.docCheckin.hashKey]).pipe(map(() => result), catchError(() => of(result)));
        } else {
          return this.urlResolver.checkinFile(this.docCheckin.hashKey, this.docCheckin.fileManagerType)
            .pipe(map(() => result), catchError(() => of(result)));
        }
      }));
  }

  onRemoteWorkerReady(session: BaseWorkflowSession) {
    console.log('Workflow Worker Ready');
  }

  private handleRelativeUrl(url: string) {
    if (!url) {
      return;
    }

    if (!url.startsWith('http')) {
      console.log('DocLink', url);
      url = location.origin + `${url}`;
    }

    return url;
  }

  loadWebpage(url: string, name: string, parentReferencePath: string) {
    if (!url.startsWith('http')) {
      url = 'http://' + url;
    }
    this.openUrl(url, name, parentReferencePath);
    return url;
  }

  openCurrentDocument() {
    if (this.documentUrl) {
      if (this.docCheckin) {
        this.openUrl(this.documentUrl, this.docCheckin.name, this.docCheckin.path);
      } else {
        this.openUrl(this.documentUrl, null, null);
      }
    }
  }

  private openUrl(url: string, name: string, parentReferencePath: string) {
    if (localStorage.getItem(LocalStorageKey.DocumentOpenType) === 'Descktop Office') {
      const schemes = new OfficeUriSchemes(url, name, parentReferencePath);
      if (schemes.getSchemeName()) {
        this.store.dispatch(new OpenByOfficeUriSchemes(schemes, true));
        return;
      }

    }
    this.store.dispatch(new OpenByUrl({ url: url, id: url, spec: { ...fitWindow() }, attachmentName: '' }));
  }

  // public createItem(message?: Message): Observable<Message> {
  //   return this.getAuthClient().switchMap(client =>
  //     client.api(`/me/messages`)
  //       .post(message ? message : {}).map(result => {
  //         return result;
  //       })
  //   );
  // }

  public loadPdfViwer(fileInfo: LoadPdfViewerRequest) {
    if (fileInfo) {
      this.urlResolver.getEditablePDFUrl(fileInfo.pdfOutputPathwithFilename).pipe(take(1))
        .subscribe(link => this.loadWebpage(this.handleRelativeUrl(link), null, null));
    }
  }

  public showError(msg: any) {
    if (!!msg && !_.isString(msg)) {
      if (msg.toString) {
        msg = msg.toString();
      } else {
        try {
          msg = JSON.stringify(msg);
        } catch (e) {
          msg = 'Unkown error occurred';
          console.error(msg);
        }
      }
    }



    const dialogData: InforDialogData = {
      content: {
        title: 'Workflow Error!',
        message: msg
      },
      contentParams: {},
      data: { messageType: 'warning' }
    };

    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });

    return dialogRef.afterClosed();
  }

  public sessionPreStart(session: BaseWorkflowSession): void {
    this.documentUrl = null;
  }

  public getCommonTemplateMetadata() {
    return this.sessionManager.commonTemplateData;
  }

  public showShareScreen(mediator: ShareScreenMediator):
    Observable<{ dialogResult: DialogResult, result: ShareScreenResult }> {

    return fromPromise(mediator.ready().then(item => {
      const inputData: InputData = {
        signTokens: null,
        fileCredentials: null,
        safeBoxFileList: null,
        subjectNote: '',
        submitType: SubmitType.WorkflowShare,
        url: null,
        matterData: {
          MatterReferenceNo: null,
          FileID: item.caseFileIdentityWithAppIdRequest.fileId,
          AppCode: null,
          AppID: item.caseFileIdentityWithAppIdRequest.appId,
          BranchID: item.caseFileIdentityWithAppIdRequest.branchId,
          ClientName: null,
          RateCategory: null,
          FeeEarner: null,
          eBilling: item.eBilling,
          message: 'Please complete this information and submit',
          reviewNote: item.reviewNote,
          isPlotMasterMatter: item.isPlotMasterMatter,
          isProspectMatter: item.isProspectMatter,
          isLegalAid: item.isLegalAid
        }
      };
      return inputData;
    })).pipe(
      switchMap(data => {
        return this.popupService.openEmailListPopup('workflowEMailList', data);
      }),
      map((data: any) => {
        if (data) {
          return ({
            dialogResult: DialogResult.Ok,
            result: {
              message: data.message,
              reviewNote: data.reviewNote,
              reviewDate: data.reviewDate,
              selectedEmailList: data.toRecipients.concat(data.ccRecipients),
              shareScreenOption: 'MLS' // do not ahve other option s supported yet
            }
          });
        }
        return ({
          dialogResult: DialogResult.Ignore,
          result: <any>{}
        });
      }),
      tap(() => mediator.destroy()));
  }


  showPlotSyncPopup(mediator: PlotSyncMediator) {
    mediator.ready().then(item => {
      const matterDataTemp: MatterDataInput = {
        appId: item.caseFileIdentityWithAppIdRequest.appId,
        fileID: item.caseFileIdentityWithAppIdRequest.fileId,
        branchID: item.caseFileIdentityWithAppIdRequest.branchId,
        isPlotMasterMatter: true
      };
      this.popupService.openMatterLinkedPopup('workflow', item.matterRef,
        MatterLinkedType.WorkFlow, 'Linked Plots', matterDataTemp, item.screenId)
        .subscribe((result: any) => {
          if (!result) {
            return '';
          }
        });
    });
  }
  showLinkedMatterSyncPopup(data: any, matterData: MatterSearchGridData, title: string): Observable<any> {
    console.log('show linked matter sync popup', data);
    // TODO check the isMasterMatter flag
    if (matterData && matterData.isPlotMasterMatter) {
      const matterDataTemp: MatterDataInput = {
        appId: matterData.appID,
        fileID: matterData.fileID,
        branchID: matterData.branchID,
        isPlotMasterMatter: matterData.isPlotMasterMatter
      };
      // load show the matter linked popup
      this.popupService.openMatterLinkedPopup('workflow', matterData.matterReferenceNo,
        MatterLinkedType.WorkFlow, title, matterDataTemp, data.atN_Command)
        .subscribe((result: any) => {     // screen ID is data.atN_Command
          if (!result) {
            return '';
          }
        });
    }
    // call the Workflow/SavePlotSaleScreenData actions
    // return a observable
    return empty();
  }

  openCDS7ReportInfoPopup(mediator: CDS7ReportScreenMediator): Observable<CDS7ReportDialogBoxResponse> {
    return fromPromise(mediator.ready().then(item => {
      return { fileId: item.fileId, branchId: item.branchId, classId: item.classId };
    })).pipe(
      switchMap(data =>
        this.popupService.openCds7ReportInfoPopup(`cds7ReportInfo-fileId:${data.fileId}`, data)
      ),
      map((data: any) => {
        if (data.action === CDS7CloseInfo.ExitWithSaveSuccess) {
          return ({ dialogResult: DialogResult.Ok, data: data.data });
        } else {
          return ({ dialogResult: DialogResult.Cancel, data: null });
        }
      }),
      tap(() => mediator.destroy()));
  }
}
