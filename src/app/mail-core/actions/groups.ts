import { Action } from '@ngrx/store';
import { GroupItem } from '../models/interfaces';
import { ConversationThread, Post, User, Group } from '../../core/lib/microsoft-graph';
export const LOAD_GROUP_LIST = 'DPS_LOAD_MAIL_GROUP_LIST';
export const LOAD_GROUP_LIST_SUCCESSS = 'DPS_LOAD_MAIL_GROUP_LIST_SUCCESSS';
export const LOAD_GROUP_LIST_FAIL = 'DPS_LOAD_MAIL_GROUP_LIST_FAIL';

export const GROUPS_TOGGLE = 'DPS_MAIL_GROUPS_TOGGLE';
export const SELECT_GROUP = 'DPS_MAIL_SELECT_GROUP';
export const CHANGE_GROUP_MODE = 'DPS_MAIL_CHANGE_GROUP_MODE';

export const LOAD_MORE_CONVERSATIONS = 'DPS_LOAD_MORE_MAIL_GROUP_CONVERSATIONS';
export const LOAD_CONVERSATIONS = 'DPS_LOAD_MAIL_GROUP_CONVERSATIONS';
export const LOAD_CONVERSATIONS_SUCCESSS = 'DPS_LOAD_MAIL_GROUP_CONVERSATIONS_SUCCESSS';
export const LOAD_CONVERSATIONS_FAIL = 'DPS_LOAD_MAIL_GROUP_CONVERSATIONS_FAIL';

export const LOAD_MEMBERS = 'DPS_LOAD_MAIL_GROUP_MEMBERS';
export const LOAD_MEMBERS_SUCCESSS = 'DPS_LOAD_MAIL_GROUP_MEMBERS_SUCCESSS';
export const LOAD_MEMBERS_FAIL = 'DPS_LOAD_MAIL_GROUP_MEMBERS_FAIL';

export const DELETE_CONVERSATION = 'DPS_DELETE_MAIL_GROUP_CONVERSATION';
export const DELETE_CONVERSATION_SUCCESSS = 'DPS_DELETE_MAIL_GROUP_CONVERSATION_SUCCESSS';
export const DELETE_CONVERSATION_FAIL = 'DPS_DELETE_MAIL_GROUP_CONVERSATION_FAIL';

export const DELETE_POST = 'DPS_DELETE_MAIL_GROUP_POST';
export const DELETE_POST_SUCCESSS = 'DPS_DELETE_MAIL_GROUP_POST_SUCCESSS';
export const DELETE_POST_FAIL = 'DPS_DELETE_MAIL_GROUP_POST_FAIL';

export const SELECT_CONVERSATION = 'DPS_MAIL_SELECT_CONVERSATION';

export const LOAD_CONVERSATION_POSTS = 'DPS_LOAD_MAIL_GROUP_CONVERSATION_MAILS';
export const LOAD_CONVERSATION_POSTS_SUCCESSS = 'DPS_LOAD_MAIL_GROUP_CONVERSATION_MAILS_SUCCESSS';
export const LOAD_CONVERSATION_POSTS_FAIL = 'DPS_LOAD_MAIL_GROUP_CONVERSATIONS__MAILS_FAIL';

export const CREATE_FORWARD_AND_POPUP = 'DPS_CREATE_POST_FORWARD_AND_POPUP';

export const GET_GROUP = 'DPS_GET_MAIL_GROUP';
export const GET_GROUP_SUCCESSS = 'DPS_GET_MAIL_GROUP_SUCCESSS';
export const GET_GROUP_FAIL = 'DPS_GET_MAIL_GROUP_FAIL';

export const UPDATE_ADD_EDIT_GROUP = 'DPS_UPDATE_MAIL_ADD_EDIT_GROUP';

export const SAVE_GROUP = 'DPS_SAVE_MAIL_GROUP';
export const SAVE_GROUP_SUCCESSS = 'DPS_SAVE_MAIL_GROUP_SUCCESSS';
export const SAVE_GROUP_FAIL = 'DPS_SAVE_MAIL_GROUP_FAIL';
export class LoadGroupList implements Action {
    readonly type = LOAD_GROUP_LIST;
    constructor() { }
}
export class LoadGroupListSuccess implements Action {
    readonly type = LOAD_GROUP_LIST_SUCCESSS;
    constructor(public payload: GroupItem[]) { }
}
export class LoadGroupListFail implements Action {
    readonly type = LOAD_GROUP_LIST_FAIL;
    constructor(public error) { }
}
export class GroupsToggle implements Action {
    readonly type = GROUPS_TOGGLE;
    constructor() { }
}
export class ChangeGroupMode implements Action {
    readonly type = CHANGE_GROUP_MODE;
    constructor(public payload: { isGroupMode: boolean }) { }
}
export class SelectGroup implements Action {
    readonly type = SELECT_GROUP;
    constructor(public payload: { id: string }) { }
}
export class LoadMoreConversations implements Action {
    readonly type = LOAD_MORE_CONVERSATIONS;
    constructor(public payload: { id: string, currentCount: number }) { }
}
export class LoadConversations implements Action {
    readonly type = LOAD_CONVERSATIONS;
    constructor(public payload: { id: string, currentCount: number, isConversationsLoading: boolean }) { }
}
export class LoadConversationsSuccess implements Action {
    readonly type = LOAD_CONVERSATIONS_SUCCESSS;
    constructor(public payload: { groupId: string, conversations: ConversationThread[], totalCount: number, currentCount: number }) { }
}
export class LoadConversationsFail implements Action {
    readonly type = LOAD_CONVERSATIONS_FAIL;
    constructor(public error) { }
}

