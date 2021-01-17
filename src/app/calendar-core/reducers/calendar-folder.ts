import { CREATE_NEW_CALENDAR_GROUP, CHANGE_COLOR_CALENDAR_ITEM } from '../actions/calendar-folder';

import { CalendarGroupItemWrapper, CalendarItem, CalendarItemWrapper, ImmutableCalendarMap, CalendarMap } from '../models/interfaces';
import * as Actions from '../actions/calendar-folder';
import { MgGraphBatchResponseItem } from '../../mail-item-core/models/interface';
import { Calendar, CalendarGroup, CalendarColor } from '../../core/lib/microsoft-graph';
import { CalendarGroupEditMode, CalendarEditMode } from '../../core/organizer/enums';
import { createSelector } from '@ngrx/store';

export interface CalendarGroupMap { [id: string]: Readonly<CalendarGroupItemWrapper>; }
export type ImmutableCalendarGroupMap = Readonly<CalendarGroupMap>;

export interface State {
    readonly calendarGroups: ImmutableCalendarGroupMap;
    readonly loading: boolean;
    readonly init: boolean;
    readonly selectedCalendarIds: string[];
    readonly calendarLoaded: boolean;
    readonly availableColors: { id: string, name: string, usedCount: number }[];
}

const initialState: State = Object.freeze({
    calendarGroups: Object.freeze({}),
    loading: true,
    init: false,
    selectedCalendarIds: [],
    calendarLoaded: false,
    availableColors: [
        { id: '#a6d1f5', name: 'lightBlue', usedCount: 0 },
        { id: '#4adacc', name: 'lightTeal', usedCount: 0 },
        { id: '#87d28e', name: 'lightGreen', usedCount: 0 },
        { id: '#c0c0c0', name: 'lightGray', usedCount: 0 },
        { id: '#f88c9b', name: 'lightRed', usedCount: 0 },
        { id: '#f08cc0', name: 'lightPink', usedCount: 0 },
        { id: '#cba287', name: 'lightBrown', usedCount: 0 },
        { id: '#fcab73', name: 'lightOrange', usedCount: 0 },
        { id: '#f4d07a', name: 'lightYellow', usedCount: 0 },
    ]
});

