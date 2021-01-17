import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/right-sidenav';
import { Theme } from '../../dashboard-desktop/components/dashboard-layout/enum';
import { Module } from '../../core/lib/app-settings';
import { ScreenEditComponentTreeData } from '../../core';
import { MainMenuItem } from '..';

export interface State {
    readonly isOpend: boolean;
    readonly module: 'settings' | 'reminders' | 'error log';
    readonly databases: any[];
    readonly dashBoardWidgetList: Array<{
        id: string, active:
        boolean, name: string,
        enabale: boolean,
        moduleId: Module,
    }>;
    readonly theme: Theme;
}



const initialstate: Readonly<State> = Object.freeze<State>({
    isOpend: false,
    module: 'settings',
    databases: null,
    dashBoardWidgetList: [],
    theme: Theme.Angular7,
});

export function reducer(state: Readonly<State> = initialstate, action: Actions.Any): Readonly<State> {
    switch (action.type) {
        case Actions.SHOW_REMINDERS_SIDENAV:
            return { ...state, isOpend: true, module: 'reminders' };
        case Actions.SHOW_SETTINGS_SIDENAV:
            return { ...state, isOpend: true, module: 'settings' };
        case Actions.SHOW_ERROR_LIST:
            return { ...state, isOpend: true, module: 'error log' };
        case Actions.CHANGE_THEME_SIDENAV:
            return { ...state, theme: action.paylod };
        case Actions.HIDE_RIGHT_SIDENAV:
            return { ...state, isOpend: false };
        case Actions.DATABASE_SUCCESS:
            return { ...state, databases: action.databases };
        case Actions.INIT_DASH_BOARD_WIDGET_LIST:
            const widgetList = getInitWidgetList(action.paylod.widgetList, action.paylod.hiddenModule);
            return { ...state, dashBoardWidgetList: widgetList };
        case Actions.DASHBOARD_WIDGET_LIST_ACTIVE_ITEM:
            const dashBoardWidgetList = setWidgetListActiveItem(state, action.paylod.id);
            return { ...state, dashBoardWidgetList: dashBoardWidgetList };
        case Actions.DASH_BOARD_WIDGET_LIST_DEACTIVATE_ITEM:
            const defaultWidgetList = setWidgetListDeactivateItem(state, action.paylod.id);
            return { ...state, dashBoardWidgetList: defaultWidgetList };
        case Actions.UPDATE_WIDGETS_DISPLAY_NAME:
            {
                return { ...state, dashBoardWidgetList: mapWidgetItemName(state.dashBoardWidgetList, action.MenuItem) };
            }
        default: {
            return state;
        }
    }
}

function getInitWidgetList(dashBoardWidgetList, hiddenModule: Module[]) {
    const list = getWidgetListFromLocalStorage();
    if (list && list.length === dashBoardWidgetList.length) {
        return setupDashBoardWidgetList(list, hiddenModule);
    } else {
        setWidgetListFromLocalStorage(dashBoardWidgetList);
        return setupDashBoardWidgetList(dashBoardWidgetList, hiddenModule);
    }
}


function setWidgetListActiveItem(state: State, id) {
    const widgetList = state.dashBoardWidgetList.map(widget => {
        if (id === widget.id) {
            return { ...widget, active: true };
        }
        return widget;
    });
    setWidgetListFromLocalStorage(widgetList);
    return widgetList;
}


function setWidgetListDeactivateItem(state: State, id) {
    const widgetList = state.dashBoardWidgetList.map(widget => {
        if (id === widget.id) {
            return { ...widget, active: false };
        }
        return widget;
    });
    setWidgetListFromLocalStorage(widgetList);
    return widgetList;
}

function getWidgetListFromLocalStorage(): Array<any> {
    return JSON.parse(localStorage.getItem('DPS_widgetList_v1'));
}

function setWidgetListFromLocalStorage(widgetList) {
    localStorage.setItem('DPS_widgetList_v1', JSON.stringify(widgetList));
}

function setupDashBoardWidgetList(widgetList, hiddenModule: Module[]) {
    return widgetList.map(val => {
        const isHidden = !!hiddenModule ? !!hiddenModule.find(i => i.trim() === val.moduleId) : null;
        return {
            ...val, enabale: isHidden === true ? false : val.enabale
        };
    });

}

function mapWidgetItemName(widgets, menuItems: MainMenuItem<any>[]) {
    // const clientItem = menuItems.find(mi => mi.id === 'client_creation');
    // const clientItemLabel = clientItem ? clientItem.label : '';
    const matterItem = menuItems.find(mi => mi.id === 'matter_creation');
    const matterItemLabel = matterItem ? matterItem.label : '';
    return widgets.map(i => {
        if (i.id === 'matter_search' && !!matterItemLabel) {
            return {
                ...i,
                name: matterItemLabel
            };
        }
        return i;

    });
}

export const getRightSidenavModule = (state: State) => state.module;
export const getRightSidenavIsOpend = (state: State) => state.isOpend;
export const getDatabases = (state: State) => state.databases;
export const getDashBoardWidgetList = (state: State) => state.dashBoardWidgetList.filter((item) => item.enabale);
export const getTheme = (state: State) => state.theme;
export const isDashBoardWidgetItemActive = (state: State, id) => {
    return state.dashBoardWidgetList.find(item => item.id === id).active;
};
export const getItemActiveStateById = (id: string) =>
    createSelector(getDashBoardWidgetList, (items) => {
        if (items) {
            const data = items.find((item) => item.id === id);
            return (data) ? data.active : undefined;
        }
        return false;
    });


