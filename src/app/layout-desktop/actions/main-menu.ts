import { OpenCaseMenueData } from '../../core/lib/open-case';
import { Action } from '@ngrx/store';
import { MainMenuItem, DPSFilesToMailAttachmentRequestViewModel } from '../models/interfaces';
import { ActivatedRoute } from '@angular/router';
import { RouterOutlets } from '../models/enums';
import { TokenizeAction } from '../../core';
import { Observable } from 'rxjs';
import { Matter } from '../../matter-creation-core/models/interfaces';
import { ScreenEditComponentTreeData } from './../../core/lib/screen-edit';
import { Module } from '../../core/lib/app-settings';

export const MAIN_MENU_TOGGLE = 'DPS_MAIN_MENU_TOGGLE';
export const MAIN_MENU_ITEM_CLICK = 'DPS_MAIN_MENU_ITEM_CLICK';
export const APPEND_TO_MAIN_MENU = 'DPS_APPEND_TO_MAIN_MENU';

export const REMOVE_FROM_MAIN_MENU = 'DPS_REMOVE_FROM_MAIN_MENU';

export const GO_TO_OPEN_CASE_PAGE = 'GO_TO_OPEN_CASE_PAGE';
export const ADD_OPEN_CASE_INPUT_DATA = 'ADD_OPEN_CASE_INPUT_DATA';


export const GO_TO_NEXT_OPEN_CASE_TAB = 'GO_TO_NEXT_OPEN_CASE_TAB';
export const GO_TO_NEXT_OPEN_CASE_TAB_SUCCESS = 'GO_TO_NEXT_OPEN_CASE_TAB_SUCCESS';
export const GO_TO_DASH_BOARD = 'GO_TO_DASH_BOARD';
export const GO_TO_DASH_BOARD_SUCCESS = 'GO_TO_DASH_BOARD_SUCCESS';

export const GO_TO_MATTER_POPUP = 'GO_TO_MATTER_POPUP';
export const ADD_TO_VIEW_STACK = 'DPS_MAIN_MENU_ADD_TO_VIEW_STACK';
export const POP_FROM_VIEW_STACK = 'DPS_MAIN_MENY_POPFROM_VIEW_STACK';

export const NAVIGATE_TO_VIEW = 'DPS_NAVIGATE_TO_MAIN_MENU_ITEM';
export const NAVIGATE_BY_ROUTE = 'DPS_NAVIGATE_BY_ROUTE';
export const NAVIGATE_TO_HOME = 'DPS_NAVIGATE_TO_HOME';
export const NAVIGATE_TO_HOME_AND_CLEAR_ROUTE = 'DPS_NAVIGATE_TO_HOME_AND_CLEAR_ROUTE';

export const UPDATE_MENU_ITEM = 'DPS_MAIN_MENU_UPDATE_ITEMS';

export const ATTACHED_TO_MATTER_AND_OPEN_MAIL_POPUP = 'ATTACHED_TO_MATTER_AND_OPEN_MAIL_POPUP';
export const OPEN_MAIL_POPUP = 'OPEN_MAIL_POPUP';
export const OPEN_MAIL_POPUP_SUCCESS = 'OPEN_MAIL_POPUP_SUCCESS';
export const OPEN_MAIL_POPUP_FAIL = 'OPEN_MAIL_POPUP_FAIL';
export const RUN_EXIT_LOGIC_AND_CLOSE = 'DPS_RUN_EXIT_LOGIC_AND_CLOSE';
export const FILE_EXIT_LOGIC_COMPLETE = 'DPS_FILE_EXIT_LOGIC_COMPLETE';

export const GET_MENU_OPEN_CASE_DATA = 'GET_MENU_OPEN_CASE_DATA';
export const GET_MENU_OPEN_CASE_DATA_SUCCSESS = 'GET_MENU_OPEN_CASE_DATA_SUCCSESS';
export const GET_MENU_OPEN_CASE_DATA_FAIL = 'GET_MENU_OPEN_CASE_DATA_FAIL';

export const GET_MENU_ITEM = 'GET_MENU_ITEM';
export const GET_MENU_ITEM_SUCCESS = 'GET_MENU_ITEM_SUCCESS';
export const GET_MENU_ITEM_FAIL = 'GET_MENU_ITEM_FAIL';

