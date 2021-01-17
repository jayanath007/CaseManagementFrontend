import { PreviousTransGrid, PreviousTransInput, AllGridPageInfo, MatterData } from './../models/interface';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { GridFilterModel } from '../models/interface';
import { applyColumnFilter, applyFieldSort, clearColumnFilter, paginatorChange } from '../../core/lib/grid-helpers';
import { PaginatorDef } from '../../core/lib/grid-model';
import { GridFilterType } from '../models/enums';
export interface State {
    readonly [token: string]: PreviousTransactionState;
}export interface PreviousTransactionState {
    readonly isPreviousTransLoading: boolean;
    readonly matterData: MatterData;
    readonly previousTransGridData: PreviousTransGrid;
    readonly gridCloumnVisibleStatus: string;
    readonly gridFilterData: GridFilterModel;
    readonly paginatorDef: PaginatorDef; // optional you can remove this
}
const initialState: State = {};
export function reducer(state = initialState, action: Actions.Any): State {
    const temp = {};
    switch (action.type) {
        case Actions.INIT_PREVIOUS_TRANSACTION:
            temp[action.token] = initViewData(state[action.token], action);
            return { ...state, ...temp };
        case Actions.GET_PREVIOUS_TRANSACTION_GRID_DATA:
            temp[action.token] = loadAllGridData(state[action.token], action);
            return { ...state, ...temp };
        case Actions.GET_PREVIOUS_TRANSACTION_GRID_DATA_SUCCESS:
            temp[action.token] = loadAllGridDataSuccess(state[action.token], action);
            return { ...state, ...temp };
        case Actions.GET_PREVIOUS_TRANSACTION_GRID_DATA_FAIL:
            temp[action.token] = loadAllGridDataFail(state[action.token], action);
            return { ...state, ...temp };
        case Actions.GET_PREVIOUS_TRANSACTION_GRID_CHANGE_PAGE:
            temp[action.token] = setPaginator(state[action.token], action);
            return { ...state, ...temp };
        case Actions.GET_PREVIOUS_TRANSACTION_GRID_FILTER_TYPE:
            temp[action.token] = setGridFilter(state[action.token], action);
            return { ...state, ...temp };
        case Actions.GET_PREVIOUS_TRANSACTION_SHOW_BALANCE_CHANGE:
            temp[action.token] = {
                ...state[action.token],
                previousTransGridData: {
                    ...state[action.token].previousTransGridData,
                    gridColumns: action.payload.columnDef,
                    PaginatorDef: { currentPage: 0, itemPerPage: 50 }
                }
            };
            return { ...state, ...temp };
        case Actions.APPLY_COLUM_FILTER:
            const columnDef = state[action.token].previousTransGridData.gridColumns;
            temp[action.token] = {
                ...state[action.token],
                previousTransGridData: {
                    ...state[action.token].previousTransGridData,
                    gridColumns: action.isClear ? clearColumnFilter(columnDef, action.columDef) :
                        applyColumnFilter(columnDef, action.columDef),
                    PaginatorDef: { currentPage: 0, itemPerPage: 50 }
                }
            };
            return { ...state, ...temp };
        case Actions.APPLY_COLUM_SORTING:
            temp[action.token] = {
                ...state[action.token],
                previousTransGridData: {
                    ...state[action.token].previousTransGridData,
                    gridColumns: applyFieldSort(state[action.token].previousTransGridData.gridColumns, action.columDef),
                    PaginatorDef: { currentPage: 0, itemPerPage: 50 }
                }
            };
            return { ...state, ...temp };

        default: {
            return state;
        }
    }
}

function initViewData(state: PreviousTransactionState, action: Actions.InitPreviousTransaction): Partial<PreviousTransactionState> {
    // if (state) {
    //     return state;
    // } else {
    return {
        ...state,
        isPreviousTransLoading: false,
        matterData: action.payload.input.matterData,
        previousTransGridData: {
            gridColumns: action.payload.columnDef,
            PaginatorDef: action.payload.paginatorDef,
            allGridPage: null,
        },
        gridCloumnVisibleStatus: '',
        gridFilterData: setInitFilterValue(),
        paginatorDef: action.payload.paginatorDef,
    };
    // }
}
function setPaginator(state: PreviousTransactionState, action: Actions.ChangePaginator): Partial<PreviousTransactionState> {
    return {
        ...state,
        previousTransGridData: {
            ...state.previousTransGridData,
            PaginatorDef: paginatorChange(action.pageDef)
        },
        paginatorDef: paginatorChange(action.pageDef)
    };
}
// function paginatorChangeData(pagerDef: PaginatorDef): PaginatorDef {
//     return {
//         ...pagerDef,
//         currentPage: pagerDef.currentPage,
//         itemPerPage: pagerDef.itemPerPage
//     };
// }
function setGridFilter(state: PreviousTransactionState, action: Actions.ChangeGridFilterType): Partial<PreviousTransactionState> {
    return {
        ...state,
        gridFilterData: {
            ...state.gridFilterData,
            showAll: action.payload.gridFilterType === GridFilterType.showAll,
            showOffice: action.payload.gridFilterType === GridFilterType.showOffice,
            showClient: action.payload.gridFilterType === GridFilterType.showClient
        }
    };
}
function loadAllGridData(state: PreviousTransactionState,
    action: Actions.GetPreviousTransGridData): Partial<PreviousTransactionState> {
    return {
        ...state,
        isPreviousTransLoading: true
    };
}
function loadAllGridDataSuccess(state: PreviousTransactionState,
    action: Actions.GetPreviousTransGridDataSuccess): Partial<PreviousTransactionState> {
    return {
        ...state,
        previousTransGridData: loadAllGriddata(state.previousTransGridData,
            action.payload.allGridPageData),
        isPreviousTransLoading: false
    };
}
function loadAllGridDataFail(state: PreviousTransactionState,
    action: Actions.GetPreviousTransGridDataFail): Partial<PreviousTransactionState> {
    return {
        ...state,
        isPreviousTransLoading: false
    };
}
function loadAllGriddata(existingData: PreviousTransGrid, newPageData: AllGridPageInfo) {
    return {
        ...existingData,
        allGridPage: newPageData
    };
}
function setInitFilterValue() {
    let newValue: GridFilterModel = null;
    newValue = {
        showAll: true,
        showOffice: false,
        showClient: false,
    };
    return newValue;
}

// export const getState = (state: State) => state;
// export const getViewByToken = (token) => createSelector(getState, (state) => {
//     return state.views[token];
// });
export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);

// state
export const getGridDataByToken = (token) =>
    createSelector(getStateByToken(token), (PreTransState) => PreTransState ? PreTransState.previousTransGridData : null);
export const getIsLoadingByToken = (token) =>
    createSelector(getStateByToken(token), (PreTransState) => PreTransState ? PreTransState.isPreviousTransLoading : false);
export const getGridFilterDataByToken = (token) =>
    createSelector(getStateByToken(token), (PreTransState) => PreTransState ? PreTransState.gridFilterData : null);
export const getMatterDataByToken = (token) =>
    createSelector(getStateByToken(token), (PreTransState) => PreTransState ? PreTransState.matterData : null);
// View
// export const getMatterDataByToken = createSelector(getState, (state) => state.matterData);
