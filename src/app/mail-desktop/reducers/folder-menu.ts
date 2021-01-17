import { createSelector } from '@ngrx/store';
import * as MenuActions from '../actions/folder-menu';
import { SideBarMenuMode } from '../models/enums';
import { RouterOutlets } from '../models/enums';

export interface State {
    readonly mode: SideBarMenuMode;
    visibilityStack: RouterOutlets[];
}

const initialstate: Readonly<State> = Object.freeze<State>({ mode: SideBarMenuMode.Full, visibilityStack: [] });

export function reducer(state: Readonly<State> = initialstate, action: MenuActions.Any): Readonly<State> {
    switch (action.type) {
        case MenuActions.FOLDER_MENU_TOGGLE:
            return Object.freeze({ ...state, mode: state.mode === SideBarMenuMode.Full ? SideBarMenuMode.Compact : SideBarMenuMode.Full });

        case MenuActions.SHOW_SEARCH_OPTIONS:
            return Object.freeze({ ...state, isClose: false, isSearchMode: true });

        case MenuActions.ADD_TO_VISIBILITY_STACK:
            {
                const newStack = [action.outlet].concat(state.visibilityStack.filter((outlet) => outlet !== action.outlet));
                return Object.freeze({
                    ...state,
                    visibilityStack: newStack
                });
            }

        case MenuActions.POP_FROM_VISIBILITY_STACK:
            {
                const newStack = state.visibilityStack.filter((outlet) => outlet !== action.outlet);
                return Object.freeze({
                    ...state,
                    visibilityStack: newStack
                });
            }

        default: {
            return state;
        }
    }
}

export const getMenuMode = (state: State) => state.mode;
export const getVisibilityStack = (state: State) => state.visibilityStack;
export const getVisibleOutlet = createSelector(getVisibilityStack, (stack) => stack.length > 0 ? stack[0] : null);
