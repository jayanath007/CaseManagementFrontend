import { MenuButtonClickType } from '../models/enums';
import { ScreensContactType, BannerMsgResponce, TimesFinancialFigure } from '../models/interface';
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import * as Core from '../../core/lib/actions';
import { TimesFinancialFiguresResponse } from '../models/interface';
import { MatterShortcuts } from './../../workflow-menu-core/';

export interface State {
    readonly [token: string]: OpenCaseState;
}

export interface OpenCaseState {
    readonly loading: boolean;
    readonly openCaseIsAccess: boolean;
    readonly initialDataLoaded: boolean;
    readonly validateResponce: any;
    readonly clientDetailsResponce: any;
    readonly isUsingFDResponce: any;
    readonly showFDFigures: boolean;
    readonly selectedTab: string;
    readonly fileHestorySerchText: string;
    readonly displayText: string;
    readonly menuText: string;
    readonly hedingText: string;
    readonly mailSubjectText: string;
    readonly refreshCount: number;
    readonly matterInfo: GridRowItemWrapper;
    readonly fdDetails: TimesFinancialFigure;
    readonly deleteEntrySecurityResponce: any;
    readonly menuButtonType: MenuButtonClickType;
    readonly menuPropertyButtonClick: boolean;
    readonly openCaseWFButtonDisable: boolean;
    readonly screensContactTypeList: ScreensContactType[];
    readonly screensContactTypeLoding: boolean;
    readonly menuMatterShortcuts: MatterShortcuts[];
    readonly isShortCutKeyLoading: boolean;

    readonly matterBannerMsg: string;
    readonly isCloseMatterBanner: boolean;
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any | Core.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_OPEN_CASE:
            temp[action.token] = getInitOpenCase(state[action.token], action.openCaseMenueData);
            return { ...state, ...temp };
        case Actions.INIT_OPEN_CASE_SUCCESS:
            temp[action.token] = getInitOpenCaseSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHECK_OPEN_CASE_ACCESS:
            temp[action.token] = getCheckOpenCaseAccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHECK_OPEN_CASE_ACCESS_RESPONSE_SUCCESS:
            temp[action.token] = getCheckOpenCaseAccessSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHECK_OPEN_CASE_ACCESS_RESPONS_FAIL:
            temp[action.token] = getCheckOpenCaseAccessFail(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.OPEN_CASE_TAB_CHANGE:
            temp[action.token] = setOpenCaseTabCagange(state[action.token], action.payload.selectedTab);
            return { ...state, ...temp };
        case Actions.OPEN_CASE_FILE_HISTORY_SERCHTEXT_CHANGE:
            temp[action.token] = setOpenCaseFileHestorySerchText(state[action.token], action.payload.fileHestorySerchText);
            return { ...state, ...temp };
        case Actions.OPEN_CASE_REFRESH_COUNT:
            temp[action.token] = setOpenCaseRefeshCount(state[action.token], action.payload.refreshCount);
            return { ...state, ...temp };
        case Core.MENU_TAB_CLOSE:
            const token = action.payload.item.data.token;
            // temp[token] = setOpenCaseOpenCaseIsAccess(state[token]);
            const newState: any = { ...state };
            delete newState[token];
            return { ...newState };
        case Actions.TIMES_FINANCIAL_FIGURES_LOAD_SUCCESS:
            temp[action.token] = setOpenCaseFdValues(state[action.token], action.payload.response);
            return { ...state, ...temp };
        case Actions.TIMES_FINANCIAL_FIGURES_LOAD_FAIL:
            temp[action.token] = setOpenCaseErrorFdValues(state[action.token]);
            return { ...state, ...temp };
        case Actions.MENU_BUTTON_TYPE:
            temp[action.token] = setMenuButtonClickType(state[action.token], action.payload.buttonType);
            return { ...state, ...temp };
        case Actions.VIEW_MENU_PROPERTIES:
            temp[action.token] = propertiesButtonClick(state[action.token], action.payload.buttonType);
            return { ...state, ...temp };
        case Actions.OPEN_CASE_MENU_BUTTON_DISABLE:
            temp[action.token] = setMenuButtonStatus(state[action.token]);
            return { ...state, ...temp };

        case Actions.CONTACT_TYPE_SCREENS_LOAD:
            temp[action.token] = setScreensContactTypeLoding(state[action.token], false);
            return { ...state, ...temp };

        case Actions.CONTACT_TYPE_SCREENS_LOAD_SUCCESS:
            temp[action.token] = setScreensContactTypeList(state[action.token], action.payload.response);
            return { ...state, ...temp };

        case Actions.CONTACT_TYPE_SCREENS_LOAD_FAIL:
            temp[action.token] = setScreensContactTypeLoding(state[action.token], true);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SHORTCUT_KEYS:
            temp[action.token] = loadMatterShortCutKeys(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS:
            temp[action.token] = loadMatterShortCutKeysSuccess(state[action.token], action.payload.matterShortcuts);
            return { ...state, ...temp };
        case Actions.LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL:
            temp[action.token] = loadMatterShortCutKeysFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.GET_MATTERS_BANNER_MESSAGES:
            temp[action.token] = setMatterBannerMsg(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_MATTERS_BANNER_MESSAGES_SUCCESS:
            temp[action.token] = setMatterBannerMsgSuccess(state[action.token], action.payload.response);
            return { ...state, ...temp };
        case Actions.GET_MATTERS_BANNER_MESSAGES_FAIL:
            temp[action.token] = setMatterBannerMsgFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CLOSE_MATTER_BANNER_MSG:
            temp[action.token] = closeBanner(state[action.token]);
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function setScreensContactTypeList(state: OpenCaseState, screensContactTypeList: ScreensContactType[]): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        screensContactTypeList: screensContactTypeList,
        screensContactTypeLoding: false
    });
}

function setScreensContactTypeLoding(state: OpenCaseState, screensContactTypeLoding: boolean): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        screensContactTypeLoding: screensContactTypeLoding
    });
}


