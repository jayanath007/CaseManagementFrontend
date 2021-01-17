import { ColumnDef } from './../../core/lib/grid-model';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';

export interface State {
    readonly [tiken: string]: BundleMonitorState;
}

export interface BundleMonitorState {
    isLoading: boolean;
    gridColumns: ColumnDef[];
    itemsForList: { key: string, value: number | string }[];
    selectedItem: number | string;
    previousSelectedItem: number | string;
    searchBundleId: number;
    gridItems: PDFBundleHeaderViewModel[];
}

const initialState: State = {};

export function reducers(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_BUNDLE_MONITOR:
            temp[action.token] = {
                ...state[action.token],
                gridColumns: action.bundleMonitorInput.colunDef,
                isLoading: false,
                itemsForList: [{ key: 'Today', value: 0 },
                { key: 'Last 7 Days', value: 7 },
                { key: 'Last 30 Days', value: 30 },
                { key: 'All', value: '*' }],
                selectedItem: action.bundleMonitorInput.bundleID ? '*' : 0,
                previousSelectedItem: action.bundleMonitorInput.bundleID ? '*' : 0,
                searchBundleId: action.bundleMonitorInput.bundleID
            };
            return { ...state, ...temp };
        case Actions.SELECT_ITEM:
            temp[action.token] = {
                ...state[action.token],
                selectedItem: action.itemValue,
                previousSelectedItem: action.itemValue,
                searchBundleId: null
            };
            return { ...state, ...temp };
        case Actions.LOAD_DATA || Actions.DELETE_ROWS:
            temp[action.token] = {
                ...state[action.token],
                isLoading: true
            };
            return { ...state, ...temp };
        case Actions.LOAD_DATA_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false,
                gridItems: action.data
            };
            return { ...state, ...temp };
        case Actions.LOAD_DATA:
            temp[action.token] = {
                ...state[action.token],
                isLoading: false,
                gridItems: []
            };
            return { ...state, ...temp };
        case Actions.CHANGE_SEARCH_BUNDLE_ID:
            temp[action.token] = {
                ...state[action.token],
                selectedItem: action.bundleId ? '*' : state[action.token].previousSelectedItem,
                searchBundleId: action.bundleId
            };
            return { ...state, ...temp };
        case Actions.SELECT_ROW:
            temp[action.token] = {
                ...state[action.token],
                gridItems: state[action.token].gridItems.map(val => ({
                    ...val, selected: val.pbH_BundleID === action.payloade.id ? action.payloade.value : val.selected
                }))
            };
            return { ...state, ...temp };
        default:
            return state;
    }
}

export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (views) => views[token]);
export const getStateIsLoadingByToken = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.isLoading : false);
export const getColoumnByToken = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.gridColumns : []);
export const getItemsForList = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.itemsForList : []);
export const getSelecteditem = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.selectedItem : '');
export const getGridItems = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.gridItems : null);
export const getSearchBundleId = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? state.searchBundleId : null);
export const getRequestParam = (token: string) =>
    createSelector(getViewByToken(token), (state) => state ? { itemFor: state.selectedItem, bundleId: state.searchBundleId } : null);
