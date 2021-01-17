import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { Message } from '../../core/lib/microsoft-graph';
import { PieChartData } from '../models/interfce';

export const INIT_TE_PIECHART_WIDGET = 'INIT_TE_PIECHART_WIDGET_WIDGET';
export const REQUEST_DATA = 'TE_PIECHART_WIDGET_REQUEST_GRID_DATA';
export const LOAD_DATA = 'TE_PIECHART_WIDGET_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'TE_PIECHART_WIDGET_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'TE_PIECHART_WIDGET_DATA_FAIL';

export const REFRESH_TE_PIE_CHART_DATA = 'REFRESH_TE_PIE_CHART_DATA';

export class InitTEPieChartWidget implements Action {
    readonly type = INIT_TE_PIECHART_WIDGET;
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
    constructor(public payload: { data: PieChartData[] }) { }
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor() { }
}

export class RefreshTEPieChartData implements Action {
    readonly type = REFRESH_TE_PIE_CHART_DATA;
    constructor() { }
}

export type Any = InitTEPieChartWidget | RequestData | LoadData | LoadDataSuccess | LoadDataFail | RefreshTEPieChartData;
