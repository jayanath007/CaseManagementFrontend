
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as classInfoState from './class-information';

export interface State {
    classInfoState: classInfoState.State;
}

export const reducers = {
    classInfoState: classInfoState.reducer
};

export const getcCInvestigationInfoRootState = createFeatureSelector<State>('crimeProceedingInfo');

// Class information
export const getClassInfoState = createSelector(getcCInvestigationInfoRootState, (state => state.classInfoState));
export const getClassIdentity = token => createSelector(getClassInfoState, classInfoState.getClassIdentity(token));
export const getIsLoadingByToken = token => createSelector(getClassInfoState, classInfoState.getIsLoadingByToken(token));
export const getInfomationModel = token => createSelector(getClassInfoState, classInfoState.getInfomationModel(token));
export const getStageReachedList = token => createSelector(getClassInfoState, classInfoState.getStageReachedList(token));
export const getMatterTypeList = token => createSelector(getClassInfoState, classInfoState.getMatterTypeList(token));
export const getOutComeCodeList = token => createSelector(getClassInfoState, classInfoState.getOutComeCodeList(token));
export const getCaseTypeList = token => createSelector(getClassInfoState, classInfoState.getCaseTypeList(token));
export const getFilterdStageReachedList = token => createSelector(getClassInfoState, classInfoState.getFilterdStageReachedList(token));
export const getFilterdCaseTypeList = token => createSelector(getClassInfoState, classInfoState.getFilterdCaseTypeList(token));
export const getLocationLookupDataByToken = token => createSelector(getClassInfoState, classInfoState.getLocationLookupDataByToken(token));
export const getUIControllerProperty = token => createSelector(getClassInfoState, classInfoState.getUIControllerProperty(token));
export const getTotalsummery = token => createSelector(getClassInfoState, classInfoState.getTotalSummery(token));
export const getLeadUfnTotalSummary = token => createSelector(getClassInfoState, classInfoState.getLeadUfnTotalSummary(token));


