import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { CategoryResponce, IhtFormsData, ProbateResponse, ResidenceNilRateBandData, SpouseorCivilPatnerData } from '../models/interfaces';



export const INIT_PROBATE = 'DPS_INIT_PROBATE';

export const GET_PROBATE_DATA = 'DPS_GET_PROBATE_DATA';
export const GET_PROBATE_DATA_SUCCESS = 'DPS_GET_PROBATE_DATA_SUCCESS';
export const GET_PROBATE_DATA_FAIL = 'DPS_GET_PROBATE_DATA_FAIL';

export const GET_DROPDOWN_CATEGORIES = 'DPS_GET_DROPDOWN_CATEGORIES';
export const GET_DROPDOWN_CATEGORIES_SUCCESS = 'DPS_GET_DROPDOWN_CATEGORIES_SUCCESS';
export const GET_DROPDOWN_CATEGORIES_FAIL = 'DPS_GET_DROPDOWN_CATEGORIES_FAIL';

export const RNRB_DATA_UPDATE = 'DPS_RNRB_DATA_UPDATE';
export const RNRB_DATA_UPDATE_SUCCESS = 'DPS_RNRB_DATA_UPDATE_SUCCESS';
export const RNRB_DATA_UPDATE_FAIL = 'DPS_RNRB_DATA_UPDATE_FAIL';

export const SAVE_PROBATE_ACCOUNT_ITEM = 'DPS_SAVE_PROBATE_ACCOUNT_ITEM';
export const SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS = 'DPS_SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS';
export const SAVE_PROBATE_ACCOUNT_ITEM_FAIL = 'DPS_SAVE_PROBATE_ACCOUNT_ITEM_FAIL';

export const EDIT_TRANSACTION_CLICK = 'DPS_EDIT_TRANSACTION_CLICK';
export const EDIT_DISTRIBUTION_CLICK = 'DPS_EDIT_DISTRIBUTION_CLICK';

export const REFRESH_PROBATE_DATA = 'DPS_REFRESH_PROBATE_DATA';
export const REFRESH_PROBATE_DATA_SUCCESS = 'DPS_REFRESH_PROBATE_DATA_SUCCESS';
export const REFRESH_PROBATE_DATA_FAIL = 'DPS_REFRESH_PROBATE_DATA_FAIL';

export const DELETE_PROBATE_ACCOUNT_DATA = 'DPS_DELETE_PROBATE_ACCOUNT_DATA';
export const DELETE_PROBATE_ACCOUNT_DATA_SUCCESS = 'DPS_DELETE_PROBATE_ACCOUNT_DATA_SUCCESS';
export const DELETE_PROBATE_ACCOUNT_DATA_FAIL = 'DPS_DELETE_PROBATE_ACCOUNT_DATA_FAIL';

export const DELETE_PROBATE_DATA = 'DPS_DELETE_PROBATE_DATA';
export const DELETE_PROBATE_DATA_SUCCESS = 'DPS_DELETE_PROBATE_DATA_SUCCESS';
export const DELETE_PROBATE_DATA_FAIL = 'DPS_DELETE_PROBATE_DATA_FAIL';

export const SELECTED_ROW_CLICK = 'DPS_SELECTED_ROW_CLICK';

export const CLEAR_ACCOUNT_DATA = 'DPS_CLEAR_ACCOUNT_DATA';

export const PROBATE_IHT_GENERATE_FORM = 'DPS_PROBATE_IHT_GENERATE_FORM';
export const PROBATE_IHT_GENERATE_FORM_SUCCESS = 'DPS_PROBATE_IHT_GENERATE_FORM_SUCCESS';
export const PROBATE_IHT_GENERATE_FORM_FAIL = 'DPS_PROBATE_IHT_GENERATE_FORM_FAIL';

