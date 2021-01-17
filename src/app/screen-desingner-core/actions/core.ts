import { ExportScreenDesignerRequest, ExportScreenDesignerResponse, ScreenLogic } from '../models/screen-desingner-request';
import { ScreenContanerComponent } from '../../screen-view-core/models/screen-contaner-component';
import { ScreenDesingnerInitials } from '../../core/lib/screen-desingner';
import { FormView } from '../reducers/screen-desingner';

import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import {
    ScreenDesingnerRequest, ScreenDesingnerRequestViewModel,
    MainStateRequest, MainStateResponse, ScreenDesingnerResponse, SaveScreenDesignerRequest, SaveScreenDesignerResponse
} from '../models/screen-desingner-request';
import { ScreenDefinition } from '../../screen-view-core/models/screen-definition';
export const INIT_SCREEN_DESIGNER = 'INIT_SCREEN_DESIGNER';
export const SCREEN_DESIGNER_FORM_VIEW_CHANGE = 'SCREEN_DESIGNER_FORM_VIEW_CHANGE';

export const LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA = 'LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA';
export const LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA_SUCCESS = 'LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA_SUCCESS';
export const LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA_FAIL = 'LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA_FAIL';
export const LOAD_SCREEN_DESIGN_FORM_VIEW_LIST_DATA = 'LOAD_SCREEN_DESIGN_FORM_VIEW_LIST_DATA';
export const LOAD_SCREEN_DESIGNER_LIST_SUCCESS = 'LOAD_SCREEN_DESIGNER_LIST_SUCCESS';
export const LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL = 'LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL';
export const IS_FORM_DATA_LOADING = 'IS_FORM_DATA_LOADING';
export const LOAD_MAIN_STATE = 'LOAD_MAIN_STATE';
export const LOAD_MAIN_STATE_SUCCESS = 'LOAD_MAIN_STATE_SUCCESS';
export const LOAD_MAIN_STATE_FAIL = 'LOAD_MAIN_STATE_FAIL';
export const INITIAL_DATA_INFOR_UPDATE_LOADING = 'INITIAL_DATA_INFOR_UPDATE_LOADING';
export const INIT_SCREEN_DESIGNER_POPUP = 'INIT_SCREEN_DESIGNER_POPUP';


export const SCREEN_DESIGNER_COMPONENT_CHANGE = 'SCREEN_DESIGNER_COMPONENT_CHANGE';

export const SCREEN_DESIGNER_SCREEN_DEFINITION_CHANGE = 'SCREEN_DESIGNER_SCREEN_DEFINITION_CHANGE';


export const CLOSE_SCREEN_DESIGNER = 'CLOSE_SCREEN_DESIGNER';
export const CLOSE_SCREEN_DESIGNER_SUCCESS = 'SAVE_SCREEN_DESIGNER_SUCCESS';
export const CLOSE_SCREEN_DESIGNER_FAIL = 'SAVE_SCREEN_DESIGNER_FAIL';


export const SAVE_SCREEN_DESIGNER = 'SAVE_SCREEN_DESIGNER';
export const SAVE_SCREEN_DESIGNER_SUCCESS = 'SAVE_SCREEN_DESIGNER_SUCCESS';
export const SAVE_SCREEN_DESIGNER_FAIL = 'SAVE_SCREEN_DESIGNER_FAIL';

export const LOGIC_DODUMENT_VIEW = 'DPS_LOGIC_DODUMENT_VIEW';

export const SCREEN_DESIGNER_TAB_CHANGE = 'SCREEN_DESIGNER_TAB_CHANGE';


export const EXPORT_SCREEN_DESIGNER_OV_LIST = 'EXPORT_SCREEN_DESIGNER_OV_LIST';
export const EXPORT_SCREEN_DESIGNER_OV_LIST_SUCCESS = 'EXPORT_SCREEN_DESIGNER_OV_LIST_SUCCESS';
export const EXPORT_SCREEN_DESIGNER_OV_LIST_FAIL = 'EXPORT_SCREEN_DESIGNER_OV_LIST_FAIL';

