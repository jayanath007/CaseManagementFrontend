import { CommonPara, OpportunitySearchModel } from './../models/interfaces';

import {
    ClientMatter, Client, ConflictSearchMsg,
    ConflictSearchData, ConflictSearchGridRowItem,
    ConflictSearchGridRowItemWrapper, ClientMatterRowItemWrapper, SearchModel,
    ConflictSearchClientResponse, ConflictSearchClientRequest, SearchState,
    ConflictSearchClientDetailResponse, ConflictSearchDetailRequest,
    ConflictSearchPopupInput
} from '../models/interfaces';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { PageEvent } from '@angular/material';
import { ConflictCheckType, ConflictSaveType, ConflictSearchOpenFrom } from '../models/enum';

export interface State {
    readonly [token: string]: ConflictSearchState;
}


export interface ConflictSearchState {

    readonly loading: boolean;
    readonly searchModel: SearchModel;
    readonly searchState: SearchState;

    readonly conflictSearchList: ConflictSearchGridRowItemWrapper[];
    readonly clientMatterList: ClientMatterRowItemWrapper[];

    readonly conflictSearchPageEvent: PageEvent;
    readonly clientMatterPageEvent: PageEvent;

    readonly client: Client;
    readonly clientDto: any;
    readonly commonPara: CommonPara;
    readonly companyList: string[];

    readonly conflictSearchListResponse: ConflictSearchClientResponse;
    readonly conflictSearchClientDetailResponse: ConflictSearchClientDetailResponse;
    readonly conflictCheckType: ConflictCheckType;
    readonly saveType: ConflictSaveType;

    readonly loadingData: boolean;
    readonly clientMatterLoading: boolean;