export const PROBATE_IHT_GENERATE_ACCOUNTS = 'DPS_PROBATE_IHT_GENERATE_ACCOUNTS';
export const PROBATE_IHT_GENERATE_ACCOUNTS_SUCCESS = 'DPS_PROBATE_IHT_GENERATE_ACCOUNTS_SUCCESS';
export const PROBATE_IHT_GENERATE_ACCOUNTS_FAIL = 'DPS_PROBATE_IHT_GENERATE_ACCOUNTS_FAIL';


export const PROBATE_OPEN_IHT_FORM = 'DPS_PROBATE_OPEN_IHT_FORM';
export const PROBATE_OPEN_IHT_FORM_SUCCESS = 'DPS_PROBATE_OPEN_IHT_FORM_SUCCESS';
export const PROBATE_OPEN_IHT_FORM_FAIL = 'DPS_PROBATE_OPEN_IHT_FORM_FAIL';


export class InitProbate extends TokenizeAction implements Action {
    readonly type = INIT_PROBATE;
    constructor(public token: string, public payload: { data: any; }) { super(token); }
}



export class GetProbateData extends TokenizeAction implements Action {
    readonly type = GET_PROBATE_DATA;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class GetProbateDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_PROBATE_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: ProbateResponse }) {
        super(token);
    }
}
export class GetProbateDataFail extends TokenizeAction implements Action {
    readonly type = GET_PROBATE_DATA_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}
