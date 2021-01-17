
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core/index';
import { PageSetupData, PageSetupResponce } from '../models/interfce';
import { PageSetupChangeKind } from '../models/enum';

export const INIT_PAGE_SETUP = 'DPS_INIT_PAGE_SETUP';
export const GET_PAGE_SETUP_DATA = 'DPS_GET_PAGE_SETUP_DATA';
export const GET_PAGE_SETUP_DATA_SUCCESS = 'DPS_GET_PAGE_SETUP_DATA_SUCCESS';
export const GET_PAGE_SETUP_DATA_FAIL = 'DPS_GET_PAGE_SETUP_DATA_FAIL';
export const SET_CHANGE_PAGE_SETUP_VALUE = 'DPS_SET_CHANGE_PAGE_SETUP_VALUE';

export const SAVE_PALGE_SETUP_CHANGES = 'DPS_SAVE_PALGE_SETUP_CHANGES';
export const SAVE_PALGE_SETUP_CHANGES_SUCCESS = 'DPS_SAVE_PALGE_SETUP_CHANGES_SUCCESS';
export const SAVE_PALGE_SETUP_CHANGES_FAIL = 'DPS_SAVE_PALGE_SETUP_CHANGES_FAIL';

export const DIFFERENT_FIRST_PAGE = 'DPS_DIFFERENT_FIRST_PAGE';
export const DIFFERENT_PAGE_HEADER_FOOTER = 'DPS_DIFFERENT_PAGE_HEADER_FOOTER';

// export const SET_SELECTED_POSTING_PERIOD = 'DPS_SET_SELECTED_POSTING_PERIOD';

export class InitPageSetup extends TokenizeAction implements Action {
  readonly type = INIT_PAGE_SETUP;
  constructor(public token: string, public payload: { inputData: string }) {
    super(token);
  }
}
export class GetPageSetupData extends TokenizeAction implements Action {
  readonly type = GET_PAGE_SETUP_DATA;
  constructor(public token: string) {
    super(token);
  }
}
export class GetPageSetupDataSuccess extends TokenizeAction implements Action {
  readonly type = GET_PAGE_SETUP_DATA_SUCCESS;
  constructor(public token: string, public payload: { pageSetupData: PageSetupResponce }) {
    super(token);
  }
}
export class GetPageSetupDataFail extends TokenizeAction implements Action {
  readonly type = GET_PAGE_SETUP_DATA_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}

export class SetChangePagesetupValue extends TokenizeAction implements Action {
  readonly type = SET_CHANGE_PAGE_SETUP_VALUE;
  constructor(public token: string, public payload: { page: string, kind: PageSetupChangeKind, value: number }) {
    super(token);
  }
}

export class SaveSetupChanges extends TokenizeAction implements Action {
  readonly type = SAVE_PALGE_SETUP_CHANGES;
  constructor(public token: string) {
    super(token);
  }
}
export class SaveSetupChangesSuccess extends TokenizeAction implements Action {
  readonly type = SAVE_PALGE_SETUP_CHANGES_SUCCESS;
  constructor(public token: string, public payload: { responce: any }) {
    super(token);
  }
}
export class SaveSetupChangesFail extends TokenizeAction implements Action {
  readonly type = SAVE_PALGE_SETUP_CHANGES_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}

export class DifferentFirstPage extends TokenizeAction implements Action {
  readonly type = DIFFERENT_FIRST_PAGE;
  constructor(public token: string, public defferentFirstPage: boolean) {
    super(token);
  }
}
export class DifferentPageHeaderFooter extends TokenizeAction implements Action {
  readonly type = DIFFERENT_PAGE_HEADER_FOOTER;
  constructor(public token: string, public defferentPageHeaderFooter: boolean) {
    super(token);
  }
}

export type Any = InitPageSetup | GetPageSetupData | GetPageSetupDataSuccess | GetPageSetupDataFail | SetChangePagesetupValue
  | SaveSetupChanges | SaveSetupChangesSuccess | SaveSetupChangesFail | DifferentFirstPage | DifferentPageHeaderFooter;