function setMenuButtonStatus(state: OpenCaseState): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        openCaseWFButtonDisable: false
    });
}
function propertiesButtonClick(state: OpenCaseState, data: MenuButtonClickType): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        menuPropertyButtonClick: !state.menuPropertyButtonClick,
    });
}
function setMenuButtonClickType(state: OpenCaseState, data: MenuButtonClickType): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        menuButtonType: data,
    });
}

function getInitOpenCase(state: OpenCaseState, openCaseMenueData: OpenCaseMenueData): Partial<OpenCaseState> {
    if (!state.initialDataLoaded) {
        return Object.freeze({
            ...state, loading: true, initialDataLoaded: true,
            selectedTab: 'file-history', openCaseIsAccess: true,
            fileHestorySerchText: '',
            menuButtonType: MenuButtonClickType.ViewFileHistoy,
            menuPropertyButtonClick: false,
            openCaseWFButtonDisable: true,
            matterInfo: openCaseMenueData.matterData,
            isCloseMatterBanner: false,
            matterBannerMsg: null
        });
    }
    return Object.freeze({
        ...state,
        matterInfo: openCaseMenueData.matterData,
    });
}
function setOpenCaseFdValues(state: OpenCaseState, data: TimesFinancialFiguresResponse): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        fdDetails: data.data
    });
}

function setOpenCaseErrorFdValues(state: OpenCaseState): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        fdDetails: null,
    });
}

function setOpenCaseOpenCaseIsAccess(state: OpenCaseState): Partial<OpenCaseState> {
    return Object.freeze({
        ...state,
        openCaseIsAccess: false,
    });
}


function setOpenCaseTabCagange(state: OpenCaseState, selectedTab: string): Partial<OpenCaseState> {
    return Object.freeze({ ...state, selectedTab: selectedTab });
}

