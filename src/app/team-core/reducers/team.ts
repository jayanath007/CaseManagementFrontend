

import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import {
    Department, TeamMember, TeamMemberResponse, MonthActivityResponce, MonthActivity,
    DayActivity, AllDayEventByYear, UserMovementTypesWithDaysResponce
} from '../models/interface';

import { UserViewType } from '../models/enum';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Action } from 'rxjs/internal/scheduler/Action';



export interface State {
    readonly [token: string]: TeamState;
}

export interface TeamState {



    readonly department: number;
    readonly searchUserText: string;
    readonly isInactiveFeeEarners: boolean;
    readonly teamUsersLoading: boolean;
    readonly loading: boolean;
    readonly loginUser: TeamMember;
    readonly teamMembers: TeamMember[];
    readonly tempTeamMembers: TeamMember[];
    readonly selectedViewType: UserViewType;
    readonly selectedYearAndMonth: Moment;
    readonly selectedTeamUser: any;
    readonly departmentList: Department[];
    readonly monthActivityList: MonthActivityResponce[];
    readonly activityListByDay: DayActivity[];
    readonly eventYearSummery: AllDayEventByYear;
    readonly holiDays: any;

}

const dateObj = new Date();

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_TEAM:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CHANGE_DEPARTMENT_OR_TEAM_TYPE:
            tmp[action.token] = setChangeDepartment(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.CHANGE_TEAM_MEMBER_SEARCH_KEY:
            tmp[action.token] = changeMemberSearchKey(state[action.token]);
            return { ...state, ...tmp };

        case Actions.LOAD_ACTIVITY_MEMBERS:
            tmp[action.token] = setMemberData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_ACTIVITY_MEMBERS_SUCCESS:
            tmp[action.token] = setMemberDataSuccess(state[action.token], action.payload.teamMemberList);
            return { ...state, ...tmp };
        case Actions.LOAD_ACTIVITY_MEMBERS_FAIL:
            tmp[action.token] = setMemberDataFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.GET_TEAM_DEPARTMENT_LIST:
            tmp[action.token] = loadDepartmentList(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_DEPARTMENT_LIST_SUCCESS:
            tmp[action.token] = loadDepartmentListSuccess(state[action.token], action.payload.departmetList);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_DEPARTMENT_LIST_FAIL:
            tmp[action.token] = loadDepartmentListFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.UPDATE_USER_SEARCH_TEXT:
            tmp[action.token] = setUserSearchText(state[action.token], action.searchText);
            return { ...state, ...tmp };
        case Actions.CHANGE_USER_VIEW_TYPE:
            tmp[action.token] = setChangeViewType(state[action.token], action.payload.viewType);
            return { ...state, ...tmp };
        case Actions.SELCTE_YEAR_AND_MONTH_VALUE:
            tmp[action.token] = setSelectYearAndMonth(state[action.token], action.payload.selectdate);
            return { ...state, ...tmp };

        case Actions.GET_ACTIVITY_DATA_BY_DAY:
            tmp[action.token] = getActivityByDay(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_ACTIVITY_DATA_BY_DAY_SUCCESS:
            tmp[action.token] = getActivityByDaySuccess(state[action.token], action.payload.activityDayList);
            return { ...state, ...tmp };
        case Actions.GET_ACTIVITY_DATA_BY_DAY_FAIL:
            tmp[action.token] = getActivityByDayFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.GET_ACTIVITY_DATA_BY_MONTH:
            tmp[action.token] = getActivityByMonth(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_ACTIVITY_DATA_BY_MONTH_SUCCESS:
            tmp[action.token] = getActivityByMonthSuccess(state[action.token], action.payload.activityMonthList);
            return { ...state, ...tmp };
        case Actions.GET_ACTIVITY_DATA_BY_MONTH_FAIL:
            tmp[action.token] = getActivityByMonthFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.TEAM_USER_CHANGE:
            tmp[action.token] = setSelectedTeamUser(state[action.token], action.payload.user);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_MEMBER_LAST_MOVEMENT:
            tmp[action.token] = getUserLastMovement(state[action.token]);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_MEMBER_LAST_MOVEMENT_SUCCESS:
            tmp[action.token] = getUserLastMovementSuccess(state[action.token], action.payload.lastMovementList);
            return { ...state, ...tmp };
        case Actions.GET_TEAM_MEMBER_LAST_MOVEMENT_FAIL:
            tmp[action.token] = getUserLastMovementFail(state[action.token]);
            return { ...state, ...tmp };

        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR:
            tmp[action.token] = setYearData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_SUCCESS:
            tmp[action.token] = setYearDataSuccess(state[action.token], action.payload);
            return { ...state, ...tmp };
        case Actions.LOAD_ACTIVITY_SUMMARY_YEAR_FAIL:
            tmp[action.token] = setYearDataFail(state[action.token]);
            return { ...state, ...tmp };
        case (Actions.GET_LOGING_TEAM_USER):
            tmp[action.token] = getLogingUser(state[action.token], action.payload.teamMemberList);
            return { ...state, ...tmp };
        case (Actions.CLEAR_ACTIVITY_DATA_BY_DAY):
            tmp[action.token] = clearDayMovement(state[action.token]);
            return { ...state, ...tmp };

        default:
            { return state; }
    }
}




function initView(state: TeamState, action: Actions.InitTeam): Partial<TeamState> {
    if (!state) {
        return {
            ...state,
            department: null,
            searchUserText: null,
            isInactiveFeeEarners: false,
            loginUser: null,
            loading: false,
            teamUsersLoading: false,
            selectedViewType: UserViewType.YearView,
            selectedYearAndMonth: moment(),
            selectedTeamUser: null,
            activityListByDay: null

            // paginatorDef: action.payload.paginatorDef,
            //  columnDef: action.payload.columnDef,

            //  filterRowId: 0,
            //   documentViewOpened: false,
            //  filterExpanded: false,
            // filterViewModel: {
            //     searchText: '',
            //     filterList: [{
            //         filterId: 0,
            //         fieldOperator: '',
            //         fieldHidden: true,
            //         filterType: FilterType.AppType,
            //         operator: Operator.EqualTo,
            //         filterValue: '',
            //         operatorType: action.payload.filterOperate.textOperators
            //     }]
            // },
            //  filterOperateTypes: action.payload.filterOperate


        };
    } else {
        return state;
    }
}

function loadDepartmentList(state: TeamState) {
    return {
        ...state, loading: true,
        teamUsersLoading: true
    };
}

function setUserSearchText(state: TeamState, searchText) {
    return {
        ...state,
        searchUserText: searchText

    };
}

function setChangeDepartment(state: TeamState, payload): Partial<TeamState> {
    return Object.freeze({
        ...state
        , department: payload.departmentData.groupId
        //  , isInactiveFeeEarners: payload.isInactiveFeeEarners
        //  , membereSearchText: payload.membereSearchText
        , previceSelected: null
    });
}

function setChangeViewType(state: TeamState, viewType) {
    return Object.freeze({
        ...state,
        selectedViewType: viewType

    }

    );


}

function loadDepartmentListSuccess(state: TeamState, departmentList: Department[]) {
    return {
        ...state,
        departmentList: departmentList, loading: false,
        // teamUsersLoading: false

    };
}

function setSelectYearAndMonth(state: TeamState, selectdate) {
    return {
        ...state,
        selectedYearAndMonth: selectdate


    };

}

function getUserLastMovement(state: TeamState) {
    return {
        ...state,
        teamUsersLoading: true,
    };
}

function getUserLastMovementSuccess(state: TeamState, lastMovement: MonthActivity[]) {
    return {
        ...state,
        teamUsersLoading: false,
        teamMembers: lastMovement ? state.tempTeamMembers.map(a => {
            const lastmove = lastMovement.find(i => i.userId === a.user);
            return { ...a, lastMovement: lastmove };

        }) : state.tempTeamMembers
    };
}

function getUserLastMovementFail(state: TeamState) {
    return {
        ...state,
        loading: false,
        teamUsersLoading: false
    };
}

function loadDepartmentListFail(state: TeamState) {
    return {
        ...state, loading: false,
        teamUsersLoading: false
    };
}


function changeTeamType(state: TeamState) {

    return {
        ...state,
    };

}

function changeMemberSearchKey(state: TeamState) {

    return {

        ...state,
    };
}

function setMemberData(state: TeamState) {

    return {
        //
        ...state,
        teamUsersLoading: true
    };
}
function setMemberDataFail(state: TeamState) {

    return {

        ...state,
        teamUsersLoading: false
    };
}

function getActivityByDay(state: TeamState) {
    return {
        ...state,
        loading: true,

    };

}
function getActivityByDaySuccess(state: TeamState, activityDayList) {
    return {
        ...state,
        loading: false,
        activityListByDay: activityDayList,

    };

}

function getActivityByDayFail(state: TeamState) {
    return {
        ...state,
        loading: false,

    };
}

function setYearData(state: TeamState) {
    return {
        ...state,
        loading: true,

    };

}
function setYearDataSuccess(state: TeamState, eventYearSummery) {
    return {
        ...state,
        loading: false,
        eventYearSummery: eventYearSummery.eventYearSummery,

    };

}

function setYearDataFail(state: TeamState) {
    return {
        ...state,
        loading: false,

    };
}

function clearDayMovement(state: TeamState) {
    return {
        ...state,
        loading: false,
        activityListByDay: null

    };
}




function getActivityByMonth(state: TeamState) {
    return {
        ...state,
        loading: true,

    };

}
function getActivityByMonthSuccess(state: TeamState, monthActivityList: UserMovementTypesWithDaysResponce) {
    return {
        ...state,
        loading: false,
        monthActivityList: monthActivityList.userMovementTypesWithDays,
        holidays: monthActivityList.holiDays,
    };

}

function getActivityByMonthFail(state: TeamState) {
    return {
        ...state,
        loading: false,

    };
}

function setSelectedTeamUser(state: TeamState, selectedTeamUser) {
    return {
        ...state,
        selectedTeamUser: selectedTeamUser,

    };

}
function setMemberDataSuccess(state: TeamState, TeamMembersData: TeamMemberResponse): Partial<TeamState> {
    return Object.freeze({
        ...state
        , teamUsersLoading: false
        , tempTeamMembers: TeamMembersData.data
        , teamMembers: null
        , selectedTeamUser: setLoginUser(TeamMembersData.data, state.loginUser, state.department)
        , listTotal: TeamMembersData.total
    });
}
function setLoginUser(list: TeamMember[], loginUser: TeamMember, department) {
    if (loginUser && department === -1 && list.find(val => val.user === loginUser.user)) {
        return list.find(val => val.user === loginUser.user);
    } else {
        return list[0];
    }
    return null;
}
function getLogingUser(state: TeamState, TeamMembersData: any): Partial<TeamState> {
    return Object.freeze({
        ...state
        , teamUsersLoading: false
        , tempTeamMembers: TeamMembersData.data
        , selectedTeamUser: TeamMembersData.data[0]
        , listTotal: null
        , loginUser: !state.loginUser ? TeamMembersData.data[0] : state.loginUser
    });
}


export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getLoadingByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loading : null);
export const getParaDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => ({
        departmentId: state.department,
        isInactiveFeeEarners: state.isInactiveFeeEarners,
        membereSearchText: state.searchUserText,
    }));
export const getParaDetailsActivityByToken = (token) => createSelector(getStateByToken(token),
    (state) => ({
        userId: state.selectedTeamUser.user,
        year: state.selectedYearAndMonth.year(),
        month: state.selectedYearAndMonth.month() + 1

        //   month: this.moment.format(state.selectedYearAndMonth, 'M'),
    }));
export const getUsersLoadingByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.teamUsersLoading : null);
export const getUsersListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.teamMembers : []);

export const getDepartmentListByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.departmentList : null);

export const getLogingUserByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loginUser : null);

export const getSelectedViewTypeByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedViewType : null);
export const getSelectedYearAndMonthByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedYearAndMonth : null);
export const getSelectedUserByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedTeamUser : null);
export const getMonthActivityListByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.monthActivityList : null);
export const getActivityListByDayByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.activityListByDay : null);
export const getActivityListByYearByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.eventYearSummery : null);


export const getParaDetailsWithDepartmentByToken = (token) => createSelector(getStateByToken(token),
    (state) => ({
        departmentId: state.department,
        year: state.selectedYearAndMonth.year(),

    }));








