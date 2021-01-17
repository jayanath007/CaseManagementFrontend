import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { ColumnDef, GridGroupData } from '../../core/lib/grid-model';
import { FileHistoryGroup } from '../../file-history-core/models/interface';
import { ViewKind } from '../models/enum';
import {
    FileHistoryRequest,
    LoadFileHistoryGridDataByGroupRequest, BundleValidatorViewModel
} from '../models/bundling-request';
import {
    FileHistoryResponse, FileHistory, GridDataObject, BundleTreeItem, PDFBundleTreeItemViewModel,
    BundlingDates,
    BundleItemsViewModel,
    BundlingValidationResponce,
    PreserveCheckboxProperty
} from '../models/interface';
import { MessageItemWrapper } from '../../mail-item-core';
import { MatterSearchGridData } from '../../core/lib/matter';
import { FailDialogData } from '../../shared';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';
import { InfoDialogType } from '../../core/utility/DpsUtility';


export const INIT_BUNDLING = 'INIT_BUNDLING';
export const DROP_BUNDLE_FOLDER_DATA = 'DROP_BUNDLE_FOLDER_DATA';
export const LOAD_BUNDLING_FILE_HISTORY_GROUP = 'LOAD_BUNDLING_FILE_HISTORY_GROUP';
export const LOAD_BUNDLING_FILE_HISTORY_GROUP_SUCCESS = 'LOAD_BUNDLING_FILE_HISTORY_GROUP_SUCCESS';
export const LOAD_BUNDLING_FILE_HISTORY_GROUP_FAIL = 'LOAD_BUNDLING_FILE_HISTORY_GROUP_FAIL';

export const LOAD_BUNDLING_FILE_HISTORY_DATA = 'LOAD_BUNDLING_FILE_HISTORY_DATA';

export const LOAD_FILE_HISTORY = 'LOAD_BUNDLING_FILE_HISTORY';
export const EXPAND_FILE_HISTORY_FOLDER = 'EXPAND_BUNDLING_FILE_HISTORY_FOLDER';
export const GRID_ROW_EXPAND = 'DPS_GRID_ROW_EXPAND';
export const ALL_DATA_UPDATE = 'ALL_DATA_UPDATE';

export const LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP = 'LOAD_BUNDLING_FILE_HISTORY_GRID_DATA_BY_GROUP';
export const LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_SUCCESS = 'LOAD_BUNDLING_FILE_HISTORY_GRID_DATA_BY_GROUP_SUCCESS';
export const LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_FAIL = 'LOAD_BUNDLING_FILE_HISTORY_GRID_DATA_BY_GROUP_FAIL';


export const LOAD_BUNDLING_GRID_DATA = 'LOAD_BUNDLING_GRID_DATA';
export const LOAD_BUNDLING_GRID_DATA_SUCCESS = 'LOAD_BUNDLING_GRID_DATA_SUCCESS';
export const LOAD_BUNDLING_GRID_DATA_FAIL = 'LOAD_BUNDLING_GRID_DATA_FAIL';
export const GROUP_BUNDLING_DATA_REQUEST = 'GROUP_BUNDLING_DATA_REQUEST';

export const SET_SELECTED_ITEM = 'DPS_BUNDLING_SET_SELECTED_ITEM';
export const MOVE_SELECTED_UP = 'DPS_BUNDLING_MOVE_SELECTED_UP';
export const MOVE_SELECTED_DOWN = 'DPS_BUNDLING_MOVE_SELECTED_DOWN';
export const MOVE_ITEM = 'DPS_BUNDLING_MOVE_ITEM';
export const ADD_ITEM = 'DPS_BUNDLING_ADD_ITEM';
export const REQUEST_TO_ADD_ITEM = 'DPS_BUNDLING_REQUEST_TO_ADD_ITEM';
export const REQUEST_TO_ADD_ITEM_FROM_MENU = 'DPS_BUNDLING_REQUEST_TO_ADD_ITEM_FROM_MENU';
export const REMOVE_ITEM = 'DPS_BUNDLING_REMOVE_ITEM';
export const UPDATE_LABEL = 'DPS_BUNDLING_EDIT_LABEL';
export const UPDATE_DATE = 'DPS_BUNDLING_UPDATE_DATE';
export const TOGGLE_EXPAND = 'DPS_BUNDLING_TOGGLE_EXPAND';
export const ADD_FOLDER = 'DPS_BUNDLING_ADD_FOLDER';
export const ADD_ITEMS_WITH_FOLDER_REQUEST = 'DPS_BUNDLING_ADD_ITEMS_WITH_FOLDER_REQUEST';
export const ADD_ITEMS_WITH_FOLDER = 'DPS_BUNDLING_ADD_ITEMS_WITH_FOLDER';
export const START_ITEM_MOVE = 'DPS_BUNDLING_START_ITEM_MOVE';
export const SET_EDIT_LABEL_ITEM = 'DPS_SET_EDIT_LABEL_ITEM';
export const CLOSE_VIEWER = 'DPS_CLOSE_VIEWER';

