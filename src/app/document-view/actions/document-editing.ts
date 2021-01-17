import { Action } from '@ngrx/store';
import { DiaryEntryFileInfo, DiaryEntryPathInfo, TempaltePathInfo, IDocumentCheckin, FileManagerType } from '../models/interfaces';

export const CHECKOUT_DIARY_ENTRY_DOC = 'DPS_DOC_EDT_CHECKOUT_DIARY_ENTRY_DOC';
export const CHECKOUT_DOC_WITH_PATH_INFO = 'DPS_DOC_EDT_CHECKOUT_DOC_WITH_PATH_INFO';
export const CHECKOUT_TEMPALTE_FILE = 'DPS_DOC_EDT_CHECKOUT_TEMPALTE_FILE';
export const FILE_CHECKOUT_SUCCESS = 'DPS_DOC_EDT_FILE_CHECKOUT_SUCCESS';
export const FILE_CHECKOUT_FAIL = 'DPS_DOC_EDT_FILE_CHECKOUT_FAIL';

export const CHECKIN_FILE = 'DPS_DOC_EDT_CHECKIN_FILE';
export const CHECKIN_FILE_FAIL = 'DPS_DOC_EDT_CHECKIN_FILE_FAIL';
export const CHECKIN_FILE_SUCCESS = 'DPS_DOC_EDT_CHECKIN_FILE_SUCCESS';

export const DISCARD_CHECKOUT = 'DPS_DOC_EDT_DISCARD_CHECKOUT';
export const DISCARD_CHECKOUT_SUCCESS = 'DPS_DOC_EDT_DISCARD_CHECKOUT_SUCCESS';
export const DISCARD_CHECKOUT_FAIL = 'DPS_DOC_EDT_DISCARD_CHECKOUT_FAIL';
export const FILE_VIEW_ONLY = 'DPS_DOC_EDT_FILE_VIEW_ONLY';


export abstract class EditingResultAction {
    constructor(public docCheckin: IDocumentCheckin) { }
}

export class CheckoutDiaryItemDoc implements Action {
    readonly type = CHECKOUT_DIARY_ENTRY_DOC;
    constructor(public payload: DiaryEntryFileInfo) { }
}

export class CheckoutDocWithPathInfo implements Action {
    readonly type = CHECKOUT_DOC_WITH_PATH_INFO;
    constructor(public payload: DiaryEntryPathInfo) { }
}

export class CheckoutTempalteFiles implements Action {
    readonly type = CHECKOUT_TEMPALTE_FILE;
    constructor(public payload: TempaltePathInfo) { }
}

export class CheckinFile extends EditingResultAction implements Action {
    readonly type = CHECKIN_FILE;
    constructor(docCheckin: IDocumentCheckin) {
        super(docCheckin);
    }
}

export class CheckinFileFail extends EditingResultAction implements Action {
    readonly type = CHECKIN_FILE_FAIL;
    constructor(docCheckin: IDocumentCheckin) {
        super(docCheckin);
    }
}

export class CheckinFileSuccess extends EditingResultAction implements Action {
    readonly type = CHECKIN_FILE_SUCCESS;
    constructor(docCheckin: IDocumentCheckin) {
        super(docCheckin);
    }
}

export class DiscardCheckout extends EditingResultAction implements Action {
    readonly type = DISCARD_CHECKOUT;
    constructor(docCheckin: IDocumentCheckin) {
        super(docCheckin);
    }
}

export class DiscardCheckoutFail extends EditingResultAction implements Action {
    readonly type = DISCARD_CHECKOUT_FAIL;
    constructor(docCheckin: IDocumentCheckin) {
        super(docCheckin);
    }
}

export class DiscardCheckoutSuccess extends EditingResultAction implements Action {
    readonly type = DISCARD_CHECKOUT_SUCCESS;
    constructor(docCheckin: IDocumentCheckin) {
        super(docCheckin);
    }
}

export class FileCheckoutSuccess extends EditingResultAction implements Action {
    readonly type = FILE_CHECKOUT_SUCCESS;
    constructor(public docCheckin: IDocumentCheckin, public requestPaylod: DiaryEntryFileInfo | DiaryEntryPathInfo | TempaltePathInfo) {
        super(docCheckin);
    }
}

export class FileCheckoutFailed implements Action {
    readonly type = FILE_CHECKOUT_FAIL;
    constructor(public fileMgrType: FileManagerType, public requestPaylod: DiaryEntryFileInfo | DiaryEntryPathInfo | TempaltePathInfo) { }
}


export class FileViewOnly implements Action {
    readonly type = FILE_VIEW_ONLY;
    constructor(public payload: TempaltePathInfo) { }
}
export type Any = CheckoutDiaryItemDoc | CheckoutDocWithPathInfo | FileCheckoutSuccess | CheckinFile | CheckoutTempalteFiles |
    FileCheckoutFailed | CheckinFileSuccess | DiscardCheckoutSuccess | DiscardCheckoutFail | DiscardCheckout | CheckinFileFail
    | FileViewOnly;
