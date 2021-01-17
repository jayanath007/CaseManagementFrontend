
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import {
    CurrentDayUserMovement, NextAvailableMovementType, DayUserMovements
} from '../models/interfaces';
import { TeamMember } from '../../team-core/models/interface';
import { DatePipe } from '@angular/common';
import { ScheduleInformation } from '../../core/lib/microsoft-graph';

export interface State {
    readonly [token: string]: UserMovementState;

}


export interface UserMovementState {
    readonly loading: boolean;
    readonly userList: TeamMember[];
    readonly departmentList: any;
    readonly currentUsersMovementList: any;
    readonly nextAvailableTypes: NextAvailableMovementType;
    readonly selectedUser: string;
    readonly searchText: string;
    readonly department: any;
    readonly isInactiveFeeEarners: boolean;
    readonly addPopupLoading: boolean;
    readonly timeList: string[];
    readonly locationList: any;
    readonly addNewMovementpopupClose: number;
    readonly currentDate: string;
    readonly currentCalanderEventList: ScheduleInformation[];
    readonly location: string;
    readonly isOffToday: boolean;


}
const datePipe = new DatePipe('en-US');

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_USER_MOVEMENT:
            temp[action.token] = setInitialData(state[action.token]);
            return { ...state, ...temp };
        case Actions.REQUEST_CURRENT_DATE_USER_MOVEMENT:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.GET_CURRENT_DATE_USER_MOVEMENT_SUCCESS:
            temp[action.token] = setCurrentMovement(state[action.token], action.payload.data);
            return { ...state, ...temp };
        case Actions.GET_CURRENT_DATE_USER_MOVEMENT_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES:
            temp[action.token] = { ...state[action.token], addPopupLoading: true };
            return { ...state, ...temp };
        case Actions.GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_SUCCESS:
            temp[action.token] = setAvailableMovement(state[action.token], action.payload.nextAvailableTypes);
            return { ...state, ...temp };
        case Actions.GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES_FAIL:
            temp[action.token] = { ...state[action.token], addPopupLoading: false };
            return { ...state, ...temp };
        case Actions.ADD_MOVEMENT_DATA:
            temp[action.token] = addMovementData(state[action.token]);
            return { ...state, ...temp };
        case Actions.ADD_MOVEMENT_DATA_SUCCESS:
            temp[action.token] = addMovementDataSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.ADD_MOVEMENT_DATA_FAIL:
            temp[action.token] = addMovementDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.SELECT_USER_IN_MOVEMENT:
            temp[action.token] = selectUser(state[action.token], action.user);
            return { ...state, ...temp };
        case Actions.CHANGE_USER_SEARCH_TEXT:
            temp[action.token] = setUserSearchText(state[action.token], action.searchText);
            return { ...state, ...temp };
        case Actions.CHANGE_USER_DEPARTMENT:
            temp[action.token] = setChangeDepartment(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.LOAD_TEAM_FOR_MOVEMENT:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.LOAD_TEAM_FOR_MOVEMENT_SUCCESS:
            temp[action.token] = setUseDataSuccess(state[action.token], action.payload.teamMemberList);
            return { ...state, ...temp };
        case Actions.LOAD_TEAM_FOR_MOVEMENT_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.TEAM_MOVEMENT_DEPARTMENT_LIST:
            temp[action.token] = {
                ...state[action.token],
                loading: true
            };
            return { ...state, ...temp };
        case Actions.TEAM_MOVEMENT_DEPARTMENT_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                departmentList: action.payload.departmetList
            };
            return { ...state, ...temp };
        case Actions.TEAM_MOVEMENT_DEPARTMENT_LIST_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return { ...state, ...temp };
        case Actions.REFRESH_USER_MOVEMENT_LIST:
            temp[action.token] = {
                ...state[action.token],
                // loading: true
            };
            return { ...state, ...temp };
        case Actions.GET_MOVEMENT_LOCATION:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.GET_MOVEMENT_LOCATION_SUCCESS:
            temp[action.token] = setMovementLocation(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.GET_MOVEMENT_LOCATION_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };

        case Actions.GET_USER_EVENT_LIST:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.GET_USER_EVENT_LIST_SUCCESS:
            temp[action.token] = setCalanderEvent(state[action.token], action.payload.data, action.payload.timeOffset);
            return { ...state, ...temp };
        case Actions.GET_USER_EVENT_LIST_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.CHANGE_LOCATION:
            temp[action.token] = setChangeLocation(state[action.token], action.location);
            return { ...state, ...temp };
        case Actions.CHANGE_IS_ALLDAY_EVENT:
            temp[action.token] = setChangeAlldayevent(state[action.token], action.isAllday);
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}
function setInitialData(state: UserMovementState) {
    if (!state) {
        return {
            ...state,
            userList: [],
            departmentList: [],
            selectedUser: null,
            addNewMovementpopupClose: 0,
            loading: true,
            addPopupLoading: false,
            isInactiveFeeEarners: false,
            searchText: null,
            department: -1,
            isAllday: false,
            timeList: [
                '12:00', '12:15', '12:30', '12:45',
                '1:00', '1:15', '1:30', '1:45',
                '2:00', '2:15', '2:30', '2:45',
                '3:00', '3:15', '3:30', '3:45',
                '4:00', '4:15', '4:30', '4:45',
                '5:00', '5:15', '5:30', '5:45',
                '6:00', '6:15', '6:30', '6:45',
                '7:00', '7:15', '7:30', '7:45',
                '8:00', '8:15', '8:30', '8:45',
                '9:00', '9:15', '9:30', '9:45',
                '10:00', '10:15', '10:30', '10:45',
                '11:00', '11:15', '11:30', '11:45'
            ],

            currentDate: datePipe.transform(new Date().toUTCString(), 'yyyy-MM-ddT00:00:00')
        };
    } else {
        return state;
    }
}


