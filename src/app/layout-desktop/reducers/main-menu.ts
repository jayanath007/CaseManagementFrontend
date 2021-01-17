import { Utilities } from './../../utils/utilities';
import { ScreenEditComponentTreeData } from './../../core/lib/screen-edit';
import { GO_TO_DASH_BOARD, MenuItemClick, RemoveFromMainMenu } from '../actions/main-menu';
import { createSelector } from '@ngrx/store';
import * as MenuActions from '../actions/main-menu';
import { MainMenuItem } from '../models/interfaces';
import { MenuGroups, RouterOutlets } from '../models/enums';
import * as Core from '../../core/lib/actions';
import * as MatterCore from './../../matter-creation-core/actions/core';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { Matter } from '../../matter-creation-core/models/interfaces';
import { Module } from '../../core/lib/app-settings';


export type SideNaveModes = 'over' | 'side' | 'side-min';

export interface State {
    readonly mode: SideNaveModes;
    readonly menuItems: MainMenuItem<any>[];
    readonly inputData: { [hostToken: string]: any };
    readonly viewStack: RouterOutlets[];
}

function getPopupPath(localPath) {
    return [{ outlets: { popup: localPath } }];
}

function getForOutlet(outlet, localPath) {
    const tmp = {};
    tmp[outlet] = localPath;
    return [{ outlets: tmp }];
}

