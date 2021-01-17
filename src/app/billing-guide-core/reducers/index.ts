import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as billingGuide from './billing-guide';


export interface State {
    billingGuide: billingGuide.State;
}
export const reducers = {
    billingGuide: billingGuide.reducer,
};


export const getBillingGuideRootState = createFeatureSelector<State>('dpsBillingGuideCore');
export const getBillingGuideState = createSelector(getBillingGuideRootState, (state => state.billingGuide));
export const getBillingGuideStateByToken = (token) =>
    createSelector(getBillingGuideState, billingGuide.getViewByToken(token));
export const getBilledValueDataByToken = (token) =>
    createSelector(getBillingGuideState, billingGuide.getBilledValueDataByToken(token));
export const getBillingViewModaleDataByToken = (token) =>
    createSelector(getBillingGuideState, billingGuide.getBillingViewModaleDataByToken(token));
export const getBillingViewModaleCloseDataByToken = (token) =>
    createSelector(getBillingGuideState, billingGuide.getBillingViewModaleCloseDataByToken(token));
 export const getBillingbillingGuideNoFileByToken = (token) =>
    createSelector(getBillingGuideState, billingGuide.getBillingbillingGuideNoFileByToken(token));





