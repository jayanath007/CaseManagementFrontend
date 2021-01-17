import { TokenizeAction } from '../../core';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { Cds7ReportInfoView } from '../reducers/cds7-report-info';
import { MatDialogRef } from '@angular/material';

export const INIT_CDS7 = 'INIT_CDS7';

export const GET_CDS7_REPORT_INFO = 'GET_CDS7_REPORT_INFO';
export const GET_CDS7_REPORT_INFO_SUCCESS = 'GET_CDS7_REPORT_INFO_SUCCESS';
export const GET_CDS7_REPORT_INFO_FAIL = 'GET_CDS7_REPORT_INFO_FAIL';
export const CHANGE_MODEL = 'CDS7_CHANGE_MODEL';
export const SAVE = 'CDS7_SAVE';
export const SAVE_SUCCESS = 'CDS7_SAVE_SUCCESS';
export const SAVE_FAIL = 'CDS7_SAVE_FAIL';

export class InitCDS7 extends TokenizeAction {
    readonly type = INIT_CDS7;
    constructor(public token: string, public input: CrimeClassIdentityViewModel) {
        super(token);
    }
}

export class GetCDS7ReportInfo extends TokenizeAction {
    readonly type = GET_CDS7_REPORT_INFO;
    constructor(public token: string, public input: CrimeClassIdentityViewModel) {
        super(token);
    }
}

export class GetCDS7ReportInfoSuccess extends TokenizeAction {
    readonly type = GET_CDS7_REPORT_INFO_SUCCESS;
    constructor(public token: string, public info: Cds7ReportInfoView, public casetype: string[]) {
        super(token);
    }
}

export class GetCDS7ReportInfoFail extends TokenizeAction {
    readonly type = GET_CDS7_REPORT_INFO_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeModel extends TokenizeAction {
    readonly type = CHANGE_MODEL;
    constructor(public token: string, public payload: { key: string, value: any }) {
        super(token);
    }
}

export class Save extends TokenizeAction {
    readonly type = SAVE;
    constructor(public token: string, public popupDialog: MatDialogRef<any>) {
        super(token);
    }
}

export class SaveSuccess extends TokenizeAction {
    readonly type = SAVE_SUCCESS;
    constructor(public token: string, public popupDialog: MatDialogRef<any>) {
        super(token);
    }
}

export class SaveFail extends TokenizeAction {
    readonly type = SAVE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}


export type Any = InitCDS7 | GetCDS7ReportInfo | GetCDS7ReportInfoSuccess | GetCDS7ReportInfoFail | ChangeModel |
    Save | SaveSuccess | SaveFail;
