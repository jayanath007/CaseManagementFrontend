import { OpenTimeValidation } from './../../core/lib/timeRecord';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { MainMenuService } from '../../layout-desktop';
import { BaseTimeRecordedManager } from '../../time-recorded-core/containers/time-recorded-manager';
import { GridFilterUpdate, GridButtonAction, GridData } from '../../time-recorded-core/models/interfce';
import { GridButtonType } from '../../time-recorded-core/models/enumeration';
import { GridRowItemWrapper, eBillingType } from '../../core/lib/matter';
import { TimeRecordInputData } from '../../time-recording-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { TimeRecordingCloseInfo } from '../../time-recording-core/models/enum';
import { GridGroupData } from '../../core/lib/grid-model';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { uuid } from '../../utils/uuid';

@Component({
  selector: 'dps-time-recorded-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class TimeRecordedManagerComponent extends BaseTimeRecordedManager implements OnInit {

  @Input() token;

  constructor(store: Store<any>, private router: ActivatedRoute, private pageService: MainMenuService,
    private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token, this.gridTemplete, this.paginatorDef);
  }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo(this.token, value);
  }

  onRefresh() {
    this.gridRefresh(this.token);
  }

  onViewChange(value) {
    this.viewChange(this.token, value);
  }

  changeSelectRow(dataRow) {
    this.onSelectRowChange(this.token, dataRow);
  }

  onChangeTeamMemberPanelMode(mode) {
    this.changeTeamMemberPanelMode(mode);
  }

  groupBy(type: string) {
    this.groupData(this.token, type);
  }

  onSelectGroup(data: GridGroupData) {
    this.selectGroup(this.token, data);
  }

  onClickGridButton(action: GridButtonAction) {
    if (action.value && action.value.matterCounter === 0 && action.kind !== GridButtonType.addTimeRecording) {
      this.openMSGDialog('Sorry...\nMatter has been deleted');
      return;
    }
    switch (action.kind) {
      // openCase
      case GridButtonType.openCase: {
        const materData: GridRowItemWrapper = {
          data: {
            appID: action.value.appId,
            fileID: action.value.fileId,
            app_Code: action.value.appCode,
            branchID: action.value.branchId,
            feeEarner: action.value.timeFeeEarner,
            reviewDate: action.value.reviewDate,
            clientName: action.value.client,
            reviewNote: action.value.reviewNote,
            company_Name: action.value.companyName,
            matterDetails: action.value.matter,
            matterReferenceNo: action.value.matterReferenceNo,
            matterCounter: action.value.matterCounter,
            ufnValue: action.value.ufnValue,
            eBilling: action.value.eBilling,
            isPlotMatter: action.value.isPlotMatter,
            isPlotMasterMatter: action.value.isPlotMasterMatter,
            isProspectMatter: action.value.isProspectMatter,
            isLegalAid: action.value.isLegalAid
          }
        };
        if (window.opener && window.opener !== window) {
          localStorage.setItem('goToOpenCase', JSON.stringify(materData));
          localStorage.removeItem('goToOpenCase');
        } else {
          this.pageService.gotoOpenCase(materData);
        }
        break;
      }
      // add New Record
      case GridButtonType.addTimeRecording: {
        this.openTimeRecording(action.value, action.token);
        break;
      }
      // edit a Record
      case GridButtonType.editTimeRecording: {

        const input: TimeRecordInputData = {
          matterReferenceNo: action.value.matterReferenceNo,
          feeEarner: action.value.timeFeeEarner,
          editData: action.value,
          eBilling: action.value.eBilling,
        };
        this.popupService.openTimeRecordingPopup(action.token || uuid(), input).subscribe((data) => {
          if (data === TimeRecordingCloseInfo.ExitWithSaveSuccess) {
            this.onRefresh();
          }
        });

        break;
      }
      default: {
        break;
      }
    }
  }
  onLoadMoreData(group: GridGroupData) {
    this.loadMoreData(this.token, group);
  }

  openTimeRecording(matterData: GridData, token: string) {
    let data: OpenTimeValidation;
    if (matterData) {
      data = {
        appCode: matterData.appCode,
        appId: matterData.appId,
        branchId: matterData.branchId,
        fileId: matterData.fileId,
        eBilling: matterData.eBilling,
        matterRef: matterData.matterReferenceNo,
        timeFeeEarner: matterData.timeFeeEarner,
        matterDetails: matterData.matter,
        clientName: matterData.client,
        ufnValue: matterData.ufnValue,
        canMinimize: true,
        isProspectMatter: matterData.isProspectMatter,
        isLegalAid: matterData.isLegalAid
      };
    }
    this.requestToOpenTimeRecord(token, data);
  }


  openMSGDialog(message: string) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Time Record',
        message: message
      },
      data: { messageType: 'warning' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
  }
  onTimeUpdating(event) {
    this.updatingTimeRecording(this.token, event);
  }
  onStopStartTimeRecording(token) {
    this.timeUpdateStartStop(token);
  }
  onSaveTimeRecording(token) {
    this.saveTR(token);
  }
  onExportToExcel() {
    this.exportToExcel(this.token);
  }
  onDateTypeChanged(eventValue) {
    this.dateTypeChanged(this.token, eventValue);
  }
}
