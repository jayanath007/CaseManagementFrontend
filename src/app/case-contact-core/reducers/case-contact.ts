

import { PageEvent } from '@angular/material';
import { CaseContactRequest, MainContactRequest } from '../models/case-contact-request';
import {
    ViewChangeKind,
    RowItemChangeKind
} from '../actions/core';
import {
    CaseContactResponse, ContactItemWrapper, CaseContact, ContactMode
} from '../models/interface';

import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';
import {
    clearFilters, applyFieldSort, applyColumnFilter, createDefultColumnDef
} from '../../core/lib/grid-helpers';
import * as Core from '../../core/lib/actions';
import { ScreensContactType } from '../../open-case-core/models/interface';
export interface CaseContactGridView { [hash: string]: CaseContactViewState; }



export interface CaseContactState {
    caseContactData: CaseContactGridView;
    readonly screensContactTypeList: CaseContact[];
    matterInfo: MatterInfo;
    columnDef: ColumnDef[];
    readonly searchText: string;
    readonly pageEvent: PageEvent;
    readonly fromContact: boolean;
    readonly contactMode: ContactMode;
}

export interface CaseContactViewState {
    data: ContactItemWrapper[];
    total: number;
    loading: boolean;
}

export interface State {
    views: {
        [token: string]: CaseContactState;
    };
}



export function reducer(state: State = initialState, action: Actions.Any | Core.Any): State {

    const tmp = {};
    switch (action.type) {
        case Actions.INIT_CASE_CONTACT:
            tmp[action.token] = initView(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CASE_CONTACT_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Core.MENU_TAB_CLOSE:
            const token = 'InitCaseContact' + action.payload.item.data.matterReferenceNo;
            const newViews = { ...state.views };
            delete newViews[token];
            return { ...state, views: { ...newViews } };
        case Actions.LOAD_CASE_CONTACT_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CASE_CONTACT_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = caseContactyLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request, action.payload.contactTypeResponse);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CASE_CONTACT_REFRESH:
            tmp[action.token] = { ...state.views[action.token], ...{ caseContactData: { data: [], total: null, loading: false } } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CASE_CONTACT_GRID_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ caseContactData: { data: [], total: null, loading: false } } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.CASE_CONTACT_MODE_CHANGE:

            const columnDef = getColums(action.payload.value);

            tmp[action.token] = { ...state.views[action.token], ...{ contactMode: action.payload.value, columnDef: columnDef } };
            return { ...state, views: { ...state.views, ...tmp } };

        default:
            { return state; }
    }
}



function initView(state: CaseContactState, action: Actions.InitCaseContact): Partial<CaseContactState> {
    if (!state) {
        const columnDef = getColums(ContactMode.View);
        return {
            searchText: action.payload.searchText,
            caseContactData: {},
            pageEvent: { pageSize: 25, pageIndex: 0, length: 0 },
            matterInfo: action.payload.matterInfo,
            columnDef: columnDef,
            fromContact: action.payload.fromContact,
            contactMode: ContactMode.View,
        };
    }
    return state;
}


function getColums(contactMode) {
    let columnDef = [];
    if (contactMode === ContactMode.View) {

        columnDef = [
            createDefultColumnDef('RoleOnFile', { label: 'Role on Case', fxFlex: '12', filterAnchor: 'end' }),
            createDefultColumnDef('Name ', { label: 'Name', fxFlex: '12', filterAnchor: 'start' }),
            createDefultColumnDef('Company', { label: 'Company', fxFlex: '12', filterAnchor: 'start' }),
            createDefultColumnDef('Telephone', { label: 'Telephone', fxFlex: '100px', filterAnchor: 'start' }),
            createDefultColumnDef('Email', { label: 'Email', fxFlex: '180px', filterAnchor: 'end' }),
            createDefultColumnDef('PostCode', { label: 'Postcode', fxFlex: '90px', filterAnchor: 'end' }),
            createDefultColumnDef('Address', { label: 'Address', fxFlex: '', filterAnchor: 'end' }),
        ];



    } else {
        columnDef = [
            createDefultColumnDef('RoleOnFile', { label: 'Role on Case', fxFlex: '12', filterAnchor: 'end' }),
            createDefultColumnDef('Name ', {
                label: 'Name', fxFlex: '12', filterAnchor: 'start', filterHidden: true
                , disableShort: true
            }),
            createDefultColumnDef('Company', {
                label: 'Company', fxFlex: '12', filterAnchor: 'start', filterHidden: true
                , disableShort: true
            }),
            createDefultColumnDef('Telephone', {
                label: 'Telephone', fxFlex: '100px', filterAnchor: 'start',
                filterHidden: true
                , disableShort: true
            }),
            createDefultColumnDef('Email', {
                label: 'Email', fxFlex: '180px', filterAnchor: 'end', filterHidden: true
                , disableShort: true
            }),
            createDefultColumnDef('PostCode', {
                label: 'Postcode', fxFlex: '90px', filterAnchor: 'end', filterHidden: true
                , disableShort: true
            }),
            createDefultColumnDef('Address', {
                label: 'Address', fxFlex: '', filterAnchor: 'end', filterHidden: true
                , disableShort: true
            }),
        ];
    }
    return columnDef;
}

