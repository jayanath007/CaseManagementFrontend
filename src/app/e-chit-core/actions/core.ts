
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { ChequeRequestType } from '../models/enum';
import {
    DropdownListData, ShortcutType,
    Branch, VatCode, MatterBalance, EchitModel, EChitPopupInput, WorkflowEchitData, IncDisbuBreakDown, MatterRefData, ExtraEChitPopupInput
} from '../models/interfaces';
import { ClassObj } from './../../crime-management-core/models/interfaces';
import { AttType } from './../../core/lib/timeRecord';

export const INIT_E_CHIT = 'DPS_INIT_E_CHIT';
export const INIT_E_CHIT_SUCCESS = 'DPS_INIT_E_CHIT_SUCCESS';
export const INIT_E_CHIT_FAIL = 'DPS_INIT_E_CHIT_FAIL';

export const E_CHIT_TYPE_CHANGE = 'DPS_E_CHIT_TYPE_CHANGE';
export const E_CHIT_TYPE_CHANGE_SUCCESS = 'DPS_E_CHIT_TYPE_CHANGE_SUCCESS';
export const E_CHIT_TYPE_CHANGE_FAIL = 'DPS_E_CHIT_TYPE_CHANGE_FAIL';

export const GET_MATTER_BALANCES = 'DPS_E_CHIT_GET_MATTER_BALANCES';
export const GET_MATTER_BALANCES_SUCCESS = 'DPS_E_CHIT_GET_MATTER_BALANCES_SUCCESS';
export const GET_MATTER_BALANCES_FAIL = 'DPS_E_CHIT_GET_MATTER_BALANCES_FAIL';

export const ADD_ATTACHMENT = 'DPS_E_CHIT_ADD_ATTACHMENT';

export const INIT_E_CHIT_SAVE = 'DPS_INIT_E_CHIT_SAVE';
export const INIT_E_CHIT_SAVE_SUCCESS = 'DPS_INIT_E_CHIT_SAVE_SUCCESS';
export const INIT_E_CHIT_SAVE_FAIL = 'DPS_INIT_E_CHIT_SAVE_FAIL';

export const PRINT_ECHIT_WITH_FILE_PATH = 'PRINT_ECHIT_WITH_FILE_PATH';
export const PRINT_ECHIT_WITH_FILE_PATH_SUCCESS = 'PRINT_ECHIT_WITH_FILE_PATH_SUCCESS';
export const PRINT_ECHIT_WITH_FILE_PATH_FAIL = 'PRINT_ECHIT_WITH_FILE_PATH_FAIL';

export const PRINT_ECHIT = 'DPS_PRINT_ECHIT';
export const PRINT_ECHIT_SUCCESS = 'DPS_PRINT_ECHIT_SUCCESS';
export const PRINT_ECHIT_FAIL = 'DPS_PRINT_ECHIT_FAIL';

export const E_CHIT_CLEAR = 'DPS_E_CHIT_CLEAR';

export const GET_SUPPLIER_VAT_CODE = 'GET_E_CHIT_SUPPLIER_VAT_CODE';
export const GET_SUPPLIER_VAT_CODE_SUCCESS = 'GET_E_CHIT_SUPPLIER_VAT_CODE_SUCCESS';
export const GET_SUPPLIER_VAT_CODE_FAIL = 'GET_E_CHIT_SUPPLIER_VAT_CODE_FAIL';

export const E_CHIT_MATTER_SEARCH_POUP_OPEN = 'E_CHIT_MATTER_SEARCH_POUP_OPEN';
export const E_CHIT_MATTER_SEARCH_POUP_OPEN_SUCSEES = 'E_CHIT_MATTER_SEARCH_POUP_OPEN_SUCSEES';
export const E_CHIT_MATTER_SEARCH_POUP_OPEN_FAIL = 'E_CHIT_MATTER_SEARCH_POUP_OPEN_FAIL';

export const E_CHIT_TO_MATTER_SEARCH_POUP_OPEN = 'E_CHIT_TO_MATTER_SEARCH_POUP_OPEN';
export const E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_SUCSEES = 'E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_SUCSEES';
export const E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_FAIL = 'E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_FAIL';

