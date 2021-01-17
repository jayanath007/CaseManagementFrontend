import { Action } from '@ngrx/store';
import { Module } from '../../core/lib/app-settings';
import { MainMenuItem } from '..';

export const SHOW_REMINDERS_SIDENAV = 'DPS_SHOW_REMINDERS_SIDENAV';
export const SHOW_SETTINGS_SIDENAV = 'DPS_SHOW_SETTINGS_SIDENAV';
export const HIDE_RIGHT_SIDENAV = 'DPS_HIDE_RIGHT_SIDENAV';
export const SHOW_ERROR_LIST = 'DPS_SHOW_ERROR_LIST';
export const GET_DATABASES = 'DPS_GET_DATABASES';
export const DATABASE_SUCCESS = 'DPS_DATABASE_SUCCESS';
export const DASH_BOARD_WIDGET_LIST_DEACTIVATE_ITEM = 'DPS_DASH_BOARD_WIDGET_LIST_DEACTIVATE_ITEM';
export const DASHBOARD_WIDGET_LIST_ACTIVE_ITEM = 'DASHBOARD_WIDGET_LIST_ACTIVE_ITEM';
export const INIT_DASH_BOARD_WIDGET_LIST = 'DPS_INIT_DASH_BOARD_WIDGET_LIST';
export const CHANGE_THEME_SIDENAV = 'DPS_CHANGE_THEME_SIDENAV';
export const UPDATE_WIDGETS_DISPLAY_NAME = 'DPS_UPDATE_WIDGETS_DISPLAY_NAME';

export class ShowRemindersSidenav implements Action {
    readonly type = SHOW_REMINDERS_SIDENAV;
    constructor(public paylod) { }
}

export class ChangeThemeSidenav implements Action {
    readonly type = CHANGE_THEME_SIDENAV;
    constructor(public paylod) { }
}
export class ShowSettingsSidenav implements Action {
    readonly type = SHOW_SETTINGS_SIDENAV;
    constructor(public paylod) { }
}

export class ShowErrorList implements Action {
    readonly type = SHOW_ERROR_LIST;
    constructor(public paylod) { }
}


export class GetDatabases implements Action {
    readonly type = GET_DATABASES;
}

export class DatabasesSuccess implements Action {
    readonly type = DATABASE_SUCCESS;
    constructor(public databases: any[]) {

    }
}

export class HideRightSidenav implements Action {
    readonly type = HIDE_RIGHT_SIDENAV;
    constructor(public paylod) { }
}
export class DashBoardWidgetListDeactivateItem implements Action {
    readonly type = DASH_BOARD_WIDGET_LIST_DEACTIVATE_ITEM;
    constructor(public paylod: { id: any }) { }
}

export class DashBoardWidgetListActiveItem implements Action {
    readonly type = DASHBOARD_WIDGET_LIST_ACTIVE_ITEM;
    constructor(public paylod: { id: any }) { }
}

export class InitDashBoardWidgetList implements Action {
    readonly type = INIT_DASH_BOARD_WIDGET_LIST;
    constructor(public paylod: { widgetList: any, hiddenModule: Module[] }) { }
}

export class UpdateWidgetItemsName implements Action {
    readonly type = UPDATE_WIDGETS_DISPLAY_NAME;
    constructor(public MenuItem: MainMenuItem<any>[]) { }
}



export type Any = ShowRemindersSidenav | ShowSettingsSidenav | HideRightSidenav | ShowErrorList | DatabasesSuccess
    | DashBoardWidgetListDeactivateItem | DashBoardWidgetListActiveItem | InitDashBoardWidgetList | ChangeThemeSidenav |
    UpdateWidgetItemsName;
