import { createSelector } from '@ngrx/store';
import { TeamMember, TeamMemberRequest, TeamMemberResponse } from '../../core/lib/team-members';
import * as TeamMemberAction from '../actions/team-member';
import { ParaType, TeamMemberOpenFrom } from '../models/enums';

export interface State {
    readonly [token: string]: TeamMemberState;
}

export interface TeamMemberState {
    readonly init: boolean;
    readonly loading: boolean;
    readonly teamMembersLoading: boolean;
    readonly selected: TeamMember;
    readonly previceSelected: TeamMember;
    readonly teamMembers: TeamMember[];
    readonly loginUser: TeamMember;
    readonly department: number;
    readonly membereSearchText: string;
    readonly isInactiveFeeEarners: boolean;
    readonly listTotal: number;
    // readonly allMemeberData: AllMembers[];
    readonly openFrom: TeamMemberOpenFrom;
    readonly mode: string;
}


export const intialState: State = {};

export function reducer(state: State = intialState, action: TeamMemberAction.Any): State {
    const temp = {};
    switch (action.type) {
        case (TeamMemberAction.INIT_TEAM_MEMBER):
            temp[action.token] = getInitData(state[action.token], action.openFrom);
            return { ...state, ...temp };
        case (TeamMemberAction.GET_LOGING_USER):
            temp[action.token] = getLogingUser(state[action.token], action.payload.TeamMembersData);
            return { ...state, ...temp };
        case (TeamMemberAction.LOAD_TEAM_MEMBER):
            temp[action.token] = getTeamMembers(state[action.token]);
            return { ...state, ...temp };
        case (TeamMemberAction.LOAD_TEAM_MEMBER_SUCCESS):
            temp[action.token] = getTeamMembersSuccess(state[action.token], action.payload.TeamMembersData);
            return { ...state, ...temp };
        case (TeamMemberAction.LOAD_TEAM_MEMBER_FAIL):
            temp[action.token] = getTeamMembersFail(state[action.token]);
            return { ...state, ...temp };
        case (TeamMemberAction.UPDATE_DEPARTMENT):
            temp[action.token] = setDepartmentAndFeeErnerState(state[action.token], action.payload.inPutData);
            return { ...state, ...temp };
        case (TeamMemberAction.UPDATE_SEARCH_KEY):
            temp[action.token] = setSearchKey(state[action.token], action.payload);
            return { ...state, ...temp };
        case (TeamMemberAction.CHANGE_SELECTED_TEAM_MEMBER):
            temp[action.token] = setSelectedTeamMember(state[action.token], action.payload);
            return { ...state, ...temp };
        // case (TeamMemberAction.LOAD_ALL_MEMBER_DATA):
        //     temp[action.token] = setAllMemberData(state[action.token], action.payload);
        //     return { ...state, ...temp };
        case (TeamMemberAction.CHANGE_PANEL_MODE):
            temp[action.token] = { ...state[action.token], mode: action.payload.mode };
            return { ...state, ...temp };
        default:
            return state;
    }
}

function getInitData(state: TeamMemberState, teamMemOpenFrom: TeamMemberOpenFrom): Partial<TeamMemberState> {
    if (!state) {
        return Object.freeze({
            ...state
            , loading: true
            , init: true
            , department: null
            , membereSearchText: null
            , isInactiveFeeEarners: null
            , teamMembers: null
            , previceSelected: null
            , listTotal: 0
            , loginUser: null
            , openFrom: teamMemOpenFrom
            , mode: 'side'

        });
    } else {
        return state;
    }
}

function setDepartmentAndFeeErnerState(state: TeamMemberState, payload): Partial<TeamMemberState> {
    return Object.freeze({
        ...state
        , department: payload.departmentId
        , isInactiveFeeEarners: payload.isInactiveFeeEarners
        , membereSearchText: payload.membereSearchText
        , previceSelected: null
    });
}

function setSearchKey(state: TeamMemberState, payload): Partial<TeamMemberState> {
    return Object.freeze({
        ...state
        , membereSearchText: payload
    });
}
function setSelectedTeamMember(state: TeamMemberState, payload): Partial<TeamMemberState> {
    return Object.freeze({
        ...state
        , selected: payload
        , previceSelected: payload
    });
}
function setAllMemberData(state: TeamMemberState, payload): Partial<TeamMemberState> {
    return Object.freeze({
        ...state, allMemeberData: payload.allMembers
    });
}

