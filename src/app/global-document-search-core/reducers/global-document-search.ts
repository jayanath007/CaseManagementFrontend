
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { GridData, FilterViewModel, FilterItem, UpdateCol, DropdownListData } from '../models/interface';
import { FilterType, Operator, Logic, ViewChangeKind } from '../models/enum';
import { PageEvent } from '@angular/material';
import { applyColumnFilter, clearFilters } from '../../core/lib/grid-helpers';
import { GridDocumentData } from '../../core/lib/matter';


export interface State {
    readonly [token: string]: GlobalDocumentSearchState;
}

export interface GlobalDocumentSearchState {

    readonly columnDef: ColumnDef[];
    readonly loadDocURL: boolean;
    readonly gridData: GridDocumentData[];   // GridData[];
    readonly loading: boolean;
    readonly filterRowId: number;
    readonly feeEarnerList: DropdownListData[];
    readonly appCodeList: DropdownListData[];
    readonly documentViewOpened: boolean;
    readonly paginatorDef: PaginatorDef;
    readonly totalItem: number;
    readonly pageEvent: PageEvent;
    readonly filterExpanded: boolean;
    readonly selectedRowData: GridDocumentData;
    readonly popupUrl: string;



    readonly filterViewModel: FilterViewModel;
    readonly filterOperateTypes: { textOperators: { id: Operator, label: string }[], dateOperators: { id: Operator, label: string }[] };

}


const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_GLOBAL_DOCUMENT_SEARCH:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_GLOBAL_DOCUMENT_URL:
            tmp[action.token] = getDocURL(state[action.token], action.payload.gridRowUrlRequest);
            return { ...state, ...tmp };
        case Actions.GET_GLOBAL_DOCUMENT_URL_SUCCESS:
            tmp[action.token] = getDocURLSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_GLOBAL_DOCUMENT_URL_FAIL:
            tmp[action.token] = getDocURLFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_DOCUMENT_DATA:
            tmp[action.token] = getDoc(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.LOAD_DOCUMENT_DATA_SUCCESS:
            tmp[action.token] = getDocumentDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DOCUMENT_DATA_FAIL:
            tmp[action.token] = getDocDataFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.ADD_DOCUMENT_FILTER_ROW:
            tmp[action.token] = addFilterRow(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_GLOBAL_DOC_FEE_EARNER_LIST:
            tmp[action.token] = dataLoading(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_GLOBAL_DOC_FEE_EARNER_LIST_SUCCESS:
            tmp[action.token] = setFeeearnerList(state[action.token], action.payload);
            return { ...state, ...tmp };
        // case Actions.GET_GLOBAL_DOC_FEE_EARNER_LIST_FAIL:
        //     tmp[action.token] = setFeeearnerListFail(state[action.token]);
        //     return { ...state, ...tmp };

        case Actions.GET_GLOBAL_DOC_APP_CODE_LIST:
            tmp[action.token] = appCodeLoading(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_GLOBAL_DOC_APP_CODE_LIST_SUCCESS:
            tmp[action.token] = setAppCodeList(state[action.token], action.payload);
            return { ...state, ...tmp };

        case Actions.GLOBAL_SEARCH_CHANGE_SEARCH_TEXT:
            tmp[action.token] = setSearchText(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.CLOSE_DOCUMENT_VIEWER:
            tmp[action.token] = closedocview(state[action.token]);
            return { ...state, ...tmp };
        case Actions.REMOVE_FILTER_ROW:
            tmp[action.token] = removefilterRow(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GRID_VIEW_CHANGE:
            tmp[action.token] = viewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GLOBAL_SEARCH_DOCUMENT_CLEAR:
            tmp[action.token] = searchDocumentClear(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_GLOBAL_DOCUMENT_POPUP_URL_SUCCESS:
            tmp[action.token] = setPopUpURL(state[action.token], action);
            return { ...state, ...tmp };
        //     case Actions.LOAD_FEEEARNER_LIST:
        //     temp[action.token] = dataLoading(state[action.token]);
        //     return { ...state, ...temp };
        // case Actions.LOAD_FEEEARNER_LIST_SUCCESS:
        //     temp[action.token] = setFeeearnerList(state[action.token], action.payload);
        //     return { ...state, ...temp };

        // case Actions.REMOVE_DOCUMENT_FILTER_ROW:
        //     tmp[action.token] = removeFilterRow(state[action.token]);
        //     return { ...state, ...tmp };

        case Actions.FILTER_ITEM_CHANGE:
            tmp[action.token] = setChangeFilterItem(state[action.token],
                action.payload);
            return { ...state, ...tmp };

        default:
            { return state; }
    }
}




function initView(state: GlobalDocumentSearchState, action: Actions.InitGlobalDocumentSearch): Partial<GlobalDocumentSearchState> {
    if (!state) {
        return {
            ...state,
            paginatorDef: action.payload.paginatorDef,
            columnDef: action.payload.columnDef,
            loading: false,
            filterRowId: 0,
            documentViewOpened: false,
            filterExpanded: false,
            filterViewModel: {
                searchText: '',
                filterList: [{
                    filterId: 0,
                    fieldOperator: '',
                    fieldHidden: true,
                    filterType: FilterType.AppType,
                    operator: Operator.EqualTo,
                    filterValue: '',
                    operatorType: action.payload.filterOperate.textOperators
                }]
            },
            filterOperateTypes: action.payload.filterOperate


        };
    } else {
        return state;
    }
}


function addFilterRow(state: GlobalDocumentSearchState) {
    return {
        ...state,
        filterRowId: state.filterRowId + 1,
        filterViewModel: {
            ...state.filterViewModel,
            filterList: state.filterViewModel.filterList
                .map(f => ({ ...f, fieldHidden: false, fieldOperator: f.fieldOperator || Logic.And }))
                .concat(createRowItem(state.filterOperateTypes.textOperators, state.filterRowId))
        }

    };
}

function viewChange(state: GlobalDocumentSearchState, action: Actions.GridViewChange) {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state,
                columnDef: applyColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(state.columnDef, action.payload.value as ColumnDef),
            };
        // case ViewChangeKind.ToggleFieldSort:
        //     return {
        //         ...state,
        //         columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
        //     };
        case ViewChangeKind.PageChange:
            return {
                ...state,
                paginatorDef: paginatorChange(action.payload.value)
            };
        default: {
            return state;
        }
    }
    // return {
    //     ...state,
    //     paginatorDef: paginatorChange(action.payload.value)

    // };

}

function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def);
        }
        return def;
    });
}

