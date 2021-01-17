import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as advancedSearch from './advanced-search';

export interface State {
  advancedSearch: advancedSearch.State;
}

export const reducers = {
  advancedSearch: advancedSearch.reducer,
};


export const getAdvancedSearchRootState = createFeatureSelector<State>('dpsAdvancedSearchCore');
export const getAdvancedSearchState = createSelector(getAdvancedSearchRootState, (state => state.advancedSearch));
export const getAdvancedSearchStateByToken = (token) => createSelector(getAdvancedSearchState,
  advancedSearch.getStateByToken(token));
export const getLoadingByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getLoadingByToken(token));
export const getColumnDefByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getColumnDefByToken(token));
export const getClientListByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getClientListByToken(token));
// export const getMatterSearchModeByToken = (token) =>
//   createSelector(getAdvancedSearchState, advancedSearch.getMatterSearchModeByToken(token));
// export const getSearchColumnOptionByToken = (token) =>
//   createSelector(getAdvancedSearchState, advancedSearch.getSearchColumnOptionByToken(token));
export const getAppCodeListByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getAppCodeListByToken(token));
export const getSearchAdvancedInfoByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getSearchAdvancedInfoByToken(token));
export const getSelectedAppListItem = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getSelectedAppListItem(token));
// export const getsearchFieldsByToken = (token) =>
// createSelector(getAdvancedSearchState, advancedSearch.getsearchFieldsByToken(token));
export const getpaginatorDefByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getpaginatorDefByToken(token));
export const getAdvancedSearchViewModeByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getAdvancedSearchViewModeByToken(token));
export const getSearchGridDataListByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getSearchGridDataListByToken(token));
export const getColoumnArrayByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getColoumnArrayByToken(token));
export const getBranchListByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getBranchListByToken(token));
export const getMatterTotalByToken = (token) =>
  createSelector(getAdvancedSearchState, advancedSearch.getMatterTotalByToken(token));




