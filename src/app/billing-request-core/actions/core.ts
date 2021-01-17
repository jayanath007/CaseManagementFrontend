import {
    NominalList, DescriptionList, MatterData, BillingRequestViewModel, BillingDisbursmentRequestViewModel,
    BillingTimeRecordResponseModel, DisbursementResponseModel, NominalCodeRequestViewModel,
    BillingRequestImportGridData, BillingRequestProcessViewModel, BillingRequestTimeProfitHeaderResponseModel,
    TimeProfitHeaderResponseModel, VatCode, SelectInput, HeaderGridDataModel, BillingRequestDisbursExpenseHeaderViewModel,
    DisbursmentHeaderWrapperModel, BillingRequestReportViewModel,
    PrintSettingModel,
    MatterBalancesModel,
    QuickBillResponseModel,
    BillingAddressResponceModel,
    ControllerDataModel,
    BillingAddressRequestViewModel,
    DropdownDataResponceModel, FeeEarner, EditTimeRecordData, PrintPreviewPathResponce, BillRequestEditData, BillingRequestInputData
} from './../models/interfaces';

import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { InfoDialogType } from '../../core/utility/DpsUtility';
import { MatterSearchGridData } from '../../core/lib/matter';
import { DetailStatus } from '../../shared';

export const INIT_BILLING_REQUEST = 'DPS_BILLING_REQUEST';

export const BILLING_REQUEST_FEEEARNER_LIST = 'DPS_BILLING_REQUEST_FEEEARNER_LIST';
export const BILLING_REQUEST_FEEEARNER_LIST_SUCCESS = 'DPS_BILLING_REQUEST_FEEEARNER_LIST_SUCCESS';
export const BILLING_REQUEST_FEEEARNER_LIST_FAIL = 'DPS_BILLING_REQUEST_FEEEARNER_LIST_FAIL';

export const GET_BILLING_REQUEST_VAT_CODE_LIST = 'DPS_BILLING_REQUEST_VAT_CODE_LIST';
export const GET_BILLING_REQUEST_VAT_CODE_LIST_SUCCESS = 'DPS_BILLING_REQUEST_VAT_CODE_LIST_SUCCESS';
export const GET_BILLING_REQUEST_VAT_CODE_LIST_FAIL = 'DPS_BILLING_REQUEST_VAT_CODE_LIST_FAIL';

export const BILLING_REQUEST_NOMINAL_LIST = 'DPS_BILLING_REQUEST_NOMINAL_LIST';
export const BILLING_REQUEST_NOMINAL_LIST_SUCCESS = 'DPS_BILLING_REQUEST_NOMINAL_LIST_SUCCESS';
export const BILLING_REQUEST_NOMINAL_LIST_FAIL = 'DPS_BILLING_REQUEST_NOMINAL_LIST_FAIL';

export const BILLING_REQUEST_DESCRIPTION_LIST = 'DPS_BILLING_REQUEST_DESCRIPTION_LIST';
export const BILLING_REQUEST_DESCRIPTION_LIST_SUCCESS = 'DPS_BILLING_REQUEST_DESCRIPTION_LIST_SUCCESS';
export const BILLING_REQUEST_DESCRIPTION_LIST_FAIL = 'DPS_BILLING_REQUEST_DESCRIPTION_LIST_FAIL';

export const BILLING_REQUEST_MATTER_INFO_BY_REF = 'DPS_BILLING_REQUEST_MATTER_INFO_BY_REF';
export const BILLING_REQUEST_MATTER_INFO_BY_REF_SUCCESS = 'DPS_BILLING_REQUEST_MATTER_INFO_BY_REF_SUCCESS';
export const BILLING_REQUEST_MATTER_INFO_BY_REF_FAIL = 'DPS_BILLING_REQUEST_MATTER_INFO_BY_REF_FAIL';

export const BILLING_REQUEST_MATTER_DATA_CHANGE = 'DPS_BILLING_REQUEST_MATTER_DATA_CHANGE';
// export const BILLING_REQUEST_MATTER_DATA_CHANGE_SUCCESS = 'DPS_BILLING_REQUEST_MATTER_DATA_CHANGE_SUCCESS';
// export const BILLING_REQUEST_MATTER_DATA_CHANGE_FAIL = 'DPS_BILLING_REQUEST_MATTER_DATA_CHANGE_FAIL';

export const BILLING_REQUEST_QUICK_BILL_PROCESS_DATA = 'DPS_BILLING_REQUEST_QUICK_BILL_PROCESS_DATA';
export const BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_SUCCESS = 'DPS_BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_SUCCESS';
export const BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_FAIL = 'DPS_BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_FAIL';

export const BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER = 'DPS_BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER';
export const BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_SUCCESS = 'DPS_BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_SUCCESS';
export const BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_FAIL = 'DPS_BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_FAIL';

