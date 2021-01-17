import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseProbateManager } from '../../../probate-core/containers/base-probate-manager.component';


@Component({
    selector: 'dps-probatepayment-receipt-manager',
    template: `<dps-probate-payment-receipt
 
  [loading]="isLoading$ | async"
  (submitSaveData)="onSubmitSaveData($event)"
  (closePopup)="closePopup()">
                </dps-probate-payment-receipt>`
})
export class ProbetePaymentReceiptManagerComponent extends BaseProbateManager implements OnInit {

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: {

        token: string,
        inputData: any
        // userList: any;
        // departmentList: any;

    },
        public dialogRef: MatDialogRef<ProbetePaymentReceiptManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        // this.myToken = this.data.myToken;
        this.initAddAsset(this.data.token, this.data.inputData);
        // this.initAddUserMovementPopup(this.data.selectedUserInMovement);
    }
    closePopup() {
        this.dialogRef.close();
    }
    onClose() {

        this.dialogRef.close();
    }

    onSubmitSaveData(event) {

    }

}
