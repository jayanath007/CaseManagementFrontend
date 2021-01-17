
import { switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
    getSortedFolderList, getSortedWelknownFolderList, getIsFolderLoading,
    getSelectedFolder, getIsInSearchModeByViewId, getActiveViewId, getDeletedItemsFolder, getMailBoxes
} from '../reducers';
import { FolderItemWrapper, MailBox } from './../models/interfaces';
import { FolderEditMode, FolderEditKind } from '../../core/organizer/enums';
import {
    ActivateFolderEditMode, DeleteFolder, FinalizeFolderEditMode,
    ToggleFolderExpand, SelectFolder, CreateRootMessageFolder, ToggleMailBox, RemoveMailBox, AddMailBox, RefreshMailBox
} from '../actions/folders';

import { NewMail, RefreshView } from '../actions/items';
import { MoveItems } from '../../mail-item-core';

export interface FolderMenuAction {
    type: FolderEditMode;
    payload: { kind: FolderEditKind, value?: string, item?: FolderItemWrapper };
}

export class BaseFolderManager {

    constructor(protected store: Store<any>) {
    }

    private getActiveViewId() {
        return this.store.select(getActiveViewId);
    }

    public getSelectedFolder() {
        return this.store.select(getSelectedFolder);
    }
    public getDeletedItemsFolder() {
        return this.store.select(getDeletedItemsFolder);
    }
    public getIsSearching() {
        return this.getActiveViewId().pipe(switchMap((viewId) => this.store.select(getIsInSearchModeByViewId(viewId))));
    }

    public getSortedFolderList() {
        return this.store.select(getSortedFolderList);
    }
    public getMailBoxes() {
        return this.store.select(getMailBoxes);
    }
    public getSortedWelknownFolderList() {
        return this.store.select(getSortedWelknownFolderList);
    }

    public getIsFolderLoading() {
        return this.store.select(getIsFolderLoading);
    }

    public onMoveItems({ items, folderId, owner }) {
        this.store.dispatch(new MoveItems({ items, folderId, owner }));
    }

    public onFolderToggle(item: FolderItemWrapper) {
        this.store.dispatch(new ToggleFolderExpand(item));
    }
    public onMailboxToggle(mailBox: MailBox) {
        this.store.dispatch(new ToggleMailBox(mailBox));
    }
    public onMailboxRefresh(mailBox: MailBox) {
        this.store.dispatch(new RefreshMailBox(mailBox));
    }
    public folderSelect(item: FolderItemWrapper) {
        this.store.dispatch(new SelectFolder(item));
    }
    public onFolderRefresh(item: FolderItemWrapper) {
        this.store.dispatch(new RefreshView({ viewId: item.data.id }));
    }
    public onItemEditOperation({ type, payload }: FolderMenuAction) {

        if (payload.kind === FolderEditKind.Init) {
            this.store.dispatch(new ActivateFolderEditMode({
                item: payload.item,
                editMode: type
            }));
        }

        if (payload.kind === FolderEditKind.Confirm || payload.kind === FolderEditKind.Reject) {
            if (type === FolderEditMode.Delete) {
                if (payload.kind === FolderEditKind.Confirm) {
                    this.store.dispatch(new DeleteFolder({ item: payload.item, owner: payload.item.owner }));
                }
            } else {

                const confirm: boolean = payload.kind === FolderEditKind.Confirm;
                this.store.dispatch(new FinalizeFolderEditMode({
                    item: payload.item,
                    editMode: type,
                    confirm: confirm,
                    value: payload.value,
                    owner: payload.item.owner
                }));
            }
        }
    }

    public newMail(token) {
        this.store.dispatch(new NewMail({ token: token }));
    }

    public newRootFolder(displayName) {
        this.store.dispatch(new CreateRootMessageFolder({ displayName: displayName }));
    }
    public onRemoveSharedFolder(event) {
        this.store.dispatch(new RemoveMailBox(event));
    }
    public onAddSharedFolder(event) {
        this.store.dispatch(new AddMailBox(event));
    }
}
