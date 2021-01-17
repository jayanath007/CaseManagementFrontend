import * as Actions from '../actions/auth';
import { User, AzureAuthInfo, MessageFormat, GeneralData } from './../models/auth';
import { SettingsData, SettingsInfo, Module, SettingKey, UserPermissionKey } from '../../core/lib/app-settings';
import * as Graph from './../../core/lib/microsoft-graph';
import { uuid } from '../../utils/uuid';
import { createSelector } from '@ngrx/store';
import { MatterAppCode, eBillingType } from '../../core/lib/matter';
import { AddTimeType } from '../../core/lib/timeRecord';

export interface State {
    authInfo: AzureAuthInfo;
    showingTokenExpire: boolean;
    tenentValidated: any;
    globalSignatureTemp: string;
    globalSignatureTempLoading: boolean;
}

const initialState: State = {
    authInfo: { accessToken: null, user: null, isGoogle: false },
    showingTokenExpire: false, tenentValidated: null,
    globalSignatureTemp: null,
    globalSignatureTempLoading: false
};

export function reducer(state = initialState, action: Actions.Any): State {
    switch (action.type) {
        case Actions.LOGIN_SUCCESS:
            return { ...state, authInfo: { ...action.payload.authInfo, user: { ...action.payload.authInfo.user, userImageUid: uuid() } } };
        case Actions.LOGIN_FAILURE:
            return { ...state };
        case Actions.LOAD_ORGANIZER_SETTINGS_AUTH:
            return { ...state };
        case Actions.LOAD_EXTENSIONS_AUTH:
            return { ...state };
        case Actions.LOAD_EXTENSIONS_SUCCESS_AUTH:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: getLoadExtensionsSuccess(state.authInfo.user, action.payload.extensions)
                }
            };
        case Actions.UPDATE_SHARED_MAILBOXES:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: { ...state.authInfo.user, dpsSharedMailBoxes: action.payload }
                }
            };
        case Actions.LOAD_EXTENSIONS_FAIL_AUTH:
            return { ...state };
        case Actions.LOAD_ALL_EXTENSIONS_SUCCESS_AUTH:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: getLoadAllExtensionsSuccess(state.authInfo.user, action.payload)
                }
            };
        case Actions.UPDATE_PROFILE_IMAGE:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: setLoadingUserImage(state.authInfo.user, false)
                }
            };
        case Actions.UPDATE_PROFILE_IMAGE_SUCCESS:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: setLoadingUserImage(state.authInfo.user, true)
                }
            };
        case Actions.UPDATE_PROFILE_IMAGE_FAIL:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: setLoadingUserImage(state.authInfo.user, true)
                }
            };
        case Actions.LOAD_SIGNATURE_AUTH:
            return { ...state };
        case Actions.CHECK_SIGNATURE_FAIL_AUTH:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: getLoadSignatureSuccess(state.authInfo.user, '')
                }
            };
        case Actions.LOAD_SIGNATURE_AUTH:
            return { ...state };
        case Actions.LOAD_SIGNATURE_SUCCESS_AUTH:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: getLoadSignatureSuccess(state.authInfo.user, action.payload.signature)
                }
            };
        case Actions.LOAD_SIGNATURE_FAIL_AUTH:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: getLoadSignatureSuccess(state.authInfo.user, '')
                }
            };
        case Actions.LOAD_USER_TIME_ZONE_AUTH:
            return { ...state };
        case Actions.LOAD_USER_TIME_ZONE_SUCCESS_AUTH:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: getLoadUserTimeZoneSuccess(state.authInfo.user, action.payload)
                }
            };
        case Actions.GET_USER_GENERAL_DATA_SUCCESS:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: { ...state.authInfo.user, general: action.payload }
                }
            };
        case Actions.UPDATE_USER_FROM_LOCAL_STORAGE:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: action.payload.user
                }
            };
        case Actions.LOAD_USER_TIME_ZONE_FAIL_AUTH:
            return { ...state };

        case Actions.LOAD_VIEW_SETTINGS_EWS_SUCCESS:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: setEWSSettings(state.authInfo.user, action.payload.data)
                }
            };

        case Actions.UPDATE_SELECTED_CALENDARS_SUCCESS:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: setSelectedCalendars(state.authInfo.user, action.payload.dictionaryValue)
                }
            };

        case Actions.GET_JWT_TOKEN_FOR_PDF_VIEWER_SUCCESS:
            return {
                ...state, authInfo: {
                    ...state.authInfo,
                    user: setPDFViewerJwtToken(state.authInfo.user, action.payload)
                }
            };

        case Actions.SHOW_SESSION_EXPIRE_DIALOG:
            {
                return {
                    ...state, showingTokenExpire: true
                };
            }

        case Actions.HIDE_SESSION_EXPIRE_DIALOG:
            {
                return {
                    ...state, showingTokenExpire: false
                };
            }
        case Actions.GET_EMAIL_READING_PANEMODE_SUCCESS:
            {
                return {
                    ...state, authInfo: { ...state.authInfo, user: { ...state.authInfo.user, emailReadingPaneMode: action.payload.mode } }
                };
            }
        case Actions.GET_TENENT_VALIDATED_SUCCESS:
            {
                return {
                    ...state, tenentValidated: action.payLoad.tenentValidated
                };
            }
        case Actions.GET_TENENT_VALIDATED_FAIL:
            {
                return {
                    ...state, tenentValidated: action.payLoad.tenentValidated
                };
            }
        case Actions.GET_GLOBAL_SIGNATURE_TEMPLETE:
            return { ...state, globalSignatureTempLoading: true };
        case Actions.GET_GLOBAL_SIGNATURE_TEMPLETE_SUCCESS:
            return { ...state, globalSignatureTemp: action.templete, globalSignatureTempLoading: false };
        case Actions.GET_GLOBAL_SIGNATURE_TEMPLETE_FAIL:
            return { ...state, globalSignatureTempLoading: false };
        default: {
            return state;
        }
    }
}