const getTeamMembers = (state: TeamMemberState): Partial<TeamMemberState> => {
    return Object.freeze({ ...state, teamMembersLoading: true });
};
function getTeamMembersSuccess(state: TeamMemberState, TeamMembersData: TeamMemberResponse): Partial<TeamMemberState> {
    return Object.freeze({
        ...state
        , teamMembersLoading: false
        , teamMembers: TeamMembersData.data
        // , teamMembers: setUpnForUser(TeamMembersData.data, state.allMemeberData)
        , selected: setLoginUser(TeamMembersData.data, state.loginUser, state.department, state.openFrom)
        , listTotal: TeamMembersData.total
    });
}
function setLoginUser(list: TeamMember[], loginUser: TeamMember, department, openfrom: TeamMemberOpenFrom) {
    if (loginUser && department === -1 && list.find(val => val.user === loginUser.user && openfrom === TeamMemberOpenFrom.MatterSearch)) {
        return list.find(val => val.user === loginUser.user);
    }
    return null;
}

// function setUPN(allData: AllMembers[], val: TeamMember) {
//     if (allData && val) {
//         const fullData = allData ? allData.find((info) => info.user === val.user) : null;
//         if (fullData) {
//             val.upn = fullData.email;
//         }
//     }
//     return val;
// }
function getLogingUser(state: TeamMemberState, TeamMembersData: TeamMemberResponse): Partial<TeamMemberState> {
    return Object.freeze({
        ...state
        , teamMembersLoading: false
        , teamMembers: TeamMembersData.data
        // , teamMembers: setUpnForUser(TeamMembersData.data, state.allMemeberData)
        , selected: TeamMembersData.data[0]
        , listTotal: null
        // , loginUser: TeamMembersData.data[0]
        // , loginUser: !state.loginUser ? setUPN(state.allMemeberData, TeamMembersData.data[0]) : state.loginUser
        , loginUser: !state.loginUser ?  TeamMembersData.data[0] : state.loginUser
    });
}
// function setUpnForUser(TeamMembersList: TeamMember[], allData: AllMembers[]) {
//     return TeamMembersList = TeamMembersList.map(val => {
//         return setUPN(allData, val);
//     });
// }

const getTeamMembersFail = (state: TeamMemberState): Partial<TeamMemberState> => {
    return Object.freeze({ ...state, teamMembersLoading: false });
};


const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getTeamMemberByToken = (token) => createSelector(getViewByToken(token),
    (teamMemberState) => teamMemberState ? teamMemberState.teamMembers : null);
export const getParaDataByToken = (token) => createSelector(getViewByToken(token),
    (teamMemberState) => ({
        departmentId: teamMemberState.department,
        isInactiveFeeEarners: teamMemberState.isInactiveFeeEarners,
        membereSearchText: teamMemberState.membereSearchText,
        openFrom : teamMemberState.openFrom,
        // selectedUser: teamMemberState.selectedUser
    }));
export const getSelectedTeamMemberByToken = (token) => createSelector(getViewByToken(token),
    (teamMemberState) => teamMemberState ?
        teamMemberState.teamMembers && teamMemberState.teamMembers.length > 0 ?
            teamMemberState.selected ?
                teamMemberState.selected :
                teamMemberState.previceSelected :
            null :
        null);
export const getisTeamMemberLoadingByToken = (token) => createSelector(getViewByToken(token), (teamMemberState) =>
    teamMemberState ? (teamMemberState.teamMembersLoading && teamMemberState.teamMembersLoading === true) : null);
export const getSearchKeyByToken = (token) => createSelector(getViewByToken(token), (teamMemberState) =>
    teamMemberState ? teamMemberState.membereSearchText : null);
export const getTeamMemberCountByToken = (token) => createSelector(getViewByToken(token), (teamMemberState) =>
    teamMemberState ? teamMemberState.listTotal : null);
// export const getAllMemberByToken = (token) => createSelector(getViewByToken(token), (teamMemberState) =>
//     teamMemberState ? teamMemberState.allMemeberData : null);
export const getMemListPanelModeByToken = (token) => createSelector(getViewByToken(token), (teamMemberState) =>
    teamMemberState ? teamMemberState.mode : null);


