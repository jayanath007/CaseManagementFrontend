
import * as cCInfo from './cc-invetigation-info';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    Info: cCInfo.State;
}
export const reducers = {
    Info: cCInfo.reducer,
};

export const getcCInvestigationInfoRootState = createFeatureSelector<State>('crimeInvestigationInfo');
export const getCIInvestigationInfoState = createSelector(getcCInvestigationInfoRootState, (state => state.Info));
export const getIsLoadingByToken = token => createSelector(getCIInvestigationInfoState, cCInfo.getIsLoadingByToken(token));
// export const getCrimeClassIdentityViewModel = token =>
//     createSelector(getCIInvestigationInfoState, cCInfo.getCrimeClassIdentityViewModel(token));
export const getUIControllerProperty = token => createSelector(getCIInvestigationInfoState, cCInfo.getUIControllerProperty(token));
export const getInformationModel = token => createSelector(getCIInvestigationInfoState, cCInfo.getInformationModel(token));
export const getStageReachedList = token => createSelector(getCIInvestigationInfoState, cCInfo.getStageReachedList(token));
export const getMatterTypeList = createSelector(getCIInvestigationInfoState, cCInfo.getMatterTypeList);
export const getOutComeCodeList = createSelector(getCIInvestigationInfoState, cCInfo.getOutComeCodeList);
export const getTotalSummeryRequestModel = token => createSelector(getCIInvestigationInfoState, cCInfo.getTotalSummeryRequestModel(token));
export const getTotalsummery = token => createSelector(getCIInvestigationInfoState, cCInfo.getTotalsummery(token));
export const getCurrentTotalReqViewModel = token => createSelector(getCIInvestigationInfoState, cCInfo.getCurrentTotalReqViewModel(token));
export const getClassClosingReqViewModel = token => createSelector(getCIInvestigationInfoState, cCInfo.getClassClosingReqViewModel(token));
export const getPopupOpeningData = token => createSelector(getCIInvestigationInfoState, cCInfo.getPopupOpeningData(token));
export const getTotalForDisplayPurpose = token => createSelector(getCIInvestigationInfoState, cCInfo.getTotalForDisplayPurpose(token));
export const getIsRecursiveForm = token => createSelector(getCIInvestigationInfoState, cCInfo.getIsRecursiveForm(token));
export const getUFNValue = token => createSelector(getCIInvestigationInfoState, cCInfo.getUFNValue(token));



