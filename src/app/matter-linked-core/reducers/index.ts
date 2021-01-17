import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as matterLinked from './matter-linked';


export interface State {
    matterLinked: matterLinked.State;
}
export const reducers = {
    matterLinked: matterLinked.reducer,
};


export const getMatterLinkedRootState = createFeatureSelector<State>('dpsMatterLinkedCore');
export const getMatterLinkedState = createSelector(getMatterLinkedRootState, (state => state.matterLinked));
export const getColumnDefByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getColumnDefByToken(token));
export const getPaginatorDefByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getPaginatorDefByToken(token));
export const getGridDataByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getGridDataByToken(token));
export const getLoadingByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getLoadingByToken(token));
export const getMatterRefByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getMatterRefByToken(token));
export const getSelectedMatterDataByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getSelectedMatterDataByToken(token));
export const getMatterDataByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getMatterDataByToken(token));
export const getScreenId = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getScreenId(token));
export const getDiaryId = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getDiaryId(token));
export const getOpenFromByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getOpenFromByToken(token));
export const getParentTokenByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getParentTokenByToken(token));
export const getMultiselectItemTokenByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getMultiselectItemTokenByToken(token));
export const getPlotRangeTokenByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getPlotRangeTokenByToken(token));

export const getPlotSyncSuccessInfoByToken = (token) =>
    createSelector(getMatterLinkedState, matterLinked.getPlotSyncSuccessInfoByToken(token));







