import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as mainMenu from './main-menu';
import * as rightSidenav from './right-sidenav';

export interface State {
    mainMenu: mainMenu.State;
    rightSidenav: rightSidenav.State;
}

export const reducers = {
    mainMenu: mainMenu.reducer,
    rightSidenav: rightSidenav.reducer,
};

export const getLayoutRootState = createFeatureSelector<State>('dpsLayout');
export const getMainMenuState = createSelector(getLayoutRootState, (state) => state.mainMenu);
export const getMainMenuMode = createSelector(getMainMenuState, mainMenu.getMenuMode);
export const getMainMenuItems = createSelector(getMainMenuState, mainMenu.getMenuItems);
export const getOpenCaseMenueItems = createSelector(getMainMenuState, mainMenu.getOpenCaseMenuItems);
export const getGeneralMenueItems = createSelector(getMainMenuState, mainMenu.getGeneralMenuItems);
export const getGeneralAllMenueItems = createSelector(getMainMenuState, mainMenu.getGeneralAllMenuItems);
export const getPageInputDataByTargetToken = (token) => createSelector(getMainMenuState, mainMenu.getInputDataByTargetToken(token));
export const getRestOfOpenCaseMenuItemsById = (id) => createSelector(getMainMenuState, mainMenu.getRestOfOpenCaseMenuItemsById(id));
export const getOpenCaseMenuItemMatterDataById = (id) => createSelector(getMainMenuState, mainMenu.getOpenCaseMenuItemMatterDataById(id));

// export const getPopupState = createSelector(getLayoutRootState, (state) => state.popups);
// export const getPopupDesktopRoute = createSelector(getPopupState, popups.getDesktopRoute);
// export const getPopupInputDataByTargetToken = (token) => createSelector(getPopupState, popups.getInputDataByTargetToken(token));

export const getMenuItemById = (id) => createSelector(getMainMenuState, mainMenu.getMenuItemById(id));
export const getMenuItemByToken = (token) => createSelector(getMainMenuState, mainMenu.getMenuItemByToken(token));
export const getVisibleOutlet = createSelector(getMainMenuState, mainMenu.getVisibleOutlet);

export const getRightSidenavState = createSelector(getLayoutRootState, (state) => state.rightSidenav);
export const getRightSidenavModule = createSelector(getRightSidenavState, rightSidenav.getRightSidenavModule);
export const getRightSidenavIsOpend = createSelector(getRightSidenavState, rightSidenav.getRightSidenavIsOpend);
export const getDatabases = createSelector(getRightSidenavState, rightSidenav.getDatabases);
export const getTheme = createSelector(getRightSidenavState, rightSidenav.getTheme);
export const getDashBoardWidgetList = createSelector(getRightSidenavState, rightSidenav.getDashBoardWidgetList);
export const getItemActiveStateById = (id) => createSelector(getRightSidenavState, rightSidenav.getItemActiveStateById(id));
export const getMenuItemDisplayName = (id) =>  createSelector(getMainMenuState, mainMenu.getMenuItemDisplayName(id));


