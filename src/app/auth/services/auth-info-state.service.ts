
import { map, filter } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { AzureAuthInfo } from '../models/auth';
import {
  getUser, getAccessToken, getGlobalSignatureForTemplete,
  getGlobalSignature, getGlobalSignatureTempIsLoading
} from '../reducers';
import { AzureAuthService } from './azure-auth.service';
import { Logout } from '../actions/auth';
import { AppConfig } from '../../core';
import { uuid } from '../../utils/uuid';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInfoStateService {

  constructor(private store: Store<AzureAuthInfo>, private authService: AzureAuthService,
    private appConfig: AppConfig) {
  }

  public getAccessToken() {
    return this.store.select(getAccessToken);
  }

  public getUser() {
    return this.store.select(getUser);
  }
  public getPDFViewerJwtToken() {
    return this.store.select(getUser).pipe(filter(user => !!user.pdfViewerJwtToken), map(user => user.pdfViewerJwtToken));
  }

  public isGoogle() {
    return this.authService.isGoogle();
  }

  public getAuthCode() {
    return this.authService.getAuthCode();
  }

  public getGraphApiToken() {
    return this.authService.acquireGraphApiToken();
  }

  public getOutlookApiToken() {
    return this.authService.acquireOutlookApiToken();
  }

  public acquireDpsWebServiceToken() {
    return this.authService.acquireDpsWebServiceToken();
  }
  public acquireDpsV3ApiToken() {
    return this.authService.acquireDpsV3ApiToken();
  }

  public isDpsApi(url: string) {
    return url.startsWith(this.appConfig.serviceBase) || url.startsWith(this.appConfig.serviceBase2);
  }

  public isApiv3CrimeApi(url: string) {
    return url.startsWith(this.appConfig.apiv3CrimeApi);
  }
  public isApiv3FormsLibrary(url: string) {
    return url.startsWith(this.appConfig.apiv3FormsLibraryApi);
  }
  public isApiv3Opportunity(url: string) {
    return url.startsWith(this.appConfig.apiv3OpportunityApi);
  }

  public isApiv3SolicitorApi(url: string) {
    return url.startsWith(this.appConfig.apiv3SolicitorApi);
  }
  public isApiv3teamTalkApi(url: string) {
    return url.startsWith(this.appConfig.apiv3TeamTalkApi);
  }

  public isApiv3ProbateApi(url: string) {
    return url.startsWith(this.appConfig.apiv3ProbateApi);
  }


  public isApiv3PrecidentHApi(url: string) {
    return url.startsWith(this.appConfig.apiv3PrecidentHApi);
  }
  public isStorageV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3StorageProxy);
  }
  public isFileserverV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3FileserverApi);
  }
  public isDiaryV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3DiaryApi);
  }
  public isDocumentHandlerV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3DocumentHandler);
  }
  public isDocumentHandlerProxyV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3DocumentHandlerProxy);
  }
  public isDurableProxyV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3DurableProxy);
  }
  public isInboxV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3Inbox);
  }
  public isSafeboxV3Api(url: string) {
    return url.startsWith(this.appConfig.apiv3SafeboxApi);
  }
  public isApiv3Civil(url: string) {
    return url.startsWith(this.appConfig.apiv3CivilApi);
  }

  public isGraphApi(url: string) {
    return url.startsWith(this.appConfig.graphApiBase);
  }

  public logOut() {
    this.store.dispatch(new Logout());
  }

  public getSelectedDatabase() {
    return this.authService.getSelectedDatabase();
  }

  public getNewTraceparent() {
    const requestId = uuid().replace(/-/g, '');
    return `00-${requestId}-${this.authService.getSessionParentId()}-01`;
  }

  public isV3Api(url: string): boolean {
    if (this.isApiv3CrimeApi(url)) {
      return true;
    } else if (this.isApiv3SolicitorApi(url)) {
      return true;
    } else if (this.isApiv3teamTalkApi(url)) {
      return true;
    } else if (this.isApiv3PrecidentHApi(url)) {
      return true;
    } else if (this.isApiv3ProbateApi(url)) {
      return true;
    } else if (this.isStorageV3Api(url)) {
      return true;
    } else if (this.isFileserverV3Api(url)) {
      return true;
    } else if (this.isDiaryV3Api(url)) {
      return true;
    } else if (this.isDocumentHandlerV3Api(url)) {
      return true;
    } else if (this.isDocumentHandlerProxyV3Api(url)) {
      return true;
    } else if (this.isDurableProxyV3Api(url)) {
      return true;
    } else if (this.isInboxV3Api(url)) {
      return true;
    } else if (this.isApiv3Opportunity(url)) {
      return true;
    } else if (this.isSafeboxV3Api(url)) {
      return true;
    } else if (this.isApiv3FormsLibrary(url)) {
      return true;
    } else if (this.isApiv3Civil(url)) {
      return true;
    } else {
      return false;
    }
  }
  public getGlobalSignatureForTemplete(Template: string): Observable<string> {
    return this.store.select(getGlobalSignatureForTemplete(Template));
  }

  public getGlobalSignature() {
    return this.store.select(getGlobalSignature());
  }

  public getGlobalSignatureForTempleteIsLoading(): Observable<boolean> {
    return this.store.select(getGlobalSignatureTempIsLoading());
  }
}

