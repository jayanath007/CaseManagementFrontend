import { PosingPeriod } from './../../setting-core/models/interface';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core/index';

export const INIT_POSTING_PERIOD = 'DPS_INIT_POSTING_PERIOD';
export const GET_POSTING_PERIOD = 'DPS_GET_POSTING_PERIOD';
export const GET_POSTING_PERIOD_SUCCESS = 'DPS_GET_POSTING_PERIOD_SUCCESS';
export const GET_POSTING_PERIOD_FAIL = 'DPS_GET_POSTING_PERIOD_FAIL';

export const SET_SELECTED_POSTING_PERIOD = 'DPS_SET_SELECTED_POSTING_PERIOD';

export class InitPosingPeriod extends TokenizeAction implements Action {
  readonly type = INIT_POSTING_PERIOD;
  constructor(public token: string) {
    super(token);
  }
}
export class GetPosingPeriod extends TokenizeAction implements Action {
  readonly type = GET_POSTING_PERIOD;
  constructor(public token: string) {
    super(token);
  }
}
export class GetPosingPeriodSuccess extends TokenizeAction implements Action {
  readonly type = GET_POSTING_PERIOD_SUCCESS;
  constructor(public token: string, public payload: { posingPeriodList: PosingPeriod[] }) {
    super(token);
  }
}
export class GetPosingPeriodFail extends TokenizeAction implements Action {
  readonly type = GET_POSTING_PERIOD_FAIL;
  constructor(public token: string, error: any) {
    super(token);
  }
}
export class SetSelectedPosingPeriod extends TokenizeAction implements Action {
  readonly type = SET_SELECTED_POSTING_PERIOD;
  constructor(public token: string, public payload: { selectedPeriod: PosingPeriod }) {
    super(token);
  }
}
export type Any = InitPosingPeriod | GetPosingPeriod | GetPosingPeriodSuccess | GetPosingPeriodFail | SetSelectedPosingPeriod;
