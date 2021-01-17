import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './task-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getSettingRootState = createFeatureSelector<State>('dpsTaskWidget');
export const getDpsSettingState = createSelector(getSettingRootState, (state => state.data));
export const getTasksWidgetIsloading = () => createSelector(getDpsSettingState, data.getIsLoading());
export const getTasksWidgetData = () => createSelector(getDpsSettingState, data.getData());

