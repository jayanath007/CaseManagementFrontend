
import * as Actions from '../actions/audio-player';
import { createSelector } from '@ngrx/store';

export interface State {
    url: string;
    time: number;
    loading: boolean;
}
const initialState: State = {
    url: null,
    time: null,
    loading: false
};

export function reducer(state: State = initialState, action: Actions.Any): State {
    switch (action.type) {
        case Actions.INIT_AUDIO_PLAYER:
            return { ...state, url: null, time: null, loading: true };
        case Actions.SET_AUDIO_URL:
            return { ...state, url: action.payload, time: 0 , loading: false};
            case Actions.SAVE_JOB:
                return { ...state, loading: true };
                case Actions.SAVE_JOB_SUCCESS:
                    return { ...state, loading: false };
        default:
            { return state; }
    }
}

export const getState = (state: State) => state;
export const getUrl = createSelector(getState, (states) => states.url);
export const getTime = createSelector(getState, (states) => states.time);
export const getLoading = createSelector(getState, (states) => states.loading);  // !(states.url || states.time));
