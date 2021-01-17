import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';

export interface RouterState {
  url: string;
  queryParams: Params;
  fragment: string;
}

export class DpsRouterStateSerializer implements RouterStateSerializer<RouterState> {

  serialize(routerState: RouterStateSnapshot): RouterState {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;
    const fragment = routerState.root.fragment;
    return { url, queryParams, fragment };
  }
}
