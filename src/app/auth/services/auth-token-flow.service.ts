import { Injectable } from '@angular/core';
import { AppConfig, Dictionary } from '../../core';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { AzureAuthInfo, TenentValidated, LoginMode } from '../models/auth';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable()
export abstract class AuthTokenFlowService {
    constructor() {
    }
    abstract getAuthContext();
    abstract login(): Observable<any>;
    abstract loginUrlPopup(): Observable<any>;
    abstract logout(): Observable<boolean>;
    abstract getLoginToken(): Observable<string>;
    abstract isCallback(hash);
    abstract getRequestInfo(hash);
    abstract saveTokenFromRequestInfo(requestInfo);
    abstract processTokenAcquire(hash);
    abstract isLoginCallback(hash);
    abstract processAuthToken(hash, _ngZone: NgZone);
    abstract isTokenAqureCallback(hash);
    abstract acquireToken(resource, _ngZone: NgZone);
    abstract getCachedAuthInfo(_ngZone: NgZone): Observable<AzureAuthInfo>;
    abstract getAuthInfo(_ngZone: NgZone);
    abstract getLoginExpireTs(): Observable<number>;
    abstract isGoogle();
    abstract getAuthCode(): Observable<string>;
    abstract authorizeDps(idToken: string, authResult: HttpErrorResponse | TenentValidated, httpClient: HttpClient): Observable<boolean>;
    abstract getAuthScopes(): string | Dictionary<string>;
}
