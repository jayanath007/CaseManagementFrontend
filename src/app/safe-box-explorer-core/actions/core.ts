import { ResponseNodeData, TreeNodeItem, Blob } from './../models/interfaces';
import { TokenizeAction, SafeBoxType } from '../../core';
import { Action } from '@ngrx/store';
import { ExplorerViewType } from '../models/enum';

export const INIT_SAFE_BOX_EXPLORER = 'DPS_INIT_SAFE_BOX_EXPLORER';
export const INIT_SAFE_BOX_EXPLORER_SUCCESS = 'DPS_INIT_SAFE_BOX_EXPLORER_SUCCESS';
export const INIT_SAFE_BOX_EXPLORER_FAIL = 'DPS_INIT_SAFE_BOX_EXPLORER_FAIL';

export const EXPAND_SAFE_BOX_EXPLORER = 'DPS_EXPAND_SAFE_BOX_EXPLORER';
export const EXPAND_SAFE_BOX_EXPLORER_SUCCESS = 'DPS_EXPAND_SAFE_BOX_EXPLORER_SUCCESS';
export const EXPAND_SAFE_BOX_EXPLORER_FAIL = 'DPS_EXPAND_SAFE_BOX_EXPLORER_FAIL';

export const EXPAND_COLLAPSED_SAFE_BOX = 'EXPAND_COLLAPSED_SAFE_BOX';

export const SELECT_BLOB_SAFE_BOX = 'SELECT_BLOB_SAFE_BOX';

// Download Item
export const ITEM_DOWNLOAD = 'SAFE_BOX_ITEM_DOWNLOAD';
export const ITEM_DOWNLOAD_SUCCESS = 'SAFE_BOX_ITEM_DOWNLOAD_SUCCESS';
export const ITEM_DOWNLOAD_FAIL = 'SAFE_BOX_ITEM_DOWNLOAD_FAIL';

export const ITEM_VIEW = 'DPS_SAFE_BOX_ITEM_VIEW';

// Rename Item
export const ITEM_RENAME = 'SAFE_BOX_ITEM_RENAME';
export const ITEM_RENAME_SUCCESS = 'SAFE_BOX_ITEM_RENAME_SUCCESS';
export const ITEM_RENAME_FAIL = 'SAFE_BOX_ITEM_RENAME_FAIL';

// Rename Item
export const ITEM_DELETE = 'SAFE_BOX_ITEM_DELETE';
export const ITEM_DELETE_SUCCESS = 'SAFE_BOX_ITEM_DELETE_SUCCESS';
export const ITEM_DELETE_FAIL = 'SAFE_BOX_ITEM_DELETE_FAIL';
export const CHANGE_VIEW_TYPE_SAFE_BOX = 'CHANGE_VIEW_TYPE_SAFE_BOX';

// Upload
export const UPLOAD_FILE_SAFE_BOX_EXPLORER = 'UPLOAD_FILE_SAFE_BOX_EXPLORER';
export const UPLOAD_FILE_SAFE_BOX_EXPLORER_SUCCESS = 'UPLOAD_FILE_SAFE_BOX_EXPLORER_SUCCESS';
export const UPLOAD_FILE_SAFE_BOX_EXPLORER_FAIL = 'UPLOAD_FILE_SAFE_BOX_EXPLORER_FAIL';

// Move Item
export const ITEM_MOVE = 'DPS_ITEM_MOVE_ITEM_SAFE_BOX_EXPLORER';
export const ITEM_MOVE_SUCCESS = 'DPS_ITEM_MOVE_ITEM_SAFE_BOX_EXPLORER_SUCCESS';
export const ITEM_MOVE_FAIL = 'DPS_ITEM_MOVE_ITEM_SAFE_BOX_EXPLORER_FAIL';

export const ITEM_COPY = 'DPS_SAFE_BOX_ITEM_COPY';
export const ITEM_PASTE = 'DPS_SAFE_BOX_ITEM_PASTE';
export const ITEM_CUT_SUCCESS = 'DPS_SAFE_BOX_ITEM_CUT_SUCCESS';
export const ITEM_COPY_SUCCESS = 'DPS_SAFE_BOX_ITEM_COPY_SUCCESS';

