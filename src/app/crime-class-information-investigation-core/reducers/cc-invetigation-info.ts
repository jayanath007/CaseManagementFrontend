import { createSelector } from '@ngrx/store';
import { ClassObj } from './../../crime-management-core/models/interfaces';
import { CCInvestigationInfoInput, DropDownItem, ControlerProperty, CrimeClassTotalsSummaryViewModel } from './../../core/lib/crime-managment';
import * as Action from './../actions/core';
import {
    InvestigationClassInfo,
    InvClassTotalsReqViewModel,
    InvClassCurrentTotalsReqViewModel,
    ClassClosingReqViewModel,
    TotalViewDisplayModel
} from '../models/interfaces';
import { Controls } from '../models/enum';
import { ModelProperty } from './../models/enum';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';

export interface State {
    readonly views: { [token: string]: Infomation };
    readonly outComeCode: DropDownItem[];
    readonly matterType: DropDownItem[];
}

interface Infomation {
    loading: boolean;
    classObj: ClassObj;
    appId: number;
    fileId: number;
    ufn: string;
    controlerProperty: ControlerProperty;
    infomationModel: InvestigationClassInfo;
    stageReachedList: DropDownItem[];
    totalSummery: CrimeClassTotalsSummaryViewModel;
    isRecursive: boolean;
}

const initialState: State = {
    views: {},
    outComeCode: [],
    matterType: [],
};

