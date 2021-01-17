import { Action } from '@ngrx/store';
import { TokenizeAction, DropdownListData, LookupList, Mode } from '../../core';
import {
    MatterModel, LegalAidCombos, Matter, MatterInfomation, CloserProcessing,
    InputData, ClientContackLinkDetailViewModel
} from '../models/interfaces';
import { PageEvent } from '@angular/material';
import { InfoDialogType } from '../../core/utility/DpsUtility';

export const INIT_MATTER_CREATION = 'DPS_INIT_MATTER_CREATION';

export const CLOSE_MATTER_CREATION = 'DPS_CLOSE_MATTER_CREATION';

export const CLEAR_MATTER_DATA = 'DPS_CLEAR_MATTER_CREATION_MATTER_DATA';

export const ADD_MATTER = 'DPS_MATTER_CREATION_ADD_MATTER';

export const UPDATE_MATTER = 'DPS_MATTER_CREATION_UPDATE_MATTER';
export const UPDATE_CLIENT1 = 'DPS_MATTER_CREATION_UPDATE_CLIENT1';
export const UPDATE_CLIENT2 = 'DPS_MATTER_CREATION_UPDATE_CLIENT2';
export const ADD_CLIENT = 'DPS_MATTER_CREATION_ADD_CLIENT';
export const REMOVE_CLIENT = 'DPS_MATTER_CREATION_REMOVE_CLIENT';
export const PROMOTE_CLIENT = 'DPS_MATTER_CREATIONPROMOTE_CLIENT';

export const GET_LEAD_UFN = 'DPS_MATTER_CREATION_GET_LEAD_UFN';
export const EMPTY_LEAD_UFN = 'DPS_MATTER_CREATION_EMPTY_LEAD_UFN';
export const GET_LEAD_UFN_FAIL = 'DPS_MATTER_CREATION_GET_LEAD_UFN_FAIL';

export const ADD_UPDATE_MATTER = 'DPS_MATTER_CREATION_ADD_UPDATE_MATTER';
export const ADD_UPDATE_MATTER_SUCCESS = 'DPS_MATTER_CREATION_ADD_UPDATE_MATTER_SUCCESS';
export const ADD_UPDATE_MATTER_FAIL = 'DPS_MATTER_CREATION_ADD_UPDATE_MATTER_FAIL';

export const DELETE_MATTER = 'DPS_MATTER_CREATION_DELETE_MATTER';
export const DELETE_MATTER_SUCCESS = 'DPS_MATTER_CREATION_DELETE_MATTER_SUCCESS';
export const DELETE_MATTER_FAIL = 'DPS_MATTER_CREATION_DELETE_MATTER_FAIL';

export const CLOSURE_PROCESSING = 'DPS_MATTER_CREATION_CLOSURE_PROCESSING';
export const CLOSURE_PROCESSING_SUCCESS = 'DPS_MATTER_CREATION_CLOSURE_PROCESSING_SUCCESS';
export const CLOSURE_PROCESSING_FAIL = 'DPS_MATTER_CREATION_CLOSURE_PROCESSING_FAIL';

export const CHECK_FEE_EARNER_VALIED = 'DPS_MATTER_CREATION_CHECK_FEE_EARNER_VALIED';
export const CHECK_FEE_EARNER_VALIED_SUCCESS = 'DPS_MATTER_CREATION_CHECK_FEE_EARNER_VALIED_SUCCESS';
export const CHECK_FEE_EARNER_VALIED_FAIL = 'DPS_MATTER_CREATION_CHECK_FEE_EARNER_VALIED_FAIL';

export const USE_FILE_SECURITY = 'DPS_MATTER_CREATION_USE_FILE_SECURITY';
export const USE_FILE_SECURITY_SUCCESS = 'DPS_MATTER_CREATION_USE_FILE_SECURITY_SUCCESS';
export const USE_FILE_SECURITY_FAIL = 'DPS_MATTER_CREATION_USE_FILE_SECURITY_FAIL';

export const CHECK_FEE_EARNER_IS_USER = 'DPS_MATTER_CREATION_CHECK_FEE_EARNER_IS_USER';
export const CHECK_FEE_EARNER_IS_USER_SUCCESS = 'DPS_MATTER_CREATION_CHECK_FEE_EARNER_IS_USER_SUCCESS';
export const CHECK_FEE_EARNER_IS_USER_FAIL = 'DPS_MATTER_CREATION_CHECK_FEE_EARNER_IS_USER_FAIL';

export const WRITE_OFF_NEGATIVE_WIP = 'DPS_MATTER_CREATION_WRITE_OFF_NEGATIVE_WIP';
export const WRITE_OFF_NEGATIVE_WIP_SUCCESS = 'DPS_MATTER_CREATION_WRITE_OFF_NEGATIVE_WIP_SUCCESS';
export const WRITE_OFF_NEGATIVE_WIP_FAIL = 'DPS_MATTER_CREATION_WRITE_OFF_NEGATIVE_WIP_FAIL';

