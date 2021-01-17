import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { DiaryFolder, DiaryFolderWrapper, FolderNode, FolderFlatNode } from '../models/interfaces';

export const INIT_DIARY_FOLDER = 'DPS_INIT_DIARY_FOLDER';

export const GET_FOLDERS = 'DPS_DIARY_FOLDER_GET_FOLDERS';
export const GET_FOLDERS_SUCCESS = 'DPS_DIARY_FOLDER_GET_FOLDERS_SUCCESS';
export const GET_FOLDERS_FAIL = 'DPS_DIARY_FOLDER_GET_FOLDERS_FAIL';

export const ADD_FOLDER = 'DPS_DIARY_FOLDER_ADD_FOLDER';
export const DELETE_FOLDER = 'DPS_DIARY_FOLDER_DELETE_FOLDER';
export const CANCEL_DELETED_FOLDER = 'DPS_DIARY_FOLDER_CANCEL_DELETED_FOLDER';
export const CHANGE_IS_DEFAULT = 'DPS_DIARY_FOLDER_CHANGE_IS_DEFAULT';
export const CHANGE_FOLDER_NAME = 'DPS_DIARY_FOLDER_CHANGE_FOLDER_NAME';

export const SAVE_FOLDERS = 'DPS_DIARY_FOLDER_SAVE_FOLDERS';
export const SAVE_FOLDERS_SUCCESS = 'DPS_DIARY_FOLDER_SAVE_FOLDERS_SUCCESS';
export const SAVE_FOLDERS_FAIL = 'DPS_DIARY_FOLDER_SAVE_FOLDERS_FAIL';

export const CHANGE_ROOT_FOLDER = 'DPS_CHANGE_ROOT_FOLDER';
export const ADD_ROOT_FOLDER = 'DPS_ADD_ROOT_FOLDER';
export const ADD_NEW_ROOT_FOLDER = 'DPS_ADD_NEW_ROOT_FOLDER';

export const SAVE_TREE_FOLDERS = 'DPS_SAVE_TREE_FOLDERS';
export const SAVE_TREE_FOLDERS_SUCCESS = 'DPS_SAVE_TREE_FOLDERS_SUCCESS';
export const SAVE_TREE_FOLDERS_FAIL = 'DPS_SAVE_TREE_FOLDERS_FAIL';



export class InitDiaryFolder extends TokenizeAction implements Action {
    readonly type = INIT_DIARY_FOLDER;
    constructor(public token: string,
        public payload: { appId: number }) { super(token); }
}
export class GetFolders extends TokenizeAction implements Action {
    readonly type = GET_FOLDERS;
    constructor(public token: string,
        public payload: { appId: number }) { super(token); }
}
export class GetFoldersSuccess extends TokenizeAction implements Action {
    readonly type = GET_FOLDERS_SUCCESS;
    constructor(public token: string,
        public payload: { folders: DiaryFolder[] }) { super(token); }
}
export class GetFoldersFaild extends TokenizeAction implements Action {
    readonly type = GET_FOLDERS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}
export class AddFolder extends TokenizeAction implements Action {
    readonly type = ADD_FOLDER;
    constructor(public token: string,
        public payload: { text: string, selected: boolean }) { super(token); }
}
export class DeleteFolder extends TokenizeAction implements Action {
    readonly type = DELETE_FOLDER;
    constructor(public token: string,
        public payload: { node: FolderFlatNode, type: string }) { super(token); }
}
export class CancelDeletedFolder extends TokenizeAction implements Action {
    readonly type = CANCEL_DELETED_FOLDER;
    constructor(public token: string,
        public payload: DiaryFolderWrapper) { super(token); }
}
export class ChangeIsDefault extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_DEFAULT;
    constructor(public token: string,
        public payload: { node: FolderFlatNode, checked: boolean }) { super(token); }
}
export class ChangeFolderName extends TokenizeAction implements Action {
    readonly type = CHANGE_FOLDER_NAME;
    constructor(public token: string,
        public payload: { folder: DiaryFolderWrapper, text: string }) { super(token); }
}
export class SaveFolders extends TokenizeAction implements Action {
    readonly type = SAVE_FOLDERS;
    constructor(public token: string,
        public payload: { appId: number, foldersNodes: FolderFlatNode[] }) { super(token); }
}
export class SaveFoldersSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_FOLDERS_SUCCESS;
    constructor(public token: string, public payload: number) { super(token); }
}
export class SaveFoldersFaild extends TokenizeAction implements Action {
    readonly type = SAVE_FOLDERS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}
export class ChangeRootFolder extends TokenizeAction implements Action {
    readonly type = CHANGE_ROOT_FOLDER;
    constructor(public token: string,
        public payload: { node: FolderFlatNode, value: string, rootType: string }) { super(token); }
}

export class AddRootFolder extends TokenizeAction implements Action {
    readonly type = ADD_ROOT_FOLDER;
    constructor(public token: string,
        public payload: FolderFlatNode) { super(token); }
}

export class SaveTreeFolder extends TokenizeAction implements Action {
    readonly type = SAVE_TREE_FOLDERS;
    constructor(public token: string, public payload: string) { super(token); }
}
export class SaveTreeFolderSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_TREE_FOLDERS_SUCCESS;
    constructor(public token: string, public payload: { response: any, AppId: number }) { super(token); }
}
export class SaveTreeFolderFail extends TokenizeAction implements Action {
    readonly type = SAVE_TREE_FOLDERS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class AddNewRootFolder extends TokenizeAction implements Action {
    readonly type = ADD_NEW_ROOT_FOLDER;
    constructor(public token: string, public payload: string
    ) { super(token); }
}



export type Any = InitDiaryFolder | GetFolders | GetFoldersSuccess | GetFoldersFaild |
    AddFolder | DeleteFolder | CancelDeletedFolder | ChangeIsDefault | ChangeFolderName |
    SaveFolders | SaveFoldersSuccess | SaveFoldersFaild | ChangeRootFolder | AddRootFolder |
    SaveTreeFolder | SaveTreeFolderSuccess | SaveTreeFolderFail | AddNewRootFolder;
