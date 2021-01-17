
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { OrganizerSignatureState } from '../reducers/organizer-signature';

export const INIT_SIGNATURE_PROPERTIES = 'INIT_SIGNATURE_PROPERTIES';

export const LOAD_LOGO = 'LOAD_LOGO';
export const LOAD_LOGO_SUCCESS = 'LOAD_LOGO_SUCCESS';
export const LOAD_LOGO_FAIL = 'LOAD_LOGO_FAIL';

export const CHANGE_SIGNATURE_TEMPLATE = 'CHANGE_SIGNATURE_TEMPLATE';

export const SUBMIT_SIGNATURE = 'SUBMIT_SIGNATURE';
export const USER_SIGNATURE_CLEAR_STATE = 'USER_SIGNATURE_CLEAR_STATE';


export class InitSignatureProperties extends TokenizeAction implements Action {
    readonly type = INIT_SIGNATURE_PROPERTIES;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadLogo extends TokenizeAction implements Action {
    readonly type = LOAD_LOGO;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadLogoSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_LOGO_SUCCESS;
    constructor(public token: string, public payload: { logo: any }) {
        super(token);
    }
}

export class LoadLogoFail extends TokenizeAction implements Action {
    readonly type = LOAD_LOGO_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangeSignatureTemplate extends TokenizeAction implements Action {
    readonly type = CHANGE_SIGNATURE_TEMPLATE;
    constructor(public token: string, public payload: { value: string }) {
        super(token);
    }
}

export class SubmitSignature extends TokenizeAction implements Action {
    readonly type = SUBMIT_SIGNATURE;
    constructor(public token: string) {
        super(token);
    }
}

export class UserSignatureClearState extends TokenizeAction implements Action {
    readonly type = USER_SIGNATURE_CLEAR_STATE;
    constructor(public token: string) {
        super(token);
    }
}

export type Any = LoadLogo | LoadLogoSuccess | LoadLogoFail |
    ChangeSignatureTemplate |
    SubmitSignature | UserSignatureClearState;
