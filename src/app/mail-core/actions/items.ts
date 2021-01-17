import { Action } from '@ngrx/store';
import { MailItemRequest, MailItemResponse } from '../models/requests';
import { MessageItemWrapper } from '../../mail-item-core';
import { Message } from '../../core/lib/microsoft-graph';
import { SerchMessageListActions, MessageListActions } from '../models/enums';
import { ItemRequestInfo } from '../reducers/items';



export const LOAD_MAIL_MESSAGE_ITEMS = 'DPS_MAIL_MESSAGE_LOAD_ITEMS';
export const ITEM_SELECT = 'DPS_ITEM_SELECT';
export const VIEW_NEXT_ITEM = 'DPS_VIEW_NEXT_ITEM';
export const VIEW_PREVIOUS_ITEM = 'DPS_VIEW_PREVIOUS_ITEM';
export const CLEAR_VIEWING_ITEM = 'DPS_CLEAR_VIEWING_ITEM';
export const ENSURE_LIST_VIEW_CHANGE = 'DPS_ENSURE_LIST_VIEW_CHANGE';
export const SET_ACTIVE_VIEW = 'DPS_SET_ACTIVE_ITEMS_LIST_VIEW';
export const EXIT_SEARCH = 'DPS_EXIT_SEARCH';
export const SEARCH_LIST_VIEW_CHANGE = 'DPS_SEARCH_LIST_VIEW_CHANGE';
export const NEW_MAIL_ITEMS_RECEIVED = 'DPS_NEW_MAIL_ITEMS_RECEIVED';
export const REPLACE_ITEMS = 'DPS_NEW_REPLACE_ITEM';
export const REMOVE_ITEM_FROM_CACHE = 'DPS_REMOVE_ITEM_FROM_CACHE';
export const NEW_MAIL = 'DPS_NEW_MAIL';
export const VIEW_ITEM = 'DPS_VIEW_ITEM';
export const REFILL_ITEM_SORTAGE = 'DPS_REFILL_ITEM_SORTAGE';
export const CHECK_ITEM = 'DPS_CHECK_ITEM';
export const MAIL_MESSAGE_ITEM_LOAD_SUCCESS = 'DPS_MAIL_MESSAGE_ITEM_LOAD_SUCCESS';
export const MAIL_MESSAGE_ITEM_LOAD_FAIL = 'DPS_MAIL_MESSAGE_ITEM_LOAD_FAIL';
export const SELECT_MESSAGE_ITEMS = 'DPS_SELECT_MESSAGE_ITEMS';
export const REFRESH_VIEW = 'DPS_MAIL_REFRESH_VIEW';
export const CLEAR_ALL_ITEM_CACHE = 'DPS_CLEAR_ALL_ITEM_CACHE';
export const LOAD_ITEMS_WITH_REQUEST_INFO = 'DPS_MAIL_LOAD_ITEMS_WITH_REQUEST_INFO';
export const REMOVE_FOLDER_VIEW = 'DPS_REMOVE_FOLDER_VIEW';


export type ListChanges = { kind: MessageListActions | SerchMessageListActions, value: any }[];

export class LoadMessageItems implements Action {
  readonly type = LOAD_MAIL_MESSAGE_ITEMS;
  constructor(public payload: MailItemRequest, public isSuppressErrors: boolean) { }
}

export class EnsureViewChange implements Action {
  readonly type = ENSURE_LIST_VIEW_CHANGE;
  constructor(public payload: {
    changes: ListChanges,
    viewId: string
  }) { }
}

export class SetActiveView implements Action {
  readonly type = SET_ACTIVE_VIEW;
  constructor(public payload: { viewId: string }) { }
}

export class RefreshView implements Action {
  readonly type = REFRESH_VIEW;
  constructor(public payload: { viewId: string }) { }
}

export class ClearAllItemCache implements Action {
  readonly type = CLEAR_ALL_ITEM_CACHE;
  constructor() { }
}

export class LoadItemsWithRequestInfo implements Action {
  readonly type = LOAD_ITEMS_WITH_REQUEST_INFO;
  constructor(public payload: { viewId: string, reqInfo: ItemRequestInfo, isSuppressErrors?: boolean }) { }
}

// ------------- search mail -------------

export class ExitSearch implements Action {
  readonly type = EXIT_SEARCH;
  constructor(public payload: { folderId: string }) { }
}
export class SearchViewChange implements Action {
  readonly type = SEARCH_LIST_VIEW_CHANGE;
  constructor(public payload: {
    changes: ListChanges,
    folderId: string
  }) { }
}


export class ViewNextItem implements Action {
  readonly type = VIEW_NEXT_ITEM;
  constructor(public payload: { item: MessageItemWrapper, viewId?: string }) { }
}

export class ViewPreviousItem implements Action {
  readonly type = VIEW_PREVIOUS_ITEM;
  constructor(public payload: { item: MessageItemWrapper, viewId?: string }) { }
}

export class ClearViewingItem implements Action {
  readonly type = CLEAR_VIEWING_ITEM;
  constructor(public payload: { item?: MessageItemWrapper }) { }
}

export class ItemSelect implements Action {
  readonly type = ITEM_SELECT;
  constructor(public payload: { item: MessageItemWrapper }) { }
}


export class NewItemsRecived implements Action {
  readonly type = NEW_MAIL_ITEMS_RECEIVED;
  constructor(public payload: { item: Message, wellKnownName: string }) { }
}

export class ReplaceItem implements Action {
  readonly type = REPLACE_ITEMS;
  constructor(public payload: { item: Message, wellKnownName: string, owner: string }) { }
}

export class RemoveItemFromCache implements Action {
  readonly type = REMOVE_ITEM_FROM_CACHE;
  constructor(public payload: { itemId: string }) { }
}

export class RemoveFolderView implements Action {
  readonly type = REMOVE_FOLDER_VIEW;
  constructor(public payload: { viewId: string }) { }
}

export class NewMail implements Action {
  readonly type = NEW_MAIL;
  constructor(public payload: { token: string }) { }
}

// ------------------------------------------------------------------
export class ViewItem implements Action {
  readonly type = VIEW_ITEM;
  constructor(public payload: { item: MessageItemWrapper, viewId: string }) { }
}

export class RefillItemSortage implements Action {
  readonly type = REFILL_ITEM_SORTAGE;
  constructor() { }
}


// ------- check item stuff ---------------
export class CheckItem implements Action {
  readonly type = CHECK_ITEM;
  constructor(public payload: { item: MessageItemWrapper }) { }
}

export class MessageItemsLoadSuccess implements Action {
  readonly type = MAIL_MESSAGE_ITEM_LOAD_SUCCESS;
  constructor(public payload: { request: MailItemRequest, response: MailItemResponse }) { }
}

export class MessageItemsLoadFail implements Action {
  readonly type = MAIL_MESSAGE_ITEM_LOAD_FAIL;
  constructor(public erroe, public payload: MailItemRequest) { }
}


export class SelectMessageItem implements Action {
  readonly type = SELECT_MESSAGE_ITEMS;
  constructor(public payload: { folderId: string }) { }
}

export type Any = LoadMessageItems | ItemSelect | ClearViewingItem | EnsureViewChange
  | SetActiveView | NewItemsRecived | ReplaceItem | RemoveItemFromCache |
  ExitSearch | SearchViewChange | CheckItem | ViewItem | RefillItemSortage |
  MessageItemsLoadSuccess | MessageItemsLoadFail | ClearAllItemCache | RemoveFolderView;