export const CHANGE_IS_COMPLETION_NEG_WOE_ENABLED = 'DPS_MATTER_CREATION_CHANGE_IS_COMPLETION_NEG_WOE_ENABLED';
export const UPDATE_COMPLETION_FIELDS = 'DPS_MATTER_CREATION_UPDATE_COMPLETION_FIELDS';
export const UPDATE_CLIENT_DEFAULTS_AUTO_ARCH_NO = 'DPS_MATTER_CREATION_UPDATE_CLIENT_DEFAULTS_AUTO_ARCH_NO';

export const GET_FULL_MATTER_DATA = 'DPS_GET_MATTER_CREATION_FULL_MATTER_DATA';
export const GET_FULL_MATTER_DATA_SUCCESS = 'DPS_GET_MATTER_CREATION_FULL_MATTER_DATA_SUCCESS';
export const GET_FULL_MATTER_DATA_FAIL = 'DPS_GET_MATTER_CREATION_FULL_MATTER_DATA_FAIL';


export const GET_CLIENT_DEFAULTS = 'DPS_GET_MATTER_CREATION_CLIENT_DEFAULTS';
export const GET_CLIENT_DEFAULTS_SUCCESS = 'DPS_GET_MATTER_CREATION_CLIENT_DEFAULTS_SUCCESS';
export const GET_CLIENT_DEFAULTS_FAIL = 'DPS_GET_MATTER_CREATION_CLIENT_DEFAULTS_FAIL';

export const GET_LSC_DATE = 'DPS_GET_MATTER_CREATION_LSC_DATE';
export const GET_LSC_DATE_SUCCESS = 'DPS_GET_MATTER_CREATION_LSC_DATE_SUCCESS';
export const GET_LSC_DATE_FAIL = 'DPS_GET_MATTER_CREATION_LSC_DATE_FAIL';

export const GET_BRANCH_LIST = 'DPS_GET_MATTER_CREATION_BRANCH_LIST';
export const GET_BRANCH_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_BRANCH_LIST_SUCCESS';
export const GET_BRANCH_LIST_FAIL = 'DPS_GET_MATTER_CREATION_BRANCH_LIST_FAIL';

// export const GET_FEE_EARNER_LIST = 'DPS_GET_MATTER_CREATION_FEE_EARNER_LIST';
// export const GET_FEE_EARNER_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_FEE_EARNER_LIST_SUCCESS';
// export const GET_FEE_EARNER_LIST_FAIL = 'DPS_GET_MATTER_CREATION_FEE_EARNER_LIST_FAIL';

export const GET_SUPERVISOR_LIST = 'DPS_GET_MATTER_CREATION_SUPERVISOR_LIST';
export const GET_SUPERVISOR_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_SUPERVISOR_LIST_SUCCESS';
export const GET_SUPERVISOR_LIST_FAIL = 'DPS_GET_MATTER_CREATION_SUPERVISOR_LIST_FAIL';

export const GET_APP_CODE_LIST = 'DPS_GET_MATTER_CREATION_APP_CODE_LIST';
export const GET_APP_CODE_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_APP_CODE_LIST_SUCCESS';
export const GET_APP_CODE_LIST_FAIL = 'DPS_GET_MATTER_CREATION_APP_CODE_LIST_FAIL';

// export const GET_MATTER_DEPARTMENT_LIST = 'DPS_GET_MATTER_CREATION_MATTER_DEPARTMENT_LIST';
// export const GET_MATTER_DEPARTMENT_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_MATTER_DEPARTMENT_LIST_SUCCESS';
// export const GET_MATTER_DEPARTMENT_LIST_FAIL = 'DPS_GET_MATTER_CREATION_MATTER_DEPARTMENT_LIST_FAIL';

export const GET_APP_ID_BY_DEPARTMENT = 'DPS_GET_APP_CODE_BY_DEPARTMENT';
export const GET_APP_ID_BY_DEPARTMENT_FAIL = 'DPS_GET_APP_CODE_BY_DEPARTMENT';


export const GET_RATE_CATEGORY_LIST = 'DPS_GET_MATTER_CREATION_RATE_CATEGORY_LIST';
export const GET_RATE_CATEGORY_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_RATE_CATEGORY_LIST_SUCCESS';
export const GET_RATE_CATEGORY_LIST_FAIL = 'DPS_GET_MATTER_CREATION_RATE_CATEGORY_LIST_FAIL';

