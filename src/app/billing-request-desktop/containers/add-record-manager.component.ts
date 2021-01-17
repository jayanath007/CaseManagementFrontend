import { BaseBillingRequestManager } from './../../billing-request-core/containers/billing-request-manager';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { RequestFormTypes } from '../../billing-request-core/models/enums';

@Component({
    selector: 'dps-add-record-manager',
    template: `<dps-billing-request-add-record-data
                [requestViewData]="requestViewData$ | async"
                [timeOffset]="(user$ | async).general.dateTimeOffset"
                [feeEarnerList]="feeEarnerList$| async"
                [vatCodeList]="vatCodeList$| async"
                [descriptionList]="descriptionsList$| async"
                [userNominalCode]="userNominalCode$| async"
                (profitCostOkButtonUpdate)="onProfitCostOkButtonUpdate($event)"
                (billingRequestDeleteRow)="onBillingRequestDeleteRow($event)"
                (billingRequestEditRow)="onBillingRequestEditRow($event)"
                (onDropDownChange)="onDropDownChange($event)"
                (close)="onClose($event)">
               </dps-billing-request-add-record-data>`
})
export class AddRecordManagerComponent extends BaseBillingRequestManager implements OnInit {
    importPopupInputData;
    requestFormTypes: RequestFormTypes;
    addDataPopupToken: string;

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: {}[], token: string },
        public dialogRef: MatDialogRef<AddRecordManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        this.addDataPopupToken = this.data.token;
        super.iniAddDataPopup(this.data.token);
    }
    onClose(event) {
        this.dialogRef.close(event);
    }
    onProfitCostOkButtonUpdate(event) {
        this.onProfitCostOkButtonClick(this.addDataPopupToken, event);
    }
    onBillingRequestDeleteRow(event) {
        this.onBillingRequestDeleteRowClick(this.addDataPopupToken, event);
    }
    onBillingRequestEditRow(event) {
        this.onBillingRequestEditRowClick(this.addDataPopupToken, event);
    }
    onDropDownChange(dataModel) {
        this.onDropDownValueChange(this.addDataPopupToken, dataModel);
    }
}
