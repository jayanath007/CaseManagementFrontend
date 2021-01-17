import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { UserResponse } from '../models/interfaces';
import { SettingsData, SettingsInfo } from '../../core/lib/app-settings';
import { TimeZoneInformation, User, AutomaticRepliesSetting } from './../../core/lib/microsoft-graph';
import { MessageFormat } from '../../auth';

export interface State {
    readonly [token: string]: OrganizerSettingsState;
}

export interface OrganizerSettingsState {
    readonly init: boolean;
    readonly isDirty: boolean;
    readonly extensionsLoading: boolean;
    readonly signature: string;
    readonly originalSignature: string;
    readonly signatureLoading: boolean;
    readonly isSignatureAvailable: boolean;
    readonly isSignaturAutoAdd: boolean;
    readonly isChaserEnable: boolean;
    readonly isExtensionsAvalible: boolean;
    readonly userResponse: UserResponse;
    readonly timeZones: TimeZoneInformation[];
    readonly timeZonesLoading: boolean;
    readonly userTimeZone: string;
    readonly userTimeZoneLoading: boolean;
    readonly automaticRepliesSettingLoading: boolean;
    readonly isTimeZoneSaveSuccess: boolean;
    readonly isExtensionsSaveSuccess: boolean;
    readonly isSignatureSaveSuccess: boolean;
    readonly isSettingsUpdateFail: boolean;
    readonly dpsSharedMailBoxes: User[];
    readonly automaticRepliesSetting: AutomaticRepliesSetting;
    readonly reminderSoundEnable: boolean;
    readonly newMailSoundEnable: boolean;
    readonly messageFormat: MessageFormat;
    readonly useGlobalSignature: boolean;
    readonly newGlobalSignatureTemp: string;
}

const initialState: State = {};

