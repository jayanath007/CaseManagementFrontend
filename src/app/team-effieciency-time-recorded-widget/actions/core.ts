import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { Message } from '../../core/lib/microsoft-graph';
import { BarChartData } from '../models/interfce';

export const INIT_TE_TIME_RECORDED_WIDGET = 'INIT_TE_TIME_RECORDED_WIDGET_WIDGET';
export const REQUEST_DATA = 'TE_TIME_RECORDED_WIDGET_REQUEST_GRID_DATA';
export const LOAD_DATA = 'TE_TIME_RECORDED_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'TE_TIME_RECORDED_WIDGET_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'TE_TIME_RECORDED_WIDGET_DATA_FAIL';

export const REFRESH_TR_CHART_WIGET_DATA_FAIL = 'TE_TIME_RECORDED_WIDGET_DATA_REFRESH';

export class InitTETimeRecordedWidget implements Action {
    readonly type = INIT_TE_TIME_RECORDED_WIDGET;
    constructor() { }
}

export class RequestData implements Action {
    readonly type = REQUEST_DATA;
    constructor() { }
}

export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor() { }
}

export class LoadDataSuccess implements Action {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public payload: { data: BarChartData[] }) { }
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor() { }
}

export class RefreshTRChartWidgetData implements Action {
    readonly type = REFRESH_TR_CHART_WIGET_DATA_FAIL;
    constructor() { }
}

export type Any = InitTETimeRecordedWidget | RequestData | LoadData | LoadDataSuccess | LoadDataFail | RefreshTRChartWidgetData;
