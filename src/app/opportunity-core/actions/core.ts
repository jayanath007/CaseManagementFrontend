import { Action } from '@ngrx/store';
import { TokenizeAction, DropdownListData } from '../../core';
import {
    DropdownList, FeeEarnerList, GridRequest, QuoteGenarateResponce,
    OpportunityClosedViewModel, ExtraColumnDef, OppertunityHistory, OpportunityGridDataViewModel, PropertyQuoteType,
    WebQuoteLocalSearch, PropertyQuoteRequest, PropertyQuReport, MatterValidationData, ScreenItem, SaveScreenItem, WebQuoteVars,
    QuoteEditData, WebQuoteCompnayDetails, WebQuoteBranch, PropertyQuReportview, WebQuoteCost
} from '../models/interfaces';
import { InputNameList, PropertyQuoteRequestKey, QuoteType } from '../models/enums';
import { InfoDialogType } from './../../core/utility/DpsUtility';
import {
    Introducer, GridDataResponceViewModel, StatusList,
    ClientSearchResultViewModel, OpportunitySaveViewModel, OpertunityState
} from './../models/interfaces';
import { PaginatorDef, ColumnDef } from './../../core/lib/grid-model';
import { MatterCategoryWithhAppInfo } from '../../shared-data/model/interface';


export const INIT_OPPORTUNITY = 'DPS_INIT_OPPORTUNITY';
export const OPPORTUNITY_INTRODUCTION_LIST = 'DPS_OPPORTUNITY_INTRODUCTION_LIST';
export const OPPORTUNITY_INTRODUCTION_LIST_SUCCESS = 'DPS_OPPORTUNITY_INTRODUCTION_LIST_SUCCESS';
export const OPPORTUNITY_INTRODUCTION_LIST_FAIL = 'DPS_OPPORTUNITY_INTRODUCTION_LIST_FAIL';
export const OPPORTUNITY_INTRODUCTION_SELECTION_CHANGE = 'DPS_OPPORTUNITY_INTRODUCTION_SELECTION_CHANGE';

// export const GET_OPPORTUNITY_DEPARTMENT_LIST = 'DPS_OPPORTUNITY_DEPARTMENT_LIST';
// export const GET_OPPORTUNITY_DEPARTMENT_LIST_SUCCESS = 'DPS_OPPORTUNITY_DEPARTMENT_LIST_SUCCESS';
// export const GET_OPPORTUNITY_DEPARTMENT_LIST_FAIL = 'DPS_OPPORTUNITY_DEPARTMENT_LIST_FAIL';
export const GET_OPPORTUNITY_DEPARTMENT_SELECTION_CHANGE = 'DPS_OPPORTUNITY_DEPARTMENT_SELECTION_CHANGE';
// export const GET_OPPORTUNITY_WORK_TYPE_LIST = 'DPS_OPPORTUNITY_WORK_TYPE_LIST';
// export const GET_OPPORTUNITY_WORK_TYPE_LIST_SUCCESS = 'DPS_OPPORTUNITY_WORK_TYPE_LIST_SUCCESS';
// export const GET_OPPORTUNITY_WORK_TYPE_LIST_FAIL = 'DPS_OPPORTUNITY_WORK_TYPE_LIST_FAIL';
export const GET_OPPORTUNITY_WORK_TYPE_SELECTION_CHANGE = 'DPS_OPPORTUNITY_WORK_TYPE_SELECTION_CHANGE';

export const GET_OPPORTUNITY_FEE_EARNER_LIST = 'DPS_OPPORTUNITY_FEE_EARNER_LIST';
export const GET_OPPORTUNITY_FEE_EARNER_LIST_SUCCESS = 'DPS_OPPORTUNITY_FEE_EARNER_LIST_SUCCESS';
export const GET_OPPORTUNITY_FEE_EARNER_LIST_FAIL = 'DPS_OPPORTUNITY_FEE_EARNER_LIST_FAIL';
export const GET_OPPORTUNITY_FEE_EARNER_SELECTION_CHANGE = 'DPS_OPPORTUNITY_FEE_EARNER_SELECTION_CHANGE';

export const GET_OPPORTUNITY_STATUS_LIST = 'DPS_OPPORTUNITY_STATUS_LIST';
export const GET_OPPORTUNITY_STATUS_LIST_SUCCESS = 'DPS_OPPORTUNITY_STATUS_LIST_SUCCESS';
export const GET_OPPORTUNITY_STATUS_LIST_FAIL = 'DPS_OPPORTUNITY_STATUS_LIST_FAIL';
export const GET_OPPORTUNITY_STATUS_SELECTION_CHANGE = 'DPS_OPPORTUNITY_STATUS_SELECTION_CHANGE';

export const OPPORTUNITY_INPUT_VALUE_CHANGE = 'DPS_OPPORTUNITY_INPUT_VALUE_CHANGE';
export const REFRESH_OPPORTUNITY_GRID_DATA = 'DPS_REFRESH_OPPORTUNITY_GRID_DATA';
export const OPPORTUNITY_SET_SELECTED_CLENT_DATA = 'DPS_OPPORTUNITY_SET_SELECTED_CLENT_DATA';
export const CLEAR_OPPORTUNITY_MODEL_DATA = 'DPS_CLEAR_OPPORTUNITY_MODEL_DATA';
export const OPPORTUNITY_CHANGE_TAB = 'DPS_OPPORTUNITY_CHANGE_TAB';

export const GET_SAVE_OPPORTUNITY_GRID_DATA_REQUEST = 'DPS_SAVE_OPPORTUNITY_GRID_DATA_REQUEST';
export const GET_SAVE_OPPORTUNITY_GRID_DATA = 'DPS_SAVE_OPPORTUNITY_GRID_DATA';
export const GET_SAVE_OPPORTUNITY_GRID_DATA_SUCCESS = 'DPS_SAVE_OPPORTUNITY_GRID_DATA_SUCCESS';
export const GET_SAVE_OPPORTUNITY_GRID_DATA_FAIL = 'DPS_SAVE_OPPORTUNITY_GRID_DATA_FAIL';

export const SEND_AND_SAVE_OPPORTUNITY_DATA = 'DPS_SEND_AND_SAVE_OPPORTUNITY_DATA';
export const SEND_AND_SAVE_OPPORTUNITY_DATA_SUCCESS = 'DPS_SEND_AND_SAVE_OPPORTUNITY_DATA_SUCCESS';
export const SEND_AND_SAVE_OPPORTUNITY_DATA_FAIL = 'DPS_SEND_AND_SAVE_OPPORTUNITY_DATA_FAIL';

export const PROPERTY_QUOTE = 'DPS_OPPERTUNITY_PROPERTY_QUOTE';

