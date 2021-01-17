import { Component, OnInit, Inject } from '@angular/core';
import { BaseBundlingManager } from '../../bundling-core/containers';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'dps-bundle-name-save-popup-manager',
    template: `<dps-add-bundle-name-popup
                [bundlingItemList] ="bundleObject$ | async"
                [bundlingAllItemList]="getBundledAllItemDataList(data.token)|async"
                (okPopupData)="onOk($event)"
                (close)="onClose()">
             </dps-add-bundle-name-popup>`
})
export class BundleNameSavePopupManagerComponent extends BaseBundlingManager implements OnInit {

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<BundleNameSavePopupManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        this.bundleObject$ = this.getBundleNameText(this.data.token);
    }
    onOk(event) {
        this.saveBundleData(this.data.token, event.bundleNameInput, event.bundleObjectId);
        this.dialogRef.close();
    }
    onClose() {
        this.dialogRef.close();
    }
}
