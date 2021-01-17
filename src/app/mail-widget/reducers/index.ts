import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as data from './mail-widget';

export interface State {
    data: data.State;
}

export const reducers = {
    data: data.reducer,
};

export const getMailWidgetRoot = createFeatureSelector<State>('dpsMailWidget');
export const getMailWidgetState = createSelector(getMailWidgetRoot, (state => state.data));
export const getMailWidgetIsloading = () => createSelector(getMailWidgetState, data.getIsLoading());
export const getMailWidgetData = () => createSelector(getMailWidgetState, data.getData());
export const getMailWidgetgInBoxInfo = () => createSelector(getMailWidgetState, data.getInBoxInfo());

