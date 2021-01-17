import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './time-Recorded-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getWorkDoneWidgetRoot = createFeatureSelector<State>('dpsTimeRecordedWidget');
export const getDpsWorkDoneWidgetState = createSelector(getWorkDoneWidgetRoot, (state => state.data));
export const getTimeRecordedWidgetIsloading = () => createSelector(getDpsWorkDoneWidgetState, data.getIsLoading());
export const getTimeRecordedsWidgetData = () => createSelector(getDpsWorkDoneWidgetState, data.getData());
export const getTimeRecordedWidgetFromToDate = () => createSelector(getDpsWorkDoneWidgetState, data.fromToDate());
