import { PageEvent } from '@angular/material';
import { CaseTimeRequest } from '../models/case-time-request';
import {
    INIT_CASE_TIME,
    ViewChangeKind,
    RowItemChangeKind
} from '../actions/core';
import {
    CaseTime, CaseTimeResponse, TimeItemWrapper

} from '../models/interface';

import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';
import { applyFieldSort, applyColumnFilter, clearFilters } from '../../core/lib/grid-helpers';
import { Filter, Condition, Logic, FieldType, Operator, SortDirections } from '../../odata';
import * as Core from '../../core/lib/actions';


export interface CaseTimeGridView { [hash: string]: CaseTimeViewState; }

export interface CaseTimeState {
    caseTimeData: CaseTimeGridView;
    matterInfo: MatterInfo;
    columnDef: ColumnDef[];
    readonly searchText: string;
    readonly pageEvent: PageEvent;
}

export interface CaseTimeViewState {
    data: TimeItemWrapper[];
    total: number;
    loading: boolean;
}

export interface State {
    views: {
        [token: string]: CaseTimeState;
    };
}
function initView(state: CaseTimeState, action: Actions.InitCaseTime): Partial<CaseTimeState> {
    if (!state) {
        return {
            searchText: '', caseTimeData: {},
            pageEvent: { pageSize: 25, pageIndex: 0, length: 0 },
            matterInfo: action.payload.matterInfo,
            columnDef: action.payload.columnDef
        };
    }
    return state;
}

function paginatorChange(pagerDef: PageEvent): PageEvent {
    return {
        ...pagerDef,
        pageIndex: pagerDef.pageIndex,
        pageSize: pagerDef.pageSize
    };
}

function viewChange(state: CaseTimeState, action: Actions.CaseTimeViewChange): Partial<CaseTimeState> {

    // const caseTimeData = caseTimeListItemCollapsedALL(state, action.token);
    switch (action.payload.kind) {
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseTimeData: caseTimeData,
            };
        case ViewChangeKind.PageEvent:
            return {
                ...state,
                pageEvent: action.payload.value,
                // caseTimeData: caseTimeData,
            };
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state,
                columnDef: applyColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseTimeData: caseTimeData,
            };

        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseTimeData: caseTimeData,
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
                // caseTimeData: caseTimeData,
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


function rowChange(state: CaseTimeState, action: Actions.CaseTimeGridRowChange,
    row: TimeItemWrapper, token: string): Partial<CaseTimeState> {
    const caseTimeData = caseTimeListItemsChange(state, action.payload.value, row, token);

    switch (action.payload.kind) {
        case RowItemChangeKind.IsExpand:
            return {
                ...state,
                caseTimeData: caseTimeData
            };
        default: {
            return state;
        }
    }
}


function caseTimeListItemCollapsedALL(state: CaseTimeState, token: string)
    : CaseTimeGridView {
    const tmp = {};
    const hash = createViewhash(state);
    if (state.caseTimeData[hash]) {
        const taskData = state.caseTimeData[hash].data;
        const total = state.caseTimeData[hash].total;
        const newtaskData = Object.freeze(taskData.map((file) => {
            return Object.freeze({ ...file, isExpand: false });
        }));
        tmp[hash] = { data: newtaskData, total: total, loading: false };
    }
    return tmp;
}


