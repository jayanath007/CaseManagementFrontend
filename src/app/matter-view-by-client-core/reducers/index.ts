import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as matterView from './matter-view-by-client';

export interface State {
    mattersView: matterView.State;
}

export const reducers = {
    mattersView: matterView.reducer,
};


export const getMatterViewRootState = createFeatureSelector<State>('dpsMatterViewByClientCore');
export const getMatterViewState = createSelector(getMatterViewRootState, (state => state.mattersView));
export const getMatterViewStateByToken = (token) => createSelector(getMatterViewState, matterView.getStateByToken(token));
export const getMatterViewIsLoadingByToken = (token) => createSelector(getMatterViewState, matterView.getIsLoadingToken(token));
export const getMatterViewClientRef = (token) => createSelector(getMatterViewState, matterView.getClientRef(token));
export const getMatterViewGridColoumnByToken = (token) => createSelector(getMatterViewState, matterView.getIsGridColoumnToken(token));
export const getMatterViewColumnDefByToken = (token) => createSelector(getMatterViewState, matterView.getColumnDefByToken(token));
export const getMatterViewPeginatorDefByToken = (token) => createSelector(getMatterViewState, matterView.getPeginatorDefByToken(token));
export const getMatterViewGridDataByToken = (token) => createSelector(getMatterViewState, matterView.getGridDataByToken(token));
export const getMatterViewTotalItemByToken = (token) => createSelector(getMatterViewState, matterView.getTotalItemByToken(token));








