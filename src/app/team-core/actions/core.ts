import { UserViewType } from './../models/enum';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';

import {
    TeamMemberResponse, TeamUserRequest, Department, UserRequestViewModel,
    MonthActivityResponce, MonthActivity, DayActivity, AllDayEventByYear, UserMovementTypesWithDaysResponce
} from '../models/interface';





export const INIT_TEAM = 'DPS_INIT_TEAM';
export const GET_LOGING_TEAM_USER = 'GET_LOGING_TEAM_USER';

export const CHANGE_DEPARTMENT_OR_TEAM_TYPE = 'DPS_CHANGE_DEPARTMENT_OR_TEAM_TYPE';
export const CHANGE_TEAM_MEMBER_SEARCH_KEY = 'DPS_CHANGE_TEAM_MEMBER_SEARCH_KEY';

export const LOAD_ACTIVITY_MEMBERS = 'DPS_LOAD_ACTIVITY_MEMBERS';
export const LOAD_ACTIVITY_MEMBERS_SUCCESS = 'DPS_LOAD_ACTIVITY_MEMBERS_SUCCESS';
export const LOAD_ACTIVITY_MEMBERS_FAIL = 'DPS_LOAD_ACTIVITY_MEMBERS_FAIL';

export const LOAD_ACTIVITY_SUMMARY_YEAR = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR';
export const LOAD_ACTIVITY_SUMMARY_YEAR_SUCCESS = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_SUCCESS';
export const LOAD_ACTIVITY_SUMMARY_YEAR_FAIL = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_FAIL';

export const LOAD_ACTIVITY_SUMMARY_MONTH = 'DPS_LOAD_ACTIVITY_SUMMARY_MONTH';
export const LOAD_ACTIVITY_SUMMARY_MONTH_SUCCESS = 'DPS_LOAD_ACTIVITY_SUMMARY_MONTH_SUCCESS';
export const LOAD_ACTIVITY_SUMMARY_MONTH_FAIL = 'DPS_LOAD_ACTIVITY_SUMMARY_MONTH_FAIL';

export const GET_TEAM_DEPARTMENT_LIST = 'DPS_GET_TEAM_DEPARTMENT_LIST';
export const GET_TEAM_DEPARTMENT_LIST_SUCCESS = 'DPS_GET_TEAM_DEPARTMENT_LIST_SUCCESS';
export const GET_TEAM_DEPARTMENT_LIST_FAIL = 'DPS_GET_TEAM_DEPARTMENT_LIST_FAIL';

export const LOAD_TEAM_USER_LIST = 'DPS_LOAD_TEAM_USER_LIST';
export const LOAD_TEAM_USER_LIST_SUCCESS = 'LOAD_TEAM_USER_LIST_SUCCESS';
export const LOAD_TEAM_USER_LIST_FAIL = 'LOAD_TEAM_USER_LIST_FAIL';

export const UPDATE_USER_SEARCH_TEXT = 'DPS_UPDATE_USER_SEARCH_TEXT';

export const CHANGE_USER_VIEW_TYPE = 'DPS_CHANGE_USER_VIEW_TYPE';

export const SELCTE_YEAR_AND_MONTH_VALUE = 'DPS_SELCTE_YEAR_AND_MONTH_VALUE';

export const GET_ACTIVITY_DATA_BY_DAY = 'DPS_GET_ACTIVITY_DATA_BY_DAY';
export const GET_ACTIVITY_DATA_BY_DAY_SUCCESS = 'DPS_GET_ACTIVITY_DATA_BY_DAY_SUCCESS';
export const GET_ACTIVITY_DATA_BY_DAY_FAIL = 'DPS_GET_ACTIVITY_DATA_BY_DAY_FAIL';

export const GET_ACTIVITY_DATA_BY_MONTH = 'DPS_GET_ACTIVITY_DATA_BY_MONTH';
export const GET_ACTIVITY_DATA_BY_MONTH_SUCCESS = 'DPS_GET_ACTIVITY_DATA_BY_MONTH_SUCCESS';
export const GET_ACTIVITY_DATA_BY_MONTH_FAIL = 'DPS_GET_ACTIVITY_DATA_BY_MONTH_FAIL';

export const TEAM_USER_CHANGE = 'DPS_TEAM_USER_CHANGE';

