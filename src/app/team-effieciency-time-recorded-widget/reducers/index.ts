import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './te-time-recorded-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getBarChartWidgetRootState = createFeatureSelector<State>('dpsTETimeRecordedWidget');
export const getBarChartWidgetState = createSelector(getBarChartWidgetRootState, (state => state.data));
export const getTFTimeRecordedWidgetIsloading = () => createSelector(getBarChartWidgetState, data.getIsLoading());
export const getTFTimeRecordedWidgetData = () => createSelector(getBarChartWidgetState, data.getData());
export const getTFBarChartWidgetRequestData = () => createSelector(getBarChartWidgetState, data.getRequestModel());
export const getTFBarChartWidgetTitle = () => createSelector(getBarChartWidgetState, data.getChartTitle());