function paginatorChange(pagerDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage


    };
}
function getDocDataFail(state: GlobalDocumentSearchState) {
    return {
        ...state,
        loading: false,
    };


}

function removefilterRow(state: GlobalDocumentSearchState, rowId) {
    if (state.filterViewModel.filterList.length === 1) {
        return {
            ...state,
            filterViewModel: {
                ...state.filterViewModel,
                filterList: [{
                    filterId: 0,
                    fieldOperator: '',
                    fieldHidden: true,
                    filterType: FilterType.AppType,
                    operator: Operator.EqualTo,
                    filterValue: '',
                    operatorType: state.filterOperateTypes.textOperators
                }],
            }
        };

    } else {
        return {
            ...state,
            documentViewOpened: false,
            filterViewModel: {
                ...state.filterViewModel,
                filterList: state.filterViewModel.filterList
                    .filter(r => r.filterId !== rowId)
                    .map((f, i) => {
                        if (i < state.filterViewModel.filterList.length - 2) {
                            return { ...f, fieldHidden: false };
                        }
                        return { ...f, fieldHidden: true, fieldOperator: '', };
                    })
            }

        };
    }
}

function createRowItem(textOperators: { id: Operator, label: string }[], filterRowId: number): FilterItem[] {

    return [{
        filterId: filterRowId + 1,
        fieldOperator: '',
        fieldHidden: true,
        filterType: FilterType.FeeEarner,
        operator: Operator.EqualTo,
        filterValue: null,
        operatorType: textOperators
    }];
}


function setChangeFilterItem(state: GlobalDocumentSearchState, payload) {
    return {
        ...state,
        filterViewModel: {
            ...state.filterViewModel,
            filterList: retunList(state, payload.changeCol, payload.rowId, payload.changeValue, state.filterOperateTypes)
        }

    };
}

function retunList(state, changeCol, rowId, changeValue,
    operatorsType: { textOperators: { id: Operator, label: string }[], dateOperators: { id: Operator, label: string }[] }) {

    return state.filterViewModel.filterList.map(val => {
        if (val.filterId === rowId) {
            switch (changeCol) {
                case UpdateCol.field:

                    return Object.freeze({
                        ...val,
                        fieldOperator: changeValue,

                    });
                case UpdateCol.filterType:
                    return Object.freeze({
                        ...val,

                        filterType: changeValue,
                        operator: changeValue === FilterType.FromDate || changeValue === FilterType.ToDate ?
                            Operator.GreaterThan : Operator.EqualTo,
                        filterValue: '',
                        operatorType: changeValue === FilterType.FromDate || changeValue === FilterType.ToDate ?
                            operatorsType.dateOperators : operatorsType.textOperators,

                    });
                case UpdateCol.operator:
                    return Object.freeze({
                        ...val,
                        operator: changeValue,

                    });
                case UpdateCol.value:
                    return Object.freeze({
                        ...val,
                        filterValue: changeValue,

                    });
            }

        } else {
            return val;
        }
    });


}



