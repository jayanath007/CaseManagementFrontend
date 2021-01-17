import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as previousTrans from './previous-trans';
export interface State {
    previousTransactions: previousTrans.State;
}
export const reducers = {
    previousTransactions: previousTrans.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsLedgercardPreviousTransactions');
export const getPreviousTransactionsState = createSelector(getRootState, (state => state.previousTransactions));

export const getPreviousTransMatterDataByToken = (token) =>
    createSelector(getPreviousTransactionsState, previousTrans.getMatterDataByToken(token));
export const getPreviousTransGridDataByToken = (token) =>
    createSelector(getPreviousTransactionsState, previousTrans.getGridDataByToken(token));
export const getPreviousTransLoadingByToken = (token) => createSelector(getPreviousTransactionsState,
    previousTrans.getIsLoadingByToken(token));
export const getGridFilterDataByToken = (token) =>
    createSelector(getPreviousTransactionsState, previousTrans.getGridFilterDataByToken(token));
