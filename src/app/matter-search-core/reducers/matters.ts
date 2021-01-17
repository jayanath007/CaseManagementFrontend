import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/matters';
import {
    MatterResponse, Department, EmployeeDetails,
    GridRowItemWrapper, MatterWrapResponse, MatterFinance, ReviewNoteResponce
} from '../models/interfaces';

import { MatterRequest, MatterRequestForMatterCreate, MatterCreateInputModel } from '../models/requests';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { createColumnDefHash, clearFilters, applyFieldSort, applyColumnFilter } from '../../core/lib/grid-helpers';
import { MatterViews, ViewChangeKind } from '../models/enums';
import { BasePopupType } from '../../shared/models/consol-error';

export interface MatterGridView { [hash: string]: MatterWrapResponse; }
export interface ItemRepository { [materRef: string]: GridRowItemWrapper; }

export interface RequestHashInfo {
    hashKey: string;
    lastTouch: Date;
    order: string[];
    total: number;
    loading: boolean;
    totalBillOutstandingBalance: number;
    totalMatterCount: number;
}

export interface State {
    views: {
        [token: string]: MatterState;
    };
}

export interface MatterState {
    readonly departmentLoading: boolean;
    readonly expandRow: GridRowItemWrapper;
    readonly matterFinanceLoading: boolean;
    readonly visibleAllColumn: boolean;
    readonly selectedRow: GridRowItemWrapper;
    readonly itemRepository: ItemRepository;
    readonly requestHash: RequestHashInfo[];
    readonly departments: ReadonlyArray<Department>;
    readonly activeView: MatterViews;
    readonly closeMatters: boolean;
    readonly completedMatters: boolean;
    readonly isMLSEnableMatters: boolean;
    readonly inactiveFeeEraners: boolean;
    readonly selectedMember: EmployeeDetails;
    readonly sarchText: string;
    // readonly currentPage: number;
    readonly columnDef: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly viewChangeKind: ViewChangeKind;
    readonly isUserExpandRow: boolean;
    readonly isPopup: boolean;
    readonly isMatterCreate: boolean;
    readonly matterCreateInputData: MatterCreateInputModel;
    readonly inputData: any;

    readonly refferalNoteLoading: any;
    readonly refferalNotePopupClose: number;
    readonly currentReviewNote: ReviewNoteResponce;
    readonly matterInforLoading: boolean;
}

