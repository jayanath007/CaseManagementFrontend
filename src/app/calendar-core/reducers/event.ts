import { DatePipe } from '@angular/common';

import { createSelector } from '@ngrx/store';
import { CalendarEventWrapper, CalendarItemWrapper } from '../models/interfaces';
import * as Actions from '../actions/event';
import { getSelectedRangeHashSet, getDurationString } from '../utils/calendar';
import { CalendarItem } from '..';
import { Calendar, Event } from '../../core/lib/microsoft-graph';

export interface CalendarEventMap { [id: string]: Readonly<CalendarEventWrapper>; }

export type ImmutableCalendarEventMap = Readonly<CalendarEventMap>;

export interface State {
    readonly calenderViews: { [id: string]: Readonly<CalendarState> };
    readonly currentDateRange: { dateStart: string, dateEnd: string };
    readonly viewType: { type: string, startDay: number };
    readonly selectedDate: string;
}

export interface CalendarState {
    readonly dateRangeHashKeys: { [key: string]: Readonly<{ dateStart: string, dateEnd: string, isLoaded: true }> };
    readonly calendarId: string;
    readonly init: boolean;
    readonly calendarEventLoaded: boolean;
    readonly loading: boolean;
    readonly lodingFail: boolean;
    readonly calendarEvents: ImmutableCalendarEventMap;
    readonly color: string;
    readonly name: string;
    readonly calendarGroupId: string;
}

const datePipe = new DatePipe('en-US');

const initialState: State = Object.freeze({
    calenderViews: Object.freeze({}),
    currentDateRange: { dateStart: datePipe.transform(new Date(), 'yyyy-MM-dd'), dateEnd: datePipe.transform(new Date(), 'yyyy-MM-dd') },
    viewType: { type: 'timeGridDay', startDay: 0 },
    selectedDate: datePipe.transform(new Date(), 'yyyy-MM-dd')
});

export function reducer(state = initialState, action: Actions.Any): State {
    let temp = {};
    switch (action.type) {
        case Actions.SET_CALENDAR_VIEW:
            return {
                ...state,
                currentDateRange: { dateStart: action.payload.startDate, dateEnd: action.payload.endDate },
                viewType: action.payload.viewType
            };
        case Actions.CHANGE_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.payload.date
            };
        case Actions.CLOSE_CALENDAR:
            temp = Object.assign({}, state, {
                calenderViews: Object.keys(state.calenderViews).reduce((result, key) => {
                    if (key !== action.payload.calendarId) {
                        result[key] = state.calenderViews[key];
                    }
                    return result;
                }, {})
            });
            return { ...state, ...temp };

        // temp[action.payload.calendarId] = undefined;
        //     return { ...state, calenderViews: { ...state.calenderViews, ...temp } };
        case Actions.LOAD_CALENDAR_EVENTS:
            return {
                ...state, calenderViews: setCalendarLoadingRange(state.calenderViews, action.payload.calendar,
                    state.currentDateRange.dateStart, state.currentDateRange.dateEnd, state.viewType)
            };
        case Actions.LOAD_CALENDAR_EVENT_SUCCESS:
            return {
                ...state,
                calenderViews: loadEventSuccess(state.calenderViews, false, action.payload.events, action.payload.calendar, true,
                    action.payload.viewType, action.payload.dateRange.startDate, action.payload.dateRange.endDate, 0)
            };
        case Actions.CALENDAR_EVENTS_ALREADY_LOADED:
            temp[action.payload.calendarId] = {
                ...state.calenderViews[action.payload.calendarId],
                loading: false,
            };
            return { ...state, calenderViews: { ...state.calenderViews, ...temp } };
        case Actions.LOAD_CALENDAR_EVENT_FAIL:
            return {
                ...state, calenderViews: loadEventFail(state.calenderViews, action.payload.calendar,
                    action.payload.dateRange.startDate, action.payload.dateRange.endDate, action.payload.viewType, 0, true)
            };

        case Actions.EDIT_CALENDAR:
            if (state.calenderViews[action.payload.calendar.data.id]) {
                return {
                    ...state,
                    calenderViews: { ...state.calenderViews, ...editCalendar(state.calenderViews, action.payload.calendar) }
                };
            } else {
                return state;
            }

        case Actions.LOAD_SINGLE_CALENDAR_EVENT:
            return state;
        case Actions.LOAD_SINGLE_CALENDAR_EVENT_SUCCESS:
            if (state.calenderViews[action.payload.calendarId]) {
                return {
                    ...state, calenderViews: {
                        ...state.calenderViews, ...{
                            [action.payload.calendarId]:
                                loadSingleEventSuccess(state.calenderViews[action.payload.calendarId],
                                    action.payload.event, action.payload.calendar)
                        }
                    }
                };
            } else {
                return state;
            }
        case Actions.LOAD_SINGLE_CALENDAR_EVENT_FAIL:
            return state;


        case Actions.REMOVE_CALENDAR_EVENT:
            return state; // TODO
        case Actions.REMOVE_CALENDAR_EVENT_FAIL:
            return state; // TODO
        case Actions.REMOVE_CALENDAR_EVENT_SUCCESS:
            return {
                ...state,
                calenderViews: removeCalendarEvent(state.calenderViews, action.payload.calendarId, action.payload.eventId,
                    action.payload.isSeries)
            };
        case Actions.UPDATE_CALENDAR_EVENT:
            return state;
        case Actions.UPDATE_CALENDAR_EVENT_SUCCESS:
            return state;
        case Actions.UPDATE_CALENDAR_EVENT_FAIL:
            return state;

        default:
            return state;
    }
}



