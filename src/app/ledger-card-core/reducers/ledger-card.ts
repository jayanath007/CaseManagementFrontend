
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';

import {
    MatterData, MatterBalances, AllGridFilterModel,
    AllGridFilterUpdate, AllGrid, AllGridPageInfo, BillGrid, BillGridPageInfo, DisbsGrid,
    DisbsGridPageInfo, GBPGrid, GBPGridPageInfo, DDAGrid, DDAGridPageInfo, CurrenciesView,
    ClientGrid, ClientGridPageInfo, CurrencyLabel, BillGridData, BillGridTotal, EChitGrid, EChitGridData
} from './../models/interfce';
import { allGridFilterKind, ViewChangeKind } from '../models/enumeration';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { Condition, SortDirections, Operator, FieldType } from '../../odata';
import { LedgerCardInput } from '../../core/lib/ledger-card';
import { clearFilters, applyFieldSort, applyColumnFilter } from '../../core/lib/grid-helpers';

export interface State {
    readonly [token: string]: LedgerCardState;
}

export interface LedgerCardState {
    readonly isMatterDataLoading: boolean;
    readonly isMatterBalancesLoading: boolean;
    readonly isAllGridLoading: boolean;
    readonly isBillGridLoading: boolean;
    readonly isDISBSGridLoading: boolean;
    readonly isGBPGridLoading: boolean;
    readonly isDDAGridLoading: boolean;
    readonly isEChitGridLoading: boolean;
    readonly isCurrencyViewLoading: boolean;
    readonly isClient1GridLoading: boolean;
    readonly isClient2GridLoading: boolean;
    readonly isClient3GridLoading: boolean;
    readonly isAllMaterCountLoading: boolean;
    readonly input: LedgerCardInput;
    readonly selectedTabIndex: number;
    readonly isPopup: boolean;
    readonly matterData: MatterData;
    readonly allMatterCount: number;
    readonly msg: string;
    readonly matterBalances: MatterBalances;
    readonly currencyLabel: CurrencyLabel;
    readonly allGridFilterData: AllGridFilterModel;
    readonly allGridData: AllGrid;
    readonly billGridData: BillGrid;
    readonly disbsGridData: DisbsGrid;
    readonly gbpGridData: GBPGrid;
    readonly ddaGridData: DDAGrid;
    readonly currencyView: CurrenciesView[];
    readonly client1GridData: ClientGrid;
    readonly client2GridData: ClientGrid;
    readonly client3GridData: ClientGrid;
    readonly eChitGridData: EChitGrid;
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_LEDGER_CARD:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.UPDATE_MATTER_REF:
            tmp[action.token] = UpdateMaterRef(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_MATTER_DATA:
            tmp[action.token] = matterDataLoading(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_MATTER_DATA_SUCCESS:
            tmp[action.token] = loadMatterDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_MATTER_DATA_FAIL:
            tmp[action.token] = loadMatterDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CURRENCY_DATA:
            tmp[action.token] = currencyDataLoading(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CURRENCY_DATA_SUCCESS:
            tmp[action.token] = loadCurrencyDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CURRENCY_DATA_FAIL:
            tmp[action.token] = loadCurrencyDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_MATTER_BALANCES:
            tmp[action.token] = matterBalancesLoading(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_MATTER_BALANCES_SUCCESS:
            tmp[action.token] = LoadMatterBalance(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_MATTER_BALANCES_FAIL:
            tmp[action.token] = loadMatterBalanceFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.All_GRID_FILTER_UPDATE:
            tmp[action.token] = changeAllGridFilter(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_ALL_GRID_DATA:
            tmp[action.token] = loadAllGridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_ALL_GRID_DATA_SUCCESS:
            tmp[action.token] = loadAllGridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_ALL_GRID_DATA_FAIL:
            tmp[action.token] = loadAllGridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.All_GRID_VIEW_CHANGE:
            tmp[action.token] = allGridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.All_DATA_UPDATE:
            tmp[action.token] = allDataUpdate(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_BILL_GRID_DATA:
            tmp[action.token] = loadBillGridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_BILL_GRID_DATA_SUCCESS:
            tmp[action.token] = loadBillGridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_BILL_GRID_DATA_FAIL:
            tmp[action.token] = loadBillGridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.BILL_GRID_VIEW_CHANGE:
            tmp[action.token] = billGridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DISBS_GRID_DATA:
            tmp[action.token] = loadDISBSGridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DISBS_GRID_DATA_SUCCESS:
            tmp[action.token] = loadDISBSGridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DISBS_GRID_DATA_FAIL:
            tmp[action.token] = loadDISBSGridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.DISBS_GRID_VIEW_CHANGE:
            tmp[action.token] = disbsGridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_GBP_GRID_DATA:
            tmp[action.token] = loadGBPGridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_GBP_GRID_DATA_SUCCESS:
            tmp[action.token] = loadGBPGridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_GBP_GRID_DATA_FAIL:
            tmp[action.token] = loadGBPGridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GBP_GRID_VIEW_CHANGE:
            tmp[action.token] = gbpGridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DDA_GRID_DATA:
            tmp[action.token] = loadDDAGridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DDA_GRID_DATA_SUCCESS:
            tmp[action.token] = loadDDAGridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DDA_GRID_DATA_FAIL:
            tmp[action.token] = loadDDAGridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.DDA_GRID_VIEW_CHANGE:
            tmp[action.token] = ddaGridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT1_GRID_DATA:
            tmp[action.token] = loadClient1GridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT1_GRID_DATA_SUCCESS:
            tmp[action.token] = loadClient1GridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT1_GRID_DATA_FAIL:
            tmp[action.token] = loadClient1GridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CLIENT1_GRID_VIEW_CHANGE:
            tmp[action.token] = client1GridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT2_GRID_DATA:
            tmp[action.token] = loadClient2GridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT2_GRID_DATA_SUCCESS:
            tmp[action.token] = loadClient2GridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT2_GRID_DATA_FAIL:
            tmp[action.token] = loadClient2GridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CLIENT2_GRID_VIEW_CHANGE:
            tmp[action.token] = client2GridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT3_GRID_DATA:
            tmp[action.token] = loadClient3GridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT3_GRID_DATA_SUCCESS:
            tmp[action.token] = loadClient3GridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT3_GRID_DATA_FAIL:
            tmp[action.token] = loadClient3GridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CLIENT3_GRID_VIEW_CHANGE:
            tmp[action.token] = client3GridViewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CHANGE_TAB:
            tmp[action.token] = { ...state[action.token], selectedTabIndex: action.payload.tabIndex };
            return { ...state, ...tmp };
        case Actions.CHANGE_TAB:
            tmp[action.token] = { ...state[action.token], selectedTabIndex: action.payload.tabIndex };
            return { ...state, ...tmp };
        case Actions.LOAD_ALL_MATTER_COUNT:
            tmp[action.token] = allMatterCountLoading(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_ALL_MATTER_COUNT_SUCCESS:
            tmp[action.token] = allMatterCountSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_ALL_MATTER_COUNT_FAIL:
            tmp[action.token] = allMatterCountFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CLEAR_DATA:
            tmp[action.token] = clearData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_ECHIT_GRID_DATA:
            tmp[action.token] = loadEChitGridData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_ECHIT_GRID_DATA_SUCCESS:
            tmp[action.token] = loadEChitGridDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_ECHIT_GRID_DATA_FAIL:
            tmp[action.token] = loadEChitGridDataFail(state[action.token], action);
            return { ...state, ...tmp };
        default: {
            return state;
        }

    }
}

function initView(state: LedgerCardState, action: Actions.InitLedgerCard): Partial<LedgerCardState> {
    if (!state) {
        return {
            ...state,
            isMatterBalancesLoading: false,
            isMatterDataLoading: false,
            isAllGridLoading: false,
            isBillGridLoading: false,
            isDISBSGridLoading: false,
            isGBPGridLoading: false,
            isDDAGridLoading: false,
            isCurrencyViewLoading: false,
            isClient1GridLoading: false,
            isClient2GridLoading: false,
            isClient3GridLoading: false,
            isAllMaterCountLoading: false,
            isEChitGridLoading: false,
            input: action.payload.input,
            selectedTabIndex: 0,
            isPopup: action.payload.isPopup,
            currencyView: [],
            matterData: null,
            currencyLabel: { lable1: '', lable2: '' },
            msg: null,
            matterBalances: setMatterBalance(state, null),
            allGridFilterData: setInitFilterValue(),
            allGridData: {
                gridColumns: action.payload.allGridTemplete.allView,
                PaginatorDef: action.payload.GridPaginatorDef,
                allGridPage: null,
                templet: action.payload.allGridTemplete
            },
            billGridData: {
                gridColumns: action.payload.billGridColumn,
                PaginatorDef: { currentPage: 0, itemPerPage: 0 },
                billGridPage: null,
                total: null
            },
            disbsGridData: {
                gridColumns: action.payload.disbsGridColumn,
                PaginatorDef: action.payload.GridPaginatorDef,
                disbsGridPage: null
            },
            gbpGridData: {
                gridColumns: action.payload.gbpGridColumn,
                PaginatorDef: action.payload.GridPaginatorDef,
                gbpGridPage: null
            },
            ddaGridData: {
                gridColumns: action.payload.ddaGridColumn,
                PaginatorDef: action.payload.GridPaginatorDef,
                ddaGridPage: null
            },
            client1GridData: {
                gridColumns: action.payload.clientsGridColumn,
                PaginatorDef: action.payload.GridPaginatorDef,
                clientGridPage: null
            },
            client2GridData: {
                gridColumns: action.payload.clientsGridColumn,
                PaginatorDef: action.payload.GridPaginatorDef,
                clientGridPage: null
            },
            client3GridData: {
                gridColumns: action.payload.clientsGridColumn,
                PaginatorDef: action.payload.GridPaginatorDef,
                clientGridPage: null
            },
            eChitGridData: {
                gridColumns: action.payload.echitsGridColumn,
                PaginatorDef: action.payload.GridPaginatorDef,
                data: null
            }
        };
    } else {
        return state;
    }
}

function clearData(state: LedgerCardState) {
    return {
        ...state,
        matterBalances: setMatterBalance(state, null),
        matterData: null,
        allGridFilterData: setInitFilterValue(),
        allMatterCount: 0,
        allGridData: {
            gridColumns: state.allGridData.templet.allView,
            PaginatorDef: { currentPage: 0, itemPerPage: 50 },
            allGridPage: null,
            templet: state.allGridData.templet
        },
        billGridData: {
            gridColumns: state.billGridData.gridColumns,
            PaginatorDef: { currentPage: 0, itemPerPage: 0 },
            billGridPage: null,
            total: null
        },
        disbsGridData: {
            gridColumns: state.disbsGridData.gridColumns,
            PaginatorDef: { currentPage: 0, itemPerPage: 50 },
            disbsGridPage: null
        },
        gbpGridData: {
            gridColumns: state.gbpGridData.gridColumns,
            PaginatorDef: { currentPage: 0, itemPerPage: 50 },
            gbpGridPage: null
        },
        ddaGridData: {
            gridColumns: state.ddaGridData.gridColumns,
            PaginatorDef: { currentPage: 0, itemPerPage: 50 },
            ddaGridPage: null
        },
        client1GridData: {
            gridColumns: state.client1GridData.gridColumns,
            PaginatorDef: { currentPage: 0, itemPerPage: 50 },
            clientGridPage: null
        },
        client2GridData: {
            gridColumns: state.client2GridData.gridColumns,
            PaginatorDef: { currentPage: 0, itemPerPage: 50 },
            clientGridPage: null
        },
        client3GridData: {
            gridColumns: state.client3GridData.gridColumns,
            PaginatorDef: { currentPage: 0, itemPerPage: 50 },
            clientGridPage: null
        }
    };
}

function UpdateMaterRef(state: LedgerCardState, action: Actions.UpdateMatterRef): Partial<LedgerCardState> {
    return {
        ...state,
        isMatterDataLoading: true,
        matterBalances: setMatterBalance(state, null),
        matterData: null,
        allGridFilterData: setInitFilterValue(),
        allMatterCount: 0,
        allGridData: {
            gridColumns: action.payload.allGridTemplete.allView,
            PaginatorDef: action.payload.GridPaginatorDef,
            allGridPage: null,
            templet: action.payload.allGridTemplete
        },
        billGridData: {
            gridColumns: action.payload.billGridColumn,
            PaginatorDef: { currentPage: 0, itemPerPage: 0 },
            billGridPage: null,
            total: null
        },
        disbsGridData: {
            gridColumns: action.payload.disbsGridColumn,
            PaginatorDef: action.payload.GridPaginatorDef,
            disbsGridPage: null
        },
        gbpGridData: {
            gridColumns: action.payload.gbpGridColumn,
            PaginatorDef: action.payload.GridPaginatorDef,
            gbpGridPage: null
        },
        ddaGridData: {
            gridColumns: action.payload.ddaGridColumn,
            PaginatorDef: action.payload.GridPaginatorDef,
            ddaGridPage: null
        },
        client1GridData: {
            gridColumns: action.payload.clientsGridColumn,
            PaginatorDef: action.payload.GridPaginatorDef,
            clientGridPage: null
        },
        client2GridData: {
            gridColumns: action.payload.clientsGridColumn,
            PaginatorDef: action.payload.GridPaginatorDef,
            clientGridPage: null
        },
        client3GridData: {
            gridColumns: action.payload.clientsGridColumn,
            PaginatorDef: action.payload.GridPaginatorDef,
            clientGridPage: null
        }
    };
}

function matterDataLoading(state: LedgerCardState, action: Actions.LoadMatterData): Partial<LedgerCardState> {
    return { ...state, isMatterDataLoading: true };
}

function currencyDataLoading(state: LedgerCardState, action: Actions.LoadCurrency): Partial<LedgerCardState> {
    return { ...state, isCurrencyViewLoading: true };
}

function allMatterCountLoading(state: LedgerCardState, action: Actions.LoadAllMatterCount): Partial<LedgerCardState> {
    return { ...state, isAllMaterCountLoading: true };
}

function matterBalancesLoading(state: LedgerCardState, action: Actions.LoadMatterBalances): Partial<LedgerCardState> {
    return { ...state, isMatterBalancesLoading: true };
}

function loadAllGridData(state: LedgerCardState, action: Actions.LoadAllGrid): Partial<LedgerCardState> {
    return { ...state, isAllGridLoading: true };
}

function loadBillGridData(state: LedgerCardState, action: Actions.LoadBillGrid): Partial<LedgerCardState> {
    return { ...state, isBillGridLoading: true };
}

function loadDISBSGridData(state: LedgerCardState, action: Actions.LoadDisbsGrid): Partial<LedgerCardState> {
    return { ...state, isDISBSGridLoading: true };
}

function loadGBPGridData(state: LedgerCardState, action: Actions.LoadGbpGrid): Partial<LedgerCardState> {
    return { ...state, isGBPGridLoading: true };
}

function loadDDAGridData(state: LedgerCardState, action: Actions.LoadDdaGrid): Partial<LedgerCardState> {
    return { ...state, isDDAGridLoading: true };
}

function loadClient1GridData(state: LedgerCardState, action: Actions.LoadClient1Grid): Partial<LedgerCardState> {
    return { ...state, isClient1GridLoading: true };
}

function loadClient2GridData(state: LedgerCardState, action: Actions.LoadClient2Grid): Partial<LedgerCardState> {
    return { ...state, isClient2GridLoading: true };
}

function loadClient3GridData(state: LedgerCardState, action: Actions.LoadClient3Grid): Partial<LedgerCardState> {
    return { ...state, isClient3GridLoading: true };
}

function loadMatterDataSuccess(state: LedgerCardState, action: Actions.LoadMatterDataSuccess): Partial<LedgerCardState> {
    return { ...state, matterData: action.payload.matterData };
}

function loadCurrencyDataSuccess(state: LedgerCardState, action: Actions.LoadCurrencySuccess): Partial<LedgerCardState> {
    return { ...state, currencyView: action.payload.currencyView, isCurrencyViewLoading: false };
}

function allMatterCountSuccess(state: LedgerCardState, action: Actions.LoadAllMatterCountSuccess): Partial<LedgerCardState> {
    return { ...state, allMatterCount: action.payload.allMatterCount, isAllMaterCountLoading: false };
}

function loadMatterDataFail(state: LedgerCardState, action: Actions.LoadMatterDataFail): Partial<LedgerCardState> {
    return { ...state, msg: action.payload.error, isMatterBalancesLoading: false };
}

function loadCurrencyDataFail(state: LedgerCardState, action: Actions.LoadCurrencyFail): Partial<LedgerCardState> {
    return { ...state, msg: action.payload.error, isCurrencyViewLoading: false };
}

function allMatterCountFail(state: LedgerCardState, action: Actions.LoadAllMatterCountFail): Partial<LedgerCardState> {
    return { ...state, msg: action.payload.error, isAllMaterCountLoading: false };
}

function LoadMatterBalance(state: LedgerCardState, action: Actions.LoadMatterBalancesSuccess): Partial<LedgerCardState> {
    return {
        ...state,
        matterBalances: setMatterBalance(state, action.payload.matterBalances),
        isMatterBalancesLoading: false,
        currencyLabel: action.payload.matterBalances.currencyCode ?
            { lable1: '(Currency: ' + 'Rs' + ') ', lable2: '(' + 'Rs' + ') ' } :
            { lable1: '', lable2: '' }
    };
}

function loadMatterBalanceFail(state: LedgerCardState, action: Actions.LoadMatterBalancesFail): Partial<LedgerCardState> {
    return { ...state, msg: action.payload.error, isMatterBalancesLoading: false };
}

function changeAllGridFilter(state: LedgerCardState, action: Actions.AllGridFilterChange): Partial<LedgerCardState> {
    switch (action.payload.data.kind) {
        case allGridFilterKind.showDDA:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showDDA: action.payload.data.value
                }, allGridData: {
                    ...state.allGridData,
                    gridColumns: setAllGridColumns(action.payload.data.value, state.allGridFilterData.showBalanceOnly,
                        state.allGridFilterData.showURN, state)

                }
            };
        case allGridFilterKind.showBalanceOnly:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showBalanceOnly: action.payload.data.value
                }, allGridData: {
                    ...state.allGridData,
                    gridColumns: setAllGridColumns(state.allGridFilterData.showDDA, action.payload.data.value,
                        state.allGridFilterData.showURN, state)

                }
            };
        case allGridFilterKind.showCOS:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showCOS: action.payload.data.value
                }
            };
        case allGridFilterKind.showReversal:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showReversal: action.payload.data.value
                }
            };
        case allGridFilterKind.showURN:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showURN: action.payload.data.value
                },
                allGridData: {
                    ...state.allGridData,
                    gridColumns: setAllGridColumns(state.allGridFilterData.showDDA, state.allGridFilterData.showBalanceOnly,
                        action.payload.data.value, state)

                }
            };
        case allGridFilterKind.showSysBills:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showSysBills: action.payload.data.value
                }
            };
        case allGridFilterKind.showTransPeriods:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showTransPeriods: action.payload.data.value,
                },
                allGridData: {
                    ...state.allGridData,
                    gridColumns: applyPeriodFilter(state.allGridData.gridColumns, null),

                }
            };
        case allGridFilterKind.showOnlyOfficeTrans:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showOnlyOfficeTrans: action.payload.data.value
                }
            };
        case allGridFilterKind.showOnlyDisbuersements:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    showOnlyDisbuersements: action.payload.data.value
                }
            };
        case allGridFilterKind.isBillsOnly:
            return {
                ...state, allGridFilterData: {
                    ...state.allGridFilterData,
                    isBillsOnly: action.payload.data.value
                }
            };
        default: {
            return state;
        }

    }
}

