import { Action } from '@ngrx/store';
import { FolderItemWrapper, MailBox, FolderPermissions, FolderPermissionUserId } from '../../mail-core/models/interfaces';
import { FolderEditMode } from '../../core/organizer/enums';
import { MailFolder, User } from '../../core/lib/microsoft-graph';
import { PermissionLevel } from '../models/enums';

export const LOAD_FOLDER_LIST = 'DPS_LOAD_MAIL_FOLDER_LIST';
export const FOLDER_LOAD_FAIL = 'DPS_MAIL_FOLDER_LOAD_FAIL';
export const FOLDER_LOAD_SUCCESSS = 'DPS_MAIL_FOLDER_LOAD_SUCCESSS';
export const FOLDER_ITEM_TOGGLE_EXPAND = 'DPS_MAIL_FOLDER_ITEM_TOGGLE_EXPAND';

export const FOLDER_SELECT = 'DPS_MAIL_FOLDER_SELECT';

export const TOGGLE_MAILBOX = 'DPS_MAIL_TOGGLE_MAILBOX';
export const REFRESH_MAILBOX = 'DPS_MAIL_REFRESH_MAILBOX';
export const GET_MAILBOXES_SUCCESS = 'DPS_MAIL_GET_MAILBOXES_SUCCESS';

export const REMOVE_MAILBOX = 'DPS_MAIL_REMOVE_MAILBOX';
export const REMOVE_MAILBOX_SUCCESS = 'DPS_MAIL_REMOVE_MAILBOX_SUCCESS';
export const REMOVE_MAILBOX_FAIL = 'DPS_MAIL_REMOVE_MAILBOX_FAIL';

export const ADD_MAILBOX = 'DPS_MAIL_ADD_MAILBOX';
export const ADD_MAILBOX_SUCCESS = 'DPS_MAIL_ADD_MAILBOX_SUCCESS';
export const ADD_MAILBOX_FAIL = 'DPS_MAIL_ADD_MAILBOX_FAIL';

export const DELETE_FOLDER = 'DPS_DELETE_MAIL_FOLDER';
export const DELETE_FOLDER_SUCCESS = 'DPS_DELETE_MAIL_FOLDER_SUCCESS';
export const DELETE_FOLDER_FAIL = 'DPS_DELETE_MAIL_FOLDER_FAIL';

export const MOVE_FOLDER = 'DPS_MOVE_MAIL_FOLDER';
export const MOVE_FOLDER_SUCCESS = 'DPS_MOVE_MAIL_FOLDER_SUCCESS';
export const MOVE_FOLDER_FAIL = 'DPS_MOVE_MAIL_FOLDER_FAIL';

export const ACTIVATE_FOLDER_EDIT_MODE = 'DPS_ACTIVATE_FOLDER_EDIT_MODE';
export const FINALIZE_FOLDER_EDIT_MODE = 'DPS_FINALIZE_FOLDER_EDIT_MODE';

export const CREATE_NEW_FOLDER = 'DPS_CREATE_NEW_MAIL_FOLDER';
export const FOLDER_CREATE_SUCCESS = 'DPS_MAILFOLDER_CREATE_SUCCESS';
export const FOLDER_CREATE_FAIL = 'DPS_MAIL_FOLDER_CREATE_FAIL';

export const RENAME_FOLDER = 'DPS_RENAME_MAIL_FOLDER';
export const RENAME_FOLDER_SUCCESS = 'DPS_RENAME_MAIL_FOLDER_SUCCESS';
export const RENAME_FOLDER_FAIL = 'DPS_RENAME_MAIL_FOLDER_FAIL';

export const CREATE_MESSAGE_ROOT_FOLDER = 'DPS_CREATE_MESSAGE_ROOT_FOLDER';
export const REFRESH_FOLDER_DATA = 'DPS_REFRESH_FOLDER_DATA';
export const GET_CHILD_MAIL_FOLDERS_RECURSIVELY = 'DPS_GET_CHILD_MAIL_FOLDERS_RECURSIVELY';
export const REFRESH_FOLDER_SUCCESS = 'DPS_REFRESH_FOLDER_SUCCESS';
export const REFRESH_FOLDER_FAIL = 'DPS_REFRESH_FOLDER_FAIL';

