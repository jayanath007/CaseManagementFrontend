import { INIT_GENERAL_POPUP_SUCCESS } from '../actions/core';
// import { List } from './../../core/lib/microsoft-graph';
import { EMPTY as empty } from 'rxjs';
import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';

import { TokenizeAction } from '../../core';
import { Filter, Condition, Logic, FieldType, Operator, SortDirections } from '../../odata';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    createDefultColumnDef, getPaginatorSkip, toODataFilter, toODataSort,
    createColumnDefHash, clearFilters, applyFieldSort, applyColumnFilter
} from '../../core/lib/grid-helpers';
import { GeneralPopupResponse } from '../models/interfaces';

export interface State {
    readonly [token: string]: GeneralPopupState;
}

export interface GeneralPopupState {
    readonly loading: boolean;
    readonly showHint: boolean;
    readonly totalItems: number;
    readonly sarchText: string;
    readonly viewChange: string;
    readonly generalColumnDef: ColumnDef[];
    readonly generalPaginatorDef: PaginatorDef;
    readonly sitePath: string;
    readonly isFrontEndFilter: boolean;

    readonly generalDataList: GeneralPopupResponse;
    readonly generalDataListAll: GeneralPopupResponse;
    readonly isPopup: boolean;
    readonly request: any;
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp: any = {};
    switch (action.type) {
        case Actions.INIT_GENERAL_POPUP:
            tmp[action.token] = initGeneralPopupView(state[action.token], action);
            return { ...state, ...tmp };

        case Actions.LOAD_GENERAL_POPUP_DATA:
            tmp[action.token] = getGenaralPopupData(state[action.token]);
            return { ...state, ...tmp };

        case Actions.LOAD_GENERAL_POPUP_DATA_SUCCESS:
            tmp[action.token] = getInitViewDataSuccess(state[action.token], action.payload.generalPopupList);
            return { ...state, ...tmp };
        case Actions.LOAD_GENERAL_POPUP_DATA_FAIL:
            tmp[action.token] = getInitViewDataFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GENERAL_SEARCH_TEXT_CHANGE:
            tmp[action.token] = getGeneralSearchTextChange(state[action.token], action.payload.searchText);
            return { ...state, ...tmp };
        case Actions.CHANGE_PAGE:
            tmp[action.token] = {
                ...state[action.token],
                generalPaginatorDef: action.payload.pageDef
            };
            return { ...state, ...tmp };
        case Actions.TOGGLE_SORTING:
            tmp[action.token] = {
                ...state[action.token],
                generalColumnDef: applyFieldSort(state[action.token].generalColumnDef, action.payload.colDef)
            };
            return { ...state, ...tmp };
        default: {
            return state;
        }
    }
}

function initGeneralPopupView(state: GeneralPopupState, action: Actions.InitGeneralPopup): Partial<GeneralPopupState> {
    // if (!state) {
    return {
        ...state,
        sarchText: action.payload.searchText,
        generalColumnDef: action.payload.generalPopupColumn,
        generalPaginatorDef: action.payload.generalPaginatorDef,
        totalItems: 0,
        loading: true,
        sitePath: action.payload.sitePath,
        isFrontEndFilter: action.payload.isFrontEndFilter,
        request: action.payload.request
    };
    // } else {
    //     return state;
    // }
}

function getGenaralPopupData(state: GeneralPopupState): Partial<GeneralPopupState> {

    return {
        ...state,
        loading: true,
    };
}

function getInitViewDataSuccess(state: GeneralPopupState, responce: any) {

    return {
        ...state,
        loading: false,
        generalDataList: responce.data,
        totalItems: responce.total,
        generalDataListAll: responce.data,
        // prevscreenLookupList: responce,

    };
}

function getInitViewDataFail(state: GeneralPopupState) {
    return {
        ...state,
        loading: false,
        //   workflowRuleList: []
    };
}


function getGeneralSearchTextChange(state: GeneralPopupState, searchText: string): Partial<GeneralPopupState> {
    if (state.isFrontEndFilter) {
        const list = state.generalDataListAll;
        const columnNames = state.generalColumnDef.map((data) => data.fieldName);
        const newList = transform(list, columnNames, searchText);
        return {
            ...state,
            sarchText: searchText,
            generalDataList: newList,
            //   generalColumnDef: clearAllColumnFilter(state.generalColumnDef),

        };


    } else {
        return {
            ...state,
            sarchText: searchText,
            generalPaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
        };
    }


}



function transform(value, columnNames: Array<string>, term: string) {
    if (!term) {
        return value;
    }
    return (value || []).filter((item) => columnNames
        .some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));

}



function clearAllColumnFilter(current: ColumnDef[]) {
    return current.map((def) => {
        return clearFilters(def);
    });
}
function paginatorChange(pagerDef: PaginatorDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage
    };
}



export const getViews = (state: State) => state;
export const getViewByToken = (token) => createSelector(getViews, (views) => views[token]);
export const getGeneralColumnDefByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.generalColumnDef : null);
export const getclientPaginatorDefByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.generalPaginatorDef : null);
export const getGeneralDataListByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.generalDataList : null);
export const getIsLoading = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.loading : false);
export const getGeneralTotalItemCounntByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.totalItems : null);
export const getGeneralCurrentItemTotalByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.viewChange : null);
export const getGeneralSearchTextByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.sarchText : null);
export const getGeneralSitePathByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.sitePath : null);
export const getIsFrontEndFilterByToken = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.isFrontEndFilter : false);
export const getInputRequest = (token) => createSelector(getViewByToken(token),
    (generalPopupStateState) => generalPopupStateState ? generalPopupStateState.request : {});
