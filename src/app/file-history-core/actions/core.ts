
import {
    FileHistoryRequest, DocumentURLRequest,
    LoadFileHistoryGroupRequest, LoadFileHistoryGridDataByGroupRequest
} from '../models/file-history-request';

import {
    FileHistory, FileHistoryResponse,
    FileItemWrapper, FileHistoryGroup, FileHistoryGroupDataResponse, Folder, SignatureTokenResponce
} from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';


export const INIT_FILE_HISTORY = 'INIT_FILE_HISTORY';

export const LOAD_FILE_HISTORY_DATA_WITH_CURRENT_STATE = 'LOAD_FILE_HISTORY_DATA_WITH_CURRENT_STATE';


export const FILE_HISTORY_CHANGE = 'FILE_HISTORY_CHANGE';
export const FILE_HISTORY_GRID_ROW_CHANGE = 'FILE_HISTORY_GRID_ROW_CHANGE';
export const FILE_HISTORY_GRID_ROW_EDIT_CANCEL = 'FILE_HISTORY_GRID_ROW_EDIT_CANCEL';


export const SHOW_DOCUMENT_PASSWORD_FIELD = 'SHOW_DOCUMENT_PASSWORD_FIELD';
export const GET_USER_PASSWORD_FOR_DOC = 'GET_USER_PASSWORD_FOR_DOC';

export const LOAD_FILE_HISTORY_GRID_DATA = 'LOAD_FILE_HISTORY_GRID_DATA';
export const LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS = 'LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS';
export const LOAD_FILE_HISTORY_GRID_DATA_LOAD_FAIL = 'LOAD_FILE_HISTORY_GRID_DATA_LOAD_FAIL';


export const LOAD_DOCUMENT_URL_LOAD = 'LOAD_DOCUMENT_URL_LOAD';
export const LOAD_DOCUMENT_URL_LOAD_SUCCESS = 'LOAD_DOCUMENT_URL_LOAD_SUCCESS';
export const LOAD_DOCUMENT_URL_LOAD_FAIL = 'LOAD_DOCUMENT_URL_LOAD_FAIL';



export const FILE_HISTORY_REFRESH = 'FILE_HISTORY_REFRESH';

export const DELETE_DIARY_RECORDS_SUCCESS = 'DELETE_DIARY_RECORDS_SUCCESS';
export const DELETE_DIARY_RECORDS_FAIL = 'DELETE_DIARY_RECORDS_FAIL';

export const DELETE_MULTIPLE_DIARY_RECORDS = 'DELETE_MULTIPLE_DIARY_RECORDS';

export const LOAD_WEB_VIEW_URL = 'DPS_FILE_HISTORY_LOAD_WEB_VIEW_URL';

export const ALL_DATA_UPDATE = 'OC_ALL_DATA_UPDATE';

// export const REQUEST_FORWARD_MAIL = 'FILE_HISTORY_REQUEST_FORWARD_MAIL';


// Get email item for msg
export const LOAD_EMAIL_ITEM_FROM_DIARY = 'DPS_LOAD_EMAIL_ITEM_FROM_DIARY';
export const LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS = 'DPS_LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS';
export const LOAD_EMAIL_ITEM_FROM_DIARY_FAIL = 'DPS_LOAD_EMAIL_ITEM_FROM_DIARY_FAIL';

// Get Sign and send token
export const GET_SIGN_TOKEN = 'DPS_FILE_HISTORY_SIGN_TOKEN';
export const GET_SIGN_TOKEN_SUCCESS = 'DPS_GET_SIGN_TOKEN_SUCCESS';
export const GET_SIGN_TOKEN_FAIL = 'DPS_GET_SIGN_TOKEN_FAIL';

// Get Sign and send doc url
export const GET_SIGN_AND_SEND_DOC_URL = 'DPS_GET_SIGN_AND_SEND_DOC_URL';
export const LOAD_DOCUMENT_SIGN_AND_SEND = 'DPS_LOAD_DOCUMENT_SIGN_AND_SEND_URL';

