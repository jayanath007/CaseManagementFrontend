import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as folders from './folders';
import * as items from './items';
import * as groups from './groups';
import { MessageItemWrapper } from '../../mail-item-core/models/interface';


export interface State {
  folder: folders.State;
  item: items.State;
  group: groups.State;
}

export const reducers = {
  folder: folders.reducer,
  item: items.reducer,
  group: groups.reducer
};

export const getMailRootState = createFeatureSelector<State>('dpsMailsCore');

// folder related stuff
export const getFolderState = createSelector(getMailRootState, (state) => state.folder);
export const getFolderList = createSelector(getFolderState, folders.getFolders);
export const getIsFolderLoading = createSelector(getFolderState, folders.getIsLoading);
export const getIsFolderLoaded = createSelector(getFolderState, folders.getIsFolderLoaded);
export const getIsFolderInit = createSelector(getFolderState, folders.getIsInit);
export const getSortedFolderList = createSelector(getFolderState, folders.getSortedFolderList);
export const getSortedWelknownFolderList = createSelector(getFolderState, folders.getSortedWelknownFolderList);
export const getSelectedFolderId = createSelector(getFolderState, folders.getSelectedFolderId);
export const getInbox = createSelector(getFolderState, folders.getInbox);
export const getDeletedItemsFolder = createSelector(getFolderState, folders.getDeletedItemsFolder);
export const findFolder = (folderId) => createSelector(getFolderState, folders.findFolder(folderId));
export const getSelectedFolder = createSelector(getFolderState, folders.getSelectedFolder);
export const getMailBoxes = createSelector(getFolderState, folders.getMailBoxes);
export const getFolderPermissions = createSelector(getFolderState, folders.getFolderPermissions);

// item related stuff
export const getItemState = createSelector(getMailRootState, (state) => state.item);
export const getMessageViews = createSelector(getItemState, items.getMessageViews);
export const getMessageViewByViewId = (viewId) => createSelector(getItemState, items.getMessageViewByViewId(viewId));
export const getSortedItemsByViewId = (viewId) => createSelector(getItemState, items.getSortedItemsByViewId(viewId));
export const getSelectedItemsByViewId = (viewId) => createSelector(getItemState, items.getSelectedItemsByViewId(viewId));

export const getItemToViewByViewId = (viewId) => createSelector(getItemState, items.getItemToViewByViewId(viewId));

export const isVertualScrolling = createSelector(getItemState, items.isVertualScrolling);

export const isItemInActiveView = (viewId, itemId) => createSelector(getItemState, items.isItemInActiveView(viewId, itemId));

export const getActiveViewId = createSelector(getItemState, items.getActiveViewId);

export const findNextItem = (baseItem: MessageItemWrapper, viewId: string) =>
  createSelector(getItemState, items.findNextItem(baseItem, viewId));

export const findPreviousItem = (baseItem: MessageItemWrapper, viewId: string) =>
  createSelector(getItemState, items.findPreviousItem(baseItem, viewId));

export const getItemLoadingByViewId = (viewId) => createSelector(getItemState, items.getItemLoadingByViewId(viewId));
export const getHasMessageItemLoadedByViewId = (viewId) =>
  createSelector(getItemState, items.getHasMessageItemLoadedByViewId(viewId));

export const getItemRequestInfoByViewId = (viewId: string) => createSelector(getItemState, items.getRequestInfoByViewId(viewId));
export const getItemAllRequestInfoForActiveViewCacheByViewId =
  (viewId: string) => createSelector(getItemState, items.getAllRequestInfoForActiveViewCacheByViewId(viewId));

export const getIsInSearchModeByViewId = (viewId) =>
  createSelector(getItemState, items.getIsInSearchModeByViewId(viewId));

export const getViewingItemByViewId = (viewId) => createSelector(getItemState, items.getViewingItemByViewId(viewId));
export const getItemViewIdByFolderId = (folderId) => createSelector(getItemState, items.getViewIdByFolderId(folderId));
export const getItemListViewOptionsByViewId = (viewId) => createSelector(getItemState, items.getListViewOptionsByViewId(viewId));
export const getAllItemSortageRequests = createSelector(getItemState, items.getAllItemSortageRequests);

export const findItemById = (itemId: string, viewId: string) => createSelector(getItemState, items.findItemById(itemId, viewId));

export const getNextPageItemRequestByViewId = (viewId) => createSelector(getItemState, items.getNextPageItemRequestByViewId(viewId));
export const getAutoReadItemId = createSelector(getItemState, items.getAutoReadItemId);

//// group related stuff

export const getGroupState = createSelector(getMailRootState, (state) => state.group);
export const getGroups = createSelector(getGroupState, groups.getGroups);
export const getGroupsByOrder = createSelector(getGroupState, groups.getGroupsByOrder);
export const getConversations = createSelector(getGroupState, groups.getConversations);
export const getConversationsByOrder = createSelector(getGroupState, groups.getConversationsByOrder);
export const getIsExpanded = createSelector(getGroupState, groups.getIsExpanded);
export const getIsGroupMode = createSelector(getGroupState, groups.getIsGroupMode);
export const getSelectedGroupId = createSelector(getGroupState, groups.getSelectedGroupId);
export const getSelectedGroup = createSelector(getGroupState, groups.getSelectedGroup);
export const getIsConversationsLoading = createSelector(getGroupState, groups.getIsConversationsLoading);
export const getSelectedConversationId = createSelector(getGroupState, groups.getSelectedConversationId);
export const getSelectedConversation = createSelector(getGroupState, groups.getSelectedConversation);
export const getAddEditGroup = createSelector(getGroupState, groups.getAddEditGroup);
export const getIsGroupSaving = createSelector(getGroupState, groups.getIsGroupSaving);
export const getIsGroupSaved = createSelector(getGroupState, groups.getIsGroupSaved);