export const GET_TEAM_MEMBER_LAST_MOVEMENT = 'DPS_GET_TEAM_MEMBER_LAST_MOVEMENT';
export const GET_TEAM_MEMBER_LAST_MOVEMENT_SUCCESS = 'DPS_GET_TEAM_MEMBER_LAST_MOVEMENT_SUCCESS';
export const GET_TEAM_MEMBER_LAST_MOVEMENT_FAIL = 'DPS_GET_TEAM_MEMBER_LAST_MOVEMENT_FAIL';

export const REQUEST_ACTIVITY_BY_MONTH = 'DPS_REQUEST_ACTIVITY_BY_MONTH';
export const REQUEST_ACTIVITY_BY_YEAR_SUMMARY = 'DPS_REQUEST_ACTIVITY_BY_YEAR_SUMMARY';

export const CLEAR_ACTIVITY_DATA_BY_DAY = 'DPS_CLEAR_ACTIVITY_DATA_BY_DAY';

export const LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR';
export const LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER_SUCCESS = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_SUCCESS';
export const LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER_FAIL = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_FAIL';





export class InitTeam extends TokenizeAction implements Action {
    readonly type = INIT_TEAM;
    constructor(public token: string, public payload: {
        columnDef: ColumnDef[],
        paginatorDef: PaginatorDef
        // filterOperate: { textOperators: { id: Operator, label: string }[], dateOperators: { id: Operator, label: string }[] }
    }) { super(token); }

}



export class ChangeDepartmentOrTeamType extends TokenizeAction implements Action {
    readonly type = CHANGE_DEPARTMENT_OR_TEAM_TYPE;
    constructor(public token: string, public payload: { departmentData: Department }) {
        super(token);
    }
}

export class ChangeTeamMemberSearchKey extends TokenizeAction implements Action {
    readonly type = CHANGE_TEAM_MEMBER_SEARCH_KEY;
    constructor(public token: string, public payload: { inPutData: TeamUserRequest }) {
        super(token);
    }
}

export class LoadActivityMembers extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_MEMBERS;
    constructor(public token: string) { super(token); }
}

export class LoadActivityMembersSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_MEMBERS_SUCCESS;
    constructor(public token: string, public payload: { teamMemberList: any }) { super(token); }
}

export class LoadActivityMembersFail extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_MEMBERS_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class LoadActivitySummaryYear extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR;
    constructor(public token: string, public payload: { data: any }) { super(token); }

}

export class LoadActivitySummaryYearSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_SUCCESS;
    constructor(public token: string, public payload: { eventYearSummery: AllDayEventByYear }) { super(token); }
}

export class LoadActivitySummaryYearFail extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GetTeamDepartmentList extends TokenizeAction implements Action {
    readonly type = GET_TEAM_DEPARTMENT_LIST;
    constructor(public token: string) { super(token); }
}

export class GetTeamDepartmentListSuccess extends TokenizeAction implements Action {
    readonly type = GET_TEAM_DEPARTMENT_LIST_SUCCESS;
    constructor(public token: string, public payload: { departmetList: any }) { super(token); }
}

export class GetTeamDepartmentListFail extends TokenizeAction implements Action {
    readonly type = GET_TEAM_DEPARTMENT_LIST_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}


// export class GetLogingTeamUser extends TokenizeAction implements Action {
//     readonly type = GET_LOGING_TEAM_USER;
//     constructor(public token: string, public payload: { TeamUserData: TeamMemberResponse }) {
//         super(token);
//     }
// }

export class UpdateUserSearchText extends TokenizeAction implements Action {
    readonly type = UPDATE_USER_SEARCH_TEXT;
    constructor(public token: string, public searchText) {
        super(token);
    }
}

export class ChangeUserViewType extends TokenizeAction implements Action {
    readonly type = CHANGE_USER_VIEW_TYPE;
    constructor(public token: string, public payload: { viewType: UserViewType }) {
        super(token);
    }
}

export class SelectYearAndMonthValue extends TokenizeAction implements Action {
    readonly type = SELCTE_YEAR_AND_MONTH_VALUE;
    constructor(public token: string, public payload: { selectdate: string, kind: UserViewType }) {
        super(token);
    }
}

export class GetActivityDataByDay extends TokenizeAction implements Action {
    readonly type = GET_ACTIVITY_DATA_BY_DAY;
    constructor(public token: string, public payload: { movementIds: any }) {
        super(token);
    }
}