function setOpenCaseFileHestorySerchText(state: OpenCaseState, fileHestorySerchText: string): Partial<OpenCaseState> {
    return Object.freeze({ ...state, fileHestorySerchText: fileHestorySerchText });
}
function setOpenCaseRefeshCount(state: OpenCaseState, refreshCount: number): Partial<OpenCaseState> {
    let count = 1;
    if (refreshCount > 0) {
        count = refreshCount;
    } else if (state.refreshCount) {
        count = state.refreshCount + 1;
    }
    return Object.freeze({ ...state, refreshCount: count });
}



function getInitOpenCaseSuccess(state: OpenCaseState, payload): Partial<OpenCaseState> {
    return Object.freeze({ ...state, loading: false });
}

function getCheckOpenCaseAccess(state: OpenCaseState): Partial<OpenCaseState> {
    return Object.freeze({ ...state });
}

function getCheckOpenCaseAccessSuccess(state: OpenCaseState, payload: any): Partial<OpenCaseState> {
    const displayVar1 = payload.clientDetailsResponce.data.displayVar1;
    const displayVar2 = payload.clientDetailsResponce.data.displayVar2;
    const displayVar3 = payload.clientDetailsResponce.data.displayVar3;
    const displayVar4 = payload.clientDetailsResponce.data.displayVar4;
    const appCode = payload.matterInfo.data.app_Code;
    const fileId = payload.matterInfo.data.fileID;
    const branchId = payload.matterInfo.data.branchID;

    const hedingText = getClientDetailsText(displayVar1, displayVar2, displayVar3, displayVar4, appCode, fileId);
    const mailSubjectText = mailSubjectString(branchId, appCode, fileId);

    return Object.freeze({
        ...state,
        validateResponce: payload.validateResponce,
        clientDetailsResponce: payload.clientDetailsResponce,
        matterInfo: payload.matterInfo,
        hedingText: hedingText,
        mailSubjectText: mailSubjectText,
        isUsingFDResponce: payload.isUsingFDResponce,
        showFDFigures: payload.isUsingFDResponce.data,
        deleteEntrySecurityResponce: payload.deleteEntrySecurityResponce
    });
}

function getCheckOpenCaseAccessFail(state: OpenCaseState, payload): Partial<OpenCaseState> {
    return Object.freeze({
        ...state, openCaseIsAccess: false, validateResponce: payload.validateResponce,
    });
}

function loadMatterShortCutKeys(state: OpenCaseState) {
    return {
        ...state,
        isShortCutKeyLoading: true
    };
}
function loadMatterShortCutKeysSuccess(state: OpenCaseState, menuMatterShortcuts: MatterShortcuts[]) {
    return {
        ...state,
        menuMatterShortcuts: menuMatterShortcuts,
        isShortCutKeyLoading: true
    };
}
function loadMatterShortCutKeysFail(state: OpenCaseState) {
    return {
        ...state,
        isShortCutKeyLoading: false
    };
}

function setMatterBannerMsg(state: OpenCaseState) {
    return {
        ...state,
        // isShortCutKeyLoading: true
    };
}
function setMatterBannerMsgSuccess(state: OpenCaseState, bannerMsg: BannerMsgResponce[]) {

    let finalString = '';

    if (bannerMsg && bannerMsg.length > 0) {
        finalString = '***';
        for (const item of bannerMsg) {
            finalString += item.message + '';
        }

    }

    return {
        ...state,
        matterBannerMsg: finalString,


        // isShortCutKeyLoading: true
    };
}
function setMatterBannerMsgFail(state: OpenCaseState) {
    return {
        ...state,
        //   isShortCutKeyLoading: false
    };
}

function closeBanner(state: OpenCaseState) {
    return {
        ...state,
        isCloseMatterBanner: true
    };
}




export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => {
    if (views[token]) {
        return views[token];
    }
});

export const getOpenCaseValidateInforByToken = (token) =>
    createSelector(getViewByToken(token),
        (openCaseState) => {
            if (openCaseState) {
                return { openCaseIsAccess: openCaseState.openCaseIsAccess, validateResponce: openCaseState.validateResponce };
            }
        });
// (openCaseState) => {
//     return { openCaseIsAccess: openCaseState.openCaseIsAccess, validateResponce: openCaseState.validateResponce };
// });


