import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseDriveFilePathManager } from '../../drive-core/containers/base-drive-file-path-manager';

@Component({
    selector: 'dps-drive-file-path-manager',
    template: `
        <dps-drive-item-path-list
            [navigations]="navigation$|async"
            [searchText]="searchText$|async"
            [copyingItems]="copyingItems$|async"
            [uploadingItems]="uploadingItems$|async"
            (navigate)="onNavigate($event)"
            (refresh)="onRefresh($event)"
            (clearCopyingItems)="onClearCopyingItems()"
            (clearUploadingItems)="onClearUploadingItems()"
        ></dps-drive-item-path-list>
    `,
})
export class DriveFilePathManagerComponent extends BaseDriveFilePathManager implements OnInit {
    @Input() isPopup: boolean;
    constructor(store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        super.onInit(this.isPopup);
    }



}
