import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as PostingPeriod from './posting-period';

export interface State {
    PostingPeriod: PostingPeriod.State;
}
export const reducers = {
    PostingPeriod: PostingPeriod.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsPostingPeriod');
export const getPostingPeriodRootState = createSelector(getRootState, (state) => state.PostingPeriod);

export const getPostingPeriodLoadingByToken = (token) => createSelector(getPostingPeriodRootState,
    PostingPeriod.getPostingPeriodLoadingByToken(token));
export const getPostingPeriodListByToken = (token) => createSelector(getPostingPeriodRootState,
    PostingPeriod.getPostingPeriodListByToken(token));
export const getSelectedPostingPeriodByToken = (token) => createSelector(getPostingPeriodRootState,
    PostingPeriod.getSelectedPostingPeriodByToken(token));
