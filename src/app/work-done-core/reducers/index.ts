import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as workDone from './work-done';

export interface State {
    workDone: workDone.State;
}

export const reducers = {
    workDone: workDone.reducer,
};

export const getWorkDoneRootState = createFeatureSelector<State>('dpsWorkDoneCore');
export const getWorkDoneState = createSelector(getWorkDoneRootState, (state => state.workDone));
export const getWorkDoneStateByToken = (token) => createSelector(getWorkDoneState, workDone.getStateByToken(token));
export const getWorkDoneIsLoadingByToken = (token) => createSelector(getWorkDoneState, workDone.getIsloadingByToken(token));
export const getWorkDoneColumnDefByToken = (token) => createSelector(getWorkDoneState, workDone.getColumnDefByToken(token));
export const getWorkDonePeginatorDefByToken = (token) =>
    createSelector(getWorkDoneState, workDone.getPeginatorDefByToken(token));
export const getWorkDoneSepartmentsByToken = (token) => createSelector(getWorkDoneState, workDone.getDepartmentByToken(token));
export const getWorkDonePeriodByToken = (token) => createSelector(getWorkDoneState, workDone.getPeriodByToken(token));
export const getWorkDoneSelectedInfoByToken = (token) =>
    createSelector(getWorkDoneState, workDone.getSelectedInfoByToken(token));
export const getWorkDoneGridDataByToken = (token) => createSelector(getWorkDoneState, workDone.getGridDataByToken(token));
export const getWorkDoneGridPasswordRequestRowByToken = (token) =>
    createSelector(getWorkDoneState, workDone.getPasswordRequestRowByToken(token));
export const getWorkDoneGridExpandedRowByToken = (token) => createSelector(getWorkDoneState, workDone.getGridExpandedRowByToken(token));
export const getWorkDoneTotalItemByToken = (token) => createSelector(getWorkDoneState, workDone.getTotalItemByToken(token));
export const getWorkDoneSummeryByToken = (token) => createSelector(getWorkDoneState, workDone.getSummeryByToken(token));
export const getWorkDoneShowMessgeByToken = (token) => createSelector(getWorkDoneState, workDone.getShowMassgeByToken(token));
export const getGroupModeByToken = (token) => createSelector(getWorkDoneState, workDone.getGroupModeByToken(token));
export const getGroupDataByToken = (token) => createSelector(getWorkDoneState, workDone.getGroupDataByToken(token));
export const getSelectGroupHashByToken = (token) => createSelector(getWorkDoneState, workDone.getSelectGroupHashByToken(token));





