export function reducer(state = initialState, action: Actions.Any): State {
    const temp = {};
    switch (action.type) {
        case Actions.CALENDAR_LIST_LOAD:
            return { ...state, loading: state.calendarLoaded ? false : true, init: true };
        case Actions.CALANDAR_LIST_LOAD_SUCESS:
            return {
                ...state,
                calendarGroups: assigncalendarGroups(state, state.calendarGroups, action.payload.groupList,
                    action.payload.clearCurrent, action.payload.calendarList),
                loading: false,
                calendarLoaded: true
            };
        case Actions.CALANDAR_LIST_LOAD_FAIL:
            return { ...state, loading: false };
        case Actions.TOGGLE_CALANDAR_GROUP_EXPAND:
            temp[action.payload.groupId] = changeCalendarExpan(state.calendarGroups[action.payload.groupId]);
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };
        case Actions.TOGGLE_CALENDAR_SELECT:
            return state; // toggleCalendarSelect(state, action.payload);
        case Actions.UNSELECT_CALENDAR:
            return unselectCalendar(state, action.payload);
        case Actions.SELECT_CALENDAR:
            return selectCalendar(state, { groupId: action.payload.groupId, calendarId: action.payload.calendarId });
        case Actions.INIT_SELECT_CALENDAR:
            return selectCalendar(state, { groupId: action.payload.groupId, calendarId: action.payload.calendarId });

        case Actions.ACTIVATE_CALENDAR_GROUP_EDIT_MODE:
            return { ...state, calendarGroups: setGroupEditMode(state.calendarGroups, action.payload.item, action.payload.editMode) };
        case Actions.FINALIZE_CALENDAR_GROUP_EDIT_MODE:
            return { ...state, calendarGroups: setGroupEditMode(state.calendarGroups, action.payload.item, null) };

        case Actions.CREATE_NEW_CALENDAR_GROUP:
            return state; // TODO LK
        case Actions.CREATE_CALENDAR_GROUP_SUCCESS:
            return { ...state, calendarGroups: groupCreateSuccess(state, state.calendarGroups, action.payload.item) };
        case Actions.CREATE_CALENDAR_GROUP_FAIL:
            return state;

        case Actions.RENAME_CALENDAR_GROUP:
            return { ...state, calendarGroups: preRenameGroup(state.calendarGroups, action.payload.group, action.payload.value) };
        case Actions.RENAME_CALENDAR_GROUP_SUCCESS:
            return { ...state, calendarGroups: groupRenameSuccess(state.calendarGroups, action.payload.item) };
        case Actions.RENAME_CALENDAR_GROUP_FAIL:
            return { ...state, calendarGroups: groupRenameFail(state.calendarGroups, action.payload.group) };

        case Actions.DELETE_CALENDAR_GROUP:
            return { ...state, calendarGroups: prergroupDelete(state.calendarGroups, action.payload.item) };
        case Actions.DELETE_CALENDAR_GROUP_SUCCESS:
            return { ...state, ...groupDeleteSuccess(state, action.payload.item) };
        case Actions.DELETE_CALENDAR_GROUP_FAIL:
            return { ...state, ...groupDeleteFail(state.calendarGroups, action.payload.item) };

        case Actions.ACTIVATE_CALENDAR_ITEM_EDIT_MODE:
            temp[action.payload.calendar.calendarGroupId] = {
                ...state.calendarGroups[action.payload.calendar.calendarGroupId], calendars:
                    setCalendarEditMode(state.calendarGroups[action.payload.calendar.calendarGroupId].calendars,
                        action.payload.calendar, action.payload.editMode)
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };
        case Actions.FINALIZE_CALENDAR_ITEM_EDIT_MODE:
            temp[action.payload.calendar.calendarGroupId] = {
                ...state.calendarGroups[action.payload.calendar.calendarGroupId], calendars:
                    setCalendarEditMode(state.calendarGroups[action.payload.calendar.calendarGroupId].calendars,
                        action.payload.calendar, null)
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };

        case Actions.CREATE_NEW_CALENDAR:
            return state; // TODO LK
        case Actions.CREATE_CALENDAR_SUCCESS:
            temp[action.payload.groupId] = {
                ...state.calendarGroups[action.payload.groupId], calendars:
                    calendarCreateSuccess(state, state.calendarGroups[action.payload.groupId].calendars,
                        action.payload.item, action.payload.groupId),
                hasChild: true
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };
        case Actions.CREATE_CALENDAR_FAIL:
            return state;

        case Actions.RENAME_CALENDAR_ITEM:
            temp[action.payload.calendar.calendarGroupId] = {
                ...state.calendarGroups[action.payload.calendar.calendarGroupId], calendars:
                    // { ...state.calendarGroups[action.payload.calendar.calendarGroupId].calendars,
                    preRenameCalendar(state.calendarGroups[action.payload.calendar.calendarGroupId].calendars,
                        action.payload.calendar, action.payload.value) // }
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };
        case Actions.RENAME_CALENDAR_ITEM_SUCCESS:
            return calendarRenameSuccess(state, action.payload.oldCalendar.calendarGroupId, action.payload.item);
        case Actions.RENAME_CALENDAR_ITEM_FAIL:
            temp[action.payload.calendar.calendarGroupId] = {
                ...state.calendarGroups[action.payload.calendar.calendarGroupId], calendars:
                    calendarEditFail(state.calendarGroups[action.payload.calendar.calendarGroupId].calendars, action.payload.calendar)
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };

        case Actions.CHANGE_COLOR_CALENDAR_ITEM:
            // TODO LK
            return state;
        case Actions.CHANGE_COLOR_CALENDAR_ITEM_SUCCESS:
            return calendarChangeColorSuccess(state, action.payload.oldCalendar.calendarGroupId, action.payload.item);
        case Actions.CHANGE_COLOR_CALENDAR_ITEM_FAIL:
            temp[action.payload.calendar.calendarGroupId] = {
                ...state.calendarGroups[action.payload.calendar.calendarGroupId], calendars:
                    calendarEditFail(state.calendarGroups[action.payload.calendar.calendarGroupId].calendars, action.payload.calendar)
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };

        case Actions.DELETE_CALENDAR_ITEM:
            temp[action.payload.item.calendarGroupId] = {
                ...state.calendarGroups[action.payload.item.calendarGroupId], calendars:
                    prerCalendarDelete(state.calendarGroups[action.payload.item.calendarGroupId].calendars, action.payload.item)
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };
        case Actions.DELETE_CALENDAR_ITEM_SUCCESS:
            return { ...state, ...calendarDeleteSuccess(state, action.payload.item) };
        case Actions.DELETE_CALENDAR_ITEM_FAIL:
            temp[action.payload.item.calendarGroupId] = {
                ...state.calendarGroups[action.payload.item.calendarGroupId], calendars:
                    calendarDeleteFail(state.calendarGroups[action.payload.item.calendarGroupId].calendars, action.payload.item)
            };
            return { ...state, calendarGroups: { ...state.calendarGroups, ...temp } };

        default:
            return state;
    }
}

