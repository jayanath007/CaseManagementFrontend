import { PaginatorDef } from './../../core/lib/grid-model';
import { TokenizeAction } from '../../core';
import { InfoDialogType } from '../../core/utility/DpsUtility';
import { CivilTimeRecordingModuleInput, TimeRecordModel, ViewData, Rates, CivilTimeRecordsData } from '../model/interfaces';

export const INIT_MODULE = 'CIVIL_TIME_RECORDING_INIT_MODULE';
export const GET_INIT_DATA = 'CIVIL_TIME_RECORDING_GET_INIT_DATA';
export const GET_INIT_DATA_SUCCESS = 'CIVIL_TIME_RECORDING_GET_INIT_DATA_SUCCESS';
export const GET_INIT_DATA_FAIL = 'CIVIL_TIME_RECORDING_GET_INIT_DATA_FAIL';
export const GET_CIVIL_TIME_RECODE_INFO = 'GET_CIVIL_TIME_RECODE_INFO';
export const GET_CIVIL_TIME_RECODE_INFO_SUCCESS = 'GET_CIVIL_TIME_RECODE_INFO_SUCCESS';
export const GET_CIVIL_TIME_RECODE_INFO_FAIL = 'GET_CIVIL_TIME_RECODE_INFO_FAIL';
export const GET_RATE = 'GET_CIVIL_TIME_RECORD_RATES';
export const GET_RATE_SUCCESS = 'CIVIL_TIME_RECORD_RATES_SUCCESS';
export const GET_RATE_FAIL = 'CIVIL_TIME_RECORD_RATES_FAIL';
export const CHANGE_MODEL = 'CIVIL_TIME_RECORD_CHANGE_MODEL';
export const CALCULATE = 'CIVIL_TIME_RECORD_CALCULATE';
export const SAVE_TIME_RECORD = 'SAVE_CIVIL_TIME_TIME_RECORD';
export const SAVE_TIME_RECORD_SUCCESS = 'SAVE_CIVIL_TIME_TIME_RECORD_SUCESS';
export const SAVE_TIME_RECORD_FAIL = 'SAVE_CIVIL_TIME_TIME_RECORD_FAIL';
export const SHOW_MESSAGE = 'CIVIL_TIME_TIME_RECORD_SHOW_MESSaGE';
export const DELETE_TIME_RECORD = 'DELETE_CIVIL_TIME_TIME_RECORD';
export const DELETE_TIME_RECORD_SUCCESS = 'DELETE_CIVIL_TIME_TIME_RECORD_SUCESS';
export const DELETE_TIME_RECORD_FAIL = 'DELETE_CIVIL_TIME_TIME_RECORD_FAIL';
export const NEW_TIME_RECORD = 'NEW_CIVIL_TIME_TIME_RECORD';
export const CHANGE_TIME_RECORD_PAGE = 'CHANGE_CIVIL_TIME_RECORD_PAGE';
export const GET_TIME_RECORD_HISTORY = 'GET_CIVIL_TIME_RECORD_HISTORY';
export const GET_TIME_RECORD_HISTORY_SUCCESS = 'GET_CIVIL_TIME_RECORD_HISTORY_SUCCESS';
export const GET_TIME_RECORD_HISTORY_FAIL = 'GET_CIVIL_TIME_RECORD_HISTORY_FAIL';
export class InitCivilTimeRecording extends TokenizeAction {
    readonly type = INIT_MODULE;
    constructor(public token: string,
        public payload: {
            inputData: CivilTimeRecordingModuleInput
        }) { super(token); }
}

export class GetInitData extends TokenizeAction {
    readonly type = GET_INIT_DATA;
    constructor(public token: string, public openWithEditItem?: boolean) { super(token); }
}

export class GetInitDataSuccess extends TokenizeAction {
    readonly type = GET_INIT_DATA_SUCCESS;
    constructor(public token: string, public info: ViewData, public openWithEditItem: boolean) { super(token); }
}

export class GetInitDataFail extends TokenizeAction {
    readonly type = GET_INIT_DATA_FAIL;
    constructor(public token: string) { super(token); }
}

export class GetCivilTimeRecodeInfo extends TokenizeAction {
    readonly type = GET_CIVIL_TIME_RECODE_INFO;
    constructor(public token: string, public diaryId: number, public openWithEditItem?: boolean) { super(token); }
}

