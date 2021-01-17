import { Action } from '@ngrx/store';
import { PosingPeriod } from '../models/interface';

export const INIT_SETTING_CORE = 'DPS_INIT_SETTING_CORE';
export const LOAD_HOME_CURRENCY = 'DPS_LOAD_HOME_CURRENCY';
export const LOAD_TIME_ZONES_DATA = 'DPS_LOAD_TIME_ZONE_DATA';
export const LOAD_HOME_CURRENCY_SUCCESS = 'DPS_LOAD_HOME_CURRENCY_SUCCESS';
export const LOAD_TIME_ZONES_DATA_SUCCESS = 'DPS_LOAD_TIME_ZONE_DATA_SUCCESS';
export const LOAD_DATA_FAIL = 'LOAD_DATA_FAIL';
export const CHECK_DIARY_MODE_CURRENT_USER = 'CHECK_DIARY_MODE_CURRENT_USER';
export const CHECK_DIARY_MODE_CURRENT_USER_SUCCESS = 'CHECK_DIARY_MODE_CURRENT_USER_SUCCESS';
export const CHECK_DIARY_MODE_CURRENT_USER_FAIL = 'CHECK_DIARY_MODE_CURRENTUSER_FAIL';
export const GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE = 'GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE';
export const GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE_SUCCESS = 'GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE_SUCCESS';
export const GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE_FAIL = 'GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE_FAIL';
export const SET_SELECTED_POSTING_PERIOD = 'DPS_SET_SELECTED_POSTING_PERIOD';
export const GET_USER_ACCESS_RIGHTS = 'DPS_SETTING_GET_USER_ACCESS_RIGHTS';



export class InitSettingCore implements Action {
  readonly type = INIT_SETTING_CORE;
  constructor() { }
}
export class LoadHomeCurrency implements Action {
  readonly type = LOAD_HOME_CURRENCY;
  constructor() { }
}

export class LoadHomeCurrencySuccess implements Action {
  readonly type = LOAD_HOME_CURRENCY_SUCCESS;
  constructor(public payload: { homeCurrency: string }) { }
}
export class LoadDataFail implements Action {
  readonly type = LOAD_DATA_FAIL;
  constructor() { }
}
export class LoadTimeZonesData implements Action {
  readonly type = LOAD_TIME_ZONES_DATA;
  constructor() { }
}
export class LoadTimeZonesDataSuccess implements Action {
  readonly type = LOAD_TIME_ZONES_DATA_SUCCESS;
  constructor(public payload: { timeZones: any[] }) { }
}

export class CheckDiaryModeCurrentUser implements Action {
  readonly type = CHECK_DIARY_MODE_CURRENT_USER;
  constructor() { }
}
export class CheckDiaryModeCurrentUserSuccess implements Action {
  readonly type = CHECK_DIARY_MODE_CURRENT_USER_SUCCESS;
  constructor(public payload: { isLoginUser: boolean }) { }
}
export class CheckDiaryModeCurrentUserFail implements Action {
  readonly type = CHECK_DIARY_MODE_CURRENT_USER_FAIL;
  constructor() { }
}
export class GetTimeUseFeeEarnerRate implements Action {
  readonly type = GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE;
  constructor() { }
}
export class GetTimeUseFeeEarnerRateSuccess implements Action {
  readonly type = GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE_SUCCESS;
  constructor(public payload: { TimeUseFeeEarnerGradesValueDisable: boolean }) { }
}
export class GetTimeUseFeeEarnerRateFail implements Action {
  readonly type = GET_TIME_USE_FEEEARNER_GRADES_VALUE_DISABLE_FAIL;
  constructor() { }
}
export class SetSelectedPosingPeriod implements Action {
  readonly type = SET_SELECTED_POSTING_PERIOD;
  constructor(public payload: { selectedPostingPeriod: PosingPeriod }) { }
}



export type Any = InitSettingCore | LoadHomeCurrency | LoadDataFail | LoadHomeCurrencySuccess |
  LoadTimeZonesData | LoadTimeZonesDataSuccess | CheckDiaryModeCurrentUser |
  CheckDiaryModeCurrentUserSuccess | CheckDiaryModeCurrentUserFail | GetTimeUseFeeEarnerRate |
  GetTimeUseFeeEarnerRateSuccess | GetTimeUseFeeEarnerRateFail | SetSelectedPosingPeriod;

