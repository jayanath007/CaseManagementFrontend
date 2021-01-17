
import { switchMap, filter, take, tap, map } from 'rxjs/operators';
import { of, Observable, combineLatest } from 'rxjs';


import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';
import { Store } from '@ngrx/store';
import * as auth from '../reducers';
import * as Actions from '../actions/auth';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private store: Store<auth.State>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(state.url);
  }


  private checkAuth(url): Observable<any> {
    return this.store.select(auth.getLoggedIn).pipe(take(1), switchMap((authed) => {
      if (authed) {
        this.store.select(auth.getIsTenentValidated).pipe(filter((tenentValidated) => tenentValidated !== null), take(1), map(t => true));
      }
      return of(authed);
    }),
      tap(authed => {
        if (!authed) {
          this.store.dispatch(new Actions.AuthRequired({ redirectRoute: url }));
        }
      }));
  }

}
