import { PrecedentHS, PrecedentHInput } from './../models/interfaces';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { TableColumn, TableRow } from '../../shared/models/interface';
import { ChangeValueKind } from '../models/enum';

export const INIT_PRECEDENTH = 'DPS_INIT_PRECEDENTH';

export const LOAD_PRECEDENTS_PHASE = 'DPS_LOAD_PRECEDENTS_PHASE';
export const LOAD_PRECEDENTS_PHASE_SUCCESS = 'DPS_LOAD_PRECEDENTS_PHASE_SUCCESS';
export const LOAD_PRECEDENTS_PHASE_FAIL = 'DPS_LOAD_PRECEDENTS_PHASE_FAIL';

export const LOAD_PRECEDENTH_WORK_TYPE = 'DPS_LOAD_PRECEDENTH_WORK_TYPE';
export const LOAD_PRECEDENTH_WORK_TYPE_SUCCESS = 'DPS_LOAD_PRECEDENTH_WORK_TYPE_SUCCESS';
export const LOAD_PRECEDENTH_WORK_TYPE_FAIL = 'DPS_LOAD_PRECEDENTH_WORK_TYPE_FAIL';

export const INPUT_DATA_CHANGE = 'DPS_INPUT_DATA_CHANGE';

export const SAVE_PRESEDENT_HS = 'DPS_SAVE_PRESEDENT_HS';
export const SAVE_PRESEDENT_HS_SUCCESS = 'DPS_SAVE_PRESEDENT_HS_SUCCESS';
export const SAVE_PRESEDENT_HS_FAIL = 'DPS_SAVE_PRESEDENT_HS_FAIL';

export const PRESEDENTSH_ROW_CLICK = 'DPS_PRESEDENTSH_ROW_CLICK';
export const CHANGE_ESTIMATED_DATA = 'DPS_CHANGE_ESTIMATED_DATA';
export const PRESEDENTSH_POPUP_CLOSE = 'DPS_PRESEDENTSH_POPUP_CLOSE';
export const EXPORT_PRECEDENT_HS_XML = 'DPS_EXPORT_PRECEDENT_HS_XML';
export const EXPORT_PRECEDENT_HS_XML_SUCCESS = 'DPS_EXPORT_PRECEDENT_HS_XML_SUCCESS';
export const EXPORT_PRECEDENT_HS_XML_FAIL = 'DPS_EXPORT_PRECEDENT_HS_XML_FAIL';

export const GET_WORK_TYPE_LIST = 'DPS_GET_WORK_TYPE_LIST';
export const GET_WORK_TYPE_LIST_SUCCESS = 'DPS_GET_WORK_TYPE_LIST_SUCCESS';
export const GET_WORK_TYPE_LIST_FAIL = 'DPS_GET_WORK_TYPE_LIST_FAIL';

export const CHANGE_PRESIDENTH_VALUE = 'DPS_CHANGE_PRESIDENTH_VALUE';
export const CHANGE_PRESIDENTH_WORK_TYPE = 'DPS_CHANGE_PRESIDENTH_WORK_TYPE';

export const GET_PRESIDENTH_ESTIMATED_COST = 'DPS_GET_PRESIDENTH_ESTIMATED_COST';
export const GET_PRESIDENTH_ESTIMATED_COST_SUCCESS = 'DPS_GET_PRESIDENTH_ESTIMATED_COST_SUCCESS';
export const GET_PRESIDENTH_ESTIMATED_COST_FAIL = 'DPS_GET_PRESIDENTH_ESTIMATED_COST_FAIL';

export const CHANGE_GRID_UNIT = 'DPS_CHANGE_GRID_UNIT';

export const ROW_CHECK_BOX_CHANGE = 'DPS_PRECIDENT_H_ROW_CHECK_BOX_CHANGE';

export const SAVE_PRECIDENT_H_RATES = 'DPS_SAVE_PRECIDENT_H_RATES';
export const SAVE_PRECIDENT_H_RATES_SUCCESS = 'DPS_SAVE_PRECIDENT_H_RATES_SUCCESS';
export const SAVE_PRECIDENT_H_RATES_FAIL = 'DPS_SAVE_PRECIDENT_H_RATES_FAIL';

export const SET_DEFAULT_WORK_TYPE = 'DPS_SET_DEFAULT_WORK_TYPE';
export const CHECK_ALL_CLICK_PRECIDENT_H = 'DPS_CHECK_ALL_CLICK_PRECIDENT_H';





