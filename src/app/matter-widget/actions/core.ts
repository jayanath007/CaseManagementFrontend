import { Action } from '@ngrx/store';
import { DataRequest } from '../models/request';
import { DataObj } from '../models/interfce';
import { GridRowItemWrapper } from '../../matter-search-core';
import { Matter } from '../../matter-creation-core/models/interfaces';

export const INIT_MATTER_WIDGET = 'INIT_MATTER_WIDGET_WIDGET';
export const REQUEST_DATA = 'MATTER_WIDGET_REQUEST_GRID_DATA';
export const LOAD_DATA = 'MATTER_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'MATTER_WIDGET_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'MATTER_WIDGET_DATA_FAIL';
export const REFRESH_DATA = 'MATTER_WIDGET_REFRESH_DATA';
export const GO_TO_OPEN_CASE = 'MATTER_WIDGET_GO_TO_OPEN_CASE';
export const UPDATE_A_MATTER = 'MATTER_WIDGET_UPDATE_A_MATTER';

export class InitMatterWidget implements Action {
    readonly type = INIT_MATTER_WIDGET;
    constructor() { }
}

export class RequestData implements Action {
    readonly type = REQUEST_DATA;
    constructor() { }
}

export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor(public request: DataRequest) { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public payload: { dataObject: DataObj }) { }
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor() { }
}

export class RefreshData implements Action {
    readonly type = REFRESH_DATA;
    constructor() { }
}

export class GoToOpenCase implements Action {
    readonly type = GO_TO_OPEN_CASE;
    constructor(public matter: GridRowItemWrapper) { }
}

export class UpdateAMatter implements Action {
    readonly type = UPDATE_A_MATTER;
    constructor(public matter: Matter) { }
}

export type Any = InitMatterWidget | RequestData | LoadData | LoadDataSuccess | LoadDataFail | RefreshData | UpdateAMatter;
