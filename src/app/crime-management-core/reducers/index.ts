import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as crManagement from './crime-management';

export interface State {
    Contact: crManagement.State;
}
export const reducers = {
    Contact: crManagement.reducer,
};

export const getContactRootState = createFeatureSelector<State>('dpsCrimeManagementCore');
export const getContactState = createSelector(getContactRootState, (state) => state.Contact);
export const getIsLoadingByToken = (token) => createSelector(getContactState, crManagement.getIsLoading(token));
export const getInputDataByToken = (token) => createSelector(getContactState, crManagement.getInputData(token));
export const getClassListByToken = (token) => createSelector(getContactState, crManagement.getClassList(token));
export const getClassTypeByToken = (token) => createSelector(getContactState, crManagement.getClassType(token));
export const getAddClassModelByToken = (token) => createSelector(getContactState, crManagement.getAddClassModel(token));
export const getRateFileloadingByToken = (token) => createSelector(getContactState, crManagement.getRateFileloading(token));
