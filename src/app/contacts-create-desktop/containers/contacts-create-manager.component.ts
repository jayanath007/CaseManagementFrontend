import { ContactCreateInputData } from './../../contacts-create-core/models/interfaces';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseContacCreateManager } from '../../contacts-create-core/containers/base-contacts-create-manager.component';


@Component({
    selector: 'dps-contacts-create-manager',
    template: '<ng-content></ng-content>'
})

export class ContactsCreateManagerComponent extends BaseContacCreateManager implements OnInit {
    @Input() inputData: ContactCreateInputData;
    @Input() contactCreationToken: string;
    @Input() isPopup: boolean;

    constructor(protected store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        super.initSelectors(this.contactCreationToken, this.isPopup, this.inputData);
    }

}
