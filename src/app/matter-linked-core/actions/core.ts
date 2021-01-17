import { FailDialogData } from './../../shared/models/dialog';

import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { GridData, PlotMatterValidationResponce, PlotSyncSuccessInfo, MatterDataInput } from '../models/interfaces';
import { LinkedMatterRequestViewModel, PlotMatterDiaryRecordsInfoViewModel } from '../models/request';
import { MatterLinkedType } from '../models/enum';
import { MatterSearchGridData } from './../../core/lib/matter';


export const INIT_MATTER_LINKED = 'DPS_INIT_MATTER_LINKED';


export const GET_MATTER_LINKED = 'DPS_GET_MATTER_LINKED';
export const INIT_MATTER_LINKED_SUCCESS = 'DPS_INIT_MATTER_LINKED_SUCCESS';
export const INIT_MATTER_LINKED_FAIL = 'DPS_INIT_MATTER_LINKED_FAIL';

export const REQUEST_LINKED_DATA = 'DPS_REQUEST_LINKED_DATA';
export const CREATE_LINKED_MATTER = 'DPS_CREATE_LINKED_MATTER';
export const CREATE_LINKED_MATTER_FAIL = 'DPS_CREATE_LINKED_MATTER_FAIL';

export const SAVE_PLOT_LINKED_MATTER = 'DPS_SAVE_PLOT_LINKED_MATTER';
export const SAVE_PLOT_SUCCESS = 'DPS_SAVE_PLOT_SUCCESS';
export const SAVE_PLOT_FAIL = 'DPS_SAVE_PLOT_FAIL';

export const LINKED_MATTER_OPEN_CASE = 'DPS_LINKED_MATTER_OPEN_CASE';
export const REQUEST_ADD_DIARY_RECORD_FOR_PLOT_MATTER = 'DPS_REQUEST_ADD_DIARY_RECORD_FOR_PLOT_MATTER';

export const ADD_DIARY_RECORD_FOR_PLOT_MATTER = 'DPS_ADD_DIARY_RECORD_FOR_PLOT_MATTER ';
export const ADD_DIARY_RECORD_FOR_PLOT_MATTER_SUCCESS = 'DPS_ADD_DIARY_RECORD_FOR_PLOT_MATTER_SUCCESS';
export const ADD_DIARY_RECORD_FOR_PLOT_MATTER_FAIL = 'DPS_ADD_DIARY_RECORD_FOR_PLOT_MATTER _FAIL';

export const SELECTED_LINKED_MATTER = 'DPS_SELECTED_LINKED_MATTER';

export const SAVE_PLOT_SALE_SCREEN_DATA = 'DPS_SAVE_PLOT_SALES_CREEN_DATA';
export const SAVE_PLOT_SALE_SCREEN_DATA_SUCCESS = 'DPS_SAVE_PLOT_SALES_CREEN_DATA_SUCCESS';
export const SAVE_PLOT_SALE_SCREEN_DATA_FAIL = 'DPS_SAVE_PLOT_SALES_CREEN_DATA_FAIL';

export const REQUEST_UPDATE_LINKED_MATTER = 'DPS_REQUEST_UPDATE_LINKED_MATTER';

export const UPDATE_PLOT_LINKED_MATTER = 'DPS_UPDATE_PLOT_LINKED_MATTER';
export const UPDATE_PLOT_LINKED_MATTER_SUCCESS = 'DPS_UPDATE_PLOT_LINKED_MATTER_SUCCESS';
export const UPDATE_PLOT_LINKED_MATTER_FAIL = 'DPS_UPDATE_PLOT_LINKED_MATTER_FAIL';

export const SHOW_VALIDATION_FAIL_MESSAGE = 'DPS_LINKED_MATTER_SHOW_VALIDATION_FAIL_MESSAGE';

export const SELECT_ALL_LINK_MATTER = 'DPS_SELECT_ALL_LINK_MATTER';

export const MULTI_SELECT_MATTER = 'DPS_MULTI_SELECT_MATTER';

