import { ScreensContactTypeRequest } from './../models/interface';
import { MenuButtonClickType } from '../models/enums';

import { TimesFinancialFiguresResponse } from '../models/interface';
import { Action } from '@ngrx/store';
import { GridRowItemWrapper } from '../../matter-search-core/models/interfaces';
import { TokenizeAction } from '../../core';
import { TimesFinancialFiguresRequest } from '../models/requests';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { MatterShortcuts, WorkflowMenuMetaDataWrapper } from './../../workflow-menu-core';
import { Injector } from '@angular/core';

export const INIT_OPEN_CASE = 'INIT_OPEN_CASE';
export const INIT_OPEN_CASE_SUCCESS = 'INIT_OPEN_CASE_SUCCESS';
export const INIT_TAB_DATA = 'INIT_TAB_DATA';
export const INIT_TAB_DATA_SUCCESS = 'INIT_TAB_DATA_SUCCESS';
export const INIT_TAB_DATA_FAIL = 'INIT_TAB_DATA_FAIL';
export const GET_OPEN_CASE_ACCESS_DATA_WITH_CURRENT_STATE = 'GET_OPEN_CASE_ACCESS_DATA_WITH_CURRENT_STATE';
export const CHECK_OPEN_CASE_ACCESS = 'CHECK_OPEN_CASE_ACCESS_ACCESS';
export const GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MATTER_DATA = 'GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MATTER_DATA';
export const CHECK_OPEN_CASE_ACCESS_RESPONSE_SUCCESS = 'CHECK_OPEN_CASE_ACCESS_RESPONSE_SUCCESS';
export const CHECK_OPEN_CASE_ACCESS_RESPONS_FAIL = 'CHECK_OPEN_CASE_ACCESS_RESPONS_FAIL';
export const OPEN_CASE_TAB_CHANGE = 'OPEN_CASE_TAB_CHANGE';
export const OPEN_CASE_MATTER_DETAIL_RESPONSE_SUCCESS = 'OPEN_CASE_MATTER_DETAIL_RESPONSE_SUCCESS';
export const OPEN_CASE_MATTER_DETAIL_RESPONSE_FAILL = 'OPEN_CASE_MATTER_DETAIL_RESPONSE_FAILL';
export const OPEN_CASE_FILE_HISTORY_SERCHTEXT_CHANGE = 'OPEN_CASE_FILE_HISTORY_SERCHTEXT_CHANGE';
export const GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MAIL_SUBJECT = 'GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MAIL_SUBJECT';
export const OPEN_CASE_REFRESH_COUNT = 'OPEN_CASE_REFRESH_COUNT';
export const UPDATE_MATTER_HISTORY_ON_OPENCASE = 'UPDATE_MATTER_HISTORY_ON_OPENCASE';
export const OPEN_CASE_REFRESH = 'OPEN_CASE_REFRESH';

export const TIMES_FINANCIAL_FIGURES_LOAD = 'TIMES_FINANCIAL_FIGURES_LOAD';
export const TIMES_FINANCIAL_FIGURES_LOAD_SUCCESS = 'TIMES_FINANCIAL_FIGURES_LOAD_SUCCESS';
export const TIMES_FINANCIAL_FIGURES_LOAD_FAIL = 'TIMES_FINANCIAL_FIGURES_LOAD_FAIL';

export const MENU_BUTTON_TYPE = 'DPS_MENU_BUTTON_TYPE';
export const VIEW_MENU_PROPERTIES = 'DPS_VIEW_MENU_PROPERTIES';
export const OPEN_CASE_MENU_BUTTON_DISABLE = 'OPEN_CASE_MENU_BUTTON_DISABLE';

export const GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MATTER_DATA_SUCCESS = 'GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MATTER_DATA_SUCCESS';

