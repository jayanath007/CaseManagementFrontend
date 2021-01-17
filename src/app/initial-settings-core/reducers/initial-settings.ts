
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { SettingsData, SettingsInfo } from '../../core/lib/app-settings';
import { TimeZoneInformation, LocaleInfo } from '../../core/lib/microsoft-graph';

export interface State {
    readonly [token: string]: InitialSettingsState;
}

export interface InitialSettingsState {
    readonly init: boolean;
    readonly timeZones: TimeZoneInformation[];
    readonly timeZonesLoading: boolean;
    readonly userTimeZone: string;
    readonly userTimeZoneLoading: boolean;
    readonly languages: LocaleInfo[];
    readonly languagesLoading: boolean;
    readonly userLanguage: LocaleInfo;
    readonly userLanguageLoading: boolean;
    readonly updateSuccess: boolean;
    readonly updatefail: boolean;
    readonly isUpdating: boolean;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.INIT_INITIAL_SETTINGS:
            temp[action.token] = getInitViewData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_TIME_ZONES:
            temp[action.token] = getLoadTimeZones(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_TIME_ZONES_SUCCESS:
            temp[action.token] = getLoadTimeZonesSuccess(state[action.token], action.payload.timeZones);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_TIME_ZONES_FAIL:
            temp[action.token] = getLoadTimeZonesFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.LOAD_INITIAL_SETTINGS_USER_TIME_ZONE:
            temp[action.token] = getLoadUserTimeZone(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_SUCCESS:
            temp[action.token] = getLoadUserTimeZoneSuccess(state[action.token], action.payload.userTimeZone);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_FAIL:
            temp[action.token] = getLoadUserTimeZoneFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.LOAD_INITIAL_SETTINGS_LANGUAGES:
            temp[action.token] = getLoadLanguages(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_LANGUAGES_SUCCESS:
            temp[action.token] = getLoadLanguagesSuccess(state[action.token], action.payload.languages);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_LANGUAGES_FAIL:
            temp[action.token] = getLoadLanguagesFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.LOAD_INITIAL_SETTINGS_USER_LANGUAGE:
            temp[action.token] = getLoadUserLanguage(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_USER_LANGUAGE_SUCCESS:
            temp[action.token] = getLoadUserLanguageSuccess(state[action.token], action.payload.language);
            return { ...state, ...temp };
        case Actions.LOAD_INITIAL_SETTINGS_USER_LANGUAGE_FAIL:
            temp[action.token] = getLoadUserLanguageFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.CHANGE_INITIAL_SETTINGS_USER_LANGUAGE:
            temp[action.token] = getChangeUserLanguage(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_INITIAL_SETTINGS_USER_TIME_ZONE:
            temp[action.token] = getChangeUserTimeZone(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.INITIAL_SETTINGS_SUBMIT:
            temp[action.token] = getSubmit(state[action.token]);
            return { ...state, ...temp };
            case Actions.INITIAL_SETTINGS_SUBMIT_FAIL:
            temp[action.token] = getSubmitFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_INITIAL_SETTINGS:
            temp[action.token] = getUpdateInitialSettings(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_INITIAL_SETTINGS_SUCCESS:
            temp[action.token] = getUpdateInitialSettingsSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_INITIAL_SETTINGS_FAIL:
            temp[action.token] = getUpdateInitialSettingsFail(state[action.token],action.payload.error);
            return { ...state, ...temp };

        // case Actions.NO_UPDATE_NEED:
        //     temp[action.token] = getNoUpdateNeed(state[action.token]);
        //     return { ...state, ...temp };

        case Actions.INITIAL_SETTINGS_CLEAR_STATE:
            temp[action.token] = null;
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function getInitViewData(state: InitialSettingsState) {
    return {
        ...state,
        init: true,
        updateSuccess: false,
        updatefail: false,
        isUpdating: false
    };
}



function getLoadTimeZones(state: InitialSettingsState) {
    return {
        ...state,
        timeZonesLoading: true
    };
}

function getLoadTimeZonesSuccess(state: InitialSettingsState, zones: TimeZoneInformation[]) {
    console.log('getLoadTimeZonesSuccess', zones);

    return {
        ...state,
        timeZones: zones,
        timeZonesLoading: false
    };
}

function getLoadTimeZonesFail(state: InitialSettingsState) {
    return {
        ...state,
        timeZonesLoading: false
    };
}
function getLoadUserTimeZone(state: InitialSettingsState) {
    return {
        ...state,
        userTimeZoneLoading: true
    };
}

function getLoadUserTimeZoneSuccess(state: InitialSettingsState, zone: string) {
    console.log('getLoadTimeZonesSuccess', zone);

    return {
        ...state,
        userTimeZone: zone,
        userTimeZoneLoading: false
    };
}

function getLoadUserTimeZoneFail(state: InitialSettingsState) {
    return {
        ...state,
        userTimeZoneLoading: false
    };
}

function getLoadLanguages(state: InitialSettingsState) {
    return {
        ...state,
        languagesLoading: true
    };
}

function getLoadLanguagesSuccess(state: InitialSettingsState, languages: LocaleInfo[]) {
    console.log('getLoadLanguagesSuccess', languages);

    return {
        ...state,
        languages: languages,
        languagesLoading: false
    };
}

function getLoadLanguagesFail(state: InitialSettingsState) {
    return {
        ...state,
        languagesLoading: false
    };
}


function getLoadUserLanguage(state: InitialSettingsState) {
    return {
        ...state,
        userLanguageLoading: true
    };
}

function getLoadUserLanguageSuccess(state: InitialSettingsState, language: LocaleInfo) {
    console.log('getLoadUserLanguageSuccess------------------------', language);
    const lang: LocaleInfo = {
        locale: language.locale,
        displayName: language.displayName
    };
    return {
        ...state,
        userLanguage: lang,
        userLanguageLoading: false
    };
}

function getLoadUserLanguageFail(state: InitialSettingsState) {
    return {
        ...state,
        userLanguageLoading: false
    };
}



function getChangeUserTimeZone(state: InitialSettingsState, timeZone) {
    return {
        ...state,
        isDirty: true,
        userTimeZone: timeZone
    };
}

function getChangeUserLanguage(state: InitialSettingsState, language) {


    const userLanguage = (state.languages && language) ?
        state.languages.find((lang) => lang.locale === language)
        : null;
    console.log('@@@@@@@@@@@@@@@@@@@@@@@', userLanguage);
    return {
        ...state,
        isDirty: true,
        userLanguage: userLanguage
    };
}

function getSubmit(state: InitialSettingsState) {

    return {
        ...state,
        updateSuccess: false,
        updatefail: false,
    };
}

function getSubmitFail(state: InitialSettingsState) {
        return {
            ...state,
        };
    }


function getUpdateInitialSettings(state: InitialSettingsState) {
    return {
        ...state,
        isUpdating: true
    };
}

function getUpdateInitialSettingsSuccess(state: InitialSettingsState) {
    return {
        ...state,
        isDirty: false,
        updateSuccess: true,
        isUpdating: false
    };
}

function getUpdateInitialSettingsFail(state: InitialSettingsState, error) {
    console.log('getUpdateInitialSettingsFail', error);
    return {
        ...state,
        updatefail: true,
        isUpdating: false
    };
}



// function getNoUpdateNeed(state: OrganizerSettingsState) {
//     const messageData: UserResponse = {
//         displyType: '',
//         displayStatus: true,
//         displyMessage: 'No changers to save'
//     };
//     return {
//         ...state,
//         userResponse: messageData
//     };
// }




export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);

export const getTimeZonesByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
    initialSettingsState ? initialSettingsState.timeZones : null);
export const getUserTimeZoneByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
    initialSettingsState ? initialSettingsState.userTimeZone : null);

export const getLanuagesByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
    initialSettingsState ? initialSettingsState.languages : null);
export const getUserLanguageByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
    initialSettingsState ? initialSettingsState.userLanguage : null);

export const getFullUserTimeZoneByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
    (initialSettingsState && initialSettingsState.timeZones && initialSettingsState.userTimeZone) ?
        initialSettingsState.timeZones.find((zone) => zone.alias === initialSettingsState.userTimeZone) : null);


export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
    initialSettingsState ?
        (initialSettingsState.userTimeZoneLoading && initialSettingsState.userTimeZoneLoading === true) ||
        (initialSettingsState.timeZonesLoading && initialSettingsState.timeZonesLoading === true)
        // (initialSettingsState.languagesLoading && initialSettingsState.languagesLoading === true) ||
        // (initialSettingsState.userLanguageLoading && initialSettingsState.userLanguageLoading === true)
        : false);

        export const getIsUpdatingByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
        initialSettingsState ? initialSettingsState.isUpdating : false);

        export const getIsUpdateSuccessByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
        initialSettingsState ? initialSettingsState.updateSuccess : false);

        export const getIsUpdateFailByToken = (token) => createSelector(getViewByToken(token), (initialSettingsState) =>
        initialSettingsState ? initialSettingsState.updatefail : false);