export const GET_MATTER_INTEREST_SCHEME_LIST = 'DPS_GET_MATTER_CREATION_MATTER_INTEREST_SCHEME_LIST';
export const GET_MATTER_INTEREST_SCHEME_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_MATTER_INTEREST_SCHEME_LIST_SUCCESS';
export const GET_MATTER_INTEREST_SCHEME_LIST_FAIL = 'DPS_GET_MATTER_CREATION_MATTER_INTEREST_SCHEME_LIST_FAIL';

export const GET_INTRODUCTION_LIST = 'DPS_GET_MATTER_CREATION_INTRODUCTION_LIST';
export const GET_INTRODUCTION_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_INTRODUCTION_LIST_SUCCESS';
export const GET_INTRODUCTION_LIST_FAIL = 'DPS_GET_MATTER_CREATION_INTRODUCTION_LIST_FAIL';

export const GET_TRUS_ACC_NO_LIST = 'DPS_GET_MATTER_CREATION_TRUS_ACC_NO_LIST';
export const GET_TRUS_ACC_NO_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_TRUS_ACC_NO_LIST_SUCCESS';
export const GET_TRUS_ACC_NO_LIST_FAIL = 'DPS_GET_MATTER_CREATION_TRUS_ACC_NO_LIST_FAIL';

export const GET_CREDIT_CONTROL_STAGE_LIST = 'DPS_GET_MATTER_CREATION_CREDIT_CONTROL_STAGE_LIST';
export const GET_CREDIT_CONTROL_STAGE_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_CREDIT_CONTROL_STAGE_LIST_SUCCESS';
export const GET_CREDIT_CONTROL_STAGE_LIST_FAIL = 'DPS_GET_MATTER_CREATION_CREDIT_CONTROL_STAGE_LIST_FAIL';

export const GET_SUNDRY_PROFIT_LIST = 'DPS_GET_MATTER_CREATION_SUNDRY_PROFIT_LIST';
export const GET_SUNDRY_PROFIT_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_SUNDRY_PROFIT_LIST_SUCCESS';
export const GET_SUNDRY_PROFIT_LIST_FAIL = 'DPS_GET_MATTER_CREATION_SUNDRY_PROFIT_LIST_FAIL';

export const GET_DDA_BANK_LIST = 'DPS_GET_MATTER_CREATION_DDA_BANK_LIST';
export const GET_DDA_BANK_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_DDA_BANK_LIST_SUCCESS';
export const GET_DDA_BANK_LIST_FAIL = 'DPS_GET_MATTER_CREATION_DDA_BANK_LIST_FAIL';

// export const GET_MATTER_CATEGORY_LIST = 'DPS_GET_MATTER_CREATION_MATTER_CATEGORY_LIST';
// export const GET_MATTER_CATEGORY_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_MATTER_CATEGORY_LIST_SUCCESS';
// export const GET_MATTER_CATEGORY_LIST_FAIL = 'DPS_GET_MATTER_CREATION_MATTER_CATEGORY_LIST_FAIL';

export const GET_LA_MATTER_TYPES_AVAILABLE = 'DPS_GET_MATTER_CREATION_LA_MATTER_TYPES_AVAILABLE';
export const GET_LA_MATTER_TYPES_AVAILABLE_SUCCESS = 'DPS_GET_MATTER_CREATION_LA_MATTER_TYPES_AVAILABLE_SUCCESS';
export const GET_LA_MATTER_TYPES_AVAILABLE_FAIL = 'DPS_GET_MATTER_CREATION_LA_MATTER_TYPES_AVAILABLE_FAIL';

export const GET_LEAGAL_AID_COMBOS_LIST = 'DPS_GET_MATTER_CREATION_LEAGAL_AID_COMBOS_LIST';
export const GET_LEAGAL_AID_COMBOS_LIST_SUCCESS = 'DPS_GET_MATTER_CREATION_LEAGAL_AID_COMBOS_LIST_SUCCESS';
export const GET_LEAGAL_AID_COMBOS_LIST_FAIL = 'DPS_GET_MATTER_CREATION_LEAGAL_AID_COMBOS_LIST_FAIL';

export const GET_FILE_IS_LOCKED = 'DPS_GET_MATTER_CREATION_FILE_IS_LOCKED';
export const GET_FILE_IS_LOCKED_SUCCESS = 'DPS_GET_MATTER_CREATION_FILE_IS_LOCKED_SUCCESS';
export const GET_FILE_IS_LOCKED_FAIL = 'DPS_GET_MATTER_CREATION_FILE_IS_LOCKED_FAIL';

export const RELATED_DOCUMENTS_GRID_PAGE_EVENT_CHANGE = 'RELATED_DOCUMENTS_GRID_PAGE_EVENT_CHANGE';