function setSearchText(state: GlobalDocumentSearchState, payload) {
    return {
        ...state,
        documentViewOpened: false,
        paginatorDef: { currentPage: 0, itemPerPage: 50 },
        filterViewModel: {
            ...state.filterViewModel,
            searchText: payload.searchText
        }

    };

}


function searchDocumentClear(state: GlobalDocumentSearchState) {
    return {
        ...state,
        documentViewOpened: false,
        loading: false,
        filterRowId: 0,
        paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 }),
        gridData: [],
        totalItem: 0,
        filterViewModel: {
            ...state.filterViewModel,
            filterList: [{
                filterId: 0,
                fieldOperator: '',
                fieldHidden: true,
                filterType: FilterType.AppType,
                operator: Operator.EqualTo,
                filterValue: '',
                operatorType: state.filterOperateTypes.textOperators
            }],
            searchText: ''
        }

    };

}





// function removeFilterRow(state: GlobalDocumentSearchState) {
//     return {
//         ...state,
//         filterRowId: state.filterRowId + 1,
//         filterViewModel: {
//             ...state.filterViewModel,
//             filterViewModel: state.filterViewModel.filterList
//                 .push(CreateRowItem(state.filterOperateTypes.textOperators, state.filterRowId))

//         }

//     };
// }

function closedocview(state: GlobalDocumentSearchState): Partial<GlobalDocumentSearchState> {
    return { ...state, documentViewOpened: false };
}

function getDocURL(state: GlobalDocumentSearchState, data: GridDocumentData): Partial<GlobalDocumentSearchState> {
    return { ...state, selectedRowData: data, loadDocURL: true, documentViewOpened: true };
}

function getDoc(state: GlobalDocumentSearchState, action): Partial<GlobalDocumentSearchState> {
    return {
        ...state, loading: true, documentViewOpened: false, filterExpanded: true,
        paginatorDef: (action.searchButton === true) ? { currentPage: 0, itemPerPage: 50 } : state.paginatorDef

    };
}
function getDocumentDataSuccess(state: GlobalDocumentSearchState,
    action: Actions.LoadDocumentDataSuccess): Partial<GlobalDocumentSearchState> {
    return {
        ...state,
        gridData: action.payload.data.documents,
        loading: false,
        totalItem: action.payload.data.total,
    };
}
function getDocURLSuccess(state: GlobalDocumentSearchState, action: Actions.GetGlobalDocURLSuccess): Partial<GlobalDocumentSearchState> {
    return {
        ...state,
        documentViewOpened: true,
        gridData: state.gridData.map(val => {
            if (val.token === action.payload.gridRow.token) {
                return { ...val, docUrl: action.payload.url, selected: true };
            }
            return { ...val, selected: false };
        })
        // {
        //     ...state.gridData,
        //     // docUrl: action.payload.url

        // }
    };


}

function getDocURLFail(state: GlobalDocumentSearchState): Partial<GlobalDocumentSearchState> {
    return { ...state, loadDocURL: false, loading: false };
}
function dataLoading(state: GlobalDocumentSearchState): Partial<GlobalDocumentSearchState> {
    return { ...state, loading: true };
}
function setFeeearnerList(state: GlobalDocumentSearchState, payload): Partial<GlobalDocumentSearchState> {
    return { ...state, feeEarnerList: payload, loading: false };
}

function appCodeLoading(state: GlobalDocumentSearchState): Partial<GlobalDocumentSearchState> {
    return { ...state, loading: true };
}

function setAppCodeList(state: GlobalDocumentSearchState, payload): Partial<GlobalDocumentSearchState> {
    return { ...state, appCodeList: payload, loading: false };
}

function setDocumentUrl(gridData: GridData[], selectedRow: GridData, url: string): GridData[] {
    return gridData.map(row => {
        if (row === selectedRow) {
            return Object.freeze({ ...row, docUrl: url, view: true });
        } else {
            return Object.freeze({ ...row, view: false });
        }
    });
}

function setPopUpURL(state: GlobalDocumentSearchState,
    action: Actions.GetGlobalSearchDocumentPopupUrlSuccess): Partial<GlobalDocumentSearchState> {
    return { ...state, popupUrl: action.payload.popupUrl };
}


export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getLoadingByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loading : null);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : null);
export const getFilterViewModelByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.filterViewModel : null);
export const getFeeEarnerListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.feeEarnerList : null);
export const getAppCodeListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.appCodeList : null);
export const getGridDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridData : null);
export const getDocumentViewOpenedByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.documentViewOpened : null);
export const getTotalItemByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.totalItem : null);
export const getPaginatorDefToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.paginatorDef : null);
export const getFilterExpandedToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.filterExpanded : null);
export const getSelectedRowDataByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.selectedRowData : null);


