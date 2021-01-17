import { BaseBillingRequestManager } from './../../billing-request-core/containers/billing-request-manager';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { RequestFormTypes } from '../../billing-request-core/models/enums';

@Component({
    selector: 'dps-print-setting-manager',
    template: `<dps-print-options-data
                [requestViewData]="requestViewData$ | async"
                [printAllDropDownData]="printAllDropDownData$ | async"
                (printSaveAddress)="onPrintSaveAddress($event)"
                (printMakeDefaultAllBill)="onPrintMakeDefaultBillClick()"
                (updatePrintControllersValue)="onUpdateControllersValue($event)"
                (billingAddressTypeChange)="onBillingAddressTypeChange($event)"
                (close)="onClose($event)">
               </dps-print-options-data>`
})
export class PrintSettingManagerComponent extends BaseBillingRequestManager implements OnInit {
    requestFormTypes: RequestFormTypes;
    printSettingPopupToken: string;

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: {}[], token: string },
        public dialogRef: MatDialogRef<PrintSettingManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        this.printSettingPopupToken = this.data.token;
        super.initPrintSettingPopup(this.data.token);
    }
    onClose(event) {
        this.dialogRef.close(event);
    }
    onPrintSaveAddress(object) {
        this.onPrintOptionSaveAddressData(this.printSettingPopupToken, object);
    }
    onPrintMakeDefaultBillClick() {
        this.onPrintMakeDefaultAllBillClick(this.printSettingPopupToken);
    }
    onUpdateControllersValue(keyValue) {
        this.onUpdatePrintControllersValue(this.printSettingPopupToken, keyValue);
    }
    onBillingAddressTypeChange(value) {
        this.onBillingAddressTypeChangeClick(this.printSettingPopupToken, value);
    }
}
