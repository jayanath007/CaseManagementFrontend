import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';
import { InitOpportunityPage } from '../actions/core';
import {
    FeeEarnerList, OpportunityLoadingType, PropertyQuoteType,
    PropertyQuoteRequest, PropertyQuReport, OpertunityState, Screen, SaveScreenItem,
    WebQuoteCompnayDetails, OpportunityGridDataViewModel, WebQuoteCost, WebQuoteData,
} from '../models/interfaces';
import { InputNameList, LeaseHold, PropertyQuoteRequestKey } from '../models/enums';
import { paginatorChange, applyFieldSort, applyColumnFilter, clearColumnFilter } from '../../core/lib/grid-helpers';
import {
    Introducer, GridDataResponceViewModel, StatusList, OpportunitySaveViewModel,
    ClientSearchResultViewModel,
    ExtraColumnDef,
    OppertunityHistory, WebQuoteVars
} from './../models/interfaces';
import { ColumnDef, PaginatorDef } from './../../core/lib/grid-model';
import { DatePipe } from '@angular/common';
import { dpsNewDate } from '../../utils/javascriptDate';
import { DropdownListData } from '../../core';
import { MatterCategoryWithhAppInfo } from '../../shared-data/model/interface';
const datePipe = new DatePipe('en-US');
export interface State {
    readonly views: { [token: string]: OpportunityState };
    screenList: Screen[];
    apps: DropdownListData[];
    settingIsLoading?: boolean;
    screenDataRow?: SaveScreenItem[];
    webQuoteVars?: WebQuoteVars[];
    emailTemplete?: File;
    previesEmailTemplete?: string;
    webQuoteCompany?: WebQuoteCompnayDetails;
}

export interface OpportunityState {
    readonly init: boolean;
    readonly opportunityLoading: OpportunityLoadingType;
    readonly loginUser: string;
    readonly selectedTabIndex: number;
    readonly columnDef: ColumnDef[];
    readonly originalColumnDef: ColumnDef[];
    readonly paginatorDef: PaginatorDef;
    readonly feeEarnerList: FeeEarnerList[];
    readonly introducerList: Introducer[];
    readonly statusList: StatusList[];
    readonly opportunitySaveViewModel: OpportunitySaveViewModel;
    readonly opportunitySaveData: GridDataResponceViewModel;
    readonly opportunitySaveDataCount: number;
    readonly stats: OpertunityState;

    // Oppertunity Popup View
    readonly history: OppertunityHistory[];
    readonly editOppertunityId: number;
    readonly loadingViewPopup: boolean;
    // Quote Run
    readonly quoteRunLoading: boolean;
    readonly templete: string[];
    readonly closePopup: number;
    // Close opportunity popup close
    readonly closeOpportunityPopupClose: number;
    readonly extraColumnDef: ExtraColumnDef;

    // PropertyQuote
    readonly propertyQuoteType: PropertyQuoteType[];
    readonly propertyQuoteRequest: PropertyQuoteRequest;
    readonly webQuoteData: WebQuoteData;
    readonly propertyQuReport: PropertyQuReport;
    readonly propertyQuCurrentStep: number;

}