export const CHECK_OUTSTANDING_UNDERTAKINGS = 'DPS_MATTER_CREATION_CHECK_OUTSTANDING_UNDERTAKINGS';
export const HAS_OUTSTANDING_UNDERTAKINGS = 'DPS_MATTER_CREATION_HAS_OUTSTANDING_UNDERTAKINGS';
export const CHECK_OUTSTANDING_UNDERTAKINGS_FAIL = 'DPS_MATTER_CREATION_CHECK_OUTSTANDING_UNDERTAKINGS_FAIL';

export const CHECK_UNRECONCILED_ITEMS = 'DPS_MATTER_CREATION_CHECK_UNRECONCILED_ITEMS';
export const HAS_UNRECONCILED_ITEMS = 'DPS_MATTER_CREATION_HAS_UNRECONCILED_ITEMS';
export const CHECK_UNRECONCILED_ITEMS_FAIL = 'DPS_MATTER_CREATION_CHECK_UNRECONCILED_ITEMS_FAIL';

// export const MATTER_FEE_EARNER_CHANGE = 'DPS_MATTER_FEE_EARNER_CHANGE';

export const ADD_DIARY_RECORD = 'DPS_MATTER_CREATION_ADD_DIARY_RECORD';
export const ADD_DIARY_RECORD_SUCCESS = 'DPS_MATTER_CREATION_ADD_DIARY_RECORD_SUCCESS';
export const ADD_DIARY_RECORD_FAIL = 'DPS_MATTER_CREATION_ADD_DIARY_RECORD_FAIL';
export const SET_INITAL_PLOT_SALE_MODEL = 'DPS_MATTER_CREATION_SET_INITAL_PLOT_SALE_MODEL';
export const PLOT_SUCCESS_UPDATE = 'DPS_PLOT_SUCCESS_UPDATE';

export const SET_USER_BRANCH_TO_NEW_MATTER = 'DPS_MATTER_CREATION_SET_USER_BRANCH_TO_NEW_MATTER';
export const SHOW_MSG = 'DPS_MATTER_CREATION_SHOW_MSG';


export class InitMatterCreation extends TokenizeAction implements Action {
    readonly type = INIT_MATTER_CREATION;
    constructor(public token: string, public payload: {
        inputData: InputData, mode: Mode, dateTimeOffset: number,
        anticipatedWIPCredit: any, isPlotUser: boolean, userBranchId: number, confirmBeforeOpenCase: boolean
    }) {
        super(token);
    }
}

export class PlotSalesSuccessUpdate extends TokenizeAction implements Action {
    readonly type = PLOT_SUCCESS_UPDATE;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}

export class RelatedDocumentsGridPageEventChange extends TokenizeAction implements Action {
    readonly type = RELATED_DOCUMENTS_GRID_PAGE_EVENT_CHANGE;
    constructor(public token: string, public payload: { pageEvent: PageEvent }) {
        super(token);
    }
}

export class GetFullMatterData extends TokenizeAction implements Action {
    readonly type = GET_FULL_MATTER_DATA;
    constructor(public token: string, public payload: { matterId: number, matterSeatchList: MatterInfomation[], matterIndex: number }) {
        super(token);
    }
}
export class GetFullMatterDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_FULL_MATTER_DATA_SUCCESS;
    constructor(public token: string, public payload: {
        matterModel: MatterModel, matterSeatchList: MatterInfomation[], matterIndex: number
    }) {
        super(token);
    }
}
export class GetFullMatterDataFail extends TokenizeAction implements Action {
    readonly type = GET_FULL_MATTER_DATA_FAIL;
    constructor(public token: string, public payload: { error: any, matterSeatchList: MatterInfomation[], matterIndex: number }) {
        super(token);
    }
}

export class CloseMaterCreation extends TokenizeAction implements Action {
    readonly type = CLOSE_MATTER_CREATION;
    constructor(public token: string) {
        super(token);
    }
}
export class AddMatter extends TokenizeAction implements Action {
    readonly type = ADD_MATTER;
    constructor(public token: string) {
        super(token);
    }
}
export class AddUpdateMatter extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_MATTER;
    constructor(public token: string, public payload: { data: Matter, openCase: boolean }, public closeAfterSave: boolean) {
        super(token);
    }
}
export class AddUpdateMatterSuccess extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_MATTER_SUCCESS;
    constructor(public token: string, public payload: MatterModel, public openCase: boolean, public closeAfterSave: boolean) {
        super(token);
    }
}
export class AddUpdateMatterFail extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_MATTER_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class DeleteMatter extends TokenizeAction implements Action {
    readonly type = DELETE_MATTER;
    constructor(public token: string, public payload: { matterRef: string, appID: number, fileID: number, branchID: number }) {
        super(token);
    }
}
export class DeleteMatterSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_MATTER_SUCCESS;
    constructor(public token: string, public matterRef: string) {
        super(token);
    }
}
export class DeleteMatterFail extends TokenizeAction implements Action {
    readonly type = DELETE_MATTER_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class CheckFeeEarnerValied extends TokenizeAction implements Action {
    readonly type = CHECK_FEE_EARNER_VALIED;
    constructor(public token: string, public payload: { matterFeeEarner: string }) {
        super(token);
    }
}
export class CheckFeeEarnerValiedSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_FEE_EARNER_VALIED_SUCCESS;
    constructor(public token: string, public payload: { matterFeeEarner: string }) {
        super(token);
    }
}
export class CheckFeeEarnerValiedFail extends TokenizeAction implements Action {
    readonly type = CHECK_FEE_EARNER_VALIED_FAIL;
    constructor(public token: string, public payload: { matterFeeEarner: string }) {
        super(token);
    }
}

