import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { OrganizerSettingsState } from '../reducers/organizer-settings';
import { TimeZoneInformation, AutomaticRepliesSetting } from '../../core/lib/microsoft-graph';
import { MessageFormat } from '../../auth';

export const INIT_ORGANIZER_SETTINGS = 'INIT_ORGANIZER_SETTINGS';
export const INIT_ORGANIZER_SETTINGS_SUCCESS = 'INIT_ORGANIZER_SETTINGS_INIT_ORGANIZER_SETTINGS_SUCCESS';
export const INIT_ORGANIZER_SETTINGS_FAIL = 'INIT_ORGANIZER_SETTINGS_INIT_ORGANIZER_SETTINGS_FAIL';

export const LOAD_EXTENSIONS = 'INIT_ORGANIZER_SETTINGS_LOAD_EXTENSIONS';
export const LOAD_EXTENSIONS_SUCCESS = 'INIT_ORGANIZER_SETTINGS_LOAD_EXTENSIONS_SUCCESS';
export const LOAD_EXTENSIONS_FAIL = 'INIT_ORGANIZER_SETTINGS_LOAD_EXTENSIONS_FAIL';


export const CHECK_SIGNATURE = 'INIT_ORGANIZER_SETTINGS_CHECK_SIGNATURE';
export const CHECK_SIGNATURE_SUCCESS = 'INIT_ORGANIZER_SETTINGS_CHECK_SIGNATURE_SUCCESS';
export const CHECK_SIGNATURE_FAIL = 'INIT_ORGANIZER_SETTINGS_CHECK_SIGNATURE_FAIL';

export const LOAD_SIGNATURE = 'INIT_ORGANIZER_SETTINGS_LOAD_SIGNATURE';
export const LOAD_SIGNATURE_SUCCESS = 'INIT_ORGANIZER_SETTINGS_LOAD_SIGNATURE_SUCCESS';
export const LOAD_SIGNATURE_FAIL = 'INIT_ORGANIZER_SETTINGS_LOAD_SIGNATURE_FAIL';

export const LOAD_TIME_ZONES = 'INIT_ORGANIZER_SETTINGS_LOAD_TIME_ZONES';
export const LOAD_TIME_ZONES_SUCCESS = 'INIT_ORGANIZER_SETTINGS_LOAD_TIME_ZONES_SUCCESS';
export const LOAD_TIME_ZONES_FAIL = 'INIT_ORGANIZER_SETTINGS_LOAD_TIME_ZONES_FAIL';

export const LOAD_AUTOMATIC_REPLIES_SETTING = 'INIT_ORGANIZER_SETTINGS_LOAD_AUTOMATIC_REPLIES_SETTING';
export const LOAD_AUTOMATIC_REPLIES_SETTING_SUCCESS = 'INIT_ORGANIZER_SETTINGS_LOAD_AUTOMATIC_REPLIES_SETTING_SUCCESS';
export const LOAD_AUTOMATIC_REPLIES_SETTING_FAIL = 'INIT_ORGANIZER_SETTINGS_LOAD_AUTOMATIC_REPLIES_SETTING_FAIL';

export const LOAD_USER_TIME_ZONE = 'INIT_ORGANIZER_SETTINGS_LOAD_USER_TIME_ZONE';
export const LOAD_USER_TIME_ZONE_SUCCESS = 'INIT_ORGANIZER_SETTINGS_LOAD_USER_TIME_ZONE_SUCCESS';
export const LOAD_USER_TIME_ZONE_FAIL = 'INIT_ORGANIZER_SETTINGS_LOAD_USER_TIME_ZONE_FAIL';

export const CHANGE_IS_CHASER_DESABLE = 'INIT_ORGANIZER_SETTINGS_CHANGE_IS_CHASER_DESABLE';
export const CHANGE_IS_AUTO_SIGNATURE_ADD = 'INIT_ORGANIZER_SETTINGS_CHANGE_IS_AUTO_SIGNATURE_ADD';
export const CHANGE_USER_TIME_ZONE = 'INIT_ORGANIZER_SETTINGS_CHANGE_USER_TIME_ZONE';
export const CHANGE_AUTOMATIC_REPLIES_SETTING = 'INIT_ORGANIZER_SETTINGS_CHANGE_AUTOMATIC_REPLIES_SETTING';
export const CHANGE_SIGNATURE = 'INIT_ORGANIZER_SETTINGS_CHANGE_SIGNATURE';