function setAllGridColumns(showDDA: boolean, showBalanceOnly: boolean, showURN: boolean, state: LedgerCardState) {
    return showDDA && showBalanceOnly && showURN ?
        state.allGridData.templet.balanceWithDDAandURN :
        !showDDA && !showBalanceOnly && !showURN ?
            state.allGridData.templet.withOutDDAAndURN :
            !showDDA && !showBalanceOnly && showURN ?
                state.allGridData.templet.withOutDDAAndwithURN :
                !showDDA && showBalanceOnly && showURN ?
                    state.allGridData.templet.balanceOnlyWithURN :
                    showDDA && showBalanceOnly && !showURN ?
                        state.allGridData.templet.balanceWithDDA :
                        showDDA && !showBalanceOnly && !showURN ?
                            state.allGridData.templet.allView :
                            !showDDA && showBalanceOnly && !showURN ?
                                state.allGridData.templet.balanceOnly :
                                showDDA && !showBalanceOnly && showURN ?
                                    state.allGridData.templet.allViewWithURN :
                                    state.allGridData.gridColumns;
}
function updateAllGridColoums(existingColumns: AllGrid, updatedColumns: ColumnDef[]) {
    return {
        ...existingColumns,
        gridColumns: updatedColumns
    };
}

function loadAllGridDataSuccess(state: LedgerCardState, action: Actions.LoadAllGridSuccess): Partial<LedgerCardState> {
    return { ...state, allGridData: loadAllGriddata(state.allGridData, action.payload.allGridPageData), isAllGridLoading: false };
}