function requestCurrentMovement(state: UserMovementState) {
    return {
        ...state,
        loading: true,
        userList: {
            ...state.userList,
            movement: null
        },

    };
}

function setCurrentMovement(state: UserMovementState, data: CurrentDayUserMovement[]) {

    // const filteredUsers = state.userList.filter(function (array_el) {
    //     return data.filter(function (anotherOne_el) {
    //         return anotherOne_el.userId === array_el.user;
    //     }).length = 0;
    // });
    let filteredUser;
    if (data && data.length > 0) {
        filteredUser = state.userList.filter(function (o) {
            return data.some(function (i) {
                /*
                    Some will return true if any of the elements return true
                */
                return i.userId === o.user;
            });
        });


    } else {
        filteredUser = [];

    }




    // const result = state.userList.filter(item => data.includes(item.user));


    const userListUpdatedaymovement = filteredUser.map(a => {
        //  let events: DayUserMovements[];
        const daymovement = data ? data.find(i => i.userId === a.user) : null;
        const currentDate = new Date(state.currentDate);
        const start = new Date(datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));
        currentDate.setDate(currentDate.getDate() + 1);
        const end = new Date(datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));
        if (!(daymovement && daymovement.userMovements)) {
            return a;
        }
        // const events = daymovement.userMovements;
        // if (daymovement.userMovements && daymovement.userMovements.length > 0) {
        const events = daymovement.userMovements.map((r, i) => {

            // let barwidth: string;
            // if (r.isAllDayMovementType) {
            // barwidth = getEventWidth(start, end);
            //  } else {
            const nextItem = daymovement.userMovements[i + 1];
            const time = nextItem ? new Date(nextItem.dateTime) : end;

            // }
            return { ...r, endTime: new Date(time).toDpsString() };


        });
        // } else {
        //     return daymovement;
        // }


        return { ...a, dayMovements: events };


    });



    const userList = state.userList ? userListUpdatedaymovement : state.userList;

    return {
        ...state,
        loading: false,
        currentUsersMovementList: data,
        userList: userList,
        selectedUser: userList.find(val => val.user === state.selectedUser) ?
            state.selectedUser : (userList.length > 0 ? userList[0].user : null)
    };
}










function setAvailableMovement(state: UserMovementState, nextAvailableTypes) {
    return {
        ...state,
        addPopupLoading: false,
        nextAvailableTypes: nextAvailableTypes,


    };
}



function selectUser(state: UserMovementState, user: TeamMember) {
    return {
        ...state,
        selectedUser: user.user,
        loading: false,

    };
}

function addMovementData(state: UserMovementState) {

    return {
        ...state,
        addPopupLoading: true,
    };
}

