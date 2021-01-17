import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as Drive from './drive';

export interface State {
    drive: Drive.State;
}
export const reducers = {
    drive: Drive.reducer
};

export const getDriveRootState = createFeatureSelector<State>('dpsDriveCore');
export const getDriveState = createSelector(getDriveRootState, (state => state.drive));
export const getActiveView = (token) => createSelector(getDriveState, Drive.getActiveView(token));
export const getStikeyFolders = (token) => createSelector(getDriveState, Drive.getStikeyFolders(token));
export const hasClipboardItems = (token) => createSelector(getDriveState, Drive.hasClipboardItems(token));
export const getItemClipboard = (token) => createSelector(getDriveState, Drive.getItemClipboard(token));
export const getSearchText = (token) => createSelector(getDriveState, Drive.getSearchText(token));

export const getItemViewByViewPath = (viewPath, token) => {
    return createSelector(getDriveState, Drive.getItemViewByViewPath(viewPath, token));
};

export const getNextRequestInfoByViewPath = (viewPath, token) => {
    return createSelector(getDriveState, Drive.getNextRequestInfoByViewPath(viewPath, token));
};

export const getViewPathToNavigation = (viewPath, token) => {
    return createSelector(getDriveState, Drive.getViewPathToNavigation(viewPath, token));
};

export const isItemLoaded = (viewPath, token) => {
    return createSelector(getDriveState, Drive.isItemLoaded(viewPath, token));
};

export const getItemsListByViewPath = (viewPath, token) => {
    return createSelector(getDriveState, Drive.getItemsListByViewPath(viewPath, token));
};

export const getViewLoadingByViewPath = (viewPath, token) => {
    return createSelector(getDriveState, Drive.getViewLoadingByViewPath(viewPath, token));
};

export const getHasMoreItems = (viewPath, token) => {
    return createSelector(getDriveState, Drive.getHasMoreItems(viewPath, token));
};
export const getActiveDrive = (token) => createSelector(getDriveState, Drive.getActiveDrive(token));
export const getRootLoading = (token) => createSelector(getDriveState, Drive.getRootLoading(token));

export const getCopyingItems = (token) => createSelector(getDriveState, Drive.getCopyingItems(token));
export const getIsCopying = (token) => createSelector(getDriveState, Drive.getIsCopying(token));
export const getSortOrderByViewPath = (viewPath, token) => {
    return createSelector(getDriveState, Drive.getSortOrderByViewPath(viewPath, token));
};
export const getUploadingItems = (token) => createSelector(getDriveState, Drive.getUploadingItems(token));

