import { AppConfig } from '../../core';
import { AuthTokenFlowService } from './auth-token-flow.service';
import { throwError as _throw ,  Observable ,  of ,  empty } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { AzureAuthInfo, User, TenentValidated } from '../models/auth';
import { HttpErrorResponse } from '@angular/common/http';
// to keep the tsc happy
declare var AuthenticationContext: any;
declare var window;

export class AzureTokenFlowService implements AuthTokenFlowService {

    private authContext: any;

    constructor(private appConfig: AppConfig) {
        const config = {
            instance: 'https://login.microsoftonline.com/',
            tenant: appConfig.tenant,
            redirectUri: window.location.origin + '/login-redirect.html',
            clientId: appConfig.appId,
            postLogoutRedirectUri: window.location.origin,
            endpoints: { ...appConfig.endpoints },
            cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
        };

        this.authContext = new AuthenticationContext(config);
        this.authContext.CONSTANTS.LOADFRAME_TIMEOUT = 1000 * 30;
    }

    public isGoogle() {
        return false;
    }

    public getAuthScopes(): string {
        return ''; // not applicable
    }

    public getAuthCode(): Observable<string> {
        return empty();
    }

    getAuthContext() {
        return this.authContext;
    }
    public loginUrlPopup() {
        return empty();
    }

    public login() {
        this.authContext.login();
        return empty();
    }

    public logout() {
        this.authContext.logOut();
        return of(true);
    }

    private getCachedToken(resource) {
        return this.authContext.getCachedToken(resource);
    }

    public getLoginToken() {
        return of(this.authContext.getCachedToken(this.authContext.config.loginResource));
    }

    public isCallback(hash) {
        return this.authContext.isCallback(hash);
    }

    public getRequestInfo(hash) {
        return this.authContext.getRequestInfo(hash);
    }

    public saveTokenFromRequestInfo(requestInfo) {
        return this.authContext.saveTokenFromHash(requestInfo);
    }

    public processTokenAcquire(hash) {
        const requestInfo = this.authContext.getRequestInfo(hash);
        this.authContext.saveTokenFromHash(requestInfo);
        if (requestInfo.stateMatch) {
            if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
                const callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse] || this.authContext.callback;

                if (callback && typeof callback === 'function') {
                    // id_token or access_token can be renewed
                    const token = requestInfo.parameters['access_token'] || requestInfo.parameters['id_token'];
                    const error = requestInfo.parameters['error'];
                    const errorDescription = requestInfo.parameters['error_description'];
                    callback(errorDescription, token, error);
                }
                return true;
            }
        }
        return false;
    }

    public processAuthToken(hash, _ngZone: NgZone) {
        const resource = this.authContext.config.loginResource;
        const requestInfo = this.authContext.getRequestInfo(hash);
        this.authContext.saveTokenFromHash(requestInfo);
        if (requestInfo.stateMatch) {
            if (requestInfo.requestType === this.authContext.REQUEST_TYPE.LOGIN) {
                return this.getAuthInfo(_ngZone);
            } else if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
                return this.getAuthInfo(_ngZone);
            }
        }
        this.authContext.clearCache();
        return _throw('Authentication method not implemented');
    }

    public isLoginCallback(hash) {
        if (!this.isCallback(hash)) {
            return false;
        }
        const requestInfo = this.authContext.getRequestInfo(hash);
        if (requestInfo.requestType === this.authContext.REQUEST_TYPE.LOGIN) {
            return true;
        }
        return false;
    }

    public isTokenAqureCallback(hash) {
        if (!this.isCallback(hash)) {
            return false;
        }
        const requestInfo = this.authContext.getRequestInfo(hash);
        if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
            return true;
        }
        return false;
    }

    public acquireToken(resource, _ngZone: NgZone) {
        return Observable.create((observer) => {
            _ngZone.runOutsideAngular(() => {
                this.authContext.acquireToken(resource, (error, token) => {
                    _ngZone.run(() => {
                        if (error) {
                            console.error('Auth token aquire error - ' + resource);
                            observer.error(error);
                        } else {
                            console.log('Auth token aquire success - ' + resource);
                            observer.next(token);
                        }
                        observer.complete();
                    });
                });
            });
        });
    }

    public acquireGraphApiToken(_ngZone: NgZone) {
        return this.acquireToken(this.appConfig.endpoints.graphApi, _ngZone);
    }

    public acquireOutlookApiToken(_ngZone: NgZone) {
        return this.acquireToken(this.appConfig.endpoints.outlookApi, _ngZone);
    }

    public acquireDpsWebServiceToken(_ngZone: NgZone): Observable<string> {
        return this.acquireToken(this.appConfig.endpoints.dpsWebService, _ngZone);
    }

    public acquireWopiWebServiceToken(_ngZone: NgZone): Observable<string> {
        return this.acquireToken(this.appConfig.endpoints.dpsWopiService, _ngZone);
    }

    public getCachedAuthInfo(): Observable<AzureAuthInfo> {
        return Observable.create((observer) => {
            const user = this.authContext.getCachedUser();
            const resource = this.authContext.config.loginResource;
            const token = this.authContext.getCachedToken(resource);
            if (!!user && !!token) {
                const info = new AzureAuthInfo(token, user);
                observer.next(info);
            } else {
                observer.error('NO cache data available');
            }
            observer.complete();
        });
    }

    public getAuthInfo(_ngZone: NgZone) {
        const resource = this.authContext.config.loginResource;
        const authSubject = Observable.create((observer) => {
            _ngZone.runOutsideAngular(() => {
                this.authContext.getUser((error, user: User) => {
                    _ngZone.run(() => {
                        if (error) {
                            observer.error(error);
                        } else {
                            observer.next(user);
                        }
                        observer.complete();
                    });
                });
            });
        });

        return authSubject.pipe(mergeMap((user: User) => {
            const token = this.authContext.getCachedToken(resource);
            const isAuthenticated = token !== null && token.length > 0;
            if (!isAuthenticated) {
              return _throw('Token not available');
            }
            return of(new AzureAuthInfo(token, user));
          }));
    }

    public testAuth() {
        this.login();
    }

    public getLoginExpireTs() {
        return of(this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.EXPIRATION_KEY +
            this.authContext.config.loginResource) - 300);
    }

    public authorizeDps(idToken, authResult: HttpErrorResponse | TenentValidated) {
        if (authResult && authResult.status === 'Success') {
            return of(true);
        }
        return of(false);
    }

}

