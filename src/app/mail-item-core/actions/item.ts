import { Action } from '@ngrx/store';
import { FollowupFlag, Message, FileAttachment, Attachment } from '../../core/lib/microsoft-graph';
import { MessageItemWrapper, ReplyForwardType } from '../models/interface';
import { AttachmentType } from '../../core/lib/graph-enums';
import { FileUrlCache } from '../../core/lib/files';

export const SHOW_MESSAGE_ITEMS_VIEWS = 'DPS_SHOW_MESSAGE_ITEMS_VIEWS';
export const DOWNLOAD_ATTACHMENT = 'DPS_DOWNLOAD_ATTACHMENT_IN_MESSAGE';
export const DOWNLOAD_ATTACHMENT_SUCCESS = 'DPS_DOWNLOAD_ATTACHMENT_IN_MESSAGE_SUCCESS';
export const DOWNLOAD_ATTACHMENT_FAIL = 'DPS_DOWNLOAD_ATTACHMENT_IN_MESSAGE_FAIL';
export const DELETE_ITEMS = 'DPS_DELETE_ITEMS';
export const DELETE_ITEM_SUCCESS = 'DPS_DELETE_ITEM_SUCCESS';
export const DELETE_ITEM_FAIL = 'DPS_DELETE_ITEM_FAIL';
export const MOVE_ITEMS = 'DPS_MOVE_ITEMS';
export const MOVE_ITEM_SUCCESS = 'DPS_MOVE_ITEM_SUCCESS';
export const MOVE_ITEM_FAIL = 'DPS_MOVE_ITEM_FAIL';
export const FLAG_ITEMS = 'DPS_FLAG_ITEMS';
export const FLAG_ITEM_SUCCESS = 'DPS_FLAG_ITEM_SUCCESS';
export const FLAG_ITEM_FAIL = 'DPS_FLAG_ITEM_FAIL';
export const GET_EVENT_MESSAGE_EVENT = 'DPS_GET_EVENT_MESSAGE_EVENT';
export const REMOVE_FROM_CALENDAR = 'DPS_REMOVE_FROM_CALENDAR';
export const MEETING_RESPONSE_ITEM = 'DPS_MEETING_RESPONSE_ITEM';
export const MEETING_RESPONSE_ITEM_SUCCESS = 'DPS_MEETING_RESPONSE_ITEM_SUCCESS';
export const MEETING_RESPONSE_ITEM_FAIL = 'DPS_MEETING_RESPONSE_ITEM_FAIL';
export const READ_UNREAD_ITEMS = 'DPS_READ_UNREAD_ITEMS';
export const READ_UNREAD_ITEM_SUCCESS = 'DPS_READ_UNREAD_ITEM_SUCCESS';
export const READ_UNREAD_ITEM_FAIL = 'DPS_READ_UNREAD_ITEM_FAIL';
export const SET_AUTO_READ_ITEM_ID = 'DPS_SET_AUTO_READ_ITEM_ID';
export const CREATE_REPLY_FORWARD = 'DPS_CREATE_REPLY_FORWARD';
export const GET_CREATE_REPLY_FORWARD_FULL_DATA = 'DPS_GET_CREATE_REPLY_FORWARD_FULL_DATA';
export const CREATE_REPLY_FORWARD_SUCCESS = 'DPS_CREATE_REPLY_FORWARD_SUCCESS';
export const CREATE_REPLY_FORWARD_FAIL = 'DPS_CREATE_REPLY_FORWARD_FAIL';
export const NEW_MAIL_WITH_ITEM_ATTACHMENT = 'DPS_NEW_MAIL_WITH_ITEM_ATTACHMENT';
export const OPEN_MAIL_URL_POPUP = 'OPEN_MAIL_URL_POPUP';

export const GET_OUTLOOK_JOURNAL_STATUS = 'DPS_GET_OUTLOOK_JOURNAL_STATUS';
export const GET_OUTLOOK_JOURNAL_STATUS_SUCCESS = 'DPS_GET_OUTLOOK_JOURNAL_STATUS_SUCCESS';
export const GET_OUTLOOK_JOURNAL_STATUS_FAIL = 'DPS_GET_OUTLOOK_JOURNAL_STATUS_FAIL';
export const REMOVE_OUTLOOK_JOURNAL_STATUS = 'DPS_REMOVE_OUTLOOK_JOURNAL_STATUS';

