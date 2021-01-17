import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseSearchOptionsViewManager } from '../../mail-core/containers/base-search-options-view-manager';
import { FolderItemWrapper } from '../../mail-core';

@Component({
    selector: 'dps-search-options-view-manager',
    template: '<ng-content></ng-content>',
})
export class SearchOptionsViewManagerComponent extends BaseSearchOptionsViewManager implements OnInit, OnDestroy {
    @Input() selectedFolder: FolderItemWrapper;
    constructor(store: Store<any>) {
        super(store);
    }
    ngOnInit() { }
    ngOnDestroy() { }
    onSearchViewChange(changes) {
        this.searchViewChange({ changes: changes, folderId: this.selectedFolder.data.id });
    }
    onExitSearch() {
        this.exitSearch(this.selectedFolder.data.id);
    }
}