export const REQUEST_ADD_DIARY_CHASER_DATA = 'DPS_REQUEST_ADD_DIARY_CHASER_DATA';

export const CHANGE_PLOT_RANGE = 'DPS_CHANGE_PLOT_RANGE';


export const CHANGE_MATTER_DATA = 'DPS_CHANGE_MATTER_DATA';



export const GET_PLOT_STATUS = 'DPS_GET_PLOT_STATUS';
export const GET_PLOT_STATUS_SUCCESS = 'DPS_GET_PLOT_STATUS_SUCCESS';
export const GET_PLOT_STATUS_FAIL = 'DPS_GET_PLOT_STATUS_FAIL';













export class InitMatterLinked extends TokenizeAction implements Action {
    readonly type = INIT_MATTER_LINKED;
    constructor(public token: string, public payload: {
        matterRef: string,
        openFrom: MatterLinkedType, coloumnDef: any, matterData: MatterDataInput, screenId: any, diaryIds: any,
        parentToken: string, onlySelectMatter?: boolean
    }) {
        super(token);
    }
}

export class RequestLinkedData extends TokenizeAction implements Action {
    readonly type = REQUEST_LINKED_DATA;
    constructor(public token: string) {
        super(token);
    }
}



export class GetMatterLinked extends TokenizeAction implements Action {
    readonly type = GET_MATTER_LINKED;
    constructor(public token: string, public request: LinkedMatterRequestViewModel) {
        super(token);
    }
}

export class SavePlotLinkedMatter extends TokenizeAction implements Action {
    readonly type = SAVE_PLOT_LINKED_MATTER;
    constructor(public token: string, public request: any) {
        super(token);
    }
}

export class SavePlotSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_PLOT_SUCCESS;
    constructor(public token: string, public responce: PlotMatterValidationResponce, public request: any) {
        super(token);
    }
}

export class SavePlotFail extends TokenizeAction implements Action {
    readonly type = SAVE_PLOT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class GetPlotStatus extends TokenizeAction implements Action {
    readonly type = GET_PLOT_STATUS;
    constructor(public token: string, public responce: any, public request: any) {
        super(token);
    }
}

export class GetPlotStatusSuccess extends TokenizeAction implements Action {
    readonly type = GET_PLOT_STATUS_SUCCESS;
    constructor(public token: string, public responce: PlotMatterValidationResponce) {
        super(token);
    }
}

export class GetPlotStatusFail extends TokenizeAction implements Action {
    readonly type = SAVE_PLOT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}




export class InitMatterLinkedSuccess extends TokenizeAction implements Action {
    readonly type = INIT_MATTER_LINKED_SUCCESS;
    constructor(public token: string, public payload: { data: GridData }) {
        super(token);
    }
}

export class InitMatterLinkedFail extends TokenizeAction implements Action {
    readonly type = INIT_MATTER_LINKED_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class CreateLinkedMatter extends TokenizeAction implements Action {
    readonly type = CREATE_LINKED_MATTER;
    constructor(public token: string, public plotNumbers: string
    ) {
        super(token);
    }
}


export class LinkedMatterOpenCase extends TokenizeAction implements Action {
    readonly type = LINKED_MATTER_OPEN_CASE;
    constructor(public token: string, public payload: any) { super(token); }
}

export class RequestAddDiaryRecordsForPlotMattters extends TokenizeAction implements Action {
    readonly type = REQUEST_ADD_DIARY_RECORD_FOR_PLOT_MATTER;
    constructor(public token: string, public payload: {
        diaryIds: number[], branchId: Number; appId: Number;
        fileId: Number;
    }) {
        super(token);
    }
}

export class RequestUpdateLinkedMatter extends TokenizeAction implements Action {
    readonly type = REQUEST_UPDATE_LINKED_MATTER;
    constructor(public token: string, public masterMatterRef: string) {
        super(token);
    }
}

export class UpdatePlotLinkedMatter extends TokenizeAction implements Action {
    readonly type = UPDATE_PLOT_LINKED_MATTER;
    constructor(public token: string, public request: any) {
        super(token);
    }
}

export class UpdatePlotLinkedMatterSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_PLOT_LINKED_MATTER_SUCCESS;
    constructor(public token: string, public payload: { data: GridData }) {
        super(token);
    }
}

export class UpdatePlotLinkedMatterFail extends TokenizeAction implements Action {
    readonly type = UPDATE_PLOT_LINKED_MATTER_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}




export class AddDiaryRecordsForPlotMattters extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_FOR_PLOT_MATTER;
    constructor(public token: string, public request: PlotMatterDiaryRecordsInfoViewModel) {
        super(token);
    }
}

