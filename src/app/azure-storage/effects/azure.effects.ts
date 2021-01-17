import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as Azure from '../actions/azure';
import { switchMap, catchError, map, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { AzureHttpClientService } from '../services/azure-http-client.service';

@Injectable()
export class AzureEffects {
    constructor(private service: AzureHttpClientService, private actions$: Actions) { }

    @Effect()
    getDiaryWebViewToken$ = this.actions$.pipe(ofType<Azure.ChangeDiaryWebViewToken>(Azure.CHANGE_DIARY_WEB_VIEW_TOKEN),
        filter(action => action.webViewToken.isRequesting),
        switchMap((action) => {
            return this.service.getDiaryWebViewToken(action.appCode, action.branchId, action.fileId).pipe(
                map((response) => new Azure.ChangeDiaryWebViewToken(action.appCode, action.branchId, action.fileId, {
                    ...response,
                    expireTimeValue: (new Date().valueOf()) + ((response.expireInSeconds - (5 * 60)) * 1000),
                    isRequesting: false
                })),
                catchError(error => of(new Azure.ChangeDiaryWebViewToken(
                    action.appCode, action.branchId, action.fileId, { ...action.webViewToken, isRequesting: false }
                )))
            );
        })
    );

    @Effect()
    getDiaryWebViewTokenByKey$ = this.actions$.pipe(ofType<Azure.ChangeDiaryWebViewTokenByDiaryId>
        (Azure.CHANGE_DIARY_WEB_VIEW_TOKEN_BY_DIARY_ID),
        filter(action => action.webViewToken.isRequesting),
        switchMap((action) => {
            return this.service.getDiaryWebViewTokenByDiaryId(action.diaryId).pipe(
                map((response) => new Azure.ChangeDiaryWebViewTokenByDiaryId(action.diaryId, {
                    ...response,
                    expireTimeValue: (new Date().valueOf()) + ((response.expireInSeconds - (5 * 60)) * 1000),
                    isRequesting: false
                })),
                catchError(error => of(new Azure.ChangeDiaryWebViewTokenByDiaryId(
                    action.diaryId, { ...action.webViewToken, isRequesting: false }
                )))
            );
        })
    );
}
