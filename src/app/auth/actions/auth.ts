import { Action } from '@ngrx/store';
import { AzureAuthInfo, GeneralData, MessageFormat, User, ReadingPaneMode, TenentValidated } from '../models/auth';
import * as Graph from './../../core/lib/microsoft-graph';
import { TokenizeAction } from '../../core/index';

export const LOGIN_SUCCESS = 'DPS_AUTH_LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'DPS_AUTH_LOGIN_FAILURE';
export const REDIRECT_TO_AZURE = 'DPS_LOGIN_REDIRECT';
export const AUTH_REQUIRED = 'DPS_AUTH_REQUIRED';
export const LOGOUT = 'DPS_LOGOUT';
export const SHOW_SESSION_EXPIRE_DIALOG = 'DPS_SHOW_SESSION_EXPIRE_DIALOG';
export const SHOW_REQUARED_DATA_ERRORD_IALOG = 'DPS_SHOW_REQUARED_DATA_ERRORD_IALOG';
export const HIDE_SESSION_EXPIRE_DIALOG = 'DPS_HIDE_SESSION_EXPIRE_DIALOG';

export const LOAD_ORGANIZER_SETTINGS_AUTH = 'LOAD_ORGANIZER_SETTINGS_AUTH ';
export const LOAD_ORGANIZER_SETTINGS_SUCCESS_AUTH = 'LOAD_ORGANIZER_SETTINGS_SUCCESS_AUTH ';
export const LOAD_ORGANIZER_SETTINGS_FAIL_AUTH = 'LOAD_ORGANIZER_SETTINGS_FAIL_AUTH ';

export const LOAD_EXTENSIONS_AUTH = 'LOAD_EXTENSIONS_AUTH ';
export const LOAD_EXTENSIONS_SUCCESS_AUTH = 'LOAD_EXTENSIONS_SUCCESS_AUTH ';

export const LOAD_EXTENSIONS_FAIL_AUTH = 'LOAD_EXTENSIONS_FAIL_AUTH ';
export const LOAD_ALL_EXTENSIONS_SUCCESS_AUTH = 'LOAD_ALL_EXTENSIONS_SUCCESS_AUTH';

export const CHECK_SIGNATURE_AUTH = 'CHECK_SIGNATURE_AUTH ';
export const CHECK_SIGNATURE_SUCCESS_AUTH = 'CHECK_SIGNATURE_SUCCESS_AUTH ';
export const CHECK_SIGNATURE_FAIL_AUTH = 'CHECK_SIGNATURE_FAIL_AUTH ';

export const LOAD_SIGNATURE_AUTH = 'LOAD_SIGNATURE_AUTH ';
export const LOAD_SIGNATURE_SUCCESS_AUTH = 'LOAD_SIGNATURE_SUCCESS_AUTH ';
export const LOAD_SIGNATURE_FAIL_AUTH = 'LOAD_SIGNATURE_FAIL_AUTH ';

export const LOAD_USER_TIME_ZONE_AUTH = 'LOAD_USER_TIME_ZONE_AUTH ';
export const LOAD_USER_TIME_ZONE_SUCCESS_AUTH = 'LOAD_USER_TIME_ZONE_SUCCESS_AUTH ';
export const LOAD_USER_TIME_ZONE_FAIL_AUTH = 'LOAD_USER_TIME_ZONE_FAIL_AUTH ';

export const UPDATE_USER_FROM_LOCAL_STORAGE = 'UPDATE_USER_FROM_LOCAL_STORAGE ';

export const UPDATE_PROFILE_IMAGE = 'UPDATE_PROFILE_IMAGE';
export const UPDATE_PROFILE_IMAGE_SUCCESS = 'UPDATE_PROFILE_IMAGE_SUCCESS';
export const UPDATE_PROFILE_IMAGE_FAIL = 'UPDATE_PROFILE_IMAGE_FAIL';

export const LOAD_VIEW_SETTINGS_EWS = 'DPS_LOAD_VIEW_SETTINGS_EWS';
export const LOAD_VIEW_SETTINGS_EWS_SUCCESS = 'DPS_LOAD_VIEW_SETTINGS_EWS_SUCCESS';
export const LOAD_VIEW_SETTINGS_EWS_FAIL = 'DPS_LOAD_VIEW_SETTINGS_EWS_FAIL';

