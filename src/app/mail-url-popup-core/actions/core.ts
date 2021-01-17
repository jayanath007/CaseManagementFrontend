import { Action } from '@ngrx/store';
import { MessageItemWrapper, ReplyForwardType } from '../../mail-item-core';
import { FollowupFlag, Message, Attachment, ItemAttachment, FileAttachment } from '../../core/lib/microsoft-graph';
import { TokenizeAction } from '../../core';


// export const URL_POPUP_MAIL_ITEM_INIT = 'URL_POPUP_MAIL_ITEM_INIT';


export const URL_POPUP_READ_UNREAD_ITEMS = 'URL_POPUP_READ_UNREAD_ITEMS';
export const URL_POPUP_FLAG_ITEMS = 'URL_POPUP_FLAG_ITEMS';
export const URL_POPUP_MEETING_RESPONSE_ITEM = 'URL_POPUP_MEETING_RESPONSE_ITEM';
export const URL_POPUP_REMOVE_FROM_CALENDAR = 'URL_POPUP_REMOVE_FROM_CALENDAR';
export const URL_POPUP_DOWNLOAD_ATTACHMENT = 'URL_POPUP_DOWNLOAD_ATTACHMENT';
export const URL_POPUP_DELETE_ITEMS = 'URL_POPUP_DELETE_ITEMS';
export const URL_POPUP_DELETE_ITEM_SUCCESS = 'URL_POPUP_DELETE_ITEM_SUCCESS';
export const URL_POPUP_DELETE_ITEM_FAIL = 'URL_POPUP_DELETE_ITEM_FAIL';


export const URL_POPUP_CREATE_REPLY_FORWARD = 'URL_POPUP_CREATE_REPLY_FORWARD';
export const URL_POPUP_CREATE_REPLY_FORWARD_FAIL = 'URL_POPUP_CREATE_REPLY_FORWARD_FAIL';
export const URL_POPUP_CREATE_REPLY_FORWARD_SUCCESS = 'URL_POPUP_CREATE_REPLY_FORWARD_SUCCESS';
export const URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT = 'URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT';
export const URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT_SUCCESS = 'URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT_SUCCESS';
export const URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT_FAIL = 'URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT_FAIL';

export const URL_POPUP_FLAG_ITEM_SUCCESS = 'URL_POPUP_FLAG_ITEM_SUCCESS';
export const URL_POPUP_FLAG_ITEM_FAIL = 'URL_POPUP_FLAG_ITEM_FAIL';
export const URL_POPUP_MEETING_RESPONSE_ITEM_SUCCESS = 'URL_POPUP_MEETING_RESPONSE_ITEM_SUCCESS';
export const URL_POPUP_MEETING_RESPONSE_ITEM_FAIL = 'URL_POPUP_MEETING_RESPONSE_ITEM_FAIL';
export const URL_POPUP_DOWNLOAD_ATTACHMENT_SUCCESS = 'URL_POPUP_DOWNLOAD_ATTACHMENT_SUCCESS';
export const URL_POPUP_DOWNLOAD_ATTACHMENT_FAIL = 'URL_POPUP_DOWNLOAD_ATTACHMENT_FAIL';
export const URL_POPUP_READ_UNREAD_ITEM_SUCCESS = 'URL_POPUP_READ_UNREAD_ITEM_SUCCESS';
export const URL_POPUP_READ_UNREAD_ITEM_FAIL = 'URL_POPUP_READ_UNREAD_ITEM_FAIL';


export const URL_POPUP_MAIL_ITEM_INIT = 'URL_POPUP_MAIL_ITEM_INIT';

export const URL_POPUP_MAIL_ITEM_LOAD = 'URL_POPUP_MAIL_ITEM_LOAD';
export const URL_POPUP_MAIL_ITEM_LOAD_SUCCESS = 'URL_POPUP_MAIL_ITEM_LOAD_SUCCESS';
export const URL_POPUP_MAIL_ITEM_LOAD_FAIL = 'URL_POPUP_MAIL_ITEM_LOAD_FAIL';

export const URL_POPUP_ITEM_ATTACHMENT_LOAD = 'URL_POPUP_ITEM_ATTACHMENT_LOAD';
export const URL_POPUP_ITEM_ATTACHMENT_LOAD_SUCCESS = 'URL_POPUP_ITEM_ATTACHMENT_LOAD_SUCCESS';
export const URL_POPUP_ITEM_ATTACHMENT_LOAD_FAIL = 'URL_POPUP_ITEM_ATTACHMENT_LOAD_FAIL';

