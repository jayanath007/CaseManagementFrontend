import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './calendar-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getSettingRootState = createFeatureSelector<State>('dpsCalendarWidget');
export const getDpsSettingState = createSelector(getSettingRootState, (state => state.data));
export const getMailWidgetIsloading = () => createSelector(getDpsSettingState, data.getIsLoading());
export const getMailWidgetData = () => createSelector(getDpsSettingState, data.getData());

