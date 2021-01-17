import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ChatMessage } from './../../core/lib/mls';
import { MatterRefMap } from '../models/interface';

export interface State {
    readonly loading: boolean;
    readonly data: ChatMessage[];
    readonly continueChatItem: ChatMessage;
    readonly msgSending: boolean;
    readonly matterRef: MatterRefMap[];
}
const initialState: State = {
    loading: false,
    data: [],
    continueChatItem: null,
    msgSending: false,
    matterRef: []
};

export function reducer(state = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.INIT_MLS_WIDGET:
            return { ...state, loading: false };
        case Actions.LOAD_DATA:
            return { ...state, loading: true };
        case Actions.LOAD_DATA_SUCCESS:
            return { ...state, loading: false, data: action.payload.dataObj.chatMessageList };
        case Actions.LOAD_DATA_FAIL:
            return { ...state, loading: false };
        case Actions.CONTINUE_CHAT:
            return { ...state, continueChatItem: action.item };
        case Actions.SEND_MESSAGE:
            return { ...state, msgSending: true };
        case Actions.SEND_MESSAGE_SUCCESS:
            return { ...state, continueChatItem: null, msgSending: false };
        case Actions.SEND_MESSAGE_FAIL:
            return { ...state, msgSending: false };
        case Actions.LOAD_MATTER_REF:
            return { ...state, loading: true };
        case Actions.LOAD_MATTER_REF_SUCCESS:
            return { ...state, matterRef: action.payload.matterRef, loading: false };
        case Actions.LOAD_MATTER_REF_FAIL:
            return { ...state, loading: false };

        default:
            {
                return state;
            }

    }
}

export const getView = (state: State) => state;
export const getIsLoading = () => createSelector(getView, (store) => store.loading);
export const getData = () => createSelector(getView, (store) => store.data);
export const getContinueItem = () => createSelector(getView, (store) => store.continueChatItem);
export const getIsMsgSending = () => createSelector(getView, (store) => store.msgSending);
export const getAllMatterRef = () => createSelector(getView, (store) => store.matterRef);
