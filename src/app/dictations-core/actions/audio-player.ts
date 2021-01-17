import { Action } from '@ngrx/store';
export const INIT_AUDIO_PLAYER = 'DPS_INIT_DICTATION_AUDIO_PLAYER';
export const GET_AUDIO_URL = 'DPS_GET_DICTATION_AUDIO_URL';
export const GET_AUDIO_URL_SUCCESS = 'DPS_GET_DICTATION_AUDIO_URL_SUCCESS';
export const GET_AUDIO_URL_FAIL = 'DPS_GET_DICTATION_AUDIO_URL_FAIL';
export const SAVE_JOB = 'DPS_SAVE_JOB';
export const SAVE_JOB_SUCCESS = 'DPS_SAVE_JOB_SUCCESS';
export const SAVE_JOB_FAIL = 'DPS_SAVE_JOB_FAIL';
export const SET_AUDIO_URL = 'DPS_SET_AUDIO_URL';

export class InitAudioPlayer implements Action {
    readonly type = INIT_AUDIO_PLAYER;
    constructor(public jobId: number) { }
}

export class GetAudioUrl implements Action {
    readonly type = GET_AUDIO_URL;
    constructor(public jobId: number) { }
}
export class GetAudioUrlSuccess implements Action {
    readonly type = GET_AUDIO_URL_SUCCESS;
    constructor(public payload: any) { }
}
export class GetAudioUrlFail implements Action {
    readonly type = GET_AUDIO_URL_FAIL;
    constructor(public error: any) { }
}

export class SaveJob implements Action {
    readonly type = SAVE_JOB;
    constructor(public jobId: number) { }
}
export class SaveJobSuccess implements Action {
    readonly type = SAVE_JOB_SUCCESS;
    constructor(public payload: any) { }
}
export class SaveJobFail implements Action {
    readonly type = SAVE_JOB_FAIL;
    constructor(public error: any) { }
}

export class SetAudioUrl implements Action {
    readonly type = SET_AUDIO_URL;
    constructor(public payload: any) { }
}

export type Any = InitAudioPlayer | GetAudioUrl | GetAudioUrlSuccess | GetAudioUrlFail |
SaveJob | SaveJobSuccess | SaveJobFail | SetAudioUrl;
