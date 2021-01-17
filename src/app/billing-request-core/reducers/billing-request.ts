import { SaveButtonTypeText, PopupOpenMode, DropDownPropertyName } from './../models/enums';
import { TableRow } from './../../shared/models/interface';
import {
    DescriptionList, BillingRequestImportGridDataWrapper, BillingRequestTimeProfitHeaderResponseModel,
    TimeProfitHeaderResponseModel,
    DpsSelectModel,
    NominalList,
    BillingRequestDisbursExpenseHeaderViewModel,
    DisbursmentHeaderWrapperModel,
    PrintSettingModel,
    MatterBalancesModel,
    ProformaText,
    BillingAddressResponceModel,
    ControllerDataModel,
    BillingAddressRequestModel,
    DropdownDataResponceModel,
    BillRequestEditData,
    BillingRequestInputData,
} from './../models/interfaces';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import {
    MatterData, FeeEarner, BillingTimeRecordResponseModel,
    DisbursementResponseModel, BillingRequestImportGridData, VatCode
} from '../models/interfaces';
import { RequestFormTypes, ImportGridIsSelectVal, RowUpdateStatus, RecordTypes, PrintStateControllers, AddressType } from '../models/enums';

import { uuid } from '../../utils/uuid';
import { dpsNewDate } from '../../utils/javascriptDate';
import { MatterSearchGridData } from '../../core/lib/matter';

