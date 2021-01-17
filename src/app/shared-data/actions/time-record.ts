import { Action } from '@ngrx/store';
import { ClassObj } from './../../crime-management-core/models/interfaces';
export const OPEN_TIME_RECORD_POPUP_REQUEST = 'SHARED_DATA_OPEN_TIME_RECORD_POPUP_REQUEST';
import { OpenTimeValidation, AddTimeType, CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { CrimeTimeSettings } from '../../core/lib/crime-managment';

export const GET_TIME_RECORD_TYPE = 'SHARED_DATA_GET_TIME_RECORD_TYPE';
export const OPEN_GENARAL_TIME_RECORD = 'SHARED_DATA_OPEN_GENARAL_TIME_RECORD';
export const OPEN_CRIME_TIME_MANAGER = 'SHARED_DATA_OPEN_CRIME_TIME_MANAGER';
export const OPEN_CRIME_TIME_INFORMATION = 'SHARED_DATA_OPEN_CRIME_TIME_INFORMATION';
export const OPEN_CIVIL_TIME_RECORD = 'SHARED_DATA_OPEN_CIVIL_TIME_RECORD';
// export const OPEN_AGFS_TIME_INFORMATION = 'SHARED_DATA_OPEN_AGFS_TIME_INFORMATION';
// export const SELECT_THE_CLASS_CATEGORY = 'SHARED_DATA_SELECT_THE_CLASS_CATEGORY';
export const SHOW_NOT_SUPPORTED_MSG = 'SHARED_DATA_SHOW_NOT_SUPPORTED_MSG';
export const GET_CRIME_CLASS_LIST = 'SHARED_DATA_GET_CRIME_CLASS_LIST';
export const GET_CRIME_CLASS_LIST_SUCCESS = 'SHARED_DATA_GET_CLASS_SUCCESS';
export const GET_CRIME_CLASS_LIST_FAIL = 'SHARED_DATA_GET_CLASS_FAIL';
export const TIME_RECORD_CLOSE = 'SHARED_DATA_TIME_RECORD_CLOSE';
export const CRIME_TIME_LOADING_SETTINGS = 'SHARED_DATA_CRIME_TIME_LOADING_SETTINGS';
export const CRIME_TIME_LOADING_SETTINGS_SUCCESS = 'SHARED_DATA_CRIME_TIME_LOADING_SETTINGS_SUCCESS';
export const CRIME_TIME_LOADING_SETTINGS_FAIL = 'SHARED_DATA_CRIME_TIME_LOADING_SETTINGS_FAIL';
export const CANCEL_TIME_RECORD_OPENING = 'SHARED_DATA_CANCEL_TIME_RECORD_OPENING';



export class OpenTimeRecordPopupRequest implements Action {
    readonly type = OPEN_TIME_RECORD_POPUP_REQUEST;
    constructor(public token: string, public data: OpenTimeValidation) { }
}

export class GetTimeRecordType implements Action {
    readonly type = GET_TIME_RECORD_TYPE;
    constructor(public token: string, public timeType: AddTimeType) { }
}

export class OpenGenaralTimeRecord implements Action {
    readonly type = OPEN_GENARAL_TIME_RECORD;
    constructor(public token: string) { }
}

export class OpenCrimeTimeManager implements Action {
    readonly type = OPEN_CRIME_TIME_MANAGER;
    constructor(public token: string) { }
}

export class ShowNotSupportedMSG implements Action {
    readonly type = SHOW_NOT_SUPPORTED_MSG;
    constructor(public token: string, public msg: string) { }
}

export class GetCrimeClassList implements Action {
    readonly type = GET_CRIME_CLASS_LIST;
    constructor(public token: string) { }
}

export class GetCrimeClassListSuccess implements Action {
    readonly type = GET_CRIME_CLASS_LIST_SUCCESS;
    constructor(public token: string, public payload: { list: ClassObj[] }) { }
}

export class GetCrimeClassListFail implements Action {
    readonly type = GET_CRIME_CLASS_LIST_FAIL;
    constructor() { }
}

export class TimeRecordClose implements Action {
    readonly type = TIME_RECORD_CLOSE;
    constructor(public token, public success: boolean) { }
}

export class OpenCrimeTimeInformation implements Action {
    readonly type = OPEN_CRIME_TIME_INFORMATION;
    constructor(public token) { }
}

// export class OpenAGFSTimeInformation implements Action {
//     readonly type = OPEN_AGFS_TIME_INFORMATION;
//     constructor(public token) { }
// }

// export class SelectClassCategory implements Action {
//     readonly type = SELECT_THE_CLASS_CATEGORY;
//     constructor(public token) { }
// }

export class CrimeTimeLoadingSetting implements Action {
    readonly type = CRIME_TIME_LOADING_SETTINGS;
    constructor(public token, public classModal: CrimeClassIdentityViewModel, public needRefresh?: boolean) { }
}
export class CrimeTimeLoadingSettingSuccess implements Action {
    readonly type = CRIME_TIME_LOADING_SETTINGS_SUCCESS;
    constructor(public token, public classModal: CrimeClassIdentityViewModel, public settings: CrimeTimeSettings) { }
}
export class CrimeTimeLoadingSettingFail implements Action {
    readonly type = CRIME_TIME_LOADING_SETTINGS_FAIL;
    constructor() { }
}

export class CancelTimeRecordOpening implements Action {
    readonly type = CANCEL_TIME_RECORD_OPENING;
    constructor() { }
}


export class OpenCivilTimeRecord implements Action {
    readonly type = OPEN_CIVIL_TIME_RECORD;
    constructor(public token: string) { }
}

export type Any = GetCrimeClassList | GetCrimeClassListSuccess | GetCrimeClassListFail | OpenTimeRecordPopupRequest
    | GetTimeRecordType | OpenGenaralTimeRecord | OpenCrimeTimeManager | ShowNotSupportedMSG | TimeRecordClose | OpenCrimeTimeInformation
    | CrimeTimeLoadingSetting | CrimeTimeLoadingSettingSuccess | CrimeTimeLoadingSettingFail
    | CancelTimeRecordOpening | OpenCivilTimeRecord;
