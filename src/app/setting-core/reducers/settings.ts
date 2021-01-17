import * as Actions from '../actions/core';
import { PosingPeriod } from '../models/interface';
import { createSelector } from '@ngrx/store';
import { TimeZoneInformation } from '../../core/lib/microsoft-graph';
export interface State {
    readonly loadingSetting: boolean;
    readonly homeCurrencyLoading: boolean;
    readonly homeCurrency: string;
    readonly timeZonesLoading: boolean;
    readonly timeZones: TimeZoneInformation[];
    readonly isCurrentUser: boolean;
    readonly TimeUseFeeEarnerGradesValueDisable: boolean;
    readonly selectedPostingPeriod: PosingPeriod;
    // readonly globalSignatureTemp: string;
}
const initialState: State = {
    loadingSetting: false,
    homeCurrencyLoading: false,
    timeZonesLoading: false,
    isCurrentUser: false,
    homeCurrency: '',
    timeZones: [],
    TimeUseFeeEarnerGradesValueDisable: true,
    selectedPostingPeriod: null,
    // globalSignatureTemp: ''
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_SETTING_CORE:
            return { ...state, loadingSetting: true };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, loadingSetting: true };
        case Actions.LOAD_HOME_CURRENCY:
            return { ...state, homeCurrencyLoading: true };
        case Actions.LOAD_TIME_ZONES_DATA:
            return { ...state, timeZonesLoading: true };
        case Actions.LOAD_HOME_CURRENCY_SUCCESS:
            return { ...state, homeCurrency: action.payload.homeCurrency, homeCurrencyLoading: false };
        case Actions.LOAD_TIME_ZONES_DATA_SUCCESS:
            return { ...state, timeZones: action.payload.timeZones, timeZonesLoading: false };
        case Actions.CHECK_DIARY_MODE_CURRENT_USER_SUCCESS:
            return { ...state, isCurrentUser: action.payload.isLoginUser };
        case Actions.GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE_SUCCESS:
            return { ...state, TimeUseFeeEarnerGradesValueDisable: action.payload.TimeUseFeeEarnerGradesValueDisable };
        case Actions.SET_SELECTED_POSTING_PERIOD:
            return { ...state, selectedPostingPeriod: action.payload.selectedPostingPeriod };
        default:
            {
                return state;
            }
    }
}

// function createGlobalSignature(dpsSetting: State, templete: string): string {
//     if (templete && dpsSetting && dpsSetting.defaultEmployeUserData) {
//         const user = dpsSetting.defaultEmployeUserData;
//         return templete.replace(/{{Branch}}/g, !!user.branch ? user.branch : '')
//             .replace(/{{EmailAddress}}/g, !!user.userEmail ? user.userEmail : '')
//             .replace(/{{name}}/g, !!user.fullName ? user.fullName : '')
//             .replace(/{{TelephoneNumber}}/g, !!user.user_MobileNo ? user.user_MobileNo : '')
//             .replace(/{{JobTitle}}/g, !!user.title ? user.title : '');

//     } else {
//         return null;
//     }
// }

export const getView = (state: State) => state;
export const getHomeCurrency = () => createSelector(getView, (dpsSetting) => dpsSetting.homeCurrency);
export const getTimeZones = () => createSelector(getView, (dpsSetting) => dpsSetting.timeZones);
export const getDiaryModeCurrentUser = () => createSelector(getView, (dpsSetting) => dpsSetting.isCurrentUser);
export const getTimeUseFeeEarnerGradesValueDisable = () =>
    createSelector(getView, (dpsSetting) => dpsSetting.TimeUseFeeEarnerGradesValueDisable);
export const getPostingPeriod = () => createSelector(getView, (dpsSetting) => dpsSetting.selectedPostingPeriod);
// export const getGlobalSignatureForTemplete = (templete: string) => createSelector(getView, (dpsSetting) =>
//     createGlobalSignature(dpsSetting, templete));

// export const getGlobalSignatureTemp = () => createSelector(getView, (dpsSetting) => dpsSetting.globalSignatureTemp);
// export const getGlobalSignature = () => createSelector(getView, (dpsSetting) =>
//     createGlobalSignature(dpsSetting, dpsSetting.globalSignatureTemp));

