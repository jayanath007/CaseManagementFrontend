import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { Message, MailFolder } from '../../core/lib/microsoft-graph';

export interface State {
    readonly loading: boolean;
    data: any;
    folderInfo: MailFolder;
}
const initialState: State = {
    loading: false,
    data: null,
    folderInfo: null
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_MAIL_WIDGET:
            return { ...state, loading: false };
        case Actions.LOAD_DATA:
            return { ...state, loading: true, };
        case Actions.LOAD_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.data };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, loading: false };
        case Actions.LOAD_MAIL_COUNT:
            return { ...state, loading: true, };
        case Actions.LOAD_MAIL_COUNT_SUCCESS:
            return { ...state, loading: false, folderInfo: action.payload.data };
        case Actions.LOAD_MAIL_COUNT_FAIL:
            return { ...state, loading: false };
        default:
            {
                return state;
            }
    }
}

export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (mail) => mail ? mail.loading : null);
export const getData = () => createSelector(getView, (mail) => mail && mail.data ? mail.data : null);
export const getInBoxInfo = () => createSelector(getView, (mail) => mail && mail.data ? mail.folderInfo : null);
