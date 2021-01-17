import { ScreenDefinition, IScreenDefinition } from '../../screen-view-core/models/screen-definition';
import {  } from '../models/screen-contact-request';
import { ContactScreenItem, ContactFieldDef, ContactScreenItemWrapper, ContactSearchType } from '../models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { Matter, MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';

export const LOAD_CONTACTS_WITH_CURRENT_STATE = 'LOAD_CONTACTS_WITH_CURRENT_STATE';
export const LOAD_CONTACT_SCREEN_DATA_WITH_CURRENT_STATE = 'LOAD_CONTACT_SCREEN_DATA_WITH_CURRENT_STATE';
export const INIT_CONTACT_SEARCH_SCREEN = 'INIT_ALL_CONTACT_SEARCH_SCREEN';
export const CONTACT_SCREEN_VIEW_CHANGE = `[CONTACT_SEARCH]CONTACT_SCREEN_VIEW_CHANGE`;
export const CONTACT_SCREEN_GRID_CHANGE = 'CONTACT_SCREEN_GRID_CHANGE';
export const CONTACT_SCREEN_GRID_ROW_CHANGE = 'CONTACT_SCREEN_GRID_ROW_CHANGE';
export const CONTACT_SCREEN_REFRESH = 'CONTACT_SCREEN_REFRESH';
export const GET_CONTACT_SEARCH_FIELDS = `[CONTACT_SEARCH]GET_CONTACT_SEARCH_FIELDS`;
export const GET_CONTACT_SEARCH_FIELDS_SUCCESS = `[CONTACT_SEARCH]GET_CONTACT_SEARCH_FIELDS_SUCCESS`;
export const GET_CONTACT_SEARCH_FIELDS_FAILED = `[CONTACT_SEARCH]GET_CONTACT_SEARCH_FIELDS_FAILED`;
export const SEARCH_CONTACTS = `[CONTACT_SEARCH]SEARCH_CONTACTS`;
export const SEARCH_ALL_CONTACTS = `[CONTACT_SEARCH]SEARCH_ALL_CONTACTS`;
export const SEARCH_ALL_CONTACTS_SUCCESS = `[CONTACT_SEARCH]SEARCH_ALL_CONTACTS_SUCCESS`;
export const SEARCH_ALL_CONTACTS_FAILED = `[CONTACT_SEARCH]SEARCH_ALL_CONTACTS_FAILED`;
export const SEARCH_CONTACTS_ON_FILE = `[CONTACT_SEARCH]SEARCH_CONTACTS_ON_FILE`;
export const SEARCH_CONTACTS_ON_FILE_SUCCESS = `[CONTACT_SEARCH]SEARCH_CONTACTS_ON_FILE_SUCCESS`;
export const SEARCH_CONTACTS_ON_FILE_FAILED = `[CONTACT_SEARCH]SEARCH_CONTACTS_ON_FILE_FAILED`;
export const GET_MATTER_COUNT_FOR_CONTACT = `[CONTACT_SEARCH]GET_MATTER_COUNT_FOR_CONTACT`;
export const GET_MATTER_COUNT_FOR_CONTACT_SUCCESS = `[CONTACT_SEARCH]GET_MATTER_COUNT_FOR_CONTACT_SUCCESS`;
export const GET_MATTER_COUNT_FOR_CONTACT_FAILED = `[CONTACT_SEARCH]GET_MATTER_COUNT_FOR_CONTACT_FAILED`;
export const DELETE_CONTACT = `[CONTACT_SEARCH]DELETE_CONTACT`;
export const DELETE_CONTACT_SUCCESS = `[CONTACT_SEARCH]DELETE_CONTACT_SUCCESS`;
export const DELETE_CONTACT_FAILED = `[CONTACT_SEARCH]DELETE_CONTACT_FAILED`;
export const REMOVE_CONTACT_FROM_FILE = `[CONTACT_SEARCH]REMOVE_CONTACT_FROM_FILE`;
export const REMOVE_CONTACT_FROM_FILE_SUCCESS = `[CONTACT_SEARCH]REMOVE_CONTACT_FROM_FILE_SUCCESS`;
export const REMOVE_CONTACT_FROM_FILE_FAILED = `[CONTACT_SEARCH]REMOVE_CONTACT_FROM_FILE_FAILED`;
export const UNLINK_CONTACT = `[CONTACT_SEARCH]UNLINK_CONTACT`;
export const UNLINK_CONTACT_SUCCESS = `[CONTACT_SEARCH]UNLINK_CONTACT_SUCCESS`;
export const UNLINK_CONTACT_FAILED = `[CONTACT_SEARCH]UNLINK_CONTACT_FAILED`;
export const SAVE_CONTACT_SEARCH_FIELDS = `[CONTACT_SEARCH]SAVE_CONTACT_SEARCH_FIELDS`;
export const SAVE_CONTACT_SEARCH_FIELDS_SUCCESS = `[CONTACT_SEARCH]SAVE_CONTACT_SEARCH_FIELDS_SUCCESS`;
export const SAVE_CONTACT_SEARCH_FIELDS_FAILED = `[CONTACT_SEARCH]SAVE_CONTACT_SEARCH_FIELDS_FAILED`;
export const SEARCH_FIELD_CONFIG_CHANGED = `[CONTACT_SEARCH]SEARCH_FIELD_CONFIG_CHANGED`;
export const SEARCH_FIELD_DISCARD_CHANGES = `[CONTACT_SEARCH]SEARCH_FIELD_DISCARD_CHANGES`;
export const RESET_CONTACT_LIST = '[CONTACT_SEARCH]RESET_CONTACT_LIST';
// export const LOAD_CONTACT_SCREEN_GRID_DATA = 'LOAD_CONTACT_SCREEN_GRID_DATA';
// export const LOAD_CONTACT_SCREEN_GRID_DATA_SUCCESS = 'LOAD_CONTACT_SCREEN_GRID_DATA_LOAD_SUCCESS';
// export const LOAD_CONTACT_SCREEN_GRID_DATA_FAIL = 'LOAD_CONTACT_SCREEN_GRID_DATA_LOAD_FAIL';
// export const LOAD_CONTACT_SCREEN_SEARCH_FIELDS = 'LOAD_CONTACT_SCREEN_SEARCH_FIELDS';
// export const LOAD_CONTACT_SCREEN_SEARCH_FIELDS_SUCCESS = 'LOAD_CONTACT_SCREEN_SEARCH_FIELDS_SUCCESS';
// export const LOAD_CONTACT_SCREEN_SEARCH_FIELDS_FAIL = 'LOAD_CONTACT_SCREEN_SEARCH_FIELDS_FAIL';
// export const INIT_CONTACTS_ON_FILE_SEARCH_SCREEN = 'INIT_CONTACTS_ON_FILE_SEARCH_SCREEN';
// export const INIT_CONFIGURE_SEARCH_FIELDS_SCREEN = 'INIT_CONFIGURE_SEARCH_FIELDS_SCREEN';


