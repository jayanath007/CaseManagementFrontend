import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core/index';
import { TreeDataResponse, TreeDataWrapper } from '../models/interfce';
import { ItemChangeKind } from '../models/enums';

export const INIT_FORMS_LIBRARY = 'DPS_INIT_FORMS_LIBRARY';
export const GET_FORMS_LIBRARY_DATA = 'DPS_GET_FORMS_LIBRARY_DATA';
export const GET_FORMS_LIBRARY_DATA_SUCCESS = 'DPS_GET_FORMS_LIBRARY_DATA_SUCCESS';
export const GET_FORMS_LIBRARY_DATA_FAIL = 'DPS_GET_FORMS_LIBRARY_DATA_FAIL';

export const TREE_ITEM_CHANGE = 'DPS_FORMS_LIBRARY_TREE_ITEM_CHANGE';
export const SEARCH_FORMS_LIBRARY_DATA = 'DPS_FORMS_LIBRARY_DATA';
export const FORMS_LIBRARY_RUN_LETTER_ENGIN = 'DPS_FORMS_LIBRARY_RUN_LETTER_ENGIN';
export const FORMS_LIBRARY_RESET_TREE = 'DPS_FORMS_LIBRARY_RESET_TREE';

export class InitFormsLibrary extends TokenizeAction implements Action {
  readonly type = INIT_FORMS_LIBRARY;
  constructor(public token: string, public payload: { matterData: { matterReferenceNo: string, appID: number } }) {
    super(token);
  }
}
export class GetFormsLibraryData extends TokenizeAction implements Action {
  readonly type = GET_FORMS_LIBRARY_DATA;
  constructor(public token: string) {
    super(token);
  }
}
export class GetFormsLibraryDatauccess extends TokenizeAction implements Action {
  readonly type = GET_FORMS_LIBRARY_DATA_SUCCESS;
  constructor(public token: string, public payload: { fileDirectoryTree: TreeDataResponse }) {
    super(token);
  }
}
export class GetFormsLibraryDataFail extends TokenizeAction implements Action {
  readonly type = GET_FORMS_LIBRARY_DATA_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}
export class SearchFormsLibraryData extends TokenizeAction implements Action {
  readonly type = SEARCH_FORMS_LIBRARY_DATA;
  constructor(public token: string, public payload: { searchText: string }) {
    super(token);
  }
}
export class TreeItemChange extends TokenizeAction implements Action {
  readonly type = TREE_ITEM_CHANGE;
  constructor(public token: string, public payload: { kind: ItemChangeKind, value: TreeDataWrapper }) { super(token); }
}
export class RunLetterEnging extends TokenizeAction implements Action {
  readonly type = FORMS_LIBRARY_RUN_LETTER_ENGIN;
  constructor(public token: string, public menuInfo: TreeDataWrapper) {
    super(token);
  }
}
export class ResetTree extends TokenizeAction implements Action {
  readonly type = FORMS_LIBRARY_RESET_TREE;
  constructor(public token: string) {
    super(token);
  }
}
export type Any = InitFormsLibrary | GetFormsLibraryData | GetFormsLibraryDatauccess | GetFormsLibraryDataFail |
  SearchFormsLibraryData | TreeItemChange | RunLetterEnging | ResetTree;
