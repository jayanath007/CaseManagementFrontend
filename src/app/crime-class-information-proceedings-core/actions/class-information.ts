import { CrimeClassTotalsSummaryViewModel } from './../../core/lib/crime-managment';
import { TokenizeAction } from '../../core';
import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';
import { ModelProperty } from '../models/enum';
import { InfoDialogType } from '../../core/utility/DpsUtility';
import { LookupType, LoockupItem } from '../../shared';
import { ProceedingClassInfoViewModal, TotalData, ProceedingClassInfoResponce } from '../models/interfaces';

export const INIT_PROCEEDING_CASE_INFORMATION = 'DPS_INIT_PROCEEDING_CASE_INFORMATION';
// export const GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO = `DPS_GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO`;
// export const GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS = `DPS_GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS`;
// export const GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO_FAIL = `DPS_GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO_FAIL`;
// export const GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO = `DPS_GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO`;
// export const GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS = `DPS_GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS`;
// export const GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO_FAIL = `DPS_GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO_FAIL`;
// export const GET_OUT_COME_CODE_VALUES_FOR_PROEEDING_CLS_INFO = `DPS_GET_OUT_COME_CODE_VALUES_FOR_PROEEDING_CLS_INFO`;
// export const GET_OUT_COME_CODE_VALUES_SUCCESS_FOR_PROEEDING_CLS_INFO = `GET_OUT_COME_CODE_VALUES_SUCCESS_FOR_PROEEDING_CLS_INFO`;
// export const GET_OUT_COME_CODE_VALUES_FAIL_FOR_PROEEDING_CLS_INFO = `GET_OUT_COME_CODE_VALUES_FAIL_FOR_PROEEDING_CLS_INFO`;
// export const GET_CASE_TYPE_FOR_PROEEDING_CLS_INFO = `DPS_GET_CASE_TYPE_FOR_PROEEDING_CLS_INFO`;
// export const GET_CASE_TYPE_SUCCESS_FOR_PROEEDING_CLS_INFO = `GET_CASE_TYPE_SUCCESS_FOR_PROEEDING_CLS_INFO`;
// export const GET_CASE_TYPE_FAIL_FOR_PROEEDING_CLS_INFO = `GET_CASE_TYPE_FAIL_FOR_PROEEDING_CLS_INFO`;
export const CHANGE_MODEL = 'PROCEEDING_CASE_INFO_CHANGE_MODEL';
export const REQUEST_TO_CHANGE_MODEL = 'PROCEEDING_CASE_INFO_REQUEST_TO_CHANGE_MODEL';
export const REQUEST_TO_SAVE = 'PROCEEDING_CASE_INFO_REQUEST_TO_SAVE';
export const SAVE = 'PROCEEDING_CASE_INFO_SAVE';
export const SAVE_SUCCESS = 'PROCEEDING_CASE_INFO_SAVE_SUCCESS';
export const SAVE_FAIL = 'PROCEEDING_CASE_INFO_SAVE_FAIL';
export const SHOW_MESSAGE = 'PROCEEDING_CASE_SHOW_MESSAGE';
export const OPEN_LOOKUP_POPUP = 'PROCEEDING_CASE_OPEN_LOOKUP_POPUP';
export const GET_LOCATION_LOOKUP_DATA = 'PROCEEDING_CASE_GET_LOCATION_LOOKUP_DATA';
export const GET_LOCATION_LOOKUP_DATA_SUCCESS = 'PROCEEDING_CASE_GET_LOCATION_LOOKUP_DATA_SUCCESS';
export const GET_LOCATION_LOOKUP_DATA_FAIL = 'PROCEEDING_CASE_GET_LOCATION_LOOKUP_DATA_FAIL';
export const GET_CLASS_INFO = 'PROCEEDING_CASE_GET_CLASS_INFO';
export const GET_CLASS_INFO_SUCCESS = 'PROCEEDING_CASE_GET_CLASS_INFO_SUCCESS';
export const GET_CLASS_INFO_FAIL = 'PROCEEDING_CASE_GET_CLASS_INFO_FAIL';
export const GET_CLASS_TOTAL = 'PROCEEDING_CASE_GET_CLASS_TOTAL';
export const GET_CLASS_TOTAL_SUCCESS = 'PROCEEDING_CASE_GET_CLASS_TOTAL_SUCCESS';
export const GET_CLASS_TOTAL_FAIL = 'PROCEEDING_CASE_GET_CLASS_TOTAL_FAIL';
export const CLOSE_CLASS = 'PROCEEDING_CASE_CLOSE_CLASS';
export const RE_OPEN_CLASS = 'PROCEEDING_CASE_RE_OPEN_CLASS';