export const SUBMIT = 'INIT_ORGANIZER_SETTINGS_SUBMIT';
export const CREATE_EXTENSIONS = 'INIT_ORGANIZER_SETTINGS_CREATE_EXTENSIONS';
export const CREATE_EXTENSIONS_SUCCESS = 'INIT_ORGANIZER_SETTINGS_CREATE_EXTENSIONS_SUCCESS';
export const CREATE_EXTENSIONS_FAIL = 'INIT_ORGANIZER_SETTINGS_CREATE_EXTENSIONS_FAIL';

export const UPDATE_EXTENSIONS = 'INIT_ORGANIZER_SETTINGS_UPDATE_EXTENSIONS';
export const UPDATE_EXTENSIONS_SUCCESS = 'INIT_ORGANIZER_SETTINGS_UPDATE_EXTENSIONS_SUCCESS';
export const UPDATE_EXTENSIONS_FAIL = 'INIT_ORGANIZER_SETTINGS_UPDATE_EXTENSIONS_FAIL';

export const CREATE_SIGNATURE = 'INIT_ORGANIZER_SETTINGS_CREATE_SIGNATURE';
export const CREATE_SIGNATURE_SUCCESS = 'INIT_ORGANIZER_SETTINGS_CREATE_SIGNATURE_SUCCESS';
export const CREATE_SIGNATURE_FAIL = 'INIT_ORGANIZER_SETTINGS_CREATE_SIGNATURE_FAIL';

export const UPDATE_SIGNATURE = 'INIT_ORGANIZER_SETTINGS_UPDATE_SIGNATURE';
export const UPDATE_SIGNATURE_SUCCESS = 'INIT_ORGANIZER_SETTINGS_UPDATE_SIGNATURE_SUCCESS';
export const UPDATE_SIGNATURE_FAIL = 'INIT_ORGANIZER_SETTINGS_UPDATE_SIGNATURE_FAIL';

export const REPLACE_SIGNATURE_BY_TOOL = 'INIT_ORGANIZER_SETTINGS_REPLACE_SIGNATURE_BY_TOOL';

export const UPDATE_USER_TIME_ZONE = 'INIT_ORGANIZER_SETTINGS_UPDATE_USER_TIME_ZONE';
export const UPDATE_USER_TIME_ZONE_SUCCESS = 'INIT_ORGANIZER_SETTINGS_UPDATE_USER_TIME_ZONE_SUCCESS';
export const UPDATE_USER_TIME_ZONE_FAIL = 'INIT_ORGANIZER_SETTINGS_UPDATE_USER_TIME_ZONE_FAIL';

export const UPDATE_AUTOMATIC_REPLIES_SETTING = 'INIT_ORGANIZER_SETTINGS_UPDATE_AUTOMATIC_REPLIES_SETTING';
export const UPDATE_AUTOMATIC_REPLIES_SETTING_SUCCESS = 'INIT_ORGANIZER_SETTINGS_UPDATE_AUTOMATIC_REPLIES_SETTING_SUCCESS';
export const UPDATE_AUTOMATIC_REPLIES_SETTING_FAIL = 'INIT_ORGANIZER_SETTINGS_UPDATE_AUTOMATIC_REPLIES_SETTING_FAIL';

export const NO_UPDATE_NEED = 'INIT_ORGANIZER_SETTINGS_NO_UPDATE_NEED';

export const ORG_SETTINGS_CLEAR_STATE = 'INIT_ORGANIZER_SETTINGS_ORG_SETTINGS_CLEAR_STATE';

export const ORG_SETTINGS_UPDATE_FAIL = 'INIT_ORGANIZER_SETTINGS_ORG_SETTINGS_UPDATE_FAIL';

