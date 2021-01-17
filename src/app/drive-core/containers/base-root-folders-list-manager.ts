import { Store } from '@ngrx/store';
import { InitDrive, ViewFolder, SearchDrive, CreateFolder, UploadItem, AddNewFile } from '../actions/core';
import { getStikeyFolders, getActiveView, getActiveDrive, getRootLoading } from '../reducers';
import { DriveItem } from '../../core/lib/microsoft-graph';
import { ItemView } from '../models/interfaces';
import { SAFE_BOX_DRIVE_TOKEN, POPUP_DRIVE_TOKEN } from '../models/const';
import { Observable, of } from 'rxjs';

export class BaseRootFoldersListManager {
    stikeyFolders$;
    activeView$;
    activeDrive$;
    loading$;
    token: string;
    constructor(protected store: Store<any>) {

    }
    onInit(isPopup) {
        this.token = isPopup ? POPUP_DRIVE_TOKEN : SAFE_BOX_DRIVE_TOKEN;
        this.store.dispatch(new InitDrive(this.token, null));
        this.stikeyFolders$ = this.store.select(getStikeyFolders(this.token));
        this.activeView$ = this.store.select(getActiveView(this.token));
        this.activeDrive$ = this.store.select(getActiveDrive(this.token));
        this.loading$ = this.store.select(getRootLoading(this.token));
    }
    onOpenItem(item: DriveItem) {
        this.store.dispatch(new ViewFolder(this.token, item));
    }
    onDriveSearch({ drive, searchText }) {
        this.store.dispatch(new SearchDrive(this.token, drive, searchText));
    }
    onCreateFolder(activeView: ItemView, name) {
        this.store.dispatch(new CreateFolder(this.token, activeView.viewPath, activeView.owner, name));
    }
    onUploadItem(event) {
        this.store.dispatch(new UploadItem(this.token, event.file, event.destItem));
    }
    onAddNewFile(activeView, name) {
        this.store.dispatch(new AddNewFile(this.token, activeView.viewPath, activeView.owner, name));
    }
}
