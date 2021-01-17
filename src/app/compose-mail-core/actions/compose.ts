import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { Message, Recipient, FileAttachment, Attachment, ItemAttachment, Importance } from '../../core/lib/microsoft-graph';
import { ChaserOutPut } from '../../chaser-core';
import { AttachmentType } from '../../core/lib/graph-enums';

export const ADD_COMPOSE_MAIL = 'DPS_ADD_COMPOSE_MAIL';
export const FLAG_FOLLOW_UP = 'DPS_FLAG_FOLLOW_UP';
export const SET_IMPORTANCE = 'DPS_SET_IMPORTANCE';
export const SET_SUBJECT = 'DPS_SET_SUBJECT';
export const SET_BODY = 'DPS_SET_BODY';

export const ADD_TO_RECIPIENT = 'DPS_ADD_TO_RECIPIENT';
export const ADD_CC_RECIPIENT = 'DPS_ADD_CC_RECIPIENT';
export const ADD_BCC_RECIPIENT = 'DPS_ADD_BCC_RECIPIENT';
export const REMOVE_TO_RECIPIENT = 'DPS_REMOVE_TO_RECIPIENT';
export const REMOVE_CC_RECIPIENT = 'DPS_REMOVE_CC_RECIPIENT';
export const REMOVE_BCC_RECIPIENT = 'DPS_REMOVE_BCC_RECIPIENT';

export const SEND_ITEM = 'DPS_SEND_ITEM';
export const SEND_NEW_ITEM = 'DPS_SEND_NEW_ITEM';
export const SEND_DRAFT_ITEM = 'DPS_SEND_DRAFT_ITEM';
export const SEND_ITEM_SUCCESS = 'DPS_SEND_ITEM_SUCCESS';
export const SEND_ITEM_FAIL = 'DPS_SEND_ITEM_FAIL';
export const SEND_ITEM_STOPPED = 'DPS_SEND_ITEM_STOPPED';

export const DRAFT_ITEM = 'DPS_DRAFT_ITEM';
export const ITEM_SAVEING = 'DPS_ITEM_SAVEING';
export const DRAFT_ITEM_SUCCESS = 'DPS_DRAFT_ITEM_SUCCESS';
export const DRAFT_ITEM_FAIL = 'DPS_DRAFT_ITEM_FAIL';
export const DRAFT_ITEM_STOPPED = 'DPS_DRAFT_ITEM_STOPPED';

export const DISCARD_ITEM = 'DPS_DISCARD_ITEM';
export const DISCARD_ITEM_SUCCESS = 'DPS_DISCARD_ITEM_SUCCESS';
export const DISCARD_ITEM_FAIL = 'DPS_DISCARD_ITEM_FAIL';
export const DISCARD_ITEM_STOPPED = 'DPS_DISCARD_ITEM_STOPPED';

export const ADD_FILE_ATTACHMENT = 'DPS_ADD_FILE_ATTACHMENT_TO_COMPOSE';
export const ADD_ATTACHMENT = 'DPS_ADD_ATTACHMENT_TO_COMPOSE';
export const ADD_ITEM_ATTACHMENT = 'DPS_ADD_ITEM_ATTACHMENT_TO_COMPOSE';
export const ADD_DRIVE_ATTACHMENT = 'DPS_ADD_DRIVE_ATTACHMENT_TO_COMPOSE';
export const ADD_DIARY_ATTACHMENT = 'DPS_ADD_DIARY_ATTACHMENT_TO_COMPOSE';
export const ADD_ATTACHMENT_SUCCESS = 'DPS_ADD_ATTACHMENT_TO_COMPOSE_SUCCESS';
export const ADD_ATTACHMENT_FAIL = 'DPS_ADD_ATTACHMENT_TO_COMPOSE_FAIL';

export const ADD_NEW_MAIL_ITEM_ATTACHMENTS = 'DPS_ADD_NEW_MAIL_ITEM_ATTACHMENTS_TO_COMPOSE';

export const ADD_INIT_ATTACHMENTS_SUCCESS = 'DPS_ADD_INIT_ATTACHMENTS_TO_COMPOSE_SUCCESS';
export const ADD_INIT_ATTACHMENTS_FAIL = 'DPS_ADD_INIT_ATTACHMENTS_TO_COMPOSE_FAIL';

