// import { EChitPopupInput } from './../models/interfaces';
import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';
import { PageEvent } from '@angular/material';
import { BillingGuideAnalysisType } from '../models/enum';
import { BillingGuideViewModel, BilledValueResponse } from '../models/interfaces';
import { WindowSpec } from '../../document-view/models/interfaces';

export const INIT_BILLING_GUIDE = 'INIT_INIT_BILLING_GUIDE';
export const GET_INIT_BILLING_GUIDE_DATA = 'GET_INIT_BILLING_GUIDE_DATA';
export const OPEN_BY_URL = 'OPEN_BY_URL';




export const BILLING_GUIDE_ANALYSIS_CHANGE = 'DPS_BILLING_GUIDE_ANALYSIS_CHANGE';
export const INIT_BILLING_GUIDE_SUCCESS = 'INIT_BILLING_GUIDE_SUCCESS';
export const INIT_BILLING_GUIDE_FAIL = 'INIT_BILLING_GUIDE_FAIL';

export const BILLING_GUIDE_ANALYSIS_CLOSE_SAVE = 'DPS_BILLING_GUIDE_ANALYSIS_CLOSE_SAVE';
export const BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_SUCCESS = 'DPS_BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_SUCCESS';
export const BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_FAIL = 'BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_FAIL';




export const BILLING_GUIDE_SUBMIT = 'DPS_BILLING_GUIDE_SUBMIT';
export const BILLING_GUIDE_SUBMIT_SUCCESS = 'DPS_BILLING_GUIDE_SUBMIT_SUCCESS';
export const BILLING_GUIDE_SUBMIT_FAIL = 'DPS_BILLING_GUIDE_SUBMIT_FAIL';

export const GET_DOCUMENT_URL = 'DPS_GET_DOCUMENT_URL';
export const GET_DOCUMENT_URL_SUCCESS = 'DPS_GET_DOCUMENT_URL_SUCCESS';
export const GET_DOCUMENT_URL_FAIL = 'DPS_GET_DOCUMENT_URL_FAIL';





export class InitBillingGuide extends TokenizeAction implements Action {
    readonly type = INIT_BILLING_GUIDE;
    constructor(public token: string, public payload: { inputValue: any }) {
        super(token);
    }
}

export class InitBillingGuideSuccess extends TokenizeAction implements Action {
    readonly type = INIT_BILLING_GUIDE_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}



export class GetInitBillingGuideData extends TokenizeAction implements Action {
    readonly type = GET_INIT_BILLING_GUIDE_DATA;
    constructor(public token: string, public payload: { responce: any }) {
        super(token);
    }
}



export class BillingGuideAnalysisChange extends TokenizeAction implements Action {
    readonly type = BILLING_GUIDE_ANALYSIS_CHANGE;
    constructor(public token: string, public payload: { selectedType: BillingGuideAnalysisType }) {
        super(token);
    }
}
export class BillingGuideSubmit extends TokenizeAction implements Action {
    readonly type = BILLING_GUIDE_SUBMIT;
    constructor(public token: string, public payload: { inputData: BillingGuideViewModel }) {
        super(token);
    }
}

export class BillingGuideSubmitSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_GUIDE_SUBMIT_SUCCESS;

    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}

export class BillingGuideAnalysisCloseSave extends TokenizeAction implements Action {
    readonly type = BILLING_GUIDE_ANALYSIS_CLOSE_SAVE;
    constructor(public token: string, public payload: { data: null }) {
        super(token);
    }
}

export class BillingGuideAnalysisCloseSaveSuccess extends TokenizeAction implements Action {
    readonly type = BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class  BillingGuideAnalysisCloseSaveFail extends TokenizeAction implements Action {
    readonly type = BILLING_GUIDE_ANALYSIS_CLOSE_SAVE_FAIL;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}

export class OpenByUrl implements Action {
    readonly type = OPEN_BY_URL;
    constructor(public payload: { url: string, id: string, spec: WindowSpec }) { }
}
export class BillingGuideSubmitFail extends TokenizeAction implements Action {
    readonly type = BILLING_GUIDE_SUBMIT_FAIL;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}


export type Any = InitBillingGuide | BillingGuideAnalysisChange | BillingGuideSubmit
    | BillingGuideSubmitSuccess | BillingGuideSubmitFail | InitBillingGuideSuccess |BillingGuideAnalysisCloseSaveSuccess
    |BillingGuideAnalysisCloseSaveFail;
