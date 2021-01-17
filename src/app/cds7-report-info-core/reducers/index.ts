import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as cds7 from './cds7-report-info';

export interface State {
    cds7: cds7.State;
}
export const reducers = {
    cds7: cds7.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsCDS7Core');
export const getCDS7State = createSelector(getRootState, (state) => state.cds7);
export const isLoading = (token) => createSelector(getCDS7State, cds7.isLoading(token));
export const getInformationModel = (token) => createSelector(getCDS7State, cds7.getInformationModel(token));
export const getCaseTypes = (token) => createSelector(getCDS7State, cds7.getCaseTypes(token));
