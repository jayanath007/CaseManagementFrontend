import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ComponentBase } from '../../../core/lib/component-base';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Injector, HostListener } from '@angular/core';
import * as OpenCaseCore from '../../../open-case-core';
import { MatterInfo, eBillingType } from '../../../core/lib/matter';
import { AddNoteInPutData, AddNoteCloseInfo } from '../../../core/lib/addNote';
import { DiaryRecType, LegalAid } from '../../../add-note-core';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { OpenCaseMenueData } from '../../../core/lib/open-case';
import { User } from '../../../auth';
import { getGroupModeByToken, getSelectedAttachmentsByToken, getIsSearchFullTextByToken } from '../../../file-history-core/reducers/index';
import { LedgerCardInput } from '../../../core/lib/ledger-card';
import { WorkflowInputData } from '../../../workflow-rule-core/models/interfaces';
import { MenusUserAction } from '../../../core/lib/workflow';
import {
  WorkFlowUserAction, RefreshWorkFlowMenu, getMenuIsFileBaseMenuByToken, MatterShortcuts,
  WorkflowMenuMetaDataWrapper,
  WorkflowMenuMetaItem
} from '../../../workflow-menu-core';
import { getMenuEditIsDirtyByToken } from '../../../workflow-menu-core/reducers';
import { getHomeCurrency } from '../../../setting-core';
import { CreateWorkflowSession } from '../../../core';
import { uuid } from '../../../utils/uuid';
import { BillingGuidePopupData } from '../../../billing-guide-core/models/interfaces';
import { EChitPopupInput } from '../../../e-chit-core/models/interfaces';
import { BillingGuideAnalysisType } from '../../../billing-guide-core/models/enum';
import * as fileHistoryCore from '../../../file-history-core';
import { CaseContactModeChange } from '../../../case-contact-core/actions/core';
import { getContactModeByToken } from '../../../case-contact-core/reducers';
import { CrimeManagementInput } from '../../../core/lib/crime-managment';
import { OpenTimeValidation } from '../../../core/lib/timeRecord';
import { MatDialog } from '@angular/material';
import { ViewChangeKind } from '../../../file-history-core/actions/core';
import { AddEditTaskCloseInfo } from '../../../task-add-edit-core/models/enums';
import { InputData, Contact } from '../../../email-list-core';
import { SubmitType } from '../../../add-note-core';
import { DPSFileCredentialViewModel, DPSFilesToMailAttachmentRequestViewModel } from '../../../layout-desktop/models/interfaces';
import { OpenMailPopup, MainMenuItem } from '../../../layout-desktop';
import { ConflictCheckType, ConflictSearchOpenFrom } from '../../../conflict-search-core/models/enum';
import { UrlPopupService } from '../../../shell-desktop/services/url-popup.service';
import { MatterLinkedType } from '../../../matter-linked-core';
import { getGeneralAllMenueItems } from './../../../layout-desktop/reducers/index';
import { OpenTimeRecordPopupRequest } from './../../../shared-data/actions/time-record';
import { RunWorkflowCommand } from './../../../workflow-menu-core/actions/core';
import { take } from 'rxjs/operators';
import { MenuButtonClickType } from '../../../open-case-core/models/enums';
import { getMatterBannerMsgByToken, getIsCloseBannerByToken } from '../../../open-case-core/reducers/index';
import { CloseMatterBannerMsg } from '../../../open-case-core/actions/core';
import { getDefaultMessageFormat } from '../../../utils/organizer';
import { Observable } from 'rxjs';
import { MatterDataInput } from '../../../matter-linked-core/models/interfaces';
import { GridData } from '../../../task-add-edit-core';
import { BillingRequestInputData } from '../../../billing-request-core/models/interfaces';

@Component({
  selector: 'dps-open-case-home',
  templateUrl: './open-case-home.component.html',
  styleUrls: ['./open-case-home.component.scss']
})
export class OpenCaseHomeComponent extends ComponentBase implements OnInit, OnChanges {

