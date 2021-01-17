import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as workflowMenuPopup from './menu-popup';

export interface State {
    workflowMenu: workflowMenuPopup.State;
}
export const reducers = {
    workflowMenu: workflowMenuPopup.reducer,
};

export const getMenuRootState = createFeatureSelector<State>('dpsWorkflowMenuPopup');
export const getMenuState = createSelector(getMenuRootState, (state) => state.workflowMenu);

export const getMenuMatterInfoByToken = (token) => createSelector(getMenuState, workflowMenuPopup.getMatterInfoByToken(token));
export const getPopupMenuTreeViewByToken = (token) => createSelector(getMenuState, workflowMenuPopup.getTreeViewByToken(token));
export const getPopupMenuIsLoadingByToken = (token) => createSelector(getMenuState, workflowMenuPopup.getisLoadingByToken(token));