export class LoadMembers implements Action {
    readonly type = LOAD_MEMBERS;
    constructor(public payload: { id: string }) { }
}
export class LoadMembersSuccess implements Action {
    readonly type = LOAD_MEMBERS_SUCCESSS;
    constructor(public payload: { members: User[], owners: User[], groupId: string }) { }
}
export class LoadMembersFail implements Action {
    readonly type = LOAD_MEMBERS_FAIL;
    constructor(public error) { }
}
export class SelectConversation implements Action {
    readonly type = SELECT_CONVERSATION;
    constructor(public payload: { id: string }) { }
}
export class LoadConversationPosts implements Action {
    readonly type = LOAD_CONVERSATION_POSTS;
    constructor(public payload: { id: string }) { }
}
export class LoadConversationPostsSuccess implements Action {
    readonly type = LOAD_CONVERSATION_POSTS_SUCCESSS;
    constructor(public payload: { conversationId: string, posts: Post[] }) { }
}
export class LoadConversationPostsFail implements Action {
    readonly type = LOAD_CONVERSATION_POSTS_FAIL;
    constructor(public error) { }
}
export class CreateForwardAndPopup implements Action {
    readonly type = CREATE_FORWARD_AND_POPUP;
    constructor(public payload: { id: string }) { }
}
export class DeleteConversation implements Action {
    readonly type = DELETE_CONVERSATION;
    constructor(public payload: { groupsId: string, id: string }) { }
}
export class DeleteConversationSuccess implements Action {
    readonly type = DELETE_CONVERSATION_SUCCESSS;
    constructor(public payload: { groupsId: string, id: string }) { }
}
export class DeleteConversationFail implements Action {
    readonly type = DELETE_CONVERSATION_FAIL;
    constructor(public error) { }
}

export class DeletePost implements Action {
    readonly type = DELETE_POST;
    constructor(public payload: { conversationId: string, id: string }) { }
}
export class DeletePostSuccess implements Action {
    readonly type = DELETE_POST_SUCCESSS;
    constructor(public payload: { conversationId: string, id: string }) { }
}
export class DeletePostFail implements Action {
    readonly type = DELETE_POST_FAIL;
    constructor(public error) { }
}
export class GetGroup implements Action {
    readonly type = GET_GROUP;
    constructor(public payload: { id: string }) { }
}
export class GetGroupSuccess implements Action {
    readonly type = GET_GROUP_SUCCESSS;
    constructor(public payload: Group) { }
}
export class GetGroupFail implements Action {
    readonly type = GET_GROUP_FAIL;
    constructor(public error) { }
}
export class UpdateAddEditGroup implements Action {
    readonly type = UPDATE_ADD_EDIT_GROUP;
    constructor(public payload: { value: any, property: string }) {
    }
}
export class SaveGroup implements Action {
    readonly type = SAVE_GROUP;
    constructor(public payload: Group) { }
}
export class SaveGroupSuccess implements Action {
    readonly type = SAVE_GROUP_SUCCESSS;
    constructor(public payload: Group) { }
}
export class SaveGroupFail implements Action {
    readonly type = SAVE_GROUP_FAIL;
    constructor(public error) { }
}
export type Any = LoadGroupList | LoadGroupListSuccess | LoadGroupListFail | GroupsToggle | SelectGroup |
    LoadConversations | LoadConversationsSuccess | LoadConversationsFail | ChangeGroupMode |
    SelectConversation | LoadConversationPosts | LoadConversationPostsSuccess | LoadConversationPostsFail | LoadMembersSuccess |
    DeleteConversation | DeleteConversationSuccess | DeletePostSuccess | GetGroup | GetGroupSuccess | GetGroupFail | UpdateAddEditGroup |
    SaveGroup | SaveGroupSuccess | SaveGroupFail;