export const MENU_ITEM_OPEN_CASE_MATTER_DATILS_UPDATE = 'MENU_ITEM_OPEN_CASE_MATTER_DATILS_UPDATE';

export const GET_POSTCODE_COUNT = 'GET_POSTCODE_COUNT';
export const GET_POSTCODE_COUNT_SUCCESS = 'GET_POSTCODE_COUNT_SUCCESS';
export const GET_POSTCODE_COUNT_FAIL = 'GET_POSTCODE_COUNT_FAIL';

export const GET_MODULE_INFOMATION_SUCCESS = 'GET_MODULE_INFOMATION_SUCCESS';


export class GetMenuOpenCaseData implements Action {
  readonly type = GET_MENU_OPEN_CASE_DATA;
  constructor(public payload: { mailSubject: string, diaryId: number }) { }
}

export class MenuItemOpenCaseMatterDatilsUpdate implements Action {
  readonly type = MENU_ITEM_OPEN_CASE_MATTER_DATILS_UPDATE;
  constructor(public payload: { matter: Matter }) {

  }
}

export class GetMenuOpenCaseDataSuccsess implements Action {
  readonly type = GET_MENU_OPEN_CASE_DATA_SUCCSESS;
  constructor(public payload: { inputData: OpenCaseMenueData }) { }
}
export class GetMenuOpenCaseDataFail implements Action {
  readonly type = GET_MENU_OPEN_CASE_DATA_FAIL;
  constructor(public payload: any) { }
}
export class GetMenuItem implements Action {
  readonly type = GET_MENU_ITEM;
  constructor() { }
}
export class GetMenuItemSuccess implements Action {
  readonly type = GET_MENU_ITEM_SUCCESS;
  constructor(public MenuItem: ScreenEditComponentTreeData[]) { }
}
export class GetMenuItemFail implements Action {
  readonly type = GET_MENU_ITEM_FAIL;
  constructor() { }
}

export class GetPostCodeCount implements Action {
  readonly type = GET_POSTCODE_COUNT;
  constructor() {

  }
}

export class GetPostCodeCountSuccess implements Action {
  readonly type = GET_POSTCODE_COUNT_SUCCESS;
  constructor(public payload: { count: number }) {
  }
}

export class GetPostCodeCountFail implements Action {
  readonly type = GET_POSTCODE_COUNT_FAIL;
  constructor() {

  }
}

export class GoToMatterPopup implements Action {
  readonly type = GO_TO_MATTER_POPUP;
  constructor() {
    console.log('GO_TO_MATTER_POPUP');
  }
}

export class MainMenuToggle implements Action {
  readonly type = MAIN_MENU_TOGGLE;
  constructor(public paylod: { kind: string }) { }
}

export class MenuItemClick<Data> implements Action {
  readonly type = MAIN_MENU_ITEM_CLICK;
  constructor(public item: MainMenuItem<Data>, public parentRoute: ActivatedRoute) { }
}

export class NavigateToView implements Action {
  readonly type = NAVIGATE_TO_VIEW;
  constructor(public menuId: string, public parentRoute: ActivatedRoute) { }
}

export class NavigateToHome implements Action {
  readonly type = NAVIGATE_TO_HOME;
  constructor() { }
}

export class NavigateToHomeAndClearRoute implements Action {
  readonly type = NAVIGATE_TO_HOME_AND_CLEAR_ROUTE;
  constructor() { }
}

export class NavigateByRoute implements Action {
  readonly type = NAVIGATE_BY_ROUTE;
  constructor(public routeLink: any, public parentRoute: ActivatedRoute) { }
}

export class GoToNextOpenCaseTab implements Action {
  readonly type = GO_TO_NEXT_OPEN_CASE_TAB;
  constructor(public OpenCase: OpenCaseMenueData) {
    console.log('GO_TO_NEXT_OPEN_CASE_TAB*');
  }
}
export class GoToNextOpenCaseTabSuccess implements Action {
  readonly type = GO_TO_NEXT_OPEN_CASE_TAB_SUCCESS;
  constructor() {
    console.log('GO_TO_NEXT_OPEN_CASE_TAB_SUCCESS*');
  }
}
export class GoToDashBoard implements Action {
  readonly type = GO_TO_DASH_BOARD;
  constructor() {
    console.log('GO_TO_DASH_BOARD');
  }
}

