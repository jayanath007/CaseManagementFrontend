
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { BaseMessageOperations } from './base-message-operations';
import {
    getSortedItemsByViewId, findFolder, getSelectedItemsByViewId,
    getItemLoadingByViewId, getItemViewIdByFolderId, getItemListViewOptionsByViewId,
    getIsInSearchModeByViewId, getViewingItemByViewId, getFolderList

} from '../reducers';

import { MessageListActions } from '../models/enums';
import { AuthInfoStateService } from '../../auth';

export class BaseItemManager extends BaseMessageOperations {
    constructor(store: Store<any>, public service: AuthInfoStateService) {
        super(store);
    }

    protected getActiveItemsByViewId(viewId: string) {
        return this.store.select(getSortedItemsByViewId(viewId));
    }

    protected getSelectedItemsByViewId(viewId: string) {
        return this.store.select(getSelectedItemsByViewId(viewId));
    }

    protected getActiveItemsLoadingByViewId(viewId: string) {
        return this.store.select(getItemLoadingByViewId(viewId));
    }
    protected getViewingItemByViewId(viewId: string) {
        return this.store.select(getViewingItemByViewId(viewId)).pipe(map((item) => ({ item, viewId })));
    }
    protected findFolderById(folderId: string) {
        return this.store.select(findFolder(folderId)).pipe(
            filter((folder) => !!folder));
    }

    protected getItemViewIdByFolderId(folderId: string) {
        return this.store.select(getItemViewIdByFolderId(folderId));
    }

    protected getItemListViewOptionsByViewId(viewId: string) {
        return this.store.select(getItemListViewOptionsByViewId(viewId));
    }

    protected getIsInSearchModeByViewId(viewId: string) {
        return this.store.select(getIsInSearchModeByViewId(viewId));
    }
    protected getUser() {
        return this.service.getUser();
    }
    protected getFolderList() {
        return this.store.select(getFolderList);
    }
    // public selectItem(item: MessageItemWrapper) {
    //     this.store.dispatch(new ItemSelect({ item: item }));
    // }
}