const initialState: State = { views: {}, screenList: [], apps: [] };

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_OPPORTUNITY:
            temp[action.token] = getInitViewData(state.views[action.token], action);
            return {
                ...state, views: { ...state.views, ...temp }
            };
        case Actions.OPPORTUNITY_INTRODUCTION_LIST_SUCCESS:
            temp[action.token] = setIntriductionData(state.views[action.token],
                action.payload.introductionList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPPORTUNITY_INTRODUCTION_SELECTION_CHANGE:
            temp[action.token] = setChangeIntroducerData(state.views[action.token], action.selectedItem);
            return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_OPPORTUNITY_DEPARTMENT_LIST_SUCCESS:
        //     temp[action.token] = setDepartmentData(state.views[action.token], action.payload.departmentList);
        //     return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_DEPARTMENT_SELECTION_CHANGE:
            temp[action.token] = setChangeDepartmentData(state.views[action.token], action.selectedId);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_FEE_EARNER_LIST_SUCCESS:
            temp[action.token] = setFeeEarnerData(state.views[action.token], action.payload.feeEarnerList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_FEE_EARNER_SELECTION_CHANGE:
            temp[action.token] = setChangeFeeEarnerData(state.views[action.token], action.selectedItem);
            return { ...state, views: { ...state.views, ...temp } };
        // case Actions.GET_OPPORTUNITY_WORK_TYPE_LIST_SUCCESS:
        //     temp[action.token] = setWorkTypeData(state.views[action.token], action.payload.workTypeList);
        //     return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_WORK_TYPE_SELECTION_CHANGE:
            temp[action.token] = setChangeWorkTypeData(state.views[action.token], action.selectedItem);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_STATUS_LIST_SUCCESS:
            temp[action.token] = setStatusData(state.views[action.token], action.payload.statusList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_STATUS_SELECTION_CHANGE:
            temp[action.token] = setChangeStatusData(state.views[action.token], action.selectedItem);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPPORTUNITY_INPUT_VALUE_CHANGE:
            temp[action.token] = inputValueChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.UPDATE_SELECTED_ROW:
            temp[action.token] = {
                ...state.views[action.token],
                opportunitySaveData: {
                    ...state.views[action.token].opportunitySaveData,
                    data: state.views[action.token].opportunitySaveData.data
                        .map(val =>
                            ({ ...val, selected: val.opportunityNumber === action.selectedRow.opportunityNumber })
                        )
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_SAVE_OPPORTUNITY_GRID_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: true,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_SAVE_OPPORTUNITY_GRID_DATA_SUCCESS:
            temp[action.token] = setSaveOpportunityData(state.views[action.token], action.payload.data);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_SAVE_OPPORTUNITY_GRID_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPPORTUNITY_SET_SELECTED_CLENT_DATA:
            temp[action.token] = setClientDataModel(state.views[action.token], action.clientDataModel);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLEAR_OPPORTUNITY_MODEL_DATA:
            temp[action.token] = clearClientDataModel(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPPORTUNITY_CHANGE_TAB:
            temp[action.token] = { ...state.views[action.token], selectedTabIndex: action.payload.tabIndex };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_TEMPLETE:
            temp[action.token] = {
                ...state.views[action.token],
                quoteRunLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_TEMPLETE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                templete: action.payload.templete,
                quoteRunLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_TEMPLETE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                quoteRunLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPPORTUNITY_VALIDATION_MESSAGE:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_AND_SAVE_OPPORTUNITY_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: true,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_AND_SAVE_OPPORTUNITY_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                },
                opportunitySaveViewModel: {
                    ...state.views[action.token].opportunitySaveViewModel,
                    enquiryId: action.payload.responceData ? action.payload.responceData.data ?
                        +action.payload.responceData.data.enquiryId : null : null,
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_AND_SAVE_OPPORTUNITY_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_AND_QUOTE_OPPORTUNITY_DATA:
            temp[action.token] = {
                ...resetPropertQuoteData(state.views[action.token]),
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: true,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                },
                opportunitySaveViewModel: {
                    ...state.views[action.token].opportunitySaveViewModel,
                    propertyQuReport: null,
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_AND_QUOTE_OPPORTUNITY_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                },
                opportunitySaveViewModel: {
                    ...state.views[action.token].opportunitySaveViewModel,
                    enquiryId: action.payload.responceData ? action.payload.responceData.data ?
                        +action.payload.responceData.data.enquiryId : null : null,
                    opportunityNumber: action.payload.responceData ? action.payload.responceData.data ?
                        action.payload.responceData.data.opportunityNumber : null : null,
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_AND_QUOTE_OPPORTUNITY_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GENARATE_QUOTE:
            temp[action.token] = {
                ...state.views[action.token],
                quoteRunLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GENARATE_QUOTE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                quoteRunLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GENARATE_QUOTE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                quoteRunLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.POPUP_CLOSE:
            temp[action.token] = {
                ...state.views[action.token],
                closePopup: state.views[action.token].closePopup + 1
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_FEE_EARNER_EMAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: true,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_FEE_EARNER_EMAIL_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_FEE_EARNER_EMAIL_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLOSE_OPPORTUNITY_ACCEPTED:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: true,
                    createCaseFileLoading: false
                },
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLOSE_OPPORTUNITY_ACCEPTED_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLOSE_OPPORTUNITY_ACCEPTED_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.CLOSE_OPPORTUNITY_REJECTED:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: true,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLOSE_OPPORTUNITY_REJECTED_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLOSE_OPPORTUNITY_REJECTED_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CLOSE_CLOSE_OPPORTUNITY_POPUP:
            temp[action.token] = {
                ...state.views[action.token],
                closeOpportunityPopupClose: state.views[action.token].closeOpportunityPopupClose + 1
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CASE_FILE_CREATE:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: true
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CASE_FILE_CREATE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunitySaveViewModel: emptyModel(action.payload.dateTimeOffset),
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CASE_FILE_CREATE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false,
                    savedGridLoading: false,
                    closeOpportunityLoading: false,
                    createCaseFileLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPERTUNITY_HISTORY:
            temp[action.token] = {
                ...state.views[action.token],
                loadingViewPopup: true,
                history: [],
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPERTUNITY_HISTORY_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loadingViewPopup: false,
                history: action.history
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPERTUNITY_HISTORY_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingViewPopup: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_LOG_FILE:
            temp[action.token] = {
                ...state.views[action.token],
                loadingViewPopup: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_LOG_FILE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loadingViewPopup: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_LOG_FILE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingViewPopup: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_PAGE:
            temp[action.token] = {
                ...state.views[action.token],
                paginatorDef: paginatorChange(action.pageDef)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.APPLY_COLUM_SORTING:
            temp[action.token] = {
                ...state.views[action.token],
                columnDef: applyFieldSort(state.views[action.token].columnDef, action.columDef)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.INIT_PROPERTY_QUOTE:
            temp[action.token] = resetPropertQuoteData(state.views[action.token], action.isEditQuote);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_PROPERTY_QUOTE_TYPE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                },
                propertyQuoteType: action.typeList
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_PROPERTY_QUOTE_TYPE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_PROPERTY_QUOTE_REQUEST:
            temp[action.token] = {
                ...state.views[action.token],
                propertyQuReport: isApplyDiscount(action.info.key) ? state.views[action.token].propertyQuReport : null,
                propertyQuoteRequest: changePropertyQuoteRequest(state.views[action.token].propertyQuoteRequest, action.info)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_PROPERTY_QUOTE_STEP:
            temp[action.token] = {
                ...state.views[action.token],
                propertyQuCurrentStep: action.index
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_PROPERT_QUOTE_COMBO_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: true
                },
                propertyQuoteRequest: {
                    appId: null,
                    isEngProperty: true,
                    martgage: false,
                    sellShare: false,
                    buyShare: false,
                    buyLeasehold: LeaseHold.No,
                    saleleasehold: LeaseHold.No,
                    hipsLeasehold: LeaseHold.No,
                    branchId: 0,
                    purchesValue: null,
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_WEB_QUOTE_COMPANY_SUCCESS:
            return { ...state, webQuoteCompany: action.details };
        case Actions.LOAD_PROPERT_QUOTE_COMBO_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                },
                webQuoteData: {
                    branch: action.data.branchList,
                    loclAuth: action.data.localAuth,
                    cost: action.data.costList
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_PROPERTY_QUOTE_TYPE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.PROPERTY_QUOTE_REPORT_LOADING:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: true
                },
                // propertyQuReport: null
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.PROPERTY_QUOTE_REPORT_LOADING_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                },
                propertyQuReport: action.reportData
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.PROPERTY_QUOTE_REPORT_LOADING_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_PROPERTY_QUOTE:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: true
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_PROPERTY_QUOTE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SEND_PROPERTY_QUOTE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.VALIDATE_MATTER_DETAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.VALIDATE_MATTER_DETAIL_SUCCESS:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.VALIDATE_MATTER_DETAIL_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_STATUS_SUMMARY:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_STATUS_SUMMARY_SUCCESS:
            temp[action.token] = { ...state.views[action.token], sendSaveQuoteLoading: false, stats: action.stats };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_OPPORTUNITY_STATUS_SUMMARY_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.INIT_OPPERTUNITY_SETTING:
            return { ...state, screenList: [] };
        case Actions.LOAD_INIT_SCREEN_LIST:
            return { ...state, settingIsLoading: true };
        case Actions.LOAD_INIT_SCREEN_LIST_SUCCESS:
            return { ...state, settingIsLoading: false, screenDataRow: mapScreenList(action.data) };
        case Actions.LOAD_INIT_SCREEN_LIST_FAIL:
            return { ...state, settingIsLoading: false };
        case Actions.GET_APP_CODE_LIST:
            return { ...state, settingIsLoading: true };
        case Actions.GET_APP_CODE_LIST_SUCCESS:
            return { ...state, settingIsLoading: false, apps: action.payload };
        case Actions.GET_APP_CODE_LIST_FAIL:
            return { ...state, settingIsLoading: false };

        case Actions.SAVE_SCREEN_LIST:
            return { ...state, settingIsLoading: action.payload.hasNonAddingItem ? false : true };
        case Actions.SAVE_SCREEN_LIST_SUCCESS:
            return { ...state, settingIsLoading: false };
        case Actions.SAVE_SCREEN_LIST_FAIL:
            return { ...state, settingIsLoading: false };

        case Actions.LOAD_SCREEN_LIST:
            return { ...state, settingIsLoading: true };
        case Actions.LOAD_SCREEN_LIST_SUCCESS:
            return {
                ...state, screenList: state.screenList.concat({ appId: action.appId, screens: action.screenList }),
                settingIsLoading: false
            };
        case Actions.LOAD_SCREEN_LIST_FAIL:
            return { ...state, settingIsLoading: false };
        case Actions.ADD_SCREEN_ITEM:
            return { ...state, screenDataRow: !!state.screenDataRow ? state.screenDataRow.concat(action.item) : [action.item] };
        case Actions.EDIT_SCREEN_ITEM:
            return { ...state, screenDataRow: editScreenItem(state.screenDataRow, action.index, action.key, action.value) };
        case Actions.REMOVE_SCREEEN_ITEM:
            return { ...state, screenDataRow: removeScreenItem(state.screenDataRow, action.index) };
        case Actions.INIT_OPPORTUNITY_EDIT:
            temp[action.token] = {
                ...state.views[action.token],
                editOppertunityId: action.opertunityId
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_EDIT_OPPORTUNITY_DATA:
            temp[action.token] = {
                ...state[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    loadingViewPopup: true
                }
            };
            return { ...state, ...temp };
        case Actions.SAVE_EDIT_OPPORTUNITY_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    loadingViewPopup: false
                }
            };
            return { ...state, ...temp };
        case Actions.SAVE_EDIT_OPPORTUNITY_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    loadingViewPopup: false
                }
            };
            return { ...state, ...temp };
        case Actions.PROPERTY_QUOTE_GET_VARS_SUCCESS:
            return { ...state, webQuoteVars: action.vars };
        case Actions.GET_EDIT_ENQUARY_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    editData: true
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EDIT_ENQUARY_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    editData: false,
                },
                opportunitySaveData: {
                    ...state.views[action.token].opportunitySaveData,
                    data: state.views[action.token].opportunitySaveData.data
                        .map(i => {
                            if (i.enquiryId === action.enquaryId) {
                                return { ...i, ...action.data };
                            }
                            return i;
                        })
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EDIT_ENQUARY_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    editData: true
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.UPLOAD_EMAIL_TEMPLETE:
            return { ...state, settingIsLoading: true, emailTemplete: action.file };
        case Actions.UPLOAD_EMAIL_TEMPLETE_SUCCESS:
            return { ...state, settingIsLoading: false };
        case Actions.UPLOAD_EMAIL_TEMPLETE_FAIL:
            return { ...state, settingIsLoading: false };
        case Actions.VIEW_MAIL_HEADER_ATTACHMENT:
            return { ...state, settingIsLoading: true };
        case Actions.VIEW_MAIL_HEADER_ATTACHMENT_SUCCESS:
            return { ...state, settingIsLoading: false, previesEmailTemplete: action.view };
        case Actions.VIEW_MAIL_HEADER_ATTACHMENT_FAIL:
            return { ...state, settingIsLoading: false, previesEmailTemplete: null };
        case Actions.SAVE_REPORT_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: true
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_REPORT_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                },
                propertyQuoteRequest: {
                    ...state.views[action.token].propertyQuoteRequest,
                    [PropertyQuoteRequestKey.reportId]: action.reportId
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_REPORT_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityLoading: {
                    ...state.views[action.token].opportunityLoading,
                    sendSaveQuoteLoading: false
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_REPORT_DATA:
            const tempReports = {};
            tempReports[action.payload.type] = action.payload.newReport;
            temp[action.token] = {
                ...state.views[action.token],
                propertyQuReport: { ...state.views[action.token].propertyQuReport, ...tempReports },
                propertyQuoteRequest: changePropertyQuoteRequest(state.views[action.token].propertyQuoteRequest,
                    { key: PropertyQuoteRequestKey.reportId, value: 0 })

            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_COLUM_FILTERATION:
            let tempColum = state.views[action.token].columnDef;
            if (action.payload.kind === 'ClearColumnFilter') {
                tempColum = clearColumnFilter(tempColum, action.payload.columnDef);
            } else {
                tempColum = applyColumnFilter(tempColum, action.payload.columnDef);
            }
            temp[action.token] = {
                ...state.views[action.token],
                columnDef: tempColum
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CREATE_A_MATTER:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CREATE_A_MATTER_SUCCESS:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CREATE_A_MATTER_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        default:
            { return state; }
    }
}
function getInitViewData(state: OpportunityState, action: InitOpportunityPage): Partial<OpportunityState> {
    if (state) {
        return state;
    } else {
        return {
            ...state,
            init: true,
            selectedTabIndex: 0,
            columnDef: action.payload.columnDef,
            originalColumnDef: action.payload.columnDef,
            paginatorDef: action.payload.paginatorDef,
            introducerList: [],
            feeEarnerList: [],
            // departmentList: [],
            // workTypeList: [],
            statusList: [],
            opportunitySaveViewModel: emptyModel(action.payload.dateTimeOffset),
            opportunityLoading: {
                sendSaveQuoteLoading: true,
                savedGridLoading: true,
                closeOpportunityLoading: false,
                createCaseFileLoading: false,
                editData: false
            },
            closePopup: 0,
            closeOpportunityPopupClose: 0,
            extraColumnDef: action.payload.extraColumnDef,
            propertyQuoteType: []
        };
    }
}
function emptyModel(dateTimeOffset) {
    return {
        clientRef: '',
        lastName: '',
        firstName: '',
        companyName: '',
        houseNumber: '',
        address1: '',
        address2: '',
        town: '',
        country: '',
        postCode: '',
        email1: '',
        email2: '',
        introducer: null,
        introducerDescription: null,
        departmentId: -1,
        workTypeId: -1,
        feeEarner: '',
        note: '',
        contactId: -1,
        enquiryId: -1,
        workType: '',
        enquiryDateOn: datePipe.transform(dpsNewDate(dateTimeOffset), 'dd/MM/yyyy'),
        conflictCount: 0,
        appCode: null,
        enquiryInfo: null,
        quoteAmount: null,
        quoteDisb: null,
        otherFees: null,
        propertyQuoteData: null,
        templete: null,
        mobileNo: null,
        workTelNo: null,
        birthDate: null,
        title: null
    };
}
function setSaveOpportunityData(state: OpportunityState, data: GridDataResponceViewModel):
    Partial<OpportunityState> {
    const gridVal = data.data.map(val => ({ ...val, selected: false }));
    return Object.freeze({
        ...state
        // , opportunitySaveData: data
        , opportunityLoading: {
            ...state.opportunityLoading,
            sendSaveQuoteLoading: false,
            savedGridLoading: false,
            closeOpportunityLoading: false
        },
        opportunitySaveData: {
            // ...state.opportunitySaveData,
            data: data.data.map(val => ({ ...val, selected: false })),
            total: data.total,
            aggregates: data.aggregates,
            group: data.group
        },
    });
}
function setIntriductionData(state: OpportunityState, intriductionResponse: Introducer[]): Partial<OpportunityState> {
    return Object.freeze({
        ...state
        , introducerList: !!intriductionResponse && intriductionResponse.length > 0 ? intriductionResponse.filter(i => !i.luP_Hidden) : []
    });
}
function setChangeIntroducerData(state: OpportunityState, selectedItem: Introducer): Partial<OpportunityState> {
    return Object.freeze({
        ...state
        // , introducerList: introducerRowSelectionChange(state, selectedItem)
        , opportunitySaveViewModel: {
            ...state.opportunitySaveViewModel,
            introducer: selectedItem ? selectedItem.luP_ID : null,
            introducerDescription: selectedItem ? selectedItem.luP_Description : '',
        }
    });
}

// function setDepartmentData(state: OpportunityState, departmentResponse: DropdownList[]): Partial<OpportunityState> {
//     return Object.freeze({
//         ...state
//         , departmentList: departmentResponse
//     });
// }
function setChangeDepartmentData(state: OpportunityState, selectedId: number): Partial<OpportunityState> {
    return Object.freeze({
        ...state
        , opportunitySaveViewModel: {
            ...state.opportunitySaveViewModel,
            departmentId: selectedId ? selectedId : -1,
        }
    });
}

function setChangeWorkTypeData(state: OpportunityState, selectedItem: MatterCategoryWithhAppInfo): Partial<OpportunityState> {
    return Object.freeze({
        ...state
        , opportunitySaveViewModel: {
            ...state.opportunitySaveViewModel,
            workTypeId: selectedItem ? selectedItem.matCategoryId : -1,
        }
    });
}

function setStatusData(state: OpportunityState, statusList: StatusList[]): Partial<OpportunityState> {
    const statusResponse: StatusList[] = statusList.map((status) => {
        if (status.key === 1) {
            return Object.freeze({ ...status, isSelected: true });
        } else {
            return Object.freeze({ ...status, isSelected: false });
        }
        return status;
    });
    return Object.freeze({
        ...state
        , statusList: statusResponse
    });
}
function setChangeStatusData(state: OpportunityState, selectedItem: StatusList): Partial<OpportunityState> {
    const originalCol = state.originalColumnDef;
    const extraColum = state.extraColumnDef[selectedItem.key];
    let newColumn: ColumnDef[] = [];
    if (!!extraColum && extraColum.length > 0) {
        switch (selectedItem.key) {
            case 2: {
                const originalBeforeCol = originalCol.slice(0, 4);
                const originalAffterCol = originalCol.slice(4, originalCol.length);
                newColumn = originalBeforeCol.concat(extraColum).concat(originalAffterCol);
                break;
            }
            case 3: {
                const originalBeforeCol = originalCol.slice(0, 4);
                const originalAffterCol = originalCol.slice(4, originalCol.length);
                const extraBeforeCol = extraColum.slice(0, 2);
                const extraAffterCol = extraColum.slice(2, extraColum.length);
                newColumn = originalBeforeCol.concat(extraBeforeCol).concat(originalAffterCol).concat(extraAffterCol);
                break;
            }
            case 4: {
                const originalBeforeCol = originalCol.slice(0, 3);
                const originalAffterCol = originalCol.slice(3, originalCol.length);
                const extraBeforeCol = extraColum.slice(0, 2);
                const extraAffterCol = extraColum.slice(2, extraColum.length);
                newColumn = originalBeforeCol.concat(extraBeforeCol).concat(originalAffterCol).concat(extraAffterCol);
                break;
            }
            default: {
                newColumn = originalCol;
            }
        }
    }


    return Object.freeze({
        ...state
        , statusList: statusRowSelectionChange(state, selectedItem)
        , columnDef: newColumn.length > 0 ? newColumn : originalCol
        , paginatorDef: { currentPage: 0, itemPerPage: 50 }
    });

    // return Object.freeze({
    //     ...state
    //     , statusList: statusRowSelectionChange(state, selectedItem)
    //     , columnDef: extraColum ? originalCol.concat(extraColum) : originalCol
    //     , paginatorDef: { currentPage: 0, itemPerPage: 50 }
    // });
}
function statusRowSelectionChange(state: OpportunityState, newItem: StatusList) {
    return state.statusList.map((rowItem) => {
        if (rowItem.key === newItem.key) {
            return Object.freeze({ ...rowItem, isSelected: true });
        } else if (rowItem.isSelected) {
            return Object.freeze({ ...rowItem, isSelected: false });
        }
        return rowItem;
    });
}
function setFeeEarnerData(state: OpportunityState, feeEarnerList: FeeEarnerList[]): Partial<OpportunityState> {
    const getLoginUser: string = state.loginUser;
    const feeEarnerWrapResponse: FeeEarnerList[] = feeEarnerList.map(_item => ({
        key: _item.key,
        value: _item.value,
        isSelected: false,
        description1: _item.description1,
        description2: _item.description2
    }));
    const feeEarnerResponse: FeeEarnerList[] = feeEarnerWrapResponse.map((feeEarner) => {
        if (getLoginUser && feeEarner.key === getLoginUser) {
            return Object.freeze({ ...feeEarner, isSelected: true });
        } else if (feeEarner.isSelected) {
            return Object.freeze({ ...feeEarner, isSelected: false });
        }
        return feeEarner;
    });
    return Object.freeze({
        ...state
        , feeEarnerList: feeEarnerResponse
    });
}
function setChangeFeeEarnerData(state: OpportunityState, selectedItem: FeeEarnerList): Partial<OpportunityState> {
    return Object.freeze({
        ...state
        // , feeEarnerList: feeEarnerRowSelectionChange(state, selectedItem)
        , opportunitySaveViewModel: {
            ...state.opportunitySaveViewModel,
            feeEarner: selectedItem ? selectedItem.key : '',
        }
    });
}

function setClientDataModel(state: OpportunityState, clientDataModel: ClientSearchResultViewModel) {
    return Object.freeze({
        ...state
        , opportunitySaveViewModel: {
            ...state.opportunitySaveViewModel,
            clientRef: clientDataModel ? clientDataModel.salesAccountRef : '',
            lastName: clientDataModel ? clientDataModel.lastName : '',
            firstName: clientDataModel ? clientDataModel.firstName : '',
            companyName: clientDataModel ? clientDataModel.companyName : '',
            houseNumber: clientDataModel.houseNo ? clientDataModel.houseNo : '',
            address1: clientDataModel ? clientDataModel.address1 : '',
            address2: clientDataModel ? clientDataModel.address2 : '',
            town: clientDataModel ? clientDataModel.town : '',
            country: clientDataModel ? clientDataModel.country : '',
            postCode: clientDataModel ? clientDataModel.postCode : '',
            email1: clientDataModel ? clientDataModel.email1 : '',
            email2: clientDataModel.email2 ? clientDataModel.email2 : '',
            introducer: clientDataModel && clientDataModel.salesIntroductionId > 0 ? clientDataModel.salesIntroductionId : null,
            introducerDescription: null,
            contactId: clientDataModel ? clientDataModel.salesContactId : null,
            mobileNo: clientDataModel ? clientDataModel.mobileNo : null,
            workTelNo: clientDataModel ? clientDataModel.workTelNo : null,
            birthDate: clientDataModel ? clientDataModel.birthDate : null,
            title: clientDataModel ? clientDataModel.title : null
        }
    });
}
function clearClientDataModel(state: OpportunityState) {
    return Object.freeze({
        ...state
        , opportunitySaveViewModel: {
            ...state.opportunitySaveViewModel,
            clientRef: '',
            lastName: '',
            firstName: '',
            companyName: '',
            houseNumber: '',
            address1: '',
            address2: '',
            town: '',
            country: '',
            postCode: '',
            email1: '',
            email2: '',
            introducer: null,
            introducerDescription: null,
            departmentId: -1,
            workTypeId: -1,
            enquiryId: -1,
            feeEarner: '',
            note: '',
            contactId: -1,
            clientName: '',
            mobileNo: null,
            workTelNo: null,
            title: null
        }
    });
}
function inputValueChange(state: OpportunityState, action: Actions.OpportunityInputValueChange): Partial<OpportunityState> {
    const temp: any = {};
    switch (action.payload.kind) {
        case InputNameList.LastName:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, lastName: action.payload.value }
            };
        case InputNameList.FirstName:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, firstName: action.payload.value }
            };
        case InputNameList.CompanyName:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, companyName: action.payload.value }
            };
        case InputNameList.HouseNo:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, houseNumber: action.payload.value }
            };
        case InputNameList.Address1:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, address1: action.payload.value }
            };
        case InputNameList.Address2:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, address2: action.payload.value }
            };
        case InputNameList.Town:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, town: action.payload.value }
            };
        case InputNameList.County:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, country: action.payload.value }
            };
        case InputNameList.PostCode:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, postCode: action.payload.value }
            };
        case InputNameList.Email1:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, email1: action.payload.value.trim() }
            };
        case InputNameList.Email2:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, email2: action.payload.value.trim() }
            };
        case InputNameList.Note:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, note: action.payload.value }
            };
        case InputNameList.MatterDetails1:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, matterDetails1: action.payload.value }
            };
        case InputNameList.MatterDetails2:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, matterDetails2: action.payload.value }
            };
        case InputNameList.Mobileno:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, mobileNo: action.payload.value }
            };
        case InputNameList.WorkTelNo:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, workTelNo: action.payload.value }
            };
        case InputNameList.Title:
            return {
                ...state,
                opportunitySaveViewModel: { ...state.opportunitySaveViewModel, title: action.payload.value }
            };
        default:
            {
                return state;
            }
    }
}
function saveData(state: OpportunityState) {
    return {
        ...state,
        // isMenuListLoading: true,
    };
}
function changePropertyQuoteRequest(data: PropertyQuoteRequest, info: { key: PropertyQuoteRequestKey, value: any }): PropertyQuoteRequest {
    const tem = { [info.key]: info.value };
    return { ...data, ...tem };
}
function changeLoadingState(state: OpportunityState, isLoading: boolean): OpportunityState {
    return {
        ...state,
        opportunityLoading: {
            ...state.opportunityLoading,
            sendSaveQuoteLoading: isLoading
        }
    };
}

