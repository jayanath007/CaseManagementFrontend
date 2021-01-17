
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { SettingsData, SettingsInfo } from '../../core/lib/app-settings';

export interface State {
    readonly [token: string]: OrganizerSignatureState;
}

export interface OrganizerSignatureState {
    readonly init: boolean;
    readonly isDirty: boolean;
    readonly logo: string;
    readonly logoLoading: boolean;
    readonly signature: string;
    readonly originalSignature: string;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.LOAD_LOGO:
            temp[action.token] = getLoadLogo(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_LOGO_SUCCESS:
            temp[action.token] = getLoadLogoSuccess(state[action.token], action.payload.logo);
            return { ...state, ...temp };
        case Actions.LOAD_LOGO_FAIL:
            temp[action.token] = getLoadLogoFail(state[action.token], action.payload.error);
            return { ...state, ...temp };
        case Actions.CHANGE_SIGNATURE_TEMPLATE:
            temp[action.token] = getChangeSignatureTemplate(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.SUBMIT_SIGNATURE:
            temp[action.token] = getSubmit(state[action.token]);
            return { ...state, ...temp };
        case Actions.USER_SIGNATURE_CLEAR_STATE:
            temp[action.token] = null;
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}


function getLoadLogo(state: OrganizerSignatureState) {
    return {
        ...state
    };
}

function getLoadLogoSuccess(state: OrganizerSignatureState, logo: string) {
    return {
        ...state,
        logo: logo ? logo.trim() : '',
        originalLogo: logo ? logo.trim() : '',
        logoLoading: false,
        isLogoAvailable: true
    };
}

function getLoadLogoFail(state: OrganizerSignatureState, error: any) {
    console.log('getLoadLogoFail', error);
    return {
        ...state,
        logoLoading: false
    };
}

function getChangeSignatureTemplate(state: OrganizerSignatureState, value) {
    return {
        ...state,
        isDirty: (state.originalSignature && state.originalSignature.trim() === value.trim()) ? false : true,
        signature: value
    };
}

function getSubmit(state: OrganizerSignatureState) {

    return {
        ...state,
        //userResponse: deafultMessageData
    };
}

export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getLogoByToken = (token) => createSelector(getViewByToken(token), (organizerSignatureState) =>
    organizerSignatureState ? organizerSignatureState.logo : null);








