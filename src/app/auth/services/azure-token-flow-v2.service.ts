import {
    UserAgentApplication,
    Configuration,
    AuthResponse,
    ServerHashParamKeys
} from 'msal';

import { AppConfig, Dictionary } from '../../core';
import { AuthTokenFlowService } from './auth-token-flow.service';
import { throwError as _throw, Observable, of, empty, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AzureAuthInfo, TenentValidated } from '../models/auth';
import { HttpErrorResponse } from '@angular/common/http';



const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
const buildMsalConfig = (config: Configuration): Configuration => {
    return {
        ...config,
        framework: {
            ...config.framework,
            isAngular: true
        }
    };
};

export class AzureTokenFlowV2Service extends UserAgentApplication implements AuthTokenFlowService {

    constructor(private appConfig: AppConfig) {
        super(buildMsalConfig({
            auth: {
                clientId: appConfig.appId,
                authority: 'https://login.microsoftonline.com/' + appConfig.tenant,
                validateAuthority: true,
                redirectUri: window.location.origin + '/login-redirect.html',
                postLogoutRedirectUri: window.location.origin,
                navigateToLoginRequestUrl: false,
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: isIE, // set to true for IE 11
            },
        }));
    }

    public isGoogle() {
        return false;
    }

    public getAuthScopes(): Dictionary<string> {
        return {
            'graph': this.appConfig.endpoints.graphApi + '/.default',
            'outlook': this.appConfig.endpoints.outlookApi + '/.default',
            'backend': this.appConfig.endpoints.dpsWebService + '/.default',
            'frontapp': this.appConfig.appId + '/.default'
        };
    }

    public getAuthCode(): Observable<string> {
        return empty();
    }

    getAuthContext() {
        return this;
    }
    public login() {
        // this.authContext.login();
        this.loginPopup();
        return empty();
    }

    public loginUrlPopup() {
        return from(this.loginPopup()).pipe(
            map((authResponse: AuthResponse) => {
                return authResponse;
            }));
    }

    public logout() {
        super.logout();
        return of(true);
    }

    public acquireToken(endpoint = '', _ngZone) {
        const observebale = from(super.acquireTokenSilent({ scopes: endpoint.split(' ') })).pipe(
            map((authResponse: AuthResponse) => {
                return authResponse.accessToken;
            }),
            catchError(error => {
                console.log('msal 2 error ' +  error);
                console.log('msal 2 error.status ' + status);
                console.log(error instanceof HttpErrorResponse);
                this.logout();
                return of('');
                // if (error instanceof HttpErrorResponse && error.status === 401) {
                //     // super.clearCacheForScope(null);
                // } else {
                //     return of('');
                //     // return throwError(error);
                // }
            })
        );
        return observebale;
    }

    public getAuthInfo(ngZone) {
        const account = super.getAccount();
        if (!account || !account.idToken) {
            return _throw('Token not available');
        }

        const dpsUser = {
            userName: account.userName,
            profile: { ...account.idToken, upn: account.userName, name: account.name },
        } as any;
        return of(new AzureAuthInfo(account.homeAccountIdentifier, dpsUser, true));
    }

    public getLoginExpireTs() {
        const account = super.getAccount();
        const exp = parseInt((account.idTokenClaims.exp), 10);
        return of(exp);
    }

    public getLoginToken() {
        const account = super.getAccount();
        return of(account.homeAccountIdentifier);
    }

    public authorizeDps(idToken, authResult: HttpErrorResponse | TenentValidated, abc) {
        if (authResult && authResult.status === 'Success') {
            return of(true);
        }
        return of(false);
    }

    public getCachedAuthInfo(ngZone): Observable<AzureAuthInfo> {
        return this.getAuthInfo(null);
    }

    // todo

    public isCallback(hash) {
        // throw new Error('Azure V2 authentication not required to handle isCallback');
        return true;
    }

    public getRequestInfo(hash) {
        throw new Error('Azure V2 authentication not required to handle isCallback');
        // return of('');
    }

    public saveTokenFromRequestInfo(requestInfo) {
        throw new Error('Azure V2 authentication not required to handle isCallback');
        // return of('');
    }


    public clearCacheForScope(accessToken: string) {
        return super.clearCacheForScope(accessToken);
    }

    public processTokenAcquire(hash) {
        throw new Error('Azure V2 authentication not required to handle isCallback');
        // const requestInfo = this.authContext.getRequestInfo(hash);
        // this.authContext.saveTokenFromHash(requestInfo);
        // if (requestInfo.stateMatch) {
        //     if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
        //         const callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse] || this.authContext.callback;

        //         if (callback && typeof callback === 'function') {
        //             // id_token or access_token can be renewed
        //             const token = requestInfo.parameters['access_token'] || requestInfo.parameters['id_token'];
        //             const error = requestInfo.parameters['error'];
        //             const errorDescription = requestInfo.parameters['error_description'];
        //             callback(errorDescription, token, error);
        //         }
        //         return true;
        //     }
        // }
        // return false;
    }

    public processAuthToken(hash, _ngZone) {
        return of('');
        // throw new Error('Azure V2 authentication not required to handle isCallback');
        // const resource = this.authContext.config.loginResource;
        // const requestInfo = this.authContext.getRequestInfo(hash);
        // this.authContext.saveTokenFromHash(requestInfo);
        // if (requestInfo.stateMatch) {
        //     if (requestInfo.requestType === this.authContext.REQUEST_TYPE.LOGIN) {
        //         return this.getAuthInfo(_ngZone);
        //     } else if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
        //         return this.getAuthInfo(_ngZone);
        //     }
        // }
        // this.authContext.clearCache();
    }

    public isLoginCallback(hash) {
        // throw new Error('Azure V2 authentication not required to handle isCallback');
        // if (!this.isCallback(hash)) {
        //     return false;
        // }
        // const requestInfo = this.authContext.getRequestInfo(hash);
        // if (requestInfo.requestType === this.authContext.REQUEST_TYPE.LOGIN) {
        //     return true;
        // }
        return false;
    }

    public isTokenAqureCallback(hash) {
        // throw new Error('Azure V2 authentication not required to handle isCallback');
        // if (!this.isCallback(hash)) {
        //     return false;
        // }
        // const requestInfo = this.authContext.getRequestInfo(hash);
        // if (requestInfo.requestType === this.authContext.REQUEST_TYPE.RENEW_TOKEN) {
        //     return true;
        // }
        return false;
    }
}
