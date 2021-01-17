import { catchError, mergeMap, map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as Core from '../actions/core';
import { from, of } from 'rxjs';
import { SettingCoreService } from '../services/setting-core.service';
import { LocalStorageKey } from '../../core/index';

@Injectable()
export class SettingCoreEffect {
    constructor(private actions$: Actions, private store: Store<any>, private service: SettingCoreService) { }

    @Effect()
    initDPSSetting$ = this.actions$.pipe(ofType<Core.InitSettingCore>(Core.INIT_SETTING_CORE),
        mergeMap((action) => {
            return from([
                new Core.LoadHomeCurrency(),
                new Core.LoadTimeZonesData(),
                new Core.CheckDiaryModeCurrentUser(),
                new Core.GetTimeUseFeeEarnerRate()
            ]);
        }));


    @Effect()
    LoadHomeCurrency$ = this.actions$.pipe(ofType<Core.LoadHomeCurrency>(Core.LOAD_HOME_CURRENCY),
        switchMap((info) => {
            return this.service.getHomeCurrency().pipe(
                map((response) => {
                    localStorage.setItem(LocalStorageKey.HomeCurrency, JSON.stringify(response));
                    return new Core.LoadHomeCurrencySuccess({ homeCurrency: response });
                }),
                catchError(error => of(new Core.LoadDataFail())));

        }));

    @Effect()
    LoadTimeZones$ = this.actions$.pipe(ofType<Core.LoadTimeZonesData>(Core.LOAD_TIME_ZONES_DATA),
        switchMap((info) => {
            return this.service.getSupportedTimeZones().pipe(map((response) =>
                new Core.LoadTimeZonesDataSuccess({ timeZones: response })),
                catchError(error => of(new Core.LoadDataFail())));
        }));

    @Effect()
    CheckDiaryMode$ = this.actions$.pipe(ofType<Core.CheckDiaryModeCurrentUser>(Core.CHECK_DIARY_MODE_CURRENT_USER),
        switchMap(info => {
            return this.service.CheckDiaryModeCurrentUser().pipe(
                map(response => {
                    return new Core.CheckDiaryModeCurrentUserSuccess({ isLoginUser: response });
                }),
                catchError(error => of(new Core.CheckDiaryModeCurrentUserFail())));

        }));

    @Effect()
    GetTimeUseFeeEarnerGradesDisabale$ = this.actions$.pipe(ofType<Core.GetTimeUseFeeEarnerRate>(Core.CHECK_DIARY_MODE_CURRENT_USER),
        switchMap(info => {
            return this.service.GetTimeUseFeeEarnerGradesValueDisable().pipe(
                map(response => {
                    return new Core.GetTimeUseFeeEarnerRateSuccess({ TimeUseFeeEarnerGradesValueDisable: response });
                }),
                catchError(error => of(new Core.GetTimeUseFeeEarnerRateFail())));

        }));

}
