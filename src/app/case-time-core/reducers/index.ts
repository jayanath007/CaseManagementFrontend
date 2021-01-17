import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as CaseTime from './case-time';

export interface State {
    CaseTime: CaseTime.State;
}
export const reducers = {
    CaseTime: CaseTime.reducer,
};

export const getCaseTimeRootState = createFeatureSelector<State>('dpsCaseTime');
export const getCaseTimeState = createSelector(getCaseTimeRootState, (state) => state.CaseTime);
export const getCaseTimeByToken = (token) => createSelector(getCaseTimeState, CaseTime.getViewByToken(token));
export const getCaseTimeListByToken = (token) => createSelector(getCaseTimeState, CaseTime.getCaseTimeListByToken(token));
export const getCaseTimeHashByToken = (token) => createSelector(getCaseTimeState, CaseTime.getCurrentHashByToken(token));
export const getCaseTimeColumnDefByToken = (token) => createSelector(getCaseTimeState, CaseTime.getColumnDefByToken(token));
export const getCaseTimeGridDataByToken = (token) =>
    createSelector(getCaseTimeState, CaseTime.getCaseTimeGridDataByToken(token));
export const getCaseTimeSearchTextByToken = (token) => createSelector(getCaseTimeState, CaseTime.getSearchTextByToken(token));
export const getCaseTimePageEventByToken = (token) =>
    createSelector(getCaseTimeState, CaseTime.getCaseTimePageEventByToken(token));
export const  getIsDataLoadedByToken = (token) => createSelector(getCaseTimeState, CaseTime.getIsDataLoadedByToken(token));
