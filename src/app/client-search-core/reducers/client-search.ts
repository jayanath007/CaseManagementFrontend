import { ClientPopupType } from './../models/enums';
import { ClientSearchKind } from '../models/enums';
// import { List } from './../../core/lib/microsoft-graph';
import { EMPTY as empty } from 'rxjs';
import { Action, createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';

import { TokenizeAction } from '../../core';
import { Filter, Condition, Logic, FieldType, Operator, SortDirections } from '../../odata';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    createDefultColumnDef, getPaginatorSkip, toODataFilter, toODataSort,
    createColumnDefHash, clearFilters, applyFieldSort, applyColumnFilter
} from '../../core/lib/grid-helpers';
import {
    ClientSearchResponse, ClientGridRowRapper, ClientGridRowList,
    ClientGridData, MatterGridRowRapper, MatterViewModel, MatterExpandData, ClientSearchPopupData
} from '../models/interfaces';

export interface State {
    readonly [token: string]: ClientSearchState;
}

export interface ClientSearchState {
    readonly loading: boolean;
    readonly ClientSearchData: ClientGridRowRapper[];
    readonly showHint: boolean;
    readonly totalItems: number;
    readonly sarchText: string;
    readonly clientColumnDef: ColumnDef[];
    readonly matterColumnDef: ColumnDef[];
    readonly clientPaginatorDef: PaginatorDef;
    readonly popupInputData: ClientSearchPopupData;
    //     readonly viewChangeKind: ViewChangeKind;
    //    // readonly isUserExpandRow: boolean;
    readonly isPopup: boolean;
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp: any = {};
    switch (action.type) {
        case Actions.INIT_CLIENT_SEARCH:
            tmp[action.token] = initClientSearchView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CLIENT_SEARCH_TEXT_CHANGE:
            tmp[action.token] = getClientSearchTextChange(state[action.token], action.payload.searchText);
            return { ...state, ...tmp };
        case Actions.CLIENT_SEARCH_SUBMIT:
            tmp[action.token] = getClientSearchSubmit(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.CLIENT_SEARCH_TEXT_CHANGE_REJECT:
            tmp[action.token] = getClientSearchTextChangeReject(state[action.token]);
            return { ...state, ...tmp };
        case Actions.CLIENT_SEARCH_SUBMIT_SUCCESS:
            tmp[action.token] = getClientSearchSubmitSuccess(state[action.token]);
            return { ...state, ...tmp };
        case Actions.CLIENT_SEARCH_TEXT_CHANGE_EMPTY:
            tmp[action.token] = getClientSearchTextChangeEmpty(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT_SEARCH_GRID_DATA:
            tmp[action.token] = LoadClientSearchGridData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT_SEARCH_GRID_DATA_SUCCESS:
            tmp[action.token] = LoadClientSearchGridDataSuccess(state[action.token], action.payload.responce);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT_SEARCH_GRID_DATA_FAIL:
            tmp[action.token] = LoadClientSearchGridDataFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.TOGGLE_CLIENT_ROW_EXPAND:
            tmp[action.token] = toggleClientExpand(state[action.token], action.payload.client);
            return { ...state, ...tmp };
        case Actions.TOGGLE_MATTER_ROW_EXPAND:
            tmp[action.token] = toggleMatterExpand(state[action.token], action.payload.row);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT_SEARCH_POPUP_DATA:
            tmp[action.token] = getClientSearchPopupData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT_SEARCH_POPUP_DATA_SUCCESS:
            tmp[action.token] = LoadClientSearchPopupDataSuccess(state[action.token], action.payload.responce);
            return { ...state, ...tmp };
        case Actions.LOAD_CLIENT_SEARCH_POPUP_DATA_FAIL:
            tmp[action.token] = getClientSearchPopupDataFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.EXIT_CLIENT_SEARCH_POPUP:
            tmp[action.token] = null;
            return { ...state, ...tmp };
        case Actions.GET_MATTERS:
            tmp[action.token] = changeMatterLoadingState(state[action.token], action.clientRef, true);
            return { ...state, ...tmp };
        case Actions.GET_MATTERS_SUCESS:
            tmp[action.token] = setMattersToClient(state[action.token], action.clientRef, action.matters);
            return { ...state, ...tmp };
        case Actions.GET_MATTERS_FAIL:
            tmp[action.token] = changeMatterLoadingState(state[action.token], action.clientRef, false);
            return { ...state, ...tmp };
        case Actions.CHANGE_MATTERS_PAGE:
            tmp[action.token] = setMattersPaginatorDef(state[action.token], action.clientRef, action.matterPaginatorDef);
            return { ...state, ...tmp };

        default: {
            return state;
        }
    }
}

function initClientSearchView(state: ClientSearchState, action: Actions.InitClientSearch): Partial<ClientSearchState> {
    if (!state) {
        return {
            ...state,
            sarchText: action.payload.isPopup ? action.payload.clientSearchData.searchText : '',
            clientColumnDef: action.payload.isPopup ? action.payload.clientSearchpopupColumn : action.payload.clientColumnDef,
            clientPaginatorDef: action.payload.clientPaginatorDef,
            matterColumnDef: action.payload.matterColumnDef,
            isPopup: action.payload.isPopup,
            totalItems: 0,
            popupInputData: action.payload.clientSearchData

        };
    } else {
        return state;
    }
}

function getClientSearchTextChange(state: ClientSearchState, searchText: string): Partial<ClientSearchState> {
    console.log('getClientSearchTextChange', searchText);
    return {
        ...state,
        sarchText: searchText,
        clientColumnDef: clearAllColumnFilter(state.clientColumnDef),
        clientPaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
    };
}

function getClientSearchSubmit(state: ClientSearchState, payload: any): Partial<ClientSearchState> {
    switch (payload.kind) {
        case ClientSearchKind.SearchText:
            return {
                ...state,
                sarchText: payload.value,
                showHint: false,
                clientColumnDef: clearAllColumnFilter(state.clientColumnDef),
                popupInputData: {
                    clientRef: null,
                    searchText: payload.value,
                    branchId: 0,
                    clientName: null,
                    popupType: ClientPopupType.GeneralClientSearch,
                    popupPara: {
                        firstName: '',
                        lastName: '',
                        companyName: '',
                        email1: '',
                    }
                },
                clientPaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ClientSearchKind.ClearClientColumnFilter:
            return {
                ...state, clientColumnDef: clearColumnFilter(state.clientColumnDef, payload.value),
                clientPaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ClientSearchKind.ClientPageChange:
            return { ...state, clientPaginatorDef: paginatorChange(payload.value) };
        case ClientSearchKind.ApplyClientColumnFilter:
            return {
                ...state, clientColumnDef: applyColumnFilter(state.clientColumnDef, payload.value),
                clientPaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ClientSearchKind.SearchTextClear:
            return {
                ...state, sarchText: '',
                ClientSearchData: [], totalItems: 0,
                showHint: false,
                clientColumnDef: clearAllColumnFilter(state.clientColumnDef),
                clientPaginatorDef: paginatorChange({ currentPage: 0, itemPerPage: 50 })
            };
        case ClientSearchKind.ToggleClientFieldSort:
            return { ...state, clientColumnDef: applyFieldSort(state.clientColumnDef, payload.value) };
        default:
            return { ...state };
    }
}

function clearAllColumnFilter(current: ColumnDef[]) {
    return current.map((def) => {
        return clearFilters(def);
    });
}


function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def);
        }
        return def;
    });
}