export const RELOAD = 'RELOAD_SAFE_BOX';
export const NAVIGETE = 'DPS_NAVIGETE_SAFE_BOX';
export const SELECT_FOLDER = 'DPS_SAFE_BOX_SELECT_FOLDER';
export const CHANGE_SAFE_BOX_TYPE = 'DPS_SAFE_BOX_CHANGE_SAFE_BOX_TYPE';

export const REMOVE_COPY_FROM = 'DPS_SAFE_BOX_REMOVE_COPY_FROM';

export class InitSafeBoxExplorer extends TokenizeAction implements Action {
    readonly type = INIT_SAFE_BOX_EXPLORER;
    constructor(public token: string) {
        super(token);
    }
}

export class InitSafeBoxExplorerSuccess extends TokenizeAction implements Action {
    readonly type = INIT_SAFE_BOX_EXPLORER_SUCCESS;
    constructor(public token: string, public payload: { response: ResponseNodeData, rootNodeName: string }) {
        super(token);
    }
}

export class InitSafeBoxExplorerFail extends TokenizeAction implements Action {
    readonly type = INIT_SAFE_BOX_EXPLORER_FAIL;
    constructor(public token: string, public payload: { response: ResponseNodeData }) {
        super(token);
    }
}


export class UploadFileSafeBoxExplorer extends TokenizeAction implements Action {
    readonly type = UPLOAD_FILE_SAFE_BOX_EXPLORER;
    constructor(public token: string, public payload: { file: any[], path: string }) {
        super(token);
    }
}

export class UploadFileSafeBoxExplorerSuccess extends TokenizeAction implements Action {
    readonly type = UPLOAD_FILE_SAFE_BOX_EXPLORER_SUCCESS;
    constructor(public token: string, public payload: { response: any }) {
        super(token);
    }
}

export class UploadFileSafeBoxExplorerFail extends TokenizeAction implements Action {
    readonly type = UPLOAD_FILE_SAFE_BOX_EXPLORER_FAIL;
    constructor(public token: string, public payload: { response: any }) {
        super(token);
    }
}

export class ChangeViewTypeSafeBoxSafeBox extends TokenizeAction implements Action {
    readonly type = CHANGE_VIEW_TYPE_SAFE_BOX;
    constructor(public token: string, public payload: { viewType: ExplorerViewType }) {
        super(token);
    }
}

export class ExpandCollapsedSafeBox extends TokenizeAction implements Action {
    readonly type = EXPAND_COLLAPSED_SAFE_BOX;
    constructor(public token: string, public payload: { item: TreeNodeItem }) {
        super(token);
    }
}

export class SelectBlobSafeBox extends TokenizeAction implements Action {
    readonly type = SELECT_BLOB_SAFE_BOX;
    constructor(public token: string, public payload: Blob[]) {
        super(token);
    }
}

export class ExpandSafeBoxExplorer extends TokenizeAction implements Action {
    readonly type = EXPAND_SAFE_BOX_EXPLORER;
    constructor(public token: string, public payload: { prefix: string, isNavigete?: boolean }) {
        super(token);
    }
}

export class ExpandSafeBoxExplorerSuccess extends TokenizeAction implements Action {
    readonly type = EXPAND_SAFE_BOX_EXPLORER_SUCCESS;
    constructor(public token: string, public payload: { response: any, prefix: string }) {
        super(token);
    }
}

export class ExpandSafeBoxExplorerFail extends TokenizeAction implements Action {
    readonly type = EXPAND_SAFE_BOX_EXPLORER_FAIL;
    constructor(public token: string, public payload: { treeData: any }) {
        super(token);
    }
}

export class ItemDownload extends TokenizeAction implements Action {
    readonly type = ITEM_DOWNLOAD;
    constructor(public token: string, public payload: { path: string, isView?: boolean }) {
        super(token);
    }
}

