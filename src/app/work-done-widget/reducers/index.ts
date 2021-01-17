import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './work-done-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getWorkDoneWidgetRoot = createFeatureSelector<State>('dpsWorkDoneWidget');
export const getDpsWorkDoneWidgetState = createSelector(getWorkDoneWidgetRoot, (state => state.data));
export const getWorkDoneWidgetIsloading = () => createSelector(getDpsWorkDoneWidgetState, data.getIsLoading());
export const getWorkDonesWidgetData = () => createSelector(getDpsWorkDoneWidgetState, data.getData());
export const getWorkDoneWidgetFromToDate = () => createSelector(getDpsWorkDoneWidgetState, data.fromToDate());
