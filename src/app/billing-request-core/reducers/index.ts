import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as BillingRequest from './billing-request';

export interface State {
    BillingRequest: BillingRequest.State;
}
export const reducers = {
    BillingRequest: BillingRequest.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsBillingRequestToken');
export const getPageState = createSelector(getRootState, (state) => state.BillingRequest);
// export const getActiveToken = createSelector(getPrecedentSState, BillingRequest.getViewByToken);
export const getFeeEarnerList = createSelector(getPageState, BillingRequest.getFeeEarnerList);
export const getAllocateList = createSelector(getPageState, BillingRequest.getAllocateList);
export const getVatCodeList = createSelector(getPageState, BillingRequest.getVatCodeList);
export const getMainLoaderState = createSelector(getPageState, BillingRequest.getMainLoaderState);
export const getPrintAllDropDownData = createSelector(getPageState, BillingRequest.getPrintAllDropDownData);
export const getDescriptionsList = createSelector(getPageState, BillingRequest.getDescriptionsList);
export const getclosePopupCount = createSelector(getPageState, BillingRequest.getclosePopupCount);

export const getMatterInfoByToken = (token) => createSelector(getPageState, BillingRequest.getMatterInfoByToken(token));
export const getBillingRequestViewByToken = (token) => createSelector(getPageState, BillingRequest.getViewByToken(token));
// export const getFeeEarnerListByToken = (token) => createSelector(getPageState, BillingRequest.getFeeEarnerListByToken(token));
export const getTotalValuesByToken = (token) => createSelector(getPageState, BillingRequest.getTotalValuesByToken(token));
export const getUserNominalCodeByToken = (token) => createSelector(getPageState, BillingRequest.getUserNominalCodeByToken(token));
export const getTimeHeaderGridOrderDataByToken = (token) =>
    createSelector(getPageState, BillingRequest.getTimeHeaderGridOrderDataByToken(token));
