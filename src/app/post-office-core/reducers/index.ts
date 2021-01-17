import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as postOffice from './post-office';

export interface State {
    postOffice: postOffice.State;
}

export const reducers = {
    postOffice: postOffice.reducer,
};

export const getPostOfficeRootState = createFeatureSelector<State>('dpsPostOfficeCore');
export const getPostOfficeState = createSelector(getPostOfficeRootState, (state => state.postOffice));
export const getPostOfficeStateByToken = (token) => createSelector(getPostOfficeState, postOffice.getStateByToken(token));
export const getPostOfficeIsLoadingByToken = (token) => createSelector(getPostOfficeState, postOffice.getIsloadingByToken(token));
export const getPostOfficeColumnDefByToken = (token) => createSelector(getPostOfficeState, postOffice.getColumnDefByToken(token));
export const getPostOfficePeginatorDefByToken = (token) =>
    createSelector(getPostOfficeState, postOffice.getPeginatorDefByToken(token));

export const getPostOfficeUserByToken = (token) => createSelector(getPostOfficeState, postOffice.getUserByToken(token));
export const getPostOfficeSelectedInfoByToken = (token) =>
    createSelector(getPostOfficeState, postOffice.getSelectedInfoByToken(token));
export const getPostOfficeGridDataByToken = (token) => createSelector(getPostOfficeState, postOffice.getGridDataByToken(token));
export const getPostOfficeGridPasswordRequestRowByToken = (token) =>
    createSelector(getPostOfficeState, postOffice.getPasswordRequestRowByToken(token));
export const getPostOfficeGridExpandedRowByToken
    = (token) => createSelector(getPostOfficeState, postOffice.getGridExpandedRowByToken(token));
export const getPostOfficeTotalItemByToken = (token) => createSelector(getPostOfficeState, postOffice.getTotalItemByToken(token));
export const getPostOfficeShowMessgeByToken = (token) => createSelector(getPostOfficeState, postOffice.getShowMassgeByToken(token));
export const getGroupModeByToken = (token) => createSelector(getPostOfficeState, postOffice.getGroupModeByToken(token));
export const getGroupDataByToken = (token) => createSelector(getPostOfficeState, postOffice.getGroupDataByToken(token));
export const getSelectGroupHashByToken = (token) => createSelector(getPostOfficeState, postOffice.getSelectGroupHashByToken(token));
export const getLoookForsByToken = (token) => createSelector(getPostOfficeState, postOffice.getLoookForsByToken(token));
export const getDepartmentsByToken = (token) => createSelector(getPostOfficeState, postOffice.getDepartments(token));
export const getPostOfficeGroupsByToken = (token) => createSelector(getPostOfficeState, postOffice.getGroupByToken(token));





















