
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as menu from './folder-menu';

export interface State {
    menu: menu.State;
}

export const reducers = {
  menu: menu.reducer
};

export const getRootState = createFeatureSelector<State>('dpsMailDesktop');
export const getMenuState = createSelector(getRootState, (state) => state.menu);
export const getMenuMode = createSelector(getMenuState, menu.getMenuMode);
export const getVisibleOutlet = createSelector(getMenuState, menu.getVisibleOutlet);
