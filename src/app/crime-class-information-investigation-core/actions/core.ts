import { CrimeClassTotalsSummaryViewModel } from './../../core/lib/crime-managment';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core/lib/actions';
import { CCInvestigationInfoInput } from '../../core/lib/crime-managment';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import {
    InvestigationClassInfo,
    InvClassCurrentTotalsViewModel, PoliceStationInfoViewModel
} from '../models/interfaces';
import { ModelProperty } from './../models/enum';
import { InfoDialogType } from '../../core/utility/DpsUtility';

export const INIT_CRIME_INFORMATION = 'DPS_INIT_CRIME_INVESTIGATION_INFORMATION';
export const GET_CLASS_INFO = 'DPS_GET_CII_CLASS_INFO';
export const GET_CLASS_INFO_SUCCESS = 'DPS_GET_CII_CLASS_INFO_SUCCESS';
export const GET_CLASS_INFO_FAIL = 'DPS_GET_CII_CLASS_INFO_FAIL';
export const GET_STAGE_REACHED_VALUES_FOR_INVCLASS = `DPS_GET_CII_STAGE_REACHED_VALUES_FOR_INVCLASS`;
export const GET_STAGE_REACHED_VALUES_FOR_INVCLASS_SUCCESS = `DPS_GET_CII_STAGE_REACHED_VALUES_FOR_INVCLASS_SUCCESS`;
export const GET_STAGE_REACHED_VALUES_FOR_INVCLASS_FAIL = `DPS_GET_CII_STAGE_REACHED_VALUES_FOR_INVCLASS_FAIL`;
export const GET_MATTER_TYPE_VALUES_FOR_INV_CLASS = `DPS_GET_CII_MATTER_TYPE_VALUES_FOR_INV_CLASS`;
export const GET_MATTER_TYPE_VALUES_FOR_INV_CLASS_SUCCESS = `DPS_GET_CII_MATTER_TYPE_VALUES_FOR_INV_CLASS_SUCCESS`;
export const GET_MATTER_TYPE_VALUES_FOR_INV_CLASS_FAIL = `DPS_GET_CII_MATTER_TYPE_VALUES_FOR_INV_CLASS_FAIL`;
export const GET_OUT_COME_CODE_VALUES = `DPS_GET_CII_GET_OUT_COME_CODE_VALUES`;
export const GET_OUT_COME_CODE_VALUES_SUCCESS = `DPS_GET_CII_GET_OUT_COME_CODE_VALUES_SUCCESS`;
export const GET_OUT_COME_CODE_VALUES_FAIL = `DPS_GET_CII_GET_OUT_COME_CODE_VALUES_FAIL`;
export const CHANGE_MODEL = 'DPS_CHANGE_CII_MODEL';
// export const OPEN_POLICE_ST_SEARCH = 'DPS_CII_OPEN_POLICE_ST_SEARCH';
export const SAVE = 'DPS_CII_SAVE';
export const SAVE_SUCCESS = 'DPS_CII_SAVE_SUCCESS';
export const SAVE_FAIL = 'DPS_CII_SAVE_FAIL';
export const GET_INV_CLASS_TOTALS_SUMMARY = 'DPS_CII_GET_INV_CLASS_TOTALS_SUMMARY';
export const GET_INV_CLASS_TOTALS_SUMMARY_SUCCESS = 'DPS_CII_GET_INV_CLASS_TOTALS_SUMMARY_SUCCESS';
export const GET_INV_CLASS_TOTALS_SUMMARY_FAIL = 'DPS_CII_GET_INV_CLASS_TOTALS_SUMMARY_FAIL';
export const GET_INV_CLASS_CURRENT_TOTALS = 'DPS_CII_GET_INV_CLASS_CURRENT_TOTALS';
export const GET_INV_CLASS_CURRENT_TOTALS_SUCCESS = 'DPS_CII_GET_INV_CLASS_CURRENT_TOTALS_SUCCESS';
export const GET_INV_CLASS_CURRENT_TOTALS_FAIL = 'DPS_CII_GET_INV_CLASS_CURRENT_TOTALS_FAIL';
export const GET_POLICE_STATION_INFO_BY_ID = 'DPS_CII_GET_POLICE_STATION_INFO_BY_ID';
export const GET_POLICE_STATION_INFO_BY_ID_SUCCESS = 'DPS_CII_GET_POLICE_STATION_INFO_BY_ID_SUCCESS';
export const GET_POLICE_STATION_INFO_BY_ID_FAIL = 'DPS_CII_GET_POLICE_STATION_INFO_BY_ID_FAIL';
export const CHECK_CLOSE_CLASS = 'DPS_CII_CHECK_CLOSE_CLASS';
export const CHECK_CLOSE_CLASS_SUCCESS = 'DPS_CII_CHECK_CLOSE_CLASS_SUCCESS';
export const CHECK_CLOSE_CLASS_FAIL = 'DPS_CII_CHECK_CLOSE_CLASS_FAIL';
export const REOPEN_CLASS = 'DPS_CII_REOPEN_CLASS';
export const OPEN_CLASS_INFO_POPUP = 'DPS_CII_OPEN_CLASS_INFO_POPUP';
export const VALIDATION_MESSAGE = 'DPS_CLI_VALIDATION_MESSAGE';