    readonly isDirty: boolean;
    readonly error: ConflictSearchMsg;
    readonly saved: ConflictSearchMsg;
    readonly exit: boolean;
    readonly openFrom: ConflictSearchOpenFrom;

}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_CONFLICT_SEARCH:
            temp[action.token] = setInitialData(state[action.token], action.payload.inputData);
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_CLOSE:
            temp[action.token] = {
                ...state[action.token],
                exit: true
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SEARCH_CLIENT:
            temp[action.token] = {
                ...state[action.token],
                searchModel: action.payload.searchModel,
                loadingData: true,
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SEARCH_CLIENT_SUCCESS:
            const response = action.payload.response;
            const newConflictSearchList = conflictSearchClientSuccess(state[action.token], action.payload.response);
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                conflictSearchList: newConflictSearchList,
                searchState: SearchState.AfterSearchApplySucsess,
                conflictSearchListResponse: response,
                conflictSearchPageEvent: {
                    ...state[action.token].conflictSearchPageEvent,
                    length: response.data.total
                }
            };
            return { ...state, ...temp };

        // Opportunity
        case Actions.OPPORTUNITY_CONFLICT_SEARCH:
            temp[action.token] = {
                ...state[action.token],
                searchModel: action.payload.searchModel,
                loadingData: true,
            };
            return { ...state, ...temp };
        case Actions.OPPORTUNITY_CONFLICT_SEARCH_SUCCESS:
            const responseData = action.payload.response;
            const newConflictSearchDataList = conflictSearchClientSuccess(state[action.token], action.payload.response);
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                conflictSearchList: newConflictSearchDataList,
                searchState: SearchState.OpportunitySearchSucsess,
                conflictSearchListResponse: responseData,
                conflictSearchPageEvent: {
                    ...state[action.token].conflictSearchPageEvent,
                    length: responseData.data.total
                }
            };
            return { ...state, ...temp };
        case Actions.OPPORTUNITY_CONFLICT_SEARCH_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                searchState: SearchState.AfterSearchApplyFail,
            };
            return { ...state, ...temp };

        case Actions.OPPORTUNITY_CONFLICT_SEARCH_SAVE:
            temp[action.token] = {
                ...state[action.token],
                loadingData: true,
                searchState: SearchState.OpportunitySaveSucsess,
            };
            return { ...state, ...temp };
        case Actions.OPPORTUNITY_CONFLICT_SEARCH_SAVE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                searchState: SearchState.OpportunitySaveSucsess,
            };
            return { ...state, ...temp };
        case Actions.OPPORTUNITY_CONFLICT_SEARCH_SAVE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                searchState: SearchState.OpportunitySaveSucsess,
            };
            return { ...state, ...temp };

        case Actions.ADD_OPPORTUNITY_COMPANY_LIST:
            temp[action.token] = companyListUpdate(state[action.token], action.payload.companyList);
            return { ...state, ...temp };
        // Opportunity end

        case Actions.CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_SUCCESS:
            const clientDetailListResponce = action.payload.clientDetailListResponce;
            const newClientMatterList = clientMatterSuccess(state[action.token], action.payload.clientDetailListResponce);
            const client = action.payload.clientResponse.data;
            temp[action.token] = {
                ...state[action.token],
                clientMatterLoading: false,
                clientMatterList: newClientMatterList,
                client: client,
                conflictSearchClientDetailResponse: action.payload.clientDetailListResponce,
                clientMatterPageEvent: { ...state[action.token].clientMatterPageEvent, length: clientDetailListResponce.data.length }
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS_FAIL:
            temp[action.token] = {
                ...state[action.token],
                clientMatterLoading: false,
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SEARCH_CLIENT_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                searchState: SearchState.AfterSearchApplyFail,
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SELECT_ITEM:
            const newConflictSearchListSelect = setGridSelectItem(state[action.token], action.payload.item);
            temp[action.token] = {
                ...state[action.token],
                clientMatterLoading: true,
                conflictSearchList: newConflictSearchListSelect,
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_GRID_PAGE_EVENT_CHANGE:
            const conflictSearchList = gridSelectionClear(state[action.token]);
            temp[action.token] = {
                ...state[action.token],
                conflictSearchList: conflictSearchList,
                conflictSearchPageEvent: action.payload.pageEvent
            };
            return { ...state, ...temp };
        case Actions.CLIENT_MATTER_GRID_PAGE_EVENT_CHANGE:
            temp[action.token] = { ...state[action.token], clientMatterPageEvent: action.payload.pageEvent };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SAVE:
            temp[action.token] = {
                ...state[action.token],
                loadingData: true,
                searchState: SearchState.SaveSearchSucsess,
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SAVE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                searchState: SearchState.SaveSearchSucsess,
            };
            return { ...state, ...temp };
        case Actions.CONFLICT_SEARCH_SAVE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loadingData: false,
                searchState: SearchState.SaveSearchSucsess,
            };
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}
function setInitialData(state: ConflictSearchState, inputData: ConflictSearchPopupInput)
    : Partial<ConflictSearchState> {
    return {
        ...state,
        searchModel: {
            surname: inputData.clientDto ? inputData.clientDto.lastName : '',
            forname: inputData.clientDto ? inputData.clientDto.firstName : '',
            dOB: inputData.clientDto ? inputData.clientDto.birthDate : '',
            postCode: inputData.clientDto ? inputData.clientDto.postCode : '',
            company: '',
            matterDetails: null,
            includeClientWithNoMatter: true,
            isClientTypeCompany: false,

        },
        client: null,
        companyList: inputData.clientDto ? inputData.clientDto.companyName ? [inputData.clientDto.companyName] : [] : [],
        searchState: SearchState.BeforeSearchApply,
        saveType: ConflictSaveType.SaveAndClose,

        conflictSearchPageEvent: { pageSize: 10, pageIndex: 0, length: 0 },
        clientMatterPageEvent: { pageSize: 10, pageIndex: 0, length: 0 },

        conflictSearchList: [],
        clientMatterList: [],

        conflictSearchListResponse: null,
        conflictSearchClientDetailResponse: null,

        conflictCheckType: inputData.conflictCheckType,
        clientDto: inputData.clientDto,
        openFrom: inputData.openFrom,
        commonPara: inputData.commonPara,
        loading: true,
        error: null,
        saved: { isError: false, msg: '' },
        isDirty: false,
        loadingData: false,
        clientMatterLoading: false,
        exit: false,
    };
}

function setGridSelectItem(state: ConflictSearchState, item: ConflictSearchGridRowItemWrapper)
    : ConflictSearchGridRowItemWrapper[] {

    const newConflictSearchList = state.conflictSearchList.map((row) => {
        if (row.data === item.data) {
            return Object.freeze({ ...row, selected: true });
        } else {
            return Object.freeze({ ...row, selected: false });
        }
    });

    return newConflictSearchList;
}
function companyListUpdate(state: ConflictSearchState, item: any) {
    return {
        ...state,
        searchModel: { ...state.searchModel, company: '' },
        companyList: state.companyList.concat([item])
    };
}

// ConflictSearchClientResponse
function conflictSearchClientSuccess(state: ConflictSearchState, response: any): ConflictSearchGridRowItemWrapper[] {
    const newConflictSearchList: ConflictSearchGridRowItemWrapper[] = response.data.data.map((_item, index) => ({
        data: _item, selected: false, index: index
    }));
    return newConflictSearchList;
}

function clientMatterSuccess(state: ConflictSearchState, response: ConflictSearchClientDetailResponse): ClientMatterRowItemWrapper[] {
    const newClientMatterList: ClientMatterRowItemWrapper[] = response.data.map((_item, index) => ({
        data: _item, selected: false, index: index
    }));
    return newClientMatterList;
}

function gridSelectionClear(state: ConflictSearchState): ConflictSearchGridRowItemWrapper[] {
    const newConflictSearchList = state.conflictSearchList.map((row) => {
        return Object.freeze({ ...row, selected: false });
    });
    return newConflictSearchList;
}

function dataLoading(state: ConflictSearchState): Partial<ConflictSearchState> {
    return { ...state, loading: true };
}

function timeRecordingSaveSuccess(state: ConflictSearchState): Partial<ConflictSearchState> {
    return {
        ...state,
        saved: { isError: false, msg: 'Time Recording Save Success !' },
        loading: false
    };
}


export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.loading : null);
export const getErrorsurnameByToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.error : null);
export const getSaveStateToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.saved : null);
export const getIsDirtyByToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.isDirty : null);