function resetPropertQuoteData(state: OpportunityState, isEditQuote: boolean = false): OpportunityState {

    let defuildPropertyQuoteRequest = {
        [PropertyQuoteRequestKey.reportId]: 0,
        [PropertyQuoteRequestKey.appId]: null,
        [PropertyQuoteRequestKey.isEngProperty]: true,
        [PropertyQuoteRequestKey.martgage]: false,
        [PropertyQuoteRequestKey.sellShare]: false,
        [PropertyQuoteRequestKey.buyShare]: false,
        [PropertyQuoteRequestKey.buyLeasehold]: LeaseHold.No,
        [PropertyQuoteRequestKey.saleleasehold]: LeaseHold.No,
        [PropertyQuoteRequestKey.hipsLeasehold]: LeaseHold.No,
        [PropertyQuoteRequestKey.branchId]: 0,
        [PropertyQuoteRequestKey.purchesValue]: null,
        [PropertyQuoteRequestKey.saleValue]: null,
        [PropertyQuoteRequestKey.hIPsValue]: null,
        [PropertyQuoteRequestKey.lasId]: 0,
        [PropertyQuoteRequestKey.isBuyHouse]: false,
        [PropertyQuoteRequestKey.isFirstTimeBuyer]: false,
        [PropertyQuoteRequestKey.isNewBuild]: false,
        [PropertyQuoteRequestKey.isBuyToLet]: false,
        [PropertyQuoteRequestKey.isSecondProperty]: false,
        [PropertyQuoteRequestKey.isRightToBuy]: false,
        [PropertyQuoteRequestKey.isSaleHouse]: false,

        [PropertyQuoteRequestKey.purchesProfCostDis]: null,
        [PropertyQuoteRequestKey.saleProfCostDis]: null,
        [PropertyQuoteRequestKey.hipsProfCostDis]: null,
    };

    let editRow: OpportunityGridDataViewModel = null;
    let propertyQuCurrentStep = 0;
    if (!!state && !!state.opportunitySaveData && !!state.opportunitySaveData.data && !!isEditQuote) {
        editRow = state.opportunitySaveData.data.find(i => i.enquiryId === state.editOppertunityId);
        if (!!editRow) {
            defuildPropertyQuoteRequest = { ...defuildPropertyQuoteRequest, ...editRow.propertyQuoteData };
            if (editRow.propertyQuoteData && editRow.propertyQuoteData.reportId) {
                propertyQuCurrentStep = 1;
            }
        }
    }

    return {
        ...state,
        propertyQuCurrentStep: propertyQuCurrentStep,
        propertyQuoteRequest: defuildPropertyQuoteRequest,
        propertyQuReport: null
    };
}

