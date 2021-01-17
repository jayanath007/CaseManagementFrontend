import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { OpenMailPopup, getVisibleOutlet } from '../../layout-desktop';
import { BaseWorkDoneManager } from '../../work-done-core/containers/work-done-manager';
import { GridFilterUpdate, GridData, GridButtonAction } from '../../work-done-core/models/interfce';
import { GridButtonType } from '../../work-done-core/models/enumeration';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { DPSFilesToMailAttachmentRequestViewModel } from '../../layout-desktop/models/interfaces';
import { LedgerCardInput } from '../../core/lib/ledger-card';
import { GridGroupData } from '../../core/lib/grid-model';
import { OpenTimeValidation } from './../../core/lib/timeRecord';
import { getDefaultMessageFormat } from '../../utils/organizer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'dps-work-done-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class WorkDoneManagerComponent extends BaseWorkDoneManager implements OnInit {

  @Input() token;
  public activeOutlet$: any;

  constructor(store: Store<any>, private popupService: SystemJsPopupLoaderService) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token, this.columnDef, this.paginatorDef);
    this.activeOutlet$ = this.store.select(getVisibleOutlet);
  }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo(this.token, value);
  }

  onRowSelect(row: GridData) {
    this.expandRow(this.token, row);
  }

  onRefresh() {
    this.gridRefresh(this.token);
  }
  onChangeTeamMemberPanelMode(mode) {
    this.changeTeamMemberPanelMode(mode);
  }
  onViewChange(value) {
    this.viewChange(this.token, value);
  }

  onClickGridButton(action: GridButtonAction) {
    switch (action.kind) {
      // openCase
      case GridButtonType.openCase: {
        this.goToOpenCase(action.value);
        break;
      }
      // open Time Recording Popup
      case GridButtonType.openTimeRecording: {
        this.openTimeRecording(action.value);
        break;
      }
      // Open Mail Compose
      case GridButtonType.openNewMail: {
        this.user$.pipe(take(1)).subscribe(user => {
          const messageFormat = getDefaultMessageFormat(user.messageFormat);
          const request: DPSFilesToMailAttachmentRequestViewModel = {
            dpsFileCredentials: [],
            htmlBody: (user && user.isSignaturAutoAdd) ?
              `${messageFormat} <div class="signature">` + user.signature + '</div>' : messageFormat,
            matterRef: action.value.matterReferenceNo,
            appID: action.value.appID,
            branchID: action.value.branchID,
            fileID: action.value.fileNumber,
          };
          const token = 'WorkDoneComposeMail-' + action.value.matterReferenceNo;
          this.store.dispatch(new OpenMailPopup(token, { draftIdRequest: request }));
        }).unsubscribe();

        break;
      }

      // Open Ledger Card Popup
      case GridButtonType.openLedgerCard: {
        const ledgerCardToken = 'matterSearchLedgerCardPopup(' + action.value.matterReferenceNo + ')';
        const input: LedgerCardInput = {
          matterRef: action.value.matterReferenceNo
        };
        this.popupService.openLedgerCardPopup(ledgerCardToken, input).subscribe(() => {
        });
        break;
      }
      case GridButtonType.viewDocument: {
        this.viewDocument(this.token, action.value);
        break;

      } case GridButtonType.closeViewer: {
        this.closeViewer(this.token, action.value);
        break;
      }
      default: {
        break;
      }
    }
  }

  onUserEnterPassword(data) {
    this.userEnterPassword(this.token, data);
  }

  removePasswordRequest() {
    this.removeRequestRow(this.token);
  }

  onMenuChange(item) {
    this.menuChange(this.token, item);
  }

  onSelectGroup(data: GridGroupData) {
    this.selectGroup(this.token, data);
  }

  onLoadMoreData(group: GridGroupData) {
    this.loadMoreData(this.token, group);
  }

  openTimeRecording(matterData: GridData) {
    let data: OpenTimeValidation;
    if (matterData) {
      data = {
        appCode: matterData.appCode,
        appId: matterData.appID,
        branchId: matterData.branchID,
        fileId: matterData.fileNumber,
        eBilling: matterData.eBilling,
        matterRef: matterData.matterReferenceNo,
        timeFeeEarner: matterData.by,
        matterDetails: '',
        clientName: '',
        ufnValue: matterData.ufnValue,
        canMinimize: false,
        isProspectMatter: matterData.isProspectMatter,
        isLegalAid: matterData.isLegalAid
      };
    }
    this.requestToOpenTimeRecord(this.token, data);

  }

}