export const DOWNLOAD_ATTACHMENT = 'DPS_DOWNLOAD_ATTACHMENT_IN_COMPOSE';
export const DOWNLOAD_ATTACHMENT_SUCCESS = 'DPS_DOWNLOAD_ATTACHMENT_IN_COMPOSE_SUCCESS';
export const DOWNLOAD_ATTACHMENT_FAIL = 'DPS_DOWNLOAD_ATTACHMENT_IN_COMPOSE_FAIL';

export const DELETE_ATTACHMENT = 'DPS_DELETE_ATTACHMENT_IN_COMPOSE';
export const DELETE_ATTACHMENT_SUCCESS = 'DPS_DELETE_ATTACHMENT_IN_COMPOSE_SUCCESS';
export const DELETE_ATTACHMENT_FAIL = 'DPS_DELETE_ATTACHMENT_IN_COMPOSE_FAIL';

export const CLEAR_COMPOSE_MAIL = 'DPS_CLEAR_COMPOSE_MAIL';
export const OPEN_IN_URL_POPUP_COMPOSE_MAIL = 'DPS_OPEN_IN_URL_POPUP_COMPOSE_MAIL';
export const CLOSE_COMPOSE_MAIL_ITEM = 'DPS_CLOSE_COMPOSE_MAIL_ITEM';
export const SAVE_AND_CLEAR_COMPOSE_MAIL = 'DPS_SAVE_AND_CLEAR_COMPOSE_MAIL';


export class AddComposeMail extends TokenizeAction implements Action {
    readonly type = ADD_COMPOSE_MAIL;
    constructor(public token: string, public payload: { composeMail: Message, refMail?: Message }) {
        super(token);
    }
}

export class CloseComposeMailItem extends TokenizeAction implements Action {
    readonly type = CLOSE_COMPOSE_MAIL_ITEM;
    constructor(public token: string, public payload: { composeMail: Message }) {
        super(token);
    }
}

export class OpenInUrlPopupComposeMail extends TokenizeAction implements Action {
    readonly type = OPEN_IN_URL_POPUP_COMPOSE_MAIL;
    constructor(public token: string, public payload: { message?: Message }) {
        super(token);
    }
}

export class FlagFollowUp extends TokenizeAction implements Action {
    readonly type = FLAG_FOLLOW_UP;
    constructor(public token: string, public payload: { type: string }) {
        super(token);
    }
}
export class SetImportance extends TokenizeAction implements Action {
    readonly type = SET_IMPORTANCE;
    constructor(public token: string, public payload: { importance: Importance }) {
        super(token);
    }
}
export class SetSubject extends TokenizeAction implements Action {
    readonly type = SET_SUBJECT;
    constructor(public token: string, public payload: { subject: string }) {
        super(token);
    }
}
export class SetBody extends TokenizeAction implements Action {
    readonly type = SET_BODY;
    constructor(public token: string, public payload: { body: string }) {
        super(token);
    }
}
export class AddToRecipient extends TokenizeAction implements Action {
    readonly type = ADD_TO_RECIPIENT;
    constructor(public token: string, public payload: { recipient: Recipient }) {
        super(token);
    }
}
export class AddCcRecipient extends TokenizeAction implements Action {
    readonly type = ADD_CC_RECIPIENT;
    constructor(public token: string, public payload: { recipient: Recipient }) {
        super(token);
    }
}
export class AddBccRecipient extends TokenizeAction implements Action {
    readonly type = ADD_BCC_RECIPIENT;
    constructor(public token: string, public payload: { recipient: Recipient }) {
        super(token);
    }
}
export class RemoveToRecipient extends TokenizeAction implements Action {
    readonly type = REMOVE_TO_RECIPIENT;
    constructor(public token: string, public payload: { recipient: Recipient }) {
        super(token);
    }
}
export class RemoveCcRecipient extends TokenizeAction implements Action {
    readonly type = REMOVE_CC_RECIPIENT;
    constructor(public token: string, public payload: { recipient: Recipient }) {
        super(token);
    }
}
export class RemoveBccRecipient extends TokenizeAction implements Action {
    readonly type = REMOVE_BCC_RECIPIENT;
    constructor(public token: string, public payload: { recipient: Recipient }) {
        super(token);
    }
}

