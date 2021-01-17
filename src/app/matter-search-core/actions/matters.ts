import {
  MatterSearchGridData, Department, MatterResponse, DepartmentResponse,
  MatterFinanceResponse, GridRowItemWrapper, MatterFinance, ReviewNoteResponce
} from '../models/interfaces';
// import { reducers } from './../reducers/index';
import { Action } from '@ngrx/store'; // MatterViews
import { ViewChangeKind } from '../models/enums';
import { TokenizeAction } from '../../core';
import { MatterRequest, MatterRequestForMatterCreate, MatterCreateInputModel } from '../models/requests';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';
import { EventEmitter } from '@angular/core';


export const INIT_MATTER_VIEW = 'DPS_INIT_MATTER_VIEW';
export const MATTER_VIEW_CHANGE = 'DPS_MATTER_VIEW_CHANGE';

export const INIT_MATTER_CREATE_SEARCH_POPUP = 'DPS_INIT_MATTER_CREATE_SEARCH_POPUP';

export const LOAD_MATTER_GRID_DATA_BY_SEARCH_FIELD = 'DPS_LOAD_MATTER_GRID_DATA_BY_SEARCH_FIELD';

export const LOAD_MATTER_GRID_DATA = 'DPS_LOAD_MATTER_GRID_DATA';
export const MATTER_LOAD_SUCESSS = 'DPS_MATTER_LOAD_SUCESSS';
export const MATTER_LOAD_FAIL = 'DPS_MATTER_LOAD_FAIL';

export const LOAD_MATTER_CREATE_DATA_WITH_CURRENT_STATE = 'DPS_LOAD_MATTER_CREATE_DATA_WITH_CURRENT_STATE';


export const LOAD_MATTER_DATA_WITH_CURRENT_STATE = 'DPS_LOAD_MATTER_DATA_WITH_CURRENT_STATE';
export const LOAD_ROW_EXPAN_DATA = 'DPS_LOAD_ROW_EXPAN_DATA';
export const LOAD_ROW_SELECT_DATA = 'DPS_LOAD_ROW_SELECT_DATA';

// departments stuff
export const LOAD_DEPARTMENTS = 'DPS_LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENTS_SUCCESS = 'DPS_LOAD_DEPARTMENT_SUCESS';
export const LOAD_DEPARTMENTS_FAIL = 'DPS_LOAD_DEPARTMENT_FAIL';

// departments stuff
export const LOAD_MATTER_FINANCE = 'DPS_LOAD_MATTER_FINANCE';
export const LOAD_MATTER_FINANCE_SUCCESS = 'DPS_LOAD_MATTER_FINANCE_SUCESS';
export const LOAD_MATTER_FINANCE_FAIL = 'DPS_LOAD_MATTER_FINANCE_FAIL';

// LS
export const LOAD_TEAM_MEMBER1 = 'DPS_LOAD_TEAM_MEMBER1';
export const REFRESH_MATTER = 'DPS_REFRESH_MATTER';
export const EXIT_MATTER_SEARCH_POPUP = 'DPS_EXIT_MATTER_SEARCH_POPUP';

export const CHANGE_MLS_ENABLE_MATTER = 'MATTER_SEARCH_CHANGE_MLS_ENABLE_MATTER';

// Rivew Note
export const ADD_UPDATE_REVIEW_DATA = 'DPS_ADD_UPDATE_REVIEW_DATA';
export const ADD_UPDATE_REVIEW_DATA_SUCCESS = 'DPS_ADD_UPDATE_REVIEW_DATA_SUCESS';
export const ADD_UPDATE_REVIEW_DATA_FAIL = 'DPS_ADD_UPDATE_REVIEW_DATA_FAIL';

export const GET_REVIEW_DATA = 'DPS_MATTER_GET_REVIEW_DATA';
export const GET_REVIEW_DATA_SUCCESS = 'DPS_MATTER_GET_REVIEW_DATA_SUCCESS';
export const GET_REVIEW_DATA_FAIL = 'DPS_MATTER_GET_REVIEW_DATA_FAIL';

export const GO_TO_OPEN_CASE = 'DPS_MATTER_SEARCH_GO_TO_OPEN_CASE';
export const GET_MATTER_INFO_AND_EXIT_MATTER_SEARCH_POPUP = 'DPS_MATTER_SEARCH_GET_MATTER_INFO_AND_EXIT_MATTER_SEARCH_POPUP';


