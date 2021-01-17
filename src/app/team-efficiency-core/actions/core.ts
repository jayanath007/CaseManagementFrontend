import { MatterTypeEnum } from '../models/enums';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { TimeRecordedOption } from '../models/enums';
import { Month, Department, AdgedDeb, BilledTime, CashRecived, BarChartData, Activity} from '../models/interfaces';
import { TeamMember } from '../../core/lib/team-members';



export const INIT_TEAM_EFFICIENCY = 'INIT_TEAM_EFFICIENCY';

export const LOAD_CHART_DATA = 'TE_LOAD_CHART_DATA';

export const LOAD_TE_MONTH_LIST = 'LOAD_TE_MONTH_LIST';
export const LOAD_TE_MONTH_LIST_SUCCESS = 'LOAD_TE_MONTH_LIST_SUCCESS';
export const LOAD_TE_MONTH_LIST_FAIL = 'LOAD_TE_MONTH_LIST_FAIL';

export const LOAD_TE_DEPARTMENT_LIST = 'LOAD_TE_DEPARTMENT_LIST';
export const LOAD_TE_DEPARTMENT_LIST_SUCCESS = 'LOAD_TE_DEPARTMENT_LIST_SUCCESS';
export const LOAD_TE_DEPARTMENT_LIST_FAIL = 'LOAD_TE_DEPARTMENT_LIST_FAIL';

export const LOAD_TE_TIME_RECORDED_DATA = 'LOAD_TE_TIME_RECORDED_DATA';
export const LOAD_TE_TIME_RECORDED_DATA_SUCCESS = 'LOAD_TE_TIME_RECORDED_DATA_SUCCESS';
export const LOAD_TE_TIME_RECORDED_DATA_FAIL = 'LOAD_TE_TIME_RECORDED_DATA_FAIL';

export const LOAD_TE_AGED_DEBTORS_DATA = 'LOAD_TE_AGED_DEBTORS_DATA';
export const LOAD_TE_AGED_DEBTORS_SUCCESS = 'LOAD_TE_AGED_DEBTORS_DATA_SUCCESS';
export const LOAD_TE_AGED_DEBTORS_DATA_FAIL = 'LOAD_TE_AGED_DEBTORS_DATA_FAIL';

export const LOAD_TE_BILLED_TIMES_DATA = 'LOAD_TE_BILLED_TIMES_DATA';
export const LOAD_TE_BILLED_TIMES_DATA_SUCCESS = 'LOAD_TE_BILLED_TIMES_DATA_SUCCESS';
export const LOAD_TE_BILLED_TIMES_DATA_FAIL = 'LOAD_TE_BILLED_TIMES_DATA_FAIL';

// export const LOAD_TE_CASH_RECIVED_DATA = 'LOAD_TE_CASH_RECIVED_DATA';
// export const LOAD_TE_CASH_RECIVED_DATA_SUCCESS = 'LOAD_TE_CASH_RECIVED_DATA_SUCCESS';
// export const LOAD_TE_CASH_RECIVED_DATA_FAIL = 'LOAD_TE_CASH_RECIVED_DATA_FAIL';

export const LOAD_TE_MATTER_DATA = 'LOAD_TE_MATTER_DATA';
export const LOAD_TE_MATTER_DATA_SUCCESS = 'LOAD_TE_MATTER_DATA_SUCCESS';
export const LOAD_TE_MATTER_DATA_FAIL = 'LOAD_TE_MATTER_DATA_FAIL';

export const CHANGE_TE_TIME_RECORDED_OPTION = 'CHANGE_TE_TIME_RECORDED_OPTION';
export const CHANGE_TE_MONTH = 'CHANGE_TE_MONTH';
export const CHANGE_TE_DEPARTMENT = 'CHANGE_TE_DEPARTMENT';
export const CHANGE_TE_USER = 'CHANGE_TE_USER';
export const CHANGE_TE_MATTER_TYPE = 'CHANGE_TE_MATTER_TYPE';

export const LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY';
export const LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_SUCCESS = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_SUCCESS';
export const LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_FAIL = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_FAIL';
export const REQUEST_ACTIVITY_BY_YEAR_SUMMARY_IN_EFFICIENCY = 'DPS_REQUEST_ACTIVITY_BY_YEAR_SUMMARY_IN_EFFICIENCY';



export class InitTeamEfficiency extends TokenizeAction implements Action {
    readonly type = INIT_TEAM_EFFICIENCY;
    constructor(public token: string, public payload: { user: any, matterLabel: string }) {
        super(token);
    }
}