export class SendItem extends TokenizeAction implements Action {
    readonly type = SEND_ITEM;
    constructor(public token: string, public payload: { message?: Message }) {
        super(token);
    }
}

export class SendNewItem extends TokenizeAction implements Action {
    readonly type = SEND_NEW_ITEM;
    constructor(public token: string, public payload: { message?: Message }) {
        super(token);
    }
}
export class SendDraftItem extends TokenizeAction implements Action {
    readonly type = SEND_DRAFT_ITEM;
    constructor(public token: string, public payload: { message?: Message }) {
        super(token);
    }
}
export class SendItemSuccess extends TokenizeAction implements Action {
    readonly type = SEND_ITEM_SUCCESS;
    constructor(public token: string, public payload: { item: Message }) {
        super(token);
    }
}
export class SendItemFail extends TokenizeAction implements Action {
    readonly type = SEND_ITEM_FAIL;
    constructor(public token: string, public payload: { error: any, item: Message }) {
        super(token);
    }
}
export class DraftItem extends TokenizeAction implements Action {
    readonly type = DRAFT_ITEM;
    constructor(public token: string, public payload: { message?: Message, isSuppressErrors?: boolean, lastDraft?: boolean }) {
        super(token);
    }
}
export class ItemSaveing extends TokenizeAction implements Action {
    readonly type = ITEM_SAVEING;
    constructor(public token: string) {
        super(token);
    }
}
export class DraftItemSuccess extends TokenizeAction implements Action {
    readonly type = DRAFT_ITEM_SUCCESS;
    constructor(public token: string, public payload: { item?: Message, newItem: Message }) {
        super(token);
    }
}
export class DraftItemFail extends TokenizeAction implements Action {
    readonly type = DRAFT_ITEM_FAIL;
    constructor(public token: string, public payload: { error: string, item?: Message }) {
        super(token);
    }
}
export class DiscardItem extends TokenizeAction implements Action {
    readonly type = DISCARD_ITEM;
    constructor(public token: string, public payload: { message?: Message }) {
        super(token);
    }
}
export class DiscardItemSuccess extends TokenizeAction implements Action {
    readonly type = DISCARD_ITEM_SUCCESS;
    constructor(public token: string, public payload: { item?: Message }) {
        super(token);
    }
}
export class DiscardItemFail extends TokenizeAction implements Action {
    readonly type = DISCARD_ITEM_FAIL;
    constructor(public token: string, public payload: { error: string, item?: Message }) {
        super(token);
    }
}
export class SendItemStopped extends TokenizeAction implements Action {
    readonly type = SEND_ITEM_STOPPED;
    constructor(public token: string, public payload: { item?: Message }) {
        super(token);
    }
}
export class DraftItemStopped extends TokenizeAction implements Action {
    readonly type = DRAFT_ITEM_STOPPED;
    constructor(public token: string, public payload: { item?: Message }) {
        super(token);
    }
}
export class DiscardItemStopped extends TokenizeAction implements Action {
    readonly type = DISCARD_ITEM_STOPPED;
    constructor(public token: string, public payload: { item?: Message }) {
        super(token);
    }
}
export class AddAttachment extends TokenizeAction implements Action {
    readonly type = ADD_ATTACHMENT;
    constructor(public token: string, public payload: { item: Message, attachment: Attachment, uid: string, type: AttachmentType }) {
        super(token);
    }
}
export class AddFileAttachment extends TokenizeAction implements Action {
    readonly type = ADD_FILE_ATTACHMENT;
    constructor(public token: string, public payload: { itemId: string, attachment: FileAttachment, uid: string, item: Message }) {
        super(token);
    }
}
export class AddItemAttachment extends TokenizeAction implements Action {
    readonly type = ADD_ITEM_ATTACHMENT;
    constructor(public token: string, public payload: { itemId: string, attachment: ItemAttachment, uid: string }) {
        super(token);
    }
}
export class AddDriveAttachment extends TokenizeAction implements Action {
    readonly type = ADD_DRIVE_ATTACHMENT;
    constructor(public token: string, public payload: { itemId: string, attachment: FileAttachment, uid: string }) {
        super(token);
    }
}
export class AddDiaryAttachment extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_ATTACHMENT;
    constructor(public token: string, public payload: { itemId: string, attachment: ItemAttachment, uid: string }) {
        super(token);
    }
}

