import * as Actions from '../actions/side-nav';
import { isMobile } from '../../utils/is-mobile';
export interface State {
    readonly isStartSidenaveOpened: boolean;
    readonly isEndSidenaveOpened: boolean;
    readonly isEndSidenaveEnabled: boolean;
}

const initialstate: Readonly<State> = Object.freeze<State>({
    isStartSidenaveOpened: true, isEndSidenaveOpened: isMobile().any() ? false : true, isEndSidenaveEnabled: isMobile().any() ? false : true
});

export function reducer(state: Readonly<State> = initialstate, action: Actions.Any): Readonly<State> {
    switch (action.type) {
        case Actions.CALENDAR_START_SIDENAVE_TOGGLE:
            return Object.freeze({ ...state, isStartSidenaveOpened: !state.isStartSidenaveOpened });
        case Actions.CALENDAR_START_SIDENAVE_OPEN:
            return Object.freeze({ ...state, isStartSidenaveOpened: true });
        case Actions.CALENDAR_START_SIDENAVE_CLOSE:
            return Object.freeze({ ...state, isStartSidenaveOpened: false });

        case Actions.CALENDAR_END_SIDENAVE_TOGGLE:
            return Object.freeze({ ...state, isEndSidenaveOpened: !state.isEndSidenaveOpened, isEndSidenaveEnabled: true });
        case Actions.CALENDAR_END_SIDENAVE_OPEN:
            return Object.freeze({ ...state, isEndSidenaveOpened: true, isEndSidenaveEnabled: true });
        case Actions.CALENDAR_END_SIDENAVE_CLOSE:
            return Object.freeze({ ...state, isEndSidenaveOpened: false, isEndSidenaveEnabled: true });
        case Actions.CALENDAR_END_SIDENAVE_ENABLE:
            return Object.freeze({ ...state, isEndSidenaveEnabled: true });
        case Actions.CALENDAR_END_SIDENAVE_DISABLE:
            return Object.freeze({ ...state, isEndSidenaveEnabled: false });

        default: {
            return state;
        }
    }
}

export const getIsStartSidenaveOpened = (state: State) => state.isStartSidenaveOpened;
export const getIsEndSidenaveOpened = (state: State) => state.isEndSidenaveOpened;
export const getIsEndSidenaveEnabled = (state: State) => state.isEndSidenaveEnabled;
