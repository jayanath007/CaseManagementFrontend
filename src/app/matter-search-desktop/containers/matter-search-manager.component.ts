import { PosingPeriod } from './../../setting-core/models/interface';
import { take } from 'rxjs/operators';
import { SubmitType } from './../../add-note-core/models/enumeration';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { BaseMatterManager } from '../../matter-search-core/containers';
import { ViewChangeKind, GridRowItemWrapper } from '../../matter-search-core';
import { SystemJsPopupLoaderService, ViewStateObserverService } from '../../shell-desktop';
import { MainMenuService, getVisibleOutlet } from '../../layout-desktop';
import { LedgerCardInput } from '../../core/lib/ledger-card';
import { BasePopupType } from '../../shared/models/consol-error';
import { MatDialog } from '@angular/material';
import { InputData, Contact } from '../../email-list-core';
import { getUser } from '../../auth/reducers';
import { DPSFilesToMailAttachmentRequestViewModel } from '../../layout-desktop/models/interfaces';
import { MatterMenu } from './../../matter-search-core/models/enums';
import { EChitPopupInput } from './../../e-chit-core/models/interfaces';
import { OpenTimeValidation } from './../../core/lib/timeRecord';
import { InforDialogComponent, InforDialogData, IS_GOOGLE } from '../../shared';
import { ReferralNotePopupManagerComponent } from './referral-note-popup-manager.component';
import { getDefaultMessageFormat } from '../../utils/organizer';
import { BillingRequestInputData } from '../../billing-request-core/models/interfaces';

