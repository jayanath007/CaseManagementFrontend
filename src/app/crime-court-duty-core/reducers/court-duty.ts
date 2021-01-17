import { DateTimeUtil } from './../../time-information-core/class/util/DateTimeUtil';
import * as Actions from './../actions/court-duty';
import { CourtDutyTimeRecord, GridDataFilter, MatterInfor } from '../model/interface';
import { createSelector } from '@ngrx/store';
import { RateResponce } from '../../time-information-core';
import { getRateForDate } from '../../core/lib/crime-managment';
import { RatesKey } from '../../time-information-core/models/enum';
import { PaginatorDef } from '../../core/lib/grid-model';
import { courtDutyTotal } from '../function/total';

export interface State {
    readonly [token: string]: CourtDutyState;
}

interface CourtDutyState {
    loading: false;
    loadingHistory: false;
    model: CourtDutyTimeRecord;
    dirty: boolean;
    rates: RateResponce;
    recordsHistory: CourtDutyTimeRecord[];
    gridDataFilter: GridDataFilter;
    gridDataPaginatorDef: PaginatorDef;
    matterInfor: MatterInfor;
}
const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const temp = {};
    switch (action.type) {
        case Actions.INIT_CRIME_COURT_DUTY:
            temp[action.token] = {
                ...state[action.token],
                model: emptyModel(null, action.payload.matterKeyInfor),
                gridDataFilter: {
                    fromData: null,
                    toDate: null
                },
                gridDataPaginatorDef: {
                    currentPage: 0,
                    itemPerPage: 10,
                },
                matterInfor: {
                    appId: action.payload.matterKeyInfor.appId,
                    fileId: action.payload.matterKeyInfor.fileId,
                    branchId: action.payload.matterKeyInfor.branchId,
                    matterReferenceNo: action.payload.matterKeyInfor.matterReferenceNo,
                }

            };
            return { ...state, ...temp };
        case Actions.CHANGE_MODEL:
            const tempModel = {};
            tempModel[action.payload.key] = action.payload.value;
            const dirty = action.changeBySystem ? state[action.token].dirty : true;
            temp[action.token] = { ...state[action.token], model: { ...state[action.token].model, ...tempModel }, dirty: dirty };
            return { ...state, ...temp };
        case Actions.CLEAR_MODEL:
            temp[action.token] = {
                ...state[action.token],
                model: emptyModel(state[action.token].model, state[action.token].matterInfor), dirty: false
            };
            return { ...state, ...temp };
        case Actions.GET_CRIME_RATE_FILES:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.GET_CRIME_RATE_FILES_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                rates: action.payload.ratesDataSource
            };
            return { ...state, ...temp };
        case Actions.GET_CRIME_RATE_FILES_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.UPDATE_RATE:
            temp[action.token] = { ...state[action.token], model: mapRates(state[action.token].model, state[action.token].rates) };
            return { ...state, ...temp };
        case Actions.VALUES_CALCULATON:
            temp[action.token] = { ...state[action.token], model: valuesCalculaton(state[action.token].model) };
            return { ...state, ...temp };
        case Actions.SAVE:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.SHOW_MESSAGE:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.SAVE_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.SAVE_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.GET_TIME_RECORDS:
            temp[action.token] = { ...state[action.token], loadingHistory: true, recordsHistory: [] };
            return { ...state, ...temp };
        case Actions.GET_TIME_RECORDS_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loadingHistory: false,
                recordsHistory: orderRecordByTimeId(action.records.courtDutyTimeRecords),
                gridDataPaginatorDef: {
                    ...state[action.token].gridDataPaginatorDef,
                    total: action.records.totalCount
                }
            };
            return { ...state, ...temp };
        case Actions.GET_TIME_RECORDS_FAIL:
            temp[action.token] = { ...state[action.token], loadingHistory: false, recordsHistory: [] };
            return { ...state, ...temp };
        case Actions.EDIT_ITEM:
            temp[action.token] = { ...state[action.token], model: action.model, dirty: false };
            return { ...state, ...temp };
        case Actions.DELETE:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.DELETE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                model: emptyModel(state[action.token].model, state[action.token].matterInfor)
            };
            return { ...state, ...temp };
        case Actions.DELETE_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.CHANGE_PAGE:
            const newDef = { ...state[action.token].gridDataPaginatorDef, ...action.def };
            temp[action.token] = { ...state[action.token], gridDataPaginatorDef: newDef };
            return { ...state, ...temp };
        case Actions.CHANGE_GRID_FILTER:
            const newFilter = {};
            newFilter[action.payload.key] = action.payload.value;
            temp[action.token] = { ...state[action.token], gridDataFilter: { ...state[action.token].gridDataFilter, ...newFilter } };
            return { ...state, ...temp };
        case Actions.PRINT_DOC:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.PRINT_DOC_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.PRINT_DOC_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        default: return state;
    }
}

