import * as Actions from '../actions/calendar';
import { DatePipe } from '@angular/common';
import { isMobile } from '../../utils/is-mobile';

export interface State {
    readonly currentView: string;
    // readonly currentDate: string;
    readonly currentTitle: string;
    readonly showBusinessHours: boolean;
}

const datePipe = new DatePipe('en-US');

const initialstate: Readonly<State> = Object.freeze<State>({
    currentView: isMobile().any() ? 'timeGridDay' : 'timeGridFourDay',
    // currentDate: datePipe.transform(new Date(), 'yyyy-MM-dd'),
    currentTitle: '', showBusinessHours: true
});

export function reducer(state: Readonly<State> = initialstate, action: Actions.Any): Readonly<State> {
    switch (action.type) {
        case Actions.CHANGE_CALENDAR_VIEW:
            return Object.freeze({ ...state, currentView: action.payload.view });
        case Actions.CHANGE_CALENDAR_TITLE:
            return Object.freeze({ ...state, currentTitle: action.payload.title });
        case Actions.CHANGE_SHOW_BUSINESS_HOURS:
            return Object.freeze({ ...state, showBusinessHours: action.payload.showBusinessHours });
        default: {
            return state;
        }
    }
}
export const getCurrentView = (state: State) => {
    return state.currentView;
};
// export const getCurrentDate = (state: State) => state.currentDate;
export const getCurrentTitle = (state: State) => state.currentTitle;
export const getShowBusinessHours = (state: State) => state.showBusinessHours;
