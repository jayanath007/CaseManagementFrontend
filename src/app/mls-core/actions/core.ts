import { Action } from '@ngrx/store';
import { MatterInfo } from './../../core/lib/matter';
import { TokenizeAction } from '../../core';
import { MLSUser, MlsCaseMassageResponce } from './../../core/lib/mls';

export const INIT_MLS = 'DPS_MLS_INIT';
export const REQUEST_CASE_USERS_BY_MATTER = 'DPS_MLS_REQUEST_CASE_USERS_BY_MATTER';
export const GET_CASE_USERS_BY_MATTER = 'DPS_MLS_GET_CASE_USERS_BY_MATTER';
export const GET_CASE_USERS_BY_MATTER_SUCESS = 'DPS_MLS_GET_CASE_USERS_BY_MATTER_SUCCESS';
export const GET_CASE_USERS_BY_MATTER_FAIL = 'DPS_MLS_GET_CASE_USERS_BY_MATTER_FAIL';
export const CHANGE_USER = 'DPS_MLS_CHANGE_USER';
export const GET_CASE_MESSAGES = 'DPS_MLS_GET_CASE_MESSAGES';
export const GET_CASE_MESSAGES_SUCCESS = 'DPS_MLS_GET_CASE_MESSAGES_SUCCESS';
export const GET_CASE_MESSAGES_FAIL = 'DPS_MLS_GET_CASE_MESSAGES_FAIL';
export const SEND_MESSAGE = 'DPS_MLS_SEND_MESSAGE';
export const SEND_MESSAGE_SUCCESS = 'DPS_MLS_SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAIL = 'DPS_MLS_SEND_MESSAGE_FAIL';
export const LOAD_MORE = 'DPS_MLS_LOAD_MORE';
export const MLS_REFRESH = 'DPS_MLS_REFRESH';
export const CHANGE_CAN_VIEW_MILESTONE = 'DPS_MLS_CHANGE_CAN_VIEW_MILESTONE';
export const CHANGE_CAN_VIEW_MILESTONE_SUCCESS = 'DPS_MLS_CHANGE_CAN_VIEW_MILESTONE_SUCCESS';
export const CHANGE_CAN_VIEW_MILESTONE_FAIL = 'DPS_MLS_CHANGE_CAN_VIEW_MILESTONE_SUCCESS';
export const ADD_USER = 'DPS_MLS_ADD_USER';

export class InitMls extends TokenizeAction implements Action {
    readonly type = INIT_MLS;
    constructor(public token: string, public payload: {
        matterData: MatterInfo,
    }) { super(token); }
}
export class RequestCaseUsersByMatter extends TokenizeAction implements Action {
    readonly type = REQUEST_CASE_USERS_BY_MATTER;
    constructor(public token: string) { super(token); }
}
export class GetCaseUsersByMatter extends TokenizeAction implements Action {
    readonly type = GET_CASE_USERS_BY_MATTER;
    constructor(public token: string, public payload: {
        appID: number,
        fileID: number,
        branchID: number,
        selectedUser: MLSUser
    }) { super(token); }
}
export class GetCaseUsersByMatterSuccess extends TokenizeAction implements Action {
    readonly type = GET_CASE_USERS_BY_MATTER_SUCESS;
    constructor(public token: string, public payload: {
        users: MLSUser[], selectedUser: MLSUser
    }) { super(token); }
}
export class GetCaseUsersByMatterFail extends TokenizeAction implements Action {
    readonly type = GET_CASE_USERS_BY_MATTER_FAIL;
    constructor(public token: string) { super(token); }
}
export class ChangeUser extends TokenizeAction implements Action {
    readonly type = CHANGE_USER;
    constructor(public token: string, public payload: {
        user: MLSUser
    }) { super(token); }
}

export class AddUser extends TokenizeAction implements Action {
    readonly type = ADD_USER;
    constructor(public token: string, public payload: { message: string, emailAddresses: string }) {
        super(token);
    }
}
export class GetCaseMessages extends TokenizeAction implements Action {
    readonly type = GET_CASE_MESSAGES;
    constructor(public token: string, public payload: {
        userEmail: string,
        loadMore?: boolean;
    }) { super(token); }
}
export class GetCaseMessagesSuccess extends TokenizeAction implements Action {
    readonly type = GET_CASE_MESSAGES_SUCCESS;
    constructor(public token: string, public payload: {
        responce: MlsCaseMassageResponce,
        loadMore?: boolean;
    }) { super(token); }
}
export class GetCaseMessagesFail extends TokenizeAction implements Action {
    readonly type = GET_CASE_MESSAGES_FAIL;
    constructor(public token: string) { super(token); }
}
export class SendMessage extends TokenizeAction implements Action {
    readonly type = SEND_MESSAGE;
    constructor(public token: string, public payload: {
        msg: string
    }) { super(token); }
}
export class SendMessageSuccess extends TokenizeAction implements Action {
    readonly type = SEND_MESSAGE_SUCCESS;
    constructor(public token: string, public payload: { toEmailAddress: string }) { super(token); }
}
export class SendMessageFail extends TokenizeAction implements Action {
    readonly type = SEND_MESSAGE_FAIL;
    constructor(public token: string) { super(token); }
}
export class LoadMore extends TokenizeAction {
    readonly type = LOAD_MORE;
    constructor(public token: string) { super(token); }
}
export class MLSRefresh extends TokenizeAction {
    readonly type = MLS_REFRESH;
    constructor(public token: string) { super(token); }
}
export class ChangeCanViewMilestone extends TokenizeAction {
    readonly type = CHANGE_CAN_VIEW_MILESTONE;
    constructor(public token: string) { super(token); }
}
export class ChangeCanViewMilestoneSuccess extends TokenizeAction {
    readonly type = CHANGE_CAN_VIEW_MILESTONE_SUCCESS;
    constructor(public token: string) { super(token); }
}
export class ChangeCanViewMilestoneFail extends TokenizeAction {
    readonly type = CHANGE_CAN_VIEW_MILESTONE_FAIL;
    constructor(public token: string) { super(token); }
}

export type Any = InitMls | GetCaseUsersByMatter | GetCaseUsersByMatterSuccess |
    GetCaseUsersByMatterFail | RequestCaseUsersByMatter | ChangeUser | GetCaseMessages |
    GetCaseMessagesSuccess | GetCaseMessagesFail | SendMessage | SendMessageSuccess | SendMessageFail |
    LoadMore | MLSRefresh | ChangeCanViewMilestone | ChangeCanViewMilestoneSuccess | ChangeCanViewMilestoneFail |
    AddUser;
