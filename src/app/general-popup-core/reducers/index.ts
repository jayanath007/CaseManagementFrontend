import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as generalPopup from './general-Popup';


export interface State {
  generalPopup: generalPopup.State;
}

export const reducers = {
  generalPopup: generalPopup.reducer,
};

export const getGeneralPopupRootState = createFeatureSelector<State>('dpsGeneralPopupCore');


export const getGeneralPopupState = createSelector(getGeneralPopupRootState, (state) => state.generalPopup);
export const getClientSearchViewByToken = (token) => createSelector(getGeneralPopupState, generalPopup.getViewByToken(token));
export const getGeneralDataListByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getGeneralDataListByToken(token));
export const getIsLoadingByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getIsLoading(token));
export const getclientPaginatorDefByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getclientPaginatorDefByToken(token));
export const getGeneralColumnDefByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getGeneralColumnDefByToken(token));
export const getGeneralSearchTextByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getGeneralSearchTextByToken(token));
export const getGeneralTotalItemCounntByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getGeneralTotalItemCounntByToken(token));
export const getGeneralSitePathByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getGeneralSitePathByToken(token));
export const getIsFrontEndFilterByToken = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getIsFrontEndFilterByToken(token));
export const getInputRequest = (token) =>
  createSelector(getGeneralPopupState, generalPopup.getInputRequest(token));
