import { BaseBillingRequestManager } from './../../billing-request-core/containers/billing-request-manager';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { RequestFormTypes } from '../../billing-request-core/models/enums';

@Component({
    selector: 'dps-billing-request-import-data-manager',
    template: `<dps-billing-request-import-data
                [requestViewData]="requestViewData$ | async"
                [feeEarnerList]="feeEarnerList$| async"
                [allocateList]="allocateList$| async"
                [vatCodeList]="vatCodeList$| async"
                (rowSelected)="onRowSelected($event)"
                (rowSelectedValUpdate)="onRowSelectedValUpdate($event)"
                (timeOkButtonUpdate)="onTimeOkButtonUpdate($event)"
                (selectUnselectWriteOffUpdate)="onSelectUnselectWriteOffRow($event)"
                (allocateSelectChange)="onAllocateSelectChange($event)"
                (onDropDownChange)="onDropDownChange($event)"
                (timeEntryEdit)="onTimeEntryEdit($event)"
                (close)="onClose($event)">
               </dps-billing-request-import-data>`
})
export class BillingRequestImportDataManagerComponent extends BaseBillingRequestManager implements OnInit {
    importPopupInputData;
    requestFormTypes: RequestFormTypes;
    importPopupToken: string;
    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: {}[], token: string },
        public dialogRef: MatDialogRef<BillingRequestImportDataManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        this.importPopupToken = this.data.token;
        super.initImportPopup(this.data.token);
    }
    onClose(event) {
        this.dialogRef.close(event);
    }
    onRowSelected(event) {
        this.onRowSelect(this.importPopupToken, event);
    }
    onRowSelectedValUpdate(event) {
        this.onRowValUpdate(this.importPopupToken, event);
    }
    onTimeOkButtonUpdate(event) {
        this.onTimeOkButtonClick(this.importPopupToken, event);
    }
    onSelectUnselectWriteOffRow(event) {
        this.onSelectUnselectWriteOff(this.importPopupToken, event);
    }
    onAllocateSelectChange(value) {
        this.onAllocateSelectChangeValue(this.importPopupToken, value);
    }
    onDropDownChange(dataModel) {
        this.onDropDownValueChange(this.importPopupToken, dataModel);
    }
    onTimeEntryEdit(rowData) {
        this.onTimeEntryEditData(this.importPopupToken, rowData);
    }
}