function loadBillGridDataSuccess(state: LedgerCardState, action: Actions.LoadBillGridSuccess): Partial<LedgerCardState> {
    return { ...state, billGridData: loadBillGriddata(state.billGridData, action.payload.billData), isBillGridLoading: false };
}

function loadDISBSGridDataSuccess(state: LedgerCardState, action: Actions.LoadDisbsGridSuccess): Partial<LedgerCardState> {
    return { ...state, disbsGridData: loadDisbsGriddata(state.disbsGridData, action.payload.disbsGridPageData), isDISBSGridLoading: false };
}

function loadGBPGridDataSuccess(state: LedgerCardState, action: Actions.LoadGbpGridSuccess): Partial<LedgerCardState> {
    return { ...state, gbpGridData: loadGbpGriddata(state.gbpGridData, action.payload.gbpGridPageData), isGBPGridLoading: false };
}

function loadDDAGridDataSuccess(state: LedgerCardState, action: Actions.LoadDdaGridSuccess): Partial<LedgerCardState> {
    return { ...state, ddaGridData: loadDdaGriddata(state.ddaGridData, action.payload.ddaGridPageData), isDDAGridLoading: false };
}


function loadClient1GridDataSuccess(state: LedgerCardState, action: Actions.LoadClient1GridSuccess): Partial<LedgerCardState> {
    return {
        ...state, client1GridData: loadClientGriddata(state.client1GridData,
            action.payload.client1GridPageData), isClient1GridLoading: false
    };
}

