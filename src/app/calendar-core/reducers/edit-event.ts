
import * as Actions from '../actions/edit-event';
import * as MsGraphBeta from '../../core/lib/microsoft-graph';
import { DatePipe } from '@angular/common';
import { RepeatList, RepeatType, AttachmentWrapper } from '../models/interfaces';
import { JsonHubProtocol } from '@aspnet/signalr';


export interface State {
    readonly event: MsGraphBeta.Event;
    readonly timeList: string[];
    readonly repeatList: RepeatList[];
    readonly dayOfWeekList: { lable: string, val: MsGraphBeta.DayOfWeek }[];
    readonly weekIndexList: MsGraphBeta.WeekIndex[];
    readonly monthList: { val: number, label: string, maxDay: number }[];
    readonly reminderList: { lable: string, val: number }[];
    readonly freeBusyStatusList: { lable: string, val: MsGraphBeta.FreeBusyStatus }[];
    readonly sending: boolean;
    readonly sent: boolean;
    readonly deleting: boolean;
    readonly deleted: boolean;
    readonly repeatType: RepeatType[];
    readonly isDirty: boolean;
    readonly isChangeRecurencyEnd: boolean;
    readonly isNewEvent: boolean;
    readonly attachments: AttachmentWrapper[];
    readonly attachmentChange: boolean;
    readonly lastInlineAttachment: AttachmentWrapper;
    readonly creatingId: boolean;
    readonly rooms: MsGraphBeta.EmailAddress[];
}


const initialstate: Readonly<State> = Object.freeze<State>({
    event: null,
    repeatType: [
        {
            label: 'Daily',
            value: 'daily',
            weekDef: 12
        },
        {
            label: 'Weekly',
            value: 'weekly',
            weekDef: 24
        },
        {
            label: 'The same day each month',
            value: 'absoluteMonthly',
            weekDef: 52
        },
        {
            label: 'The same week each month',
            value: 'relativeMonthly',
            weekDef: 52
        },
        {
            label: 'The same day each year',
            value: 'absoluteYearly',
            weekDef: 104
        },
        {
            label: 'The same week each year',
            value: 'relativeYearly',
            weekDef: 104
        }
    ],
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
    repeatList: [
        { lable: 'Never', val: 'never', recurrence: {} },
        {
            lable: 'Every Day', val: 'every_day',
            recurrence: { type: 'daily', interval: 1 }
        },
        {
            lable: 'Every x week day', val: 'every_x_week_day',
            recurrence: {
                type: 'weekly', interval: 1,
                daysOfWeek: ['sunday'],
                firstDayOfWeek: 'sunday'
            }
        },
        {
            lable: 'Every workday', val: 'every_workday',
            recurrence: {
                type: 'weekly', interval: 1,
                daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                firstDayOfWeek: 'sunday'
            }
        },
        {
            lable: 'Day x of every month', val: 'day_x_of_every_month',
            recurrence: { type: 'absoluteMonthly', interval: 1, dayOfMonth: 1 }
        },
        {
            lable: 'Every x y', val: 'monthly',
            recurrence: {
                type: 'relativeMonthly', interval: 1,
                daysOfWeek: ['sunday'], index: 'first'
            }
        },
        {
            lable: 'Every x y', val: 'yearly',
            recurrence: { type: 'absoluteYearly', interval: 1, month: 1, dayOfMonth: 1 }
        },
        { lable: 'Custom pattern', val: 'custom' },
        { lable: 'Other...', val: 'other', recurrence: {} },
    ],
    dayOfWeekList: [
        { lable: 'Sunday', val: 'sunday' },
        { lable: 'Monday', val: 'monday' },
        { lable: 'Tuesday', val: 'tuesday' },
        { lable: 'Wednesday', val: 'wednesday' },
        { lable: 'Thursday', val: 'thursday' },
        { lable: 'Friday', val: 'friday' },
        { lable: 'Saturday', val: 'saturday' },
    ],
    freeBusyStatusList: [
        { lable: 'Free', val: 'free' },
        { lable: 'Working elsewhere', val: 'workingElsewhere' },
        { lable: 'Tentative', val: 'tentative' },
        { lable: 'Busy', val: 'busy' },
        { lable: 'Away', val: 'oof' },
    ],
    reminderList: [
        { lable: 'None', val: null },
        { lable: '0 minutes', val: 0 },
        { lable: '5 minutes', val: 5 },
        { lable: '10 minutes', val: 10 },
        { lable: '15 minutes', val: 15 },
        { lable: '30 minutes', val: 30 },
        { lable: '1 hour', val: 60 },
        { lable: '2 hour', val: 120 },
        { lable: '3 hour', val: 180 },
        { lable: '4 hour', val: 240 },
        { lable: '8 hour', val: 480 },
        { lable: '12 hour', val: 720 },
        { lable: '1 day', val: 720 },
        { lable: '2 day', val: 1440 },
        { lable: '3 day', val: 2160 },
        { lable: '1 week', val: 5040 },
        { lable: '2 week', val: 10080 },
    ],
    weekIndexList: ['first', 'second', 'third', 'fourth', 'last'],
    monthList: [
        { val: 1, label: 'January', maxDay: 31 },
        { val: 2, label: 'February', maxDay: 29 },
        { val: 3, label: 'March', maxDay: 31 },
        { val: 4, label: 'April', maxDay: 30 },
        { val: 5, label: 'May', maxDay: 31 },
        { val: 6, label: 'June', maxDay: 30 },
        { val: 7, label: 'July', maxDay: 31 },
        { val: 8, label: 'August', maxDay: 31 },
        { val: 9, label: 'September', maxDay: 30 },
        { val: 10, label: 'October', maxDay: 31 },
        { val: 11, label: 'November', maxDay: 30 },
        { val: 12, label: 'December', maxDay: 31 }
    ],
    sending: false,
    sent: false,
    deleting: false,
    deleted: false,
    isDirty: false,
    isChangeRecurencyEnd: false,
    isNewEvent: false,
    attachments: [],
    attachmentChange: false,
    lastInlineAttachment: null,
    creatingId: false,
    rooms: []
});

