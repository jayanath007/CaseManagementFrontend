import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as FileSecurityRights from './file-security-rights';

export interface State {
    fileSecurityRights: FileSecurityRights.State;
}
export const reducers = {
    fileSecurityRights: FileSecurityRights.reducer,
};

export const getState = createFeatureSelector<State>('dpsFileSecurityRights');
export const getFileSecurityRightsState = createSelector(getState, (state) => state.fileSecurityRights);
export const getIsLoading = createSelector(getFileSecurityRightsState, FileSecurityRights.getIsLoading);
export const getUsers = createSelector(getFileSecurityRightsState, FileSecurityRights.getUsers);
export const getOriginalUsers = createSelector(getFileSecurityRightsState, FileSecurityRights.getOriginalUsers);