export const SCREEN_DESIGNER_CREATE_LOOKUP_FILE = 'SCREEN_DESIGNER_CREATE_LOOKUP_FILE';
export const SCREEN_DESIGNER_CREATE_LOOKUP_FILE_FAIL = 'SCREEN_DESIGNER_CREATE_LOOKUP_FILE_FAIL';

export const EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER = 'EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER';


export const EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER_SUCCESS = 'EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER_SUCCESS';

export const EEXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER_FAIL = 'EEXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER_FAIL';


export enum ViewChangeKind {
    GoToNext = 'GO_TO_NEXT',
    GoToPrevious = 'GO_TO_PREVIOUS',
    AxisChange = 'AXIS_CHANGE',
}
export enum ScreenListItemsChangeKind {
    DeleteItem = 'DELETE_ITEM',
    OvItemDeleteItem = 'OV_ITEM_DELETE_ITEM',
    UpdateItemFromOVItemDto = 'UPDATE_ITEM_FROM_OVDTO',
    SequenceChange = 'SEQUENCE_CHANGE',
    RearrangementSequencePosition = 'REARRANGEMENT_SEQUENCE_POSITION',
    SequenceRearrangement = 'SEQUENCE_REARRANGEMENT',
    UpdateValue = 'UPDATE_VALUE',
    UpdateValueWithLookups = 'UPDATE_VALUE_LOOKUPS',
    SelectItem = 'SELECT_ITEM',
    TabChange = 'TAB_CHANGE',
    MoveItem = 'MOVE_ITEM',
    MoveComplete = 'MOVE_COMPLETE',
    DragSelectionsUpdate = 'DRAG_SELECTIONS_UPDATE',
    LeftAlignController = 'LEFT_ALIGN_CONTROLLER',
    LeftAlign = 'LEFT_ALIGN',
    RightAlign = 'RIGHT_ALIGN',
    BottomAlign = 'BOTTOM_ALIGN',
    MiddleAlign = 'MIDDLE_ALIGN',
    CenterAlign = 'CENTER_ALIGN',
    TopAlign = 'TOP_ALIGN',
    ArrangeSpace = 'ARRANGE_SPACE',
    GoToNext = 'GO_TO_NEXT',
    GoToPrevious = 'GO_TO_PREVIOUS',
    AddItem = 'ADD_ITEM',
    ClearSelection = 'CLEAR_SELECTION',
    DeleteItemFromDb = 'DELETE_ITEM_FROM_DB',
}
export enum RowScreenDefinitionChangeKind {
    UpdateValue = 'UPDATE_VALUE',
    // SelectItem = 'SELECT_ITEM',
    // MoveItem = 'MOVE_ITEM',
    // InsertItem = 'INSERT_ITEM',
}
export enum TabChangeKind {
    GoToPropertyWindow = 'GO_TO_PROPERTY_WINDOW',
    // GoToNext = 'GO_TO_NEXT',
    // GoToPrevious = 'GO_TO_PREVIOUS',
    // AxisChange = 'AXIS_CHANGE',
}
export enum RowLookupChangeKind {
    UpdateValue = 'UPDATE_VALUE',
    SelectItem = 'SELECT_ITEM',
    MoveItem = 'MOVE_ITEM',
    InsertItem = 'INSERT_ITEM',
}

export enum RowOvItemChangeKind {
    UpdateValue = 'UPDATE_VALUE',
    SelectItem = 'SELECT_ITEM',
    MoveItem = 'MOVE_ITEM',
    InsertItem = 'INSERT_ITEM',
    InsertItemAddToView = 'INSERT_ITEM_ADD_TO_VIEW ',
    AddLableToView = 'ADD_LABLE_TO_VIEW ',
    CloseItem = 'CLOSE_ITEM',
    DeleteItem = 'DELETE_ITEM',
    DeleteItemSuccess = 'DELETE_ITEM_SUCCESS',
    // InsertItemSuccess = 'INSERT_ITEM_SUCCESS',
}




