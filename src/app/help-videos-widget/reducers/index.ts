import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as help from './help-videos-widget';

export interface State {
    data: help.State;
}

export const reducers = {
    data: help.reducer,
};

export const getHelpWidgetRoot = createFeatureSelector<State>('dpsHelpVideosWidget');
export const getDpsHelpWidgetState = createSelector(getHelpWidgetRoot, (state => state.data));
export const getHelpWidgetIsloading = () => createSelector(getDpsHelpWidgetState, help.getIsLoading());
export const getHelpWidgetData = () => createSelector(getDpsHelpWidgetState, help.getData());

