import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './te-pie-chart-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getBarChartWidgetRootState = createFeatureSelector<State>('dpsTEPieChartWidget');
export const getBarChartWidgetState = createSelector(getBarChartWidgetRootState, (state => state.data));
export const getTFPieChartWidgetData = () => createSelector(getBarChartWidgetState, data.getData());
export const getTFPieChartWidgetRequestData = () => createSelector(getBarChartWidgetState, data.getRequestModel());
export const getTFPieChartWidgetTitle = () => createSelector(getBarChartWidgetState, data.getChartTitle());

