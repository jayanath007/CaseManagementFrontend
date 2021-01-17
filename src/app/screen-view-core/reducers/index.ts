import { getViews } from '../../file-history-core/reducers/file-history';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as ScreenView from './screen-view';

export interface State {
    ScreenView: ScreenView.State;
}
export const reducers = {
    ScreenView: ScreenView.reducer,
};

export const getScreenViewRootState = createFeatureSelector<State>('dpsScreenView');
export const getScreenViewState = createSelector(getScreenViewRootState, (state) => {
    return state.ScreenView;
});
export const getScreenViewStateByToken = (token) => createSelector(getScreenViewState, ScreenView.getViewByToken(token));
export const getFormViewResponsListDataByToken = (token) => {
    return createSelector(getScreenViewState, ScreenView.getFormViewResponsListDataByToken(token));
};
export const getFormViewResponsDataByIndex = (token, index) => createSelector(getScreenViewState,
    ScreenView.getFormViewResponsDataByIndex(token, index));
export const getScreenViewStatus = (token) => createSelector(getScreenViewState, ScreenView.getScreenViewStatus(token));
export const getMainState = (token) => createSelector(getScreenViewState, ScreenView.getMainState(token));
export const getInitialInfor = (token) => createSelector(getScreenViewState, ScreenView.getinitialInfor(token));
export const getCurentFormViewDataByToken = (token) => createSelector(getScreenViewState, ScreenView.getCurentFormViewDataByToken(token));
export const getLoadForm = (token) => createSelector(getScreenViewState, ScreenView.getFormViewData(token));
export const getCurentFormScreenContanerComponentList = (token) =>
    createSelector(getScreenViewState, ScreenView.getCurentFormScreenContanerComponentList(token));
export const getCurentFormScreenDefinition = (token) => createSelector(getScreenViewState,
    ScreenView.getCurentFormScreenDefinition(token));
export const getMatterDetailsByToken = (token) => createSelector(getScreenViewState, ScreenView.getMatterDetailsByToken(token));
export const getContactSearchContactDirty = (token) => createSelector(getScreenViewState, ScreenView.getContactDirty(token));
// export const getContactSearchRemoveCurrentContact = (token) =>
// createSelector(getScreenViewState, ScreenView.getRemoveCurrentContact(token));
export const getContactSearchScreenControlValuesisDirty = (token) => createSelector(
    getScreenViewState, ScreenView.getScreenControlValuesisDirty(token));
export const getContactSearchEnableSaving = (token) => createSelector(getScreenViewState, ScreenView.getEnableSaving(token));
export const getContactSearchCurrentContactId = (token) => createSelector(getScreenViewState, ScreenView.getCurrentContactId(token));
export const getContactSearchContactsOnFile = (token) => createSelector(getScreenViewState, ScreenView.getContactsOnFile(token));
export const getContactSearchDsiableSearchButtonsStatus = (token) =>
createSelector(getScreenViewState, ScreenView.getDisableSearchButtonsStatus(token));
