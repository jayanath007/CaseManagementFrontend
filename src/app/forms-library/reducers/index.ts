import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as FormsLibrary from './forms-library';

export interface State {
    FormsLibrary: FormsLibrary.State;
}
export const reducers = {
    FormsLibrary: FormsLibrary.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsFormsLibrary');
export const getFormsLibraryRootState = createSelector(getRootState, (state) => state.FormsLibrary);

export const getFormsLibraryLoadingByToken = (token) => createSelector(getFormsLibraryRootState,
    FormsLibrary.getFormsLibraryLoadingByToken(token));
export const getFormsLibrarytreeByToken = (token) => createSelector(getFormsLibraryRootState,
    FormsLibrary.getFormsLibrarytreeByToken(token));
export const getFlLoadingByToken = (token) => createSelector(getFormsLibraryRootState,
    FormsLibrary.getFlLoadingByToken(token));
export const getSelectedItemChildListByToken = (token) => createSelector(getFormsLibraryRootState,
    FormsLibrary.getSelectedItemChildListByToken(token));
export const getMatterMatterData = (token) => createSelector(getFormsLibraryRootState,
    FormsLibrary.getMatterMatterData(token));
export const getFlSearchTextByToken = (token) => createSelector(getFormsLibraryRootState,
    FormsLibrary.getFlSearchTextByToken(token));