export class ItemDownloadSuccess extends TokenizeAction implements Action {
    readonly type = ITEM_DOWNLOAD_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class ItemDownloadFail extends TokenizeAction implements Action {
    readonly type = ITEM_DOWNLOAD_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ItemView extends TokenizeAction implements Action {
    readonly type = ITEM_VIEW;
    constructor(public token: string, public payload: { viewUrl: string, extention: string }) {
        super(token);
    }
}

export class ItemRename extends TokenizeAction implements Action {
    readonly type = ITEM_RENAME;
    constructor(public token: string, public payload: { path: string, newName: string }) {
        super(token);
    }
}

export class ItemRenameSuccess extends TokenizeAction implements Action {
    readonly type = ITEM_RENAME_SUCCESS;
    constructor(public token: string, public payload: { path: string }) {
        super(token);
    }
}

export class ItemRenameFail extends TokenizeAction implements Action {
    readonly type = ITEM_RENAME_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ItemDelete extends TokenizeAction implements Action {
    readonly type = ITEM_DELETE;
    constructor(public token: string, public payload: { paths: string[], cutItemPaths?: string[] }) {
        super(token);
    }
}

export class ItemDeleteSuccess extends TokenizeAction implements Action {
    readonly type = ITEM_DELETE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class ItemDeleteFail extends TokenizeAction implements Action {
    readonly type = ITEM_DELETE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class Reload extends TokenizeAction implements Action {
    readonly type = RELOAD;
    constructor(public token: string) {
        super(token);
    }
}

export class ItemMove extends TokenizeAction implements Action {
    readonly type = ITEM_MOVE;
    constructor(public token: string, public payload: { item: Blob[], newPath: string }) {
        super(token);
    }
}

export class ItemMoveSuccess extends TokenizeAction implements Action {
    readonly type = ITEM_MOVE_SUCCESS;
    constructor(public token: string, public payload: { path: string[] }) {
        super(token);
    }
}

export class ItemMoveFail extends TokenizeAction implements Action {
    readonly type = ITEM_MOVE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class Navigete extends TokenizeAction implements Action {
    readonly type = NAVIGETE;
    constructor(public token: string, public payload: { type: string, prefix: string }) {
        super(token);
    }
}

export class ItemCopy extends TokenizeAction implements Action {
    readonly type = ITEM_COPY;
    constructor(public token: string, public payload: { type: 'copy' | 'cut', path: string[] }) {
        super(token);
    }
}

export class ItemPaste extends TokenizeAction implements Action {
    readonly type = ITEM_PASTE;
    constructor(public token: string, public payload: { type: 'copy' | 'cut', newpath: string, itemPath: string[] }) {
        super(token);
    }
}

export class ItemCutSuccess extends TokenizeAction implements Action {
    readonly type = ITEM_CUT_SUCCESS;
    constructor(public token: string, public payload: { paths: string[] }) {
        super(token);
    }
}

export class ItemCopySuccess extends TokenizeAction implements Action {
    readonly type = ITEM_COPY_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class SelectFolder extends TokenizeAction implements Action {
    readonly type = SELECT_FOLDER;
    constructor(public token: string, public payload: { folderPrefix: string }) {
        super(token);
    }
}
export class ChangeSafeBoxType extends TokenizeAction implements Action {
    readonly type = CHANGE_SAFE_BOX_TYPE;
    constructor(public token: string, public payload: SafeBoxType) {
        super(token);
    }
}

export class RemoveCopyFrom implements Action {
    readonly type = REMOVE_COPY_FROM;
    constructor() {
    }
}


export type Any = InitSafeBoxExplorer | InitSafeBoxExplorerSuccess | InitSafeBoxExplorerFail |
    ExpandSafeBoxExplorer | ExpandSafeBoxExplorerSuccess | ExpandSafeBoxExplorerFail | ExpandCollapsedSafeBox
    | ItemDownload | ItemDownloadSuccess | ItemDownloadFail | ItemView
    | ItemRename | ItemRenameSuccess | ItemRenameFail | ItemDelete | ItemDeleteSuccess | ItemDeleteFail
    | SelectBlobSafeBox | ChangeViewTypeSafeBoxSafeBox | UploadFileSafeBoxExplorer
    | UploadFileSafeBoxExplorerSuccess | UploadFileSafeBoxExplorerFail | Reload
    | ItemMove | ItemMoveSuccess | ItemMoveFail | Navigete | ItemCopy | ItemPaste | ItemCutSuccess | ItemCopySuccess
    | SelectFolder | ChangeSafeBoxType | RemoveCopyFrom;