export const UPDATE_SELECTED_CALENDARS = 'DPS_UPDATE_SELECTED_CALENDARS';
export const UPDATE_SELECTED_CALENDARS_SUCCESS = 'DPS_UPDATE_SELECTED_CALENDARS_SUCCESS';
export const UPDATE_SELECTED_CALENDARS_FAIL = 'DPS_UPDATE_SELECTED_CALENDARS_FAIL';

export const GET_EMAIL_READING_PANEMODE = 'DPS_GET_EMAIL_READING_PANEMODE';
export const GET_EMAIL_READING_PANEMODE_SUCCESS = 'DPS_GET_EMAIL_READING_PANEMODE_SUCCESS';
export const GET_EMAIL_READING_PANEMODE_FAIL = 'DPS_GET_EMAIL_READING_PANEMODE_FAIL';

export const GET_TENENT_VALIDATED = 'DPS_GET_TENENT_VALIDATED';
export const GET_TENENT_VALIDATED_SUCCESS = 'DPS_GET_TENENT_VALIDATED_SUCCESS';
export const GET_TENENT_VALIDATED_FAIL = 'DPS_GET_TENENT_VALIDATED_FAIL';

export const GET_USER_GENERAL_DATA = 'DPS_GET_USER_GENERAL_DATA';
export const GET_USER_GENERAL_DATA_SUCCESS = 'DPS_GET_USER_GENERAL_DATA_SUCCESS';
export const GET_USER_GENERAL_DATA_FAIL = 'DPS_GET_USER_GENERAL_DATA_FAIL';

export const UPDATE_SHARED_MAILBOXES = 'DPS_UPDATE_SHARED_MAILBOXES';

export const GET_JWT_TOKEN_FOR_PDF_VIEWER = 'DPS_GET_JWT_TOKEN_FOR_PDF_VIEWER';
export const GET_JWT_TOKEN_FOR_PDF_VIEWER_SUCCESS = 'DPS_GET_JWT_TOKEN_FOR_PDF_VIEWER_SUCCESS';
export const GET_JWT_TOKEN_FOR_PDF_VIEWER_FAIL = 'DPS_GET_JWT_TOKEN_FOR_PDF_VIEWER_FAIL';

export const GET_GLOBAL_SIGNATURE_TEMPLETE = 'DPS_AUTH_SETTING_GET_GLOBAL_SIGNATURE_TEMPLETE';
export const GET_GLOBAL_SIGNATURE_TEMPLETE_SUCCESS = 'DPS_AUTH_SETTING_GET_GLOBAL_SIGNATURE_TEMPLETE_SUCCESS';
export const GET_GLOBAL_SIGNATURE_TEMPLETE_FAIL = 'DPS_AUTH_SETTING_GET_GLOBAL_SIGNATURE_TEMPLETE_FAIL';


export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(public payload: { authInfo: AzureAuthInfo, targetUrl: string, fromCache: boolean }) { }
}

export class LoginFailure implements Action {
  readonly type = LOGIN_FAILURE;
  constructor(public payload: any) { }
}

export class RedirectToAzure implements Action {
  readonly type = REDIRECT_TO_AZURE;
  constructor() { }
}

export class AuthRequired implements Action {
  readonly type = AUTH_REQUIRED;
  constructor(public payload: { redirectRoute: string }) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
  constructor() { }
}

export class ShowSessionExpireDialog implements Action {
  readonly type = SHOW_SESSION_EXPIRE_DIALOG;
  constructor() { }
}

export class ShowRequaredDataErrorDialog implements Action {
  readonly type = SHOW_REQUARED_DATA_ERRORD_IALOG;
  constructor() { }
}

export class HideSessionExpireDialog implements Action {
  readonly type = HIDE_SESSION_EXPIRE_DIALOG;
  constructor() { }
}

export class LoadOrganizerSettings implements Action {
  readonly type = LOAD_ORGANIZER_SETTINGS_AUTH;
  constructor() { }
}

export class LoadOrganizerSettingsSuccess implements Action {
  readonly type = LOAD_ORGANIZER_SETTINGS_SUCCESS_AUTH;
  constructor() { }
}

export class LoadOrganizerSettingsFail implements Action {
  readonly type = LOAD_ORGANIZER_SETTINGS_FAIL_AUTH;
  constructor(payload: { error: any }) { }
}

