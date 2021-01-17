import { take, switchMap, filter, map } from 'rxjs/operators';
import { AppConfig } from '../../core';
import { AuthTokenFlowService } from './auth-token-flow.service';
import { throwError as _throw, Observable, of, from as fromPromise, Subject } from 'rxjs';

import { NgZone } from '@angular/core';
import { AzureAuthInfo, User, TenentValidated } from '../models/auth';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

declare var gapi: any;


export class GoogleTokenFlowService implements AuthTokenFlowService {

    private isSignedInListner = new Subject<boolean>();
    private authContext: any;

    constructor(private appConfig: AppConfig, private scope: string) {
        this.authContext = gapi.auth2.getAuthInstance();
        this.authContext.isSignedIn.listen((isSignedIn) => {
            this.isSignedInListner.next(isSignedIn);
        });
    }

    public getAuthScopes(): string {
        return this.scope;
    }

    public isGoogle() {
        return true;
    }

    getAuthContext() {
        return this.authContext;
    }

    public login() {
        if (this.authContext.isSignedIn.get()) {
            const user = this.authContext.currentUser.get();
            const isAuthorized = user.hasGrantedScopes(this.scope);
            if (isAuthorized) {
                return this.getLoginToken();
            } else {
                user.disconnect();
            }
        }

        setTimeout(() => {
            this.authContext.signIn();
        }, 0);

        return this.isSignedInListner.pipe(
            filter(login => login),
            switchMap(() => this.getLoginToken()),
            take(1));
    }
    public loginUrlPopup(): Observable<any> {
        return this.login();
    }

    public logout() {
        return fromPromise(this.authContext.signOut()).pipe(map((ok: boolean) => ok));
    }

    private getCachedToken(resource) {

    }

    public getAuthCode() {
        if (this.authContext.isSignedIn.get()) {
            const user = this.authContext.currentUser.get();
            const isAuthorized = user.hasGrantedScopes(this.scope);
            if (isAuthorized) {
                return fromPromise(this.authContext.grantOfflineAccess()).pipe(map((res: any) => res.code));
            }
        }
        return of(null);
    }

    public getLoginToken() {
        if (this.authContext.isSignedIn.get()) {
            const user = this.authContext.currentUser.get();
            const isAuthorized = user.hasGrantedScopes(this.scope);
            if (isAuthorized) {
                const response = user.getAuthResponse();
                const now = new Date().getTime();
                if (response.expires_at < (now - 60 * 15)) {
                    return fromPromise(user.reloadAuthResponse()).pipe(map((res: any) => res.id_token));
                } else {
                    return of(response.id_token);
                }
            } else {
                // user.disconnect();
            }
        }
        return of(null);
    }

    public isCallback(hash) {
        throw new Error('Google authentication not required to handle isCallback');
    }

    public getRequestInfo(hash) {
        throw new Error('Google authentication not required to handle getRequestInfo');
    }

    public saveTokenFromRequestInfo(requestInfo) {
        throw new Error('Google authentication not required to handle saveTokenFromHash');
    }

    public processTokenAcquire(hash) {
        throw new Error('Google authentication not required to handle processTokenAcquire');
    }

    public processAuthToken(hash, _ngZone: NgZone) {
        throw new Error('Google authentication not required to handle processAuthToken');
    }

    public isLoginCallback(hash) {
        throw new Error('Google authentication not required to handle isLoginCallback');
    }

    public isTokenAqureCallback(hash) {
        throw new Error('Google authentication not required to handle isTokenAqureCallback');
    }

    public acquireToken(resource, _ngZone: NgZone): Observable<string> {
        return this.getLoginToken().pipe(switchMap((token) => {
            if (token) {
                return of(token);
            }
            return _throw('User not login');
        }));
    }

    public acquireGraphApiToken(_ngZone: NgZone) {
        throw new Error('Google authentication not use Graph API');
    }

    public acquireOutlookApiToken(_ngZone: NgZone) {
        throw new Error('Google authentication not use Outlook API');
    }

    public acquireDpsWebServiceToken(_ngZone: NgZone): Observable<string> {
        return this.acquireToken(null, _ngZone);
    }

    public acquireWopiWebServiceToken(_ngZone: NgZone): Observable<string> {
        return this.acquireToken(null, _ngZone);
    }

    public getCachedAuthInfo(_ngZone: NgZone): Observable<AzureAuthInfo> {
        return this.getAuthInfo(_ngZone);
    }

    public getAuthInfo(_ngZone: NgZone) {
        return this.acquireToken(null, _ngZone).pipe(
            map((token) => {
                const user = this.authContext.currentUser.get();
                const profile = user.getBasicProfile();
                const dpsUser = {
                    userName: profile.getName(),
                    profile: { upn: profile.getEmail(), name: profile.getName() },
                    userImage: profile.getImageUrl()
                } as any;
                return new AzureAuthInfo(token, dpsUser, true);
            }));
    }

    public getLoginExpireTs() {
        if (this.authContext.isSignedIn.get()) {
            const user = this.authContext.currentUser.get();
            const response = user.getAuthResponse();
            const now = new Date().getTime();
            if (response.expires_at < (now - 60 * 15)) {
                return fromPromise(user.reloadAuthResponse()).pipe(
                    map((res: any) => res.expires_at / 1000));
            } else {
                return of(response.expires_at / 1000);
            }
        }
        return of((new Date().getTime() / 1000) + 60 * 5);
    }

    // || authResult['body'].detailStatus[0].message == 'The underlying provider failed on Open.'
    public authorizeDps(idToken, authResult: HttpErrorResponse | TenentValidated, httpClient: HttpClient) {
        const redirectUrl = encodeURIComponent(window.location.protocol + '//' + window.location.host);
        if ((authResult instanceof HttpErrorResponse && authResult.status === 403)) {
            return this.getAuthCode().pipe(switchMap((code) => {
                return httpClient.get<TenentValidated>(this.appConfig.serviceBase +
                    '/General/InitializeGoogleUser?authCode=' + code + '&redirectUrl=' + redirectUrl).pipe(
                        map(result => {
                            return result.status === 'Success';
                        }));
            }));
        } else if (authResult && authResult.status === 'Success') {
            return of(true);
        }

        return of(false);
    }
}

