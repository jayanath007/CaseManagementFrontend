import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core/index';
import { CommonControllerTypes, FormType, Mode } from '../models/enums';
import {
  CategoryItem, ContactDetails, EstateOverviewModel,
  ProbateCategoryList, PaymentGridDataModel, EditPaymentGridData, AssetItemForDropDown, EOMatterData
} from '../models/interfce';

export const INIT_PROBATE_ESTATE_OVERVIEW = 'INIT_PROBATE_ESTATE_OVERVIEW';

export const GET_ESTATE_OVERVIEW_CATEGORY_LIST = 'ESTATE_OVERVIEW_GET_CATEGORY_LIST';
export const GET_ESTATE_OVERVIEW_CATEGORY_LIST_SUCCESS = 'ESTATE_OVERVIEW_GET_CATEGORY_LIST_SUCCESS';
export const GET_ESTATE_OVERVIEW_CATEGORY_LIST_FAIL = 'ESTATE_OVERVIEW_GET_CATEGORY_LIST_FAIL';

export const GET_EO_EDIT_DATA = 'GET_EO_EDIT_DATA';
export const GET_EO_EDIT_DATA_SUCCESS = 'GET_EO_EDIT_DATA_SUCCESS';
export const GET_EO_EDIT_DATA_FAIL = 'GET_EO_EDIT_DATA_FAIL';

export const ESTATE_OVERVIEW_UPDATE_CONTACT = 'ESTATE_OVERVIEW_UPDATE_CONTACT';
export const ESTATE_OVERVIEW_REMOVE_CONTACT = 'ESTATE_OVERVIEW_REMOVE_CONTACT';
export const ESTATE_OVERVIEW_SAVE = 'ESTATE_OVERVIEW_SAVE';
export const ESTATE_OVERVIEW_SAVE_SUCCESS = 'ESTATE_OVERVIEW_SAVE_SUCCESS';
export const ESTATE_OVERVIEW_SAVE_FAIL = 'ESTATE_OVERVIEW_SAVE_FAIL';

export const ESTATE_OVERVIEW_SET_SELECTED_CATEGORY = 'ESTATE_OVERVIEW_SET_SELECTED_CATEGORY';
export const ESTATE_OVERVIEW_UPDATE_MODEL = 'ESTATE_OVERVIEW_UPDATE_MODEL';
export const ESTATE_OVERVIEW_UPDATE_MASTER_VALUE = 'ESTATE_OVERVIEW_UPDATE_MASTER_VALUE';
export const ESTATE_OVERVIEW_PAYMENT_GRID_UPDATE = 'ESTATE_OVERVIEW_PAYMENT_GRID_UPDATE';
export const ESTATE_OVERVIEW_INPUT_VALUE_CHANGE = 'ESTATE_OVERVIEW_INPUT_VALUE_CHANGE';
export const ESTATE_OVERVIEW_GRID_SELECT_ROW = 'ESTATE_OVERVIEW_GRID_SELECT_ROW';

export const ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA = 'ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA';
export const ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_SUCCESS = 'ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_SUCCESS';
export const ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_FAIL = 'ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_FAIL';

export const GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST = 'GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST';
export const GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_SUCCESS = 'GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_SUCCESS';
export const GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_FAIL = 'GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_FAIL';

export class InitEstateOverview extends TokenizeAction implements Action {
  readonly type = INIT_PROBATE_ESTATE_OVERVIEW;
  constructor(public token: string, public payload: {
    inputData: {
      matterData: {
        branchId: number,
        appId: number,
        fileId: number,
      }
      formType: FormType,
      mode: Mode,
      editData: any
    }
  }) {
    super(token);
  }
}
export class GetCategoryList extends TokenizeAction implements Action {
  readonly type = GET_ESTATE_OVERVIEW_CATEGORY_LIST;
  constructor(public token: string) {
    super(token);
  }
}
export class GetCategoryListSuccess extends TokenizeAction implements Action {
  readonly type = GET_ESTATE_OVERVIEW_CATEGORY_LIST_SUCCESS;
  constructor(public token: string, public payload: { categoryList: ProbateCategoryList }) {
    super(token);
  }
}
export class GetCategoryListFail extends TokenizeAction implements Action {
  readonly type = GET_ESTATE_OVERVIEW_CATEGORY_LIST_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}