function assigncalendarGroups(
    state: State,
    currentState: ImmutableCalendarGroupMap, groupList: CalendarGroup[], clearCurrent: boolean,
    calendarList: MgGraphBatchResponseItem<{ value: Calendar[] }>[] = null): ImmutableCalendarGroupMap {
    const temp = groupList.reduce((accu: { [id: string]: Readonly<CalendarGroupItemWrapper>; }, current: CalendarGroup) => {
        const calendars = calendarList ? calendarList.find(val => val.id === current.id).body.value : [];
        accu[current.id] = {
            data: current,
            expanded: current[current.id] ? current[current.id].expanded : true,
            calendars: calendarList ? assigncalendars(state, current[current.id],
                calendars || [],
                current.id) : {},
            isDefalut: current.name === 'My Calendars' || current.name === 'Other Calendars' || current.name === 'People\'s Calendars',
            hasChild: calendarList ? (calendars ?
                calendars.length > 0 : false) : false
        };
        return accu;
    }, {});
    return { ...currentState, ...temp };
}

function assigncalendars(
    state: State,
    calendareGroup: Readonly<CalendarGroupItemWrapper>,
    calendarList: Calendar[],
    groupId: string): { [id: string]: Readonly<CalendarItem<Calendar>>; } {
    const temp = calendarList.reduce((accu: { [id: string]: Readonly<CalendarItem<Calendar>>; }, current: Calendar) => {
        const wrapper = calendareGroup && calendareGroup.calendars[current.id] ? calendareGroup.calendars[current.id] :
            {
                data: {},
                calendarGroupId: groupId,
                selected: false,
                color: findHexColor(state, current.color),
                isBirthdaysCalendar: current.name.includes('Birthdays'),
                isEditable: current.canEdit,
                isSecondary: !((current.isDefaultCalendar || (
                    current.name === 'Calendar' &&
                    current.canEdit === true &&
                    current.canShare === true &&
                    current.canViewPrivateItems === true)) || current.isSharedWithMe)
            };
        accu[current.id] = { ...wrapper, data: current };
        return accu;
    }, {});
    return calendareGroup ? { ...calendareGroup.calendars, ...temp } : temp;
}

function changeCalendarExpan(calendareGroup: CalendarGroupItemWrapper): CalendarGroupItemWrapper {
    return { ...calendareGroup, expanded: calendareGroup.expanded ? false : true };
}

