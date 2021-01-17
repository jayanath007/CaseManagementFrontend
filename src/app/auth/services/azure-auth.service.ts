import { LoginMode } from './../models/auth';
import { switchMap, map, catchError, filter, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { InforDialogComponent } from '../../shared/components/infor-dialog/infor-dialog.component';
import { InforDialogData } from '../../shared/models/dialog';
import { Injectable, NgZone } from '@angular/core';
import { throwError as _throw, Observable, of } from 'rxjs';
import { AppConfig } from '../../core';
import { MatDialog } from '@angular/material';
import { TokenExpireMessageComponent } from '../components/token-expire-message/token-expire-message.component';
import { AzureAuthInfo, TenentValidated } from '../models/auth';
import { DetailStatus } from '..';
import { AuthTokenFlowService } from './auth-token-flow.service';
import { uuid } from '../../utils/uuid';
import { AzureTokenFlowV2Service } from './azure-token-flow-v2.service';
import { GoogleTokenFlowService } from './google-token-flow.service';
export const DB_CACHE_KEY = 'dps_selected_database';
export const SESSION_PARENT_ID = 'dps_session_parent_id';

@Injectable()
export class AzureAuthService {

  private flow: AuthTokenFlowService;
  constructor(private _ngZone: NgZone, private appConfig: AppConfig, private dialog: MatDialog,
    private azureTokenFlowV2Service: AzureTokenFlowV2Service,
    private authTokenFlowService: AuthTokenFlowService,
    private googleTokenFlowService: GoogleTokenFlowService,
    private httpClient: HttpClient
  ) {
    // this.flow = this.azureTokenFlowV2Service;
  }

  public isGoogle() {

    if (this.flow instanceof GoogleTokenFlowService) {
      return true;
    }
    return false;
  }

  public isDefaultHome() {
    if (this.flow instanceof GoogleTokenFlowService) {
      return '/main/(desktop:desktop/(main:matter-search/home/index//dashboard:tmp))';
    }
    return '/main/(desktop:desktop/(main:matter-search/home/index//mail:mail/home/index/(inbox:inbox)//dashboard:tmp))';
  }


  public login() {
    return this.flow.login();
  }

  public getAuthInfo() {

    if (this.azureTokenFlowV2Service) {
      return this.azureTokenFlowV2Service
        .getAuthInfo(this._ngZone).pipe(
          tap(() => {
            this.flow = this.azureTokenFlowV2Service;
          }),
          catchError((error) => {
            if (error === 'Token not available') {
              return this.googleTokenFlowService.getAuthInfo(this._ngZone)
                .pipe(tap(() => {
                  this.flow = this.googleTokenFlowService;
                }));
            }
            return _throw('Token not available');
          }));
    } else {
      return this.googleTokenFlowService.getAuthInfo(this._ngZone)
        .pipe(tap(() => {
          this.flow = this.googleTokenFlowService;
        }));
    }

  }

  public loginUrlPopup(loginMode: LoginMode) {

    if (loginMode === LoginMode.Azure) {
      this.flow = this.authTokenFlowService;
    } else if (loginMode === LoginMode.Google) {
      this.flow = this.googleTokenFlowService;
    } else {
      this.flow = this.azureTokenFlowV2Service;
    }
    return this.flow.loginUrlPopup();
  }
  public logout(): Observable<boolean> {
    return this.flow.logout();
  }


  public getLoginToken(): Observable<string> {
    return this.flow.getLoginToken();
  }

  public isCallback(hash) {
    return this.flow.isCallback(hash);
  }

  public getRequestInfo(hash) {
    return this.flow.getRequestInfo(hash);
  }

  public saveTokenFromHash(requestInfo) {
    return this.flow.saveTokenFromRequestInfo(requestInfo);
  }

  public processTokenAcquire(hash) {
    return this.flow.processTokenAcquire(hash);
  }

  public processAuthToken(hash): Observable<any> {
    return this.flow.processAuthToken(hash, this._ngZone);
  }

  public isLoginCallback(hash) {
    return this.flow.isLoginCallback(hash);
  }

  public isTokenAqureCallback(hash) {
    return this.flow.isTokenAqureCallback(hash);
  }

  public acquireToken(resource) {
    return this.flow.acquireToken(resource, this._ngZone);
  }

  public acquireGraphApiToken() {
    return this.acquireToken(this.flow.getAuthScopes()['graph']);
  }

  public acquireOutlookApiToken() {
    return this.acquireToken(this.flow.getAuthScopes()['outlook']);
  }

  public acquireDpsWebServiceToken(): Observable<string> {
    return this.acquireToken(this.flow.getAuthScopes()['backend']);
  }

  public acquireDpsV3ApiToken(): Observable<string> {
    return this.acquireToken(this.flow.getAuthScopes()['frontapp']);
  }

  public getCachedAuthInfo(): Observable<AzureAuthInfo> {
    return this.flow.getCachedAuthInfo(this._ngZone);
  }


  public testAuth() {
    this.login();
  }

  public getLoginExpireTs(): Observable<number> {
    return this.flow.getLoginExpireTs();
  }

  public getAuthCode(): Observable<string> {
    return this.flow.getAuthCode();
  }

  public showTokenExpireDialog() {
    const dialogData = {
      expireTs: this.getLoginExpireTs()
    };
    const dialogRef = this.dialog.open(TokenExpireMessageComponent, {
      data: dialogData,
      width: '360px',
      hasBackdrop: false,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    return dialogRef.afterClosed();
  }

  public showRequaredDataErrorDialog() {
    const dialogData: InforDialogData = {
      content: {
        title: 'Spitfire',
        message: 'Initial data not loaded. </br> Please contact administrator',
        hiddendClose: true
      },
      data: { messageType: 'warning' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: ['dps-notification', 'dps-tenet-validation-fail-panel'],
      backdropClass: 'dps-tenet-validation-fail',
    });
    return dialogRef.afterClosed();
  }

  public showTenentValidationFail(massge: DetailStatus[]) {
    let massgeList = '';
    massge.forEach(m => massgeList = '<li>' + m.message + '</li>');
    const dialogData: InforDialogData = {
      content: {
        title: 'Spitfire',
        message: massgeList,
        hiddendClose: true
      },
      data: { messageType: 'warning' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: ['dps-notification', 'dps-tenet-validation-fail-panel'],
      backdropClass: 'dps-tenet-validation-fail',
    });
    return dialogRef.beforeClose();
  }

  private showHttpAuthError(error: HttpErrorResponse) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Spitfire',
        message: error.message,
        hiddendClose: true
      },
      data: { messageType: 'warning' }
    };
    return this._ngZone.run(() => {
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: ['dps-notification', 'dps-tenet-validation-fail-panel'],
        backdropClass: 'dps-tenet-validation-fail',
      });
      return dialogRef.beforeClose();
    });
  }

  public getSelectedDatabase() {
    const id = localStorage.getItem(DB_CACHE_KEY);
    if (!id) {
      return '';
    }
    return id;
  }

  public getSessionParentId() {
    let id = sessionStorage.getItem(SESSION_PARENT_ID);
    if (!id) {
      id = uuid().replace(/-/g, '').slice(0, 16);
      sessionStorage.setItem(SESSION_PARENT_ID, id);
    }
    return id;
  }

  public clearSelectedDatabase() {
    localStorage.removeItem(DB_CACHE_KEY); // delete from localcache after reload
  }

  private handleAuthorized(idToken) {
    const headers = new HttpHeaders();
    if (this.isGoogle()) {
      headers.set('DPS-Auth-Scope', btoa(this.flow.getAuthScopes() as string));
    }

    return this.httpClient.get<TenentValidated>(this.appConfig.serviceBase + '/General/IsAuthorized?suppressFail=true',
      { observe: 'response', headers }).pipe(
        map((httpResponse) =>
          httpResponse.body
        ));
  }

  public authorizeDps(idToken: string): Observable<boolean> {
    window.localStorage.removeItem('TenentValidationFail');
    return this.handleAuthorized(idToken).pipe(
      switchMap((result) => {
        if (result.status === 'Fail') {
          window.localStorage.setItem('TenentValidationFail', 'true');
          return this.showTenentValidationFail(result.detailStatus).pipe(map(() => result));
        }
        return of(result);
      }), catchError((error: HttpErrorResponse) => {
        if (this.isGoogle() && error.status === 403) {
          return of(error);
        }
        return this.showHttpAuthError(error).pipe(map(() => error));
      }), switchMap((val) => {
        return this.flow.authorizeDps(idToken, val, this.httpClient).pipe(
          catchError(() => of(false)));
      }));
  }

}
