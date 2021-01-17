import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as FileHistory from './file-history';

export interface State {
    FileHistory: FileHistory.State;
}
export const reducers = {
    FileHistory: FileHistory.reducer,
};

export const getFileHistoryRootState = createFeatureSelector<State>('dpsFileHistory');
export const getFileHistoryState = createSelector(getFileHistoryRootState, (state) => state.FileHistory);
export const getViewsTokensByAppId = (appId: number) => createSelector(getFileHistoryState, FileHistory.getViewsTokensByAppId(appId));
export const getFileHistoryByToken = (token) => createSelector(getFileHistoryState, FileHistory.getViewByToken(token));
export const getFileHistoryListByToken = (token) => createSelector(getFileHistoryState, FileHistory.getFileHistoryListByToken(token));
export const getFileHistoryHashByToken = (token) => createSelector(getFileHistoryState, FileHistory.getCurrentHashByToken(token));
export const getFileHistoryColumnDefByToken = (token) => createSelector(getFileHistoryState, FileHistory.getColumnDefByToken(token));
export const getFileHistoryGridDataByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getFileHistoryGridDataByToken(token));
export const getDocumentViewOpenedByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getDocumentViewOpenedByToken(token));
export const getDocumentViewPopupOpenedByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getDocumentViewPopupOpenedByToken(token));

export const getFileHistorySearchTextByToken = (token) => createSelector(getFileHistoryState, FileHistory.getSearchTextByToken(token));
export const getFileHistoryPageEventByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getFileHistoryPageEventByToken(token));
export const getIsDataLoadedByToken = (token) => createSelector(getFileHistoryState, FileHistory.getIsDataLoadedByToken(token));
export const getIsDocPasswordByToken = (token) => createSelector(getFileHistoryState, FileHistory.getIsDocPasswordByToken(token));
export const getUserPasswordForDoc = (token) => createSelector(getFileHistoryState, FileHistory.getUserPasswordForDoc(token));

export const getSelectedAttachmentsByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getSelectedAttachmentsByToken(token));

export const getSignandSendIsLoadingByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getSignandSendIsLoadingByToken(token));
export const getSignTokenByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getSignToken(token));

export const getXdraftViewSuccessByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getXdraftViewSuccessByToken(token));

export const getFileHistoryGroupDataByRow = (token, groupIds) =>
    createSelector(getFileHistoryState, FileHistory.getFileHistoryGroupDataByRow(token, groupIds));

export const getGroupModeByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getGroupModeByToken(token));

export const getFolderListByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getFolderListByToken(token));

export const getCurrentHashByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getCurrentHashByToken(token));
export const getIsSearchFullTextByToken = (token) =>
    createSelector(getFileHistoryState, FileHistory.getIsSearchFullTextByToken(token));

