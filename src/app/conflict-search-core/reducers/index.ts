import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as conflictSearch from './conflict-search';

export interface State {
    conflictSearch: conflictSearch.State;
}
export const reducers = {
    conflictSearch: conflictSearch.reducer,
};

export const getConflictSearchRootState = createFeatureSelector<State>('dpsConflictSearchCore');
export const getConflictSearchState = createSelector(getConflictSearchRootState, (state => state.conflictSearch));
export const getConflictSearchStateByToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getViewByToken(token));
export const getIsLoadingByToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getIsLoadingByToken(token));
export const getSaveStateToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getSaveStateToken(token));
export const getIsDirtyByToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getIsDirtyByToken(token));


export const getConflictSearchModelToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getConflictSearchModelToken(token));

export const getClientMatterListToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getClientMatterListToken(token));

export const getConflictSearchListToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getConflictSearchListToken(token));

export const getClientToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getClientToken(token));

export const getConflictSearchListSelecteditem = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getConflictSearchListSelecteditem(token));

export const getSearchStateToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getSearchStateToken(token));

export const getClientMatterPageInforToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getClientMatterPageInforToken(token));

export const getConflictSearchPageInforToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getConflictSearchPageInforToken(token));

export const getConflictSearchSaveTypeToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getConflictSearchSaveTypeToken(token));

export const getConflictLoadingDataToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getConflictLoadingDataToken(token));

export const getClientMatterLoadingToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getClientMatterLoadingToken(token));

export const getIsExitToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getIsExitToken(token));

export const getOpenFromToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getOpenFrom(token));

export const getConflictCheckTypeToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getConflictCheckTypeToken(token));
export const getCommonParaDataByToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getCommonParaByToken(token));
export const getCompanyListByToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getCompanyListByToken(token));
export const getOpportunityConflictSearchStateByToken = (token) =>
    createSelector(getConflictSearchState, conflictSearch.getOpportunityConflictSearchStateByToken(token));

// export const getClientDtoByToken = (token) =>
//     createSelector(getConflictSearchState, conflictSearch.getClientDtoByToken(token));