function paginatorChange(pagerDef: PageEvent): PageEvent {
    return {
        ...pagerDef,
        pageIndex: pagerDef.pageIndex,
        pageSize: pagerDef.pageSize
    };
}

function viewChange(state: CaseContactState, action: Actions.CaseContactViewChange): Partial<CaseContactState> {

    // const caseContactData = caseContactListItemCollapsedALL(state, action.token);
    switch (action.payload.kind) {
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
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
                columnDef: applyColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseContactData: caseContactData,
            };

        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseContactData: caseContactData,
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
                // caseContactData: caseContactData,
            };
        default: {
            return state;
        }
    }
}


function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def);
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

function rowChange(state: CaseContactState, action: Actions.CaseContactGridRowChange,
    row: ContactItemWrapper, token: string): Partial<CaseContactState> {

    const caseContactData = caseContactListItemsChange(state, action.payload.value, row, token);

    switch (action.payload.kind) {
        case RowItemChangeKind.IsExpand:
            return {
                ...state,
                caseContactData: caseContactData
            };
        default: {
            return state;
        }
    }
}



function caseContactListItemCollapsedALL(state: CaseContactState, token: string)
    : CaseContactGridView {
    const tmp = {};
    const hash = createViewhash(state);
    if (state.caseContactData[hash]) {
        const taskData = state.caseContactData[hash].data;
        const total = state.caseContactData[hash].total;
        const newtaskData = Object.freeze(taskData.map((file) => {
            return Object.freeze({ ...file, isExpand: false });
        }));
        tmp[hash] = { data: newtaskData, total: total, loading: false };
    }
    return tmp;
}