export const SHARE_DIARY_ITEM_ON_SAFE_BOX = 'DPS_SHARE_DIARY_ITEM_ON_SAFE_BOX';
export const SHARE_DIARY_ITEM_ON_SAFE_BOX_SUCCESS = 'DPS_SHARE_DIARY_ITEM_ON_SAFE_BOX_SUCCESS';
export const SHARE_DIARY_ITEM_ON_SAFE_BOX_FAIL = 'DPS_SHARE_DIARY_ITEM_ON_SAFE_BOX_FAIL';
export const CLOSE_DOCUMENT_VIEW_POPUP = 'DPS_CLOSE_DOCUMENT_VIEW_POPUP';

export const XDRAFT_ITEM = 'DPS_XDRAFT_ITEM';
export const XDRAFT_ITEM_SUCCESS = 'DPS_XDRAFT_ITEM_SUCCESS';
export const XDRAFT_ITEM_FAIL = 'DPS_XDRAFT_ITEM_FAIL';

export const XDRAFT_ITEM_CHANGE = 'XDRAFT_ITEM_CHANGE';
export const XDRAFT_ITEM_CHANGE_SUCCESS = 'XDRAFT_ITEM_CHANGE_SUCCESS';
export const XDRAFT_ITEM_CHANGE_FAIL = 'XDRAFT_ITEM_CHANGE_FAIL';

export const XDRAFT_LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS = 'XDRAFT_LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS';

export const LOAD_FILE_HISTORY_GROUP = 'LOAD_FILE_HISTORY_GROUP';
export const LOAD_FILE_HISTORY_GROUP_SUCCESS = 'LOAD_FILE_HISTORY_GROUP_SUCCESS';
export const LOAD_FILE_HISTORY_GROUP_FAIL = 'LOAD_FILE_HISTORY_GROUP_FAIL';

export const EXPAND_FILE_HISTORY_GROUP = 'EXPAND_FILE_HISTORY_GROUP';

export const LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP = 'LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP';
export const LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_SUCCESS = 'LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_SUCCESS';
export const LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_FAIL = 'LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_FAIL';

export const LOAD_FOLDER_LIST = 'LOAD_FILE_HISTORY_FOLDER_LIST';
export const LOAD_FOLDER_LIST_SUCCESS = 'LOAD_FILE_HISTORY_FOLDER_LIST_SUCCESS';
export const LOAD_FOLDER_LIST_FAIL = 'LOAD_FILE_HISTORY_FOLDER_LIST_FAIL';

export const MOVE_SELECTED_FOLDER = 'MOVE_SELECTED_FOLDER';
export const MOVE_SELECTED_FOLDER_SUCCESS = 'MOVE_SELECTED_FOLDER_SUCCESS';
export const MOVE_SELECTED_FOLDER_FAIL = 'MOVE_SELECTED_FOLDER_FAIL';

export const FILE_HISTORY_GROUP_LOAD_MORE = 'FILE_HISTORY_GROUP_LOAD_MORE';
export const LOAD_EXPANDED_GROUPS_DATA = 'FILE_HISTORY_LOAD_EXPANDED_GROUPS_DATA';

export const GET_FILE_HISTORY_FULL_TEXT_SEARCH = 'GET_FILE_HISTORY_FULL_TEXT_SEARCH';

export enum ViewChangeKind {
    SearchText = 'SEARCH_TEXT',
    PageEvent = 'PAGE_EVENT',
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',
    GroupModeChange = 'GROUP_MODE_CHANGE',
}

export enum RowItemChangeKind {
    IsExpand = 'IS_EXPAND',
    DeleteRow = 'DELETE_ROW',
    EditRow = 'EDIT_ROW',
    IsChecked = 'IS_CHECKED',
    SetPassword = 'SET_PASSWORD',
    ValidateUserPassword = 'VALIDATE_USER_PASSWORD',
    IsCollapse = 'IS_COLLAPSE',
    DocumentEditUpdate = 'DOCUMENT_EDIT_UPDATE',
    SelectRow = 'SELECT_ROW',
    SignDoc = 'SIGN_DOC',
    ShareSafebox = 'SHARE_SAFEBOX',
    Xdraft = 'Xdraft',
    XDraftNewVersion = 'XDraftNewVersion',
}