  refreshCount: number;
  matterInfo: MatterInfo;
  selectedTab$: any;
  hedingText$: any;
  searchText$: any;
  refreshCount$: any;
  fdDetails$: any;
  showFDFigures$: any;
  attachments: any;
  deleteEntrySecurityInfo$: any;
  menuButtonType$: any;
  menuPropertyButtonClick$: any;
  isFileBaseMenu$: any;
  isDirtyMenu$: any;
  homeCurrancy$: any;
  workFlowButtonStatus$: any;
  groupMode$: any;
  screensContactTypeList$: any;
  contactMode$: any;
  menuItem$: Observable<MainMenuItem<any>[]>;

  matterBannerMsg$: any;
  isCloseBanner$: any;
  isSearchFullText$: any;

  selectedTab = 'file-history';
  isViewMenu = false;
  menuButtonClickType: string;


  @Input() inputData: OpenCaseMenueData;
  @Input() token: string;
  @Input() user: User;
  @Input() matterShortCutList: MatterShortcuts[];

  fontSizeClass: string;

  constructor(private store: Store<any>, private route: ActivatedRoute, private router: Router,
    private popupService: SystemJsPopupLoaderService, private injector: Injector, private dialog: MatDialog,
    private urlPopupService: UrlPopupService) {
    super();
    this.refreshCount = 0;
  }

  ngOnInit() {
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    this.workflowRunInShortCut(event);
  }

  workflowRunInShortCut(event) {
    const keyText = {
      'F1': true, 'F2': true, 'F3': true, 'F4': true,
      'F5': true, 'F6': true, 'F7': true, 'F8': true, 'F9': true, 'F10': true, 'F11': true, 'F12': true, 'F13': true, 'F14': true
    };
    if (keyText[event.key] !== undefined && this.matterShortCutList.length > 0 && event.keyCode) {
      event.preventDefault();
      this.matterShortCutList.forEach(item => {
        if (item.kbs_keycode === event.keyCode && item.kbs_item_variant === '4') { // template
          const newItemTemplate = getCreateItemNewMenuItem(this.matterInfo, item);
          this.store.dispatch(new RunWorkflowCommand(this.token, this.injector, newItemTemplate));
        } else if (item.kbs_keycode === event.keyCode && item.kbs_item_variant === '2') {// screen
          const newItemScreen = getCreateItemNewMenuItem(this.matterInfo, item);
          this.store.dispatch(new RunWorkflowCommand(this.token, this.injector, newItemScreen));
        }
      });
    }
  }

  onShowContent(tab) {
    this.store.dispatch(new OpenCaseCore.OpenCaseTabChange(this.token, { selectedTab: tab }));
  }
  onRefresh() {
    this.refreshCount = this.refreshCount + 1;
    this.store.dispatch(new OpenCaseCore.OpenCaseRefreshCount(this.token, {
      refreshCount: this.refreshCount,
      matterRef: this.inputData.matterData.data.matterReferenceNo
    }));
  }

  onMenuChange(item) {
    this.store.dispatch(new fileHistoryCore.FileHistoryViewChange('InitFileHistory' + this.matterInfo.MatterReferenceNo,
      { kind: ViewChangeKind.GroupModeChange, value: item }));
  }
  onIsSearchFullTextValue(value) {
    this.store.dispatch(new fileHistoryCore.FileHistoryFullTextSearch('InitFileHistory' + this.matterInfo.MatterReferenceNo, value));
  }

  onFontSizeClassChange(value) {
    this.fontSizeClass = value;
  }

  openAddNote() {
    const matterData = {
      MatterReferenceNo: this.matterInfo.MatterReferenceNo, BranchID: this.matterInfo.BranchId,
      AppID: this.matterInfo.AppId, FeeEarner: this.matterInfo.FeeEarner,
      ClientName: this.matterInfo.ClientName, RateCategory: null, FileID: this.matterInfo.FileId,
      AppCode: this.matterInfo.AppCode, eBilling: this.matterInfo.eBilling,
      isPlotMatter: this.matterInfo.isPlotMatter,
      isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,
      isProspectMatter: this.matterInfo.isProspectMatter,
      isLegalAid: this.matterInfo.isLegalAid
    };

    const input: AddNoteInPutData = {
      isEdit: false,
      matterData: matterData,
      diaryType: DiaryRecType.FILE_NOTE,
      legalAid: LegalAid.NotLegalAid,
    };

    this.popupService.openAddNotePopup('mainAddNotePopup', input).subscribe((data) => {
      if (data === AddNoteCloseInfo.ExitWithSaveSuccess) {
        this.onRefresh();
      }
    });
  }

