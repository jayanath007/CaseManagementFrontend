import {
    UnlinkContactSuccess, UnlinkContact, UnlinkContactFailed,
    RemoveContactFromFileSuccess
} from '../../screen-contact-core/actions/core';
import {
    FormViewRequest, ScreenViewRequest, FormViewRequestViewModel,
    MainStateRequest, MainStateResponse, ScreenAttachmentViewModel
} from '../models/request';
import { Action } from '@ngrx/store';
import { FormView, FormViewRespons } from '../reducers/screen-view';
import { ScreenViewInitials } from '../../core/lib/screen-view';
import { TokenizeAction } from '../../core';
import { ShowUserScreen, IVarValue } from '../../workflow-core';
import { ScreenDesignFormActions } from '../models/screen-definition';
import { ScreenContanerComponent } from '../models/screen-contaner-component';
export const INIT_SCREEN_VIEW = 'INIT_SCREEN_VIEW';
export const FORM_VIEW_CHANGE = 'FORM_VIEW_CHANGE';
export const SSCREEN_COMPONENT_LIST_CHANGE = 'SSCREEN_COMPONENT_LIST_CHANGE';
export const LOAD_FORM_VIEW_DATA = 'LOAD_FORM_VIEW_DATA';
export const LOAD_FORM_VIEW_DATA_LOAD_SUCCESS = 'LOAD_FORM_VIEW_DATA_LOAD_SUCCESS';
export const LOAD_FORM_VIEW_DATA_LOAD_FAIL = 'LOAD_FORM_VIEW_DATA_LOAD_FAIL';
export const LOAD_FORM_VIEW_LIST_DATA = 'LOAD_FORM_VIEW_LIST_DATA';
export const LOAD_FORM_VIEW_LIST_DATA_LOAD_SUCCESS = 'LOAD_FORM_VIEW_LIST_DATA_LOAD_SUCCESS';
export const LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL = 'LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL';
export const IS_FORM_DATA_LOADING = 'IS_FORM_DATA_LOADING';
export const LOAD_MAIN_STATE = 'LOAD_MAIN_STATE';
export const LOAD_MAIN_STATE_SUCCESS = 'LOAD_MAIN_STATE_SUCCESS';
export const LOAD_MAIN_STATE_FAIL = 'LOAD_MAIN_STATE_FAIL';
export const INITIAL_DATA_INFOR_UPDATE_LOADING = 'INITIAL_DATA_INFOR_UPDATE_LOADING';
export const INIT_SCREEN_VIEW_POPUP = 'INIT_SCREEN_VIEW_POPUP';
export const SET_CURRENT_CONTACT_ID = `[CONTACT_SEARCH]SET_CURRENT_CONTACT_ID`;
export const REFRESH_CONTACT_ON_FLAG = `[CONTACT_SEARCH]REFRESH_CONTACT_ON_FLAG`;
export const SET_NEW_VAR_VALUES = `[SCREEN_ViEW]SET_NEW_VAR_VALUES`;
export const CLEAR_FORM_DATA = `[SCREEN_ViEW]CLEAR_FORM_DATA`;
export const SET_CONTACT_DIRTY_STATE = `[CONTACT_SEARCH]SET_CONTACT_DIRTY_STATE`;
export const SET_SCREEN_CONTROL_VALUES_DIRTY_STATE = `[CONTACT_SEARCH]SET_SCREEN_CONTROL_VALUES_DIRTY_STATE`;
export const GET_CONTACTS_ON_FILE = `[CONTACT_SEARCH]GET_CONTACTS_ON_FILE`;
export const GET_CONTACTS_ON_FILE_SUCCESS = '[CONTACT_SEARCH]GET_CONTACTS_ON_FILE_SUCCESS';
export const GET_CONTACTS_ON_FILE_FAILED = '[CONTACT_SEARCH]GET_CONTACTS_ON_FILE_FAILED';
export const SET_CONTACTS_ON_FILE = `[CONTACT_SEARCH]SET_CONTACTS_ON_FILE`;
export const SET_ENABLE_CONTACT_SAVING = `[CONTACT_SEARCH]SET_ENABLE_CONTACT_SAVING`;
export const GET_CURRENT_SCREEN_CONTACT_ID = `[CONTACT_SEARCH]GET_CURRENT_SCREEN_CONTACT_ID`;
export const GET_CURRENT_SCREEN_CONTACT_ID_SUCCESS = '[CONTACT_SEARCH]GET_CURRENT_SCREEN_CONTACT_ID_SUCCESS';
export const GET_CURRENT_SCREEN_CONTACT_ID_FAILED = '[CONTACT_SEARCH]GET_CURRENT_SCREEN_CONTACT_ID_FAILED';
export const SET_DISABLE_SEARCH_BUTTONS = `[CONTACT_SEARCH]SET_DISABLE_SEARCH_BUTTONS`;

export const SCREEN_TAB_LOGIC_UPDATE = 'SCREEN_UPDATE_TAB_LOGIC';


