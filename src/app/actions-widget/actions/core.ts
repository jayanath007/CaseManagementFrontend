import { TokenizeAction } from '../../core/lib/actions';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';

export const INIT_ACTIONS_WIDGET_MONITOR = 'INIT_ACTIONS_WIDGET_MONITOR';
export const LOAD_DATA_BUNDLE_DATA = 'DPS_ACTIONS_WIDGET_BUNDLE_LOAD_DATA';
export const LOAD_DATA_BUNDLE_SUCCESS = 'DPS_ACTIONS_WIDGET_BUNDLE_LOAD_DATA_SUCCESS';
export const LOAD_DATA_BUNDLE_FAIL = 'DPS_ACTIONS_WIDGET_BUNDLE_LOAD_DATA_FAIL';

export const REFRESH = 'DPS_ACTIONS_WIDGET_REFRESH';

export class InitActionsWidget {
    readonly type = INIT_ACTIONS_WIDGET_MONITOR;
    constructor() {
    }
}

export class LoadBundleData {
    readonly type = LOAD_DATA_BUNDLE_DATA;
    constructor() {

    }
}
export class LoadBundleDataSuccess {
    readonly type = LOAD_DATA_BUNDLE_SUCCESS;
    constructor(public data: PDFBundleHeaderViewModel[]) {

    }
}
export class LoadBundleDataFail {
    readonly type = LOAD_DATA_BUNDLE_FAIL;
    constructor() {

    }
}
export class Refresh {
    readonly type = REFRESH;
    constructor() {

    }
}

export type Any = InitActionsWidget | LoadBundleData | LoadBundleDataSuccess | LoadBundleDataFail | Refresh;
