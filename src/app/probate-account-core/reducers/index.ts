import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as probateAccount from './probate-account';


export interface State {
    probateAccount: probateAccount.State;
}
export const reducers = {
    probateAccount: probateAccount.reducer,
};


export const getProbateAccountRootState = createFeatureSelector<State>('dpsProbateAccountCore');
export const getProbateAccountState = createSelector(getProbateAccountRootState, (state => state.probateAccount));
export const getMatterDataByToken = (token) =>
    createSelector(getProbateAccountState, probateAccount.getMatterDataByToken(token));
export const getSavedDataByToken = (token) =>
    createSelector(getProbateAccountState, probateAccount.getSavedDataByToken(token));
export const getLoadingByToken = (token) =>
    createSelector(getProbateAccountState, probateAccount.getLoadingByToken(token));






