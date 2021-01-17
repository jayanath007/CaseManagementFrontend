import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as teamMember from './team-member';

export interface State {
    teamMember: teamMember.State;
}

export const reducers = {
    teamMember: teamMember.reducer,
};

export const getTeamMemberRootState = createFeatureSelector<State>('dpsTeamMemberCore');
export const getTeamMemberState = createSelector(getTeamMemberRootState, (state) => state.teamMember);
export const getTeamMemberStateByToken = (token) => createSelector(getTeamMemberState, teamMember.getViewByToken(token));
export const getTeamMembersByToken = (token) => createSelector(getTeamMemberState, teamMember.getTeamMemberByToken((token)));
export const getParaDataByToken = (token) => createSelector(getTeamMemberState, teamMember.getParaDataByToken((token)));
export const getSelectedTeamMemberByToken = (token) => createSelector(getTeamMemberState, teamMember.getSelectedTeamMemberByToken((token)));
export const getTeamMemberLoadingStatusByToken = (token) =>
    createSelector(getTeamMemberState, teamMember.getisTeamMemberLoadingByToken((token)));
export const getSearchKeyByToken = (token) =>
    createSelector(getTeamMemberState, teamMember.getSearchKeyByToken((token)));
export const getTeamMemberCountByToken = ((token) =>
    createSelector(getTeamMemberState, teamMember.getTeamMemberCountByToken((token))));
// export const getAllMemberByToken = ((token) =>
//     createSelector(getTeamMemberState, teamMember.getAllMemberByToken((token))));
export const getMemListPanelModeByToken = (token => createSelector(getTeamMemberState, teamMember.getMemListPanelModeByToken(token)));
