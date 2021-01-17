
import { BillingGuideViewModel } from '../models/interfaces';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';


export interface State {
    readonly [token: string]: BillingGuideState;

}


export interface BillingGuideState {

    readonly billingGuideViewModel: BillingGuideViewModel;
    readonly loading: boolean;
    readonly loadingData: boolean;
    readonly isDirty: boolean;
    readonly billedValueData: any;
    readonly billingGuideData: any;
    readonly billingGuideCloseSaveData: BillingGuideViewModel;
    readonly billingGuideSaveFile: boolean;
    readonly billingGuideNoFile: boolean;


}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {


        case Actions.INIT_BILLING_GUIDE:
            temp[action.token] = setInitialData(state[action.token], action.payload.inputValue);
            return { ...state, ...temp };

        case Actions.INIT_BILLING_GUIDE_SUCCESS:
            temp[action.token] = getInitViewDataSuccess(state[action.token], action.payload.data);
            return { ...state, ...temp };

        case Actions.BILLING_GUIDE_SUBMIT:
            temp[action.token] = setViewModelData(state[action.token], action.payload.inputData);
            return { ...state, ...temp };

        case Actions.BILLING_GUIDE_ANALYSIS_CHANGE:
            temp[action.token] = changeAnalysisChange(state[action.token], action.payload.selectedType);
            return { ...state, ...temp };

        case Actions.BILLING_GUIDE_SUBMIT_FAIL:
            temp[action.token] = {
                ...state[action.token],
                billingGuideNoFile: true
            };
            return { ...state, ...temp };

        case Actions.BILLING_GUIDE_SUBMIT_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                billingGuideNoFile: false
            };
            return { ...state, ...temp };



        // case Actions.BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_SUCCESS:
        //     temp[action.token] = {
        //         ...state[action.token],
        //         billingGuideSaveFile: true
        //     };
        //     return { ...state, ...temp };

        // case Actions.BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_FAIL:
        //     temp[action.token] = {
        //         ...state[action.token],
        //         billingGuideSaveFile: false
        //     };
        //     return { ...state, ...temp };


        default:
            {
                return state;
            }
    }
}
function setInitialData(state: BillingGuideState, inputData: any) {
    return {
        ...state,
        billingGuideData: inputData,
    };



}



function setViewModelData(state: BillingGuideState, inputData: BillingGuideViewModel) {
    return {
        ...state,


        billingGuideCloseSaveData: inputData,




    };
}

function changeAnalysisChange(state: BillingGuideState, selectedType: any) {
    return {
        ...state,
        billingGuideViewModel: {

            BillingGuideAnalysisType: selectedType,

        }


    };
}



function getInitViewDataSuccess(state: BillingGuideState, data: any) {
    return {
        ...state,
        billedValueData: data,

    };

}


// function setBillingGuideAnalysis(state: BillingGuideState, selectedType: BillingGuideAnalysisType) {

//     return {
//         ...state,
//         billingGuideViewMode: {
//             ...state.billingGuideViewModel,

//             if(selectedType === BillingGuideAnalysisType.BillingGuide) {

//         BillingGuideAnalysisType: selectedType,



//             } else {

//         BillingGuideAnalysisType: selectedType,
//             }
//     // ChkFeeEarner: true,
//     // ChkActivity: true,
//     // ChkHideZeroValues: true,
//     // ChkBillingSummaryReport: true,
//     // ChkIncludeDisbursement: true,

// }
//     };
// }







export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (views) => views[token]);
export const getBilledValueDataByToken = (token) => createSelector(getViewByToken(token), (billingGuideState) =>
    billingGuideState ? billingGuideState.billedValueData : null);
export const getBillingViewModaleDataByToken = (token) => createSelector(getViewByToken(token), (billingGuideState) =>
    billingGuideState ? billingGuideState.billingGuideData : null);
export const getBillingViewModaleCloseDataByToken = (token) => createSelector(getViewByToken(token), (billingGuideState) =>
    billingGuideState ? billingGuideState.billingGuideCloseSaveData : null);
export const getBillingbillingGuideNoFileByToken = (token) => createSelector(getViewByToken(token), (billingGuideState) =>
    billingGuideState ? billingGuideState.billingGuideNoFile : null);