function loadClient2GridDataSuccess(state: LedgerCardState, action: Actions.LoadClient2GridSuccess): Partial<LedgerCardState> {
    return {
        ...state, client2GridData: loadClientGriddata(state.client2GridData,
            action.payload.client2GridPageData), isClient2GridLoading: false
    };
}

function loadClient3GridDataSuccess(state: LedgerCardState, action: Actions.LoadClient3GridSuccess): Partial<LedgerCardState> {
    return {
        ...state, client3GridData: loadClientGriddata(state.client3GridData,
            action.payload.client3GridPageData), isClient3GridLoading: false
    };
}


function loadAllGridDataFail(state: LedgerCardState, action: Actions.LoadAllGridFail): Partial<LedgerCardState> {
    return { ...state, isAllGridLoading: false };
}

function loadBillGridDataFail(state: LedgerCardState, action: Actions.LoadBillGridFail): Partial<LedgerCardState> {
    return { ...state, isBillGridLoading: false };
}

function loadDISBSGridDataFail(state: LedgerCardState, action: Actions.LoadDisbsGridFail): Partial<LedgerCardState> {
    return { ...state, isDISBSGridLoading: false };
}

function loadGBPGridDataFail(state: LedgerCardState, action: Actions.LoadGbpGridFail): Partial<LedgerCardState> {
    return { ...state, isGBPGridLoading: false };
}

