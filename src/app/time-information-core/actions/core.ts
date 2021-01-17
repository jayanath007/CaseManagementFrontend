import { Action } from '@ngrx/store';
import { TimeInformationInputData, FeeEarner } from '../../core/lib/crime-managment';
import { TimeInformationModel, RateChangeModel, TimeInformationParentModel, RateResponce } from '../models/interfaces';
import { ColumnDef } from '../../core/lib/grid-model';
import { AttType } from '../../core/lib/timeRecord';
import { LoockupItem, LookupType } from '../../shared';
import { CrimeTimeSettings } from './../../core/lib/crime-managment';
import { TokenizeAction } from '../../core';

export const INIT_TIME_INFORMATION = 'DPS_INIT_TIME_INFORMATION';
export const LOAD_FEEEARNER_LIST = 'DPS_TIME_INFORMATION_LOAD_FEEEARNER_LIST';
export const LOAD_FEEEARNER_LIST_SUCCESS = 'DPS_TIME_INFORMATION_LOAD_FEEEARNER_LIST_SUCCESS';
export const LOAD_FEEEARNER_LIST_FAIL = 'DPS_TIME_INFORMATION_LOAD_FEEEARNER_LIST_FAIL';


export const TIME_INFORMATION_MODEL_CHANGE = 'DPS_TIME_INFORMATION_MODEL_CHANGE';
export const TIME_INFORMATION_PARENT_MODEL_CHANGE = 'DPS_TIME_INFORMATION_PARENT_MODEL_CHANGE';

export const LOAD_ATT_TYPE_LIST = 'DPS_TIME_INFORMATION_LOAD_ATT_TYPE_LIST';
export const LOAD_ATT_TYPE_LIST_SUCCESS = 'DPS_TIME_INFORMATION_LOAD_ATT_TYPE_LIST_SUCCESS';
export const LOAD_ATT_TYPE_LIST_FAIL = 'DPS_TIME_INFORMATION_LOAD_ATT_TYPE_LIST_FAIL';
export const ATT_TYPE_LIST_CHANGE = 'DPS_ATT_TYPE_LIST_CHANGE_CHANGE';

// export const CHANGE_POLICE_STATION = 'DPS_TIME_INFORMATION_CHANGE_POLICE_STATION';

export const GET_CRIME_RATE_FILES = 'DPS_TIME_INFORMATION_GET_CRIME_RATE_FILES';
export const GET_CRIME_RATE_FILES_SUCCESS = 'DPS_TIME_INFORMATION_GET_CRIME_RATE_FILES_SUCCESS';
export const GET_CRIME_RATE_FILES_FAIL = 'DPS_TIME_INFORMATION_GET_CRIME_RATE_FILES_FAIL';

export const GET_TIME_RECORDS = 'DPS_TIME_INFORMATION_GET_TIME_RECORDS';
export const GET_TIME_RECORDS_SUCCESS = 'DPS_TIME_INFORMATION_GET_TIME_RECORDS_SUCCESS';
export const GET_TIME_RECORDS_FAIL = 'DPS_TIME_INFORMATION_GET_TIME_RECORDS_FAIL';

export const RATE_CALCULATION_UPDATE = 'DPS_TIME_INFORMATION_RATE_CALCULATION_UPDATE';

export const SELECT_GRID_ITEM = 'DPS_TIME_INFORMATION_SELECT_GRID_ITEM';

export const NEW_FORM = 'DPS_TIME_INFORMATION_NEW_FORM';

export const SAVE = 'DPS_TIME_INFORMATION_SAVE';
export const SAVE_SUCCESS = 'DPS_TIME_INFORMATION_SAVE_SUCCESS';
export const SAVE_FAIL = 'DPS_TIME_INFORMATION_SAVE_FAIL';

export const GET_RATE_PRECENTAGE = 'DPS_TIME_INFORMATION_GET_RATE_PRECENTAGE';
export const GET_RATE_PRECENTAGE_SUCCESS = 'DPS_TIME_INFORMATION_GET_RATE_PRECENTAGE_SUCCESS';
export const GET_RATE_PRECENTAGE_FAIL = 'DPS_TIME_INFORMATION_GET_RATE_PRECENTAGE_FAIL';

export const DELETE = 'DPS_TIME_INFORMATION_DELETE';
export const DELETE_SUCCESS = 'DPS_TIME_INFORMATION_DELETE_SUCCESS';
export const DELETE_FAIL = 'DPS_TIME_INFORMATION_DELETE_FAIL';

export const CLOSE_POPUP = 'DPS_TIME_INFORMATION_CLOSE_POPUP';
export const PRINT_DOC = 'DPS_TIME_INFORMATION_PRINT_DOC';
// export const SET_EDIT_DATA = 'DPS_TIME_INFORMATIN_SET_EDIT_DATA';

export const GET_ASSISTANCE_DATA = 'DPS_GET_ASSISTANCE_DATA_SAVE';
export const GET_ASSISTANCE_DATA_SUCCESS = 'DPS_GET_ASSISTANCE_DATA_SUCCESS';
export const GET_ASSISTANCE_DATA_FAIL = 'DPS_GET_ASSISTANCE_DATA_FAIL';

