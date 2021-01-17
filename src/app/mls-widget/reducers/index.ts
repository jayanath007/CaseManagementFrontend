import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './MLS-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getWidgetRootState = createFeatureSelector<State>('dpsMLSWidget');
export const getDpsWidgetState = createSelector(getWidgetRootState, (state => state.data));
export const getMLSWidgetIsloading = () => createSelector(getDpsWidgetState, data.getIsLoading());
export const getMLSWidgetData = () => createSelector(getDpsWidgetState, data.getData());
export const getContinueItem = () => createSelector(getDpsWidgetState, data.getContinueItem());
export const getIsMsgSending = () => createSelector(getDpsWidgetState, data.getIsMsgSending());
export const getAllMatterRef = () => createSelector(getDpsWidgetState, data.getAllMatterRef());


