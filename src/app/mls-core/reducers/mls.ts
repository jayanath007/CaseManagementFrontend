import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { MatterInfo } from './../../core/lib/matter';
import { MLSUser, ChatMessage } from './../../core/lib/mls';
import { Request } from '../models/enum';

export interface State {
    readonly [token: string]: MlsState;
}

export interface MlsState {
    readonly isChatListLoading: boolean;
    readonly isChatMessageLoading: boolean;
    readonly matterData: MatterInfo;
    readonly users: MLSUser[];
    readonly selectedUser: MLSUser;
    readonly messageList: ChatMessage[];
    readonly sending: boolean;
    readonly notLoadedItem: boolean;
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_MLS:
            tmp[action.token] = setInitData(state[action.token], action.payload.matterData);
            return {
                ...state, ...tmp
            };
        case Actions.GET_CASE_USERS_BY_MATTER:
            tmp[action.token] = { ...state[action.token], isChatListLoading: true };
            return {
                ...state, ...tmp
            };
        case Actions.GET_CASE_USERS_BY_MATTER_SUCESS:
            tmp[action.token] = { ...state[action.token], isChatListLoading: false, users: action.payload.users };
            return {
                ...state, ...tmp
            };
        case Actions.GET_CASE_USERS_BY_MATTER_FAIL:
            tmp[action.token] = { ...state[action.token], isChatListLoading: false };
            return {
                ...state, ...tmp
            };
        case Actions.GET_CASE_MESSAGES:
            tmp[action.token] = { ...state[action.token], isChatMessageLoading: true, };
            return {
                ...state, ...tmp
            };
        case Actions.GET_CASE_MESSAGES_SUCCESS:
            const msgs = action.payload.responce.chatMessageList;
            tmp[action.token] = {
                ...state[action.token],
                isChatMessageLoading: false,
                messageList: action.payload.loadMore ? msgs.concat(state[action.token].messageList) : msgs,
                notLoadedItem: msgs.length < Request.pageSize ? false : true
            };
            return {
                ...state, ...tmp
            };
        case Actions.GET_CASE_MESSAGES_FAIL:
            tmp[action.token] = { ...state[action.token], isChatMessageLoading: false };
            return {
                ...state, ...tmp
            };
        case Actions.CHANGE_USER:
            tmp[action.token] = {
                ...state[action.token],
                selectedUser: action.payload.user,
                messageList: [],
                notLoadedItem: false
            };
            return {
                ...state, ...tmp
            };
        case Actions.ADD_USER:
            tmp[action.token] = { ...state[action.token], sending: true };
            return {
                ...state, ...tmp
            };
        case Actions.SEND_MESSAGE:
            tmp[action.token] = { ...state[action.token], sending: true };
            return {
                ...state, ...tmp
            };
        case Actions.SEND_MESSAGE_SUCCESS:
            tmp[action.token] = { ...state[action.token], sending: false };
            return {
                ...state, ...tmp
            };
        case Actions.SEND_MESSAGE_FAIL:
            tmp[action.token] = { ...state[action.token], sending: false };
            return {
                ...state, ...tmp
            };
        case Actions.CHANGE_CAN_VIEW_MILESTONE_SUCCESS:
            tmp[action.token] = {
                ...state[action.token],
                users: changeNotifyMilstone(state[action.token].users, state[action.token].selectedUser, true)
            };
            return {
                ...state, ...tmp
            };
        case Actions.CHANGE_CAN_VIEW_MILESTONE_FAIL:
            tmp[action.token] = {
                ...state[action.token],
                users: changeNotifyMilstone(state[action.token].users, state[action.token].selectedUser, false)
            };
            return {
                ...state, ...tmp
            };
        default: {
            return state;
        }
    }
}

function setInitData(state: MlsState, matterData: MatterInfo): MlsState {
    if (!state) {
        return {
            ...state,
            isChatListLoading: false,
            matterData: matterData,
            messageList: []
        };
    } else {
        return state;
    }
}

function changeNotifyMilstone(users: MLSUser[], selectUser: MLSUser, isSuccess: boolean): MLSUser[] {
    return users.map(u => {
        if (u.id === selectUser.id) {
            return Object({ ...u, canViewMilestones: isSuccess ? !u.canViewMilestones : u.canViewMilestones });
        }
        return u;
    });
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getIsChatListLoading = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.isChatListLoading : false);
export const getMatterDetails = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.matterData : null);
export const getCaseUsers = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.users : []);
export const getIsChatMessageLoading = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.isChatMessageLoading : false);
export const getMessageList = (token) => createSelector(getStateByToken(token),
    (state) => state && state.messageList ? state.messageList : []);
export const getSelectedUser = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedUser : null);
export const getIsSending = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.sending : null);
export const hasNotLoadedItem = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.notLoadedItem : false);
