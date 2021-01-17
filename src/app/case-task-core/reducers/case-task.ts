import { PageEvent } from '@angular/material';
import { CaseTaskRequest } from '../models/case-task-request';
import {
    ViewChangeKind,
    RowItemChangeKind
} from '../actions/core';
import { CaseTaskResponse, TaskItemWrapper, GridData, MsgModel, CaseTaskViewState } from '../models/interface';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo } from '../../core/lib/matter';
import { ColumnDef } from '../../core/lib/grid-model';
import {
    clearFilters, applyFieldSort, applyColumnFilter
} from '../../core/lib/grid-helpers';
import * as Core from '../../core/lib/actions';


export interface CaseTaskGridView { [hash: string]: CaseTaskViewState; }

export interface CaseTaskState {
    caseTaskData: CaseTaskGridView;
    matterInfo: MatterInfo;
    columnDef: ColumnDef[];
    readonly searchText: string;
    readonly pageEvent: PageEvent;
    readonly checkIsTREnable: boolean;
    readonly completeTask: boolean;
    readonly msg: MsgModel;
}


export interface State {
    views: {
        [token: string]: CaseTaskState;
    };
}
function initView(state: CaseTaskState, action: Actions.InitCaseTask): Partial<CaseTaskState> {
    if (!state) {
        return {
            searchText: '', caseTaskData: {},
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

function viewChange(state: CaseTaskState, action: Actions.CaseTaskViewChange): Partial<CaseTaskState> {

    // const caseTaskData = caseTaskListItemCollapsedALL(state, action.token);
    switch (action.payload.kind) {
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseTaskData: caseTaskData,
            };
        case ViewChangeKind.PageEvent:
            return {
                ...state,
                pageEvent: action.payload.value,
                // caseTaskData: caseTaskData,
            };
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state,
                columnDef: applyColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseTaskData: caseTaskData,
            };

        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // caseTaskData: caseTaskData,
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
                //  caseTaskData: caseTaskData,
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

function rowChange(state: CaseTaskState, action: Actions.CaseTaskGridRowChange,
    row: TaskItemWrapper, token: string): Partial<CaseTaskState> {

    const caseTaskData = caseTaskListItemsChange(state, action.payload.value, row, token);

    switch (action.payload.kind) {
        case RowItemChangeKind.IsExpand:
            return {
                ...state,
                caseTaskData: caseTaskData
            };
        default: {
            return state;
        }
    }
}

function caseTaskListItemCollapsedALL(state: CaseTaskState, token: string)
    : CaseTaskGridView {
    const tmp = {};
    const hash = createViewhash(state);
    if (state.caseTaskData[hash]) {
        const taskData = state.caseTaskData[hash].data;
        const total = state.caseTaskData[hash].total;
        const newtaskData = Object.freeze(taskData.map((file) => {
            return Object.freeze({ ...file, isExpand: false });
        }));
        tmp[hash] = { data: newtaskData, total: total, loading: false };
    }
    return tmp;
}

function caseTaskListItemsChange(state: CaseTaskState, newValue: number, row: TaskItemWrapper, token: string)
    : CaseTaskGridView {
    const hash = createViewhash(state);
    const taskData = state.caseTaskData[hash].data;
    const tmp = {};
    const newtaskData = Object.freeze(taskData.map((file) => {
        if (file.data === row.data) {
            return Object.freeze({ ...file, isExpand: !file.isExpand });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { data: newtaskData, total: state.caseTaskData[hash].total, loading: false };
    return tmp;
}


const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any | Core.Any): State {

    const tmp = {};
    switch (action.type) {
        case Actions.INIT_CASE_TASK:
            tmp[action.token] = initView(state.views[action.token], action);
            console.log('reducer' + Actions.INIT_CASE_TASK);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CASE_TASK_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Core.MENU_TAB_CLOSE:
            const token = 'InitCaseTask' + action.payload.item.data.matterReferenceNo;
            const newViews = { ...state.views };
            delete newViews[token];
            return { ...state, views: { ...newViews } };

        case Actions.LOAD_CASE_TASK_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CASE_TASK_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = caseTaskyLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_CASE_TASK_GRID_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ caseTaskData: { data: [], total: null, loading: true } } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.CASE_TASK_REFRESH:
            tmp[action.token] = { ...state.views[action.token], ...{ caseTaskData: { data: [], total: null, loading: true } } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CASE_TASK_GRID_ROW_CHANGE:
            tmp[action.token] = rowChange(state.views[action.token], action, action.payload.row, action.token);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.CASE_TASK_CHECK_TIME_RECORDED_ENABLE:
            tmp[action.token] = checkTREnable(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CASE_TASK_CHECK_TIME_RECORDED_ENABLE_SUCCESS:
            tmp[action.token] = checkTREnableSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CASE_TASK_CHECK_TIME_RECORDED_ENABLE_FAIL:
            tmp[action.token] = checkTREnableFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CASE_TASK_SHOW_MSG:
            tmp[action.token] = showMsg(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CASE_TASK_REQUEST_TO_COMPLETE:
            tmp[action.token] = removeMsg(state[action.token], action);
            return { ...state, ...tmp };

        default:
            { return state; }
    }
}
function checkTREnable(state: CaseTaskState, action: Actions.CheckTREnabaleCase): Partial<CaseTaskState> {
    return { ...state, checkIsTREnable: true };
}

function checkTREnableSuccess(state: CaseTaskState, action: Actions.CheckTREnabaleSuccessCase): Partial<CaseTaskState> {
    return {
        ...state,
        // gridData: setIsTREnable(state.gridData, action.payload.isEnable, action.payload.row.matterReferenceNo),
        checkIsTREnable: false
    };
}
function checkTREnableFail(state: CaseTaskState, action: Actions.CheckTREnabaleFailCase): Partial<CaseTaskState> {
    return { ...state, checkIsTREnable: false };
}

function showMsg(state: CaseTaskState, action: Actions.ShowMsg): Partial<CaseTaskState> {
    return { ...state, msg: action.payload.msgModel };
}

function removeMsg(state: CaseTaskState, action: Actions.RequestToComplete): Partial<CaseTaskState> {
    return { ...state, msg: null };
}

function setIsTREnable(gridData: GridData[], value: boolean, matterRef: string): GridData[] {
    return gridData.map(row => {
        if (row.matterReferenceNo === matterRef) {
            return Object.freeze({ ...row, isTimeRecordingEnabled: value, checkTREnable: true });
        } else {
            return row;
        }
    });
}
///////////

// tslint:disable-next-line:max-line-length
function caseTaskyLoadSuccess(state: CaseTaskState, response: CaseTaskResponse, request: CaseTaskRequest): Partial<CaseTaskState> {
    const newCaseTaskListData = [{ request, response }].reduce((accu, item) => {
        const data: TaskItemWrapper[] = item.response.data.data.map((_item, i) => ({
            data: _item,
            documentUrl: null,
            documentUrlIsLoading: null,
            documentUrlLoadSuccess: null,
            isExpand: i === 0 ? true : false
        }));
        accu[item.request.hash] = { data: data, loading: false, total: item.response.data.total };
        return accu;
    }, { ...state.caseTaskData });
    return { ...state, caseTaskData: newCaseTaskListData, };
}


function preLoadData(state: CaseTaskState, request: CaseTaskRequest) {
    const newCaseTaskListData = [{ request }].reduce((accu, item) => {
        accu[item.request.hash] = { data: [], total: null, loading: true };
        return accu;
    }, { ...state.caseTaskData });
    return { ...state, caseTaskData: newCaseTaskListData, };
}

function createViewhash(state: CaseTaskState) {
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

export const getViews = (state: State) => {
    return state.views;
};
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getCaseTaskListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.caseTaskData;
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
export const getCaseTaskPageEventByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.pageEvent;
    }
});
export const getCaseTaskGridDataByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        if (state) {
            return state.caseTaskData[hash];
        }
    });
export const getIsDataLoadedByToken = (token) => createSelector(getCurrentHashByToken(token),
    getCaseTaskListByToken(token), (hash, gridViews) => {
        return gridViews && gridViews[hash] !== undefined;
    });




