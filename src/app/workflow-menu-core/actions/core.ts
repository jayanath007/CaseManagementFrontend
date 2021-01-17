import { DocumentLink } from '../../document-view/models/interfaces';
import { ItemChangeKind, ImportButtonType } from '../models/enums';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import {
    WorkflowMenuMetaItem, MatterSummery, MatterShortcuts, ExportData, WorkflowMenuFileData,
    WorkflowMenuMetaDataWrapper,
    WorkflowDocumentViewRequest, FormLibraryTemplateInfo
} from '../models/interfaces';
import { State } from '../reducers';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
// import { extend } from 'webdriver-js-extender';
import { MenuExportFileType } from '..';
import { MenusUserAction } from '../../core/lib/workflow';
import { Injector } from '@angular/core';

export const INIT_WORKFLOW_MENU = 'DPS_INIT_WORKFLOW_MENU';

export const WORKFLOW_MENU_TAB_CHANGE = 'DPS_WORKFLOW_MENU_TAB_CHANGE';

export const LOAD_WORKFLOW_MENU_LIST = 'DPS_WORKFLOW_LOAD_MENU_LIST';
export const LOAD_WORKFLOW_MENU_LIST_SUCCESS = 'DPS_WORKFLOW_LOAD_MENU_LIST_SUCCESS';
export const LOAD_WORKFLOW_MENU_LIST_FAIL = 'DPS_WORKFLOW_LOAD_MENU_LIST_FAIL';

export const LOAD_WORKFLOW_MENU_LIST_REFRESH = 'DPS_WORKFLOW_LOAD_MENU_LIST_REFRESH';
export const LOAD_WORKFLOW_MENU_LIST_REFRESH_SUCCESS = 'DPS_WORKFLOW_LOAD_MENU_LIST_REFRESH_SUCCESS';
export const LOAD_WORKFLOW_MENU_LIST_REFRESH_FAIL = 'DPS_WORKFLOW_LOAD_MENU_LIST_REFRESH_FAIL';

export const LOAD_FILE_BASE_MENU = 'DPS_LOAD_FILE_BASE_MENU';
export const LOAD_FILE_BASE_MENU_SUCCESS = 'DPS_LOAD_FILE_BASE_MENU_SUCCESS';
export const LOAD_FILE_BASE_MENU_FAIL = 'DPS_LOAD_FILE_BASE_MENU_FAIL';

export const LOAD_MENU_MATTER_SUMMARY = 'DPS_MENU_MATTER_SUMMARY';
export const LOAD_MENU_MATTER_SUMMARY_SUCCESS = 'DPS_MENU_MATTER_SUMMARY_SUCCESS';
export const LOAD_MENU_MATTER_SUMMARY_FAIL = 'DPS_MENU_MATTER_SUMMARY_FAIL';

export const LOAD_MENU_MATTER_SHORTCUT_KEYS = 'DPS_LOAD_MENU_MATTER_SHORTCUT_KEYS';
export const LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS = 'DPS_LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS';
export const LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL = 'DPS_LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL';

export const TREE_ITEM_CHANGE = 'DPS_TREE_ITEM_CHANGE';


export const WORKFLOW_MENU_EXPORT_TO_LOCAL = 'WORKFLOW_MENU_EXPORT_TO_LOCAL';
export const WORKFLOW_MENU_EXPORT_TO_LOCAL_SUCCESS = 'WORKFLOW_MENU_EXPORT_TO_LOCAL_SUCCESS';
export const WORKFLOW_MENU_EXPORT_TO_LOCAL_FAIL = 'WORKFLOW_MENU_EXPORT_TO_LOCAL_FAIL';

export const WORKFLOW_MENU_IMPORT = 'WORKFLOW_MENU_IMPORT';
export const WORKFLOW_MENU_IMPORT_SUCCESS = 'WORKFLOW_MENU_IMPORT_SUCCESS';
export const WORKFLOW_MENU_IMPORT_FAIL = 'WORKFLOW_MENU_IMPORT_FAIL';

export const USER_ACTION = 'WORKFLOW_MENU_EDIT_ACTION';
export const CANCEL_EDIT = 'WORKFLOW_MENU_EDIT_CANCEL_ACTION';
export const IGNOW_CANCEL = 'WORKFLOW_MENU_EDIT_IGNOW_CANCEL';

export const CLOSE_MENU_EDIT = 'WORKFLOW_CLOSE_MENU_EDIT';
export const REFRESH_MENU = 'WORKFLOW_MENU_EDIT_REPRESH_MENU';