export const SELECTED_FILE_HISTORY_ITEM_UPDATE = 'DPS_SELECTED_FILE_HISTORY_ITEM_UPDATE';

export const GET_DOCUMENT_URL = 'DPS_BUNDLE_GET_DOCUMENT_URL';
export const GET_DOCUMENT_URL_SUCCESS = 'DPS_BUNDLE_GET_DOCUMENT_URL_SUCCESS';
export const GET_DOCUMENT_URL_FAIL = 'DPS_BUNDLE_GET_DOCUMENT_URL_FAIL';

export const LOAD_WEB_VIEW_URL = 'DPS_BUNDLE_LOAD_WEB_VIEW_URL';

export const LOAD_EMAIL_ITEM_FROM_DIARY = 'DPS_BUNDLE_LOAD_EMAIL_ITEM_FROM_DIARY';
export const LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS = 'DPS_BUNDLE_LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS';
export const LOAD_EMAIL_ITEM_FROM_DIARY_FAIL = 'DPS_BUNDLE_LOAD_EMAIL_ITEM_FROM_DIARY_FAIL';

export const OPEN_OPTION_POPUP = 'OPEN_BUNDLE_OPTION_POPUP';
export const CHANGE_OPTION = 'BUNDLE_CHANGE_OPTION';
// export const SUBMIT = 'BUNDLE_SUBMIT';

export const BUNDLING_DATA_SUBMIT_SAVE = 'DPS_BUNDLING_DATA_SAVE';
export const BUNDLING_DATA_SUBMIT_SAVE_SUCCESS = 'DPS_BUNDLING_DATA_SAVE_SUCCESS';
export const BUNDLING_DATA_SUBMIT_SAVE_FAIL = 'DPS_BUNDLING_DATA_SAVE_FAIL';

export const BUNDLING_GRID_VIEW_CHANGE = 'DPS_BUNDLING_GRID_VIEW_CHANGE';
export const UPLOAD_COVER_PAGE = 'DPS_BUNDLING_UPLOAD_COVER_PAGE';
export const UPLOAD_COVER_PAGE_SUCCESS = 'DPS_BUNDLING_UPLOAD_COVER_PAGE_SUCCESS';
export const UPLOAD_COVER_PAGE_FAIL = 'DPS_BUNDLING_UPLOAD_COVER_PAGE_FAIL';
export const CHANGE_COVER_PAGE = 'DPS_BUNDLING_CHANGE_COVER_PAGE';

export const SHOW_MESSAGE = 'DPS_BUNDLING_SHOW_MESSAGE';
export const SHOW_VALIDATION_FAIL_MESSAGE = 'DPS_BUNDLING_SHOW_VALIDATION_FAIL_MESSAGE';

