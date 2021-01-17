import { createSelector, Action } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as ItemActions from '../../mail-item-core/actions/item';
import { Message, FollowupFlag } from '../../core/lib/microsoft-graph';
import { MessageItemWrapper } from '../../mail-item-core';

export interface MessageItemState {
    readonly messageItem: MessageItemWrapper;
    readonly loading?: boolean;
    readonly isDraftItem?: boolean;
    readonly isDiscard: boolean;
    readonly itemId?: string;
}
export interface State {
    views: {
        [token: string]: MessageItemState;
    };
    // readonly [token: string]: MessageItemState;
}
const initialState: State = { views: {} };
// const initialState: State = {};
export function reducer(state = initialState, action: Actions.Any | ItemActions.Any): State {
    const tmp: any = {};
    switch (action.type) {

        case Actions.URL_POPUP_MAIL_ITEM_INIT:
            tmp[action.token] = setInitItem(state.views[action.token], action.token);
            return {
                ...state,
                views: { ...state.views, ...tmp }
            };
        case Actions.URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT:
            tmp[action.token] = Object.freeze({ ...state.views[action.token], loading: true });
            return {
                ...state,
                views: { ...state.views, ...tmp[action.token] }
            };
        case Actions.URL_POPUP_MAIL_ITEM_LOAD_SUCCESS:
            tmp[action.token] = setMailItem(state[action.token], action.payload.newItem, action.payload.owner);
            return {
                ...state,
                views: { ...state.views, ...tmp }
            };
        case Actions.URL_POPUP_ITEM_ATTACHMENT_LOAD_SUCCESS:
            tmp[action.token] = setMailItem(state[action.token], action.payload.newItem, action.payload.owner, action.payload.itemId);
            return {
                ...state,
                views: { ...state.views, ...tmp }
            };
        case Actions.URL_POPUP_READ_UNREAD_ITEMS:
            tmp[action.token] = setIsRead(state.views[action.token], action.payload.isRead, action.token);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.URL_POPUP_FLAG_ITEMS:
            tmp[action.token] = setFlagItem(state.views[action.token], action.payload.flag, action.token);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.URL_POPUP_DELETE_ITEM_SUCCESS:
            tmp[action.token] = Object.freeze({ ...state.views[action.token], isDiscard: true });
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.URL_POPUP_MOVE_ITEM_SUCCESS:
            tmp[action.token] = Object.freeze({ ...state.views[action.token], isDiscard: true });
            return { ...state, views: { ...state.views, ...tmp } };
        // case Actions.URL_POPUP_MEETING_RESPONSE_ITEM:
        //     tmp[action.token] = setFlagItem(state.views[action.token], action.payload.flag, action.token);
        //     return { ...state, views: { ...state.views, ...tmp } };
        case ItemActions.GET_OUTLOOK_JOURNAL_STATUS_SUCCESS:
            Object.keys(state.views).forEach(token => {
                if (state.views[token].messageItem && state.views[token].messageItem.data) {
                    const status = action.payload.find(val => state.views[token].messageItem.data.internetMessageId.includes(val.emailId));
                    if (status) {
                        tmp[token] = Object.freeze({
                            ...state.views[token],
                            messageItem: { ...state.views[token].messageItem, diaryId: status.diaryId }
                        });
                    }
                }
            });

            return { ...state, views: { ...state.views, ...tmp } };

        default:
            {
                return state;
            }
    }
}

function setIsRead(state: MessageItemState, isRead: boolean, token: string): Partial<MessageItemState> {
    return Object.freeze({
        ...state,
        messageItem: Object.freeze({
            ...state.messageItem,
            data: Object.freeze({ ...state.messageItem.data, isRead: isRead })
        }),
    });
}


function setFlagItem(state: MessageItemState, flag: FollowupFlag, token: string): Partial<MessageItemState> {
    return Object.freeze({
        ...state,
        messageItem: Object.freeze({
            ...state.messageItem,
            data: Object.freeze({ ...state.messageItem.data, flag: flag })
        }),
    });
}



function setInitItem(state: MessageItemState, token: string): MessageItemState {

    const newMessageItem: MessageItemWrapper = {
        data: null,
        loading: true,
        selected: true,
        displayTo: '',
        displayColor: '',
        displayInitials: '',
        diaryId: null,
        iconIndex: '',
        actionDate: '',
        folderWellKnownId: '',
        owner: ''
    };
    return {
        messageItem: newMessageItem,
        loading: true,
        isDraftItem: false,
        isDiscard: false
    };
}

function setMailItem(state: MessageItemState, data: Message, owner: string, itemId?: string): MessageItemState {
    // disabale fiture in url poup
    // const isDPSMail = false;
    const isDraftItem = data ? data.isDraft : false;

    const newMessageItem: MessageItemWrapper = {
        data: data,
        loading: false,
        selected: true,
        displayTo: '',
        displayColor: '',
        displayInitials: '',
        diaryId: null,
        iconIndex: '',
        actionDate: '',
        folderWellKnownId: '',
        owner: owner,
    };
    return {
        messageItem: newMessageItem,
        loading: false,
        isDraftItem: isDraftItem,
        isDiscard: false,
        itemId: itemId
    };
}

export const getView = (state: State) => state.views;
export const getViewByToken = (token) => createSelector(getView, (views) => {
    return views[token];
});
export const getParentItemIdByToken = (token) => createSelector(getViewByToken(token), (mailState) => mailState ? mailState.itemId : null);
export const getMailItemByToken = (token) => createSelector(getViewByToken(token), (mailState) => mailState ? mailState.messageItem : null);
export const getMailItemIsDiscardByToken = (token) => createSelector(getViewByToken(token), (mailState) =>
    mailState ? mailState.isDiscard : false);




