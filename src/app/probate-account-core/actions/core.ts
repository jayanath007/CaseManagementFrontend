

import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';




export const INIT_PROBATE_ACCOUNT = 'DPS_INIT_PROBATE_ACCOUNT';


export const SAVE_PROBATE_ACCOUNT_ITEM = 'DPS_SAVE_PROBATE_ACCOUNT_ITEM';
export const SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS = 'DPS_SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS';
export const SAVE_PROBATE_ACCOUNT_ITEM_FAIL = 'DPS_SAVE_PROBATE_ACCOUNT_ITEM_FAIL';















export class InitProbateAccount extends TokenizeAction implements Action {
    readonly type = INIT_PROBATE_ACCOUNT;
    constructor(public token: string, public payload: {
        openFrom: any, title: string, isPopup: boolean,
        matterData: any, editData: any
    }) {
        super(token);
    }
}

export class SaveProbateAccountItem extends TokenizeAction implements Action {
    readonly type = SAVE_PROBATE_ACCOUNT_ITEM;
    constructor(public token: string, public accountData: any) {
        super(token);
    }
}
export class SaveProbateAccountItemSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class SaveProbateAccountItemFail extends TokenizeAction implements Action {
    readonly type = SAVE_PROBATE_ACCOUNT_ITEM_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}









export type Any = InitProbateAccount | SaveProbateAccountItem | SaveProbateAccountItemSuccess | SaveProbateAccountItemFail;
