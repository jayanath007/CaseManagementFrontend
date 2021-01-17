import { forEach } from '@angular/router/src/utils/collection';
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { createDefultColumnDef, applyFieldSort } from '../../core/lib/grid-helpers';
import {
    DropdownListData, MatterResponse, Branch
} from '../models/interfaces';

import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { SearchAdvancedInfo, SerchInfoResponce, AdvancedSearchViewModel, AdvanceSearchRequest } from '../models/requests';
import { MatterSearchMode, SearchColumnOption, ViewChangeKind } from '../models/enums';
import { MainMenuItem } from '../../layout-desktop';
import { LocalStorageKey } from '../../core';





export interface State {
    readonly [token: string]: AdvancedSearchState;
}

export interface AdvancedSearchState {
    readonly searchAdvancedInfo: SearchAdvancedInfo;
    readonly searchMode: string;
    readonly appCodeList: DropdownListData[];
    readonly clientList: string[];
    readonly paginatorDef: PaginatorDef;
    readonly advancedSearchViewModel: AdvancedSearchViewModel;
    readonly total: number;
    readonly gridDataList: any;
    readonly coloumnArray: string[];
    readonly defaultColoumnArray: string[];
    readonly loading: boolean;
    readonly branchList: Branch[];
    readonly defaultHeaders: ColumnDef[];
    readonly columnHeaders: ColumnDef[];
    readonly customSearchFields: string[];
    readonly inString: boolean;





}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_ADVANCED_SEARCH_VIEW:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };

        case Actions.LOAD_APP_CODE_DATA:
            tmp[action.token] = getAppCode(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_APP_CODE_DATA_SUCCESS:
            tmp[action.token] = getAppCodeSucces(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.LOAD_APP_CODE_DATA_FAIL:
            tmp[action.token] = getAppCodeFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.GET_CLIENT_LIST_ADVANCED_SEARCH:
            tmp[action.token] = getClient(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_CLIENT_LIST_ADVANCED_SEARCH_SUCCESS:
            tmp[action.token] = getClientSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_CLIENT_LIST_ADVANCED_SEARCH_FAIL:
            tmp[action.token] = getClientFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.GET_BRANCH_LIST_ADVANCED_SEARCH:
            tmp[action.token] = getBranch(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_BRANCH_LIST_ADVANCED_SEARCH_SUCCESS:
            tmp[action.token] = getBranchSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_BRANCH_LIST_ADVANCED_SEARCH_FAIL:
            tmp[action.token] = getBranchFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.GET_MATTER_ADVANCED_LOADING_INFO:
            tmp[action.token] = getAdvancedLoadData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_MATTER_ADVANCED_LOADING_INFO_SUCCESS:
            tmp[action.token] = getAdvancedLoadDataSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_MATTER_ADVANCED_LOADING_INFO_FAIL:
            tmp[action.token] = getAdvancedLoadDataFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.GET_ADVANCED_SEARCH_HEADERS:
            tmp[action.token] = getSearchHeaders(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_ADVANCED_SEARCH_HEADERS_SUCCESS:
            tmp[action.token] = getSearchHeadersSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.GET_ADVANCED_SEARCH_HEADERS_FAIL:
            tmp[action.token] = getSearchHeadersFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.REQUEST_ADVANCED_GRID_DATA:
            tmp[action.token] = requestAdvancedGridData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_ADVANCED_SEARCH_DATA_SUCCESS:
            tmp[action.token] = getAdvancedGridDataSuccess(state[action.token], action.payload.response,
                action.payload.request);
            return { ...state, ...tmp };
        case Actions.LOAD_ADVANCED_SEARCH_DATA_FAIL:
            tmp[action.token] = getAdvancedGridDataFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.ADVANCED_SEARCH_VIEW_CHANGE:
            tmp[action.token] = viewChange(state[action.token], action);
            return { ...state, ...tmp };

        case Actions.ADVANCED_SEARCH_APP_CODE_CHANGE:
            tmp[action.token] = appCodeChange(state[action.token], action);
            return { ...state, ...tmp };

        case Actions.ADVANCED_SEARCH_SET_COLOUMN_HEADERS:
            tmp[action.token] = setColoumHeaders(state[action.token], action.payload.headers);
            return { ...state, ...tmp };

        case Actions.ADVANCED_SEARCH_COLOUMN_RIGHT_CLICK:
            tmp[action.token] = setColoumSelected(state[action.token], action);
            return { ...state, ...tmp };

        case Actions.ADVANCED_SEARCH_GRID_VIEW_CHANGE:
            tmp[action.token] = GridViewChange(state[action.token], action);
            return { ...state, ...tmp };




        default:
            { return state; }
    }
}


function initView(state: AdvancedSearchState, action: Actions.InitAdvancedSearchView): Partial<AdvancedSearchState> {
    if (!state) {

        return {
            ...state,
            advancedSearchViewModel: {
                searchClients: '',
                searchMatters: '',
                branchId: 0,
                matterClosed: false,
                appId: 0,
                searchColumnOption: '',
                matterSearchMode: '',
                searchFields: [],
                inString: false,
            },

            defaultColoumnArray: [],
            loading: false,
            columnHeaders: [],
            coloumnArray: [],
            defaultHeaders: [],
            customSearchFields: [],
            paginatorDef: action.payload.paginatorDef,
            gridDataList: [],
            total: 0,
            inString: false,

        };
    } else {
        return state;
    }
}

function getAdvancedLoadData(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return {
        ...state,
        advancedSearchViewModel: {
            searchClients: '',
            searchMatters: '',
            branchId: 0,
            matterClosed: false,
            appId: 0,
            searchColumnOption: '',
            matterSearchMode: '',
            searchFields: [],
            inString: false,
        },
        loading: false,
        defaultColoumnArray: [],
        columnHeaders: [],
        coloumnArray: [],
        defaultHeaders: [],
        customSearchFields: [],
        paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 }),
        gridDataList: [],
        total: 0,
        inString: false,
    };
}
function getAdvancedLoadDataSuccess(state: AdvancedSearchState, loadingInfo: any): Partial<AdvancedSearchState> {
    let defCol: ColumnDef[] = [];
    loadingInfo.appStaticColumnHeaders.forEach(h => {
        defCol = defCol.concat(createDefultColumnDef(h, {
            label: getColName(h), fxFlex: getColWidth(h),
            filterAnchor: 'end', filterHidden: true
        }));
    });

    if (loadingInfo.branchId !== 0) {
        defCol = defCol.filter(c => c.fieldName !== 'Branch_Name');
    }


    return {
        ...state,
        searchAdvancedInfo: {
            ...state.searchAdvancedInfo,
            branchId: loadingInfo.branchId,
            appID: loadingInfo.appId,

        },
        advancedSearchViewModel: {
            ...state.advancedSearchViewModel,
            searchColumnOption: loadingInfo.columnOptionMode,
            matterSearchMode: loadingInfo.matterSearchMode,
            appId: loadingInfo.appId,
            branchId: loadingInfo.branchId,
            inString: loadingInfo.inString,


        },
        loading: false,
        defaultHeaders: defCol,
        defaultColoumnArray: loadingInfo.appStaticColumnHeaders,
        coloumnArray: loadingInfo.appStaticColumnHeaders.concat(loadingInfo.appDynamicColumnHeaders),



    };


}

function getColName(colName: string): string {
    const menuItem: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
    const clientDisplyName = menuItem.find(i => i.id === 'client_search').label;
    switch (colName) {
        case 'Id': return 'Id';
        case 'MAT_Ref': return 'Ref';
        case 'SAL_Account_Name': return `${clientDisplyName} Name`;
        case 'MAT_Details': return 'Details';
        case 'MAT_Fee_Earner': return 'F/E';
        case 'MAT_Start_Date': return 'Opened';
        case 'Branch_Name': return 'Branch'; // Branch_Name
        case 'Mat_APCode': return 'App';  // MAT_AppID
        case 'MAT_FileID': return 'File';
        default: return colName;
    }
}

function getColWidth(colName: string): string {
    switch (colName) {
        case 'MAT_Ref': return '100px';
        case 'MAT_Details': return '20%';
        case 'MAT_Fee_Earner': return '80px';
        case 'Mat_APCode': return '100px';  // MAT_AppID
        default: return '150px';
    }
}
function getAdvancedLoadDataFail(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: false };
}