const mainMenuItems = [
    {
        id: 'dashbord', group: MenuGroups.General, label: 'Dashboard', icon: 'dashboard',
        outlet: RouterOutlets.Dashboard,
        routerLink: ['tmp'],
        hidden: false,
        isSelected: true,
        moduleId: Module.Common,
        canAccess: true
    },
    {
        id: 'team_efficiency', group: MenuGroups.General, label: 'KPI', icon: 'timeline',
        outlet: RouterOutlets.Main,
        routerLink: ['team-efficiency', 'home', 'index'],
        hidden: false,
        moduleId: Module.Common,
        canAccess: true
    },
    {
        id: 'mail', group: MenuGroups.General,
        label: 'Mail', icon: 'mail_outline',
        outlet: RouterOutlets.Mail,
        routerLink: ['mail', 'home', 'index'],
        hidden: false,
        group2: MenuGroups.UrlPopUp,
        routerLink2: ['mail', 'layout', 'home', 'index'],
        moduleId: Module.Common,
        canAccess: true
    },
    {
        id: 'calendar', group: MenuGroups.General, label: 'Calendar', icon: 'today',
        outlet: RouterOutlets.Main,
        routerLink: ['calendar', 'home', 'index'],
        hidden: false,
        group2: MenuGroups.UrlPopUp,
        routerLink2: ['calendar', 'layout', 'home', 'index'],
        moduleId: Module.Common,
        canAccess: true
    },
    {
        id: 'client_search', group: MenuGroups.General, label: 'Clients', icon: 'person',
        outlet: RouterOutlets.Main,
        routerLink: ['client-search', 'home', 'index'],
        hidden: true,
        moduleId: Module.Client,
        canAccess: false
    },
    {
        id: 'matter_search', group: MenuGroups.General, label: 'Matters', icon: 'pageview',
        outlet: RouterOutlets.Main,
        routerLink: ['matter-search', 'home', 'index'],
        hidden: true,
        moduleId: Module.Matter,
        canAccess: false
    },
    {
        id: 'my_tasks', group: MenuGroups.General, label: 'Tasks', icon: 'assignment_ind',
        outlet: RouterOutlets.Main,
        routerLink: ['my-tasks', 'home', 'index'],
        hidden: false,
        moduleId: Module.WorkToDo,
        canAccess: false
    },
    {
        id: 'work_done', group: MenuGroups.General, label: 'Work Done', icon: 'assignment_turned_in',
        outlet: RouterOutlets.Main,
        routerLink: ['work-done', 'home', 'index'],
        hidden: false,
        moduleId: Module.WorkDone,
        canAccess: false
    },
    {
        id: 'time_recorded', group: MenuGroups.UrlPopUp, label: 'Time Recorded', icon: 'timer',
        outlet: RouterOutlets.Main,
        routerLink: 'time-recorded',
        hidden: false,
        moduleId: Module.TimeRecorded,
        canAccess: false
    },
    {
        id: 'safe_box_explorer', group: MenuGroups.General, label: 'FILE STORE', icon: 'security',
        outlet: RouterOutlets.Main,
        routerLink: ['safe-box-explorer', 'home', 'index'],
        hidden: false,
        moduleId: Module.Common,
        canAccess: true
    },
    {
        id: 'global_document_search', group: MenuGroups.General, label: 'Document Search', icon: 'public',
        outlet: RouterOutlets.Main,
        routerLink: ['global-document-search', 'home', 'index'],
        hidden: false,
        moduleId: Module.GlobleDocumentSearch,
        canAccess: false
    },
    {
        id: 'post_office', group: MenuGroups.General, label: 'Post Office', icon: 'drafts',
        outlet: RouterOutlets.Main,
        routerLink: ['post-office', 'home', 'index'],
        hidden: false,
        moduleId: Module.PostOfficeInbox,
        canAccess: false
    },
    {
        id: 'opportunity', group: MenuGroups.General, label: 'Opportunities', icon: 'track_changes',
        outlet: RouterOutlets.Main,
        routerLink: ['opportunity', 'home', 'index'],
        hidden: false,
        moduleId: Module.Opportunity,
        canAccess: false
    },
    {
        id: 'dictations', group: MenuGroups.General, label: 'Dictations', icon: 'headset_mic',
        outlet: RouterOutlets.Main,
        routerLink: ['dictations', 'home', 'index'],
        hidden: false,
        moduleId: Module.Dictations,
        canAccess: false
    },
    {
        id: 'team', group: MenuGroups.General, label: 'Team', icon: 'supervisor_account',
        outlet: RouterOutlets.Main,
        routerLink: ['team', 'home', 'index'],
        hidden: false,
        moduleId: Module.ActivityMonitor,
        canAccess: false
    },
    {
        id: 'ledger_card', group: MenuGroups.HeaderBarItem, label: 'Ledger Card', icon: 'credit_card',
        outlet: RouterOutlets.Main,
        routerLink: ['ledger-card', 'home', 'index'],
        hidden: true,
        moduleId: Module.LedgerCard,
        canAccess: false
    },
    {
        id: 'pdf-bundle-monitor', group: MenuGroups.UrlPopUp, label: 'PDF Bundle Monitor', icon: 'picture_as_pdf',
        outlet: RouterOutlets.Main,
        routerLink: 'pdfbundlemonitor',
        hidden: true,
        moduleId: Module.Common,
        canAccess: true
    },
    {
        id: 'client_creation', group: MenuGroups.PopUp, label: 'Client Creation', icon: 'person_add',
        outlet: null,
        hidden: true,
        moduleId: Module.Client,
        canAccess: false
    },
    {
        id: 'matter_creation', group: MenuGroups.PopUp, label: 'Matter Creation', icon: 'library_add',
        outlet: null,
        hidden: true,
        moduleId: Module.Matter,
        canAccess: false
    },
    {
        id: 'advanced_search', group: MenuGroups.PopUp, label: 'Advanced Search Matter', icon: 'find_in_page',
        outlet: null,
        hidden: true,
        moduleId: Module.Common,
        canAccess: true
    },
    {
        id: 'e_chit', group: MenuGroups.PopUp, label: 'E-Chit', icon: 'library_books',
        outlet: null,
        hidden: true,
        moduleId: Module.ChequeRequest,
        canAccess: false
    },

    {
        id: 'contacts', group: MenuGroups.General, label: 'Contacts', icon: 'headset_mic',
        outlet: RouterOutlets.Main,
        routerLink: ['contacts', 'home', 'index'],
        hidden: true,
        moduleId: Module.Contact,
        canAccess: false
    },

];




const initialstate: Readonly<State> = Object.freeze<State>({
    mode: 'side',
    menuItems: mainMenuItems,
    inputData: null,
    viewStack: [RouterOutlets.Dashboard]
});