export const GET_FOLDER_PERMISSION_SET = 'DPS_GET_FOLDER_PERMISSION_SET';
export const GET_FOLDER_PERMISSION_SET_SUCCESS = 'DPS_GET_FOLDER_PERMISSION_SET_SUCCESS';
export const GET_FOLDER_PERMISSION_SET_FAIL = 'DPS_GET_FOLDER_PERMISSION_SET_FAIL';
export const SAVE_FOLDER_PERMISSION_SET = 'DPS_SAVE_FOLDER_PERMISSION_SET';
export const SAVE_FOLDER_PERMISSION_SET_SUCCESS = 'DPS_SAVE_FOLDER_PERMISSION_SET_SUCCESS';
export const SAVE_FOLDER_PERMISSION_SET_FAIL = 'DPS_SAVE_FOLDER_PERMISSION_SET_FAIL';
export const ADD_FOLDER_PERMISSION = 'DPS_ADD_FOLDER_PERMISSION';
export const REMOVE_SELECTED_PERMISSION = 'DPS_REMOVE_SELECTED_PERMISSION';
export const SELECT_USER_PERMISSION = 'DPS_SELECT_USER_PERMISSION';
export const CHANGE_FOLDER_PERMISSION_LEVEL = 'DPS_CHANGE_FOLDER_PERMISSION_LEVEL';
export const CHANGE_FOLDER_PERMISSION_VALUE_BY_KEY = 'DPS_CHANGE_FOLDER_PERMISSION_VALUE_BY_KEY';
export class LoadFolderList implements Action {
  readonly type = LOAD_FOLDER_LIST;
  constructor(public clearCurrent: boolean = true, public owner: string, public loadType?: string) { }
}

export class FolderListLoadFail implements Action {
  readonly type = FOLDER_LOAD_FAIL;
  constructor(public error, public payload: { owner: string }) { }
}

export class FolderListLoadSuccess implements Action {
  readonly type = FOLDER_LOAD_SUCCESSS;
  constructor(public payload: { folderList: MailFolder[], clearCurrent: boolean, owner: string, type?: string }) { }
}

export class ToggleFolderExpand implements Action {
  readonly type = FOLDER_ITEM_TOGGLE_EXPAND;
  constructor(public payload: FolderItemWrapper) { }
}

export class ToggleMailBox implements Action {
  readonly type = TOGGLE_MAILBOX;
  constructor(public payload: MailBox) { }
}
export class RefreshMailBox implements Action {
  readonly type = REFRESH_MAILBOX;
  constructor(public payload: MailBox) { }
}
export class GetMailBoxesSuccess implements Action {
  readonly type = GET_MAILBOXES_SUCCESS;
  constructor(public payload: User[]) { }
}
export class RemoveMailBox implements Action {
  readonly type = REMOVE_MAILBOX;
  constructor(public payload: MailBox) { }
}
export class RemoveMailBoxSuccess implements Action {
  readonly type = REMOVE_MAILBOX_SUCCESS;
  constructor(public payload: MailBox) { }
}
export class RemoveMailBoxFail implements Action {
  readonly type = REMOVE_MAILBOX_FAIL;
  constructor(public payload: { mailBox: MailBox, error: any }) { }
}
export class AddMailBox implements Action {
  readonly type = ADD_MAILBOX;
  constructor(public payload: User) { }
}
export class AddMailBoxSuccess implements Action {
  readonly type = ADD_MAILBOX_SUCCESS;
  constructor(public payload: User) { }
}
export class AddMailBoxFail implements Action {
  readonly type = ADD_MAILBOX_FAIL;
  constructor(public payload: { mailBox: User, error: any }) { }
}
export class SelectFolder implements Action {
  readonly type = FOLDER_SELECT;
  constructor(public payload: FolderItemWrapper) { }
}

export class DeleteFolder implements Action {
  readonly type = DELETE_FOLDER;
  constructor(public payload: { item: FolderItemWrapper, owner: string }) { }
}

export class DeleteFolderSuccess implements Action {
  readonly type = DELETE_FOLDER_SUCCESS;
  constructor(public payload: { item: FolderItemWrapper, owner: string }) { }
}

export class DeleteFolderFail implements Action {
  readonly type = DELETE_FOLDER_FAIL;
  constructor(public payload: { item: FolderItemWrapper, error: any }) { }
}

export class MoveFolder implements Action {
  readonly type = MOVE_FOLDER;
  constructor(public payload: { item: FolderItemWrapper, destinationId: string, owner: string }) { }
}

export class MoveFolderSuccess implements Action {
  readonly type = MOVE_FOLDER_SUCCESS;
  constructor(public payload: { item: FolderItemWrapper, newItem: MailFolder, owner: string }) { }
}

export class MoveFolderFail implements Action {
  readonly type = MOVE_FOLDER_FAIL;
  constructor(public payload: { item: FolderItemWrapper, error: any }) { }
}
export class CreateRootMessageFolder {
  readonly type = CREATE_MESSAGE_ROOT_FOLDER;
  constructor(public payload: { displayName: string }) { }
}
export class ActivateFolderEditMode implements Action {
  readonly type = ACTIVATE_FOLDER_EDIT_MODE;
  constructor(public payload: { item: FolderItemWrapper, editMode: FolderEditMode }) { }
}

export class FinalizeFolderEditMode implements Action {
  readonly type = FINALIZE_FOLDER_EDIT_MODE;
  constructor(public payload: { item: FolderItemWrapper, editMode: FolderEditMode, confirm: boolean, owner: string, value?: string }) { }
}

