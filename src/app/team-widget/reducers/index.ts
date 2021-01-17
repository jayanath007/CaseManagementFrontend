import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as team from './team-widget';

export interface State {
    data: team.State;
}

export const reducers = {
    data: team.reducer,
};

export const getTeamWidgetRoot = createFeatureSelector<State>('dpsTeamWidget');
export const getDpsTeamWidgetState = createSelector(getTeamWidgetRoot, (state => state.data));
export const getTeamWidgetIsloading = () => createSelector(getDpsTeamWidgetState, team.getIsLoading());
export const getTeamWidgetData = () => createSelector(getDpsTeamWidgetState, team.getData());

