import { Action } from '@ngrx/store';
import { CurrentLimits, LimitHistory, UserInputData } from '../models/interfaces';
import { UserInputDataEnum } from '../models/enum';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { PriceCapLimitInput } from './../../core/lib/priceCapLimit';
import { TokenizeAction } from '../../core';

// const key = 'PRICE_CAP_';
export const INIT_PRICE_CAP = `INIT_PRICE_CAP`;
export const GET_TIME_CURRENT_LIMITS = `PRICE_CAP_GET_TIME_CURRENT_LIMITS`;
export const GET_TIME_CURRENT_LIMITS_SUCCESS = `PRICE_CAP_GET_TIME_CURRENT_LIMITS_SUCCESS`;
export const GET_TIME_CURRENT_LIMITS_FAIL = `PRICE_CAP_GET_TIME_CURRENT_LIMITS_FAIL`;
export const CLEART_STORE = 'PRICE_CAP_CLEART_STORE';
export const CHANGE_USER_INPUT = 'PRICE_CAP_CHANGE_USER_INPUT';
export const GET_LIMIT_HISTORY_DETAILS = 'PRICE_CAP_GET_LIMIT_HISTORY_DETAILS';
export const GET_LIMIT_HISTORY_DETAILS_SUCCESS = 'PRICE_CAP_GET_LIMIT_HISTORY_DETAILS_SUCCESS';
export const GET_LIMIT_HISTORY_DETAILS_FAIL = 'PRICE_CAP_GET_LIMIT_HISTORY_DETAILS_FAIL';
export const REQUEST_ADD_LIMIT_TO_HISTORY = 'PRICE_CAP_REQUEST_ADD_LIMIT_TO_HISTORY';
export const ADD_LIMIT_TO_HISTORY = 'PRICE_CAP_LIMIT_TO_HISTORY';
export const ADD_LIMIT_TO_HISTORY_SUCCESS = 'PRICE_CAP_LIMIT_TO_HISTORY_SUCCESS';
export const ADD_LIMIT_TO_HISTORY_FAIL = 'PRICE_CAP_LIMIT_TO_HISTORY_FAIL';
export const DELETE_HISTORY_ITEM = 'PRICE_CAP_LIMIT_DELETE_HISTORY_ITEM';
export const DELETE_HISTORY_ITEM_SUCCESS = 'PRICE_CAP_LIMIT_DELETE_HISTORY_ITEM_SUCCESS';
export const DELETE_HISTORY_ITEM_FAIL = 'PRICE_CAP_LIMIT_DELETE_HISTORY_ITEM_FAIL';

export class InitPriceCapLimit extends TokenizeAction implements Action {
    readonly type = INIT_PRICE_CAP;
    constructor(public token: string, public payload: PriceCapLimitInput, public timeOffset: number) {
        super(token);
    }
}
export class GetTimeCurrentLimit extends TokenizeAction implements Action {
    readonly type = GET_TIME_CURRENT_LIMITS;
    constructor(public token: string) {
        super(token);
    }
}
export class GetTimeCurrentLimitSuccess extends TokenizeAction implements Action {
    readonly type = GET_TIME_CURRENT_LIMITS_SUCCESS;
    constructor(public token: string, public currentLimits: CurrentLimits[]) {
        super(token);
    }
}
export class GetTimeCurrentLimitFail extends TokenizeAction implements Action {
    readonly type = GET_TIME_CURRENT_LIMITS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ClearStore extends TokenizeAction implements Action {
    readonly type = CLEART_STORE;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeUserInput extends TokenizeAction implements Action {
    readonly type = CHANGE_USER_INPUT;
    constructor(public token: string, public payload: { key: UserInputDataEnum, value: any }) {
        super(token);
    }
}

export class GetLimitHistoryDetails extends TokenizeAction implements Action {
    readonly type = GET_LIMIT_HISTORY_DETAILS;
    constructor(public token: string) {
        super(token);
    }
}

export class GetLimitHistoryDetailsSuccess extends TokenizeAction implements Action {
    readonly type = GET_LIMIT_HISTORY_DETAILS_SUCCESS;
    constructor(public token: string, public gridData: LimitHistory[]) {
        super(token);
    }
}

export class GetLimitHistoryDetailsFail extends TokenizeAction implements Action {
    readonly type = GET_LIMIT_HISTORY_DETAILS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class RequestAddToLimit extends TokenizeAction implements Action {
    readonly type = REQUEST_ADD_LIMIT_TO_HISTORY;
    constructor(public token) {
        super(token);
    }
}

export class AddToLimit extends TokenizeAction implements Action {
    readonly type = ADD_LIMIT_TO_HISTORY;
    constructor(public token, public payload: {
        identifyModel: CrimeClassIdentityViewModel;
        userInput: UserInputData;
        user: string;
    }) {
        super(token);
    }
}

export class AddToLimitSuccess extends TokenizeAction implements Action {
    readonly type = ADD_LIMIT_TO_HISTORY_SUCCESS;
    constructor(public token) {
        super(token);
    }
}

export class AddToLimitFail extends TokenizeAction implements Action {
    readonly type = ADD_LIMIT_TO_HISTORY_FAIL;
    constructor(public token) {
        super(token);
    }
}

export class DeleteHistoryItem extends TokenizeAction implements Action {
    readonly type = DELETE_HISTORY_ITEM;
    constructor(public token, public item: LimitHistory) {
        super(token);
    }
}

export class DeleteHistoryItemSucess extends TokenizeAction implements Action {
    readonly type = DELETE_HISTORY_ITEM_SUCCESS;
    constructor(public token) {
        super(token);
    }
}

export class DeleteHistoryItemFail extends TokenizeAction implements Action {
    readonly type = DELETE_HISTORY_ITEM_FAIL;
    constructor(public token) {
        super(token);
    }
}

export type Any = InitPriceCapLimit | GetTimeCurrentLimit | GetTimeCurrentLimitSuccess | GetTimeCurrentLimitFail | ClearStore |
    ChangeUserInput | GetLimitHistoryDetails | GetLimitHistoryDetailsSuccess | GetLimitHistoryDetailsFail | RequestAddToLimit |
    AddToLimit | AddToLimitSuccess | AddToLimitFail | DeleteHistoryItem | DeleteHistoryItemSucess | DeleteHistoryItemFail;
