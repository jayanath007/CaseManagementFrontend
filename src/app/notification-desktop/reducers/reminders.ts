import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/reminders';
import { Reminder, AutomaticRepliesSetting } from '../../core/lib/microsoft-graph';

export interface State {
    readonly showLastReminder: boolean;
    readonly newReminders: Reminder[];
    readonly allReminders: Reminder[];
    readonly curentTime: string;
    readonly automaticReplies: AutomaticRepliesSetting;
}

const initialState: State = {
    showLastReminder: false, newReminders: [],
    allReminders: [], curentTime: '0001-01-01T00:00',
    automaticReplies: null
};

export function reducer(state: State = initialState, actions: Actions.Any): State {

    switch (actions.type) {

        case Actions.GET_AUTO_REPLY_SUCCESSS: {
            return { ...state, automaticReplies: actions.payload };
        }
        case Actions.UPDATE_REMINDERS: {
            return { ...state, allReminders: actions.payload.reminders };
        }

        case Actions.NEW_REMINDER_RECEIVED: {
            return {
                ...state, showLastReminder: true,
                newReminders: actions.payload.reminders
            };
        }

        case Actions.HIDE_NEW_REMINDER: {
            return { ...state, showLastReminder: false };
        }

        case Actions.SNOOZE_REMINDER: {
            return {
                ...state, showLastReminder: hideLastReminder(state, actions.payload.reminder),
                newReminders: state.newReminders.filter(val => val.eventId !== actions.payload.reminder.eventId),
                allReminders: state.allReminders.filter(val => val.eventId !== actions.payload.reminder.eventId)
            };
        }

        case Actions.DISMISS_REMINDER: {
            return {
                ...state, showLastReminder: hideLastReminder(state, actions.payload.reminder),
                newReminders: state.newReminders.filter(val => val.eventId !== actions.payload.reminder.eventId),
                allReminders: state.allReminders.filter(val => val.eventId !== actions.payload.reminder.eventId)
            };
        }
        case Actions.DISMISS_ALL_REMINDER: {
            return {
                ...state, showLastReminder: false,
                newReminders: state.newReminders.filter(val =>
                    !actions.payload.reminders.find(reminder => reminder.eventId === val.eventId)),
                allReminders: state.allReminders.filter(val =>
                    !actions.payload.reminders.find(reminder => reminder.eventId === val.eventId))
            };
        }

        case Actions.CHANGE_CURRENT_TIME: {
            return { ...state, curentTime: actions.payload.dateTime };
        }

        default: {
            return state;
        }
    }
}

function hideLastReminder(state: State, reminder: Reminder) {
    if (state.newReminders.length < 1 || (state.newReminders.length === 1 && state.newReminders[0].eventId === reminder.eventId)) {
        return false;
    }
    return state.showLastReminder;
}

export const getShowLastReminder = (state: State) => state.showLastReminder;
export const getAllReminders = (state: State) => state.allReminders.filter(reminder =>
    new Date(reminder.reminderFireTime.dateTime).valueOf() <= new Date(state.curentTime).valueOf()
).sort((a, b) => new Date(a.eventStartTime.dateTime).valueOf() > new Date(b.eventStartTime.dateTime).valueOf() ? -1 : 1);
export const getNewReminders = (state: State) => state.newReminders;
export const getCurentTime = (state: State) => state.curentTime;

export const getAutoRepy = (state: State) => state.automaticReplies;
export const showAutoRepyMsg = (state: State) => state.automaticReplies ? state.automaticReplies.status !== 'disabled' : false;
