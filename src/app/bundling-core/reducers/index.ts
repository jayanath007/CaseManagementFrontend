import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as bundling from './bundling';
import * as profile from './profile';
import * as option from './option';

export interface State {
    bundling: bundling.State;
    profile: profile.State;
    option: option.State;
}
export const reducers = {
    bundling: bundling.reducer,
    profile: profile.reducer,
    option: option.reducer
};

export const getBundlingRootState = createFeatureSelector<State>('dpsBundling');

export const getBundlingState = createSelector(getBundlingRootState, (state => state.bundling));
export const getProfileState = createSelector(getBundlingRootState, (state => state.profile));
export const getOptionState = createSelector(getBundlingRootState, (state => state.option));
export const getLoadingByToken = (token) =>
    createSelector(getBundlingState, bundling.getLoadingByToken(token));
// profile
export const getBundlingItemList = (token) => createSelector(getProfileState, profile.getBundlingItemList(token));
export const getBundlingItemSaveDataList = (token, timeOffset) =>
    createSelector(getProfileState, profile.getBundlingItemSaveDataList(token, timeOffset));
export const getPreservePaginationValidation = (token) => createSelector(getProfileState, profile.getPreservePaginationValidation(token));
export const isTreeDirtyByToken = (token) =>
    createSelector(getProfileState, profile.isTreeDirtyByToken(token));
export const getSelectedBundlingItem = (token) => createSelector(getProfileState, profile.getSelectedBundlingItem(token));
export const getBundlingCoverPageId = (token) => createSelector(getProfileState, profile.getBundlingCoverPageId(token));
export const getBundleNameTextByToken = (token) => createSelector(getProfileState, profile.getBundleNameTextByToken(token));
export const getBundlingAllItemList = (token) => createSelector(getProfileState, profile.getBundlingAllItemList(token));

export const getBundlingStateByToken = (token) => createSelector(getBundlingState, bundling.getStateByToken(token));
export const getFileHistoryHashByToken = (token) => createSelector(getBundlingState, bundling.getCurrentHashByToken(token));
export const getColumnDefByToken = (token) =>
    createSelector(getBundlingState, bundling.getColumnDefByToken(token));
export const getBundlingComponentTreeDataByToken = (token) =>
    createSelector(getBundlingState, bundling.getBundlingComponentTreeDataByToken(token));
export const getBundlingFolderGroupDataByToken = (token) =>
    createSelector(getBundlingState, bundling.getBundlingFolderGroupDataByToken(token));
export const getGroupDataByToken = (token) =>
    createSelector(getBundlingState, bundling.getGroupDataByToken(token));
export const getBundlingSelectedInfoByToken = (token) =>
    createSelector(getBundlingState, bundling.getBundlingSelectedInfoByToken(token));
export const getBundlingGridGroupDataByToken = (token) =>
    createSelector(getBundlingState, bundling.getBundlingGridGroupDataByToken(token));
export const getBundlingGridDataByToken = (token) =>
    createSelector(getBundlingState, bundling.getGridDataByToken(token));
export const getGridExpandedRowByToken = (token) =>
    createSelector(getBundlingState, bundling.getGridExpandedRowByToken(token));
export const getselectedGroupHashByToken = (token) =>
    createSelector(getBundlingState, bundling.getselectedGroupHashByToken(token));
export const getselectedGroupByToken = (token) =>
    createSelector(getBundlingState, bundling.getselectedGroupByToken(token));
export const getSelectedItemsByToken = (token) =>
    createSelector(getBundlingState, bundling.getSelectedItemsByToken(token));
export const getDocumentViewByToken = (token) =>
    createSelector(getBundlingState, bundling.getDocumentViewByToken(token));
export const getMatterInfoByToken = (token) =>
    createSelector(getBundlingState, bundling.getMatterInfoByToken(token));
export const getSearchTextByToken = (token) =>
    createSelector(getBundlingState, bundling.getSearchTextByToken(token));
export const getValidationIsInProgras = (token) =>
    createSelector(getBundlingState, bundling.getValidationIsInProgras(token));
export const getUploadIsInProgras = (token) =>
    createSelector(getBundlingState, bundling.getUploadIsInProgras(token));
export const getValidationMessage = (token) =>
    createSelector(getBundlingState, bundling.getValidationMessage(token));
export const getbundleIdByToken = (token) =>
    createSelector(getBundlingState, bundling.getbundleIdByToken(token));
export const getFromToDateObjectByToken = (token) =>
    createSelector(getBundlingState, bundling.getFromToDateObjectByToken(token));
export const getPreserveExistingPagination = (token) =>
    createSelector(getBundlingState, bundling.getPreserveExistingPagination(token));
export const getPDFBundleHeaderViewModel = (token) =>
    createSelector(getBundlingState, bundling.getPDFBundleHeaderViewModel(token));
export const getCoreBundleHeaderData = (token) =>
    createSelector(getBundlingState, bundling.getCoreBundleHeaderData(token));
// option
export const getOptionIsLoading = (token) =>
    createSelector(getOptionState, option.getOptionLoadingByToken(token));
export const getBundlePageNoLocationByToken = (token) =>
    createSelector(getOptionState, option.getBundlePageNoLocationByToken(token));
export const getBundleOptionsByToken = (token) =>
    createSelector(getOptionState, option.getBundleOptionsByToken(token));