export function reducer(state: Readonly<State> = initialstate, action: MenuActions.Any | Core.Any | MatterCore.Any): Readonly<State> {
    const tmp = {};
    switch (action.type) {
        case MenuActions.GET_MENU_ITEM_SUCCESS:
            let tempMenuItem = state.menuItems;
            tempMenuItem = mapMenuItemName(tempMenuItem, action.MenuItem);
            return {
                ...state,
                menuItems: tempMenuItem
            };
        case MenuActions.MAIN_MENU_TOGGLE:
            let mode: SideNaveModes = state.mode;
            if ((action as MenuActions.MainMenuToggle).paylod.kind === 'menu-pin-click') {
                mode = state.mode === 'side' ? 'side-min' : 'side';
            } else if ((action as MenuActions.MainMenuToggle).paylod.kind === 'menu-expand-click') {
                mode = 'side';
            }
            return Object.freeze({ ...state, mode: mode });

        case MenuActions.ADD_TO_VIEW_STACK:
            {
                const newState = {
                    ...state,
                    viewStack: [action.outlet].concat(state.viewStack.filter((outlet) => outlet !== action.outlet))
                };
                return newState;
            }

        case MenuActions.POP_FROM_VIEW_STACK:
            {
                const newState = { ...state, viewStack: state.viewStack.filter((outlet) => outlet !== action.outlet) };
                return newState;
            }

        case MenuActions.APPEND_TO_MAIN_MENU:
            {
                return { ...state, menuItems: appentToMenu(state.menuItems, action.payload.item) };
            }

        case MenuActions.UPDATE_MENU_ITEM:
            {
                return { ...state, menuItems: updateMenuItem(state.menuItems, action.itemId, action.item) };
            }
        case MenuActions.GET_POSTCODE_COUNT_SUCCESS:
            {
                return { ...state, menuItems: updatePostCodeCount(state.menuItems, action.payload.count) };
            }

        case MenuActions.REMOVE_FROM_MAIN_MENU:
            {
                return { ...state, menuItems: removeMenuItem(state.menuItems, action.payload.id) };
            }
        case MenuActions.MAIN_MENU_ITEM_CLICK:
            {
                const newMode = (window.outerWidth < 1400) ? 'side-min' : state.mode;
                return { ...state, mode: newMode, menuItems: selectMenuItem(state.menuItems, action.item) };
            }
        case MenuActions.ADD_OPEN_CASE_INPUT_DATA:
            tmp[action.inputData.openCaseToken] = action.inputData;
            return { ...state, inputData: { ...state.inputData, ...tmp } };
        case Core.MENU_OPEN_CASE_ADD_TAB:
            if (!checkOpenCaseInMenue(state, action.paylod.token, action.paylod.menuItem)) {
                return {
                    ...state, inputData: { ...state.inputData, ...tmp }, menuItems: [...state.menuItems, action.paylod.menuItem]
                };
            } else {
                return state;
            }
        case Core.MENU_TAB_CLOSE:
            return { ...state, menuItems: removeOpenCaseTab(state.menuItems, action.payload.item, action.payload.nextIndex) };
        case MenuActions.GO_TO_NEXT_OPEN_CASE_TAB:
            return state;
        case MenuActions.GO_TO_DASH_BOARD:
            return state;

        case MenuActions.OPEN_MAIL_POPUP:
            tmp[action.token] = setOpenMaillPopup(state[action.token]);
            return { ...state, ...tmp };
        case MenuActions.OPEN_MAIL_POPUP_SUCCESS:
            tmp[action.token] = setOpenMaillPopupSuccess(state[action.token]);
            return { ...state, ...tmp };
        case MenuActions.OPEN_MAIL_POPUP_FAIL:
            tmp[action.token] = setOpenMaillPopupFail(state[action.token]);
            return { ...state, ...tmp };
        case Core.FILE_LOGIG_STATUS_CHANGE:
            {
                return { ...state, menuItems: updateFileLogicStatus(state.menuItems, action) };
            }
        case MenuActions.RUN_EXIT_LOGIC_AND_CLOSE:
            return { ...state, menuItems: hiddenHederBarItem(state.menuItems, action.item) };

        case MenuActions.MENU_ITEM_OPEN_CASE_MATTER_DATILS_UPDATE:
            {

                // const openCaseToken = Utilities.getOpenCaseTabKey(action.payload.matter.branchID,
                //     action.payload.matter.appId,
                //     action.payload.matter.fileID);
                const openCaseToken = Utilities.getOpenCaseTabKey(action.payload.matter.appId,
                    action.payload.matter.fileID);

                return { ...state, menuItems: menuItemMaterDetails(state.menuItems, openCaseToken, action.payload.matter) };
            }
        case MenuActions.GET_MODULE_INFOMATION_SUCCESS:
            {
                return { ...state, menuItems: setupMenuItem(state.menuItems, action.hiddenModule) };
            }
        default: {
            return state;
        }
    }
}