// ----- folder create stuff -------
export class CreateNewFolder implements Action {
  readonly type = CREATE_NEW_FOLDER;
  constructor(public payload: { value: string, parentId?: string, owner: string }) { }
}

export class FolderCreateSuccess implements Action {
  readonly type = FOLDER_CREATE_SUCCESS;
  constructor(public payload: { item: MailFolder, owner: string }) { }
}

export class FolderCreateFail implements Action {
  readonly type = FOLDER_CREATE_FAIL;
  constructor(public payload: { error: string, parentId?: string }) { }
}

// ----- folder rename stuff -------

export class RenameFolder implements Action {
  readonly type = RENAME_FOLDER;
  constructor(public payload: { folder: FolderItemWrapper, value: string }) { }
}

export class RenameFolderSuccess implements Action {
  readonly type = RENAME_FOLDER_SUCCESS;
  constructor(public payload: { item: MailFolder }) { }
}

export class RenameFolderFail implements Action {
  readonly type = RENAME_FOLDER_FAIL;
  constructor(public payload: { error: string, folder: FolderItemWrapper }) { }
}

export class RefreshFoldersData implements Action {
  readonly type = REFRESH_FOLDER_DATA;
  constructor(public payload: { folderIds: string[], owner: string }) { }
}

export class GetChildMailFoldersRecursively implements Action {
  readonly type = GET_CHILD_MAIL_FOLDERS_RECURSIVELY;
  constructor(public payload: { folderId: string, owner: string }) { }
}

export class RefreshFoldersSuccess implements Action {
  readonly type = REFRESH_FOLDER_SUCCESS;
  constructor(public payload: { items: MailFolder[] }) { }
}

export class RefreshFoldersFail implements Action {
  readonly type = REFRESH_FOLDER_FAIL;
  constructor(public payload: { error: string, folderIds: string[] }) { }
}
export class GetFolderPermissionSet implements Action {
  readonly type = GET_FOLDER_PERMISSION_SET;
  constructor(public payload: { folderId: string }) { }
}
export class GetFolderPermissionSetSuccess implements Action {
  readonly type = GET_FOLDER_PERMISSION_SET_SUCCESS;
  constructor(public payload: FolderPermissions) { }
}
export class GetFolderPermissionSetFail implements Action {
  readonly type = GET_FOLDER_PERMISSION_SET_FAIL;
  constructor(public payload: { error: any }) { }
}
export class AddFolderPermission implements Action {
  readonly type = ADD_FOLDER_PERMISSION;
  constructor(public payload: User) { }
}
export class RemoveSelectedPermission implements Action {
  readonly type = REMOVE_SELECTED_PERMISSION;
  constructor() { }
}
export class SelectUserPermission implements Action {
  readonly type = SELECT_USER_PERMISSION;
  constructor(public payload: FolderPermissionUserId) { }
}
export class ChangeFolderPermissionLevel implements Action {
  readonly type = CHANGE_FOLDER_PERMISSION_LEVEL;
  constructor(public payload: PermissionLevel) { }
}
export class ChangeFolderPermissionValueByKey implements Action {
  readonly type = CHANGE_FOLDER_PERMISSION_VALUE_BY_KEY;
  constructor(public payload: { value: any, key: string }) { }
}
export class SaveFolderPermissionSet implements Action {
  readonly type = SAVE_FOLDER_PERMISSION_SET;
  constructor(public payload: FolderPermissions) { }
}
export class SaveFolderPermissionSetSuccess implements Action {
  readonly type = SAVE_FOLDER_PERMISSION_SET_SUCCESS;
  constructor(public payload) { }
}
export class SaveFolderPermissionSetFail implements Action {
  readonly type = SAVE_FOLDER_PERMISSION_SET_FAIL;
  constructor(public payload: { error: any }) { }
}

export type Any = LoadFolderList | FolderListLoadFail | FolderListLoadSuccess | ToggleFolderExpand |
  SelectFolder | ActivateFolderEditMode | FinalizeFolderEditMode |
  CreateNewFolder | FolderCreateSuccess | FolderCreateFail |
  RenameFolder | RenameFolderSuccess | RenameFolderFail |
  DeleteFolder | DeleteFolderFail | DeleteFolderSuccess |
  MoveFolder | MoveFolderFail | MoveFolderSuccess | RefreshFoldersData | RefreshFoldersSuccess | RefreshFoldersFail |
  ToggleMailBox | RefreshMailBox | GetMailBoxesSuccess | RemoveMailBox | RemoveMailBoxSuccess | RemoveMailBoxFail |
  AddMailBox | AddMailBoxSuccess | AddMailBoxFail | GetFolderPermissionSet | GetFolderPermissionSetSuccess | GetFolderPermissionSetFail |
  AddFolderPermission | RemoveSelectedPermission | SelectUserPermission | ChangeFolderPermissionLevel | ChangeFolderPermissionValueByKey;