export const BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER = 'DPS_BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER';
export const BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_SUCCESS = 'DPS_BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_SUCCESS';
export const BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_FAIL = 'DPS_BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_FAIL';

export const BILLING_REQUEST_SELECT_TIME_OPEN = 'DPS_BILLING_REQUEST_SELECT_TIME_OPEN';
export const BILLING_REQUEST_DISBURSMENT_OPEN = 'DPS_BILLING_REQUEST_DISBURSMENT_OPEN';
export const BILLING_REQUEST_SET_TIME_SELECT_ROW = 'DPS_BILLING_REQUEST_SET_TIME_SELECT_ROW';
export const BILLING_REQUEST_SET_TIME_SELECT_ROW_VALUE = 'DPS_BILLING_REQUEST_SET_TIME_SELECT_ROW_VALUE';
export const BILLING_REQUEST_SET_DISBS_SELECT_ROW = 'DPS_BILLING_REQUEST_SET_DISBS_SELECT_ROW';
export const BILLING_REQUEST_SET_DISBS_SELECT_ROW_VALUE = 'DPS_BILLING_REQUEST_DISBS_TIME_SELECT_ROW_VALUE';

export const BILLING_REQUEST_TIME_COST_OK_CLICK = 'DPS_BILLING_REQUEST_TIME_COST_OK_CLICK';
export const BILLING_REQUEST_TIME_COST_OK_CLICK_SUCCESS = 'DPS_BILLING_REQUEST_TIME_COST_OK_CLICK_SUCCESS';
export const BILLING_REQUEST_TIME_COST_OK_CLICK_FAIL = 'DPS_BILLING_REQUEST_TIME_COST_OK_CLICK_FAIL';

export const BILLING_REQUEST_DISBUS_EXPENSE_OK_CLICK = 'DPS_BILLING_REQUEST_DISBUS_EXPENSE_OK_CLICK';
export const BILLING_REQUEST_PROFIT_COST_AND_EXPENSE_ROW_DATA = 'DPS_BILLING_REQUEST_PROFIT_COST_AND_EXPENSE_ROW_DATA';
// export const BILLING_REQUEST_EXPENSE_ROW_DATA = 'DPS_BILLING_REQUEST_EXPENSE_ROW_DATA';
export const TIME_COST_GRID_SELECT_ROW = 'DPS_TIME_COST_GRID_SELECT_ROW';
export const DISBURSMENT_HEADER_GRID_SELECT_ROW = 'DPS_DISBURSMENT_HEADER_GRID_SELECT_ROW';
export const BILLING_REQUEST_ALL_SELECT_UNSELECT_WRITE_OFF = 'DPS_BILLING_REQUEST_ALL_SELECT_UNSELECT_WRITE_OFF';
export const BILLING_REQUEST_ALLOCATE_SELCT_CHANGE = 'DPS_BILLING_REQUEST_ALLOCATE_SELCT_CHANGE';
export const BILLING_REQUEST_HEADER_GRID_DOUBLE_CLICK = 'DPS_BILLING_REQUEST_HEADER_GRID_DOUBLE_CLICK';
export const BILLING_REQUEST_NARRATIVE_TEXT_UPDATE = 'DPS_BILLING_REQUEST_NARRATIVE_TEXT_UPDATE';
// export const ADD_TIME_COST_GRID_HEADER_ROW = 'DPS_ADD_TIME_COST_GRID_HEADER_ROW';
export const BILLING_REQUEST_DISBURSMENT_ADD_HEADER_ROW = 'DPS_BILLING_REQUEST_DISBURSMENT_ADD_HEADER_ROW';

export const BILLING_REQUEST_PRINT_SETTING = 'DPS_BILLING_REQUEST_PRINT_SETTING';
export const BILLING_REQUEST_PRINT_SETTING_SUCCESS = 'DPS_BILLING_REQUEST_PRINT_SETTING_SUCCESS';
export const BILLING_REQUEST_PRINT_SETTING_FAIL = 'DPS_BILLING_REQUEST_PRINT_SETTING_FAIL';

export const BILLING_REQUEST_MATTER_BALANCES = 'DPS_BILLING_REQUEST_MATTER_BALANCES';
export const BILLING_REQUEST_MATTER_BALANCES_SUCCESS = 'DPS_BILLING_REQUEST_MATTER_BALANCES_SUCCESS';
export const BILLING_REQUEST_MATTER_BALANCES_FAIL = 'DPS_BILLING_REQUEST_MATTER_BALANCES_FAIL';
export const BILLING_REQUEST_PROFORMA_CHECK = 'DPS_BILLING_REQUEST_PROFORMA_CHECK';
export const BILLING_REQUEST_BILL_CHECK = 'DPS_BILLING_REQUEST_BILL_CHECK';

