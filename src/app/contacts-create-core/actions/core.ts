import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { ContactCreateInputData, ContactViewModel, ContactType } from '../models/interfaces';
import { TabIndex, Section } from '../models/enum';

export const INIT_CONTACT_CREATION = 'DPS_INIT_CONTACT_CREATION';
export const CHENGE_SEARCH_TEXT = 'DPS_CHENGE_SEARCH_TEXT';
export const CHANGE_TAB = 'DPS_CHANGE_CONTACT_TAB';

export const CHANGE_CONTACT = 'DPS_CHANGCE_CONTACT';
export const CHANGE_CONTACT_SUCCESS = 'DPS_CHANGCE_CONTACT_SUCCESS';
export const CHANGE_CONTACT_FAIL = 'DPS_CHANGCE_CONTACT_FAIL';

export const CHANGE_DETAILS = 'DPS_CHANGE_CONTACT_DETAILS';

export const GET_CONTACT_TYPE = 'DPS_GET_CONTACT_TYPE';
export const GET_CONTACT_TYPE_SUCCESS = 'DPS_GET_CONTACT_TYPE_SUCCESS';
export const GET_CONTACT_TYPE_FAIL = 'DPS_CHANGCE_CONTACT_FAIL';


export class InitContactCreation extends TokenizeAction implements Action {
    readonly type = INIT_CONTACT_CREATION;
    constructor(public token: string, public payload: {
        inputData: ContactCreateInputData,
        isPopup: boolean
    }) { super(token); }
}

export class ChangeSearchText extends TokenizeAction implements Action {
    readonly type = CHENGE_SEARCH_TEXT;
    constructor(public token: string, public payload: {
        searchText: string
    }) { super(token); }
}

export class ChangeTab extends TokenizeAction implements Action {
    readonly type = CHANGE_TAB;
    constructor(public token: string, public payload: {
        selectTabIndex: TabIndex
    }) { super(token); }
}

export class ChangeContact extends TokenizeAction implements Action {
    readonly type = CHANGE_CONTACT;
    constructor(public token: string, public payload: {
        contactId: number,
        closeSearch: boolean
    }) { super(token); }
}

export class ChangeContactSuccess extends TokenizeAction implements Action {
    readonly type = CHANGE_CONTACT_SUCCESS;
    constructor(public token: string, public payload: {
        details: ContactViewModel
    }) { super(token); }
}

export class ChangeContactFail extends TokenizeAction implements Action {
    readonly type = CHANGE_CONTACT_FAIL;
    constructor(public token: string) { super(token); }
}

export class ChangeDetails extends TokenizeAction implements Action {
    readonly type = CHANGE_DETAILS;
    constructor(public token: string, public payload: { type: string, value: string, section: Section }) { super(token); }
}

export class GetContactType extends TokenizeAction implements Action {
    readonly type = GET_CONTACT_TYPE;
    constructor(public token: string) { super(token); }
}

export class GetContactTypeSuccess extends TokenizeAction implements Action {
    readonly type = GET_CONTACT_TYPE_SUCCESS;
    constructor(public token: string, public payload: {
        types: ContactType[]
    }) { super(token); }
}

export class GetContactTypeFail extends TokenizeAction implements Action {
    readonly type = GET_CONTACT_TYPE_FAIL;
    constructor(public token: string) { super(token); }
}

export type Any = InitContactCreation | ChangeSearchText | ChangeTab |
    ChangeContact | ChangeContactSuccess | ChangeContactFail | ChangeDetails |
    GetContactType | GetContactTypeSuccess | GetContactTypeFail;