export class GoToDashBoardSuccess implements Action {
  readonly type = GO_TO_DASH_BOARD_SUCCESS;
  constructor() {
    console.log('GO_TO_DASH_BOARD_SUCCESS');
  }
}

export class AppendToMainMenu implements Action {
  readonly type = APPEND_TO_MAIN_MENU;
  constructor(public payload: { item: MainMenuItem<any> }) { }
}

export class RemoveFromMainMenu implements Action {
  readonly type = REMOVE_FROM_MAIN_MENU;
  constructor(public payload: { id: string }) { }
}

export class UpdateMenuItem implements Action {
  readonly type = UPDATE_MENU_ITEM;
  constructor(public itemId: string, public item: Partial<MainMenuItem<any>>) { }
}

// open a page
export class GoToOpenCasePage implements Action {
  readonly type = GO_TO_OPEN_CASE_PAGE;
  constructor(public inputData: OpenCaseMenueData) { }
}
export class AddOpenCaseInputData implements Action {
  readonly type = ADD_OPEN_CASE_INPUT_DATA;
  constructor(public inputData: OpenCaseMenueData) { }
}

export class AddToViewStack {
  readonly type = ADD_TO_VIEW_STACK;
  constructor(public outlet: RouterOutlets) { }
}

export class PopFromViewStack {
  readonly type = POP_FROM_VIEW_STACK;
  constructor(public outlet: RouterOutlets) { }
}

export class OpenMailPopup extends TokenizeAction implements Action {
  readonly type = OPEN_MAIL_POPUP;
  constructor(public token: string, public payload: { draftIdRequest: DPSFilesToMailAttachmentRequestViewModel }) {
    super(token);
  }
}

export class AttachedToMatterAndOpenMailPopup extends TokenizeAction implements Action {
  readonly type = ATTACHED_TO_MATTER_AND_OPEN_MAIL_POPUP;
  constructor(public token: string, public payload: { draftIdRequest: DPSFilesToMailAttachmentRequestViewModel }) {
    super(token);
  }
}

export class OpenMailPopupSuccess extends TokenizeAction implements Action {
  readonly type = OPEN_MAIL_POPUP_SUCCESS;
  constructor(public token: string) {
    super(token);
  }
}

export class OpenMailPopupFail extends TokenizeAction implements Action {
  readonly type = OPEN_MAIL_POPUP_FAIL;
  constructor(public token: string, public payload: { error: string }) {
    super(token);
  }
}

export class RunExitLogicAndClose implements Action {
  readonly type = RUN_EXIT_LOGIC_AND_CLOSE;
  constructor(public item: MainMenuItem<OpenCaseMenueData>, public nextIndex: number) { }
}

export class FileExitLogicComplete implements Action {
  readonly type = FILE_EXIT_LOGIC_COMPLETE;
  constructor(public appId: number, public fileId: number, public branchId: number, public next: Observable<any>) { }
}

// export class ModuleInformation implements Action {
//   readonly type = GET_MODULE_INFOMATION;
//   constructor() { }
// }

export class ModuleInformationSuccess implements Action {
  readonly type = GET_MODULE_INFOMATION_SUCCESS;
  constructor(public hiddenModule: Module[]) { }
}


export type Any = MainMenuToggle | GoToOpenCasePage | AddOpenCaseInputData |
  GoToNextOpenCaseTab | GoToDashBoard | GoToNextOpenCaseTabSuccess
  | GoToDashBoardSuccess | PopFromViewStack | AddToViewStack | AppendToMainMenu | UpdateMenuItem |
  RemoveFromMainMenu | MenuItemClick<any>
  | OpenMailPopup | OpenMailPopupSuccess | OpenMailPopupFail | AttachedToMatterAndOpenMailPopup | NavigateToHomeAndClearRoute
  | GetMenuOpenCaseData | GetMenuOpenCaseDataSuccsess | GetMenuOpenCaseDataFail
  | GetMenuItem | GetMenuItemSuccess | GetMenuItemFail | MenuItemOpenCaseMatterDatilsUpdate
  | GetPostCodeCount | GetPostCodeCountSuccess | GetPostCodeCountFail | RunExitLogicAndClose
  | ModuleInformationSuccess;


