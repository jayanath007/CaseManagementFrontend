import { GroupListItem, GroupItem, ConversationListItem } from '../models/interfaces';
import * as Actions from '../actions/groups';
import { createSelector } from '@ngrx/store';
import { Conversation, Post, User, Group } from '../../core/lib/microsoft-graph';
export interface State {
    readonly groups: { [id: string]: Readonly<GroupListItem>; };
    readonly conversations: { [id: string]: Readonly<ConversationListItem>; };
    readonly selectedGroupId: string;
    readonly selectedConversationId: string;
    readonly loading: boolean;
    readonly isConversationsLoading: boolean;
    readonly isExpanded: boolean;
    readonly isGroupMode: boolean;
    readonly totalConversations: number;
    readonly itemPerPage: number;
    readonly addEditGroup: Group;
    readonly groupSaving: boolean;
    readonly groupSaved: boolean;
    // readonly postReplyAll: { [id: string]: Readonly<PostReplyAll>; };
}
const initialState: State = {
    groups: {},
    conversations: {},
    selectedGroupId: null,
    loading: false,
    isConversationsLoading: false,
    isExpanded: true,
    isGroupMode: false,
    selectedConversationId: null,
    totalConversations: -1,
    itemPerPage: 50,
    addEditGroup: null,
    groupSaving: false,
    groupSaved: false
    // postReplyAll: null
};
export function reducer(state = initialState, action: Actions.Any): State {
    try {
        const temp = {};
        switch (action.type) {
            case Actions.LOAD_GROUP_LIST:
                return { ...state, loading: true };
            case Actions.LOAD_GROUP_LIST_SUCCESSS:
                return loadGroupListSuccess(state, action.payload);
            case Actions.LOAD_GROUP_LIST_FAIL:
                return { ...state, loading: false };
            case Actions.GROUPS_TOGGLE:
                return { ...state, isExpanded: !state.isExpanded };
            case Actions.CHANGE_GROUP_MODE:
                return { ...state, isGroupMode: action.payload.isGroupMode };
            case Actions.SELECT_GROUP:
                return {
                    ...state, isGroupMode: true, selectedGroupId: action.payload.id,
                    groups: selectGroup(state.groups, action.payload.id),
                    selectedConversationId: action.payload.id === state.selectedGroupId ? state.selectedConversationId : null,
                    totalConversations: -1,
                };
            case Actions.LOAD_CONVERSATIONS:
                return {
                    ...state,
                    isConversationsLoading: (state.totalConversations < 0 || action.payload.currentCount < state.totalConversations),
                    conversations: state.totalConversations < 0 ? {} : state.conversations
                };
            case Actions.LOAD_CONVERSATIONS_SUCCESSS:
                return loadConversationsSuccess(state, action.payload.groupId, action.payload.conversations, action.payload.totalCount);
            case Actions.LOAD_MEMBERS_SUCCESSS:
                return loadMembersSuccess(state, action.payload.members, action.payload.owners, action.payload.groupId);
            case Actions.SELECT_CONVERSATION:
                return {
                    ...state, isGroupMode: true, selectedConversationId: action.payload.id,
                    conversations: selectConversation(state.conversations, action.payload.id)
                };
            case Actions.LOAD_CONVERSATION_POSTS:
                return { ...state, conversations: loadConversationPosts(state.conversations, action.payload.id) };
            case Actions.LOAD_CONVERSATION_POSTS_SUCCESSS:
                return {
                    ...state,
                    conversations: loadConversationPostsSuccess(state.conversations, action.payload.conversationId, action.payload.posts)
                };
            case Actions.DELETE_CONVERSATION_SUCCESSS:
                return deleteConversation(
                    state.selectedConversationId === action.payload.id ? { ...state, selectedConversationId: null } : state,
                    action.payload.id);
            case Actions.DELETE_POST_SUCCESSS:
                return {
                    ...state,
                    conversations: deleteConversationPostsSuccess(state.conversations, action.payload.conversationId, action.payload.id)
                };
            case Actions.GET_GROUP:
                return {
                    ...state,
                    addEditGroup: action.payload.id ? null : {
                        displayName: '',
                        mailEnabled: true,
                        description: '',
                        id: null,
                        mailNickname: '',
                        visibility: 'Private',
                        securityEnabled: false,
                        groupTypes: ['Unified']
                    },
                    groupSaving: false,
                    groupSaved: false
                };
            case Actions.GET_GROUP_SUCCESSS:
                return {
                    ...state,
                    addEditGroup: action.payload
                };
            case Actions.UPDATE_ADD_EDIT_GROUP:
                temp[action.payload.property] = action.payload.value;
                return {
                    ...state,
                    addEditGroup: { ...state.addEditGroup, ...temp }
                };
            case Actions.SAVE_GROUP:
                return {
                    ...state,
                    groupSaving: true,
                };
            case Actions.SAVE_GROUP_SUCCESSS:
                temp[action.payload.id] = {
                    selected: action.payload.id === state.selectedGroupId,
                    data: {
                        id: action.payload.id,
                        accessType: action.payload.accessType,
                        isFavorite: false,
                        displayName: action.payload.displayName,
                        EmailAddress: action.payload.mail,
                        LastVisitedDateTime: new Date().toISOString()
                    }
                };
                return {
                    ...state,
                    groupSaving: false,
                    groupSaved: true,
                    groups: { ...state.groups, ...temp }
                };
            case Actions.SAVE_GROUP:
                return {
                    ...state,
                    groupSaving: false,
                };
            default:
                {
                    return state;
                }
        }
    } catch (e) {
        console.log('error in mail groups reducer', e);
        return state;
    }
}
function loadMembersSuccess(state: State, members: User[], owners: User[], groupId: string): State {
    const temp = {};
    temp[groupId] = { ...state.groups[groupId], members: members, owners: owners };
    return { ...state, loading: false, groups: { ...state.groups, ...temp } };
}
function deleteConversation(state: State, id: string): State {
    let temp = {};
    temp = Object.assign({}, state, {
        conversations: Object.keys(state.conversations).reduce((result, key) => {
            if (key !== id) {
                result[key] = state.conversations[key];
            }
            return result;
        }, {})
    });
    return { ...{ ...state, ...temp }, totalConversations: (state.totalConversations - 1) };
}
function loadGroupListSuccess(state: State, groups: GroupItem[]): State {
    const temp = {};
    groups.forEach(val => {
        temp[val.id] = { ...state.groups[val.id], data: val };
    });
    return { ...state, loading: false, groups: temp };
}
function selectGroup(groups: { [id: string]: Readonly<GroupListItem>; }, id: string): { [id: string]: Readonly<GroupListItem>; } {
    const temp = {};
    Object.keys(groups).forEach(key => {
        temp[key] = { ...groups[key], selected: key === id };
    });
    return temp;
}
function selectConversation(conversations: { [id: string]: Readonly<ConversationListItem>; }, id: string)
    : { [id: string]: Readonly<ConversationListItem>; } {
    const temp = {};
    Object.keys(conversations).forEach(key => {
        temp[key] = { ...conversations[key], selected: key === id };
    });
    return temp;
}
function loadConversationPosts(conversations: { [id: string]: Readonly<ConversationListItem>; }, id: string)
    : { [id: string]: Readonly<ConversationListItem>; } {
    if (!conversations[id]) {
        return conversations;
    }
    const temp = {};
    temp[id] = { ...conversations[id], posts: null };

    return { ...conversations, ...temp };
}
function loadConversationPostsSuccess(conversations: { [id: string]: Readonly<ConversationListItem>; }, id: string, posts: Post[])
    : { [id: string]: Readonly<ConversationListItem>; } {
    if (!conversations[id]) {
        return conversations;
    }
    const temp = {};
    temp[id] = { ...conversations[id], posts: posts };

    return { ...conversations, ...temp };
}
function deleteConversationPostsSuccess(conversations: { [id: string]: Readonly<ConversationListItem>; },
    conversationId: string, id: string)
    : { [id: string]: Readonly<ConversationListItem>; } {
    if (!conversations[conversationId] || !conversations[conversationId].posts) {
        return conversations;
    }
    const temp = {};
    temp[conversationId] = {
        ...conversations[conversationId],
        posts: conversations[conversationId].posts.filter(post => post.id !== id)
    };

    return { ...conversations, ...temp };
}
function loadConversationsSuccess(state: State, groupId: string, conversations: Conversation[], totalCount: number): State {
    if (state.selectedGroupId !== groupId) {
        return state;
    }
    const temp = {};
    conversations.forEach(val => {
        temp[val.id] = { ...state.groups[val.id], data: val, selected: val.id === state.selectedConversationId };
    });
    return { ...state, isConversationsLoading: false, conversations: { ...state.conversations, ...temp }, totalConversations: totalCount };
}