export function reducer(state: State = initialState, action: Action.Any): State {
    const temp = {};
    switch (action.type) {
        case Action.INIT_CRIME_INFORMATION:
            temp[action.token] = initialTokenizeState(action.inputData);
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_CLASS_INFO:
            temp[action.token] = { ...state.views[action.token], loading: true };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_CLASS_INFO_SUCCESS:
            // map subClassMode // If it change
            const temClassObj = { ...state.views[action.token].classObj, subClassMode: action.infomation.subClassMode };
            temp[action.token] = {
                ...state.views[action.token],
                loading: false,
                infomationModel: action.infomation,
                classObj: temClassObj,
                controlerProperty: setupController(temClassObj,
                    state.views[action.token].isRecursive,
                    !!action.infomation[ModelProperty.closedDate]),
            };
            return { ...state, views: { ...state.views, ...temp } };
        // case Action.GET_CLASS_INFO_SUCCESS:
        //     temp[action.token] = { ...state.views[action.token], loading: false, };
        //     return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_STAGE_REACHED_VALUES_FOR_INVCLASS:
            temp[action.token] = { ...state.views[action.token], loading: true };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_STAGE_REACHED_VALUES_FOR_INVCLASS_SUCCESS:
            temp[action.token] = { ...state.views[action.token], loading: false, stageReachedList: setDropDownList(action.list, 4) };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_STAGE_REACHED_VALUES_FOR_INVCLASS_FAIL:
            temp[action.token] = { ...state.views[action.token], loading: false, };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_MATTER_TYPE_VALUES_FOR_INV_CLASS_SUCCESS:
            return { ...state, matterType: setDropDownList(action.list, 2) };
        case Action.GET_OUT_COME_CODE_VALUES_SUCCESS:
            return { ...state, outComeCode: setDropDownList(action.list, 4) };
        case Action.CHANGE_MODEL:
            temp[action.token] = {
                ...state.views[action.token],
                infomationModel: changeModel(state.views[action.token].infomationModel, action.event)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.SAVE:
            temp[action.token] = {
                ...state.views[action.token],
                loading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.SAVE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.SAVE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_INV_CLASS_TOTALS_SUMMARY:
            temp[action.token] = {
                ...state.views[action.token],
                loading: true

            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_INV_CLASS_TOTALS_SUMMARY_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                totalSummery: action.data,
                loading: false

            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_INV_CLASS_TOTALS_SUMMARY_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_INV_CLASS_CURRENT_TOTALS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_INV_CLASS_CURRENT_TOTALS_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_INV_CLASS_CURRENT_TOTALS_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_POLICE_STATION_INFO_BY_ID:
            temp[action.token] = {
                ...state.views[action.token],
                loading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_POLICE_STATION_INFO_BY_ID_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.GET_POLICE_STATION_INFO_BY_ID_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.CHECK_CLOSE_CLASS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.CHECK_CLOSE_CLASS_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                controlerProperty: setupController(state.views[action.token].classObj,
                    state.views[action.token].isRecursive, true, true),
                loading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.CHECK_CLOSE_CLASS_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.REOPEN_CLASS:
            temp[action.token] = {
                ...state.views[action.token],
                controlerProperty: setupController(state.views[action.token].classObj,
                    state.views[action.token].isRecursive, false, true),
                loading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Action.VALIDATION_MESSAGE:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        default:
            return state;
    }

    function initialTokenizeState(input: CCInvestigationInfoInput): Infomation {
        return {
            loading: false,
            classObj: input.classObj,
            fileId: input.fileId,
            appId: input.appId,
            controlerProperty: setupController(input.classObj, input.isRecursiveFormDisplay, false),
            infomationModel: null,
            stageReachedList: [],
            totalSummery: null,
            isRecursive: input.isRecursiveFormDisplay,
            ufn: input.ufn
        };
    }

}

function getCrimeClassViewModel(infoState): CrimeClassIdentityViewModel {
    return {
        fileId: infoState.fileId,
        branchId: infoState.classObj.branchid,
        classId: infoState.classObj.rectype,
        isRecursiveFormDisplay: infoState.isRecursive,
    };
}

function setupController(classObj: ClassObj, isRecursiveFormDisplay: boolean, isClassClose: boolean, changeClose?: boolean):
    ControlerProperty {
    const tem = {};
    tem[Controls.btnSave] = {
        enabled: changeClose ? true : !isClassClose,
        visible: true
    };
    tem[Controls.btnAdvoAssi] = {
        enabled: true,
        visible: (classObj.subClassMode === 3 && !isRecursiveFormDisplay)
    };
    tem[Controls.dtpCloseDate] = {
        enabled: true,
        visible: isClassClose ? true : false
    };
    tem[Controls.dtpBillDate] = {
        enabled: true,
        visible: isClassClose ? true : false
    };
    return tem;
}

function changeModel(model: InvestigationClassInfo, event: { key: ModelProperty, value: any }): InvestigationClassInfo {
    const temp = {};
    temp[event.key] = event.value;
    return { ...model, ...temp };
}

function setDropDownList(list: string[], lengthOfKey: number): DropDownItem[] {
    const temp: DropDownItem[] = [];
    if (list && list.length > 0) {
        list.forEach(i => temp.push({ key: (i.substr(0, lengthOfKey)).trim(), value: (i.substr(lengthOfKey + 1, i.length).trim()) }));
    }
    return temp;
}


const getState = (state: State) => state;
export const getViews = (state: State) => state.views;
export const getStateByToken = (token) => createSelector(getViews, (views) => views[token]);
export const getIsLoadingByToken = (token) => createSelector(getStateByToken(token), infoState => infoState ? infoState.loading : false);

export const getUIControllerProperty = (token) => createSelector(getStateByToken(token), infoState => {
    return infoState.controlerProperty;
});
export const getInformationModel = (token) => createSelector(getStateByToken(token), infoState =>
    infoState ? infoState.infomationModel : null);
export const getStageReachedList = (token) => createSelector(getStateByToken(token), infoState =>
    infoState ? infoState.stageReachedList : []);
export const getMatterTypeList = (state: State) => state.matterType;
export const getOutComeCodeList = (state: State) => state.outComeCode;
export const getTotalSummeryRequestModel = (token) => createSelector(getStateByToken(token), infoState => {
    const request: InvClassTotalsReqViewModel = {
        CrimeClassIdentityViewModel: getCrimeClassViewModel(infoState),
        ClosedDate: infoState.infomationModel[ModelProperty.closedDate],
        CDSDirectTAFChecked: infoState.infomationModel[ModelProperty.cdsDirectTAFChecked],
        DoNotClaimVATChecked: infoState.infomationModel[ModelProperty.doNotClaimVATChecked],

    };
    return request;
});
export const getTotalsummery = (token) => createSelector(getStateByToken(token), infoState => infoState.totalSummery);
export const getCurrentTotalReqViewModel = (token) => createSelector(getStateByToken(token), infoState => {
    const request: InvClassCurrentTotalsReqViewModel = {
        CrimeClassIdentityViewModel: getCrimeClassViewModel(infoState),
        ClosedDate: infoState.infomationModel[ModelProperty.closedDate],
        CDSDirectTAFChecked: infoState.infomationModel[ModelProperty.cdsDirectTAFChecked],
        SchemeId: infoState.infomationModel[ModelProperty.schemeId],
        DoNotClaimVATChecked: infoState.infomationModel[ModelProperty.doNotClaimVATChecked],
        IsRecursiveFormDisplay: infoState.isRecursive
    };
    return request;
});
export const getClassClosingReqViewModel = (token) => createSelector(getStateByToken(token), infoState => {
    const request: ClassClosingReqViewModel = {
        CrimeClassIdentityViewModel: getCrimeClassViewModel(infoState),
        StageReached: infoState.infomationModel[ModelProperty.stageReached],
        SubClassMode: infoState.infomationModel[ModelProperty.subClassMode],
        NonFixedStageReached: infoState.infomationModel[ModelProperty.nonFixedStageReached],
        PoliceStId: infoState.infomationModel[ModelProperty.policeStId],
        OutcomeCode: infoState.infomationModel[ModelProperty.outcomeCode],
        MatterType: infoState.infomationModel[ModelProperty.matterType],
        AdditionalFixedFee: infoState.infomationModel[ModelProperty.additionalFixedFee],
        DSCCRef: infoState.infomationModel[ModelProperty.dsccRef],
    };
    return request;
});
export const getPopupOpeningData = token => createSelector(getStateByToken(token), infoState => {
    const input: CCInvestigationInfoInput = {
        appId: infoState.appId,
        fileId: infoState.fileId,
        classObj: infoState.classObj,
        ufn: infoState.ufn,
        isRecursiveFormDisplay: true,
    };
    return input;
});
export const getTotalForDisplayPurpose = token => createSelector(getStateByToken(token), infoState => {
    const view = new TotalViewDisplayModel();
    if (infoState.infomationModel) {
        const fixedModel = infoState.infomationModel.invClassCurrentTotalsViewModel.classCurrentTotalsFixedViewModel;
        const nonFixedModel = infoState.infomationModel.invClassCurrentTotalsViewModel.classCurrentTotalsNonFixedViewModel;
        if (infoState.isRecursive) {
            view.profitCost = nonFixedModel.profitCost;
            view.travel = nonFixedModel.travel;
            view.waiting = nonFixedModel.waiting;
            view.claimProfitCost = nonFixedModel.claimProfitCost;
            view.claimTravel = nonFixedModel.claimTravel;
            view.claimWaiting = nonFixedModel.claimWaiting;
            view.claimDisbursements = nonFixedModel.claimDisbursements;
            view.disbursements = nonFixedModel.disbursements;
            view.profitCost = nonFixedModel.profitCost;
            view.feeEarnerTotal = nonFixedModel.feeEarnerTotal;
        } else {
            if (infoState.classObj.subClassMode === 2) {
                view.profitCost = nonFixedModel.profitCost;
                view.travel = nonFixedModel.travel;
                view.waiting = nonFixedModel.waiting;
                view.claimProfitCost = nonFixedModel.claimProfitCost;
                view.claimTravel = nonFixedModel.claimTravel;
                view.claimWaiting = nonFixedModel.claimWaiting;
                view.feeEarnerTotal = nonFixedModel.feeEarnerTotal;
            } else {
                view.profitCost = fixedModel.profitCost;
                view.travel = fixedModel.travel;
                view.waiting = fixedModel.waiting;
                view.claimProfitCost = fixedModel.claimProfitCost;
                view.claimTravel = fixedModel.claimTravel;
                view.claimWaiting = fixedModel.claimWaiting;
                view.feeEarnerTotal = fixedModel.feeEarnerTotal;
            }
            view.disbursements = fixedModel.disbursements;
            view.claimDisbursements = fixedModel.claimDisbursements;
            // view.profitCost = fixedModel.profitCost;
        }
        if (!infoState.isRecursive && infoState.classObj.subClassMode !== 2) {
            view.fixedFee = fixedModel.fixedFee;
            view.fixedFeeColor = 'DarkRed';
            view.escapeAmount = fixedModel.escapeAmount;
            view.escapeAmountColor = 'BlueViolet';
            view.additionalFixFee = fixedModel.additionalFixFee;
            view.additionalFixFeeColor = 'Chocolate';
            view.additionalWorkFee = fixedModel.additionalWorkFee;
            view.additionalWorkFeeColor = 'OrangeRed';
        } else {
            view.fixedFee = null;
            view.fixedFeeColor = 'Black';
            view.escapeAmount = null;
            view.escapeAmountColor = 'Black';
            view.additionalFixFee = null;
            view.additionalFixFeeColor = 'Black';
            view.additionalWorkFee = null;
            view.additionalWorkFeeColor = 'Black';
        }
    }
    return view;
});

export const getIsRecursiveForm = token => createSelector(getStateByToken(token), infoState => infoState ? infoState.isRecursive : false);
export const getUFNValue = token => createSelector(getStateByToken(token), infoState => infoState ? infoState.ufn : null);
