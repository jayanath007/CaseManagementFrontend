import { Action } from '@ngrx/store';

export const INIT_MAIL_CORE = 'DPS_INIT_MAIL_CORE';

export class InitMailCore implements Action {
  readonly type = INIT_MAIL_CORE;
  constructor(public payload: {selectedFolder: string}) {}
}