export const GET_ATTENDEES_WORK_LOOKUP_DATA = 'DPS_TIME_INFO_GET_ATTENDEES_WORK_LOOKUP_DATA';
export const GET_ATTENDEES_WORK_LOOKUP_DATA_SUCCESS = 'DPS_TIME_INFO_GET_ATTENDEES_WORK_LOOKUP_DATA_SUCCESS';
export const GET_ATTENDEES_WORK_LOOKUP_DATA_FAIL = 'DPS_TIME_INFO_GET_ATTENDEES_WORK_LOOKUP_DATA_FAIL';

export const OPEN_PRICE_CAP_LIMIT_POPUP = 'DPS_TIME_INFORMATION_OPEN_PRICE_CAP_LIMIT_POPUP';
export const OPEN_LOOKUP_POPUP = 'DPS_TIME_INFORMATION_OPEN_LOOKUP_POPUP';
export const SELECT_LOOKUP_DATA = 'DPS_TIME_INFO_SELECT_LOOKUP_DATA';
export const SET_SETTINGS = 'DPS_TIME_INFO_SET_SETTINGS';
export const CLASS_CHANGE = 'DPS_TIME_INFO_CLASS_CHANGE';
export const FEE_EARNER_CHANGE = 'DPS_TIME_INFO_FEE_EARNER_CHANGE';

export class InitTimeInformation extends TokenizeAction implements Action {
    readonly type = INIT_TIME_INFORMATION;
    constructor(public token: string, public payload: {
        inputData: TimeInformationInputData,
        columnDef: ColumnDef[],
        timeOffset: number
    }) {
        super(token);
    }
}

export class TimeInformationModelChange extends TokenizeAction implements Action {
    readonly type = TIME_INFORMATION_MODEL_CHANGE;
    constructor(public token: string, public payload: { model: TimeInformationModel }) {
        super(token);
    }
}

export class AttTypeListChange extends TokenizeAction implements Action {
    readonly type = ATT_TYPE_LIST_CHANGE;
    constructor(public token: string, public payload: { attTypeId: number, timeOffset: number }) {
        super(token);
    }
}

export class TimeInformationParentModelChange extends TokenizeAction implements Action {
    readonly type = TIME_INFORMATION_PARENT_MODEL_CHANGE;
    constructor(public token: string, public payload: { model: TimeInformationParentModel }) {
        super(token);
    }
}


export class RateCalculationUpdate extends TokenizeAction implements Action {
    readonly type = RATE_CALCULATION_UPDATE;
    constructor(public token: string, public payload: {
        model: TimeInformationModel,
        value: any,
        timeOffset: number
    }) {
        super(token);
    }
}


export class GetCrimeRateFiles extends TokenizeAction implements Action {
    readonly type = GET_CRIME_RATE_FILES;
    constructor(public token: string, public classId: number) {
        super(token);
    }
}
export class GetCrimeRateFilesSuccess extends TokenizeAction implements Action {
    readonly type = GET_CRIME_RATE_FILES_SUCCESS;
    constructor(public token: string, public payload: {
        ratesDataSource: RateResponce,
        // rateChanges: RateChangeModel[],
        timeOffset: number
    }) {
        super(token);
    }
}
export class GetCrimeRateFilesFail extends TokenizeAction implements Action {
    readonly type = GET_CRIME_RATE_FILES_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarner[] }) {
        super(token);
    }
}
export class LoadFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadAttTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadAttTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { attTypes: AttType[] }) {
        super(token);
    }
}
export class LoadAttTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
// export class ChangePoliceStation extends TokenizeAction implements Action {
//     readonly type = CHANGE_POLICE_STATION;
//     constructor(public token: string, public payload: { nameAndID: string }) {
//         super(token);
//     }
// }

