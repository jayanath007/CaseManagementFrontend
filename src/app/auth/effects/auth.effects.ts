
import { filter, delay, map, catchError, mergeAll, mergeMap, take, tap, switchMap } from 'rxjs/operators';
import { ReadingPaneMode } from '../models/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, } from '@ngrx/router-store';
import { of, interval, empty, Observable, from } from 'rxjs';
import * as Auth from '../actions/auth';
import { RouterState } from '../../shared/utills/routing';
import { AzureAuthService } from '../services/azure-auth.service';
import { AzureAuthInfo } from '../models/auth';
import { LocalStorageKey, AppConfig } from '../../core';
import { AuthUserService } from '../services/auth-user-service';
import { Store } from '@ngrx/store';
import { getTimeZones, PosingPeriod } from '../../setting-core';
import { getUser, showingTokenDialog } from '..';
import { isMobile } from '../../utils/is-mobile';
import { getLoggedIn } from '../reducers';
import { ChangeGlobalSignatureTemplete, CHANGE_GLOBAL_SIGNATURE_TEMPLETE } from '../../organizer-settings-core/actions/core';
import { SystemJsPopupLoaderService } from '../../shell-desktop';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AzureAuthService,
    private router: Router,
    private store: Store<any>,
    private authUserService: AuthUserService,
    private appConfig: AppConfig,
    private popupLoader: SystemJsPopupLoaderService,
  ) { }

  // @Effect({ dispatch: false })
  // initAuth$ = this.actions$.ofType(DPS_APP_INIT)
  //   .mergeMap(() =>
  //     this.authService.getCachedAuthInfo()
  //       .do((info) => console.log('auth info loaded from cache sucessfully', info))
  //       .map((authInfo: AzureAuthInfo) => new Auth.LoginSuccess({ authInfo, targetUrl: null, fromCache: true }))
  //       .catch(error => empty())
  //   );
  // .let((obs) => this.handleDpsAuthorize(obs));



  @Effect()
  $checkAuth = this.actions$.pipe(ofType<Auth.AuthRequired>(Auth.AUTH_REQUIRED),
    map((action: Auth.AuthRequired) => action.payload),
    // .do((action) => localStorage.setItem(TARGET_STATE_KEY, action.redirectRoute))
    switchMap((routeInfo) => {
      return this.authService.getAuthInfo().pipe(
        tap((info) => console.log('auth info loaded sucessfully', info)),
        mergeMap((authInfo: AzureAuthInfo) =>
          from([new Auth.LoginSuccess({ authInfo, targetUrl: routeInfo.redirectRoute, fromCache: true }), new Auth.GetUserGeneralData()])),
        catchError(error => of(new Auth.RedirectToAzure())));
    }
    ),
    ((obs) => {

      return this.handleDpsAuthorize(obs);
    })
  );

  @Effect({ dispatch: false })
  $azureRedirect = this.actions$.pipe(ofType(Auth.REDIRECT_TO_AZURE),
    tap(() => {
      this.authService.clearSelectedDatabase(); // delete selecte on login
    }),
    switchMap(() => {
      if (this.appConfig.tokenFlow && this.appConfig.tokenFlow === 'AzureV1') {
        if (this.authService.isGoogle()) {
          return this.authService.login().pipe(map(authInfo => new Auth.AuthRequired({ redirectRoute: null })));
        } else {
          return this.authService.login(); // alwasy end empty
        }
      } else {
        this.router.navigate(['/login']);
        return empty();
      }
    })
  );





  @Effect({ dispatch: false })
  $loginSucess = this.actions$.pipe(ofType(Auth.LOGIN_SUCCESS),
    tap(action => console.log('handle sucessfully', action)),
    tap((action: Auth.LoginSuccess) => action.payload.targetUrl && action.payload.fromCache
      ? this.router.navigateByUrl(action.payload.targetUrl)
      : this.router.navigateByUrl('/')
    ), take(1))
    // .map((action) =>
    //   new Auth.LoadOrganizerSettings()
    // )
    ;

  // pre cache all needed tokens
  @Effect({ dispatch: false })
  $aqureToken = this.actions$.pipe(ofType(Auth.LOGIN_SUCCESS),
    mergeMap(() => {
      if (this.authService.isGoogle()) {
        return empty();
      } else {
        return from([
          this.authService.acquireGraphApiToken().pipe(catchError(() => empty())),
          this.authService.acquireOutlookApiToken().pipe(catchError(() => empty())),
          this.authService.acquireDpsWebServiceToken().pipe(catchError(() => empty()))
        ]);
      }
    }),
    mergeAll(1));

  @Effect({ dispatch: false })
  $updateUser = this.actions$.pipe(ofType(Auth.LOGIN_SUCCESS),
    filter(() => this.authService.isGoogle() && !(window.opener && window.opener !== window)),
    switchMap(() => this.store.select(getUser).pipe(filter(user => !!user))),
    tap(user => {
      localStorage.setItem(LocalStorageKey.LoginUser, JSON.stringify(user));
    })
  );

  @Effect({ dispatch: false })
  $updateUser2 = this.actions$.pipe(ofType(
    Auth.LOAD_SIGNATURE_SUCCESS_AUTH,
    Auth.LOAD_ALL_EXTENSIONS_SUCCESS_AUTH,
    Auth.LOAD_USER_TIME_ZONE_SUCCESS_AUTH,
    Auth.LOAD_EXTENSIONS_SUCCESS_AUTH
  ),
    map((data) => {
      this.store.select(getUser).subscribe((user) => {
        localStorage.setItem(LocalStorageKey.LoginUser, JSON.stringify(user));
        // console.log(LocalStorageKey.LoginUser, user);
      });
      return data;
    }), delay(1000), map((data) => {
      this.store.select(getUser).subscribe((user) => {
        localStorage.setItem(LocalStorageKey.LoginUser, JSON.stringify(user));
        // console.log(LocalStorageKey.LoginUser, user);
      });
      return data;
    }));


  @Effect()
  $loginCallbackHandler = this.actions$.pipe(ofType(ROUTER_NAVIGATION),
    map((action: any) => {

      return action.payload.routerState;

    }),
    filter((state: RouterState) => state.url.startsWith('/auth')),
    filter((state: RouterState) => !!state.fragment && state.fragment !== ''),
    tap((data) => {
      console.log(data);
    }),
    filter((state: RouterState) => this.authService.isLoginCallback(state.fragment)),
    switchMap((state: RouterState) =>
      this.authService.processAuthToken(state.fragment).pipe(
        tap(info => console.log('loginCallbackHandler - processAuthToken', info)),
        mergeMap(authInfo => from([new Auth.LoginSuccess({ authInfo, targetUrl: '/', fromCache: false }), new Auth.GetUserGeneralData()])),
        catchError(error => of(new Auth.RedirectToAzure())))
    ),
    ((obs) => this.handleDpsAuthorize(obs))
  );

  @Effect({ dispatch: false })
  $tokenCallback = this.actions$.pipe(ofType(ROUTER_NAVIGATION),
    tap((obs) => console.log('running the router change call 1')),
    map((action: any) => action.payload.routerState),
    filter((state: RouterState) => state.url.startsWith('/auth')),
    filter((state: RouterState) => !!state.fragment && state.fragment !== ''),
    tap(() => {
      console.log('aqure token 2');
    }),
    filter((state: RouterState) => this.authService.isTokenAqureCallback(state.fragment)),
    tap((state: RouterState) => {
      console.log('processTokenAcquire 3');
      this.authService.processTokenAcquire(state.fragment);
    }));

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(ofType(Auth.LOGOUT),
    filter(() => {
      if (window.localStorage.getItem('TenentValidationFail') && window.localStorage.getItem('UserGeneralDataFail')) {
        window.localStorage.removeItem('TenentValidationFail');
        window.localStorage.removeItem('UserGeneralDataFail');
        return false;
      }
      return true;
    }),
    tap(() => { localStorage.removeItem('EmailDrafts'); }),
    switchMap(() => this.authService.logout()));


  @Effect()
  LoadOrganizerSettingsdata$ = this.actions$.pipe(ofType<Auth.LoadOrganizerSettings>(Auth.LOAD_ORGANIZER_SETTINGS_AUTH),
    mergeMap((action) => {
      let actions: any[] = [];
      if (!this.authService.isGoogle()) {
        actions = actions.concat([
          new Auth.CheckSignature(),
          new Auth.LoadUserTimeZone(),
          new Auth.LoadExtensions(),
          new Auth.LoadViewSettingsEWS(),
          new Auth.GetEmailReadingPaneMode(),
        ]);
      }
      return from(actions);
    }));

  @Effect()
  LoadExtensionsData$ = this.actions$.pipe(ofType<Auth.LoadExtensions>(Auth.LOAD_EXTENSIONS_AUTH),
    switchMap((action: Auth.LoadExtensions) =>
      this.authUserService.getExtensions().pipe(map((response) =>
        new Auth.LoadExtensionsSuccess({ extensions: response })),
        catchError(error => of(new Auth.LoadExtensionsFail(error))))
    ));

  @Effect()
  checkSignatureData$ = this.actions$.pipe(ofType<Auth.CheckSignature>(Auth.CHECK_SIGNATURE_AUTH),
    switchMap((action: Auth.CheckSignature) =>
      this.authUserService.checkSignature().pipe(map((response) =>
        new Auth.LoadSignature({ signatureUrl: response['@microsoft.graph.downloadUrl'] })),
        catchError(error => of(new Auth.LoadSignatureFail(error))))
    ));

  @Effect()
  LoadSignatureData$ = this.actions$.pipe(ofType<Auth.LoadSignature>(Auth.LOAD_SIGNATURE_AUTH),
    switchMap((action: Auth.LoadSignature) =>
      this.authUserService.getSignature(action.payload.signatureUrl).pipe(map((response) =>
        new Auth.LoadSignatureSuccess({ signature: response })),
        catchError(error => of(new Auth.LoadSignatureFail(error))))
    ));

  @Effect()
  LoadUserTimeZoneData$ = this.actions$.pipe(ofType<Auth.LoadUserTimeZone>(Auth.LOAD_USER_TIME_ZONE_AUTH),
    switchMap((action: Auth.LoadUserTimeZone) =>
      this.authUserService.getUserTimeZone().pipe(
        switchMap((response) => {
          return this.store.select(getTimeZones()).pipe(
            filter((timeZones) => !!timeZones && timeZones.length > 0),
            take(1), switchMap(val => {
              const userTimeZone = val.find(zone => zone.alias === response);
              return of(new Auth.LoadUserTimeZoneSuccess({
                userTimeZone: userTimeZone,
                value: userTimeZone.alias === 'UTC' ? 'UTC' : userTimeZone.displayName.substring(1, 10)
              }));
            }));
        }),
        catchError(error => of(new Auth.LoadUserTimeZoneFail(error))))
    ));

  @Effect()
  UpdateProfileImage$ = this.actions$.pipe(ofType<Auth.UpdateProfileImage>(Auth.UPDATE_PROFILE_IMAGE),
    switchMap((action) => {
      return this.authUserService.updateUserImage(action.payload.image).pipe(
        map((response) => {
          return new Auth.UpdateProfileImageSuccess(action.token, { url: response });
        }), catchError<any, Auth.Any>((error) => {
          if (error.status === 200) {
            return of(new Auth.UpdateProfileImageSuccess(action.token, { url: '' }));
          } else {
            return of(new Auth.UpdateProfileImageFail(action.token, error));
          }
        }));
    }));



  @Effect()
  loadViewSettingsEWS$ = this.actions$.pipe(ofType<Auth.LoadViewSettingsEWS>(Auth.LOAD_VIEW_SETTINGS_EWS),
    switchMap((action) => {
      return this.authUserService.getOwaViewStateOptions().pipe(
        map((response) => {
          return new Auth.LoadViewSettingsEWSSuccess({ data: response.data });
        }), catchError((error) => {
          return of(new Auth.LoadViewSettingsEWSFail({ error }));
        }));
    }));

  @Effect()
  getUserGeneralData$ = this.actions$.pipe(ofType<Auth.GetUserGeneralData>(Auth.GET_USER_GENERAL_DATA),
    switchMap((action) => {
      window.localStorage.removeItem('UserGeneralDataFail');
      return this.authUserService.getUserGeneralData().pipe(
        map(response => new Auth.GetUserGeneralDataSuccess(response)),
        catchError((error) => {
          if (this.authService.isGoogle() && error.status == 403) {
            return of();
          }
          return of(new Auth.GetUserGeneralDataFail({ error }));
        }));
    }));

  // @Effect({ dispatch: false })
  // openTransctionPeriodSelecter$ = this.actions$.pipe(ofType<Auth.GetUserGeneralDataSuccess>(Auth.GET_USER_GENERAL_DATA_SUCCESS),
  //   tap(() => {
  //     const tempValue = localStorage.getItem(LocalStorageKey.PostingPeriod);
  //     const selectedPeriod: PosingPeriod = tempValue ? JSON.parse(tempValue) : null;
  //     if (!selectedPeriod || selectedPeriod.tP_ID < 1) {
  //       this.popupLoader.postingPeriodPopup('dpsPostingPeriodToken');
  //     }
  //   }));


  @Effect()
  getUserGeneralDataFail$ = this.actions$.pipe(ofType<Auth.GetUserGeneralDataFail>(Auth.GET_USER_GENERAL_DATA_FAIL),
    map(() => new Auth.ShowRequaredDataErrorDialog()));


  @Effect()
  getJwtTokenForPDFViewer$ = this.actions$.pipe(ofType<Auth.GetJwtTokenForPDFViewer>(Auth.GET_JWT_TOKEN_FOR_PDF_VIEWER),
    switchMap((action) => {
      return this.authUserService.getJwtTokenForPDFViewer().pipe(
        map((response) => new Auth.GetJwtTokenForPDFViewerSuccess(response)),
        catchError((error) => of(new Auth.GetJwtTokenForPDFViewerFail({ error }))));
    }));

  @Effect()
  updateViewSettingsEWS$ = this.actions$.pipe(ofType<Auth.UpdateSelectedCalendars>(Auth.UPDATE_SELECTED_CALENDARS),
    switchMap((action) => {
      return this.authUserService.setOwaViewStateOptions(
        { dictionaryKey: 'SelectedCalendarsDesktop', dictionaryValue: action.payload.dictionaryValue }).pipe(
          map((response) => {
            return new Auth.UpdateSelectedCalendarsSuccess(action.payload);
          }), catchError((error) => {
            return of(new Auth.UpdateSelectedCalendarsFail({ error }));
          }));
    }
    ));

  @Effect()
  reloadOnExpire$ = this.actions$.pipe(ofType(Auth.LOGIN_SUCCESS),
    switchMap(() =>
      interval(1000 * 60 * 3)
    ),
    switchMap(() =>
      this.authService.getLoginToken()
    ),
    filter((token) => !token),
    map(() => new Auth.Logout()));



  // @Effect()
  // checkTokenExpire$ = this.actions$.pipe(ofType(Auth.LOGIN_SUCCESS),
  //   switchMap(() =>
  //     interval(1000 * 60 * 3)
  //   ),
  //   switchMap(() =>
  //     this.authService.getLoginExpireTs()
  //   ), map((time) => {
  //     return Math.round(time - (new Date().getTime() / 1000.0));
  //   }),
  //   tap(expireIn => console.log('token expire in ' + expireIn + ' seconds')),
  //   filter(expireIn => expireIn < 600 && !this.authService.isGoogle()),
  //   switchMap(() =>
  //     this.store.select(showingTokenDialog).pipe(take(1))
  //   ),
  //   filter(isShowing => isShowing === false),
  //   map(() => new Auth.ShowSessionExpireDialog()));

  // @Effect()
  // tokenExpireDialog$ = this.actions$.pipe(ofType<Auth.ShowSessionExpireDialog>(Auth.SHOW_SESSION_EXPIRE_DIALOG),
  //   switchMap((action) =>
  //     this.authService.showTokenExpireDialog()
  //   ),
  //   map((reload) => {
  //     if (reload) {
  //       return new Auth.Logout();
  //     }
  //     return new Auth.HideSessionExpireDialog();
  //   }));

  @Effect()
  requaredErrorDialog$ = this.actions$.pipe(ofType<Auth.ShowRequaredDataErrorDialog>(Auth.SHOW_REQUARED_DATA_ERRORD_IALOG),
    switchMap((action) => {
      window.localStorage.setItem('UserGeneralDataFail', 'true');
      return this.authService.showRequaredDataErrorDialog();
    }
    ), map(() => new Auth.Logout()));

  @Effect()
  getEmailReadingPaneMode$ = this.actions$.pipe(ofType<Auth.GetEmailReadingPaneMode>(Auth.GET_EMAIL_READING_PANEMODE),
    map((action) => {
      return new Auth.GetEmailReadingPaneModeSuccess({ mode: isMobile().any() ? ReadingPaneMode.Hide : ReadingPaneMode.Right });
    }));

  @Effect()
  changeGlobalSignTemp$ = this.actions$.pipe(ofType<ChangeGlobalSignatureTemplete>(CHANGE_GLOBAL_SIGNATURE_TEMPLETE),
    map(action => new Auth.GetGlobalSignatureTempleteSuccess(action.templete))
  );

  @Effect()
  extentionSuccess$ = this.actions$.pipe(ofType<Auth.LoadExtensionsSuccess>(Auth.LOAD_EXTENSIONS_SUCCESS_AUTH),
    switchMap(() => this.store.select(getUser).pipe(take(1))),
    filter(user => !!user.useGlobalSignature || !user || !user.signature),
    map(() => new Auth.GetGlobalSignatureTemplete())
  );

  @Effect()
  getGlobalSignTemplete$ = this.actions$.pipe(ofType<Auth.GetGlobalSignatureTemplete>(Auth.GET_GLOBAL_SIGNATURE_TEMPLETE),
    switchMap(() => this.authUserService.getGlobalSignatureTemplete().pipe(
      map(responce => new Auth.GetGlobalSignatureTempleteSuccess(responce)),
      catchError(() => of(new Auth.GetGlobalSignatureTempleteFail()))
    ))
  );

  private handleDpsAuthorize(obs: Observable<any>) {
    return obs.pipe(
      switchMap((action) => {

        return this.store.select(getLoggedIn).pipe(
          take(1),
          map((isLoggedIn) => {

            return ({ action, isLoggedIn });
          }
          ));
      }),
      mergeMap(({ action, isLoggedIn }) => {
        if (action instanceof Auth.LoginSuccess && !isLoggedIn) {
          return this.authService.authorizeDps(action.payload.authInfo.accessToken).pipe(
            map((ok) => ok ? action : new Auth.Logout()));
        } else {
          return of(action);
        }
      }));
  }



}
