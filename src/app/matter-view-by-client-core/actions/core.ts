import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { ColumnDef } from '../../core/lib/grid-model';
import { PaginatorDef } from '../../core/lib/grid-model';
import { GridRequest } from '../models/requests';
import { GridDataObject } from '../models/interface';
import { ViewChangeKind } from '../models/enumeration';

export const INIT_MATTER_VIEW = 'MBC_INIT_MATTER_VIEW';

export const REQUEST_GRID_DATA = 'MBC_REQUEST_GRID_DATA';
export const LOAD_GRID_DATA = 'MBC_LOAD_GRID_DATA';
export const LOAD_GRID_DATA_SUCCESS = 'MBC_GRID_DATA_SUCCESS';
export const LOAD_GRID_DATA_FAIL = 'MBC_LOAD_GRID_DATA_FAIL';
export const GRID_VIEW_CHANGE = 'MBC_GRID_VIEW_CHANGE';

export const EXIT_MATTER_VIEW_POPUP = 'MBC_EXIT_MATTER_VIEW_POPUP';

export class InitMatterView extends TokenizeAction implements Action {
    readonly type = INIT_MATTER_VIEW;
    constructor(public token: string, public payload: { clientRef: string, gridColoumn: ColumnDef[], paginatorDef: PaginatorDef }) {
        super(token);
    }
}

export class GridDataRequest extends TokenizeAction implements Action {
    readonly type = REQUEST_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadGrid extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA;
    constructor(public token: string, public request: GridRequest) { super(token); }
}

export class LoadGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { pageData: GridDataObject }) { super(token); }
}

export class LoadGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GridViewChange extends TokenizeAction implements Action {
    readonly type = GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class ExitPopup extends TokenizeAction implements Action {
    readonly type = EXIT_MATTER_VIEW_POPUP;
    constructor(public token) { super(token); }
}

export type Any = InitMatterView | GridDataRequest | LoadGrid | LoadGridSuccess | LoadGridFail | GridViewChange | ExitPopup;

