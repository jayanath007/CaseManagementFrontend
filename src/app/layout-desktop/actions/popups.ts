import { Action } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

export const CLOSE_EXCLUSIVE_POPUP = 'DPS_CLOSE_EXCLUSIVE_POPUP';
export const OPEN_ROUTER_POPUP = 'DPS_OPEN_ROUTER_POPUP';
export const CLOSE_ROUTER_POPUP = 'DPS_CLOSE_ROUTER_POPUP';
export const INIT_CORE = 'DPS_INIT_ROUTER_POPUP_CORE';

export class CloseExclusivePopup implements Action {
  readonly type = CLOSE_EXCLUSIVE_POPUP;
  constructor() { }
}

export class OpenRouterPopup implements Action {
  readonly type = OPEN_ROUTER_POPUP;
  constructor(public outlet, public path: string | any[],  public targetToken: string, public inputData: any, ) { }
}

export class CloseRouterPopup implements Action {
  readonly type = CLOSE_ROUTER_POPUP;
  constructor(public outlet, public targetToken: string) { }
}

export class InitRouterPopupCore implements Action {
  readonly type = INIT_CORE;
  constructor(public desktopRoute: ActivatedRoute) { }
}

export type Any = CloseExclusivePopup | OpenRouterPopup | InitRouterPopupCore | CloseRouterPopup;