const initialState: State = { views: {} };

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_MATTER_VIEW:
            tmp[action.token] = initView(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.INIT_MATTER_CREATE_SEARCH_POPUP:
            tmp[action.token] = initMatterCreatePopup(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.MATTER_VIEW_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_DEPARTMENTS:
            tmp[action.token] = getLoadDepartments(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_DEPARTMENTS_SUCCESS:
            tmp[action.token] = getLoadDepartmentsSuccess(state.views[action.token], action.payload.items);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_DEPARTMENTS_FAIL:
            tmp[action.token] = getLoadDepartmentsFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_MATTER_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_MATTER_GRID_DATA_BY_SEARCH_FIELD:
            tmp[action.token] = preLoadDataForMatterCreation(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.MATTER_LOAD_SUCESSS:
            tmp[action.token] = matterLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.MATTER_LOAD_FAIL:
            tmp[action.token] = matterLoadFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_ROW_EXPAN_DATA:
            tmp[action.token] = rowExpanDataChange(state.views[action.token], action.payload.selectedRowItem);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_ROW_SELECT_DATA:
            tmp[action.token] = rowSelectDataChange(state.views[action.token], action.payload.selectedRowItem);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_MATTER_FINANCE:
            tmp[action.token] = preLoadMatterFinance(state.views[action.token], action.selectedRowItem);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_MATTER_FINANCE_SUCCESS:
            tmp[action.token] = loadMatterFinanceSuccess(state.views[action.token], action.payload.selectedRowItem,
                action.payload.billsData);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_MATTER_FINANCE_FAIL:
            tmp[action.token] = getLoadFinanceFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.REFRESH_MATTER:
            tmp[action.token] = clearMatterRepo(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.EXIT_MATTER_SEARCH_POPUP:
            tmp[action.token] = null;
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.ADD_UPDATE_REVIEW_DATA:
            tmp[action.token] = referralNoteAdd(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.ADD_UPDATE_REVIEW_DATA_SUCCESS:
            tmp[action.token] = referralNoteAddSuccess(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.ADD_UPDATE_REVIEW_DATA_FAIL:
            tmp[action.token] = referralNoteAddFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_REVIEW_DATA:
            tmp[action.token] = { ...state.views[action.token], refferalNoteLoading: true, currentReviewNote: null };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_REVIEW_DATA_SUCCESS:
            tmp[action.token] = { ...state.views[action.token], refferalNoteLoading: false, currentReviewNote: action.payload.response };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_REVIEW_DATA_FAIL:
            tmp[action.token] = { ...state.views[action.token], refferalNoteLoading: false, currentReviewNote: null };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_MATTER_INFO_AND_EXIT_MATTER_SEARCH_POPUP:
            tmp[action.token] = { ...state.views[action.token], matterInforLoading: true };
            return { ...state, views: { ...state.views, ...tmp } };

        default: {
            return state;
        }
    }
}

function initView(state: MatterState, action: Actions.InitMatterView): Partial<MatterState> {
    if (!state) {
        return {
            ...state,
            inactiveFeeEraners: false,
            closeMatters: false,
            completedMatters: false,
            sarchText: (action.payload.inputData && action.payload.inputData.searchText) ? action.payload.inputData.searchText : '',
            activeView: (action.payload.inputData && action.payload.inputData.basePopupType === BasePopupType.EmailAttachDPSfile) ?
                MatterViews.Suggested :
                (action.payload.inputData && action.payload.inputData.searchText) ? MatterViews.All : MatterViews.Recent,
            departments: [],
            selectedMember: null,
            // currentPage: 1,
            itemRepository: {},
            requestHash: [],
            columnDef: action.payload.columnDef,
            paginatorDef: action.payload.paginatorDef,
            isUserExpandRow: false,
            isPopup: action.payload.isPopup,
            inputData: action.payload.inputData ? action.payload.inputData : null,
            refferalNotePopupClose: 0

        };
    } else {
        // return { // fix preload issue
        //     ...state,
        //     columnDef: action.payload.columnDef.map(i => {
        //         const oldCol = state.columnDef.find(oc => oc.fieldName === i.fieldName);
        //         if (!!oldCol) {
        //             return { ...i, filter: oldCol.filter, filterActive: oldCol.filterActive, sort: oldCol.sort };
        //         }
        //         return i;
        //     })
        // };
        return state;
    }
}
function initMatterCreatePopup(state: MatterState, action: Actions.InitMatterForMatterCreatePopup): Partial<MatterState> {
    if (!state) {
        return {
            ...state,
            inactiveFeeEraners: false,
            closeMatters: false,
            completedMatters: false,
            sarchText: action.payload.inputData.searchText || '',
            activeView: MatterViews.All,
            departments: [],
            selectedMember: null,
            // currentPage: 1,
            itemRepository: {},
            requestHash: [],
            columnDef: action.payload.columnDef,
            paginatorDef: action.payload.paginatorDef,
            isUserExpandRow: false,
            isPopup: action.payload.isPopup,
            isMatterCreate: action.payload.isMatterCreate,
            matterCreateInputData: action.payload.inputData
        };
    } else {
        if (!action.payload.allColumnsForMatters) {
            return state;
        }
        return { // fix preload issue
            ...state,
            columnDef: action.payload.allColumnsForMatters.map(i => {
                const oldCol = state.columnDef.find(oc => oc.fieldName === i.fieldName);
                if (!!oldCol) {
                    return { ...i, filter: oldCol.filter, filterActive: oldCol.filterActive, sort: oldCol.sort };
                }
                return i;
            })
        };
    }
}

function preLoadData(state: MatterState, request: MatterRequest): Partial<MatterState> {
    const newInfo = [request].map<RequestHashInfo>((req) =>
        ({
            hashKey: req.hash, lastTouch: new Date(), loading: true, order: [], total: 0,
            totalBillOutstandingBalance: 0.00,
            totalMatterCount: 0
        }));
    return {
        ...state, requestHash: state.requestHash.filter((_info) => !!newInfo
            .find(_xinfo => _xinfo.hashKey === _info.hashKey)).concat(newInfo)
    };
}
// For Matter Creation
function preLoadDataForMatterCreation(state: MatterState, request: MatterRequestForMatterCreate): Partial<MatterState> {
    const newInfo = [request].map<RequestHashInfo>((req) =>
        ({
            hashKey: req.hash, lastTouch: new Date(), loading: true, order: [], total: 0,
            totalBillOutstandingBalance: 0.00,
            totalMatterCount: 0
        }));
    return {
        ...state, requestHash: state.requestHash.filter((_info) => !!newInfo
            .find(_xinfo => _xinfo.hashKey === _info.hashKey)).concat(newInfo)
    };
}

function matterLoadSuccess(state: MatterState, response: MatterResponse, request: MatterRequest): Partial<MatterState> {
    if (!state) {
        return state;
    }
    const mutated = response.data.data.reduce((info, item) => {
        if (info.repo[item.matterReferenceNo]) {
            info.repo[item.matterReferenceNo] = { ...info.repo[item.matterReferenceNo], data: item };
        } else {
            info.repo[item.matterReferenceNo] = { ...info.repo[item.matterReferenceNo], data: item, selected: false, expanded: false };
            // selected: item.matterReferenceNo === response.data.data[0].matterReferenceNo ? true : false,
            // expanded: item.matterReferenceNo === response.data.data[0].matterReferenceNo ? true : false
        }
        info.order.push(item.matterReferenceNo);
        return info;
    }, { repo: { ...state.itemRepository }, order: [] });

    const reqInfo = state.requestHash.map((info) => {
        if (info.hashKey === request.hash) {
            return {
                ...info, loading: false, total: response.data.total, order: mutated.order,
                totalBillOutstandingBalance: response.totalBillOutstandingBalance,
                totalMatterCount: response.totalMatterCount
            };
        } else {
            return info;
        }
    });

    return { ...state, itemRepository: mutated.repo, requestHash: reqInfo };
}


function referralNoteAdd(state: MatterState) {
    return {
        ...state,
        refferalNoteLoading: true,

    };

}

function referralNoteAddSuccess(state: MatterState) {
    return {
        ...state,
        refferalNoteLoading: false,
        refferalNotePopupClose: state.refferalNotePopupClose + 1
    };

}

function referralNoteAddFail(state: MatterState) {
    return {
        ...state,
        refferalNoteLoading: false,

    };

}

function mutateRepository(repo: ItemRepository,
    predicate: (item: GridRowItemWrapper) => boolean,
    callback: (item: GridRowItemWrapper) => GridRowItemWrapper): ItemRepository {
    return Object.values(repo).reduce((_repo, item) => {
        if (predicate(item)) {
            _repo[item.data.matterReferenceNo] = callback(item);
        } else {
            _repo[item.data.matterReferenceNo] = item;
        }
        return _repo;
    }, {});
}

function rowExpanDataChange(state: MatterState, newItem: GridRowItemWrapper): Partial<MatterState> {
    const predicate = (item: GridRowItemWrapper) => item.data.matterReferenceNo === newItem.data.matterReferenceNo || item.expanded;
    const mutation = (item: GridRowItemWrapper) => {
        if (!item.expanded === true && item.data.matterReferenceNo === newItem.data.matterReferenceNo) {
            return { ...item, expanded: true };
        } else {
            return { ...item, expanded: false };
        }
    };
    const newRepo = mutateRepository(state.itemRepository, predicate, mutation);
    return { ...state, itemRepository: newRepo, isUserExpandRow: true };
}

function preLoadMatterFinance(state: MatterState, changedItem: GridRowItemWrapper) {
    const predicate = (item: GridRowItemWrapper) => item.data.matterReferenceNo === changedItem.data.matterReferenceNo;
    const mutation = (item: GridRowItemWrapper) => {
        return { ...item, loading: true };
    };
    const newRepo = mutateRepository(state.itemRepository, predicate, mutation);
    return { ...state, itemRepository: newRepo };
}

function loadMatterFinanceSuccess(state: MatterState, changedItem: GridRowItemWrapper, details: MatterFinance) {
    const predicate = (item: GridRowItemWrapper) => item.data.matterReferenceNo === changedItem.data.matterReferenceNo;
    const mutation = (item: GridRowItemWrapper) => {
        return { ...item, financeDetails: details, loading: false };
    };
    const newRepo = mutateRepository(state.itemRepository, predicate, mutation);
    return { ...state, itemRepository: newRepo };
}
function getLoadFinanceFail(state: MatterState): Partial<MatterState> {
    return { ...state };
}
function clearMatterRepo(state: MatterState): Partial<MatterState> {
    return { ...state, itemRepository: null };
}
function rowSelectDataChange(state: MatterState, newItem: GridRowItemWrapper) {
    const predicate = (item: GridRowItemWrapper) => item.data.matterReferenceNo === newItem.data.matterReferenceNo || item.expanded;
    const mutation = (item: GridRowItemWrapper) => {
        if (item.data.matterReferenceNo === newItem.data.matterReferenceNo) {
            return { ...item, selected: true };
        } else {
            return { ...item, selected: false };
        }
    };
    const newRepo = mutateRepository(state.itemRepository, predicate, mutation);
    return { ...state, itemRepository: newRepo };
}
// function getLoadFinance(state: MatterState, item: GridRowItemWrapper): Partial<MatterState> {
//     return state;
// }
// function getLoadFinanceFail(state: MatterState): Partial<MatterState> {
//     return { ...state };
// }
function matterLoadFail(state: MatterState): Partial<MatterState> {
    const reqInfo = state.requestHash.map((info) => {
        return { ...info, loading: false };
    });

    return { ...state, requestHash: reqInfo, matterInforLoading: false };
}
function getLoadDepartments(state: MatterState): Partial<MatterState> {
    return { ...state, departmentLoading: true };
}
function getLoadDepartmentsSuccess(state: MatterState, newData: Department[]): Partial<MatterState> {
    return { ...state, departments: Object.freeze(newData), departmentLoading: false };
}
function getLoadDepartmentsFail(state: MatterState): Partial<MatterState> {
    return { ...state, departmentLoading: false };
}
// function changeColumVisibility(viewType: MatterViews, currentColumns: ColumnDef[]): ColumnDef[] {
//     switch (viewType) {
//         case MatterViews.All:
//             return allColums(currentColumns);
//         case MatterViews.MyMatter:
//             return allColums(currentColumns);
//         case MatterViews.Recent:
//             return limitedColums(currentColumns);
//         default: {
//             return allColums(currentColumns);
//         }
//     }
// }
// function allColums(columns: ColumnDef[]) {
//     return columns.map((column) => {
//         if (column.fieldName === 'LastUsed' || column.fieldName === 'ReviewDate' || column.fieldName === 'ReviewNote') {
//             return Object.freeze({ ...column, visible: true });
//         }
//         return column;
//     });
// }
// function limitedColums(columns: ColumnDef[]) {
//     return columns.map((column) => {
//         if (column.fieldName === 'LastUsed' || column.fieldName === 'ReviewDate' || column.fieldName === 'ReviewNote') {
//             return Object.freeze({ ...column, visible: false });
//         }
//         return column;
//     });
// }

function viewChange(state: MatterState, action: Actions.MatterViewChange): Partial<MatterState> {
    switch (action.payload.kind) {
        case ViewChangeKind.Department:
            // const viewValue = (action.payload.value !== null) ? (action.payload.value !== -1) ? MatterViews.MyMatter
            //     : MatterViews.Recent : MatterViews.Recent;
            const viewValue = (action.payload.value === null || action.payload.value === -1) ? MatterViews.Recent : MatterViews.MyMatter;
            return {
                ...state,
                sarchText: '',
                departments: departmentChange(state.departments, action.payload.value),
                viewChangeKind: action.payload.kind,
                inactiveFeeEraners: action.payload.value ? state.inactiveFeeEraners : false,
                selectedMember: null,
                activeView: viewValue,
                isMLSEnableMatters: viewValue !== MatterViews.MyMatter ? false : state.isMLSEnableMatters,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 }),
                columnDef: action.payload.columnSet,
                // closeMatters: action.payload.value ? state.inactiveFeeEraners : false,
            };
        case ViewChangeKind.MainView:
            return {
                ...state,
                sarchText: '',
                activeView: action.payload.value,
                isMLSEnableMatters: action.payload.value !== MatterViews.MyMatter ? false : state.isMLSEnableMatters,
                columnDef: action.payload.columnSet,
                viewChangeKind: action.payload.kind,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ViewChangeKind.ClosedMatters:
            return {
                ...state,
                closeMatters: action.payload.value,
                // completedMatters: action.payload.value ? false : state.completedMatters,
                viewChangeKind: action.payload.kind,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ViewChangeKind.CompletedMatters:
            return {
                ...state,
                completedMatters: action.payload.value,
                // closeMatters: action.payload.value ? false : state.closeMatters,
                viewChangeKind: action.payload.kind,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ViewChangeKind.InactiveFeeEarners:
            return {
                ...state,
                inactiveFeeEraners: action.payload.value,
                viewChangeKind: action.payload.kind,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ViewChangeKind.SearchText:
            return {
                ...state,
                sarchText: action.payload.value,
                activeView: state.isMatterCreate ? MatterViews.All : (action.payload.value ? MatterViews.All : MatterViews.Recent),
                columnDef: state.isMatterCreate && action.payload.allColumnDef ? action.payload.allColumnDef : action.payload.columnSet,
                departments: departmentChange(state.departments, null),
                viewChangeKind: action.payload.kind,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 }),
                matterCreateInputData: state.isMatterCreate ? {
                    BranchId: null,
                    ClientName: null,
                    ClientReference: null,
                    MatterDetails: null,
                    MatterReference: null,
                    searchText: action.payload.value
                } : undefined
            };
        case ViewChangeKind.PageChange:
            return {
                ...state,
                paginatorDef: paginatorChange(action.payload.value),
                viewChangeKind: action.payload.kind,
            };
        case ViewChangeKind.Employee:
            return {
                ...state,
                selectedMember: action.payload.value,
                viewChangeKind: action.payload.kind,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };

        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state,
                columnDef: applyColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                viewChangeKind: action.payload.kind,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };

        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                viewChangeKind: action.payload.kind
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
                viewChangeKind: action.payload.kind
            };
        case ViewChangeKind.IsEnableMLSMatters:
            return {
                ...state,
                isMLSEnableMatters: action.payload.value,
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
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

function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def);
        }
        return def;
    });
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

function paginatorChange(pagerDef: PaginatorDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage
    };
}

function departmentChange(current: ReadonlyArray<Department>, newValue: number) {
    return Object.freeze(current.map((department) => {
        if (department.groupId === newValue) {
            return Object.freeze({ ...department, selected: true });
        } else if (department.selected) {
            return Object.freeze({ ...department, selected: false });
        }
        return department;
    }));
}

function createViewhash(state: MatterState) {
    if (!state) {
        return null;
    }
    const selectedUser: any = state && state.selectedMember ? state.selectedMember.User : '';
    return [state.paginatorDef.currentPage, state.sarchText, state.activeView,
    state.closeMatters, state.completedMatters, state.isMLSEnableMatters,
    state.inactiveFeeEraners, selectedUser,
    createColumnDefHash(state.columnDef)].join('');
}

export const getViews = (state: State) => state.views;
export const getViewByToken = (token) => createSelector(getViews, (views) => views[token]);
export const getColumnDefByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.columnDef : null);
// export const getColumnDefByToken = (token) => createSelector(getAllColumnDefByToken(token), (view) => view.filter(col => col.visible));
export const getDepartmentByToken = (token) => createSelector(getViewByToken(token),
    (matterState) => matterState ? matterState.departments : null);
