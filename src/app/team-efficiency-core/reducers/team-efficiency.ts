import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { TimeRecordedOption, MatterTypeEnum } from '../models/enums';
import { TeamMember } from '../../core/lib/team-members';
import {
    Month, Department, AdgedDeb,
    BilledTime, BilledTimeChartData, CashReceivedChartData, CashRecived, MatterChartData, BarChartData, AdgedDebChartData, AllDayEventByYear
} from '../models/interfaces';

export interface State {
    readonly [token: string]: TeamEfficiencyState;
}

export interface TeamEfficiencyState {
    readonly loading: boolean;
    readonly timeRecordedLdoading: boolean;
    readonly selectedUser: TeamMember;
    readonly selectedDepartment: Department;
    readonly selectedMonth: Month;
    readonly selectedMatterType: MatterTypeEnum;
    readonly timeRecordedChartTitle: string;
    readonly departmentList: Department[];
    readonly monthList: Month[];
    readonly timeRecordedData: BarChartData[];
    readonly adgedDebData: AdgedDebChartData;
    readonly billedTimesData: BilledTimeChartData;
    readonly cashReceivedData: CashReceivedChartData;
    readonly matterData: MatterChartData;
    readonly eventYearSummery: AllDayEventByYear;
    readonly userActivityLoading: boolean;
    readonly activityTitle: string;
    readonly matterLabel: string;

