
import { switchMap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { getViewPathToNavigation, getActiveView, getSearchText, getCopyingItems, getUploadingItems } from '../reducers';
import { ItemView, CopyingItem, UploadingItem } from '../models/interfaces';
import { ViewFolderByViewPath, ClearOrRefreshItemView, ClearCopyingItems, SessionUploadCompleat } from '../actions/core';
import { SAFE_BOX_DRIVE_TOKEN, POPUP_DRIVE_TOKEN } from '../models/const';

export class BaseDriveFilePathManager {

    activeView$: Observable<ItemView> = of(null);
    navigation$: Observable<any[]> = of([]);
    searchText$: Observable<string> = of('');
    copyingItems$: Observable<CopyingItem[]> = of([]);
    uploadingItems$: Observable<UploadingItem[]> = of([]);
    token: string;

    constructor(protected store: Store<any>) {

    }
    onInit(isPopup) {
        this.token = isPopup ? POPUP_DRIVE_TOKEN : SAFE_BOX_DRIVE_TOKEN;
        this.activeView$ = this.store.select(getActiveView(this.token)).pipe(filter((view) => !!view));
        this.navigation$ = this.activeView$.pipe(
            switchMap((view) => this.store.select(getViewPathToNavigation(view.viewPath, this.token))));
        this.searchText$ = this.store.select(getSearchText(this.token));
        this.copyingItems$ = this.store.select(getCopyingItems(this.token));
        this.uploadingItems$ = this.store.select(getUploadingItems(this.token));
    }
    onNavigate(event) {
        this.store.dispatch(new ViewFolderByViewPath(this.token, event));
    }
    onRefresh(event) {
        this.store.dispatch(new ClearOrRefreshItemView(this.token, event));
    }
    onClearCopyingItems() {
        this.store.dispatch(new ClearCopyingItems(this.token));
    }
    onClearUploadingItems() {
        this.store.dispatch(new SessionUploadCompleat(this.token));
    }
}
