import { Action } from '@ngrx/store';
import { Contact, Share, ToCc } from '../models/interface';
import { SubmitType, MatterInfo } from '../../add-note-core';

export const GET_EMAIL_LIST = 'DPS_EMAIL_LIST_GET_EMAIL_LIST';
export const GET_EMAIL_LIST_SUCCESS = 'DPS_EMAIL_LIST_GET_EMAIL_LIST_SUCCESS';
export const GET_EMAIL_LIST_FAIL = 'DPS_EMAIL_LIST_GET_EMAIL_LIST_FAIL';

export const CHANGE_SHARE = 'DPS_EMAIL_LIST_CHANGE_SHARE';
export const CHANGE_TO_CC = 'DPS_EMAIL_LIST_CHANGE_TO_CC';
export const CHANGE_REVIEW_DATE = 'DPS_EMAIL_LIST_CHANGE_REVIEW_DATE';
export const CHANGE_REVIEW_NOTE = 'DPS_EMAIL_LIST_CHANGE_REVIEW_NOTE';
export const CHANGE_MESSAGE = 'DPS_EMAIL_LIST_CHANGE_MESSAGE';
export const ADD_RECIPIENT = 'DPS_EMAIL_LIST_ADD_RECIPIENT';

export const SHARE_ATTACHMENT = 'DPS_EMAIL_LIST_SHARE_ATTACHMENT';
export const SHARE_ATTACHMENT_SUCCESS = 'DPS_EMAIL_LIST_SHARE_ATTACHMENT_SUCCESS';
export const SHARE_ATTACHMENT_FAIL = 'DPS_EMAIL_LIST_SHARE_ATTACHMENT_FAIL';
export const CHANGE_SILENT = 'DPS_EMAIL_LIST_CHANGE_SILENT';


export class GetEmailList implements Action {
    readonly type = GET_EMAIL_LIST;
    constructor(public payload: { branchId: number, appId: number, fileId: number, reviewNote: string, message: string }) {
    }
}
export class GetEmailListSuccess implements Action {
    readonly type = GET_EMAIL_LIST_SUCCESS;
    constructor(public payload: {
        contactList: Contact[], reviewNote: string,
        reviewDate: string,
        message: string
    }) {
    }
}
export class GetEmailListFail implements Action {
    readonly type = GET_EMAIL_LIST_FAIL;
    constructor(public error) {
    }
}
export class ChangeShare implements Action {
    readonly type = CHANGE_SHARE;
    constructor(public payload: Share) {
    }
}
export class ChangeToCc implements Action {
    readonly type = CHANGE_TO_CC;
    constructor(public payload: { id: string, toCc: ToCc }) {
    }
}

export class ChangeReviewDate implements Action {
    readonly type = CHANGE_REVIEW_DATE;
    constructor(public payload: string) {
    }
}

export class ChangeReviewNote implements Action {
    readonly type = CHANGE_REVIEW_NOTE;
    constructor(public payload: string) {
    }
}

export class ChangeMessage implements Action {
    readonly type = CHANGE_MESSAGE;
    constructor(public payload: string) {
    }
}


export class AddRecipient implements Action {
    readonly type = ADD_RECIPIENT;
    constructor(public payload: Contact) {
    }
}

export class ChangeSilent implements Action {
    readonly type = CHANGE_SILENT;
    constructor(public payload: boolean) {
    }
}

export class ShareAttachment implements Action {
    readonly type = SHARE_ATTACHMENT;
    constructor(public payload: {
        fileCredentials: { diaryId: number, password: string, letterName: string }[],
        subjectNote: string,
        signTokens: string[],
        safeBoxFileList: string[],
        submitType: SubmitType,
        matterData: MatterInfo,
        toRecipients: [string],
        ccRecipients: [string],
        reviewDate: string,
        reviewNote: string,
        message: string,
        isEditable: boolean,
        share: Share
    }) {
    }
}
export class ShareAttachmentSuccess implements Action {
    readonly type = SHARE_ATTACHMENT_SUCCESS;
    constructor(public payload: { submitType: SubmitType, matterRef: string, id?: any }) {
    }
}
export class ShareAttachmentFail implements Action {
    readonly type = SHARE_ATTACHMENT_FAIL;
    constructor(public error) {
    }
}

export type Any = GetEmailList | GetEmailListSuccess | GetEmailListFail | ChangeShare | ChangeToCc | ChangeMessage |
    ShareAttachment | ShareAttachmentSuccess | ShareAttachmentFail | ChangeReviewDate | ChangeReviewNote | AddRecipient | ChangeSilent;