function editScreenItem(items: SaveScreenItem[], selectIndex: number, key: string, value: any): SaveScreenItem[] {
    const temp = {};
    return items.map((item, index) => {
        if (index === selectIndex) {
            temp[key] = value;
            return { ...item, ...temp };
        }
        return item;
    });
}

function removeScreenItem(items: SaveScreenItem[], selectIndex: number): SaveScreenItem[] {
    return items.filter((item, index) => index !== selectIndex);
}

function mapScreenList(data: string): SaveScreenItem[] {
    const list = JSON.parse(data);
    const temp: SaveScreenItem[] = [];
    if (!!list && list.length > 0) {
        list.forEach(i =>
            i.Screens.forEach(s =>
                temp.push({
                    appId: i.AppId,
                    screenName: s.ScreenName,
                    note: s.Note
                })
            ));
    }

    return temp;
}


function isApplyDiscount(type: PropertyQuoteRequestKey): boolean {
    if (type === PropertyQuoteRequestKey.purchesProfCostDis ||
        type === PropertyQuoteRequestKey.saleProfCostDis ||
        type === PropertyQuoteRequestKey.hipsProfCostDis) {
        return true;
    }
    return false;
}

function createDefuiltNote(model: OpportunitySaveViewModel): string {
    // Created from web quoter on the 25/04/2020 by osman, ismal,
    let note = `Created from spitfire on the ${datePipe.transform(new Date(), 'dd/MM/yyyy')}`;
    if (!!model.feeEarner) {
        note += ` by ${model.feeEarner}`;
    }
    if (!!model.firstName || !!model.lastName) {
        note += `, for`;
        if (!!model.firstName) {
            note += ` ${model.firstName}`;
        }
        if (!!model.lastName) {
            note += ` ${model.lastName}`;
        }
    }


    return note;
}

