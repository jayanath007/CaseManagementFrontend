import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './matter-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getSettingRootState = createFeatureSelector<State>('dpsMatterWidget');
export const getDpsSettingState = createSelector(getSettingRootState, (state => state.data));
export const getMatterWidgetIsloading = () => createSelector(getDpsSettingState, data.getIsLoading());
export const getMattersWidgetData = () => createSelector(getDpsSettingState, data.getData());