function paginatorChange(pagerDef: PaginatorDef): PaginatorDef {
    return {
        ...pagerDef,
        currentPage: pagerDef.currentPage,
        itemPerPage: pagerDef.itemPerPage
    };
}

function getClientSearchTextChangeReject(state: ClientSearchState): Partial<ClientSearchState> {
    console.log('getClientSearchTextChangeReject');
    return { ...state };
}

function getClientSearchSubmitSuccess(state: ClientSearchState): Partial<ClientSearchState> {
    return { ...state };
}

function LoadClientSearchGridDataFail(state: ClientSearchState): Partial<ClientSearchState> {
    console.log('getClientSearchTextChangeEmpty');
    return { ...state, loading: false };
}

function LoadClientSearchGridData(state: ClientSearchState): Partial<ClientSearchState> {
    console.log('LoadClientSearchGridData');
    return {
        ...state,
        loading: true,

    };
}

function LoadClientSearchGridDataSuccess(state: ClientSearchState, responce: ClientSearchResponse) {
    console.log('LoadClientSearchGridDataSuccess');

    let mutatedClientList: ClientGridRowRapper[] = [];

    if (responce && responce.data && responce.data.data) {
        mutatedClientList = responce.data.data.map((clientItem) => {
            return Object.freeze({
                data: { ...clientItem, matterViewModel: null }, selected: false, expanded: false,
                matterPaginatorDef: { currentPage: 0, itemPerPage: 50 },
                matterLoading: false
            });
        });
    }
    return {
        ...state, ClientSearchData: mutatedClientList,
        totalItems: responce.data ? responce.data.total : 0, loading: false,
        showHint: true,
    };

}

function getClientSearchTextChangeEmpty(state: ClientSearchState): Partial<ClientSearchState> {

    console.log('getClientSearchTextChangeEmpty');
    return {
        ...state,
    };
}

function toggleClientExpand(state: ClientSearchState, client: ClientGridRowRapper): Partial<ClientSearchState> {
    console.log('toggleClientExpand');
    return Object.freeze({ ...state, ClientSearchData: changeClientExpandState(state.ClientSearchData, client) });
}
function toggleMatterExpand(state: ClientSearchState, row: MatterExpandData): Partial<ClientSearchState> {
    console.log('toggleMatterExpand');
    return Object.freeze({ ...state, ClientSearchData: changeMatterExpandState(state.ClientSearchData, row) });
}