export const BILLING_REQUEST_PRINT_SETTING_CLICK = 'DPS_BILLING_REQUEST_PRINT_SETTING_CLICK';

export const BILLING_REQUEST_REMOVE_ALL_GRID_DATA = 'DPS_BILLING_REQUEST_REMOVE_ALL_GRID_DATA';
export const BILLING_REQUEST_CONTROLLER_VALUE_UPDATING = 'DPS_BILLING_REQUEST_CONTROLLER_VALUE_UPDATING';
export const BILLING_REQUEST_PRINT_CONTROLLER_VALUE_UPDATING = 'DPS_BILLING_REQUEST_PRINT_CONTROLLER_VALUE_UPDATING';

export const BILLING_REQUEST_SAVE_POST_PRINT_DATA = 'DPS_BILLING_REQUEST_SAVE_POST_PRINT_DATA';
export const BILLING_REQUEST_SAVE_POST_PRINT_DATA_SUCCESS = 'DPS_BILLING_REQUEST_SAVE_POST_PRINT_DATA_SUCCESS';
export const BILLING_REQUEST_SAVE_POST_PRINT_DATA_FAIL = 'DPS_BILLING_REQUEST_SAVE_POST_PRINT_DATA_FAIL';
export const BILLING_REQUEST_PRINT_DATA_SUCCESS = 'DPS_BILLING_REQUEST_PRINT_DATA_SUCCESS';

export const SAVE_PRINT_MAKE_DEFAULT_ALL_BILL = 'DPS_SAVE_PRINT_MAKE_DEFAULT_ALL_BILL';
export const SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_SUCCESS = 'DPS_SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_SUCCESS';
export const SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_FAIL = 'DPS_SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_FAIL';

export const BILLING_REQUEST_PRINT_SETTING_INIT_DATA = 'DPS_BILLING_REQUEST_PRINT_SETTING_INIT_DATA';

export const BILLING_REQUEST_PRINT_SETTING_ADDRESS = 'DPS_BILLING_REQUEST_PRINT_SETTING_ADDRESS';
export const BILLING_REQUEST_PRINT_SETTING_ADDRESS_SUCCESS = 'DPS_BILLING_REQUEST_PRINT_SETTING_ADDRESS_SUCCESS';
export const BILLING_REQUEST_PRINT_SETTING_ADDRESS_FAIL = 'DPS_BILLING_REQUEST_PRINT_SETTING_ADDRESS_FAIL';

export const BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA = 'DPS_BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA';
export const BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_SUCCESS = 'DPS_BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_SUCCESS';
export const BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_FAIL = 'DPS_BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_FAIL';

export const SAVE_BILLING_ADDRESS = 'DPS_SAVE_BILLING_ADDRESS_';
export const SAVE_BILLING_ADDRESS_SUCCESS = 'DPS_SAVE_BILLING_ADDRESS__SUCCESS';
export const SAVE_BILLING_ADDRESS_FAIL = 'DPS_SAVE_BILLING_ADDRESS__FAIL';

export const CHANGE_BILLING_ADDRESS_TYPE = 'DPS_CHANGE_BILLING_ADDRESS_TYPE';

export const BILLING_REQUEST_PROFIT_COST_ROW_EDIT = 'DPS_BILLING_REQUEST_PROFIT_COST_ROW_EDIT';
export const BILLING_REQUEST_EXPENSE_ROW_EDIT = 'DPS_BILLING_REQUEST_EXPENSE_ROW_EDIT';
export const BILLING_REQUEST_DISBURSMENT_ROW_EDIT = 'DPS_BILLING_REQUEST_DISBURSMENT_ROW_EDIT';
export const BILLING_REQUEST_ROW_DELETE = 'DPS_BILLING_REQUEST_ROW_DELETE';

export const BILLING_REQUEST_DROP_DOWN_SELCT_CHANGE = 'DPS_BILLING_REQUEST_DROP_DOWN_SELCT_CHANGE';
export const BILLING_REQUEST_SHOW_MESSAGE = 'DPS_BILLING_REQUEST_SHOW_MESSAGE';
export const BILLING_REQUEST_SHOW_REPORT = 'DPS_BILLING_REQUEST_SHOW_REPORT';

export const BILLING_REQUEST_NOMINAL_BY_USER = 'DPS_BILLING_REQUEST_NOMINAL_BY_USER';
export const BILLING_REQUEST_NOMINAL_BY_USER_SUCCESS = 'BILLING_REQUEST_NOMINAL_BY_USER_SUCCESS';
export const BILLING_REQUEST_NOMINAL_BY_USER_FAIL = 'DPS_BILLING_REQUEST_NOMINAL_BY_USER_FAIL';