export class GetCloserProcessing extends TokenizeAction implements Action {
    readonly type = CLOSURE_PROCESSING;
    constructor(public token: string, public payload: { matterRef: string }) {
        super(token);
    }
}
export class CloserProcessingSuccess extends TokenizeAction implements Action {
    readonly type = CLOSURE_PROCESSING_SUCCESS;
    constructor(public token: string, public payload: CloserProcessing) {
        super(token);
    }
}
export class CloserProcessingFail extends TokenizeAction implements Action {
    readonly type = CLOSURE_PROCESSING_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class WriteOffNegativeWip extends TokenizeAction implements Action {
    readonly type = WRITE_OFF_NEGATIVE_WIP;
    constructor(public token: string, public payload: { matterRef: string }) {
        super(token);
    }
}

export class WriteOffNegativeWipSuccess extends TokenizeAction implements Action {
    readonly type = WRITE_OFF_NEGATIVE_WIP_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class WriteOffNegativeWipFail extends TokenizeAction implements Action {
    readonly type = WRITE_OFF_NEGATIVE_WIP_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ChengeIsCompletionNegWOEnabled extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_COMPLETION_NEG_WOE_ENABLED;
    constructor(public token: string, public payload: boolean) {
        super(token);
    }
}
export class UpdateCompletionFields extends TokenizeAction implements Action {
    readonly type = UPDATE_COMPLETION_FIELDS;
    constructor(public token: string, public payload: { mode: Mode, matter: Matter }) {
        super(token);
    }
}
export class UpdateClientDefaultsAutoArchNo extends TokenizeAction implements Action {
    readonly type = UPDATE_CLIENT_DEFAULTS_AUTO_ARCH_NO;
    constructor(public token: string) {
        super(token);
    }
}

// export class FeeEarnerChange extends TokenizeAction implements Action {
//     readonly type = MATTER_FEE_EARNER_CHANGE;
//     constructor(public token: string, public payload: { mode: Mode, feeEarner: string }) {
//         super(token);
//     }
// }
export class CheckFeeEarnerIsUser extends TokenizeAction implements Action {
    readonly type = CHECK_FEE_EARNER_IS_USER;
    constructor(public token: string, public payload: { matterRef: string }) {
        super(token);
    }
}
export class CheckFeeEarnerIsUserSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_FEE_EARNER_IS_USER_SUCCESS;
    constructor(public token: string, public payload: boolean) {
        super(token);
    }
}
export class CheckFeeEarnerIsUserFail extends TokenizeAction implements Action {
    readonly type = CHECK_FEE_EARNER_IS_USER_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
// export class WriteOffNegativeWipSuccess extends TokenizeAction implements Action {
//     readonly type = CLOSURE_PROCESSING_SUCCESS;
//     constructor(public token: string) {
//         super(token);
//     }
// }
// export class WriteOffNegativeWipFail extends TokenizeAction implements Action {
//     readonly type = CLOSURE_PROCESSING_FAIL;
//     constructor(public token: string, public payload: { error: any }) {
//         super(token);
//     }
// }

export class GetLeadUFN extends TokenizeAction implements Action {
    readonly type = GET_LEAD_UFN;
    constructor(public token: string, public payload: { fileID: number, branchID: number }) {
        super(token);
    }
}
export class EmptyLeadUFN extends TokenizeAction implements Action {
    readonly type = EMPTY_LEAD_UFN;
    constructor(public token: string) {
        super(token);
    }
}
export class GetLeadUFNFail extends TokenizeAction implements Action {
    readonly type = GET_LEAD_UFN_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetLSCDate extends TokenizeAction implements Action {
    readonly type = GET_LSC_DATE;
    constructor(public token: string) {
        super(token);
    }
}
export class GetLSCDateSuccess extends TokenizeAction implements Action {
    readonly type = GET_LSC_DATE_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class GetLSCDateFail extends TokenizeAction implements Action {
    readonly type = GET_LSC_DATE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetClientDefaults extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_DEFAULTS;
    constructor(public token: string) {
        super(token);
    }
}
export class GetClientDefaultsSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_DEFAULTS_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class GetClientDefaultsFail extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_DEFAULTS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class UseFileSecurity extends TokenizeAction implements Action {
    readonly type = USE_FILE_SECURITY;
    constructor(public token: string) {
        super(token);
    }
}
export class UseFileSecuritySuccess extends TokenizeAction implements Action {
    readonly type = USE_FILE_SECURITY_SUCCESS;
    constructor(public token: string, public payload: boolean) {
        super(token);
    }
}
export class UseFileSecurityFail extends TokenizeAction implements Action {
    readonly type = USE_FILE_SECURITY_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetBranchList extends TokenizeAction implements Action {
    readonly type = GET_BRANCH_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetBranchListSuccess extends TokenizeAction implements Action {
    readonly type = GET_BRANCH_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetBranchListFail extends TokenizeAction implements Action {
    readonly type = GET_BRANCH_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

// export class GetFeeEarnerList extends TokenizeAction implements Action {
//     readonly type = GET_FEE_EARNER_LIST;
//     constructor(public token: string) {
//         super(token);
//     }
// }
// export class GetFeeEarnerListSuccess extends TokenizeAction implements Action {
//     readonly type = GET_FEE_EARNER_LIST_SUCCESS;
//     constructor(public token: string, public payload: DropdownListData[]) {
//         super(token);
//     }
// }
// export class GetFeeEarnerListFail extends TokenizeAction implements Action {
//     readonly type = GET_FEE_EARNER_LIST_FAIL;
//     constructor(public token: string, public payload: { error: any }) {
//         super(token);
//     }
// }

export class GetSupervisorList extends TokenizeAction implements Action {
    readonly type = GET_SUPERVISOR_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetSupervisorListSuccess extends TokenizeAction implements Action {
    readonly type = GET_SUPERVISOR_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetSupervisorListFail extends TokenizeAction implements Action {
    readonly type = GET_SUPERVISOR_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetAppCodeList extends TokenizeAction implements Action {
    readonly type = GET_APP_CODE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetAppCodeListSuccess extends TokenizeAction implements Action {
    readonly type = GET_APP_CODE_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetAppCodeListFail extends TokenizeAction implements Action {
    readonly type = GET_APP_CODE_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

// export class GetMatterDepartmentList extends TokenizeAction implements Action {
//     readonly type = GET_MATTER_DEPARTMENT_LIST;
//     constructor(public token: string) {
//         super(token);
//     }
// }
// export class GetMatterDepartmentListSuccess extends TokenizeAction implements Action {
//     readonly type = GET_MATTER_DEPARTMENT_LIST_SUCCESS;
//     constructor(public token: string, public payload: DropdownListData[]) {
//         super(token);
//     }
// }
// export class GetMatterDepartmentListFail extends TokenizeAction implements Action {
//     readonly type = GET_MATTER_DEPARTMENT_LIST_FAIL;
//     constructor(public token: string, public payload: { error: any }) {
//         super(token);
//     }
// }

export class GetRateCategoryList extends TokenizeAction implements Action {
    readonly type = GET_RATE_CATEGORY_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetRateCategoryListSuccess extends TokenizeAction implements Action {
    readonly type = GET_RATE_CATEGORY_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetRateCategoryListFail extends TokenizeAction implements Action {
    readonly type = GET_RATE_CATEGORY_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetMatterInterestSchemeList extends TokenizeAction implements Action {
    readonly type = GET_MATTER_INTEREST_SCHEME_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetMatterInterestSchemeListSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTER_INTEREST_SCHEME_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetMatterInterestSchemeListFail extends TokenizeAction implements Action {
    readonly type = GET_MATTER_INTEREST_SCHEME_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetIntroductionList extends TokenizeAction implements Action {
    readonly type = GET_INTRODUCTION_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetIntroductionListSuccess extends TokenizeAction implements Action {
    readonly type = GET_INTRODUCTION_LIST_SUCCESS;
    constructor(public token: string, public payload: LookupList[]) {
        super(token);
    }
}
export class GetIntroductionListFail extends TokenizeAction implements Action {
    readonly type = GET_INTRODUCTION_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetTrusAccNoList extends TokenizeAction implements Action {
    readonly type = GET_TRUS_ACC_NO_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetTrusAccNoListSuccess extends TokenizeAction implements Action {
    readonly type = GET_TRUS_ACC_NO_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetTrusAccNoListFail extends TokenizeAction implements Action {
    readonly type = GET_TRUS_ACC_NO_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetCreditControlStageList extends TokenizeAction implements Action {
    readonly type = GET_CREDIT_CONTROL_STAGE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetCreditControlStageListSuccess extends TokenizeAction implements Action {
    readonly type = GET_CREDIT_CONTROL_STAGE_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetCreditControlStageListFail extends TokenizeAction implements Action {
    readonly type = GET_CREDIT_CONTROL_STAGE_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetSundryProfitList extends TokenizeAction implements Action {
    readonly type = GET_SUNDRY_PROFIT_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetSundryProfitListSuccess extends TokenizeAction implements Action {
    readonly type = GET_SUNDRY_PROFIT_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetSundryProfitListFail extends TokenizeAction implements Action {
    readonly type = GET_SUNDRY_PROFIT_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

// export class GetMatterCategoryList extends TokenizeAction implements Action {
//     readonly type = GET_MATTER_CATEGORY_LIST;
//     constructor(public token: string, public payload: { departmentId: number }) {
//         super(token);
//     }
// }
// export class GetMatterCategoryListSuccess extends TokenizeAction implements Action {
//     readonly type = GET_MATTER_CATEGORY_LIST_SUCCESS;
//     constructor(public token: string, public payload: { departmentId: number, dropdownList: DropdownListData[] }) {
//         super(token);
//     }
// }
// export class GetMatterCategoryListFail extends TokenizeAction implements Action {
//     readonly type = GET_MATTER_CATEGORY_LIST_FAIL;
//     constructor(public token: string, public payload: { error: any }) {
//         super(token);
//     }
// }

export class GetDDABankList extends TokenizeAction implements Action {
    readonly type = GET_DDA_BANK_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetDDABankListSuccess extends TokenizeAction implements Action {
    readonly type = GET_DDA_BANK_LIST_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetDDABankListFail extends TokenizeAction implements Action {
    readonly type = GET_DDA_BANK_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class UpdateMatteer extends TokenizeAction implements Action {
    readonly type = UPDATE_MATTER;
    constructor(public token: string, public payload: { value: any, property: string }) {
        super(token);
    }
}
export class UpdateClient1 extends TokenizeAction implements Action {
    readonly type = UPDATE_CLIENT1;
    constructor(public token: string, public payload: { value: any, property: string }) {
        super(token);
    }
}
export class UpdateClient2 extends TokenizeAction implements Action {
    readonly type = UPDATE_CLIENT2;
    constructor(public token: string, public payload: { value: any, property: string }) {
        super(token);
    }
}

export class AddClient extends TokenizeAction implements Action {
    readonly type = ADD_CLIENT;
    constructor(public token: string, public client: ClientContackLinkDetailViewModel) {
        super(token);
    }
}

export class GetLAMatterTypesAvailable extends TokenizeAction implements Action {
    readonly type = GET_LA_MATTER_TYPES_AVAILABLE;
    constructor(public token: string, public payload: { branchId: number, startDate: string }) {
        super(token);
    }
}

export class GetLAMatterTypesAvailableSuccess extends TokenizeAction implements Action {
    readonly type = GET_LA_MATTER_TYPES_AVAILABLE_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetLAMatterTypesAvailableFail extends TokenizeAction implements Action {
    readonly type = GET_LA_MATTER_TYPES_AVAILABLE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetLegalAidCombosList extends TokenizeAction implements Action {
    readonly type = GET_LEAGAL_AID_COMBOS_LIST;
    constructor(public token: string, public payload: { matterType: string, startDate: string }) {
        super(token);
    }
}
export class GetLegalAidCombosListSuccess extends TokenizeAction implements Action {
    readonly type = GET_LEAGAL_AID_COMBOS_LIST_SUCCESS;
    constructor(public token: string, public payload: LegalAidCombos) {
        super(token);
    }
}
export class GetLegalAidCombosListFail extends TokenizeAction implements Action {
    readonly type = GET_LEAGAL_AID_COMBOS_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ClearMatterData extends TokenizeAction implements Action {
    readonly type = CLEAR_MATTER_DATA;
    constructor(public token: string) {
        super(token);
    }
}

export class GetFileIsLocked extends TokenizeAction implements Action {
    readonly type = GET_FILE_IS_LOCKED;
    constructor(public token: string, public payload: { appID: number, fileID: number, branchID: number }) {
        super(token);
    }
}
export class GetFileIsLockedSuccess extends TokenizeAction implements Action {
    readonly type = GET_FILE_IS_LOCKED_SUCCESS;
    constructor(public token: string, public payload: { data: any, branchID: number }) {
        super(token);
    }
}
export class GetFileIsLockedFail extends TokenizeAction implements Action {
    readonly type = GET_FILE_IS_LOCKED_FAIL;
    constructor(public token: string, public payload: { error: string }) {
        super(token);
    }
}

export class CheckOutstandingUndertakings extends TokenizeAction implements Action {
    readonly type = CHECK_OUTSTANDING_UNDERTAKINGS;
    constructor(public token: string, public payload: { matterRef: string, matterId: number, mode: Mode }) {
        super(token);
    }
}
export class HasOutstandingUndertakings extends TokenizeAction implements Action {
    readonly type = HAS_OUTSTANDING_UNDERTAKINGS;
    constructor(public token: string) {
        super(token);
    }
}
export class CheckOutstandingUndertakingsFail extends TokenizeAction implements Action {
    readonly type = CHECK_OUTSTANDING_UNDERTAKINGS_FAIL;
    constructor(public token: string, public payload: { error: string }) {
        super(token);
    }
}

export class CheckUnreconciledItems extends TokenizeAction implements Action {
    readonly type = CHECK_UNRECONCILED_ITEMS;
    constructor(public token: string, public payload: { matterRef: string, matterId: number, mode: Mode }) {
        super(token);
    }
}
export class HasUnreconciledItems extends TokenizeAction implements Action {
    readonly type = HAS_UNRECONCILED_ITEMS;
    constructor(public token: string) {
        super(token);
    }
}
export class CheckUnreconciledItemsFail extends TokenizeAction implements Action {
    readonly type = CHECK_UNRECONCILED_ITEMS_FAIL;
    constructor(public token: string, public payload: { error: string }) {
        super(token);
    }
}
// export class GetAppIdByDepartmentChange extends TokenizeAction implements Action {
//     readonly type = GET_APP_ID_BY_DEPARTMENT;
//     constructor(public token: string, public payload: { departmentId: number }) {
//         super(token);
//     }
// }
// export class GetAppIdByDepartmentChangeFail extends TokenizeAction implements Action {
//     readonly type = GET_APP_ID_BY_DEPARTMENT_FAIL;
//     constructor(public token: string, public payload: { error: string }) {
//         super(token);
//     }
// }

export class AndAddDiaryRecords extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD;
    constructor(public token: string) {
        super(token);
    }
}
export class AndAddDiaryRecordsSuccess extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_SUCCESS;
    constructor(public token: string, public payload: { responceData: any }) {
        super(token);
    }
}
export class AndAddDiaryRecordsFail extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class RemoveClient extends TokenizeAction implements Action {
    readonly type = REMOVE_CLIENT;
    constructor(public token: string, public clientRef: string) {
        super(token);
    }
}
export class PromoteClient extends TokenizeAction implements Action {
    readonly type = PROMOTE_CLIENT;
    constructor(public token: string, public clientRef: string) {
        super(token);
    }
}

export class SetInitalPlotSaleModel extends TokenizeAction implements Action {
    readonly type = SET_INITAL_PLOT_SALE_MODEL;
    constructor(public token: string) {
        super(token);
    }
}

export class SetUserBarnchToNewMatter extends TokenizeAction implements Action {
    readonly type = SET_USER_BRANCH_TO_NEW_MATTER;
    constructor(public token: string) {
        super(token);
    }
}


export class ShowMessage extends TokenizeAction {
    readonly type = SHOW_MSG;
    constructor(public token: string, public title: string, public message: string, public messageType: InfoDialogType) {
        super(token);
    }
}



export type Any = InitMatterCreation | GetBranchListSuccess | GetSupervisorListSuccess | GetAppCodeListSuccess |
    GetRateCategoryListSuccess | GetMatterInterestSchemeListSuccess |
    GetIntroductionListSuccess | GetTrusAccNoListSuccess | GetCreditControlStageListSuccess | GetSundryProfitListSuccess |
    GetDDABankListSuccess |
    GetFullMatterData | GetFullMatterDataSuccess | GetFullMatterDataFail |
    AddUpdateMatter | AddUpdateMatterSuccess | AddUpdateMatterFail |
    DeleteMatter | DeleteMatterSuccess | DeleteMatterFail |
    CloseMaterCreation | UpdateMatteer | AddClient | RemoveClient | PromoteClient |
    UpdateClient1 | UpdateClient2 |
    GetLAMatterTypesAvailableSuccess | GetLegalAidCombosList | GetLAMatterTypesAvailable |
    GetLegalAidCombosList | GetLegalAidCombosListSuccess | ClearMatterData | GetClientDefaultsSuccess | AddUpdateMatterSuccess | AddMatter |
    RelatedDocumentsGridPageEventChange | GetLSCDateSuccess | CloserProcessingSuccess | GetCloserProcessing |
    ChengeIsCompletionNegWOEnabled | UpdateCompletionFields | CheckFeeEarnerIsUserSuccess | UseFileSecuritySuccess |
     AndAddDiaryRecords | AndAddDiaryRecordsSuccess | AndAddDiaryRecordsFail |
    WriteOffNegativeWip | WriteOffNegativeWipSuccess | WriteOffNegativeWipFail | PlotSalesSuccessUpdate | SetInitalPlotSaleModel |
    SetUserBarnchToNewMatter | ShowMessage;
