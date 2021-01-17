import * as teamEfficiency from './team-efficiency';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    teamEfficiency: teamEfficiency.State;
}

export const reducers = {
    teamEfficiency: teamEfficiency.reducer,
};
export const getTeamEfficencyRootState = createFeatureSelector<State>('dpsTeamEfficiency');
export const getTeamEfficiencyState = createSelector(getTeamEfficencyRootState, ((state) => state.teamEfficiency));
export const getTeamEfficiencyStateByToken = (token) => createSelector(getTeamEfficiencyState, teamEfficiency.getViewByToken(token));
export const getTeamEfficiencySelectedUserByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getSelectedUserByToken(token));
export const getTeamEfficiencySelectedMonthByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getSelectedMonthByToken(token));
export const getTeamEffSelectedMatterType = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getSelectedMatterType(token));
export const getTeamEfficiencySelectedDepartmentByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getSelectedDepartmentByToken(token));
export const getTeamEfficiencySelectedTimeRecordedOptionByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getSelectedTimeRecordedOptionByToken(token));
export const getTeamEfficiencyTimeRecordedDataByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getTimeRecordedDataByToken(token));
export const getTeamEfficiencyMonthListByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getMonthListByToken(token));
export const getTeamEfficiencyTimeRecordOptionByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getTimeRecordOptionByToken(token));
export const getTimeRecordDataIsLoadedByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getTimeRecordDataIsLoadedByToken(token));
export const getTimeRecordDepartmentListByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getDepartmentListByToken(token));
export const getTimeRecordChartFullTitleByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getTimeRecordChartTitleByToken(token));
export const getTimeRecordLoadingByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getLoadingByToken(token));
export const getTeamEffAdgedDebDataByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getAdgedDebDataByToken(token));
export const getTeamEffBilledTimesByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getBilledTimesByToken(token));
export const getTeamEffCashReceived = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getCashReceived(token));
export const getTeamEffMatterData = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getMatterData(token));
// export const getSelectedYearForMovementData = (token) =>
//     createSelector(getTeamEfficiencyState, teamEfficiency.getSelectedYearForMovementData(token));
export const getEventYearSummeryByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getEventYearSummeryByToken(token));
export const getUserActivityLoadingByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getUserActivityLoadingByToken(token));
export const getActivityTitleByToken = (token) =>
    createSelector(getTeamEfficiencyState, teamEfficiency.getActivityTitleByToken(token));