export const BILLING_REQUEST_EDIT_TIME_ENTRY = 'DPS_BILLING_REQUEST_EDIT_TIME_ENTRY';

export const BILLING_REQUEST_EDIT_TIME_ENTRY_SAVE = 'DPS_BILLING_REQUEST_EDIT_TIME_ENTRY_SAVE';
export const BILLING_REQUEST_EDIT_TIME_ENTRY_SUCCESS = 'DPS_BILLING_REQUEST_EDIT_TIME_ENTRY_SUCCESS';
export const BILLING_REQUEST_EDIT_TIME_ENTRY_FAIL = 'DPS_BILLING_REQUEST_EDIT_TIME_ENTRY_FAIL';

export const GET_DOCUMENT_PREVIEW_TOKEN = 'DPS_BILLING_REQUEST_GET_DOCUMENT_PREVIEW_TOKEN';
export const GET_DOCUMENT_PREVIEW_TOKEN_SUCCESS = 'DPS_BILLING_REQUEST_GET_DOCUMENT_PREVIEW_TOKEN_SUCCESS';
export const GET_DOCUMENT_PREVIEW_TOKEN_FAIL = 'DPS_BILLING_REQUEST_GET_DOCUMENT_PREVIEW_TOKEN_FAIL';

export const GET_EDIT_DATA = 'BILLING_REQUEST_GET_EDIT_DATA';
export const GET_EDIT_DATA_SUCCESS = 'DPS_BILLING_REQUEST_GET_EDIT_DATA_SUCCESS';
export const GET_EDIT_DATA_FAIL = 'DPS_BILLING_REQUEST_GET_EDIT_DATA_FAIL';

export const CHECK_IS_VALID_DELETE_REQUEST = 'BILLING_REQUEST_CHECK_IS_VALID_DELETE_REQUEST';
export const CHECK_IS_VALID_DELETE_REQUEST_SUCCESS = 'DPS_BILLING_REQUEST_CHECK_IS_VALID_DELETE_REQUEST_SUCCESS';
export const CHECK_IS_VALID_DELETE_REQUEST_FAIL = 'DPS_BILLING_REQUEST_CHECK_IS_VALID_DELETE_REQUEST_FAIL';

export const DELETE_REQUEST = 'BILLING_REQUEST_DELETE_REQUEST';
export const DELETE_REQUEST_SUCCESS = 'DPS_BILLING_REQUEST_DELETE_REQUEST_SUCCESS';
export const DELETE_REQUEST_FAIL = 'DPS_BILLING_REQUEST_DELETE_REQUEST_FAIL';