export class GetDropDownCategories extends TokenizeAction implements Action {
    readonly type = GET_DROPDOWN_CATEGORIES;
    constructor(public token: string) {
        super(token);
    }
}
export class GetDropDownCategoriesSuccess extends TokenizeAction implements Action {
    readonly type = GET_DROPDOWN_CATEGORIES_SUCCESS;
    constructor(public token: string, public payload: { data: CategoryResponce }) {
        super(token);
    }
}
export class GetDropDownCategoriesFail extends TokenizeAction implements Action {
    readonly type = GET_DROPDOWN_CATEGORIES_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class RnrbDataUpdate extends TokenizeAction implements Action {
    readonly type = RNRB_DATA_UPDATE;
    constructor(public token: string, public rnrbUpdateData: ResidenceNilRateBandData,
        public spouserCivilData: SpouseorCivilPatnerData) {
        super(token);
    }
}
export class RnrbDataUpdateSuccess extends TokenizeAction implements Action {
    readonly type = RNRB_DATA_UPDATE_SUCCESS;
    constructor(public token: string, public payload: { data: any },
        public rnrbUpdateData: ResidenceNilRateBandData, public spouserCivilData: SpouseorCivilPatnerData) {
        super(token);
    }
}
export class RnrbDataUpdateFail extends TokenizeAction implements Action {
    readonly type = RNRB_DATA_UPDATE_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class SaveProbateAccountItem extends TokenizeAction implements Action {
    readonly type = SAVE_PROBATE_ACCOUNT_ITEM;
    constructor(public token: string, public accountData: any) {
        super(token);
    }
}
export class SaveProbateAccountItemSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class SaveProbateAccountItemFail extends TokenizeAction implements Action {
    readonly type = SAVE_PROBATE_ACCOUNT_ITEM_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class RefreshProbateData extends TokenizeAction implements Action {
    readonly type = REFRESH_PROBATE_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class RefreshProbateDataSuccess extends TokenizeAction implements Action {
    readonly type = REFRESH_PROBATE_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: ProbateResponse }) {
        super(token);
    }
}
export class RefreshProbateDataFail extends TokenizeAction implements Action {
    readonly type = REFRESH_PROBATE_DATA_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}



export class EditTransactionClick extends TokenizeAction implements Action {
    readonly type = EDIT_TRANSACTION_CLICK;
    constructor(public token: string, public rowData: any) {
        super(token);
    }
}

export class EditDistributionClick extends TokenizeAction implements Action {
    readonly type = EDIT_DISTRIBUTION_CLICK;
    constructor(public token: string, public rowData: any) {
        super(token);
    }
}



export class DeleteProbateAccountItem extends TokenizeAction implements Action {
    readonly type = DELETE_PROBATE_ACCOUNT_DATA;
    constructor(public token: string, public probateId: any) {
        super(token);
    }
}
export class DeleteProbateAccountItemSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_PROBATE_ACCOUNT_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class DeleteProbateAccountItemFail extends TokenizeAction implements Action {
    readonly type = DELETE_PROBATE_ACCOUNT_DATA_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class SelectedRowClick extends TokenizeAction implements Action {
    readonly type = SELECTED_ROW_CLICK;
    constructor(public token: string, public row: any) {
        super(token);
    }
}


export class DeleteProbateItem extends TokenizeAction implements Action {
    readonly type = DELETE_PROBATE_DATA;
    constructor(public token: string, public probateId: any) {
        super(token);
    }
}
export class DeleteProbateItemSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_PROBATE_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class DeleteProbateItemFail extends TokenizeAction implements Action {
    readonly type = DELETE_PROBATE_DATA_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class ClearAccountData extends TokenizeAction implements Action {
    readonly type = CLEAR_ACCOUNT_DATA;
    constructor(public token: string) {
        super(token);
    }
}

// IHT form
export class ProbateIhtGenerateForm extends TokenizeAction implements Action {
    readonly type = PROBATE_IHT_GENERATE_FORM;
    constructor(public token: string, public data: { isForce400: boolean; isForce205: boolean }) {
        super(token);
    }
}
export class ProbateIhtGenerateFormSuccess extends TokenizeAction implements Action {
    readonly type = PROBATE_IHT_GENERATE_FORM_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class ProbateIhtGenerateFormFail extends TokenizeAction implements Action {
    readonly type = PROBATE_IHT_GENERATE_FORM_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class ProbateIhtGenerateAccounts extends TokenizeAction implements Action {
    readonly type = PROBATE_IHT_GENERATE_ACCOUNTS;
    constructor(public token: string, public data: any) {
        super(token);
    }
}
export class ProbateIhtGenerateAccountsSuccess extends TokenizeAction implements Action {
    readonly type = PROBATE_IHT_GENERATE_ACCOUNTS_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class ProbateIhtGenerateAccountsFail extends TokenizeAction implements Action {
    readonly type = PROBATE_IHT_GENERATE_ACCOUNTS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class ProbateOpenIhtForm extends TokenizeAction implements Action {
    readonly type = PROBATE_OPEN_IHT_FORM;
    constructor(public token: string, public row: IhtFormsData) {
        super(token);
    }
}

export class ProbateOpenIhtFormSuccess extends TokenizeAction {
    readonly type = PROBATE_OPEN_IHT_FORM_SUCCESS;
    constructor(public token: string, public diaryId: number, public url: string) {
        super(token);
    }
}
export class ProbateOpenIhtFormFail extends TokenizeAction {
    readonly type = PROBATE_OPEN_IHT_FORM_FAIL;
    constructor(public token: string) {
        super(token);
    }
}







export type Any = InitProbate | GetProbateData | GetProbateDataSuccess | GetProbateDataFail |
    GetDropDownCategories | GetDropDownCategoriesSuccess | GetDropDownCategoriesFail | RnrbDataUpdate
    | RnrbDataUpdateSuccess | RnrbDataUpdateFail | SaveProbateAccountItem | SaveProbateAccountItemSuccess | SaveProbateAccountItemFail |
    EditTransactionClick | DeleteProbateAccountItem | DeleteProbateAccountItemSuccess | DeleteProbateAccountItemFail | EditDistributionClick
    | RefreshProbateData | RefreshProbateDataSuccess | RefreshProbateDataFail | SelectedRowClick | DeleteProbateItem
    | DeleteProbateItemSuccess | DeleteProbateItemFail | ClearAccountData | ProbateIhtGenerateForm
    | ProbateIhtGenerateFormSuccess | ProbateIhtGenerateFormFail | ProbateIhtGenerateAccounts | ProbateIhtGenerateAccountsSuccess
    | ProbateIhtGenerateAccountsFail | ProbateOpenIhtForm | ProbateOpenIhtFormSuccess | ProbateOpenIhtFormFail
    ;
