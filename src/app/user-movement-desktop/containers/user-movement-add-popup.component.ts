import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BaseUserMovementManager } from '../../user-movement-core/containers';


@Component({
    selector: 'dps-user-movement-add-popup',
    template: `<dps-add-movement-popup-layout
                 [myToken]="data.myToken"
                 [data]="data.selectedUserInMovement"
                 [timeOffset]="(user$ | async)?.general?.dateTimeOffset"
                 [nextAvailableTypes]="nextAvailableTypes$|async"
                 [timeList]= "timeList$ | async"
                 [addNewMovementpopupClose]="addNewMovementpopupClose$ | async"
                 [addMovementloading]="addPopuploading$ | async"
                 [locationList]= "locationList$ | async"
                (submitUserMovemetDetails)="onSubmitUserMovemetDetails($event)"
                (refreshUserMovementList)="onRefreshUserMovementList($event)"
                 (popupClose)="onClose()">
                </dps-add-movement-popup-layout>`
})
export class UserMovementAddPopupComponent extends BaseUserMovementManager implements OnInit {

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: {

        myToken: string,
        selectedUserInMovement: any
        // userList: any;
        // departmentList: any;

    },
        public dialogRef: MatDialogRef<UserMovementAddPopupComponent>) {
        super(store);
    }
    ngOnInit() {
        this.myToken = this.data.myToken;
        this.initAddUserMovementPopup(this.data.selectedUserInMovement);
    }

    onClose() {
        if (status === 'success') {
            // this.onClearInputOpportunity(this.data.token);
        }
        this.dialogRef.close();
    }

    onSubmitUserMovemetDetails(event) {

        this.submitUserMovemetDetails(this.myToken, event);

    }

    onRefreshUserMovementList(event) {
        this.refreshUserMovementList(this.myToken);
    }
}
