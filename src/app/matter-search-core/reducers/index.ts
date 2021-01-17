import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as matters from './matters';

export interface State {
  matters: matters.State;
}

export const reducers = {
  matters: matters.reducer,
};

export const getMatterSearchRootState = createFeatureSelector<State>('dpsMatterSearchCore');

// matter stuff
export const getMatterState = createSelector(getMatterSearchRootState, (state) => state.matters);
export const getMatterViewByToken = (token) => createSelector(getMatterState, matters.getViewByToken(token));
export const getMatterDepartmentByToken = (token) => createSelector(getMatterState, matters.getDepartmentByToken(token));
export const getMatterActiveViewByToken = (token) => createSelector(getMatterState, matters.getActiveViewByToken(token));
export const getMatterClosedMatterFalgByToken = (token) =>
  createSelector(getMatterState, matters.getClosedMatterFalgByToken(token));
export const getCompletedMatterFalgByToken = (token) =>
  createSelector(getMatterState, matters.getCompletedMatterFalgByToken(token));
export const getMatterInactiveFeeEranersFalgByToken = (token) =>
  createSelector(getMatterState, matters.getClosedInactiveFeeEranersFalgByToken(token));
export const getMatterSearchTextByToken = (token) => createSelector(getMatterState, matters.getSearchTextByToken(token));
export const getMatterCreateInputDataByToken = (token) => createSelector(getMatterState, matters.getMatterCreateInputDataByToken(token));
export const getMatterSelectedDepartmentByToken = (token) => createSelector(getMatterState, matters.getSelectedDepartmentByToken(token));
export const getMatterGridDataByToken = (token) => createSelector(getMatterState, matters.getCurrentGridDataByToken(token));
export const getMatterCurrentHashByToken = (token) => createSelector(getMatterState, matters.getCurrentHashByToken(token));

export const getMatterPaginatorDefByToken = (token) => createSelector(getMatterState, matters.getPaginatorDefByToken(token));
export const getMatterCurrentItemTotalByToken = (token) => createSelector(getMatterState, matters.getCurrentItemTotalByToken(token));

export const getMatterSelectedMemberByToken = (token) => createSelector(getMatterState, matters.getSelectedMemberByToken(token));
export const getMatterRowExpsanDataByToken = (token) => createSelector(getMatterState, matters.getRowExpsanDataByToken(token));
export const getMatterRowSelectDataByToken = (token) => createSelector(getMatterState, matters.getRowSelectDataByToken(token));
export const getMatterColumnDefByToken = (token) => createSelector(getMatterState, matters.getColumnDefByToken(token));

export const getMatterTotalBillsOutstandingByToken = (token) =>
  createSelector(getMatterState, matters.getTotalBillsOutstandingByToken(token));
export const getMatterTotalMatterCountByToken = (token) => createSelector(getMatterState, matters.getTotalMatterCountByToken(token));

export const getMaterDepartmentLoadingStateByToken = (token) =>
  createSelector(getMatterState, matters.getDepartmentLoadingStateByToken(token));

export const getMaterGridLoadingStateByToken = (token) =>
  createSelector(getMatterState, matters.getGridLoadingStateByToken(token));
export const getViewChangeKindByToken = (token) =>
  createSelector(getMatterState, matters.getViewChangeKindByToken(token));
export const getIsUserExpandRowByToken = (token) =>
  createSelector(getMatterState, matters.getIsUserExpandRowByToken(token));
export const getIsMLSEnableMattersByToken = (token) =>
  createSelector(getMatterState, matters.getIsMLSEnableMatters(token));
export const getRefferalNotePopupClose = (token) =>
  createSelector(getMatterState, matters.getRefferalNotePopupClose(token));
export const getRefferalNoteLoading = (token) =>
  createSelector(getMatterState, matters.getRefferalNoteLoading(token));
export const getCurrentReviewNote = (token) =>
  createSelector(getMatterState, matters.getCurrentReviewNote(token));
