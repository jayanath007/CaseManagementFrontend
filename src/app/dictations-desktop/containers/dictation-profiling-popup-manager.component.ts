import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { BaseMatterManager } from '../../matter-search-core/containers';
import { ViewStateObserverService } from '../../shell-desktop';
import { IS_GOOGLE } from '../../shared';
import { BaseDictationsManager } from '../../dictations-core/containers/base-dictations-manager';




@Component({
    selector: 'dps-dictation-profiling-popup-manager',
    template: `<dps-dictation-profiling-popup
                 [myToken]="data.myToken"
                 [jobInfo]="data.itemData"
                 [profileClose]=" profileClose$ | async"
                  [profileGroups]="profileGroups$ | async"
                  [profileLoading]="profileLoading$ | async"
                  [jobDescriptionList]="jobDescription$ | async"
                  [profileSecrarary]="profileSecrarary$ | async"
                  (profilingSubmit)="onProfilingSubmit($event)"
                 (close)="onClose()">
                </dps-dictation-profiling-popup>`
})
export class DictationProfilingPopupManagerComponent extends BaseDictationsManager implements OnInit {

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { myToken: string, itemData: any },
        public dialogRef: MatDialogRef<DictationProfilingPopupManagerComponent>,
        private dialog: MatDialog) {
        super(store);
    }
    ngOnInit() {
        // this.myToken = this.data.myToken;
        const info: any = {
            itemData: this.data.itemData,

        };
        this.initDictationProfilingPopup(this.data.myToken, info);
    }

    onClose() {

        this.dialogRef.close();
    }

    onProfilingSubmit(event) {

        this.profilingSubmit(this.data.myToken, event);

    }
}
