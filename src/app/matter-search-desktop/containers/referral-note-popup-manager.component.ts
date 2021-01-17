import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { BaseUserMovementManager } from '../../user-movement-core/containers';
import { BaseMatterManager } from '../../matter-search-core/containers';
import { ViewStateObserverService } from '../../shell-desktop';
import { IS_GOOGLE } from '../../shared';
import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';
import { MatterSearchGridData } from '../../core/lib/matter';


@Component({
    selector: 'dps-referral-note-popup-manager',
    template: `<dps-referral-note-and-date-popup
                 [myToken]="data.myToken"
                 [matterInfo]="data.matterInfo"
                 [refferalNotePopupClose]="refferalNotePopupClose$ | async"
                 [refferalNoteLoading]="refferalNoteLoading$ | async"
                 [currentReviewNote]="currentReviewNote$|async"
                 (addReferralNote)="onAddReferralNote($event)"
                 (popupClose)="onClose()">
                </dps-referral-note-and-date-popup>`
})
export class ReferralNotePopupManagerComponent extends BaseMatterManager implements OnInit {

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { myToken: string, matterInfo: MatterSearchGridData },
        public dialogRef: MatDialogRef<ReferralNotePopupManagerComponent>,
        public shellStateManage: ViewStateObserverService, private dialog: MatDialog,
        @Inject(IS_GOOGLE) isGoogle: string) {
        super(store, shellStateManage, isGoogle);
    }
    ngOnInit() {
        //  this.myToken = this.data.myToken;
        const info: CaseFileIdentityWithAppIdViewModel = {
            branchId: this.data.matterInfo.branchID,
            appId: this.data.matterInfo.appID,
            fileId: this.data.matterInfo.fileID,
            displayDataString: null,
        };
        this.initAddReferralNotePopup(this.data.myToken, info);
    }

    onClose() {
        if (status === 'success') {
            // this.onClearInputOpportunity(this.data.token);
        }
        this.dialogRef.close();
    }

    onAddReferralNote(event) {

        this.addReferralNote(this.data, event);

    }

    onRefreshUserMovementList(event) {
        //     this.refreshUserMovementList(this.myToken);
    }
}
