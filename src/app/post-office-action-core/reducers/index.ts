import * as PostOfficeAction from './post-office-action';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    PostOfficeAction: PostOfficeAction.State;
}
export const reducers = {
    PostOfficeAction: PostOfficeAction.reducer,
};

export const getPostOfficeActionRootState = createFeatureSelector<State>('dpsPostOfficeActionCore');
export const getPostOfficeActionState = createSelector(getPostOfficeActionRootState, (state => state.PostOfficeAction));
export const getFeeEarnerList = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getFeeEarnerList(token));
export const getModelByToken = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getModelByToken(token));
export const getGroupList = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getGroupsList(token));
export const getSaveModelByToken = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getSaveModelByToken(token));
export const getIsLoadingByToken = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getIsLoadingByToken(token));
export const getDiaryFoldesList = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getDiaryFoldesList(token));
export const getItemTypeList = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getItemTypeList(token));
export const getActionList = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getActionList(token));
export const getEnabaleControlers = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getEnabaleControlers(token));


export const getInputDataByToken = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getInputDataByToken(token));

export const getIsClose = (token) =>
    createSelector(getPostOfficeActionState, PostOfficeAction.getIsClose(token));