export const getView = (state: State) => state;
export const getStateByToken = (token) => createSelector(getView, (state) => {
    return state.views[token];
});
export const getOpportunityDisplayDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? 'state.columnDef' : null);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : []);
export const getPaginatorDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.paginatorDef : null);
export const getDataLoadindByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.opportunityLoading : null);
// export const getDepartmentListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.departmentList : []);
// export const getWorkTypeListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.workTypeList : []);
export const getFeeEarnerListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.feeEarnerList : []);
export const getIntroducerListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.introducerList : []);
export const getStatusListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.statusList : []);
export const getSelectedStatusByToken = (token) => createSelector(getStatusListByToken(token), (statusList) =>
    statusList.find((status) => status.isSelected));
export const getSelectedTabByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.selectedTabIndex : 0);
// export const getSelectedDepartmentIdByToken = (token) => createSelector(getDepartmentListByToken(token), (departmentList) =>
//     departmentList.find((status) => status.isSelected));
export const getClientDataModelByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.opportunitySaveViewModel : null);

export const getClientDataModelForSaveByToken = (token) => createSelector(getStateByToken(token),
    (state) => {
        if (!!state) {
            if (!!state.opportunitySaveViewModel && state.opportunitySaveViewModel.enquiryId < 0 && !state.opportunitySaveViewModel.note) {
                return { ...state.opportunitySaveViewModel, note: createDefuiltNote(state.opportunitySaveViewModel) };
            } else {
                return state.opportunitySaveViewModel;
            }
        } else {
            return null;
        }
    });