  openAddTask() {

    const materDataMap: GridData = {
      action: false,
      appCode: this.matterInfo.AppCode,
      appID: this.matterInfo.AppId,
      branchID: this.matterInfo.BranchId,
      client: this.matterInfo.ClientName,
      columnFolderId: 0,
      fileID: this.matterInfo.FileId,
      folderName: '',
      matterReferenceNo: this.matterInfo.MatterReferenceNo,
      putOnBy: this.matterInfo.FeeEarner,
      taskFor: this.matterInfo.FeeEarner,
      matterDetails: this.inputData.matterData.data.matterDetails,
      workflowActions: 'Review',
      documentFlowStatus: '',
      hasPassword: false,
      taskID: null,
      note: '',
      letter: '',
      billRequestId: 0,
    };

    const inputData: any = {
      loginUser: this.matterInfo.FeeEarner,
      headerText: 'Add Task',
      documentFlowStatus: '',
      matterInfo: materDataMap
    };
    this.popupService.openAddEditTaskPopup(this.token, inputData).subscribe((data: any) => {
      if (data === AddEditTaskCloseInfo.ExitWithSaveSuccess) {
        this.onRefresh();
      }
    });
  }

  newMailOpen() {
    const inputData: InputData = {
      signTokens: [],
      safeBoxFileList: null,
      fileCredentials: null,
      subjectNote: '',
      submitType: SubmitType.NewMailOnly,
      url: null,
      matterData: {
        MatterReferenceNo: this.inputData.matterData.data.matterReferenceNo,
        FileID: this.inputData.matterData.data.fileID,
        AppCode: this.inputData.matterData.data.app_Code,
        AppID: this.inputData.matterData.data.appID,
        BranchID: this.inputData.matterData.data.branchID,
        ClientName: this.inputData.matterData.data.clientName,
        RateCategory: null,
        FeeEarner: null,
        eBilling: this.inputData.matterData.data.eBilling,
        isPlotMasterMatter: this.inputData.matterData.data.isPlotMasterMatter,
        isProspectMatter: this.inputData.matterData.data.isProspectMatter,
        isLegalAid: this.inputData.matterData.data.isLegalAid
      }
    };

    this.popupService.openEmailListPopup('EmailListPopup', inputData).subscribe((data: Contact[]) => {
      if (data && data.length > 0) {
        let toRecipients: Array<string> = [];
        data.forEach(c => {
          toRecipients = toRecipients.concat(c.email);
        });

        this.store.select(getSelectedAttachmentsByToken('InitFileHistory' + this.matterInfo.MatterReferenceNo)).pipe(
          take(1))
          .subscribe((attachments) => {
            const attachmentList: DPSFileCredentialViewModel[] = attachments.map(info => {
              return {
                DiaryId: info.data.diary_UID,
                Password: info.password
              };
            });
            const messageFormat = getDefaultMessageFormat(this.user.messageFormat);
            const request: DPSFilesToMailAttachmentRequestViewModel = {
              toRecipients: toRecipients,
              dpsFileCredentials: attachmentList,
              htmlBody: (this.user && this.user.isSignaturAutoAdd) ?
                `${messageFormat} <div class="signature">` + this.user.signature + '</div>' : messageFormat,
              matterRef: this.inputData.matterData.data.matterReferenceNo,
              appID: this.inputData.matterData.data.appID,
              branchID: this.inputData.matterData.data.branchID,
              fileID: this.inputData.matterData.data.fileID
            };

            this.store.dispatch(new OpenMailPopup(this.token, { draftIdRequest: request }));
          });
      }
    }
    );
  }

  openTimeRecord() {
    this.openTimeRecording(this.matterInfo);
  }

  handleViewChanges(state) {

  }

  onCloseMsgBanner() {
    this.closeMsgBanner();


  }

