import { Action } from '@ngrx/store';
import { MlsCaseMassageResponce } from '../../core/lib/mls';
import { GetAllCaseMessagesByHandler } from '../models/interface';
import { MatterRefMap } from './../models/interface';
import { ChatMessage } from './../../core/lib/mls';

export const INIT_MLS_WIDGET = 'DPS_INIT_MLS_WIDGET';
export const REQUEST_DATA = 'DPS_MLS_WIDGET_REQUEST_DATA';
export const LOAD_DATA = 'DPS_MLS_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'DPS_MLS_WIDGET_LOAD_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'DPS_MLS_WIDGET_LOAD_DATA_FAIL';
export const REFRESH = 'DPS_MLS_WIDGET_REFRESH';
export const GET_FULL_MATTER_DETAILS = 'DPS_MLS_GET_FULL_MATTER_DETAILS';
export const GET_FULL_MATTER_DETAILS_SUCCESS = 'DPS_MLS_GET_FULL_MATTER_DETAILS_SUCCESS';
export const GET_FULL_MATTER_DETAILS_FAIL = 'DPS_GET_FULL_MATTER_DETAILS_FAIL';
export const CONTINUE_CHAT = 'DPS_MLS_WIDGET_CONTINUE_CHAT';
export const SEND_MESSAGE = 'DPS_MLS_WIDGET_SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'DPS_MLS_WIDGET_SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'DPS_MLS_SEND_WIDGET_MESSAGE_FAIL';
export const LOAD_MATTER_REF = 'DPS_MLS_WIDGET_LOAD_MATTER_REF';
export const LOAD_MATTER_REF_SUCCESS = 'DPS_MLS_WIDGET_LOAD_MATTER_REF_SUCCESS';
export const LOAD_MATTER_REF_FAIL = 'DPS_MLS_WIDGET_LOAD_MATTER_REF_FAIL';
import { MatterSearchGridData } from './../../core/lib/matter';

export class InitMLSWidget implements Action {
    readonly type = INIT_MLS_WIDGET;
    constructor() { }
}

export class RefreshMLSWidget implements Action {
    readonly type = REFRESH;
    constructor() { }
}

export class RequestData implements Action {
    readonly type = REQUEST_DATA;
    constructor() { }
}

export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor(public request: GetAllCaseMessagesByHandler) { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public payload: { dataObj: MlsCaseMassageResponce }) { }
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor() { }
}

export class GetFullMatterDetails implements Action {
    readonly type = GET_FULL_MATTER_DETAILS;
    constructor(public item: ChatMessage) { }
}

export class GetFullMatterDetailsSucceess implements Action {
    readonly type = GET_FULL_MATTER_DETAILS_SUCCESS;
    constructor(public item: MatterSearchGridData) { }
}

export class GetFullMatterDetailsFail implements Action {
    readonly type = GET_FULL_MATTER_DETAILS_FAIL;
    constructor() { }
}

export class ContinueChat implements Action {
    readonly type = CONTINUE_CHAT;
    constructor(public item: ChatMessage) { }
}

export class SendMessage implements Action {
    readonly type = SEND_MESSAGE;
    constructor(public msg: string) { }
}
export class SendMessageSuccess implements Action {
    readonly type = SEND_MESSAGE_SUCCESS;
    constructor() { }
}

export class SendMessageFail implements Action {
    readonly type = SEND_MESSAGE_FAIL;
    constructor() { }
}
export class LoadMatterRef implements Action {
    readonly type = LOAD_MATTER_REF;
    constructor(public payload: { unResolvedMatters: { processAppId: number, fileId: number, branchId: number }[] }  ) { }
}

export class LoadMatterRefSuccess implements Action {
    readonly type = LOAD_MATTER_REF_SUCCESS;
    constructor(public payload: { matterRef: MatterRefMap[] }) { }
}

export class LoadMatterRefFail implements Action {
    readonly type = LOAD_MATTER_REF_FAIL;
    constructor() { }
}

export type Any = InitMLSWidget | RequestData | LoadData | LoadDataSuccess | LoadDataFail |
    GetFullMatterDetails | GetFullMatterDetailsSucceess | GetFullMatterDetailsFail | ContinueChat |
    SendMessage | SendMessageSuccess | SendMessageFail | LoadMatterRef | LoadMatterRefSuccess | LoadMatterRefFail;