export class InitFileHistory extends TokenizeAction implements Action {
    readonly type = INIT_FILE_HISTORY;
    constructor(public token: string, public payload: { columnDef: ColumnDef[], matterInfo: MatterInfo }) { super(token); }
}

export class LoadFileHistoryGroup extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GROUP;
    constructor(public token: string, public request: LoadFileHistoryGroupRequest) { super(token); }
}

export class LoadFileHistoryGroupSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GROUP_SUCCESS;
    constructor(public token: string, public groups: FileHistoryGroupDataResponse[]) { super(token); }
}

export class LoadFileHistoryGroupFail extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GROUP_FAIL;
    constructor(public token: string, public payload: { data: any }) { super(token); }
}

export class ExpandFileHistoryGroup extends TokenizeAction implements Action {
    readonly type = EXPAND_FILE_HISTORY_GROUP;
    constructor(public token: string, public payload: { row: FileHistoryGroup }) { super(token); }
}


export class FileHistoryGroupLoadMore extends TokenizeAction implements Action {
    readonly type = FILE_HISTORY_GROUP_LOAD_MORE;
    constructor(public token: string, public payload: { row: FileHistoryGroup }) { super(token); }
}



export class LoadExpandedGroupsData extends TokenizeAction implements Action {
    readonly type = LOAD_EXPANDED_GROUPS_DATA;
    constructor(public token: string, public payload: { request: LoadFileHistoryGridDataByGroupRequest[] }) { super(token); }
}


export class LoadFileHistoryGridDataByGroup extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP;
    constructor(public token: string, public payload: { request: LoadFileHistoryGridDataByGroupRequest }) { super(token); }
}




export class LoadFileHistoryGridDataByGroupSuccess extends TokenizeAction implements Action {

    readonly type = LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_SUCCESS;
    constructor(public token: string, public payload: { response: FileHistoryResponse, request: LoadFileHistoryGridDataByGroupRequest }) {
        super(token);
    }
}
export class LoadFileHistoryGridDataByGroupFail extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_FAIL;
    constructor(public token: string, public payload: { FileHistoryList: FileHistory[] }) {
        super(token);
    }
}


export class FileHistoryViewChange extends TokenizeAction implements Action {
    readonly type = FILE_HISTORY_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}



export class FileHistoryRefresh extends TokenizeAction implements Action {
    readonly type = FILE_HISTORY_REFRESH;
    constructor(public token: string) { super(token); }
}

export class GetEmailItemForMSG extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_FROM_DIARY;
    constructor(public token: string, public request: DocumentURLRequest) {
        super(token);
    }
}
export class GetEmailItemForMSGSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS;
    constructor(public token: string, public payload: { emailItem: boolean, row: FileItemWrapper }) {
        super(token);
    }
}
export class GetEmailItemForMSGFail extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_FROM_DIARY_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}

export class FileHistoryGridRowChange extends TokenizeAction implements Action {
    readonly type = FILE_HISTORY_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: FileItemWrapper, value: any
    }) { super(token); }
}


export class FileHistoryGridRowEditCancel extends TokenizeAction implements Action {
    readonly type = FILE_HISTORY_GRID_ROW_EDIT_CANCEL;
    constructor(public token: string, public payload: {}) { super(token); }
}

export class LoadFileHistoryDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_DATA_WITH_CURRENT_STATE;
    constructor(public token) { super(token); }
}





export class LoadFileHistoryGridData extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GRID_DATA;
    constructor(public token: string, public request: FileHistoryRequest) { super(token); }
}

export class LoadFileHistoryGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: FileHistoryResponse, request: FileHistoryRequest }) {
        super(token);
    }
}
export class LoadFileHistoryGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY_GRID_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { FileHistoryList: FileHistory[] }) {
        super(token);
    }
}

export class XdraftFileHistoryGridDataSuccess extends TokenizeAction implements Action {
    readonly type = XDRAFT_LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: FileHistoryResponse, request: FileHistoryRequest, fileUid: number }) {
        super(token);
    }
}


export class LoadDocumentURL extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_URL_LOAD;
    constructor(public token: string, public request: DocumentURLRequest) { super(token); }
}

