import { ProbateAccountService } from './../services/probate-account-service';
import { MainMenuService } from './../../layout-desktop/services/main-menu.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import * as Probate from '../../probate-core/actions/core';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, from, combineLatest } from 'rxjs';
import { tap, switchMap, map, catchError, mergeMap, take, filter, delay } from 'rxjs/operators';
import { getMatterDataByToken } from '../reducers/index';





@Injectable()
export class ProbateAccountEffects {
    constructor(private datePipe: DatePipe, private dialog: MatDialog,
        private actions$: Actions, private store: Store<any>, private service: ProbateAccountService,

        protected pageService: MainMenuService) { }

    @Effect()
    initewView$ = this.actions$.pipe(ofType<Core.InitProbateAccount>(Core.INIT_PROBATE_ACCOUNT),
        mergeMap(action => from([
            // new Core.RequestLinkedData(action.token),
        ])
        ));

    @Effect()
    saveAccountData$ = this.actions$.pipe(ofType<Core.SaveProbateAccountItem>(Core.SAVE_PROBATE_ACCOUNT_ITEM),
        switchMap(action =>
            this.store.select(getMatterDataByToken(action.token)).pipe(
                map(types => ({ types: types, accountData: action.accountData, token: action.token })),
                take(1),
                switchMap((info) =>
                    this.service.saveProbateAccount(info.accountData, info.types).pipe(
                        map((result) => new Core.SaveProbateAccountItemSuccess(action.token, { data: result })),
                        catchError((error) => of(new Core.SaveProbateAccountItemFail(action.token, error))))
                ))));


    @Effect()
    RefreshGridData$ = this.actions$.pipe(ofType<Core.SaveProbateAccountItemSuccess>(Core.SAVE_PROBATE_ACCOUNT_ITEM_SUCCESS),
        map((action) => {

            return new Probate.RefreshProbateData('Probate');

        }));

















}
