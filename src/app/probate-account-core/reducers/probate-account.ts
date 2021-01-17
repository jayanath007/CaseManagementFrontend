
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';


export interface State {
    readonly [token: string]: ProbateAccountState;

}

export interface ProbateAccountState {

    readonly myToken: string;
    readonly loading: boolean;
    readonly openFrom: string;
    readonly matterData: any;
    readonly title: string;
    readonly isPopup: boolean;
    readonly editData: any;

    readonly savedData: any;

}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {


        case Actions.INIT_PROBATE_ACCOUNT:
            temp[action.token] = setInitialData(state[action.token], action.payload);
            return { ...state, ...temp };


        case Actions.SAVE_PROBATE_ACCOUNT_ITEM:
            temp[action.token] = setData(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS:
            temp[action.token] = saveDataSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.SAVE_PROBATE_ACCOUNT_ITEM_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };



        default:
            {
                return state;
            }
    }
}
function setInitialData(state: ProbateAccountState, initData: {
    openFrom: any, title: string, isPopup: boolean,
    matterData: any, editData: any
}) {
    return {
        ...state,
        openFrom: initData.openFrom,
        matterData: initData.matterData,
        title: initData.title,
        isPopup: initData.isPopup,
        editData: initData.editData,
        savedData: null
    };
}


function setData(state: ProbateAccountState) {
    return {
        ...state,
        loading: true,
        savedData: null
    };
}

function saveDataSuccess(state: ProbateAccountState, data) {
    return {
        ...state,
        loading: false,
        savedData: data,
    };
}





export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (views) => views[token]);

export const getLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.loading : null);

// matterLinkedState ? matterLinkedState.columnDef : null
export const getMatterDataByToken = (token) => createSelector(getViewByToken(token), (state) =>
    state ? state.matterData : null);

export const getSavedDataByToken = (token) => createSelector(getViewByToken(token), (state) =>
    state ? state.savedData : null);





