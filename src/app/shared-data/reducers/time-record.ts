import {
    CrimeManagementInput, TimeInformationInputData, CrimeTimeSettings,
    storeCrimeTimeDataKey, ClassListRequest
} from './../../core/lib/crime-managment';
import { TimeRecordInputData } from './../../time-recording-core/models/interfaces';
import { ClassObj } from './../../crime-management-core/models/interfaces';
import { OpenTimeValidation, AddTimeType } from './../../core/lib/timeRecord';
import * as Actions from '../actions/time-record';
import { createSelector } from '@ngrx/store';

export interface State {
    readonly openinTimeRecordData: OpenTimeValidation;
    readonly TimeType: AddTimeType;
    readonly CrimeClassList: ClassObj[];
    readonly token: string;
    readonly setting: { [key: string]: CrimeTimeSettings };
}

const initialstate: Readonly<State> = Object.freeze<State>({
    openinTimeRecordData: null,
    TimeType: AddTimeType.GenaralTime,
    CrimeClassList: [],
    token: '',
    setting: null
});

export function reducer(state: Readonly<State> = initialstate, action: Actions.Any): Readonly<State> {
    switch (action.type) {
        case Actions.OPEN_TIME_RECORD_POPUP_REQUEST:
            return { ...state, openinTimeRecordData: action.data, token: action.token };
        case Actions.GET_TIME_RECORD_TYPE:
            return { ...state, TimeType: action.timeType };
        case Actions.GET_CRIME_CLASS_LIST_SUCCESS:
            return { ...state, CrimeClassList: action.payload.list };
        case Actions.CRIME_TIME_LOADING_SETTINGS_SUCCESS:
            const temp = {};
            temp[storeCrimeTimeDataKey(action.classModal)] = action.settings;
            return { ...state, setting: temp };
        default: {
            return state;
        }
    }
}

export const getTimeRecordOpeningData = (state: State) => state.openinTimeRecordData;
export const getGenaralTimeRecordInput = (state: State) => {
    let input: TimeRecordInputData;
    if (!!state.openinTimeRecordData) {
        input = {
            matterReferenceNo: state.openinTimeRecordData.matterRef,
            feeEarner: state.openinTimeRecordData.timeFeeEarner,
            eBilling: state.openinTimeRecordData.eBilling,
            canMinimize: state.openinTimeRecordData.canMinimize,
            clientMatterData: {
                matterDetails: state.openinTimeRecordData.matterDetails,
                clientName: state.openinTimeRecordData.clientName
            }
        };
    } else {
        input = {
            matterReferenceNo: null,
            feeEarner: null,
            eBilling: null,
            canMinimize: true,
        };
    }
    return input;
};

export const getCrimeClassRequestModel = (state: State) => {
    return new ClassListRequest(
        state.openinTimeRecordData.branchId,
        state.openinTimeRecordData.appId,
        state.openinTimeRecordData.fileId,
        ''
    );
};

export const getCrimeManagerPopupInput = (state: State) => {
    const input: CrimeManagementInput = {
        matterReferenceNo: state.openinTimeRecordData.matterRef,
        branchId: state.openinTimeRecordData.branchId,
        appId: state.openinTimeRecordData.appId,
        fileId: state.openinTimeRecordData.fileId,
        ufnValue: state.openinTimeRecordData.ufnValue,
        classList: state.CrimeClassList
    };
    return input;
};

export const getTimeInformationInput = (state: State) => {
    const enableClassList = state.CrimeClassList ? state.CrimeClassList.filter(i => (i.rectype === 3 || i.rectype === 4 ||
        (i.rectype >= 100 && i.rectype <= 119))) : [];
    const classId = enableClassList && enableClassList ? state.CrimeClassList[0].rectype : 0;
    const input: TimeInformationInputData = {
        matterReferenceNo: state.openinTimeRecordData.matterRef,
        branchId: state.openinTimeRecordData.branchId,
        fileId: state.openinTimeRecordData.fileId,
        appId: state.openinTimeRecordData.appId,
        classId: classId,
        isEdit: false,
        crimeTimeId: 0,
        ufnDate: state.openinTimeRecordData.ufnValue,
        classList: enableClassList
    };
    return input;
};

export const getSettings = (state: State) => state ? state.setting : null;

export const getSettingsByKey = (key) => createSelector(getSettings,
    (setting) => setting ? setting[key] : null);

export const getCivilTimePopupInput = (state: State) => {
    return {
        appId: state.openinTimeRecordData.appId,
        branchId: state.openinTimeRecordData.branchId,
        fileId: state.openinTimeRecordData.fileId,
    };
};
