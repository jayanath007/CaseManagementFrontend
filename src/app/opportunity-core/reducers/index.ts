import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as Opportunity from './opportunity';

export interface State {
    Opportunity: Opportunity.State;
}
export const reducers = {
    Opportunity: Opportunity.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsOpportunityToken');
export const getPageState = createSelector(getRootState, (state) => state.Opportunity);

export const getOpportunityDataByToken = (token) => createSelector(getPageState, Opportunity.getOpportunityDisplayDataByToken(token));
export const getOpportunityColumnDefByToken = (token) => createSelector(getPageState, Opportunity.getColumnDefByToken(token));
export const getOpportunityPaginatorDefByToken = (token) => createSelector(getPageState, Opportunity.getPaginatorDefByToken(token));
export const getDataLoadindByToken = (token) => createSelector(getPageState, Opportunity.getDataLoadindByToken(token));
// export const getWorkTypeListByToken = (token) => createSelector(getPageState, Opportunity.getWorkTypeListByToken(token));
export const getFeeEarnerListByToken = (token) => createSelector(getPageState, Opportunity.getFeeEarnerListByToken(token));
// export const getDepartmentListByToken = (token) => createSelector(getPageState, Opportunity.getDepartmentListByToken(token));
export const getIntroducerListByToken = (token) => createSelector(getPageState, Opportunity.getIntroducerListByToken(token));
export const getStatusListByToken = (token) => createSelector(getPageState, Opportunity.getStatusListByToken(token));
export const getOpportunitySelectedStatusByToken = (token) => createSelector(getPageState, Opportunity.getSelectedStatusByToken(token));
export const getOpportunitySelectedTabIndexByToken = (token) => createSelector(getPageState, Opportunity.getSelectedTabByToken(token));
export const getClientDataModelByToken = (token) => createSelector(getPageState, Opportunity.getClientDataModelByToken(token));
export const getClientDataModelForSaveByToken = (token) => createSelector(getPageState,
    Opportunity.getClientDataModelForSaveByToken(token));
export const getSaveOpportunityGridDataByToken = (token) => createSelector(getPageState,
    Opportunity.getSaveOpportunityGridDataByToken(token));
export const getQuoteRunLoading = (token) => createSelector(getPageState, Opportunity.getOpportunityRunLoading(token));
export const getTempleteList = (token) => createSelector(getPageState, Opportunity.getTempleteList(token));
export const closePopup = (token) => createSelector(getPageState, Opportunity.closePopup(token));
export const closeOpportunityPopupClose = (token) => createSelector(getPageState, Opportunity.closeOpportunityPopupClose(token));
export const opportunityViewHistory = (token) => createSelector(getPageState, Opportunity.opportunityViewHistory(token));
export const propertyQuoteTypeList = (token: string) => createSelector(getPageState, Opportunity.propertyQuoteTypeList(token));
export const propertyQuoteRequest = (token: string) => createSelector(getPageState, Opportunity.propertyQuoteRequest(token));
export const getwebQuoteData = (token: string) => createSelector(getPageState, Opportunity.getwebQuoteData(token));
export const getPropertyQuCurrentStep = (token: string) => createSelector(getPageState, Opportunity.getPropertyQuCurrentStep(token));
export const getPropertyQuReportData = (token: string) => createSelector(getPageState, Opportunity.getPropertyQuReportData(token));
export const getOpportunityStats = (token: string) => createSelector(getPageState, Opportunity.getOpportunityStats(token));
export const editEnquaryId = (token: string) => createSelector(getPageState, Opportunity.editEnquaryId(token));
export const editOppertunityData = (token: string) => createSelector(getPageState, Opportunity.editOppertunityData(token));
export const defuiltNote = (token: string) => createSelector(getPageState, Opportunity.defuiltNote(token));
export const getScreenListForSelectedApp = (selectedAppId) =>
    createSelector(getPageState, Opportunity.getScreenListForSelectedApp(selectedAppId));
// export const getFilterdScreenList = (filterText: string) => createSelector(getPageState, Opportunity.getFilterdScreenList(filterText));
export const getAppCodes = createSelector(getPageState, Opportunity.getApps);
export const getOpportuniySettingIsLoading = createSelector(getPageState, Opportunity.settingIsLoading);
export const getScreenList = createSelector(getPageState, Opportunity.getScreenList);
export const getAddedScreenList = createSelector(getPageState, Opportunity.getAddedScreenList);
export const getWebQuoteVars = createSelector(getPageState, Opportunity.getWebQuoteVars);
export const getEmailTemplete = createSelector(getPageState, Opportunity.getEmailTemplete);
export const getPreviesEmailTemplete = createSelector(getPageState, Opportunity.getPreviesEmailTemplete);
export const getWequoteCompanyDetails = createSelector(getPageState, Opportunity.getWequoteCompanyDetails);












