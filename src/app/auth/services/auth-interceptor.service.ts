
import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthInfoStateService } from './auth-info-state.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authHelper: AuthInfoStateService) {
    console.log('auth interceptor created');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const selectedDb = this.authHelper.getSelectedDatabase();

    if (selectedDb && this.authHelper.isDpsApi(req.url)) {
      req = req.clone({ setHeaders: { 'DPS-Selected-Database': selectedDb } });
    } else if (selectedDb && this.authHelper.isV3Api(req.url)) {
      // req = req.clone({ setHeaders: { 'X-DPS-TenantId': 'ae771e34-6384-4a82-8de8-3ad0ed23e56e'} });
      req = req.clone({ setHeaders: { 'X-DPS-DatabaseId': selectedDb } });
    }

    if (this.authHelper.isV3Api(req.url) && !req.headers.get('traceparent')) {
      req = req.clone({ setHeaders: { traceparent: this.authHelper.getNewTraceparent() } });
    }

    if (req.headers.keys().includes('Authorization')) {
      return next.handle(req);
    }

    let authToken$ = of('');
    if (this.authHelper.isDpsApi(req.url)) {
      authToken$ = this.authHelper.acquireDpsWebServiceToken();
    } else if (this.authHelper.isV3Api(req.url)) {
      authToken$ = this.authHelper.acquireDpsV3ApiToken();
    }

    return authToken$.pipe(mergeMap((token) => {
      if (token === '') {
        return next.handle(req);
      }
      const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
      return next.handle(authReq);
    }));
  }




}
