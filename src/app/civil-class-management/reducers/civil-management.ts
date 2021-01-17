import { CivilClassObj, CivilManagementModuleInput } from '../model/interfaces';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';

export interface State {
    readonly [token: string]: CivilManagementState;
}

export interface CivilManagementState {
    readonly loading: boolean;
    readonly classList: CivilClassObj[];
    readonly openRowIndex: number;
    readonly inputData: CivilManagementModuleInput;
}
export const intialState: State = {};

export function reducer(state: State = intialState, action: Actions.Any): State {
    const temp = {};
    switch (action.type) {
        case Actions.INIT_MODULE:
            temp[action.token] = getInitView(state[action.token], action.payload.inputData);
            return { ...state, ...temp };
        case Actions.GET_CLASS_LIST:
            temp[action.token] = {
                ...state[action.token],
                loading: true
            };
            return { ...state, ...temp };
        case Actions.GET_CLASS_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                classList: action.payload.list
            };
            return { ...state, ...temp };
        case Actions.GET_CLASS_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return { ...state, ...temp };
        default:
            return state;
    }
}


function getInitView(state: CivilManagementState, input: CivilManagementModuleInput): CivilManagementState {
    return {
        loading: false,
        classList: [],
        openRowIndex: 0,
        inputData: input
    };
}

const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getIsLoading = (token) => createSelector(getViewByToken(token), (state) => state.loading);
export const getClassList = (token) => createSelector(getViewByToken(token), (state) => state.classList);
export const getopenRowIndex = (token) => createSelector(getViewByToken(token), (state) => state.openRowIndex);
export const getInputData = (token) => createSelector(getViewByToken(token), (state) => state.inputData);




