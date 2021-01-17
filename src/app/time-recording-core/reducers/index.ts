import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as timeRecording from './time-Recording';

export interface State {
    timeRecording: timeRecording.State;
}
export const reducers = {
    timeRecording: timeRecording.reducer,
};

export const getTimeRecordingRootState = createFeatureSelector<State>('dpsTimeRecordingCore');
export const getTimeRecordingState = createSelector(getTimeRecordingRootState, (state => state.timeRecording));
export const getFeeEarnerList = createSelector(getTimeRecordingState, timeRecording.getFeeEarnerList);
export const getCanMinimizeViews = createSelector(getTimeRecordingState, timeRecording.getCanMinimizeViews);
export const getTimeRecordingViewByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getViewByToken(token));
export const getDetailListByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getDetailListByToken(token));
export const getMatterReferenceNoByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getMatterReferenceNoByToken(token));
export const getClientMatterDataByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getClientMatterDataByToken(token));
export const getIsLoadingByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getIsLoadingByToken(token));
export const getFeeEarnerListByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getFeeEarnerListByToken(token));
export const getErrorDetailsByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getErrorDetailsByToken(token));
export const getTimeRecordingUserByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getTimeRecordingUserByToken(token));
export const getSelectedFeeEarnerByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getSelectedFeeEarnerByToken(token));
export const getTimeRecordingDateByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getTimeRecordingDateByToken(token));
export const getBodyTextByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getBodyTextByToken(token));
export const getMPUByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getMPUByToken(token));
export const getUnitByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getUnitByToken(token));
export const getHourlyRateByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getHourlyRateByToken(token));
export const getAmountByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getAmountByToken(token));
export const getUnchargeStateByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getUnchargeStateByToken(token));
export const getSaveStateToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getSaveStateToken(token));
export const getIsDirtyByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getIsDirtyByToken(token));
export const getTimeRecordEditDataByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getTimeRecordEditDataByToken(token));

// ebilling comment
export const getEBillingTypeByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getEBillingTypeByToken(token));
export const getLoadWorkTypeListByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getLoadWorkTypeListByToken(token));

export const getLoadPrecedentHRateByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getLoadPrecedentHRateByToken(token));

export const getPhaseListByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getPhaseListByToken(token));
export const getActivitiListByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getActivitiListByToken(token));
export const getTaskListByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getTaskListByToken(token));
export const getselectedDetailByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getselectedDetailByToken(token));
export const getTimeValueByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getTimeValueByToken(token));
export const getIsActiveByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getIsActiveTokenByToken(token));
export const getIsTimerStartByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getIsTimerStartByToken(token));
export const isMinimizePopupByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.isMinimizePopupByToken(token));
export const getSelectedPhRateByToken = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getSelectedPhRateByToken(token));
export const getSelectedJobTitle = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getSelectedJobTitle(token));
export const getDiaryFileDetails = (token) =>
    createSelector(getTimeRecordingState, timeRecording.getDiaryFileDetails(token));

