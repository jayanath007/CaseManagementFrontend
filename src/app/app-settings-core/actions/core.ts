import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';



export const INIT_APP_SETTINGS = 'INIT_APP_SETTINGS';
export const INIT_APP_SETTINGS_SUCCESS = 'INIT_APP_SETTINGS';
export const INIT_APP_SETTINGS_FAIL = 'INIT_APP_SETTINGS';


export class InitAppSettings extends TokenizeAction implements Action {
    readonly type = INIT_APP_SETTINGS;
    constructor(public token: string) {
        super(token);
    }
}

export class InitAppSettingsSuccess extends TokenizeAction implements Action {
    readonly type = INIT_APP_SETTINGS_SUCCESS;
    constructor(public token: string, payload: { isChaserEnable: any }) {
        super(token);
    }
}

export class InitAppSettingsFail extends TokenizeAction implements Action {
    readonly type = INIT_APP_SETTINGS_SUCCESS;
    constructor(public token: string, payload: { error: any }) {
        super(token);
    }
}

export type Any = InitAppSettings | InitAppSettingsSuccess | InitAppSettingsFail;