export const LOAD_SAVE_BUNDLE_DATA = 'DPS_LOAD_SAVE_BUNDLE_DATA';
export const LOAD_SAVE_BUNDLE_DATA_SUCCESS = 'DPS_LOAD_SAVE_BUNDLE_DATA_SUCCESS';
export const LOAD_SAVE_BUNDLE_DATA_FAIL = 'DPS_LOAD_SAVE_BUNDLE_DATA_FAIL';
export const REQUST_TO_VALIDATE_DROPPED_ITEMS = 'DPS_BUNDLING_REQUST_TO_VALIDATE_DROPPED_ITEMS';
export const VALIDATE_DROPPED_ITEMS = 'DPS_BUNDLING_VALIDATE_DROPPED_ITEMS';
export const VALIDATE_DROPPED_ITEMS_SUCCESS = 'DPS_BUNDLING_VALIDATE_DROPPED_ITEMS_SUCCESS';
export const VALIDATE_DROPPED_ITEMS_FAIL = 'BUNDLING_VALIDATE_DROPPED_ITEMS_FAIL';
export const CHANGE_SELECTED_GROUP = 'BUNDLING_CHANGE_SELECTED_GROUP';
export const CHANGE_PRESERVE_EXISTING_PAGINATOR = 'BUNDLING_CHANGE_PRESERVE_EXISTING_PAGINATOR';
export const CHANGE_IS_CORE_BUNDLE = 'BUNDLING_CHANGE_IS_CORE_BUNDLE';
export const CHANGE_FILE_DATE_ENABLE = 'BUNDLING_CHANGE_FILE_DATE_ENABLE';
export const GET_LOG_FILE = 'BUNDLING_GET_LOG_FILE';
export const GET_LOG_FILE_SUCCESS = 'BUNDLING_GET_LOG_FILE_SUCCESS';
export const GET_LOG_FILE_FAIL = 'BUNDLING_GET_LOG_FILE_FAIL';

export class InitBundling extends TokenizeAction implements Action {
    readonly type = INIT_BUNDLING;
    constructor(public token: string, public payload: {
        matterInfo: MatterSearchGridData,
        columnDef: ColumnDef[],
        timeOffset: number
    }) { super(token); }
}

export class LoadFileHistory extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_HISTORY;
    constructor(public token) { super(token); }
}

export class DropBundleFolderData extends TokenizeAction implements Action {
    readonly type = DROP_BUNDLE_FOLDER_DATA;
    constructor(public token: string, public payload: { row: FileHistoryGroup }) { super(token); }
}

export class LoadBundlingFileHistoryGroup extends TokenizeAction implements Action {
    readonly type = LOAD_BUNDLING_FILE_HISTORY_GROUP;
    constructor(public token: string, public request: FileHistoryRequest) { super(token); }
}

export class LoadBundlingFileHistoryGroupSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_BUNDLING_FILE_HISTORY_GROUP_SUCCESS;
    constructor(public token: string, public groups: GridGroupData[]) { super(token); }
}

export class LoadBundlingFileHistoryGroupFail extends TokenizeAction implements Action {
    readonly type = LOAD_BUNDLING_FILE_HISTORY_GROUP_FAIL;
    constructor(public token: string, public payload: { data: any }) { super(token); }
}


