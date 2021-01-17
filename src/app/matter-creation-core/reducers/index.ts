import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as matterCreation from './matter-creation';

export interface State {
    matterCreation: matterCreation.State;
}
export const reducers = {
    matterCreation: matterCreation.reducer,
};

export const getMatterCreationRootState = createFeatureSelector<State>('dpsMatterCreationCore');

export const getMatterCreationState = createSelector(getMatterCreationRootState, (state) => state.matterCreation);
export const getModelByToken = (token) => createSelector(getMatterCreationState, matterCreation.getModelByToken(token));

export const getIsModelDirtyByToken = (token) => createSelector(getMatterCreationState, matterCreation.getIsModelDirtyByToken(token));
export const getModeByToken = (token) => createSelector(getMatterCreationState, matterCreation.getModeByToken(token));
export const getCloserProcessingByToken = (token) =>
    createSelector(getMatterCreationState, matterCreation.getCloserProcessingByToken(token));
export const getFeeEarnerIsUserByToken = (token) => createSelector(getMatterCreationState, matterCreation.getFeeEarnerIsUserByToken(token));
export const getShowConflictSearch = (token) => createSelector(getMatterCreationState, matterCreation.getShowConflictSearch(token));
export const getIsLoading = (token) => createSelector(getMatterCreationState, matterCreation.getIsLoading(token));
export const getCloseMatterCreation = (token) => createSelector(getMatterCreationState, matterCreation.getCloseMatterCreation(token));

export const getLAMatterTypesList = (token) => createSelector(getMatterCreationState, matterCreation.getLAMatterTypesList(token));
export const getCaseStageLevelList = (token) => createSelector(getMatterCreationState, matterCreation.getCaseStageLevelList(token));
export const getCriteriaList = (token) => createSelector(getMatterCreationState, matterCreation.getCriteriaList(token));
export const getMatterType1List = (token) => createSelector(getMatterCreationState, matterCreation.getMatterType1List(token));
export const getMatterType2List = (token) => createSelector(getMatterCreationState, matterCreation.getMatterType2List(token));
export const getOutcomeList = (token) => createSelector(getMatterCreationState, matterCreation.getOutcomeList(token));
export const getStageReachedList = (token) => createSelector(getMatterCreationState, matterCreation.getStageReachedList(token));

export const getMatterSeatchList = (token) => createSelector(getMatterCreationState, matterCreation.getMatterSeatchList(token));
export const getMatterIndex = (token) => createSelector(getMatterCreationState, matterCreation.getMatterIndex(token));

export const getIsInit = createSelector(getMatterCreationState, matterCreation.getIsInit);

export const getClientDefaults = createSelector(getMatterCreationState, matterCreation.getClientDefaults);
export const getLSCDate = createSelector(getMatterCreationState, matterCreation.getLSCDate);
export const getBranchList = createSelector(getMatterCreationState, matterCreation.getBranchList);
// export const getFeeEarnerList = createSelector(getMatterCreationState, matterCreation.getFeeEarnerList);
export const getSupervisorList = createSelector(getMatterCreationState, matterCreation.getSupervisorList);
export const getAppCodeList = createSelector(getMatterCreationState, matterCreation.getAppCodeList);
// export const getMatterDepartmentList = createSelector(getMatterCreationState, matterCreation.getMatterDepartmentList);
export const getRateCategoryList = createSelector(getMatterCreationState, matterCreation.getRateCategoryList);
export const getMatterInterestSchemeList = createSelector(getMatterCreationState, matterCreation.getMatterInterestSchemeList);
export const getIntroductionList = createSelector(getMatterCreationState, matterCreation.getIntroductionList);
export const getTrusAccNoList = createSelector(getMatterCreationState, matterCreation.getTrusAccNoList);
export const getCreditControlStageList = createSelector(getMatterCreationState, matterCreation.getCreditControlStageList);
export const getSundryProfitList = createSelector(getMatterCreationState, matterCreation.getSundryProfitList);
export const getDDABankList = createSelector(getMatterCreationState, matterCreation.getDDABankList);
export const getUseFileSecurity = createSelector(getMatterCreationState, matterCreation.getUseFileSecurity);
export const getEBillingSchemeList = createSelector(getMatterCreationState, matterCreation.getEBillingSchemeList);

export const getMatterCategoryListByToken = (token) =>
    createSelector(getMatterCreationState, matterCreation.getMatterCategoryListByToken(token));
export const getMatterCategoryListByDepartmentId = (id) =>
    createSelector(getMatterCreationState, matterCreation.getMatterCategoryListByDepartmentId(id));

export const getMatterDepartmentByToken = (token) =>
    createSelector(getMatterCreationState, matterCreation.getMatterDepartmentByToken(token));

export const getRelatedDocumentsPageEventByToken = (token) =>
    createSelector(getMatterCreationState, matterCreation.getRelatedDocumentsPageEventByToken(token));

export const getClientDocumentRegistriesGridDataByToken = (token) =>
    createSelector(getMatterCreationState, matterCreation.getClientDocumentRegistriesGridDataByToken(token));

export const getOriginalModelByToken = (token) =>
    createSelector(getMatterCreationState, matterCreation.getOriginalModelByToken(token));
export const getOpportunityViewModelByToken = (token) =>
    createSelector(getMatterCreationState, matterCreation.getOpportunityViewModelByToken(token));
export const getConfirmBeforeOpenCase = (token) =>
    createSelector(getMatterCreationState, matterCreation.getConfirmBeforeOpenCase(token));



