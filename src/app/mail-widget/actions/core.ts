import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { Message, MailFolder } from '../../core/lib/microsoft-graph';
import { MailItemResponse } from '../models/interfce';

export const INIT_MAIL_WIDGET = 'INIT_MAIL_WIDGET_WIDGET';

export const LOAD_DATA = 'MAIL_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'MAIL_WIDGET_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'MAIL_WIDGET_DATA_FAIL';

export const LOAD_MAIL_COUNT = 'MAIL_WIDGET_LOAD_MAIL_COUNTA';
export const LOAD_MAIL_COUNT_SUCCESS = 'MAIL_WIDGET_MAIL_COUNT_SUCCESS';
export const LOAD_MAIL_COUNT_FAIL = 'MAIL_WIDGET_MAIL_COUNT_FAIL';

export const REFRESH_DATA = 'MAIL_WIDGET_REFRESH_DATA';
export const NEW_COMPOSE = 'MAIL_WIDGET_NEW_COMPOSE';


export class InitMailWidget implements Action {
    readonly type = INIT_MAIL_WIDGET;
    constructor() { }
}


export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor() { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public payload: { data: MailItemResponse }) { }
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor() { }
}

export class LoadMailCount implements Action {
    readonly type = LOAD_MAIL_COUNT;
    constructor() { }
}

export class LoadMailCountSuccess implements Action {
    readonly type = LOAD_MAIL_COUNT_SUCCESS;
    constructor(public payload: { data: MailFolder }) { }
}

export class LoadMailCountFail implements Action {
    readonly type = LOAD_MAIL_COUNT_FAIL;
    constructor() { }
}

export class RefreshMailWidgetData implements Action {
    readonly type = REFRESH_DATA;
    constructor() { }
}
export class NewCompose implements Action {
    readonly type = NEW_COMPOSE;
    constructor() { }
}

export type Any = InitMailWidget | LoadData | LoadDataSuccess | LoadDataFail | RefreshMailWidgetData |
LoadMailCount | LoadMailCountSuccess | LoadMailCountFail;
