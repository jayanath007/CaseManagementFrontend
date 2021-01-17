import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as mailItemState from './item';

export interface State {
    mailItemState: mailItemState.State;
}
export const reducers = {
    mailItemState: mailItemState.reducer,
};


export const getMailItemRootState = createFeatureSelector<State>('dpsMailItem');
export const getMailItemState = createSelector(getMailItemRootState, (state) => {
    return state.mailItemState;
});
export const getViewByToken = (token) => createSelector(getMailItemState, mailItemState.getViewByToken(token));
export const getParentItemIdByToken = (token) => createSelector(getMailItemState, mailItemState.getParentItemIdByToken(token));
export const getMailItemByToken = (token) => createSelector(getMailItemState, mailItemState.getMailItemByToken(token));
export const getMailItemIsDiscardByToken = (token) => createSelector(getMailItemState, mailItemState.getMailItemIsDiscardByToken(token));