export const getActiveViewByToken = (token) => createSelector(getViewByToken(token),
    (matterState) => matterState ? matterState.activeView : null);
export const getClosedMatterFalgByToken = (token) => createSelector(getViewByToken(token),
    (matterState) => matterState ? matterState.closeMatters : null);
export const getCompletedMatterFalgByToken = (token) => createSelector(getViewByToken(token),
    (matterState) => matterState ? matterState.completedMatters : null);
export const getClosedInactiveFeeEranersFalgByToken = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.inactiveFeeEraners : null);
export const getSearchTextByToken = (token) => createSelector(getViewByToken(token),
    (matterState) => matterState ? matterState.sarchText : null);

export const getMatterCreateInputDataByToken = (token) => createSelector(getViewByToken(token),
    (matterState) => matterState ? matterState.matterCreateInputData : null);

export const getSelectedDepartmentByToken = (token) => createSelector(getDepartmentByToken(token),
    (departments) => departments ? departments.find((dep) => dep.selected) : null);

export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash ? createViewhash : null);
export const getItemRepositoryByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.itemRepository : null);
export const getRequestHashInfoByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.requestHash : null);

export const getCurrentRequestCacheByToken = (token) => createSelector(getRequestHashInfoByToken(token), getCurrentHashByToken(token),
    (reqInfo, hash) => reqInfo ? reqInfo.find((info) => info.hashKey === hash) : null);