function getClient(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: true };
}
function getClientSuccess(state: AdvancedSearchState, clientData): Partial<AdvancedSearchState> {
    return {
        ...state,
        loading: false,
        clientList: clientData.data.data,
    };
}
function getClientFail(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: false };
}

function getBranch(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: true };
}
function getBranchSuccess(state: AdvancedSearchState, branch: Branch[]): Partial<AdvancedSearchState> {
    const alltype: Branch = { branchId: 0, branchName: 'All' };
    return {
        ...state,
        loading: false,
        branchList: branch.length > 1 ? branch.concat(alltype) : branch,
    };
}
function getBranchFail(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: false };
}


function getSearchHeaders(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return {
        ...state,
        loading: true,
        gridDataList: [],
        total: 0,

    };
}
function getSearchHeadersSuccess(state: AdvancedSearchState, payload): Partial<AdvancedSearchState> {
    return {
        ...state,
        loading: false,
        appCodeList: state.appCodeList.map(app => {
            if (app.key === state.searchAdvancedInfo.appID) {
                return { ...app, headers: payload };
            } else {
                return app;
            }
        }),

    };
}
function getSearchHeadersFail(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: false };
}

function getAppCode(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: true };
}
function getAppCodeSucces(state: AdvancedSearchState, appCodes: DropdownListData[]): Partial<AdvancedSearchState> {
    const alltype: DropdownListData = { key: 0, value: 'All', headers: [] };
    return {
        ...state,
        loading: false,
        appCodeList: appCodes ? appCodes.concat(alltype) : [alltype],

    };
}
function getAppCodeFail(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: false };
}