function caseContactListItemsChange(state: CaseContactState, newValue: number, row: ContactItemWrapper, token: string)
    : CaseContactGridView {
    const hash = createViewhash(state);
    const taskData = state.caseContactData[hash].data;
    const tmp = {};
    const newtaskData = Object.freeze(taskData.map((file) => {
        if (file.data === row.data && !row.isExpand) {
            return Object.freeze({ ...file, isExpand: true });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { data: newtaskData, total: state.caseContactData[hash].total, loading: false };
    return tmp;
}


const initialState: State = { views: {} };



// tslint:disable-next-line:max-line-length
function caseContactyLoadSuccess(state: CaseContactState, response: CaseContactResponse,
    request: CaseContactRequest | MainContactRequest, contactTypeResponse: any): Partial<CaseContactState> {

    const screenContactItemList = screensContactTypeConvertToCaseContact(contactTypeResponse);

    if (response && !response.data) {
        response = {
            ...response, data: {
                data: [],
                total: 0
            }
        };
    }

    const newCaseContactListData = [{ request, response }].reduce((accu, item) => {
        const data: ContactItemWrapper[] = sortAndMapWithScreenContactListData(item.response.data.data, screenContactItemList, request);
        accu[item.request.hash] = { data: data, loading: false, total: item.response.data.total };
        return accu;
    }, { ...state.caseContactData });

    return { ...state, caseContactData: newCaseContactListData, screensContactTypeList: screenContactItemList };


}



function sortAndMapWithScreenContactListData(contactItemList: CaseContact[], screenContactItemList: CaseContact[],
    request: CaseContactRequest | MainContactRequest) {


    const filterContactList = [];
    // if (request.dataSourceInfo.filter) {

    //     const filterContactList = [];

    //     contactItemList.forEach((item) => {
    //         if (screenContactItemList.filter(p => p.screenTitle === item.TypeDescription)) {
    //             filterContactList.push(item);
    //         }
    //     });

    //     concatCaseContact = filterContactList.concat(contactItemList);
    // } else {
    //     concatCaseContact = screenContactItemList.concat(contactItemList);
    // }

    screenContactItemList.forEach((item) => {
        if (contactItemList.filter(p => (p.contactTypeId === item.contactTypeId) && +p.screenId !== 0 /* has scree id*/).length === 0) {
            filterContactList.push(item);
        }
    });

    const concatCaseContact = filterContactList.concat(contactItemList);

    if (request && request.dataSourceInfo && request.dataSourceInfo.sort &&
        request.dataSourceInfo.sort[0].dir && request.dataSourceInfo.sort[0].dir === 'desc') {

        concatCaseContact.sort(function (a, b) {
            if (a.roleOnFile > b.roleOnFile) {
                return -1;
            }
            if (a.roleOnFile < b.roleOnFile) {
                return 1;
            }
            return 0;
        });

    } else {

        concatCaseContact.sort(function (a, b) {
            if (a.roleOnFile < b.roleOnFile) {
                return -1;
            }
            if (a.roleOnFile > b.roleOnFile) {
                return 1;
            }
            return 0;
        });

    }


    return concatCaseContact.map((_item) => ({
        data: _item, isExpand: false,
        documentUrl: null,
        documentUrlIsLoading: null,
        documentUrlLoadSuccess: null
    }));
}


function screensContactTypeConvertToCaseContact(screenContactList: ScreensContactType[]): CaseContact[] {
    const screenContactItemList: CaseContact[] = screenContactList.map((item) => {
        return {
            contactId: 0,
            roleOnFile: item.roleOnFile,
            screenId: item.screenId,
            isScreenContact: true,
            contactTypeId: item.contactTypeId,
        };
    });
    return screenContactItemList;
}







function preLoadData(state: CaseContactState, request: CaseContactRequest | MainContactRequest) {
    const newCaseContactListData = [{ request }].reduce((accu, item) => {
        accu[item.request.hash] = { data: [], total: null, loading: true };
        return accu;
    }, { ...state.caseContactData });
    return { ...state, caseContactData: newCaseContactListData };
}

function createViewhash(state: CaseContactState) {
    if (state) {
        let hash;
        if (!state.fromContact) {
            hash = state.searchText + '/'
                + state.pageEvent.pageSize + '/'
                + state.pageEvent.pageIndex + '/'
                + state.matterInfo.AppCode + '/'
                + state.matterInfo.AppId + '/'
                + state.matterInfo.BranchId + '/'
                + state.matterInfo.MatterReferenceNo + '/'
                + state.matterInfo.FileId + '/'
                + JSON.stringify(state.columnDef.map((data) => JSON.stringify((data.filter ? data.filter : null)))) + '/'
                + JSON.stringify(state.columnDef.map((item) => JSON.stringify((item.sort ? item.sort.dir : null))));
        } else {
            hash = state.searchText + '/'
                + state.pageEvent.pageSize + '/'
                + state.pageEvent.pageIndex + '/'
                + JSON.stringify(state.columnDef.map((data) => JSON.stringify((data.filter ? data.filter : null)))) + '/'
                + JSON.stringify(state.columnDef.map((item) => JSON.stringify((item.sort ? item.sort.dir : null))));
        }

        return hash;
    }
}

export const getViews = (state: State) => {
    return state.views;
};
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getCaseContactListByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.caseContactData;
    }
}
);
export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash);
export const getColumnDefByToken = (token) => createSelector(getViewByToken(token), (view) => {
    if (view) {
        return view.columnDef;
    }
});
export const getSearchTextByToken = (token) => createSelector(getViewByToken(token), (state) => state.searchText);
export const getCaseContactPageEventByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.pageEvent;
    }
});
export const getCaseContactGridDataByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        if (state) {
            return state.caseContactData[hash];
        }
    });
export const getIsDataLoadedByToken = (token) => createSelector(getCurrentHashByToken(token),

    getCaseContactListByToken(token), (hash, gridViews) => {
        return gridViews && gridViews[hash] !== undefined;
    });

export const getScreensContactTypeListByToken = (token) => createSelector(getViewByToken(token), (view) => {
    if (view) {
        return view.screensContactTypeList;
    }
});

export const getContactModeByToken = (token) => createSelector(getViewByToken(token), (view) => {
    if (view) {
        return view.contactMode;
    }
});