function updateUserFromLocalStorage(user: User) {
    return {
        ...user,
    };
}


function getLoadUserTimeZoneSuccess(user: User, payload) {
    return {
        ...user,
        userTimeZone: { value: payload.value, info: payload.userTimeZone }
    };
}

function setEWSSettings(user: User, data: { dictionaryKey: string, dictionaryValue: any[] }[]) {
    const selectedCalendarsDesktop = data ? data.find(val => val.dictionaryKey === 'SelectedCalendarsDesktop') : null;
    return setSelectedCalendars(user, selectedCalendarsDesktop ? selectedCalendarsDesktop.dictionaryValue : []);
}

function setSelectedCalendars(user: User, dictionaryValue: any[]) {
    return { ...user, selectedCalendars: dictionaryValue };
}

function setPDFViewerJwtToken(user: User, token: string) {
    return { ...user, pdfViewerJwtToken: token };
}

function getLoadSignatureSuccess(user: User, signature: string) {

    return {
        ...user,
        signature: signature ? signature.trim() : ''
    };
}
function getLoadAllExtensionsSuccess(user: User, payload: any) {
    return {
        ...user,
        isChaserEnable: payload.isChaserEnable,
        isSignaturAutoAdd: payload.isSignatureAutoAdd,
        reminderSoundEnable: payload.reminderSoundEnable,
        newMailSoundEnable: payload.newMailSoundEnable,
        messageFormat: payload.messageFormat,
        useGlobalSignature: payload.useGlobalSignature
    };
}

function setLoadingUserImage(user: User, isLoadingUserImage: boolean) {
    return {
        ...user,
        isLoadingUserImage: isLoadingUserImage,
        userImageUid: uuid()
    };
}

