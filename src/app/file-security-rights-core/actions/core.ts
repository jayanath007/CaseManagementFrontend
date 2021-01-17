import { Action } from '@ngrx/store';
import { UserWithRights } from '../models/interface';
export const GET_USERS_WITH_FILE_SECURITY_RIGHT = 'DPS_FILE_SECURITY_RIGHT_GET_USERS_WITH_FILE_SECURITY_RIGHT';
export const GET_USERS_WITH_FILE_SECURITY_RIGHT_SUCCESS = 'DPS_FILE_SECURITY_RIGHT_GET_USERS_WITH_FILE_SECURITY_RIGHT_SUCCESS';
export const GET_USERS_WITH_FILE_SECURITY_RIGHT_FAIL = 'DPS_FILE_SECURITY_RIGHT_GET_USERS_WITH_FILE_SECURITY_RIGHT_FAIL';

export const CANGE_USERS_WITH_FILE_SECURITY_RIGHT = 'DPS_FILE_SECURITY_RIGHT_CANGE_USERS_WITH_FILE_SECURITY_RIGHT';
export const CANGE_USERS_WITH_FILE_SECURITY_RIGHT_SUCCESS = 'DPS_FILE_SECURITY_RIGHT_CANGE_USERS_WITH_FILE_SECURITY_RIGHT_SUCCESS';
export const CANGE_USERS_WITH_FILE_SECURITY_RIGHT_FAIL = 'DPS_FILE_SECURITY_RIGHT_CANGE_USERS_WITH_FILE_SECURITY_RIGHT_FAIL';

export const HASE_RIGHTS_CHANGE = 'DPS_FILE_SECURITY_RIGHT_HASE_RIGHTS_CHANGE';

export class GetUsersWithFileSecurityRights implements Action {
    readonly type = GET_USERS_WITH_FILE_SECURITY_RIGHT;
    constructor(public payload: number) {
    }
}
export class GetUsersWithFileSecurityRightsSuccess implements Action {
    readonly type = GET_USERS_WITH_FILE_SECURITY_RIGHT_SUCCESS;
    constructor(public payload: UserWithRights[]) {
    }
}
export class GetUsersWithFileSecurityRightsFail implements Action {
    readonly type = GET_USERS_WITH_FILE_SECURITY_RIGHT_FAIL;
    constructor(public error: any) { }
}

export class ChangeUsersWithFileSecurityRights implements Action {
    readonly type = CANGE_USERS_WITH_FILE_SECURITY_RIGHT;
    constructor(public payload: { matterId: number, userListWithRights: UserWithRights[] }) {
    }
}
export class ChangeUsersWithFileSecurityRightsSuccess implements Action {
    readonly type = CANGE_USERS_WITH_FILE_SECURITY_RIGHT_SUCCESS;
    constructor() {}
}
export class ChangeUsersWithFileSecurityRightsFail implements Action {
    readonly type = CANGE_USERS_WITH_FILE_SECURITY_RIGHT_FAIL;
    constructor(public error: any) { }
}

export class HasRightsChange implements Action {
    readonly type = HASE_RIGHTS_CHANGE;
    constructor(public payload: { value: boolean, index: number }) { }
}
export type Any = GetUsersWithFileSecurityRights | GetUsersWithFileSecurityRightsSuccess | GetUsersWithFileSecurityRightsFail |
    HasRightsChange;
