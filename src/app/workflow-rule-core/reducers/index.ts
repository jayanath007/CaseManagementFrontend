
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as workflowRule from './workflow-rule';

export interface State {
    workflowRule: workflowRule.State;
}
export const reducers = {
    workflowRule: workflowRule.reducer,
};
export const getWorkflowRuleRootState = createFeatureSelector<State>('dpsWorkflowRuleCore');
export const getWorkflowRuleState = createSelector(getWorkflowRuleRootState, (state => state.workflowRule));
export const getWorkflowRuleStateByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getViewByToken(token));
export const getWorkflowRuleAppIdByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getAppIdByToken(token));

export const getWorkflowRuleFileIdByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getFileIdByToken(token));

export const getWorkflowRuleBranchIdByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getBranchIdByToken(token));

export const getWorkflowRuleIsLoadingByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getIsLoadingByToken(token));

export const getWorkflowRuleIsDirtyByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getIsDirtyByToken(token));


export const getWorkflowRuleRuleListByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getRuleListByToken(token));

export const getSelectedWorkflowRuleRuleListByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getSelectedRuleListByToken(token));

export const getIsSaveApplyByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getIsSaveApplyByToken(token));

export const getMatterDataByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getMatterDataByToken(token));

export const getExportedDataByToken = (token) =>
    createSelector(getWorkflowRuleState, workflowRule.getExportedDataByToken(token));