export const SCREEN_VIEW_UPLOAD_ATACHMENT = `SCREEN_VIEW_UPLOAD_ATACHMENT`;
export const SCREEN_VIEW_UPLOAD_ATACHMENT_SUCCESS = `SCREEN_VIEW_UPLOAD_ATACHMENT_SUCCESS`;
export const SCREEN_VIEW_UPLOAD_ATACHMENT_FAILED = `SCREEN_VIEW_UPLOAD_ATACHMENT_FAILED`;




export enum ViewChangeKind {
    GoToNext = 'GO_TO_NEXT',
    GoToPrevious = 'GO_TO_PREVIOUS',
    InitialLoad = 'INITIAL_LOAD',
    UpdateTabLogic = 'UPDATE_TAB_LOGIC',
}
export enum RowItemChangeKind {
    UpdateValue = 'UPDATE_VALUE'
}

// export enum ContactSearchAction { // move to interface
//     SearchAll = 'SEARCH_ALL',
//     SearchOnFile = 'SEARCH_ON_FILE',
//     ConfigSearch = 'CONFIG_SEARCH',
//     RemoveFromFile = 'REMOVE_FROM_FILE',
//     New = 'NEW_CONTACT',
//     Delete = 'DELETE_CONTACT',
//     ContactSelected = 'CONTACT_SELECTED',
//     SaveNewContact = 'SAVE_NEW_CONTACT',
//     Clear = 'CLEAR',
//     UserClosed = 'USER_CLOSED'
// }

export class InitScreenView extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_VIEW;
    constructor(public token: string, public payload: ScreenViewInitials) { super(token); }
}


export class ScreenViewUploadAtachment extends TokenizeAction implements Action {
    readonly type = SCREEN_VIEW_UPLOAD_ATACHMENT;
    constructor(public token: string, public payload: { value: any, type: string, controler: ScreenContanerComponent }) { super(token); }
}

export class ScreenViewUploadAtachmentSuccess extends TokenizeAction implements Action {
    readonly type = SCREEN_VIEW_UPLOAD_ATACHMENT_SUCCESS;
    constructor(public token: string, public payload: { response: any  , controler: ScreenContanerComponent}) { super(token); }
}

export class ScreenViewUploadAtachmentFail extends TokenizeAction implements Action {
    readonly type = SCREEN_VIEW_UPLOAD_ATACHMENT_FAILED;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}







export class InitScreenViewPopup extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_VIEW_POPUP;
    constructor(public token: string) { super(token); }
}

export class ScreenTabLogicUpdate extends TokenizeAction implements Action {
    readonly type = SCREEN_TAB_LOGIC_UPDATE;
    constructor(public token: string, public payload: { value: boolean }) { super(token); }
}

export class LoadFormViewData extends TokenizeAction implements Action {
    readonly type = LOAD_FORM_VIEW_DATA;
    constructor(public token: string, public request: FormViewRequest) { super(token); }
}

export class LoadFormViewDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FORM_VIEW_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: FormView, request: FormViewRequest }) {
        super(token);
    }
}
export class LoadFormViewDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_FORM_VIEW_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { response: string }) {
        super(token);
    }
}

export class FormViewChange extends TokenizeAction implements Action {
    readonly type = FORM_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: ShowUserScreen }) { super(token); }
}

export class IsFormDataLoading extends TokenizeAction implements Action {
    readonly type = IS_FORM_DATA_LOADING;
    constructor(public token: string, public payload: { value: boolean }) { super(token); }
}

export class InitialDatainforUpdateLoading extends TokenizeAction implements Action {
    readonly type = INITIAL_DATA_INFOR_UPDATE_LOADING;
    constructor(public token: string, public payload: { masages: Array<string>, screenList: Array<number> }) { super(token); }
}

export class LoadMainState extends TokenizeAction implements Action {
    readonly type = LOAD_MAIN_STATE;
    constructor(public token: string, public payload: { request: MainStateRequest }) { super(token); }
}

export class LoadMainStateSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MAIN_STATE_SUCCESS;
    constructor(public token: string, public payload: { response: MainStateResponse, request: MainStateRequest }) { super(token); }
}

export class LoadMainStateFail extends TokenizeAction implements Action {
    readonly type = LOAD_MAIN_STATE_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}

export class LoadFormViewListData extends TokenizeAction implements Action {
    readonly type = LOAD_FORM_VIEW_LIST_DATA;
    constructor(public token: string, public request: ScreenViewRequest) { super(token); }
}

export class LoadFormViewListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FORM_VIEW_LIST_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: FormViewRespons[], request: ScreenViewRequest }) {
        super(token);
    }
}
export class LoadFormViewListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { response: string }) {
        super(token);
    }
}

export class ScreenComponentListChange extends TokenizeAction implements Action {
    readonly type = SSCREEN_COMPONENT_LIST_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: any, value: any
    }) { super(token); }
}