export const SAVE_ACTION = 'WORKFLOW_MENU_EDIT_SAVE_ACTION';
export const SAVE_ACTION_SUCCESS = 'WORKFLOW_MENU_EDIT_SAVE_ACTION_SUCCESS';
export const SAVE_ACTION_FAIL = 'WORKFLOW_MENU_EDIT_SAVE_ACTION_FAIL';

export const ALL_DATA_UPDATE = 'WORKFLOW_MENU_EDIT_ALL_DATA_UPDATE';

export const CLOSE_OPEN_CASE_TAB = 'WORKFLOW_MENU_CLOSE_OPEN_CASE_TAB';

export const WORKFLOW_MENU_KEY_UP_DOWN = 'WORKFLOW_MENU_KEY_UP_DOWN';
export const WORKFLOW_MENU_MSG_RESET = 'DPS_WORKFLOW_MENU_MSG_RESET';

export const RUN_WORKFLOW_COMMAND = 'DPS_WORKFLOW_RUN_WORKFLOW_COMMAND';
export const RUN_WORKFLOW_COMMAND_BY_IDS = 'RUN_WORKFLOW_COMMAND_BY_IDS';
export const WORKFLOW_SESSION_READY = 'DPS_WORKFLOW_SESSION_READY';
export const WORKFLOW_SESSION_COMPLETED = 'DPS_WORKFLOW_SESSION_COMPLETED';
export const WORKFLOW_SESSION_FAILED = 'DPS_WORKFLOW_SESSION_FAILED';

export const WORKFLOW_MENU_DELETE_LINK_MENU = 'DPS_WORKFLOW_MENU_DELETE_LINK_MENU';
export const WORKFLOW_MENU_TO_BE_SELECTED_ITEM = 'DPS_WORKFLOW_MENU_TO_BE_SELECTED_ITEM';

export const WORKFLOW_DOCUMENT_VIEW = 'WORKFLOW_DOCUMENT_VIEW';
export const WORKFLOW_DOCUMENT_SUCCESS = 'WORKFLOW_DOCUMENT_SUCCESS';
export const WORKFLOW_DOCUMENT_FAIL = 'WORKFLOW_DOCUMENT_FAIL';

export const MENU_EDIT_DUPLICATE = 'MENU_EDIT_DUPLICATE';
export const MENU_EDIT_DUPLICATE_SUCCESS = 'MENU_EDIT_DUPLICATE_SUCCESS';
export const MENU_EDIT_DUPLICATE_FAIL = 'MENU_EDIT_DUPLICATE_FAIL';

export const WORKFLOW_ITEM_SEARCH = 'WORKFLOW_ITEM_SEARCH';

export class WorkflowDocumentView extends TokenizeAction implements Action {
    readonly type = WORKFLOW_DOCUMENT_VIEW;
    constructor(public token: string, public payload: { request: WorkflowDocumentViewRequest }) {
        super(token);
    }
}

export class WorkflowDocumentViewSuccess extends TokenizeAction implements Action {
    readonly type = WORKFLOW_DOCUMENT_SUCCESS;
    constructor(public token: string, public payload: { response: any, request: WorkflowDocumentViewRequest }) {
        super(token);
    }
}

export class WorkflowDocumentViewFail extends TokenizeAction implements Action {
    readonly type = WORKFLOW_DOCUMENT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export const DISPLY_WOPI_DOCUMENT_VIEW_POUP = 'DISPLY_WOPI_DOCUMENT_VIEW_POUP';
export const DISPLY_WOPI_DOCUMENT_VIEW_POUP_SUCCESS = 'DISPLY_WOPI_DOCUMENT_VIEW_POUP_SUCCESS';
export const DISPLY_WOPI_DOCUMENT_VIEW_POUP_FAIL = 'DISPLY_WOPI_DOCUMENT_VIEW_POUP_FAIL';


export class DisplyWopiDocumentViewPoup extends TokenizeAction implements Action {
    readonly type = DISPLY_WOPI_DOCUMENT_VIEW_POUP;
    constructor(public token: string, public payload: { docLink: DocumentLink, id: string }) {
        super(token);
    }
}

export class DisplyWopiDocumentViewPoupSuccess extends TokenizeAction implements Action {
    readonly type = DISPLY_WOPI_DOCUMENT_VIEW_POUP_SUCCESS;
    constructor(public token: string, public payload: { response: any, request: WorkflowDocumentViewRequest }) {
        super(token);
    }
}

export class DisplyWopiDocumentViewPoupFail extends TokenizeAction implements Action {
    readonly type = DISPLY_WOPI_DOCUMENT_VIEW_POUP_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class InitWorkFlowMenu extends TokenizeAction implements Action {
    readonly type = INIT_WORKFLOW_MENU;
    constructor(public token: string, public payload: { inputData: OpenCaseMenueData }) {
        super(token);
    }
}

export class RefreshWorkFlowMenu extends TokenizeAction implements Action {
    readonly type = REFRESH_MENU;
    constructor(public token: string) {
        super(token);
    }
}
export class ToBeSelectedWorkFlowMenuItem extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_TO_BE_SELECTED_ITEM;
    constructor(public token: string, public payload) {
        super(token);
    }
}

export class WorkFlowMenuTabChange extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_TAB_CHANGE;
    constructor(public token: string) {
        super(token);
    }
}