function addMovementDataSuccess(state: UserMovementState) {

    return {
        ...state,
        addNewMovementpopupClose: state.addNewMovementpopupClose + 1,
        addPopupLoading: false,
    };

}

function addMovementDataFail(state: UserMovementState) {

    return {
        ...state,
        addPopupLoading: false
    };

}

function setUserSearchText(state: UserMovementState, searchText) {
    return {
        ...state,
        searchText: searchText

    };
}

function setChangeDepartment(state: UserMovementState, payload): Partial<UserMovementState> {
    return Object.freeze({
        ...state
        , department: payload.departmentData.groupId
        , previceSelected: null
    });
}


function setUseDataSuccess(state: UserMovementState, userData: { data: TeamMember[], total: number }): Partial<UserMovementState> {




    return Object.freeze({
        ...state,
        teamUsersLoading: false,
        loading: false,
        selectedUser: userData.data.length > 0 ? userData.data[0].user : null,
        userList: userData.data,
        listTotal: userData.total
    });
}

function setMovementLocation(state: UserMovementState, location) {
    return Object.freeze({
        ...state
        , locationList: location
        , loading: true
    });
}

function setCalanderEvent(state: UserMovementState, calendarEvents: ScheduleInformation[], timeOffset: number) {


    const userListUpdateCalanderEvent = state.userList.map(user => {
        const currentDate = new Date(state.currentDate);
        currentDate.setMinutes(currentDate.getMinutes() + timeOffset);
        const start = new Date(datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));
        currentDate.setDate(currentDate.getDate() + 1);
        const end = new Date(datePipe.transform(currentDate, 'yyyy-MM-ddT00:00:00'));
        const infor = calendarEvents ? calendarEvents.find(i => i.scheduleId === user.userEmail) : null;
        if (!(infor && infor.scheduleItems)) {
            return user;
        }
        const events = infor.scheduleItems
            .map(val => {
                const endDateTime = new Date(val.start.dateTime);
                endDateTime.setMinutes(endDateTime.getMinutes() + timeOffset);
                const startDateTime = new Date(val.end.dateTime);
                startDateTime.setMinutes(startDateTime.getMinutes() + timeOffset);
                return {
                    ...val, start: {
                        ...val.start,
                        dateTime: endDateTime.toDpsString()
                    }, end: {
                        ...val.end,
                        dateTime: startDateTime.toDpsString()
                    },
                    //   overlapEvents: [{ ...val, subject: val.subject || 'No title to preview' }],
                    subject: val.subject || 'No title to preview'
                };
            })
            .filter(val => new Date(val.end.dateTime) > start && new Date(val.start.dateTime) < end);
        //     .forEach(val => {
        //         if (events.length > 0 && new Date(events[events.length - 1].start.dateTime) <= new Date(val.start.dateTime) &&
        //             new Date(events[events.length - 1].end.dateTime) > new Date(val.start.dateTime)) {
        //             const eve = events.pop();
        //             const endDateTime = new Date(eve.end.dateTime) < new Date(val.end.dateTime) ?
        //                 val.end.dateTime : eve.end.dateTime;
        //             events.push({
        //                 ...eve, isOverlap: true,
        //                 status: <any>'overlap',
        //                 subject: 'Busy with ' + (eve.overlapEvents.length + 1) + ' events',
        //                 overlapEvents: eve.overlapEvents.concat([val]),
        //                 end: { ...eve.end, dateTime: endDateTime },
        //                 postExisiting: new Date(endDateTime) > end,
        //                 preExisiting: new Date(eve.start.dateTime) < start,
        //                 width: getEventWidth(new Date(eve.start.dateTime) < start ? start : new Date(eve.start.dateTime),
        //                     new Date(endDateTime) > end ? end : new Date(endDateTime))
        //             });
        //         } else {
        //             if (events.length > 0 && new Date(events[events.length - 1].end.dateTime) < new Date(val.start.dateTime)) {
        //                 events.push({
        //                     end: events[events.length - 1].end,
        //                     start: val.start,
        //                     postExisiting: false,
        //                     preExisiting: false,
        //                     width: getEventWidth(new Date(val.start.dateTime), new Date(events[events.length - 1].end.dateTime))
        //                 });
        //             } else if (events.length < 1 && start < new Date(val.start.dateTime)) {
        //                 events.push({
        //                     end: val.start,
        //                     start: { ...val.start, dateTime: datePipe.transform(start, 'yyyy-MM-ddT00:00:00') },
        //                     postExisiting: false,
        //                     preExisiting: false,
        //                     width: getEventWidth(start, new Date(val.start.dateTime))
        //                 });
        //             }

        //             events.push({
        //                 ...val,
        //                 postExisiting: new Date(val.end.dateTime) > end,
        //                 preExisiting: new Date(val.start.dateTime) < start,
        //                 width: getEventWidth(new Date(val.start.dateTime) < start ? start : new Date(val.start.dateTime),
        //                     new Date(val.end.dateTime) > end ? end : new Date(val.end.dateTime))
        //             });
        //         }
        //     });

        // if (events.length > 0 && new Date(events[events.length - 1].end.dateTime) < end) {
        //     events.push({
        //         end: { ...events[events.length - 1].end, dateTime: datePipe.transform(end, 'yyyy-MM-ddT00:00:00') },
        //         start: events[events.length - 1].end,
        //         postExisiting: false,
        //         preExisiting: false,
        //         width: getEventWidth(new Date(events[events.length - 1].end.dateTime), end)
        //     });
        // } else if (events.length < 1) {
        //     events.push({
        //         end: { dateTime: datePipe.transform(end, 'yyyy-MM-ddT00:00:00') },
        //         start: { dateTime: datePipe.transform(start, 'yyyy-MM-ddT00:00:00') },
        //         postExisiting: false,
        //         preExisiting: false,
        //         width: getEventWidth(start, end)
        //     });
        // }


        return { ...user, calanderEvents: { ...infor, scheduleItems: events } };

    });

    const userList = state.userList ? userListUpdateCalanderEvent : state.userList;

    return {
        ...state,
        loading: false,
        currentCalanderEventList: calendarEvents,
        userList: userList,
        selectedUser: userList.find(val => val.user === state.selectedUser) ?
            state.selectedUser : (userList.length > 0 ? userList[0].user : null)
    };

    // return Object.freeze({
    //     ...state
    //     , calendarEvents: calendarEvents
    //     , loading: false
    // });


}