function loadDDAGridDataFail(state: LedgerCardState, action: Actions.LoadDdaGridFail): Partial<LedgerCardState> {
    return { ...state, isDDAGridLoading: false };
}

function loadClient1GridDataFail(state: LedgerCardState, action: Actions.LoadClient1GridFail): Partial<LedgerCardState> {
    return { ...state, isClient1GridLoading: false };
}

function loadClient2GridDataFail(state: LedgerCardState, action: Actions.LoadClient2GridFail): Partial<LedgerCardState> {
    return { ...state, isClient2GridLoading: false };
}

function loadClient3GridDataFail(state: LedgerCardState, action: Actions.LoadClient3GridFail): Partial<LedgerCardState> {
    return { ...state, isClient3GridLoading: false };
}

function loadEChitGridData(state: LedgerCardState, action: Actions.LoadEchitGrid): Partial<LedgerCardState> {
    return { ...state, isEChitGridLoading: true };
}

function loadEChitGridDataSuccess(state: LedgerCardState, action: Actions.LoadEchitGridSuccess): Partial<LedgerCardState> {
    return {
        ...state,
        eChitGridData: loadEChitGriddata(state.eChitGridData,
            action.payload.eChitGrid), isEChitGridLoading: false
    };
}

function loadEChitGriddata(existingData: EChitGrid, newData: EChitGridData) {
    return {
        ...existingData,
        data: newData
    };
}

