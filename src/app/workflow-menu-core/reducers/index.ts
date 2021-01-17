import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as workflowMenu from './menu';

export interface State {
    workflowMenu: workflowMenu.State;
}
export const reducers = {
    workflowMenu: workflowMenu.reducer,
};

export const getMenuRootState = createFeatureSelector<State>('dpsWorkflowMenu');
export const getMenuState = createSelector(getMenuRootState, (state) => state.workflowMenu);
export const getActiveToken = createSelector(getMenuState, workflowMenu.getActiveToken);

export const getMenuMatterInfoByToken = (token) => createSelector(getMenuState, workflowMenu.getMatterInfoByToken(token));
export const getMenuTreeViewByToken = (token) => createSelector(getMenuState, workflowMenu.getTreeViewByToken(token));
export const getMenuSelectedChildListByToken = (token) => createSelector(getMenuState, workflowMenu.getSelectedChildListByToken(token));

export const getMenuListByToken = (token) => createSelector(getMenuState, workflowMenu.getMenuListByToken(token));
export const getRightClickMenutByToken = (token) => createSelector(getMenuState, workflowMenu.getRightMenuByToken(token));
export const getMatterSummeryByToken = (token) => createSelector(getMenuState, workflowMenu.getMenuMatterSummeryByToken(token));
export const getShortcutKeysByToken = (token) => createSelector(getMenuState, workflowMenu.getMenuShortcutKeysByToken(token));
export const getIsWorkflowMenuInitByToken = (token) => createSelector(getMenuState, workflowMenu.getIsMenuInitByToken(token));
export const getIsOpenConfrimExitByToken = (token) => createSelector(getMenuState, workflowMenu.getIsOpenConfrimExitByToken(token));
export const getMenuEditIsDirtyByToken = (token) => createSelector(getMenuState, workflowMenu.getIsDirtyByToken(token));
export const getIsRequestToExitMenuEditByToken = (token) => createSelector(getMenuState, workflowMenu.getIsRequestToExitByToken(token));
export const getMenuCutOrCopyItemByToken = (token) => createSelector(getMenuState, workflowMenu.getCutOrCopyItemByToken(token));


export const getMenuOpenFilePathByToken = (token) => createSelector(getMenuState, workflowMenu.getOpenFilePathByToken(token));
export const getMenuFilePathHistoryByToken = (token) => createSelector(getMenuState, workflowMenu.getFilePathHistoryByToken(token));
export const getMenuForwardFilePathByToken = (token) =>
    createSelector(getMenuState, workflowMenu.getForwardFilePathByToken(token));


export const getMenuExportedByToken = (token) => createSelector(getMenuState, workflowMenu.getExportrdDataByToken(token));

export const getMenuExportToServerTriggerByToken = (token) =>
    createSelector(getMenuState, workflowMenu.getExportToServerTriggerByToken(token));

export const getMenuIsLoadingByToken = (token) =>
    createSelector(getMenuState, workflowMenu.getIsLoadingByToken(token));

export const getFlatmenuListByToken = (token) => createSelector(getMenuState, workflowMenu.getmenuListByToken(token));
export const getIsRequestToCancelToken = (token) => createSelector(getMenuState, workflowMenu.getIsRequestToCancelByToken(token));
export const getMenuValidationMessageByToken = (token) => createSelector(getMenuState, workflowMenu.getValidationMessageByToken(token));
export const getMenuIsFileBaseMenuByToken = (token) => createSelector(getMenuState, workflowMenu.getIsFileBaseMenuByToken(token));
export const getMenuCanShowDeleteMsgByToken = (token) => createSelector(getMenuState, workflowMenu.getCanDeleteMsgByToken(token));
export const getWfItemSearchTextByToken = (token) => createSelector(getMenuState, workflowMenu.getWfItemSearchTextByToken(token));
export const getSelectedMenuItemByToken = (token) => createSelector(getMenuState, workflowMenu.getSelectedMenuItemByToken(token));

// export const getInitialSettingsRootState = createFeatureSelector<State>('dpsMenuCore');
// export const getInitialSettingsState = createSelector(getInitialSettingsRootState, (state => state.menu));
// export const getInitialSettingStateByToken = (token) =>
//     createSelector(getInitialSettingsState, menu.getViewByToken(token));

// export const getInitialSettingsTimeZonesByToken = (token) =>
//     createSelector(getInitialSettingsState, menu.getIsLoadingByToken(token));