export class InitCrimeInformation extends TokenizeAction implements Action {
    readonly type = INIT_CRIME_INFORMATION;
    constructor(public token: string,
        public inputData: CCInvestigationInfoInput
    ) { super(token); }
}

export class GetClassInfo extends TokenizeAction implements Action {
    readonly type = GET_CLASS_INFO;
    constructor(public token: string, public request: CrimeClassIdentityViewModel) {
        super(token);
    }
}

export class GetClassInfoSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLASS_INFO_SUCCESS;
    constructor(public token: string, public infomation: InvestigationClassInfo) {
        super(token);
    }
}

export class GetClassInfoFail extends TokenizeAction implements Action {
    readonly type = GET_CLASS_INFO_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class GetStageReachedValuesForInvClass extends TokenizeAction implements Action {
    readonly type = GET_STAGE_REACHED_VALUES_FOR_INVCLASS;
    constructor(public token: string, public request: CrimeClassIdentityViewModel) {
        super(token);
    }
}
export class GetStageReachedValuesForInvClassSuccess extends TokenizeAction implements Action {
    readonly type = GET_STAGE_REACHED_VALUES_FOR_INVCLASS_SUCCESS;
    constructor(public token: string, public list: string[]) {
        super(token);
    }
}
export class GetStageReachedValuesForInvClassFail extends TokenizeAction implements Action {
    readonly type = GET_STAGE_REACHED_VALUES_FOR_INVCLASS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class GetMatterTypeValuesForInvClass implements Action {
    readonly type = GET_MATTER_TYPE_VALUES_FOR_INV_CLASS;
    constructor(public request: CrimeClassIdentityViewModel) {

    }
}
export class GetMatterTypeValuesForInvClassSuccess implements Action {
    readonly type = GET_MATTER_TYPE_VALUES_FOR_INV_CLASS_SUCCESS;
    constructor(public list: string[]) {

    }
}
export class GetMatterTypeValuesForInvClassFail implements Action {
    readonly type = GET_MATTER_TYPE_VALUES_FOR_INV_CLASS_FAIL;
    constructor() {

    }
}

export class GetOutComeCodeValuesForInvClses implements Action {
    readonly type = GET_OUT_COME_CODE_VALUES;
    constructor(public request: CrimeClassIdentityViewModel) { }
}

export class GetOutComeCodeValuesForInvClassSuccess implements Action {
    readonly type = GET_OUT_COME_CODE_VALUES_SUCCESS;
    constructor(public list: string[]) {
    }
}

export class GetOutComeCodeValuesForInvClsesFail implements Action {
    readonly type = GET_OUT_COME_CODE_VALUES;
    constructor() { }
}

export class ChangeModel extends TokenizeAction implements Action {
    readonly type = CHANGE_MODEL;
    constructor(public token, public event: { key: ModelProperty, value: any }) {
        super(token);
    }
}
// export class OpenPoliceStSearch extends TokenizeAction implements Action {
//     readonly type = OPEN_POLICE_ST_SEARCH;
//     constructor(public token, public searchText: string) {
//         super(token);
//     }
// }

export class Save extends TokenizeAction implements Action {
    readonly type = SAVE;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveFail extends TokenizeAction implements Action {
    readonly type = SAVE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class GetInvClassTotalsSummary extends TokenizeAction implements Action {
    readonly type = GET_INV_CLASS_TOTALS_SUMMARY;
    constructor(public token: string) {
        super(token);
    }
}

export class GetInvClassTotalsSummarySuccess extends TokenizeAction implements Action {
    readonly type = GET_INV_CLASS_TOTALS_SUMMARY_SUCCESS;
    constructor(public token: string, public data: CrimeClassTotalsSummaryViewModel) {
        super(token);
    }
}

export class GetInvClassTotalsSummaryFail extends TokenizeAction implements Action {
    readonly type = GET_INV_CLASS_TOTALS_SUMMARY_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class GetInvClassCurrentTotals extends TokenizeAction implements Action {
    readonly type = GET_INV_CLASS_CURRENT_TOTALS;
    constructor(public token: string) {
        super(token);
    }
}

export class GetInvClassCurrentTotalsSuccess extends TokenizeAction implements Action {
    readonly type = GET_INV_CLASS_CURRENT_TOTALS_SUCCESS;
    constructor(public token: string, public data: InvClassCurrentTotalsViewModel) {
        super(token);
    }
}

export class GetInvClassCurrentTotalsFail extends TokenizeAction implements Action {
    readonly type = GET_INV_CLASS_CURRENT_TOTALS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class GetPoliceStationInfoById extends TokenizeAction implements Action {
    readonly type = GET_POLICE_STATION_INFO_BY_ID;
    constructor(public token: string, public policeStID: string) {
        super(token);
    }
}

export class GetPoliceStationInfoByIdSuccess extends TokenizeAction implements Action {
    readonly type = GET_POLICE_STATION_INFO_BY_ID_SUCCESS;
    constructor(public token: string, public info: PoliceStationInfoViewModel) {
        super(token);
    }
}

export class GetPoliceStationInfoByIdFail extends TokenizeAction implements Action {
    readonly type = GET_POLICE_STATION_INFO_BY_ID_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class CheckIsClassClosingValid extends TokenizeAction implements Action {
    readonly type = CHECK_CLOSE_CLASS;
    constructor(public token) {
        super(token);
    }
}

export class CheckIsClassClosingValidSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_CLOSE_CLASS_SUCCESS;
    constructor(public token, private data: any) {
        super(token);
    }
}

export class CheckIsClassClosingValidFail extends TokenizeAction implements Action {
    readonly type = CHECK_CLOSE_CLASS_FAIL;
    constructor(public token) {
        super(token);
    }
}

export class ReopenClass extends TokenizeAction implements Action {
    readonly type = REOPEN_CLASS;
    constructor(public token) {
        super(token);
    }
}

export class OpenClassInfoPopup extends TokenizeAction implements Action {
    readonly type = OPEN_CLASS_INFO_POPUP;
    constructor(public token) {
        super(token);
    }
}


export class ShowMessage extends TokenizeAction {
    readonly type = VALIDATION_MESSAGE;
    constructor(public token: string, public title: string, public message: string, public messageType: InfoDialogType) {
        super(token);
    }
}


export type Any = InitCrimeInformation | GetClassInfo | GetClassInfoSuccess | GetClassInfoFail |
    GetStageReachedValuesForInvClass | GetStageReachedValuesForInvClassSuccess | GetStageReachedValuesForInvClassFail |
    GetMatterTypeValuesForInvClass | GetMatterTypeValuesForInvClassSuccess | GetMatterTypeValuesForInvClassFail |
    GetOutComeCodeValuesForInvClses | GetOutComeCodeValuesForInvClassSuccess | GetOutComeCodeValuesForInvClsesFail | ChangeModel |
    Save | SaveSuccess | SaveFail | GetInvClassTotalsSummary | GetInvClassTotalsSummarySuccess |
    GetInvClassTotalsSummaryFail | GetInvClassCurrentTotals | GetInvClassCurrentTotalsSuccess | GetInvClassCurrentTotalsFail |
    GetPoliceStationInfoById | GetPoliceStationInfoByIdSuccess | GetPoliceStationInfoByIdFail |
    CheckIsClassClosingValid | CheckIsClassClosingValidSuccess | CheckIsClassClosingValidFail | ReopenClass | OpenClassInfoPopup |
    ShowMessage;