export class GetActivityDataByDaySuccess extends TokenizeAction implements Action {
    readonly type = GET_ACTIVITY_DATA_BY_DAY_SUCCESS;
    constructor(public token: string, public payload: { activityDayList: DayActivity[] }) { super(token); }
}

export class GetActivityDataByDayFail extends TokenizeAction implements Action {
    readonly type = GET_ACTIVITY_DATA_BY_DAY_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}
export class RequestActivityByMonth extends TokenizeAction implements Action {
    readonly type = REQUEST_ACTIVITY_BY_MONTH;
    constructor(public token: string) {
        super(token);
    }

}

export class RequestActivityByYearSummery extends TokenizeAction implements Action {
    readonly type = REQUEST_ACTIVITY_BY_YEAR_SUMMARY;
    constructor(public token: string) {
        super(token);
    }

}
export class GetActivityDataByMonth extends TokenizeAction implements Action {
    readonly type = GET_ACTIVITY_DATA_BY_MONTH;
    constructor(public token: string, public payload: { requestData: UserRequestViewModel }) {
        super(token);
    }
}

export class GetActivityDataByMonthSuccess extends TokenizeAction implements Action {
    readonly type = GET_ACTIVITY_DATA_BY_MONTH_SUCCESS;
    constructor(public token: string, public payload: { activityMonthList: UserMovementTypesWithDaysResponce }) { super(token); }
}

export class GetActivityDataByMonthFail extends TokenizeAction implements Action {
    readonly type = GET_ACTIVITY_DATA_BY_MONTH_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class TeamUserChange extends TokenizeAction implements Action {
    readonly type = TEAM_USER_CHANGE;
    constructor(public token: string, public payload: { user: any }) { super(token); }
}


export class GetTeamMemberLastMovement extends TokenizeAction implements Action {
    readonly type = GET_TEAM_MEMBER_LAST_MOVEMENT;
    constructor(public token: string, public payload: { requestLastMovmentData: any }) {
        super(token);
    }
}

export class GetTeamMemberLastMovementSuccess extends TokenizeAction implements Action {
    readonly type = GET_TEAM_MEMBER_LAST_MOVEMENT_SUCCESS;
    constructor(public token: string, public payload: { lastMovementList: MonthActivity[] }) { super(token); }
}

export class GetTeamMemberLastMovementFail extends TokenizeAction implements Action {
    readonly type = GET_TEAM_MEMBER_LAST_MOVEMENT_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GetLogingTeamUser extends TokenizeAction implements Action {
    readonly type = GET_LOGING_TEAM_USER;
    constructor(public token: string, public payload: { teamMemberList: any }) {
        super(token);
    }
}

export class ClearActivityDataByDay extends TokenizeAction implements Action {
    readonly type = CLEAR_ACTIVITY_DATA_BY_DAY;
    constructor(public token: string) {
        super(token);
    }

}

export class LoadActivitySummaryYearByUser extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER;
    constructor(public token: string, public payload: { data: any }) { super(token); }

}

export class LoadActivitySummaryYearByUserSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER_SUCCESS;
    constructor(public token: string, public payload: { eventYearSummery: AllDayEventByYear }) { super(token); }
}

export class LoadActivitySummaryYearByUserFail extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}





export type Any = InitTeam |
    ChangeDepartmentOrTeamType | ChangeTeamMemberSearchKey | LoadActivityMembers | LoadActivityMembersSuccess |
    LoadActivityMembersFail | LoadActivitySummaryYear | LoadActivitySummaryYearSuccess | LoadActivitySummaryYearFail |
    GetTeamDepartmentList | GetTeamDepartmentListSuccess | GetTeamDepartmentListFail | UpdateUserSearchText
    | ChangeUserViewType | SelectYearAndMonthValue | GetActivityDataByDay | GetActivityDataByDaySuccess | GetActivityDataByDayFail
    | GetActivityDataByMonth | GetActivityDataByMonthSuccess | GetActivityDataByMonthFail | TeamUserChange | GetTeamMemberLastMovement
    | GetTeamMemberLastMovementSuccess | GetTeamMemberLastMovementFail | RequestActivityByYearSummery | GetLogingTeamUser
    | ClearActivityDataByDay | LoadActivitySummaryYearByUser | LoadActivitySummaryYearByUserSuccess | LoadActivitySummaryYearByUserFail;