export class GetTimeRecords extends TokenizeAction implements Action {
    readonly type = GET_TIME_RECORDS;
    constructor(public token: string) {
        super(token);
    }
}
export class GetTimeRecordsSuccess extends TokenizeAction implements Action {
    readonly type = GET_TIME_RECORDS_SUCCESS;
    constructor(public token: string, public payload: { timeRecordGridItem: TimeInformationModel[] }) {
        super(token);
    }
}
export class GetTimeRecordsFail extends TokenizeAction implements Action {
    readonly type = GET_TIME_RECORDS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class SelectGridItem extends TokenizeAction implements Action {
    readonly type = SELECT_GRID_ITEM;
    constructor(public token: string, public payload: { item: TimeInformationModel }) {
        super(token);
    }
}

export class NewForm extends TokenizeAction implements Action {
    readonly type = NEW_FORM;
    constructor(public token: string, public payload: { timeOffset: number }) {
        super(token);
    }
}

export class GetRateRrecentage extends TokenizeAction implements Action {
    readonly type = GET_RATE_PRECENTAGE;
    constructor(public token: string) {
        super(token);
    }
}
export class GetRateRrecentageSuccess extends TokenizeAction implements Action {
    readonly type = GET_RATE_PRECENTAGE_SUCCESS;
    constructor(public token: string, public payload: { rate: RateChangeModel }) {
        super(token);
    }
}
export class GetRateRrecentageFail extends TokenizeAction implements Action {
    readonly type = GET_RATE_PRECENTAGE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveTimeRecords extends TokenizeAction implements Action {
    readonly type = SAVE;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveTimeRecordsSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveTimeRecordsFail extends TokenizeAction implements Action {
    readonly type = SAVE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteTimeRecords extends TokenizeAction implements Action {
    readonly type = DELETE;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteTimeRecordsSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteTimeRecordsFail extends TokenizeAction implements Action {
    readonly type = DELETE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class ClosePopup extends TokenizeAction implements Action {
    readonly type = CLOSE_POPUP;
    constructor(public token: string) {
        super(token);
    }
}
export class PrintDoc extends TokenizeAction implements Action {
    readonly type = PRINT_DOC;
    constructor(public token: string) {
        super(token);
    }
}
// export class SetEditData extends TokenizeAction implements Action {
//     readonly type = SET_EDIT_DATA;
//     constructor(public token: string) {
//         super(token);
//     }
// }

export class GetAssistanceData extends TokenizeAction implements Action {
    readonly type = GET_ASSISTANCE_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class GetAssistanceDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_ASSISTANCE_DATA_SUCCESS;
    constructor(public token: string, public payload: {
        adciceAssistanceLimit: number;
        adciceAssistanceCurrentTotal: number;
    }) {
        super(token);
    }
}
export class GetAssistanceDataFail extends TokenizeAction implements Action {
    readonly type = GET_ASSISTANCE_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class OpenExideLimitPopup extends TokenizeAction implements Action {
    readonly type = OPEN_PRICE_CAP_LIMIT_POPUP;
    constructor(public token) {
        super(token);
    }
}

export class GetAttendeesAndWorkLookupData extends TokenizeAction implements Action {
    readonly type = GET_ATTENDEES_WORK_LOOKUP_DATA;
    constructor(public token, public lookupType: LookupType, public property: string) {
        super(token);
    }
}

export class GetAttendeesAndWorkLookupDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_ATTENDEES_WORK_LOOKUP_DATA_SUCCESS;
    constructor(public token: string,
        public lookupType: LookupType, public property: string, public data: LoockupItem[]) {
        super(token);
    }
}

export class GetAttendeesAndWorkLookupDataFail extends TokenizeAction implements Action {
    readonly type = GET_ATTENDEES_WORK_LOOKUP_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class OpenLoockupPopup extends TokenizeAction implements Action {
    readonly type = OPEN_LOOKUP_POPUP;
    constructor(public token, public lookupType: LookupType, public property: string, public lookupList: LoockupItem[]) {
        super(token);
    }
}

export class SelectLookupData extends TokenizeAction implements Action {
    readonly type = SELECT_LOOKUP_DATA;
    constructor(public token, public lookupType: LookupType, public property: string, public selectItem: LoockupItem) {
        super(token);
    }
}

export class SetSetting extends TokenizeAction implements Action {
    readonly type = SET_SETTINGS;
    constructor(public token, public setting: CrimeTimeSettings, public timeOffset: number) {
        super(token);
    }
}

export class ClassChange extends TokenizeAction {
    readonly type = CLASS_CHANGE;
    constructor(public token, public classId: number, public columnDef: ColumnDef[]) {
        super(token);
    }
}

export class FeeEarnerChange extends TokenizeAction {
    readonly type = FEE_EARNER_CHANGE;
    constructor(public token, public feeEarner: FeeEarner) {
        super(token);
    }
}



export type Any = InitTimeInformation | LoadFeeEarnerList | LoadFeeEarnerListSuccess | LoadFeeEarnerListFail |
    LoadAttTypeList | LoadAttTypeListSuccess | LoadAttTypeListFail | TimeInformationModelChange |
    GetCrimeRateFiles | GetCrimeRateFilesSuccess | GetCrimeRateFilesFail | RateCalculationUpdate |
    GetTimeRecords | GetTimeRecordsSuccess | GetTimeRecordsFail | SelectGridItem | NewForm |
    SaveTimeRecords | SaveTimeRecordsSuccess | SaveTimeRecordsFail | GetRateRrecentage | GetRateRrecentageSuccess | GetRateRrecentageFail |
    DeleteTimeRecords | DeleteTimeRecordsSuccess | DeleteTimeRecordsFail | ClosePopup | PrintDoc |
    TimeInformationParentModelChange | GetAssistanceData | GetAssistanceDataSuccess | GetAssistanceDataFail | AttTypeListChange |
    OpenExideLimitPopup | GetAttendeesAndWorkLookupData | GetAttendeesAndWorkLookupDataSuccess | GetAttendeesAndWorkLookupDataFail |
    OpenLoockupPopup | SelectLookupData | SetSetting | ClassChange | FeeEarnerChange;