function loadEChitGridDataFail(state: LedgerCardState, action: Actions.LoadEchitGridFail): Partial<LedgerCardState> {
    return { ...state, isEChitGridLoading: false };
}

function allDataUpdate(state: LedgerCardState, action: Actions.AllDataUpdate): Partial<LedgerCardState> {
    return {
        ...state,
        isMatterDataLoading: false,
        isMatterBalancesLoading: false,
        isAllGridLoading: false,
        isBillGridLoading: false,
        isDISBSGridLoading: false,
        isGBPGridLoading: false,
        isDDAGridLoading: false,
        isCurrencyViewLoading: false,
        isClient1GridLoading: false,
        isClient2GridLoading: false,
        isClient3GridLoading: false,
        isEChitGridLoading: false
    };
}

function allGridViewChange(state: LedgerCardState, action: Actions.AllGridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, allGridData: {
                    ...state.allGridData,
                    gridColumns: applyColumnFilter(state.allGridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, allGridData: {
                    ...state.allGridData,
                    gridColumns: clearColumnFilter(state.allGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, allGridData: {
                    ...state.allGridData,
                    gridColumns: applyFieldSort(state.allGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.PageChange:
            return {
                ...state, allGridData: {
                    ...state.allGridData,
                    PaginatorDef: paginatorChange(action.payload.value)
                }
            };
        case ViewChangeKind.periodColumnFilter:
            return {
                ...state, allGridData: {
                    ...state.allGridData,
                    gridColumns: applyPeriodFilter(state.allGridData.gridColumns, action.payload.value),
                }
            };
        default: {
            return state;
        }
    }
}

function applyPeriodFilter(gridColumns: ColumnDef[], value: string): ColumnDef[] {
    return gridColumns.map(val => {
        if (val.fieldName === 'Period') {
            return {
                ...val,
                filterActive: value ? true : false,
                filter: {
                    ...val.filter,
                    filters: [{ field: 'Period', operator: Operator.EqualTo, value: value, fieldType: FieldType.Number },
                    { field: 'Period', operator: Operator.EqualTo, value: '', fieldType: FieldType.Number }]
                }
            };
        }
        return val;
    });

}

function billGridViewChange(state: LedgerCardState, action: Actions.BillGridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, billGridData: {
                    ...state.billGridData,
                    gridColumns: applyColumnFilter(state.billGridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 0 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, billGridData: {
                    ...state.billGridData,
                    gridColumns: clearColumnFilter(state.billGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, billGridData: {
                    ...state.billGridData,
                    gridColumns: applyFieldSort(state.billGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        default: {
            return state;
        }
    }
}

function disbsGridViewChange(state: LedgerCardState, action: Actions.DisbsGridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, disbsGridData: {
                    ...state.disbsGridData,
                    gridColumns: applyColumnFilter(state.disbsGridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, disbsGridData: {
                    ...state.disbsGridData,
                    gridColumns: clearColumnFilter(state.disbsGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, disbsGridData: {
                    ...state.disbsGridData,
                    gridColumns: applyFieldSort(state.disbsGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.PageChange:
            return {
                ...state, disbsGridData: {
                    ...state.disbsGridData,
                    PaginatorDef: paginatorChange(action.payload.value)
                }
            };
        default: {
            return state;
        }
    }
}

function gbpGridViewChange(state: LedgerCardState, action: Actions.GbpGridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, gbpGridData: {
                    ...state.gbpGridData,
                    gridColumns: applyColumnFilter(state.gbpGridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, gbpGridData: {
                    ...state.gbpGridData,
                    gridColumns: clearColumnFilter(state.gbpGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, gbpGridData: {
                    ...state.gbpGridData,
                    gridColumns: applyFieldSort(state.gbpGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.PageChange:
            return {
                ...state, gbpGridData: {
                    ...state.gbpGridData,
                    PaginatorDef: paginatorChange(action.payload.value)
                }
            };
        default: {
            return state;
        }
    }
}

function ddaGridViewChange(state: LedgerCardState, action: Actions.DdaGridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, ddaGridData: {
                    ...state.ddaGridData,
                    gridColumns: applyColumnFilter(state.ddaGridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, ddaGridData: {
                    ...state.ddaGridData,
                    gridColumns: clearColumnFilter(state.ddaGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, ddaGridData: {
                    ...state.ddaGridData,
                    gridColumns: applyFieldSort(state.ddaGridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.PageChange:
            return {
                ...state, ddaGridData: {
                    ...state.ddaGridData,
                    PaginatorDef: paginatorChange(action.payload.value)
                }
            };
        default: {
            return state;
        }
    }
}

function client1GridViewChange(state: LedgerCardState, action: Actions.Client1GridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, client1GridData: {
                    ...state.client1GridData,
                    gridColumns: applyColumnFilter(state.client1GridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, client1GridData: {
                    ...state.client1GridData,
                    gridColumns: clearColumnFilter(state.client1GridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, client1GridData: {
                    ...state.client1GridData,
                    gridColumns: applyFieldSort(state.client1GridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.PageChange:
            return {
                ...state, client1GridData: {
                    ...state.client1GridData,
                    PaginatorDef: paginatorChange(action.payload.value)
                }
            };
        default: {
            return state;
        }
    }
}

function client2GridViewChange(state: LedgerCardState, action: Actions.Client2GridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, client2GridData: {
                    ...state.client2GridData,
                    gridColumns: applyColumnFilter(state.client2GridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, client2GridData: {
                    ...state.client2GridData,
                    gridColumns: clearColumnFilter(state.client2GridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, client2GridData: {
                    ...state.client2GridData,
                    gridColumns: applyFieldSort(state.client2GridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.PageChange:
            return {
                ...state, client2GridData: {
                    ...state.client2GridData,
                    PaginatorDef: paginatorChange(action.payload.value)
                }
            };
        default: {
            return state;
        }
    }
}


function client3GridViewChange(state: LedgerCardState, action: Actions.Client3GridViewChange): Partial<LedgerCardState> {
    switch (action.payload.kind) {
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state, client3GridData: {
                    ...state.client3GridData,
                    gridColumns: applyColumnFilter(state.client3GridData.gridColumns, action.payload.value as ColumnDef),
                    PaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
                }
            };
        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state, client3GridData: {
                    ...state.client3GridData,
                    gridColumns: clearColumnFilter(state.client3GridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state, client3GridData: {
                    ...state.client3GridData,
                    gridColumns: applyFieldSort(state.client3GridData.gridColumns, action.payload.value as ColumnDef),
                }
            };
        case ViewChangeKind.PageChange:
            return {
                ...state, client3GridData: {
                    ...state.client3GridData,
                    PaginatorDef: paginatorChange(action.payload.value)
                }
            };
        default: {
            return state;
        }
    }
}


function paginatorChange(pagerDef: PaginatorDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage
    };
}


function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def);
        }
        return def;
    });
}

function loadAllGriddata(existingData: AllGrid, newPageData: AllGridPageInfo) {
    return {
        ...existingData,
        allGridPage: newPageData
    };
}

function loadBillGriddata(existingData: BillGrid, newPageData: BillGridPageInfo) {
    let vatTotal = 0;
    let pcTotal = 0;
    let expeTotal = 0;
    let disbsTotal = 0;
    let grossTotal = 0;
    let paidTotal = 0;
    let outsTotal = 0;
    if (newPageData.data.length > 0) {
        newPageData.data.forEach(val => {
            vatTotal = vatTotal + val.vat;
            pcTotal = pcTotal + val.pc;
            expeTotal = expeTotal + val.expenses;
            disbsTotal = disbsTotal + val.disbs;
            grossTotal = grossTotal + val.gross;
            paidTotal = paidTotal + val.paidAmount;
            outsTotal = outsTotal + val.outstandigAmount;
        });
    }

    return {
        ...existingData,
        billGridPage: newPageData,
        total: {
            vatTotal: vatTotal,
            pcTotal: pcTotal,
            expeTotal: expeTotal,
            disbsTotal: disbsTotal,
            grossTotal: grossTotal,
            paidTotal: paidTotal,
            outsTotal: outsTotal,
        }
    };
}

function loadDisbsGriddata(existingData: DisbsGrid, newPageData: DisbsGridPageInfo) {
    return {
        ...existingData,
        disbsGridPage: newPageData
    };
}

function loadGbpGriddata(existingData: GBPGrid, newPageData: GBPGridPageInfo) {
    return {
        ...existingData,
        gbpGridPage: newPageData
    };
}

function loadDdaGriddata(existingData: DDAGrid, newPageData: DDAGridPageInfo) {
    return {
        ...existingData,
        ddaGridPage: newPageData
    };
}

function loadClientGriddata(existingData: ClientGrid, newPageData: ClientGridPageInfo) {
    return {
        ...existingData,
        clientGridPage: newPageData
    };
}

function setMatterBalance(state: LedgerCardState, newBalancess: MatterBalances) {
    let newData: MatterBalances = null;
    if (!newBalancess) {
        newData = {
            officeBalance: 0,
            unpaidBills: 0,
            dpuBalance: 0,
            currencyCode: '',
            dubBalance: 0,
            clientBalance: 0,
            ddaBalance: 0,
            wipBalance: 0,
            utBalance: 0,
            officeAMBalance: 0,
            clientAMBalance: 0,
            ddaamBalance: 0,
            duuBalance: 0,
        };
    } else if (state.matterBalances) {
        newData = newBalancess;
    }
    return newData;
}

function setInitFilterValue() {
    let newValue: AllGridFilterModel = null;
    newValue = {
        showDDA: true,
        showBalanceOnly: false,
        showCOS: true,
        showReversal: true,
        showURN: false,
        showSysBills: false,
        showTransPeriods: false,
        showOnlyOfficeTrans: false,
        showOnlyDisbuersements: false,
        periodText: '',
        isActiveClass: false,
        isBillsOnly: false,
    };
    return newValue;
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getIsloadingByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ?
        (state.isMatterBalancesLoading && state.isMatterBalancesLoading === true) ||
        (state.isAllGridLoading && state.isAllGridLoading === true) ||
        (state.isBillGridLoading && state.isBillGridLoading === true) ||
        (state.isDISBSGridLoading && state.isDISBSGridLoading === true) ||
        (state.isGBPGridLoading && state.isGBPGridLoading === true) ||
        (state.isDDAGridLoading && state.isDDAGridLoading === true) ||
        (state.isCurrencyViewLoading && state.isCurrencyViewLoading === true) ||
        (state.isClient1GridLoading && state.isClient1GridLoading === true) ||
        (state.isClient2GridLoading && state.isClient2GridLoading === true) ||
        (state.isClient3GridLoading && state.isClient3GridLoading === true) ||
        (state.isAllMaterCountLoading && state.isAllMaterCountLoading === true ||
            (state.isEChitGridLoading && state.isEChitGridLoading === true))
        : false);
export const getMatterDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.matterData : null);
export const getSelectedTabIndexByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.selectedTabIndex : null);
export const getCurrencyViewByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.currencyView : null);
export const getMatterBalancesByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.matterBalances : null);
export const getCurrencyLabelByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.currencyLabel : null);
export const getAllGridFilterDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.allGridFilterData : null);
export const getAllGridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.allGridData : null);
export const getBillGridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.billGridData : null);
export const getDisbsGridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.disbsGridData : null);
export const getGbpGridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.gbpGridData : null);
export const getDdaGridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.ddaGridData : null);
export const getClient1GridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.client1GridData : null);
export const getClient2GridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.client2GridData : null);
export const getClient3GridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.client3GridData : null);
export const getEchitGridDataByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.eChitGridData : null);
export const getAllMatterCountByToken = (token) =>
    createSelector(getStateByToken(token), (ledgerCardState) => ledgerCardState ? ledgerCardState.allMatterCount : null);