function appCodeChange(state: AdvancedSearchState, action: Actions.AdvancedSearchAppCodeChange): Partial<AdvancedSearchState> {
    return {
        ...state,
        gridDataList: [],
        columnHeaders: [],
        searchAdvancedInfo: { ...state.searchAdvancedInfo, appID: action.payload.value },

    };
}

function setColoumHeaders(state: AdvancedSearchState, headers: string[]): Partial<AdvancedSearchState> {

    let tempCol: ColumnDef[] = [];
    if (headers) {
        headers.forEach(h => {
            tempCol = tempCol.concat(createDefultColumnDef(h, { label: h, fxFlex: '20', filterAnchor: 'end', filterHidden: true, disableShort: true }));
        });

    }

    return {
        ...state,
        columnHeaders: state.defaultHeaders.concat(tempCol),
        coloumnArray: state.defaultColoumnArray.concat(headers),
        loading: false,


        advancedSearchViewModel: {
            ...state.advancedSearchViewModel,

            searchFields: updateColoumn(state, state.defaultColoumnArray.concat(headers), state.advancedSearchViewModel.searchColumnOption),
            // searchFields: ['MAT_Fee_Earner'],

        }
    };
}


function requestAdvancedGridData(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    let customFields: string[] = [];
    let filtterCol: string[] = [];
    let filtterColHeader: ColumnDef[] = [];

    if (state.advancedSearchViewModel.searchColumnOption === SearchColumnOption.Custom) {

        customFields = state.advancedSearchViewModel.searchFields;

    }

    if (state.advancedSearchViewModel.branchId !== 0) {

        filtterCol = state.coloumnArray.filter(f => f !== 'Branch_Name');
        filtterColHeader = state.columnHeaders.filter(f => f.fieldName !== 'Branch_Name');

    } else {
        if (state.coloumnArray.find(i => i === 'Branch_Name')) {
            // filtterCol = state.coloumnArray;
            filtterCol = state.coloumnArray.filter(f => f !== 'Branch_Name').concat('Branch_Name');
        } else {
            filtterCol = state.coloumnArray.concat('Branch_Name');
        }

        if (state.columnHeaders.find(c => c.fieldName === 'Branch_Name')) {
            // filtterColHeader = state.columnHeaders;
            filtterColHeader = state.columnHeaders.filter(c => c.fieldName !== 'Branch_Name').concat(createDefultColumnDef('Branch_Name',
                { label: getColName('Branch_Name'), fxFlex: '150px', filterAnchor: 'end', filterHidden: true }));
        } else {
            filtterColHeader = state.columnHeaders.concat(createDefultColumnDef('Branch_Name',
                { label: getColName('Branch_Name'), fxFlex: '150px', filterAnchor: 'end', filterHidden: true }));
        }

    }
    return {
        ...state,
        loading: true,
        coloumnArray: filtterCol,
        columnHeaders: filtterColHeader,
        customSearchFields: customFields,
        //   paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
    };
}
function getAdvancedGridDataSuccess(state: AdvancedSearchState,
    response: MatterResponse, request: AdvanceSearchRequest): Partial<AdvancedSearchState> {
    let sFields: string[] = [];
    let colOption: string;
    if (response.data.data['searchColumnOption'] === SearchColumnOption.Date) {

        sFields = updateColoumn(state, state.coloumnArray, response.data.data['searchColumnOption']);
        colOption = response.data.data['searchColumnOption'];

    } else {
        sFields = state.advancedSearchViewModel.searchFields;
        colOption = state.advancedSearchViewModel.searchColumnOption;
    }

    return {
        ...state,
        loading: false,
        total: response.data.total,
        gridDataList: response.data.data['MatterList'],
        inString: response.data.data['InString'],


        advancedSearchViewModel: {
            ...state.advancedSearchViewModel,
            searchColumnOption: colOption,
            searchFields: sFields,

        },

    };
}
function getAdvancedGridDataFail(state: AdvancedSearchState): Partial<AdvancedSearchState> {
    return { ...state, loading: false };
}

