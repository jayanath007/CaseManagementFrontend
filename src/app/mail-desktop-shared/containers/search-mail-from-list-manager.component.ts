import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseSearchMailFromListManager } from '../../contacts-and-people-core/containers/base-search-mail-from-list-manager';
@Component({
    selector: 'dps-search-mail-from-list-manager',
    template: '<ng-content></ng-content>',
})
export class SearchMailFromListManagerComponent extends BaseSearchMailFromListManager implements OnInit, OnDestroy {
    constructor(store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        this.getPeople();
        this.getSearchedUsers();
     }
    ngOnDestroy() { }
}