export class LoadBundlingFileHistoryData extends TokenizeAction implements Action {
    readonly type = LOAD_BUNDLING_FILE_HISTORY_DATA;
    constructor(public token: string, public request: FileHistoryRequest) { super(token); }
}
export class ExpandFileHistoryFolder extends TokenizeAction implements Action {
    readonly type = EXPAND_FILE_HISTORY_FOLDER;
    constructor(public token: string, public payload: { group: GridGroupData }) { super(token); }
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

export class ToggleExpand extends TokenizeAction implements Action {
    readonly type = TOGGLE_EXPAND;
    constructor(public token: string, public folderId: string) {
        super(token);
    }
}

export class SelectItem extends TokenizeAction implements Action {
    readonly type = SET_SELECTED_ITEM;
    constructor(public token: string, public itemId: string) {
        super(token);
    }
}

export class MoveSelectedUp extends TokenizeAction implements Action {
    readonly type = MOVE_SELECTED_UP;
    constructor(public token: string) {
        super(token);
    }
}

export class MoveSelectedDown extends TokenizeAction implements Action {
    readonly type = MOVE_SELECTED_DOWN;
    constructor(public token: string) {
        super(token);
    }
}

export class MoveItem extends TokenizeAction implements Action {
    readonly type = MOVE_ITEM;
    constructor(public token: string, public itemId: string, public anchorId: string) {
        super(token);
    }
}

export class RequestToAddItems extends TokenizeAction implements Action {
    readonly type = REQUEST_TO_ADD_ITEM;
    constructor(public token: string, public anchorId: string, public folderName: string, public actionType?: string) {
        super(token);
    }
}

export class RequestToAddItemsFromMenu extends TokenizeAction implements Action {
    readonly type = REQUEST_TO_ADD_ITEM_FROM_MENU;
    constructor(public token: string) {
        super(token);
    }
}

export class AddItem extends TokenizeAction implements Action {
    readonly type = ADD_ITEM;
    constructor(public token: string, public anchorId: string, public data: FileHistory[]) {
        super(token);
    }
}

export class RemoveItem extends TokenizeAction implements Action {
    readonly type = REMOVE_ITEM;
    constructor(public token: string, public item: BundleTreeItem[]) {
        super(token);
    }
}

export class UpdateLable extends TokenizeAction implements Action {
    readonly type = UPDATE_LABEL;
    constructor(public token: string, public itemId: string, public lable: string) {
        super(token);
    }
}

export class UpdateDate extends TokenizeAction implements Action {
    readonly type = UPDATE_DATE;
    constructor(public token: string, public itemId: string, public date: string) {
        super(token);
    }
}

export class AddFolder extends TokenizeAction implements Action {
    readonly type = ADD_FOLDER;
    constructor(public token: string, public anchorId: string, public lable: string) {
        super(token);
    }
}

export class AddItemsWithFolderRequest extends TokenizeAction implements Action {
    readonly type = ADD_ITEMS_WITH_FOLDER_REQUEST;
    constructor(public token: string, public folderLable: string, public gridGroupData: GridGroupData) {
        super(token);
    }
}

export class AddItemsWithFolder extends TokenizeAction implements Action {
    readonly type = ADD_ITEMS_WITH_FOLDER;
    constructor(public token: string, public anchorId: string, public folderLable: string, public data: FileHistory[]) {
        super(token);
    }
}

export class LoadBundlingGrid extends TokenizeAction implements Action {
    readonly type = LOAD_BUNDLING_GRID_DATA;
    constructor(public token: string, public moveItemTOProfile: boolean,
        public gridGroupData?: GridGroupData) { super(token); }
}

export class LoadBundlingGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_BUNDLING_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: {
        pageData: GridDataObject,
        gridGroupData?: GridGroupData, moveItemTOProfile: boolean,
    }) { super(token); }
}

export class LoadBundlingGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_BUNDLING_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}
export class GroupBundlingDataRequest extends TokenizeAction implements Action {
    readonly type = GROUP_BUNDLING_DATA_REQUEST;
    constructor(public token: string, public payload: {
        gridGroupData: GridGroupData,
        moveItemTOProfile: boolean,
        isLoadMore?: boolean
    }) { super(token); }
}

export class SelectedBundleItemUpdate extends TokenizeAction implements Action {
    readonly type = SELECTED_FILE_HISTORY_ITEM_UPDATE;
    constructor(public token: string, public selectedItem: FileHistory, public isMuilti: boolean) { super(token); }
}

export class GridRowExpand extends TokenizeAction implements Action {
    readonly type = GRID_ROW_EXPAND;
    constructor(public token: string, public payload: { row: FileHistory; }) { super(token); }
}
export class AllDataUpdate extends TokenizeAction implements Action {
    readonly type = ALL_DATA_UPDATE;
    constructor(public token: string) { super(token); }
}

export class StartItemMove extends TokenizeAction implements Action {
    readonly type = START_ITEM_MOVE;
    constructor(public token: string, public itemId: string) { super(token); }
}

export class GetDocURL extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL;
    constructor(public token: string, public payload: { gridRow: FileHistory }) {
        super(token);
    }
}

export class LoadWebViewUrl extends TokenizeAction implements Action {
    readonly type = LOAD_WEB_VIEW_URL;
    constructor(public token: string, public request: FileHistory) { super(token); }
}

export class GetDocURLSuccess extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL_SUCCESS;
    constructor(public token: string, public payload: { gridRow: FileHistory, url: string }) {
        super(token);
    }
}
export class GetDocURLFail extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}