export const CHANGE_REMINDER_SOUND_ENABLE = 'INIT_ORGANIZER_SETTINGS_CHANGE_REMINDER_SOUND_ENABLE';
export const CHANGE_NEW_MAIL_SOUND_ENABLE = 'INIT_ORGANIZER_SETTINGS_CHANGE_NEW_MAIL_SOUND_ENABLE';
export const CHANGE_MESSAGE_FORMAT = 'INIT_ORGANIZER_SETTINGS_CHANGE_MESSAGE_FORMAT';

export const CHANGE_USE_GLOBAL_SIGNATURE = 'ORG_SETTING_CHANGE_USE_GLOBAL_SIGNATURE';
export const CHANGE_GLOBAL_SIGNATURE_TEMPLETE = 'ORG_SETTING_CHANGE_GLOBAL_SIGNATURE_TEMPLETE';
export const CHANGE_GLOBAL_SIGNATURE_TEMPLETE_SUCCESS = 'ORG_SETTING_CHANGE_GLOBAL_SIGNATURE_TEMPLETE_SUCCESS';
export const CHANGE_GLOBAL_SIGNATURE_TEMPLETE_FAIL = 'ORG_SETTING_CHANGE_GLOBAL_SIGNATURE_TEMPLETE_FAIL';


export class InitOrganizerSettings extends TokenizeAction implements Action {
    readonly type = INIT_ORGANIZER_SETTINGS;
    constructor(public token: string) {
        super(token);
    }
}