  onSendMsgViaMLS() {
    const inputData: InputData = {
      signTokens: null,
      safeBoxFileList: null,
      subjectNote: '',
      submitType: SubmitType.MsgViaMLS,
      url: null,
      matterData: {
        MatterReferenceNo: this.inputData.matterData.data.matterReferenceNo,
        FileID: this.inputData.matterData.data.fileID,
        AppCode: this.inputData.matterData.data.app_Code,
        AppID: this.inputData.matterData.data.appID,
        BranchID: this.inputData.matterData.data.branchID,
        ClientName: this.inputData.matterData.data.clientName,
        RateCategory: null,
        FeeEarner: null,
        eBilling: this.inputData.matterData.data.eBilling,
        isPlotMasterMatter: this.inputData.matterData.data.isPlotMasterMatter,
        isProspectMatter: this.inputData.matterData.data.isProspectMatter,
        isLegalAid: this.inputData.matterData.data.isLegalAid
      }
    };
    return this.popupService.openEmailListPopup('EmailListPopup', inputData);
  }
  openFormsLibrary(event) {
    const inputData: any = {
      matterReferenceNo: this.inputData.matterData.data.matterReferenceNo,
      appID: this.inputData.matterData.data.appID
    };
    this.popupService.formsLibraryPopup('formsLibraryPopup', inputData).subscribe((data) => {
    });
  }

  ngOnChanges(changers: SimpleChanges) {
    if (changers.inputData && changers.inputData.currentValue) {

      this.matterInfo = {
        ClientName: this.inputData.matterData.data.clientName,
        MatterReferenceNo: this.inputData.matterData.data.matterReferenceNo,
        BranchId: +this.inputData.matterData.data.branchID,
        AppId: +this.inputData.matterData.data.appID,
        FileId: +this.inputData.matterData.data.fileID,
        FeeEarner: this.inputData.matterData.data.feeEarner,
        AppCode: this.inputData.matterData.data.app_Code,
        MatterCounter: this.inputData.matterData.data.matterCounter,
        ufnValue: this.inputData.matterData.data.ufnValue,
        eBilling: this.inputData.matterData.data.eBilling,
        isPlotMatter: this.inputData.matterData.data.isPlotMatter,
        MatterDetails: this.inputData.matterData.data.matterDetails,
        isPlotMasterMatter: this.inputData.matterData.data.isPlotMasterMatter,
        isProspectMatter: this.inputData.matterData.data.isProspectMatter,
        isLegalAid: this.inputData.matterData.data.isLegalAid
      };

      this.store.dispatch(new OpenCaseCore.InitOpenCase(this.token, this.inputData));
      this.store.dispatch(new CreateWorkflowSession(this.token,
        this.injector,
        this.inputData.matterData.data.appID,
        this.inputData.matterData.data.fileID,
        this.inputData.matterData.data.branchID)
      );

      this.selectedTab$ = this.store.select(OpenCaseCore.getOpenCaseSelectedTab(this.token));
      this.hedingText$ = this.store.select(OpenCaseCore.getOpenCaseHedingText(this.token));
      this.searchText$ = this.store.select(OpenCaseCore.getOpenCaseFileHistorySearchText(this.token));
      this.refreshCount$ = this.store.select(OpenCaseCore.getOpenCaseRefreshCount(this.token));
      this.fdDetails$ = this.store.select(OpenCaseCore.getOpenCaseFdDetails(this.token));
      this.showFDFigures$ = this.store.select(OpenCaseCore.getOpenCaseShowFDFigures(this.token));
      this.deleteEntrySecurityInfo$ = this.store.select(OpenCaseCore.getOpenCaseShowDeleteEntrySecurityInfoByToken(this.token));

      this.menuButtonType$ = this.store.select(OpenCaseCore.getOpenCaseSelectedMenuButtonType(this.token));
      this.menuPropertyButtonClick$ = this.store.select(OpenCaseCore.getOpenCasePropertyButtonClick(this.token));
      this.isFileBaseMenu$ = this.store.select(getMenuIsFileBaseMenuByToken(this.token));
      this.isDirtyMenu$ = this.store.select(getMenuEditIsDirtyByToken(this.token));
      this.homeCurrancy$ = this.store.select(getHomeCurrency());
      this.workFlowButtonStatus$ = this.store.select(OpenCaseCore.getOpenCaseWFButtonStatus(this.token));
      this.screensContactTypeList$ = this.store.select(OpenCaseCore.getScreensContactTypeListByToken(this.token));
      this.menuItem$ = this.store.select(getGeneralAllMenueItems);

      const filehistoryToken = 'InitFileHistory' + this.matterInfo.MatterReferenceNo;
      this.groupMode$ = this.store.select(getGroupModeByToken(filehistoryToken));
      this.isSearchFullText$ = this.store.select(getIsSearchFullTextByToken(filehistoryToken));

      const contactModeToken = 'InitCaseContact' + this.matterInfo.MatterReferenceNo;
      this.contactMode$ = this.store.select(getContactModeByToken(contactModeToken));

      this.matterBannerMsg$ = this.store.select(getMatterBannerMsgByToken(this.token));
      this.isCloseBanner$ = this.store.select(getIsCloseBannerByToken(this.token));

    }
  }
  onSearchTextChanged(searchText) {
    this.store.dispatch(new OpenCaseCore.OpenFileHistoryCaseSearchText(this.token, { fileHestorySerchText: searchText }));
  }