export class InitPage extends TokenizeAction implements Action {
    readonly type = INIT_PRECEDENTH;
    constructor(public token: string, public payload: { inputData: PrecedentHInput }) {
        super(token);
    }
}
// Phase stuff
export class LoadPrecedentSList extends TokenizeAction implements Action {
    readonly type = LOAD_PRECEDENTS_PHASE;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadPrecedentSListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_PRECEDENTS_PHASE_SUCCESS;
    constructor(public token: string, public payload: { precedentSList: PrecedentHS[] }) {
        super(token);
    }
}
export class LoadPrecedentSListFail extends TokenizeAction implements Action {
    readonly type = LOAD_PRECEDENTS_PHASE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
// Work type stuff
export class LoadPrecedentHDataList extends TokenizeAction implements Action {
    readonly type = LOAD_PRECEDENTH_WORK_TYPE;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadPrecedentHDataListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_PRECEDENTH_WORK_TYPE_SUCCESS;
    constructor(public token: string, public payload: { precedentHList: PrecedentHS[] }) {
        super(token);
    }
}
export class LoadPrecedentHDataListFail extends TokenizeAction implements Action {
    readonly type = LOAD_PRECEDENTH_WORK_TYPE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class SavePrecedentHS extends TokenizeAction implements Action {
    readonly type = SAVE_PRESEDENT_HS;
    constructor(public token: string) {
        super(token);
    }
}
export class SavePrecedentHSSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_PRESEDENT_HS_SUCCESS;
    constructor(public token: string, public payload) {
        super(token);
    }
}
export class SavePrecedentHSFail extends TokenizeAction implements Action {
    readonly type = SAVE_PRESEDENT_HS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class RowItemClick extends TokenizeAction implements Action {
    readonly type = PRESEDENTSH_ROW_CLICK;
    constructor(public token: string, public payload) {
        super(token);
    }
}
export class InputDataChange extends TokenizeAction implements Action {
    readonly type = INPUT_DATA_CHANGE;
    constructor(public token: string, public payload: { phaseID: number, value: number }) {
        super(token);
    }
}
export class PresedentHSPopupClose extends TokenizeAction implements Action {
    readonly type = PRESEDENTSH_POPUP_CLOSE;
    constructor(public token: string) {
        super(token);
    }
}
export class ExportPrecedentHSXML extends TokenizeAction implements Action {
    readonly type = EXPORT_PRECEDENT_HS_XML;
    constructor(public token: string) {
        super(token);
    }
}
export class ExportPrecedentHSXMLSuccess extends TokenizeAction implements Action {
    readonly type = EXPORT_PRECEDENT_HS_XML_SUCCESS;
    constructor(public token: string, public payload) {
        super(token);
    }
}
export class ExportPrecedentHSXMLFAIL extends TokenizeAction implements Action {
    readonly type = EXPORT_PRECEDENT_HS_XML_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class GetWorkTypeList extends TokenizeAction implements Action {
    readonly type = GET_WORK_TYPE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetWorkTypeListSuccess extends TokenizeAction implements Action {
    readonly type = GET_WORK_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { workTypeList: any }) {
        super(token);
    }
}
export class GetWorkTypeListFail extends TokenizeAction implements Action {
    readonly type = GET_WORK_TYPE_LIST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangePresidentHValue extends TokenizeAction implements Action {
    readonly type = CHANGE_PRESIDENTH_VALUE;
    constructor(public token: string, public payload: { changeValue: { kind: ChangeValueKind, value: number } }) {
        super(token);
    }
}

export class ChangePresidentHWorkType extends TokenizeAction implements Action {
    readonly type = CHANGE_PRESIDENTH_WORK_TYPE;
    constructor(public token: string, public payload: { changeValue: any }) {
        super(token);
    }
}


export class GetPresidentHEstimatedCost extends TokenizeAction implements Action {
    readonly type = GET_PRESIDENTH_ESTIMATED_COST;
    constructor(public token: string) {
        super(token);
    }
}
export class GetPresidentHEstimatedCostSuccess extends TokenizeAction implements Action {
    readonly type = GET_PRESIDENTH_ESTIMATED_COST_SUCCESS;
    constructor(public token: string, public payload: { presidentHData: any }) {
        super(token);
    }
}
export class GetPresidentHEstimatedCostFail extends TokenizeAction implements Action {
    readonly type = GET_PRESIDENTH_ESTIMATED_COST_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class ChangeGridUnit extends TokenizeAction implements Action {
    readonly type = CHANGE_GRID_UNIT;
    constructor(public token: string, public payload: { value: number, row: TableRow<any>, columns: TableColumn }) {
        super(token);
    }
}

export class SavePrecidentHRates extends TokenizeAction implements Action {
    readonly type = SAVE_PRECIDENT_H_RATES;
    constructor(public token: string) {
        super(token);
    }
}
export class SavePrecidentHRatesSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_PRECIDENT_H_RATES_SUCCESS;
    constructor(public token: string, public payload: { responce: any }) {
        super(token);
    }
}
export class SavePrecidentHRatesFail extends TokenizeAction implements Action {
    readonly type = SAVE_PRECIDENT_H_RATES_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class RowCheckBoxChange extends TokenizeAction implements Action {
    readonly type = ROW_CHECK_BOX_CHANGE;
    constructor(public token: string, public payload: { value: boolean, row: TableRow<any>, columns: TableColumn }) {
        super(token);
    }
}

export class SetDefaultWorkType extends TokenizeAction implements Action {
    readonly type = SET_DEFAULT_WORK_TYPE;
    constructor(public token: string) {
        super(token);
    }
}

export class CheckAllClick extends TokenizeAction implements Action {
    readonly type = CHECK_ALL_CLICK_PRECIDENT_H;
    constructor(public token: string, public payload: boolean) {
        super(token);
    }
}









export type Any = InitPage | LoadPrecedentSList | LoadPrecedentSListSuccess | LoadPrecedentSListFail |
    LoadPrecedentHDataList | LoadPrecedentHDataListSuccess | LoadPrecedentHDataListFail | SavePrecedentHS | SavePrecedentHSSuccess |
    SavePrecedentHSFail | InputDataChange | RowItemClick | PresedentHSPopupClose |
    ExportPrecedentHSXML | ExportPrecedentHSXMLSuccess | ExportPrecedentHSXMLFAIL
    | GetWorkTypeList | GetWorkTypeListSuccess | GetWorkTypeListFail | ChangePresidentHValue | ChangePresidentHWorkType
    | GetPresidentHEstimatedCost | GetPresidentHEstimatedCostSuccess | GetPresidentHEstimatedCostFail | ChangeGridUnit | SavePrecidentHRates
    | SavePrecidentHRatesSuccess | SavePrecidentHRatesFail | RowCheckBoxChange | SetDefaultWorkType | CheckAllClick;
