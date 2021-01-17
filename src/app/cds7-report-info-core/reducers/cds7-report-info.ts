import { Cds7ReportInfo } from '../models/cds7-report-info';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { getRunTimeCaseTypeList, DropDownItem } from '../../core/lib/crime-managment';

export interface Cds7ReportInfoView {
    readonly loding: boolean;
    readonly info: Cds7ReportInfo;
    readonly casetype: DropDownItem[];
}

export interface State {
    readonly [token: string]: Cds7ReportInfoView;
}

export const intialState: State = {};

export function reducer(state: State = intialState, action: Actions.Any): State {
    const temp = {};
    switch (action.type) {
        case (Actions.INIT_CDS7):
            temp[action.token] = { loding: false, info: null };
            return { ...state, ...temp };
        case (Actions.GET_CDS7_REPORT_INFO):
            temp[action.token] = { loding: true, info: null };
            return { ...state, ...temp };
        case (Actions.GET_CDS7_REPORT_INFO_SUCCESS):
            temp[action.token] = {
                loding: false,
                info: action.info,
                casetype: setDropDownList(action.casetype, 3, true),
            };
            return { ...state, ...temp };
        case (Actions.GET_CDS7_REPORT_INFO_FAIL):
            temp[action.token] = { loding: false, info: null };
            return { ...state, ...temp };
        case (Actions.CHANGE_MODEL):
            const changeInfo = { [action.payload.key]: action.payload.value };
            temp[action.token] = {
                ...state[action.token],
                info: { ...state[action.token].info, ...changeInfo }
            };
            return { ...state, ...temp };
        case (Actions.SAVE):
            temp[action.token] = changeLoadingState(state[action.token], true);
            return { ...state, ...temp };
        case (Actions.SAVE_SUCCESS):
            temp[action.token] = {
                ...state[action.token],
                loding: false,
            };
            return { ...state, ...temp };
        case (Actions.SAVE_FAIL):
            temp[action.token] = changeLoadingState(state[action.token], false);
            return { ...state, ...temp };
        default: return state;
    }
}

function setDropDownList(list: string[], lengthOfKey: number, isFullValue = false): DropDownItem[] {
    const temp: DropDownItem[] = [];
    if (list && list.length > 0) {
        list.forEach(i => temp.push({
            key: (i.substr(0, lengthOfKey)).trim(),
            value: !!isFullValue ? i : (i.substr(lengthOfKey + 1, i.length).trim())
        }));
    }
    return temp;
}

function changeLoadingState(state: Cds7ReportInfoView, loading: boolean): Cds7ReportInfoView {
    return {
        ...state,
        loding: loading
    };
}

const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (state) => state ? state[token] : null);
export const isLoading = (token) => createSelector(getViewByToken(token), (state) => state.loding);
export const getInformationModel = (token) => createSelector(getViewByToken(token), (state) => state.info);
export const getCaseTypes = (token) => createSelector(getViewByToken(token), (state) =>
    state && state.info ? getRunTimeCaseTypeList(state.casetype, state.info.stageReached) : []);


