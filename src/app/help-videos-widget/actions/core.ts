import { Action } from '@ngrx/store';
import { CurrentActivitySum } from '../../team-efficiency-core/models/interfaces';
import { UrlData } from '../models/interfaces';

export const INIT_HELP_VIDEO_WIDGET = 'DPS_INIT_HELP_VIDEO_WIDGET';
export const LOAD_COUNTRY_SIDE_URLS_WIDGET = 'DPS_LOAD_COUNTRY_SIDE_URLS_WIDGET';


export const LOAD_COUNTRY_SIDE_URLS_WIDGET_SUCCESS = 'DPS_LOAD_COUNTRY_SIDE_URLS_WIDGET_SUCCESS';
export const LOAD_COUNTRY_SIDE_URLS_WIDGET_FAIL = 'DPS_LOAD_COUNTRY_SIDE_URLS_WIDGET_FAIL';
export const REFRESH = 'DPS_HELP_VIDEOS_WIDGET_REFRESH';

export class InitHelpVideoWidget implements Action {
    readonly type = INIT_HELP_VIDEO_WIDGET;
    constructor() { }
}

export class LoadCountrySideUrlsWidget implements Action {
    readonly type = LOAD_COUNTRY_SIDE_URLS_WIDGET;
    constructor() { }
}

export class LoadCountrySideUrlsWidgetSuccess implements Action {
    readonly type = LOAD_COUNTRY_SIDE_URLS_WIDGET_SUCCESS;
    constructor(public urlList: UrlData[]) { }
}

export class LoadCountrySideUrlsWidgetFail implements Action {
    readonly type = LOAD_COUNTRY_SIDE_URLS_WIDGET_FAIL;
    constructor() { }
}

export class RefreshTeamWidget implements Action {
    readonly type = REFRESH;
    constructor() { }

}

export type Any = InitHelpVideoWidget | LoadCountrySideUrlsWidget | LoadCountrySideUrlsWidgetSuccess
    | LoadCountrySideUrlsWidgetFail | RefreshTeamWidget;