function setCalendarLoadingRange(current: { [id: string]: Readonly<CalendarState> },
    calendar: CalendarItem<Readonly<Calendar>>,
    dateStart: string, dateEnd: string, viewType: { type: string, startDay: number }): { [id: string]: Readonly<CalendarState> } {
    const ranges = {};
    const tmp = {};
    const calendarId = calendar.data.id;

    const tempRanges = getSelectedRangeHashSet(viewType, calendarId, dateStart, dateEnd);

    Object.keys(tempRanges).forEach(key => {
        if (current[calendarId] && current[calendarId].dateRangeHashKeys[key]) {
            ranges[key] = current[calendarId].dateRangeHashKeys[key];
        } else {
            ranges[key] = tempRanges[key];
        }
    });

    if (current[calendarId]) {
        tmp[calendarId] = {
            ...current[calendarId], ...{
                dateRangeHashKeys: { ...current[calendarId].dateRangeHashKeys, ...ranges },
                calendarId: calendarId,
                loading: true,
                calendarEventLoaded: false,
            }
        };
    } else {
        tmp[calendarId] = {
            dateRangeHashKeys: ranges,
            calendarId: calendarId,
            loading: true,
            calendarEventLoaded: false,
            color: calendar.color,
            name: calendar.data.name,
            calendarGroupId: calendar.calendarGroupId
        };
    }
    return { ...current, ...tmp };
}

function loadEventSuccess(current: { [id: string]: Readonly<CalendarState> },
    loding: boolean, events: Event[], calendar: CalendarItemWrapper, isCurrentRange: boolean,
    viewType: { type: string, startDay: number }, dateStart: string, dateEnd: string, startDay: number) {
    if (!current[calendar.data.id]) {
        return current;
    }
    const tmp = {};
    const calendarId = calendar.data.id;
    const temp = {};

    const hashs = Object.keys(getSelectedRangeHashSet(viewType, calendarId, dateStart, dateEnd));

    Object.keys(current[calendarId].dateRangeHashKeys).forEach(key => {
        if (hashs.includes(key)) {
            return temp[key] = { ...current[calendarId].dateRangeHashKeys[key], isLoaded: true };
        } else {
            return temp[key] = { ...current[calendarId].dateRangeHashKeys[key] };
        }
    });

    if (current[calendarId]) {
        tmp[calendarId] = {
            ...current[calendarId], ...{
                calendarId: calendarId,
                loading: isCurrentRange ? false : current[calendarId].loading,
                calendarEventLoaded: isCurrentRange ? true : current[calendarId].calendarEventLoaded,
                dateRangeHashKeys: temp,
                calendarEvents: mapCalendarEvents(current[calendarId].calendarEvents, events, calendar),
            }
        };
    }
    return { ...current, ...tmp };
}

