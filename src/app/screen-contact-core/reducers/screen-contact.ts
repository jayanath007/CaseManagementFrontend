import { forEach } from '@angular/router/src/utils/collection';

import { element } from 'protractor';
import { ColumnDef } from '../../core/lib/grid-model';
import { request } from 'https';
import { ContactScreenState} from './screen-contact';
import { PageEvent } from '@angular/material';
import { Utilities } from '../../screen-view-core/models/utilities';
import {
    GridChangeKind,
    RowItemChangeKind,
    ViewChangeKind
} from '../actions/core';
import {
    ContactScreenItemWrapper, ContactSearchType, ContactFieldDef, ItemSelectionViewModel

} from '../models/interface';

import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo, Matter } from '../../core/lib/matter';
import {
    getDefualtFilter, getPaginatorSkip, toODataFilter, toODataSort,
    createColumnDefHash, clearFilters, createDefultColumnDef
} from '../../core/lib/grid-helpers';
import { Filter, Condition, Logic, FieldType, Operator, SortDirections } from '../../odata';
import { Observable } from 'rxjs';
import { IScreenDefinition } from '../../screen-view-core/models/screen-definition';



export interface ContactScreenPagingViewState {
    contactList: ContactScreenItemWrapper[];
    total: number;
    dataLoading: boolean;
}

export interface ContactScreenGridState { [hash: string]: ContactScreenPagingViewState; }

export interface ContactScreenState {
    gridData: ContactScreenGridState;
    matterDetails: Matter;
    screenDefinition: IScreenDefinition;
    searchType: ContactSearchType;
    defaultFields: ContactFieldDef[];
    mappedFields: ContactFieldDef[];
    loading: boolean;
    readonly searchText: string;
    readonly searchField: string;
    readonly searchFieldValue: string;
    readonly pageEvent: PageEvent;
    numberOfContactsInFile: number;
}

export interface State {
    views: {
        [token: string]: ContactScreenState;
    };
}

function initView(state: ContactScreenState, action: Actions.InitContactSearchScreen): Partial<ContactScreenState> {
    if (!state || state.searchType !== action.payload.searchType) {
        return {
            searchText: '',
            searchFieldValue: '',
            searchField: action.payload.searchField,
            gridData: { },
            pageEvent: { pageSize: 10, pageIndex: 0, length: 0 },
            matterDetails: action.payload.matterDetails,
            screenDefinition: action.payload.screenDefinition,
            searchType: action.payload.searchType,
            defaultFields: [],
            mappedFields: [],
            loading: false
        };
    } else {
        return state;
    }
}