export class CloseScreenDesigner extends TokenizeAction implements Action {
    readonly type = CLOSE_SCREEN_DESIGNER;
    constructor(public token: string) { super(token); }
}
export class CloseScreenDesignerSuccess extends TokenizeAction implements Action {
    readonly type = CLOSE_SCREEN_DESIGNER_SUCCESS;
    constructor(public token: string) { super(token); }
}
export class CloseScreenDesignerFail extends TokenizeAction implements Action {
    readonly type = CLOSE_SCREEN_DESIGNER_FAIL;
    constructor(public token: string) { super(token); }
}



/////////////////////// load SaveScreenDesigner start
export class SaveScreenDesigner extends TokenizeAction implements Action {
    readonly type = SAVE_SCREEN_DESIGNER;
    constructor(public token: string, public request: SaveScreenDesignerRequest) { super(token); }
}


// export class ExportScreenToXMLScreenDesigner extends TokenizeAction implements Action {
//     readonly type = EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER;
//     constructor(public token: string, public request: SaveScreenDesignerRequest) { super(token); }
// }




export class ExportScreenToXMLScreenDesigner extends TokenizeAction implements Action {
    readonly type = EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER;
    constructor(public token: string) { super(token); }
}

export class ExportScreenToXMLScreenDesignerSuccess extends TokenizeAction implements Action {
    readonly type = EXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER_SUCCESS;
    constructor(public token: string, public payload: {
        response: ExportScreenDesignerResponse,
    }) { super(token); }
}

export class ExportScreenToXMLScreenDesignerFail extends TokenizeAction implements Action {
    readonly type = EEXPORT_SCREEN_TO_XML_SAVE_SCREEN_DESIGNER_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}





export class SaveScreenDesignerSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_SCREEN_DESIGNER_SUCCESS;
    constructor(public token: string, public payload: {
        response: SaveScreenDesignerResponse,
        request: SaveScreenDesignerRequest
    }) { super(token); }
}


export class SaveScreenDesignerFail extends TokenizeAction implements Action {
    readonly type = SAVE_SCREEN_DESIGNER_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}

export class ExportScreenDesignerOvList extends TokenizeAction implements Action {
    readonly type = EXPORT_SCREEN_DESIGNER_OV_LIST;
    constructor(public token: string) { super(token); }
}

export class ExportScreenDesignerOvListSuccess extends TokenizeAction implements Action {
    readonly type = EXPORT_SCREEN_DESIGNER_OV_LIST_SUCCESS;
    constructor(public token: string, public payload: {
        response: ExportScreenDesignerResponse,
    }) { super(token); }
}


export class ExportScreenDesignerOvListFail extends TokenizeAction implements Action {
    readonly type = EXPORT_SCREEN_DESIGNER_OV_LIST_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}



/////////////////////// load SaveScreenDesigner end

export class InitScreenDesingnerPopup extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_DESIGNER_POPUP;
    constructor(public token: string, public payload: ScreenDesingnerRequestViewModel) { super(token); }
}

export class ScreenDesignerCreatelookupFile extends TokenizeAction implements Action {
    readonly type = SCREEN_DESIGNER_CREATE_LOOKUP_FILE;
    constructor(public token: string, public payload: { row: ScreenContanerComponent, value: any }) { super(token); }
}

export class ScreenDesignerCreatelookupFileFail extends TokenizeAction implements Action {
    readonly type = SCREEN_DESIGNER_CREATE_LOOKUP_FILE_FAIL;
    constructor(public token: string, public payload: { error: any }) { super(token); }
}




export class ScreenDesignerComponentChange extends TokenizeAction implements Action {
    readonly type = SCREEN_DESIGNER_COMPONENT_CHANGE;
    constructor(public token: string, public payload: {
        kind: ScreenListItemsChangeKind, row: ScreenContanerComponent,
        value: any
    }) { super(token); }
}

export class ScreenDesignerScreenDefinitionChange extends TokenizeAction implements Action {
    readonly type = SCREEN_DESIGNER_SCREEN_DEFINITION_CHANGE;
    constructor(public token: string, public payload: {
        kind: RowScreenDefinitionChangeKind, row: ScreenDefinition,
        value: any
    }) { super(token); }
}