function loadEventFail(current: { [id: string]: Readonly<CalendarState> },
    calendar: CalendarItem<Readonly<Calendar>>,
    dateStart: string, dateEnd: string, viewType: { type: string, startDay: number }, startDay: number, isCurrentRange: boolean) {

    let tempViews = {};
    const tmp = {};

    const calendarId = calendar.data.id;
    if (!!current[calendarId]) {
        return current;
    }

    const hashs = Object.keys(getSelectedRangeHashSet(viewType, calendarId, dateStart, dateEnd));

    tempViews = Object.keys(current[calendarId].dateRangeHashKeys).reduce((result, key) => {
        if (!!hashs.find(hash => hash === key)) {
            result[key] = current[calendarId].dateRangeHashKeys[key];
        }
        return result;
    }, {});

    tmp[calendarId] = {
        ...current[calendarId], ...{
            dateRangeHashKeys: tempViews,
            calendarId: calendarId,
            loading: isCurrentRange ? false : current[calendarId].loading,
            lodingFail: isCurrentRange ? true : current[calendarId].lodingFail,
            calendarEventLoaded: isCurrentRange ? false : current[calendarId].calendarEventLoaded,
        }
    };
    return { ...current, ...tmp };
}

function mapCalendarEvents(events: Readonly<CalendarEventMap>
    , newEvents: Event[], calendar: CalendarItem<Readonly<Calendar>>): ImmutableCalendarEventMap {
    const temp = {};
    newEvents.forEach((event: Event) => {
        temp[event.id] = {
            data: { ...event, calendar: calendar.data },
            calendarId: calendar.data.id,
            id: event.id,
            title: event.subject,
            allDay: event.isAllDay,
            className: ['dps-calendar-event', event.showAs],
            editable: event.isOrganizer && calendar.data.canEdit,
            // startEditable: false,
            // durationEditable: false,
            overlap: true,
            backgroundColor: calendar.color,
            borderColor: calendar.color,
            textColor: null,
            start: event.start.dateTime,
            end: event.end.dateTime,
            isEditable: calendar.data.canEdit,
            duration: getDurationString(event.start.dateTime, event.end.dateTime),
            hasDPSLinks: event.attachments ? !!event.attachments.find(val => val.name.endsWith('.dps')) : false
        };
    });
    return { ...events, ...temp };

}

function loadSingleEventSuccess(current: Readonly<CalendarState>, event: Event, calendar: CalendarItemWrapper):
    Readonly<CalendarState> {
    const temp = {};
    temp[event.id] = {
        data: { ...event, calendar: calendar.data },
        calendarId: calendar.data.id,
        id: event.id,
        title: event.subject,
        allDay: event.isAllDay,
        className: ['dps-calendar-event', event.showAs],
        editable: event.isOrganizer && calendar.data.canEdit,
        // startEditable: false,
        // durationEditable: false,
        overlap: true,
        backgroundColor: calendar.color,
        borderColor: calendar.color,
        textColor: null,
        start: event.start.dateTime,
        end: event.end.dateTime,
        isEditable: calendar.data.canEdit,
        duration: getDurationString(event.start.dateTime, event.end.dateTime),
        hasDPSLinks: event.attachments ? !!event.attachments.find(val => val.name.endsWith('.dps')) : false
    };
    return { ...current, calendarEvents: { ...current.calendarEvents, ...temp } };
}

function removeCalendarEvent(current: { [id: string]: Readonly<CalendarState> },
    calendarId: string, eventId: string, isSeries: boolean): { [id: string]: Readonly<CalendarState> } {
    const temp = {};
    temp[calendarId] = Object.assign({}, current[calendarId], {
        calendarEvents: Object.keys(current[calendarId].calendarEvents).reduce((result, key) => {
            if (isSeries && current[calendarId].calendarEvents[key].data.seriesMasterId === eventId) {
                return result;
            }
            if (key !== eventId) {
                result[key] = current[calendarId].calendarEvents[key];
            }
            return result;
        }, {})
    });
    return { ...current, ...temp };

}

