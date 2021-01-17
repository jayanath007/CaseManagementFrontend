import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as BankSearch from './bank-search';
export interface State {
    BankSearch: BankSearch.State;
}
export const reducers = {
    BankSearch: BankSearch.reducer,
};
export const getRootState = createFeatureSelector<State>('dpsBankDetailsSearchToken');
export const getPageState = createSelector(getRootState, (state) => state.BankSearch);
export const getGroupListByToken = createSelector(getPageState, BankSearch.getGroupList);
export const getFeeEarnerListByToken = createSelector(getPageState, BankSearch.getFeeEarnerListByGroup);
export const getAuthorisationsViewByToken = (token) => createSelector(getPageState, BankSearch.getViewByToken(token));
export const getBankSearchColumnDefByToken = (token) =>
    createSelector(getPageState, BankSearch.getBankSearchColumnDefByToken(token));
export const getBankSearchPaginatorDefByToken = (token) =>
    createSelector(getPageState, BankSearch.getBankSearchPaginatorDefByToken(token));
export const getBankSearchRowCountByToken = (token) =>
    createSelector(getPageState, BankSearch.getBankSearchRowsCountByToken(token));
