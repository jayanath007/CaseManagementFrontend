import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseOpportunityManager } from './../../opportunity-core/containers/base-opportunity-manager';

@Component({
    selector: 'dps-close-opportunity-popup-manager',
    template: `<dps-close-opportunity-popup
                [feeEarnerList]="feeEarnerList$|async"
                [opportunity]="data.item"
                [departmentList]="departmentList$|async"
                [closeOpportunityPopupClose]="closeOpportunityPopupClose$|async"
                [isLoading]="isLoading$|async"
                [timeOffset]="(user$ | async).general.dateTimeOffset"
                (popupClose)="onClose()"
                (acceptedProcess)="onAcceptedProcess(data.token, $event)"
                (rejectedProcess)="onRejectedProcess(data.token, $event)"
                >
                </dps-close-opportunity-popup>`
})
export class CloseOpportunityPopupManagerComponent extends BaseOpportunityManager implements OnInit {

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { item: any, token: string },
        public dialogRef: MatDialogRef<CloseOpportunityPopupManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        this.initOpportunityClosePopup(this.data.token, this.data.item);
    }

    onClose() {
        if (status === 'success') {
            // this.onClearInputOpportunity(this.data.token);
        }
        this.dialogRef.close();
    }
}
