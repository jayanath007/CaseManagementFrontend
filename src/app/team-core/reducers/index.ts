import { getStateByToken } from './../../global-document-search-core/reducers/global-document-search';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as team from './team';

export interface State {
    team: team.State;
}
export const reducers = {
    team: team.reducer,
};

export const getTeamRootState = createFeatureSelector<State>('dpsTeam');
export const getTeamState = createSelector(getTeamRootState, (state => state.team));
export const getGlobalSearchStateByToken = (token) => createSelector(getTeamState,
    team.getStateByToken(token));
export const getLoadingByToken = (token) =>
    createSelector(getTeamState, team.getLoadingByToken(token));
export const getParaDataByToken = (token) => createSelector(getTeamState, team.getParaDataByToken(token));
export const getDepartmentListByToken = (token) =>
    createSelector(getTeamState, team.getDepartmentListByToken(token));
export const getUsersLoadingByToken = (token) =>
    createSelector(getTeamState, team.getUsersLoadingByToken(token));
export const getUsersListByToken = (token) =>
    createSelector(getTeamState, team.getUsersListByToken(token));
export const getSelectedViewTypeByToken = (token) => createSelector(getTeamState, team.getSelectedViewTypeByToken(token));
export const getSelectedYearAndMonthByToken = (token) => createSelector(getTeamState, team.getSelectedYearAndMonthByToken(token));
export const getSelectedUserByToken = (token) => createSelector(getTeamState, team.getSelectedUserByToken(token));
export const getLogingUserByToken = (token) => createSelector(getTeamState, team.getLogingUserByToken(token));



export const getParaDetailsActivityByToken = (token) => createSelector(getTeamState, team.getParaDetailsActivityByToken(token));
export const getMonthActivityListByToken = (token) => createSelector(getTeamState, team.getMonthActivityListByToken(token));
export const getActivityListByDayByToken = (token) => createSelector(getTeamState, team.getActivityListByDayByToken(token));
export const getActivityListByYearByToken = (token) => createSelector(getTeamState, team.getActivityListByYearByToken(token));
export const getParaDetailsWithDepartmentByToken = (token) => createSelector(getTeamState, team.getParaDetailsWithDepartmentByToken(token));