export class InitPage extends TokenizeAction implements Action {
    readonly type = INIT_BILLING_REQUEST;
    constructor(public token: string, public payload: {
        inputData: BillingRequestInputData,
        timeOffset: number
    }) {
        super(token);
    }
}
export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_FEEEARNER_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_FEEEARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarner[] }) {
        super(token);
    }
}
export class LoadFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_FEEEARNER_LIST_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetVatCode extends TokenizeAction implements Action {
    readonly type = GET_BILLING_REQUEST_VAT_CODE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetVatCodeSuccess extends TokenizeAction implements Action {
    readonly type = GET_BILLING_REQUEST_VAT_CODE_LIST_SUCCESS;
    constructor(public token: string, public payload: { vatCodeList: VatCode[] }) {
        super(token);
    }
}
export class GetVatCodeFail extends TokenizeAction implements Action {
    readonly type = GET_BILLING_REQUEST_VAT_CODE_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class GetNominalList extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_NOMINAL_LIST;
    constructor(public token: string, public nominalCodeRequestViewModel: NominalCodeRequestViewModel) {
        super(token);
    }
}
export class GetNominalListListSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_NOMINAL_LIST_SUCCESS;
    constructor(public token: string, public payload: { nominalList: NominalList[] }) {
        super(token);
    }
}
export class GetNominalListListFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_NOMINAL_LIST_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetDescriptionList extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DESCRIPTION_LIST;
    constructor(public token: string, public shortCutType: string) {
        super(token);
    }
}
export class GetDescriptionSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DESCRIPTION_LIST_SUCCESS;
    constructor(public token: string, public payload: { descriptionList: DescriptionList[] }) {
        super(token);
    }
}
export class GetDescriptionFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DESCRIPTION_LIST_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetQuickBillProcess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_QUICK_BILL_PROCESS_DATA;
    constructor(public token: string, public getTimeModel: BillingRequestViewModel) {
        super(token);
    }
}
export class GetQuickBillProcessSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_SUCCESS;
    constructor(public token: string, public payload: { timeAndDisbursementRecordList: QuickBillResponseModel }) { // model need to change
        super(token);
    }
}
export class GetQuickBillProcessFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetTimeRecordListByMatter extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER;
    constructor(public token: string, public getTimeModel: BillingRequestViewModel) {
        super(token);
    }
}
export class GetTimeRecordListSuccessByMatter extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_SUCCESS;
    constructor(public token: string, public payload: { timeRecordList: BillingTimeRecordResponseModel[] }) { // model need to change
        super(token);
    }
}
export class GetTimeRecordListFailByMatter extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetDisbursementListByMatter extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER;
    constructor(public token: string, public getDisbursementModel: BillingDisbursmentRequestViewModel) {
        super(token);
    }
}
export class GetDisbursementListByMatterSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_SUCCESS;
    constructor(public token: string, public payload: { disbursementList: DisbursementResponseModel[] }) { // model need to change
        super(token);
    }
}
export class GetDisbursementListByMatterFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetMatterDataByRef extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_MATTER_INFO_BY_REF;
    constructor(public token: string, public matterRef: string) {
        super(token);
    }
}
export class GetMatterDataByRefSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_MATTER_INFO_BY_REF_SUCCESS;
    constructor(public token: string, public payload: { matterData: MatterData }) {
        super(token);
    }
}
export class GetMatterDataByRefFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_MATTER_INFO_BY_REF_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class MatterDataChange extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_MATTER_DATA_CHANGE;
    constructor(public token: string, public payload: { matterData: MatterData, timeOffset: number }) {
        super(token);
    }
}
export class SelectTimePopupOpen extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SELECT_TIME_OPEN;
    constructor(public token: string, public formType: string) {
        super(token);
    }
}
export class DisbursmentPopupOpen extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DISBURSMENT_OPEN;
    constructor(public token: string, public formType: string) {
        super(token);
    }
}
export class TimeGridSelectRowUpdate extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SET_TIME_SELECT_ROW;
    constructor(public token: string, public row: BillingRequestImportGridData<BillingTimeRecordResponseModel>,
        public isMultiSelect: boolean) {
        super(token);
    }
}
export class TimeGridSelectRowValueUpdate extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SET_TIME_SELECT_ROW_VALUE;
    constructor(public token: string, public rowStatus: string) {
        super(token);
    }
}
export class DisbursmentGridSelectRowUpdate extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SET_DISBS_SELECT_ROW;
    constructor(public token: string, public row: BillingRequestImportGridData<DisbursementResponseModel>,
        public isMultiSelect: boolean) {
        super(token);
    }
}
export class DisbursmentGridSelectRowValueUpdate extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SET_DISBS_SELECT_ROW_VALUE;
    constructor(public token: string, public rowStatus: string) {
        super(token);
    }
}
export class TimeAndProfitProcess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_TIME_COST_OK_CLICK;
    constructor(public token: string, public model: BillingRequestProcessViewModel) {
        super(token);
    }
}
export class TimeAndProfitProcessSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_TIME_COST_OK_CLICK_SUCCESS;
    constructor(public token: string,
        public payload: { timeProfitHeaderDataViewModel: BillingRequestTimeProfitHeaderResponseModel[] }) {
        super(token);
    }
}
export class TimeAndProfitProcessFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_TIME_COST_OK_CLICK_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class TimeAndCostGridSelectRow extends TokenizeAction implements Action {
    readonly type = TIME_COST_GRID_SELECT_ROW;
    constructor(public token: string, public row: TimeProfitHeaderResponseModel<BillingRequestTimeProfitHeaderResponseModel>) {
        super(token);
    }
}