export const getCurrentGridDataByToken = (token) => createSelector(getCurrentRequestCacheByToken(token),
    getItemRepositoryByToken(token), (reqCache, repo) => reqCache && !!repo ? reqCache.order.map((matterRef) => repo[matterRef]) : []);

export const getPaginatorDefByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.paginatorDef : null);

export const getCurrentItemTotalByToken = (token) => createSelector(getCurrentRequestCacheByToken(token),
    (info) => info ? info.total : 0);

export const getSelectedMemberByToken = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.selectedMember : null);
export const getRowExpsanDataByToken = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.expandRow : null);
export const getRowSelectDataByToken = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.selectedRow : null);


export const getTotalBillsOutstandingByToken = (token) => createSelector(getCurrentRequestCacheByToken(token),
    (info) => info ? info.totalBillOutstandingBalance : 0);
export const getTotalMatterCountByToken = (token) => createSelector(getCurrentRequestCacheByToken(token),
    (info) => info ? info.totalMatterCount : 0);

export const getDepartmentLoadingStateByToken = (token) =>
    createSelector(getViewByToken(token), (matterState) =>
        matterState ? matterState.departmentLoading && matterState.departmentLoading === true : null);

export const getGridLoadingStateByToken = (token) =>
    createSelector(getViewByToken(token), getCurrentRequestCacheByToken(token), (view, info) => {
        if ((info && info.loading || (view && view.matterInforLoading))) {
            return true;
        } else {
            return false;
        }
    });
export const getViewChangeKindByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.viewChangeKind : null);
export const getIsUserExpandRowByToken = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.isUserExpandRow : null);
export const getIsMLSEnableMatters = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.isMLSEnableMatters : false);
export const getRefferalNotePopupClose = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.refferalNotePopupClose : 0);
export const getRefferalNoteLoading = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.refferalNoteLoading : false);
export const getCurrentReviewNote = (token) =>
    createSelector(getViewByToken(token), (matterState) => matterState ? matterState.currentReviewNote : null);


