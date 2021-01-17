import { GridDataObject } from '../models/interface';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { GridData } from '../models/interface';
import { ViewChangeKind } from '../models/enumeration';
import { SortDirections } from '../../odata/enums';
import { Condition } from '../../odata/interfaces';
import { clearFilters, applyFieldSort, applyColumnFilter } from '../../core/lib/grid-helpers';

export interface State {
    readonly [token: string]: MatterView;
}

export interface MatterView {
    readonly isGridLoading: boolean;
    readonly gridCloumn: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly clientRef: string;
    readonly gridData: GridData[];
    readonly totalItem: number;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const tmp: any = {};
    switch (action.type) {
        case Actions.INIT_MATTER_VIEW:
            tmp[action.token] = setInitialData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_GRID_DATA:
            tmp[action.token] = loadGridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_GRID_DATA_SUCCESS:
            tmp[action.token] = loadGridDataSuccess(state[action.token], action, action.payload.pageData);
            return { ...state, ...tmp };
        case Actions.LOAD_GRID_DATA_FAIL:
            tmp[action.token] = loadGridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GRID_VIEW_CHANGE:
            tmp[action.token] = viewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.EXIT_MATTER_VIEW_POPUP:
            tmp[action.token] = null;
            return { ...state, ...tmp };
        default:
            {
                return state;
            }
    }
}

function setInitialData(state: MatterView, action: Actions.InitMatterView): Partial<MatterView> {
    return {
        ...state,
        isGridLoading: false,
        gridCloumn: action.payload.gridColoumn,
        clientRef: action.payload.clientRef,
        paginatorDef: action.payload.paginatorDef,
        gridData: null,
        totalItem: 0,
    };
}

function loadGridData(state: MatterView, action: Actions.LoadGrid): Partial<MatterView> {
    return { ...state, isGridLoading: true };
}

function loadGridDataSuccess(state: MatterView, action: Actions.LoadGridSuccess,
    newData: GridDataObject): Partial<MatterView> {
    return { ...state, gridData: newData.data, totalItem: newData.total, isGridLoading: false };
}

function loadGridDataFail(state: MatterView, action: Actions.LoadGridFail): Partial<MatterView> {
    return { ...state, isGridLoading: false };
}


function viewChange(state: MatterView, action: Actions.GridViewChange): Partial<MatterView> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state,
                gridCloumn: applyColumnFilter(state.gridCloumn, action.payload.value as ColumnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                gridCloumn: clearColumnFilter(state.gridCloumn, action.payload.value as ColumnDef),
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                gridCloumn: applyFieldSort(state.gridCloumn, action.payload.value as ColumnDef),
            };
        case ViewChangeKind.PageChange:
            return {
                ...state,
                paginatorDef: paginatorChange(action.payload.value)
            };
        default: {
            return state;
        }
    }
}


// function applyColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
//     const cloneCond = (filters: Condition[]) => filters.map((cond) => ({ ...cond }));
//     return current.map((def) => {
//         if (def.fieldName === changedDef.fieldName) {
//             return {
//                 ...def, filterActive: true, filter: {
//                     ...def.filter,
//                     logic: changedDef.filter.logic,
//                     filters: cloneCond(changedDef.filter.filters)
//                 }
//             };
//         }
//         return def;
//     });
// }

function paginatorChange(pagerDef: PaginatorDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage
    };
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

function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def);
        }
        return def;
    });
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getIsLoadingToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.isGridLoading : null);
export const getClientRef = (token) => createSelector(getStateByToken(token), (state) => state ? state.clientRef : null);
export const getIsGridColoumnToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.gridCloumn : null);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridCloumn : null);
export const getPeginatorDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.paginatorDef : null);
export const getGridDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridData : null);
export const getTotalItemByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.totalItem : null);