  onLedgerCardOpenClick() {
    const ledgerCardToken = 'ledgerCardPopup-(' + this.token + ')';
    const input: LedgerCardInput = {
      matterRef: this.matterInfo.MatterReferenceNo
    };
    this.popupService.openLedgerCardPopup(ledgerCardToken, input).subscribe((data) => {
    });
  }

  // Workflow menu
  viewWorkflowOut(value: MenuButtonClickType) {
    if (value === MenuButtonClickType.WorkflowRules) {
      // Open WorkflowR Rule Popup
      const input: WorkflowInputData = {
        AppId: this.matterInfo.AppId,
        FileId: this.matterInfo.FileId,
        BranchId: this.matterInfo.BranchId,
        isProspectMatter: this.matterInfo.isProspectMatter
      };
      this.popupService.openWorkflowRulePopup('workFlowRulePopup-(' + this.token + ')', input).subscribe((data) => {
        if (data) {
          this.store.dispatch(new RefreshWorkFlowMenu(this.token));
        }
      });
    } else if (value === MenuButtonClickType.CloseMenuEdit) {
      this.store.dispatch(new WorkFlowUserAction(this.token, { type: MenusUserAction.cancel }));
    } else if (value === MenuButtonClickType.SaveMenuEdit) {
      this.store.dispatch(new WorkFlowUserAction(this.token, { type: MenusUserAction.save }));
    } else if (value === MenuButtonClickType.FileBaseMenuSave) {
      this.store.dispatch(new WorkFlowUserAction(this.token, { type: MenusUserAction.fileBase }));
    } else {
      this.store.dispatch(new OpenCaseCore.MenuButtpnClick(this.token, { buttonType: value }));
    }
  }
  viewProperties(value) {
    this.store.dispatch(new OpenCaseCore.ViewPropertiesClick(this.token, { buttonType: value }));
  }

  onContactChange(value) {
    const caseContactToken = 'InitCaseContact' + this.inputData.matterData.data.matterReferenceNo;
    this.store.dispatch(new CaseContactModeChange(caseContactToken, { value: value }));
  }



  onMatterCreationClick() {
    this.popupService.openMatterCreationPopup(uuid(), { matterId: this.matterInfo.MatterCounter }).subscribe((data: any) => {

    });
  }
  onBillingGuideClick() {

    const billingGuideData: BillingGuidePopupData = {
      matterRef: this.inputData.matterData.data.matterReferenceNo,
      clientName: this.inputData.matterData.data.clientName,
      branchId: +this.inputData.matterData.data.branchID,
      appId: +this.inputData.matterData.data.appID,
      fileId: +this.inputData.matterData.data.fileID,
      analysisType: BillingGuideAnalysisType.BillingGuide,
    };
    this.popupService.openBillingGuidePopup('billingGuidePopup', billingGuideData).subscribe((result: any) => {
      if (!result) {
        return '';
      }
    });
  }

