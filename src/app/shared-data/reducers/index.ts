import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as timeRecords from './time-record';
import * as masterData from './master-data';
import { LookupType } from '../../shared';


export interface State {
    timeRecords: timeRecords.State;
    masterData: masterData.State;
}

export const reducers = {
    timeRecords: timeRecords.reducer,
    masterData: masterData.reducer
};

export const getSharedataRootState = createFeatureSelector<State>('dpsSharedata');
export const getTimeRecordState = createSelector(getSharedataRootState, (state) => state.timeRecords);
export const getTimeRecordOpeningData = createSelector(getTimeRecordState, timeRecords.getTimeRecordOpeningData);
export const getGenaralTimeRecordInput = createSelector(getTimeRecordState, timeRecords.getGenaralTimeRecordInput);
export const getCrimeClassRequestMode = createSelector(getTimeRecordState, timeRecords.getCrimeClassRequestModel);
export const getCrimeManagerPopupInput = createSelector(getTimeRecordState, timeRecords.getCrimeManagerPopupInput);
export const getTimeInformationInput = createSelector(getTimeRecordState, timeRecords.getTimeInformationInput);
export const getSettingByKey = (key) =>
    createSelector(getTimeRecordState, timeRecords.getSettings ? timeRecords.getSettingsByKey(key) : null);
export const getCivilTimePopupInput = createSelector(getTimeRecordState, timeRecords.getCivilTimePopupInput);

// Master Data
export const getMasterDataState = createSelector(getSharedataRootState, (state) => state.masterData);
export const getDepartmentList = createSelector(getMasterDataState, masterData.getDepartmentList);
export const getWorkTypeListByDepartmentId = (departmentId) =>
    createSelector(getMasterDataState, masterData.getWorkTypeListByDepartmentId(departmentId));
export const getLookupListByType = (type: string) =>
    createSelector(getMasterDataState, masterData.getLookupListByType(type));
export const getCrimeLookupList = (type: LookupType) =>
    createSelector(getMasterDataState, masterData.getCrimeLookupList(type));
export const getFeeEarnerList = (isActive: boolean) =>
    createSelector(getMasterDataState, masterData.getFeeEarnerList(isActive));
export const getBranchList = createSelector(getMasterDataState, masterData.getBranchList);