export class RunWorkflowCommand extends TokenizeAction implements Action {
    readonly type = RUN_WORKFLOW_COMMAND;
    constructor(public token: string, public injector: Injector,
        public menuInfo: WorkflowMenuMetaDataWrapper,
        public formLibraryTemplateInfo?: FormLibraryTemplateInfo) {
        super(token);
    }
}

export class RunWorkflowCommandByIds extends TokenizeAction implements Action {
    readonly type = RUN_WORKFLOW_COMMAND_BY_IDS;
    constructor(public token: string, public injector: Injector, public payload: {
        appID: number, fileID: number,
        branchID: number, menuInfo: WorkflowMenuMetaDataWrapper
    }) {
        super(token);
    }
}

export class WorkflowSessionReady extends TokenizeAction implements Action {
    readonly type = WORKFLOW_SESSION_READY;
    constructor(public token: string, public menuInfo: WorkflowMenuMetaItem) {
        super(token);
    }
}

export class WorkflowSessionCompleted extends TokenizeAction implements Action {
    readonly type = WORKFLOW_SESSION_COMPLETED;
    constructor(public token: string, public menuInfo: WorkflowMenuMetaItem) {
        super(token);
    }
}

export class WorkflowSessionFailed extends TokenizeAction implements Action {
    readonly type = WORKFLOW_SESSION_FAILED;
    constructor(public token: string, public menuInfo: WorkflowMenuMetaItem, public error: any) {
        super(token);
    }
}

export class LoadMenuList extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadMenuListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST_SUCCESS;
    constructor(public token: string, public payload: { menuList: WorkflowMenuMetaItem[] }) {
        super(token);
    }
}
export class LoadMenuListFail extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class LoadMenuListAfterRefresh extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST_REFRESH;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadMenuListAfterRefreshSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST_REFRESH_SUCCESS;
    constructor(public token: string, public payload: { menuList: WorkflowMenuMetaItem[] }) {
        super(token);
    }
}
export class LoadMenuListAfterRefreshFail extends TokenizeAction implements Action {
    readonly type = LOAD_WORKFLOW_MENU_LIST_REFRESH_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadMenuMatterSummery extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SUMMARY;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadMenuMatterSummerySuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SUMMARY_SUCCESS;
    constructor(public token: string, public payload: { matterSummeryData: MatterSummery[] }) {
        super(token);
    }
}
export class LoadMenuMatterSummeryFail extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SUMMARY_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadMenuMatterShortCutKeys extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SHORTCUT_KEYS;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadMenuMatterShortCutKeysSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS;
    constructor(public token: string, public payload: { matterShortCut: MatterShortcuts[] }) {
        super(token);
    }
}
export class LoadMenuMatterShortCutKeysFail extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadFileBaseMenu extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_BASE_MENU;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFileBaseMenuSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_BASE_MENU_SUCCESS;
    constructor(public token: string, public payload: { isFileBaseMenu: boolean }) {
        super(token);
    }
}
export class LoadFileBaseMenuFail extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_BASE_MENU_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class TreeItemChange extends TokenizeAction implements Action {
    readonly type = TREE_ITEM_CHANGE;
    constructor(public token: string, public payload: { kind: ItemChangeKind, value: any }) { super(token); }
}

export class WorkflowMenuExportToLocal extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_EXPORT_TO_LOCAL;
    constructor(public token: string, public payload: { menuExportData: ExportData }) {
        super(token);
    }
}
export class WorkflowMenuExportToLocalSuccess extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_EXPORT_TO_LOCAL_SUCCESS;
    constructor(public token: string, public payload: { menuExportData: ExportData, exportData: any }) {
        super(token);
    }
}
export class WorkflowMenuExportToLocalFail extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_EXPORT_TO_LOCAL_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class WorkflowMenuImport extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_IMPORT;
    constructor(public token: string, public payload: { FullfileData: WorkflowMenuFileData }) {
        super(token);
    }
}

export class WorkflowMenuImportSuccess extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_IMPORT_SUCCESS;
    constructor(public token: string, public payload: { importedData: any, importButtonType: ImportButtonType }) {
        super(token);
    }
}