const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any): State {

    let tmp: any = {};
    switch (action.type) {

        case Actions.INIT_CONTACT_SEARCH_SCREEN:
            tmp[action.token] = initView(state.views[action.token], <Actions.InitContactSearchScreen>action);
            console.log('reducer' + Actions.INIT_CONTACT_SEARCH_SCREEN);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_CONTACT_SEARCH_FIELDS:
            tmp[action.token] = {...state.views[action.token], loading: true};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.GET_CONTACT_SEARCH_FIELDS_SUCCESS:
            tmp[action.token] = {
                ...state.views[action.token],
                defaultFields: setDefaultsToSearchHeaderFields(action.payload.defaultFields, false),
                mappedFields: setDefaultsToSearchHeaderFields(action.payload.mappedFields, true),
                loading: false
            };
            return {...state, views: {...state.views, ...tmp}};
        case Actions.GET_CONTACT_SEARCH_FIELDS_FAILED:
            tmp[action.token] = {...state.views[action.token], loading: false};
            return {...state, views: {...state.views,  ...tmp}};
        case Actions.SAVE_CONTACT_SEARCH_FIELDS:
            tmp[action.token] = {...state.views[action.token], loading: true};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.SAVE_CONTACT_SEARCH_FIELDS_SUCCESS:
            tmp[action.token] = {
                ...state.views[action.token],
                defaultFields: action.payload.defaultFields,
                mappedFields: action.payload.mappedFields,
                loading: false
            };
            return {...state, views: {...state.views, ...tmp}};
        case Actions.SAVE_CONTACT_SEARCH_FIELDS_FAILED:
            tmp[action.token] = {...state.views[action.token], loading: false};
            return {...state, views: {...state.views,  ...tmp}};
        case Actions.SEARCH_CONTACTS_ON_FILE:
            tmp = {...state.views[action.token], searchText: action.payload.searchKeyword};
            tmp = populateGridData(tmp, [], true);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.SEARCH_ALL_CONTACTS:
            tmp = {...state.views[action.token], searchText: action.payload.searchKeyword
                , searchField: action.payload.searchField, searchFieldValue: action.payload.searchFieldValue};
            tmp = populateGridData(tmp, [], true);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.SEARCH_CONTACTS_ON_FILE_SUCCESS:
        case Actions.SEARCH_ALL_CONTACTS_SUCCESS:
            tmp = populateGridData(state.views[action.token], action.payload.contactList, false);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.SEARCH_CONTACTS_ON_FILE_FAILED:
        case Actions.SEARCH_ALL_CONTACTS_FAILED:
            tmp = populateGridData(state.views[action.token], [], false);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.DELETE_CONTACT:
            tmp[action.token] = {...state.views[action.token], loading: true};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.DELETE_CONTACT_SUCCESS:
            const newContactsArr = deleteContact(state.views[action.token], action.payload.contacts);
            tmp = populateGridData(state.views[action.token], newContactsArr, false);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.DELETE_CONTACT_FAILED:
            tmp[action.token] = {...state.views[action.token], loading: false};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.GET_MATTER_COUNT_FOR_CONTACT:
            tmp[action.token] = {...state.views[action.token], loading: true};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.GET_MATTER_COUNT_FOR_CONTACT_SUCCESS:
            tmp = setMatterCountForSelectedContact(state, action.token, action.payload);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.GET_MATTER_COUNT_FOR_CONTACT_FAILED:
            tmp[action.token] = {...state.views[action.token], loading: false};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.CONTACT_SCREEN_GRID_CHANGE:
            console.log('reducer: Actions.CONTACT_SCREEN_GRID_CHANGE');
            const contactScreenState = state.views[action.token];
            const hash = createViewhash(contactScreenState);
            const pagingViewState = state.views[action.token].gridData[hash];
             const newPagingViewState = gridChange(pagingViewState, <Actions.ContactScreenGridChange>action);
             const tmpGridData = {};
             tmpGridData[hash] = {...contactScreenState.gridData[hash], ...newPagingViewState};
             tmp[action.token] = {...contactScreenState, gridData: tmpGridData};
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CONTACTS_WITH_CURRENT_STATE:
        case Actions.LOAD_CONTACT_SCREEN_DATA_WITH_CURRENT_STATE:
                return state;
        case Actions.REMOVE_CONTACT_FROM_FILE:
            console.log('REMOVE_CONTACT_FROM_FILE');
            tmp[action.token] = {...state.views[action.token], loading: true};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.REMOVE_CONTACT_FROM_FILE_SUCCESS:
            console.log('REMOVE_CONTACT_FROM_FILE_SUCCESS');
            tmp = removeContactsFromFile(state, action.token, action.payload.contacts);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.REMOVE_CONTACT_FROM_FILE_FAILED:
            console.log('REMOVE_CONTACT_FROM_FILE_FAILED');
            tmp[action.token] = {...state.views[action.token], loading: false};
            return {...state, views: {...state.views, ...tmp}};
        case Actions.SEARCH_FIELD_CONFIG_CHANGED:
            console.log('SEARCH_FIELD_CONFIG_CHANGED');
            tmp = applySearchFieldChanges(state.views[action.token], action.payload.searchField);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.SEARCH_FIELD_DISCARD_CHANGES:
            console.log('SEARCH_FIELD_DISCARD_CHANGES');
            tmp = discardSearchFieldChanges(state.views[action.token]);
            return {...state, views: {...state.views, [action.token]: tmp}};
        case Actions.CONTACT_SCREEN_VIEW_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.UNLINK_CONTACT_SUCCESS:
        console.log('UNLINK_CONTACT_SUCCESS');
            if (state.views[action.token]) {
                tmp = removeContactFromFileById(state, action.token, action.payload.contactId);
                return {...state, views: {...state.views, [action.token]: tmp}};
             }
             return state;
        case Actions.RESET_CONTACT_LIST:
            if (state) {
                tmp[action.token] = {...state.views[action.token], gridData: {}};
                return {...state, views: {...state.views, ...tmp}};
            }
            break;
        default:
            { return state; }
    }
}

