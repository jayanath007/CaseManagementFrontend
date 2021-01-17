import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as azure from './azure';


export interface State {
    azureStorage: azure.State;
}

export const reducers = {
    azureStorage: azure.reducer
};

export const selectRootState = createFeatureSelector<State>('azureStorage');
export const selectAzureStatusState = createSelector(selectRootState, (state) => state.azureStorage);
export const getSortedUploadItems = createSelector(selectAzureStatusState, azure.getSortedUploadItems);
export const getUploadingItems = createSelector(selectAzureStatusState, azure.getUploadingItems);

export const getDiaryWebViewTokens = createSelector(selectAzureStatusState, azure.getDiaryWebViewTokens);
export const getDiaryWebViewTokensByIds = (appCode: string, branchId: number, fileId: number) =>
    createSelector(selectAzureStatusState, azure.getDiaryWebViewTokensByIds(appCode, branchId, fileId));
export const getDiaryWebViewTokensByDiaryId = (diaryId: number) =>
    createSelector(selectAzureStatusState, azure.getDiaryWebViewTokensByDiaryId(diaryId));