export const SAVE_AND_QUOTE_OPPORTUNITY_DATA = 'DPS_SAVE_AND_QUOTE_OPPORTUNITY_DATA';
export const SAVE_AND_QUOTE_OPPORTUNITY_DATA_SUCCESS = 'DPS_SAVE_AND_QUOTE_OPPORTUNITY_DATA_SUCCESS';
export const SAVE_AND_QUOTE_OPPORTUNITY_DATA_FAIL = 'DPS_SAVE_AND_QUOTE_OPPORTUNITY_DATA_FAIL';

export const GET_EDIT_OPPORTUNITY_DATA = 'DPS_GET_EDIT_OPPORTUNITY_DATA';
export const GET_EDIT_OPPORTUNITY_DATA_SUCCESS = 'DPS_GET_EDIT_OPPORTUNITY_DATA_SUCCESS';
export const GET_EDIT_OPPORTUNITY_DATA_FAIL = 'DPS_GET_EDIT_OPPORTUNITY_DATA_FAIL';

export const QUOUTE_RUN = 'DPS_OPERTUNITY_QUOUTE_RUN';
export const GENARATE_QUOTE_REQUEST = 'DPS_OPPORTUNITY_GENARATE_QUOTE_REQUEST';
export const GET_TEMPLETE = 'DPS_OPPERTUNITY_GET_TEMPLETE';
export const GET_TEMPLETE_SUCCESS = 'DPS_OPPERTUNITY_GET_TEMPLETE_SUCCESS';
export const GET_TEMPLETE_FAIL = 'DPS_OPPERTUNITY_GET_TEMPLETE_FAIL';

export const OPPORTUNITY_VALIDATION_MESSAGE = 'DPS_OPPORTUNITY_VALIDATION_MESSAGE';

export const CLOSE_OPPORTUNITY_ACCEPTED = 'DPS_CLOSE_OPPORTUNITY_ACCEPTED';
export const CLOSE_OPPORTUNITY_ACCEPTED_SUCCESS = 'DPS_CLOSE_OPPORTUNITY_ACCEPTED_SUCCESS';
export const CLOSE_OPPORTUNITY_ACCEPTED_FAIL = 'DPS_CLOSE_OPPORTUNITY_ACCEPTED_FAIL';

export const CLOSE_OPPORTUNITY_REJECTED = 'DPS_CLOSE_OPPORTUNITY_REJECTED';
export const CLOSE_OPPORTUNITY_REJECTED_SUCCESS = 'DPS_CLOSE_OPPORTUNITY_REJECTED_SUCCESS';
export const CLOSE_OPPORTUNITY_REJECTED_FAIL = 'DPS_CLOSE_OPPORTUNITY_REJECTED_FAIL';

export const CONFLICT_RUN_OPPORTUNITY = 'DPS_CONFLICT_RUN_OPPORTUNITY';

export const GENARATE_QUOTE = 'DPS_OPPORTUNITY_GENARATE_QUOTE';
export const GENARATE_QUOTE_SUCCESS = 'DPS_OPPORTUNITY_GENARATE_QUOTE_SUCCESS';
export const GENARATE_QUOTE_FAIL = 'DPS_OPPORTUNITY_GENARATE_QUOTE_FAIL';
export const GENARATE_QUOTE_SUCCESS_WITH_ERROR = 'DPS_OPPORTUNITY_GENARATE_QUOTE_SUCCESS_WITH_ERROR';
export const OPEN_MAIL_COMPOSE_POPUP = 'DPS_OPPORTUNITY_OPEN_MAIL_COMPOSE_POPUP';
export const POPUP_CLOSE = 'DPS_OPPORTUNITY_POPUP_CLOSE';

export const SEND_FEE_EARNER_EMAIL = 'DPS_OPPORTUNITY_SEND_FEE_EARNER_EMAIL';
export const SEND_FEE_EARNER_EMAIL_SUCCESS = 'DPS_OPPORTUNITY_SEND_FEE_EARNER_EMAIL_SUCCESS';
export const SEND_FEE_EARNER_EMAIL_FAIL = 'DPS_OPPORTUNITY_SEND_FEE_EARNER_EMAIL_FAIL';

export const CASE_FILE_CREATE = 'DPS_OPPORTUNITY_CASE_FILE_CREATE';
export const CASE_FILE_CREATE_SUCCESS = 'DPS_OPPORTUNITY_CASE_FILE_CREATE_SUCCESS';
export const CASE_FILE_CREATE_FAIL = 'DPS_OPPORTUNITY_CASE_FILE_CREATE_FAIL';

export const CLOSE_CLOSE_OPPORTUNITY_POPUP = 'DPS_CLOSE_CLOSE_OPPORTUNITY_POPUP';
export const CLOSE_OPPORTUNITY = 'DPS_CLOSE_OPPORTUNITY';

export const GET_OPPERTUNITY_HISTORY = 'DPS_GET_OPPERTUNITY_HISTORY';
export const GET_OPPERTUNITY_HISTORY_SUCCESS = 'DPS_GET_OPPERTUNITY_HISTORY_SUCCESS';
export const GET_OPPERTUNITY_HISTORY_FAIL = 'DPS_GET_OPPERTUNITY_HISTORY_FAIL';

export const GET_LOG_FILE = 'DPS_OPERTUNITY_GET_LOG_FILE';
export const GET_LOG_FILE_SUCCESS = 'DPS_OPERTUNITY_GET_LOG_FILE_SUCCESS';
export const GET_LOG_FILE_FAIL = 'DPS_OPERTUNITY_GET_LOG_FILE_FILE';
export const CHANGE_PAGE = 'DPS_OPPERTUNITY_CHANGE_PAGE';
export const APPLY_COLUM_SORTING = 'DPS_OPPERTUNITY_APPLY_COLUM_SORTING';

export const UPDATE_SELECTED_ROW = 'DPS_OPPERTUNITY_UPDATE_SELECTED_ROW';