export class LoadWebViewUrl extends TokenizeAction implements Action {
    readonly type = LOAD_WEB_VIEW_URL;
    constructor(public token: string, public request: DocumentURLRequest) { super(token); }
}


export class LoadDocumentURLSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_URL_LOAD_SUCCESS;
    constructor(public token: string, public payload: { url: string, request: DocumentURLRequest }) {
        // { response: DocumentUrlResponse, request: DocumentURLRequest }
        super(token);
    }
}

export class LoadDocumentURLFail extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_URL_LOAD_FAIL;
    constructor(public token: string, public payload: { request: DocumentURLRequest }) {
        super(token);
    }
}

export class DeleteDiaryRecordsSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_DIARY_RECORDS_SUCCESS;
    constructor(public token: string, public payload: { isMulti: boolean, diaryIds: number[] }) {
        super(token);
    }
}

export class DeleteMultipleDiaryRecords extends TokenizeAction implements Action {
    readonly type = DELETE_MULTIPLE_DIARY_RECORDS;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteDiaryRecordsFail extends TokenizeAction implements Action {
    readonly type = DELETE_DIARY_RECORDS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ShowDocumentPasswordField extends TokenizeAction implements Action {
    readonly type = SHOW_DOCUMENT_PASSWORD_FIELD;
    constructor(public token: string) {
        super(token);
    }
}


export class AllDataUpdate extends TokenizeAction implements Action {
    readonly type = ALL_DATA_UPDATE;
    constructor(public token: string) {
        super(token);
    }
}

// export class RequstForwardMail extends TokenizeAction implements Action {
//     readonly type = REQUEST_FORWARD_MAIL;
//     constructor(public token: string, public payload: { diaryId: string, password: string, type: ReplyForwardType}) { super(token); }
// }

export class GetSignatureToken extends TokenizeAction implements Action {
    readonly type = GET_SIGN_TOKEN;
    constructor(public token: string,
        public payload: {
            row: FileItemWrapper,
            password: string,
            needPasswordHash: boolean,
            passwordHash?: string
        }) { super(token); }
}

export class GetSignatureTokenSuccess extends TokenizeAction implements Action {
    readonly type = GET_SIGN_TOKEN_SUCCESS;
    constructor(public token: string, public payload: { row: FileItemWrapper, signatureTokenResponce: SignatureTokenResponce, needToSaveHash: boolean }) { super(token); }
}

export class GetSignatureTokenFail extends TokenizeAction implements Action {
    readonly type = GET_SIGN_TOKEN_FAIL;
    constructor(public token: string) { super(token); }
}

export class GetSignatureDocUrl extends TokenizeAction implements Action {
    readonly type = GET_SIGN_AND_SEND_DOC_URL;
    constructor(public token: string, public payload: { row: FileItemWrapper, url: string }) {
        super(token);
    }

}

export class LoadSignAndSendDocSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DOCUMENT_SIGN_AND_SEND;
    constructor(public token: string, public payload: { url: string, request: DocumentURLRequest }) {
        // { response: DocumentUrlResponse, request: DocumentURLRequest }
        super(token);
    }
}

export class ShareDiaryItemOnSafebox extends TokenizeAction implements Action {
    readonly type = SHARE_DIARY_ITEM_ON_SAFE_BOX;
    constructor(public token: string, public payload: {
        matterRef: string
        rows: { row: FileItemWrapper, password: string }[]
    }) { super(token); }
}

export class ShareDiaryItemOnSafeboxSuccess implements Action {
    readonly type = SHARE_DIARY_ITEM_ON_SAFE_BOX_SUCCESS;
    constructor(public token: string, public payload: { matterRef: string, rows: { row: FileItemWrapper, password: string }[] }) { }
}

export class ShareDiaryItemOnSafeboxFail implements Action {
    readonly type = SHARE_DIARY_ITEM_ON_SAFE_BOX_FAIL;
    constructor(public token: string, public payload: { matterRef: string, rows: { row: FileItemWrapper, password: string }[] }) { }
}
export class CloseDocumentViewPopup implements Action {
    readonly type = CLOSE_DOCUMENT_VIEW_POPUP;
    constructor(public token: string) { }
}

export class XdraftItem extends TokenizeAction implements Action {
    readonly type = XDRAFT_ITEM;
    constructor(public token: string, public payload: {
        itemKey: string,
        row: FileItemWrapper
    }) { super(token); }
}
export class XdraftItemSuccess extends TokenizeAction implements Action {
    readonly type = XDRAFT_ITEM_SUCCESS;
    constructor(public token: string, public payload: { responce: any, selectData: any }) { super(token); }
    // row: FileItemWrapper, token: string
}

export class XdraftItemFail extends TokenizeAction implements Action {
    readonly type = XDRAFT_ITEM_FAIL;
    constructor(public token: string) { super(token); }
}

export class XdraftItemChange extends TokenizeAction implements Action {
    readonly type = XDRAFT_ITEM_CHANGE;
    constructor(public token: string, public payload: { kind: RowItemChangeKind, row: FileItemWrapper, value: any }) { super(token); }
}

export class XdraftItemChangeSuccess extends TokenizeAction implements Action {
    readonly type = XDRAFT_ITEM_CHANGE_SUCCESS;
    constructor(public token: string, public payload: { responce: any, inputItem: any }) { super(token); }
    // row: FileItemWrapper, token: string
}

export class XdraftItemChangeFail extends TokenizeAction implements Action {
    readonly type = XDRAFT_ITEM_CHANGE_FAIL;
    constructor(public token: string) { super(token); }
}

export class LoadFolderList extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST;
    constructor(public token: string, public payload: {
        AppId: number
    }) { super(token); }
}