@Component({
  selector: 'dps-matter-search-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class MatterSearchManagerComponent extends BaseMatterManager implements OnInit {

  @Input() inputData;
  @Input() matterSearchToken;
  @Input() isPopup: boolean;
  @Input() postingPeriod: PosingPeriod;

  @Output() closePopup = new EventEmitter();

  public activeOutlet$: any;

  constructor(store: Store<any>, private pageService: MainMenuService,
    private popupService: SystemJsPopupLoaderService,
    public shellStateManage: ViewStateObserverService, private dialog: MatDialog,
    @Inject(IS_GOOGLE) isGoogle: string) { super(store, shellStateManage, isGoogle); }

  ngOnInit() {
    if (this.inputData && this.inputData.isMatterCreate) {
      super.initSelectors(this.matterSearchToken, this.isPopup, this.inputData);
    } else if (this.inputData && (this.inputData.basePopupType === BasePopupType.EmailAttachDPSfile)) {
      super.initSelectors(this.matterSearchToken, this.isPopup, this.inputData);
    } else {
      super.initSelectors(this.matterSearchToken, this.isPopup, this.inputData);
    }
    this.activeOutlet$ = this.store.select(getVisibleOutlet);
  }
  public clickOpenCase(selectedMatter: GridRowItemWrapper) {
    this.goToOpenCase(selectedMatter);
  }
  clickTimeRecord(selectedMatter: GridRowItemWrapper) {
    if (selectedMatter && selectedMatter.data && selectedMatter.data.closed) {
      this.showValidationMsg('You cannot record time against selected matter because it is closed. It cannot be added.');
    } else {
      this.openTimeRecording(selectedMatter);
    }
  }
  clickNewMail(item) {
    const inputData: InputData = {
      signTokens: [],
      safeBoxFileList: null,
      fileCredentials: null,
      subjectNote: '',
      submitType: SubmitType.NewMailOnly,
      url: null,
      matterData: {
        MatterReferenceNo: item.data.matterReferenceNo,
        FileID: item.data.fileID,
        AppCode: item.data.app_Code,
        AppID: item.data.appID,
        BranchID: item.data.branchID,
        ClientName: item.data.clientName,
        RateCategory: null,
        FeeEarner: null,
        eBilling: item.data.eBilling,
        isPlotMasterMatter: item.data.isPlotMasterMatter,
        isProspectMatter: item.data.isProspectMatter,
        isLegalAid: item.data.isLegalAid
      }
    };

    this.popupService.openEmailListPopup('EmailListPopup', inputData).subscribe((data: Contact[]) => {
      if (data && data.length > 0) {
        let toRecipients: Array<string> = [];
        data.forEach(c => {
          toRecipients = toRecipients.concat(c.email);
        });
        const subscription = this.store.select(getUser).pipe(
          take(1))
          .subscribe((user) => {
            const messageFormat = getDefaultMessageFormat(user.messageFormat);
            const request: DPSFilesToMailAttachmentRequestViewModel = {
              toRecipients: toRecipients,
              dpsFileCredentials: [],
              htmlBody: (user && user.isSignaturAutoAdd) ?
                `${messageFormat} <div class="signature">` + user.signature + '</div>' : messageFormat,
              matterRef: item.data.matterReferenceNo,
              appID: item.data.appID,
              branchID: item.data.branchID,
              fileID: item.data.fileID
            };
            this.newMailOpen(this.matterSearchToken, item, request);
          });


      }
    }
    );

  }
  onRowSelect(item) {
    this.selectRow(this.matterSearchToken, item);
  }
  onToggleRow(item) {
    this.toggleExpandRow(this.matterSearchToken, item);
  }
  onViewChange({ kind, value }: { kind: ViewChangeKind, value: any }) {
    if (value === -1 || (!value && kind === ViewChangeKind.Department)) {
      this.viewChange(this.matterSearchToken, kind, value, this.limitedColumnsForMatters.columnDef);
    } else if (value === 'Recent50' || (!value && kind === ViewChangeKind.SearchText)) {
      this.viewChange(this.matterSearchToken, kind, value, this.limitedColumnsForMatters.columnDef, this.allColumnsForMatters.columnDef);
    } else if (value === 'SuggestByEmails') {
      this.viewChange(this.matterSearchToken, kind, value, this.limitedColumnsForMatters.columnDef);
    } else {
      this.viewChange(this.matterSearchToken, kind, value, this.allColumnsForMatters.columnDef);
    }
  }
  onRefresh() {
    this.onMatterRefresh(this.matterSearchToken);
  }
  closeMatterPopup() {
    this.closePopup.emit();
    this.closeAndDiscastMatterPopup(this.matterSearchToken);
  }
  onChangeTeamMemberPanelMode(mode) {
    this.changeTeamMemberPanelMode(mode);
  }
  onOpenLedgerCard(matterData) {
    const ledgerCardToken = 'matterSearchLedgerCardPopup-(' + matterData.data.matterReferenceNo + ')';
    const input: LedgerCardInput = {
      matterRef: matterData.data.matterReferenceNo
    };

    this.popupService.openLedgerCardPopup(ledgerCardToken, input).subscribe((data) => {

    });
  }
  onOpenMLS(matterData: GridRowItemWrapper) {

    const matter = {
      ClientName: matterData.data.clientName,
      MatterReferenceNo: matterData.data.matterReferenceNo,
      BranchId: matterData.data.branchID,
      AppId: matterData.data.appID,
      AppCode: matterData.data.app_Code,
      FileId: matterData.data.fileID,
      FeeEarner: matterData.data.feeEarner,
      var1: '',
      var2: '',
      var3: '',
    };

    const mlsToken = `matterSearchLedgerCardPopup-(${matterData.data.matterReferenceNo})`;
    this.popupService.openMLSPopup(mlsToken, matter).subscribe((data) => {

    });
  }
  selectedRowData(event: { item: GridRowItemWrapper, gridData: GridRowItemWrapper[] }) {
    if (this.matterSearchToken === 'matterCriation') {
      let index = 0;
      const _gridData = event.gridData.map((value, i) => {
        if (value.data === event.item.data) {
          index = i;
        }
        return {
          clientName: value.data.clientName,
          feeEarner: value.data.feeEarner,
          appCode: value.data.app_Code,
          matterReferenceNo: value.data.matterReferenceNo,
          branchID: value.data.branchID,
          appID: value.data.appID,
          fileID: value.data.fileID,
          rateCategory: value.data.rateCategory,
          matterCounter: value.data.matterCounter
        };
      });
      this.closePopup.emit({ index: index, gridData: _gridData });
      this.onPopupRowSelect(this.matterSearchToken);
    } else if (event.item && event.item.data) {
      this.onPopupRowSelect(this.matterSearchToken, event.item, this.closePopup);
    } else {
      this.closePopup.emit();
      this.onPopupRowSelect(this.matterSearchToken);
    }

  }

  openTimeRecording(matterData: GridRowItemWrapper) {

    let data: OpenTimeValidation;
    if (matterData) {
      data = {
        appCode: matterData.data.app_Code,
        appId: matterData.data.appID,
        branchId: matterData.data.branchID,
        fileId: matterData.data.fileID,
        eBilling: matterData.data.eBilling,
        matterRef: matterData.data.matterReferenceNo,
        timeFeeEarner: matterData.data.feeEarner,
        matterDetails: matterData.data.matterDetails,
        clientName: matterData.data.clientName,
        ufnValue: matterData.data.ufnValue,
        canMinimize: false,
        isProspectMatter: matterData.data.isProspectMatter,
        isLegalAid: matterData.data.isLegalAid
      };
    }

    this.requestToOpenTimeRecord(this.matterSearchToken, data);

  }

  onMatterMenu(type: MatterMenu) {
    switch (type) {
      case MatterMenu.AddMatter: {
        this.popupService.openMatterCreationPopup('matterCreationMainPopup', null).subscribe((data: any) => { });
        break;
      }
      case MatterMenu.eChit: {
        this.popupService.openEChitPopup('openEChitDesktopModule', {});
        break;
      }
      case MatterMenu.LedgerCard: {
        // this.openMainModule(type, this.desktopRoute);
        this.pageService.navigateById('ledger_card');
        break;
      }
      case MatterMenu.AddvanceSearch: {
        this.popupService.openAdvancedSearchPopup('advanced_search');
      }
    }
  }

  onOpenEChitWithMatter(matterData: GridRowItemWrapper) {
    const matterDetailsName = ((matterData.data.clientName || '')
      + (matterData.data.matterDetails || '')).replace('&', '&&');
    const eChitPopupInput: EChitPopupInput = {
      matterId: matterData.data.matterReferenceNo,
      matterDetailsName: matterDetailsName,
      appCode: matterData.data.app_Code,
      matterEBilling: matterData.data.eBilling,
      matterIsLegalAid: matterData.data.isLegalAid,
      branchId: matterData.data.branchID,
      appId: matterData.data.appID,
      fileId: matterData.data.fileID
    };
    this.popupService.openEChitPopup(`openEChitDesktopModule-${matterData.data.matterCounter}`, eChitPopupInput);
  }
  onOpenBillingRequestPopup(matterData: GridRowItemWrapper) {

    const billingRequestInputData: BillingRequestInputData = {
      matterData: { matterReferenceNo: matterData.data.matterReferenceNo, branchID: matterData.data.branchID }
    };
    // if (this.postingPeriod) {
    if (matterData && matterData.data && matterData.data.closed) {
      this.showValidationMsg('You cannot billing request against selected matter because it is closed. It cannot be added.');
    } else {
      this.popupService.billingRequestPopup('billingRequestViewPopup', billingRequestInputData).subscribe((result) => {
      });
    }

    // }
    //  else {
    //   this.popupService.postingPeriodPopup('dpsPostingPeriodToken', { id: null }).subscribe((data) => {
    //     if (data && data.posingPeriod) {
    //       this.popupService.billingRequestPopup('billingRequestViewPopup', { matterData: matterData.data }).subscribe((result) => {
    //       });
    //     } else {
    //       const dialogData: InforDialogData = {
    //         content: {
    //           title: 'Message',
    //           message: 'Sorry...\n no posing period.'
    //         },
    //         data: { messageType: 'warning' }
    //       };
    //       const dialogRef = this.dialog.open(InforDialogComponent, {
    //         data: dialogData,
    //         width: '400px',
    //         disableClose: true,
    //         hasBackdrop: true,
    //         panelClass: 'dps-notification'
    //       });
    //     }
    //   });
    // }

  }

  onOpenReferralNoteAndDate(matterData: GridRowItemWrapper) {
    const dialogRef = this.dialog.open(ReferralNotePopupManagerComponent, {
      width: '400px',
      data: {
        matterInfo: matterData,
        myToken: this.matterSearchToken,
      },
      panelClass: 'dps-team-notification',
      disableClose: true,
    });
    // this.popupService.referralNoteAndDatePopup('referralNoteAndDate', { matterData: matterData.data }).subscribe((result) => {
    // });
  }

  showValidationMsg(msg: string) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Matter is closed',
        message: msg
      },
      data: { messageType: 'alert' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
  }

}