export const getConflictSearchModelToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        return conflictSearchState ? conflictSearchState.searchModel : null;
    });

export const getClientMatterListToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {

        if (conflictSearchState) {
            const data = conflictSearchState.clientMatterList
                .filter((item) => {

                    const firstDisplayItemIndex = (conflictSearchState.clientMatterPageEvent.pageIndex
                        * conflictSearchState.clientMatterPageEvent.pageSize);
                    const lastDisplayItemIndex = firstDisplayItemIndex + conflictSearchState.clientMatterPageEvent.pageSize;
                    return (firstDisplayItemIndex <= item.index && item.index < lastDisplayItemIndex);
                });

            return data;
        } else {
            return null;
        }
    });


export const getConflictSearchListToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {

        if (conflictSearchState) {
            const data = conflictSearchState.conflictSearchList
                .filter((item, index) => {

                    const firstDisplayItemIndex = (conflictSearchState.conflictSearchPageEvent.pageIndex
                        * conflictSearchState.conflictSearchPageEvent.pageSize);
                    const lastDisplayItemIndex = firstDisplayItemIndex + conflictSearchState.conflictSearchPageEvent.pageSize;
                    return (firstDisplayItemIndex <= item.index && item.index < lastDisplayItemIndex);
                });

            return data;
        } else {
            return null;
        }
    });

export const getClientToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.client : null);
export const getConflictSearchListSelecteditem = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.conflictSearchList.filter(p => p.selected)[0] : null);
export const getSearchStateToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.searchState : null);
export const getClientMatterPageInforToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => conflictSearchState ? conflictSearchState.clientMatterPageEvent : null);
export const getConflictSearchPageInforToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        return conflictSearchState ? conflictSearchState.conflictSearchPageEvent : null;
    });
export const getConflictSearchSaveTypeToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        return conflictSearchState ? conflictSearchState.saveType : null;
    });
export const getConflictLoadingDataToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        return conflictSearchState ? conflictSearchState.loadingData : null;
    });
export const getClientMatterLoadingToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        return conflictSearchState ? conflictSearchState.clientMatterLoading : null;
    });
export const getIsExitToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        return conflictSearchState ? conflictSearchState.exit : null;
    });
export const getOpenFrom = (token) => createSelector(getViewByToken(token), conflictSearchState =>
    conflictSearchState ? conflictSearchState.openFrom : null);
export const getConflictCheckTypeToken = (token) => createSelector(getViewByToken(token), conflictSearchState =>
    conflictSearchState ? conflictSearchState.conflictCheckType : null);
export const getCommonParaByToken = (token) => createSelector(getViewByToken(token), conflictSearchState =>
    conflictSearchState ? conflictSearchState.commonPara : null);
export const getCompanyListByToken = (token) => createSelector(getViewByToken(token), conflictSearchState =>
    conflictSearchState ? conflictSearchState.companyList : []);
export const getOpportunityConflictSearchStateByToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        const opportunitySearchModel: OpportunitySearchModel = {
            lastName: conflictSearchState.searchModel ? conflictSearchState.searchModel.surname : '',
            firstName: conflictSearchState.searchModel ? conflictSearchState.searchModel.forname : '',
            postCode: conflictSearchState.searchModel ? conflictSearchState.searchModel.postCode : '',
            companyName: conflictSearchState.searchModel ? conflictSearchState.searchModel.company : '',
            companyNameList: conflictSearchState.companyList ? conflictSearchState.companyList : [],
            enquiryId: conflictSearchState.commonPara ? conflictSearchState.commonPara.data ?
                +conflictSearchState.commonPara.data.enquiryId : -1 : -1,
            matterDetails: conflictSearchState.searchModel ? conflictSearchState.searchModel.matterDetails : '',
            includeClientWithNoMatter: conflictSearchState.searchModel ? conflictSearchState.searchModel.includeClientWithNoMatter : false,
            isClientTypeCompany: conflictSearchState.searchModel ? conflictSearchState.searchModel.isClientTypeCompany : false,
            dOB: conflictSearchState.searchModel ? conflictSearchState.searchModel.dOB : null,
        };
        return opportunitySearchModel;
    });
// export const getClientDtoByToken = (token) => createSelector(getViewByToken(token), conflictSearchState =>
//     conflictSearchState ? conflictSearchState.clientDto : null);