export const CONTACT_TYPE_SCREENS_LOAD = 'CONTACT_TYPE_SCREENS_LOAD';
export const CONTACT_TYPE_SCREENS_LOAD_SUCCESS = 'CONTACT_TYPE_SCREENS_LOAD_SUCCESS';
export const CONTACT_TYPE_SCREENS_LOAD_FAIL = 'CONTACT_TYPE_SCREENS_LOAD_FAIL';

export const OPEN_WORK_FLOW_SCREEN = 'OPEN_WORK_FLOW_SCREEN';

export const LOAD_MENU_MATTER_SHORTCUT_KEYS = 'DPS_LOAD_MENU_MATTER_SHORTCUT_KEYS_IN_OPENCASE';
export const LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS = 'DPS_LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS_IN_OPENCASE';
export const LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL = 'DPS_LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL_IN_OPENCASE';
export const RUN_WORKFLOW_COMMAND = 'DPS_WORKFLOW_RUN_WORKFLOW_COMMAND_IN_OPENCASE';

export const LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK = 'LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK';
export const LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK_SUCCESS = 'LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK_SUCCESS';
export const LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK_FAIL = 'LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK_FAIL';

export const GET_MATTERS_BANNER_MESSAGES = 'DPS_GET_MATTERS_BANNER_MESSAGES';
export const GET_MATTERS_BANNER_MESSAGES_SUCCESS = 'GET_MATTERS_BANNER_MESSAGES_SUCCESS';
export const GET_MATTERS_BANNER_MESSAGES_FAIL = 'GET_MATTERS_BANNER_MESSAGES_FAIL';

export const CLOSE_MATTER_BANNER_MSG = 'DPS_CLOSE_MATTER_BANNER_MSG';

export class InitOpenCase extends TokenizeAction implements Action {
    readonly type = INIT_OPEN_CASE;
    constructor(public token: string, public openCaseMenueData: OpenCaseMenueData) {
        super(token);
    }
}
export class LoadSyncMatterClientToContactLink extends TokenizeAction implements Action {
    readonly type = LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadSyncMatterClientToContactLinkSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK_SUCCESS;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}
export class LoadSyncMatterClientToContactLinkFail extends TokenizeAction implements Action {
    readonly type = LOAD_SYNC_MATTER_CLIENT_TO_CONTACT_LINK_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class UpdateMatterHistoryOnOpencase extends TokenizeAction implements Action {
    readonly type = UPDATE_MATTER_HISTORY_ON_OPENCASE;
    constructor(public token: string, public payload: { matterInfo: GridRowItemWrapper }) {
        super(token);
    }
}
export class OpenCaseRefreshCount extends TokenizeAction implements Action {
    readonly type = OPEN_CASE_REFRESH_COUNT;
    constructor(public token: string, public payload: { refreshCount: number, matterRef: string }) {
        super(token);
    }
}
export class OpenFileHistoryCaseSearchText extends TokenizeAction implements Action {
    readonly type = OPEN_CASE_FILE_HISTORY_SERCHTEXT_CHANGE;
    constructor(public token: string, public payload: { fileHestorySerchText: string }) {
        super(token);
    }
}
export class InitOpenCaseSuccess extends TokenizeAction implements Action {
    readonly type = INIT_OPEN_CASE_SUCCESS;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}
export class GetOpenCaseAccessFromCurrentState extends TokenizeAction implements Action {
    readonly type = GET_OPEN_CASE_ACCESS_DATA_WITH_CURRENT_STATE;
    constructor(public token, public payload: { matterInfo: GridRowItemWrapper }) { super(token); }
}

export class GetOpenCaseAccessFromReqestFromMatterData extends TokenizeAction implements Action {
    readonly type = GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MATTER_DATA;
    constructor(public token, public payload: { matterInfo: GridRowItemWrapper }) { super(token); }
}

export class GetOpenCaseAccessFromReqestFromMatterDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MATTER_DATA_SUCCESS;
    constructor(public token, public payload: any) { super(token); }
}

export class GetOpenCaseAccessFromReqestFromMailSubject extends TokenizeAction implements Action {
    readonly type = GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MAIL_SUBJECT;
    constructor(public token, public payload: { mailSubject: string }) { super(token); }
}