export class LoadExtensions implements Action {
  readonly type = LOAD_EXTENSIONS_AUTH;
  constructor() { }
}

export class LoadExtensionsSuccess implements Action {
  readonly type = LOAD_EXTENSIONS_SUCCESS_AUTH;
  constructor(public payload: { extensions: any }) { }
}

export class LoadExtensionsFail implements Action {
  readonly type = LOAD_EXTENSIONS_FAIL_AUTH;
  constructor(public payload: { error: any }) { }
}

export class LoadAllExtensionsSuccess implements Action {
  readonly type = LOAD_ALL_EXTENSIONS_SUCCESS_AUTH;
  constructor(public payload: {
    isChaserEnable: boolean, isSignatureAutoAdd: boolean,
    reminderSoundEnable: boolean, newMailSoundEnable: boolean,
    messageFormat: MessageFormat,
    useGlobalSignature: boolean;
  }) {
  }
}

export class UpdateSharedMailBoxes implements Action {
  readonly type = UPDATE_SHARED_MAILBOXES;
  constructor(public payload: Graph.User[]) {
  }
}

export class CheckSignature implements Action {
  readonly type = CHECK_SIGNATURE_AUTH;
  constructor() { }
}

export class CheckSignatureFail implements Action {
  readonly type = CHECK_SIGNATURE_FAIL_AUTH;
  constructor(public payload: { error: any }) { }
}

export class LoadSignature implements Action {
  readonly type = LOAD_SIGNATURE_AUTH;
  constructor(public payload: { signatureUrl: any }) { }
}

export class LoadSignatureSuccess implements Action {
  readonly type = LOAD_SIGNATURE_SUCCESS_AUTH;
  constructor(public payload: { signature: any }) { }
}

export class LoadSignatureFail implements Action {
  readonly type = LOAD_SIGNATURE_FAIL_AUTH;
  constructor(public payload: { error: any }) { }
}

export class UpdateUserFromLocalStorage implements Action {
  readonly type = UPDATE_USER_FROM_LOCAL_STORAGE;
  constructor(public payload: { user: User }) { }
}

export class LoadUserTimeZone implements Action {
  readonly type = LOAD_USER_TIME_ZONE_AUTH;
  constructor() { }
}

export class LoadUserTimeZoneSuccess implements Action {
  readonly type = LOAD_USER_TIME_ZONE_SUCCESS_AUTH;
  constructor(public payload: { userTimeZone: Graph.TimeZoneInformation, value: string }) {
  }
}

export class LoadUserTimeZoneFail implements Action {
  readonly type = LOAD_USER_TIME_ZONE_FAIL_AUTH;
  constructor(public payload: { error: any }) { }
}

export class GetUserGeneralData implements Action {
  readonly type = GET_USER_GENERAL_DATA;
  constructor() { }
}

export class GetUserGeneralDataSuccess implements Action {
  readonly type = GET_USER_GENERAL_DATA_SUCCESS;
  constructor(public payload: GeneralData) {
  }
}

export class GetUserGeneralDataFail implements Action {
  readonly type = GET_USER_GENERAL_DATA_FAIL;
  constructor(public payload: { error: any }) { }
}

export class GetJwtTokenForPDFViewer implements Action {
  readonly type = GET_JWT_TOKEN_FOR_PDF_VIEWER;
  constructor() { }
}

export class GetJwtTokenForPDFViewerSuccess implements Action {
  readonly type = GET_JWT_TOKEN_FOR_PDF_VIEWER_SUCCESS;
  constructor(public payload: string) {
  }
}

export class GetJwtTokenForPDFViewerFail implements Action {
  readonly type = GET_JWT_TOKEN_FOR_PDF_VIEWER_FAIL;
  constructor(public payload: { error: any }) { }
}

export class UpdateProfileImage extends TokenizeAction implements Action {
  readonly type = UPDATE_PROFILE_IMAGE;
  constructor(public token: string, public payload: { image: any }) {
    super(token);
  }
}
export class UpdateProfileImageSuccess extends TokenizeAction implements Action {
  readonly type = UPDATE_PROFILE_IMAGE_SUCCESS;
  constructor(public token: string, public payload: { url: any }) {
    super(token);
  }
}
export class UpdateProfileImageFail extends TokenizeAction implements Action {
  readonly type = UPDATE_PROFILE_IMAGE_FAIL;
  constructor(public token: string, public payload: { error: any }) {
    super(token);
  }
}