// export const CACHE_ATTACHEMNT_URL = 'DPS_CACHE_ATTACHEMNT_URL';
// export const CACHE_ATTACHEMNT_URL_SUCCUESS = 'DPS_CACHE_ATTACHEMNT_URL_SUCCUESS';
// export const CACHE_ATTACHEMNT_URL_FAIL = 'DPS_CACHE_ATTACHEMNT_URL_FAIL';

export class OpenMailUrlPopup implements Action {
  readonly type = OPEN_MAIL_URL_POPUP;
  constructor(public payload: { owner: string, itemId: string, token: string }) { }
}

export class GetOutlookJournalStatus implements Action {
  readonly type = GET_OUTLOOK_JOURNAL_STATUS;
  constructor(public payload: { internetMessageIds: string[], requiredDelay?: boolean }) { }
}
export class GetOutlookJournalStatusSuccess implements Action {
  readonly type = GET_OUTLOOK_JOURNAL_STATUS_SUCCESS;
  constructor(public payload: { diaryId: number, emailId: string }[]) { }
}
export class GetOutlookJournalStatusFail implements Action {
  readonly type = GET_OUTLOOK_JOURNAL_STATUS_FAIL;
  constructor(public payload: { internetMessageIds: string[] }, public error: any) { }
}

export class RemoveOutlookJournalStatus implements Action {
  readonly type = REMOVE_OUTLOOK_JOURNAL_STATUS;
  constructor(public payload: number[]) { }
}

// ------- Attachment stuff ---------------
export class DownloadAttachment implements Action {
  readonly type = DOWNLOAD_ATTACHMENT;
  constructor(public payload: {
    owner: string, itemId: string, attachmentId?: string,
    attachment: FileAttachment, type: string, isEmail?: boolean
  }) { }
}
export class DownloadAttachmentSuccess implements Action {
  readonly type = DOWNLOAD_ATTACHMENT_SUCCESS;
  constructor(public payload: { ids: { itemId: string, attachmentId: string }, data: Attachment }) { }
}

export class DownloadAttachmentFail implements Action {
  readonly type = DOWNLOAD_ATTACHMENT_FAIL;
  constructor(public payload: { error: string, ids: { itemId: string, attachmentId: string } }) { }
}

// export class CacheAttachmentUrl implements Action {
//   readonly type = CACHE_ATTACHEMNT_URL;
//   constructor(public payload: { item: MessageItemWrapper }) { }
// }

// export class CacheAttachmentUrlSuccess implements Action {
//   readonly type = CACHE_ATTACHEMNT_URL_SUCCUESS;
//   constructor(public payload: { item: MessageItemWrapper, attachemnt: FileAttachment, urlCache: FileUrlCache }) { }
// }

// export class CacheAttachmentUrlFali implements Action {
//   readonly type = CACHE_ATTACHEMNT_URL_FAIL;
//   constructor(public payload: { item: MessageItemWrapper, attachemnt: FileAttachment, urlCache: FileUrlCache }) { }
// }

export class GetEventMessageEvent implements Action {
  readonly type = GET_EVENT_MESSAGE_EVENT;
  constructor(public payload: { item: MessageItemWrapper }) { }
}
export class RemoveFromCalendar implements Action {
  readonly type = REMOVE_FROM_CALENDAR;
  constructor(public payload: { item: MessageItemWrapper, eventId: string }) { }
}

// ------- delete item stuff---------------
export class DeleteItems implements Action {
  readonly type = DELETE_ITEMS;
  constructor(public payload: { items: MessageItemWrapper[], deleteOnlyList: boolean }) { }
}

export class DeleteItemSuccess implements Action {
  readonly type = DELETE_ITEM_SUCCESS;
  constructor(public payload: { items: MessageItemWrapper[] }) { }
}

export class DeleteItemFail implements Action {
  readonly type = DELETE_ITEM_FAIL;
  constructor(public payload: { error: string, item: MessageItemWrapper }) { }
}

// ---------move item -------------
export class MoveItems implements Action {
  readonly type = MOVE_ITEMS;
  constructor(public payload: { items: MessageItemWrapper[], folderId: string, owner: string }) { }
}