function viewChange(state: ContactScreenState, action: Actions.ContactScreenViewChange): Partial<ContactScreenState> {

    // const caseContactData = caseContactListItemCollapsedALL(state, action.token);
    switch (action.payload.kind) {
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
                // aseContactData: caseContactData,
            };
        case ViewChangeKind.PageEvent:
            return {
                ...state,
                pageEvent: action.payload.value,
               // caseContactData: caseContactData,
            };
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state,
                defaultFields: applyColumnFilter(state.defaultFields, action.payload.value as ContactFieldDef),
                mappedFields: applyColumnFilter(state.mappedFields, action.payload.value as ContactFieldDef),
                // caseContactData: caseContactData,
            };

        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                defaultFields: clearColumnFilter(state.defaultFields, action.payload.value as ContactFieldDef),
                mappedFields: clearColumnFilter(state.mappedFields, action.payload.value as ContactFieldDef),
                // caseContactData: caseContactData,
            };
        // case ViewChangeKind.ToggleFieldSort:
        //     return {
        //         ...state,
        //         columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
        //         // caseContactData: caseContactData,
            // };
        default: {
            return state;
        }
    }
}

function setDefaultsToSearchHeaderFields(searchFields: ContactFieldDef[], mappedField: boolean): ContactFieldDef[] {
    return searchFields.map( searchField => {
        const extras = {
                    ...searchField.extras,
                    label: searchField.screenLabel,
                    hidden: false,
                    filterAnchor: 'start',
                    fxFlex: '1',
                    filterHidden: true
                };
        const defaultColumnDef = createDefultColumnDef(searchField.screenLabel, extras);
        return <ContactFieldDef>{
            ...defaultColumnDef,
            ...searchField,
            modified: false,
            checked: searchField.showSearch, // checkbox checked in header configuer grid
            mappedField: mappedField
        };
    });
}

function applySearchFieldChanges(state: ContactScreenState, fieldDef: ContactFieldDef): ContactScreenState {
    let searchFields: ContactFieldDef[];
    if (fieldDef.mappedField) {
        searchFields = state.mappedFields;
    } else {
        searchFields = state.defaultFields;
    }

    const modifiedSearchFields = searchFields.map(searchField => {
        if (searchField.contactField !== fieldDef.contactField) {
            return searchField;
        } else {
            return fieldDef;
        }
    });
    if (fieldDef.mappedField) {
        return {...state, mappedFields: modifiedSearchFields};
    } else {
        return {...state, defaultFields: modifiedSearchFields};
    }
}

function discardSearchFieldChanges(state: ContactScreenState) {
    const defaultFields = state.defaultFields.map(searchField => {
        if (!searchField.modified) {
            return searchField;
        } else {
            return {...searchField, modified: false, checked: searchField.showSearch};
        }
    });

    const mappedFields = state.mappedFields.map(searchField => {
        if (!searchField.modified) {
            return searchField;
        } else {
            return {...searchField, modified: false, checked: searchField.showSearch};
        }
    });
    return {...state, defaultFields: defaultFields, mappedFields: mappedFields};
}

function populateGridData(state: ContactScreenState, contactList: ContactScreenItemWrapper[], loading: boolean,
    pagingHash = createViewhash(state)): ContactScreenState {
    const pagingViewState = {
        contactList: contactList,
        total: contactList.length,
        dataLoading: loading
    };
    const newScreenContactGridState = [{ pagingViewState }].reduce((accu, item) => {
        accu[pagingHash] = item.pagingViewState;
        return accu;
    }, { ...state.gridData });
    return {
        ...state, gridData: newScreenContactGridState,
        pageEvent: {...state.pageEvent, pageIndex: 0, length: contactList.length}
    };
}

function deleteContact(state: ContactScreenState, contactsToDelete: ContactScreenItemWrapper[]): ContactScreenItemWrapper[] {
    const pagingHash = createViewhash(state);
    const originalContactList = state.gridData[pagingHash].contactList;
    return contactsToDelete.reduce((accu, contactToDelete) => {
        return accu.filter((contact) => contact.contactId !== contactToDelete.contactId);
    }, originalContactList);
}

