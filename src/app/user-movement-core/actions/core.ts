
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { CurrentDayUserMovement } from '../models/interfaces';
import { ScheduleInformation } from '../../core/lib/microsoft-graph';



export const INIT_USER_MOVEMENT = 'DPS_INIT_USER_MOVEMENT';
export const REQUEST_CURRENT_DATE_USER_MOVEMENT = 'DPS_REQUEST_CURRENT_DATE_USER_MOVEMENT';
export const GET_CURRENT_DATE_USER_MOVEMENT_SUCCESS = 'DPS_GET_CURRENT_DATE_USER_MOVEMENT_SUCCESS';
export const GET_CURRENT_DATE_USER_MOVEMENT_FAIL = 'DPS_GET_CURRENT_DATE_USER_MOVEMENT_FAIL';

export const GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES = 'DPS_GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES';
export const GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_SUCCESS = 'DPS_GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_SUCCESS';
export const GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_FAIL = 'DPS_GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_FAIL';

export const SELECT_USER_IN_MOVEMENT = 'SELECT_USER_IN_MOVEMENT';

export const ADD_MOVEMENT_DATA = 'DPS_ADD_MOVEMENT_DATA';
export const ADD_MOVEMENT_DATA_SUCCESS = 'DPS_ADD_MOVEMENT_DATA_SUCCESS';
export const ADD_MOVEMENT_DATA_FAIL = 'DPS_ADD_MOVEMENT_DATA_FAIL';

export const REFRESH_USER_MOVEMENT_LIST = 'DPS_REFRESH_USER_MOVEMENT_LIST';

export const CHANGE_USER_DEPARTMENT = 'DPS_CHANGE_USER_DEPARTMENT';
export const CHANGE_USER_SEARCH_TEXT = 'DPS_CHANGE_USER_SEARCH_TEXT';

export const LOAD_TEAM_FOR_MOVEMENT = 'DPS_LOAD_TEAM_FOR_MOVEMENT';
export const LOAD_TEAM_FOR_MOVEMENT_SUCCESS = 'DPS_LOAD_TEAM_FOR_MOVEMENT_SUCCESS';
export const LOAD_TEAM_FOR_MOVEMENT_FAIL = 'DPS_LOAD_TEAM_FOR_MOVEMENT_FAIL';

export const TEAM_MOVEMENT_DEPARTMENT_LIST = 'DPS_TEAM_MOVEMENT_DEPARTMENT_LIST';
export const TEAM_MOVEMENT_DEPARTMENT_LIST_SUCCESS = 'DPS_TEAM_MOVEMENT_DEPARTMENT_LIST_SUCCESS';
export const TEAM_MOVEMENT_DEPARTMENT_LIST_FAIL = 'DPS_TEAM_MOVEMENT_DEPARTMENT_LIST_FAIL';

export const GET_MOVEMENT_LOCATION = 'DPS_GET_MOVEMENT_LOCATION';
export const GET_MOVEMENT_LOCATION_SUCCESS = 'DPS_GET_MOVEMENT_LOCATION_SUCCESS';
export const GET_MOVEMENT_LOCATION_FAIL = 'DPS_GET_MOVEMENT_LOCATION_FAIL';

export const GET_USER_EVENT_LIST = 'DPS_GET_USER_EVENT_LIST';
export const GET_USER_EVENT_LIST_SUCCESS = 'DPS_GET_USER_EVENT_LIST_SUCCESS ';
export const GET_USER_EVENT_LIST_FAIL = 'DPS_GET_USER_EVENT_LIST_FAIL';

export const CHANGE_LOCATION = 'DPS_CHANGE_LOCATION';
export const CHANGE_IS_ALLDAY_EVENT = 'DPS_CHANGE_IS_ALLDAY_EVENT';





export class InitUserMovement extends TokenizeAction implements Action {
    readonly type = INIT_USER_MOVEMENT;
    constructor(public token: string) {
        super(token);
    }
}
export class RequestCurrentDateUserMovement extends TokenizeAction implements Action {
    readonly type = REQUEST_CURRENT_DATE_USER_MOVEMENT;
    constructor(public token: string, public userList: any, public payload: { location: string, isOffToday: boolean }) {
        super(token);
    }
}
export class GetCurrentUserMovementSuccess extends TokenizeAction implements Action {
    readonly type = GET_CURRENT_DATE_USER_MOVEMENT_SUCCESS;
    constructor(public token: string, public payload: { data: CurrentDayUserMovement[] }, public userList: any) {
        super(token);
    }
}
export class GetCurrentUserMovementFail extends TokenizeAction implements Action {
    readonly type = GET_CURRENT_DATE_USER_MOVEMENT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class GetNextAvailableUserMovementType extends TokenizeAction implements Action {
    readonly type = GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES;
    constructor(public token: string, public selectedUser: any) {
        super(token);
    }
}
export class GetNextAvailableUserMovementTypeSuccess extends TokenizeAction implements Action {
    readonly type = GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_SUCCESS;
    constructor(public token: string, public payload: { nextAvailableTypes: any }) {
        super(token);
    }
}
export class GetNextAvailableUserMovementTypeFail extends TokenizeAction implements Action {
    readonly type = GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class SelectUserInMovement extends TokenizeAction implements Action {
    readonly type = SELECT_USER_IN_MOVEMENT;
    constructor(public token: string, public user: any) {
        super(token);
    }
}
export class AddMovementData extends TokenizeAction implements Action {
    readonly type = ADD_MOVEMENT_DATA;
    constructor(public token: string, public payload: { submitData: any }) { super(token); }
}
export class AddMovementDataSuccess extends TokenizeAction implements Action {
    readonly type = ADD_MOVEMENT_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: any, user: string }) { super(token); }
}
export class AddMovementDataFail extends TokenizeAction implements Action {
    readonly type = ADD_MOVEMENT_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}