function toggleCalendarSelect(state: State, payload: { calendar: CalendarItem<Calendar> }): State {
    const calendarGroups = state.calendarGroups[payload.calendar.calendarGroupId];
    const calendar = payload.calendar;

    if ((!calendar.selected && state.selectedCalendarIds.length > 8) || (calendar.selected && state.selectedCalendarIds.length === 1)) {
        return state;
    }

    const _calendarGroups = {};
    const _calendar = {};
    const _selectedCalendarIds = calendar.selected ?
        state.selectedCalendarIds.filter(val => val !== payload.calendar.data.id)
        : state.selectedCalendarIds.concat(payload.calendar.data.id);

    const color = calendar.selected ? calendar.data.color :
        (calendar.data.color ? findHexColor(state, calendar.data.color) : state.availableColors.find(val => (val.usedCount < 1)).id);
    const _availableColors = state.availableColors.map(val => {
        if (val.id === color) {
            return { ...val, usedCount: calendar.selected ? (val.usedCount - 1) : (val.usedCount + 1) };
        }
        return val;
    });
    _calendar[payload.calendar.data.id] = {
        ...calendar,
        selected: !calendar.selected,
        color: calendar.selected ? '' : color
    };
    _calendarGroups[payload.calendar.calendarGroupId] = {
        ...calendarGroups,
        calendars: { ...calendarGroups.calendars, ..._calendar }
    };
    return {
        ...state, calendarGroups: { ...state.calendarGroups, ..._calendarGroups },
        availableColors: _availableColors, selectedCalendarIds: _selectedCalendarIds
    };
}

function unselectCalendar(state: State, payload: { groupId: string, calendarId: string }): State {

    const calendarGroups = state.calendarGroups[payload.groupId];
    const calendar = calendarGroups.calendars[payload.calendarId];

    // if (calendar.selected && state.selectedCalendarIds.length === 1) {
    //     return state;
    // }

    const _calendarGroups = {};
    const _calendar = {};
    const _selectedCalendarIds = state.selectedCalendarIds.filter(val => val !== payload.calendarId);

    const color = calendar.color;
    const _availableColors = state.availableColors.map(val => {
        if (val.id === color) {
            return { ...val, usedCount: (val.usedCount - 1) };
        }
        return val;
    });
    _calendar[payload.calendarId] = {
        ...calendar,
        selected: false,
    };
    _calendarGroups[payload.groupId] = {
        ...calendarGroups,
        calendars: { ...calendarGroups.calendars, ..._calendar }
    };
    return {
        ...state, calendarGroups: { ...state.calendarGroups, ..._calendarGroups },
        availableColors: _availableColors, selectedCalendarIds: _selectedCalendarIds
    };
}

function selectCalendar(state: State, payload: { groupId: string, calendarId: string }): State {
    const calendarGroups = state.calendarGroups[payload.groupId];
    const calendar = calendarGroups.calendars[payload.calendarId];

    const _calendarGroups = {};
    const _calendar = {};
    const _selectedCalendarIds = state.selectedCalendarIds.concat(payload.calendarId);

    if (state.selectedCalendarIds.length > 8 || calendar.selected) {
        return state;
    }

    const color = findHexColor(state, calendar.data.color) || state.availableColors.find(val => (val.usedCount < 1)).id;
    const _availableColors = state.availableColors.map(val => {
        if (val.id === color) {
            return { ...val, usedCount: (val.usedCount + 1) };
        }
        return val;
    });
    _calendar[payload.calendarId] = {
        ...calendar,
        selected: true,
        color: color
    };
    _calendarGroups[payload.groupId] = {
        ...calendarGroups,
        calendars: { ...calendarGroups.calendars, ..._calendar }
    };
    return {
        ...state, calendarGroups: { ...state.calendarGroups, ..._calendarGroups },
        availableColors: _availableColors, selectedCalendarIds: _selectedCalendarIds
    };
}

function findHexColor(state: State, color: CalendarColor) {
    const calendarColor = state.availableColors.find(val => val.name === color);
    return calendarColor ? calendarColor.id : null;
}

//#region group edite
function setGroupEditMode(current: ImmutableCalendarGroupMap, changed: CalendarGroupItemWrapper, editMode: CalendarGroupEditMode) {
    return <CalendarGroupMap>(Object.values(current).reduce((map, item) => {
        if (item.data.id === changed.data.id) {
            map[item.data.id] = { ...changed, editMode: editMode };
        }
        return map;
    }, { ...current } as CalendarGroupMap));
}


function groupCreateSuccess(state: State, current: ImmutableCalendarGroupMap, folder: CalendarGroup) {
    return assigncalendarGroups(state, current, [folder], false);
}


function preRenameGroup(current: ImmutableCalendarGroupMap, group: CalendarGroupItemWrapper, value: string): ImmutableCalendarGroupMap {
    const tmp = {};
    tmp[group.data.id] = {
        ...group,
        loading: true,
        editMode: undefined,
        data: { ...group.data, displayName: value }
    };
    return { ...current, ...tmp };
}