function getCurrentPagingView(state: any, token: string): ContactScreenPagingViewState {
    const contactScreenState = state.views[token];
    const hash = createViewhash(contactScreenState);
   return state.views[token].gridData[hash];
}

function setMatterCountForSelectedContact(state: any, token: string,
    payload: any): ContactScreenState {
        const pagingViewState = getCurrentPagingView(state, token);
        const modifiedContacts = pagingViewState.contactList.map( contact => {
            if (contact.contactId !== payload.contact.contactId) {
                return contact;
            } else {
                return {...contact, matterCount: payload.matterList.length};
            }});
        return populateGridData(state.views[token], modifiedContacts, false);
}

function removeContactFromFileById(state: any, token: string, contactId: string): ContactScreenState {
    const pagingViewState = getCurrentPagingView(state, token);
    if (pagingViewState) {
        const contactList = pagingViewState.contactList.filter(contact => contact.contactId.toString() !== contactId);
        return populateGridData(state.views[token], contactList, false);
    }
}

function removeContactsFromFile(state: any, token: string, contactsToRemove: ContactScreenItemWrapper[]): ContactScreenState {
    const pagingViewState = getCurrentPagingView(state, token);
    if (pagingViewState) {
        const remainingContacts = contactsToRemove.reduce((accu, contactToDelete) => {
            return accu.filter((contact) => contact.contactId !== contactToDelete.contactId);
        }, pagingViewState.contactList);
        return populateGridData(state.views[token], remainingContacts, false);
    }
}


// function preLoadData(state: ContactScreenState, request: ContactListRequest) {
//     const newScreenContactGridState = [{ request }].reduce((accu, item) => {
//         accu[item.request.hash] = { contactList: [], total: null, loading: true };
//         return accu;
//     }, { ...state.gridData });
//     return { ...state, screenContactData: newScreenContactGridState, };
// }

// function viewChange(state: ContactScreenState, action: Actions.ContactScreenViewChange): Partial<ContactScreenState> {
//     switch (action.payload.kind) {
//         case ViewChangeKind.IemSelected:
//             const selectedContact = <ItemSelectionViewModel>action.payload.value;
//             console.log('reducer selected contact' + selectedContact);
//             return state;
//         case ViewChangeKind.SearchText:
//             return {
//                 ...state,
//                 searchText: action.payload.value,
//             };
//         case ViewChangeKind.PageEvent:
//             return {
//                 ...state,
//                 pageEvent: action.payload.value,
//             };
//         case ViewChangeKind.ApplyColumnFilter:
//             return {
//                 ...state,
//                 //columnDef: applyColumnFilter(state.columnDef, action.payload.value as ColumnDef),
//             };

        // case ViewChangeKind.ClearColumnFilter:
        //     return {
        //         ...state,
        //         columnDef: clearColumnFilter(state.columnDef, action.payload.value as ColumnDef),
        //     };
        // case ViewChangeKind.ToggleFieldSort:
        //     return {
        //         ...state,
        //         columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
        //     };
//         default: {
//             return state;
//         }
//     }
// }

function gridChange(state: ContactScreenPagingViewState, action: Actions.ContactScreenGridChange): Partial<ContactScreenPagingViewState> {
    switch (action.payload.kind) {
        case GridChangeKind.ItemSelected:
            const selectedContact = <ItemSelectionViewModel>action.payload.value;
            const updatedContacts = applyItemSelection(selectedContact, state.contactList);
            return {...state, contactList: updatedContacts};
        default: {
            return state;
         }
    }
}

function applyColumnFilter(current: ContactFieldDef[], changedDef: ContactFieldDef) {
    const cloneCond = (filters: Condition[]) => filters.map((cond) => ({ ...cond }));
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return {
                ...def, filterActive: true, filter: {
                    ...def.filter,
                    logic: changedDef.filter.logic,
                    filters: cloneCond(changedDef.filter.filters)
                }
            };
        }
        return def;
    });
}

function clearColumnFilter(current: ContactFieldDef[], changedDef: ContactFieldDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def) as ContactFieldDef;
        }
        return def;
    });
}