export class RefreshUserMovementList extends TokenizeAction implements Action {
    readonly type = REFRESH_USER_MOVEMENT_LIST;
    constructor(public token: string) { super(token); }
}
export class ChangeUserDepartment extends TokenizeAction implements Action {
    readonly type = CHANGE_USER_DEPARTMENT;
    constructor(public token: string, public payload: { departmentData: any }) { super(token); }
}
export class ChangeUserSearchText extends TokenizeAction implements Action {
    readonly type = CHANGE_USER_SEARCH_TEXT;
    constructor(public token: string, public searchText) {
        super(token);
    }
}
export class LoadTeamForMovement extends TokenizeAction implements Action {
    readonly type = LOAD_TEAM_FOR_MOVEMENT;
    constructor(public token: string) { super(token); }
}
export class LoadTeamForMovementSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TEAM_FOR_MOVEMENT_SUCCESS;
    constructor(public token: string, public payload: { teamMemberList: any }) { super(token); }
}
export class LoadTeamForMovementFail extends TokenizeAction implements Action {
    readonly type = LOAD_TEAM_FOR_MOVEMENT_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}
export class GetTeamMovementDepartmentList extends TokenizeAction implements Action {
    readonly type = TEAM_MOVEMENT_DEPARTMENT_LIST;
    constructor(public token: string) { super(token); }
}
export class GetTeamMovementDepartmentListSuccess extends TokenizeAction implements Action {
    readonly type = TEAM_MOVEMENT_DEPARTMENT_LIST_SUCCESS;
    constructor(public token: string, public payload: { departmetList: any }) { super(token); }
}
export class GetTeamMovementDepartmentListFail extends TokenizeAction implements Action {
    readonly type = TEAM_MOVEMENT_DEPARTMENT_LIST_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GetMovementLocation extends TokenizeAction implements Action {
    readonly type = GET_MOVEMENT_LOCATION;
    constructor(public token: string) { super(token); }
}
export class GetMovementLocationSuccess extends TokenizeAction implements Action {
    readonly type = GET_MOVEMENT_LOCATION_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class GetMovementLocationFail extends TokenizeAction implements Action {
    readonly type = GET_MOVEMENT_LOCATION_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetUserEventList extends TokenizeAction implements Action {
    readonly type = GET_USER_EVENT_LIST;
    constructor(public token: string, public teamMemberList: any) { super(token); }
}
export class GetUserEventListSuccess extends TokenizeAction implements Action {
    readonly type = GET_USER_EVENT_LIST_SUCCESS;
    constructor(public token: string, public payload: { data: ScheduleInformation[], timeOffset: number }) {
        super(token);
    }
}
export class GetUserEventListFail extends TokenizeAction implements Action {
    readonly type = GET_USER_EVENT_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangeLocation extends TokenizeAction implements Action {
    readonly type = CHANGE_LOCATION;
    constructor(public token: string, public location) {
        super(token);
    }
}

export class ChangeIsAlldayEvent extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_ALLDAY_EVENT;
    constructor(public token: string, public isAllday: boolean) {
        super(token);
    }
}


export type Any = InitUserMovement | RequestCurrentDateUserMovement | GetCurrentUserMovementSuccess | GetCurrentUserMovementFail |
    GetNextAvailableUserMovementType | GetNextAvailableUserMovementTypeSuccess | GetNextAvailableUserMovementTypeFail | SelectUserInMovement
    | AddMovementData | AddMovementDataSuccess | AddMovementDataFail | RefreshUserMovementList | ChangeUserDepartment
    | ChangeUserSearchText | LoadTeamForMovement | LoadTeamForMovementSuccess | LoadTeamForMovementFail | GetTeamMovementDepartmentList
    | GetTeamMovementDepartmentListSuccess | GetTeamMovementDepartmentListFail | GetMovementLocation | GetMovementLocationSuccess |
    GetMovementLocationFail | GetUserEventList | GetUserEventListSuccess | GetUserEventListFail | ChangeLocation | ChangeIsAlldayEvent;