export const GET_WEB_QUOTE_COMPANY = 'DPS_OPPERTUNITY_GET_WEB_QUOTE_COMPANY';
export const GET_WEB_QUOTE_COMPANY_SUCCESS = 'DPS_OPPERTUNITY_GET_WEB_QUOTE_COMPANY_SUCCESS';
export const GET_WEB_QUOTE_COMPANY_FAIL = 'DPS_OPPERTUNITY_GET_WEB_QUOTE_COMPANY_FAIL';
export const GET_PROPERTY_QUOTE_TYPE = 'DPS_OPPERTUNITY_GET_PROPERTY_QUOTE_TYPE';
export const GET_PROPERTY_QUOTE_TYPE_SUCCESS = 'DPS_OPPERTUNITY_GET_PROPERTY_QUOTE_TYPE_SUCCESS';
export const GET_PROPERTY_QUOTE_TYPE_FAIL = 'DPS_OPPERTUNITY_GET_PROPERTY_QUOTE_TYPE_FAIL';
export const CHANGE_PROPERTY_QUOTE_REQUEST = 'DPS_OPERTUNITY_CHANGE_PROPERTY_QUOTE_REQUEST';
export const LOAD_PROPERT_QUOTE_COMBO_DATA = 'DPS_OPERTUNITY_LOAD_PROPERT_QUOTE_COMBO_DATA';
export const LOAD_PROPERT_QUOTE_COMBO_DATA_SUCCESS = 'DPS_OPERTUNITY_LOAD_PROPERT_QUOTE_COMBO_DATA_SUCCESS';
export const LOAD_PROPERT_QUOTE_COMBO_DATA_FAIL = 'DPS_OPERTUNITY_LOAD_PROPERT_QUOTE_COMBO_DATA_FAIL';
export const REQUEST_PROPERTY_QUOTE_REPORT = 'DPS_OPERTUNITY_REQUEST_PROPERTY_QUOTE_REPORT';
export const LOAD_EXISTING_REPORT = 'DPS_OPERTUNITY_REQUEST_PROPERTY_LOAD_EXISTING_REPORT';
export const PROPERTY_QUOTE_REPORT_LOADING = 'DPS_OPERTUNITY_PROPERTY_QUOTE_REPORT_LOADING';
export const PROPERTY_QUOTE_REPORT_LOADING_SUCCESS = 'DPS_OPERTUNITY_PROPERTY_QUOTE_REPORT_LOADING_SUCCESS';
export const PROPERTY_QUOTE_REPORT_LOADING_FAIL = 'DPS_OPERTUNITY_PROPERTY_QUOTE_REPORT_LOADING_FAIL';
export const CHANGE_PROPERTY_QUOTE_STEP = 'DPS_OPERTUNITY_PROPERTY_CHANGE_PROPERTY_QUOTE_STEP';
export const REQUEST_TO_SEND_PROPERTY_QUOTE = 'DPS_OPERTUNITY_REQUEST_TO_SEND_PROPERTY_QUOTE';
export const SEND_PROPERTY_QUOTE = 'DPS_OPERTUNITY_SEND_PROPERTY_QUOTE';
export const SEND_PROPERTY_QUOTE_SUCCESS = 'DPS_OPERTUNITY_SEND_PROPERTY_QUOTE_SUCCESS';
export const SEND_PROPERTY_QUOTE_FAIL = 'DPS_OPERTUNITY_SEND_PROPERTY_QUOTE_FAIL';
export const REQUEST_TO_OPEN_MATTER = 'DPS_OPERTUNITY_REQUEST_TO_OPEN_MATTER';
export const VALIDATE_MATTER_DETAIL = 'DPS_OPERTUNITY_VALIDATE_MATTER_DETAIL';
export const VALIDATE_MATTER_DETAIL_SUCCESS = 'DPS_OPERTUNITY_VALIDATE_MATTER_DETAIL_SUCCESS';
export const VALIDATE_MATTER_DETAIL_FAIL = 'DPS_OPERTUNITY_VALIDATE_MATTER_DETAIL_FAIL';
export const GET_OPPORTUNITY_STATUS_SUMMARY = 'DPS_GET_OPPORTUNITY_STATUS_SUMMARY';
export const GET_OPPORTUNITY_STATUS_SUMMARY_SUCCESS = 'GET_OPPORTUNITY_STATUS_SUMMARY_SUCCESS';
export const GET_OPPORTUNITY_STATUS_SUMMARY_FAIL = 'GET_OPPORTUNITY_STATUS_SUMMARY_FAIL';
export const INIT_PROPERTY_QUOTE = 'OPPORTUNITY_INIT_PROPERTY_QUOTE';
export const PROPERTY_QUOTE_GET_VARS = 'DPS_OPERTUNITY_PROPERTY_QUOTE_GET_VARS';
export const PROPERTY_QUOTE_GET_VARS_SUCCESS = 'DPS_OPERTUNITY_PROPERTY_QUOTE_GET_VARS_SUCCESS';
export const PROPERTY_QUOTE_GET_VARS_FAIL = 'DPS_OPERTUNITY_PROPERTY_QUOTE_GET_VARS_FAIL';

export const INIT_OPPERTUNITY_SETTING = 'DPS_INIT_OPPERTUNITY_SETTING';
export const LOAD_SCREEN_LIST = 'OPPORTUNITY_LOAD_SCREEN_LIST';
export const LOAD_SCREEN_LIST_SUCCESS = 'OPPORTUNITY_LOAD_SCREEN_LIST_SUCCESS';
export const LOAD_SCREEN_LIST_FAIL = 'OPPORTUNITY_LOAD_SCREEN_LIST_FAIL';
export const LOAD_INIT_SCREEN_LIST = 'OPPORTUNITY_LOAD_INIT_SCREEN_LIST';
export const LOAD_INIT_SCREEN_LIST_SUCCESS = 'OPPORTUNITY_LOAD_INIT_SCREEN_LIST_SUCCESS';
export const LOAD_INIT_SCREEN_LIST_FAIL = 'OPPORTUNITY_LOAD_INIT_SCREEN_LIST_FAIL';
// export const SELECT_UNSELECT_SCREEN_ITEM = 'OPPORTUNITY_SELECT_UNSELECT_SCREEN_ITEM';
export const SAVE_SCREEN_LIST = 'OPPORTUNITY_SAVE_SCREEN_LIST';
export const SAVE_SCREEN_LIST_SUCCESS = 'OPPORTUNITY_SAVE_SCREEN_LIST_SUCCESS';
export const SAVE_SCREEN_LIST_FAIL = 'OPPORTUNITY_SAVE_SCREEN_LIST_FAIL';
export const GET_APP_CODE_LIST = 'DPS_OPPORTUNITY_APP_CODE_LIST';
export const GET_APP_CODE_LIST_SUCCESS = 'DPS_OPPORTUNITY_APP_CODE_LIST_SUCCESS';
export const GET_APP_CODE_LIST_FAIL = 'DPS_OPPORTUNITY_APP_CODE_LIST_FAIL';
export const CHANGE_SETTING_APP_ID = 'CHANGE_OPPORTUNITY_SETTING_APP_ID';
export const ADD_SCREEN_ITEM = 'OPPERTUNITY_ADD_SCREEN_ITEM';
export const EDIT_SCREEN_ITEM = 'OPPERTUNITY_EDIT_SCREEN_ITEM';
export const REMOVE_SCREEEN_ITEM = 'OPPERTUNITY_REMOVE_SCREEEN_ITEM';
export const INIT_OPPORTUNITY_EDIT = 'DPS_INIT_OPPORTUNITY__EDIT';
export const SAVE_EDIT_OPPORTUNITY_DATA = 'SAVE_EDIT_OPPORTUNITY_DATA';
export const SAVE_EDIT_OPPORTUNITY_DATA_SUCCESS = 'SAVE_EDIT_OPPORTUNITY_DATA_SUCCESS';
export const SAVE_EDIT_OPPORTUNITY_DATA_FAIL = 'SAVE_EDIT_OPPORTUNITY_DATA_FAIL';
export const GET_EDIT_ENQUARY_DATA = 'OPPORTUNITY_GET_EDIT_ENQUARY_DATA';
export const GET_EDIT_ENQUARY_DATA_SUCCESS = 'OPPORTUNITYEMAIL_GET_EDIT_ENQUARY_DATA_SUCCESS';
export const GET_EDIT_ENQUARY_DATA_FAIL = 'OPPORTUNITY_GET_EDIT_ENQUARY_DATA_FAIL';
export const OPEN_SETTING_PANEL = 'OPPORTUNITY_OPEN_SETTING_PANEL';
export const UPLOAD_EMAIL_TEMPLETE = 'UPLOAD_OPPORTUNITY_EMAIL_TEMPLETE';
export const UPLOAD_EMAIL_TEMPLETE_SUCCESS = 'UPLOAD_OPPORTUNITYEMAIL_TEMPLETE_SUCCESS';
export const UPLOAD_EMAIL_TEMPLETE_FAIL = 'UPLOAD_OPPORTUNITY_EMAIL_TEMPLETE_FAIL';
export const VIEW_MAIL_HEADER_ATTACHMENT = 'OPPORTUNITY_VIEW_MAIL_HEADER_ATTACHMENT';
export const VIEW_MAIL_HEADER_ATTACHMENT_SUCCESS = 'OPPORTUNITY_VIEW_MAIL_HEADER_ATTACHMENT_SUCCESS';
export const VIEW_MAIL_HEADER_ATTACHMENT_FAIL = 'OPPORTUNITY_VIEW_MAIL_HEADER_ATTACHMENT_FAIL';

