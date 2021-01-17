

import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as openCase from './open-case';

export interface State {
    openCase: openCase.State;
}
export const reducers = {
    openCase: openCase.reducer,
};
export const getOpenCaseRootState = createFeatureSelector<State>('dpsOpenCaseCore');
export const getOpenCaseState = createSelector(getOpenCaseRootState, (state) => state.openCase);
export const getOpenCaseValidateInforByToken = (token) => createSelector(getOpenCaseState, openCase.getOpenCaseValidateInforByToken(token));
export const getOpenCaseIsAccess = (token) => createSelector(getOpenCaseState, openCase.getOpenCaseIsAccess(token));
export const getOpenCaseMenuData = (token) => createSelector(getOpenCaseState, openCase.getOpenCaseMenuData(token));
export const getViewByToken = (token) => createSelector(getOpenCaseState, openCase.getViewByToken(token));
export const getOpenCaseHedingText = (token) => createSelector(getOpenCaseState, openCase.getOpenCaseHedingText(token));
export const getOpenCaseSelectedTab = (token) => createSelector(getOpenCaseState, openCase.getOpenCaseSelectedTab(token));
export const getOpenCaseFileHistorySearchText =
    (token) => createSelector(getOpenCaseState, openCase.getOpenCaseFileHistorySearchText(token));
export const getOpenCaseFdDetails = (token) => createSelector(getOpenCaseState, openCase.getOpenCaseFdDetails(token));
export const getOpenCaseShowFDFigures = (token) => createSelector(getOpenCaseState, openCase.getOpenCaseShowFDFigures(token));
export const getOpenCaseShowDeleteEntrySecurityInfoByToken = (token) =>
    createSelector(getOpenCaseState, openCase.getOpenCaseShowDeleteEntrySecurityInfo(token));
export const getOpenCaseRefreshCount =
    (token) => createSelector(getOpenCaseState, openCase.getOpenCaseRefreshCount(token));

export const getOpenCaseSelectedMenuButtonType = (token) =>
    createSelector(getOpenCaseState, openCase.getSelectedMenuButtonType(token));
export const getOpenCasePropertyButtonClick = (token) =>
    createSelector(getOpenCaseState, openCase.getPropertyButtonClick(token));
export const getOpenCaseWFButtonStatus = (token) =>
    createSelector(getOpenCaseState, openCase.getWFButtonStatus(token));
export const getOpenCaseMatterInfoByToken = (token) => createSelector(getOpenCaseState, openCase.getMatterInfoByToken(token));
export const getScreensContactTypeListByToken = (token) =>
    createSelector(getOpenCaseState, openCase.getScreensContactTypeListByToken(token));
export const getMatterShortCutListByToken = (token) =>
    createSelector(getOpenCaseState, openCase.getMatterShortCutList(token));
export const getMatterBannerMsgByToken = (token) =>
    createSelector(getOpenCaseState, openCase.getMatterBannerMsgByToken(token));
export const getIsCloseBannerByToken = (token) =>
    createSelector(getOpenCaseState, openCase.getIsCloseBannerByToken(token));