function menuItemMaterDetails(menus: MainMenuItem<any>[], openCaseToken: string, matter: Matter) {
    return menus.map((val: MainMenuItem<OpenCaseMenueData>) => {
        if (val.id === openCaseToken) {
            return {
                ...val, data: {
                    ...val.data,
                    matterData: {
                        ...val.data.matterData,
                        data: {
                            ...val.data.matterData.data,
                            // appID: matter.appId, // if change re open matter
                            fileID: +matter.fileID,
                            app_Code: matter.appCode,
                            // branchID: matter.branchID, // if change re open matter
                            feeEarner: matter.matterFeeEarner,
                            clientName: matter.clientName,
                            matterDetails: matter.matterDetails,
                            matterReferenceNo: matter.matterRef,
                            rateCategory: matter.matterRateCategory,
                            ufnValue: matter.crimeUFN,
                            eBilling: matter.eBilling,
                            isPlotMatter: matter.isPlotMatter,
                            isPlotMasterMatter: matter.isPlotMasterMatter,
                        }
                    }
                }
            };
        } else {
            return val;
        }
    });
}




function mapMenuItemName(menuItems: MainMenuItem<any>[], item: ScreenEditComponentTreeData[])
    : MainMenuItem<any>[] {
    const clientItem = item.filter(mi => mi.scL_Name === 'INPtpgClient');
    const clientItemLabel = clientItem && clientItem.length > 0 ? clientItem[clientItem.length - 1].scL_Caption : '';
    const matterItem = item.filter(mi => mi.scL_Name === 'INPtpgMatter');
    const matterItemLabel = matterItem && matterItem.length > 0 ? matterItem[matterItem.length - 1].scL_Caption : '';
    return menuItems.map(i => {
        if (i.id === 'client_creation' && !!clientItemLabel) {
            return {
                ...i,
                label: clientItemLabel
            };
        } else if (i.id === 'matter_creation' && !!matterItemLabel) {
            return {
                ...i,
                label: matterItemLabel
            };
        } else if (i.id === 'client_search' && !!clientItemLabel) {
            return {
                ...i,
                label: clientItemLabel,
                hidden: false
            };
        } else if (i.id === 'matter_search' && !!matterItemLabel) {
            return {
                ...i,
                label: matterItemLabel,
                hidden: false
            };
        } else {
            return i;
        }
    });
}

function updateFileLogicStatus(menuItems: MainMenuItem<any>[], action: Core.FileLogicStatsChange): MainMenuItem<any>[] {
    return menuItems.map(item => {
        if (item.group === MenuGroups.OpenCase && !item.hidden) {
            const data: OpenCaseMenueData = item.data;
            if (data) {
                const ok = action.appId === data.matterData.data.appID &&
                    action.fileId === data.matterData.data.fileID &&
                    action.branchId === data.matterData.data.branchID;
                if (ok) {
                    const mutation = { [action.logicType.toLowerCase() + 'LogicState']: action.status };
                    const newItem = { ...item, data: { ...data, ...mutation } };
                    return newItem;
                }
            }
        }
        return item;
    });
}

function setOpenMaillPopup(state: State): Partial<State> {
    return { ...state };
}

function setOpenMaillPopupSuccess(state: State): Partial<State> {
    return { ...state };
}

function setOpenMaillPopupFail(state: State): Partial<State> {
    return { ...state };
}

function removeOpenCaseTab(menuItems: MainMenuItem<any>[], item: MainMenuItem<any>, index: number) {
    return menuItems.filter(menues => menues.id !== item.id).map((val, i) => {
        if (item.isSelected) {
            if (i === index) {
                val.isSelected = true;
            } else {
                val.isSelected = false;
            }
        }
        return val;
    });
}

function appentToMenu(menus: MainMenuItem<any>[], item: MainMenuItem<any>): MainMenuItem<any>[] {
    if (menus.find(val => val.id === item.id)) {
        return menus.map(val => {
            if (val.id === item.id) {
                val.isSelected = true;
            } else {
                val.isSelected = false;
            }
            return val;
        });
    } else {
        return menus.concat(item).map(val => {
            if (val.id === item.id) {
                val.isSelected = true;
                val.hidden = true;
            } else {
                val.isSelected = false;
            }
            return val;
        });
    }

}

