import { createSelector } from '@ngrx/store';
import { InboxMessageNotification } from '../../core/notifications';
import * as Actions from '../actions/new-mails';
import * as _ from 'lodash';

export interface State {
    readonly showLastEmail: boolean;
    readonly showList: boolean;
    readonly events: InboxMessageNotification[];
}

const initialState: State = { showLastEmail: false, events: [], showList: false };

export function reducer(state: State = initialState, actions: Actions.Any): State {

    switch (actions.type) {

        case Actions.NEW_MAIL_NOTIFICATION_RECIVED: {
            return { ...state, showLastEmail: true, events: addEvent(state.events, actions.payload.event)};
        }

        case Actions.HIDE_NEW_MAIL_INDICATOR: {
            return { ...state, showLastEmail: false };
        }

        case Actions.TOGGLE_MAIL_LIST: {
            return { ...state, showList: state.events.length ? !state.showList : false};
        }

        case Actions.TOGGLE_MAIL_LAST_EVENT: {
            return { ...state, showLastEmail: state.events.length ? !state.showLastEmail : false};
        }

        case Actions.DELETE_EVENT: {
            return  deleteEvent(state, actions.id);
        }

        default: {
            return state;
        }
    }
}

function addEvent(current: InboxMessageNotification[], event: InboxMessageNotification) {
    return [event].concat(current);
}

function deleteEvent(state: State, id: string) {
    const current = state.events;
    const has = state.events.find((event) => event.Id === id);
    if (has) {
        const index = current.indexOf(has);
       return {...state, events: current.filter((event) => event.Id !== id), showLastEmail: index === 0 ? false : state.showLastEmail}   ;
    }
    return state;
}

export const getLatestEvent = (state: State) => state.events.length > 0 ? state.events[0] : null;
export const getList = (state: State) => _.take(state.events, 5);
export const showList = (state: State) => state.showList;
export const showLastEvent = (state: State) => state.showLastEmail;

