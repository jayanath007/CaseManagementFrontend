import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as screenEdit from './screen-edit';

export interface State {
    screenEdit: screenEdit.State;
}
export const reducers = {
    screenEdit: screenEdit.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsScreenEditCore');
export const getScreenEditRootState = createSelector(getRootState, (state => state.screenEdit));
export const getScreenEditStateByToken = (token) =>
    createSelector(getScreenEditRootState, screenEdit.getStateByToken(token));
export const getScreenEditComponentTreeDataByToken = (token) =>
    createSelector(getScreenEditRootState, screenEdit.getScreenEditComponentTreeDataByToken(token));
export const getIsInitByToken = (token) =>
    createSelector(getScreenEditRootState, screenEdit.getIsInitByToken(token));
export const getScreenEditRuleListData = createSelector(getScreenEditRootState, screenEdit.getScreenEditRuleListDataByToken);
export const getIsSubmitedByToken = (token) =>
    createSelector(getScreenEditRootState, screenEdit.getIsSubmitedByToken(token));
export const getIsLoadingByToken = (token) =>
    createSelector(getScreenEditRootState, screenEdit.getIsLoadingByToken(token));
export const getScreenEditComponentStructure = createSelector(getScreenEditRootState, screenEdit.getScreenEditComponentStructure);
