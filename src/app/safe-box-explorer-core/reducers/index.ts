import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as safeBox from './safe-box';
import * as blobExplorer from './blob-explorer';
import * as templateDirectory from './template-directory';

export interface State {
    blobExplorer: blobExplorer.State;
    templateDirectory: templateDirectory.State;
    safeBox: safeBox.State;
}
export const reducers = {
    blobExplorer: blobExplorer.reducer,
    templateDirectory: templateDirectory.reducer,
    safeBox: safeBox.reducer
};

export const getSafeBoxRootState = createFeatureSelector<State>('dpsBlobExplorerCore');

export const getSafeBoxState = createSelector(getSafeBoxRootState, (state => state.safeBox));

export const getSelectedSafeBoxtype = createSelector(getSafeBoxState, safeBox.getSelectedSafeBoxtype);

export const getCopyFrom = createSelector(getSafeBoxState, safeBox.getCopyFrom);
// --------------------------Blob Explorer------------------------------

export const getBlobExplorerState = createSelector(getSafeBoxRootState, (state => state.blobExplorer));
export const getSafeBoxExplorerStateByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getViewByToken(token));
export const getTreeDataByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getTreeDataByToken(token));

export const getLoadingByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getLoadingByToken(token));

export const getSelectedTreeNodeItemByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getSelectedTreeNodeItemByToken(token));

export const getSelectedBlobByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getSelectedBlobByToken(token));

export const getSelectedViewTypebByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getSelectedViewTypebByToken(token));

export const getAllBackPathByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getAllBackPathByToken(token));
export const getAllNextPathByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getAllNextPathByToken(token));
export const getCopyItemsByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getCopyItemsByToken(token));
export const getSelectedFolderByToken = (token) =>
    createSelector(getBlobExplorerState, blobExplorer.getSelectedFolderByToken(token));


// --------------------------TemplateDirectory------------------------------

export const getTemplateDirectoryState = createSelector(getSafeBoxRootState, (state => state.templateDirectory));

export const getIsLoading = createSelector(getTemplateDirectoryState, templateDirectory.getIsLoading);

export const getAppList = createSelector(getTemplateDirectoryState, templateDirectory.getAppList);

export const getSelectedApp = createSelector(getTemplateDirectoryState, templateDirectory.getSelectedApp);

export const getIsAppListExpand = createSelector(getTemplateDirectoryState, templateDirectory.getIsAppListExpand);

export const getAppViewByAppId = (id) => createSelector(getTemplateDirectoryState, templateDirectory.getAppViewByAppId(id));

export const getSelectedAppView = createSelector(getTemplateDirectoryState, templateDirectory.getSelectedAppView);

export const getSort = createSelector(getTemplateDirectoryState, templateDirectory.getSort);

export const getFilter = createSelector(getTemplateDirectoryState, templateDirectory.getFilter);

export const getSearchText = createSelector(getTemplateDirectoryState, templateDirectory.getSearchText);

export const getShowCommonTemplates = createSelector(getTemplateDirectoryState, templateDirectory.getShowCommonTemplates);

export const getTemplateClipboard = createSelector(getTemplateDirectoryState, templateDirectory.getTemplateClipboard);
