import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as civil from './civil-time-recording';

export interface State {
    civil: civil.State;
}
export const reducers = {
    civil: civil.reducer,
};

export const getChaserRootState = createFeatureSelector<State>('dpsCivilTimeRecording');
export const getCivilState = createSelector(getChaserRootState, (state) => state.civil);
export const getIsLoading = (token) => createSelector(getCivilState, civil.getIsLoading(token));
export const getCivilClassInfo = (token) => createSelector(getCivilState, civil.getCivilClassInfo(token));
export const getCivilClassViewData = (token) => createSelector(getCivilState, civil.getCivilClassViewData(token));
export const getCivilClassModelData = (token) => createSelector(getCivilState, civil.getCivilClassModelData(token));
export const getRateFromCache = (token) => createSelector(getCivilState, civil.getRateFromCache(token));
export const isDirty = (token) => createSelector(getCivilState, civil.isDirty(token));

