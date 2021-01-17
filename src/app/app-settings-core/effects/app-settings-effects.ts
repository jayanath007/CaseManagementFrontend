
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { AppSettingsService } from '../services/app-settings-service';

@Injectable()
export class AppSettingsEffects {

    constructor(private actions$: Actions, private store: Store<any>, private appSettingsService: AppSettingsService) {

    }

    @Effect()
    initAppSettingsdata$ = this.actions$.pipe(ofType<Core.InitAppSettings>(Core.INIT_APP_SETTINGS),
        tap(action => console.log('initAppSettingsdata')),
        switchMap((action: Core.InitAppSettings) =>
            this.appSettingsService.getIsChaserEnable().pipe(map((response) =>
                new Core.InitAppSettingsSuccess(action.token, { isChaserEnable: response })),
                catchError(error => of(new Core.InitAppSettingsFail(action.token, error))))
        ));

}


