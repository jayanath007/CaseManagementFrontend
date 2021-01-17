
import { map, tap, catchError, take, switchMap, mergeMap } from 'rxjs/operators';
import { getBillingViewModaleCloseDataByToken } from '..';
import * as FileHistory from '../../file-history-core/actions/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { BillingGuideService } from '../services/billing guide-service';
import { of, from } from 'rxjs';
import { FileUrlResolverService } from '../../document-view';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';


@Injectable()
export class BillingGuideEffects {
    constructor(private datePipe: DatePipe, private dialog: MatDialog,
        private actions$: Actions, private store: Store<any>, private service: BillingGuideService,
        private popupService: WindowPopupsManagerService,
        private urlResolver: FileUrlResolverService) { }




    @Effect()
    loadPDFiURL$ = this.actions$.pipe(ofType<Core.BillingGuideSubmit>(Core.BILLING_GUIDE_SUBMIT),
        switchMap((data) => {
            return this.service.getBillingGuideReportCheck(data.payload.inputData).pipe(map((response) => {
                return { token: data.token, inputData: data.payload.inputData };
            }),
                catchError(error => of(new Core.BillingGuideSubmitFail(data.token, error))));
        }),
        switchMap((info) =>

            this.service.getBillingGuideReport(info['inputData']).pipe(map((response) =>
                new Core.BillingGuideSubmitSuccess(info.token, { data: response })),
                catchError(error => of(new Core.BillingGuideSubmitFail(info.token, error))))
        ));



    @Effect()
    loadCalTime$ = this.actions$.pipe(ofType<Core.InitBillingGuide>(Core.INIT_BILLING_GUIDE), tap((data) => {
    }),
        switchMap((info) =>
            this.service.getCalculateTime(info.payload.inputValue).pipe(map((response) =>
                new Core.InitBillingGuideSuccess(info.token, { data: response })),
                catchError(error => of(new Core.BillingGuideSubmitFail(info.token, error))))
        ));


    // @Effect()
    // closeSave$ = this.actions$.ofType<Core.BillingGuideAnalysisCloseSave>(Core.BILLING_GUIDE_ANALYSIS_CLOSE_SAVE).do((data) => {
    // })
    //     .switchMap((info) =>


    //         this.service.billingguideCloseSave(info.payload.saveData).map((response) =>
    //             new Core.BillingGuideAnalysisCloseSaveSuccess(info.token, { data: response }))
    //         //    .catch(error => of(new Core.BillingGuideSubmitFail(info.token, error)))
    //     );


    @Effect()
    closeSave$ = this.actions$.pipe(ofType<Core.BillingGuideAnalysisCloseSave>(Core.BILLING_GUIDE_ANALYSIS_CLOSE_SAVE),
        switchMap(action =>
            this.store.select(getBillingViewModaleCloseDataByToken(action.token)).pipe(
                map(billingGuideCloseSaveData => ({ billingGuideCloseSaveData, token: action.token })),
                take(1))),
        switchMap(info => {
            return this.service.billingguideCloseSave(info.billingGuideCloseSaveData).pipe(
                mergeMap((response) => {
                    const initFileHistoryToken = 'InitFileHistory' + info.billingGuideCloseSaveData.matterRef;
                    return from([new Core.BillingGuideAnalysisCloseSaveSuccess(info.token, { data: response }),
                    new FileHistory.FileHistoryRefresh(initFileHistoryToken)]);
                }), catchError(error => of(new Core.BillingGuideSubmitFail(info.token, error))));
        }));



    @Effect({ dispatch: false })
    openWindow$ = this.actions$.pipe(ofType<Core.OpenByUrl>(Core.OPEN_BY_URL),
        map(action => action.payload),
        tap(data => {
            this.popupService.openWindow(data.id, data.url, data.spec, 'pdf');
        }));

}
