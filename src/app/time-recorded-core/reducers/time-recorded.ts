
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ViewChangeKind, gridFilterKind, GroupMode } from '../models/enumeration';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../core/lib/grid-model';
import {
    GridRowItemWrapper, ItemRepository, RequestHashInfo, Department,
    Type, Periods, SelectedInfo, UserPermission
} from '../models/interfce';
import { GridTemplete, FromToDate, Summery, GridData } from '../models/interfce';
import { clearFilters, applyFieldSort, applyColumnFilter, applyGroupFilter, removeFiltertionOptin } from '../../core/lib/grid-helpers';
import { dpsNewDate } from '../../utils/javascriptDate';
export interface State {
    readonly [token: string]: TimeRecordedState;
}

export interface TimeRecordedState {
    readonly departmentLoading: boolean;
    // readonly financeLoading: boolean;
    readonly isRecordTimeLoading: boolean;
    readonly isGridLoading: boolean;
    readonly typesLoading: boolean;
    readonly periodsLoading: boolean;
    readonly loadSummery: boolean;
    readonly fromToDateLoading: boolean;
    readonly UserPermissionLoading: boolean;
    readonly UserPermission: UserPermission;
    readonly gridData: GridData[];
    readonly gridGroupData: GridGroupData[];
    readonly totalItem: number;
    readonly selectedRow: GridRowItemWrapper;
    readonly itemRepository: ItemRepository;
    readonly requestHash: RequestHashInfo[];
    readonly departments: Department[];
    readonly type: Type[];
    readonly periods: Periods[];
    readonly selectedInfo: SelectedInfo;
    readonly columnDef: ColumnDef[];
    readonly previesColumnDef: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly viewChangeKind: ViewChangeKind;
    readonly gridTemplete: GridTemplete;
    readonly summery: Summery;
    readonly groupMode: GroupMode;
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_TIME_RECORDED:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_RECORD_TIME_LIST:
            tmp[action.token] = loadRecordTimeList(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_RECORD_TIME_LIST_SUCCESS:
            tmp[action.token] = loadRecordTimeListSuccess(state[action.token], action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_RECORD_TIME_LIST_FAIL:
            tmp[action.token] = loadRecordTimeListFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS:
            tmp[action.token] = loadDepartments(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS_SUCCESS:
            tmp[action.token] = getLoadDepartmentsSuccess(state[action.token], action, action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS_FAIL:
            tmp[action.token] = getLoadDepartmentsFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_TYPES:
            tmp[action.token] = loadTypes(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_TYPES_SUCCESS:
            tmp[action.token] = getLoadTypesSuccess(state[action.token], action, action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_TYPES_FAIL:
            tmp[action.token] = getLoadTypesFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS:
            tmp[action.token] = loadPeriod(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS_SUCCESS:
            tmp[action.token] = getLoadPeriodsSuccess(state[action.token], action, action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS_FAIL:
            tmp[action.token] = getLoadPeriodsFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_USER_PERMISSION:
            tmp[action.token] = loadUserPermission(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_USER_PERMISSION_SUCCESS:
            tmp[action.token] = getloadUserPermissionSuccess(state[action.token], action, action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_USER_PERMISSION_FAIL:
            tmp[action.token] = getloadUserPermissionFail(state[action.token], action);
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
        case Actions.GRID_FILTER_UPDATE:
            tmp[action.token] = changeGridFilter(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_FROM_TO_DATE:
            tmp[action.token] = loadFromToData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_FROM_TO_DATE_SUCCESS:
            tmp[action.token] = getLoadFromToDataSuccess(state[action.token], action, action.payload.dates);
            return { ...state, ...tmp };
        case Actions.LOAD_FROM_TO_DATE_FAIL:
            tmp[action.token] = getLoadFromToDataFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GRID_VIEW_CHANGE:
            tmp[action.token] = viewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_SUMMERY:
            tmp[action.token] = loadSummery(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_SUMMERY_SUCCESS:
            tmp[action.token] = getloadSummerySuccess(state[action.token], action, action.payload.data);
            return { ...state, ...tmp };
        case Actions.LOAD_SUMMERY_FAIL:
            tmp[action.token] = getloadSummeryFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CHANGE_SELECT_ROW:
            tmp[action.token] = changeSelectRow(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GROUP_DATA:
            tmp[action.token] = changeGroupMode(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GROUP_DATA_REQUEST:
            tmp[action.token] = requestGroupData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GRID_REFRESH:
            tmp[action.token] = refresh(state[action.token]);
            return { ...state, ...tmp };
        case Actions.EXPORT_TO_EXCEL:
            tmp[action.token] = { ...state[action.token], isRecordTimeLoading: true };
            return { ...state, ...tmp };
        case Actions.EXPORT_TO_EXCEL_SUCCESS:
            tmp[action.token] = { ...state[action.token], isRecordTimeLoading: false };
            return { ...state, ...tmp };
        case Actions.EXPORT_TO_EXCEL_FAIL:
            tmp[action.token] = { ...state[action.token], isRecordTimeLoading: false };
            return { ...state, ...tmp };
        case Actions.TIME_RECORDED_DATE_TIME_CHANGE:
            tmp[action.token] = dateTypeChange(state[action.token], action);
            return { ...state, ...tmp };
        default: {
            return state;
        }
    }
}

function initView(state: TimeRecordedState, action: Actions.InitTimeRecorded): Partial<TimeRecordedState> {
    if (!state) {
        return {
            ...state,
            departmentLoading: true,
            typesLoading: true,
            periodsLoading: true,
            // financeLoading: true,
            isGridLoading: true,
            loadSummery: true,
            selectedRow: null,
            itemRepository: null,
            requestHash: null,
            departments: null,
            selectedInfo: setInitialSelection(action.payload.timeOffset),
            columnDef: action.payload.gridTemplete.unBilldColumnDef,
            previesColumnDef: action.payload.gridTemplete.unBilldColumnDef,
            gridTemplete: action.payload.gridTemplete,
            paginatorDef: action.payload.paginatorDef,
            viewChangeKind: null,
            gridData: [],
            gridGroupData: [],
            totalItem: 0,
            summery: null,
            groupMode: GroupMode.Default
        };
    } else {
        return state;
    }
}

function setInitialSelection(timeOffset) {
    return {
        departmentId: null,
        typeId: 1,
        periodId: 0,
        dateFrom: dpsNewDate(timeOffset),
        dateTo: dpsNewDate(timeOffset),
        user: null,
        searchText: null,
        isBillDate: false,
    };
}
function loadRecordTimeList(state: TimeRecordedState): Partial<TimeRecordedState> {
    return { ...state, isRecordTimeLoading: true };
}
function loadRecordTimeListSuccess(state: TimeRecordedState, newData: Department[]): Partial<TimeRecordedState> {
    return { ...state, isRecordTimeLoading: false };
}
function loadRecordTimeListFail(state: TimeRecordedState): Partial<TimeRecordedState> {
    return { ...state, isRecordTimeLoading: false };
}
function loadDepartments(state: TimeRecordedState, action: Actions.LoadDepartments): Partial<TimeRecordedState> {
    return { ...state, departmentLoading: true };
}
function getLoadDepartmentsSuccess(state: TimeRecordedState, action: Actions.LoadDepartmentsSuccess,
    newData: Department[]): Partial<TimeRecordedState> {
    return { ...state, departments: newData, departmentLoading: false };
}
function getLoadDepartmentsFail(state: TimeRecordedState, action: Actions.LoadDepartmentsFail): Partial<TimeRecordedState> {
    return { ...state, departmentLoading: false };
}
function loadTypes(state: TimeRecordedState, action: Actions.LoadTypes): Partial<TimeRecordedState> {
    return { ...state, typesLoading: true };
}
function getLoadTypesSuccess(state: TimeRecordedState, action: Actions.LoadTypesSuccess, newData: Type[]): Partial<TimeRecordedState> {
    return { ...state, type: newData, typesLoading: false };
}
function getLoadTypesFail(state: TimeRecordedState, action: Actions.LoadTypesFail): Partial<TimeRecordedState> {
    return { ...state, typesLoading: false };
}
function loadPeriod(state: TimeRecordedState, action: Actions.LoadPeriods): Partial<TimeRecordedState> {
    return { ...state, periodsLoading: true };
}
function getLoadPeriodsSuccess(state: TimeRecordedState, action: Actions.LoadPeriodsSuccess,
    newData: Periods[]): Partial<TimeRecordedState> {
    return { ...state, periods: newData, periodsLoading: false };
}
function getLoadPeriodsFail(state: TimeRecordedState, action: Actions.LoadPeriodsFail): Partial<TimeRecordedState> {
    return { ...state, periodsLoading: false };
}
function loadUserPermission(state: TimeRecordedState, action: Actions.LoadUserPermission): Partial<TimeRecordedState> {
    return { ...state, UserPermissionLoading: true };
}
function getloadUserPermissionSuccess(state: TimeRecordedState, action: Actions.LoadUserPermissionSuccess,
    newData: UserPermission): Partial<TimeRecordedState> {
    return { ...state, UserPermission: newData, UserPermissionLoading: false };
}
function getloadUserPermissionFail(state: TimeRecordedState, action: Actions.LoadUserPermissionFail): Partial<TimeRecordedState> {
    return { ...state, UserPermissionLoading: false };
}
function changeGridFilter(state: TimeRecordedState, action: Actions.GridFilterChange): Partial<TimeRecordedState> {
    switch (action.payload.newData.kind) {
        case gridFilterKind.type:
            const newcolums = state.groupMode !== GroupMode.Default ?
                removeFiltertionOptin(changeGridTamblete(state.gridTemplete, action.payload.newData.value)) :
                changeGridTamblete(state.gridTemplete, action.payload.newData.value);
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    typeId: action.payload.newData.value

                },
                columnDef: newcolums,
                previesColumnDef: changeGridTamblete(state.gridTemplete, action.payload.newData.value),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case gridFilterKind.department:
            const newcolumsx = state.groupMode !== GroupMode.Default ?
                removeFiltertionOptin(clearAllColumnFilter(state.columnDef)) :
                clearAllColumnFilter(state.columnDef);
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    departmentId: action.payload.newData.value,
                    user: ''
                },
                columnDef: newcolumsx,
                // previesColumnDef: clearAllColumnFilter(state.columnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case gridFilterKind.period:
            const newcolumsy = state.groupMode !== GroupMode.Default ?
                removeFiltertionOptin(clearAllColumnFilter(state.columnDef)) :
                clearAllColumnFilter(state.columnDef);
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    periodId: action.payload.newData.value,
                    dateFrom: action.payload.newData.fromDate,
                    dateTo: action.payload.newData.toDate
                },
                columnDef: newcolumsy,
                // previesColumnDef: clearAllColumnFilter(state.columnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })

            };
        case gridFilterKind.searchText:
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    searchText: action.payload.newData.value
                },
                // columnDef: clearAllColumnFilter(state.columnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case gridFilterKind.user:
            const newcolumsz = state.groupMode !== GroupMode.Default ?
                removeFiltertionOptin(clearAllColumnFilter(state.columnDef)) :
                clearAllColumnFilter(state.columnDef);
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    user: action.payload.newData.value
                },
                columnDef: newcolumsz,
                // previesColumnDef: clearAllColumnFilter(state.columnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        default: {
            return state;
        }

    }
}

function changeGridTamblete(GridTemlete: GridTemplete, newType: number) {
    switch (newType) {
        case 0: {
            return clearAllColumnFilter(GridTemlete.billdColumnDef);
        }
        case 1: {
            return clearAllColumnFilter(GridTemlete.unBilldColumnDef);
        }
        case 2: {
            return clearAllColumnFilter(GridTemlete.allColumnDef);
        }
        default: {
            return clearAllColumnFilter(GridTemlete.allColumnDef);
        }
    }
}

function clearAllColumnFilter(current: ColumnDef[]) {
    return current.map((def) => {
        return clearFilters(def);
    });
}

function loadFromToData(state: TimeRecordedState, action: Actions.LoadFromToDate): Partial<TimeRecordedState> {
    return { ...state, fromToDateLoading: true };
}

function getLoadFromToDataSuccess(state: TimeRecordedState, action: Actions.LoadFromToDateSuccess,
    newData: FromToDate): Partial<TimeRecordedState> {
    const newcolums = state.groupMode !== GroupMode.Default ?
        removeFiltertionOptin(clearAllColumnFilter(state.columnDef)) :
        clearAllColumnFilter(state.columnDef);
    return {
        ...state, selectedInfo: {
            ...state.selectedInfo,
            dateFrom: action.payload.dates.fromDate,
            dateTo: action.payload.dates.toDate,
            periodId: action.payload.periadId
        }
        , fromToDateLoading: false
        , columnDef: newcolums
        // , previesColumnDef: clearAllColumnFilter(state.columnDef)
        , paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
    };
}

function getLoadFromToDataFail(state: TimeRecordedState, action: Actions.LoadFromToDateFail): Partial<TimeRecordedState> {
    return { ...state, fromToDateLoading: false };
}

function loadGridData(state: TimeRecordedState, action: Actions.LoadGrid): Partial<TimeRecordedState> {
    return { ...state, isGridLoading: true };
}

function getHashKeyForGroup(selectedInfo: SelectedInfo): string {
    return selectedInfo.dateFrom.toString() + selectedInfo.dateTo.toString()
        + selectedInfo.departmentId + selectedInfo.periodId + selectedInfo.searchText
        + selectedInfo.typeId + selectedInfo.user + selectedInfo.isBillDate;
}

function loadGridDataSuccess(state: TimeRecordedState, action: Actions.LoadGridSuccess,
    newData: any): Partial<TimeRecordedState> {

    if (action.payload.gridGroupData) {
        return {
            ...state,
            gridData: newData.data ? state.gridData.concat(newData.data.map(row => {
                return { ...row, groupHash: action.payload.gridGroupData.groupHash };
            })) : [],
            isGridLoading: false,
            gridGroupData: state.gridGroupData ? state.gridGroupData.map(g => {
                if (g.groupHash === action.payload.gridGroupData.groupHash) {
                    return { ...g, currentItems: g.currentItems + 50 };
                } else {
                    return g;
                }

            }) : state.gridGroupData,
        };
    } else {
        const hasKey = getHashKeyForGroup(state.selectedInfo);
        return {
            ...state,
            gridData: !!newData.data && newData.data.length > 0 ? selectRowChange(newData.data, newData.data[0]) : [],
            totalItem: newData.total,
            gridGroupData: newData.group ? newData.group.map(g => {
                return { ...g, groupHash: g.filterValue + hasKey, currentItems: 0 };
            }) : [],
            isGridLoading: false
        };
    }
}

function loadGridDataFail(state: TimeRecordedState, action: Actions.LoadGridFail): Partial<TimeRecordedState> {
    return { ...state, isGridLoading: false };
}

function viewChange(state: TimeRecordedState, action: Actions.GridViewChange): Partial<TimeRecordedState> {
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
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
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
function loadSummery(state: TimeRecordedState, action: Actions.LoadSummery): Partial<TimeRecordedState> {
    return { ...state, loadSummery: true };
}
function getloadSummerySuccess(state: TimeRecordedState, action: Actions.LoadSummerySuccess,
    newData: Summery): Partial<TimeRecordedState> {
    return { ...state, summery: newData, loadSummery: false };
}
function getloadSummeryFail(state: TimeRecordedState, action: Actions.LoadSummeryFail): Partial<TimeRecordedState> {
    return { ...state, loadSummery: false };
}
function changeSelectRow(state: TimeRecordedState, action: Actions.GridChangeSelectRow): Partial<TimeRecordedState> {
    return { ...state, gridData: selectRowChange(state.gridData, action.payload.row) };
}
function changeGroupMode(state: TimeRecordedState, action: Actions.GroupData): Partial<TimeRecordedState> {
    return {
        ...state,
        groupMode: action.payload.type,
        columnDef: action.payload.type !== GroupMode.Default ?
            removeFiltertionOptin(clearAllColumnFilter(state.columnDef)) : clearAllColumnFilter(state.previesColumnDef),
    };
}
function requestGroupData(state: TimeRecordedState, action: Actions.GroupDataRequest): Partial<TimeRecordedState> {
    return {
        ...state,
        columnDef: applyGroupFilter(state.columnDef, [action.payload.gridGroupData.filterValue], ['TimeDate']),
        gridGroupData: state.gridGroupData ? state.gridGroupData.map(g => {
            if (g.groupHash === action.payload.gridGroupData.groupHash) {
                return { ...g, select: action.payload.isLoadMore ? g.select : !g.select };
            } else {
                return g;
            }

        }) : state.gridGroupData,
    };
}
function refresh(state: TimeRecordedState,) {
    return {
        ...state,
        columnDef: state.groupMode !== GroupMode.Default ? clearAllColumnFilter(state.columnDef) : state.columnDef
    };
}

function dateTypeChange(state: TimeRecordedState, action: Actions.DateTypeDange): Partial<TimeRecordedState> {
    return {
        ...state,
        selectedInfo: {
            ...state.selectedInfo,
            isBillDate: action.dateType,
        }
    };
}
// function removeFiltertionOptin(columnDef) {
//     return columnDef.map(c => {
//         return {
//             ...c, extras: {
//                 ...c.extras,
//                 filterHidden: true,
//                 disableShort: true
//             }
//         };
//     }
//     );
// }
function selectRowChange(currentData: GridData[], newRow: GridData): GridData[] {
    return currentData.map(row => {
        if (row === newRow) {
            return Object.freeze({ ...row, select: !row.select });
        } else if (row.select) {
            return Object.freeze({ ...row, select: false });
        } else {
            return row;
        }
    });
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getIsloadingByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ?
        (state.departmentLoading && state.departmentLoading === true) ||
        // (state.financeLoading && state.financeLoading === true) ||
        (state.typesLoading && state.typesLoading === true) ||
        (state.periodsLoading && state.periodsLoading === true) ||
        (state.UserPermissionLoading && state.UserPermissionLoading === true) ||
        (state.isRecordTimeLoading && state.isRecordTimeLoading === true) ||
        (state.fromToDateLoading && state.fromToDateLoading === true) ||
        (state.loadSummery && state.loadSummery === true) ||
        (state.isGridLoading && state.isGridLoading === true)
        : false);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : null);
export const getPeginatorDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.paginatorDef : null);
export const getDepartmentByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.departments : null);
export const getTypeByToken = (token) => createSelector(getStateByToken(token), (state) => state && state.type ? state.type : null);
export const getPeriodByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.periods : null);
export const getSelectedInfoByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectedInfo : null);
export const getUserPermisionByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.UserPermission : null);
export const getGridDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridData : null);
export const getTotalItemByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.totalItem : null);
export const getSummeryByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.summery : null);
export const getSelectGroupModeByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.groupMode : '');
export const getGroupDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridGroupData : '');