function getLoadExtensionsSuccess(user: User, extensions: any) {
    const extensionsAvalible = getIsSettingsAvailable(extensions.extensions);
    return {
        ...user,
        isChaserEnable: getIsChaserEnableFromSettings(extensions.extensions),
        isSignaturAutoAdd: getIsSignaturAutoAddFromSettings(extensions.extensions),
        dpsSharedMailBoxes: getDPSSharedMailBoxesFromSettings(extensions.extensions),
        reminderSoundEnable: getReminderSoundEnableFromSettings(extensions.extensions),
        newMailSoundEnable: getNewMailSoundEnableFromSettings(extensions.extensions),
        messageFormat: getMessageFormatFromSettings(extensions.extensions),
        useGlobalSignature: getIsUseGlobalSignatureFromSettings(extensions.extensions)
    };
}
function getDPSSharedMailBoxesFromSettings(extensions: SettingsData[]): Graph.User[] {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data ? (settingsInfo.data.dpsSharedMailBoxes || []) : [];
    } else {
        return [];
    }
}
function getIsSignaturAutoAddFromSettings(extensions: SettingsData[]): boolean {
    const settingsInfo: SettingsInfo = getOrganizerSettings(extensions);
    if (settingsInfo.status) {
        return settingsInfo.data ? stringToBool(settingsInfo.data.isSignaturAutoAdd) : false;
    } else {
        return false;
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
            fontSize: '12pt',
            isBold: false,
            isItalic: false,
            isUnderline: false,
            fontColor: '',
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

function createGlobalSignature(user: User, templete: string): string {
    if (templete && user && user.general) {
        return templete.replace(/_Name_/g, !!user.profile ? user.profile.name : '')
            .replace(/_SignatureBlockName_/g, !!user.general.userSignatureName ? user.general.userSignatureName : '')
            .replace(/_AskForName_/g, !!user.general.userAskForName ? user.general.userAskForName : '')
            .replace(/_DirectDialNumber_/g, !!user.general.userDirectDialNo ? user.general.userDirectDialNo : '')
            .replace(/_EmailAddress_/g, !!user.general.userEmail ? user.general.userEmail : '')
            .replace(/_MobileNumber_/g, !!user.general.userMobile ? user.general.userMobile : '')
            .replace(/_JobTitle_/g, !!user.general.userJobTitle ? user.general.userJobTitle : '')

            .replace(/_BranchName_/g, !!user.general.userBranchName ? user.general.userBranchName : '')
            .replace(/_BranchAddressLine1_/g, !!user.general.branchAddress1 ? user.general.branchAddress1 : '')
            .replace(/_BranchAddressLine2_/g, !!user.general.branchAddress2 ? user.general.branchAddress2 : '')
            .replace(/_BranchCounty_/g, !!user.general.branchCounty ? user.general.branchCounty : '')
            .replace(/_BranchPostCode_/g, !!user.general.branchPostCode ? user.general.branchPostCode : '')
            .replace(/_BranchEmail_/g, !!user.general.branchEmail ? user.general.branchEmail : '')
            .replace(/_BranchTelephoneNo_/g, !!user.general.branchTelephone ? user.general.branchTelephone : '')
            .replace(/_BranchFaxNo_/g, !!user.general.branchFax ? user.general.branchFax : '')
            .replace(/_BranchMisc1_/g, !!user.general.branchMisc1 ? user.general.branchMisc1 : '')
            .replace(/_BranchMisc2_/g, !!user.general.branchMisc2 ? user.general.branchMisc2 : '')

            .replace(/_CompanyName_/g, !!user.general.companyName ? user.general.companyName : '')
            .replace(/_CompanyMisc1_/g, !!user.general.companyMisc1 ? user.general.companyMisc1 : '')
            .replace(/_CompanyMisc2_/g, !!user.general.companyMisc2 ? user.general.companyMisc2 : '')
            .replace(/_CompanyMisc3_/g, !!user.general.companyMisc3 ? user.general.companyMisc3 : '')
            .replace(/_CompanyMisc4_/g, !!user.general.companyMisc4 ? user.general.companyMisc4 : '');

    } else {
        return '';
    }
}

function checkModuleIsEnable(data: GeneralData, moduleId: Module): boolean {
    if (!data || !data.hiddenModule) {
        return true;
    }
    return !data.hiddenModule.find(i => i.trim() === moduleId);
}

export const getAuthInfo = (state: State) => state.authInfo;
export const showingTokenDialog = (state: State) => state.showingTokenExpire;
export const getUser = (state: State) => {
    if (state && state.authInfo && state.authInfo.user && (state.authInfo.user.useGlobalSignature || !state.authInfo.user.signature
        || !state.authInfo.user.signature.trim())) {
        return { ...state.authInfo.user, signature: createGlobalSignature(state.authInfo.user, state.globalSignatureTemp) };
    } else {
        return state.authInfo.user;
    }
};
export const getLoggedIn = (state: AzureAuthInfo) => state.accessToken != null;
export const getAccessToken = (state: AzureAuthInfo) => state.accessToken;
export const getIsTenentValidated = (state: State) => state.tenentValidated;
export const getGenaralData = (state: State) =>
    state.authInfo && state.authInfo.user && state.authInfo.user.general ? state.authInfo.user.general : null;
export const getModuleCanAccessByModuleId = (moduleId: Module) => createSelector(getGenaralData, (data) =>
    checkModuleIsEnable(data, moduleId));
export const checkTimeRecordType = (appCode: string, eBilling: string, isLegalAid: boolean) => (state: State) => {
    if (!checkModuleIsEnable(state.authInfo.user.general, Module.TimeRecorded)) {
        return AddTimeType.NotSupport;
    } else if (appCode === MatterAppCode.CR && isLegalAid) {
        if (!checkModuleIsEnable(state.authInfo.user.general, Module.Crime)) {
            return AddTimeType.NotSupport;
        }
        return AddTimeType.CrimeTime;
    } else if (appCode === MatterAppCode.MA && isLegalAid) {
        return AddTimeType.CivilTime;
    } else if (eBilling === eBillingType.PrecedentH) {
        return AddTimeType.PrecedentH;
    } else if (eBilling === eBillingType.PrecedentS) {
        return AddTimeType.PrecedentS;
    } else {
        return AddTimeType.GenaralTime;
    }
};

export const getSettingValueByKey = (key: SettingKey) => createSelector(getGenaralData, data => {
    if (!data || !data.settingValues) {
        return false;
    }
    return data.settingValues[key];
});
export const getDPSSettingValueByKey = (settingKey: SettingKey) => createSelector(getUser, (user) => {
    if (!!user && !!user.general && !!user.general.settingValues) {
        if (settingKey === SettingKey.AmendScreensWorkflow) {
            return user.general.amendScreensWorkflow;
        } else if (settingKey === SettingKey.IsLoginUserSupervisor) {
            return user.general.isLoginUserSupervisor;
        } else if (settingKey === SettingKey.TeamTalkDataBase) {
            return user.general.teamTalkDataBase;
        } else if (settingKey === SettingKey.UserBranchId) {
            return user.general.userBranchId;
        }
        return user.general.settingValues[settingKey];
    }
    return false;
});

export const getPoltVarValues = createSelector(getGenaralData, (data) => {
    return data ? data.plotVarValues : [];
});

export const getUserPermitionByKey = (key: UserPermissionKey) => createSelector(getUser, user => {
    if (user && user.general && user.general.userAccessRights) {
        return user.general.userAccessRights[key];
    }
    return false;
});

export const getGlobalSignatureForTemplete = (templete) =>
    (state: State) => createGlobalSignature(state.authInfo.user, templete);
export const getGlobalSignatureTemp = () => (state: State) => state.globalSignatureTemp;
export const getGlobalSignature = () => (state: State) => createGlobalSignature(state.authInfo.user, state.globalSignatureTemp);
export const getGlobalSignatureTempIsLoading = () => (state: State) => state.globalSignatureTempLoading;