function setColoumSelected(state: AdvancedSearchState, action: Actions.AdvancedSearchColoumnRightClick): Partial<AdvancedSearchState> {
    let filterSerchField: string[] = [];
    if (state.advancedSearchViewModel.searchFields.find(i => i === action.payload.value)) {

        filterSerchField = state.advancedSearchViewModel.searchFields.filter(f => f !== action.payload.value);

    } else {

        filterSerchField = state.advancedSearchViewModel.searchFields.concat(action.payload.value);
    }

    return {
        ...state,
        customSearchFields: filterSerchField,
        advancedSearchViewModel: {
            ...state.advancedSearchViewModel,
            searchFields: filterSerchField,
            searchColumnOption: SearchColumnOption.Custom,
        },


    };
}

function updateColoumn(state: AdvancedSearchState, coloumnArray, key) {
    let sfield: string[] = [];
    switch (key) {
        case SearchColumnOption.Custom: {

            // sfield = ['MAT_Ref', 'MAT_Details', 'SAL_Account_Name'];
            sfield = state.customSearchFields;

            return sfield;
        }

        case SearchColumnOption.All: {

            const a = ['MAT_Fee_Earner', 'MAT_Start_Date', 'Branch_Name', 'Mat_APCode'];

            sfield = coloumnArray;
            a.forEach((data) => {
                sfield = sfield.filter(val => val !== data);
            });


            return sfield;
        }
        case SearchColumnOption.Speed: {

            sfield = ['MAT_Ref', 'MAT_Details', 'SAL_Account_Name'];


            return sfield;
        }

        case SearchColumnOption.Date: {

            // sfield = ['MAT_Ref', 'MAT_Details', 'SAL_Account_Name', 'MAT_Start_Date'];

            if (state.advancedSearchViewModel.searchFields.find(i => i === 'MAT_Start_Date')) {
                sfield = state.advancedSearchViewModel.searchFields;

            } else {

                sfield = state.advancedSearchViewModel.searchFields.concat('MAT_Start_Date');
            }

            return sfield;

        }



        case SearchColumnOption.Client: {

            if (coloumnArray.find(i => i === 'SAL_Account_Name')) {
                sfield = ['SAL_Account_Name'];

            } else {
                sfield = [];
            }

            return sfield;
        }


    }



}