function setCalendarView(calenderViews: { [id: string]: Readonly<CalendarState> }, calendar: Readonly<CalendarItem<Readonly<Calendar>>>) {
    const temp = {};
    if (calenderViews[calendar.data.id]) {
        temp[calendar.data.id] = { ...calenderViews[calendar.data.id], loading: true };
    } else {
        temp[calendar.data.id] = {
            loading: true,
            init: true,
            name: calendar.data.name,
            color: calendar.color,
            calendarGroupId: calendar.calendarGroupId,
            calendarId: calendar.data.id
        };
    }
    return temp;
}

function editCalendar(calenderViews: { [id: string]: Readonly<CalendarState> }, calendar: CalendarItemWrapper)
    : { [id: string]: Readonly<CalendarState> } {
    const temp = {};
    temp[calendar.data.id] = {
        ...calenderViews[calendar.data.id],
        name: calendar.data.name,
        color: calendar.color,
        calendarEvents: calenderViews[calendar.data.id].color !== calendar.color ?
            cahngeEventColors(calenderViews[calendar.data.id].calendarEvents, calendar.color)
            : calenderViews[calendar.data.id].calendarEvents
    };
    return { ...calenderViews, ...temp };
}

function cahngeEventColors(events: CalendarEventMap, color: string) {
    const temp = {};
    Object.keys(events).forEach(val => {
        temp[val] = { ...events[val], backgroundColor: color, borderColor: color };
    });
    return { ...events, ...temp };
}

export const getCurrentDateRange = (state: State) => state.currentDateRange;
export const getCurrentViewType = (state: State) => state.viewType;
export const getSelectedDate = (state: State) => state.selectedDate;

export const getCalendarViews = (state: State) => state.calenderViews;
export const getCalendarViewById = (id) => createSelector(getCalendarViews, (views) => views[id]);
export const getCalendarEvents = (id) => createSelector(getCalendarViewById(id), (views) => views ? views.calendarEvents : null);
export const getCalendarLoadedHashsById = (id) => createSelector(getCalendarViewById(id),
    (views) => views ? views.dateRangeHashKeys : null);
export const getCalendarViewList = createSelector(getCalendarViews, (calenderViews) => {
    const keyArr: any[] = Object.keys(calenderViews);
    return keyArr.map(val => {
        return {
            loading: calenderViews[val].loading,
            color: calenderViews[val].color,
            name: calenderViews[val].name,
            calendarId: calenderViews[val].calendarId,
            groupId: calenderViews[val].calendarGroupId
        };
    });
});

export const getAllEvents = createSelector(getCalendarViews, (calenderViews) => {
    let events = [];
    Object.keys(calenderViews).forEach(val => {
        if (calenderViews[val].calendarEvents && !calenderViews[val].loading) {
            events = events.concat(
                Object.keys(calenderViews[val].calendarEvents)
                    .map(event => calenderViews[val].calendarEvents[event])
                    .filter(event => event.data.type !== 'seriesMaster')
            );
        }
    });
    return events;
});

export const getAllCalendarEventsOfSelectedDate = createSelector(getCalendarViews, getSelectedDate, (calenderViews, selectedDate) => {
    let events: CalendarEventWrapper[] = [];
    Object.keys(calenderViews).forEach(val => {
        if (calenderViews[val].calendarEvents) {
            Object.keys(calenderViews[val].calendarEvents).forEach(eventId => {
                const startTime = new Date(selectedDate + 'T00:00:00.0000000');
                const endTime = new Date(startTime);
                endTime.setDate(endTime.getDate() + 1);

                const eventStart = new Date(calenderViews[val].calendarEvents[eventId].data.start.dateTime);
                const eventEnd = new Date(calenderViews[val].calendarEvents[eventId].data.end.dateTime);

                if ((eventStart.getTime() < endTime.getTime()) && (eventEnd.getTime() > startTime.getTime())) {
                    events = events.concat(calenderViews[val].calendarEvents[eventId]);
                }
            });
        }
    });
    return events.sort((a, b) => {
        const _a = new Date(a.data.start.dateTime).valueOf();
        const _b = new Date(b.data.start.dateTime).valueOf();
        return !a.allDay && b.allDay ? 1 : (a.allDay && !b.allDay ? -1 : (_a < _b ? -1 : (_b < _a ? 1 : 0)));
    });
});
export const getCalendarEventById = (calendarId, eventId) =>
    createSelector(getCalendarEvents(calendarId), (events) => events ? events[eventId] : null);








