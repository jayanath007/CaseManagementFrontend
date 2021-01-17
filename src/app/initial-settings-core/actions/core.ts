import { State } from '../reducers';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { InitialSettingsState } from '../reducers/initial-settings';
import { TimeZoneInformation, LocaleInfo } from '../../core/lib/microsoft-graph';

export const INIT_INITIAL_SETTINGS = 'INIT_INITIAL_SETTINGS';
export const INIT_INITIAL_SETTINGS_SUCCESS = 'INIT_INITIAL_SETTINGS_SUCCESS';
export const INIT_INITIAL_SETTINGS_FAIL = 'INIT_INITIAL_SETTINGS_FAIL';

export const LOAD_INITIAL_SETTINGS_TIME_ZONES = 'LOAD_INITIAL_SETTINGS_TIME_ZONES';
export const LOAD_INITIAL_SETTINGS_TIME_ZONES_SUCCESS = 'LOAD_INITIAL_SETTINGS_TIME_ZONES_SUCCESS';
export const LOAD_INITIAL_SETTINGS_TIME_ZONES_FAIL = 'LOAD_INITIAL_SETTINGS_TIME_ZONES_FAIL';

export const LOAD_INITIAL_SETTINGS_USER_TIME_ZONE = 'LOAD_INITIAL_SETTINGS_USER_TIME_ZONE';
export const LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_SUCCESS = 'LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_SUCCESS';
export const LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_FAIL = 'LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_FAIL';

export const LOAD_INITIAL_SETTINGS_LANGUAGES = 'LOAD_INITIAL_SETTINGS_LANGUAGES';
export const LOAD_INITIAL_SETTINGS_LANGUAGES_SUCCESS = 'LOAD_INITIAL_SETTINGS_LANGUAGES_SUCCESS';
export const LOAD_INITIAL_SETTINGS_LANGUAGES_FAIL = 'LOAD_INITIAL_SETTINGS_LANGUAGES_FAIL';

export const LOAD_INITIAL_SETTINGS_USER_LANGUAGE = 'LOAD_INITIAL_SETTINGS_USER_LANGUAGE';
export const LOAD_INITIAL_SETTINGS_USER_LANGUAGE_SUCCESS = 'LOAD_INITIAL_SETTINGS_USER_LANGUAGE_SUCCESS';
export const LOAD_INITIAL_SETTINGS_USER_LANGUAGE_FAIL = 'LOAD_INITIAL_SETTINGS_USER_LANGUAGE_FAIL';


export const CHANGE_INITIAL_SETTINGS_USER_TIME_ZONE = 'CHANGE_INITIAL_SETTINGS_USER_TIME_ZONE';
export const CHANGE_INITIAL_SETTINGS_USER_LANGUAGE = 'CHANGE_INITIAL_SETTINGS_USER_LANGUAGE';


export const INITIAL_SETTINGS_SUBMIT = 'INITIAL_SETTINGS_SUBMIT';
export const INITIAL_SETTINGS_SUBMIT_FAIL = 'INITIAL_SETTINGS_SUBMIT_FAIL';

export const UPDATE_INITIAL_SETTINGS = 'UPDATE_INITIAL_SETTINGS';
export const UPDATE_INITIAL_SETTINGS_SUCCESS = 'UPDATE_INITIAL_SETTINGS_SUCCESS';
export const UPDATE_INITIAL_SETTINGS_FAIL = 'UPDATE_INITIAL_SETTINGS_FAIL';

// export const NO_UPDATE_NEED = 'NO_UPDATE_NEED';

export const INITIAL_SETTINGS_CLEAR_STATE = 'INITIAL_SETTINGS_CLEAR_STATE';

export class InitInitialSettings extends TokenizeAction implements Action {
    readonly type = INIT_INITIAL_SETTINGS;
    constructor(public token: string) {
        super(token);
    }
}