export const getSaveOpportunityGridDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.opportunitySaveData : null);
export const getOpportunityRunLoading = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.quoteRunLoading : false);
export const getTempleteList = (token) => createSelector(getStateByToken(token),
    state => state ? state.templete : []);
export const closePopup = (token) => createSelector(getStateByToken(token),
    state => state ? state.closePopup : 0);
export const closeOpportunityPopupClose = (token) => createSelector(getStateByToken(token),
    state => state ? state.closeOpportunityPopupClose : 0);
export const opportunityViewHistory = (token) => createSelector(getStateByToken(token),
    state => state ? { isLoading: state.loadingViewPopup, data: state.history } : null);
export const propertyQuoteTypeList = (token) => createSelector(getStateByToken(token), state => state ? state.propertyQuoteType : []);
export const propertyQuoteRequest = (token) => createSelector(getStateByToken(token), state => state ? state.propertyQuoteRequest : null);
export const getwebQuoteData = (token) => createSelector(getStateByToken(token), state => state ? state.webQuoteData : null);
export const getPropertyQuCurrentStep = (token) =>
    createSelector(getStateByToken(token), state => state ? state.propertyQuCurrentStep : null);
export const getPropertyQuReportData = (token) =>
    createSelector(getStateByToken(token), state => state ? state.propertyQuReport : null);