  onOpenEchitClick() {
    const matterDetailsName = ((this.inputData.matterData.data.clientName || '')
      + (this.inputData.matterData.data.matterDetails || '')).replace('&', '&&');
    const eChitPopupInput: EChitPopupInput = {
      matterId: this.inputData.matterData.data.matterReferenceNo,
      matterDetailsName: matterDetailsName,
      matterInfo: this.inputData.matterData,
      appCode: this.inputData.matterData.data.app_Code,
      matterEBilling: this.inputData.matterData.data.eBilling,
      matterIsLegalAid: this.inputData.matterData.data.isLegalAid,
      branchId: this.inputData.matterData.data.branchID,
      appId: this.inputData.matterData.data.appID,
      fileId: this.inputData.matterData.data.fileID
    };
    this.popupService.openEChitPopup(this.token, eChitPopupInput);
  }
  onOpenBillingRequestPopup(event) {
    const billingRequestInputData: BillingRequestInputData = {
      matterData: { matterReferenceNo: this.inputData.matterData.data.matterReferenceNo, branchID: this.inputData.matterData.data.branchID }
    };
    this.popupService.billingRequestPopup('billingRequestViewPopup', billingRequestInputData).subscribe((result) => {

    });
  }
  onClientCreationClick() {
    if (this.matterInfo && this.matterInfo.AppId && this.matterInfo.BranchId && this.matterInfo.FileId) {
      this.popupService.openClientCreationPopup(uuid(), {
        matter: this.matterInfo, clientSeatchList: [], clientIndex: 0
      }).subscribe(data => {
      });
    }
  }
  onOpenCrimeClassManager() {
    const input: CrimeManagementInput = {
      matterReferenceNo: this.matterInfo.MatterReferenceNo,
      branchId: this.matterInfo.BranchId,
      appId: this.matterInfo.AppId,
      fileId: this.matterInfo.FileId,
      ufnValue: this.matterInfo.ufnValue
    };
    this.popupService.openCrimeManagerPopup(`mainTimeInformationPopup-${this.matterInfo.MatterReferenceNo}`, input);
  }

  closeMsgBanner() {
    this.store.dispatch(new CloseMatterBannerMsg(this.token));

  }

  openTimeRecording(matterData: MatterInfo) {

    let data: OpenTimeValidation;
    if (matterData) {
      data = {
        appCode: matterData.AppCode,
        appId: matterData.AppId,
        branchId: matterData.BranchId,
        fileId: matterData.FileId,
        eBilling: matterData.eBilling,
        matterRef: matterData.MatterReferenceNo,
        timeFeeEarner: matterData.FeeEarner,
        matterDetails: matterData.MatterDetails,
        clientName: matterData.ClientName,
        ufnValue: matterData.ufnValue,
        canMinimize: false,
        isProspectMatter: matterData.isProspectMatter,
        isLegalAid: matterData.isLegalAid
      };
    }

    this.store.dispatch(new OpenTimeRecordPopupRequest(this.token, data));
  }
  onEBilling() {
    if (this.inputData && this.inputData.matterData && this.inputData.matterData.data &&
      (this.inputData.matterData.data.eBilling === eBillingType.PrecedentH ||
        this.inputData.matterData.data.eBilling === eBillingType.PrecedentS)) {
      this.matterInfo = {
        ClientName: this.inputData.matterData.data.clientName,
        MatterReferenceNo: this.inputData.matterData.data.matterReferenceNo,
        BranchId: +this.inputData.matterData.data.branchID,
        AppId: +this.inputData.matterData.data.appID,
        FileId: +this.inputData.matterData.data.fileID,
        FeeEarner: this.inputData.matterData.data.feeEarner,
        AppCode: this.inputData.matterData.data.app_Code,
        MatterCounter: this.inputData.matterData.data.matterCounter,
        eBilling: this.inputData.matterData.data.eBilling,
        MatterDetails: this.inputData.matterData.data.matterDetails,
        isProspectMatter: this.inputData.matterData.data.isProspectMatter,
        isLegalAid: this.inputData.matterData.data.isLegalAid
      };
      this.popupService.openPrecedentHPopup('openPrecedentHPopup', this.matterInfo).subscribe((result: any) => {
        if (!result) {
          return '';
        }
      });
    }
  }
  onOpenConflictSearch() {
    this.popupService.openConflictSearchPopup(this.token,
      {
        conflictCheckType: ConflictCheckType.Matter,
        openFrom: ConflictSearchOpenFrom.OpenCase,
        clientDto: this.inputData.matterData.data,
        commonPara: { data: '', status: '' }
      }
    );
  }
  onOpenCrimeDuty() {
    this.popupService.openCrimeDutyPopup(this.token,
      {
        appId: +this.inputData.matterData.data.appID,
        fileId: +this.inputData.matterData.data.fileID,
        branchId: +this.inputData.matterData.data.branchID,
        matterReferenceNo: this.inputData.matterData.data.matterReferenceNo,
        matterDetails: this.inputData.matterData.data.matterDetails,
        isLegalAid: this.inputData.matterData.data.isLegalAid
      }
    );
  }
  onOpenProbate() {
    const matterData: any = {
      appId: +this.inputData.matterData.data.appID,
      fileID: +this.inputData.matterData.data.fileID,
      branchID: +this.inputData.matterData.data.branchID,
      matterReferenceNo: this.inputData.matterData.data.matterReferenceNo,
      // appId: this.matterInfo.AppId,
      // fileID: this.matterInfo.FileId,
      // branchID: this.matterInfo.BranchId,
      // matterReferenceNo: this.matterInfo.MatterReferenceNo,
    };

    this.popupService.openProbatePopup('Probate', matterData);
  }
  onOpenCivilTimeRecording() {
    this.popupService.civilClassManagement('Civil_Time_record_Manager', {
      appId: +this.inputData.matterData.data.appID,
      branchId: +this.inputData.matterData.data.branchID,
      fileId: +this.inputData.matterData.data.fileID,
    });
  }