export class GetCivilTimeRecodeInfoSuccess extends TokenizeAction {
    readonly type = GET_CIVIL_TIME_RECODE_INFO_SUCCESS;
    constructor(public token: string,
        public timeRecordModal: TimeRecordModel, public openWithEditItem: boolean) { super(token); }
}
export class GetCivilTimeRecodeInfoFail extends TokenizeAction {
    readonly type = GET_CIVIL_TIME_RECODE_INFO_FAIL;
    constructor(public token: string) { super(token); }
}
export class GetRate extends TokenizeAction {
    readonly type = GET_RATE;
    constructor(public token: string) { super(token); }
}

export class GetRateSuccess extends TokenizeAction {
    readonly type = GET_RATE_SUCCESS;
    constructor(public token: string, public rates: Rates[]) { super(token); }
}
export class GetRateFail extends TokenizeAction {
    readonly type = GET_RATE_FAIL;
    constructor(public token: string) { super(token); }
}

export class ChangeModel extends TokenizeAction {
    readonly type = CHANGE_MODEL;
    constructor(public token: string, public payload: { key: string, value: any }) { super(token); }
}

export class Calculation extends TokenizeAction {
    readonly type = CALCULATE;
    constructor(public token: string) { super(token); }
}

export class SaveTimeRecord extends TokenizeAction {
    readonly type = SAVE_TIME_RECORD;
    constructor(public token: string) { super(token); }
}

export class SaveTimeRecordSuccess extends TokenizeAction {
    readonly type = SAVE_TIME_RECORD_SUCCESS;
    constructor(public token: string) { super(token); }
}
export class SaveTimeRecordFail extends TokenizeAction {
    readonly type = SAVE_TIME_RECORD_FAIL;
    constructor(public token: string) { super(token); }
}
export class ShowMessage extends TokenizeAction {
    readonly type = SHOW_MESSAGE;
    constructor(public token: string, public title: string, public message: string, public messageType: InfoDialogType) {
        super(token);
    }
}

export class DeleteTimeRecord extends TokenizeAction {
    readonly type = DELETE_TIME_RECORD;
    constructor(public token: string) { super(token); }
}

export class DeleteTimeRecordSuccess extends TokenizeAction {
    readonly type = DELETE_TIME_RECORD_SUCCESS;
    constructor(public token: string) { super(token); }
}
export class DeleteTimeRecordFail extends TokenizeAction {
    readonly type = DELETE_TIME_RECORD_FAIL;
    constructor(public token: string) { super(token); }
}

export class NewTimeRecord extends TokenizeAction {
    readonly type = NEW_TIME_RECORD;
    constructor(public token: string) { super(token); }
}

export class ChangeTimeRecordPage extends TokenizeAction {
    readonly type = CHANGE_TIME_RECORD_PAGE;
    constructor(public token: string, public pageDef: PaginatorDef) { super(token); }
}


export class GetTimeRecordHistory extends TokenizeAction {
    readonly type = GET_TIME_RECORD_HISTORY;
    constructor(public token: string) { super(token); }
}

export class GetTimeRecordHistorySuccess extends TokenizeAction {
    readonly type = GET_TIME_RECORD_HISTORY_SUCCESS;
    constructor(public token: string, public data: CivilTimeRecordsData) { super(token); }
}
export class GetTimeRecordHistoryFail extends TokenizeAction {
    readonly type = GET_TIME_RECORD_HISTORY_FAIL;
    constructor(public token: string) { super(token); }
}


export type Any = InitCivilTimeRecording | GetInitData | GetInitDataSuccess | GetInitDataFail |
    GetCivilTimeRecodeInfo | GetCivilTimeRecodeInfoSuccess | GetCivilTimeRecodeInfoFail | GetRate | GetRateSuccess | GetRateFail |
    GetRate | GetRateSuccess | GetRateFail | ChangeModel | Calculation | SaveTimeRecord | SaveTimeRecordSuccess | SaveTimeRecordFail |
    ShowMessage | DeleteTimeRecord | DeleteTimeRecordSuccess | DeleteTimeRecordFail | NewTimeRecord | ChangeTimeRecordPage |
    GetTimeRecordHistory | GetTimeRecordHistorySuccess | GetTimeRecordHistoryFail;