export class GetEmailItemForMSG extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_FROM_DIARY;
    constructor(public token: string, public request: FileHistory) {
        super(token);
    }
}
export class GetEmailItemForMSGSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS;
    constructor(public token: string, public payload: { emailItem: boolean, row: FileHistory }) {
        super(token);
    }
}
export class GetEmailItemForMSGFail extends TokenizeAction implements Action {
    readonly type = LOAD_EMAIL_ITEM_FROM_DIARY_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}

export class SetEditLabelItem extends TokenizeAction implements Action {
    readonly type = SET_EDIT_LABEL_ITEM;
    constructor(public token: string, public itemId: string) {
        super(token);
    }
}
export class CloseViewer extends TokenizeAction implements Action {
    readonly type = CLOSE_VIEWER;
    constructor(public token: string) { super(token); }
}

export class OpenOptionPopup extends TokenizeAction implements Action {
    readonly type = OPEN_OPTION_POPUP;
    constructor(public token: string) { super(token); }
}

export class ChangeOption extends TokenizeAction implements Action {
    readonly type = CHANGE_OPTION;
    constructor(public token: string, public payload: { key: string, value: any }) { super(token); }
}

export class BundleSubmit extends TokenizeAction implements Action {
    readonly type = BUNDLING_DATA_SUBMIT_SAVE;
    constructor(public token: string, public bundleObjectId: string, public bundleName: string, public IsSendToBundle: boolean) {
        super(token);
    }
}
export class BundlingSubmitSaveSuccess extends TokenizeAction implements Action {
    readonly type = BUNDLING_DATA_SUBMIT_SAVE_SUCCESS;
    constructor(public token: string, public payload: { newTreeItemList: PDFBundleTreeItemViewModel[], IsSendToBundle: boolean }) {
        super(token);
    }
}
export class BundlingDataSubmitFail extends TokenizeAction implements Action {
    readonly type = BUNDLING_DATA_SUBMIT_SAVE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class AllGridViewChange extends TokenizeAction implements Action {
    readonly type = BUNDLING_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewKind, value: BundlingDates }) {
        super(token);
    }
}
export class UploadCoverPage extends TokenizeAction implements Action {
    readonly type = UPLOAD_COVER_PAGE;
    constructor(public token: string, public payload: { isFromDiary: boolean, diaryId: number, file: any }) {
        super(token);
    }
}
export class UploadCoverPageSuccess extends TokenizeAction implements Action {
    readonly type = UPLOAD_COVER_PAGE_SUCCESS;
    constructor(public token: string, public coverPageId, public fileName: any, public path: string, public data: FileHistory) {
        super(token);
    }
}
export class UploadCoverPageFail extends TokenizeAction implements Action {
    readonly type = UPLOAD_COVER_PAGE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class ShowMessage extends TokenizeAction {
    readonly type = SHOW_MESSAGE;
    constructor(public token: string, public title: string, public message: string, public messageType: InfoDialogType) {
        super(token);
    }
}

export class ShowValidationFailDialog extends TokenizeAction {
    readonly type = SHOW_VALIDATION_FAIL_MESSAGE;
    constructor(public token: string, public data: FailDialogData | BundlingValidationResponce) {
        super(token);
    }
}

export class LoadSavedBundleData extends TokenizeAction implements Action {
    readonly type = LOAD_SAVE_BUNDLE_DATA;
    constructor(public token: string, public rowData: PDFBundleHeaderViewModel) { super(token); }
}
export class LoadSavedBundleDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SAVE_BUNDLE_DATA_SUCCESS;
    constructor(public token: string, public payload: {
        coreHeader: PDFBundleHeaderViewModel,
        itemListList: BundleItemsViewModel[],
        selectedRow: PDFBundleHeaderViewModel,
        timeOffset: number
    }) { super(token); }
}
export class LoadSavedBundleDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_SAVE_BUNDLE_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) { super(token); }
}
export class RequestTOValidateAddItems extends TokenizeAction {
    readonly type = REQUST_TO_VALIDATE_DROPPED_ITEMS;
    constructor(public token: string,
        public anchorId: string, public folderName: string, public data: FileHistory[], public actionType?: string,
    ) {
        super(token);
    }
}
export class ValidateAddItems extends TokenizeAction {
    readonly type = VALIDATE_DROPPED_ITEMS;
    constructor(public token: string, public request: BundleValidatorViewModel,
        public anchorId: string, public folderName: string, public data: FileHistory[], public actionType?: string,
    ) {
        super(token);
    }
}
export class ValidateAddItemsSuccess extends TokenizeAction {
    readonly type = VALIDATE_DROPPED_ITEMS_SUCCESS;
    constructor(public token: string,
        public anchorId: string, public folderName: string, public data: FileHistory[],
        public validationResponce: BundlingValidationResponce,
        public actionType?: string) {
        super(token);
    }
}
export class ValidateAddItemsFail extends TokenizeAction {
    readonly type = VALIDATE_DROPPED_ITEMS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class ChangeSelectedGroup extends TokenizeAction {
    readonly type = CHANGE_SELECTED_GROUP;
    constructor(public token: string, public group: GridGroupData) { super(token); }
}
export class ChangePreserveExistingPaginator extends TokenizeAction {
    readonly type = CHANGE_PRESERVE_EXISTING_PAGINATOR;
    constructor(public token: string, public iSPreserveExistingPaginator: PreserveCheckboxProperty) { super(token); }
}
export class ChangedIsCoreBundle extends TokenizeAction {
    readonly type = CHANGE_IS_CORE_BUNDLE;
    constructor(public token: string, public payload: { ids: string[], rootElementId: string, bundleName: string }) { super(token); }
}
export class ChangeFileDateEnable extends TokenizeAction {
    readonly type = CHANGE_FILE_DATE_ENABLE;
    constructor(public token: string, public itemId: string, public checkBoxValue: boolean) { super(token); }
}

export class GetLogFile extends TokenizeAction {
    readonly type = GET_LOG_FILE;
    constructor(public token, public bundleId) {
        super(token);
    }
}
export class GetLogFileSuccess extends TokenizeAction {
    readonly type = GET_LOG_FILE_SUCCESS;
    constructor(public token, public url) {
        super(token);
    }
}
export class GetLogFileFail extends TokenizeAction {
    readonly type = GET_LOG_FILE_FAIL;
    constructor(public token) {
        super(token);
    }
}


export type Any = InitBundling | DropBundleFolderData | LoadFileHistory | LoadBundlingFileHistoryGroup |
    LoadBundlingFileHistoryGroupSuccess | LoadBundlingFileHistoryGroupFail |
    LoadBundlingGrid | LoadBundlingGridSuccess | LoadBundlingGridFail | GroupBundlingDataRequest |
    ExpandFileHistoryFolder | LoadFileHistoryGridDataByGroup |
    LoadFileHistoryGridDataByGroupSuccess | LoadFileHistoryGridDataByGroupFail | ToggleExpand | SelectItem |
    MoveSelectedUp | MoveSelectedDown | MoveItem | AddItem | RemoveItem | UpdateLable | AddFolder | AddItemsWithFolder |
    AddItemsWithFolderRequest | SelectedBundleItemUpdate | GridRowExpand | AllDataUpdate | StartItemMove | GetDocURL |
    GetDocURLSuccess | GetDocURLFail | GetEmailItemForMSG | GetEmailItemForMSGSuccess | GetEmailItemForMSGFail |
    SetEditLabelItem | RequestToAddItems | CloseViewer |
    OpenOptionPopup | ChangeOption | BundleSubmit | BundlingSubmitSaveSuccess | BundlingDataSubmitFail | UpdateDate |
    UploadCoverPage | UploadCoverPageSuccess | UploadCoverPageFail | ShowMessage | AllGridViewChange |
    RequestTOValidateAddItems | ValidateAddItems | ValidateAddItemsSuccess | ValidateAddItemsFail | LoadSavedBundleData |
    LoadSavedBundleDataSuccess | LoadSavedBundleDataFail | ShowValidationFailDialog |
    GetLogFile | GetLogFileSuccess | GetLogFileFail |
    ChangeSelectedGroup | ChangePreserveExistingPaginator | ChangedIsCoreBundle | ChangeFileDateEnable;

