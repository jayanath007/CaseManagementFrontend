import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';

export interface State {
    readonly [token: string]: AppSettingsState;
}

export interface AppSettingsState {
    readonly loading: boolean;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.INIT_APP_SETTINGS:
            temp[action.token] = getInitViewData();
            return { ...state, ...temp };
        case Actions.INIT_APP_SETTINGS_SUCCESS:
            temp[action.token] = getInitViewData();
            return { ...state, ...temp };
        case Actions.INIT_APP_SETTINGS_FAIL:
            temp[action.token] = getInitViewData();
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function getInitViewData() {

}

export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
