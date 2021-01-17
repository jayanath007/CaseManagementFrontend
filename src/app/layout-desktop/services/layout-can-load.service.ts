
import { map, switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot, CanLoad, Route, CanActivate } from '@angular/router';
import { InitialSettingsService } from '../../initial-settings-core/services/initial-settings.service';
import { SystemJsPopupLoaderService } from '../../shell-desktop';



// @Injectable()
// export class AppRouterGuardService implements CanActivate, CanActivateChild {

//   constructor(private store: Store<any>, private initialSettingsService: InitialSettingsService,
//     private popupService: SystemJsPopupLoaderService) { }

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     return this.checkInitialSettings();
//   }

//   canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     return this.checkInitialSettings();
//   }

//   private checkInitialSettings() {
//     return this.initialSettingsService.getUserTimeZone()
//       .do(respond => console.log('666666666666666666666666666', respond))
//       // .map(() => true);
//       .switchMap((respond) => {
//         if (!respond) {
//           return this.popupService.openInitialSettingsPopup('mainInitialSettings', 'no_input').map(() => true);
//         } else {
//           return of(true);
//         }
//       }
//       ).catch(error => of(true));
//   }

@Injectable()
export class LayoutCanLoadService implements CanActivate, CanLoad {
  constructor(private store: Store<any>, private initialSettingsService: InitialSettingsService,
    private popupService: SystemJsPopupLoaderService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkInitialSettings();
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkInitialSettings();
  }

  private checkInitialSettings() {
    return this.initialSettingsService.getUserTimeZone().pipe(
      switchMap((respond) => {
        if (!respond) {
          return this.popupService.openInitialSettingsPopup('mainInitialSettings', 'no_input').pipe(map(() => true));
        } else {
          return of(true);
        }
      }
      ), catchError(error => of(true)));
  }
}