export class GetEditData extends TokenizeAction implements Action {
  readonly type = GET_EO_EDIT_DATA;
  constructor(public token: string, public estateOverviewRow: any) {
    super(token);
  }
}
export class GetEditDataSuccess extends TokenizeAction implements Action {
  readonly type = GET_EO_EDIT_DATA_SUCCESS;
  constructor(public token: string, public payload: { editData: EstateOverviewModel }) {
    super(token);
  }
}
export class GetEditDataFail extends TokenizeAction implements Action {
  readonly type = GET_EO_EDIT_DATA_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}

export class UpdateContact extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_UPDATE_CONTACT;
  constructor(public token: string, public payload: { contactDetails: ContactDetails }) {
    super(token);
  }
}
export class RemoveContact extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_REMOVE_CONTACT;
  constructor(public token: string) {
    super(token);
  }
}
export class SaveEstateOverviewData extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_SAVE;
  constructor(public token: string) {
    super(token);
  }
}
export class SaveEstateOverviewDataSuccess extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_SAVE_SUCCESS;
  constructor(public token: string, public payload: { probateTransId: number }) {
    super(token);
  }
}
export class SaveEstateOverviewDataFail extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_SAVE_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}
export class SetSelectedCategory extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_SET_SELECTED_CATEGORY;
  constructor(public token: string, public selectedItem: CategoryItem) {
    super(token);
  }
}
export class UpdateModel extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_UPDATE_MODEL;
  constructor(public token: string, public payload: { type: CommonControllerTypes, property: string, value: any }) {
    super(token);
  }
}
export class UpdateMasterValue extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_UPDATE_MASTER_VALUE;
  constructor(public token: string, public payload: { property: string, value: any }) {
    super(token);
  }
}
export class PaymentGridDataUpdate extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_PAYMENT_GRID_UPDATE;
  constructor(public token: string, public payload: { rowData: PaymentGridDataModel<EditPaymentGridData> }) {
    super(token);
  }
}
export class InputValueChange extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_INPUT_VALUE_CHANGE;
  constructor(public token: string, public payload: { type: CommonControllerTypes, property: string, value: any }) { super(token); }
}
export class DeleteProbateAccountItem extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA;
  constructor(public token: string) {
    super(token);
  }
}
export class DeleteProbateAccountItemSuccess extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_SUCCESS;
  constructor(public token: string, public rowId: number) {
    super(token);
  }
}
export class DeleteProbateAccountItemFail extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_FAIL;
  constructor(public token: string, public error: any) {
    super(token);
  }
}
export class GridSelectRow extends TokenizeAction implements Action {
  readonly type = ESTATE_OVERVIEW_GRID_SELECT_ROW;
  constructor(public token: string, public row: PaymentGridDataModel<EditPaymentGridData>) {
    super(token);
  }
}
export class GetJointlyOwnedAssetsList extends TokenizeAction implements Action {
  readonly type = GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST;
  constructor(public token: string, public payload: { matterData: EOMatterData, formType: FormType, category: CategoryItem }) {
    super(token);
  }
}
export class GetJointlyOwnedAssetsListSuccess extends TokenizeAction implements Action {
  readonly type = GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_SUCCESS;
  constructor(public token: string, public payload: { assetItemForDropDown: AssetItemForDropDown[] }) {
    super(token);
  }
}
export class GetJointlyOwnedAssetsListFail extends TokenizeAction implements Action {
  readonly type = GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}
export type Any = InitEstateOverview | GetCategoryList | GetCategoryListSuccess | GetCategoryListFail | SetSelectedCategory |
  GetEditData | GetEditDataSuccess | GetEditDataFail | UpdateModel | UpdateMasterValue | PaymentGridDataUpdate | InputValueChange |
  UpdateContact | RemoveContact | SaveEstateOverviewData | SaveEstateOverviewDataSuccess | SaveEstateOverviewDataFail |
  DeleteProbateAccountItem | DeleteProbateAccountItemSuccess | DeleteProbateAccountItemFail | GridSelectRow | GetJointlyOwnedAssetsList |
  GetJointlyOwnedAssetsListSuccess | GetJointlyOwnedAssetsListFail;