export class MoveItemSuccess implements Action {
  readonly type = MOVE_ITEM_SUCCESS;
  constructor(public payload: { items: MessageItemWrapper[], folderId: string }) { }
}

export class MoveItemFail implements Action {
  readonly type = MOVE_ITEM_FAIL;
  constructor(public payload: { error: string, item: MessageItemWrapper }) { }
}
// ------- flag item stuff---------------
export class FlagItems implements Action {
  readonly type = FLAG_ITEMS;
  constructor(public payload: { items: MessageItemWrapper[], flag: FollowupFlag }) { }
}

export class FlagItemSuccess implements Action {
  readonly type = FLAG_ITEM_SUCCESS;
  constructor(public payload: { item: MessageItemWrapper }) { }
}

export class FlagItemFail implements Action {
  readonly type = FLAG_ITEM_FAIL;
  constructor(public payload: { error: string, item: MessageItemWrapper }) { }
}

// ------- read unread item stuff---------------
export class ReadUnreadItems implements Action {
  readonly type = READ_UNREAD_ITEMS;
  constructor(public payload: { items: MessageItemWrapper[], isRead: boolean }) { }
}

export class ReadUnreadItemSuccess implements Action {
  readonly type = READ_UNREAD_ITEM_SUCCESS;
  constructor(public payload: { item: MessageItemWrapper }) { }
}

export class ReadUnreadItemFail implements Action {
  readonly type = READ_UNREAD_ITEM_FAIL;
  constructor(public payload: { error: string, item: MessageItemWrapper }) { }
}

export class SetAutoReadItemId implements Action {
  readonly type = SET_AUTO_READ_ITEM_ID;
  constructor(public payload: { itemId: string }) { }
}

// ------- Meeting Response item stuff---------------
export class MeetingResponse implements Action {
  readonly type = MEETING_RESPONSE_ITEM;
  constructor(public payload: { item: MessageItemWrapper, comment: string, sendResponse: boolean, type: string }) { }
}

export class MeetingResponseSuccess implements Action {
  readonly type = MEETING_RESPONSE_ITEM_SUCCESS;
  constructor(public payload: { item: MessageItemWrapper }) { }
}

export class MeetingResponseFail implements Action {
  readonly type = MEETING_RESPONSE_ITEM_FAIL;
  constructor(public payload: { error: string, item: MessageItemWrapper }) { }
}

// ------- Meeting Response item stuff---------------

export class CreateReplyForward implements Action {
  readonly type = CREATE_REPLY_FORWARD;
  constructor(public payload: { item: MessageItemWrapper, comment?: string, message?: Message, type: ReplyForwardType, token: string }) { }
}
export class GetCreateReplyForwardFullData implements Action {
  readonly type = GET_CREATE_REPLY_FORWARD_FULL_DATA;
  constructor(public payload: { message: Message, token: string }) { }
}
export class CreateReplyForwardSuccess implements Action {
  readonly type = CREATE_REPLY_FORWARD_SUCCESS;
  constructor(public payload: { newItem: Message, refItem: Message, token: string }) { }
}

export class CreateReplyForwardFail implements Action {
  readonly type = CREATE_REPLY_FORWARD_FAIL;
  constructor(public payload: { error: string, item?: MessageItemWrapper }) { }
}

export class NewMailWithItemAttachment implements Action {
  readonly type = NEW_MAIL_WITH_ITEM_ATTACHMENT;
  constructor(public payload: any) { }
}

export type Any = DeleteItems | DeleteItemSuccess | DeleteItemFail |
  MoveItems | MoveItemSuccess | MoveItemFail |
  FlagItems | FlagItemSuccess | FlagItemFail | ReadUnreadItems | ReadUnreadItemSuccess | ReadUnreadItemFail |
  DownloadAttachment | DownloadAttachmentSuccess | NewMailWithItemAttachment |
  // CacheAttachmentUrlSuccess | CacheAttachmentUrl | CacheAttachmentUrlFali |
  SetAutoReadItemId | GetEventMessageEvent |
  GetOutlookJournalStatus | GetOutlookJournalStatusSuccess | GetOutlookJournalStatusFail | RemoveOutlookJournalStatus;
