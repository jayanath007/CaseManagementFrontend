



import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';

import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    Department, SelectedInfo, Summery, UserPermission,
    GridData, GridDataObject, MsgModel, GroupMode, GridGroupData
} from '../models/interfce';
import { gridFilterKind, ViewChangeKind } from '../models/enumeration';
import { clearFilters, applyFieldSort, applyColumnFilter, createDefultColumnDef } from '../../core/lib/grid-helpers';
import { GridRequest } from '../models/request';
import { FieldType } from '../../odata';

export interface State {
    readonly [token: string]: MyTasksState;
}

export interface MyTasksState {
    readonly departmentLoading: boolean;
    readonly financeLoading: boolean;
    readonly isGridLoading: boolean;
    readonly checkIsTREnable: boolean;
    readonly completeTask: boolean;
    readonly loadSummery: boolean;
    readonly UserPermissionLoading: boolean;
    readonly gridData: GridData[];
    readonly totalItem: number;
    readonly departments: Department[];
    readonly selectedInfo: SelectedInfo;
    readonly columnDef: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly summery: Summery;
    readonly UserPermission: UserPermission;
    readonly msg: MsgModel;
    readonly expandedItem: GridData;
    readonly groupMode: GroupMode;
    readonly gridGroupData: GridGroupData[];

}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_MY_TASK:
            tmp[action.token] = initView(state[action.token], action);
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





        case Actions.LOAD_MY_TASK_GROUP:
            tmp[action.token] = isGridLoading(state[action.token], true);
            return { ...state, ...tmp };

        case Actions.LOAD_MY_TASK_GROUP_SUCCESS:
            tmp[action.token] = getLoadGroupsSuccess(state[action.token], action);
            return { ...state, ...tmp };

        case Actions.LOAD_MY_TASK_GROUP_FAIL:
            tmp[action.token] = isGridLoading(state[action.token], false);
            return { ...state, ...tmp };

        // case Actions.REFRESH_DATA:
        //     tmp[action.token] = clearGridData(state[action.token]);
        //     return { ...state, ...tmp };


        case Actions.LOAD_MY_TASK_GRID_DATA_BY_GROUP:
            tmp[action.token] = isGridLoading(state[action.token], true);
            return { ...state, ...tmp };

        case Actions.LOAD_MY_TASK_GRID_DATA_BY_GROUP_SUCCESS:
            tmp[action.token] = myTasksLoadByGroupSuccess(state[action.token], action.payload.pageData,
                action.payload.request);
            return { ...state, ...tmp };

        case Actions.LOAD_MY_TASK_GRID_DATA_BY_GROUP_FAIL:
            tmp[action.token] = isGridLoading(state[action.token], false);
            return { ...state, ...tmp };

        case Actions.GRID_REFRESH:
            tmp[action.token] = clearGridData(state[action.token]);
            return { ...state, ...tmp };

        case Actions.EXPAND_MY_TASK_GROUP:
            tmp[action.token] = myTaskGroupItemsChange(state[action.token], action);
            return { ...state, ...tmp };

        case Actions.MY_TASK_GROUP_CHANGE:
            tmp[action.token] = changeGroupMode(state[action.token], action);
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
        case Actions.GRID_ROW_EXPAND:
            tmp[action.token] = gridRowExpand(state[action.token], action);
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
        case Actions.CHECK_TIME_RECORDED_ENABLE:
            tmp[action.token] = checkTREnable(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CHECK_TIME_RECORDED_ENABLE_SUCCESS:
            tmp[action.token] = checkTREnableSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CHECK_TIME_RECORDED_ENABLE_FAIL:
            tmp[action.token] = checkTREnableFail(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.SHOW_MSG:
            tmp[action.token] = showMsg(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.REQUEST_TO_COMPLETE:
            tmp[action.token] = removeMsg(state[action.token], action);
            return { ...state, ...tmp };
        default: {
            return state;
        }
    }
}

function initView(state: MyTasksState, action: Actions.InitMyTask): Partial<MyTasksState> {
    if (!state) {
        return {
            ...state,
            departmentLoading: false,
            UserPermissionLoading: false,
            columnDef: action.payload.columnDef,
            paginatorDef: action.payload.paginatorDef,
            departments: null,
            financeLoading: false,
            isGridLoading: false,
            loadSummery: false,
            selectedInfo: setInitialSelection(),
            summery: null,
            totalItem: 0,
            UserPermission: null,
            expandedItem: null,
            gridGroupData: [],
            groupMode: GroupMode.Default,
        };
    } else {
        return state;
    }
}

function setInitialSelection() {
    return {
        departmentId: null,
        user: null,
        searchText: null
    };
}



function myTaskGroupItemsChange(state: MyTasksState, action: Actions.ExpandMyTaskGroup)
    : Partial<MyTasksState> {

    const gridGroupData = state.gridGroupData;

    const newGridGroupData = gridGroupData.map((group1) => {

        if (group1.groupHash === action.payload.row.groupHash) {
            return { ...group1, isExpand: !group1.isExpand };
        } else {
            const group2Data = group1.items.map((group2) => {

                if (group2.groupHash === action.payload.row.groupHash) {

                    return { ...group2, isExpand: !group2.isExpand };

                } else {
                    return { ...group2 };
                }

            });
            return Object.freeze({ ...group1, items: group2Data });
        }
    });


    return { ...state, gridGroupData: newGridGroupData };

}



function isGridLoading(state: MyTasksState, loading: boolean): Partial<MyTasksState> {
    return { ...state, isGridLoading: loading };
}



function getLoadGroupsSuccess(state: MyTasksState, action: Actions.LoadMyTaskGroupSuccess): Partial<MyTasksState> {

    const gridGroupData = action.groups.map((group1) => {
        const group1Hash = group1.selectorField + '-' + group1.filterValue;
        let isLefNode = false;

        let items = [];
        if (group1.items) {
            items = group1.items.map((group2) => {

                const group2Hash = group1.selectorField + '-' + group1.filterValue + '/' + group2.selectorField + '-' + group2.filterValue;

                return {
                    data: group2, items: null, groupHash: group2Hash, isLefNode: true,
                    isExpand: false, groupMode: state.groupMode,
                    groupIds: {
                        group1: group1.filterValue, group1Value: group1.value,
                        group2: group2.filterValue, group2Value: group2.value,
                        groupMode: state.groupMode
                    }
                };
            });
        }
        if (state.groupMode === GroupMode.Folder || state.groupMode === GroupMode.Date) {
            isLefNode = true;

        }
        return {
            data: group1, items: items, groupHash: group1Hash, isExpand: false, isLefNode: isLefNode, groupMode: state.groupMode,
            groupIds: { group1: group1.filterValue, group1Value: group1.value, group2: '', group2Value: '', groupMode: state.groupMode }
        };
    });

    return { ...state, gridGroupData: gridGroupData, isGridLoading: false };
}







function loadDepartments(state: MyTasksState, action: Actions.LoadDepartments): Partial<MyTasksState> {
    return { ...state, departmentLoading: true };
}

function getLoadDepartmentsSuccess(state: MyTasksState, action: Actions.LoadDepartmentsSuccess,
    newData: Department[]): Partial<MyTasksState> {
    return { ...state, departments: newData, departmentLoading: false };
}

function getLoadDepartmentsFail(state: MyTasksState, action: Actions.LoadDepartmentsFail): Partial<MyTasksState> {
    return { ...state, departmentLoading: false };
}



function clearGridData(state: MyTasksState): Partial<MyTasksState> {

    return {
        ...state,
        gridData: [],
        isGridLoading: false,
    };
}



function myTasksLoadByGroupSuccess(state: MyTasksState,
    gridData: GridDataObject,
    request: GridRequest): Partial<MyTasksState> {

    const newGridData: GridData[] = gridData.data.map((_item) => {
        _item.groupRow = request.row;
        _item.groupHash = request.row.groupHash;
        return _item;
    });


    const groupData = state.gridGroupData;

    const newGroupData = groupData.map((group1) => {

        if (group1.groupHash === request.row.groupHash) {
            return { ...group1, currentItems: request.dataSourceInfo.skip + 50, totalItems: gridData.total };
        } else {
            const group2Data = group1.items.map((group2) => {

                if (group2.groupHash === request.row.groupHash) {

                    return { ...group2, currentItems: request.dataSourceInfo.skip + 50, totalItems: gridData.total };

                } else {
                    return { ...group2 };
                }

            });
            return Object.freeze({ ...group1, items: group2Data });
        }
    });



    return {
        ...state,
        gridData: state.gridData.concat(newGridData),
        gridGroupData: newGroupData,
        isGridLoading: false,
    };
}







function loadUserPermission(state: MyTasksState, action: Actions.LoadUserPermission): Partial<MyTasksState> {
    return { ...state, UserPermissionLoading: true };
}

function getloadUserPermissionSuccess(state: MyTasksState, action: Actions.LoadUserPermissionSuccess,
    newData: UserPermission): Partial<MyTasksState> {
    return { ...state, UserPermission: newData, UserPermissionLoading: false };
}

function getloadUserPermissionFail(state: MyTasksState, action: Actions.LoadUserPermissionFail): Partial<MyTasksState> {
    return { ...state, UserPermissionLoading: false };
}

function changeGridFilter(state: MyTasksState, action: Actions.GridFilterChange): Partial<MyTasksState> {
    switch (action.payload.newData.kind) {
        case gridFilterKind.department:
            return {
                ...state,
                columnDef: clearAllColumnFilter(state.columnDef),
                selectedInfo: {
                    ...state.selectedInfo,
                    departmentId: action.payload.newData.value,
                    user: ''
                }
                , paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case gridFilterKind.searchText:
            return {
                ...state,
                // columnDef: clearAllColumnFilter(state.columnDef),
                selectedInfo: {
                    ...state.selectedInfo,
                    searchText: action.payload.newData.value
                }
                , paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case gridFilterKind.user:
            return {
                ...state,
                columnDef: clearAllColumnFilter(state.columnDef),
                selectedInfo: {
                    ...state.selectedInfo,
                    user: action.payload.newData.value
                }
                , paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        default: {
            return state;
        }

    }
}

function gridRowExpand(state: MyTasksState, action: Actions.GridRowExpand): Partial<MyTasksState> {
    return {
        ...state,
        gridData: setExpandedRow(state.gridData, action.payload.row),
        expandedItem: action.payload.row
    };
}

function setExpandedRow(Grid: GridData[], selectedRow: GridData): GridData[] {
    return Grid.map(row => {
        if (row === selectedRow) {
            return { ...row, expanded: !row.expanded };
        } else {
            return { ...row, expanded: false };
        }
    });
}

function setInitialExpandedRow(Grid: GridData[], expandedItem: GridData): GridData[] {
    if (expandedItem && Grid.find(val => val.taskID === expandedItem.taskID)) {
        Grid.forEach(row => {
            if (row.taskID === expandedItem.taskID) {
                row.expanded = true;
            } else {
                row.expanded = false;
            }
        });
    } else {
        Grid.forEach((row, i) => {
            if (i === 0) {
                row.expanded = true;
            } else {
                row.expanded = false;
            }
        });
    }
    return Grid;
}

function loadGridData(state: MyTasksState, action: Actions.LoadGrid): Partial<MyTasksState> {
    return { ...state, isGridLoading: true };
}

function loadGridDataSuccess(state: MyTasksState, action: Actions.LoadGridSuccess,
    newData: GridDataObject): Partial<MyTasksState> {
    return {
        ...state,
        gridData: setInitialExpandedRow(newData.data, state.expandedItem),
        totalItem: newData.total,
        isGridLoading: false
    };
}

function loadGridDataFail(state: MyTasksState, action: Actions.LoadGridFail): Partial<MyTasksState> {
    return { ...state, isGridLoading: false };
}

function viewChange(state: MyTasksState, action: Actions.GridViewChange): Partial<MyTasksState> {
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

function clearAllColumnFilter(current: ColumnDef[]) {
    return current.map((def) => {
        return clearFilters(def);
    });
}

function loadSummery(state: MyTasksState, action: Actions.LoadSummery): Partial<MyTasksState> {
    return { ...state, loadSummery: true };
}

function getloadSummerySuccess(state: MyTasksState, action: Actions.LoadSummerySuccess,
    newData: Summery): Partial<MyTasksState> {
    return { ...state, summery: newData, loadSummery: false };
}

function getloadSummeryFail(state: MyTasksState, action: Actions.LoadSummeryFail): Partial<MyTasksState> {
    return { ...state, loadSummery: false };
}

function checkTREnable(state: MyTasksState, action: Actions.CheckTREnabale): Partial<MyTasksState> {
    return { ...state, checkIsTREnable: true };
}

function checkTREnableSuccess(state: MyTasksState, action: Actions.CheckTREnabaleSuccess): Partial<MyTasksState> {
    return {
        ...state,
        gridData: setIsTREnable(state.gridData, action.payload.isEnable, action.payload.row.matterReferenceNo),
        checkIsTREnable: false
    };
}

function checkTREnableFail(state: MyTasksState, action: Actions.CheckTREnabaleFail): Partial<MyTasksState> {
    return { ...state, checkIsTREnable: false };
}

function showMsg(state: MyTasksState, action: Actions.ShowMsg): Partial<MyTasksState> {
    return { ...state, msg: action.payload.msgModel };
}

function removeMsg(state: MyTasksState, action: Actions.RequestToComplete): Partial<MyTasksState> {
    return { ...state, msg: null };
}

function setIsTREnable(gridData: GridData[], value: boolean, matterRef: string): GridData[] {
    return gridData.map(row => {
        if (row.matterReferenceNo === matterRef) {
            return Object.freeze({ ...row, isTimeRecordingEnabled: value, checkTREnable: true });
        } else {
            return row;
        }
    });
}

function changeGroupMode(state: MyTasksState, action: any): Partial<MyTasksState> {
    let columnDef: ColumnDef[];
    if (action.payload.groupMode === GroupMode.Default) {
        columnDef =
            [
                createDefultColumnDef('toggle', {
                    label: '', fxFlex: '32px', filterAnchor: 'start',
                    filterHidden: true, disableShort: true
                }),
                createDefultColumnDef('DateBy', { label: 'Do By', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('TaskFor', { label: 'For', fxFlex: '52px', filterAnchor: 'start' }),
                createDefultColumnDef('Client', { label: 'Client', fxFlex: '8', filterAnchor: 'start' }),
                createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                createDefultColumnDef('Note', { label: 'Task', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '25', filterAnchor: 'end' }),
                createDefultColumnDef('Action', { label: 'Action', fxFlex: '70px', filterAnchor: 'end' }, FieldType.Boolen),
            ];

    } else {

        columnDef =
            [
                createDefultColumnDef('toggle', {
                    label: '', fxFlex: '32px', filterAnchor: 'start'
                    , filterHidden: true, disableShort: true
                }),
                createDefultColumnDef('DateBy', {
                    label: 'Do By', fxFlex: '80px', filterAnchor: 'start',
                    filterHidden: true
                }, FieldType.Date),
                createDefultColumnDef('TaskFor', { label: 'For', fxFlex: '52px', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Client', { label: 'Client', fxFlex: '8', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '108px', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Note', { label: 'Task', fxFlex: '', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('Action', {
                    label: 'Action', fxFlex: '70px', filterAnchor: 'end',
                    filterHidden: true
                }, FieldType.Boolen),
            ];

    }
    return {
        ...state,
        groupMode: action.payload.groupMode,
        columnDef: columnDef,
    };
}



export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getIsloadingByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ?
        (state.departmentLoading && state.departmentLoading === true) ||
        (state.financeLoading && state.financeLoading === true) ||
        (state.loadSummery && state.loadSummery === true) ||
        (state.isGridLoading && state.isGridLoading === true) ||
        (state.UserPermissionLoading && state.UserPermissionLoading === true) ||
        (state.checkIsTREnable && state.checkIsTREnable === true) ||
        (state.completeTask && state.completeTask === true)
        : false);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : null);
export const getPeginatorDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.paginatorDef : null);
export const getUserPermisionByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.UserPermission : null);
export const getDepartmentByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.departments : null);
export const getSelectedInfoByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectedInfo : null);
export const getGridDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridData : null);
export const getTotalItemByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.totalItem : null);
export const getSummeryByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.summery : null);
export const getMsgByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.msg : null);
export const getSelectGroupModeByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.groupMode : '');
export const getGroupDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridGroupData : '');

export const getMytaskGroupDataByRow = (token, row) => createSelector(getStateByToken(token), (state) => {
    const groupHash = row.groupHash;
    if (state.gridData.filter(p => p.groupHash === groupHash).length > 0) {
        return state.gridData.filter(p => p.groupHash === groupHash);
    }
    return [];
});