export const getGroups = (state: State) => state.groups;
export const getGroupsByOrder = createSelector(getGroups, groups => {
    return Object.keys(groups).map(key => groups[key])
        .sort((a, b) => a.data.isFavorite < b.data.isFavorite ? 1 : (b.data.isFavorite < a.data.isFavorite ? -1 : 0));
});
export const getConversations = (state: State) => state.conversations;
export const getConversationsByOrder = createSelector(getConversations, groups => {
    return Object.keys(groups).map(key => groups[key])
        .sort((a, b) => {
            const _a = new Date(a.data.lastDeliveredDateTime).valueOf();
            const _b = new Date(b.data.lastDeliveredDateTime).valueOf();
            return _a < _b ? 1 : (_b < _a ? -1 : 0);
        });
});
export const getIsLoading = (state: State) => state.loading;
export const getIsExpanded = (state: State) => state.isExpanded;
export const getIsConversationsLoading = (state: State) => state.isConversationsLoading;
export const getIsGroupMode = (state: State) => state.isGroupMode;
export const getSelectedGroupId = (state: State) => state.selectedGroupId;
export const getAddEditGroup = (state: State) => state.addEditGroup;
export const getSelectedGroup = createSelector(getSelectedGroupId, getGroups, (id, groups) => {
    if (!!id) {
        return groups[id];
    }
    return null;
});
export const getSelectedConversationId = (state: State) => state.selectedConversationId;
export const getSelectedConversation = createSelector(getSelectedConversationId, getConversations, (id, Conversations) => {
    if (!!id) {
        return Conversations[id];
    }
    return null;
});
export const getIsGroupSaving = (state: State) => state.groupSaving;
export const getIsGroupSaved = (state: State) => state.groupSaved;