function getEventWidth(start: Date, end: Date) {
    return ((end.getTime() - start.getTime()) / 12000) + 'px';
}

function setChangeLocation(state: UserMovementState, location) {
    return {
        ...state,
        location
    };
}

function setChangeAlldayevent(state: UserMovementState, value) {
    return {
        ...state,
        isOffToday: value
    };
}









export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (views) => views[token]);
export const getDepartmentListByToken = (token) => createSelector(getViewByToken(token), (userMovementState) =>
    userMovementState ? userMovementState.departmentList : null);
export const getUserListByToken = (token) => createSelector(getViewByToken(token), (userMovementState) =>
    userMovementState ? userMovementState.userList : null);
export const getCurrentUserMovementsByToken = (token) => createSelector(getViewByToken(token), (userMovementState) =>
    userMovementState ? userMovementState.currentUsersMovementList : null);
export const getNextAvailableTypesByToken = (token) => createSelector(getViewByToken(token), (userMovementState) =>
    userMovementState ? userMovementState.nextAvailableTypes : null);
export const getSelectedUserByToken = (token) => createSelector(getViewByToken(token), (userMovementState) =>
    userMovementState && userMovementState.userList ?
        userMovementState.userList.find(val => val.user === userMovementState.selectedUser) : null);
export const getAddNewMovementpopupCloseToken = (token) => createSelector(getViewByToken(token), (userMovementState) =>
    userMovementState ? userMovementState.addNewMovementpopupClose : 0);
export const getLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.loading : false);
export const getAddPopupLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.addPopupLoading : false);
export const getTimeListByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.timeList : null);
export const getMovementLocationistByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.locationList : null);
export const getParaDataUserByToken = (token) => createSelector(getViewByToken(token),
    (state) => ({
        departmentId: state.department,
        isInactiveFeeEarners: state.isInactiveFeeEarners,
        membereSearchText: state.searchText,
    }));
export const getCurrentDateRangeByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.currentDate : null);

export const getChangeLocationByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.location : null);
export const getChangeIsOffTodayByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.isOffToday : false);

