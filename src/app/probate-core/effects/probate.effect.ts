
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';

import * as Probate from '../actions/core';
import { switchMap, tap, catchError, map, mergeMap, take } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { ProbateService } from '../services/probate-service';
import { getMatterDataByToken } from '../reducers/index';
import { WebViewService } from '../../azure-storage';
import { centerToWindow } from '../../utils/bounds';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { AzureHttpClientService } from '../../azure-storage/services/azure-http-client.service';




@Injectable()
export class ProbateEffects {

    constructor(private datePipe: DatePipe, private actions$: Actions, private store: Store<any>,
        private probateService: ProbateService, private webViewService: WebViewService,
        private windowPopupsManagerService: WindowPopupsManagerService,
        private azureHttpService: AzureHttpClientService) { }

    @Effect()
    initPostingPeriod$ = this.actions$.pipe(ofType<Probate.InitProbate>(Probate.INIT_PROBATE),
        mergeMap(action => from([
            new Probate.GetProbateData(action.token, { data: action.payload.data }),
            new Probate.GetDropDownCategories(action.token)
        ])));


    @Effect()
    probateData$ = this.actions$.pipe(ofType<Probate.GetProbateData>(Probate.GET_PROBATE_DATA),
        switchMap((action) =>
            this.probateService.getProbateData(action.payload.data).pipe(
                map((result) => new Probate.GetProbateDataSuccess(action.token, { data: result })),
                catchError((error) => of(new Probate.GetProbateDataFail(action.token, error))))
        ));

    @Effect()
    updateData$ = this.actions$.pipe(ofType<Probate.RnrbDataUpdate>(Probate.RNRB_DATA_UPDATE),
        switchMap(action =>
            this.store.select(getMatterDataByToken(action.token)).pipe(
                map(types => ({
                    matterInfo: types, rnrbUpdateData: action.rnrbUpdateData,
                    spouserCivilData: action.spouserCivilData, token: action.token
                })),
                take(1),
                switchMap((info) =>
                    this.probateService.updateRnrbData(info.rnrbUpdateData, info.spouserCivilData, info.matterInfo).pipe(
                        map((result) => new Probate.RnrbDataUpdateSuccess(action.token, { data: result }
                            , info.rnrbUpdateData, info.spouserCivilData)),
                        catchError((error) => of(new Probate.SaveProbateAccountItemFail(action.token, error))))
                ))));

    @Effect()
    refreshData$ = this.actions$.pipe(ofType<Probate.RefreshProbateData>(Probate.REFRESH_PROBATE_DATA),
        switchMap(action =>
            this.store.select(getMatterDataByToken(action.token)).pipe(
                map(types => ({
                    matterInfo: types, token: action.token
                })),
                take(1),
                switchMap((info) =>
                    this.probateService.refeshProbateData(info.matterInfo).pipe(
                        map((result) => new Probate.RefreshProbateDataSuccess(action.token, { data: result })),
                        catchError((error) => of(new Probate.RefreshProbateDataFail(action.token, error))))
                ))));


    @Effect()
    deleteProbateAccount$ = this.actions$.pipe(ofType<Probate.DeleteProbateAccountItem>(Probate.DELETE_PROBATE_ACCOUNT_DATA),
        switchMap((action) =>
            this.probateService.deleteAccountItem(action.probateId).pipe(
                map((result) => new Probate.DeleteProbateAccountItemSuccess(action.token, { data: result })),
                catchError((error) => of(new Probate.DeleteProbateAccountItemFail(action.token, error))))
        ));



    @Effect()
    deleteProbateItem$ = this.actions$.pipe(ofType<Probate.DeleteProbateItem>(Probate.DELETE_PROBATE_DATA),
        switchMap((action) =>
            this.probateService.deleteProbateItem(action.probateId).pipe(
                map((result) => new Probate.DeleteProbateItemSuccess(action.token, { data: result })),
                catchError((error) => of(new Probate.DeleteProbateItemFail(action.token, error))))
        ));