export class InitMatterView extends TokenizeAction implements Action {
  readonly type = INIT_MATTER_VIEW;
  constructor(public token: string, public payload: {
    columnDef: ColumnDef[],
    paginatorDef: PaginatorDef,
    isPopup: boolean,
    inputData: any,
    allColumnsForMatters: ColumnDef[]
  }) { super(token); }
}
export class InitMatterForMatterCreatePopup extends TokenizeAction implements Action {
  readonly type = INIT_MATTER_CREATE_SEARCH_POPUP;
  constructor(public token: string, public payload: {
    columnDef: ColumnDef[],
    paginatorDef: PaginatorDef,
    isPopup: boolean,
    searchText: string,
    isMatterCreate: boolean,
    inputData: MatterCreateInputModel,
    allColumnsForMatters: ColumnDef[]

  }) { super(token); }
}
export class MatterViewChange extends TokenizeAction implements Action {
  readonly type = MATTER_VIEW_CHANGE;
  constructor(public token: string,
    public payload: {
      kind: ViewChangeKind, value: any, columnSet: ColumnDef[], isMatterCreate?: boolean,
      allColumnDef?: ColumnDef[]
    }) { super(token); }
}
export class LoadMatterDataWithCurrentState extends TokenizeAction implements Action {
  readonly type = LOAD_MATTER_DATA_WITH_CURRENT_STATE;
  constructor(public token) { super(token); }
}
export class LoadMatterCreateDataWithCurrentState extends TokenizeAction implements Action {
  readonly type = LOAD_MATTER_CREATE_DATA_WITH_CURRENT_STATE;
  constructor(public token) { super(token); }
}
export class LoadMatterGridData extends TokenizeAction implements Action {
  readonly type = LOAD_MATTER_GRID_DATA;
  constructor(public token: string, public request: MatterRequest) { super(token); }
}
export class LoadMatterGridDataBySearchField extends TokenizeAction implements Action {
  readonly type = LOAD_MATTER_GRID_DATA_BY_SEARCH_FIELD;
  constructor(public token: string, public request: MatterRequestForMatterCreate) { super(token); }
}
export class MatterDataLoadSucess extends TokenizeAction implements Action {
  readonly type = MATTER_LOAD_SUCESSS;
  constructor(public token: string, public payload: { response: MatterResponse, request: any }) { super(token); }
}
export class MatterDataLoadFail extends TokenizeAction implements Action {
  readonly type = MATTER_LOAD_FAIL;
  constructor(public token: string, error: any) { super(token); }
}
export class LoadDepartments extends TokenizeAction implements Action {
  readonly type = LOAD_DEPARTMENTS;
  constructor(public token: string) {
    super(token);
  }
}
export class LoadDepartmentSuccess extends TokenizeAction implements Action {
  readonly type = LOAD_DEPARTMENTS_SUCCESS;
  constructor(public token: string, public payload: { items: Department[] }) {
    super(token);
  }
}

export class LoadDepartmentFail extends TokenizeAction implements Action {
  readonly type = LOAD_DEPARTMENTS_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}

export class GoToOpenCase implements Action {
  readonly type = GO_TO_OPEN_CASE;
  constructor(public matter: GridRowItemWrapper) { }
}

export class LoadMatterFinance extends TokenizeAction implements Action {
  readonly type = LOAD_MATTER_FINANCE;
  constructor(public token: string, public selectedRowItem: GridRowItemWrapper) {
    super(token);
  }
}
export class LoadMatterFinanceSuccess extends TokenizeAction implements Action {
  readonly type = LOAD_MATTER_FINANCE_SUCCESS;
  constructor(public token: string, public payload: { selectedRowItem: GridRowItemWrapper, billsData: MatterFinance }) {
    super(token);
  }
}
export class LoadMatterFinanceFail extends TokenizeAction implements Action {
  readonly type = LOAD_MATTER_FINANCE_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}

export class LoadRowSelectData extends TokenizeAction implements Action {
  readonly type = LOAD_ROW_SELECT_DATA;
  constructor(public token, public payload: { selectedRowItem: GridRowItemWrapper }) { super(token); }
}
export class LoadRowExpanData extends TokenizeAction implements Action {
  readonly type = LOAD_ROW_EXPAN_DATA;
  constructor(public token, public payload: { selectedRowItem: GridRowItemWrapper }) { super(token); }
}
export class RefreshMatter extends TokenizeAction implements Action {
  readonly type = REFRESH_MATTER;
  constructor(public token) { super(token); }
}
export class ExitMatterSearchPopup extends TokenizeAction implements Action {
  readonly type = EXIT_MATTER_SEARCH_POPUP;
  constructor(public token) { super(token); }
}

export class GetMatterInfoAndExitMatterSearchPopup extends TokenizeAction implements Action {
  readonly type = GET_MATTER_INFO_AND_EXIT_MATTER_SEARCH_POPUP;
  constructor(public token, public matter: GridRowItemWrapper, public closePopup: EventEmitter<any>) { super(token); }
}


export class AddUpdateReviewData extends TokenizeAction implements Action {
  readonly type = ADD_UPDATE_REVIEW_DATA;
  constructor(public token: string, public reviewData: any) {
    super(token);
  }
}
export class AddUpdateReviewDataSuccess extends TokenizeAction implements Action {
  readonly type = ADD_UPDATE_REVIEW_DATA_SUCCESS;
  constructor(public token: string, public payload: { response: any }) {
    super(token);
  }
}
export class AddUpdateReviewDataFail extends TokenizeAction implements Action {
  readonly type = ADD_UPDATE_REVIEW_DATA_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}
export class GetReviewNotes extends TokenizeAction implements Action {
  readonly type = GET_REVIEW_DATA;
  constructor(public token: string, public request: CaseFileIdentityWithAppIdViewModel) {
    super(token);
  }
}
export class GetReviewNotesSuccess extends TokenizeAction implements Action {
  readonly type = GET_REVIEW_DATA_SUCCESS;
  constructor(public token: string, public payload: { response: ReviewNoteResponce }) {
    super(token);
  }
}
export class GetReviewNotesFail extends TokenizeAction implements Action {
  readonly type = GET_REVIEW_DATA_FAIL;
  constructor(public token: string) {
    super(token);
  }
}



export type Any = MatterViewChange | InitMatterView | InitMatterForMatterCreatePopup |
  LoadDepartments | LoadDepartmentSuccess | LoadDepartmentFail | MatterDataLoadSucess | MatterDataLoadFail |
  LoadMatterGridData | LoadMatterGridDataBySearchField | LoadMatterFinance | LoadMatterFinanceSuccess |
  LoadMatterFinanceFail | LoadRowExpanData | LoadRowSelectData | RefreshMatter | ExitMatterSearchPopup |
  AddUpdateReviewData | AddUpdateReviewDataSuccess | AddUpdateReviewDataFail | GetReviewNotes | GetReviewNotesSuccess |
  GetReviewNotesFail | GetMatterInfoAndExitMatterSearchPopup;