// function applyFieldSort(current: ColumnDef[], changedDef: ColumnDef) {
//     return current.map((def) => {
//         if (def.fieldName === changedDef.fieldName) {
//             const dir = !!changedDef.sort && changedDef.sort.dir === SortDirections.Asc ? SortDirections.Desc : SortDirections.Asc;
//             return { ...def, sort: { dir: dir, field: changedDef.fieldName } };
//         } else {
//             return { ...def, sort: null };
//         }
//     });
// }


function applyItemSelection(selectedContact: ItemSelectionViewModel, current: ContactScreenItemWrapper[]): ContactScreenItemWrapper[] {
    const contacts = current.map((contact) => {
        if (selectedContact.id === contact.contactId) {
            contact.selected = true;
            contact.matterCount = null;
        } else {
            if (!selectedContact.isMultiSelection) {
                contact.selected = false;
            }
        }
        return {...{}, ...contact};
    });
    return contacts;
}

// function convertAllKeysToUpperCase<T>(obj: T) {
//     let key: any;
//     const keys = Object.keys(obj);
//     let n = keys.length;
//     const newobj = <T>{};
//     while (n--) {
//         key = keys[n];
//         newobj[key.toUpperCase()] = obj[key];
//     }
//     return newobj;
// }
// function rowChange(state: ContactScreenState, action: Actions.ScreenContactGridRowChange,
//     row: ContactScreenItem, token: string): Partial<ContactScreenState> {

//     const screenContactData = screenContactListItemsChange(state, action.payload.value, row, token);

//     switch (action.payload.kind) {
//         case RowItemChangeKind.IsExpand:
//             return {
//                 ...state,
//                 screenContactData: screenContactData
//             };
//         default: {
//             return state;
//         }
//     }
// }


// function screenContactListItemCollapsedALL(state: ContactScreenState, token: string)
//     : ContactScreenGridView {
//     const tmp = {};
//     const hash = createViewhash(state);
//     if (state.screenContactData[hash]) {
//         const taskData = state.screenContactData[hash].data;
//         const total = state.screenContactData[hash].total;
//         const newtaskData = Object.freeze(taskData.map((file) => {
//             return Object.freeze({ ...file, isExpand: false });
//         }));
//         tmp[hash] = { data: newtaskData, total: total, loading: false };
//     }
//     return tmp;
// }


// function screenContactListItemsChange(state: ContactScreenState, newValue: number, row: ContactScreenItem, token: string)
//     : ContactScreenGridView {
//     const hash = createViewhash(state);
//     const taskData = state.screenContactData[hash].data;
//     const tmp = {};
//     const newtaskData = Object.freeze(taskData.map((file) => {
//         if (file.data === row.data && !row.isExpand) {
//             return Object.freeze({ ...file, isExpand: true });
//         } else {
//             return Object.freeze({ ...file, isExpand: false });
//         }
//     }));
//     tmp[hash] = { data: newtaskData, total: state.screenContactData[hash].total, loading: false };
//     return tmp;
// }

// function screenContactDataLoadSuccess(state: ContactScreenState, response: ContactListResponse, req: ContactListRequest) {
//     //  const newGridData = [{req, response}].reduce((accu, item) => {
//     //      const data: ContactScreenItem[] = item.response.contactViewModels;
//     //      accu[item.req.hash] = {data: data, loading: false, total: item.response.contactViewModels.length};
//     //      return accu;
//     //  });
//     //  return {...state, gridContainerState: newGridData};
//     const contactScreenItems: ContactScreenItemWrapper[] = response.contactViewModels;
//     const pagingView: ContactScreenPagingViewState = {
//         contactList: contactScreenItems,
//         loading: false,
//         total: contactScreenItems.length
//     };
//     const gridData = {};
//     gridData[req.hash] = pagingView;
//     return {...state, gridData: gridData};
// }