function GridViewChange(state: AdvancedSearchState, action: Actions.AdvancedSearchGridViewChange) {
    switch (action.payload.kind) {
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                columnHeaders: applyFieldSort(state.columnHeaders, action.payload.value as ColumnDef),
            };
        case ViewChangeKind.PageEvent:
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

function viewChange(state: AdvancedSearchState, action: Actions.AdvancedSearchViewChange): Partial<AdvancedSearchState> {

    switch (action.payload.kind) {
        case ViewChangeKind.SearchMatter:
            let sMode: string;
            //   sMode = SearchColumnOption.Speed;

            if (action.payload.value !== null) {
                if (state.advancedSearchViewModel.matterSearchMode === MatterSearchMode.Client) {
                    sMode = SearchColumnOption.All;

                } else {

                    sMode = state.advancedSearchViewModel.searchColumnOption;
                }
            }

            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    searchColumnOption: sMode,
                    searchMatters: action.payload.value,
                    searchFields: updateColoumn(state, state.coloumnArray, sMode),
                    searchClients: ''


                },

                // paginatorDef: { currentPage: 0, itemPerPage: 50 },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })


            };
        case ViewChangeKind.SearchClient:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    searchColumnOption: SearchColumnOption.Client,
                    searchClients: action.payload.value,
                    searchFields: updateColoumn(state, state.coloumnArray, SearchColumnOption.Client),

                    matterSearchMode: MatterSearchMode.Client  // not null Client

                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })


            };
        case ViewChangeKind.ChangeAppCode:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    searchColumnOption: SearchColumnOption.Client,
                    searchFields: updateColoumn(state, state.coloumnArray, SearchColumnOption.Client),

                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })


            };
        case ViewChangeKind.RightClickHeader:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    searchColumnOption: SearchColumnOption.Custom,
                    searchFields: updateColoumn(state, state.coloumnArray, SearchColumnOption.Custom),

                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })


            };
        case ViewChangeKind.SpeedSearchClick:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    searchColumnOption: SearchColumnOption.All,
                    searchFields: updateColoumn(state, state.coloumnArray, SearchColumnOption.All),

                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })


            };
        case ViewChangeKind.FindAllClick:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    searchColumnOption: SearchColumnOption.Speed,
                    searchFields: updateColoumn(state, state.coloumnArray, SearchColumnOption.Speed),

                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })


            };
        case ViewChangeKind.IsMatterClosed:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    matterClosed: action.payload.value,

                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })

            };

        case ViewChangeKind.ChangeBranch:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    branchId: action.payload.value,

                },
                searchAdvancedInfo: {
                    ...state.searchAdvancedInfo,
                    branchId: action.payload.value,
                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })

            };

        case ViewChangeKind.Default:
            return {
                ...state,
                advancedSearchViewModel: {
                    ...state.advancedSearchViewModel,
                    searchColumnOption: SearchColumnOption.All,
                    searchFields: updateColoumn(state, state.coloumnArray, SearchColumnOption.All),

                },
                paginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })

            };
        default: {
            return state;
        }
    }
}

function paginatorChange(pagerDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage


    };
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getLoadingByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loading : null);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnHeaders : []);
export const getClientListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.clientList : null);
export const getAppCodeListByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.appCodeList : null);
export const getSearchAdvancedInfoByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.searchAdvancedInfo : null);
export const getSelectedAppListItem = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.appCodeList.find(i => i.key === state.searchAdvancedInfo.appID) : null);
export const getpaginatorDefByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.paginatorDef : null);
export const getAdvancedSearchViewModeByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.advancedSearchViewModel : null);

export const getSearchGridDataListByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.gridDataList : null);

export const getColoumnArrayByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.coloumnArray : null);

export const getBranchListByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.branchList : null);
export const getMatterTotalByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.total : null);



