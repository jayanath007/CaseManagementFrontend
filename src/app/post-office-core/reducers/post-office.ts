
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../core/lib/grid-model';
import {
    Group, Users, SelectedInfo, GridData,
    GridDataObject, Department
} from '../models/interfce';
import { ViewChangeKind, GridFilterKind, GridButtonType, GroupMode } from '../models/enumeration';
import { MessageItemWrapper } from '../../mail-item-core';
import {
    clearFilters, applyFieldSort, applyColumnFilter, createDefultColumnDef,
    applyGroupFilter, removeFiltertionOptin
} from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';

export interface State {
    readonly [token: string]: PostOfficeState;
}

export interface PostOfficeState {

    readonly groupLoading: boolean;
    readonly loookForsLoading: boolean;
    readonly usersLoading: boolean;
    readonly isGridLoading: boolean;
    readonly loadDocURL: boolean;
    readonly totalItem: number;
    readonly groups: Group[];
    readonly loookFors: Group[];
    readonly users: Users[];
    readonly selectedInfo: SelectedInfo;
    readonly paginatorDef: PaginatorDef;
    readonly passWordInvalid: boolean;
    readonly expandRow: GridData;
    readonly passwordRequestRow: GridData;
    readonly columnDef: ColumnDef[];
    readonly originalColumnDef: ColumnDef[];
    readonly gridData: GridData[];
    readonly gridGroupData: GridGroupData[];
    readonly groupMode: GroupMode;
    readonly selectGroupHash: string[];
    readonly departments: Department[];
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_POST_CODE:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };


        case Actions.POST_OFFICE_GRID_ROW_CHANGE:
            tmp[action.token] = rowChange(state[action.token], action);
            return { ...state, ...tmp };





        case Actions.LOAD_LOOOK_FOR:
            tmp[action.token] = loadloookFor(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_LOOOK_FOR_SUCCESS:
            tmp[action.token] = getLoadloookForSuccess(state[action.token], action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_LOOOK_FOR_FAIL:
            tmp[action.token] = getLoadloookForFail(state[action.token]);
            return { ...state, ...tmp };



        case Actions.LOAD_PERIODS:
            tmp[action.token] = loadUser(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS_SUCCESS:
            tmp[action.token] = getLoadUsersSuccess(state[action.token], action.payload.items);
            return { ...state, ...tmp };
        case Actions.LOAD_PERIODS_FAIL:
            tmp[action.token] = getLoadUsersFail(state[action.token]);
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
        case Actions.GRID_ROW_EXPAND:
            tmp[action.token] = gridRowExpand(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GRID_VIEW_CHANGE:
            tmp[action.token] = viewChange(state[action.token], action);
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
            tmp[action.token] = changeGroupMode(state[action.token], action.payload.type);
            return { ...state, ...tmp };
        case Actions.GROUP_DATA_REQUEST:
            tmp[action.token] = requestGroupData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS:
            tmp[action.token] = {
                ...state[action.token],
                isLoading: true
            };
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS_SUCCESS:
            tmp[action.token] = {
                ...state[action.token],
                isLoading: false,
                departments: action.payload.items
            };
            return { ...state, ...tmp };
        case Actions.LOAD_DEPARTMENTS_FAIL:
            tmp[action.token] = {
                ...state[action.token],
                isLoading: false
            };
            return { ...state, ...tmp };

        case Actions.DELETE_FILE_RECORD_SUCCESS:

            const newGridData = state[action.token].gridData.filter(item => !item.isChecked);
            tmp[action.token] = {
                ...state[action.token],
                gridData: newGridData
            };
            return { ...state, ...tmp };

        case Actions.GRID_REFRESH:
            const curantState = state[action.token];
            if (curantState) {
                tmp[action.token] = refresh(state[action.token]);
                return { ...state, ...tmp };
            } else {
                return state;
            }
        default: {
            return state;
        }
    }
}


const columnDef = [

    createDefultColumnDef('deleteaction',
        { label: '', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    createDefultColumnDef('inboxId', { label: 'Action', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
    createDefultColumnDef('inboxDateCreated', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
    createDefultColumnDef('inboxNote', { label: 'Note', fxFlex: '', filterAnchor: 'end' }),
    createDefultColumnDef('inboxStatus', { label: 'Status', fxFlex: '12', filterAnchor: 'end' }),
    createDefultColumnDef('GroupName', { label: 'Group', fxFlex: '12', filterAnchor: 'end' }),
    createDefultColumnDef('inboxLastMovedTo', { label: 'Last Move to', fxFlex: '12', filterAnchor: 'end' }),
    createDefultColumnDef('inboxLastMoveDate', { label: 'Last Moved Date', fxFlex: '12', filterAnchor: 'end' }, FieldType.Date),
    createDefultColumnDef('ByGroup', {
        label: 'Note', fxFlex: '', filterAnchor: 'end'
        , filterHidden: true, disableShort: true,
        hidden: true
    }),
];

function initView(state: PostOfficeState, action: Actions.InitPostOffice): Partial<PostOfficeState> {
    if (!state) {
        return {
            ...state,
            groupLoading: false,
            columnDef: columnDef,
            originalColumnDef: columnDef,
            paginatorDef: action.payload.paginatorDef,
            groups: null,
            usersLoading: false,
            isGridLoading: true,
            loadDocURL: false,
            passwordRequestRow: null,
            selectedInfo: setInitialSelection(),
            totalItem: 0,
            groupMode: GroupMode.Default,
            selectGroupHash: []
        };
    } else {
        return state;
    }
}
function setInitialSelection() {
    return {

        userId: 0,
        // user: null,
        searchText: null,
        departmentId: -1
    };
}


function rowChange(state: PostOfficeState, action: Actions.PostOfficeGridRowChange): Partial<PostOfficeState> {

    switch (action.payload.kind) {

        case GridButtonType.selectItem:
            const selectItemGridData = selectItem(state, action);
            return { ...state, gridData: selectItemGridData };

        case GridButtonType.selectOneItem:
            const newGridData = selectOnlyOneItem(state, action);
            return { ...state, gridData: newGridData };

        case GridButtonType.checkItem:
            const checkItemGridData = checkItem(state, action);
            return { ...state, gridData: checkItemGridData };

        case GridButtonType.uncheckItem:
            const uncheckItemGridData = uncheckItem(state, action);
            return { ...state, gridData: uncheckItemGridData };
        // case GridButtonType.deleteItem:
        //     const deleteItemGridData = deleteItem(state, action);
        //     return { ...state, gridData: deleteItemGridData };

        default: {
            return state;
        }
    }
}

function selectItem(state: PostOfficeState, action: Actions.PostOfficeGridRowChange): Array<GridData> {
    const newGridData = state.gridData.map((file) => {
        if (file === action.payload.value) {
            return Object.freeze({ ...file, isChecked: !file.isChecked });
        } else {
            return file;
        }
    });
    return newGridData;
}

function checkItem(state: PostOfficeState, action: Actions.PostOfficeGridRowChange): Array<GridData> {
    const newGridData = state.gridData.map((file) => {
        if (file === action.payload.value) {
            return Object.freeze({ ...file, isChecked: true });
        } else {
            return file;
        }
    });
    return newGridData;
}

function uncheckItem(state: PostOfficeState, action: Actions.PostOfficeGridRowChange): Array<GridData> {
    const newGridData = state.gridData.map((file) => {
        if (file === action.payload.value) {
            return Object.freeze({ ...file, isChecked: false });
        } else {
            return file;
        }
    });
    return newGridData;
}




function selectOnlyOneItem(state: PostOfficeState, action: Actions.PostOfficeGridRowChange): Array<GridData> {
    const newGridData = state.gridData.map((file) => {
        if (file === action.payload.value) {
            return Object.freeze({ ...file, isChecked: true });
        } else if (file.isChecked) {
            return Object.freeze({ ...file, isChecked: false });
        } else {
            return file;
        }
    });
    return newGridData;
}


function deleteItem(state: PostOfficeState): Array<GridData> {
    return state.gridData.filter(item => !item.isChecked);
}


function loadloookFor(state: PostOfficeState): Partial<PostOfficeState> {
    return { ...state, loookForsLoading: true };
}
function getLoadloookForSuccess(state: PostOfficeState, newData: Group[]): Partial<PostOfficeState> {
    return { ...state, loookFors: newData, loookForsLoading: false };
}
function getLoadloookForFail(state: PostOfficeState): Partial<PostOfficeState> {
    return { ...state, loookForsLoading: false };
}
function loadUser(state: PostOfficeState): Partial<PostOfficeState> {
    return { ...state, usersLoading: true };
}
function getLoadUsersSuccess(state: PostOfficeState, newData: Users[]): Partial<PostOfficeState> {
    return {
        ...state,
        users: newData,
        usersLoading: false,
    };
}
function getLoadUsersFail(state: PostOfficeState): Partial<PostOfficeState> {
    return { ...state, usersLoading: false };
}
function changeGridFilter(state: PostOfficeState, action: Actions.GridFilterChange): Partial<PostOfficeState> {
    switch (action.payload.newData.kind) {

        case GridFilterKind.user:
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    userId: action.payload.newData.value,
                },
                columnDef: clearAllColumnFilter(state.columnDef),
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case GridFilterKind.searchText:
            return {
                ...state, selectedInfo: {
                    ...state.selectedInfo,
                    searchText: action.payload.newData.value
                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case GridFilterKind.department:
            return {
                ...state,
                selectedInfo: {
                    ...state.selectedInfo,
                    departmentId: action.payload.newData.value
                },
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
function gridRowExpand(state: PostOfficeState, action: Actions.GridRowExpand): Partial<PostOfficeState> {
    const currentExpand = state.expandRow ? state.expandRow.inboxId : null;
    return {
        ...state,
        expandRow: action.payload.row.inboxId !== currentExpand ? action.payload.row : null
    };
}

function refresh(state: PostOfficeState) {
    if (state) {
        return {
            ...state,
            columnDef: state.groupMode !== GroupMode.Default ? clearAllColumnFilter(state.columnDef) : state.columnDef
        };
    }
}

// function gridRowDelete(state: PostOfficeState, action: Actions.DeleteFileRecord): Partial<PostOfficeState> {
//     const currentExpand = state.expandRow ? state.expandRow.inboxId : null;
//     // return {
//     //     ...state,
//     //     expandRow: action.payload.row.inboxId !== currentExpand ? action.payload.gridRow : null
//     // };
// }

function gridRowDelete(state: PostOfficeState, action: Actions.DeleteFileRecord):
    Partial<PostOfficeState> {
    // const hash = createViewhash(state);
    // const filesData = state.fileHistorData[hash].data;
    // const total = state.fileHistorData[hash].total;
    // const tmp = {};
    // const newfilesData = filesData.filter(item => item.data !== row.data);
    // const groupData = fileHistoGroupItemrUpdateDelete(state, row);

    // tmp[hash] = {
    //     ...state.fileHistorData[hash],
    //     data: newfilesData,
    //     total: state.fileHistorData[hash].total - 1,
    //     groupData: groupData,
    //     loading: false
    // };
    return {};
}



function loadGridData(state: PostOfficeState): Partial<PostOfficeState> {
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
function loadGridDataSuccess(state: PostOfficeState, action: Actions.LoadGridSuccess, newData: GridDataObject): Partial<PostOfficeState> {

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
    return selectedInfo.departmentId + selectedInfo.userId + selectedInfo.searchText;
}


function changeGroupMode(state: PostOfficeState, type: GroupMode): Partial<PostOfficeState> {

    // let newColumnDef = columnDef;

    // if (type === GroupMode.ByGroup) {
    //     newColumnDef = [

    //         createDefultColumnDef('deleteaction',
    //             { label: '', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),

    //         createDefultColumnDef('inboxId', {
    //             label: 'Action', fxFlex: '80px', filterAnchor: 'start'
    //             , filterHidden: true, disableShort: true
    //         }, FieldType.Date),

    //         createDefultColumnDef('inboxDateCreated', {
    //             label: 'Date', fxFlex: '80px', filterAnchor: 'start'
    //             , filterHidden: true, disableShort: true
    //         }, FieldType.Date),
    //         createDefultColumnDef('inboxNote', {
    //             label: 'Note', fxFlex: '', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true
    //         }),
    //         createDefultColumnDef('inboxStatus', {
    //             label: 'Status', fxFlex: '12', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true
    //         }),
    //         createDefultColumnDef('inboxGroupName', {
    //             label: 'Department', fxFlex: '12', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true,
    //             hidden: true
    //         }),
    //         createDefultColumnDef('inboxLastMovedTo', {
    //             label: 'Last Move to', fxFlex: '12', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true
    //         }),
    //         createDefultColumnDef('inboxLastMoveDate', {
    //             label: 'Last Moved Date', fxFlex: '12', filterAnchor: 'start'
    //             , filterHidden: true, disableShort: true
    //         }, FieldType.Date),
    //         createDefultColumnDef('ByGroup', {
    //             label: 'Note', fxFlex: '', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true,
    //             hidden: true
    //         }),
    //     ];
    // }

    // if (type === GroupMode.Date) {
    //     newColumnDef = [


    //         createDefultColumnDef('deleteaction',
    //             { label: '', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),


    //         createDefultColumnDef('inboxId', {
    //             label: 'Action', fxFlex: '80px', filterAnchor: 'start'
    //             , filterHidden: true, disableShort: true
    //         }, FieldType.Date),

    //         createDefultColumnDef('inboxDateCreated', {
    //             label: 'Date', fxFlex: '80px', filterAnchor: 'start'
    //             , filterHidden: true, disableShort: true
    //         }, FieldType.Date),
    //         createDefultColumnDef('inboxNote', {
    //             label: 'Note', fxFlex: '', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true
    //         }),
    //         createDefultColumnDef('inboxStatus', {
    //             label: 'Status', fxFlex: '12', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true
    //         }),
    //         createDefultColumnDef('inboxGroupName', {
    //             label: 'Department', fxFlex: '12', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true
    //         }),
    //         createDefultColumnDef('inboxLastMovedTo', {
    //             label: 'Last Move to', fxFlex: '12', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true
    //         }),
    //         createDefultColumnDef('inboxLastMoveDate', {
    //             label: 'Last Moved Date', fxFlex: '12', filterAnchor: 'start'
    //             , filterHidden: true, disableShort: true
    //         }, FieldType.Date),
    //         createDefultColumnDef('ByGroup', {
    //             label: 'ByGroup', fxFlex: '', filterAnchor: 'end'
    //             , filterHidden: true, disableShort: true,
    //             hidden: true
    //         }),
    //     ];
    // }


    return {
        ...state,
        groupMode: type,
        columnDef: type !== GroupMode.Default ?
            removeFiltertionOptin(clearAllColumnFilter(state.columnDef)) : clearAllColumnFilter(state.originalColumnDef),
    };
}



function requestGroupData(state: PostOfficeState, action: Actions.GroupDataRequest): Partial<PostOfficeState> {
    let groupByVal: string[];
    let filterValue: string[];
    if (action.payload.gridGroupData.selectorField === GroupMode.ByGroup) {
        filterValue = [action.payload.gridGroupData.filterValue];
        groupByVal = ['ByGroup'];
    } else if (action.payload.gridGroupData.selectorField === GroupMode.Date) {
        filterValue = [action.payload.gridGroupData.filterValue];
        groupByVal = ['inboxDateCreated'];
    } else if (action.payload.gridGroupData.selectorField === GroupMode.ByGroupDate) {
        filterValue = [action.payload.gridGroupData.perentfilterValue, action.payload.gridGroupData.filterValue];
        groupByVal = ['ByGroup', 'inboxDateCreated'];
    } else if (action.payload.gridGroupData.selectorField === GroupMode.DateByGroup) {
        filterValue = [action.payload.gridGroupData.perentfilterValue, action.payload.gridGroupData.filterValue];
        groupByVal = ['inboxDateCreated', 'ByGroup'];
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

function loadGridDataFail(state: PostOfficeState): Partial<PostOfficeState> {
    return { ...state, isGridLoading: false };
}
function viewChange(state: PostOfficeState, action: Actions.GridViewChange): Partial<PostOfficeState> {
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
function getDocURL(state: PostOfficeState): Partial<PostOfficeState> {
    return { ...state, loadDocURL: true };
}
function getDocURLSuccess(state: PostOfficeState, action: Actions.GetDocURLSuccess): Partial<PostOfficeState> {
    return { ...state, gridData: setDocumentUrl(state.gridData, action.payload.gridRow, action.payload.url), loadDocURL: false };
}
function getDocURLFail(state: PostOfficeState): Partial<PostOfficeState> {
    return { ...state, loadDocURL: false };
}
function getEmailItemSuccess(state: PostOfficeState, action: Actions.GetEmailItemSuccess): Partial<PostOfficeState> {
    return { ...state, gridData: setImailItemUrl(state.gridData, action.payload.row, action.payload.emailItem), loadDocURL: false };
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
function setImailItemUrl(gridData: GridData[], selectedRow: GridData, emaiItem: MessageItemWrapper): GridData[] {
    return gridData.map(row => {
        if (row === selectedRow) {
            return Object.freeze({ ...row, emailItem: emaiItem, view: true });
        } else {
            return Object.freeze({ ...row, view: false });
        }
    });
}
function viewDoc(state: PostOfficeState, action: Actions.ViewDoc): Partial<PostOfficeState> {
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
function requestPassword(state: PostOfficeState, action: Actions.GetDocPassword): Partial<PostOfficeState> {
    return { ...state, passwordRequestRow: action.payload.row, loadDocURL: false, passWordInvalid: false };
}
function setPassword(state: PostOfficeState, action: Actions.SetPassword): Partial<PostOfficeState> {
    return {
        ...state, gridData: setUserPassword(state.gridData, action.payload.row, action.payload.insertPassword),
        loadDocURL: false,
        passwordRequestRow: null,
        passWordInvalid: false
    };
}
function RemovePasswordRequest(state: PostOfficeState): Partial<PostOfficeState> {
    return {
        ...state,
        loadDocURL: false,
        passwordRequestRow: null,
        passWordInvalid: false
    };
}
function PasswordInvalid(state: PostOfficeState): Partial<PostOfficeState> {
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
        (state.groupLoading && state.groupLoading === true) ||
        (state.loookForsLoading && state.loookForsLoading === true) ||
        (state.usersLoading && state.usersLoading === true) ||
        (state.loadDocURL && state.loadDocURL === true) ||
        (state.isGridLoading && state.isGridLoading === true)
        : false);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : null);
export const getPeginatorDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.paginatorDef : null);
export const getGroupByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.groups : null);
export const getLoookForsByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loookFors : null);
export const getUserByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.users : null);
export const getSelectedInfoByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectedInfo : null);
export const getGridDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridData : null);
export const getGridExpandedRowByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.expandRow : null);
export const getPasswordRequestRowByToken = (token) =>
    createSelector(getStateByToken(token), (state) => state ? state.passwordRequestRow : null);
export const getTotalItemByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.totalItem : null);
export const getShowMassgeByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.passWordInvalid : null);
export const getGroupModeByToken = (token) => createSelector(getStateByToken(token),
    (state) => {
        if (state) {
            return state.groupMode;
        }
    });
export const getGroupDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridGroupData : '');
export const getSelectGroupHashByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectGroupHash : []);
export const getDepartments = (token) => createSelector(getStateByToken(token), (state) => state ? state.departments : []);






// function groupItemrUpdateDeleteTotal(state: PostOfficeState, row: GridData) : Group[] {
//     const filesData = state.groups;
//     const tmp = {};
//     const groupData = filesData.map((group1) => {
//     });
//     return groupData;
// }




