import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as EChitAuthorisations from './e-chit-authorisations';
export interface State {
    EChitAuthorisations: EChitAuthorisations.State;
}
export const reducers = {
    EChitAuthorisations: EChitAuthorisations.reducer,
};
export const getRootState = createFeatureSelector<State>('dpsEChitAuthorisationsToken');
export const getPageState = createSelector(getRootState, (state) => state.EChitAuthorisations);
export const getGroupListByToken = createSelector(getPageState, EChitAuthorisations.getGroupList);
export const getFeeEarnerListByToken = createSelector(getPageState, EChitAuthorisations.getFeeEarnerListByGroup);
export const getAuthorisationsViewByToken = (token) => createSelector(getPageState, EChitAuthorisations.getViewByToken(token));
export const getAuthorisationsColumnDefByToken = (token) =>
    createSelector(getPageState, EChitAuthorisations.getAuthorisationsColumnDefByToken(token));
export const getAuthorisationsPaginatorDefByToken = (token) =>
    createSelector(getPageState, EChitAuthorisations.getAuthorisationsPaginatorDefByToken(token));
export const getAuthorisationsRowCountByToken = (token) =>
    createSelector(getPageState, EChitAuthorisations.getAuthorisationsRowsCountByToken(token));
