import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { ParaType, TeamMemberOpenFrom } from '../models/enums';

export const INIT_TEAM_MEMBER = 'DPS_INIT_TEAM_MEMBER';
export const GET_LOGING_USER = 'DPS_GET_LOGING_USER';
export const UPDATE_DEPARTMENT = 'DPS_UPDATE_DEPARTMENT';
export const UPDATE_SEARCH_KEY = 'DPS_UPDATE_SEARCH_KEY';
export const LOAD_TEAM_MEMBER = 'DPS_LOAD_TEAM_MEMBER';
export const LOAD_TEAM_MEMBER_SUCCESS = 'DPS_TEAM_MEMBER_SUCCESS';
export const LOAD_TEAM_MEMBER_FAIL = 'DPS_TEAM_MEMBER_FAIL';
export const CHANGE_SELECTED_TEAM_MEMBER = 'DPS_CHANGE_SELECTED_TEAM_MEMBER';
// export const LOAD_ALL_MEMBER_DATA = 'DPS_LOAD_ALL_MEMBER_DATA';
export const CHANGE_PANEL_MODE = 'DPS_CHANGE_MEMBER_PANEL_MODE';

import { TeamMember, TeamMemberRequest, TeamMemberResponse } from '../../core/lib/team-members';

export class InitTeamMember extends TokenizeAction implements Action {
    readonly type = INIT_TEAM_MEMBER;
    constructor(public token: string, public openFrom: TeamMemberOpenFrom) {
        super(token);
    }
}
export class LoadTeamMemberList extends TokenizeAction implements Action {
    readonly type = LOAD_TEAM_MEMBER;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTeamMemberSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TEAM_MEMBER_SUCCESS;
    constructor(public token: string, public payload: { TeamMembersData: TeamMemberResponse }) {
        super(token);
    }
}

export class GetLogingUser extends TokenizeAction implements Action {
    readonly type = GET_LOGING_USER;
    constructor(public token: string, public payload: { TeamMembersData: TeamMemberResponse }) {
        super(token);
    }
}

export class LoadTeamMemberFail extends TokenizeAction implements Action {
    readonly type = LOAD_TEAM_MEMBER_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeDepartmentOrFeeEranerState extends TokenizeAction implements Action {
    readonly type = UPDATE_DEPARTMENT;
    constructor(public token: string, public payload: { inPutData: TeamMemberRequest }) {
        super(token);
    }
}
export class ChangeTeamMemberSearchKey extends TokenizeAction implements Action {
    readonly type = UPDATE_SEARCH_KEY;
    constructor(public token: string, public payload: { inPutData: TeamMemberRequest }) {
        super(token);
    }
}
export class ChangeSelectedTeamMember extends TokenizeAction implements Action {
    readonly type = CHANGE_SELECTED_TEAM_MEMBER;
    constructor(public token: string, public payload: { selectedTeamMember: TeamMember }) {
        super(token);
    }
}
// export class LoadAllMemebrData extends TokenizeAction implements Action {
//     readonly type = LOAD_ALL_MEMBER_DATA;
//     constructor(public token: string, public payload: { allMembers: AllMembers[] }) {
//         super(token);
//     }
// }

export class ChangePanelMode extends TokenizeAction implements Action {
    readonly type = CHANGE_PANEL_MODE;
    constructor(public token: string, public payload: { mode: string }) {
        super(token);
    }
}

export type Any = InitTeamMember | GetLogingUser | LoadTeamMemberList | LoadTeamMemberSuccess | LoadTeamMemberFail |
    ChangeDepartmentOrFeeEranerState | ChangeTeamMemberSearchKey | ChangeSelectedTeamMember |  ChangePanelMode;