export function reducer(state: Readonly<State> = initialstate, action: Actions.Any): Readonly<State> {
    switch (action.type) {
        case Actions.ADD_EVENT:
            const event = {
                ...action.payload.event,
                start: {
                    ...action.payload.event.start, dateTime: action.payload.event.start.dateTime.endsWith('Z')
                        ? action.payload.event.start.dateTime : action.payload.event.start.dateTime + 'Z'
                },
                end: {
                    ...action.payload.event.end, dateTime: action.payload.event.end.dateTime.endsWith('Z')
                        ? action.payload.event.end.dateTime : action.payload.event.end.dateTime + 'Z'
                },
            };
            return {
                ...state,
                event: event,
                repeatList: changeRepeatListSelectItem(updateRepeatListRecurrence(state.repeatList, state,
                    event.start.dateTime),
                    event.recurrence ? event.recurrence.pattern : null),
                sending: false,
                sent: false,
                deleting: false,
                deleted: false,
                isDirty: false,
                isChangeRecurencyEnd: false,
                isNewEvent: event.id ? false : true,
                attachments: event.attachments ? setInitialAttachment(event.attachments) : [],
                attachmentChange: false
            };
        case Actions.CHANGE_EVENT_TITLE:
            return {
                ...state,
                event: { ...state.event, subject: action.payload.title },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_BODY:
            return {
                ...state,
                event: { ...state.event, body: setBody(state.event.body, action.payload) },
                isDirty: true
            };

        case Actions.CHANGE_EVENT_LOCATION:
            return {
                ...state, event: {
                    ...state.event,
                    locations: changeLocation(state.event.locations, action.payload.location, action.payload.index)
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_START:
            return {
                ...state,
                event: {
                    ...state.event,
                    start: {
                        ...state.event.start, dateTime: action.payload.start,
                    },
                    end: {
                        ...state.event.end,
                        dateTime: setEndDate(new Date(state.event.start.dateTime),
                            new Date(state.event.end.dateTime), new Date(action.payload.start), 'startDateChange')
                    }
                },
                repeatList: changeRepeatListSelectItem(updateRepeatListRecurrence(state.repeatList, state, action.payload.start),
                    state.event.recurrence ? state.event.recurrence.pattern : null),
                isDirty: true
            };
        case Actions.CHANGE_EVENT_END:
            return {
                ...state,
                event: {
                    ...state.event, end: {
                        ...state.event.end, dateTime: setEndDate(new Date(state.event.start.dateTime),
                            new Date(state.event.end.dateTime), new Date(action.payload.end), 'endDateChange')
                    }
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_ISALLDAY:
            return {
                ...state,
                event: { ...state.event, isAllDay: action.payload.isAllDay },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_ISPRIVATE:
            return {
                ...state,
                event: {
                    ...state.event,
                    sensitivity: action.payload.isPrivate ? 'private' : state.event.sensitivity
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_REMINDER:
            return {
                ...state,
                event: { ...state.event, reminderMinutesBeforeStart: action.payload.reminderMinutesBeforeStart },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_REPEAT_RANGE_START:
            return {
                ...state, event: {
                    ...state.event,
                    recurrence: {
                        ...state.event.recurrence,
                        range: setRecurrenceStart(state.event.recurrence.range, action.payload.start)
                    },
                    ...state.event,
                    start: {
                        ...state.event.start, dateTime: new Date(action.payload.start).toISOString(),
                    },
                    end: {
                        ...state.event.end,
                        dateTime: setEndDate(new Date(state.event.start.dateTime),
                            new Date(state.event.end.dateTime), new Date(action.payload.start), 'startDateChange')
                    }
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_REPEAT_RANGE_END:
            return {
                ...state, event: {
                    ...state.event,
                    recurrence: { ...state.event.recurrence, range: setRecurrenceEnd(state.event.recurrence.range, action.payload.end) }
                },
                isDirty: true,
                isChangeRecurencyEnd: true
            };
        case Actions.CHANGE_EVENT_REPEAT_PATTERN:
            return {
                ...state, event: {
                    ...state.event,
                    recurrence: {
                        ...state.event.recurrence,
                        pattern: action.payload.recurrencePattern ? action.payload.recurrencePattern : null,
                        range: setRecurrenceRange(state.event.recurrence ? state.event.recurrence.range : null,
                            state.isChangeRecurencyEnd, action.payload.recurrencePattern ? action.payload.recurrencePattern.type : null,
                            state.event.start.dateTime)
                    },
                    type: action.payload.recurrencePattern && action.payload.recurrencePattern.type ? 'seriesMaster' : 'singleInstance'
                },
                repeatList: changeRepeatListSelectItem(state.repeatList, action.payload.recurrencePattern),
                isDirty: true
            };
        case Actions.CHANGE_EVENT_SHOWAS:
            return {
                ...state, event: {
                    ...state.event,
                    showAs: action.payload.showAs ? <MsGraphBeta.FreeBusyStatus>action.payload.showAs : null
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_SAVE_TO_CALANDER:
            return {
                ...state,
                event: {
                    ...state.event,
                    calendar: action.payload.calendar
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_ADD_ATTENDEE:
            return {
                ...state, event: {
                    ...state.event, attendees: addAttendee(state.event.attendees, action.payload.attendee)
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_REMOVE_ATTENDEE:
            return {
                ...state,
                event: {
                    ...state.event,
                    attendees: removeAttendee(state.event.attendees, action.payload.attendee)
                },
                isDirty: true
            };
        case Actions.CHANGE_EVENT_REQUEST_RESPONSES:
            return {
                ...state,
                event: { ...state.event, responseRequested: action.payload.responseRequested },
                isDirty: true
            };

        case Actions.SEND_CALANDER_EVENT:
            return { ...state, sending: true };
        case Actions.SEND_CALANDER_EVENT_SUCCESS:
            return {
                ...state, sending: false, sent: true,
                event: (state.event ? { ...state.event, id: action.payload.newEvent.id } : state.event),
                isDirty: false, attachmentChange: false
            };
        case Actions.SEND_CALANDER_EVENT_FAIL:
            return { ...state, sending: false, sent: false };
        case Actions.SENDING_CALANDER_EVENT:
            return { ...state, sending: true };

        case Actions.DELETE_CALANDER_EVENT:
            return { ...state, deleting: true };
        case Actions.DELETE_CALANDER_EVENT_SUCCESS:
            return { ...state, deleting: false, deleted: true };
        case Actions.DELETE_CALANDER_EVENT_FAIL:
            return { ...state, deleting: false, deleted: false };
        case Actions.DELETING_CALANDER_EVENT:
            return { ...state, deleting: true };
        case Actions.ADD_ATTACHMENT:
            return {
                ...state,
                attachments: setUplodingAttachment(state.attachments, action.payload.uid, action.payload.attachment)
            };
        case Actions.UPLOAD_ATTACHMENT:
            return {
                ...state,
                event: {
                    ...state.event,
                    id: !state.event.id ? action.payload.event.id : state.event.id
                },
                creatingId: false,
                // isDirty: true
            };
        case Actions.ITEM_CREATING:
            return {
                ...state,
                creatingId: true
            };
        case Actions.UPLOAD_ATTACHMENT_SUCCESS:
            return {
                ...state,
                attachments: setUploadFinish(state.attachments, action.payload.uid, action.payload.attachment), attachmentChange: true,
                lastInlineAttachment: action.payload.attachment.isInline ?
                    { attachment: action.payload.attachment, uid: action.payload.uid } : state.lastInlineAttachment
            };
        case Actions.UPLOAD_ATTACHMENT_FAIL:
            return {
                ...state,
                attachments: state.attachments.filter(val => val.uid !== action.payload.uid)
            };
        case Actions.DELETE_ATTACHMENT:
            return { ...state, attachments: changeIsDeleteInAttachment(state.attachments, action.payload.attachmentId, true) };
        case Actions.DELETE_ATTACHMENT_SUCCESS:
            return {
                ...state,
                attachments: state.attachments.filter(val => val.uid !== action.payload.attachmentID), attachmentChange: true
            };
        case Actions.DELETE_ATTACHMENT_FAIL:
            return { ...state, attachments: changeIsDeleteInAttachment(state.attachments, action.payload.attachmentID, false) };
        case Actions.CLOSE_POPUP:
            return {
                ...state,
                event: null,
                repeatList: changeRepeatListSelectItem(updateRepeatListRecurrence(state.repeatList, state, new Date().toISOString()), null),
                sending: false,
                sent: false,
                deleting: false,
                deleted: false,
                isDirty: false,
                isChangeRecurencyEnd: false,
                isNewEvent: true,
                attachments: [],
                attachmentChange: false
            };
        case Actions.CHANGE_ONLINE_MEETING:
            return {
                ...state,
                event: {
                    ...state.event,
                    isOnlineMeeting: action.payload.isOnline
                },
                isDirty: true
            };
        case Actions.GET_ROOMS_SUCCESS:
            return {
                ...state,
                rooms: action.payload.rooms
            };
        default: {
            return state;
        }
    }
}

function changeRepeatListSelectItem(repeatList: RepeatList[], recurrencePattern): RepeatList[] {
    return repeatList.map(item => {
        if (!recurrencePattern) {
            if (item.val === 'never') {
                return Object.freeze({ ...item, selected: true });
            } else if (item.selected) {
                return Object.freeze({ ...item, selected: false });
            }
            return item;
        } else if (isMatchPattern(item, recurrencePattern)) {
            if (isMatchPattern(item, recurrencePattern)) {
                return Object.freeze({ ...item, selected: true });
            } else if (item.selected) {
                return Object.freeze({ ...item, selected: false });
            }
            return item;
        } else {
            if (item.val === 'custom') {
                return Object.freeze({ ...item, selected: true, recurrence: recurrencePattern });
            } else if (item.selected) {
                return Object.freeze({ ...item, selected: false });
            }
            return item;
        }
    });
    // if (!recurrencePattern) {
    //     return repeatList.map(item => {
    //         if (item.val === 'never') {
    //             return Object.freeze({ ...item, selected: true });
    //         } else if (item.selected) {
    //             return Object.freeze({ ...item, selected: false });
    //         }
    //         return item;
    //     });
    //     // } else if (repeatList.find(val => val.recurrence === recurrencePattern)) {
    // } else if (isMatchPattern(repeatList, recurrencePattern)) {
    //     return repeatList.map(item => {
    //         if (item.recurrence === recurrencePattern) {
    //             return Object.freeze({ ...item, selected: true });
    //         } else if (item.selected) {
    //             return Object.freeze({ ...item, selected: false });
    //         }
    //         return item;
    //     });
    // } else {
    //     return repeatList.map(item => {
    //         if (item.val === 'custom') {
    //             return Object.freeze({ ...item, selected: true, recurrence: recurrencePattern });
    //         } else if (item.selected) {
    //             return Object.freeze({ ...item, selected: false });
    //         }
    //         return item;
    //     });
    // }
}

function changeLocation(locations: MsGraphBeta.Location[] = [], location: MsGraphBeta.Location, index: number) {
    if (index >= 0) {
        return locations.filter((val, i) => i !== index);
    } else if (locations.find(val => val.uniqueId === location.uniqueId)) {
        return locations;
    }
    return locations.concat([location]);
}

function isMatchPattern(repeatList: RepeatList, recurrencePattern: MsGraphBeta.RecurrencePattern): boolean {
    switch (repeatList.val) {
        case 'every_day': {
            if (repeatList.recurrence.type === recurrencePattern.type && repeatList.recurrence.interval === recurrencePattern.interval) {
                return true;
            }
            break;
        }
        case 'every_x_week_day': {
            if (repeatList.recurrence.type === recurrencePattern.type && repeatList.recurrence.interval === recurrencePattern.interval
                && JSON.stringify(repeatList.recurrence.daysOfWeek) === JSON.stringify(recurrencePattern.daysOfWeek)) {
                return true;
            }
            break;
        }
        case 'every_workday': {
            if (repeatList.recurrence.type === recurrencePattern.type && repeatList.recurrence.interval === recurrencePattern.interval
                && recurrencePattern.daysOfWeek.length === 5 &&
                !recurrencePattern.daysOfWeek.find(val => val === 'saturday') &&
                !recurrencePattern.daysOfWeek.find(val => val === 'sunday')) {
                return true;
            }
            break;
        }
        case 'day_x_of_every_month': {
            if (repeatList.recurrence.type === recurrencePattern.type && repeatList.recurrence.interval === recurrencePattern.interval
                && JSON.stringify(repeatList.recurrence.dayOfMonth) === JSON.stringify(recurrencePattern.dayOfMonth)) {
                return true;
            }
            break;
        }
        case 'monthly': {
            if (repeatList.recurrence.type === recurrencePattern.type && repeatList.recurrence.interval === recurrencePattern.interval
                && JSON.stringify(repeatList.recurrence.daysOfWeek) === JSON.stringify(recurrencePattern.daysOfWeek)) {
                return true;
            }
            break;
        }
        case 'yearly': {
            if (repeatList.recurrence.type === recurrencePattern.type && repeatList.recurrence.interval === recurrencePattern.interval
                && repeatList.recurrence.month === recurrencePattern.month
                && repeatList.recurrence.dayOfMonth === recurrencePattern.dayOfMonth) {
                return true;
            }
            break;
        }
        default: {
            return false;
        }
    }
}

// function hasRecurrencePattern(){

// }

function updateRepeatListRecurrence(repeadList: RepeatList[], state: State, startDateTime: string) {
    const startDate = parseInt(startDateTime.split('T')[0].substring(8, 10), 0);
    const startMonth = parseInt(startDateTime.split('T')[0].substring(5, 7), 0) - 1;
    return repeadList.map(val => {
        if (val.val === 'every_x_week_day') {
            return <RepeatList>{
                val: val.val, lable: `Every ${state.dayOfWeekList[new Date(startDateTime.split('T')[0]).getDay()].lable}`,
                recurrence: {
                    type: 'weekly', interval: 1,
                    daysOfWeek: [state.dayOfWeekList[new Date(startDateTime.split('T')[0]).getDay()].val],
                    firstDayOfWeek: 'sunday'
                }
            };
        } else if (val.val === 'day_x_of_every_month') {
            return <RepeatList>{
                val: val.val, lable: `Day ${startDate} of every month`,
                recurrence: { type: 'absoluteMonthly', interval: 1, dayOfMonth: startDate }
            };
        } else if (val.val === 'monthly') {
            return <RepeatList>{
                val: val.val,
                lable: `Every ${state.weekIndexList[Math.floor(startDate / 7)]}
                 ${state.dayOfWeekList[new Date(startDateTime.split('T')[0]).getDay()].lable}`,
                recurrence: {
                    type: 'relativeMonthly', interval: 1,
                    daysOfWeek: [state.dayOfWeekList[new Date(startDateTime.split('T')[0]).getDay()].val],
                    index: state.weekIndexList[Math.floor(startDate / 7)]
                }
            };
        } else if (val.val === 'yearly') {
            return <RepeatList>{
                val: val.val,
                lable: `Every ${state.monthList[startMonth].label}
                 ${startDate}`,
                recurrence: {
                    type: 'absoluteYearly', interval: 1,
                    month: state.monthList[startMonth].val, dayOfMonth: startDate
                }
            };
        }
        return val;
    });

}

function setRecurrenceStart(current: MsGraphBeta.RecurrenceRange, start: string)
    : MsGraphBeta.RecurrenceRange {
    const temp = start ? {
        startDate: start
    } : current;
    return { ...current, ...temp };
}

function setRecurrenceEnd(current: MsGraphBeta.RecurrenceRange, end: string)
    : MsGraphBeta.RecurrenceRange {
    const temp = {
        type: <MsGraphBeta.RecurrenceRangeType>(end ? 'endDate' : 'noEnd'),
        endDate: end
    };
    return { ...current, ...temp };
}

function setRecurrenceRange(current: MsGraphBeta.RecurrenceRange,
    isChangeRecurencyEnd: boolean, patterneType: MsGraphBeta.RecurrencePatternType, eventStartDate: string): MsGraphBeta.RecurrenceRange {
    let endDate: Date = current ? current.endDate ? new Date(current.endDate) : new Date(current.startDate) : new Date(eventStartDate);
    const startDate: Date = current && current.startDate ? new Date(current.startDate) : new Date(eventStartDate);
    if (!isChangeRecurencyEnd) {
        endDate = current && current.startDate ? new Date(current.startDate) : new Date(eventStartDate);
        switch (patterneType) {
            case 'daily':
                {
                    endDate = new Date(endDate.setDate(endDate.getDate() + 84));
                    break;
                }
            case 'weekly':
                {
                    endDate = new Date(endDate.setDate(endDate.getDate() + 168));
                    break;
                }
            case 'absoluteMonthly':
                {
                    endDate = new Date(endDate.setDate(endDate.getDate() + 364));
                    break;
                }
            case 'relativeMonthly':
                {
                    endDate = new Date(endDate.setDate(endDate.getDate() + 364));
                    break;
                }
            case 'absoluteYearly':
                {
                    endDate = new Date(endDate.setDate(endDate.getDate() + 728));
                    break;
                }
            case 'relativeYearly':
                {
                    endDate = new Date(endDate.setDate(endDate.getDate() + 728));
                    break;
                }
            default:
                {
                    endDate = new Date(eventStartDate);
                }
        }
    }
    const temp = {
        type: <MsGraphBeta.RecurrenceRangeType>('endDate'),
        startDate: new DatePipe('en-US').transform(startDate, 'yyyy-MM-dd'),
        endDate: new DatePipe('en-US').transform(endDate, 'yyyy-MM-dd'),
        // endDate: endDate.toISOString()
    };
    return { ...current, ...temp };
}

function setBody(current: MsGraphBeta.ItemBody, payload: { body: string }): MsGraphBeta.ItemBody {
    const temp = {
        contentType: <MsGraphBeta.BodyType>'html',
        content: payload.body
    };
    return { ...current, ...temp };
}

function addAttendee(attendees: MsGraphBeta.Attendee[], attendee: MsGraphBeta.Attendee): MsGraphBeta.Attendee[] {
    return attendees ? attendees.filter(val => val.emailAddress.address !== attendee.emailAddress.address)
        .concat([attendee]) : [].concat([attendee]);
}

function removeAttendee(attendees: MsGraphBeta.Attendee[], attendee: MsGraphBeta.Attendee): MsGraphBeta.Attendee[] {
    return attendees.filter((rec) => rec !== attendee);
}

// Attachment
function setInitialAttachment(attachment: MsGraphBeta.Attachment[]): AttachmentWrapper[] {
    const attachmentsList: AttachmentWrapper[] = [];
    if (attachment.length > 0) {
        attachment.forEach(val => {
            const item: AttachmentWrapper = {
                uid: val.id,
                isDeleting: false,
                isUploding: false,
                attachment: val
            };
            attachmentsList.push(item);
        });
    }
    return attachmentsList;
}

function setUplodingAttachment(attachments: AttachmentWrapper[], uid: string, uplodingAttachment: MsGraphBeta.Attachment) {
    const attachment: AttachmentWrapper = {
        uid: uid,
        isUploding: true,
        isDeleting: false,
        attachment: uplodingAttachment
    };
    return attachments.concat(attachment);
}

function setUploadFinish(attachments: AttachmentWrapper[], uid: string, uplodedAttachment: MsGraphBeta.Attachment) {
    return attachments.map(val => {
        if (val.uid === uid) {
            return { ...val, uid: uplodedAttachment.id, isUploding: false, attachment: uplodedAttachment };
        }
        return val;
    });
}

function changeIsDeleteInAttachment(attachments: AttachmentWrapper[], id: string, isDelete: boolean) {
    return attachments.map(val => {
        if (val.uid === id) {
            return { ...val, isDeleting: isDelete };
        }
        return val;
    });
}

function getDateDefferent(date1: Date, date2: Date) {
    return Math.abs(date2.getDate() - date1.getDate());
}

function setEndDate(startDate: Date, endDate: Date, changeDate: Date, type: string) {
    switch (type) {
        case 'startDateChange': {
            let diff = (endDate.getTime() - startDate.getTime()) / 1000;
            diff /= 60;
            return new Date(changeDate.setMinutes(changeDate.getMinutes() + Math.abs(Math.round(diff)))).toISOString();
        }
        case 'endDateChange': {
            if (startDate > changeDate) {
                return startDate.toISOString();
            }
            return changeDate.toISOString();
        }
        default:
            return endDate.toISOString();
    }


}

export const getEvent = (state: State) => {
    return state ? state.event : null;
};
export const getTimeList = (state: State) => {
    return state ? state.timeList : [];
};
export const getDayOfWeekList = (state: State) => {
    return state ? state.dayOfWeekList : [];
};
export const getFreeBusyStatusList = (state: State) => {
    return state ? state.freeBusyStatusList : [];
};
export const getReminderList = (state: State) => {
    return state ? state.reminderList : [];
};
export const getWeekIndexList = (state: State) => {
    return state ? state.weekIndexList : [];
};
export const getMonthList = (state: State) => {
    return state ? state.monthList : [];
};
export const getRepeatList = (state: State) => {
    if (!state || !state.event) {
        return [];
    }
    let temRepeatList = state.repeatList;
    if (!temRepeatList.filter(item => item.val === 'custom')[0].recurrence) {
        temRepeatList = temRepeatList.filter(item => item.val !== 'custom');
    }
    return temRepeatList;

};
export const getIsSending = (state: State) => {
    return state ? state.sending : false;
};
export const getIsDeleting = (state: State) => {
    return state ? state.deleting : false;
};
export const getIsSent = (state: State) => {
    return state ? state.sent : false;
};
export const getOptionalAttendees = (state: State) => {
    return state.event && state.event.attendees ? state.event.attendees.filter(val => val.type === 'optional') : [];
};
export const getRequiredAttendees = (state: State) => {
    return state.event && state.event.attendees ? state.event.attendees.filter(val => val.type === 'required') : [];
};
export const getRepeatType = (state: State) => {
    return state ? state.repeatType : [];
};
export const getIsDirty = (state: State) => {
    return state ? state.isDirty : false;
};
export const getIsNewEvent = (state: State) => {
    return state ? state.isNewEvent : false;
};
export const getAttachmentList = (state: State) => {
    return state ? state.attachments.filter(val => !val.attachment.isInline && !val.isDeleting) : [];
};
export const getIsAttachmentsUploding = (state: State) => {
    return state ? state.attachments.filter(val => val.isUploding || val.isDeleting).length > 0 : false;
};
export const getIsAttachmentChange = (state: State) => state ? state.attachmentChange : false;
export const getLastInlineAttachment = (state: State) => state ? state.lastInlineAttachment : null;
export const getIsEventIdCreating = (state: State) => state ? state.creatingId : false;
export const getRooms = (state: State) => state ? state.rooms : [];