function emptyModel(model: CourtDutyTimeRecord, matterInfor: MatterInfor): CourtDutyTimeRecord {
    const newModel = {
        branchId: 0,
        timId: 0,
        timDate: new Date().toDpsString(true),
        feeEarner: null,
        locationId: null,
        locationName: null,
        isLonRates: true,
        isYouth: false,
        nextHearDate: new Date().toDpsString(true),
        travelHrsMin: null,
        travelRate: '0.00',
        travelVal: 0.00,
        socialTimeHrsMin: null,
        socialTimeRate: '0.00',
        socialTimeVal: 0.00,
        unSocialTimeHrsMin: null,
        unSocialTimeRate: '0.00',
        unSocialTimeVal: 0.00,
        mileage: '0',
        mileageRate: '0.00',
        mileageValue: '0.00',
        vatFares: '0.00',
        nonVATFares: '0.00',
        parking: '0.00',
        totalValue: '0.00',
        feMin: 0,
        doNotClaimTravel: false,
        note: '',
        matterInfor: {
            appId: matterInfor ? matterInfor.appId : 0,
            fileId: matterInfor ? matterInfor.fileId : 0,
            branchId: matterInfor ? matterInfor.branchId : 0,
            matterReferenceNo: matterInfor ? matterInfor.matterReferenceNo : '',
        }
    };

    if (model) {
        return {
            ...newModel,
            branchId: model ? model.branchId : 0,
            feeEarner: model ? model.feeEarner : null,
        };
    }
    return newModel;
}
// function setGridDataColum(courtDutyTimeRecords: CourtDutyData) {

//     if (view && view.model) {
//         const temp = {};
//         temp[property] = value;
//         return { ...view, model: { ...view.model, client: { ...view.model.client, ...temp } } };
//     }
//     return view;

// }

function mapRates(model: CourtDutyTimeRecord, rateSource: RateResponce): CourtDutyTimeRecord {
    if (model && rateSource) {
        const attendanceTypekey = model.isLonRates ? 'Lon' : 'Non-Lon';
        const rates = getRateForDate(rateSource, model.timDate, attendanceTypekey);
        if (rates) {
            return {
                ...model,
                socialTimeRate: Number(rates[RatesKey.ATTENDANCE]).toFixed(2).toString().trim(),
                unSocialTimeRate: Number(rates[RatesKey.ATTENDANCEUS]).toFixed(2).toString().trim(),
                mileageRate: Number(rates['MILEAGE']).toFixed(2).toString().trim(),
                travelRate: Number(rates[RatesKey.TRAVELLING]).toFixed(2).toString().trim(),
            };
        } else {
            return {
                ...model,
                socialTimeRate: '0.00',
                unSocialTimeRate: '0.00',
                mileageRate: '0.00',
                travelRate: '0.00',
            };
        }
    }
    return model;
}

function valuesCalculaton(model: CourtDutyTimeRecord): CourtDutyTimeRecord {
    const tempModel = {
        ...model,
        socialTimeVal: timeMultiplyByRates(model.socialTimeHrsMin, model.socialTimeRate),
        unSocialTimeVal: timeMultiplyByRates(model.unSocialTimeHrsMin, model.unSocialTimeRate),
        travelVal: timeMultiplyByRates(model.travelHrsMin, model.travelRate),
        mileageValue: convertCurancy((convertToNumber(model.mileage) * convertToNumber(model.mileageRate)))
    };
    return calculateTotal(tempModel);
}

function calculateTotal(model: CourtDutyTimeRecord): CourtDutyTimeRecord {
    // const totalValue = convertToNumber(model.socialTimeVal) + convertToNumber(model.unSocialTimeVal) +
    //     convertToNumber(model.travelVal) + convertToNumber(model.mileageValue) + convertToNumber(model.vatFares) +
    //     convertToNumber(model.nonVATFares) + convertToNumber(model.parking);
    return { ...model, totalValue: convertCurancy(courtDutyTotal(model)) };
}

function timeMultiplyByRates(hrsMin: string, rate: string) {
    const time = DateTimeUtil.extractTimeFromHHMMString(hrsMin);
    const hrs = !!time ? time.hrs + time.min / 60 : 0;
    const value = convertCurancy(hrs * convertToNumber(rate));
    return value;
}

function convertCurancy(value) {
    const newValue = (Math.round(convertToNumber(value) * 100) / 100).toFixed(2);
    return newValue;
}

function convertToNumber(value): number {
    const newValue = ((value !== null && value !== '') && !isNaN(Number(value.toString()))) ? parseFloat(value) : 0;
    return newValue;
}

function orderRecordByTimeId(records: CourtDutyTimeRecord[]): CourtDutyTimeRecord[] {
    if (records && records.length > 0) {
        return records.sort(i => i.timId).reverse();
    }
    return [];
}


export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (state) => state[token]);
export const getIsLoadingByToken = (token) => createSelector(getStateByToken(token), state => state ? state.loading : false);
export const getModel = (token) => createSelector(getStateByToken(token), state => state ? state.model : null);
export const isDirty = (token) => createSelector(getStateByToken(token), state => state ? state.dirty : false);
export const getRecordHistory = (token) => createSelector(getStateByToken(token), state =>
    state && state.recordsHistory ? state.recordsHistory : []);
export const getIsLoadinghistoryByToken = (token) => createSelector(getStateByToken(token), state => state ? state.loadingHistory : false);
export const gridDataPaginatorDef = (token) => createSelector(getStateByToken(token), state => state ? state.gridDataPaginatorDef : null);
export const gridDataFilter = (token) => createSelector(getStateByToken(token), state => state ? state.gridDataFilter : null);