export class ScreenDesingnerFormViewChange extends TokenizeAction implements Action {
    readonly type = SCREEN_DESIGNER_FORM_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) { super(token); }
}

export class ScreenDesingnerTabChange extends TokenizeAction implements Action {
    readonly type = SCREEN_DESIGNER_TAB_CHANGE;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}

export class LogicDodumentView extends TokenizeAction implements Action {
    readonly type = LOGIC_DODUMENT_VIEW;
    constructor(public token: string, public screenLogic: ScreenLogic ) { super(token); }
}



export class InitScreenDesingner extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_DESIGNER;
    constructor(public token: string, public payload: ScreenDesingnerInitials) { super(token); }
}


export class LoadScreenDesingnerFormViewData extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA;
    constructor(public token: string, public request: ScreenDesingnerRequest) { super(token); }
}

export class LoadScreenDesingnerFormViewDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA_SUCCESS;
    constructor(public token: string, public payload: { response: FormView, request: ScreenDesingnerRequest }) {
        super(token);
    }
}
export class LoadScreenDesingnerFormViewDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_DESIGNER_FORM_VIEW_DATA_FAIL;
    constructor(public token: string, public payload: { response: string }) {
        super(token);
    }
}



export class IsFormDataLoading extends TokenizeAction implements Action {
    readonly type = IS_FORM_DATA_LOADING;
    constructor(public token: string, public payload: { value: boolean }) { super(token); }
}

export class InitialDatainforUpdateLoading extends TokenizeAction implements Action {
    readonly type = INITIAL_DATA_INFOR_UPDATE_LOADING;
    constructor(public token: string, public payload: { masages: Array<string>, screenIds: Array<string> }) { super(token); }
}

export class LoadMainState extends TokenizeAction implements Action {
    readonly type = LOAD_MAIN_STATE;
    constructor(public token: string, public payload: { request: MainStateRequest }) { super(token); }
}

export class LoadMainStateSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MAIN_STATE_SUCCESS;
    constructor(public token: string, public payload: { response: MainStateResponse, request: MainStateRequest }) { super(token); }
}


export class LoadMainStateFail extends TokenizeAction implements Action {
    readonly type = LOAD_MAIN_STATE_FAIL;
    constructor(public token: string, public payload: { value: any }) { super(token); }
}


export class LoadScreenDesingnerFormViewListData extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_DESIGN_FORM_VIEW_LIST_DATA;
    constructor(public token: string, public request: ScreenDesingnerRequest) { super(token); }
}

export class LoadScreenDesingnerListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_SCREEN_DESIGNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { response: ScreenDesingnerResponse[], request: ScreenDesingnerRequest }) {
        super(token);
    }
}
export class LoadScreenDesingnerListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL;
    constructor(public token: string, public payload: { response: string }) {
        super(token);
    }
}

export const CASH_SCREEN_DESIGNER = 'CASH_SCREEN_DESIGNER';
export class CashScreenDesingner extends TokenizeAction implements Action {
    readonly type = CASH_SCREEN_DESIGNER;
    // todo public payload: ScreenDesingnerInitials
    constructor(public token: string, public payload: any) { super(token); }
}

export type Any = InitScreenDesingnerPopup |
    ScreenDesignerComponentChange |

    LoadScreenDesingnerFormViewDataSuccess | LoadScreenDesingnerFormViewDataFail
    | ScreenDesingnerFormViewChange | LoadScreenDesingnerFormViewData
    | LoadScreenDesingnerFormViewListData | LoadScreenDesingnerListSuccess | LoadScreenDesingnerListFail
    | IsFormDataLoading | LoadMainState | LoadMainStateSuccess | LoadScreenDesingnerFormViewDataFail
    | InitialDatainforUpdateLoading
    | InitScreenDesingner | ScreenDesignerScreenDefinitionChange | ScreenDesignerCreatelookupFileFail |
    SaveScreenDesigner | SaveScreenDesignerSuccess | SaveScreenDesignerFail | LogicDodumentView | ScreenDesingnerTabChange
    | CloseScreenDesigner | CloseScreenDesignerSuccess | CloseScreenDesignerFail;