const deafultMessageData: UserResponse = {
    displyType: '',
    displayStatus: false,
    displyMessage: ''
};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.INIT_ORGANIZER_SETTINGS:
            temp[action.token] = getInitViewData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_EXTENSIONS:
            temp[action.token] = getLoadExtensions(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_EXTENSIONS_SUCCESS:
            temp[action.token] = getLoadExtensionsSuccess(state[action.token], action.payload.extensions);
            return { ...state, ...temp };
        case Actions.LOAD_EXTENSIONS_FAIL:
            temp[action.token] = getLoadExtensionsFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHECK_SIGNATURE:
            temp[action.token] = getCheckSignature(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHECK_SIGNATURE_FAIL:
            temp[action.token] = getCheckSignatureFail(state[action.token], action.payload.error);
            return { ...state, ...temp };
        case Actions.LOAD_SIGNATURE:
            temp[action.token] = getLoadSignature(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_SIGNATURE_SUCCESS:
            temp[action.token] = getLoadSignatureSuccess(state[action.token], action.payload.signature);
            return { ...state, ...temp };
        case Actions.LOAD_SIGNATURE_FAIL:
            temp[action.token] = getLoadSignatureFail(state[action.token], action.payload.error);
            return { ...state, ...temp };
        case Actions.LOAD_TIME_ZONES:
            temp[action.token] = getLoadTimeZones(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TIME_ZONES_SUCCESS:
            temp[action.token] = getLoadTimeZonesSuccess(state[action.token], action.payload.timeZones);
            return { ...state, ...temp };
        case Actions.LOAD_TIME_ZONES_FAIL:
            temp[action.token] = getLoadTimeZonesFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_USER_TIME_ZONE:
            temp[action.token] = getLoadUserTimeZone(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_USER_TIME_ZONE_SUCCESS:
            temp[action.token] = getLoadUserTimeZoneSuccess(state[action.token], action.payload.userTimeZone);
            return { ...state, ...temp };
        case Actions.LOAD_USER_TIME_ZONE_FAIL:
            temp[action.token] = getLoadUserTimeZoneFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.LOAD_AUTOMATIC_REPLIES_SETTING:
            temp[action.token] = getAutomaticRepliesSetting(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_AUTOMATIC_REPLIES_SETTING_SUCCESS:
            temp[action.token] = getAutomaticRepliesSettingSuccess(state[action.token], action.payload.automaticRepliesSetting);
            return { ...state, ...temp };
        case Actions.LOAD_AUTOMATIC_REPLIES_SETTING_FAIL:
            temp[action.token] = getAutomaticRepliesSettingFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.CHANGE_IS_CHASER_DESABLE:
            temp[action.token] = getChangeIsChaserDesable(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_REMINDER_SOUND_ENABLE:
            temp[action.token] = getChangeReminderSoundEnable(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_NEW_MAIL_SOUND_ENABLE:
            temp[action.token] = getChangeNewMailSoundEnable(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_MESSAGE_FORMAT:
            temp[action.token] = getChangeMessageFormat(state[action.token], action.payload.value);
            return { ...state, ...temp };
        case Actions.CHANGE_SIGNATURE:
            temp[action.token] = getChangeSignature(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_IS_AUTO_SIGNATURE_ADD:
            temp[action.token] = getChangeIsAutoSignatureAdd(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_USER_TIME_ZONE:
            temp[action.token] = getChangeUserTimeZone(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_AUTOMATIC_REPLIES_SETTING:
            temp[action.token] = getChangeAutomaticRepliesSetting(state[action.token], action.payload.value);
            return { ...state, ...temp };
        case Actions.SUBMIT:
            temp[action.token] = getSubmit(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_EXTENSIONS:
            temp[action.token] = getUpdateExtensions(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_EXTENSIONS_SUCCESS:
            temp[action.token] = getUpdateExtensionsSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_EXTENSIONS_FAIL:
            temp[action.token] = getUpdateExtensionsFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.UPDATE_SIGNATURE:
            temp[action.token] = getUpdateSignature(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_SIGNATURE_SUCCESS:
            temp[action.token] = getUpdateSignatureSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_SIGNATURE_FAIL:
            temp[action.token] = getUpdateSignatureFail(state[action.token], action.payload.error);
            return { ...state, ...temp };
        case Actions.REPLACE_SIGNATURE_BY_TOOL:
            temp[action.token] = setReplacedSignature(state[action.token], action.payload.signature);
            return { ...state, ...temp };

        case Actions.CREATE_EXTENSIONS:
            temp[action.token] = getCreateExtensions(state[action.token]);
            return { ...state, ...temp };
        case Actions.CREATE_EXTENSIONS_SUCCESS:
            temp[action.token] = getCreateExtensionsSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.CREATE_EXTENSIONS_FAIL:
            temp[action.token] = getCreateExtensionsFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_USER_TIME_ZONE:
            temp[action.token] = getUpdateTimeZone(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_USER_TIME_ZONE_SUCCESS:
            temp[action.token] = getUpdateTimeZoneSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.UPDATE_USER_TIME_ZONE_FAIL:
            temp[action.token] = getUpdateTimeZoneFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.NO_UPDATE_NEED:
            temp[action.token] = getNoUpdateNeed(state[action.token]);
            return { ...state, ...temp };
        case Actions.ORG_SETTINGS_CLEAR_STATE:
            temp[action.token] = null;
            return { ...state, ...temp };
        case Actions.ORG_SETTINGS_UPDATE_FAIL:
            temp[action.token] = getUpdateFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_USE_GLOBAL_SIGNATURE:
            temp[action.token] = setUseGlobalSignature(state[action.token], action.payload.value);
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function getInitViewData(state: OrganizerSettingsState) {
    return {
        ...state,
        init: true,
        isChaserEnable: true,
        isSignaturAutoAdd: false,
        isSignatureSaveSuccess: false,
        isExtensionsSaveSuccess: false,
        isTimeZoneSaveSuccess: false,
        userResponse: deafultMessageData,
        isSettingsUpdateFail: false,
        isDirty: false,
        dpsSharedMailBoxes: [],
        reminderSoundEnable: true,
        newMailSoundEnable: true,
        useGlobalSignature: false
    };
}

function getLoadExtensions(state: OrganizerSettingsState) {
    return {
        ...state,
        extensionsLoading: true
    };
}

function getLoadExtensionsSuccess(state: OrganizerSettingsState, extensions: any) {
    const extensionsAvalible = getIsSettingsAvailable(extensions.extensions);

    const messageData: UserResponse = {
        displyType: '',
        displayStatus: !extensionsAvalible,
        displyMessage: (extensionsAvalible === true) ? '' :
            'Settings not found...\n please do changes and press save button to create new settings for you'
    };

    return {
        ...state,
        isExtensionsAvalible: extensionsAvalible,
        isChaserEnable: getIsChaserEnableFromSettings(extensions.extensions),
        isSignaturAutoAdd: getIsSignaturAutoAddFromSettings(extensions.extensions),
        dpsSharedMailBoxes: getDPSSharedMailBoxesFromSettings(extensions.extensions),
        extensionsLoading: false,
        reminderSoundEnable: getReminderSoundEnableFromSettings(extensions.extensions),
        newMailSoundEnable: getNewMailSoundEnableFromSettings(extensions.extensions),
        messageFormat: getMessageFormatFromSettings(extensions.extensions),
        userResponse: messageData,
        useGlobalSignature: getIsUseGlobalSignatureFromSettings(extensions.extensions),
    };
}

function getIsSignaturAutoAddFromSettings(extensions: SettingsData[]): boolean {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data ? stringToBool(settingsInfo.data.isSignaturAutoAdd) : false;
    } else {
        return false;
    }
}

function getDPSSharedMailBoxesFromSettings(extensions: SettingsData[]): User[] {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data ? (settingsInfo.data.dpsSharedMailBoxes || []) : [];
    } else {
        return [];
    }
}
function stringToBool(val) {
    return (val + '').toLowerCase() === 'true';
}

function getIsChaserEnableFromSettings(extensions: SettingsData[]): boolean {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data ? stringToBool(settingsInfo.data.isChaserEnable) : true;
    } else {
        return true;
    }
}
function getReminderSoundEnableFromSettings(extensions: SettingsData[]): boolean {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data && settingsInfo.data.reminderSoundEnable !== undefined
            ? stringToBool(settingsInfo.data.reminderSoundEnable) : true;
    } else {
        return true;
    }
}
function getNewMailSoundEnableFromSettings(extensions: SettingsData[]): boolean {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data && settingsInfo.data.newMailSoundEnable !== undefined
            ? stringToBool(settingsInfo.data.newMailSoundEnable) : true;
    } else {
        return true;
    }
}
function getMessageFormatFromSettings(extensions: SettingsData[]): MessageFormat {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    return settingsInfo.status && settingsInfo.data && settingsInfo.data.messageFormat
        ? settingsInfo.data.messageFormat : {
            contentType: 'html',
            fontFamily: 'Arial,Helvetica,sans-serif',
            fontSize: '10pt',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '',
        };
}

function getIsSettingsAvailable(extensions: SettingsData[]): boolean {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data ? true : false;
    } else {
        return false;
    }
}

function getOrganizerSettings(extensions: SettingsData[]): SettingsInfo {
    if (extensions.length) {
        const info = extensions.find(ext => ext.id === 'organizerSettings');
        const settingsInfo: SettingsInfo = {
            status: true,
            data: info ? info : null
        };
        return settingsInfo;
    } else {
        const settingsInfo: SettingsInfo = {
            status: false,
            data: null
        };
        return settingsInfo;
    }
}

function getLoadExtensionsFail(state: OrganizerSettingsState) {
    return {
        ...state,
        extensionsLoading: false
    };
}

function getCheckSignature(state: OrganizerSettingsState) {
    return {
        ...state,
        signatureLoading: true
    };
}

function getCheckSignatureFail(state: OrganizerSettingsState, error: any) {
    console.log('getLoadSignatureFail', error);
    return {
        ...state,
        signatureLoading: false,
        isSignatureAvailable: error.error ? (error.error.code === 'itemNotFound' ? false : true) : true,
        signature: ''
    };
}

function getIsUseGlobalSignatureFromSettings(extensions: SettingsData[]): boolean {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data ? stringToBool(settingsInfo.data.useGlobalSignature) : true;
    } else {
        return true;
    }
}

function getLoadSignature(state: OrganizerSettingsState) {
    return {
        ...state
    };
}

function getLoadSignatureSuccess(state: OrganizerSettingsState, signature: string) {
    // console.log('getLoadSignatureSuccess', signature);

    return {
        ...state,
        signature: signature ? signature.trim() : '',
        originalSignature: signature ? signature.trim() : '',
        signatureLoading: false,
        isSignatureAvailable: true
    };
}

function getLoadSignatureFail(state: OrganizerSettingsState, error: any) {
    console.log('getLoadSignatureFail', error);
    return {
        ...state,
        signatureLoading: false,
        signature: ''
    };
}

function getLoadTimeZones(state: OrganizerSettingsState) {
    return {
        ...state,
        timeZonesLoading: true
    };
}

function getLoadTimeZonesSuccess(state: OrganizerSettingsState, zones: TimeZoneInformation[]) {
    console.log('getLoadTimeZonesSuccess', zones);

    return {
        ...state,
        timeZones: zones,
        timeZonesLoading: false
    };
}

function getLoadTimeZonesFail(state: OrganizerSettingsState) {
    return {
        ...state,
        timeZonesLoading: false
    };
}
function getLoadUserTimeZone(state: OrganizerSettingsState) {
    return {
        ...state,
        userTimeZoneLoading: true
    };
}

function getLoadUserTimeZoneSuccess(state: OrganizerSettingsState, zone: string) {
    return {
        ...state,
        userTimeZone: zone,
        userTimeZoneLoading: false
    };
}

function getLoadUserTimeZoneFail(state: OrganizerSettingsState) {
    return {
        ...state,
        userTimeZoneLoading: false
    };
}

function getAutomaticRepliesSetting(state: OrganizerSettingsState) {
    return {
        ...state,
        automaticRepliesSettingLoading: true
    };
}

function getAutomaticRepliesSettingSuccess(state: OrganizerSettingsState, automaticRepliesSetting: AutomaticRepliesSetting) {
    return {
        ...state,
        automaticRepliesSetting: automaticRepliesSetting,
        automaticRepliesSettingLoading: false
    };
}

function getAutomaticRepliesSettingFail(state: OrganizerSettingsState) {
    return {
        ...state,
        automaticRepliesSettingLoading: false
    };
}
function getChangeSignature(state: OrganizerSettingsState, value) {
    return {
        ...state,
        isDirty: (state.originalSignature && state.originalSignature.trim() === value.trim()) ? state.isDirty : true,
        signature: value
    };
}

function getChangeReminderSoundEnable(state: OrganizerSettingsState, value) {
    return {
        ...state,
        isDirty: true,
        reminderSoundEnable: value
    };
}
function getChangeNewMailSoundEnable(state: OrganizerSettingsState, value) {
    return {
        ...state,
        isDirty: true,
        newMailSoundEnable: value
    };
}
function getChangeMessageFormat(state: OrganizerSettingsState, value) {
    return {
        ...state,
        isDirty: true,
        messageFormat: value
    };
}
function getChangeIsChaserDesable(state: OrganizerSettingsState, value) {
    return {
        ...state,
        isDirty: true,
        isChaserEnable: value
    };
}

function getChangeIsAutoSignatureAdd(state: OrganizerSettingsState, value) {
    return {
        ...state,
        isDirty: true,
        isSignaturAutoAdd: value
    };
}

function getChangeUserTimeZone(state: OrganizerSettingsState, timeZone) {
    return {
        ...state,
        isDirty: true,
        userTimeZone: timeZone
    };
}

function getChangeAutomaticRepliesSetting(state: OrganizerSettingsState, automaticRepliesSetting) {
    return {
        ...state,
        isDirty: true,
        automaticRepliesSetting: automaticRepliesSetting
    };
}

function getSubmit(state: OrganizerSettingsState) {

    return {
        ...state,
        userResponse: deafultMessageData,
        isSettingsUpdateFail: false,
    };
}

function getUpdateExtensions(state: OrganizerSettingsState) {
    return {
        ...state,
        isExtensionsSaveSuccess: false,
        userResponse: deafultMessageData
    };
}

function getUpdateExtensionsSuccess(state: OrganizerSettingsState) {
    return {
        ...state,
        isDirty: false,
        isExtensionsSaveSuccess: true,
        userResponse: deafultMessageData
    };
}

function getUpdateExtensionsFail(state: OrganizerSettingsState) {
    return {
        ...state,
        userResponse: deafultMessageData,
        isExtensionsSaveSuccess: false,
        isSettingsUpdateFail: true
    };
}

function getUpdateSignature(state: OrganizerSettingsState) {
    return {
        ...state,
        isSignatureSaveSuccess: false,
        userResponse: deafultMessageData
    };
}

function setReplacedSignature(state: OrganizerSettingsState, signature: string) {
    return {
        ...state,
        signature: signature,
    };
}

function getUpdateSignatureSuccess(state: OrganizerSettingsState) {
    return {
        ...state,
        isDirty: false,
        isSignatureSaveSuccess: true,
        userResponse: deafultMessageData
    };
}

function getUpdateSignatureFail(state: OrganizerSettingsState, error: any) {
    const messageData: UserResponse = {
        displyType: '',
        displayStatus: true,
        displyMessage: (error.error && error.error.code === 'ResourceNotFound') ?
            'Signature update fail, Please setup your OneDrive, by using following link  ' +
            `<a style="color: #9ed9ff;" target="_blank"
            href="https://dpssoftware-my.sharepoint.com/_layouts/15/MySite.aspx?MySiteRedirect=AllDocuments">
            https://login.microsoftonline.com </a> `
            : 'Signature update fail.'
    };
    return {
        ...state,
        userResponse: messageData,
        isSignatureSaveSuccess: false,
        isSettingsUpdateFail: true
    };
}


function getUpdateTimeZone(state: OrganizerSettingsState) {
    return {
        ...state,
        isTimeZoneSaveSuccess: false,
        userResponse: deafultMessageData
    };
}

function getUpdateTimeZoneSuccess(state: OrganizerSettingsState) {
    return {
        ...state,
        isDirty: false,
        isTimeZoneSaveSuccess: true,
        userResponse: deafultMessageData
    };
}

function getUpdateTimeZoneFail(state: OrganizerSettingsState) {
    return {
        ...state,
        userResponse: deafultMessageData,
        isTimeZoneSaveSuccess: false,
        isSettingsUpdateFail: true
    };
}

function getUpdateFail(state: OrganizerSettingsState) {
    return {
        ...state,
        userResponse: deafultMessageData,
        isSettingsUpdateFail: true
    };
}

function getCreateExtensions(state: OrganizerSettingsState) {
    return {
        ...state,
        isExtensionsSaveSuccess: false,
        userResponse: deafultMessageData
    };
}

function getCreateExtensionsSuccess(state: OrganizerSettingsState) {
    return {
        ...state,
        isDirty: false,
        isExtensionsAvalible: true,
        isExtensionsSaveSuccess: true,
        userResponse: deafultMessageData
    };
}

function getCreateExtensionsFail(state: OrganizerSettingsState) {
    return {
        ...state,
        UserResponse: deafultMessageData,
        isExtensionsSaveSuccess: false,
        isSettingsUpdateFail: true
    };
}

function getNoUpdateNeed(state: OrganizerSettingsState) {
    const messageData: UserResponse = {
        displyType: '',
        displayStatus: true,
        displyMessage: 'No changers to save'
    };
    return {
        ...state,
        userResponse: messageData
    };
}

function setUseGlobalSignature(state: OrganizerSettingsState, value) {
    return {
        ...state,
        isDirty: true,
        useGlobalSignature: value
    };
}





export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getIsChaserEnableByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.isChaserEnable : false);
export const getIsSignatureAutoAddByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.isSignaturAutoAdd : false);
export const getSignatureByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.signature : null);
export const getTimeZonesByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.timeZones : null);
export const getUserTimeZoneByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.userTimeZone : null);

export const getAutomaticRepliesSettingByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.automaticRepliesSetting : null);

export const getFullUserTimeZoneByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    (organizerSettingsState && organizerSettingsState.timeZones && organizerSettingsState.userTimeZone) ?
        organizerSettingsState.timeZones.find((zone) => zone.alias === organizerSettingsState.userTimeZone) : null);

export const getUserResponseByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.userResponse : null);
export const getIsSignatureSaveSuccessByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.isSignatureSaveSuccess : false);
export const getIsExtensionsSaveSuccessByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.isExtensionsSaveSuccess : false);

export const getIsTimeZoneSaveSuccessByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.isTimeZoneSaveSuccess : false);

export const getIsAllSettingSSaveSuccessByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ?
        (organizerSettingsState.isTimeZoneSaveSuccess) &&
        (organizerSettingsState.isExtensionsSaveSuccess) &&
        (organizerSettingsState.isSignatureSaveSuccess)
        : false
);

export const getIsAllSettingSSaveFailByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.isSettingsUpdateFail : false
);

export const getIsLoadingByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? (organizerSettingsState.extensionsLoading && organizerSettingsState.extensionsLoading === true) ||
        (organizerSettingsState.signatureLoading && organizerSettingsState.signatureLoading === true) ||
        (organizerSettingsState.userTimeZoneLoading && organizerSettingsState.userTimeZoneLoading === true) ||
        (organizerSettingsState.timeZonesLoading && organizerSettingsState.timeZonesLoading === true) ||
        (organizerSettingsState.automaticRepliesSettingLoading && organizerSettingsState.automaticRepliesSettingLoading === true)
        : false);

export const getReminderSoundEnableByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.reminderSoundEnable : false);

export const getNewMailSoundEnableByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.newMailSoundEnable : false);

export const getMessageFormatByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.messageFormat : <MessageFormat>{
        contentType: 'html',
        fontFamily: 'Arial,Helvetica,sans-serif',
        fontSize: '10pt',
        isBold: false,
        isItalic: false,
        isUnderline: false,
        fontColor: '',
    });

export const getIsGlobalSignatureByToken = (token) => createSelector(getViewByToken(token), (organizerSettingsState) =>
    organizerSettingsState ? organizerSettingsState.useGlobalSignature : true);