export class InitCrimeProceedingClassInfo extends TokenizeAction {
    readonly type = INIT_PROCEEDING_CASE_INFORMATION;
    constructor(public token: string, public crimeClassIdentityViewModel: CrimeClassIdentityViewModel) {
        super(token);
    }
}

export class GetClassInfo extends TokenizeAction {
    readonly type = GET_CLASS_INFO;
    constructor(public token: string, public request: CrimeClassIdentityViewModel) {
        super(token);
    }
}
export class GetClassInfoSuccess extends TokenizeAction {
    readonly type = GET_CLASS_INFO_SUCCESS;
    constructor(public token: string, public data: ProceedingClassInfoResponce) {
        super(token);
    }
}
export class GetClassInfoFail extends TokenizeAction {
    readonly type = GET_CLASS_INFO_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class GetClassTotal extends TokenizeAction {
    readonly type = GET_CLASS_TOTAL;
    constructor(public token: string) {
        super(token);
    }
}
export class GetClassTotalSuccess extends TokenizeAction {
    readonly type = GET_CLASS_TOTAL_SUCCESS;
    constructor(public token: string, public totalData: TotalData) {
        super(token);
    }
}
export class GetClassTotalFail extends TokenizeAction {
    readonly type = GET_CLASS_TOTAL_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

// export class GetStageReachedValues extends TokenizeAction {
//     readonly type = GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO;
//     constructor(public token: string, public request: CrimeClassIdentityViewModel) {
//         super(token);
//     }
// }
// export class GetStageReachedValuesSuccess extends TokenizeAction {
//     readonly type = GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS;
//     constructor(public token: string, public list: string[]) {
//         super(token);
//     }
// }
// export class GetStageReachedValuesFail extends TokenizeAction {
//     readonly type = GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO_FAIL;
//     constructor(public token: string) {
//         super(token);
//     }
// }

// export class GetMatterTypeValues {
//     readonly type = GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO;
//     constructor(public token: string, public request: CrimeClassIdentityViewModel) {

//     }
// }
// export class GetMatterTypeValuesSuccess {
//     readonly type = GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO_SUCCESS;
//     constructor(public token: string, public list: string[]) {

//     }
// }
// export class GetMatterTypeValuesFail {
//     readonly type = GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO_FAIL;
//     constructor(public token: string) {

//     }
// }

// export class GetOutComeCodeValues {
//     readonly type = GET_OUT_COME_CODE_VALUES_FOR_PROEEDING_CLS_INFO;
//     constructor(public token: string, public request: CrimeClassIdentityViewModel) { }
// }

// export class GetOutComeCodeValuesSuccess {
//     readonly type = GET_OUT_COME_CODE_VALUES_SUCCESS_FOR_PROEEDING_CLS_INFO;
//     constructor(public token: string, public list: string[]) {
//     }
// }

// export class GetOutComeCodeValuesFail {
//     readonly type = GET_OUT_COME_CODE_VALUES_FAIL_FOR_PROEEDING_CLS_INFO;
//     constructor(public token: string) { }
// }

// export class GetCaseTypeValues {
//     readonly type = GET_CASE_TYPE_FOR_PROEEDING_CLS_INFO;
//     constructor(public token, public request: CrimeClassIdentityViewModel) { }
// }

// export class GetCaseTypeValuesSuccess {
//     readonly type = GET_CASE_TYPE_SUCCESS_FOR_PROEEDING_CLS_INFO;
//     constructor(public token, public list: string[]) {
//     }
// }

// export class GetCaseTypeValuesFail {
//     readonly type = GET_CASE_TYPE_FAIL_FOR_PROEEDING_CLS_INFO;
//     constructor(public token) { }
// }

export class RequestToChangeModel extends TokenizeAction {
    readonly type = REQUEST_TO_CHANGE_MODEL;
    constructor(public token, public event: { key: ModelProperty, value: any }) {
        super(token);
    }
}


export class ChangeModel extends TokenizeAction {
    readonly type = CHANGE_MODEL;
    constructor(public token, public event: { key: ModelProperty, value: any }) {
        super(token);
    }
}

export class RequestToSave extends TokenizeAction {
    readonly type = REQUEST_TO_SAVE;
    constructor(public token) {
        super(token);
    }
}
export class Save extends TokenizeAction {
    readonly type = SAVE;
    constructor(public token, public model: ProceedingClassInfoViewModal) {
        super(token);
    }
}

export class SaveSuccess extends TokenizeAction {
    readonly type = SAVE_SUCCESS;
    constructor(public token) {
        super(token);
    }
}

export class SaveFail extends TokenizeAction {
    readonly type = SAVE_FAIL;
    constructor(public token) {
        super(token);
    }
}

export class ShowMessage extends TokenizeAction {
    readonly type = SHOW_MESSAGE;
    constructor(public token: string, public title: string, public message: string, public messageType: InfoDialogType) {
        super(token);
    }
}
export class OpenLoockupPopup extends TokenizeAction {
    readonly type = OPEN_LOOKUP_POPUP;
    constructor(public token, public lookupType: LookupType, public data: LoockupItem[], public searchText: string) {
        super(token);
    }
}


export class GetLocationLookupData extends TokenizeAction {
    readonly type = GET_LOCATION_LOOKUP_DATA;
    constructor(public token, public lookupType: LookupType, public searchText: string) {
        super(token);
    }
}

export class GetLocationLookupDataSuccess extends TokenizeAction {
    readonly type = GET_LOCATION_LOOKUP_DATA_SUCCESS;
    constructor(public token: string,
        public lookupType: LookupType, public data: LoockupItem[], public searchText: string) {
        super(token);
    }
}

export class GetLocationLookupDataFail extends TokenizeAction {
    readonly type = GET_LOCATION_LOOKUP_DATA_FAIL;
    constructor(public token) {
        super(token);
    }
}

export class CloseClass extends TokenizeAction {
    readonly type = CLOSE_CLASS;
    constructor(public token) {
        super(token);
    }
}

export class ReOpennClass extends TokenizeAction {
    readonly type = RE_OPEN_CLASS;
    constructor(public token) {
        super(token);
    }
}

// export class GetProClassTotalsSummary extends TokenizeAction {
//     readonly type = GET_PROCEEDING_CASE_TOTALS_SUMMARY;
//     constructor(public token: string) {
//         super(token);
//     }
// }

// export class GetProClassTotalsSummarySuccess extends TokenizeAction {
//     readonly type = GET_PROCEEDING_CASE_TOTALS_SUMMARY_SUCCESS;
//     constructor(public token: string, public data: CrimeClassTotalsSummaryViewModel) {
//         super(token);
//     }
// }

// export class GetProClassTotalsSummaryFail extends TokenizeAction {
//     readonly type = GET_PROCEEDING_CASE_TOTALS_SUMMARY_FAIL;
//     constructor(public token: string) {
//         super(token);
//     }
// }

export type Any = InitCrimeProceedingClassInfo |
    // GetStageReachedValues | GetStageReachedValuesSuccess | GetStageReachedValuesFail |
    // GetMatterTypeValues | GetMatterTypeValuesSuccess | GetMatterTypeValuesFail |
    // GetOutComeCodeValues | GetOutComeCodeValuesSuccess | GetOutComeCodeValuesFail |
    // GetCaseTypeValues | GetCaseTypeValuesSuccess | GetCaseTypeValuesFail |
    RequestToChangeModel | ChangeModel | RequestToSave | Save | SaveSuccess | SaveFail | ShowMessage | OpenLoockupPopup |
    GetLocationLookupData | GetLocationLookupDataSuccess | GetLocationLookupDataFail |
    GetClassInfo | GetClassInfoSuccess | GetClassInfoFail | GetClassTotal | GetClassTotalSuccess | GetClassTotalFail |
    CloseClass | ReOpennClass;
