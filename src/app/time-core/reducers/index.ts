import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as Time from './time-core';

export interface State {
    Time: Time.State;
}
export const reducers = {
    Time: Time.reducer,
};

export const getTimeRootState = createFeatureSelector<State>('dpsTime');
export const getTimeState = createSelector(getTimeRootState, (state) => state.Time);
export const getTimeByToken = (token) => createSelector(getTimeState, Time.getViewByToken(token));
export const getTimeListByToken = (token) => createSelector(getTimeState, Time.getTimeListByToken(token));
export const getTimeHashByToken = (token) => createSelector(getTimeState, Time.getCurrentHashByToken(token));
export const getTimeGridDataByToken = (token) =>
    createSelector(getTimeState, Time.getTimeGridDataByToken(token));
export const getTimeSearchTextByToken = (token) => createSelector(getTimeState, Time.getSearchTextByToken(token));
export const getTimePageEventByToken = (token) =>
    createSelector(getTimeState, Time.getTimePageEventByToken(token));
export const  getIsDataLoadedByToken = (token) => createSelector(getTimeState, Time.getIsDataLoadedByToken(token));
