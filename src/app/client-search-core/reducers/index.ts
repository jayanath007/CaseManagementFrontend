import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as clientSearch from './client-search';

export interface State {
  clientSearch: clientSearch.State;
}

export const reducers = {
  clientSearch: clientSearch.reducer,
};

export const getClientSearchRootState = createFeatureSelector<State>('dpsClientSearchCore');


export const getClientSearchState = createSelector(getClientSearchRootState, (state) => state.clientSearch);
export const getClientSearchViewByToken = (token) => createSelector(getClientSearchState, clientSearch.getViewByToken(token));

export const getClientSearchTextByToken = (token) => createSelector(getClientSearchState, clientSearch.getSearchTextByToken(token));

export const getClientSearchClientColumnDefByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getClientColumnDefByToken(token));

export const getClientSearchClientPaginatorDefByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getclientPaginatorDefByToken(token));

export const getClientSearchGridDataByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getClientSearchDataByToken(token));

export const getClientSearchGridDataLoadingStateByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getGridDataLoadingStateByToken(token));

export const getClientSearchTotalClientsByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getTotalClientsByToken(token));

export const getClientSearchMatterColumnDefByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getmatterColumnDefByToken(token));

export const getClientSearchShowSearchHintStateByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getSearchHintByToken(token));

export const getClientPopupInutDataByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getClientPopupInutDataByToken(token));

export const getClientIsPopupInutByToken = (token) =>
  createSelector(getClientSearchState, clientSearch.getClientIsPopupInutByToken(token));

export const getClientByClietRef = (token, clientRef) =>
  createSelector(getClientSearchState, clientSearch.getClientByClietRef(token, clientRef));