export const getOpenCaseSelectedTab = (token) =>
    createSelector(getViewByToken(token),
        (openCaseState) => {
            if (openCaseState) {
                return openCaseState.selectedTab;
            }
        });


export const getMatterShortCutList = (token) =>
    createSelector(getViewByToken(token),
        (openCaseState) => {
            if (openCaseState) {
                return openCaseState.menuMatterShortcuts;
            }
        });

export const getOpenCaseIsAccess = (token) =>
    createSelector(getViewByToken(token),
        (openCaseState) => {
            if (openCaseState) {
                return openCaseState.openCaseIsAccess;
            }
        });
// (openCaseState) => openCaseState.openCaseIsAccess);

export const getOpenCaseFileHistorySearchText = (token) =>
    createSelector(getViewByToken(token),

        (openCaseState) => {
            if (openCaseState) {
                return openCaseState.fileHestorySerchText;
            }
        });
// (openCaseState) => openCaseState.fileHestorySerchText);

export const getOpenCaseFdDetails = (token) =>
    createSelector(getViewByToken(token),
        (openCaseState) => {
            if (openCaseState) {
                return openCaseState.fdDetails;
            }
        });

export const getOpenCaseShowFDFigures = (token) =>
    createSelector(getViewByToken(token),

        (openCaseState) => {
            if (openCaseState) {
                return openCaseState.showFDFigures;
            }
        });

export const getOpenCaseRefreshCount = (token) =>
    createSelector(getViewByToken(token),
        (openCaseState) => {
            if (openCaseState) {
                return openCaseState.refreshCount;
            }
        });
// (openCaseState) => openCaseState.refreshCount);

export const getOpenCaseMatterInfo = (token) =>
    createSelector(getViewByToken(token), (openCaseState) => {
        if (openCaseState) {
            return openCaseState.matterInfo;
        }
    });
export const getOpenCaseHedingText = (token) =>
    createSelector(getViewByToken(token), (openCaseState) => {
        if (openCaseState) {
            return openCaseState.hedingText;
        }
    });
export const getOpenCaseShowDeleteEntrySecurityInfo = (token) =>
    createSelector(getViewByToken(token), (openCaseState) => {
        if (openCaseState) {
            return openCaseState.deleteEntrySecurityResponce;
        }
    });
export const getSelectedMenuButtonType = (token) =>
    createSelector(getViewByToken(token), (openCaseState) => {
        if (openCaseState) {
            return openCaseState.menuButtonType;
        }
    });
export const getPropertyButtonClick = (token) =>
    createSelector(getViewByToken(token), (openCaseState) => {
        if (openCaseState) {
            return openCaseState.menuPropertyButtonClick;
        }
    });
export const getWFButtonStatus = (token) =>
    createSelector(getViewByToken(token)
        , (openCaseState) => {
            if (openCaseState) {
                return openCaseState.openCaseWFButtonDisable;
            }
        });
export const getMatterInfoByToken = (token) =>
    createSelector(getViewByToken(token)
        , (openCaseState) => {
            if (openCaseState && openCaseState.matterInfo) {
                return openCaseState.matterInfo.data;
            }
        });
export const getMatterBannerMsgByToken = (token) =>
    createSelector(getViewByToken(token)
        , (openCaseState) => {
            if (openCaseState && openCaseState.matterInfo) {
                return openCaseState.matterBannerMsg;
            }
        });
export const getIsCloseBannerByToken = (token) =>
    createSelector(getViewByToken(token)
        , (openCaseState) => {
            if (openCaseState) {
                return openCaseState.isCloseMatterBanner;
            }
        });
export const getScreensContactTypeListByToken = (token) =>
    createSelector(getViewByToken(token)
        , (openCaseState) => {
            if (openCaseState && openCaseState.screensContactTypeList) {
                return openCaseState.screensContactTypeList;
            }
        });