export class AddAttachmentSuccess extends TokenizeAction implements Action {
    readonly type = ADD_ATTACHMENT_SUCCESS;
    constructor(public token: string, public payload: { item?: Message, attachment: Attachment, uid: string }) {
        super(token);
    }
}
export class AddAttachmentFail extends TokenizeAction implements Action {
    readonly type = ADD_ATTACHMENT_FAIL;
    constructor(public token: string, public payload: { error: string, item?: Message, attachment: Attachment, uid: string }) {
        super(token);
    }
}

export class AddNewMailItemAttachments extends TokenizeAction implements Action {
    readonly type = ADD_NEW_MAIL_ITEM_ATTACHMENTS;
    constructor(public token: string, public payload: { attachments: ItemAttachment[] }) {
        super(token);
    }
}

export class AddInitAttachmentsSuccess extends TokenizeAction implements Action {
    readonly type = ADD_INIT_ATTACHMENTS_SUCCESS;
    constructor(public token: string, public payload: { attachments: Attachment[] }) {
        super(token);
    }
}

export class AddInitAttachmentsFail extends TokenizeAction implements Action {
    readonly type = ADD_INIT_ATTACHMENTS_FAIL;
    constructor(public token: string, public payload: { error: string, attachments: Attachment[] }) {
        super(token);
    }
}
export class DownloadAttachment implements Action {
    readonly type = DOWNLOAD_ATTACHMENT;
    constructor(public payload: { itemId: string, attachment: Attachment, type: string }) { }
}
export class DownloadAttachmentSuccess implements Action {
    readonly type = DOWNLOAD_ATTACHMENT_SUCCESS;
    constructor(public payload: { ids: { itemId: string, attachmentId: string }, data: Attachment }) { }
}
export class DownloadAttachmentFail implements Action {
    readonly type = DOWNLOAD_ATTACHMENT_FAIL;
    constructor(public payload: { error: string, ids: { itemId: string, attachmentId: string } }) { }
}
export class DeleteAttachment extends TokenizeAction implements Action {
    readonly type = DELETE_ATTACHMENT;
    constructor(public token: string, public payload: { itemId: string, attachmentId: string }) {
        super(token);
    }
}
export class DeleteAttachmentSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_ATTACHMENT_SUCCESS;
    constructor(public token: string, public payload: { itemId: string, attachmentId: string }) {
        super(token);
    }
}
export class DeleteAttachmentFail extends TokenizeAction implements Action {
    readonly type = DELETE_ATTACHMENT_FAIL;
    constructor(public token: string, public payload: { error: string, itemId: string, attachmentId: string }) {
        super(token);
    }
}
export class ClearComposeMail extends TokenizeAction implements Action {
    readonly type = CLEAR_COMPOSE_MAIL;
    constructor(public token: string, public payload: { itemId: string }) {
        super(token);
    }
}
export class SaveAndClearComposeMail extends TokenizeAction implements Action {
    readonly type = SAVE_AND_CLEAR_COMPOSE_MAIL;
    constructor(public token: string, public payload: { itemId: string }) {
        super(token);
    }
}
export type Any = AddComposeMail | FlagFollowUp | SetImportance | AddToRecipient | AddCcRecipient | AddBccRecipient |
    RemoveToRecipient | RemoveCcRecipient | RemoveBccRecipient | SendItem | DraftItem | DiscardItem | SendItemSuccess |
    DraftItemSuccess | DiscardItemSuccess | SendItemFail | DraftItemFail | DiscardItemFail |
    SendItemStopped | DraftItemStopped | DiscardItemStopped | AddAttachment | AddAttachmentSuccess | AddAttachmentFail |
    DeleteAttachment | DeleteAttachmentSuccess | DeleteAttachmentFail | ClearComposeMail | SetSubject | CloseComposeMailItem |
    AddNewMailItemAttachments | AddInitAttachmentsSuccess | AddInitAttachmentsFail | ItemSaveing | SetBody;