export class LoadChartData extends TokenizeAction implements Action {
    readonly type = LOAD_CHART_DATA;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadTEMonthList extends TokenizeAction implements Action {
    readonly type = LOAD_TE_MONTH_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTEMonthListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TE_MONTH_LIST_SUCCESS;
    constructor(public token: string, public payload: { monthList: any }) {
        super(token);
    }
}
export class LoadTEMonthListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TE_MONTH_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadTEDepartmentList extends TokenizeAction implements Action {
    readonly type = LOAD_TE_DEPARTMENT_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTEDepartmentListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TE_DEPARTMENT_LIST_SUCCESS;
    constructor(public token: string, public payload: { departmentList: any }) {
        super(token);
    }
}
export class LoadTEDepartmentListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TE_DEPARTMENT_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadTETimeRecordedData extends TokenizeAction implements Action {
    readonly type = LOAD_TE_TIME_RECORDED_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTETimeRecordedDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TE_TIME_RECORDED_DATA_SUCCESS;
    constructor(public token: string, public payload: { timeRecordedData: BarChartData[] }) {
        super(token);
    }
}
export class LoadTETimeRecordedDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_TE_TIME_RECORDED_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadTEAdgedDebData extends TokenizeAction implements Action {
    readonly type = LOAD_TE_AGED_DEBTORS_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTEAdgedDebDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TE_AGED_DEBTORS_SUCCESS;
    constructor(public token: string, public payload: { newData: AdgedDeb[] }) {
        super(token);
    }
}
export class LoadTEAdgedDebDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_TE_AGED_DEBTORS_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class LoadTEBilledTimes extends TokenizeAction implements Action {
    readonly type = LOAD_TE_BILLED_TIMES_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTEBilledTimesSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TE_BILLED_TIMES_DATA_SUCCESS;
    constructor(public token: string, public payload: { newData: BilledTime[] }) {
        super(token);
    }
}
export class LoadTEBilledTimesFail extends TokenizeAction implements Action {
    readonly type = LOAD_TE_BILLED_TIMES_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

// export class LoadTECashRecived extends TokenizeAction implements Action {
//     readonly type = LOAD_TE_CASH_RECIVED_DATA;
//     constructor(public token: string) {
//         super(token);
//     }
// }
// export class LoadTECashRecivedSuccess extends TokenizeAction implements Action {
//     readonly type = LOAD_TE_CASH_RECIVED_DATA_SUCCESS;
//     constructor(public token: string, public payload: { newData: CashRecived[] }) {
//         super(token);
//     }
// }
// export class LoadTECashRecivedFail extends TokenizeAction implements Action {
//     readonly type = LOAD_TE_CASH_RECIVED_DATA_FAIL;
//     constructor(public token: string, public payload: { error: any }) {
//         super(token);
//     }
// }

export class LoadTEMatter extends TokenizeAction implements Action {
    readonly type = LOAD_TE_MATTER_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTEMatterSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TE_MATTER_DATA_SUCCESS;
    constructor(public token: string, public payload: { newData: BarChartData[] }) {
        super(token);
    }
}
export class LoadTEMatterFail extends TokenizeAction implements Action {
    readonly type = LOAD_TE_MATTER_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangeTETimeRecordedOption extends TokenizeAction implements Action {
    readonly type = CHANGE_TE_TIME_RECORDED_OPTION;
    constructor(public token: string, public payload: { option: TimeRecordedOption }) {
        super(token);
    }
}

export class ChangeTEMonth extends TokenizeAction implements Action {
    readonly type = CHANGE_TE_MONTH;
    constructor(public token: string, public payload: { selectedMonth: Month }) {
        super(token);
    }
}

export class ChangeTEDepartment extends TokenizeAction implements Action {
    readonly type = CHANGE_TE_DEPARTMENT;
    constructor(public token: string, public payload: { selectedDepartment: Department }) {
        super(token);
    }
}

export class ChangeTEUser extends TokenizeAction implements Action {
    readonly type = CHANGE_TE_USER;
    constructor(public token: string, public payload: { user: TeamMember }) {
        super(token);
    }
}

export class ChangeTEMatterType extends TokenizeAction implements Action {
    readonly type = CHANGE_TE_MATTER_TYPE;
    constructor(public token: string, public payload: { type: MatterTypeEnum }) {
        super(token);
    }
}

export class LoadActivitySummaryUserInEfficiency extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY;
    constructor(public token: string, public payload: { data: any }) { super(token); }

}

export class LoadActivitySummaryYearInEfficiencySuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_SUCCESS;
    constructor(public token: string, public payload: { eventYearSummery: any }) { super(token); }
}

export class LoadActivitySummaryYearInEfficiencyFail extends TokenizeAction implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class RequestActivityByYearSummeryInEfficiency extends TokenizeAction implements Action {
    readonly type = REQUEST_ACTIVITY_BY_YEAR_SUMMARY_IN_EFFICIENCY;
    constructor(public token: string) {
        super(token);
    }

}


export type Any = InitTeamEfficiency |
    LoadTEMonthList | LoadTEMonthListSuccess | LoadTEMonthListFail |
    LoadTEDepartmentList | LoadTEDepartmentListSuccess | LoadTEDepartmentListFail |
    LoadTETimeRecordedData | LoadTETimeRecordedDataSuccess | LoadTETimeRecordedDataFail |
    ChangeTETimeRecordedOption | ChangeTEMonth | ChangeTEDepartment | ChangeTEUser |
    LoadTEAdgedDebData | LoadTEAdgedDebDataSuccess | LoadTEAdgedDebDataFail |
    LoadTEBilledTimes | LoadTEBilledTimesSuccess | LoadTEBilledTimesFail |
    // LoadTECashRecived | LoadTECashRecivedSuccess | LoadTECashRecivedFail |
    LoadTEMatter | LoadTEMatterSuccess | LoadTEMatterFail |
    ChangeTEMatterType | LoadActivitySummaryUserInEfficiency| LoadActivitySummaryYearInEfficiencySuccess
     | LoadActivitySummaryYearInEfficiencyFail
    | RequestActivityByYearSummeryInEfficiency;
