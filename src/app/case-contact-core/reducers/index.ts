import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as CaseContact from './case-contact';

export interface State {
    CaseContact: CaseContact.State;
}
export const reducers = {
    CaseContact: CaseContact.reducer,
};

export const getCaseContactRootState = createFeatureSelector<State>('dpsCaseContact');
export const getCaseContactState = createSelector(getCaseContactRootState, (state) => state.CaseContact);
export const getCaseContactByToken = (token) => createSelector(getCaseContactState, CaseContact.getViewByToken(token));
export const getCaseContactListByToken = (token) => createSelector(getCaseContactState, CaseContact.getCaseContactListByToken(token));
export const getCaseContactHashByToken = (token) => createSelector(getCaseContactState, CaseContact.getCurrentHashByToken(token));
export const getCaseContactColumnDefByToken = (token) => createSelector(getCaseContactState, CaseContact.getColumnDefByToken(token));
export const getCaseContactGridDataByToken = (token) =>
    createSelector(getCaseContactState, CaseContact.getCaseContactGridDataByToken(token));
export const getCaseContactSearchTextByToken = (token) => createSelector(getCaseContactState, CaseContact.getSearchTextByToken(token));
export const getCaseContactPageEventByToken = (token) =>
    createSelector(getCaseContactState, CaseContact.getCaseContactPageEventByToken(token));
export const  getIsDataLoadedByToken = (token) => createSelector(getCaseContactState, CaseContact.getIsDataLoadedByToken(token));
export const  getScreensContactTypeListByToken = (token) =>
 createSelector(getCaseContactState, CaseContact.getScreensContactTypeListByToken(token));

 export const  getContactModeByToken = (token) =>
 createSelector(getCaseContactState, CaseContact.getContactModeByToken(token));
