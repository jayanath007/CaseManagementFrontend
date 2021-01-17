
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { CurrentActivitySum } from '../../team-efficiency-core/models/interfaces';
import { UrlData } from '../models/interfaces';

export interface State {
    readonly loading: boolean;
    readonly data: UrlData[];
}

const initialState: State = {
    loading: false,
    data: null
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_HELP_VIDEO_WIDGET: {
            return { ...state, loading: false };
        }
        case Actions.LOAD_COUNTRY_SIDE_URLS_WIDGET: {
            return { ...state, loading: true };
        }
        case Actions.LOAD_COUNTRY_SIDE_URLS_WIDGET_SUCCESS: {
            return { ...state, loading: false, data: action.urlList };
        }
        case Actions.LOAD_COUNTRY_SIDE_URLS_WIDGET_FAIL: {
            return { ...state, loading: false };
        } default: {
            return state;
        }
    }
}

export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (help) => help.loading);
export const getData = () => createSelector(getView, (help) => help.data);