    @Effect()
    RefreshProbateGridData$ = this.actions$.pipe(ofType<Probate.DeleteProbateItemSuccess>(Probate.DELETE_PROBATE_DATA_SUCCESS),
        map((action) => {

            return new Probate.RefreshProbateData(action.token);

        }));

    @Effect()
    RefreshGridData$ = this.actions$.pipe(ofType<Probate.DeleteProbateAccountItem>(Probate.DELETE_PROBATE_ACCOUNT_DATA),
        map((action) => {

            return new Probate.RefreshProbateData(action.token);

        }));


    @Effect()    // IHT Form
    generateForm$ = this.actions$.pipe(ofType<Probate.ProbateIhtGenerateForm>(Probate.PROBATE_IHT_GENERATE_FORM),
        switchMap(action =>
            this.store.select(getMatterDataByToken(action.token)).pipe(
                map(types => ({
                    matterInfo: types, token: action.token
                })),
                take(1),
                switchMap((info) =>
                    this.azureHttpService.generateProbateForms(info.matterInfo, action.data).pipe(
                        map((result) => new Probate.ProbateIhtGenerateFormSuccess(action.token, { data: result })),
                        catchError((error) => of(new Probate.ProbateIhtGenerateFormFail(action.token, error))))
                ))));
    @Effect()
    RefreshGenerateForm$ = this.actions$.pipe(ofType<Probate.ProbateIhtGenerateFormSuccess>
        (Probate.PROBATE_IHT_GENERATE_FORM_SUCCESS),
        map((action) => {

            return new Probate.RefreshProbateData(action.token);

        }));
    @Effect()  // IHT Account
    generateAccount$ = this.actions$.pipe(ofType<Probate.ProbateIhtGenerateAccounts>(Probate.PROBATE_IHT_GENERATE_ACCOUNTS),
        switchMap(action =>
            this.store.select(getMatterDataByToken(action.token)).pipe(
                map(types => ({
                    matterInfo: types, token: action.token
                })),
                take(1),
                switchMap((info) =>
                    this.azureHttpService.generateProbateAccount(info.matterInfo).pipe(
                        map((result) => new Probate.ProbateIhtGenerateAccountsSuccess(action.token, { data: result })),
                        catchError((error) => of(new Probate.ProbateIhtGenerateAccountsFail(action.token, error))))
                ))));

    @Effect()
    RefreshGenerateAccount$ = this.actions$.pipe(ofType<Probate.ProbateIhtGenerateAccountsSuccess>
        (Probate.PROBATE_IHT_GENERATE_ACCOUNTS_SUCCESS),
        map((action) => {

            return new Probate.RefreshProbateData(action.token);

        }));


    @Effect()
    loadDiaryWebViewUrl$ = this.actions$.pipe(ofType<Probate.ProbateOpenIhtForm>(Probate.PROBATE_OPEN_IHT_FORM),
        switchMap(action =>
            this.store.select(getMatterDataByToken(action.token)).pipe(
                map(types => ({
                    matterInfo: types, row: action.row, token: action.token
                })),
                take(1),
                switchMap((data) => {
                    return this.webViewService.getDiaryWebViewUrlByDiaryId(data.row.diaryId, data.row.fileName).pipe(
                        map((url) => {
                            return new Probate.ProbateOpenIhtFormSuccess(data.token, data.row.diaryId, url);
                        }),
                        catchError(() => {
                            return of(new Probate.ProbateOpenIhtFormFail(data.token));
                        }));
                }))));

    @Effect({ dispatch: false })
    openNewTab$ = this.actions$.pipe(ofType<Probate.ProbateOpenIhtFormSuccess>(Probate.PROBATE_OPEN_IHT_FORM_SUCCESS), tap((data) => {
        const spec = {
            ...centerToWindow(800, 600),
            toolbar: false,
            location: false,
            directories: false,
            status: false,
            menubar: false,
            scrollbars: false,
        };
        this.windowPopupsManagerService.openWindow(data.diaryId.toString(),
            data.url, spec, 'pdf');
    }));



}