export const E_CHIT_CLOSE = 'DPS_E_CHIT_CLOSE';
export const E_CHIT_CLOSED = 'DPS_E_CHIT_CLOSED';

export const CHANGE_DISBU_TYPES = 'DPS_CHANGE_DISBU_TYPES';

export const GET_PRECEDENTH_INC_DISB_BREAK_DOWN = 'DPS_GET_PRECEDENTH_INC_DISB_BREAK_DOWN';
export const GET_PRECEDENTH_INC_DISB_BREAK_DOWN_SUCCESS = 'DPS_GET_PRECEDENTH_INC_DISB_BREAK_DOWN_SUCSEES';
export const GET_PRECEDENTH_INC_DISB_BREAK_DOWN_FAIL = 'DPS_GET_PRECEDENTH_INC_DISB_BREAK_DOWN_FAIL';

export const ADD_PRECEDENT_H_DISBURSEMENT = 'DPS_ADD_PRECEDENT_H_DISBURSEMENT';
export const ADD_PRECEDENT_H_DISBURSEMENT_SUCCESS = 'DPS_ADD_PRECEDENT_H_DISBURSEMENT_SUCSEES';
export const ADD_PRECEDENT_H_DISBURSEMENT_FAIL = 'DPS_ADD_PRECEDENT_H_DISBURSEMENT_FAIL';

export const GET_DISBURSEMENT_TYPE = 'DPS_GET_DISBURSEMENT_TYPE';
export const GET_DISBURSEMENT_TYPE_SUCCESS = 'DPS_GET_DISBURSEMENT_TYPE_SUCSEES';
export const GET_DISBURSEMENT_TYPE_FAIL = 'DPS_GET_DISBURSEMENT_TYPE_FAIL';



export const CHANGE_DISBU_VALUE = 'DPS_CHANGE_DISBU_VALUE';
export const SAVE_DISBURCEMENT = 'DPS_SAVE_DISBURCEMENT';
export const GET_CLASS_TYPE = 'DPS_CHANGE_E_CHIT_GET_CLASS_TYPE';
export const GET_CLASS_TYPE_SUCCESS = 'DPS_CHANGE_E_CHIT_GET_CLASS_SUCCESS';
export const GET_CLASS_TYPE_FAIL = 'DPS_CHANGE_E_CHIT_GET_CLASS_FAIL';
export const CHANGE_CLASS_TYPE = 'DPS_CHANGE_E_CHIT_CHANGE_CLASS_TYPE';
export const LOAD_ATT_TYPE_LIST = 'E_CHIT_LOAD_ATT_TYPE_LIST';
export const LOAD_ATT_TYPE_LIST_SUCCESS = 'E_CHIT_LOAD_ATT_TYPE_LIST_SUCCESS';
export const LOAD_ATT_TYPE_LIST_FAIL = 'E_CHIT_LOAD_ATT_TYPE_LIST_FAIL';
export const CHANGE_ATT_TYPE = 'E_CHIT_CHANGE_ATT_TYPE';
export const CHANGE_EXTRA_INPUT = 'E_CHIT_CHANGE_EXTRA_INPUT';


