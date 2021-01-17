
import { switchMap, filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getActiveView, getItemsListByViewPath, getItemClipboard, getIsCopying, getSortOrderByViewPath, getSearchText } from '../reducers';
import { Observable, of } from 'rxjs';
import { ItemView, DriveListItemWrapper, ItemClipboard } from '../models/interfaces';
import {
    OpenItem, SelectItem, CutOrCopyItems, PasteItems,
    ClearOrRefreshItemView, MoveItems, RenameItem, DeleteItems, DownloadItem, CreateFolder, UploadItem,
    LoadNextItems, AddNewFile, ChangeSortOrder
} from '../actions/core';
import { ItemChangeKind, getCopyFrom } from '../../safe-box-explorer-core';
import { SAFE_BOX_DRIVE_TOKEN, POPUP_DRIVE_TOKEN } from '../models/const';
import { SafeBoxType } from '../../core';

export class BaseDriveFolderContentManager {

    activeView$: Observable<ItemView> = of(null);
    itemList$: Observable<DriveListItemWrapper[]> = of([]);
    clipboard$: Observable<ItemClipboard> = of(null);
    isCopying$: Observable<boolean> = of(false);
    sortOrder$: Observable<{}> = of(null);
    isSearching$: Observable<boolean> = of(false);
    copyFrom$: Observable<SafeBoxType> = of(null);

    token: string;

    constructor(protected store: Store<any>) {
    }

    onInit(isPopup) {
        this.token = isPopup ? POPUP_DRIVE_TOKEN : SAFE_BOX_DRIVE_TOKEN;
        this.activeView$ = this.store.select(getActiveView(this.token)).pipe(filter((view) => !!view));
        this.itemList$ = this.activeView$.pipe(
            switchMap((view) => this.store.select(getItemsListByViewPath(view.viewPath, this.token))));
        this.clipboard$ = this.store.select(getItemClipboard(this.token));
        this.isCopying$ = this.store.select(getIsCopying(this.token));
        this.sortOrder$ = this.activeView$.pipe(
            switchMap((view) => this.store.select(getSortOrderByViewPath(view.viewPath, this.token))));
        this.isSearching$ = this.store.select(getSearchText(this.token)).pipe(map(val => !!val));
        if (!isPopup) {
            this.copyFrom$ = this.store.select(getCopyFrom);
        }
    }
    onOpenItem(event) {
        this.store.dispatch(new OpenItem(this.token, event.viewPath, event.wrapper));
    }
    onSelecteItem(event) {
        this.store.dispatch(new SelectItem(this.token, event.viewPath, event.wrapper, event.isMulti));
    }
    onChangeItem(event: {
        kind: ItemChangeKind,
        value: any
    }) {
        switch (event.kind) {
            case ItemChangeKind.Copy:
                this.store.dispatch(new CutOrCopyItems(this.token, event.value, 'copy'));
                break;
            case ItemChangeKind.Cut:
                this.store.dispatch(new CutOrCopyItems(this.token, event.value, 'cut'));
                break;
            case ItemChangeKind.Paste:
                this.store.dispatch(new PasteItems(this.token, event.value.viewPath, event.value.item, event.value.copyFrom));
                break;
            case ItemChangeKind.Delete:
                this.store.dispatch(new DeleteItems(this.token, event.value.viewPath, event.value.item, event.value.dragItems));
                break;
            case ItemChangeKind.Download:
                this.store.dispatch(new DownloadItem(this.token, event.value));
                break;
            case ItemChangeKind.Move:
                this.store.dispatch(new MoveItems(this.token, event.value.viewPath, event.value.dragItems, event.value.item));
                break;
            case ItemChangeKind.Rename:
                this.store.dispatch(new RenameItem(this.token, event.value.newName, event.value.item));
                break;
            case ItemChangeKind.Share_File:

                break;
            case ItemChangeKind.Upload:
                this.store.dispatch(new UploadItem(this.token, event.value.dragItems, event.value.item));
                break;

            default:
                break;
        }
    }
    onRefresh(event) {
        this.store.dispatch(new ClearOrRefreshItemView(this.token, event));
    }
    onCreateFolder(activeView: ItemView, name) {
        this.store.dispatch(new CreateFolder(this.token, activeView.viewPath, activeView.owner, name));
    }
    onLoadMore(event) {
        this.store.dispatch(new LoadNextItems(this.token, event));
    }
    onAddNewFile(activeView, name) {
        this.store.dispatch(new AddNewFile(this.token, activeView.viewPath, activeView.owner, name));
    }
    onChangeSortOrder({ activeView, sortBy, orderBy }: { activeView: ItemView, sortBy: string, orderBy: string }) {
        this.store.dispatch(new ChangeSortOrder(this.token, activeView.viewPath, sortBy, orderBy));
    }
}
