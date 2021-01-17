import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as PriceCap from './price-cap-limit';

export interface State {
    PriceCap: PriceCap.State;
}
export const reducers = {
    PriceCap: PriceCap.reducer,
};

export const getRootState = createFeatureSelector<State>('priceCapLimits');
export const getPriceCapState = createSelector(getRootState, (state) => state.PriceCap);
export const isPriceCapDataLoading = token => createSelector(getPriceCapState, PriceCap.getIsLoading(token));
export const getCrimeClassIdentityViewModel = token => createSelector(getPriceCapState, PriceCap.getCrimeClassIdentityViewModel(token));
export const getTimecurrentLimited = token => createSelector(getPriceCapState, PriceCap.getCurrentLimit(token));
export const getTimeLimitUserInput = token => createSelector(getPriceCapState, PriceCap.getUserInputData(token));
export const getCrimeLimitHistory = token => createSelector(getPriceCapState, PriceCap.getHistoryData(token));
export const getUserForAddLimit = token => createSelector(getPriceCapState, PriceCap.getUser(token));