export enum ViewChangeKind {
    SearchText = 'SEARCH_TEXT',
    PageEvent = 'PAGE_EVENT',
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    // ToggleFieldSort = 'FIELD_SORT',
}


export enum GridChangeKind {
    ItemSelected = 'ITEM_SELECTED',
}

export enum RowItemChangeKind {
    IsExpand = 'IS_EXPAND',
}

export class InitContactSearchScreen extends TokenizeAction implements Action {
    readonly type = INIT_CONTACT_SEARCH_SCREEN;
    constructor(public token: string, public payload: { matterDetails: Matter,  searchType: ContactSearchType,
        screenDefinition: IScreenDefinition, searchField: string, searchFieldValue: string, searchKeyword: string}) {
        super(token);
    }
}

export class LoadContactScreenDataWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_SCREEN_DATA_WITH_CURRENT_STATE;
    constructor(public token, public payload: any) { super(token); }
}

export class LoadContactsWithCurrentState extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACTS_WITH_CURRENT_STATE;
    constructor(public token, public payload: any) { super(token); }
}

export class GetContactSearchFields extends TokenizeAction implements Action {
    readonly type = GET_CONTACT_SEARCH_FIELDS;
    constructor(public token, public payload: { matterDetails: Matter, screenDefinition: ScreenDefinition}) { super(token); }
}

export class GetContactFieldsSuccess extends TokenizeAction implements Action {
    readonly type = GET_CONTACT_SEARCH_FIELDS_SUCCESS;
    constructor(public token, public payload: {defaultFields: ContactFieldDef[], mappedFields: ContactFieldDef[]}) { super(token); }
}

export class GetContactFieldsFailed extends TokenizeAction implements Action {
    readonly type = GET_CONTACT_SEARCH_FIELDS_FAILED;
    constructor(public token, public payload: any) { super(token); }
}

export class SearchContacts extends TokenizeAction implements Action {
    readonly type = SEARCH_CONTACTS;
    constructor(public token, public payload: { matterDetails: Matter,  searchType: ContactSearchType,
        screenDefinition: IScreenDefinition, searchField: string, searchFieldValue: string, searchKeyword: string}) { super(token); }
}

export class SearchAllContacts extends TokenizeAction implements Action {
    readonly type = SEARCH_ALL_CONTACTS;
    constructor(public token, public payload: { contactTypeId: string, count: string, searchField: string,
         searchFieldValue: string, searchKeyword: string}) {
         super(token); }
}

export class SearchAllContactsSuccess extends TokenizeAction implements Action {
    readonly type = SEARCH_ALL_CONTACTS_SUCCESS;
    constructor(public token, public payload: {contactList: ContactScreenItemWrapper[]}) { super(token); }
}

