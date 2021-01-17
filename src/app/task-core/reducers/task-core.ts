import { PageEvent } from '@angular/material';
// import { ItemFilterState } from './../../mail-core/reducers/items';
import { TaskRequest } from '../models/task-core-request';

import {
    INIT_TASK_CORE,
    ViewChangeKind,
    RowItemChangeKind
} from '../actions/core';
import {
    Task, TaskResponse, FileItemWrapper, TaskListItem

} from '../models/interface';

import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo } from '../../core/lib/matter';

export interface TaskGridView { [hash: string]: TaskViewState; }

export interface TaskState {
    TaskData: TaskGridView;
    matterInfo: MatterInfo;
    readonly searchText: string;
    readonly pageEvent: PageEvent;
}

export interface TaskViewState {
    data: FileItemWrapper[];
    total: number;
    loading: boolean;
}

export interface State {
    views: {
        [token: string]: TaskState;
    };
}

function initView(state: TaskState, matterInfo: MatterInfo): Partial<TaskState> {
    if (!state) {
        return { searchText: '', TaskData: {}, pageEvent: { pageSize: 10, pageIndex: 1, length: 0 }, matterInfo: matterInfo };
    }
    return state;
}

function viewChange(state: TaskState, action: Actions.TaskViewChange): Partial<TaskState> {

    //  const TaskData = TaskListItemCollapsedALL(state, action.token);
    switch (action.payload.kind) {
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
                //  TaskData: TaskData,
            };
        case ViewChangeKind.PageEvent:
            return {
                ...state,
                pageEvent: action.payload.value,
               //   TaskData: TaskData,
            };
        default: {
            return state;
        }
    }
}
function rowChange(state: TaskState, action: Actions.TaskGridRowChange,
    row: FileItemWrapper, token: string): Partial<TaskState> {

    const TaskData = TaskListItemsChange(state, action.payload.value, row, token);

    switch (action.payload.kind) {
        case RowItemChangeKind.IsExpand:
            return {
                ...state,
                TaskData: TaskData
            };
        default: {
            return state;
        }
    }
}

function TaskListItemCollapsedALL(state: TaskState, token: string)
    : TaskGridView {
    const hash = createViewhash(state);
    const filesData = state.TaskData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        return Object.freeze({ ...file, isExpand: false });
    }));
    tmp[hash] = { data: newfilesData, total: state.TaskData[hash].total, loading: false };
    return tmp;
}


function TaskListItemsChange(state: TaskState, newValue: number, row: FileItemWrapper, token: string)
    : TaskGridView {
    const hash = createViewhash(state);
    const filesData = state.TaskData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data && !row.isExpand) {
            return Object.freeze({ ...file, isExpand: true });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { data: newfilesData, total: state.TaskData[hash].total, loading: false };
    return tmp;
}


const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any): State {

    const tmp = {};
    switch (action.type) {

        case Actions.INIT_TASK_CORE:
        tmp[action.token] = initView(state.views[action.token], action.matterInfo);
            console.log('reducer' + Actions.INIT_TASK_CORE);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.TASK_CORE_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_TASK_CORE_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_TASK_CORE_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = TaskLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_TASK_CORE_GRID_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ TaskData: { data: [], total: null, loading: true } } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.TASK_CORE_GRID_ROW_CHANGE:

            tmp[action.token] = rowChange(state.views[action.token], action, action.payload.row, action.token);
            return { ...state, views: { ...state.views, ...tmp } };

        default:
            { return state; }
    }
}

function preLoadData(state: TaskState, request: TaskRequest) {
    const newTaskListData = [{ request }].reduce((accu, item) => {
        accu[item.request.hash] = { data: [], total: null, loading: true };
        return accu;
    }, { ...state.TaskData });
    return { ...state, TaskData: newTaskListData, };
}

// tslint:disable-next-line:max-line-length
function TaskLoadSuccess(state: TaskState, response: TaskResponse, request: TaskRequest): Partial<TaskState> {
    const newTaskListData = [{ request, response }].reduce((accu, item) => {
        const data: FileItemWrapper[] = item.response.Data.Data.map((_item) => ({ data: _item, isExpand: false }));
        accu[item.request.hash] = { data: data, loading: false, total: item.response.Data.Total };
        return accu;
    }, { ...state.TaskData });
    return { ...state, TaskData: newTaskListData, };
}

function createViewhash(state: TaskState) {
    const hash = state.searchText + '/' + state.pageEvent.pageSize + '/' + state.pageEvent.pageIndex;
    console.log('hash', hash);
    return hash;
}

export const getViews = (state: State) => {
    return state.views;
};
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getTaskListByToken = (token) => createSelector(getViewByToken(token),
    (fileState) => {
        return fileState.TaskData;
    }
);
export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash);

export const getSearchTextByToken = (token) => createSelector(getViewByToken(token), (state) => state.searchText);
export const getTaskPageEventByToken = (token) => createSelector(getViewByToken(token), (state) => state.pageEvent);
export const getTaskGridDataByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        return state.TaskData[hash];
    });

export const getIsDataLoadedByToken = (token) => createSelector(getCurrentHashByToken(token),
    getTaskListByToken(token), (hash, gridViews) => gridViews && gridViews[hash] !== undefined);