export class InitOrganizerSettingsSuccess extends TokenizeAction implements Action {
    readonly type = INIT_ORGANIZER_SETTINGS_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class InitOrganizerSettingsFail extends TokenizeAction implements Action {
    readonly type = INIT_ORGANIZER_SETTINGS_FAIL;
    constructor(public token: string, payload: { error: any }) {
        super(token);
    }
}

export class LoadExtensions extends TokenizeAction implements Action {
    readonly type = LOAD_EXTENSIONS;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadExtensionsSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_EXTENSIONS_SUCCESS;
    constructor(public token: string, public payload: { extensions: any }) {
        super(token);
    }
}

export class LoadExtensionsFail extends TokenizeAction implements Action {
    readonly type = LOAD_EXTENSIONS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class CheckSignature extends TokenizeAction implements Action {
    readonly type = CHECK_SIGNATURE;
    constructor(public token: string) {
        super(token);
    }
}

// export class CheckSignatureSuccess extends TokenizeAction implements Action {
//     readonly type = CHECK_SIGNATURE_SUCCESS;
//     constructor(public token: string, public payload: { signatureUrl: any }) {
//         super(token);
//     }
// }

export class CheckSignatureFail extends TokenizeAction implements Action {
    readonly type = CHECK_SIGNATURE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadSignature extends TokenizeAction implements Action {
    readonly type = LOAD_SIGNATURE;
    constructor(public token: string, public payload: { signatureUrl: string }) {
        super(token);
    }
}

export class LoadSignatureSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SIGNATURE_SUCCESS;
    constructor(public token: string, public payload: { signature: string }) {
        super(token);
    }
}

export class LoadSignatureFail extends TokenizeAction implements Action {
    readonly type = LOAD_SIGNATURE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangeIsChaserDesable extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_CHASER_DESABLE;
    constructor(public token: string, public payload: { value: boolean }) {
        super(token);
    }
}
export class ChangeReminderSoundEnable extends TokenizeAction implements Action {
    readonly type = CHANGE_REMINDER_SOUND_ENABLE;
    constructor(public token: string, public payload: { value: boolean }) {
        super(token);
    }
}
export class ChangeNewMailSoundEnable extends TokenizeAction implements Action {
    readonly type = CHANGE_NEW_MAIL_SOUND_ENABLE;
    constructor(public token: string, public payload: { value: boolean }) {
        super(token);
    }
}

export class ChangeIsAutoSignatureAdd extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_AUTO_SIGNATURE_ADD;
    constructor(public token: string, public payload: { value: boolean }) {
        super(token);
    }
}

export class ChangeSignature extends TokenizeAction implements Action {
    readonly type = CHANGE_SIGNATURE;
    constructor(public token: string, public payload: { value: string }) {
        super(token);
    }
}

export class ChangeUserTimeZone extends TokenizeAction implements Action {
    readonly type = CHANGE_USER_TIME_ZONE;
    constructor(public token: string, public payload: { value: string }) {
        super(token);
    }
}
export class ChangeAutomaticRepliesSetting extends TokenizeAction implements Action {
    readonly type = CHANGE_AUTOMATIC_REPLIES_SETTING;
    constructor(public token: string, public payload: { value: AutomaticRepliesSetting }) {
        super(token);
    }
}
export class ChangeMessageFormat extends TokenizeAction implements Action {
    readonly type = CHANGE_MESSAGE_FORMAT;
    constructor(public token: string, public payload: { value: MessageFormat }) {
        super(token);
    }
}
export class Submit extends TokenizeAction implements Action {
    readonly type = SUBMIT;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateExtensions extends TokenizeAction implements Action {
    readonly type = UPDATE_EXTENSIONS;
    constructor(public token: string, public payload: { currentState: OrganizerSettingsState }) {
        super(token);
    }
}

export class UpdateExtensionsSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_EXTENSIONS_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateExtensionsFail extends TokenizeAction implements Action {
    readonly type = UPDATE_EXTENSIONS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class UpdateSignature extends TokenizeAction implements Action {
    readonly type = UPDATE_SIGNATURE;
    constructor(public token: string, public payload: { currentState: OrganizerSettingsState }) {
        super(token);
    }
}

export class UpdateSignatureSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_SIGNATURE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateSignatureFail extends TokenizeAction implements Action {
    readonly type = UPDATE_SIGNATURE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ReplaceSignatureByTool extends TokenizeAction implements Action {
    readonly type = REPLACE_SIGNATURE_BY_TOOL;
    constructor(public token: string, public payload: { signature: string }) {
        super(token);
    }
}

export class CreateSignature extends TokenizeAction implements Action {
    readonly type = CREATE_SIGNATURE;
    constructor(public token: string, public payload: { currentState: OrganizerSettingsState }) {
        super(token);
    }
}

export class CreateSignatureSuccess extends TokenizeAction implements Action {
    readonly type = CREATE_SIGNATURE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class CreateSignatureFail extends TokenizeAction implements Action {
    readonly type = CREATE_SIGNATURE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class UpdateTimeZone extends TokenizeAction implements Action {
    readonly type = UPDATE_USER_TIME_ZONE;
    constructor(public token: string, public payload: { currentState: OrganizerSettingsState }) {
        super(token);
    }
}

export class UpdateTimeZoneSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_USER_TIME_ZONE_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateTimeZoneFail extends TokenizeAction implements Action {
    readonly type = UPDATE_USER_TIME_ZONE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class UpdateAutomaticRepliesSetting extends TokenizeAction implements Action {
    readonly type = UPDATE_AUTOMATIC_REPLIES_SETTING;
    constructor(public token: string, public payload: { currentState: OrganizerSettingsState }) {
        super(token);
    }
}

export class UpdateAutomaticRepliesSettingSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_AUTOMATIC_REPLIES_SETTING_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateAutomaticRepliesSettingFail extends TokenizeAction implements Action {
    readonly type = UPDATE_AUTOMATIC_REPLIES_SETTING_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class CreateExtensions extends TokenizeAction implements Action {
    readonly type = CREATE_EXTENSIONS;
    constructor(public token: string, public payload: { currentState: OrganizerSettingsState }) {
        super(token);
    }
}

export class CreateExtensionsSuccess extends TokenizeAction implements Action {
    readonly type = CREATE_EXTENSIONS_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class CreateExtensionsFail extends TokenizeAction implements Action {
    readonly type = CREATE_EXTENSIONS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadTimeZones extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_ZONES;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadTimeZonesSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_ZONES_SUCCESS;
    constructor(public token: string, public payload: { timeZones: TimeZoneInformation[] }) {
        super(token);
    }
}

export class LoadTimeZonesFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_ZONES_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class LoadAutomaticRepliesSetting extends TokenizeAction implements Action {
    readonly type = LOAD_AUTOMATIC_REPLIES_SETTING;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadAutomaticRepliesSettingSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_AUTOMATIC_REPLIES_SETTING_SUCCESS;
    constructor(public token: string, public payload: { automaticRepliesSetting: AutomaticRepliesSetting }) {
        super(token);
    }
}

export class LoadAutomaticRepliesSettingFail extends TokenizeAction implements Action {
    readonly type = LOAD_AUTOMATIC_REPLIES_SETTING_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class LoadUserTimeZone extends TokenizeAction implements Action {
    readonly type = LOAD_USER_TIME_ZONE;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadUserTimeZoneSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_USER_TIME_ZONE_SUCCESS;
    constructor(public token: string, public payload: { userTimeZone: string }) {
        super(token);
    }
}

export class LoadUserTimeZoneFail extends TokenizeAction implements Action {
    readonly type = LOAD_USER_TIME_ZONE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class NoUpdateNeed extends TokenizeAction implements Action {
    readonly type = NO_UPDATE_NEED;
    constructor(public token: string) {
        super(token);
    }
}

export class ClearState extends TokenizeAction implements Action {
    readonly type = ORG_SETTINGS_CLEAR_STATE;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateFail extends TokenizeAction implements Action {
    readonly type = ORG_SETTINGS_UPDATE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangeUseGlobalSignature extends TokenizeAction implements Action {
    readonly type = CHANGE_USE_GLOBAL_SIGNATURE;
    constructor(public token: string, public payload: { value: boolean }) {
        super(token);
    }
}

export class ChangeGlobalSignatureTemplete extends TokenizeAction implements Action {
    readonly type = CHANGE_GLOBAL_SIGNATURE_TEMPLETE;
    constructor(public token: string, public templete: string) {
        super(token);
    }
}

export class ChangeGlobalSignatureTempleteSuccess extends TokenizeAction implements Action {
    readonly type = CHANGE_GLOBAL_SIGNATURE_TEMPLETE_SUCCESS;
    constructor(public token: string, public templete: string) {
        super(token);
    }
}

export class ChangeGlobalSignatureTempleteFail extends TokenizeAction implements Action {
    readonly type = CHANGE_GLOBAL_SIGNATURE_TEMPLETE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}





export type Any = InitOrganizerSettings | InitOrganizerSettingsSuccess | InitOrganizerSettingsFail |
    LoadExtensions | LoadExtensionsSuccess | LoadExtensionsFail |
    CheckSignature | CheckSignatureFail |
    LoadSignature | LoadSignatureSuccess | LoadSignatureFail |
    LoadTimeZones | LoadTimeZonesSuccess | LoadTimeZonesFail |
    LoadUserTimeZone | LoadUserTimeZoneSuccess | LoadUserTimeZoneFail |
    ChangeIsChaserDesable | ChangeIsAutoSignatureAdd | ChangeUserTimeZone | ChangeSignature |
    Submit |
    UpdateExtensions | UpdateExtensionsSuccess | UpdateExtensionsFail |
    UpdateSignature | UpdateSignatureSuccess | UpdateSignatureFail |
    ReplaceSignatureByTool |
    CreateExtensions | CreateExtensionsSuccess | CreateExtensionsFail |
    UpdateTimeZone | UpdateTimeZoneSuccess | UpdateTimeZoneFail |
    NoUpdateNeed |
    ClearState | UpdateFail | LoadAutomaticRepliesSetting | LoadAutomaticRepliesSettingSuccess | LoadAutomaticRepliesSettingFail |
    UpdateAutomaticRepliesSetting | UpdateAutomaticRepliesSettingSuccess | UpdateAutomaticRepliesSettingFail |
    ChangeAutomaticRepliesSetting | ChangeReminderSoundEnable | ChangeNewMailSoundEnable | ChangeMessageFormat |
    ChangeUseGlobalSignature | ChangeGlobalSignatureTemplete | ChangeGlobalSignatureTempleteSuccess | ChangeGlobalSignatureTempleteFail;



