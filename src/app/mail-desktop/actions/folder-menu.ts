import { Action } from '@ngrx/store';
import { RouterOutlets } from '../models/enums';

export const FOLDER_MENU_TOGGLE = 'DPS_FOLDER_MENU_TOGGLE';
export const SHOW_SEARCH_OPTIONS = 'DPS_SHOW_SEARCH_OPTIONS';
export const HIDE_SEARCH_OPTIONS = 'DPS_HIDE_SEARCH_OPTIONS';
export const ADD_TO_VISIBILITY_STACK = 'ADD_TO_VISIBILITY_STACK';
export const POP_FROM_VISIBILITY_STACK = 'POP_FROM_VISIBILITY_STACK';

export class FolderMenuToggle implements Action {
    readonly type = FOLDER_MENU_TOGGLE;
    constructor() {}
}
export class ShowSearchOptins implements Action {
    readonly type = SHOW_SEARCH_OPTIONS;
    constructor() {}
}
export class HideSearchOptins implements Action {
    readonly type = SHOW_SEARCH_OPTIONS;
    constructor() {}
}

export class AddToVisibilityStack implements Action {
    readonly type = ADD_TO_VISIBILITY_STACK;
    constructor(public outlet: RouterOutlets) {}
}

export class PopFromVisibilityStack implements Action {
    readonly type = POP_FROM_VISIBILITY_STACK;
    constructor(public outlet: RouterOutlets) {}
}

export type Any = FolderMenuToggle|ShowSearchOptins|HideSearchOptins | AddToVisibilityStack | PopFromVisibilityStack;