export class LoadFolderListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_SUCCESS;
    constructor(public token: string, public payload: { folderList: Folder[] }) { super(token); }
}

export class LoadFolderListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_FAIL;
    constructor(public token: string) { super(token); }
}

export class MoveSelectedFolder extends TokenizeAction implements Action {
    readonly type = MOVE_SELECTED_FOLDER;
    constructor(public token: string, public payload: { folderId: number, rows: FileItemWrapper[] }) { super(token); }
}

export class MoveSelectedFolderSuccess extends TokenizeAction implements Action {
    readonly type = MOVE_SELECTED_FOLDER_SUCCESS;
    constructor(public token: string, public payload: { responce: any, inputItem: any }) { super(token); }
    // row: FileItemWrapper, token: string
}

export class MoveSelectedFolderFail extends TokenizeAction implements Action {
    readonly type = MOVE_SELECTED_FOLDER_FAIL;
    constructor(public token: string) { super(token); }
}
export class FileHistoryFullTextSearch extends TokenizeAction implements Action {
    readonly type = GET_FILE_HISTORY_FULL_TEXT_SEARCH;
    constructor(public token: string, public isSearchFullText: boolean) {
        super(token);
    }
}

export type Any = InitFileHistory | LoadFileHistoryGridDataSuccess | LoadFileHistoryGridDataFail | FileHistoryRefresh |
    FileHistoryViewChange | FileHistoryGridRowChange | LoadFileHistoryGridData | LoadDocumentURL |
    LoadDocumentURLSuccess | LoadDocumentURLFail | ShowDocumentPasswordField |
    GetEmailItemForMSG | GetEmailItemForMSGSuccess | GetEmailItemForMSGFail | FileHistoryFullTextSearch |
    DeleteMultipleDiaryRecords | DeleteDiaryRecordsSuccess |
    GetSignatureToken | GetSignatureTokenSuccess | GetSignatureTokenFail | LoadSignAndSendDocSuccess |
    ShareDiaryItemOnSafebox | ShareDiaryItemOnSafeboxSuccess | ShareDiaryItemOnSafeboxFail | CloseDocumentViewPopup |
    XdraftItem | XdraftItemChange | XdraftItemChangeSuccess | XdraftItemChangeFail | XdraftFileHistoryGridDataSuccess |
    LoadFileHistoryGroup | LoadFileHistoryGroupSuccess | LoadFileHistoryGroupFail | FileHistoryGroupLoadMore | LoadFolderList |
    LoadFolderListSuccess | LoadFolderListFail | MoveSelectedFolder | MoveSelectedFolderSuccess | MoveSelectedFolderFail |
    FileHistoryGridRowEditCancel;
