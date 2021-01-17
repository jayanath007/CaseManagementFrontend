
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as screenLookup from './client-screen-lookup';

export interface State {
    screenLookup: screenLookup.State;
}
export const reducers = {
    screenLookup: screenLookup.reducer,
};
export const getScreenLookupRootState = createFeatureSelector<State>('dpsClientScreenLookupCore');
export const getScreenLookuState = createSelector(getScreenLookupRootState, (state => state.screenLookup));
export const getScreenLookupStateByToken = (token) =>
    createSelector(getScreenLookuState, screenLookup.getViewByToken(token));
export const getScreenLookupTypeTagByToken = (token) =>
    createSelector(getScreenLookuState, screenLookup.getScreenLookupTypeTagByToken(token));

// export const getWorkflowRuleFileIdByToken = (token) =>
//     createSelector(getWorkflowRuleState, workflowRule.getFileIdByToken(token));

// export const getWorkflowRuleBranchIdByToken = (token) =>
//     createSelector(getWorkflowRuleState, workflowRule.getBranchIdByToken(token));

export const getScreenLookupIsLoadingByToken = (token) =>
    createSelector(getScreenLookuState, screenLookup.getIsLoadingByToken(token));

// export const getWorkflowRuleIsDirtyByToken = (token) =>
//     createSelector(getWorkflowRuleState, workflowRule.getIsDirtyByToken(token));


export const getScreenLookupListByToken = (token) =>
    createSelector(getScreenLookuState, screenLookup.getScreenLookupListByToken(token));

export const getDirtyListByToke = (token) =>
    createSelector(getScreenLookuState, screenLookup.getDirtyListByToke(token));



// export const getSelectedWorkflowRuleRuleListByToken = (token) =>
//     createSelector(getWorkflowRuleState, workflowRule.getSelectedRuleListByToken(token));

// export const getIsSaveApplyByToken = (token) =>
//     createSelector(getWorkflowRuleState, workflowRule.getIsSaveApplyByToken(token));

// export const getMatterDataByToken = (token) =>
//     createSelector(getWorkflowRuleState, workflowRule.getMatterDataByToken(token));

// export const getExportedDataByToken = (token) =>
//     createSelector(getWorkflowRuleState, workflowRule.getExportedDataByToken(token));