export const getOpenCaseMenuData = (token) =>
    createSelector(getViewByToken(token), (state) => {
        if (state && state.clientDetailsResponce) {
            const displayVar1 = state.clientDetailsResponce.data.displayVar1;
            const displayVar2 = state.clientDetailsResponce.data.displayVar2;
            const displayVar3 = state.clientDetailsResponce.data.displayVar3;
            const displayVar4 = state.clientDetailsResponce.data.displayVar4;
            const appCode = state.matterInfo.data.app_Code;
            const fileId = state.matterInfo.data.fileID;
            const mouseOverText = getMenueMouseOverText(displayVar1, displayVar2, displayVar3, displayVar4, appCode, fileId);
            const data: OpenCaseMenueData = {
                token: token,
                matterReferenceNo: state.matterInfo.data.matterReferenceNo,
                mouseOverText: mouseOverText,
                menuDisplayText1: displayVar1,
                menuDisplayText2: appCode,
                menuDisplayText3: '(' + fileId + ')',
                matterData: state.matterInfo,
            };
            return data;
        }
    });

function getMenueMouseOverText(displayVar1, displayVar2, displayVar3, displayVar4, AppCode: string, FileID: number): string {

    let clientDetails = 'Tab';
    let symbleNoNeed = false;
    if (displayVar1) {
        if (displayVar2) {
            if (displayVar3) {
                clientDetails = displayVar1 + ' - ' + displayVar2 + ' - ' + displayVar3;
            } else {
                clientDetails = displayVar1 + ' - ' + displayVar2;
            }
        } else {
            if (displayVar3) {
                clientDetails = displayVar1 + ' - ' + displayVar3;
            } else {
                clientDetails = displayVar1;
            }
        }
    } else {
        if (displayVar2) {
            if (displayVar3) {
                clientDetails = displayVar2 + ' - ' + displayVar3;
            } else {
                clientDetails = displayVar2;
            }
        } else {
            if (displayVar3) {
                clientDetails = displayVar3;
            } else {
                clientDetails = AppCode + '(' + FileID + ')';
                symbleNoNeed = true;
            }
        }
    }
    if (displayVar4) {
        if (symbleNoNeed) {
            clientDetails = clientDetails + ' ' + displayVar4;
        } else {
            clientDetails = clientDetails + ' - ' + displayVar4;
        }
    }
    return clientDetails;
}

function getClientDetailsText(displayVar1, displayVar2, displayVar3, displayVar4, AppCode, FileID): string {
    let clientDetails = 'Tab';
    let symbleNoNeed = false;
    if (displayVar1) {
        if (displayVar2) {
            if (displayVar3) {
                clientDetails = AppCode + '(' + FileID + ')' + ' ' + displayVar1 + ' - ' + displayVar2 + ' - ' + displayVar3;
            } else {
                clientDetails = AppCode + '(' + FileID + ')' + ' ' + displayVar1 + ' - ' + displayVar2;
            }
        } else {
            if (displayVar3) {
                clientDetails = AppCode + '(' + FileID + ')' + ' ' + displayVar1 + ' - ' + displayVar3;
            } else {
                clientDetails = AppCode + '(' + FileID + ')' + ' ' + displayVar1;
            }
        }
    } else {
        if (displayVar2) {
            if (displayVar3) {
                clientDetails = AppCode + '(' + FileID + ')' + ' ' + displayVar2 + ' - ' + displayVar3;
            } else {
                clientDetails = AppCode + '(' + FileID + ')' + ' ' + displayVar2;
            }
        } else {
            if (displayVar3) {
                clientDetails = AppCode + '(' + FileID + ')' + ' ' + displayVar3;
            } else {
                clientDetails = AppCode + '(' + FileID + ')';
                symbleNoNeed = true;
            }
        }
    }
    if (displayVar4) {
        if (symbleNoNeed) {
            clientDetails = clientDetails + ' ' + displayVar4;
        } else {
            clientDetails = clientDetails + ' - ' + displayVar4;
        }
    }
    return clientDetails;
}

function mailSubjectString(BranchID, AppCode, FileID): string {
    return '(DPS:' + BranchID + ':' + AppCode + ':' + FileID + ')';
}