export const URL_POPUP_MOVE_ITEMS = 'URL_POPUP_MOVE_ITEMS';
export const URL_POPUP_MOVE_ITEM_SUCCESS = 'URL_POPUP_MOVE_ITEM_SUCCESS';
export const URL_POPUP_MOVE_ITEM_FAIL = 'URL_POPUP_MOVE_ITEM_FAIL';



export const URL_POPUP_GET_MAIL_FOLDER_ITEM = 'URL_POPUP_MOVE_ITEMS';
export const URL_POPUP_GET_MAIL_FOLDER_ITEM_SUCCESS = 'URL_POPUP_MOVE_ITEM_SUCCESS';
export const URL_POPUP_GET_MAIL_FOLDER_ITEM_FAIL = 'URL_POPUP_MOVE_ITEM_FAIL';



export class UrlPopupMailItemInit extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MAIL_ITEM_INIT;
  constructor(public token: string) { super(token); }
}

export class UrlPopupMailItemLoad extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MAIL_ITEM_LOAD;
  constructor(public token: string, public payload: { owner: string, itemId: string }) { super(token); }
}



export class UrlPopupMailItemLoadSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MAIL_ITEM_LOAD_SUCCESS;
  constructor(public token: string, public payload: { owner: string, newItem: Message }) { super(token); }
}

export class UrlPopupMailItemLoadFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MAIL_ITEM_LOAD_FAIL;
  constructor(public token: string, public payload: { error: string }) { super(token); }
}


export class UrlPopupItemAttachmentLoad extends TokenizeAction implements Action {
  readonly type = URL_POPUP_ITEM_ATTACHMENT_LOAD;
  constructor(public token: string, public payload: { owner: string, itemId: string, attachmentId: string }) { super(token); }
}

export class UrlPopupItemAttachmentLoadSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_ITEM_ATTACHMENT_LOAD_SUCCESS;
  constructor(public token: string, public payload: { owner: string, newItem: Message, itemId: string }) { super(token); }
}

export class UrlPopupItemAttachmentLoadFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_ITEM_ATTACHMENT_LOAD_FAIL;
  constructor(public token: string, public payload: { error: string }) { super(token); }
}


export class UrlPopupReadUnreadItems extends TokenizeAction implements Action {
  readonly type = URL_POPUP_READ_UNREAD_ITEMS;
  constructor(public token: string, public payload: { items: MessageItemWrapper[], isRead: boolean }) { super(token); }
}

export class UrlPopupReadUnreadItemSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_READ_UNREAD_ITEM_SUCCESS;
  constructor(public token: string, public payload: { item: MessageItemWrapper }) { super(token); }
}

export class UrlPopupReadUnreadItemFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_READ_UNREAD_ITEM_FAIL;
  constructor(public token: string, public payload: { error: string, item: MessageItemWrapper }) { super(token); }
}


export class UrlPopupFlagItems extends TokenizeAction implements Action {
  readonly type = URL_POPUP_FLAG_ITEMS;
  constructor(public token: string, public payload: { items: MessageItemWrapper[], flag: FollowupFlag }) { super(token); }
}

export class UrlPopupFlagItemSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_FLAG_ITEM_SUCCESS;
  constructor(public token: string, public payload: { item: MessageItemWrapper }) { super(token); }
}

export class UrlPopupFlagItemFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_FLAG_ITEM_FAIL;
  constructor(public token: string, public payload: { error: string, item: MessageItemWrapper }) { super(token); }
}


export class UrlPopupMeetingResponse extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MEETING_RESPONSE_ITEM;
  constructor(public token: string, public payload: {
    item: MessageItemWrapper,
    comment: string, sendResponse: boolean, type: string
  }) { super(token); }
}

export class UrlPopupRemoveFromCalendar extends TokenizeAction implements Action {
  readonly type = URL_POPUP_REMOVE_FROM_CALENDAR;
  constructor(public token: string, public payload: { item: MessageItemWrapper, eventId: string }) { super(token); }
}
export class UrlPopupMeetingResponseSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MEETING_RESPONSE_ITEM_SUCCESS;
  constructor(public token: string, public payload: { item: MessageItemWrapper }) { super(token); }
}

export class UrlPopupMeetingResponseFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MEETING_RESPONSE_ITEM_FAIL;
  constructor(public token: string, public payload: { error: string, item: MessageItemWrapper }) { super(token); }
}

export class UrlPopupDownloadAttachment extends TokenizeAction implements Action {
  readonly type = URL_POPUP_DOWNLOAD_ATTACHMENT;
  constructor(public token: string,
    public payload: { owner: string, itemId: string, attachmentId?: string, attachment: FileAttachment, type: string }) { super(token); }
}

export class UrlPopupDownloadAttachmentSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_DOWNLOAD_ATTACHMENT_SUCCESS;
  constructor(public token: string, public payload: { ids: { itemId: string, attachmentId: string }, data: Attachment }) { super(token); }
}

export class UrlPopupDownloadAttachmentFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_DOWNLOAD_ATTACHMENT_FAIL;
  constructor(public token: string, public payload: { error: string, ids: { itemId: string, attachmentId: string } }) { super(token); }
}







export class UrlPopupDeleteItems extends TokenizeAction implements Action {
  readonly type = URL_POPUP_DELETE_ITEMS;
  constructor(public token: string, public payload: { items: MessageItemWrapper[], deleteOnlyList: boolean }) { super(token); }
}

export class UrlPopupDeleteItemSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_DELETE_ITEM_SUCCESS;
  constructor(public token: string, public payload: { items: MessageItemWrapper[] }) { super(token); }
}

export class UrlPopupDeleteItemFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_DELETE_ITEM_FAIL;
  constructor(public token: string, public payload: { error: string, item: MessageItemWrapper }) { super(token); }
}


// ---------move item -------------
export class UrlPopupMoveItems extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MOVE_ITEMS;
  constructor(public token: string, public payload: { items: MessageItemWrapper[], folderId: string }) { super(token); }
}

export class UrlPopupMoveItemSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MOVE_ITEM_SUCCESS;
  constructor(public token: string, public payload: { items: MessageItemWrapper[], folderId: string }) { super(token); }
}

export class UrlPopupMoveItemFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_MOVE_ITEM_FAIL;
  constructor(public token: string, public payload: { error: string, item: MessageItemWrapper }) { super(token); }
}


// ---------move item -------------
export class UrlPopupGetMailFolderItem extends TokenizeAction implements Action {
  readonly type = URL_POPUP_GET_MAIL_FOLDER_ITEM;
  constructor(public token: string, public payload: { folderId: string }) { super(token); }
}

export class UrlPopupMailFolderItemSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_GET_MAIL_FOLDER_ITEM_SUCCESS;
  constructor(public token: string, public payload: { folderId: string }) { super(token); }
}

export class UrlPopupMailFolderItemFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_GET_MAIL_FOLDER_ITEM_FAIL;
  constructor(public token: string, public payload: { error: string }) { super(token); }
}



export class UrlPopupCreateReplyForward extends TokenizeAction implements Action {
  readonly type = URL_POPUP_CREATE_REPLY_FORWARD;
  constructor(public token: string,
    public payload: {
      item: MessageItemWrapper, comment?: string, message?: Message, type: ReplyForwardType, isItemAttachement?: boolean
    }) { super(token); }
}


export class UrlPopupCreateReplyForwardSuccess extends TokenizeAction implements Action {
  readonly type = URL_POPUP_CREATE_REPLY_FORWARD_SUCCESS;
  constructor(public token: string, public payload: { newItem: Message }) { super(token); }
}

export class UrlPopupCreateReplyForwardFail extends TokenizeAction implements Action {
  readonly type = URL_POPUP_CREATE_REPLY_FORWARD_FAIL;
  constructor(public token: string, public payload: { error: string, item?: MessageItemWrapper }) { super(token); }
}

export class UrlPopupNewMailWithItemAttachment extends TokenizeAction implements Action {
  readonly type = URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT;
  constructor(public token: string, public payload: { attachments: ItemAttachment[] }) { super(token); }
}
export class UrlPopupNewMailWithItemAttachmentSuccess implements Action {
  readonly type = URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT_SUCCESS;
  constructor(public payload: any) { }
}
export class UrlPopupNewMailWithItemAttachmentFail implements Action {
  readonly type = URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT_FAIL;
  constructor(public payload: { error: string }) { }
}

export type Any = UrlPopupReadUnreadItems | UrlPopupFlagItems
  | UrlPopupMeetingResponse
  | UrlPopupDownloadAttachment | UrlPopupDeleteItems
  | UrlPopupDeleteItemSuccess | UrlPopupMoveItemFail | UrlPopupCreateReplyForward
  | UrlPopupMailItemLoad | UrlPopupMailItemInit
  | UrlPopupMailItemLoad | UrlPopupMailItemLoadSuccess | UrlPopupMailItemLoadFail |
  UrlPopupCreateReplyForwardFail | UrlPopupCreateReplyForwardSuccess
  | UrlPopupMoveItems | UrlPopupMoveItemSuccess | UrlPopupMoveItemFail
  | UrlPopupGetMailFolderItem | UrlPopupMailFolderItemSuccess | UrlPopupMailFolderItemFail |
  UrlPopupItemAttachmentLoad | UrlPopupItemAttachmentLoadSuccess | UrlPopupItemAttachmentLoadFail
  | UrlPopupNewMailWithItemAttachment;

