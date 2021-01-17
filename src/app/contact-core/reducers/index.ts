import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as Contact from './contact-core';

export interface State {
    Contact: Contact.State;
}
export const reducers = {
    Contact: Contact.reducer,
};

export const getContactRootState = createFeatureSelector<State>('dpsContact');
export const getContactState = createSelector(getContactRootState, (state) => state.Contact);
export const getContactByToken = (token) => createSelector(getContactState, Contact.getViewByToken(token));
export const getContactListByToken = (token) => createSelector(getContactState, Contact.getContactListByToken(token));
export const getContactHashByToken = (token) => createSelector(getContactState, Contact.getCurrentHashByToken(token));
export const getContactGridDataByToken = (token) =>
    createSelector(getContactState, Contact.getContactGridDataByToken(token));
export const getContactSearchTextByToken = (token) => createSelector(getContactState, Contact.getSearchTextByToken(token));
export const getContactPageEventByToken = (token) =>
    createSelector(getContactState, Contact.getContactPageEventByToken(token));
export const  getIsDataLoadedByToken = (token) => createSelector(getContactState, Contact.getIsDataLoadedByToken(token));
