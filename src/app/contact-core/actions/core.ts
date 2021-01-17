import { ContactRequest } from '../models/contact-core-request';

import { Contact, ContactResponse, ContactListItem } from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { MatterInfo } from '../../core/lib/matter';

export const INIT_CONTACT_CORE = 'INIT_CONTACT_CORE';

export const LOAD_CONTACT_CORE_DATA_WITH_CURRENT_STATE = 'LOAD_CONTACT_CORE_DATA_WITH_CURRENT_STATE';


export const CONTACT_CORE_CHANGE = 'CONTACT_CORE_CHANGE';

export const CONTACT_CORE_GRID_ROW_CHANGE = 'CONTACT_CORE_GRID_ROW_CHANGE';

export const LOAD_CONTACT_CORE_GRID_DATA = 'LOAD_CONTACT_CORE_GRID_DATA';
export const LOAD_CONTACT_CORE_GRID_DATA_LOAD_SUCCESS = 'LOAD_CONTACT_CORE_GRID_DATA_LOAD_SUCCESS';
export const LOAD_CONTACT_CORE_GRID_DATA_LOAD_FAIL = 'LOAD_CONTACT_CORE_GRID_DATA_LOAD_FAIL';


export const LOAD_FILE_URL = 'LOAD_FILE_URL_LOAD';
export const LOAD_FILE_URL_LOAD_SUCCESS = 'LOAD_FILE_URL_LOAD_SUCCESS';
export const LOAD_FILE_URL_LOAD_FAIL = 'LOAD_FILE_URL_LOAD_FAIL';


export enum ViewChangeKind {
    SearchText = 'SEARCH_TEXT',
    PageEvent = 'PAGE_EVENT',
}
export enum RowItemChangeKind {
    IsExpand = 'IS_EXPAND',
}

export class InitContact extends TokenizeAction implements Action {
    readonly type = INIT_CONTACT_CORE;
    constructor(public token: string, public matterInfo: MatterInfo) { super(token); }
}
export class ContactViewChange extends TokenizeAction implements Action {
    readonly type = CONTACT_CORE_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}

export class ContactGridRowChange extends TokenizeAction implements Action {
    readonly type = CONTACT_CORE_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: ContactListItem<Contact>, value: any
    }) { super(token); }
}

export class LoadContactDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_CORE_DATA_WITH_CURRENT_STATE;
    constructor(public token) { super(token); }
}
export class LoadContactGridData extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_CORE_GRID_DATA;
    constructor(public token: string, public request: ContactRequest) { super(token); }
}

export class LoadContactGridDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_CORE_GRID_DATA_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: ContactResponse, request: ContactRequest }) {
        super(token);
    }
}
export class LoadContactGridDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_CORE_GRID_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { ContactList: Contact[] }) {
        super(token);
    }
}



export type Any = InitContact | LoadContactGridDataSuccess | LoadContactGridDataFail
    | ContactViewChange | ContactGridRowChange | LoadContactGridData;
