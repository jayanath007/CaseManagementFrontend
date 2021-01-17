import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as Probate from './probate';

export interface State {
    Probate: Probate.State;
}
export const reducers = {
    Probate: Probate.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsProbate');
export const getProbateRootState = createSelector(getRootState, (state) => state.Probate);

export const getProbateLoadingByToken = (token) => createSelector(getProbateRootState,
    Probate.getProbateLoadingByToken(token));
export const getDeceasedInfoByToken = (token) => createSelector(getProbateRootState,
    Probate.getDeceasedInfoByToken(token));
export const getDistributionViewItemsByToken = (token) => createSelector(getProbateRootState,
    Probate.getDistributionViewItemsByToken(token));
export const getEstateOverViewsByToken = (token) => createSelector(getProbateRootState,
    Probate.getEstateOverViewsByToken(token));
export const getResidenceNilRateBandDataByToken = (token) => createSelector(getProbateRootState,
    Probate.getResidenceNilRateBandDataByToken(token));
export const getSpouseorCivilPatnerDataByToken = (token) => createSelector(getProbateRootState,
    Probate.getSpouseorCivilPatnerDataByToken(token));
export const getTransactionsByToken = (token) => createSelector(getProbateRootState,
    Probate.getTransactionsByToken(token));
export const getDropdownCategoryByToken = (token) => createSelector(getProbateRootState,
    Probate.getDropdownCategoryByToken(token));
export const getMatterDataByToken = (token) => createSelector(getProbateRootState,
    Probate.getMatterDataByToken(token));
export const getTransactionEditRowByToken = (token) => createSelector(getProbateRootState,
    Probate.getTransactionEditRowByToken(token));

export const getDistributionEditRowByToken = (token) => createSelector(getProbateRootState,
    Probate.getDistributionEditRowByToken(token));
export const getSelectedtRowByToken = (token) => createSelector(getProbateRootState,
    Probate.getSelectedtRowByToken(token));
export const getIhtFormsDataByToken = (token) => createSelector(getProbateRootState,
    Probate.getIhtFormsDataByToken(token));
export const getSelectedIhtRowByToken = (token) => createSelector(getProbateRootState,
    Probate.getSelectedIhtRowByToken(token));


