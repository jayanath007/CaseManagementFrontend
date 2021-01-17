
import { Component, OnInit, Inject } from '@angular/core';
// import { SystemJsPopupLoaderService } from './../../shell-desktop/services/system-js-popup-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BillingRequestManagerComponent } from './billing-request-manager.component';

@Component({
  selector: 'dps-billing-request-router-host.component',
  template: `<dps-billing-request-manager #manager [billingRequestToken]="data.token" [inputData]="data.input"
                (closePopup)="onClose($event)">
                <dps-billing-request-layout
                [timeOffset]="(manager.user$ | async).general.dateTimeOffset"
                [matterInfo]="manager.matterInfo$| async"
                [requestViewData]="manager.requestViewData$| async"
                [totalValues]="manager.totalValues$| async"
                [mainLoader]="manager.mainLoader$| async"
                [selectedPostingPeriod]="manager.postingPeriod$| async"
                [timeHeaderGridOrderData]="manager.timeHeaderGridOrderData$| async"
                [closePopup]="manager.closePopup$| async"
                (matterSearchData)="manager.onMatterSearchData($event)"
                (closeRequestPopup)="manager.onClosePopup($event)"
                (importPopupOpen)="manager.onOpenDataImportPopup($event)"
                (addDataPopupOpen)="manager.onAddDataPopup($event)"
                (timeAndCostGridSelectRowUpdate)="manager.onTimeAndCostGridSelectRow($event)"
                (headerGridRowDoubleClick)="manager.onHeaderGridDoubleClick($event)"
                (narrativeItemText)="manager.onNarrativeItemText($event)"
                (proformaCheckUpdate)="manager.onChangeunProforma($event)"
                (billCheckUpdate)="manager.onChangeunBill($event)"
                (printSettingPopupOpen)="manager.onPrintSettingPopupOpen($event)"
                (addToBillDataUpdate)="manager.onAddToBillClick($event)"
                (removeAllGridDataByGridType)="manager.onRemoveAllGridDataByGridType($event)"
                (updateControllerValue)="manager.onUpdateControllerValue($event)"
                (billingRequestSave)="manager.onBillingRequestSave($event)"
                (deleteBillRequest)="manager.onDeleteBillRequest()">
                </dps-billing-request-layout>
            </dps-billing-request-manager>`
})
export class BillingRequestRouterHostComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: string, token: string },
    public dialogRef: MatDialogRef<BillingRequestManagerComponent>) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}
