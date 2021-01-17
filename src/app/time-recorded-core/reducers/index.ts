import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as timeRecorded from './time-recorded';

export interface State {
    timeRecorded: timeRecorded.State;
}

export const reducers = {
    timeRecorded: timeRecorded.reducer,
};

export const getTimeRecordedRootState = createFeatureSelector<State>('dpsTimeRecordedCore');
export const getTimeRecordedState = createSelector(getTimeRecordedRootState, (state => state.timeRecorded));
export const getTimeRecordedStateByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getStateByToken(token));
export const getTimeRecordedIsLoadingByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getIsloadingByToken(token));
export const getTimeRecordedColumnDefByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getColumnDefByToken(token));
export const getTimeRecordedPeginatorDefByToken = (token) =>
    createSelector(getTimeRecordedState, timeRecorded.getPeginatorDefByToken(token));
export const getTimeRecordedDepartmentByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getDepartmentByToken(token));
export const getTimeRecordedTypeByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getTypeByToken(token));
export const getTimeRecordedPeriodByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getPeriodByToken(token));
export const getTimeRecordedSelectedInfoByToken = (token) =>
    createSelector(getTimeRecordedState, timeRecorded.getSelectedInfoByToken(token));
export const getTimeRecordedUserPermisionByToken = (token) =>
    createSelector(getTimeRecordedState, timeRecorded.getUserPermisionByToken(token));
export const getTimeRecordedGridDataByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getGridDataByToken(token));
export const getTimeRecordedTotalItemByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getTotalItemByToken(token));
export const getTimeRecordedSummeryByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getSummeryByToken(token));
export const getSelectGroupModeByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getSelectGroupModeByToken(token));
export const getGroupDataByToken = (token) => createSelector(getTimeRecordedState, timeRecorded.getGroupDataByToken(token));