// function contactScreenSearchFieldsLoadSuccess(
//     state: ContactScreenState, response: ContactSearchFieldsReponse, req: ContactsSearchFieldsRequest) {
//         /*const rawFields = [...response.defaultContactFields, ...response.mappedContactFields];
//         const allContactFields = rawFields.map((element) => {
//             const field = createDefultColumnDef(element.contactField,
//                 { label: element.screenLabel, fxFlex: '1 1 auto', filterAnchor: 'start' });
//             field.visible = element.showSearch;
//             return field;
//         });
//         return {...state, columnDef: allContactFields};*/
//         // createDefultColumnDef(element.contactField,
//         //     { label: element.screenLabel, fxFlex: '1 1 auto', filterAnchor: 'start' });
//             // field.visible = element.showSearch;
//         const defaultContactFeilds = response.defaultContactFields.map( (defaultField) =>
//             createDefultContactFieldDef(defaultField, {label: defaultField.screenLabel, fxFlex: '1 1 auto', filterAnchor: 'start', 
//          hidden: })
//         );
//         const mappedContactFeilds = response.mappedContactFields.map( (mappedField) =>
//             createDefultContactFieldDef(mappedField, {label: mappedField.screenLabel, fxFlex: '1 1 auto', filterAnchor: 'start' })
//         );
//         return {...state, defaultFields: defaultContactFeilds, mappedFields: mappedContactFeilds};
// }
// tslint:disable-next-line:max-line-length
// function screenContactyLoadSuccess(state: ContactScreenState, response: ScreenContactResponse, request: ScreenContactRequest): Partial<ContactScreenState> {
//     const newScreenContactListData = [{ request, response }].reduce((accu, item) => {
//         const data: ContactScreenItem[] = item.response.contactViewModels; // .map((_item) => (_item));
//         accu[item.request.hash] = { data: data, loading: false, total: item.response.contactViewModels.length };
//         return accu;
//     }, { ...state.screenContactData });
//     return { ...state, screenContactData: newScreenContactListData, };
// }

function createViewhash(state: ContactScreenState) {
    // const hash =   state.matterDetails.AppId + '/'
    //     + state.matterDetails.BranchId + '/'
    //     + state.matterDetails.FileId + '/'
    //     + state.screenDefinition.screenNumber.toString() + '/'
    //     + state.searchType + '/'
    //     + state.searchField + '/'
    //     + state.searchFieldValue + '/'
    //     + state.searchText + '/';
    // return hash;
    return 'screen_contacts_result'; // not using paging, use temporary static text
}

export const getViews = (state: State) => {
    return state.views;
};

export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});

export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash);

export const getContactScreenGridDataByToken = (token) => createSelector(getViewByToken(token),
     (state) => {
         return state.gridData;
     }
 );

//  export const getIsContactScreenLoadedByToken = (token, searchType) => createSelector(getViewByToken(token), (view) => {
//     if (view) {
//         return view.searchType === searchType;
//     } else {
//         return false;
//     }
//  });

 export const getIsSearchFieldsLoadedByToken = (token) => createSelector(getViewByToken(token), (view) => {
    if (view) {
        const searchFields = [...view.defaultFields, ...view.mappedFields];
        return searchFields.length > 0;
    } else { return false; }
 });

 export const getIsContactListLoadedForCurrentViewByToken =
 (token: string, searchType: ContactSearchType, searchField: string, searchKeyWord: string) =>
  createSelector(getViewByToken(token), getCurrentHashByToken(token), (view, hash) => {
        if (view) {
            let contactCount = 0;
            if (view.gridData[hash]) {
                contactCount = view.gridData[hash].contactList.length;
            }
            return view.searchType === searchType && view.searchField === searchField &&
            (view.searchText === searchKeyWord || view.searchFieldValue === searchKeyWord) && (contactCount > 0);
        } else {
            return false;
        }
     });

export const getMatterInfoByToken = (token) => createSelector(getViewByToken(token), (view) => {
    return view.matterDetails;
});

export const getscreenDefinitionByToken = (token) => createSelector(getViewByToken(token), (view) => {
    return view.screenDefinition;
});

export const getsearchTypeByToken = (token) => createSelector(getViewByToken(token), (view) => {
    return view.searchType;
});

export const getsearchTextByToken = (token) => createSelector(getViewByToken(token), (view) => {
    if (view.searchText) {
        return view.searchText;
    } else {
        return '';
    }
});

export const getsearchFieldByToken = (token) => createSelector(getViewByToken(token), (view) => {
    return view.searchField;
});

