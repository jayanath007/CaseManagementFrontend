import { DropdownListItem, DepartmentWithMatterAndAppCode, FeeEarnerInfo } from '../model/interface';
import { LookupViewModel } from '../../core';
import { LookupType, LoockupItem } from '../../shared';

export const GET_DEPARTMENT_LIST = 'MASTER_DATA_GET_DEPARTMENT_LIST';
export const GET_DEPARTMENT_LIST_SUCCESS = 'MASTER_DATA_GET_DEPARTMENT_LIST_SUCCESS';
export const GET_DEPARTMENT_LIST_FAIL = 'MASTER_DATA_GET_DEPARTMENT_LIST_FAIL';
export const GET_WORK_TYPE_LIST = 'MASTER_DATA_WORK_TYPE_LIST';
export const GET_WORK_TYPE_LIST_SUCCESS = 'MASTER_DATA_WORK_TYPE_LIST_SUCCESS';
export const GET_WORK_TYPE_LIST_FAIL = 'MASTER_DATA_WORK_TYPE_LIST_FAIL';
export const GET_LOOCKUP_LIST = 'MASTER_GET_LOOCKUP_LIST_LIST';
export const GET_LOOCKUP_LIST_SUCCESS = 'MASTER_DATA_GET_GET_LOOCKUP_LIST_SUCCESS';
export const GET_LOOCKUP_LIST_FAIL = 'MASTER_GET_LOOCKUP_LIST_FAIL';
export const GET_CRIME_LOOCKUP_LIST = 'MATER_GET_CRIME_LOOCKUP_LIST';
export const GET_CRIME_LOOCKUP_LIST_SUCCESS = 'MATER_GET_CRIME_LOOCKUP_LIST_SUCCESS';
export const GET_CRIME_LOOCKUP_LIST_FAIL = 'MATER_GET_CRIME_LOOCKUP_LIST_FAIL';
export const GET_FEE_EARNER_LIST = 'MATER_FEE_EARNER_LIST';
export const GET_FEE_EARNER_LIST_SUCCESS = 'MATER_FEE_EARNER_LIST_SUCCESS';
export const GET_FEE_EARNER_LIST_FAIL = 'MATER_FEE_EARNER_LIST_FAIL';
export const GET_BRANCH_LIST = 'MATER_BRANCH_LIST';
export const GET_BRANCH_LIST_SUCCESS = 'MATER_BRANCH_LIST_SUCCESS';
export const GET_BRANCH_LIST_FAIL = 'MATER_BRANCH_LIST_FAIL';

export class GetDepartment {
    readonly type = GET_DEPARTMENT_LIST;
    constructor() {
    }
}
export class GetDepartmentSuccess {
    readonly type = GET_DEPARTMENT_LIST_SUCCESS;
    constructor(public payload: { departmentList: DepartmentWithMatterAndAppCode[] }) {
    }
}
export class GetDepartmentFail {
    readonly type = GET_DEPARTMENT_LIST_FAIL;
    constructor() {
    }
}


export class GetWorkTypeList {
    readonly type = GET_WORK_TYPE_LIST;
    constructor() {
    }
}
export class GetWorkTypeListSuccess {
    readonly type = GET_WORK_TYPE_LIST_SUCCESS;
    constructor(public payload: { workTypeList: DropdownListItem[] }) {

    }
}
export class GetWorkTypeListFail {
    readonly type = GET_WORK_TYPE_LIST_FAIL;
    constructor() {

    }
}

export class GetLookupList {
    readonly type = GET_LOOCKUP_LIST;
    constructor(public lookupType: string) {
    }
}
export class GetLookupListSuccess {
    readonly type = GET_LOOCKUP_LIST_SUCCESS;
    constructor(public payload: { data: LookupViewModel }) {
    }
}
export class GetLookupListFail {
    readonly type = GET_LOOCKUP_LIST_FAIL;
    constructor() {
    }
}

export class GetCrimeLookupList {
    readonly type = GET_CRIME_LOOCKUP_LIST;
    constructor(public lookupType: LookupType) {
    }
}
export class GetCrimeLookupListSuccess {
    readonly type = GET_CRIME_LOOCKUP_LIST_SUCCESS;
    constructor(public payload: { lookupType: LookupType, data: LoockupItem[] }) {
    }
}
export class GetCrimeLookupListFail {
    readonly type = GET_CRIME_LOOCKUP_LIST_FAIL;
    constructor() {
    }
}

export class GetFeeEarnerList {
    readonly type = GET_FEE_EARNER_LIST;
    constructor(public isActive: boolean) {
    }
}
export class GetFeeEarnerListSuccess {
    readonly type = GET_FEE_EARNER_LIST_SUCCESS;
    constructor(public isActive: boolean, public list: FeeEarnerInfo[]) {
    }
}
export class GetFeeEarnerListFail {
    readonly type = GET_FEE_EARNER_LIST_FAIL;
    constructor() {
    }
}
export class GetBranchList {
    readonly type = GET_BRANCH_LIST;
    constructor() {
    }
}
export class GetBranchListSuccess {
    readonly type = GET_BRANCH_LIST_SUCCESS;
    constructor(public branchList: DropdownListItem[]) {
    }
}
export class GetBranchListFail {
    readonly type = GET_BRANCH_LIST_FAIL;
    constructor() {
    }
}


export type Any = GetDepartment | GetDepartmentSuccess | GetDepartmentFail | GetWorkTypeList | GetWorkTypeListSuccess |
    GetWorkTypeListFail | GetLookupList | GetLookupListSuccess | GetLookupListFail | GetCrimeLookupList | GetCrimeLookupListSuccess
    | GetCrimeLookupListFail | GetFeeEarnerListSuccess | GetBranchListSuccess;