export class CheckOpenCaseAccess extends TokenizeAction implements Action {
    readonly type = CHECK_OPEN_CASE_ACCESS;
    constructor(public token: string, public inputData: OpenCaseMenueData) {
        super(token);
    }
}


export class CheckOpenCaseAccessResponseSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_OPEN_CASE_ACCESS_RESPONSE_SUCCESS;
    constructor(public token: string, public payload: {
        validateResponce: any,
        clientDetailsResponce: any,
        isUsingFDResponce: any,
        matterInfo: GridRowItemWrapper,
        deleteEntrySecurityResponce: boolean
    }) {
        super(token);
    }
}
export class CheckOpenCaseAccessResponseFail extends TokenizeAction implements Action {
    readonly type = CHECK_OPEN_CASE_ACCESS_RESPONS_FAIL;
    constructor(public token: string, public payload: {
        validateResponce: any,
        clientDetailsResponce: any, matterInfo: GridRowItemWrapper
    }) {
        super(token);
    }
}

export class OpenCaseMaterDetailResponseSuccess extends TokenizeAction implements Action {
    readonly type = OPEN_CASE_MATTER_DETAIL_RESPONSE_SUCCESS;
    constructor(public token: string, public payload: {
        validateResponce: any,
        clientDetailsResponce: any, matterInfo: GridRowItemWrapper
    }) {
        super(token);
    }
}
export class OpenCaseMaterDetailResponseFaill extends TokenizeAction implements Action {
    readonly type = OPEN_CASE_MATTER_DETAIL_RESPONSE_FAILL;
    constructor(public token: string, public payload: { matterInfo: GridRowItemWrapper }) {
        super(token);
    }
}

export class InitTabData extends TokenizeAction implements Action {
    readonly type = INIT_TAB_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class InitTabDataSuccess extends TokenizeAction implements Action {
    readonly type = INIT_TAB_DATA_SUCCESS;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}
export class InitTabDataFail extends TokenizeAction implements Action {
    readonly type = INIT_TAB_DATA_FAIL;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}

export class OpenCaseTabChange extends TokenizeAction implements Action {
    readonly type = OPEN_CASE_TAB_CHANGE;
    constructor(public token: string, public payload: { selectedTab: string }) {
        super(token);
    }
}

export class TimesFinancialFigures extends TokenizeAction implements Action {
    readonly type = TIMES_FINANCIAL_FIGURES_LOAD;
    constructor(public token: string, public request: TimesFinancialFiguresRequest) { super(token); }
}

export class TimesFinancialFiguresSuccess extends TokenizeAction implements Action {
    readonly type = TIMES_FINANCIAL_FIGURES_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: TimesFinancialFiguresResponse }) {
        super(token);
    }
}

export class TimesFinancialFiguresFail extends TokenizeAction implements Action {
    readonly type = TIMES_FINANCIAL_FIGURES_LOAD_FAIL;
    constructor(public token: string, public payload: { response: TimesFinancialFiguresResponse }) {
        super(token);
    }
}

export class MenuButtpnClick extends TokenizeAction implements Action {
    readonly type = MENU_BUTTON_TYPE;
    constructor(public token: string, public payload: { buttonType: MenuButtonClickType }) {
        super(token);
    }
}
export class ViewPropertiesClick extends TokenizeAction implements Action {
    readonly type = VIEW_MENU_PROPERTIES;
    constructor(public token: string, public payload: { buttonType: MenuButtonClickType }) {
        super(token);
    }
}
export class OpenCaseWFButtonStatus extends TokenizeAction implements Action {
    readonly type = OPEN_CASE_MENU_BUTTON_DISABLE;
    constructor(public token: string) {
        super(token);
    }
}





export class ContactTypeScreensLoad extends TokenizeAction implements Action {
    readonly type = CONTACT_TYPE_SCREENS_LOAD;
    constructor(public token: string, public request: ScreensContactTypeRequest) { super(token); }
}