function removeMenuItem(menus: MainMenuItem<any>[], Id: string) {
    return menus.filter((item) => item.id !== Id);
}
function selectMenuItem(menus: MainMenuItem<any>[], item: MainMenuItem<any>) {
    return menus.map(val => {
        // if (val.group !== MenuGroups.OpenCase || item.group === MenuGroups.OpenCase) {
        if (val.id === item.id) {
            val.isSelected = true;
            if (item.group === MenuGroups.HeaderBarItem) {
                val.hidden = false;
            }
            // val.hidden = (val.group === MenuGroups.OpenCase && !val.data.menuDisplayText1);
            // val.hidden = false;
        } else {
            val.isSelected = false;
        }
        // }
        return val;
    });
}
function hiddenHederBarItem(menus: MainMenuItem<any>[], item: MainMenuItem<any>) {
    return menus.map(val => {
        if (val.group === MenuGroups.HeaderBarItem && val.id === item.id) {
            // val.isSelected = false;
            val.hidden = true;
        }
        return val;
    });
}

function updatePostCodeCount(menus: MainMenuItem<any>[], count: number) {

    return menus.map(val => {
        if (val.id === 'post_office') {
            return { ...val, data: count };
        }
        return val;
    });
}


function updateMenuItem(menus: MainMenuItem<any>[], id: string, item: Partial<MainMenuItem<any>>) {
    return menus.map((_item) => _item.id === id ? { ..._item, ...item } : _item);
}

function checkOpenCaseInMenue(state: Readonly<State>, token, item): boolean {
    const data: OpenCaseMenueData = state.inputData[token];
    if (state.menuItems.find(p => p.id === data.matterData.data.matterReferenceNo)) {
        return true;
    }
    return false;
}

function setupMenuItem(menus: MainMenuItem<any>[], hiddenModule: Module[]): MainMenuItem<any>[] {
    return menus.map(val => {
        const isHidden = !!hiddenModule ? !!hiddenModule.find(i => i.trim() === val.moduleId) : false;
        return {
            ...val, canAccess: isHidden === true ? false : true
        };
    });
}

export const getMenuMode = (state: State) => state.mode;
export const getMenuItems = (state: State) => state.menuItems;
export const getMenuItemById = (id) => createSelector(getMenuItems, (items) => items.find((item) => item.id === id));
export const getMenuItemByToken = (token) => createSelector(getMenuItems, (items) => {
    return items.find((item) => item.token === token);
});

export const getGeneralMenuItems = (state: State) => state.menuItems.filter((data) => data.hidden !== true && data.canAccess === true &&
    (data.group !== MenuGroups.HeaderBarItem));
export const getGeneralAllMenuItems = (state: State) => state.menuItems;
export const getMenuItemsByMenuGroups = (state: State, menuGroup: MenuGroups) =>
    state.menuItems.filter((data) => data.group === menuGroup);


export const getOpenCaseMenuItems = (state: State) => state.menuItems.filter((data) =>
    ((data.group === MenuGroups.OpenCase || (data.group === MenuGroups.HeaderBarItem && data.hidden === false))));

export const getRestOfMenuItemsById = (id, menuGroup: MenuGroups) => createSelector(getMenuItems, (openedTabs) =>
    openedTabs.filter((data) => data.id !== id));

export const getRestOfOpenCaseMenuItemsById = (id) => createSelector(getOpenCaseMenuItems, (openedTabs) => {
    return openedTabs.filter((data) => data.id !== id);
});


export const getOpenCaseMenuItemMatterDataById = (id) => createSelector(getOpenCaseMenuItems, (openedTabs) => {
    return openedTabs.filter((data) => data.id === id && data.data && data.data.matterData).map((item) => {
        return item.data;
    });
});

export const getInputData = (state: State) => state.inputData;
export const getInputDataByTargetToken = (token) => createSelector(getInputData, (input) => input[token]);
export const getVisibleOutlet = (state: State) => state.viewStack[0];
export const getMenuItemDisplayName = (id: string) => (state: State) => state.menuItems.find(i => i.id === id).label;