export class AddDiaryRecordsForPlotMatttersSuccess extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_FOR_PLOT_MATTER_SUCCESS;
    constructor(public token: string, public payload: { plotSyncSuccessInfo: PlotSyncSuccessInfo }) {
        super(token);
    }
}

export class AddDiaryRecordsForPlotMattterstFail extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_FOR_PLOT_MATTER_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class SelectedLinkMatter extends TokenizeAction implements Action {
    readonly type = SELECTED_LINKED_MATTER;
    constructor(public token: string, public selectedMatter: string) {
        super(token);
    }
}

export class SavePlotSaleScreenData extends TokenizeAction implements Action {
    readonly type = SAVE_PLOT_SALE_SCREEN_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class SavePlotSaleScreenDataSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_PLOT_SALE_SCREEN_DATA_SUCCESS;
    constructor(public token: string, public payload: { plotSyncSuccessInfo: PlotSyncSuccessInfo }) {
        super(token);
    }
}
export class SavePlotSaleScreenDataFail extends TokenizeAction implements Action {
    readonly type = SAVE_PLOT_SALE_SCREEN_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ShowValidationFailDialog extends TokenizeAction {
    readonly type = SHOW_VALIDATION_FAIL_MESSAGE;
    constructor(public token: string, public data: FailDialogData | PlotMatterValidationResponce) {
        super(token);
    }
}

export class SelectedAllLinkMatter extends TokenizeAction implements Action {
    readonly type = SELECT_ALL_LINK_MATTER;
    constructor(public token: string, public value: any) {
        super(token);
    }
}

export class MultiSelectMatter extends TokenizeAction implements Action {
    readonly type = MULTI_SELECT_MATTER;
    constructor(public token: string, public value: any) {
        super(token);
    }
}

export class RequestAddDiaryChaserData extends TokenizeAction implements Action {
    readonly type = REQUEST_ADD_DIARY_CHASER_DATA;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangePlotRange extends TokenizeAction implements Action {
    readonly type = CHANGE_PLOT_RANGE;
    constructor(public token: string, public plotRange: string) {
        super(token);
    }
}

export class ChangeMatterData extends TokenizeAction implements Action {
    readonly type = CHANGE_MATTER_DATA;
    constructor(public token: string, public matterData: MatterSearchGridData) {
        super(token);
    }
}







export type Any = InitMatterLinked | InitMatterLinkedSuccess | InitMatterLinkedFail | RequestLinkedData | CreateLinkedMatter
    | SavePlotLinkedMatter | LinkedMatterOpenCase | SavePlotSuccess | SavePlotFail | RequestAddDiaryRecordsForPlotMattters
    | AddDiaryRecordsForPlotMattters
    | AddDiaryRecordsForPlotMatttersSuccess
    | AddDiaryRecordsForPlotMattterstFail | SelectedLinkMatter | RequestUpdateLinkedMatter | UpdatePlotLinkedMatter
    | UpdatePlotLinkedMatterSuccess | UpdatePlotLinkedMatterFail
    | SavePlotSaleScreenData | SavePlotSaleScreenDataSuccess | SavePlotSaleScreenDataFail | ShowValidationFailDialog
    | SelectedAllLinkMatter | MultiSelectMatter | RequestAddDiaryChaserData | ChangePlotRange | ChangeMatterData |
    GetPlotStatus | GetPlotStatusSuccess | GetPlotStatusFail;
