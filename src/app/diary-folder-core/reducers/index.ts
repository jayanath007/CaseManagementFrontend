import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as DiaryFolder from './diary-folder';

export interface State {
    DiaryFolder: DiaryFolder.State;
}
export const reducers = {
    DiaryFolder: DiaryFolder.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsDiaryFolderCore');
export const getState = createSelector(getRootState, (state) => state.DiaryFolder);
export const getIsLoadingByToken = (token) => createSelector(getState, DiaryFolder.getIsLoading(token));
export const getFoldersByToken = (token) => createSelector(getState, DiaryFolder.getFolders(token));
export const getIsSavingByToken = (token) => createSelector(getState, DiaryFolder.getIsSaving(token));
export const getIsSavedByToken = (token) => createSelector(getState, DiaryFolder.getIsSaved(token));
export const getfolderDataSourceToken = (token) => createSelector(getState, DiaryFolder.getfolderDataSource(token));
export const getfolderFlatData = (token) => createSelector(getState, DiaryFolder.getfolderFlatData(token));
export const getappIdData = (token) => createSelector(getState, DiaryFolder.getappIdData(token));
export const getIsDurty = (token) => createSelector(getState, DiaryFolder.getIsDurty(token));

