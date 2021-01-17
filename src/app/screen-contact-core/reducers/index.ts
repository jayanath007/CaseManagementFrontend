import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as ContactScreen from './screen-contact';
import { ContactSearchType } from '../models/interface';

export interface State {
    ContactScreen: ContactScreen.State;
}
export const reducers = {
    ContactScreen: ContactScreen.reducer,
};

export const getContactScreenRootState = createFeatureSelector<State>('dpsContactScreen');
export const getContactScreenState = createSelector(getContactScreenRootState, (state) => state.ContactScreen);
export const getContactScreenByToken = (token) => createSelector(getContactScreenState, ContactScreen.getViewByToken(token));
export const getIsSearchFieldsLoadedByToken = (token) => createSelector(getContactScreenState,
    ContactScreen.getIsSearchFieldsLoadedByToken(token));
export const  getIsContactListLoadedForCurrentViewByToken =
    (token: string, searchType: ContactSearchType,  searchField: string, searchKeyword: string) =>
     createSelector(getContactScreenState, ContactScreen.getIsContactListLoadedForCurrentViewByToken(
         token, searchType, searchField, searchKeyword));
export const getContactScreenMatterInfoByToken = (token) => createSelector(getContactScreenState,
    ContactScreen.getMatterInfoByToken(token));
export const getContactScreenScreenDefinitionByToken = (token) => createSelector(getContactScreenState,
    ContactScreen.getscreenDefinitionByToken(token));
export const getContactScreenSearchTypeByToken = (token) => createSelector(getContactScreenState,
    ContactScreen.getsearchTypeByToken(token));
export const getContactScreenSearchFieldByToken = (token) => createSelector(getContactScreenState,
    ContactScreen.getsearchFieldByToken(token));
    export const getContactScreenSearchFieldValueByToken = (token) => createSelector(getContactScreenState,
        ContactScreen.getsearchFieldValueByToken(token));
export const getContactScreenVisibleSearchFieldsByToken = (token) => createSelector(getContactScreenState,
    ContactScreen.getVisibleSearchFieldsByToken(token));
export const getContactScreenSearchTextByToken = (token) => createSelector(getContactScreenState,
    ContactScreen.getsearchTextByToken(token));
export const getContactScreenPageEventByToken = (token) =>
    createSelector(getContactScreenState, ContactScreen.getContactScreenPageEventByToken(token));
export const getContactScreenSelectedContactsByToken = (token) =>
    createSelector(getContactScreenState, ContactScreen.getSelectedContactsByToken(token));
export const getContactScreenLinkedMatterCountForSelectedContact = (token) =>
    createSelector(getContactScreenState, ContactScreen.getLinkedMatterCountForSelectedContact(token));
export const getContactScreenDefaultSearchFields = (token) =>
    createSelector(getContactScreenState, ContactScreen.getDefaultSearchFieldsByToken(token));
export const getContactScreenMappedSearchFields = (token) =>
    createSelector(getContactScreenState, ContactScreen.getMappedSearchFieldsByToken(token));

export const getContactListForCurrentViewByToken = (token) =>
    createSelector(getContactScreenState, ContactScreen.getContactListForCurrentViewByToken(token));
export const getContactScreenHashByToken = (token) => createSelector(getContactScreenState, ContactScreen.getCurrentHashByToken(token));
export const contactSearchIsLoading = (token) =>
    createSelector(getContactScreenState, ContactScreen.getIsLoading(token));
export const  contactSearchIsContactsLoading = (token) => createSelector(getContactScreenState,
    ContactScreen.getIsDataLoadingByToken(token));
// export const getContactScreenVisibleColumnDefByToken = (token) =>
// createSelector(getContactScreenState, ContactScreen.getVisibleColumnDefByToken(token))
// export const getIsContactScreenLoadedByToken = (token) =>
//     createSelector(getContactScreenState, ContactScreen.getIsContactListLoadedForCurrentViewByToken(token));
// export const getContactScreenGridByToken = (token) =>
// createSelector(getContactScreenState, ContactScreen.getContactScreenGridDataByToken(token));
// export const getScreenContactSearchTextByToken = (token) =>
// createSelector(getScreenContactState, ScreenContact.getSearchTextByToken(token));

