import { ExceptionDialogData, ExceptionalertTypes } from '../../shared/models/dialog';
import { createSelector } from '@ngrx/store';

import * as Actions from '../actions/exceptions';
import * as _ from 'lodash';

export interface State {

    readonly exceptionList: ExceptionDialogData[];
}

const initialState: State = {
    exceptionList: []
    // exceptionList: [
    //     {
    //         id: 1, alertTypes: ExceptionalertTypes.ERROR, visible: true,
    //         content: { title: 'lushan', path: 'test', message: 'test test', code: 'lushan test' }
    //     },
    //     {
    //         id: 2, alertTypes: ExceptionalertTypes.ERROR, visible: true,
    //         content: { title: 'abbccc', path: 'abc', message: 'test test', code: 'lushan 567 test' }
    //     },
    //     {
    //         id: 3, alertTypes: ExceptionalertTypes.ERROR, visible: true,
    //         content: { title: 'abbcc567c', path: 'abc', message: 'test abc test', code: 'lushan test' }
    //     }
    // ],
};

export function reducer(state: State = initialState, actions: Actions.Any): State {

    switch (actions.type) {

        case Actions.EXCEPTION_NOTIFICATION_RECEIVED: {
            return { ...state, exceptionList: addException(state.exceptionList, actions.payload.exception) };
        }

        case Actions.EXCEPTION_NOTIFICATION_DELETE: {
            return deleteException(state, actions.id);
        }

        case Actions.EXCEPTION_NOTIFICATION_HIDE: {
            return hideException(state, actions.id);
        }
        default: {
            return state;
        }
    }
}
function addException(current: ExceptionDialogData[], exseption: ExceptionDialogData) {
    if (current.find(val => val.content.code === exseption.content.code)) {
        return current;
    }
    let value = Math.max.apply(Math, current.map((o) => o.id));
    if (isFinite(value)) {
        value = value + 1;
    } else {
        value = 1;
    }
    exseption.id = value;
    exseption.visible = true;
    return [...current, { ...exseption }];
}
function hideException(state: State, id: number) {
    const current = state.exceptionList;
    const newExceptionList = state.exceptionList.map((item) => {
        if (item.id === id) {
            return { ...item, visible: false };
        } else {
            return { ...item };
        }
    });
    return { ...state, exceptionList: newExceptionList, };
}


function deleteException(state: State, id: number) {
    const current = state.exceptionList;
    const has = state.exceptionList.find((exseption) => exseption.id === id);
    if (has) {
        const index = current.indexOf(has);
        return { ...state, exceptionList: current.filter((exseption) => exseption.id !== id), };
    }
    return state;
}

export const getExceptionList = (state: State) => {
    return _.take(state.exceptionList.filter(p => p.visible === true), 3);
};
export const getExceptionListAll = (state: State) => state.exceptionList;
