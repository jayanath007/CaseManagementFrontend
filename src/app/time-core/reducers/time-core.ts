import { PageEvent } from '@angular/material';
// import { ItemFilterState } from './../../mail-core/reducers/items';
import { TimeRequest } from '../models/time-core-request';

import {
    INIT_TIME_CORE,
    ViewChangeKind,
    RowItemChangeKind
} from '../actions/core';
import {
    Time, TimeResponse, TimeItemWrapper, TimeListItem

} from '../models/interface';

import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo } from '../../core/lib/matter';

export interface TimeGridView { [hash: string]: TimeViewState; }

export interface TimeState {
    TimeData: TimeGridView;
    matterInfo: MatterInfo;
    readonly searchText: string;
    readonly pageEvent: PageEvent;
}

export interface TimeViewState {
    data: TimeItemWrapper[];
    total: number;
    loading: boolean;
}

export interface State {
    views: {
        [token: string]: TimeState;
    };
}

function initView(state: TimeState, matterInfo: MatterInfo): Partial<TimeState> {
    if (!state) {
        return { searchText: '', TimeData: {}, pageEvent: { pageSize: 10, pageIndex: 1, length: 0 }, matterInfo: matterInfo };
    }
    return state;
}

function viewChange(state: TimeState, action: Actions.TimeViewChange): Partial<TimeState> {

    //  const TimeData = TimeListItemCollapsedALL(state, action.token);
    switch (action.payload.kind) {
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
               //   TimeData: TimeData,
            };
        case ViewChangeKind.PageEvent:
            return {
                ...state,
                pageEvent: action.payload.value,
                //  TimeData: TimeData,
            };
        default: {
            return state;
        }
    }
}
function rowChange(state: TimeState, action: Actions.TimeGridRowChange,
    row: TimeItemWrapper, token: string): Partial<TimeState> {

    const TimeData = TimeListItemsChange(state, action.payload.value, row, token);

    switch (action.payload.kind) {
        case RowItemChangeKind.IsExpand:
            return {
                ...state,
                TimeData: TimeData
            };
        default: {
            return state;
        }
    }
}

function TimeListItemCollapsedALL(state: TimeState, token: string)
    : TimeGridView {
    const hash = createViewhash(state);
    const filesData = state.TimeData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        return Object.freeze({ ...file, isExpand: false });
    }));
    tmp[hash] = { data: newfilesData, total: state.TimeData[hash].total, loading: false };
    return tmp;
}


function TimeListItemsChange(state: TimeState, newValue: number, row: TimeItemWrapper, token: string)
    : TimeGridView {
    const hash = createViewhash(state);
    const filesData = state.TimeData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data && !row.isExpand) {
            return Object.freeze({ ...file, isExpand: true });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { data: newfilesData, total: state.TimeData[hash].total, loading: false };
    return tmp;
}


const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any): State {

    const tmp = {};
    switch (action.type) {

        case Actions.INIT_TIME_CORE:
            tmp[action.token] = initView(state.views[action.token], action.matterInfo);
            console.log('reducer' + Actions.INIT_TIME_CORE);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.TIME_CORE_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_TIME_CORE_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_TIME_CORE_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = TimeLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_TIME_CORE_GRID_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ TimeData: { data: [], total: null, loading: true } } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.TIME_CORE_GRID_ROW_CHANGE:
            tmp[action.token] = rowChange(state.views[action.token], action, action.payload.row, action.token);
            return { ...state, views: { ...state.views, ...tmp } };

        default:
            { return state; }
    }
}

function preLoadData(state: TimeState, request: TimeRequest) {
    const newTimeListData = [{ request }].reduce((accu, item) => {
        accu[item.request.hash] = { data: [], total: null, loading: true };
        return accu;
    }, { ...state.TimeData });
    return { ...state, TimeData: newTimeListData, };
}

// tslint:disable-next-line:max-line-length
function TimeLoadSuccess(state: TimeState, response: TimeResponse, request: TimeRequest): Partial<TimeState> {
    const newTimeListData = [{ request, response }].reduce((accu, item) => {
        const data: TimeItemWrapper[] = item.response.Data.Data.map((_item) => ({ data: _item, isExpand: false }));
        accu[item.request.hash] = { data: data, loading: false, total: item.response.Data.Total };
        return accu;
    }, { ...state.TimeData });
    return { ...state, TimeData: newTimeListData, };
}

function createViewhash(state: TimeState) {
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
export const getTimeListByToken = (token) => createSelector(getViewByToken(token),
    (fileState) => {
        return fileState.TimeData;
    }
);
export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash);

export const getSearchTextByToken = (token) => createSelector(getViewByToken(token), (state) => state.searchText);
export const getTimePageEventByToken = (token) => createSelector(getViewByToken(token), (state) => state.pageEvent);
export const getTimeGridDataByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        return state.TimeData[hash];
    });

export const getIsDataLoadedByToken = (token) => createSelector(getCurrentHashByToken(token),
    getTimeListByToken(token), (hash, gridViews) => gridViews && gridViews[hash] !== undefined);