export class LoadViewSettingsEWS implements Action {
  readonly type = LOAD_VIEW_SETTINGS_EWS;
  constructor() { }
}

export class LoadViewSettingsEWSSuccess implements Action {
  readonly type = LOAD_VIEW_SETTINGS_EWS_SUCCESS;
  constructor(public payload: { data: { dictionaryKey: string, dictionaryValue: any[] }[] }) { }
}

export class LoadViewSettingsEWSFail implements Action {
  readonly type = LOAD_VIEW_SETTINGS_EWS_FAIL;
  constructor(public payload: { error: any }) { }
}


export class UpdateSelectedCalendars implements Action {
  readonly type = UPDATE_SELECTED_CALENDARS;
  constructor(public payload: { dictionaryValue: any[] }) { }
}

export class UpdateSelectedCalendarsSuccess implements Action {
  readonly type = UPDATE_SELECTED_CALENDARS_SUCCESS;
  constructor(public payload: { dictionaryValue: any[] }) { }
}

export class UpdateSelectedCalendarsFail implements Action {
  readonly type = UPDATE_SELECTED_CALENDARS_FAIL;
  constructor(public payload: { error: any }) { }
}


export class GetEmailReadingPaneMode implements Action {
  readonly type = GET_EMAIL_READING_PANEMODE;
  constructor() { }
}
export class GetEmailReadingPaneModeSuccess implements Action {
  readonly type = GET_EMAIL_READING_PANEMODE_SUCCESS;
  constructor(public payload: { mode: ReadingPaneMode }) { }
}
export class GetEmailReadingPaneModeFail implements Action {
  readonly type = GET_EMAIL_READING_PANEMODE_FAIL;
  constructor(public payload: { error: any }) { }
}

export class LoadTenentValidated implements Action {
  readonly type = GET_TENENT_VALIDATED;
  constructor() { }
}

export class LoadTenentValidatedSuccess implements Action {
  readonly type = GET_TENENT_VALIDATED_SUCCESS;
  constructor(public payLoad: { tenentValidated: TenentValidated }) { }
}

export class LoadTenentValidatedFail implements Action {
  readonly type = GET_TENENT_VALIDATED_FAIL;
  constructor(public payLoad: { tenentValidated: TenentValidated }) { }
}


export class GetGlobalSignatureTemplete implements Action {
  readonly type = GET_GLOBAL_SIGNATURE_TEMPLETE;
  constructor() {
  }
}

export class GetGlobalSignatureTempleteSuccess implements Action {
  readonly type = GET_GLOBAL_SIGNATURE_TEMPLETE_SUCCESS;
  constructor(public templete: string) {
  }
}

export class GetGlobalSignatureTempleteFail implements Action {
  readonly type = GET_GLOBAL_SIGNATURE_TEMPLETE_FAIL;
  constructor() {
  }
}

export type Any = RedirectToAzure | LoginSuccess | LoginFailure | AuthRequired |
  LoadUserTimeZone | LoadUserTimeZoneSuccess | LoadUserTimeZoneFail |
  LoadSignature | LoadSignatureSuccess | LoadSignatureFail |
  CheckSignature | CheckSignatureFail |
  LoadExtensions | LoadExtensionsSuccess | LoadExtensionsFail | LoadAllExtensionsSuccess |
  LoadOrganizerSettings | LoadOrganizerSettingsSuccess | LoadOrganizerSettingsFail | UpdateUserFromLocalStorage |
  UpdateProfileImage | UpdateProfileImageSuccess | UpdateProfileImageFail |
  LoadViewSettingsEWS | LoadViewSettingsEWSSuccess | LoadViewSettingsEWSFail |
  UpdateSelectedCalendars | UpdateSelectedCalendarsSuccess | UpdateSelectedCalendarsFail |
  ShowSessionExpireDialog | HideSessionExpireDialog | GetEmailReadingPaneModeSuccess | GetJwtTokenForPDFViewerSuccess |
  LoadTenentValidated | LoadTenentValidatedSuccess | LoadTenentValidatedFail |
  GetUserGeneralDataSuccess | UpdateSharedMailBoxes | GetUserGeneralDataFail |
  GetGlobalSignatureTemplete | GetGlobalSignatureTempleteSuccess | GetGlobalSignatureTempleteFail;