export class ContactTypeScreensLoadSuccess extends TokenizeAction implements Action {
    readonly type = CONTACT_TYPE_SCREENS_LOAD_SUCCESS;
    constructor(public token: string, public payload: { response: any }) {
        super(token);
    }
}
export class ContactTypeScreensLoadFail extends TokenizeAction implements Action {
    readonly type = CONTACT_TYPE_SCREENS_LOAD_FAIL;
    constructor(public token: string, public payload: { response: any }) {
        super(token);
    }
}
export class OpenWorkFlowScreen extends TokenizeAction implements Action {
    readonly type = OPEN_WORK_FLOW_SCREEN;
    constructor(public token: string, public payload: { screenId: string, appId: string, }) {
        super(token);
    }
}
export class OpenCaseRefresh extends TokenizeAction implements Action {
    readonly type = OPEN_CASE_REFRESH;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}
export class LoadMenuMatterShortCutKeys extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SHORTCUT_KEYS;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadMenuMatterShortCutKeysSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SHORTCUT_KEYS_SUCCESS;
    constructor(public token: string, public payload: { matterShortcuts: MatterShortcuts[] }) {
        super(token);
    }
}
export class LoadMenuMatterShortCutKeysFail extends TokenizeAction implements Action {
    readonly type = LOAD_MENU_MATTER_SHORTCUT_KEYS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class RunWorkflowCommand extends TokenizeAction implements Action {
    readonly type = RUN_WORKFLOW_COMMAND;
    constructor(public token: string, public injector: Injector, public menuInfo: WorkflowMenuMetaDataWrapper) {
        super(token);
    }
}
export class GetMattersBannerMessages extends TokenizeAction implements Action {
    readonly type = GET_MATTERS_BANNER_MESSAGES;
    constructor(public token: string, public request: any) { super(token); }
}
export class GetMattersBannerMessagesSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTERS_BANNER_MESSAGES_SUCCESS;
    constructor(public token: string, public payload: { response: any }) {
        super(token);
    }
}
export class GetMattersBannerMessagesFail extends TokenizeAction implements Action {
    readonly type = GET_MATTERS_BANNER_MESSAGES_FAIL;
    constructor(public token: string, public payload: { response: any }) {
        super(token);
    }
}
export class CloseMatterBannerMsg extends TokenizeAction implements Action {
    readonly type = CLOSE_MATTER_BANNER_MSG;
    constructor(public token: string) {
        super(token);
    }
}

export type Any = InitOpenCase | InitOpenCaseSuccess | OpenCaseTabChange | OpenFileHistoryCaseSearchText |
    CheckOpenCaseAccess | CheckOpenCaseAccessResponseSuccess | CheckOpenCaseAccessResponseFail |
    InitTabData | InitTabDataSuccess | InitTabDataFail | GetOpenCaseAccessFromReqestFromMatterData
    | OpenCaseMaterDetailResponseSuccess | OpenCaseMaterDetailResponseFaill | OpenCaseRefreshCount
    | TimesFinancialFiguresSuccess | TimesFinancialFiguresFail | TimesFinancialFigures | MenuButtpnClick | ViewPropertiesClick |
    OpenCaseWFButtonStatus | ContactTypeScreensLoad | ContactTypeScreensLoadSuccess | ContactTypeScreensLoadFail
    | OpenWorkFlowScreen | OpenCaseRefresh |
    LoadMenuMatterShortCutKeys | LoadMenuMatterShortCutKeysSuccess | LoadMenuMatterShortCutKeysFail | RunWorkflowCommand |
    LoadSyncMatterClientToContactLink | LoadSyncMatterClientToContactLinkSuccess | LoadSyncMatterClientToContactLinkFail
    | GetMattersBannerMessages | GetMattersBannerMessagesSuccess | GetMattersBannerMessagesFail | CloseMatterBannerMsg;
