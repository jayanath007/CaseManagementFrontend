import { TokenizeAction } from '../../core';
import { BundleMonitorInput } from '../models/interfaces';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';

export const INIT_BUNDLE_MONITOR = 'INIT_BUNDLE_MONITOR';
export const SELECT_ITEM = 'BUNDLE_MONITOR_SELECT_ITEM';
export const LOAD_DATA = 'DPS_BM_LOAD_DATA';
export const LOAD_DATA_SUCCESS = 'DPS_BM_LOAD_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'DPS_BM_LOAD_DATA_FAIL';
export const REFRESH = 'DPS_BM_REFRESH';
export const CHANGE_SEARCH_BUNDLE_ID = 'DPS_BM_CHANGE_SEARCH_BUNDLE_ID';
export const GET_LOG_FILE = 'DPS_BM_GET_LOG_FILE';
export const GET_LOG_FILE_SUCCESS = 'DPS_BM_GET_LOG_FILE_SUCCESS';
export const GET_LOG_FILE_FAIL = 'DPS_BM_GET_LOG_FILE_FAIL';
export const SELECT_ROW = 'BUNDLE_MONITOR_SELECT_ROW';

export const DELETE_ROWS = 'BUNDLE_MONITOR_DELETE_ROWS';

export class InitBundleMonitor extends TokenizeAction {
    readonly type = INIT_BUNDLE_MONITOR;
    constructor(public token: string, public bundleMonitorInput: BundleMonitorInput) {
        super(token);
    }
}
export class SelectItem extends TokenizeAction {
    readonly type = SELECT_ITEM;
    constructor(public token: string, public itemValue: string) {
        super(token);
    }
}
export class LoadData extends TokenizeAction {
    readonly type = LOAD_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadDataSuccess extends TokenizeAction {
    readonly type = LOAD_DATA_SUCCESS;
    constructor(public token: string, public data: PDFBundleHeaderViewModel[]) {
        super(token);
    }
}
export class LoadDataFail extends TokenizeAction {
    readonly type = LOAD_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class Refresh extends TokenizeAction {
    readonly type = REFRESH;
    constructor(public token: string) {
        super(token);
    }
}
export class ChangeSearchBundleId extends TokenizeAction {
    readonly type = CHANGE_SEARCH_BUNDLE_ID;
    constructor(public token, public bundleId) {
        super(token);
    }
}
export class GetLogFile extends TokenizeAction {
    readonly type = GET_LOG_FILE;
    constructor(public token, public bundleId) {
        super(token);
    }
}
export class GetLogFileSuccess extends TokenizeAction {
    readonly type = GET_LOG_FILE_SUCCESS;
    constructor(public token, public url) {
        super(token);
    }
}
export class GetLogFileFail extends TokenizeAction {
    readonly type = GET_LOG_FILE_FAIL;
    constructor(public token) {
        super(token);
    }
}

export class SelectRow extends TokenizeAction {
    readonly type = SELECT_ROW;
    constructor(public token: string, public payloade: { value: boolean, id: number }) {
        super(token);
    }
}

export class DeleteRows extends TokenizeAction {
    readonly type = DELETE_ROWS;
    constructor(public token: string) {
        super(token);
    }
}

export type Any = InitBundleMonitor | SelectItem | LoadData | LoadDataSuccess | LoadDataFail | Refresh | ChangeSearchBundleId |
    GetLogFile | GetLogFileSuccess | GetLogFileFail | SelectRow | DeleteRows;