  onOpenBundle() {
    const urlPath = '/bundled';
    this.urlPopupService.openWithUrlPoup(urlPath, this.token, false, true);
  }


  onLinkedMattersClick() {
    this.menuItem$.pipe(take(1)).subscribe(menueItems => {
      let title = 'Linked Matter';
      const menue = menueItems.find(val => val.id === 'matter_creation');
      if (menue) {
        title = 'Linked ' + menue.label;
      }

      const matterData: MatterDataInput = {
        appId: this.matterInfo.AppId,
        fileID: this.matterInfo.FileId,
        branchID: this.matterInfo.BranchId,
        isPlotMasterMatter: this.matterInfo.isPlotMasterMatter
      };

      this.popupService.openMatterLinkedPopup('matterLinkedPopup', this.matterInfo.MatterReferenceNo,
        MatterLinkedType.OpenCase, title, matterData)
        .subscribe((result: any) => {
          if (!result) {
            return '';
          }
        });
    });
  }
  onManageDiaryFolders() {
    this.popupService.openDiaryFolderPopup('diaryFolderPopup', this.matterInfo.AppId).subscribe((result: any) => {
    });
  }
}

function getCreateItemNewMenuItem(matterData: MatterInfo, shortcutKeyInfo: MatterShortcuts) {
  let newShortcutKuyNode: WorkflowMenuMetaDataWrapper = null;
  if (matterData && shortcutKeyInfo) {
    const newMenuNode: WorkflowMenuMetaItem = {
      atN_AppID: +matterData.AppId,
      atN_Command: shortcutKeyInfo.kbs_item_name,
      atN_Desc: shortcutKeyInfo.kbs_item_title,
      atN_Help: '',
      atN_ID: null,
      atN_Level: 0,
      atN_Order: 1,
      atN_ParentID: null,
      atN_ParentMenu: null,
      atN_Type: +shortcutKeyInfo.kbs_item_variant, // Menu
      createUser: '',
      dateDone: '',
      nodeStatus: 1,
    };
    const newNode: WorkflowMenuMetaDataWrapper = {
      treeId: null,
      parentId: null,
      treeLevel: 0,
      isRowEdit: false,
      isRightClick: false,
      isRowSelected: false,
      indexId: 0,
      data: newMenuNode,
      items: [],
      enabled: true,
      isTreeNodeExpand: false,
    };
    newShortcutKuyNode = newNode;
  }
  return newShortcutKuyNode;
}
