import { DifferentFirstPage, DifferentPageHeaderFooter } from './../actions/core';
import { filter } from 'rxjs/operators';
import { PosingPeriod } from './../../setting-core/models/interface';

import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { PageSetupData, PageSetup, PageSetupResponce } from '../models/interfce';
import { PageSetupChangeKind } from '../models/enum';

export interface State {
    readonly [token: string]: PageSetupState;
}
export interface PageSetupState {
    readonly init: boolean;
    readonly dataLoading: boolean;
    readonly pageSetupData: PageSetupData;
    readonly changedPageSetupValue: PageSetup;
    readonly changedfirstPageSetupValue: PageSetup;
    readonly popupClose: boolean;
    readonly defferentFirstPage: boolean;
    readonly isDifferentPageHeaderFooter: boolean;
}
const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_PAGE_SETUP:
            temp[action.token] = setInitData(state[action.token], action.payload.inputData);
            return { ...state, ...temp };
        case Actions.GET_PAGE_SETUP_DATA:
            temp[action.token] = getPageSetupData(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_PAGE_SETUP_DATA_SUCCESS:
            temp[action.token] = setPageSetupData(state[action.token], action.payload.pageSetupData);
            return { ...state, ...temp };
        case Actions.GET_PAGE_SETUP_DATA_FAIL:
            temp[action.token] = getPageSetupFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.SET_CHANGE_PAGE_SETUP_VALUE:
            temp[action.token] = setChangeSetupValue(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.DIFFERENT_FIRST_PAGE:
            temp[action.token] = setFirstPageValue(state[action.token], action.defferentFirstPage);
            return { ...state, ...temp };
        case Actions.DIFFERENT_PAGE_HEADER_FOOTER:
            temp[action.token] = setPageHeaderFooterValue(state[action.token], action.defferentPageHeaderFooter);
            return { ...state, ...temp };
        case Actions.SAVE_PALGE_SETUP_CHANGES:
            temp[action.token] = savePageSetupData(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PALGE_SETUP_CHANGES_SUCCESS:
            temp[action.token] = savePageSetupDataSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PALGE_SETUP_CHANGES_FAIL:
            temp[action.token] = savePageSetupDataFail(state[action.token]);
            return { ...state, ...temp };
        default:
            { return state; }
    }
}
function setInitData(state: PageSetupState, inputData: any): Partial<PageSetupState> {
    if (!state) {
        return {
            ...state,
            init: true,
            dataLoading: false,
            popupClose: false,
            defferentFirstPage: false,
            isDifferentPageHeaderFooter: false,
            changedPageSetupValue: {
                topMargin: 0,
                bottomMargin: 0,
                leftMargin: 0,
                rightMargin: 0,
                gutter: 0,
                pageWidth: 0,
                pageHeight: 0,
                footerDistance: 0,
                headerDistance: 0,
            },
            changedfirstPageSetupValue: {
                topMargin: 0,
                bottomMargin: 0,
                leftMargin: 0,
                rightMargin: 0,
                gutter: 0,
                pageWidth: 0,
                pageHeight: 0,
                footerDistance: 0,
                headerDistance: 0,
            }
        };
    }
    return state;
}
function getPageSetupData(state: PageSetupState): Partial<PageSetupState> {
    return Object.freeze({
        ...state,
        dataLoading: true,
        popupClose: false,
    });
}
function setPageSetupData(state: PageSetupState, pageSetupData: PageSetupResponce): Partial<PageSetupState> {
    return Object.freeze({
        ...state,
        dataLoading: false,
        pageSetupData: pageSetupData,
        changedPageSetupValue: pageSetupData.otherPages,
        changedfirstPageSetupValue: pageSetupData.firstPage,
        defferentFirstPage: pageSetupData.firstPage === null ? true : false,
        isDifferentPageHeaderFooter: pageSetupData.firstPage !== null ? false : pageSetupData.differentFirstPageHeaderFooter
    });
}
function getPageSetupFail(state: PageSetupState): Partial<PageSetupState> {
    return Object.freeze({
        ...state
        , dataLoading: false
    });
}
function savePageSetupData(state: PageSetupState): Partial<PageSetupState> {
    return Object.freeze({
        ...state,
        dataLoading: true,
    });
}
function savePageSetupDataSuccess(state: PageSetupState): Partial<PageSetupState> {
    return Object.freeze({
        ...state,
        dataLoading: false,
        popupClose: true,
    });
}
function savePageSetupDataFail(state: PageSetupState): Partial<PageSetupState> {
    return Object.freeze({
        ...state,
        dataLoading: false,
    });
}
function setFirstPageValue(state: PageSetupState, defferentFirstPage): Partial<PageSetupState> {
    return Object.freeze({
        ...state,
        defferentFirstPage: defferentFirstPage,
        isDifferentPageHeaderFooter: defferentFirstPage === false ? false : state.isDifferentPageHeaderFooter,
    });
}
function setPageHeaderFooterValue(state: PageSetupState, defferentPageHeaderFooter): Partial<PageSetupState> {
    return Object.freeze({
        ...state,
        isDifferentPageHeaderFooter: defferentPageHeaderFooter,
    });
}
function setChangeSetupValue(state: PageSetupState, changeValue: {
    page: string,
    kind: PageSetupChangeKind, value: number
}): Partial<PageSetupState> {
    switch (changeValue.kind) {
        case PageSetupChangeKind.Top:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    topMargin: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.topMargin : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    topMargin: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.topMargin) ?
                            state.changedfirstPageSetupValue.topMargin : 0
                }
            };
        case PageSetupChangeKind.Bottom:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    bottomMargin: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0
                        : state.changedPageSetupValue ? state.changedPageSetupValue.bottomMargin : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    bottomMargin: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.bottomMargin) ?
                            state.changedfirstPageSetupValue.bottomMargin : 0
                }
            };
        case PageSetupChangeKind.Left:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    leftMargin: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.leftMargin : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    leftMargin: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.leftMargin) ?
                            state.changedfirstPageSetupValue.leftMargin : 0
                }
            };
        case PageSetupChangeKind.Right:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    rightMargin: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.rightMargin : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    rightMargin: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.rightMargin) ?
                            state.changedfirstPageSetupValue.rightMargin : 0
                }
            };
        case PageSetupChangeKind.Gutter:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    gutter: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.gutter : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    gutter: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.gutter) ?
                            state.changedfirstPageSetupValue.gutter : 0
                }
            };
        case PageSetupChangeKind.Width:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    pageWidth: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.pageWidth : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    pageWidth: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.pageWidth) ?
                            state.changedfirstPageSetupValue.pageWidth : 0
                }
            };
        case PageSetupChangeKind.Hight:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    pageHeight: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.pageHeight : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    pageHeight: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.pageHeight) ?
                            state.changedfirstPageSetupValue.pageHeight : 0
                }
            };
        case PageSetupChangeKind.Footer:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    footerDistance: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.footerDistance : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    footerDistance: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.footerDistance) ?
                            state.changedfirstPageSetupValue.footerDistance : 0
                }
            };
        case PageSetupChangeKind.Header:
            return {
                ...state,
                changedPageSetupValue: {
                    ...state.changedPageSetupValue,
                    headerDistance: changeValue.page === 'op' ? changeValue.value ? changeValue.value : 0 :
                        state.changedPageSetupValue ? state.changedPageSetupValue.headerDistance : 0
                },
                changedfirstPageSetupValue: {
                    ...state.changedfirstPageSetupValue,
                    headerDistance: changeValue.page === 'fp' && !state.defferentFirstPage ? changeValue.value :
                        (state.changedfirstPageSetupValue && state.changedfirstPageSetupValue.headerDistance) ?
                            state.changedfirstPageSetupValue.headerDistance : 0
                }
            };
        default: {
            return state;
        }
    }
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);

export const getPageSetupLoadingByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.dataLoading : null);
export const getPageSetupDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.pageSetupData : null);
export const getChangePageSetupValuesByToken = (token) => createSelector(getStateByToken(token),
    (state) => {
        const data = {

            firstPage: state.defferentFirstPage ? null : state.changedfirstPageSetupValue,
            otherPages: state.changedPageSetupValue ? state.changedPageSetupValue : null,
            differentFirstPageHeaderFooter: state.isDifferentPageHeaderFooter
        };
        return data;
    });
export const getPopupCloseByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.popupClose : false);
export const getfirstPageByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.defferentFirstPage : false);
export const getDifferentPageHeaderFooterByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.isDifferentPageHeaderFooter : false);

