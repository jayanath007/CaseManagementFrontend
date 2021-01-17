import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as Contact from './contact-create';

export interface State {
    Contact: Contact.State;
}
export const reducers = {
    Contact: Contact.reducer,
};

export const getContactRootState = createFeatureSelector<State>('dpsContactCrationCore');
export const getContactState = createSelector(getContactRootState, (state) => state.Contact);
export const getIsLoadingByToken = (token) => createSelector(getContactState, Contact.getIsLoading(token));
export const getSelectedContactByToken = (token) => createSelector(getContactState, Contact.getSelectedContact(token));
export const getContactSearchKeyByToken = (token) => createSelector(getContactState, Contact.getContactSearchKeyByToken(token));
export const getIsShowSearchTabByToken = (token) => createSelector(getContactState, Contact.getIsShowSearchTabByToken(token));
export const getSelectedTabIndexByToken = (token) => createSelector(getContactState, Contact.getSelectedTabIndexByToken(token));
export const getOtherContactColuByToken = (token) => createSelector(getContactState, Contact.getOtherContactColuByToken(token));
export const getModeByToken = (token) => createSelector(getContactState, Contact.getModeByToken(token));
export const getContactTypeByToken = (token) => createSelector(getContactState, Contact.getContactTypeByToken(token));
export const getMatterData = (token) => createSelector(getContactState, Contact.getMatterData(token));