function groupRenameSuccess(current: ImmutableCalendarGroupMap, groupItem: CalendarGroup): ImmutableCalendarGroupMap {
    const oldWrapper = current[groupItem.id];
    const tmp = {};
    tmp[groupItem.id] = { ...oldWrapper, loading: false, data: groupItem };
    return { ...current, ...tmp };
}

function groupRenameFail(current: ImmutableCalendarGroupMap, group: CalendarGroupItemWrapper): ImmutableCalendarGroupMap {
    const tmp = {};
    tmp[group.data.id] = { ...group, loading: false, editMode: undefined };
    return { ...current, ...tmp };
}


function prergroupDelete(current: ImmutableCalendarGroupMap, group: CalendarGroupItemWrapper): ImmutableCalendarGroupMap {
    const tmp = {};
    tmp[group.data.id] = {
        ...current[group.data.id],
        loading: true,
    };
    return { ...current, ...tmp };
}

function groupDeleteFail(current: ImmutableCalendarGroupMap, group: CalendarGroupItemWrapper): ImmutableCalendarGroupMap {
    const tmp = {};
    tmp[group.data.id] = {
        ...current[group.data.id],
        loading: false,
    };
    return { ...current, ...tmp };
}

function groupDeleteSuccess(state: State, group: CalendarGroupItemWrapper): State {
    let temp = {};
    temp = Object.assign({}, state, {
        calendarGroups: Object.keys(state.calendarGroups).reduce((result, key) => {
            if (key !== group.data.id) {
                result[key] = state.calendarGroups[key];
            }
            return result;
        }, {})
    });
    return { ...state, ...temp };
}

//#endregion group edite

function setCalendarEditMode(current: ImmutableCalendarMap, changed: CalendarItemWrapper, editMode: CalendarEditMode) {
    return <CalendarMap>(Object.values(current).reduce((map, item) => {
        if (item.data.id === changed.data.id) {
            map[item.data.id] = { ...changed, editMode: editMode };
        }
        return map;
    }, { ...current } as CalendarMap));
}

function calendarCreateSuccess(state: State, current: ImmutableCalendarMap, calendarItem: Calendar, groupId: string): ImmutableCalendarMap {
    const temp = {};
    temp[calendarItem.id] = {
        data: calendarItem,
        calendarGroupId: groupId,
        selected: false,
        color: findHexColor(state, calendarItem.color),
        isBirthdaysCalendar: calendarItem.name.includes('Birthdays'),
        isEditable: calendarItem.canEdit,
        isSecondary: !((calendarItem.isDefaultCalendar || (
            calendarItem.name === 'Calendar' &&
            calendarItem.canEdit === true &&
            calendarItem.canShare === true &&
            calendarItem.canViewPrivateItems === true)) || calendarItem.isSharedWithMe)
    };
    return { ...current, ...temp };
}


function preRenameCalendar(current: ImmutableCalendarMap, calendar: CalendarItemWrapper, value: string): ImmutableCalendarGroupMap {
    const tmp = {};
    tmp[calendar.data.id] = {
        ...calendar,
        loading: true,
        editMode: undefined,
        data: { ...calendar.data, displayName: value }
    };
    return { ...current, ...tmp };
}

function calendarChangeColorSuccess(state: State, groupId: string, calendarItem: Calendar): State {
    const current = state.calendarGroups[groupId].calendars;
    const tempCalendar = {};
    const tempGroup = {};
    let _availableColors = [];

    const color = findHexColor(state, calendarItem.color) || state.availableColors.find(val => (val.usedCount < 1)).id;
    _availableColors = state.availableColors.map(val => {
        if (val.id === color) {
            return { ...val, usedCount: (val.usedCount + 1) };
        }
        if (val.id === state.calendarGroups[groupId].calendars[calendarItem.id].color) {
            return { ...val, usedCount: (val.usedCount - 1) };
        }
        return val;
    });

    tempCalendar[calendarItem.id] = { ...current[calendarItem.id], loading: false, data: calendarItem, color: color };
    tempGroup[groupId] = { ...state.calendarGroups[groupId], calendars: { ...current, ...tempCalendar } };

    return { ...state, calendarGroups: { ...state.calendarGroups, ...tempGroup }, availableColors: _availableColors, };
}


