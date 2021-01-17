import { Action } from '@ngrx/store';
import { ItemUpload, BlobFileRequest, DiaryWebViewToken } from '../models/interfaces';
import { RestError } from '@azure/storage-blob';


export const UPDATE_ITEM_UPLOAD_PROGRESS = 'DPS_AZURE_UPDATE_ITEM_UPLOAD_PROGRESS';
export const REMOVE_UPLOADED_ITEM = 'DPS_AZURE_REMOVE_UPLOADED_ITEM';
export const ITEM_UPLOAD_FAIL = 'DPS_AZURE_ITEM_UPLOAD_FAIL';
export const CHANGE_DIARY_WEB_VIEW_TOKEN = 'DPS_AZURE_CHANGE_DIARY_WEB_VIEW_TOKEN';
export const CHANGE_DIARY_WEB_VIEW_TOKEN_BY_DIARY_ID = 'DPS_AZURE_CHANGE_DIARY_WEB_VIEW_TOKEN_BY_DIARY_ID';

export class UpdateItemUploadProgress implements Action {
    readonly type = UPDATE_ITEM_UPLOAD_PROGRESS;
    constructor(public item: ItemUpload) { }
}

export class RemoveUploadedItem implements Action {
    readonly type = REMOVE_UPLOADED_ITEM;
    constructor(public item: ItemUpload) { }
}


export class ItemUploadFail implements Action {
    readonly type = ITEM_UPLOAD_FAIL;
    constructor(public error: RestError, public options: BlobFileRequest) { }
}

export class ChangeDiaryWebViewToken implements Action {
    readonly type = CHANGE_DIARY_WEB_VIEW_TOKEN;
    constructor(public appCode: string, public branchId: number, public fileId: number, public webViewToken: DiaryWebViewToken) { }
}

export class ChangeDiaryWebViewTokenByDiaryId implements Action {
    readonly type = CHANGE_DIARY_WEB_VIEW_TOKEN_BY_DIARY_ID;
    constructor(public diaryId: number, public webViewToken: DiaryWebViewToken) { }
}

export type Any = UpdateItemUploadProgress | RemoveUploadedItem | ItemUploadFail | ChangeDiaryWebViewToken |
    ChangeDiaryWebViewTokenByDiaryId;