export const getsearchFieldValueByToken = (token) => createSelector(getViewByToken(token), (view) => {
    return view.searchFieldValue;
});


export const getVisibleSearchFieldsByToken = (token) => createSelector(getViewByToken(token), (view) => {
    const visibileDefaultFields = view.defaultFields.filter((field) => field.showSearch === true);

    // On: 11/04/2018
    // Bugfix: Reference fields without data showing up in search
    // Utilities.atoi(field.contactField) <= 0
    // applying this condition on getMappedSearchFieldsByToken would
    // have been enough but there are fields already marked visible due to the bug, filter them out anyway
    const visibleMappedFields = view.mappedFields.filter((field) => (field.showSearch === true && Utilities.atoi(field.contactField) <= 0));

    const filteredDefaultFields: ContactFieldDef[] = [];
    visibileDefaultFields.forEach(defaultField => {
        const notFound = visibleMappedFields.filter((mappedField) => mappedField.contactField === defaultField.contactField).length === 0;
        if (notFound) {
            filteredDefaultFields.push(defaultField);
        }
    });

   return  [...filteredDefaultFields, ...visibleMappedFields];
});

export const getDefaultSearchFieldsByToken = (token) => createSelector(getViewByToken(token), (view) => {
    return view.defaultFields;
});

export const getMappedSearchFieldsByToken = (token) => createSelector(getViewByToken(token), (view) => {
    // On: 11/04/2018
    // Bugfix: Reference fields without data showing up in search
    // remove reference fields from mapped fields
    // condition applied on getVisibleSearchFieldsByToken also to hide columns which are already visible
    return view.mappedFields.filter((field) => (Utilities.atoi(field.contactField) <= 0));
});

/// delete following selector and use actor APIs to get proper column mapping
 export const getContactListForCurrentViewByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), getContactScreenPageEventByToken(token), (state, hash, pageEvent) => {
        // fix this properly
        if (!state.gridData[hash]) {
            return [];
        }
        const rawContactList = state.gridData[hash].contactList;
        const start = (pageEvent.pageIndex  * pageEvent.pageSize);
        const end = start + pageEvent.pageSize;
        return rawContactList.slice(start, end);
});

// export const getVisibleColumnDefByToken = (token) => createSelector(getViewByToken(token), (view) => {
//     const visibileDefaultFields = view.defaultFields.filter((field) => field.showSearch === true);
//     const visibleMappedFields = view.mappedFields.filter((field) => field.showSearch === true);
//     const visibleFields =  [...visibileDefaultFields, ...visibleMappedFields];
//     return visibleFields.map((field) => {
//        return  <ColumnDef>{
//             visible: field.showSearch,
//             sort: field.sort,
//             extras: field.extras,
//             fieldName: field.screenLabel,
//             filter: field.filter,
//             filterActive: field.filterActive
//         };
//     });
// });

export const getSelectedContactsByToken = (token) => createSelector(getContactListForCurrentViewByToken(token), (contactList) => {
    return contactList.filter( contact => contact.selected === true);
} );

export const getLinkedMatterCountForSelectedContact = (token) => createSelector(getSelectedContactsByToken(token), selectedContacts => {
    if (selectedContacts.length === 1) {
        return selectedContacts[0].matterCount;
    } else {
        return null;
    }
});

export const getSearchTextByToken = (token) => createSelector(getViewByToken(token), (state) => state.searchText);
export const getContactScreenPageEventByToken = (token) => createSelector(getViewByToken(token), (state) => state.pageEvent);

export const getIsLoading = (token) => createSelector(getViewByToken(token), (view) => {
    return view.loading;
});

export const getIsDataLoadingByToken = (token) => createSelector(getCurrentHashByToken(token),
getContactScreenGridDataByToken(token), (hash, gridState) => {
    const pagingView = gridState[hash];
       if (pagingView) {
            return pagingView.dataLoading;
       }
       return false;
   });

/*function createDefultContactFieldDef(contactField: ContactFieldDef, extras: any = {}, fieldType = FieldType.Text): ContactFieldDef {
    contactField.filterActive = false;
    contactField.filter = getDefualtFilter(contactField.screenLabel, fieldType);
    contactField.extras = extras;
    return contactField;
  }*/