function calendarRenameSuccess(state: State, groupId: string, calendarItem: Calendar): State {
    const current = state.calendarGroups[groupId].calendars;
    const tempCalendar = {};
    const tempGroup = {};

    tempCalendar[calendarItem.id] = { ...current[calendarItem.id], loading: false, data: calendarItem };
    tempGroup[groupId] = { ...state.calendarGroups[groupId], calendars: { ...current, ...tempCalendar } };

    return { ...state, calendarGroups: { ...state.calendarGroups, ...tempGroup } };
}

function calendarEditFail(current: ImmutableCalendarMap, calendar: CalendarItemWrapper): ImmutableCalendarMap {
    const tmp = {};
    tmp[calendar.data.id] = { ...calendar, loading: false, editMode: undefined };
    return { ...current, ...tmp };
}


function prerCalendarDelete(current: ImmutableCalendarMap, calendar: CalendarItemWrapper): ImmutableCalendarGroupMap {
    const tmp = {};
    tmp[calendar.data.id] = {
        ...current[calendar.data.id],
        loading: true,
    };
    return { ...current, ...tmp };
}

function calendarDeleteFail(current: ImmutableCalendarMap, calendar: CalendarItemWrapper): ImmutableCalendarMap {
    const tmp = {};
    tmp[calendar.data.id] = {
        ...current[calendar.data.id],
        loading: false,
    };
    return { ...current, ...tmp };
}

function calendarDeleteSuccess(state: State, calendar: CalendarItemWrapper): State {
    let hasChild = false;
    let tempCalendars = {}; // ImmutableCalendarMap
    tempCalendars = Object.keys(state.calendarGroups[calendar.calendarGroupId].calendars).reduce((result, key) => {
        if (key !== calendar.data.id) {
            result[key] = state.calendarGroups[calendar.calendarGroupId].calendars[key];
            hasChild = true;
        }
        return result;
    }, {});
    const tempGroup = {};
    tempGroup[calendar.calendarGroupId] = {
        ...state.calendarGroups[calendar.calendarGroupId],
        calendars: tempCalendars,
        hasChild: hasChild
    };
    return { ...state, calendarGroups: { ...state.calendarGroups, ...tempGroup } };
}




export const getCalendarGroups = (state: State) => state.calendarGroups;
export const getIsLoading = (state: State) => state.loading;
export const getIsCalendarFolderInit = (state: State) => state.init;
export const getSelectedCalendarIds = (state: State) => state.selectedCalendarIds;
export const getCalendarGroupById = (groupId: string) => createSelector(getCalendarGroups, (groups) => {
    return groups[groupId];
});
export const getCalendarItemByIdSet = (groupId: string, calendarId: string) =>
    createSelector(getCalendarGroupById(groupId), (group) => {
        return group ? group.calendars[calendarId] : null;
    });

export const getAllCalendars = createSelector(getCalendarGroups, (groups) => {
    let calendars: CalendarItemWrapper[] = [];
    Object.keys(groups).forEach(val => {
        if (groups[val].calendars) {
            calendars = calendars.concat(Object.keys(groups[val].calendars).map(calendar => groups[val].calendars[calendar]));
        }
    });
    return calendars;
});

export const getCalendarItemById = (id) => createSelector(getCalendarGroups, (groups) => {
    let calendar;
    Object.keys(groups).forEach(val => {
        if (groups[val] && groups[val].calendars[id]) {
            calendar = groups[val].calendars[id];
        }
    });
    return calendar;
});

export const getDefaultCalendar = createSelector(getAllCalendars,
    (calendars) => calendars.filter(calendar => calendar.data.isDefaultCalendar || (
        calendar.data.name === 'Calendar' &&
        calendar.data.canEdit === true &&
        calendar.data.canShare === true &&
        calendar.data.canViewPrivateItems === true)));

export const getCanEditCalendars = createSelector(getAllCalendars,
    (calendars) => calendars.filter(calendar => calendar.data.canEdit));