export const SEND_NOTIFICATION = 'OPPORTUNITY_SEND_NOTIFICATION';
export const SEND_NOTIFICATION_SUCCESS = 'OPPORTUNITY_SEND_NOTIFICATION_SUCCESS';
export const SEND_NOTIFICATION_FAIL = 'OPPORTUNITY_SEND_NOTIFICATION_FAIL';

export const SEND_NOTIFICATION_AFTER_QUOTE_ADD = 'OPPORTUNITY_SEND_NOTIFICATION_AFTER_QUOTE_ADD';

export const SAVE_REPORT_DATA = 'OPPORTUNITY_PROPERTY_QUOTE_SAVE_REPORT_DATA';
export const SAVE_REPORT_DATA_SUCCESS = 'PPORTUNITY_PROPERTY_QUOTE_SAVE_REPORT_DATA_SUCCESS';
export const SAVE_REPORT_DATA_FAIL = 'PPORTUNITY_PROPERTY_QUOTE_SAVE_REPORT_DATA_FAIL';
export const CHANGE_REPORT_DATA = 'PPORTUNITY_PROPERTY_QUOTE_CHANGE_REPORT_DATA';
export const CHANGE_COLUM_FILTERATION = 'OPPORTUNITY_CHANGE_COLUM_FILTERATION';

export const CREATE_A_MATTER = 'DPS_OPPORTUNITY_CREATE_A_MATTER';
export const CREATE_A_MATTER_SUCCESS = 'DPS_OPPORTUNITY_CREATE_A_MATTER_SUCCESS';
export const CREATE_A_MATTER_FAIL = 'DPS_OPPORTUNITY_CREATE_A_MATTER_FAIL';



export class InitOpportunityPage extends TokenizeAction implements Action {

    readonly type = INIT_OPPORTUNITY;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        paginatorDef: PaginatorDef,
        extraColumnDef: ExtraColumnDef,
        dateTimeOffset: number
    }) { super(token); }
}

export class GetIntroductionList extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_INTRODUCTION_LIST;
    constructor(public token: string, public needRefresh?: boolean) {
        super(token);
    }
}
export class GetIntroductionListSuccess extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_INTRODUCTION_LIST_SUCCESS;
    constructor(public token: string, public payload: { introductionList: Introducer[] }) {
        super(token);
    }
}
export class GetIntroductionListFail extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_INTRODUCTION_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class IntroductionSelectionChange extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_INTRODUCTION_SELECTION_CHANGE;
    constructor(public token: string, public selectedItem: Introducer) {
        super(token);
    }
}

export class OpportunityDepartmentChange extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_DEPARTMENT_SELECTION_CHANGE;
    constructor(public token: string, public selectedId: number) {
        super(token);
    }
}

