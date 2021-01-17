
import { PriceCapLimitInput } from './../../core/lib/priceCapLimit';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { CurrentLimits, UserInputData, LimitHistory } from './../models/interfaces';
import { UserInputDataEnum } from '../models/enum';
import { dpsNewDate } from '../../utils/javascriptDate';

export interface State {
    readonly [token: string]: PriceCapLimit;
}

export interface PriceCapLimit {
    loading: boolean;
    user: string;
    fileID: number;
    branchID: number;
    classId: number;
    currentLimit: CurrentLimits[];
    userInput: UserInputData;
    historyList: LimitHistory[];
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_PRICE_CAP:
            temp[action.token] = getInitViewData(state[action.token], action.payload, action.timeOffset);
            return { ...state, ...temp };
        case Actions.GET_TIME_CURRENT_LIMITS:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.GET_TIME_CURRENT_LIMITS_SUCCESS:
            temp[action.token] = setCurrentClassLimit(action.currentLimits, state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_TIME_CURRENT_LIMITS_FAIL:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.CLEART_STORE:
            temp[action.token] = null;
            return { ...state, ...temp };
        case Actions.CHANGE_USER_INPUT:
            temp[action.token] = {
                ...state[action.token],
                userInput: updateUserInput(state[action.token].userInput, action.payload.value, action.payload.key)
            };
            return { ...state, ...temp };
        case Actions.GET_LIMIT_HISTORY_DETAILS:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.GET_LIMIT_HISTORY_DETAILS_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false, historyList: action.gridData };
            return { ...state, ...temp };
        case Actions.GET_LIMIT_HISTORY_DETAILS_FAIL:
            temp[action.token] = { ...state, loading: false, historyList: [] };
            return { ...state[action.token], ...temp };
        case Actions.ADD_LIMIT_TO_HISTORY:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.ADD_LIMIT_TO_HISTORY_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.ADD_LIMIT_TO_HISTORY_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state[action.token], ...temp };
        case Actions.DELETE_HISTORY_ITEM:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state[action.token], ...temp };
        case Actions.DELETE_HISTORY_ITEM_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state[action.token], ...temp };
        case Actions.DELETE_HISTORY_ITEM_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state[action.token], ...temp };
        default:
            { return state; }
    }
}

function getInitViewData(state: PriceCapLimit, payload: PriceCapLimitInput, timeOffset)
    : PriceCapLimit {
    return {
        ...state,
        loading: false,
        user: payload.user,
        fileID: payload.fileID,
        branchID: payload.branchID,
        classId: payload.classId,
        userInput: {
            [UserInputDataEnum.postingData]: dpsNewDate(timeOffset),
            [UserInputDataEnum.newLimit]: 0.00,
            [UserInputDataEnum.grantedDate]: dpsNewDate(timeOffset),
            [UserInputDataEnum.limitedType]: 0,
        }
    };
}

function setCurrentClassLimit(limit: CurrentLimits[], state: PriceCapLimit, ): PriceCapLimit {
    if (!state || !limit) {
        return state;
    }
    const fiterdLimit = limit ? limit.filter(i => i.classID === state.classId) : [];
    return {
        ...state,
        loading: false,
        userInput: {
            ...state.userInput,
            [UserInputDataEnum.limitedType]: ((state.userInput[UserInputDataEnum.limitedType] === 0) &&
                (fiterdLimit && fiterdLimit.length > 0))
                ? fiterdLimit[0].limitType :
                state.userInput[UserInputDataEnum.limitedType],
        },
        currentLimit: fiterdLimit

    };
}

function updateUserInput(input: UserInputData, value: any, key: UserInputDataEnum): UserInputData {
    const temp = {};
    temp[key] = value;
    return { ...input, ...temp };
}

export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getIsLoading = (token) => createSelector(getViewByToken(token), state => state ? state.loading : false);
export const getCrimeClassIdentityViewModel = (token) => createSelector(getViewByToken(token), state => {
    const model: CrimeClassIdentityViewModel = {
        fileId: state ? state.fileID : 0,
        branchId: state ? state.branchID : 0,
        classId: state ? state.classId : 0,
    };
    return model;
});
export const getCurrentLimit = (token) => createSelector(getViewByToken(token), state => state ? state.currentLimit : []);
export const getUserInputData = (token) => createSelector(getViewByToken(token), state => state ? state.userInput : null);
export const getHistoryData = (token) => createSelector(getViewByToken(token), state => state ? state.historyList : []);
export const getUser = (token) => createSelector(getViewByToken(token), state => state ? state.user : null);
