import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as globalDocumentSearch from './global-document-search';

export interface State {
    globalDocumentSearch: globalDocumentSearch.State;
}
export const reducers = {
    globalDocumentSearch: globalDocumentSearch.reducer,
};

export const getGlobalDocumentSearchRootState = createFeatureSelector<State>('dpsGlobalDocumentSearch');
export const getGlobalDocumentSearchState = createSelector(getGlobalDocumentSearchRootState, (state => state.globalDocumentSearch));
export const getGlobalSearchStateByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getStateByToken(token));
export const getLoadingByToken = (token) =>
    createSelector(getGlobalDocumentSearchState, globalDocumentSearch.getLoadingByToken(token));
export const getGlobalSearchColumnDefByToken = (token) =>
    createSelector(getGlobalDocumentSearchState, globalDocumentSearch.getColumnDefByToken(token));
export const getFilterViewModelByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getFilterViewModelByToken(token));
export const getFeeEarnerListByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getFeeEarnerListByToken(token));
export const getAppCodeListByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getAppCodeListByToken(token));
export const getGridDataByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getGridDataByToken(token));


export const getDocumentViewOpenedByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getDocumentViewOpenedByToken(token));

export const getTotalItemByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getTotalItemByToken(token));
export const getPaginatorDefToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getPaginatorDefToken(token));
export const getFilterExpandedToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getFilterExpandedToken(token));
export const getSelectedRowDataByToken = (token) => createSelector(getGlobalDocumentSearchState,
    globalDocumentSearch.getSelectedRowDataByToken(token));




