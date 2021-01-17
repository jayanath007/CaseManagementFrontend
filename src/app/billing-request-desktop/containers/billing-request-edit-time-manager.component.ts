import { BaseBillingRequestManager } from './../../billing-request-core/containers/billing-request-manager';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';

@Component({
    selector: 'dps-billing-request-edit-time-manager',
    template: `<dps-billing-request-edit-time
                [requestViewData]="requestViewData$ | async"
                [rowData]="rowData"
                (timeEntryEditSave)="onTimeEntryEditSave($event)"
                (close)="onClose($event)">
               </dps-billing-request-edit-time>`
})
export class BillingRequestEditTimeManagerComponent extends BaseBillingRequestManager implements OnInit {
    importPopupToken: string;
    rowData: number;
    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<BillingRequestEditTimeManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        this.importPopupToken = this.data.token;
        super.initEditTimePopup(this.data.token);
        this.rowData = this.data.input.rowData;
    }
    onClose(event) {
        this.dialogRef.close(event);
    }
    onTimeEntryEditSave(timeEditModel) {
        this.onTimeEntryEditSaveData(this.importPopupToken, timeEditModel);
    }
}
