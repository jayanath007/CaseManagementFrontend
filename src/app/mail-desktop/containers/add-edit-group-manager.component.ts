import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseAddEditGroupManager } from '../../mail-core/containers/base-add-edit-group-manager';

@Component({
    selector: 'dps-add-edit-group-manager',
    template: '<ng-content></ng-content>',
})
export class AddEditGroupManagerComponent extends BaseAddEditGroupManager implements OnInit, OnDestroy {

    @Input() groupId: string;
    constructor(store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        this.onInit(this.groupId);
    }

    ngOnDestroy() {

    }

}