export class InitEChit extends TokenizeAction implements Action {
    readonly type = INIT_E_CHIT;
    constructor(public token: string, public payload: { inputData?: EChitPopupInput, timeOffset: number }) {
        super(token);
    }
}
export class InitEChitSuccess extends TokenizeAction implements Action {
    readonly type = INIT_E_CHIT_SUCCESS;
    constructor(public token: string,
        public payload: {
            eChitTypes: DropdownListData[],
            supplierDocEnables: any,
            clientDefaults: any,
        }) {
        super(token);
    }
}
export class InitEChitFail extends TokenizeAction implements Action {
    readonly type = INIT_E_CHIT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class EChitClose extends TokenizeAction implements Action {
    readonly type = E_CHIT_CLOSE;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}

export class EChitClear extends TokenizeAction implements Action {
    readonly type = E_CHIT_CLEAR;
    constructor(public token: string, public payload: { inputData: any, timeOffset: number, diaryId?: number }) {
        super(token);
    }
}
export class InitEChitSave extends TokenizeAction implements Action {
    readonly type = INIT_E_CHIT_SAVE;
    constructor(public token: string, public payload: { model: EchitModel }) {
        super(token);
    }
}
export class InitEChitSaveSuccess extends TokenizeAction implements Action {
    readonly type = INIT_E_CHIT_SAVE_SUCCESS;
    constructor(public token: string,
        public payload: { data: any }) {
        super(token);
    }
}
export class InitEChitSaveFail extends TokenizeAction implements Action {
    readonly type = INIT_E_CHIT_SAVE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class PrintEChit extends TokenizeAction implements Action {
    readonly type = PRINT_ECHIT;
    constructor(public token: string, public payload: {
        diaryId: number, appCode: string, branchId: number,
        fileId: number, attachmentName: string, model?: any 
    }) {
        super(token);
    }
}
export class PrintEChitSuccess extends TokenizeAction implements Action {
    readonly type = PRINT_ECHIT_SUCCESS;
    constructor(public token: string,
        public payload: { data: any }) {
        super(token);
    }
}
export class PrintEChitFail extends TokenizeAction implements Action {
    readonly type = PRINT_ECHIT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class PrintEChitWithFilePath extends TokenizeAction implements Action {
    readonly type = PRINT_ECHIT_WITH_FILE_PATH;
    constructor(public token: string, public payload: { path: any, diaryId?: number }) {
        super(token);
    }
}
export class PrintEChitWithFilePathSuccess extends TokenizeAction implements Action {
    readonly type = PRINT_ECHIT_WITH_FILE_PATH_SUCCESS;
    constructor(public token: string,
        public payload: { data: any }) {
        super(token);
    }
}
export class PrintEChitWithFilePathFail extends TokenizeAction implements Action {
    readonly type = PRINT_ECHIT_WITH_FILE_PATH_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class EChitTypeChange extends TokenizeAction implements Action {
    readonly type = E_CHIT_TYPE_CHANGE;
    constructor(public token: string, public payload: {
        eChitType: ChequeRequestType,
        workflowEchitData?: WorkflowEchitData,
        timeOffset: number
    }
    ) {
        super(token);
    }
}
export class EChitTypeChangeSuccess extends TokenizeAction implements Action {
    readonly type = E_CHIT_TYPE_CHANGE_SUCCESS;
    constructor(public token: string, public payload: {
        payload: {
            eChitType: ChequeRequestType,
            workflowEchitData?: WorkflowEchitData
        },
        clearanceTypeList: DropdownListData[],
        referencesList: string[],
        vatCodeList: VatCode[],
        branchList: Branch[],
        reasonList: ShortcutType[],
        payeeList: ShortcutType[],
        payerList: ShortcutType[],
        feeEarneList: DropdownListData[],
        nominalList: DropdownListData[],
    }) {
        super(token);
    }
}
export class EChitTypeChangeFail extends TokenizeAction implements Action {
    readonly type = E_CHIT_TYPE_CHANGE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class GetMatterBalances extends TokenizeAction implements Action {
    readonly type = GET_MATTER_BALANCES;
    constructor(public token: string, public payload: { matterRef: string, controlName: string, matterDetailsName: string }) {
        super(token);
    }
}
export class GetMatterBalancesSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTER_BALANCES_SUCCESS;
    constructor(public token: string, public payload: { data: MatterBalance[], controlName: string }) {
        super(token);
    }
}
export class GetMatterBalancesFail extends TokenizeAction implements Action {
    readonly type = GET_MATTER_BALANCES_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class GetSupplierVatCode extends TokenizeAction implements Action {
    readonly type = GET_SUPPLIER_VAT_CODE;
    constructor(public token: string, public payload: { supplierRef: string }) {
        super(token);
    }
}
export class GetSupplierVatCodeSuccess extends TokenizeAction implements Action {
    readonly type = GET_SUPPLIER_VAT_CODE_SUCCESS;
    constructor(public token: string, public payload: { data: string }) {
        super(token);
    }
}
export class GetSupplierVatCodeFail extends TokenizeAction implements Action {
    readonly type = GET_SUPPLIER_VAT_CODE_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class EChitMatterSearchPoupOpen extends TokenizeAction implements Action {
    readonly type = E_CHIT_MATTER_SEARCH_POUP_OPEN;
    constructor(public token: string, public payload: { text: any }) {
        super(token);
    }
}
export class EChitMatterSearchPoupOpenSuccess extends TokenizeAction implements Action {
    readonly type = E_CHIT_MATTER_SEARCH_POUP_OPEN_SUCSEES;
    constructor(public token: string, public payload: { matterRefData: MatterRefData, extraData?: ExtraEChitPopupInput }) {
        super(token);
    }
}
export class EChitMatterSearchPoupOpenFail extends TokenizeAction implements Action {
    readonly type = E_CHIT_MATTER_SEARCH_POUP_OPEN_FAIL;
    constructor(public token: string, public payload: { matterRefData: MatterRefData }) {
        super(token);
    }
}
export class EChitToMatterSearchPoupOpenSuccess extends TokenizeAction implements Action {
    readonly type = E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_SUCSEES;
    constructor(public token: string, public payload: { toMatterRefData: any }) {
        super(token);
    }
}
export class EChitToMatterSearchPoupOpenFail extends TokenizeAction implements Action {
    readonly type = E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_FAIL;
    constructor(public token: string, public payload: { toMatterRefData: any }) {
        super(token);
    }
}
export class EChitToMatterSearchPoupOpen extends TokenizeAction implements Action {
    readonly type = E_CHIT_TO_MATTER_SEARCH_POUP_OPEN;
    constructor(public token: string, public payload: { text: any }) {
        super(token);
    }
}
export class AddAttachment extends TokenizeAction implements Action {
    readonly type = ADD_ATTACHMENT;
    constructor(public token: string, public payload: File) {
        super(token);
    }
}
export class EChitClosed extends TokenizeAction implements Action {
    readonly type = E_CHIT_CLOSED;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeDisbTypes extends TokenizeAction implements Action {
    readonly type = CHANGE_DISBU_TYPES;
    constructor(public token: string, public payload: { value: number, kind: string, feeEarner: string }) {
        super(token);
    }
}

export class GetPrecedentHIncDisbBreakDown extends TokenizeAction implements Action {
    readonly type = GET_PRECEDENTH_INC_DISB_BREAK_DOWN;
    constructor(public token: string, public payload: { value: number, kind: string, feeEarner: string }) {
        super(token);
    }
}
export class GetPrecedentHIncDisbBreakDownSuccess extends TokenizeAction implements Action {
    readonly type = GET_PRECEDENTH_INC_DISB_BREAK_DOWN_SUCCESS;
    constructor(public token: string, public payload: IncDisbuBreakDown[]) {
        super(token);
    }
}
export class GetPrecedentHIncDisbBreakDownFail extends TokenizeAction implements Action {
    readonly type = GET_PRECEDENTH_INC_DISB_BREAK_DOWN_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class AddPrecedentHDisbursement extends TokenizeAction implements Action {
    readonly type = ADD_PRECEDENT_H_DISBURSEMENT;
    constructor(public token: string, public payload: { diaryId: number, model: any }) {
        super(token);
    }
}
export class AddPrecedentHDisbursementSuccess extends TokenizeAction implements Action {
    readonly type = ADD_PRECEDENT_H_DISBURSEMENT_SUCCESS;
    constructor(public token: string, public payload: { data: string }) {
        super(token);
    }
}
export class AddPrecedentHDisbursementFail extends TokenizeAction implements Action {
    readonly type = ADD_PRECEDENT_H_DISBURSEMENT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class GetClassType extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE;
    constructor(public token: string, public payload: {
        branchId: number,
        appId: number,
        fileId: number

    }) { super(token); }
}

export class GetClassTypeSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_SUCCESS;
    constructor(public token: string, public payload: { list: ClassObj[] }) { super(token); }
}

export class GetClassTypeFail extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_FAIL;
    constructor(public token: string) { super(token); }
}

export class LoadAttTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST;
    constructor(public token: string, public classId: number) {
        super(token);
    }
}
export class LoadAttTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { attTypes: AttType[] }) {
        super(token);
    }
}
export class LoadAttTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeDisbValue extends TokenizeAction implements Action {
    readonly type = CHANGE_DISBU_VALUE;
    constructor(public token: string, public payload: { value: number, kind: string, feeEarner: string }) {
        super(token);
    }
}

export class SaveDisburcement extends TokenizeAction implements Action {
    readonly type = SAVE_DISBURCEMENT;
    constructor(public token: string, public payload: { diaryId: any, model?: any }) {
        super(token);
    }
}
export class ChangeClassType extends TokenizeAction implements Action {
    readonly type = CHANGE_CLASS_TYPE;
    constructor(public token: string, public payload: { selectedClass: number }) { super(token); }
}

export class ChangeAttType extends TokenizeAction implements Action {
    readonly type = CHANGE_ATT_TYPE;
    constructor(public token: string, public payload: { typeID: number }) { super(token); }
}

export class ChangeExtraEChitPopupInput extends TokenizeAction implements Action {
    readonly type = CHANGE_EXTRA_INPUT;
    constructor(public token: string, public input: ExtraEChitPopupInput) { super(token); }
}

export class GetDisbursementType extends TokenizeAction implements Action {
    readonly type = GET_DISBURSEMENT_TYPE;
    constructor(public token: string, public matterDate: any) {
        super(token);
    }
}
export class GetDisbursementTypeSuccess extends TokenizeAction implements Action {
    readonly type = GET_DISBURSEMENT_TYPE_SUCCESS;
    constructor(public token: string, public payload: { disburcementTypes: any }) {
        super(token);
    }
}
export class GetDisbursementTypeFail extends TokenizeAction implements Action {
    readonly type = GET_DISBURSEMENT_TYPE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}



export type Any = InitEChit | InitEChitSuccess | InitEChitFail | EChitClosed |
    InitEChitSave | InitEChitSaveSuccess | InitEChitSaveFail |
    EChitTypeChange | EChitTypeChangeSuccess | EChitTypeChangeFail |
    GetMatterBalances | GetMatterBalancesSuccess | AddAttachment |
    PrintEChit | PrintEChitSuccess | PrintEChitFail | EChitClear
    | PrintEChitWithFilePath | PrintEChitWithFilePathSuccess | PrintEChitWithFilePathFail
    | GetSupplierVatCode | GetSupplierVatCodeSuccess | GetSupplierVatCodeFail
    | EChitClose | EChitMatterSearchPoupOpen | EChitMatterSearchPoupOpenSuccess | EChitToMatterSearchPoupOpen
    | EChitToMatterSearchPoupOpenSuccess | EChitMatterSearchPoupOpenFail | EChitToMatterSearchPoupOpenFail | ChangeDisbTypes
    | GetPrecedentHIncDisbBreakDown | GetPrecedentHIncDisbBreakDownSuccess | GetPrecedentHIncDisbBreakDownFail |
    AddPrecedentHDisbursement | AddPrecedentHDisbursementSuccess | AddPrecedentHDisbursementFail | ChangeDisbValue | SaveDisburcement
    | EChitToMatterSearchPoupOpenSuccess | EChitMatterSearchPoupOpenFail | EChitToMatterSearchPoupOpenFail |
    GetClassType | GetClassTypeSuccess | GetClassTypeFail | LoadAttTypeList | LoadAttTypeListSuccess | LoadAttTypeListFail |
    ChangeClassType | ChangeAttType | ChangeExtraEChitPopupInput | GetDisbursementType |
    GetDisbursementTypeSuccess | GetDisbursementTypeFail;

