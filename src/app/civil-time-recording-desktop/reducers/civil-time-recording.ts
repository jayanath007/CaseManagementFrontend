import { filter } from 'rxjs/operators';

import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { CivilClassObj } from '../../civil-class-management';
import { CivilTimeRecordingModuleInput, civilTimeTotal, Rates, TimeRecordModel, ViewData } from '../model/interfaces';
import { RateType } from '../model/enum';

export interface State {
    readonly views: { [token: string]: CivilTimeRecordingState };
    readonly rates: { [key: string]: Rates[] };
}


export interface CivilTimeRecordingState {
    readonly loading: boolean;
    readonly loadingRate: boolean;
    readonly civilClassInfo: CivilClassObj;
    readonly viewData: ViewData;
    readonly model: TimeRecordModel;
    readonly isDirty: boolean;
}
export const intialState: State = { views: {}, rates: {} };

export function reducer(state: State = intialState, action: Actions.Any): State {
    const temp = {};
    switch (action.type) {
        case Actions.INIT_MODULE:
            temp[action.token] = getInitView(action.payload.inputData);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_INIT_DATA:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_INIT_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false,
                viewData: {
                    ...action.info,
                    legalAidJudge: [
                        { id: 0, value: 'N/A' },
                        { id: 1, value: 'Judge of high court or Court of Protection, Section 9/Deputy Judge of the High' },
                        { id: 2, value: 'District Judge, Circuit Judge, Costs Judge (County Court)' },
                        { id: 3, value: 'Assistant of justices clerk, Justices Clerk, Lay Justice (Family Proceeding Court)' }
                    ],
                    civilTimeRecordData: {
                        ...action.info.civilTimeRecordData,
                        pageInfo: {
                            currentPage: 0,
                            itemPerPage: 50,
                        }
                    }
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_INIT_DATA_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CIVIL_TIME_RECODE_INFO:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CIVIL_TIME_RECODE_INFO_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false,
                model: calculateTotals(action.timeRecordModal)
            };
            if (action.openWithEditItem) {
                temp[action.token] = { ...temp[action.token], civilClassInfo: setCivilClassInfo(action.timeRecordModal, state.views[action.token].civilClassInfo) }
            }
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CIVIL_TIME_RECODE_INFO_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_MODEL:
            if (action.payload.key === 'dateDone' && action.payload.value) {
                action.payload.value = new Date().toDpsString(true, true);
            }
            const tempModel = {};
            tempModel[action.payload.key] = action.payload.value;
            temp[action.token] = {
                ...state.views[action.token],
                model: { ...state.views[action.token].model, ...tempModel }, isDirty: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_RATE:
            temp[action.token] = { ...state.views[action.token], loadingRate: true };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_RATE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token], loadingRate: false,
                model: mapRates(state.views[action.token].model, action.rates)
            };
            const newRates = {};
            newRates[createRateKey(state.views[action.token])] = action.rates;
            return { ...state, views: { ...state.views, ...temp }, rates: { ...state.rates, ...newRates } };
        case Actions.CALCULATE:
            const mpu = state.views[action.token].viewData ? state.views[action.token].viewData.mpu : 0;
            temp[action.token] = {
                ...state.views[action.token],
                model: valueCalculation(state.views[action.token].model, mpu)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_TIME_RECORD:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_TIME_RECORD_SUCCESS:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SAVE_TIME_RECORD_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SHOW_MESSAGE:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.DELETE_TIME_RECORD:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.DELETE_TIME_RECORD_SUCCESS:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.DELETE_TIME_RECORD_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.NEW_TIME_RECORD:
            temp[action.token] = {
                ...state.views[action.token],
                model: emptyModel(state.views[action.token].civilClassInfo),
                isDirty: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_TIME_RECORD_PAGE:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false,
                viewData: {
                    ...state.views[action.token].viewData,
                    civilTimeRecordData: {
                        ...state.views[action.token].viewData.civilTimeRecordData,
                        pageInfo: action.pageDef
                    }
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_TIME_RECORD_HISTORY:
            temp[action.token] = changeLoadingState(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_TIME_RECORD_HISTORY_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false,
                viewData: {
                    ...state.views[action.token].viewData,
                    civilTimeRecordData: {
                        ...state.views[action.token].viewData.civilTimeRecordData,
                        timeRecords: action.data.timeRecords,
                        totalCount: action.data.totalCount
                    }
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_TIME_RECORD_HISTORY_FAIL:
            temp[action.token] = changeLoadingState(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...temp } };
        default:
            return state;
    }
}

function getInitView(input: CivilTimeRecordingModuleInput): CivilTimeRecordingState {
    return {
        loading: false,
        civilClassInfo: input.civilClassObj,
        viewData: null,
        model: emptyModel(input.civilClassObj),
        isDirty: false,
        loadingRate: false
    };
}

function emptyModel(civilClassObj: CivilClassObj): TimeRecordModel {
    const model: TimeRecordModel = {
        advocacyRate: 0,
        advocacyUnit: 0,
        advocacyValue: 0,
        appId: 0,
        attendanceRate: 0,
        attendanceUnit: 0,
        attendanceValue: 0,
        branchId: 0,
        claimCode: 'DOT',
        classType: 0,
        conferenceRate: 0,
        conferenceUnit: 0,
        conferenceValue: 0,
        dateDone: new Date().toDpsString(true, true),
        detail: null,
        diaryId: 0,
        faresIcludingRate: 0,
        faresIcludingVat: 0,
        faresIcludingVatNet: 0,
        faresVatExempt: 0,
        feeEarner: null,
        fileId: civilClassObj.fileId,
        fundLevelDiscription: null,
        judgeLevel: 0,
        legalAidCaseId: 0,
        level: 0,
        mileageRate: 0,
        mileageUnit: 0,
        mileageValue: 0,
        note: null,
        parkingFees: 0,
        preparationRate: 0,
        preparationUnit: 0,
        preparationValue: 0,
        tickIfEstimated: false,
        totalValue: 0,
        travelRate: 0,
        travelUnit: 0,
        travelValue: 0,
        waitingRate: 0,
        waitingUnit: 0,
        waitingValue: 0,
    };
    if (civilClassObj) {
        return {
            ...model,
            appId: civilClassObj.appId,
            branchId: civilClassObj.branchId,
            classType: civilClassObj.classType,
            feeEarner: civilClassObj.feeEarner,
            legalAidCaseId: civilClassObj.legalAidCaseId
        }
    }
    return model;

}

function changeLoadingState(state: CivilTimeRecordingState, isLoading: boolean): CivilTimeRecordingState {
    return {
        ...state,
        loading: isLoading
    };
}

function mapRates(model: TimeRecordModel, rates: Rates[]): TimeRecordModel {
    if (!rates || rates.length <= 0) {
        return model;
    }
    return {
        ...model,
        travelRate: getRate(rates.find(i => i.rateType === RateType.Travel)),
        faresIcludingRate: getRate(rates.find(i => i.rateType === RateType.FaresIncVAT)),
        attendanceRate: getRate(rates.find(i => i.rateType === RateType.Advice)),
        preparationRate: getRate(rates.find(i => i.rateType === RateType.Advice)),
        advocacyRate: getRate(rates.find(i => i.rateType === RateType.Advocacy)),
        conferenceRate: getRate(rates.find(i => i.rateType === RateType.Counsel)),
        mileageRate: getRate(rates.find(i => i.rateType === RateType.Milage)),
        waitingRate: getRate(rates.find(i => i.rateType === RateType.Travel)),
    };
}
function getRate(rate: Rates) {
    if (!!rate) {
        return rate.value;
    } else {
        return 0;
    }
}

function valueCalculation(model: TimeRecordModel, mpu: number): TimeRecordModel {
    const newModel = {
        ...model,
        attendanceValue: multipicationRateAndUnits(model.attendanceRate, model.attendanceUnit, mpu),
        preparationValue: multipicationRateAndUnits(model.preparationRate, model.preparationUnit, mpu),
        travelValue: multipicationRateAndUnits(model.travelRate, model.travelUnit, mpu),
        waitingValue: multipicationRateAndUnits(model.waitingRate, model.waitingUnit, mpu),
        conferenceValue: multipicationRateAndUnits(model.conferenceRate, model.conferenceUnit, mpu),
        advocacyValue: multipicationRateAndUnits(model.advocacyRate, model.advocacyUnit, mpu),
        mileageValue: model.mileageRate * model.mileageUnit,
        faresIcludingVatNet: model.faresIcludingVat * (100 / (100 + model.faresIcludingRate))
    };
    return calculateTotals(newModel);
}

function multipicationRateAndUnits(rate, unit, mpu: number): number {
    let unitRate = 0;
    if (rate && unit) {
        rate = Number(rate);
        unit = Number(unit);
        if (mpu > 0) {
            const minuteRate = rate / 60;
            unitRate = minuteRate * mpu;
        }
        // return Number((unit * unitRate).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
        return Number((unit * unitRate).toFixed(2));
    }
    return 0;
}

function createRateKey(view: CivilTimeRecordingState): string {
    let key = `${view.civilClassInfo.className}-${view.civilClassInfo.className}`;
    key = `${key}-${view.civilClassInfo.appId}-${view.civilClassInfo.fileId}-${view.civilClassInfo.branchId}`;
    key = `${key}-${view.model.level}-${view.model.judgeLevel}`;
    if (view.model.dateDone && new Date(view.model.dateDone)) {
        key = `${key}-${new Date(view.model.dateDone).toDpsString(true)}`;
    }
    return key;
}

function calculateTotals(model: TimeRecordModel): TimeRecordModel {
    const totalTimeValue = civilTimeTotal(model);
    const totalDisbsValue = Number(model.mileageValue) + Number(model.faresVatExempt) + Number(model.faresIcludingVatNet) + Number(model.parkingFees);
    return {
        ...model,
        totalValue: totalTimeValue + totalDisbsValue
    };
}

function setCivilClassInfo(model: TimeRecordModel, civilClassObj: CivilClassObj): CivilClassObj {
    return {
        ...civilClassObj,
        appId: model.appId,
        branchId: model.branchId,
        classType: model.classType,
        feeEarner: model.feeEarner,
        legalAidCaseId: model.legalAidCaseId
    };
}

export const getState = (state: State) => state;
export const getViews = (state: State) => state.views;
export const getViewByToken = (token) => createSelector(getViews, (views) => views[token]);
export const getIsLoading = (token) => createSelector(getViewByToken(token), (state) => state.loading || state.loadingRate);
export const getCivilClassInfo = (token) => createSelector(getViewByToken(token), (state) => state.civilClassInfo);
export const getCivilClassViewData = (token) => createSelector(getViewByToken(token), (state) => state.viewData);
export const getCivilClassModelData = (token) => createSelector(getViewByToken(token), (state) => state.model);
export const getRateFromCache = (token) => createSelector(getState, (state) => {
    const rateKey: string = createRateKey(state.views[token]);
    return state.rates[rateKey];
});
export const isDirty = (token) => createSelector(getViewByToken(token), (state) => state.isDirty);




