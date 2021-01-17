
import { filter, map, switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { BaseMessageOperations } from './base-message-operations';
import {
    findNextItem, findPreviousItem, getActiveViewId, getViewingItemByViewId,
    getItemViewIdByFolderId, findFolder, getAutoReadItemId, getIsGroupMode, getSelectedGroup
} from '../reducers';
import { AuthInfoStateService } from '../../auth';
import { Observable } from 'rxjs';
import { MessageItemWrapper } from '../../mail-item-core';

export class BaseItemViewer extends BaseMessageOperations {
    constructor(store: Store<any>, public service: AuthInfoStateService) { super(store); }

    getActiveViewId() {
        return this.store.select(getActiveViewId);
    }
    getIsGroupMode() {
        return this.store.select(getIsGroupMode);
    }
    getSelectedGroup() {
        return this.store.select(getSelectedGroup);
    }

    getActiveViewingItemInfo() {
        return this.getActiveViewId().pipe(switchMap((viewId) =>
            this.store.select(getViewingItemByViewId(viewId)).pipe(map((item) => ({ item, viewId })))
        ));
    }

    getCurrentViewItem(): Observable<MessageItemWrapper> {
        return this.getActiveViewingItemInfo().pipe(map((info) => info.item));
    }

    getNext(_viewId: string) {
        if (_viewId) {
            return this.getViewingItemByViewId(_viewId).pipe(
                filter(item => !!item),
                switchMap((item) =>
                    this.store.select(findNextItem(item, _viewId))
                ));
        }
        return this.getActiveViewingItemInfo().pipe(
            switchMap(({ item, viewId }) => this.store.select(findNextItem(item, viewId))));
    }

    getPrevious(_viewId: string) {
        if (_viewId) {
            return this.getViewingItemByViewId(_viewId).pipe(
                filter((item) => !!item),
                switchMap((item) =>
                    this.store.select(findPreviousItem(item, _viewId))
                ));
        }
        return this.getActiveViewingItemInfo().pipe(
            switchMap(({ item, viewId }) => this.store.select(findPreviousItem(item, viewId))));
    }

    hasNext(viewId?: string) {
        return this.getNext(viewId).pipe(map((item) => !!item));
    }

    hasPrevious(viewId?: string) {
        return this.getPrevious(viewId).pipe(map((item) => !!item));
    }

    getUser() {
        return this.service.getUser();
    }

    getItemViewIdByFolderId(folderId) {
        return this.store.select(findFolder(folderId)).pipe(
            filter(folder => !!folder),
            switchMap((folder) =>
                this.store.select(getItemViewIdByFolderId(folder.data.id))
            ));
    }

    getViewingItemByViewId(viewId) {
        return this.store.select(getViewingItemByViewId(viewId));
    }
    getAutoReadItemId() {
        return this.store.select(getAutoReadItemId);
    }

}