export interface State {
    readonly views: { [token: string]: BillingRequestState };
    readonly init: boolean;
    readonly mainLoading: boolean;
    readonly loadingEditdata: boolean;
    readonly transactionPeriod: { fromDate: string, toDate: string };
    readonly feeEarnerList: DpsSelectModel<FeeEarner>[];
    readonly vatCodeList: DpsSelectModel<VatCode>[];
    // readonly allocateList: DpsSelectModel<FeeEarner>[];
    readonly descriptionList: DpsSelectModel<DescriptionList>[];
    readonly printLayOutBillDropDown: TableRow<DropdownDataResponceModel>[];
    readonly printLayOutTimeDropDown: TableRow<DropdownDataResponceModel>[];
    readonly printLayOutDisbDropDown: TableRow<DropdownDataResponceModel>[];
    readonly closePopup: number;
}
export interface BillingRequestState {
    readonly billRequestID: number;
    readonly diaryId: number;
    readonly postingDateText: string;
    readonly matterData: MatterData;
    readonly isProforma: boolean;
    readonly isChkBill: boolean;
    readonly billOrProformaText: string;
    readonly billOrProformaNo: string;
    readonly billOrProformaData: string;
    readonly billOrProformaAddress: string;
    readonly quickBillType: string;
    readonly quickBillDate: string;
    readonly quickBillAmmount: string;
    readonly narrativeItemText: string;
    readonly note: string;
    readonly disbursementAmount: number;
    readonly disbursementVat: number;
    readonly expenseAmount: number;
    readonly expenseVat: number;
    readonly totalFees: number;
    readonly totalFeesVat: number;
    readonly totalAmount: number;
    readonly totalVat: number;
    readonly billTotal: number;
    readonly nominalListLoading: boolean;
    readonly nominalList: DpsSelectModel<NominalList>[];
    readonly userNominalCode: string;
    readonly timeGridLoading: boolean;
    readonly timeGridModel: BillingRequestImportGridDataWrapper<BillingRequestImportGridData<BillingTimeRecordResponseModel>[]>;
    // readonly timeGridSelectedData: BillingTimeRecordResponseModel[];
    // BillingRequestImportGridData<Readonly<BillingTimeRecordResponseModel>>[];
    readonly disbursementGridLoading: boolean;
    readonly disbursementGridData: BillingRequestImportGridDataWrapper<BillingRequestImportGridData<DisbursementResponseModel>[]>;
    readonly requestFormTypes: RequestFormTypes;
    readonly timeAndProfitHeaderGridData: TimeProfitHeaderResponseModel<BillingRequestTimeProfitHeaderResponseModel>[];
    readonly disbsAndExpenseHeaderGridData: DisbursmentHeaderWrapperModel<BillingRequestDisbursExpenseHeaderViewModel>[];
    readonly printSettingLoading: boolean;
    readonly printSettingModel: PrintSettingModel;
    readonly printSettingAddress: BillingAddressResponceModel[];
    readonly selectedprintSettingAddress: BillingAddressResponceModel;
    readonly newprintSettingAddress: BillingAddressResponceModel;
    readonly matterBalancesLoading: boolean;
    readonly matterBalancesModel: MatterBalancesModel[];
    readonly proformaText: ProformaText;
    readonly billingAddressRequestModel: BillingAddressRequestModel;
    readonly printAllDropDownData: DropdownDataResponceModel[];
    readonly billDropDownSelectedData: DropdownDataResponceModel;
    readonly timeDropDownSelectedData: DropdownDataResponceModel;
    readonly disbDropDownSelectedData: DropdownDataResponceModel;
    readonly importAndAddRecordPopupMode: PopupOpenMode; // Edit or New
    readonly popupEditDataMode: any;
    readonly timeEditLoading: boolean;
    readonly enableEditData: boolean;
}
const initialState: State = {
    views: {},
    init: false,
    mainLoading: false,
    transactionPeriod: { fromDate: '', toDate: '' },
    feeEarnerList: [],
    vatCodeList: [],
    // allocateList: [],
    descriptionList: [],
    printLayOutBillDropDown: [],
    printLayOutTimeDropDown: [],
    printLayOutDisbDropDown: [],
    loadingEditdata: false,
    closePopup: 0
};
export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_BILLING_REQUEST:
            temp[action.token] = getInitViewData(state.views[action.token], action.payload.inputData, action.payload.timeOffset);
            return {
                ...state,
                mainLoading: false,
                closePopup: 0,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_MATTER_DATA_CHANGE:
            temp[action.token] = resetAllValues(state.views[action.token], action, action.payload.timeOffset);
            // temp[action.token] = setMatterData(state.views[action.token], action.payload.matterData);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_MATTER_INFO_BY_REF:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.BILLING_REQUEST_MATTER_INFO_BY_REF_SUCCESS:
            temp[action.token] = setMatterDataByRef(state.views[action.token], action.payload.matterData);
            return {
                ...state,
                mainLoading: false,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_MATTER_INFO_BY_REF_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.BILLING_REQUEST_FEEEARNER_LIST:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.BILLING_REQUEST_FEEEARNER_LIST_SUCCESS:
            return {
                ...state,
                feeEarnerList: action.payload.feeEarnerList ?
                    action.payload.feeEarnerList
                        .map(val => ({ data: val, selected: false, key: val.key, value: val.key })) : [],
                mainLoading: false
            };
        case Actions.BILLING_REQUEST_FEEEARNER_LIST_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.GET_BILLING_REQUEST_VAT_CODE_LIST:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.GET_BILLING_REQUEST_VAT_CODE_LIST_SUCCESS:
            return {
                ...state,
                vatCodeList: action.payload.vatCodeList ?
                    action.payload.vatCodeList.map(val => ({ data: val, selected: false, key: val.vatCode, value: val.vatCode })) : [],
                mainLoading: false
            };
        case Actions.GET_BILLING_REQUEST_VAT_CODE_LIST_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.BILLING_REQUEST_NOMINAL_LIST:
            temp[action.token] = {
                ...state.views[action.token],
                nominalListLoading: true
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_NOMINAL_LIST_SUCCESS:
            temp[action.token] = setNominalData(state.views[action.token], action.payload.nominalList);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_NOMINAL_LIST_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                nominalListLoading: false
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DROP_DOWN_SELCT_CHANGE: // nominal chaged
            temp[action.token] = {
                ...state.views[action.token],
                timeGridModel: (action.payload.propertyName === DropDownPropertyName.Nominal) ? {
                    ...state.views[action.token].timeGridModel,
                    gridData: state.views[action.token].timeGridModel.gridData
                        .map(val => {
                            return Object.freeze({
                                ...val,
                                data: { ...val.data, nominal: action.payload.selectedValue.key }
                            });
                        })
                } : state.views[action.token].timeGridModel
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DESCRIPTION_LIST:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.BILLING_REQUEST_DESCRIPTION_LIST_SUCCESS:
            return {
                ...state,
                mainLoading: false,
                descriptionList: action.payload.descriptionList ?
                    action.payload.descriptionList
                        .map(val => ({ data: val, selected: false, key: val.sC_Desc, value: val.sC_Desc })) : [],
            };
        case Actions.BILLING_REQUEST_DESCRIPTION_LIST_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.BILLING_REQUEST_SELECT_TIME_OPEN:
            temp[action.token] = {
                ...state.views[action.token],
                requestFormTypes: action.formType,
                importAndAddRecordPopupMode: PopupOpenMode.New
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DISBURSMENT_OPEN:
            temp[action.token] = {
                ...state.views[action.token],
                requestFormTypes: action.formType,
                importAndAddRecordPopupMode: PopupOpenMode.New
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PROFIT_COST_AND_EXPENSE_ROW_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                requestFormTypes: action.formType,
                userNominalCode: null,
                importAndAddRecordPopupMode: PopupOpenMode.New
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_QUICK_BILL_PROCESS_DATA:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                timeAndProfitHeaderGridData: action.payload.timeAndDisbursementRecordList.billingTimes ?
                    action.payload.timeAndDisbursementRecordList.billingTimes
                        .map(val => ({
                            data: val,
                            isTimeHeaderGrid: true,
                            isTimeItem: true,
                            selected: false,
                            rowId: uuid()
                        }))
                    : [],
                disbsAndExpenseHeaderGridData: action.payload.timeAndDisbursementRecordList.billingDisb ?
                    action.payload.timeAndDisbursementRecordList.billingDisb
                        .map(item => ({
                            data: {
                                feeEarner: item.feeEarner,
                                details: item.details,
                                net: item.net,
                                vat: item.vat,
                                vatCode: item.vatCode,
                                itemDate: item.itemDate,
                                grossVal: item.grossVal,
                                recordType: RecordTypes.Disbursment,
                                disbursmentItemDetails: item
                            },
                            isDisbursmenGrid: true,
                            isDisbursmenItem: true,
                            selected: false,
                            rowId: uuid()
                        }))
                    : []
            };
            return {
                ...state,
                mainLoading: false,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_QUICK_BILL_PROCESS_DATA_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        // case Actions.BILLING_REQUEST_EXPENSE_ROW_DATA:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         requestFormTypes: action.formType
        //     };
        //     return {
        //         ...state,
        //         views: { ...state.views, ...temp }
        //     };
        case Actions.BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER:
            temp[action.token] = {
                ...state.views[action.token],
                timeGridLoading: true
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_SUCCESS:
            temp[action.token] = setTimeGridData(state.views[action.token], action.payload.timeRecordList);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                timeGridLoading: false
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER:
            temp[action.token] = {
                ...state.views[action.token],
                disbursementGridLoading: true
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_SUCCESS:
            temp[action.token] = setDisbursementData(state.views[action.token], action.payload.disbursementList);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                disbursementGridLoading: false
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };

        case Actions.BILLING_REQUEST_ALLOCATE_SELCT_CHANGE:
            temp[action.token] = {
                ...state.views[action.token],
                timeGridModel: {
                    ...state.views[action.token].timeGridModel,
                    gridData: state.views[action.token].timeGridModel.gridData
                        .map(val => {
                            return Object.freeze({
                                ...val,
                                data: { ...val.data, timBillEarner: action.selectValue.key }
                            });
                        })
                }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_ALL_SELECT_UNSELECT_WRITE_OFF:
            temp[action.token] = {
                ...state.views[action.token],
                timeGridModel: {
                    ...state.views[action.token].timeGridModel,
                    gridData: state.views[action.token].requestFormTypes === RequestFormTypes.selectTime ?
                        state.views[action.token].timeGridModel.gridData
                            .map(val => {
                                if (action.rowStatus === RowUpdateStatus.Select) {
                                    return Object.freeze({
                                        ...val,
                                        data: { ...val.data, recordType: ImportGridIsSelectVal.selected }
                                    });
                                } else if (action.rowStatus === RowUpdateStatus.Unselect) {
                                    return Object.freeze({
                                        ...val,
                                        data: { ...val.data, recordType: ImportGridIsSelectVal.unSelected }
                                    });
                                } else if (action.rowStatus === RowUpdateStatus.WriteOff) {
                                    return Object.freeze({
                                        ...val,
                                        data: { ...val.data, recordType: ImportGridIsSelectVal.WriteOff }
                                    });
                                }
                                return val;
                            })
                        : state.views[action.token].timeGridModel.gridData
                },
                disbursementGridData: {
                    ...state.views[action.token].disbursementGridData,
                    gridData: (state.views[action.token].requestFormTypes === RequestFormTypes.selectDisbursement) ?
                        state.views[action.token].disbursementGridData.gridData
                            .map((val) => {
                                if (action.rowStatus === RowUpdateStatus.Select) {
                                    return Object.freeze({
                                        ...val,
                                        data: { ...val.data, selectUnSelectVal: ImportGridIsSelectVal.selected }
                                    });
                                } else if (action.rowStatus === RowUpdateStatus.Unselect) {
                                    return Object.freeze({
                                        ...val,
                                        data: { ...val.data, selectUnSelectVal: ImportGridIsSelectVal.unSelected }
                                    });
                                } else if (action.rowStatus === RowUpdateStatus.WriteOff) {
                                    return Object.freeze({
                                        ...val,
                                        data: { ...val.data, selectUnSelectVal: ImportGridIsSelectVal.WriteOff }
                                    });
                                }
                                return val;
                            })
                        : state.views[action.token].disbursementGridData.gridData
                }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_SET_TIME_SELECT_ROW:
            temp[action.token] = {
                ...state.views[action.token],
                timeGridModel: {
                    ...state.views[action.token].timeGridModel,
                    gridData: state.views[action.token].timeGridModel.gridData
                        .map(val => {
                            if (action.isMultiSelect) {
                                return Object.freeze({
                                    ...val,
                                    selected: (val.data.timUniqueRef === action.row.data.timUniqueRef) ?
                                        (val.selected) ? false : true : val.selected
                                });
                            } else {
                                return Object.freeze({
                                    ...val,
                                    selected: (val.data.timUniqueRef === action.row.data.timUniqueRef) ? true : false
                                });
                            }
                        })
                }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_SET_TIME_SELECT_ROW_VALUE:
            temp[action.token] = {
                ...state.views[action.token],
                timeGridModel: {
                    ...state.views[action.token].timeGridModel,
                    gridData: state.views[action.token].timeGridModel.gridData
                        .map((val) => {
                            if (val.selected && action.rowStatus === RowUpdateStatus.Select) {
                                return Object.freeze({
                                    ...val,
                                    data: { ...val.data, recordType: ImportGridIsSelectVal.selected }
                                });
                            } else if (val.selected && action.rowStatus === RowUpdateStatus.Unselect) {
                                return Object.freeze({
                                    ...val,
                                    data: { ...val.data, recordType: ImportGridIsSelectVal.unSelected }
                                });
                            } else if (val.selected && action.rowStatus === RowUpdateStatus.WriteOff) {
                                return Object.freeze({
                                    ...val,
                                    data: { ...val.data, recordType: ImportGridIsSelectVal.WriteOff }
                                });
                            }
                            return val;
                        })
                }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_SET_DISBS_SELECT_ROW:
            temp[action.token] = {
                ...state.views[action.token],
                disbursementGridData: {
                    ...state.views[action.token].disbursementGridData,
                    gridData: state.views[action.token].disbursementGridData.gridData.map(val => {
                        if (action.isMultiSelect) {
                            return Object.freeze({
                                ...val,
                                selected: (val.data.uniqueRef === action.row.data.uniqueRef) ? true : val.selected
                            });
                        } else {
                            return Object.freeze({
                                ...val,
                                selected: (val.data.uniqueRef === action.row.data.uniqueRef) ? true : false
                            });
                        }
                    })
                }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_SET_DISBS_SELECT_ROW_VALUE:
            temp[action.token] = {
                ...state.views[action.token],
                disbursementGridData: {
                    ...state.views[action.token].disbursementGridData,
                    gridData: state.views[action.token].disbursementGridData.gridData
                        .map((val) => {
                            if (val.selected && action.rowStatus === RowUpdateStatus.Select) {
                                return Object.freeze({
                                    ...val,
                                    data: { ...val.data, selectUnSelectVal: ImportGridIsSelectVal.selected }
                                });
                            } else if (val.selected && action.rowStatus === RowUpdateStatus.Unselect) {
                                return Object.freeze({
                                    ...val,
                                    data: { ...val.data, selectUnSelectVal: ImportGridIsSelectVal.unSelected }
                                });
                            } else if (val.selected && action.rowStatus === RowUpdateStatus.WriteOff) {
                                return Object.freeze({
                                    ...val,
                                    data: { ...val.data, selectUnSelectVal: ImportGridIsSelectVal.WriteOff }
                                });
                            }
                            return val;
                        })
                }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };

        case Actions.BILLING_REQUEST_TIME_COST_OK_CLICK:
            return {
                ...state,
                mainLoading: true,
            };
        case Actions.BILLING_REQUEST_TIME_COST_OK_CLICK_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                timeAndProfitHeaderGridData: (state.views[action.token].requestFormTypes === RequestFormTypes.selectTime) ?
                    state.views[action.token].timeAndProfitHeaderGridData
                        .filter(val => (val.isTimeItem !== true))
                        .concat(action.payload.timeProfitHeaderDataViewModel
                            .map(val => ({
                                data: val,
                                isTimeHeaderGrid: true,
                                isTimeItem: true,
                                selected: false,
                                rowId: uuid()
                            })))
                    : state.views[action.token].timeAndProfitHeaderGridData
                        .concat(action.payload.timeProfitHeaderDataViewModel
                            .map(val => ({
                                data: val,
                                isTimeHeaderGrid: true,
                                isTimeItem: false,
                                selected: false,
                                rowId: uuid()
                            })))
                // totalFees: action.payload.timeProfitHeaderDataViewModel.,
                // totalFeesVat: 0
            };
            return {
                ...state,
                mainLoading: false,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_TIME_COST_OK_CLICK_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        // case Actions.ADD_TIME_COST_GRID_HEADER_ROW:
        //     temp[action.token] = {
        //         ...state.views[action.token],
        //         timeAndProfitHeaderGridData: state.views[action.token].timeAndProfitHeaderGridData.concat(
        //             action.payload.timeProfitHeaderDataViewModel
        //                 .map(val => ({
        //                     data: val,
        //                     isTimeRow: true,
        //                     selected: false,
        //                     rowId: uuid()
        //                 })))
        //     };
        //     return {
        //         ...state,
        //         views: { ...state.views, ...temp }
        //     };
        case Actions.TIME_COST_GRID_SELECT_ROW:
            temp[action.token] = {
                ...state.views[action.token],
                timeAndProfitHeaderGridData: state.views[action.token].timeAndProfitHeaderGridData
                    .map(val => {
                        return Object.freeze({
                            ...val,
                            selected: (val.rowId === action.row.rowId) ? true : false
                        });
                    })
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DISBURSMENT_ADD_HEADER_ROW:
            temp[action.token] = {
                ...state.views[action.token],
                disbsAndExpenseHeaderGridData: state.views[action.token].disbsAndExpenseHeaderGridData
                    .concat(action.payload.disbsAndExpenseHeaderGridDataModel
                        .map(val => ({
                            data: val,
                            isDisbursmenGrid: true,
                            isDisbursmenItem: (val.recordType === RecordTypes.Disbursment) ? true : false,
                            selected: false,
                            rowId: uuid()
                        })))
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.DISBURSMENT_HEADER_GRID_SELECT_ROW:
            temp[action.token] = {
                ...state.views[action.token],
                disbsAndExpenseHeaderGridData: state.views[action.token].disbsAndExpenseHeaderGridData
                    .map(val => {
                        return Object.freeze({
                            ...val,
                            selected: (val.rowId === action.row.rowId) ? true : false
                        });
                    })
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_NARRATIVE_TEXT_UPDATE:
            temp[action.token] = {
                ...state.views[action.token],
                narrativeItemText: action.narrativeText
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PRINT_SETTING:
            temp[action.token] = {
                ...state.views[action.token],
                printSettingLoading: true
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PRINT_SETTING_SUCCESS:
            temp[action.token] = setPrintDropdownSelection(state.views[action.token], action.payload.printSetting);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.SAVE_BILLING_ADDRESS:
            temp[action.token] = {
                ...state.views[action.token],
                printSettingLoading: true
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };

        case Actions.SAVE_BILLING_ADDRESS_SUCCESS:
            temp[action.token] = setSaveddAddressType(state.views[action.token], action.payload.savedAddressList);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.SAVE_BILLING_ADDRESS_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                printSettingLoading: false
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };

        case Actions.SAVE_PRINT_MAKE_DEFAULT_ALL_BILL:
            temp[action.token] = {
                ...state.views[action.token],
                printSettingLoading: true
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };

        case Actions.SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_SUCCESS:
            temp[action.token] = setSaveDefaultSetting(state.views[action.token], action.payload.savePrintSettingResponce);
            return {
                ...state,
                views: { ...state.views, ...temp }

            };
        case Actions.SAVE_PRINT_MAKE_DEFAULT_ALL_BILL_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                printSettingLoading: false
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PRINT_SETTING_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                printSettingLoading: false
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_MATTER_BALANCES:
            temp[action.token] = {
                ...state.views[action.token],
                matterBalancesLoading: true
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_MATTER_BALANCES_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                matterBalancesLoading: false,
                matterBalancesModel: action.payload.matterBalances ? action.payload.matterBalances
                    .map(val => ({
                        data: val,
                        selected: false,
                        rowId: uuid()
                    }))
                    : []
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_MATTER_BALANCES_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                matterBalancesLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_REMOVE_ALL_GRID_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                timeGridModel: action.gridType === 'Time' ? {
                    gridData: [],
                    unitTotal: 0.00,
                    total: 0.00,
                    billTo: '0',
                    vatCode: null,
                    nominalVal: null,
                    allocateTo: null,
                } : state.views[action.token].timeGridModel,
                disbursementGridData: action.gridType === 'Disbursment' ? {
                    gridData: [],
                    unitTotal: 0.00,
                    total: 0.00,
                    billTo: '0',
                    vatCode: null,
                    nominalVal: null,
                    allocateTo: null
                } : state.views[action.token].disbursementGridData,
                timeAndProfitHeaderGridData: action.gridType === 'Time' ? [] : state.views[action.token].timeAndProfitHeaderGridData,
                disbsAndExpenseHeaderGridData: action.gridType === 'Disbursment' ? []
                    : state.views[action.token].disbsAndExpenseHeaderGridData,
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PROFORMA_CHECK:
            temp[action.token] = {
                ...state.views[action.token],
                isProforma: action.isCheck,
                proformaText: action.isCheck ? {
                    headerText: 'Proforma'
                    , billText: 'Proforma Text'
                    , billNumber: 'Proforma No'
                    , billDate: 'Date'
                    , billAddressee: 'Addressee'
                    , requestButtonText: SaveButtonTypeText.Post
                } : {
                        headerText: 'Billing Request'
                        , billText: 'Bill Text'
                        , billNumber: 'Bill Number'
                        , billDate: 'Bill Date'
                        , billAddressee: 'Bill Addressee'
                        , requestButtonText: SaveButtonTypeText.Request
                    }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_BILL_CHECK:
            temp[action.token] = {
                ...state.views[action.token],
                isChkBill: action.isCheck,
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PRINT_SETTING_ADDRESS_SUCCESS:
            temp[action.token] = setPrintSettingAddressData(state.views[action.token], action.payload.addressList);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.CHANGE_BILLING_ADDRESS_TYPE:
            temp[action.token] = setSelectedAddressType(state.views[action.token], action.SelectedType);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };

        case Actions.BILLING_REQUEST_CONTROLLER_VALUE_UPDATING:
            temp[action.token] = updateControllerValue(state.views[action.token], action.payload.controllerDataModel);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };

        case Actions.BILLING_REQUEST_SAVE_POST_PRINT_DATA:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.BILLING_REQUEST_SAVE_POST_PRINT_DATA_SUCCESS:
            temp[action.token] = resetAllValues(state.views[action.token], action, action.payload.timeOffset);
            return {
                ...state,
                mainLoading: false,
                // closePopup: state.views[action.token].billRequestID > 0 ? state.closePopup + 1 : state.closePopup,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PRINT_DATA_SUCCESS:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.BILLING_REQUEST_SAVE_POST_PRINT_DATA_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                printAllDropDownData: action.payload.allDropdownData ? action.payload.allDropdownData : [],
            };
            return {
                ...state,
                mainLoading: false,
                printLayOutBillDropDown: action.payload.allDropdownData ? action.payload.allDropdownData
                    .filter(item => item.userReportTypeDescription === 'Bill')
                    .map(val => ({ data: val, selected: false, key: val.userRepID, value: val.userRepName })) : [],
                printLayOutTimeDropDown: action.payload.allDropdownData ? action.payload.allDropdownData
                    .filter(item => item.userReportTypeDescription === 'BillTime')
                    .map(val => ({ data: val, selected: false, key: val.userRepID, value: val.userRepName })) : [],
                printLayOutDisbDropDown: action.payload.allDropdownData ? action.payload.allDropdownData
                    .filter(item => item.userReportTypeDescription === 'BillDisb')
                    .map(val => ({ data: val, selected: false, key: val.userRepID, value: val.userRepName })) : [],
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.BILLING_REQUEST_PRINT_CONTROLLER_VALUE_UPDATING:
            temp[action.token] = updatePrintControllerValue(state.views[action.token], action);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_HEADER_GRID_DOUBLE_CLICK:
            temp[action.token] = {
                ...state.views[action.token],
                importAndAddRecordPopupMode: PopupOpenMode.Edit,
                popupEditDataMode: { // need tocreate model
                    // billTo: (action.selectDataModel.selectedRow.data && action.selectDataModel.selectedRow.data.billTo) ?
                    //     action.selectDataModel.selectedRow.data.billTo : '0.00',
                    // Suren request to set net value to billto
                    billTo: (action.selectDataModel.selectedRow.data && action.selectDataModel.selectedRow.data.net) ?
                        action.selectDataModel.selectedRow.data.net.toFixed(2) : 0,
                    netValue: (action.selectDataModel.selectedRow.data && action.selectDataModel.selectedRow.data.net) ?
                        action.selectDataModel.selectedRow.data.net : 0,
                    nominalVal: action.selectDataModel.selectedRow.data.nominal,
                    vatCode: (action.selectDataModel.selectedRow.data && action.selectDataModel.selectedRow.data.vatCode)
                        ? +action.selectDataModel.selectedRow.data.vatCode : 0, // number
                    allocateTo: action.selectDataModel.selectedRow.data.billFeeEarner,
                    feeEarner: action.selectDataModel.selectedRow.data.feeEarner,
                    vatValue: (action.selectDataModel.selectedRow.data && action.selectDataModel.selectedRow.data.vat)
                        ? action.selectDataModel.selectedRow.data.vat : 0,
                    details: action.selectDataModel.selectedRow.data.details,
                    selectedRowId: action.selectDataModel.selectedRow.rowId,
                    itemDate: (action.selectDataModel.selectedRow.data && action.selectDataModel.selectedRow.data.itemDate) ?
                        action.selectDataModel.selectedRow.data.itemDate : null,
                    selectedRow: action.selectDataModel.selectedRow
                },
                requestFormTypes: action.selectDataModel.popupType,
                timeGridModel: (action.selectDataModel.popupType === RequestFormTypes.selectTime) ? {
                    gridData: action.selectDataModel.selectedRow.data.billingDetails
                        .map(data => ({ data: data, selected: false })),
                    // .map(data => ({ data: { ...data, recordType: ImportGridIsSelectVal.selected }, selected: false })),
                    unitTotal: 0,
                    total: 0,
                    billTo: '0',
                    vatCode: action.selectDataModel.selectedRow.data.vatCode,
                    nominalVal: action.selectDataModel.selectedRow.nominal,
                    allocateTo: action.selectDataModel.selectedRow.data.feeEarner,
                }
                    : {
                        gridData: [],
                        unitTotal: 0.00,
                        total: 0.00,
                        billTo: '0',
                        vatCode: null,
                        nominalVal: null,
                        allocateTo: null,
                    },
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_ROW_DELETE:
            temp[action.token] = {
                ...state.views[action.token],
                timeAndProfitHeaderGridData: (action.payload.formTypeAndRowID.formType === RequestFormTypes.profitCost) ?
                    state.views[action.token].timeAndProfitHeaderGridData
                        .filter(item => item.rowId !== action.payload.formTypeAndRowID.rowId)
                    : state.views[action.token].timeAndProfitHeaderGridData,
                disbsAndExpenseHeaderGridData: (action.payload.formTypeAndRowID.formType === RequestFormTypes.expense ||
                    action.payload.formTypeAndRowID.formType === RequestFormTypes.selectDisbursement) ?
                    state.views[action.token].disbsAndExpenseHeaderGridData
                        .filter(item => item.rowId !== action.payload.formTypeAndRowID.rowId)
                    : state.views[action.token].disbsAndExpenseHeaderGridData
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_PROFIT_COST_ROW_EDIT:
            temp[action.token] = {
                ...state.views[action.token],
                timeAndProfitHeaderGridData: state.views[action.token].timeAndProfitHeaderGridData
                    .map(item => {
                        if (item.rowId === action.payload.rowId) {
                            return { ...item, data: action.payload.timeProfitHeaderModel[0] };
                        }
                        return item;
                    })
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_EXPENSE_ROW_EDIT:
            temp[action.token] = {
                ...state.views[action.token],
                disbsAndExpenseHeaderGridData: state.views[action.token].disbsAndExpenseHeaderGridData
                    .map(item => {
                        if (item.rowId === action.payload.rowId) {
                            return { ...item, data: action.payload.disbsAndExpenseHeaderModel[0] };
                        }
                        return item;
                    })
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_DISBURSMENT_ROW_EDIT:
            temp[action.token] = {
                ...state.views[action.token],
                disbsAndExpenseHeaderGridData: state.views[action.token].disbsAndExpenseHeaderGridData
                    .map(item => {
                        if (item.rowId === action.payload.rowId) {
                            return {
                                ...item,
                                data: {
                                    ...item.data,
                                    vatCode: action.payload.disbursmentEditData.vatCode,
                                    vat: action.payload.disbursmentEditData.vat,
                                    grossVal: action.payload.disbursmentEditData.grossVal,
                                    disbursmentItemDetails: {
                                        ...item.data.disbursmentItemDetails,
                                        vatCode: action.payload.disbursmentEditData.vatCode,
                                        vat: action.payload.disbursmentEditData.vat,
                                        grossVal: action.payload.disbursmentEditData.grossVal
                                    }
                                }
                            };
                        }
                        return item;
                    })
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_NOMINAL_BY_USER_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                userNominalCode: action.payload.selectingNominalCode,
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_EDIT_TIME_ENTRY_SAVE:
            temp[action.token] = {
                ...state.views[action.token],
                timeEditLoading: true,
                timeGridModel: {
                    ...state.views[action.token].timeGridModel,
                    gridData: state.views[action.token].timeGridModel.gridData
                        .map(val => {
                            if (val.data.timUniqueRef === action.payload.timeEditModel.timUniqueRef) {
                                return Object.freeze({
                                    ...val,
                                    data: {
                                        ...val.data,
                                        timDetails: action.payload.timeEditModel.timDetails,
                                        timNotes: action.payload.timeEditModel.timNotes
                                    }
                                });
                            }
                            return val;
                        })
                }
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_EDIT_TIME_ENTRY_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                timeEditLoading: false,
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.BILLING_REQUEST_EDIT_TIME_ENTRY_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                timeEditLoading: false
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.GET_DOCUMENT_PREVIEW_TOKEN:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.GET_DOCUMENT_PREVIEW_TOKEN_SUCCESS:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.GET_DOCUMENT_PREVIEW_TOKEN_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.GET_EDIT_DATA:
            return {
                ...state,
                loadingEditdata: true
            };
        case Actions.GET_EDIT_DATA_SUCCESS:

            temp[action.token] = mapEditData(state.views[action.token], action.editData);
            temp[action.token] = setDisbursementData(temp[action.token], action.editData.billingDisbursments);
            temp[action.token] = setTimeGridData(temp[action.token], action.editData.billingRequestTimes);
            return {
                ...state,
                loadingEditdata: false,
                views: { ...state.views, ...temp }
            };
        case Actions.GET_EDIT_DATA_FAIL:
            return {
                ...state,
                loadingEditdata: false
            };

        case Actions.CHECK_IS_VALID_DELETE_REQUEST:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.CHECK_IS_VALID_DELETE_REQUEST_SUCCESS:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.CHECK_IS_VALID_DELETE_REQUEST_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        case Actions.DELETE_REQUEST:
            return {
                ...state,
                mainLoading: true
            };
        case Actions.DELETE_REQUEST_SUCCESS:
            return {
                ...state,
                mainLoading: false,
                closePopup: state.closePopup + 1,
            };
        case Actions.DELETE_REQUEST_FAIL:
            return {
                ...state,
                mainLoading: false
            };
        default:
            { return state; }
    }
}
function getInitViewData(state: BillingRequestState, inputData: BillingRequestInputData, timeOffset: number):
    Partial<BillingRequestState> {
    return {
        ...state,
        billRequestID: inputData.billRequestId || 0,
        diaryId: inputData.diaryId || 0,
        postingDateText: null,
        enableEditData: false,
        matterData: null,
        isProforma: false,
        isChkBill: false,
        billOrProformaText: 'Bill',
        billOrProformaNo: '*NEW*',
        billOrProformaData: dpsNewDate(timeOffset).toDpsString(), // datePipe.transform(Date.now(), 'dd/MM/yyyy'),
        billOrProformaAddress: '',
        quickBillType: '',
        quickBillDate: dpsNewDate(timeOffset).toDpsString(),
        quickBillAmmount: '0',
        narrativeItemText: '',
        note: '',
        totalFees: 0,
        totalFeesVat: 0,
        disbursementAmount: 0,
        disbursementVat: 0,
        expenseAmount: 0,
        expenseVat: 0,
        totalAmount: 0,
        totalVat: 0,
        billTotal: 0,
        timeGridLoading: false,
        printSettingLoading: false,
        timeGridModel: {
            gridData: [],
            unitTotal: 0.00,
            total: 0.00,
            billTo: '0',
            vatCode: null,
            nominalVal: null,
            allocateTo: null,
        },
        disbursementGridLoading: false,
        disbursementGridData: {
            gridData: [],
            unitTotal: 0.00,
            total: 0.00,
            billTo: '0',
            vatCode: null,
            nominalVal: null,
            allocateTo: null
        },
        timeAndProfitHeaderGridData: [],
        disbsAndExpenseHeaderGridData: [],
        proformaText: {
            headerText: 'Billing Request'
            , billText: 'Bill Text'
            , billNumber: 'Bill Number'
            , billDate: 'Bill Date'
            , billAddressee: 'Bill Addressee'
            , requestButtonText: SaveButtonTypeText.Request
        },
        matterBalancesModel: [],
        billDropDownSelectedData: null,
        timeDropDownSelectedData: null,
        disbDropDownSelectedData: null,

        billingAddressRequestModel: {
            matterRef: null,
            clientRef: null,
            addCorrespondence: true,
            addStatement: false,
            addBilling: false,
            addOther: false,
        },

        selectedprintSettingAddress: {
            addresType: AddressType.Correspondence,
            addressBillingAddr1: null,
            addressBillingAddr2: null,
            addressBillingAddr3: null,
            addressBillingAddr4: null,
            // addressBillingCounty: null,
            addressBillingPostcode: null,
            // addressBillingTown: null,
        },
        printSettingModel: {
            userRef: '',
            isExsitBillLayoutLocation: 0,
            chkShowTimeBreakdown: false,
            chkShowDisbBreakdown: false,
            chkGroupTimeReportByFeeEarner: false,
            chkShowGrandTotal: false,
            chkShowFESubTotals: false,
            chkShowValues: false,
            chkShowTimeNotes: false,
            chkShowMinutes: false,
            chkPromptForMoneyOnAccount: false,
            chkSaveAsWord: false,
            chkShowTimeDates: false,
            chkShowTimeDetails: false,

            groupTime: false,
            bIL_ShowPreviousDPB: false,

            billDefaultLayout: 1,
            timeDefaultLayout: 1,
            disbDefaultLayout: 1,
            billLayoutSelectedLocation: '',
            timeLayOutSelectedLocation: '',
            disLayOutSelectedLocation: '',
        },
        importAndAddRecordPopupMode: PopupOpenMode.New,
        popupEditDataMode: null,
        userNominalCode: null
    };
    return state;
}
function resetAllValues(state: BillingRequestState, inputData: any, timeOffset: number): Partial<BillingRequestState> {
    let matterDetails: MatterData;
    if (inputData && inputData.payload && inputData.payload.matterData) {
        matterDetails = {
            matterRef: inputData.payload.matterData.matterRef,
            branchId: inputData.payload.matterData.branchId,
            appId: inputData.payload.matterData.appId,
            fileId: inputData.payload.matterData.fileId,
            appCode: inputData.payload.matterData.appCode,
            feeEarner: inputData.payload.matterData.feeEarner,
            clientRef: inputData.payload.matterData.clientRef ? inputData.payload.matterData.clientRef : '',
            clientName: inputData.payload.matterData.clientName ? inputData.payload.matterData.clientName : '',
            eBilling: inputData.payload.matterData.eBilling,
            branchName: inputData.payload.matterData.branchName,
            isClosed: inputData.payload.matterData.isClosed,
            matterDetails: inputData.payload.matterData.matterDetails,
            matterCode: inputData.payload.matterData.matterCode,
            isProspectMatter: inputData.payload.matterData.isProspectMatter
        };
    }
    return {
        ...state,
        matterData: matterDetails || state.matterData,
        isProforma: false,
        isChkBill: false,
        billOrProformaText: 'Bill',
        billOrProformaNo: '*NEW*',
        billOrProformaData: dpsNewDate(timeOffset).toDpsString(), // datePipe.transform(Date.now(), 'dd/MM/yyyy'),
        billOrProformaAddress: '',
        quickBillType: '',
        quickBillDate: dpsNewDate(timeOffset).toDpsString(),
        quickBillAmmount: '0',
        narrativeItemText: '',
        note: '',
        totalFees: 0,
        totalFeesVat: 0,
        disbursementAmount: 0,
        disbursementVat: 0,
        expenseAmount: 0,
        expenseVat: 0,
        totalAmount: 0,
        totalVat: 0,
        billTotal: 0,
        timeGridLoading: false,
        printSettingLoading: false,
        timeGridModel: {
            gridData: [],
            unitTotal: 0.00,
            total: 0.00,
            billTo: '0',
            vatCode: null,
            nominalVal: null,
            allocateTo: null,
        },
        disbursementGridLoading: false,
        disbursementGridData: {
            gridData: [],
            unitTotal: 0.00,
            total: 0.00,
            billTo: '0',
            vatCode: null,
            nominalVal: null,
            allocateTo: null
        },
        timeAndProfitHeaderGridData: [],
        disbsAndExpenseHeaderGridData: [],
        proformaText: {
            headerText: 'Billing Request'
            , billText: 'Bill Text'
            , billNumber: 'Bill Number'
            , billDate: 'Bill Date'
            , billAddressee: 'Bill Addressee'
            , requestButtonText: SaveButtonTypeText.Request
        },
        matterBalancesModel: [],
        billDropDownSelectedData: null,
        timeDropDownSelectedData: null,
        disbDropDownSelectedData: null,

        billingAddressRequestModel: {
            matterRef: null,
            clientRef: null,
            addCorrespondence: true,
            addStatement: false,
            addBilling: false,
            addOther: false,
        },
        // selectedprintSettingAddress: {
        //     addresType: AddressType.Correspondence,
        //     addressBillingAddr1: null,
        //     addressBillingAddr2: null,
        //     addressBillingAddr3: null,
        //     addressBillingAddr4: null,
        //     addressBillingPostcode: null,
        // },
        // printSettingModel: {
        //     userRef: '',
        //     isExsitBillLayoutLocation: 0,
        //     chkShowTimeBreakdown: false,
        //     chkShowDisbBreakdown: false,
        //     chkGroupTimeReportByFeeEarner: false,
        //     chkShowGrandTotal: false,
        //     chkShowFESubTotals: false,
        //     chkShowValues: false,
        //     chkShowTimeNotes: false,
        //     chkShowMinutes: false,
        //     chkPromptForMoneyOnAccount: false,
        //     chkSaveAsWord: false,
        //     chkShowTimeDates: false,
        //     chkShowTimeDetails: false,

        //     groupTime: false,
        //     bIL_ShowPreviousDPB: false,

        //     billDefaultLayout: 1,
        //     timeDefaultLayout: 1,
        //     disbDefaultLayout: 1,
        //     billLayoutSelectedLocation: '',
        //     timeLayOutSelectedLocation: '',
        //     disLayOutSelectedLocation: '',
        // },
        importAndAddRecordPopupMode: PopupOpenMode.New,
        popupEditDataMode: null,
        userNominalCode: null

    };
    return state;
}
function updatePrintControllerValue(view: BillingRequestState, action: Actions.SetPrintControllerValue) {
    switch (action.payload.controllerDataModel.key) {

        case PrintStateControllers.chkShowTimeBreakdown:
            let chkShowTimeDet;
            if (action.payload.controllerDataModel.value === true) {

                if (view.printSettingModel.chkShowGrandTotal === false && view.printSettingModel.chkShowValues === false &&
                    view.printSettingModel.chkGroupTimeReportByFeeEarner === false && view.printSettingModel.chkShowTimeNotes === false
                    && view.printSettingModel.chkShowTimeDetails === false) {

                    chkShowTimeDet = true;


                }
            }

            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowTimeBreakdown: action.payload.controllerDataModel.value,
                    chkShowTimeDetails: chkShowTimeDet ? chkShowTimeDet : view.printSettingModel.chkShowTimeDetails,
                }
            };
        case PrintStateControllers.chkShowGrandTotal:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowGrandTotal: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkGroupTimeReportByFeeEarner:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkGroupTimeReportByFeeEarner: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkShowTimeDetails:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowTimeDetails: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkShowMinutes:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowMinutes: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkShowValues:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowValues: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkShowTimeNotes:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowTimeNotes: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkShowTimeDates:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowTimeDates: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkShowFESubTotals:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowFESubTotals: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkPromptForMoneyOnAccount:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkPromptForMoneyOnAccount: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.chkShowDisbBreakdown:
            let shoPrebill;
            if (action.payload.controllerDataModel.value === false) {
                shoPrebill = false;
            }
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    chkShowDisbBreakdown: action.payload.controllerDataModel.value,
                    bIL_ShowPreviousDPB: shoPrebill,
                }
            };
        case PrintStateControllers.bIL_ShowPreviousDPB:
            return {
                ...view,
                printSettingModel: {
                    ...view.printSettingModel,
                    bIL_ShowPreviousDPB: action.payload.controllerDataModel.value
                }
            };
        case PrintStateControllers.billDropDownSelectedData:
            return {
                ...view,
                billDropDownSelectedData: action.payload.controllerDataModel.value
            };
        case PrintStateControllers.timeDropDownSelectedData:
            return {
                ...view,
                timeDropDownSelectedData: action.payload.controllerDataModel.value
            };
        case PrintStateControllers.disbDropDownSelectedData:
            return {
                ...view,
                disbDropDownSelectedData: action.payload.controllerDataModel.value
            };
        default:
            { return view; }
    }
}
function updateControllerValue(view: BillingRequestState, controllerModel: ControllerDataModel) {
    if (controllerModel.controllerName === 'billOrProformaText') {
        return {
            ...view,
            billOrProformaText: controllerModel.value
        };
    } else if (controllerModel.controllerName === 'billOrProformaNo') {
        return {
            ...view,
            billOrProformaNo: controllerModel.value
        };
    } else if (controllerModel.controllerName === 'billOrProformaData') {
        return {
            ...view,
            billOrProformaData: controllerModel.value
        };
    } else if (controllerModel.controllerName === 'billOrProformaAddress') {
        return {
            ...view,
            billOrProformaAddress: controllerModel.value
        };
    } else if (controllerModel.controllerName === 'note') {
        return {
            ...view,
            note: controllerModel.value
        };
    } else {
        return view;
    }
}
function setDisbursementData(view: BillingRequestState, disbursementList: DisbursementResponseModel[]): Partial<BillingRequestState> {
    if (view && view.disbsAndExpenseHeaderGridData && view.disbsAndExpenseHeaderGridData.length > 0) {
        view.disbsAndExpenseHeaderGridData.map(item => {
            if (item.data && item.data.disbursmentItemDetails) {
                //  item.data.disbursmentItemDetails.forEach((val) => {
                for (let i = disbursementList.length - 1; i >= 0; i--) {
                    if (disbursementList[i].uniqueRef === item.data.disbursmentItemDetails.uniqueRef) {
                        disbursementList.splice(i, 1);
                    }
                }
                // });
            }
        });
    }
    return {
        ...view,
        disbursementGridLoading: false,
        disbursementGridData: {
            gridData: disbursementList.
                map(data => ({ data: { ...data, selectUnSelectVal: ImportGridIsSelectVal.unSelected }, selected: false })),
            unitTotal: 0,
            total: 0,
            billTo: '0',
            vatCode: null,
            nominalVal: null,
            allocateTo: null,
        }
    };
}
function setTimeGridData(view: BillingRequestState, timeRecordList: BillingTimeRecordResponseModel[]): Partial<BillingRequestState> {
    if (view && view.timeAndProfitHeaderGridData && view.timeAndProfitHeaderGridData.length > 0) {
        view.timeAndProfitHeaderGridData.map(item => {
            if (item.data && item.data.billingDetails.length > 0) {
                item.data.billingDetails.forEach((val) => {
                    for (let i = timeRecordList.length - 1; i >= 0; i--) {
                        if (timeRecordList[i].timUniqueRef === val.timUniqueRef) {
                            timeRecordList.splice(i, 1);
                        }
                    }
                });
            }
        });
    }
    return {
        ...view,
        timeGridLoading: false,
        timeGridModel: {
            gridData: timeRecordList.
                map(data => ({ data: data, selected: false })), // { ...data, recordType: ImportGridIsSelectVal.unSelected }
            unitTotal: 0,
            total: 0,
            billTo: '0',
            vatCode: null,
            nominalVal: null,
            allocateTo: null,
        }
    };
}
function setPrintDropdownSelection(view: BillingRequestState, printSetting: PrintSettingModel) {
    if (view.printAllDropDownData && view.printAllDropDownData.length > 0 && printSetting) {
        return {
            ...view,
            printSettingLoading: false,
            printSettingModel: {
                userRef: printSetting.userRef ? printSetting.userRef : '',
                isExsitBillLayoutLocation: printSetting.isExsitBillLayoutLocation ? printSetting.isExsitBillLayoutLocation : null,
                chkShowTimeBreakdown: printSetting.chkShowTimeBreakdown ? printSetting.chkShowTimeBreakdown : false,
                chkShowDisbBreakdown: printSetting.chkShowDisbBreakdown ? printSetting.chkShowDisbBreakdown : false,
                chkGroupTimeReportByFeeEarner: printSetting.chkGroupTimeReportByFeeEarner ?
                    printSetting.chkGroupTimeReportByFeeEarner : false,
                chkShowGrandTotal: printSetting.chkShowGrandTotal ? printSetting.chkShowGrandTotal : false,
                chkShowFESubTotals: printSetting.chkShowFESubTotals ? printSetting.chkShowFESubTotals : false,
                chkShowValues: printSetting.chkShowValues ? printSetting.chkShowValues : false,
                chkShowTimeNotes: printSetting.chkShowTimeNotes ? printSetting.chkShowTimeNotes : false,
                chkShowMinutes: printSetting.chkShowMinutes ? printSetting.chkShowMinutes : false,
                chkPromptForMoneyOnAccount: printSetting.chkPromptForMoneyOnAccount ? printSetting.chkPromptForMoneyOnAccount : false,
                chkSaveAsWord: printSetting.chkSaveAsWord ? printSetting.chkSaveAsWord : false,
                chkShowTimeDates: printSetting.chkShowTimeDates ? printSetting.chkShowTimeDates : false,
                chkShowTimeDetails: printSetting.chkShowTimeDetails ? printSetting.chkShowTimeDetails : false,

                groupTime: printSetting.groupTime ? printSetting.groupTime : false,
                bIL_ShowPreviousDPB: printSetting.bIL_ShowPreviousDPB ? printSetting.bIL_ShowPreviousDPB : false,

                billDefaultLayout: 1,
                timeDefaultLayout: 1,
                disbDefaultLayout: 1,
                billLayoutSelectedLocation: '',
                timeLayOutSelectedLocation: '',
                disLayOutSelectedLocation: '',
            },
            billDropDownSelectedData: view.printAllDropDownData ? view.printAllDropDownData
                .filter(val => val.userRepID === printSetting.billDefaultLayout)[0]
                : null,
            timeDownSelectedData: view.printAllDropDownData ? view.printAllDropDownData
                .filter(val => val.userRepID === printSetting.timeDefaultLayout)[0]
                : null,
            disbDownSelectedData: view.printAllDropDownData ? view.printAllDropDownData
                .filter(val => val.userRepID === printSetting.disbDefaultLayout)[0]
                : null,
        };
    } else {
        return {
            ...view,
            printSettingLoading: false,
            printSettingModel: printSetting ? printSetting : {
                userRef: '',
                isExsitBillLayoutLocation: 0,
                chkShowTimeBreakdown: false,
                chkShowDisbBreakdown: false,
                chkGroupTimeReportByFeeEarner: false,
                chkShowGrandTotal: false,
                chkShowFESubTotals: false,
                chkShowValues: false,
                chkShowTimeNotes: false,
                chkShowMinutes: false,
                chkPromptForMoneyOnAccount: false,
                chkSaveAsWord: false,
                chkShowTimeDates: false,
                chkShowTimeDetails: false,

                groupTime: false,
                bIL_ShowPreviousDPB: false,

                billDefaultLayout: 1,
                timeDefaultLayout: 1,
                disbDefaultLayout: 1,
                billLayoutSelectedLocation: '',
                timeLayOutSelectedLocation: '',
                disLayOutSelectedLocation: ''
            }
        };
    }
}
function setNominalData(state: BillingRequestState, nominalList: NominalList[]): Partial<BillingRequestState> {
    return {
        ...state,
        nominalListLoading: false,
        nominalList: nominalList ? nominalList
            .map(val => ({ data: val, selected: false, key: val.noM_Account_Ref, value: val.noM_Account_Ref })) : [],
    };
}
function setMatterData(state: BillingRequestState, matterData: any): Partial<BillingRequestState> {
    let matterDetails: MatterData;
    if (matterData) {
        matterDetails = {
            matterRef: matterData.matterRef,
            branchId: matterData.branchId,
            appId: matterData.appId,
            fileId: matterData.fileId,
            appCode: matterData.appCode,
            feeEarner: matterData.feeEarner,
            clientRef: '',
            clientName: matterData.clientName ? matterData.clientName : '',
            eBilling: matterData.eBilling,
            branchName: matterData.branchName,
            isClosed: matterData.isClosed,
            matterDetails: matterData.matterDetails,
            matterCode: matterData.matterCode,
            isProspectMatter: matterData.isProspectMatter
        };
    }
    return {
        ...state,
        matterData: matterDetails ? matterDetails : null,

    };
}
function setMatterDataByRef(state: BillingRequestState, matterData: any): Partial<BillingRequestState> {
    let matterDetails: MatterData;
    if (matterData) {
        matterDetails = {
            matterRef: matterData.matterReferenceNo,
            branchId: matterData.branchID,
            appId: matterData.appID,
            fileId: matterData.fileID,
            appCode: matterData.app_Code,
            feeEarner: matterData.feeEarner,
            clientRef: matterData.client_Ref,
            clientName: matterData.clientName ? matterData.clientName : '',
            eBilling: matterData.eBilling,
            branchName: matterData.branchName,
            isClosed: matterData.isClosed ? matterData.isClosed : false,
            matterDetails: matterData.matterDetails,
            matterCode: matterData.matterCounter, // matter code,
            isProspectMatter: matterData.isProspectMatter
        };
    }
    return {
        ...state,
        matterData: matterDetails ? matterDetails : null,
    };
}
function saveData(state: BillingRequestState) {
    return {
        ...state,
        // isMenuListLoading: true,
    };
}
function setSaveddAddressType(state: BillingRequestState, savedAddressList: BillingAddressResponceModel[]) {
    let addressData: BillingAddressResponceModel;
    if (state && state.printSettingAddress && state.selectedprintSettingAddress) {
        addressData = state.printSettingAddress ? savedAddressList.find(f =>
            f.addresType === state.selectedprintSettingAddress.addresType) : null;
    }
    return {
        ...state,
        printSettingAddress: savedAddressList,
        printSettingLoading: false,
        selectedprintSettingAddress: {
            ...state.selectedprintSettingAddress,
            addresType: addressData.addresType,
            addressBillingAddr1: addressData ? addressData.addressBillingAddr1 : null,
            addressBillingAddr2: addressData ? addressData.addressBillingAddr2 : null,
            addressBillingAddr3: addressData ? addressData.addressBillingAddr3 : null,
            addressBillingAddr4: addressData ? addressData.addressBillingAddr4 : null,
            addressBillingPostcode: addressData ? addressData.addressBillingPostcode : null,

        }
    };

}

function setSaveDefaultSetting(state: BillingRequestState, savePrintSetting: PrintSettingModel[]) {
    return {
        ...state,
        //  printSettingAddress : savedAddressList,
        printSettingModel: savePrintSetting,
        printSettingLoading: false

    };


}

function setPrintSettingAddressData(state: BillingRequestState, addressList: BillingAddressResponceModel[]) {
    let addressDataDefault: BillingAddressResponceModel;
    if (addressList) {

        addressDataDefault = addressList ? addressList.find(f => f.addresType === AddressType.Correspondence) : null;

    }

    return {
        ...state,
        printSettingAddress: addressList,
        selectedprintSettingAddress: {
            ...state.selectedprintSettingAddress,
            addresType: AddressType.Correspondence,
            addressBillingAddr1: addressDataDefault ? addressDataDefault.addressBillingAddr1 : null,
            addressBillingAddr2: addressDataDefault ? addressDataDefault.addressBillingAddr2 : null,
            addressBillingAddr3: addressDataDefault ? addressDataDefault.addressBillingAddr3 : null,
            addressBillingAddr4: addressDataDefault ? addressDataDefault.addressBillingAddr4 : null,
            addressBillingPostcode: addressDataDefault ? addressDataDefault.addressBillingPostcode : null,
            // addressBillingCounty: addressList ? addressList[0].addressBillingCounty : null,

            // addressBillingTown: addressList ? addressList[0].addressBillingTown : null,

        }
    };
}

function setSelectedAddressType(state: BillingRequestState, selectedType) {
    let addressData: BillingAddressResponceModel;
    if (state && state.printSettingAddress && selectedType) {
        addressData = state.printSettingAddress ? state.printSettingAddress.find(f => f.addresType === selectedType) : null;
    }
    return {
        ...state,
        selectedprintSettingAddress: {
            ...state.selectedprintSettingAddress,
            addresType: selectedType,
            addressBillingAddr1: addressData ? addressData.addressBillingAddr1 : null,
            addressBillingAddr2: addressData ? addressData.addressBillingAddr2 : null,
            addressBillingAddr3: addressData ? addressData.addressBillingAddr3 : null,
            addressBillingAddr4: addressData ? addressData.addressBillingAddr4 : null,
            addressBillingPostcode: addressData ? addressData.addressBillingPostcode : null,
            // addressBillingCounty: addressData > 0 ? addressData.addressBillingCounty : null,
            //  addressBillingTown: addressData > 0 ? addressData.addressBillingTown : null,

        }
    };
}

function mapEditData(state: BillingRequestState, editData: BillRequestEditData): BillingRequestState {
    const tempDisb: DisbursmentHeaderWrapperModel<BillingRequestDisbursExpenseHeaderViewModel>[] = [];
    editData.billingDisbursments.forEach(i => {
        const disb: DisbursmentHeaderWrapperModel<BillingRequestDisbursExpenseHeaderViewModel> = {
            data: {
                feeEarner: i.feeEarner,
                details: i.details,
                net: i.net,
                vat: i.vat,
                vatCode: i.vatCode,
                itemDate: i.itemDate,
                grossVal: i.grossVal,
                recordType: i.recordType,
                nominal: i.nominal,
                disbursmentItemDetails: i
            },
            isDisbursmenGrid: true,
            isDisbursmenItem: (i.recordType === RecordTypes.Disbursment) ? true : false,
            selected: false,
            rowId: uuid()
        };
        tempDisb.push(disb);
    });

    const tempTime: TimeProfitHeaderResponseModel<BillingRequestTimeProfitHeaderResponseModel>[] = [];
    editData.billingRequestTimes.forEach(i => {
        const time: TimeProfitHeaderResponseModel<BillingRequestTimeProfitHeaderResponseModel> = {
            data: {
                billFeeEarner: i.timBillEarner,
                feeEarner: i.timFeeEarner,
                details: i.timDetails,
                itemNo: i.timUniqueRef,
                mpu: i.timMPU,
                net: i.timVal,
                nominal: i.nominal,
                notes: i.timNotes,
                oNet: 0,
                oVat: 0,
                recordType: i.recordType,
                timTType: i.timTType,
                uniqueRef: i.timUniqueRef ? i.timUniqueRef.toString() : null,
                units: i.timUnits,
                urn: i.timTsURN ? i.timTsURN.toString() : null,
                vat: i.timVat,
                vatCode: i.salVatCode,
                billingDetails: [i],
                grossVal: i.timVal
            },
            isTimeHeaderGrid: true,
            isTimeItem: true,
            selected: false,
            rowId: uuid()
        };
        tempTime.push(time);
    }

    );

    return {
        ...state,
        disbsAndExpenseHeaderGridData: tempDisb,
        timeAndProfitHeaderGridData: tempTime,
        note: editData.adminNotes,
        narrativeItemText: editData.narrative,
        billOrProformaAddress: editData.billAddressee,
        billOrProformaData: editData.billDate,
        billOrProformaNo: editData.billNo,
        billOrProformaText: editData.billText,
        enableEditData: editData.enableEditData,
        postingDateText: editData.postingDateText,


    };
}

export const getState = (state: State) => state;
export const getViews = (state: State) => state.views;
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getFeeEarnerList = (state: State) => state.feeEarnerList;
export const getAllocateList = (state: State) => state.feeEarnerList;
export const getVatCodeList = (state: State) => state.vatCodeList;
// export const getNominalList = (state: State) => state.nominalList;
export const getDescriptionsList = (state: State) => state.descriptionList;
export const getMatterInfoByToken = (token) => createSelector(getViewByToken(token), (requestState) => {
    return requestState ? requestState.matterData : null;
});
export const getViewDataByToken = (token) => createSelector(getViewByToken(token), (requestState) => {
    return requestState ? requestState.matterData : null;
});
export const getMainLoaderState = (state: State) => state.mainLoading || state.loadingEditdata;
export const getclosePopupCount = (state: State) => state.closePopup;

export const getPrintAllDropDownData = (state: State) => {
    return {
        printLayOutBillDropDown: state.printLayOutBillDropDown,
        printLayOutTimeDropDown: state.printLayOutTimeDropDown,
        printLayOutDisbDropDown: state.printLayOutDisbDropDown
    };
};
// export const getFeeEarnerListByToken = (token) => createSelector(getFeeEarnerList, getViewByToken(token),
//     (feeEarnerList, requestState) => feeEarnerList && requestState ?
//         feeEarnerList.map(val => ({ ...val, selected: false })) : null); // requestState.feeEarner === val.groupName
export const getTotalValuesByToken = (token) => createSelector(getViewByToken(token), (requestState) => {
    if (requestState) {
        let totalFeesValue = 0;
        let totalFeesVat = 0;
        let totalDisbursmentValue = 0;
        let totalDisbursmentVat = 0;
        let totalExpenseValue = 0;
        let totalExpenseVat = 0;
        requestState.timeAndProfitHeaderGridData
            .forEach((val) => {
                totalFeesValue += val.data.net;
                totalFeesVat += val.data.vat;
            });
        requestState.disbsAndExpenseHeaderGridData.filter((item) =>
            item.data.recordType === RecordTypes.Disbursment)
            .forEach((val) => {
                totalDisbursmentValue += val.data.net;
                totalDisbursmentVat += val.data.vat;
            });
        requestState.disbsAndExpenseHeaderGridData.filter((item) =>
            item.data.recordType === RecordTypes.Expense)
            .forEach((val) => {
                totalExpenseValue += val.data.net;
                totalExpenseVat += val.data.vat;
            });
        // parseFloat(totalNetValue.toString()).toFixed(2);
        return {
            totalFeesValue: totalFeesValue, totalFeesVat: totalFeesVat, totalDisbursmentValue: totalDisbursmentValue,
            totalDisbursmentVat: totalDisbursmentVat, totalExpenseValue: totalExpenseValue, totalExpenseVat: totalExpenseVat,
            totalNetSum: (totalFeesValue + totalDisbursmentValue + totalExpenseValue),
            totalVatSum: (totalFeesVat + totalDisbursmentVat + totalExpenseVat),
            billTotal: (totalFeesValue + totalDisbursmentValue + totalExpenseValue + totalFeesVat + totalDisbursmentVat + totalExpenseVat)
        };
    } else {
        return {
            totalFeesValue: 0, totalFeesVat: 0, totalDisbursmentValue: 0,
            totalDisbursmentVat: 0, totalExpenseValue: 0, totalExpenseVat: 0,
            totalNetSum: 0, totalVatSum: 0, billTotal: 0
        };
    }
});
export const getUserNominalCodeByToken = (token) => createSelector(getViewByToken(token), (requestState) => {
    return requestState ? requestState.userNominalCode : null;
});
export const getTimeHeaderGridOrderDataByToken = (token) => createSelector(getViewByToken(token), (requestState) => {
    if (requestState && requestState.timeAndProfitHeaderGridData && requestState && requestState.timeAndProfitHeaderGridData.length > 0) {
        return requestState.timeAndProfitHeaderGridData.filter(item => !item.isTimeItem)
            .concat(requestState.timeAndProfitHeaderGridData.filter(item => item.isTimeHeaderGrid && item.isTimeItem));
    } else {
        return [];
    }
});