export class WorkflowMenuImportFail extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_IMPORT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}



export class WorkFlowUserAction extends TokenizeAction implements Action {
    readonly type = USER_ACTION;
    constructor(public token: string, public payload: { type: MenusUserAction }) {
        super(token);
    }
}
export class MenuEditCancelAction extends TokenizeAction implements Action {
    readonly type = CANCEL_EDIT;
    constructor(public token: string) {
        super(token);
    }
}
export class MenuEditSaveAction extends TokenizeAction implements Action {
    readonly type = SAVE_ACTION;
    constructor(public token: string) {
        super(token);
    }
}
export class MenuEditSaveActionSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_ACTION_SUCCESS;
    constructor(public token: string, public payload: { newMenuList: WorkflowMenuMetaItem[] }) {
        super(token);
    }
}
export class MenuEditSaveActionFail extends TokenizeAction implements Action {
    readonly type = SAVE_ACTION_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class MenuEditIgnowExit extends TokenizeAction implements Action {
    readonly type = IGNOW_CANCEL;
    constructor(public token: string) {
        super(token);
    }
}

export class CloseMenuEdit extends TokenizeAction implements Action {
    readonly type = CLOSE_MENU_EDIT;
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

export class CloseMenuOpenCaseTap extends TokenizeAction implements Action {
    readonly type = CLOSE_OPEN_CASE_TAB;
    constructor(public token: string) {
        super(token);
    }
}
export class MsgReset extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_MSG_RESET;
    constructor(public token: string, public payload: { value: string }) {
        super(token);
    }
}
export class DeleteLinkMenuItem extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_DELETE_LINK_MENU;
    constructor(public token: string, public payload: { value: boolean }) {
        super(token);
    }
}
export class WorkflowMenuKeyUpDown extends TokenizeAction implements Action {
    readonly type = WORKFLOW_MENU_KEY_UP_DOWN;
    constructor(public token: string, public payload: { keyCode: number, selectMenuItem: WorkflowMenuMetaDataWrapper }) {
        super(token);
    }
}
export class MenuEditDuplicate extends TokenizeAction implements Action {
    readonly type = MENU_EDIT_DUPLICATE;
    constructor(public token: string, public payload: { selectedMenu: WorkflowMenuMetaDataWrapper }) {
        super(token);
    }
}
export class MenuEditDuplicateSuccess extends TokenizeAction implements Action {
    readonly type = MENU_EDIT_DUPLICATE_SUCCESS;
    constructor(public token: string, public payload: { newMenuList: WorkflowMenuMetaItem[] }) {
        super(token);
    }
}
export class MenuEditDuplicateFail extends TokenizeAction implements Action {
    readonly type = MENU_EDIT_DUPLICATE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class WorkflowItemSearch extends TokenizeAction implements Action {
    readonly type = WORKFLOW_ITEM_SEARCH;
    constructor(public token: string, public searchText: string) {
        super(token);
    }
}

export type Any = InitWorkFlowMenu |
    LoadMenuList | LoadMenuListSuccess | LoadMenuListFail |
    LoadFileBaseMenu | LoadFileBaseMenuSuccess | LoadFileBaseMenuFail |
    TreeItemChange | LoadMenuMatterSummery | LoadMenuMatterSummerySuccess | LoadMenuMatterSummeryFail |
    LoadMenuMatterShortCutKeys | LoadMenuMatterShortCutKeysSuccess | LoadMenuMatterShortCutKeysFail |
    WorkflowMenuExportToLocal | WorkflowMenuExportToLocalSuccess | WorkflowMenuExportToLocalFail |
    WorkflowMenuImport | WorkflowMenuImportSuccess | WorkflowMenuImportFail | WorkFlowUserAction |
    MenuEditCancelAction | MenuEditSaveAction | MenuEditIgnowExit | MenuEditSaveActionSuccess |
    MenuEditSaveActionFail | CloseMenuEdit | AllDataUpdate | CloseMenuOpenCaseTap |
    WorkflowMenuKeyUpDown | MsgReset | RunWorkflowCommand | WorkflowSessionReady | WorkflowSessionCompleted | WorkflowSessionFailed |
    DeleteLinkMenuItem | ToBeSelectedWorkFlowMenuItem | WorkflowDocumentView | WorkflowDocumentViewSuccess | WorkflowDocumentViewFail |
    LoadMenuListAfterRefresh | LoadMenuListAfterRefreshSuccess | LoadMenuListAfterRefreshFail |
    MenuEditDuplicate | MenuEditDuplicateSuccess | MenuEditDuplicateFail | WorkflowItemSearch;