function caseTimeListItemsChange(state: CaseTimeState, newValue: number, row: TimeItemWrapper, token: string)
    : CaseTimeGridView {
    const hash = createViewhash(state);
    const taskData = state.caseTimeData[hash].data;
    const tmp = {};
    const newtaskData = Object.freeze(taskData.map((file) => {
        if (file.data === row.data && !row.isExpand) {
            return Object.freeze({ ...file, isExpand: true });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { data: newtaskData, total: state.caseTimeData[hash].total, loading: false };
    return tmp;
}


const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any | Core.Any): State {

    const tmp = {};
    switch (action.type) {
        case Actions.INIT_CASE_TIME:
            tmp[action.token] = initView(state.views[action.token], action);
            console.log('reducer' + Actions.INIT_CASE_TIME);
            return { ...state, views: { ...state.views, ...tmp } };

        case Core.MENU_TAB_CLOSE:
            const token = 'InitCaseTime' + action.payload.item.data.matterReferenceNo;
            const newViews = { ...state.views };
            delete newViews[token];
            return { ...state, views: { ...newViews } };
        case Actions.CASE_TIME_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CASE_TIME_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CASE_TIME_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = caseTimeyLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CASE_TIME_REFRESH:
            tmp[action.token] = { ...state.views[action.token], ...{ caseTimeData: { data: [], total: null, loading: true } } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CASE_TIME_GRID_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ caseTimeData: { data: [], total: null, loading: true } } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CASE_TIME_GRID_ROW_CHANGE:
            tmp[action.token] = rowChange(state.views[action.token], action, action.payload.row, action.token);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.DELETE_TIME:
            const timeData = requestDelete(state.views[action.token]);
            tmp[action.token] = { ...state.views[action.token], ...{ caseTimeData: timeData } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.DELETE_TIME_SUCCESS:
            const timeData1 = deleteSuccess(state.views[action.token]);
            tmp[action.token] = { ...state.views[action.token], ...{ caseTimeData: timeData1 } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.DELETE_TIME_FAIL:
            const timeData2 = deleteFail(state.views[action.token]);
            tmp[action.token] = { ...state.views[action.token], ...{ caseTimeData: timeData2 } };
            return { ...state, views: { ...state.views, ...tmp } };

        default:
            { return state; }
    }
}


// tslint:disable-next-line:max-line-length
function caseTimeyLoadSuccess(state: CaseTimeState, response: CaseTimeResponse, request: CaseTimeRequest): Partial<CaseTimeState> {
    const newCaseTimeListData = [{ request, response }].reduce((accu, item) => {
        const data: TimeItemWrapper[] = item.response.data.data.map((_item, i) => ({
            data: _item,
            isExpand: i === 0 ? true : false,
            documentUrl: null,
            documentUrlIsLoading: null,
            documentUrlLoadSuccess: null
        }));
        accu[item.request.hash] = { data: data, loading: false, total: item.response.data.total };
        return accu;
    }, { ...state.caseTimeData });
    return { ...state, caseTimeData: newCaseTimeListData, };
}


function preLoadData(state: CaseTimeState, request: CaseTimeRequest) {
    const newCaseTimeListData = [{ request }].reduce((accu, item) => {
        accu[item.request.hash] = { data: [], total: null, loading: true };
        return accu;
    }, { ...state.caseTimeData });
    return { ...state, caseTimeData: newCaseTimeListData, };
}

function createViewhash(state: CaseTimeState) {

    if (state) {
        const hash = state.searchText + '/'
            + state.pageEvent.pageSize + '/'
            + state.pageEvent.pageIndex + '/'
            + state.matterInfo.AppCode + '/'
            + state.matterInfo.AppId + '/'
            + state.matterInfo.BranchId + '/'
            + state.matterInfo.MatterReferenceNo + '/'
            + state.matterInfo.FileId + '/'
            + JSON.stringify(state.columnDef.map((data) => JSON.stringify((data.filter ? data.filter : null)))) + '/'
            + JSON.stringify(state.columnDef.map((item) => JSON.stringify((item.sort ? item.sort.dir : null))));
        return hash;
    }
}

function requestDelete(state: CaseTimeState): CaseTimeGridView {
    const hash = createViewhash(state);
    const tmp = {};
    tmp[hash] = {
        ...state.caseTimeData[hash],
        loading: true
    };
    return tmp;
}

function deleteSuccess(state: CaseTimeState): CaseTimeGridView {
    const hash = createViewhash(state);
    const tmp = {};
    tmp[hash] = {
        ...state.caseTimeData[hash],
        loading: false
    };
    return tmp;
}

function deleteFail(state: CaseTimeState): CaseTimeGridView {
    const hash = createViewhash(state);
    const tmp = {};
    tmp[hash] = {
        ...state.caseTimeData[hash],
        loading: false
    };
    return tmp;
}

export const getViews = (state: State) => {
    return state.views;
};
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getCaseTimeListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.caseTimeData;
        }
    }
);
export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash);
export const getColumnDefByToken = (token) => createSelector(getViewByToken(token), (view) => {
    if (view) {
        return view.columnDef;
    }
});
export const getSearchTextByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.searchText;
    }
});
export const getCaseTimePageEventByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.pageEvent;
    }
});
export const getCaseTimeGridDataByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        if (state) {
            return state.caseTimeData[hash];
        }
    });
export const getIsDataLoadedByToken = (token) => createSelector(getCurrentHashByToken(token),

    getCaseTimeListByToken(token), (hash, gridViews) => {
        return gridViews && gridViews[hash] !== undefined;
    });




