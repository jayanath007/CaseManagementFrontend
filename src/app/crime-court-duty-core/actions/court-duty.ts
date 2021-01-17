import { TokenizeAction } from '../../core';
import { RateResponce } from '../../time-information-core';
import { InfoDialogType } from '../../core/utility/DpsUtility';
import { CourtDutyTimeRecord, CourtDutyData } from '../model/interface';
import { PaginatorDef } from './../../core/lib/grid-model';
import { MatterKeyInfor } from '../../core/lib/matter';

export const INIT_CRIME_COURT_DUTY = 'INIT_CRIME_COURT_DUTY';
export const CHANGE_MODEL = 'CRIME_COURT_DUTY_CHANGE_MODEL';
export const GET_CRIME_RATE_FILES = 'CRIME_COURT_GET_CRIME_RATE_FILES';
export const GET_CRIME_RATE_FILES_SUCCESS = 'CRIME_COURT_GET_CRIME_RATE_FILES_SUCCESS';
export const GET_CRIME_RATE_FILES_FAIL = 'CRIME_COURT_GET_CRIME_RATE_FILES_FAIL';
export const CLEAR_MODEL = 'CRIME_COURT_CLEAR_MODEL';
export const SAVE = 'CRIME_COURT_SAVE';
export const SAVE_SUCCESS = 'CRIME_COURT_SAVE_SUCCESS';
export const SAVE_FAIL = 'CRIME_COURT_SAVE_FAIL';
export const DELETE = 'CRIME_COURT_DELETE';
export const DELETE_SUCCESS = 'CRIME_COURT_DELETE_SUCCESS';
export const DELETE_FAIL = 'CRIME_COURT_DELETE_FAIL';
export const UPDATE_RATE = 'CRIME_COURT_UPDATE_RATE';
export const VALUES_CALCULATON = 'CRIME_COURT_VALUES_CALCULATON';
export const SHOW_MESSAGE = 'CRIME_COURT_SHOW_MESSAGE';
export const GET_TIME_RECORDS = 'CRIME_COURT_GET_TIME_RECORDS';
export const GET_TIME_RECORDS_SUCCESS = 'CRIME_COURT_GET_TIME_RECORDS_SUCCESS';
export const GET_TIME_RECORDS_FAIL = 'CRIME_COURT_GET_TIME_RECORDS_FAIL';
export const EDIT_TIME_RECORD = 'CRIME_COURT_GET_EDIT_TIME_RECORD';
export const EDIT_ITEM = 'CRIME_COURT_GET_EDIT_ITEM';
export const CHANGE_PAGE = 'CRIME_COURT_CHANGE_PAGE';
export const CHANGE_GRID_FILTER = 'CRIME_COURT_CHANGE_GRID_FILTER';
export const COURT_DUTY_CLOSED = 'CRIME_COURT_DUTY_CLOSED';
export const PRINT_DOC = 'CRIME_COURT_DUTY_PRINT_DOC';
export const PRINT_DOC_SUCCESS = 'CRIME_COURT_DUTY_PRINT_DOC_SUCCESS';
export const PRINT_DOC_FAIL = 'CRIME_COURT_DUTY_PRINT_DOC_FAIL';

export class InitCcourtDutyInformation extends TokenizeAction {
    readonly type = INIT_CRIME_COURT_DUTY;
    constructor(public token: string, public payload: { matterKeyInfor: MatterKeyInfor }) { super(token); }
}
export class ChangeModel extends TokenizeAction {
    readonly type = CHANGE_MODEL;
    constructor(public token: string, public payload: { key: string, value: any }, public changeBySystem?: boolean) { super(token); }
}

export class GetCrimeRateFiles extends TokenizeAction {
    readonly type = GET_CRIME_RATE_FILES;
    constructor(public token: string) {
        super(token);
    }
}
export class GetCrimeRateFilesSuccess extends TokenizeAction {
    readonly type = GET_CRIME_RATE_FILES_SUCCESS;
    constructor(public token: string, public payload: { ratesDataSource: RateResponce }) {
        super(token);
    }
}
export class GetCrimeRateFilesFail extends TokenizeAction {
    readonly type = GET_CRIME_RATE_FILES_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class ClearModel extends TokenizeAction {
    readonly type = CLEAR_MODEL;
    constructor(public token: string) {
        super(token);
    }
}

export class Save extends TokenizeAction {
    readonly type = SAVE;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveSuccess extends TokenizeAction {
    readonly type = SAVE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveFail extends TokenizeAction {
    readonly type = SAVE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class Delete extends TokenizeAction {
    readonly type = DELETE;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteSuccess extends TokenizeAction {
    readonly type = DELETE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteFail extends TokenizeAction {
    readonly type = DELETE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateRates extends TokenizeAction {
    readonly type = UPDATE_RATE;
    constructor(public token: string) {
        super(token);
    }
}

export class ValueCalculation extends TokenizeAction {
    readonly type = VALUES_CALCULATON;
    constructor(public token: string) {
        super(token);
    }
}

export class ShowMessage extends TokenizeAction {
    readonly type = SHOW_MESSAGE;
    constructor(public token: string, public title: string, public message: string, public messageType: InfoDialogType) {
        super(token);
    }
}

export class GetTimeRecords extends TokenizeAction {
    readonly type = GET_TIME_RECORDS;
    constructor(public token: string) {
        super(token);
    }
}

export class GetTimeRecordsSuccess extends TokenizeAction {
    readonly type = GET_TIME_RECORDS_SUCCESS;
    constructor(public token: string, public records: CourtDutyData) {
        super(token);
    }
}

export class GetTimeRecordsFail extends TokenizeAction {
    readonly type = GET_TIME_RECORDS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class EditItem extends TokenizeAction {
    readonly type = EDIT_ITEM;
    constructor(public token: string, public model: CourtDutyTimeRecord) {
        super(token);
    }
}

export class ChangePage extends TokenizeAction {
    readonly type = CHANGE_PAGE;
    constructor(public token: string, public def: PaginatorDef) {
        super(token);
    }
}

export class ChangeGridFilter extends TokenizeAction {
    readonly type = CHANGE_GRID_FILTER;
    constructor(public token: string, public payload: { key: string, value: any }) {
        super(token);
    }
}
export class CourtDutyClosed extends TokenizeAction {
    readonly type = COURT_DUTY_CLOSED;
    constructor(public token: string) {
        super(token);
    }
}

export class PrintDoc extends TokenizeAction {
    readonly type = PRINT_DOC;
    constructor(public token: string) {
        super(token);
    }
}
export class PrintDocSuccess extends TokenizeAction {
    readonly type = PRINT_DOC_SUCCESS;
    constructor(public token: string, public diaryId: number, public url: string) {
        super(token);
    }
}
export class PrintDocFail extends TokenizeAction {
    readonly type = PRINT_DOC_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export type Any = InitCcourtDutyInformation | ChangeModel | ClearModel | Save | SaveSuccess | SaveFail |
    Delete | DeleteSuccess | DeleteFail | GetCrimeRateFiles | GetCrimeRateFilesSuccess | GetCrimeRateFilesFail |
    UpdateRates | ValueCalculation | ShowMessage | GetTimeRecords | GetTimeRecordsSuccess | GetTimeRecordsFail | EditItem |
    ChangePage | ChangeGridFilter | CourtDutyClosed | PrintDoc | PrintDocSuccess | PrintDocFail;