export class InitInitialSettingsSuccess extends TokenizeAction implements Action {
    readonly type = INIT_INITIAL_SETTINGS_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class InitInitialSettingsFail extends TokenizeAction implements Action {
    readonly type = INIT_INITIAL_SETTINGS_FAIL;
    constructor(public token: string, payload: { error: any }) {
        super(token);
    }
}


export class LoadInitialSettingsTimeZones extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_TIME_ZONES;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadInitialSettingsTimeZonesSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_TIME_ZONES_SUCCESS;
    constructor(public token: string, public payload: { timeZones: TimeZoneInformation[] }) {
        super(token);
    }
}

export class LoadInitialSettingsTimeZonesFail extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_TIME_ZONES_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadInitialSettingsUserTimeZone extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_USER_TIME_ZONE;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadInitialSettingsUserTimeZoneSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_SUCCESS;
    constructor(public token: string, public payload: { userTimeZone: string }) {
        super(token);
    }
}

export class LoadInitialSettingsUserTimeZoneFail extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_USER_TIME_ZONE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadInitialSettingsLanguages extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_LANGUAGES;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadInitialSettingsLanguagesSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_LANGUAGES_SUCCESS;
    constructor(public token: string, public payload: { languages: LocaleInfo[] }) {
        super(token);
    }
}

export class LoadInitialSettingsLanguagesFail extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_LANGUAGES_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadInitialSettingsUserLanguage extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_USER_LANGUAGE;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadInitialSettingsUserLanguageSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_USER_LANGUAGE_SUCCESS;
    constructor(public token: string, public payload: { language: LocaleInfo }) {
        super(token);
    }
}

export class LoadInitialSettingsUserLanguageFail extends TokenizeAction implements Action {
    readonly type = LOAD_INITIAL_SETTINGS_USER_LANGUAGE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangeInitialSettingsUserTimeZone extends TokenizeAction implements Action {
    readonly type = CHANGE_INITIAL_SETTINGS_USER_TIME_ZONE;
    constructor(public token: string, public payload: { value: string }) {
        super(token);
    }
}

export class ChangeInitialSettingsUserLanguage extends TokenizeAction implements Action {
    readonly type = CHANGE_INITIAL_SETTINGS_USER_LANGUAGE;
    constructor(public token: string, public payload: { value: string }) {
        super(token);
    }
}

export class InitialSettingsSubmit extends TokenizeAction implements Action {
    readonly type = INITIAL_SETTINGS_SUBMIT;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateInitialSettings extends TokenizeAction implements Action {
    readonly type = UPDATE_INITIAL_SETTINGS;
    constructor(public token: string, public payload: { currentState: InitialSettingsState }) {
        super(token);
    }
}

export class UpdateInitialSettingsSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_INITIAL_SETTINGS_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateInitialSettingsFail extends TokenizeAction implements Action {
    readonly type = UPDATE_INITIAL_SETTINGS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class InitialSettingsSubmitFail extends TokenizeAction implements Action {
    readonly type = INITIAL_SETTINGS_SUBMIT_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

// export class NoUpdateNeed extends TokenizeAction implements Action {
//     readonly type = NO_UPDATE_NEED;
//     constructor(public token: string) {
//         super(token);
//     }
// }

export class InitialSettingsClearState extends TokenizeAction implements Action {
    readonly type = INITIAL_SETTINGS_CLEAR_STATE;
    constructor(public token: string) {
        super(token);
    }
}


export type Any = InitInitialSettings | InitInitialSettingsSuccess | InitInitialSettingsFail |
    LoadInitialSettingsTimeZones | LoadInitialSettingsTimeZonesSuccess | LoadInitialSettingsTimeZonesFail |
    LoadInitialSettingsUserTimeZone | LoadInitialSettingsUserTimeZoneSuccess | LoadInitialSettingsUserTimeZoneFail |
    LoadInitialSettingsLanguages | LoadInitialSettingsLanguagesSuccess | LoadInitialSettingsLanguagesFail |
    LoadInitialSettingsUserLanguage | LoadInitialSettingsUserLanguageSuccess | LoadInitialSettingsUserLanguageFail |
    ChangeInitialSettingsUserTimeZone | ChangeInitialSettingsUserLanguage |
    InitialSettingsSubmit | InitialSettingsSubmitFail |
    UpdateInitialSettings | UpdateInitialSettingsSuccess | UpdateInitialSettingsFail |
    InitialSettingsClearState;

