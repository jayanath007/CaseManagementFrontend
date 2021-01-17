import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseDriveFileItemViewManager } from '../../drive-core/containers/base-drive-file-item-view-manager';

@Component({
    selector: 'dps-drive-file-item-view-manager',
    template: `
        <dps-drive-file-item-view
            [items]="itemList$|async"
            [currentFolder]="activeView$|async"
        ></dps-drive-file-item-view>
    `,
})
export class DriveFileItemViewManagerComponent extends BaseDriveFileItemViewManager implements OnInit {

    constructor(store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        super.onInit();
    }



}
