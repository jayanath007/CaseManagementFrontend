import { Action } from '@ngrx/store';
import { DriveItem, Drive, BaseItem, OnenoteOperation } from '../../core/lib/microsoft-graph';
import { DriveListItemWrapper, CopyingItem } from '../models/interfaces';
import { TokenizeAction, SafeBoxType } from '../../core';
export const INIT_DRIVE = 'DPS_INIT_DRIVE';
export const INIT_DRIVE_SUCCESS = 'DPS_INIT_DRIVE_SUCCESS';
export const INIT_DRIVE_FAIL = 'DPS_INIT_DRIVE_FAIL';

export const LIST_ITEMS = 'DPS_DRIVE_LIST_ITEMS';
export const LIST_ITEM_SUCCESS = 'DPS_DRIVE_LIST_ITEMS_SUCCESS';
export const LIST_ITEM_FAIL = 'DPS_DRIVE_LIST_ITEM_FAIL';

export const VIEW_FOLDER = 'DPS_DRIVE_VIEW_FOLDER';
export const LOAD_NEXT_ITEMS = 'DPS_DRIVE_LOAD_NEXT_ITEMS';
export const SELECT_ITEM = 'DPS_DRIVE_SELECT_ITEM';
export const OPEN_ITEM = 'DPS_DRIVE_OPEN_ITEM';
export const CUT_OR_COPY_ITEMS = 'DPS_DRIVE_COPY_ITEMS';
export const PASTE_ITEMS = 'DPS_DRIVE_PASTE_ITEMS';
export const CLEAR_CLIP_BOARD = 'DPS_DRIVE_CLEAR_CLIP_BOARD';
export const MOVE_ITEMS = 'DPS_DRIVE_MOVE_ITEMS';
export const CLEAR_OR_REFRESH_ITEM_VIEW = 'DPS_DRIVE_CLEAR_OR_REFRESH_ITEM_VIEW';
export const CLEAR_OR_REFRESH_PARENT_ITEM_VIEW = 'DPS_DRIVE_CLEAR_OR_REFRESH_PARENT_ITEM_VIEW';
export const SEARCH_DRIVE = 'DPS_DRIVE_SEARCH_DRIVE';
export const VIEW_FOLDER_BY_PATH = 'DPS_DRIVE_VIEW_FOLDER_BY_PATH';
export const UPLOAD_ITEM = 'DPS_DRIVE_UPLOAD_ITEM';
export const RENAME_ITEM = 'DPS_DRIVE_RENAME_ITEM';
export const RENAME_ITEM_SUCCESS = 'DPS_DRIVE_RENAME_ITEM_SUCCESS';
export const DELETE_ITEMS = 'DPS_DRIVE_DELETE_ITEMS';
export const DELETE_ITEMS_SUCCESS = 'DPS_DRIVE_DELETE_ITEMS_SUCCESS';
export const DOWNLOAD_ITEM = 'DPS_DRIVE_DOWNLOAD_ITEM';
export const CREATE_FOLDER = 'DPS_DRIVE_CREATE_FOLDER';
export const ADD_NEW_FILE = 'DPS_DRIVE_ADD_NEW_FILE';

export const SET_COPYING_ITEM = 'DPS_DRIVE_SET_COPYING_ITEM';
export const CLEAR_COPYING_ITEMS = 'DPS_DRIVE_CLEAR_COPYING_ITEMS';

export const SESSION_UPLOAD = 'DPS_DRIVE_SESSION_UPLOAD';
export const SESSION_UPLOAD_COMPLEAT = 'DPS_DRIVE_SESSION_UPLOAD_COMPLEAT';

export const CHANGE_SORT_ORDER = 'DPS_DRIVE_CHANGE_SORT_ORDER';

export class InitDrive extends TokenizeAction implements Action {
    readonly type = INIT_DRIVE;
    constructor(public token: string, public payload) {
        super(token);
    }
}

export class InitDriveSuccess extends TokenizeAction implements Action {
    readonly type = INIT_DRIVE_SUCCESS;
    constructor(public token: string, public roots: { drive: Drive, root: DriveItem, folders: DriveItem[] }[]) {
        super(token);
    }
}

