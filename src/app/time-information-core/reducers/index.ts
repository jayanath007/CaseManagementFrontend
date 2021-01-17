import * as timeInformation from './time-information';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LookupType } from '../../shared';

export interface State {
    timeInformation: timeInformation.State;
}
export const reducers = {
    timeInformation: timeInformation.reducer,
};

export const getTimeInformationRootState = createFeatureSelector<State>('dpsTimeInformationCore');
export const getTimeInformationState = createSelector(getTimeInformationRootState, (state => state.timeInformation));
export const getIsTimeInformationLoadingByToken = (token) =>
    createSelector(getTimeInformationState, timeInformation.getIsLoadingByToken(token));
export const getFeeEarnerList = (token) =>
    createSelector(getTimeInformationState, timeInformation.getFeeEarnerList(token));
export const getFormViewModelByToken = (token) =>
    createSelector(getTimeInformationState, timeInformation.getFormViewModelByToken(token));
export const getModelByToken = (token) =>
    createSelector(getTimeInformationState, timeInformation.getModelByToken(token));
export const getCrimeClassIdentityViewModel = (token) =>
    createSelector(getTimeInformationState, timeInformation.getCrimeClassIdentityViewModel(token));
export const getAttTypeList = (token) =>
    createSelector(getTimeInformationState, timeInformation.getAttTypesList(token));
export const getGradeList = (token) =>
    createSelector(getTimeInformationState, timeInformation.getGradeList(token));
export const getGridColumnDef = (token) =>
    createSelector(getTimeInformationState, timeInformation.getGridColumnDef(token));
export const getTimeRecordGridItems = (token) =>
    createSelector(getTimeInformationState, timeInformation.getTimeRecordGridItems(token));
export const getSaveModelByToken = (token) =>
    createSelector(getTimeInformationState, timeInformation.getSaveModelByToken(token));
export const getIsUpdateRateFiles = (token) =>
    createSelector(getTimeInformationState, timeInformation.getIsUpdateRateFiles(token));
export const getIsEditModeByToken = (token) => createSelector(getTimeInformationState, timeInformation.getIsEditMode(token));
export const getIsEditTimId = (token) => createSelector(getTimeInformationState, timeInformation.getIsEditTimId(token));
export const getAttendeesAndWorkLookupDataByToken = (token: string, lookupType: LookupType) =>
    createSelector(getTimeInformationState, timeInformation.getAttendeesAndWorkLookupData(token, lookupType));
export const checkInitialDataLoadedForEdit = token =>
    createSelector(getTimeInformationState, timeInformation.checkInitialDataLoadedForEdit(token));
export const getSettings = token =>
    createSelector(getTimeInformationState, timeInformation.getSettings(token));
export const getIsloadingTimeRecords = token =>
    createSelector(getTimeInformationState, timeInformation.getIsloadingTimeRecords(token));
export const getClassList = token =>
    createSelector(getTimeInformationState, timeInformation.getClassList(token));
export const getPopupInput = token =>
    createSelector(getTimeInformationState, timeInformation.getPopupInput(token));
export const getMatter = token =>
    createSelector(getTimeInformationState, timeInformation.getMatter(token));




