import { Action } from '@ngrx/store';
import { CurrentActivitySum } from '../../team-efficiency-core/models/interfaces';

export const INIT_TEAN_WIDGET = 'DPS_INIT_TEAN_WIDGET';
export const LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET';
export const LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_SUCCESS = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_SUCCESS';
export const LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_FAIL = 'DPS_LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_FAIL';
export const REFRESH = 'DPS_TEAM_WIDGET_REFRESH';

export class InitTeamWidget implements Action {
    readonly type = INIT_TEAN_WIDGET;
    constructor() { }
}

export class LoadActivitySummaryUserInTeamWidget implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET;
    constructor() { }
}

export class LoadActivitySummaryYearInTeamWidgetSuccess implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_SUCCESS;
    constructor(public eventYearSummery: CurrentActivitySum[]) { }
}

export class LoadActivitySummaryYearInTeamWidgetFail implements Action {
    readonly type = LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET_FAIL;
    constructor() { }
}

export class RefreshTeamWidget implements Action {
    readonly type = REFRESH;
    constructor () {}

}

export type Any = InitTeamWidget | LoadActivitySummaryUserInTeamWidget | LoadActivitySummaryYearInTeamWidgetSuccess
    | LoadActivitySummaryYearInTeamWidgetFail | RefreshTeamWidget;