export const getOpportunityStats = (token) => createSelector(getStateByToken(token), state => state ? state.stats : null);
export const getScreenListForSelectedApp = (selectedAppId) => createSelector(getView, (state) => {
    const screenList = state.screenList.find(i => i.appId === selectedAppId);
    return !!screenList ? screenList.screens : [];
});
export const editEnquaryId = (token) => createSelector(getStateByToken(token), state => state ?
    state.editOppertunityId : null);
export const editOppertunityData = (token) => createSelector(getStateByToken(token), state => state ?
    state.opportunitySaveData.data.find(i => i.enquiryId === state.editOppertunityId) : null);
export const getApps = createSelector(getView, (state) => state.apps);
export const settingIsLoading = createSelector(getView, (state) => state.settingIsLoading);
export const getScreenList = createSelector(getView, (state) => state.screenList);
export const getAddedScreenList = createSelector(getView, (state) => state.screenDataRow);
export const getWebQuoteVars = createSelector(getView, (state) => state.webQuoteVars);
export const getEmailTemplete = createSelector(getView, (state) => state.emailTemplete);
export const getPreviesEmailTemplete = createSelector(getView, (state) => state.previesEmailTemplete);
export const getWequoteCompanyDetails = createSelector(getView, (state) => state.webQuoteCompany);
export const defuiltNote = (token) => createSelector(getStateByToken(token), state => state ?
    createDefuiltNote(state.opportunitySaveViewModel) : null);