export const CASH_SCREEN_VIEW = 'CASH_SCREEN_VIEW';
export class CashScreenView extends TokenizeAction implements Action {
    readonly type = CASH_SCREEN_VIEW;
    constructor(public token: string, public payload: ScreenViewInitials) { super(token); }
}

export class SetCurrentContactId extends TokenizeAction implements Action {
    readonly type = SET_CURRENT_CONTACT_ID;
    constructor(public token: string, public payload: { contactId: number }) { super(token); }
}

export class RefreshContactOnFlag extends TokenizeAction implements Action {
    readonly type = REFRESH_CONTACT_ON_FLAG;
    constructor(public token: string, public payload: any) { super(token); }
}

export class SetNewVarValues extends TokenizeAction implements Action {
    readonly type = SET_NEW_VAR_VALUES;
    constructor(public token: string, public payload: {
        varValues: IVarValue[],
        focusContainerName?: string
    }) { super(token); }
}

export class ClearFormData extends TokenizeAction implements Action {
    readonly type = CLEAR_FORM_DATA;
    constructor(public token: string, public payload: any) { super(token); }
}

export class SetContactDirtyState extends TokenizeAction implements Action {
    readonly type = SET_CONTACT_DIRTY_STATE;
    constructor(public token: string, public payload: { isDirty: boolean }) { super(token); }
}

export class SetScreenControlValuesDirtyState extends TokenizeAction implements Action {
    readonly type = SET_SCREEN_CONTROL_VALUES_DIRTY_STATE;
    constructor(public token: string, public payload: { isDirty: boolean }) { super(token); }
}

export class GetContactsOnFile extends TokenizeAction implements Action {
    readonly type = GET_CONTACTS_ON_FILE;
    constructor(public token: string, public payload: {
        appId: number, fileId: number, branchId: number,
        contactTypeId: number
    }) { super(token); }
}

export class GetContactsOnFileSuccess extends TokenizeAction implements Action {
    readonly type = GET_CONTACTS_ON_FILE_SUCCESS;
    constructor(public token: string, public payload: { contactsOnFile: number }) { super(token); }
}

export class GetContactsOnFileFailed extends TokenizeAction implements Action {
    readonly type = GET_CONTACTS_ON_FILE_FAILED;
    constructor(public token: string, public payload: { response: string }) {
        super(token);
    }
}

export class SetContactsOnFile extends TokenizeAction implements Action {
    readonly type = SET_CONTACTS_ON_FILE;
    constructor(public token: string, public payload: { increment: boolean }) {
        super(token);
    }
}

export class SetEnableContactSaving extends TokenizeAction implements Action {
    readonly type = SET_ENABLE_CONTACT_SAVING;
    constructor(public token: string, public payload: { enableSaving: boolean }) { super(token); }
}

export class GetCureentScreenContactId extends TokenizeAction implements Action {
    readonly type = GET_CURRENT_SCREEN_CONTACT_ID;
    constructor(public token: string, public payload: {
        appId: number, fileId: number, branchId: number,
        contactTypeId: number, screenNo: number
    }) { super(token); }
}

export class GetCureentScreenContactIdSuccess extends TokenizeAction implements Action {
    readonly type = GET_CURRENT_SCREEN_CONTACT_ID_SUCCESS;
    constructor(public token: string, public payload: { currentContactId: number }) { super(token); }
}

export class GetCureentScreenContactIdFailed extends TokenizeAction implements Action {
    readonly type = GET_CURRENT_SCREEN_CONTACT_ID_FAILED;
    constructor(public token: string, public payload: { response: string }) {
        super(token);
    }
}

export class SetDisableSearchButtons extends TokenizeAction implements Action {
    readonly type = SET_DISABLE_SEARCH_BUTTONS;
    constructor(public token: string, public payload: { disableSearchButtons: boolean }) { super(token); }
}


export type Any = InitScreenView | LoadFormViewDataSuccess | LoadFormViewDataFail
    | FormViewChange | ScreenComponentListChange | LoadFormViewData | SetNewVarValues
    | LoadFormViewListData | LoadFormViewListSuccess | LoadFormViewListFail
    | IsFormDataLoading | LoadMainState | LoadMainStateSuccess | LoadFormViewDataFail | InitialDatainforUpdateLoading
    | InitScreenViewPopup | SetCurrentContactId | RefreshContactOnFlag | ClearFormData | SetContactDirtyState
    | GetContactsOnFile | GetContactsOnFileSuccess | GetContactsOnFileFailed | SetContactsOnFile
    | SetEnableContactSaving | GetCureentScreenContactId | GetCureentScreenContactIdSuccess | GetCureentScreenContactIdFailed
    | UnlinkContact | UnlinkContactSuccess | UnlinkContactFailed | SetScreenControlValuesDirtyState | ScreenTabLogicUpdate
    | SetDisableSearchButtons | RemoveContactFromFileSuccess | ScreenViewUploadAtachment | ScreenViewUploadAtachmentSuccess
    | ScreenViewUploadAtachmentFail;