export class SearchAllContactsFailed extends TokenizeAction implements Action {
    readonly type = SEARCH_ALL_CONTACTS_FAILED;
    constructor(public token, public payload: any) { super(token); }
}

export class SearchContactsOnFile extends TokenizeAction implements Action {
    readonly type = SEARCH_CONTACTS_ON_FILE;
    constructor(public token, public payload: {appId: string, fileId: string, branchId: string, contactTypeId: string,
         count: string, screenId: string, searchKeyword: string}) { super(token); }
}

export class SearchContactsOnFileSuccess extends TokenizeAction implements Action {
    readonly type = SEARCH_CONTACTS_ON_FILE_SUCCESS;
    constructor(public token, public payload: {contactList: ContactScreenItemWrapper[]}) { super(token); }
}

export class SearchContactsOnFileFailed extends TokenizeAction implements Action {
    readonly type = SEARCH_CONTACTS_ON_FILE_FAILED;
    constructor(public token, public payload: any) { super(token); }
}

export class GetLinkedMattersForContact extends TokenizeAction implements Action {
    readonly type = GET_MATTER_COUNT_FOR_CONTACT;
    constructor(public token, public payload: {contact: ContactScreenItemWrapper}) { super(token); }
}

export class GetLinkedMattersForContactSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTER_COUNT_FOR_CONTACT_SUCCESS;
    constructor(public token, public payload: {contact: ContactScreenItemWrapper, matterList: MatterInfo[]}) { super(token); }
}

export class GetLinkedMattersForContactFailed extends TokenizeAction implements Action {
    readonly type = GET_MATTER_COUNT_FOR_CONTACT_FAILED;
    constructor(public token, public payload: {contact: ContactScreenItemWrapper}) { super(token); }
}

export class DeleteContact extends TokenizeAction implements Action {
    readonly type = DELETE_CONTACT;
    constructor(public token, public payload: {contacts: ContactScreenItemWrapper[]}) { super(token); }
}

export class DeleteContactSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_CONTACT_SUCCESS;
    constructor(public token, public payload: {contacts: ContactScreenItemWrapper[]}) { super(token); }
}

export class DeleteContactFailed extends TokenizeAction implements Action {
    readonly type = DELETE_CONTACT_FAILED;
    constructor(public token, public payload: any) { super(token); }
}

export class RemoveContactFromFile extends TokenizeAction implements Action {
    readonly type = REMOVE_CONTACT_FROM_FILE;
    constructor(public token, public payload: {appId: string, branchId: string,
        fileId: string, roleID: string, contacts: ContactScreenItemWrapper[]}) { super(token); }
}

export class RemoveContactFromFileSuccess extends  TokenizeAction implements Action {
    readonly type = REMOVE_CONTACT_FROM_FILE_SUCCESS;
    constructor(public token, public payload: { contacts: ContactScreenItemWrapper[] }) { super(token); }
}

export class RemoveContactFromFileFailed extends  TokenizeAction implements Action {
    readonly type = REMOVE_CONTACT_FROM_FILE_FAILED;
    constructor(public token, public payload: any) { super(token); }
}

export class UnlinkContact extends TokenizeAction implements Action {
    readonly type = UNLINK_CONTACT;
    constructor(public token, public payload: {contactId: string}) { super(token); }
}

export class UnlinkContactSuccess extends TokenizeAction implements Action {
    readonly type = UNLINK_CONTACT_SUCCESS;
    constructor(public token, public payload: {contactId: string}) { super(token); }
}

export class UnlinkContactFailed extends TokenizeAction implements Action {
    readonly type = UNLINK_CONTACT_FAILED;
    constructor(public token, public payload: any) { super(token); }
}

export class SaveContactSearchFields extends TokenizeAction implements Action {
    readonly type = SAVE_CONTACT_SEARCH_FIELDS;
    constructor(public token, public payload: any) { super(token); }
}

export class SaveContactSearchFieldsSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_CONTACT_SEARCH_FIELDS_SUCCESS;
    constructor(public token, public payload: {defaultFields: ContactFieldDef[], mappedFields: ContactFieldDef[]}) { super(token); }
}

export class SaveContactSearchFieldsFailed extends TokenizeAction implements Action {
    readonly type = SAVE_CONTACT_SEARCH_FIELDS_FAILED;
    constructor(public token, public payload: any) { super(token); }
}

export class SearchFieldConfigChanged extends TokenizeAction implements Action {
    readonly type = SEARCH_FIELD_CONFIG_CHANGED;
    constructor(public token, public payload: {searchField: ContactFieldDef}) { super(token); }
}

export class SearchFieldDiscardChanges extends TokenizeAction implements Action {
    readonly type = SEARCH_FIELD_DISCARD_CHANGES;
    constructor(public token, public payload: any) { super(token); }
}