export class OpportunityWorkTypeChange extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_WORK_TYPE_SELECTION_CHANGE;
    constructor(public token: string, public selectedItem: MatterCategoryWithhAppInfo) {
        super(token);
    }
}
export class GetStatusList extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_STATUS_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetStatusListSuccess extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_STATUS_LIST_SUCCESS;
    constructor(public token: string, public payload: { statusList: StatusList[] }) {
        super(token);
    }
}
export class GetStatusListFail extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_STATUS_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class OpportunityStatusChange extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_STATUS_SELECTION_CHANGE;
    constructor(public token: string, public selectedItem: StatusList) {
        super(token);
    }
}
export class GetFeeEarnerList extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_FEE_EARNER_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_FEE_EARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarnerList[] }) {
        super(token);
    }
}
export class GetFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_FEE_EARNER_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class OpportunityFeeEarnerChange extends TokenizeAction implements Action {
    readonly type = GET_OPPORTUNITY_FEE_EARNER_SELECTION_CHANGE;
    constructor(public token: string, public selectedItem: FeeEarnerList) {
        super(token);
    }
}
export class OpportunityInputValueChange extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_INPUT_VALUE_CHANGE;
    constructor(public token: string, public payload: { kind: InputNameList, value: any }) {
        super(token);
    }
}
export class OpportunitySetSelectedClientData extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_SET_SELECTED_CLENT_DATA;
    constructor(public token: string, public clientDataModel: ClientSearchResultViewModel) {
        super(token);
    }
}
export class SetOpportunityGridDataRequest extends TokenizeAction implements Action {
    readonly type = GET_SAVE_OPPORTUNITY_GRID_DATA_REQUEST;
    constructor(public token) { super(token); }
}
export class GetSaveOpportunityGridData extends TokenizeAction implements Action {
    readonly type = GET_SAVE_OPPORTUNITY_GRID_DATA;
    constructor(public token: string, public request: GridRequest) {
        super(token);
    }
}
export class GetSaveOpportunityGridDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_SAVE_OPPORTUNITY_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: GridDataResponceViewModel }) {
        super(token);
    }
}
export class GetSaveOpportunityGridDataFail extends TokenizeAction implements Action {
    readonly type = GET_SAVE_OPPORTUNITY_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class OpportunityRefreshGridData extends TokenizeAction implements Action {
    readonly type = REFRESH_OPPORTUNITY_GRID_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class OpportunityModelClear extends TokenizeAction implements Action {
    readonly type = CLEAR_OPPORTUNITY_MODEL_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class ChangeTab extends TokenizeAction implements Action {
    readonly type = OPPORTUNITY_CHANGE_TAB;
    constructor(public token: string, public payload: { tabIndex: number }) { super(token); }
}

export class SendAndSaveOpportunities extends TokenizeAction implements Action {
    readonly type = SEND_AND_SAVE_OPPORTUNITY_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class SendAndSaveOpportunitiesSuccess extends TokenizeAction implements Action {
    readonly type = SEND_AND_SAVE_OPPORTUNITY_DATA_SUCCESS;
    constructor(public token: string, public payload: { responceData: any, newIndorduser: boolean }) {
        super(token);
    }
}
export class SendAndSaveOpportunitiesFail extends TokenizeAction implements Action {
    readonly type = SEND_AND_SAVE_OPPORTUNITY_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class SaveAndQuoteOpportunities extends TokenizeAction implements Action {
    readonly type = SAVE_AND_QUOTE_OPPORTUNITY_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveAndQuoteOpportunitiesSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_AND_QUOTE_OPPORTUNITY_DATA_SUCCESS;
    constructor(public token: string, public payload: { responceData: any, quoteType?: QuoteType, newIndorduser: boolean }) {
        super(token);
    }
}
export class SaveAndQuoteOpportunitiesFail extends TokenizeAction implements Action {
    readonly type = SAVE_AND_QUOTE_OPPORTUNITY_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class ShowMessage extends TokenizeAction {
    readonly type = OPPORTUNITY_VALIDATION_MESSAGE;
    constructor(public token: string, public title: string, public message: string, public messageType: InfoDialogType) {
        super(token);
    }
}
// Conflict Run
export class ConflictRunOpportunities extends TokenizeAction implements Action {
    readonly type = CONFLICT_RUN_OPPORTUNITY;
    constructor(public token: string, public payload: { selectedItem: OpportunitySaveViewModel }) {
        super(token);
    }
}
// for Close Opportunity Accepted
export class CloseOpportunitiesAccepted extends TokenizeAction implements Action {
    readonly type = CLOSE_OPPORTUNITY_ACCEPTED;
    constructor(public token: string, public closeOpportunityData: OpportunityClosedViewModel,
        public oppertunityItem: OpportunitySaveViewModel) {
        super(token);
    }
}
export class CloseOpportunitiesAcceptedSuccess extends TokenizeAction implements Action {
    readonly type = CLOSE_OPPORTUNITY_ACCEPTED_SUCCESS;
    constructor(public token: string, public payload: {
        responceData: any, opportunityId: number,
        oppertunityItem: OpportunitySaveViewModel
    }) {
        super(token);
    }
}
export class CloseOpportunitiesAcceptedFail extends TokenizeAction implements Action {
    readonly type = CLOSE_OPPORTUNITY_ACCEPTED_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class CloseOpportunitiesRejected extends TokenizeAction implements Action {
    readonly type = CLOSE_OPPORTUNITY_REJECTED;
    constructor(public token: string, public closeOpportunityData: OpportunityClosedViewModel) {
        super(token);
    }
}
export class CloseOpportunitiesRejectedSuccess extends TokenizeAction implements Action {
    readonly type = CLOSE_OPPORTUNITY_REJECTED_SUCCESS;
    constructor(public token: string, public payload: { responceData: any }) {
        super(token);
    }
}
export class CloseOpportunitiesRejectedFail extends TokenizeAction implements Action {
    readonly type = CLOSE_OPPORTUNITY_REJECTED_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetEditOpportunities extends TokenizeAction implements Action {
    readonly type = GET_EDIT_OPPORTUNITY_DATA;
    constructor(public token: string, public selectedItemDetails: OpportunitySaveViewModel) {
        super(token);
    }
}
export class GetEditOpportunitiesSuccess extends TokenizeAction implements Action {
    readonly type = GET_EDIT_OPPORTUNITY_DATA_SUCCESS;
    constructor(public token: string, public payload: { responceData: any }) {
        super(token);
    }
}
export class GetEditOpportunitiesFail extends TokenizeAction implements Action {
    readonly type = GET_EDIT_OPPORTUNITY_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class QuoteRun extends TokenizeAction {
    readonly type = QUOUTE_RUN;
    constructor(public token: string, public payload: { item: OpportunitySaveViewModel, isEdit: boolean }) {
        super(token);
    }
}

export class GetTemplete extends TokenizeAction {
    readonly type = GET_TEMPLETE;
    constructor(public token: string, public payload: { item: OpportunitySaveViewModel }) { super(token); }
}

export class GetTempleteSuccess extends TokenizeAction {
    readonly type = GET_TEMPLETE_SUCCESS;
    constructor(public token: string, public payload: { item: OpportunitySaveViewModel, templete: string[] }) { super(token); }
}

export class GetTempleteFail extends TokenizeAction {
    readonly type = GET_TEMPLETE_FAIL;
    constructor(public token: string) { super(token); }
}

export class GenarateQuoteRequest extends TokenizeAction {
    readonly type = GENARATE_QUOTE_REQUEST;
    constructor(public token, public payload: { item: OpportunitySaveViewModel }) { super(token); }
}

export class PopupClose extends TokenizeAction {
    readonly type = POPUP_CLOSE;
    constructor(public token) { super(token); }
}

export class GenarateQuote extends TokenizeAction {
    readonly type = GENARATE_QUOTE;
    constructor(public token, public payload: { item: OpportunitySaveViewModel }) { super(token); }
}
export class GenarateQuoteSuccess extends TokenizeAction {
    readonly type = GENARATE_QUOTE_SUCCESS;
    constructor(public token, public payload: {
        responce: QuoteGenarateResponce, emailAddress: string,
        item: OpportunitySaveViewModel
    }) { super(token); }
}
export class GenarateQuoteFail extends TokenizeAction {
    readonly type = GENARATE_QUOTE_FAIL;
    constructor(public token) { super(token); }
}

export class GenarateQuoteWithError extends TokenizeAction {
    readonly type = GENARATE_QUOTE_SUCCESS_WITH_ERROR;
    constructor(public token, public payload: { info: QuoteGenarateResponce, emailAddress: string }) { super(token); }
}

export class OpenMailComposePopup extends TokenizeAction {
    readonly type = OPEN_MAIL_COMPOSE_POPUP;
    constructor(public token, public payload: { ewsId: string, id: string }, public emailAddress: string) { super(token); }
}
export class CloseOpportunityPopupClose extends TokenizeAction {
    readonly type = CLOSE_CLOSE_OPPORTUNITY_POPUP;
    constructor(public token: string) { super(token); }
}
export class CloseOpportunity extends TokenizeAction {
    readonly type = CLOSE_OPPORTUNITY;
    constructor(public token: string, public payload: { item: OpportunitySaveViewModel }) { super(token); }
}
// for Send email to feeEarner
export class SendOpportunityFeeEarnerEmail extends TokenizeAction {
    readonly type = SEND_FEE_EARNER_EMAIL;
    constructor(public token, public opportunityId: number) { super(token); }
}
export class SendOpportunityFeeEarnerEmailSuccess extends TokenizeAction {
    readonly type = SEND_FEE_EARNER_EMAIL_SUCCESS;
    constructor(public token, public payload: { responce: any }) { super(token); }
}
export class SendOpportunityFeeEarnerEmailFail extends TokenizeAction {
    readonly type = SEND_FEE_EARNER_EMAIL_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class OpportunityCaseFileCreate extends TokenizeAction implements Action {
    readonly type = CASE_FILE_CREATE;
    constructor(public token: string, public payload: { item: OpportunitySaveViewModel }) {
        super(token);
    }
}
export class OpportunityCaseFileCreateSuccess extends TokenizeAction implements Action {
    readonly type = CASE_FILE_CREATE_SUCCESS;
    constructor(public token: string, public payload: { responceData: any, opportunityId: number, dateTimeOffset: number }) {
        super(token);
    }
}
export class OpportunityCaseFileCreateFail extends TokenizeAction implements Action {
    readonly type = CASE_FILE_CREATE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class GetOpprtunityHistory extends TokenizeAction {
    readonly type = GET_OPPERTUNITY_HISTORY;
    constructor(public token: string, public opertunityId: number) { super(token); }
}
export class GetOpprtunityHistorySuccess extends TokenizeAction {
    readonly type = GET_OPPERTUNITY_HISTORY_SUCCESS;
    constructor(public token: string, public history: OppertunityHistory[]) { super(token); }
}
export class GetOpprtunityHistoryFail extends TokenizeAction {
    readonly type = GET_OPPERTUNITY_HISTORY_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class GetLogFile extends TokenizeAction {
    readonly type = GET_LOG_FILE;
    constructor(public token, public id: number) {
        super(token);
    }
}
export class GetLogFileSuccess extends TokenizeAction {
    readonly type = GET_LOG_FILE_SUCCESS;
    constructor(public token, public url) {
        super(token);
    }
}
export class GetLogFileFail extends TokenizeAction {
    readonly type = GET_LOG_FILE_FAIL;
    constructor(public token) {
        super(token);
    }
}
export class ChangePaginator extends TokenizeAction {
    readonly type = CHANGE_PAGE;
    constructor(public token, public pageDef: PaginatorDef) {
        super(token);
    }
}
export class ApplyColumSort extends TokenizeAction {
    readonly type = APPLY_COLUM_SORTING;
    constructor(public token: string, public columDef: ColumnDef) {
        super(token);
    }
}
export class UpdateSelectedRow extends TokenizeAction {
    readonly type = UPDATE_SELECTED_ROW;
    constructor(public token: string, public selectedRow: OpportunityGridDataViewModel) {
        super(token);
    }
}

export class GetWebQuoteCompnayDetals {
    readonly type = GET_WEB_QUOTE_COMPANY;
    constructor() { }
}
export class GetWebQuoteCompnayDetalsSuccess {
    readonly type = GET_WEB_QUOTE_COMPANY_SUCCESS;
    constructor(public details: WebQuoteCompnayDetails) { }
}
export class GetWebQuoteCompnayDetalsFail {
    readonly type = GET_WEB_QUOTE_COMPANY_FAIL;
    constructor() { }
}


export class GetPropertQuoteType extends TokenizeAction {
    readonly type = GET_PROPERTY_QUOTE_TYPE;
    constructor(public token: string) {
        super(token);
    }
}
export class GetPropertQuoteTypeSuccess extends TokenizeAction {
    readonly type = GET_PROPERTY_QUOTE_TYPE_SUCCESS;
    constructor(public token: string, public typeList: PropertyQuoteType[]) {
        super(token);
    }
}
export class GetPropertQuoteTypeFail extends TokenizeAction {
    readonly type = GET_PROPERTY_QUOTE_TYPE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class ChangePropertyQuoteRequest extends TokenizeAction {
    readonly type = CHANGE_PROPERTY_QUOTE_REQUEST;
    constructor(public token: string, public info: { key: PropertyQuoteRequestKey, value: any }, public isEditQuote: boolean) {
        super(token);
    }
}
export class LoadWebQuoteComboData extends TokenizeAction {
    readonly type = LOAD_PROPERT_QUOTE_COMBO_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadWebQuoteComboDataSuccess extends TokenizeAction {
    readonly type = LOAD_PROPERT_QUOTE_COMBO_DATA_SUCCESS;
    constructor(public token: string, public data: {
        branchList: WebQuoteBranch[],
        localAuth: WebQuoteLocalSearch[],
        costList: WebQuoteCost[]
    }) {
        super(token);
    }
}
export class LoadWebQuoteComboDataFail extends TokenizeAction {
    readonly type = LOAD_PROPERT_QUOTE_COMBO_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class RequestPropertyQuoteReport extends TokenizeAction {
    readonly type = REQUEST_PROPERTY_QUOTE_REPORT;
    constructor(public token: string, public isEdit: boolean) {
        super(token);
    }
}

export class LoadExistingReport extends TokenizeAction {
    readonly type = LOAD_EXISTING_REPORT;
    constructor(public token: string, public reportId: number) {
        super(token);
    }
}
export class PropertyQuoteReportLoading extends TokenizeAction {
    readonly type = PROPERTY_QUOTE_REPORT_LOADING;
    constructor(public token: string, public request: PropertyQuoteRequest, public isEdit: boolean) {
        super(token);
    }
}
export class PropertyQuoteReportLoadingSuccess extends TokenizeAction {
    readonly type = PROPERTY_QUOTE_REPORT_LOADING_SUCCESS;
    constructor(public token: string, public reportData: PropertyQuReport, public isEdit: boolean) {
        super(token);
    }
}
export class PropertyQuoteReportLoadingFail extends TokenizeAction {
    readonly type = PROPERTY_QUOTE_REPORT_LOADING_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class ChangePropertQuStep extends TokenizeAction {
    readonly type = CHANGE_PROPERTY_QUOTE_STEP;
    constructor(public token: string, public index: number) {
        super(token);
    }
}


export class RequestToSendPropertyQuote extends TokenizeAction {
    readonly type = REQUEST_TO_SEND_PROPERTY_QUOTE;
    constructor(public token: string, public reportContent: string, public editedOpportunity: OpportunitySaveViewModel) {
        super(token);
    }
}
export class SendPropertyQuote extends TokenizeAction {
    readonly type = SEND_PROPERTY_QUOTE;
    constructor(public token: string, public reportContent: string, public editedOpportunity: OpportunitySaveViewModel) {
        super(token);
    }
}
export class SendPropertyQuoteSuccess extends TokenizeAction {
    readonly type = SEND_PROPERTY_QUOTE_SUCCESS;
    constructor(public token: string, public data: { ewsId: string, id: string }, public email1: string,
        public item: OpportunitySaveViewModel) {
        super(token);
    }
}
export class SendPropertyQuoteFail extends TokenizeAction {
    readonly type = SEND_PROPERTY_QUOTE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class RequestToOpenMatter extends TokenizeAction {
    readonly type = REQUEST_TO_OPEN_MATTER;
    constructor(public token: string, public item: OpportunitySaveViewModel) {
        super(token);
    }
}
export class ValidateMatterInfo extends TokenizeAction {
    readonly type = VALIDATE_MATTER_DETAIL;
    constructor(public token: string, public item: OpportunitySaveViewModel, public continueProcess: string) {
        super(token);
    }
}
export class ValidateMatterInfoSuccess extends TokenizeAction {
    readonly type = VALIDATE_MATTER_DETAIL_SUCCESS;
    constructor(public token: string, public payload:
        { item: OpportunitySaveViewModel, continueProcess: string, validationData: MatterValidationData },) {
        super(token);
    }
}
export class ValidateMatterInfoFail extends TokenizeAction {
    readonly type = VALIDATE_MATTER_DETAIL_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class GetOpportunityStatusSummary extends TokenizeAction {
    readonly type = GET_OPPORTUNITY_STATUS_SUMMARY;
    constructor(public token: string) {
        super(token);
    }
}
export class GetOpportunityStatusSummarySuccess extends TokenizeAction {
    readonly type = GET_OPPORTUNITY_STATUS_SUMMARY_SUCCESS;
    constructor(public token: string, public stats: OpertunityState) {
        super(token);
    }
}
export class GetOpportunityStatusSummaryFail extends TokenizeAction {
    readonly type = GET_OPPORTUNITY_STATUS_SUMMARY_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class InitPropertyQuote extends TokenizeAction {
    readonly type = INIT_PROPERTY_QUOTE;
    constructor(public token: string, public isEditQuote: boolean) {
        super(token);
    }
}

export class InitOppertunitySetting {
    readonly type = INIT_OPPERTUNITY_SETTING;
    constructor() {
    }
}

export class LoadScreenList {
    readonly type = LOAD_SCREEN_LIST;
    constructor(public appId: number) {
    }
}

export class LoadScreenListSuccess {
    readonly type = LOAD_SCREEN_LIST_SUCCESS;
    constructor(public appId: number, public screenList: ScreenItem[]) {
    }
}

export class LoadScreenListFail {
    readonly type = LOAD_SCREEN_LIST_FAIL;
    constructor() {
    }
}

export class LoadInitScreenList {
    readonly type = LOAD_INIT_SCREEN_LIST;
    constructor() {
    }
}

export class LoadInitScreenListSuccess {
    readonly type = LOAD_INIT_SCREEN_LIST_SUCCESS;
    constructor(public data: string) {
    }
}

export class LoadInitScreenListFail {
    readonly type = LOAD_INIT_SCREEN_LIST_FAIL;
    constructor() {
    }
}

export class SaveScreenList {
    readonly type = SAVE_SCREEN_LIST;
    constructor(public payload: { hasNonAddingItem: boolean }) {
    }
}

export class SaveScreenListSuccess {
    readonly type = SAVE_SCREEN_LIST_SUCCESS;
    constructor() {
    }
}

export class SaveScreenListFail {
    readonly type = SAVE_SCREEN_LIST_FAIL;
    constructor() {
    }
}

export class GetAppCodeList {
    readonly type = GET_APP_CODE_LIST;
    constructor() { }
}
export class GetAppCodeListSuccess {
    readonly type = GET_APP_CODE_LIST_SUCCESS;
    constructor(public payload: DropdownListData[]) { }
}
export class GetAppCodeListFail {
    readonly type = GET_APP_CODE_LIST_FAIL;
    constructor() { }
}
export class ChangeSettingAppID {
    readonly type = CHANGE_SETTING_APP_ID;
    constructor(public selectedAppId: number) { }
}
export class AddScreenItem {
    readonly type = ADD_SCREEN_ITEM;
    constructor(public item: SaveScreenItem) { }
}
export class EditScreenItem {
    readonly type = EDIT_SCREEN_ITEM;
    constructor(public index: number, public key: string, public value) { }
}

export class RemoveScreenItem {
    readonly type = REMOVE_SCREEEN_ITEM;
    constructor(public index: number) { }
}

export class InitOpertunityEdit extends TokenizeAction {
    readonly type = INIT_OPPORTUNITY_EDIT;
    constructor(public token: string, public opertunityId: number) { super(token); }
}

export class SaveEditOpportunities extends TokenizeAction implements Action {
    readonly type = SAVE_EDIT_OPPORTUNITY_DATA;
    constructor(public token: string, public data: OpportunitySaveViewModel) {
        super(token);
    }
}
export class SaveEditOpportunitiesSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_EDIT_OPPORTUNITY_DATA_SUCCESS;
    constructor(public token: string, public payload: { responceData: any, newIndorduser: boolean }) {
        super(token);
    }
}
export class SaveEditOpportunitiesFail extends TokenizeAction implements Action {
    readonly type = SAVE_EDIT_OPPORTUNITY_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class PropertyQuoteGetVars {
    readonly type = PROPERTY_QUOTE_GET_VARS;
    constructor() {

    }
}
export class PropertyQuoteGetVarsSuccess {
    readonly type = PROPERTY_QUOTE_GET_VARS_SUCCESS;
    constructor(public vars: WebQuoteVars[]) {

    }
}
export class PropertyQuoteGetVarsFail {
    readonly type = PROPERTY_QUOTE_GET_VARS_FAIL;
    constructor() {

    }
}
export class UploadEmailTemplete {
    readonly type = UPLOAD_EMAIL_TEMPLETE;
    constructor(public file: File) {

    }
}
export class UploadEmailTempleteSuccess {
    readonly type = UPLOAD_EMAIL_TEMPLETE_SUCCESS;
    constructor() {

    }
}
export class UploadEmailTempleteFail {
    readonly type = UPLOAD_EMAIL_TEMPLETE_FAIL;
    constructor() {
    }
}

export class GetEditEnquaryData extends TokenizeAction {
    readonly type = GET_EDIT_ENQUARY_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class GetEditEnquaryDataSuccess extends TokenizeAction {
    readonly type = GET_EDIT_ENQUARY_DATA_SUCCESS;
    constructor(public token: string, public enquaryId: number, public data: QuoteEditData) {
        super(token);
    }
}
export class GetEditEnquaryDataFail extends TokenizeAction {
    readonly type = GET_EDIT_ENQUARY_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class OpenSettingPanel {
    readonly type = OPEN_SETTING_PANEL;
    constructor() { }
}

export class ViewMailHeaderAttachment {
    readonly type = VIEW_MAIL_HEADER_ATTACHMENT;
    constructor() {
    }
}
export class ViewMailHeaderAttachmentSuccess {
    readonly type = VIEW_MAIL_HEADER_ATTACHMENT_SUCCESS;
    constructor(public view: string) {
    }
}
export class ViewMailHeaderAttachmentFail {
    readonly type = VIEW_MAIL_HEADER_ATTACHMENT_FAIL;
    constructor() { }
}

export class SendNotificationAfterQuoteAdded extends TokenizeAction {
    readonly type = SEND_NOTIFICATION_AFTER_QUOTE_ADD;
    constructor(public token: string, public payload: { item: OpportunitySaveViewModel }) {
        super(token);
    }
}
export class SendNotification extends TokenizeAction {
    readonly type = SEND_NOTIFICATION;
    constructor(public token: string,
        public payload: { data: { email: string, feeEarnerCode: string, message: string, enquiryId: number } }) {
        super(token);
    }
}
export class SendNotificationSuccess extends TokenizeAction {
    readonly type = SEND_NOTIFICATION_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class SendNotificationFail extends TokenizeAction {
    readonly type = SEND_NOTIFICATION_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveReport extends TokenizeAction {
    readonly type = SAVE_REPORT_DATA;
    constructor(public token: string, public reportContent: string, public editedOpportunity: OpportunitySaveViewModel) {
        super(token);
    }
}
export class SaveReportSuccess extends TokenizeAction {
    readonly type = SAVE_REPORT_DATA_SUCCESS;
    constructor(public token: string, public reportContent: string,
        public editedOpportunity: OpportunitySaveViewModel, public reportId: number) {
        super(token);
    }
}
export class SaveReportFail extends TokenizeAction {
    readonly type = SAVE_REPORT_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeReportData extends TokenizeAction {
    readonly type = CHANGE_REPORT_DATA;
    constructor(public token: string, public payload: { newReport: PropertyQuReportview, type: string }) {
        super(token);
    }
}

export class ChangeColumFilteration extends TokenizeAction {
    readonly type = CHANGE_COLUM_FILTERATION;
    constructor(public token: string, public payload: { kind: string, columnDef: ColumnDef }) {
        super(token);
    }
}

export class CreateAMatter extends TokenizeAction implements Action {
    readonly type = CREATE_A_MATTER;
    constructor(public token: string, public item: OpportunitySaveViewModel) {
        super(token);
    }
}
export class CreateAMatterSuccess extends TokenizeAction implements Action {
    readonly type = CREATE_A_MATTER_SUCCESS;
    constructor(public token: string, public item: OpportunitySaveViewModel) {
        super(token);
    }
}
export class CreateAMatterFail extends TokenizeAction implements Action {
    readonly type = CREATE_A_MATTER_FAIL;
    constructor(public token: string) {
        super(token);
    }
}



export type Any = InitOpportunityPage | GetIntroductionList | GetIntroductionListSuccess | GetIntroductionListFail |
    GetFeeEarnerList | GetFeeEarnerListSuccess | GetFeeEarnerListFail |
    IntroductionSelectionChange | OpportunityDepartmentChange | OpportunityWorkTypeChange | OpportunityFeeEarnerChange |
    GetStatusList | GetStatusListSuccess | GetStatusListFail | OpportunityStatusChange | OpportunityRefreshGridData |
    OpportunityInputValueChange | OpportunitySetSelectedClientData | OpportunityModelClear |
    GetSaveOpportunityGridData | GetSaveOpportunityGridDataSuccess | GetSaveOpportunityGridDataFail |
    SendAndSaveOpportunities | SendAndSaveOpportunitiesSuccess | SendAndSaveOpportunitiesFail | ChangeTab |
    SaveAndQuoteOpportunities | SaveAndQuoteOpportunitiesSuccess | SaveAndQuoteOpportunitiesFail | ShowMessage |
    QuoteRun | GenarateQuoteRequest | GetTemplete | GetTempleteSuccess | GetTempleteFail |
    CloseOpportunitiesAccepted | CloseOpportunitiesAcceptedSuccess | CloseOpportunitiesAcceptedFail |
    CloseOpportunitiesRejected | CloseOpportunitiesRejectedSuccess | CloseOpportunitiesRejectedFail |
    ConflictRunOpportunities | GenarateQuote | GenarateQuoteSuccess | GenarateQuoteFail | PopupClose | CloseOpportunity |
    CloseOpportunityPopupClose | SendOpportunityFeeEarnerEmail | SendOpportunityFeeEarnerEmailSuccess | SendOpportunityFeeEarnerEmailFail |
    OpportunityCaseFileCreate | OpportunityCaseFileCreateSuccess | OpportunityCaseFileCreateFail | GetOpprtunityHistory |
    GetOpprtunityHistorySuccess | GetOpprtunityHistoryFail | GetLogFile | GetLogFileSuccess | GetLogFileFail | ChangePaginator |
    ApplyColumSort | UpdateSelectedRow | GetPropertQuoteType | GetPropertQuoteTypeSuccess | GetPropertQuoteTypeFail |
    ChangePropertyQuoteRequest | LoadWebQuoteComboData | LoadWebQuoteComboDataSuccess | LoadWebQuoteComboDataFail |
    RequestPropertyQuoteReport | PropertyQuoteReportLoading | PropertyQuoteReportLoadingSuccess | PropertyQuoteReportLoadingFail |
    ChangePropertQuStep | SendPropertyQuote | SendPropertyQuoteSuccess | SendPropertyQuoteFail | RequestToOpenMatter |
    ValidateMatterInfo | ValidateMatterInfoSuccess | ValidateMatterInfoFail | GetOpportunityStatusSummary |
    GetOpportunityStatusSummarySuccess | GetOpportunityStatusSummaryFail | InitPropertyQuote |
    LoadScreenList | LoadScreenListSuccess | LoadScreenListFail | SaveScreenList | SaveScreenListSuccess | SaveScreenListFail |
    GetAppCodeList | GetAppCodeListSuccess | GetAppCodeListFail | InitOppertunitySetting | ChangeSettingAppID | AddScreenItem |
    EditScreenItem | RemoveScreenItem | LoadInitScreenList | LoadInitScreenListSuccess | LoadInitScreenListFail |
    GetOpportunityStatusSummarySuccess | GetOpportunityStatusSummaryFail | InitPropertyQuote | SaveEditOpportunities |
    SaveEditOpportunitiesSuccess | SaveEditOpportunitiesFail | PropertyQuoteGetVars | PropertyQuoteGetVarsSuccess | InitOpertunityEdit |
    PropertyQuoteGetVarsFail | UploadEmailTemplete | UploadEmailTempleteSuccess | UploadEmailTempleteFail | GetEditEnquaryData |
    GetEditEnquaryDataSuccess | GetEditEnquaryDataFail | ViewMailHeaderAttachment | ViewMailHeaderAttachmentSuccess |
    ViewMailHeaderAttachmentFail | OpenSettingPanel | GetWebQuoteCompnayDetals | GetWebQuoteCompnayDetalsSuccess |
    GetWebQuoteCompnayDetalsFail | SendNotification | SendNotificationSuccess | SendNotificationFail | SendNotificationAfterQuoteAdded |
    LoadExistingReport | SaveReport | SaveReportSuccess | SaveReportFail | ChangeReportData | ChangeColumFilteration | CreateAMatter |
    CreateAMatterSuccess | CreateAMatterFail;