// Nuwan

function getClientSearchPopupData(state: ClientSearchState): Partial<ClientSearchState> {
    console.log('LoadClientSearchPopupData');
    return {
        ...state,
        loading: true,

    };
}
function LoadClientSearchPopupDataSuccess(state: ClientSearchState, responce: ClientSearchResponse) {
    return {
        ...state,
        ClientSearchData: responce.data.data,
        totalItems: responce.data ? responce.data.total : 0, loading: false,
        showHint: true,
    };
}

function getClientSearchPopupDataFail(state: ClientSearchState): Partial<ClientSearchState> {
    console.log('getClientSearchPopupEmpty');
    return { ...state, loading: false };
}



function changeClientExpandState(ClientSearchData: ClientGridRowRapper[], client: ClientGridRowRapper) {

    return ClientSearchData.map((clientRow) => {
        if (clientRow.data === client.data) {

            return Object.freeze({ ...clientRow, selected: !clientRow.selected, expanded: !clientRow.expanded });
        } else if (clientRow.expanded) {
            return Object.freeze({ ...clientRow, selected: false, expanded: false });
        }
        return clientRow;
    });

}

function changeMatterExpandState(ClientSearchData: ClientGridRowRapper[], row: MatterExpandData) {
    return ClientSearchData.map((clientRow) => {
        if (clientRow.data === row.client.data) {

            const matter = clientRow.data.matterViewModel.map((item) => {
                if (item.data === row.matter.data) {
                    return { ...item, selected: !item.selected, expanded: !item.expanded };
                } else {
                    return { ...item, selected: false, expanded: false };
                }
            });

            return Object.freeze({ ...clientRow, data: { ...clientRow.data, matterViewModel: matter } });
        } else if (clientRow.expanded) {
            return Object.freeze({ ...clientRow });
        }

        return clientRow;
    });
}

function changeMatterLoadingState(state: ClientSearchState, clientRef: string, isLoading): Partial<ClientSearchState> {
    return {
        ...state,
        ClientSearchData: state.ClientSearchData.map(i => {
            if (i.data.clientRef === clientRef) {
                return {
                    ...i,
                    matterLoading: isLoading
                };
            }
            return i;
        })
    };
}

function setMattersToClient(state: ClientSearchState, clientRef: string, matterData: MatterViewModel[]): Partial<ClientSearchState> {
    return {
        ...state,
        ClientSearchData: state.ClientSearchData.map(i => {
            if (i.data.clientRef === clientRef && matterData) {
                const mutedMatterList: MatterGridRowRapper[] = matterData.map((matterItem) => {
                    return { data: matterItem, selected: false, expanded: false };
                });
                return {
                    ...i,
                    matterLoading: false,
                    data: { ...i.data, matterViewModel: mutedMatterList }
                };
            }
            return i;
        })
    };
}

function setMattersPaginatorDef(state: ClientSearchState, clientRef: string, paginatorDef: PaginatorDef): Partial<ClientSearchState> {
    return {
        ...state,
        ClientSearchData: state.ClientSearchData.map(i => {
            if (i.data.clientRef === clientRef) {
                return {
                    ...i,
                    matterPaginatorDef: paginatorDef
                };
            }
            return i;
        })
    };
}


export const getViews = (state: State) => state;
export const getViewByToken = (token) => createSelector(getViews, (views) => views[token]);
export const getClientColumnDefByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.clientColumnDef : null);
export const getclientPaginatorDefByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.clientPaginatorDef : null);

export const getmatterColumnDefByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.matterColumnDef : null);

export const getTotalClientsByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.totalItems : 0);
export const getSearchTextByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.sarchText : null);

export const getClientSearchDataByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.ClientSearchData : []);

export const getClientPopupInutDataByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.popupInputData : null);

export const getClientIsPopupInutByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => clientSearchState ? clientSearchState.isPopup : false);

export const getGridDataLoadingStateByToken = (token) =>
    createSelector(getViewByToken(token),
        (clientSearchState) => clientSearchState ? clientSearchState.loading : false);

export const getSearchHintByToken = (token) => createSelector(getViewByToken(token),
    (clientSearchState) => {
        if (clientSearchState && clientSearchState.sarchText && clientSearchState.sarchText.length > 2 && clientSearchState.showHint) {
            return true;
        }
        return false;
    });

export const getClientByClietRef = (token, clientRef) => createSelector(getViewByToken(token),
    (state) => {
        if (state && state.ClientSearchData) {
            return state.ClientSearchData.find(i => i.data.clientRef === clientRef);
        }
        return null;
    });