/*export class InitContactsOnFileSearchScreen extends TokenizeAction implements Action {
    readonly type = INIT_CONTACTS_ON_FILE_SEARCH_SCREEN;
    constructor(public token: string, public payload: { matterInfo: MatterInfo, searchAction: ContactSearchAction}) {
        super(token);
    }
}

export class InitConfigureSearchFieldsScreen extends TokenizeAction implements Action {
    readonly type = INIT_CONFIGURE_SEARCH_FIELDS_SCREEN;
    constructor(public token: string, public payload: { matterInfo: MatterInfo, searchAction: ContactSearchAction}) {
        super(token);
    }
}*/

/*export class InitContactScreen extends TokenizeAction implements Action {
    readonly type = INIT_CONTACT_SCREEN;
    constructor(public token: string, public payload: { columnDef: ColumnDef[],
         matterInfo: MatterInfo}) {
         super(token); }
}*/
export class ContactScreenViewChange extends TokenizeAction implements Action {
    readonly type = CONTACT_SCREEN_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}

export class ContactScreenGridChange extends TokenizeAction implements Action {
    readonly type = CONTACT_SCREEN_GRID_CHANGE;
    constructor(public token: string, public payload: { kind: GridChangeKind, value: any }) { super(token); }
}

export class ContactScreenRefresh extends TokenizeAction implements Action {
    readonly type = CONTACT_SCREEN_REFRESH;
    constructor(public token: string, public payload: any) { super(token); }
}

export class ContactScreenGridRowChange extends TokenizeAction implements Action {
    readonly type = CONTACT_SCREEN_GRID_ROW_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowItemChangeKind,
        row: ContactScreenItem, value: any
    }) { super(token); }
}

export class ResetContactList extends TokenizeAction implements Action {
    readonly type = RESET_CONTACT_LIST;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// export class LoadContactScreenGridData extends TokenizeAction implements Action {
//     readonly type = LOAD_CONTACT_SCREEN_GRID_DATA;
//     constructor(public token: string, public request: ContactListRequest) { super(token); }
// }

// export class LoadContactScreenGridDataSuccess extends TokenizeAction implements Action {
//     readonly type = LOAD_CONTACT_SCREEN_GRID_DATA_SUCCESS;
//     constructor(public token: string, public payload: { response: ContactListResponse, request: ContactListRequest }) {
//         super(token);
//     }
// }
// export class LoadContactScreenGridDataFail extends TokenizeAction implements Action {
//     readonly type = LOAD_CONTACT_SCREEN_GRID_DATA_FAIL;
//     constructor(public token: string, public payload: { ScreenContactList: ContactScreenItem[] }) {
//         super(token);
//     }
// }

// export class LoadContactScreenSearchFields extends TokenizeAction implements Action {
//     readonly type = LOAD_CONTACT_SCREEN_SEARCH_FIELDS;
//     constructor(public token: string, public request: ContactsSearchFieldsRequest) { super(token); }
// }

// export class LoadContactScreenSearchFieldsSuccess extends TokenizeAction implements Action {
//     readonly type = LOAD_CONTACT_SCREEN_SEARCH_FIELDS_SUCCESS;
//     constructor(public token: string, public payload: { response: ContactSearchFieldsReponse, request: ContactsSearchFieldsRequest }) {
//         super(token);
//     }
// }
// export class LoadContactScreenSearchFieldsFail extends TokenizeAction implements Action {
//     readonly type = LOAD_CONTACT_SCREEN_SEARCH_FIELDS_FAIL;
//     constructor(public token: string, public payload: { ScreenContactList: ContactScreenItem[] }) {
//         super(token);
//     }
// }


export type Any = InitContactSearchScreen | LoadContactsWithCurrentState | LoadContactScreenDataWithCurrentState
 | GetContactSearchFields | GetContactFieldsSuccess | GetContactFieldsFailed | SearchContacts
 | ContactScreenGridChange | ContactScreenGridRowChange | ContactScreenRefresh | SearchAllContacts | SearchAllContactsSuccess
 | SearchAllContactsFailed | SearchContactsOnFile | SearchContactsOnFileSuccess | SearchContactsOnFileFailed | GetLinkedMattersForContact
 | GetLinkedMattersForContactSuccess | GetLinkedMattersForContactFailed | DeleteContact | DeleteContactSuccess | DeleteContactFailed
 | RemoveContactFromFile | RemoveContactFromFileSuccess | RemoveContactFromFileFailed | UnlinkContact | UnlinkContactSuccess
 | UnlinkContactFailed | SaveContactSearchFields | SaveContactSearchFieldsSuccess | SaveContactSearchFieldsFailed | SearchFieldConfigChanged
 | SearchFieldDiscardChanges | ContactScreenViewChange | ResetContactList;