    readonly timeRecordOption: TimeRecordedOption;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_TEAM_EFFICIENCY:
            temp[action.token] = initTeamEfficiency(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.LOAD_TE_MONTH_LIST:
            temp[action.token] = loadMonthList(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_MONTH_LIST_SUCCESS:
            temp[action.token] = loadMonthListSuccess(state[action.token], action.payload.monthList);
            return { ...state, ...temp };
        case Actions.LOAD_TE_MONTH_LIST_FAIL:
            temp[action.token] = loadMonthListFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_DEPARTMENT_LIST:
            temp[action.token] = loadDepartmentList(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_DEPARTMENT_LIST_SUCCESS:
            temp[action.token] = loadDepartmentListSuccess(state[action.token], action.payload.departmentList);
            return { ...state, ...temp };
        case Actions.LOAD_TE_DEPARTMENT_LIST_FAIL:
            temp[action.token] = loadDepartmentListFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_TIME_RECORDED_DATA:
            temp[action.token] = getTimeRecordrdData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_TIME_RECORDED_DATA_SUCCESS:
            temp[action.token] = getTimeRecordrdDataSuccess(state[action.token], action.payload.timeRecordedData);
            return { ...state, ...temp };
        case Actions.LOAD_TE_TIME_RECORDED_DATA_FAIL:
            temp[action.token] = getTimeRecordrdDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_TE_TIME_RECORDED_OPTION:
            temp[action.token] = changeTimeRecordrdOption(state[action.token], action.payload.option);
            return { ...state, ...temp };
        case Actions.CHANGE_TE_MONTH:
            temp[action.token] = changeMonth(state[action.token], action.payload.selectedMonth);
            return { ...state, ...temp };
        case Actions.CHANGE_TE_DEPARTMENT:
            temp[action.token] = changeDepartment(state[action.token], action.payload.selectedDepartment);
            return { ...state, ...temp };
        case Actions.CHANGE_TE_USER:
            temp[action.token] = changeUser(state[action.token], action.payload.user);
            return { ...state, ...temp };
        case Actions.LOAD_TE_AGED_DEBTORS_DATA:
            temp[action.token] = loadAdgedDebData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_AGED_DEBTORS_SUCCESS:
            temp[action.token] = loadAdgedDebDataSuccess(state[action.token], action);
            return { ...state, ...temp };
        case Actions.LOAD_TE_AGED_DEBTORS_DATA_FAIL:
            temp[action.token] = loadAdgedDebDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_BILLED_TIMES_DATA:
            temp[action.token] = loadBilledTimeData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_BILLED_TIMES_DATA_SUCCESS:
            temp[action.token] = loadBilledTimeDataSuccess(state[action.token], action);
            return { ...state, ...temp };
        case Actions.LOAD_TE_BILLED_TIMES_DATA_FAIL:
            temp[action.token] = loadBilledTimeDataFail(state[action.token]);
            return { ...state, ...temp };
        // case Actions.LOAD_TE_CASH_RECIVED_DATA:
        //     temp[action.token] = loadCashResivedData(state[action.token]);
        //     return { ...state, ...temp };
        // case Actions.LOAD_TE_CASH_RECIVED_DATA_SUCCESS:
        //     temp[action.token] = loadCashResivedDataSuccess(state[action.token], action);
        //     return { ...state, ...temp };
        // case Actions.LOAD_TE_CASH_RECIVED_DATA_FAIL:
        //     temp[action.token] = loadCashResivedDataFail(state[action.token]);
        //     return { ...state, ...temp };
        case Actions.LOAD_TE_MATTER_DATA:
            temp[action.token] = loadMatterData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_TE_MATTER_DATA_SUCCESS:
            temp[action.token] = loadMatterDataSuccess(state[action.token], action);
            return { ...state, ...temp };
        case Actions.LOAD_TE_MATTER_DATA_FAIL:
            temp[action.token] = loadMatterDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_TE_MATTER_TYPE:
            temp[action.token] = changeMatterType(state[action.token], action);
            return { ...state, ...temp };
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY:
            temp[action.token] = loadActivityData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_SUCCESS:
            temp[action.token] = loadActivityDataSuccess(state[action.token], action.payload.eventYearSummery);
            return { ...state, ...temp };
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY_FAIL:
            temp[action.token] = loadActivityDataFail(state[action.token]);
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}



function initTeamEfficiency(state: TeamEfficiencyState, input: { user: any; matterLabel: string; }) {
    if (state) {
        return state;
    }
    return {
        ...state,
        selectedUser: null,
        selectedMonth: { monthId: -2, monthName: 'YTD' },
        selectedDepartment: null,
        selectedMatterType: MatterTypeEnum.OPENED,
        timeRecordOption: TimeRecordedOption.CHARGEABLE,
        timeRecordedChartTitle: 'TIME RECORDED - VALUE',
        departmentList: null,
        timeRecordedData: null,
        eventYearSummery: null,
        activityTitle: getPostTitle(null, null, null),
        adgedDebData: changeAdgedDebChartData(null, emptyAdgedDebChartData(), true, getPostTitle(null, null, null)),
        billedTimesData: changeBilledTimeChartData(null, emptyBilledTMChartData(), true, getPostTitle(null, null, null)),
        cashReceivedData: changeCashReceivedData(null, emptyCashReceivedChartData(), true, getPostTitle(null, null, null)),
        matterData: changeMatterData(null, emptyMatterChartData(), true, getPostTitle(null, null, null), input.matterLabel),
        matterLabel: input.matterLabel
    };
}

function loadMonthList(state: TeamEfficiencyState) {
    return {
        ...state, loading: true
    };
}

function loadMonthListSuccess(state: TeamEfficiencyState, monthList: Month[]) {
    return {
        ...state,
        monthList: monthList, loading: false
    };
}

function loadMonthListFail(state: TeamEfficiencyState) {
    return {
        ...state, loading: false
    };
}

function loadDepartmentList(state: TeamEfficiencyState) {
    return {
        ...state, loading: true
    };
}

function loadDepartmentListSuccess(state: TeamEfficiencyState, departmentList: Department[]) {
    return {
        ...state,
        departmentList: departmentList, loading: false
    };
}

function loadDepartmentListFail(state: TeamEfficiencyState) {
    return {
        ...state, loading: false
    };
}

function getTimeRecordrdData(state: TeamEfficiencyState) {
    return {
        ...state,
        timeRecordedLdoading: true,
        timeRecordedChartTitle: getTimeRecordedTitle(state)
    };
}

function getTimeRecordrdDataSuccess(state: TeamEfficiencyState, timeRecordedData: BarChartData[]) {
    return {
        ...state,
        timeRecordedLdoading: false,
        timeRecordedData: timeRecordedData,
    };
}

function getTimeRecordrdDataFail(state: TeamEfficiencyState) {
    return {
        ...state,
        timeRecordedLdoading: false
    };
}

function loadAdgedDebData(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state, adgedDebData: changeAdgedDebChartData(state.adgedDebData, emptyAdgedDebChartData(), true,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

function loadAdgedDebDataSuccess(state: TeamEfficiencyState, action: Actions.LoadTEAdgedDebDataSuccess): Partial<TeamEfficiencyState> {
    return {
        ...state,
        adgedDebData: changeAdgedDebChartData(state.adgedDebData, action.payload.newData, false,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

function loadAdgedDebDataFail(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state, adgedDebData: changeAdgedDebChartData(state.adgedDebData, emptyAdgedDebChartData(), true,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

function loadBilledTimeData(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state, billedTimesData: changeBilledTimeChartData(state.billedTimesData, emptyBilledTMChartData(), true,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

function loadBilledTimeDataSuccess(state: TeamEfficiencyState, action: Actions.LoadTEBilledTimesSuccess): Partial<TeamEfficiencyState> {
    return {
        ...state,
        billedTimesData: changeBilledTimeChartData(state.billedTimesData, action.payload.newData, false,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

function loadBilledTimeDataFail(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state,
        billedTimesData: changeBilledTimeChartData(state.billedTimesData, emptyBilledTMChartData(), true,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

function loadCashResivedData(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state, cashReceivedData: changeCashReceivedData(state.cashReceivedData, emptyCashReceivedChartData(), true,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

// function loadCashResivedDataSuccess(state: TeamEfficiencyState, action: Actions.LoadTECashRecivedSuccess): Partial<TeamEfficiencyState> {
//     return {
//         ...state,
//         cashReceivedData: changeCashReceivedData(state.cashReceivedData, action.payload.newData, false,
//             getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
//     };
// }

function loadCashResivedDataFail(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state,
        cashReceivedData: changeCashReceivedData(state.cashReceivedData, emptyCashReceivedChartData(), true,
            getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth))
    };
}

function loadMatterData(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state,
        matterData: changeMatterData(state.matterData, emptyMatterChartData(), true,
            state.selectedMatterType + ' ' + getPostTitle(state.selectedDepartment,
                state.selectedUser, state.selectedMonth), state.matterLabel)
    };
}

function loadMatterDataSuccess(state: TeamEfficiencyState, action: Actions.LoadTEMatterSuccess): Partial<TeamEfficiencyState> {
    return {
        ...state,
        matterData: changeMatterData(state.matterData, action.payload.newData, false,
            state.selectedMatterType + ' ' + getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth),
            state.matterLabel)
    };
}

function loadMatterDataFail(state: TeamEfficiencyState): Partial<TeamEfficiencyState> {
    return {
        ...state,
        matterData: changeMatterData(state.matterData, emptyMatterChartData(), true,
            state.selectedMatterType + ' ' + getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth).toUpperCase(),
            state.matterLabel)
    };
}

function changeMatterType(state: TeamEfficiencyState, action: Actions.ChangeTEMatterType): Partial<TeamEfficiencyState> {
    return {
        ...state,
        selectedMatterType: action.payload.type
    };
}

function changeAdgedDebChartData(curentData: AdgedDebChartData, newData: AdgedDeb[], isLoading: boolean, title): AdgedDebChartData {
    return {
        ...curentData,
        data: newData,
        isLoading: isLoading,
        title: 'AGED DEBTORS ' + title.toUpperCase()
    };
}

function changeBilledTimeChartData(curentData: BilledTimeChartData, newData: BilledTime[], isLoading: boolean, title): BilledTimeChartData {
    return {
        ...curentData,
        data: newData,
        isLoading: isLoading,
        title: 'BILLED' + title.toUpperCase()
    };
}

function changeCashReceivedData(curentData: CashReceivedChartData, newData: CashRecived[],
    isLoading: boolean, title): CashReceivedChartData {
    return {
        ...curentData,
        data: newData,
        isLoading: isLoading,
        title: 'CASH RECEIVED' + title.toUpperCase()
    };
}

function changeMatterData(curentData: MatterChartData, newData: BarChartData[], isLoading: boolean, title, matterLabel: string):
    MatterChartData {
    return {
        ...curentData,
        data: newData,
        isLoading: isLoading,
        title: matterLabel.toUpperCase() + ' ' + title.toUpperCase()
    };
}

function changeTimeRecordrdOption(state: TeamEfficiencyState, option: TimeRecordedOption) {
    return {
        ...state,
        timeRecordOption: option
    };
}

function changeMonth(state: TeamEfficiencyState, month: Month) {
    return {
        ...state,
        selectedMonth: month,
        eventYearSummery: null
    };
}
// test
function changeDepartment(state: TeamEfficiencyState, department: Department) {
    return {
        ...state,
        selectedDepartment: department,
        selectedUser: null
    };
}


function changeUser(state: TeamEfficiencyState, user: TeamMember) {
    return {
        ...state,
        selectedUser: user
    };
}

function tt(state: TeamEfficiencyState) {
    return {
        ...state
    };
}

function getTimeRecordedTitle(state: TeamEfficiencyState) {
    return ('TIME RECORDED' + ' - ' + state.timeRecordOption +
        getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth)).toUpperCase();
}

function getPostTitle(department: Department, user: TeamMember, month: Month) {
    const groupName = department ? department.groupName : 'ALL GROUPS';
    const userName = user ? user.user : 'ALL USERS';
    const monthName = month ? month.monthName : 'YTD';
    return ' (' + groupName + '/ ' + userName + '/ ' + monthName + ')';
}

function emptyAdgedDebChartData(): AdgedDeb[] {
    return [
        {
            amount: 0,
            debtPeriod: 'Current',
        },
        {
            amount: 0,
            debtPeriod: '31-61 Days Overdue',
        },
        {
            amount: 0,
            debtPeriod: '61-91 Days Overdue',
        },
        {
            amount: 0,
            debtPeriod: '91-121 Days Overdue',
        },
        {
            amount: 0,
            debtPeriod: '>121 Days Overdue',
        },
    ];
}

function emptyBilledTMChartData(): BilledTime[] {
    return [
        {
            currentYear: 0,
            lastYear: 0,
            month: null,
            target: 0,
        }
    ];
}

function emptyCashReceivedChartData(): CashRecived[] {
    return [
        {
            currentYear: 0,
            lastYear: 0,
            month: null,
            target: 0,
        }
    ];
}

function emptyMatterChartData(): CashRecived[] {
    return [
        {
            currentYear: 0,
            lastYear: 0,
            month: null,
            target: 0,
        }
    ];
}

function loadActivityData(state: TeamEfficiencyState) {
    return {
        ...state,
        userActivityLoading: true,
        activityTitle: null,
        eventYearSummery: null

    };
}

function loadActivityDataSuccess(state: TeamEfficiencyState, AllDayEventYearSummary: AllDayEventByYear) {
    return {
        ...state,
        userActivityLoading: false,
        eventYearSummery: AllDayEventYearSummary,
        activityTitle: getPostTitle(state.selectedDepartment, state.selectedUser, state.selectedMonth),
    };
}

function loadActivityDataFail(state: TeamEfficiencyState) {
    return {
        ...state,
        userActivityLoading: false
    };
}



export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);

export const getDepartmentListByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.departmentList : []);

export const getSelectedUserByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState && teamEfficiencyState.selectedUser
        && teamEfficiencyState.selectedDepartment
        ? teamEfficiencyState.selectedUser.user : '');

export const getSelectedMonthByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.selectedMonth : null);
export const getSelectedDepartmentByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState && teamEfficiencyState.selectedDepartment ?
        teamEfficiencyState.selectedDepartment.groupId : NaN);
export const getSelectedTimeRecordedOptionByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.timeRecordOption : null);
export const getSelectedMatterType = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.selectedMatterType : false);
export const getTimeRecordedDataByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.timeRecordedData : []);
export const getMonthListByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.monthList : []);

export const getTimeRecordOptionByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.timeRecordOption : null);

export const getTimeRecordChartTitleByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.timeRecordedChartTitle : '');

export const getLoadingByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.loading : false);
export const getTimeRecordDataIsLoadedByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.timeRecordedLdoading : false);
export const getAdgedDebDataByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.adgedDebData : false);
export const getBilledTimesByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.billedTimesData : false);
export const getCashReceived = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.cashReceivedData : false);
export const getMatterData = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.matterData : false);
// export const getSelectedYearForMovementData = (token) =>
//     createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? '2019' : '2019');

export const getEventYearSummeryByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.eventYearSummery : null);

export const getUserActivityLoadingByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.userActivityLoading : false);

export const getActivityTitleByToken = (token) =>
    createSelector(getViewByToken(token), (teamEfficiencyState) => teamEfficiencyState ? teamEfficiencyState.activityTitle : null);