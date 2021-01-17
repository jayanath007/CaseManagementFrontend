import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as civil from './civil-management';

export interface State {
    civil: civil.State;
}
export const reducers = {
    civil: civil.reducer,
};

export const getChaserRootState = createFeatureSelector<State>('dpsCivilManagement');

export const getChaserState = createSelector(getChaserRootState, (state) => state.civil);
export const getIsLoading = (token) => createSelector(getChaserState, civil.getIsLoading(token));
export const getClassList = (token) => createSelector(getChaserState, civil.getClassList(token));
export const getopenRowIndex = (token) => createSelector(getChaserState, civil.getopenRowIndex(token));
export const getInputData = (token) => createSelector(getChaserState, civil.getInputData(token));
