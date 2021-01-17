import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFolderPermissionsManager } from '../../mail-core/containers/base-folder-permissions-manager';
import { MailFolder } from '../../core/lib/microsoft-graph';

@Component({
    selector: 'dps-folder-permissions-manager',
    template: '<ng-content></ng-content>',
})
export class FolderPermissionsManagerComponent extends BaseFolderPermissionsManager implements OnInit {

    @Input() selectedFolder: MailFolder;
    constructor(store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        super.initSelectors(this.selectedFolder);
    }

}