// export class AddTimeAndCostHeaderRow extends TokenizeAction implements Action {
//     readonly type = ADD_TIME_COST_GRID_HEADER_ROW;
//     constructor(public token: string,
//         public payload: { timeProfitHeaderDataViewModel: BillingRequestTimeProfitHeaderResponseModel[] }) {
//         super(token);
//     }
// }
export class DisbursmentAddHeaderRow extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DISBURSMENT_ADD_HEADER_ROW;
    constructor(public token: string,
        public payload: { disbsAndExpenseHeaderGridDataModel: BillingRequestDisbursExpenseHeaderViewModel[] }) {
        super(token);
    }
}
export class DisbursmentHeaderGridSelectRow extends TokenizeAction implements Action {
    readonly type = DISBURSMENT_HEADER_GRID_SELECT_ROW;
    constructor(public token: string, public row: DisbursmentHeaderWrapperModel<BillingRequestDisbursExpenseHeaderViewModel>) {
        super(token);
    }
}
export class DisbusAndExpenseProcess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DISBUS_EXPENSE_OK_CLICK;
    constructor(public token: string, public rowStatus: string) {
        super(token);
    }
}
export class AllSelectUnselectWriteOffGridRow extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_ALL_SELECT_UNSELECT_WRITE_OFF;
    constructor(public token: string, public rowStatus: string) {
        super(token);
    }
}
export class AllocateSelectChangeValue extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_ALLOCATE_SELCT_CHANGE;
    constructor(public token: string, public selectValue: SelectInput) {
        super(token);
    }
}
export class HeaderGridDoubleClick extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_HEADER_GRID_DOUBLE_CLICK;
    constructor(public token: string, public selectDataModel: HeaderGridDataModel<any>) {
        super(token);
    }
}
export class AddProfitCostAndExpensePopupOpen extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PROFIT_COST_AND_EXPENSE_ROW_DATA;
    constructor(public token: string, public formType: string) {
        super(token);
    }
}
// export class AddExpenseRowDataPopupOpen extends TokenizeAction implements Action {
//     readonly type = BILLING_REQUEST_EXPENSE_ROW_DATA;
//     constructor(public token: string, public formType: string) {
//         super(token);
//     }
// }
export class SetNarrativeItemText extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_NARRATIVE_TEXT_UPDATE;
    constructor(public token: string, public narrativeText: string) {
        super(token);
    }
}
export class GetUserDefaultPrintSettings extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING;
    constructor(public token: string) {
        super(token);
    }
}
export class GetUserDefaultPrintSettingsSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_SUCCESS;
    constructor(public token: string, public payload: { printSetting: PrintSettingModel }) {
        super(token);
    }
}
export class GetUserDefaultPrintSettingsFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetMatterBalances extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_MATTER_BALANCES;
    constructor(public token: string, public payload: { matterRef: string }) {
        super(token);
    }
}
export class GetMatterBalancesSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_MATTER_BALANCES_SUCCESS;
    constructor(public token: string, public payload: { matterBalances: MatterBalancesModel[] }) {
        super(token);
    }
}
export class GetMatterBalancesFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_MATTER_BALANCES_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class ProformaCheckChange extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PROFORMA_CHECK;
    constructor(public token: string, public isCheck: boolean) {
        super(token);
    }
}
export class BillCheckChange extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_BILL_CHECK;
    constructor(public token: string, public isCheck: boolean) {
        super(token);
    }
}
export class PrintSettingClick extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_CLICK;
    constructor(public token: string) {
        super(token);
    }
}
// export class GetPrintSettingInitData extends TokenizeAction implements Action {
//     readonly type = BILLING_REQUEST_PRINT_SETTING_INIT_DATA;
//     constructor(public token: string) {
//         super(token);
//     }
// }
export class GetPrintSettingAddress extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_ADDRESS;
    constructor(public token: string, public payload: { addressRequestViewModel: BillingAddressRequestViewModel }) {
        super(token);
    }
}
export class GetPrintSettingAddressSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_ADDRESS_SUCCESS;
    constructor(public token: string, public payload: { addressList: BillingAddressResponceModel[] }) { // need to change the model
        super(token);
    }
}
export class GetPrintSettingAddressFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_ADDRESS_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetPrintSettingComboboxData extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA;
    constructor(public token: string, public payload: { dropdownRequestData: string[] }) {
        super(token);
    }
}
export class GetPrintSettingComboboxDataSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_SUCCESS;
    constructor(public token: string, public payload: { allDropdownData: DropdownDataResponceModel[] }) {
        super(token);
    }
}
export class GetPrintSettingComboboxDataFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class RemoveAllGridDataByType extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_REMOVE_ALL_GRID_DATA;
    constructor(public token: string, public gridType: string) {
        super(token);
    }
}
export class SetControllerValue extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_CONTROLLER_VALUE_UPDATING;
    constructor(public token: string, public payload: { controllerDataModel: ControllerDataModel }) {
        super(token);
    }
}
export class SetPrintControllerValue extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_CONTROLLER_VALUE_UPDATING;
    constructor(public token: string, public payload: { controllerDataModel: any }) { // Key and Value
        super(token);
    }
}
export class BillingRequestSaveData extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SAVE_POST_PRINT_DATA;
    constructor(public token: string, public payload: { totalsAndbuttonTypeModel: any }) {
        super(token);
    }
}
export class BillingRequestSaveDataSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SAVE_POST_PRINT_DATA_SUCCESS;
    constructor(public token: string,
        public payload: { successMessage: string, saveSuccessDataModel: BillingRequestReportViewModel, timeOffset: number }) {
        // need to data model
        super(token);
    }
}
export class BillingRequestPrintDataSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PRINT_DATA_SUCCESS;
    constructor(public token: string, public payload: { printSuccessDataModel: PrintPreviewPathResponce }) {
        super(token);
    }
}
export class BillingRequestSaveDataFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SAVE_POST_PRINT_DATA_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class SavePrintMakeDefaultAllBill extends TokenizeAction implements Action {
    readonly type = SAVE_PRINT_MAKE_DEFAULT_ALL_BILL;
    constructor(public token: string) {
        super(token);
    }
}
export class SavePrintMakeDefaultAllBillSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_SUCCESS;
    constructor(public token: string, public payload: { savePrintSettingResponce: PrintSettingModel[] }) { // need to change the model
        super(token);
    }
}
export class SavePrintMakeDefaultAllBillFail extends TokenizeAction implements Action {
    readonly type = SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class SaveBillingAddress extends TokenizeAction implements Action {
    readonly type = SAVE_BILLING_ADDRESS;
    constructor(public token: string, public selectedData: BillingAddressResponceModel) {
        super(token);
    }
}
export class SaveBillingAddressSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_BILLING_ADDRESS_SUCCESS;
    constructor(public token: string, public payload: { savedAddressList: BillingAddressResponceModel[] }) {
        super(token);
    }
}
export class SaveBillingAddressFail extends TokenizeAction implements Action {
    readonly type = SAVE_BILLING_ADDRESS_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class ChangeBillingAddressType extends TokenizeAction implements Action {
    readonly type = CHANGE_BILLING_ADDRESS_TYPE;
    constructor(public token: string, public SelectedType: string) {
        super(token);
    }
}
export class BillingRequestProfitCostGridRowEdit extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_PROFIT_COST_ROW_EDIT;
    constructor(public token: string,
        public payload: { rowId: string, timeProfitHeaderModel: BillingRequestTimeProfitHeaderResponseModel }) {
        super(token);
    }
}
export class BillingRequestExpenseGridRowEdit extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_EXPENSE_ROW_EDIT;
    constructor(public token: string,
        public payload: { rowId: string, disbsAndExpenseHeaderModel: BillingRequestDisbursExpenseHeaderViewModel }) {
        super(token);
    }
}
export class BillingRequestDisbursmentRowEdit extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DISBURSMENT_ROW_EDIT;
    constructor(public token: string,
        public payload: { rowId: string, disbursmentEditData: any }) {
        super(token);
    }
}
export class BillingRequestGridRowDelete extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_ROW_DELETE;
    constructor(public token: string, public payload: { formTypeAndRowID: any }) { /////////////
        super(token);
    }
}
export class DropDownSelectChangeValue extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_DROP_DOWN_SELCT_CHANGE;
    constructor(public token: string, public payload: { propertyName: string, selectedValue: SelectInput }) {
        super(token);
    }
}
export class GetNominalDefaultByInit extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_NOMINAL_BY_USER;
    constructor(public token: string) {
        super(token);
    }
}
export class GetNominalByUserSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_NOMINAL_BY_USER_SUCCESS;
    constructor(public token: string, public payload: { selectingNominalCode: string }) {
        super(token);
    }
}
export class GetNominalByUserFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_NOMINAL_BY_USER_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class ShowReport extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_SHOW_REPORT;
    constructor(public token: string, public payload: { reportType: string, diaryId: number, letterName: string, matterInfo: MatterData }) {
        super(token);
    }
}
export class ShowMessage extends TokenizeAction {
    readonly type = BILLING_REQUEST_SHOW_MESSAGE;
    constructor(public token: string, public payload: {
        title: string, message: string, reportType: string, diaryId: number, letterName: string, matterInfo: MatterData
    }) {
        super(token);
    }
}
export class EditTimeEntryPopupOpen extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_EDIT_TIME_ENTRY;
    constructor(public token: string, public payload: { rowData: BillingTimeRecordResponseModel }) {
        super(token);
    }
}
export class EditTimeEntrySave extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_EDIT_TIME_ENTRY_SAVE;
    constructor(public token: string, public payload: { timeEditModel: EditTimeRecordData }) {
        super(token);
    }
}
export class GetEditTimeRecordDataSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_EDIT_TIME_ENTRY_SUCCESS;
    constructor(public token: string, public payload: { responceModel: EditTimeRecordData }) {
        super(token);
    }
}
export class GetEditTimeRecordDataFail extends TokenizeAction implements Action {
    readonly type = BILLING_REQUEST_EDIT_TIME_ENTRY_FAIL;
    constructor(public token: string, error: any) {
        super(token);
    }
}
export class GetDocumentPreviewToken extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_PREVIEW_TOKEN;
    constructor(public token: string, public fileName: string) {
        super(token);
    }
}
export class GetDocumentPreviewTokenSuccess extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_PREVIEW_TOKEN_SUCCESS;
    constructor(public token: string, public viewToken: string, public fileName) {
        super(token);
    }
}
export class GetDocumentPreviewTokenFail extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_PREVIEW_TOKEN_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class GetEditData extends TokenizeAction implements Action {
    readonly type = GET_EDIT_DATA;
    constructor(public token: string, public materRef: string, public branchid: number,
        public billReqId: number) {
        super(token);
    }
}
export class GetEditDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_EDIT_DATA_SUCCESS;
    constructor(public token: string, public editData: BillRequestEditData) {
        super(token);
    }
}
export class GetEditDataFail extends TokenizeAction implements Action {
    readonly type = GET_EDIT_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class CheckIsValidDeleteRequest extends TokenizeAction implements Action {
    readonly type = CHECK_IS_VALID_DELETE_REQUEST;
    constructor(public token: string) {
        super(token);
    }
}
export class CheckIsValidDeleteRequestSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_IS_VALID_DELETE_REQUEST_SUCCESS;
    constructor(public token: string, public detailStatus: DetailStatus[]) {
        super(token);
    }
}
export class CheckIsValidDeleteRequestFail extends TokenizeAction implements Action {
    readonly type = CHECK_IS_VALID_DELETE_REQUEST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteRequest extends TokenizeAction implements Action {
    readonly type = DELETE_REQUEST;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteRequestSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_REQUEST_SUCCESS;
    constructor(public token: string, public data: any) {
        super(token);
    }
}
export class DeleteRequestFail extends TokenizeAction implements Action {
    readonly type = DELETE_REQUEST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export type Any = InitPage | LoadFeeEarnerList | LoadFeeEarnerListSuccess | LoadFeeEarnerListFail | DisbursmentPopupOpen |
    GetVatCode | GetVatCodeSuccess | GetVatCodeFail | GetNominalList | GetNominalListListSuccess | GetNominalListListFail |
    GetDescriptionList | GetDescriptionSuccess | GetDescriptionFail | GetMatterDataByRef | GetMatterDataByRefSuccess |
    GetMatterDataByRefFail | MatterDataChange | GetTimeRecordListByMatter | GetTimeRecordListSuccessByMatter | SelectTimePopupOpen |
    GetTimeRecordListFailByMatter | GetDisbursementListByMatter | GetDisbursementListByMatterSuccess | GetDisbursementListByMatterFail |
    TimeGridSelectRowUpdate | TimeGridSelectRowValueUpdate | DisbursmentGridSelectRowUpdate | DisbursmentGridSelectRowValueUpdate |
    TimeAndProfitProcess | TimeAndProfitProcessSuccess | TimeAndProfitProcessFail | DisbusAndExpenseProcess |
    AddProfitCostAndExpensePopupOpen | TimeAndCostGridSelectRow | DisbursmentHeaderGridSelectRow | PrintSettingClick |
    AllSelectUnselectWriteOffGridRow | AllocateSelectChangeValue | HeaderGridDoubleClick | SetNarrativeItemText | DisbursmentAddHeaderRow |
    GetUserDefaultPrintSettings | GetUserDefaultPrintSettingsSuccess | GetUserDefaultPrintSettingsFail |
    GetMatterBalances | GetMatterBalancesSuccess | GetMatterBalancesFail | ProformaCheckChange | GetQuickBillProcess |
    GetQuickBillProcessSuccess | GetQuickBillProcessFail | RemoveAllGridDataByType | SetControllerValue | SetPrintControllerValue |
    BillingRequestSaveData | BillingRequestSaveDataSuccess | BillingRequestSaveDataFail | SavePrintMakeDefaultAllBill |
    SavePrintMakeDefaultAllBillSuccess | SavePrintMakeDefaultAllBillFail | BillingRequestExpenseGridRowEdit |
    GetPrintSettingAddress | GetPrintSettingAddressSuccess | GetPrintSettingAddressFail | BillingRequestGridRowDelete |
    GetPrintSettingComboboxData | GetPrintSettingComboboxDataSuccess | GetPrintSettingComboboxDataFail | ShowReport |
    SaveBillingAddress | SaveBillingAddressSuccess | SaveBillingAddressFail | ChangeBillingAddressType | BillingRequestPrintDataSuccess |
    BillingRequestProfitCostGridRowEdit | BillingRequestDisbursmentRowEdit | DropDownSelectChangeValue | ShowMessage |
    GetNominalDefaultByInit | GetNominalByUserSuccess | GetNominalByUserFail | EditTimeEntryPopupOpen | GetEditTimeRecordDataSuccess |
    GetEditTimeRecordDataFail | EditTimeEntrySave | BillCheckChange | GetDocumentPreviewToken | GetDocumentPreviewTokenSuccess |
    GetDocumentPreviewTokenFail | GetEditData | GetEditDataSuccess | GetEditDataFail | CheckIsValidDeleteRequest |
    CheckIsValidDeleteRequestSuccess | CheckIsValidDeleteRequestFail | DeleteRequest | DeleteRequestSuccess | DeleteRequestFail;
