import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';

import { ColumnDef, PaginatorDef, GridGroupData } from '../../core/lib/grid-model';
import {
    Department, Periods, SelectedInfo, GridData, MatterFinance, Summery,
    GridDataObject, GroupMode
} from '../models/interfce';
import { gridFilterKind, ViewChangeKind } from '../models/enumeration';
import { MessageItemWrapper } from '../../mail-item-core';
import { clearFilters, applyFieldSort, applyColumnFilter, createDefultColumnDef, applyGroupFilter } from '../../core/lib/grid-helpers';
import { FieldType, Operator } from '../../odata';
import { dpsNewDate } from '../../utils/javascriptDate';

export interface State {
    readonly [token: string]: WorkDoneState;
}

export interface WorkDoneState {
    readonly departmentLoading: boolean;
    readonly financeLoading: boolean;
    readonly isGridLoading: boolean;
    readonly periodsLoading: boolean;
    readonly loadSummery: boolean;
    readonly fromToDateLoading: boolean;
    readonly loadDocURL: boolean;
    readonly gridData: GridData[];
    readonly gridGroupData: GridGroupData[];
    readonly passwordRequestRow: GridData;
    readonly expandRow: GridData;
    readonly totalItem: number;
    readonly departments: Department[];
    readonly periods: Periods[];
    readonly selectedInfo: SelectedInfo;
    readonly columnDef: ColumnDef[];
    readonly originalColumnDef: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly summery: Summery;
    readonly passWordInvalid: boolean;
    readonly groupMode: GroupMode;
    readonly selectGroupHash: string[];
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_WORK_DONE:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS:
            tmp[action.token] = loadDepartments(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS_SUCCESS:
            tmp[action.token] = getLoadDepartmentsSuccess(state[action.token], action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS_FAIL:
            tmp[action.token] = getLoadDepartmentsFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS:
            tmp[action.token] = loadPeriod(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS_SUCCESS:
            tmp[action.token] = getLoadPeriodsSuccess(state[action.token], action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS_FAIL:
            tmp[action.token] = getLoadPeriodsFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_GRID_DATA:
            tmp[action.token] = loadGridData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_GRID_DATA_SUCCESS:
            tmp[action.token] = loadGridDataSuccess(state[action.token], action, action.payload.pageData);
            return { ...state, ...tmp };
        case Actions.LOAD_GRID_DATA_FAIL:
            tmp[action.token] = loadGridDataFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GRID_FILTER_UPDATE:
            tmp[action.token] = changeGridFilter(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_FROM_TO_DATE:
            tmp[action.token] = loadFromToData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_FROM_TO_DATE_SUCCESS:
            tmp[action.token] = getLoadFromToDataSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_FROM_TO_DATE_FAIL:
            tmp[action.token] = getLoadFromToDataFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GRID_ROW_EXPAND:
            tmp[action.token] = gridRowExpand(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_MATTER_FINANCE:
            tmp[action.token] = getMatterFinace(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_MATTER_FINANCE_SUCCESS:
            tmp[action.token] = getMatterFinaceSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_MATTER_FINANCE_FAIL:
            tmp[action.token] = getMatterFinaceFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GRID_VIEW_CHANGE:
            tmp[action.token] = viewChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_SUMMERY:
            tmp[action.token] = loadSummery(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_SUMMERY_SUCCESS:
            tmp[action.token] = getloadSummerySuccess(state[action.token], action.payload.data);
            return { ...state, ...tmp };
        case Actions.LOAD_SUMMERY_FAIL:
            tmp[action.token] = getloadSummeryFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_DOCUMENT_URL:
            tmp[action.token] = getDocURL(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_DOCUMENT_URL_SUCCESS:
            tmp[action.token] = getDocURLSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_DOCUMENT_URL_FAIL:
            tmp[action.token] = getDocURLFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_EMAIL_ITEM_SUCCESS:
            tmp[action.token] = getEmailItemSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.VIEW_DOC:
            tmp[action.token] = viewDoc(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_DOC_PASSWORD:
            tmp[action.token] = requestPassword(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.SET_DOC_PASSWORD:
            tmp[action.token] = setPassword(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.REMOVE_PASSWORD_REQUEST_ROW:
            tmp[action.token] = RemovePasswordRequest(state[action.token]);
            return { ...state, ...tmp };
        case Actions.PASSWORD_INVALID:
            tmp[action.token] = PasswordInvalid(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GROUP_DATA:
            tmp[action.token] = changeGroupMode(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GROUP_DATA_REQUEST:
            tmp[action.token] = requestGroupData(state[action.token], action);
            return { ...state, ...tmp };
        default: {
            return state;
        }
    }
}

function initView(state: WorkDoneState, action: Actions.InitWorkDone): Partial<WorkDoneState> {
    if (!state) {
        return {
            ...state,
            departmentLoading: false,
            columnDef: action.payload.columnDef,
            originalColumnDef: action.payload.columnDef,
            paginatorDef: action.payload.paginatorDef,
            departments: null,
            periodsLoading: false,
            financeLoading: false,
            isGridLoading: false,
            loadSummery: false,
            loadDocURL: false,
            passwordRequestRow: null,
            selectedInfo: setInitialSelection(action.payload.timeOffset),
            totalItem: 0,
            summery: null,
            groupMode: GroupMode.Default,
            selectGroupHash: []
        };
    } else {
        return state;
    }
}


function setInitialSelection(timeOffset) {
    return {
        departmentId: null,
        periodId: 0,
        dateFrom: dpsNewDate(timeOffset),
        dateTo: dpsNewDate(timeOffset),
        user: null,
        searchText: null
    };
}

function loadDepartments(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, departmentLoading: true };
}

function getLoadDepartmentsSuccess(state: WorkDoneState, newData: Department[]): Partial<WorkDoneState> {
    return { ...state, departments: newData, departmentLoading: false };
}

function getLoadDepartmentsFail(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, departmentLoading: false };
}

function loadPeriod(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, periodsLoading: true };
}

function getLoadPeriodsSuccess(state: WorkDoneState, newData: Periods[]): Partial<WorkDoneState> {
    return {
        ...state,
        periods: newData,
        periodsLoading: false,
    };
}

function getLoadPeriodsFail(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, periodsLoading: false };
}

function changeGridFilter(state: WorkDoneState, action: Actions.GridFilterChange): Partial<WorkDoneState> {
    switch (action.payload.newData.kind) {
        case gridFilterKind.department:
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    departmentId: action.payload.newData.value,
                    user: ''
                },
                columnDef: clearAllColumnFilter(state.columnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case gridFilterKind.period:
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    periodId: action.payload.newData.value,
                    dateFrom: action.payload.newData.fromDate,
                    dateTo: action.payload.newData.toDate
                },
                columnDef: clearAllColumnFilter(state.columnDef),
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
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    user: action.payload.newData.value
                },
                columnDef: clearAllColumnFilter(state.columnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        default: {
            return state;
        }

    }
}

function clearAllColumnFilter(current: ColumnDef[]) {
    return current.map((def) => {
        return clearFilters(def);
    });
}

function loadFromToData(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, fromToDateLoading: true };
}

function getLoadFromToDataSuccess(state: WorkDoneState, action: Actions.LoadFromToDateSuccess): Partial<WorkDoneState> {
    return {
        ...state, selectedInfo: {
            ...state.selectedInfo,
            dateFrom: action.payload.dates.fromDate,
            dateTo: action.payload.dates.toDate,
            periodId: action.payload.periodId
        }
        , fromToDateLoading: false
        , columnDef: clearAllColumnFilter(state.columnDef)
        , paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
    };
}

function getLoadFromToDataFail(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, fromToDateLoading: false };
}

function gridRowExpand(state: WorkDoneState, action: Actions.GridRowExpand): Partial<WorkDoneState> {
    const currentExpand = state.expandRow ? state.expandRow.diary_UID : null;
    return {
        ...state,
        expandRow: action.payload.row.diary_UID !== currentExpand ? action.payload.row : null
    };
}

function loadGridData(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, isGridLoading: true };
}

function mapGroupHash(group: GridGroupData[], hasKey: string, perentfilterValue?: string): GridGroupData[] {
    return group.map(g => {

        const groupHash = g.value + g.perentfilterValue + g.filterValue + g.selectorField + hasKey;

        return {
            ...g,
            groupHash: groupHash,
            currentItems: 0,
            items: g.items && g.items.length > 0 ? mapGroupHash(g.items, groupHash, g.filterValue) : [],
            perentfilterValue: perentfilterValue
        };
    });
}

function changeGroupCurentItemCount(group: GridGroupData[], selecGroup: GridGroupData) {
    return group.map(g => {
        if (g.groupHash === selecGroup.groupHash) {
            return {
                ...g,
                currentItems: g.currentItems + 50,
            };
        } else if (g.items && g.items.length > 0) {
            return {
                ...g,
                items: changeGroupCurentItemCount(g.items, selecGroup)
            };
        } else {
            return g;
        }

    });
}

function loadGridDataSuccess(state: WorkDoneState, action: Actions.LoadGridSuccess, newData: GridDataObject): Partial<WorkDoneState> {

    if (action.payload.gridGroupData) {
        return {
            ...state,
            gridData: newData.data ? state.gridData.concat(newData.data.map(row => {
                return { ...row, groupHash: action.payload.gridGroupData.groupHash };
            })) : [],
            isGridLoading: false,
            gridGroupData: state.gridGroupData ? changeGroupCurentItemCount(state.gridGroupData, action.payload.gridGroupData)
                : state.gridGroupData
        };

    } else {
        const hasKey = getHashKeyForGroup(state.selectedInfo);
        return {
            ...state,
            gridData: newData.data ? newData.data : [],
            totalItem: newData.total,
            gridGroupData: newData.group ? mapGroupHash(newData.group, hasKey) : [],
            isGridLoading: false,
            expandRow: !!newData.data && newData.data.length > 0 ? newData.data[0] : null,
            selectGroupHash: []
        };
    }

}

function getHashKeyForGroup(selectedInfo: SelectedInfo): string {
    return selectedInfo.dateFrom.toString() + selectedInfo.dateTo.toString()
        + selectedInfo.departmentId + selectedInfo.periodId + selectedInfo.searchText
        + selectedInfo.user;
}

function changeGroupMode(state: WorkDoneState, action: Actions.GroupData): Partial<WorkDoneState> {
    return {
        ...state,
        groupMode: action.payload.type,
        columnDef: action.payload.type !== GroupMode.Default ?
            removeFiltertionOptin(clearAllColumnFilter(state.originalColumnDef),
                action.payload.type) : clearAllColumnFilter(state.originalColumnDef),
    };
}



function requestGroupData(state: WorkDoneState, action: Actions.GroupDataRequest): Partial<WorkDoneState> {

    let groupByVal: string[];
    let filterValue: string[];
    if (action.payload.gridGroupData.selectorField === GroupMode.ByUser) {
        filterValue = [action.payload.gridGroupData.filterValue];
        groupByVal = ['by'];
    } else if (action.payload.gridGroupData.selectorField === GroupMode.Date) {
        filterValue = [action.payload.gridGroupData.filterValue];
        groupByVal = ['Diary_DATEDN'];
    } else if (action.payload.gridGroupData.selectorField === GroupMode.ByUserDate) {
        filterValue = [action.payload.gridGroupData.perentfilterValue, action.payload.gridGroupData.filterValue];
        groupByVal = ['by', 'Diary_DATEDN'];
    } else if (action.payload.gridGroupData.selectorField === GroupMode.DateByUser) {
        filterValue = [action.payload.gridGroupData.perentfilterValue, action.payload.gridGroupData.filterValue];
        groupByVal = ['Diary_DATEDN', 'by'];
    }


    return {
        ...state,
        columnDef: applyGroupFilter(state.columnDef, filterValue, groupByVal),
        selectGroupHash: action.payload.isLoadMore ? state.selectGroupHash :
            selectGroup(state.selectGroupHash, action.payload.gridGroupData.groupHash),
    };
}

function selectGroup(selectGroupHashs: string[], selectGroupHash: string): string[] {
    if (selectGroupHashs.find(gh => gh === selectGroupHash)) {
        return selectGroupHashs.filter(gh => gh !== selectGroupHash);
    } else {
        return selectGroupHashs.concat(selectGroupHash);
    }

}

function removeFiltertionOptin(columnDef: ColumnDef[], groupType: GroupMode) {
    return columnDef.filter(c => c.fieldName !== groupType).map(c => {
        return {
            ...c, extras: {
                ...c.extras,
                filterHidden: true,
                disableShort: true
            }
        };
    }
    );
}

function loadGridDataFail(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, isGridLoading: false };
}

function viewChange(state: WorkDoneState, action: Actions.GridViewChange): Partial<WorkDoneState> {
    switch (action.payload.kind) {
        case ViewChangeKind.GroupModeChange:
            let columnDef = [];

            if (action.payload.value === GroupMode.ByUser) {
                columnDef = [
                    createDefultColumnDef('Toggle',
                        { label: '', fxFlex: '32px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('Diary_DATEDN',
                        { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
                    createDefultColumnDef('By',
                        { label: 'By', fxFlex: '54px', filterAnchor: 'start', hidden: true }),
                    createDefultColumnDef('Diary_RECTYPE',
                        { label: 'Type', fxFlex: '54px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('MatterReferenceNo',
                        { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                    createDefultColumnDef('Diary_FEE_EARNER',
                        { label: 'For', fxFlex: '55px', filterAnchor: 'start' }),
                    createDefultColumnDef('SAL_Account_Name',
                        { label: 'Client', fxFlex: '8', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailFrom',
                        { label: 'From', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailTo',
                        { label: 'To', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('Note',
                        { label: 'Work', fxFlex: '18', filterAnchor: 'end' }),
                    createDefultColumnDef('Details',
                        { label: 'Details', fxFlex: '', filterAnchor: 'end' }),
                ];
            } else if (action.payload.value === GroupMode.Date) {
                columnDef = [
                    createDefultColumnDef('Toggle',
                        { label: '', fxFlex: '32px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('Diary_DATEDN',
                        { label: 'Date', fxFlex: '80px', filterAnchor: 'start', hidden: true }, FieldType.Date),
                    createDefultColumnDef('By',
                        { label: 'By', fxFlex: '54px', filterAnchor: 'start' }),
                    createDefultColumnDef('Diary_RECTYPE',
                        { label: 'Type', fxFlex: '54px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('MatterReferenceNo',
                        { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                    createDefultColumnDef('Diary_FEE_EARNER',
                        { label: 'For', fxFlex: '55px', filterAnchor: 'start' }),
                    createDefultColumnDef('SAL_Account_Name',
                        { label: 'Client', fxFlex: '8', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailFrom',
                        { label: 'From', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailTo',
                        { label: 'To', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('Note',
                        { label: 'Work', fxFlex: '18', filterAnchor: 'end' }),
                    createDefultColumnDef('Details',
                        { label: 'Details', fxFlex: '', filterAnchor: 'end' }),
                ];
            } else if (action.payload.value === GroupMode.ByUserDate || action.payload.value === GroupMode.DateByUser) {
                columnDef = [
                    createDefultColumnDef('Toggle',
                        { label: '', fxFlex: '32px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('Diary_DATEDN',
                        { label: 'Date', fxFlex: '80px', filterAnchor: 'start', hidden: true }, FieldType.Date),
                    createDefultColumnDef('By',
                        { label: 'By', fxFlex: '54px', filterAnchor: 'start', hidden: true }),
                    createDefultColumnDef('Diary_RECTYPE',
                        { label: 'Type', fxFlex: '54px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('MatterReferenceNo',
                        { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                    createDefultColumnDef('Diary_FEE_EARNER',
                        { label: 'For', fxFlex: '55px', filterAnchor: 'start' }),
                    createDefultColumnDef('SAL_Account_Name',
                        { label: 'Client', fxFlex: '8', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailFrom',
                        { label: 'From', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailTo',
                        { label: 'To', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('Note',
                        { label: 'Work', fxFlex: '18', filterAnchor: 'end' }),
                    createDefultColumnDef('Details',
                        { label: 'Details', fxFlex: '', filterAnchor: 'end' }),
                ];
            } else {
                columnDef = [
                    createDefultColumnDef('Toggle',
                        { label: '', fxFlex: '32px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('Diary_DATEDN',
                        { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
                    createDefultColumnDef('By',
                        { label: 'By', fxFlex: '54px', filterAnchor: 'start' }),
                    createDefultColumnDef('Diary_RECTYPE',
                        { label: 'Type', fxFlex: '54px', filterHidden: true, disableShort: true }),
                    createDefultColumnDef('MatterReferenceNo',
                        { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                    createDefultColumnDef('Diary_FEE_EARNER',
                        { label: 'For', fxFlex: '55px', filterAnchor: 'start' }),
                    createDefultColumnDef('SAL_Account_Name',
                        { label: 'Client', fxFlex: '8', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailFrom',
                        { label: 'From', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('EmailTo',
                        { label: 'To', fxFlex: '12', filterAnchor: 'end' }),
                    createDefultColumnDef('Note',
                        { label: 'Work', fxFlex: '18', filterAnchor: 'end' }),
                    createDefultColumnDef('Details',
                        { label: 'Details', fxFlex: '', filterAnchor: 'end' }),
                ];
            }

            return {
                ...state,
                groupMode: action.payload.value,
                columnDef: columnDef,
            };
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



function loadSummery(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, loadSummery: true };
}

function getloadSummerySuccess(state: WorkDoneState, newData: Summery): Partial<WorkDoneState> {
    return { ...state, summery: newData, loadSummery: false };
}

function getloadSummeryFail(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, loadSummery: false };
}

function getDocURL(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, loadDocURL: true };
}

function getDocURLSuccess(state: WorkDoneState, action: Actions.GetDocURLSuccess): Partial<WorkDoneState> {
    return { ...state, gridData: setDocumentUrl(state.gridData, action.payload.gridRow, action.payload.url), loadDocURL: false };
}

function getDocURLFail(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, loadDocURL: false };
}

function getEmailItemSuccess(state: WorkDoneState, action: Actions.GetEmailItemSuccess): Partial<WorkDoneState> {
    return { ...state, gridData: setImailItemUrl(state.gridData, action.payload.row, action.payload.emailItem), loadDocURL: false };
}

function getMatterFinace(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, financeLoading: true };
}

function getMatterFinaceSuccess(state: WorkDoneState, payload: { row: GridData, financeData: MatterFinance }): Partial<WorkDoneState> {
    return { ...state, gridData: setFinanceData(state.gridData, payload.row, payload.financeData), financeLoading: false };
}

function setFinanceData(gridData: GridData[], selectedRow: GridData, financeData: MatterFinance): GridData[] {
    // const newDataList: GridData[] = expandRow(gridData, selectedRow);
    return gridData.map(row => {
        if (row.matterReferenceNo === selectedRow.matterReferenceNo) {
            return Object.freeze({ ...row, matterFinance: financeData });
        } else {
            return row;
        }
    });
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

function setImailItemUrl(gridData: GridData[], selectedRow: GridData, emaiItem: boolean): GridData[] {
    return gridData.map(row => {
        if (row === selectedRow) {
            return Object.freeze({ ...row, emailItem: emaiItem, view: true });
        } else {
            return Object.freeze({ ...row, view: false });
        }
    });
}

function getMatterFinaceFail(state: WorkDoneState): Partial<WorkDoneState> {
    return { ...state, financeLoading: false };
}

function viewDoc(state: WorkDoneState, action: Actions.ViewDoc): Partial<WorkDoneState> {
    return { ...state, gridData: setPreviewDoc(state.gridData, action.row), loadDocURL: false };
}

function setPreviewDoc(gridData: GridData[], selectedRow: GridData): GridData[] {
    return gridData.map(row => {
        if (row === selectedRow) {
            return Object.freeze({ ...row, view: true });
        } else {
            return Object.freeze({ ...row, view: false });
        }
    });
}

function requestPassword(state: WorkDoneState, action: Actions.GetDocPassword): Partial<WorkDoneState> {
    return { ...state, passwordRequestRow: action.payload.row, loadDocURL: false, passWordInvalid: false };
}

// function setIsRequestPassword(gridData: GridData[], selectedRow: GridData, value: boolean): GridData[] {
//     return gridData.map(row => {
//         if (row === selectedRow) {
//             return Object.freeze({ ...row, openPasswordBox: value });
//         } else {
//             return Object.freeze({ ...row, openPasswordBox: false });
//         }
//     });
// }



function setPassword(state: WorkDoneState, action: Actions.SetPassword): Partial<WorkDoneState> {
    return {
        ...state, gridData: setUserPassword(state.gridData, action.payload.row, action.payload.insertPassword),
        loadDocURL: false,
        passwordRequestRow: null,
        passWordInvalid: false
    };
}

function RemovePasswordRequest(state: WorkDoneState): Partial<WorkDoneState> {
    return {
        ...state,
        loadDocURL: false,
        passwordRequestRow: null,
        passWordInvalid: false
    };
}

function PasswordInvalid(state: WorkDoneState): Partial<WorkDoneState> {
    return {
        ...state,
        loadDocURL: false,
        passwordRequestRow: null,
        passWordInvalid: true
    };
}

function setUserPassword(gridData: GridData[], selectedRow: GridData, value: string): GridData[] {
    return gridData.map(row => {
        if (row === selectedRow) {
            return Object.freeze({ ...row, password: value });
        } else {
            return Object.freeze({ ...row });
        }
    });
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getIsloadingByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ?
        (state.departmentLoading && state.departmentLoading === true) ||
        (state.financeLoading && state.financeLoading === true) ||
        (state.periodsLoading && state.periodsLoading === true) ||
        (state.fromToDateLoading && state.fromToDateLoading === true) ||
        (state.loadSummery && state.loadSummery === true) ||
        (state.loadDocURL && state.loadDocURL === true) ||
        (state.isGridLoading && state.isGridLoading === true)
        : false);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : null);
export const getPeginatorDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.paginatorDef : null);
export const getDepartmentByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.departments : null);
export const getPeriodByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.periods : null);
export const getSelectedInfoByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectedInfo : null);
export const getGridDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridData : null);
export const getGridExpandedRowByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.expandRow : null);
export const getPasswordRequestRowByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.passwordRequestRow : null);
export const getTotalItemByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.totalItem : null);
export const getSummeryByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.summery : null);
export const getShowMassgeByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.passWordInvalid : null);

export const getGroupModeByToken = (token) => createSelector(getStateByToken(token),
    (state) => {
        if (state) {
            return state.groupMode;
        }
    });

export const getGroupDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridGroupData : '');
export const getSelectGroupHashByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectGroupHash : []);