export class InitDriveFail extends TokenizeAction implements Action {
    readonly type = INIT_DRIVE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ListItems extends TokenizeAction implements Action {
    readonly type = LIST_ITEMS;
    constructor(public token: string, public fullPath: string,
        public skipCount: number,
        public skipToken: string,
        public viewPath: string,
        public sortBy: string,
        public orderBy: string) {
        super(token);
    }
}

export class ListItemSuccess extends TokenizeAction implements Action {
    readonly type = LIST_ITEM_SUCCESS;
    constructor(public token: string, public viewPath: string,
        public result: { items: DriveItem[], skipToken: string }, public startIndex: number) {
        super(token);
    }
}

export class ListItemFaild extends TokenizeAction implements Action {
    readonly type = LIST_ITEM_FAIL;
    constructor(public token: string, public viewPath: string, public error: any) {
        super(token);
    }
}

export class ViewFolder extends TokenizeAction implements Action {
    readonly type = VIEW_FOLDER;
    constructor(public token: string, public item: BaseItem) {
        super(token);
    }
}

export class ViewFolderByViewPath extends TokenizeAction implements Action {
    readonly type = VIEW_FOLDER_BY_PATH;
    constructor(public token: string, public viewPath: string) {
        super(token);
    }
}

export class SelectItem extends TokenizeAction implements Action {
    readonly type = SELECT_ITEM;
    constructor(public token: string, public viewPath: string,
        public wrapper: DriveListItemWrapper, public isMulti: boolean = false) {
        super(token);
    }
}

export class OpenItem extends TokenizeAction implements Action {
    readonly type = OPEN_ITEM;
    constructor(public token: string, public viewPath: string, public wrapper: DriveListItemWrapper) {
        super(token);
    }
}

export class LoadNextItems extends TokenizeAction implements Action {
    readonly type = LOAD_NEXT_ITEMS;
    constructor(public token: string, public viewPath: string) {
        super(token);
    }
}

export class CutOrCopyItems extends TokenizeAction implements Action {
    readonly type = CUT_OR_COPY_ITEMS;
    constructor(public token: string, public viewPath: string, public pasteType: 'copy' | 'cut') {
        super(token);
    }
}

export class PasteItems extends TokenizeAction implements Action {
    readonly type = PASTE_ITEMS;
    constructor(public token: string, public viewPath: string, public destItem: BaseItem, public copyFrom: SafeBoxType) {
        super(token);
    }
}
export class ClearClipBoard extends TokenizeAction implements Action {
    readonly type = CLEAR_CLIP_BOARD;
    constructor(public token: string, ) {
        super(token);
    }
}
export class MoveItems extends TokenizeAction implements Action {
    readonly type = MOVE_ITEMS;
    constructor(public token: string, public viewPath: string, public moveItems: BaseItem[],
        public destItem: BaseItem) {
        super(token);
    }
}
export class SearchDrive extends TokenizeAction implements Action {
    readonly type = SEARCH_DRIVE;
    constructor(public token: string, public drive: DriveItem, public searchText: string) {
        super(token);
    }
}

export class ClearOrRefreshItemView extends TokenizeAction implements Action {
    readonly type = CLEAR_OR_REFRESH_ITEM_VIEW;
    constructor(public token: string, public viewPath: string) {
        super(token);
    }
}

export class ChangeSortOrder extends TokenizeAction implements Action {
    readonly type = CHANGE_SORT_ORDER;
    constructor(public token: string, public viewPath: string, public sortBy: string, public orderBy: string) {
        super(token);
    }
}

export class ClearOrRefreshParentItemView extends TokenizeAction implements Action {
    readonly type = CLEAR_OR_REFRESH_PARENT_ITEM_VIEW;
    constructor(public token: string, public viewPath: string) {
        super(token);
    }
}
export class UploadItem extends TokenizeAction implements Action {
    readonly type = UPLOAD_ITEM;
    constructor(public token: string, public file: File, public destItem: BaseItem) {
        super(token);
    }
}
export class RenameItem extends TokenizeAction implements Action {
    readonly type = RENAME_ITEM;
    constructor(public token: string, public newName: string, public item: BaseItem) {
        super(token);
    }
}
export class RenameItemSuccess extends TokenizeAction implements Action {
    readonly type = RENAME_ITEM_SUCCESS;
    constructor(public token: string, public item: BaseItem) {
        super(token);
    }
}
export class DeleteItems extends TokenizeAction implements Action {
    readonly type = DELETE_ITEMS;
    constructor(public token: string, public viewPath: string, public destItem: BaseItem,
        public deleteItems: BaseItem[]) {
        super(token);
    }
}
export class DeleteItemsSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_ITEMS_SUCCESS;
    constructor(public token: string, public items: BaseItem[]) {
        super(token);
    }
}
export class DownloadItem extends TokenizeAction implements Action {
    readonly type = DOWNLOAD_ITEM;
    constructor(public token: string, public item: BaseItem) {
        super(token);
    }
}

export class CreateFolder extends TokenizeAction implements Action {
    readonly type = CREATE_FOLDER;
    constructor(public token: string, public viewPath: string, public destItem: BaseItem,
        public name: string) {
        super(token);
    }
}
export class AddNewFile extends TokenizeAction implements Action {
    readonly type = ADD_NEW_FILE;
    constructor(public token: string, public viewPath: string, public destItem: BaseItem, public name: string) {
        super(token);
    }
}

export class SetCopyingItem extends TokenizeAction implements Action {
    readonly type = SET_COPYING_ITEM;
    constructor(public token: string, public payload: CopyingItem) {
        super(token);
    }
}
export class ClearCopyingItems extends TokenizeAction implements Action {
    readonly type = CLEAR_COPYING_ITEMS;
    constructor(public token: string, ) {
        super(token);
    }
}

export class SessionUpload extends TokenizeAction implements Action {
    readonly type = SESSION_UPLOAD;
    constructor(public token: string, public file: File, public uploadUrl: string,
        public index: number, public destPath: string, public status: 'completed' | 'inProgress' | 'error') {
        super(token);
    }
}
export class SessionUploadCompleat extends TokenizeAction implements Action {
    readonly type = SESSION_UPLOAD_COMPLEAT;
    constructor(public token: string) {
        super(token);
    }
}

export type Any = InitDrive | InitDriveSuccess | InitDriveFail | ListItems |
    ListItemSuccess | ListItemFaild | ViewFolder | LoadNextItems |
    SelectItem | OpenItem | CutOrCopyItems | PasteItems | ClearOrRefreshItemView |
    ViewFolderByViewPath | SearchDrive | ClearClipBoard | RenameItemSuccess | DeleteItemsSuccess | AddNewFile |
    SetCopyingItem | ClearCopyingItems | ChangeSortOrder | SessionUpload | SessionUploadCompleat;

