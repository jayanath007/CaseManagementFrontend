
import { catchError, mergeMap, map, switchMap, tap, take } from 'rxjs/operators';
import { of, from, combineLatest } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { InitialSettingsService } from '../services/initial-settings.service';
import * as AuthCore from '../../auth';
import { getInitialSettingStateByToken } from '..';

@Injectable()
export class InitialSettingsEffects {

    constructor(private actions$: Actions, private store: Store<any>, private initialSettingsService: InitialSettingsService) {
    }

    @Effect()
    initInitialSettingsdata$ = this.actions$.pipe(ofType<Core.InitInitialSettings>(Core.INIT_INITIAL_SETTINGS),
        mergeMap((action) => {
            return from([new Core.LoadInitialSettingsTimeZones(action.token),
            new Core.LoadInitialSettingsLanguages(action.token),
            new Core.LoadInitialSettingsUserTimeZone(action.token),
            new Core.LoadInitialSettingsUserLanguage(action.token)
            ]);
        }));

    @Effect()
    LoadTimeZonesData$ = this.actions$.pipe(ofType<Core.LoadInitialSettingsTimeZones>(Core.LOAD_INITIAL_SETTINGS_TIME_ZONES),
        switchMap((action: Core.LoadInitialSettingsTimeZones) =>
            this.initialSettingsService.getSupportedTimeZones().pipe(map((response) =>
                new Core.LoadInitialSettingsTimeZonesSuccess(action.token, { timeZones: response })),
                catchError(error => of(new Core.LoadInitialSettingsTimeZonesFail(action.token, error))))
        ));

    @Effect()
    LoadUserTimeZoneData$ = this.actions$.pipe(ofType<Core.LoadInitialSettingsUserTimeZone>(Core.LOAD_INITIAL_SETTINGS_USER_TIME_ZONE),
        switchMap((action: Core.LoadInitialSettingsUserTimeZone) =>
            this.initialSettingsService.getUserTimeZone().pipe(map((response) =>
                new Core.LoadInitialSettingsUserTimeZoneSuccess(action.token, { userTimeZone: response })),
                catchError(error => of(new Core.LoadInitialSettingsUserTimeZoneFail(action.token, error))))
        ));

    @Effect()
    LoadLanguagesData$ = this.actions$.pipe(ofType<Core.LoadInitialSettingsLanguages>(Core.LOAD_INITIAL_SETTINGS_TIME_ZONES),
        switchMap((action: Core.LoadInitialSettingsLanguages) =>
            this.initialSettingsService.getSupportedLanguages().pipe(
                map((response) => new Core.LoadInitialSettingsLanguagesSuccess(action.token, { languages: response })),
                catchError(error => of(new Core.LoadInitialSettingsLanguagesFail(action.token, error)))
            )
        ));

    @Effect()
    LoadUserLanguageData$ = this.actions$.pipe(ofType<Core.LoadInitialSettingsUserLanguage>(Core.LOAD_INITIAL_SETTINGS_USER_TIME_ZONE),
        switchMap((action: Core.LoadInitialSettingsUserLanguage) =>
            this.initialSettingsService.getUserLanguage().pipe(
                map((response) => new Core.LoadInitialSettingsUserLanguageSuccess(action.token, { language: response })),
                catchError(error => of(new Core.LoadInitialSettingsUserLanguageFail(action.token, error)))
            )
        ));

    @Effect()
    onsubmit$ = this.actions$.pipe(ofType<Core.InitialSettingsSubmit>(Core.INITIAL_SETTINGS_SUBMIT),
        switchMap((action: Core.InitialSettingsSubmit) =>
            this.store.select(getInitialSettingStateByToken(action.token)).pipe(
                map((currentState) => ({ currentState, token: action.token })),
                take(1))
        ), switchMap<any, Core.Any>((info) => {
            if (info.currentState.userTimeZone) {
                return of(new Core.UpdateInitialSettings(info.token, { currentState: info.currentState }));
            } else {
                return of(new Core.InitialSettingsSubmitFail(info.token));
            }

        }));


    @Effect()
    onUpdateInitialSettings$ = this.actions$.pipe(ofType<Core.UpdateInitialSettings>(Core.UPDATE_INITIAL_SETTINGS),
        switchMap((action: Core.UpdateInitialSettings) =>
            this.initialSettingsService.updateInitialSettings(action.payload.currentState).pipe(map((response) =>
                new Core.UpdateInitialSettingsSuccess(action.token)),
                catchError(error => of(new Core.UpdateInitialSettingsFail(action.token, error))))
        ));


    // @Effect()
    // onSubmit$ = this.actions$.ofType<Core.Submit>(Core.SUBMIT)
    //     .switchMap((action: Core.Submit) =>
    //         this.store.select(getOrganizerSettingStateByToken(action.token))
    //             .map((currentState) => ({ currentState, token: action.token }))
    //             .take(1)
    //     )
    //     .switchMap((info) => {
    //         if (info.currentState.isExtensionsAvalible && info.currentState.isSignatureAvailable) {
    //             // all settings are available
    //             if (info.currentState.isDirty) {
    //                 return from([new Core.UpdateExtensions(info.token, { currentState: info.currentState })
    //                     , new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
    //                     , new Core.UpdateSignature(info.token, { currentState: info.currentState })
    //                 ]);
    //             } else {
    //                 return of(new Core.NoUpdateNeed(info.token));
    //             }
    //         } else if (!info.currentState.isExtensionsAvalible && !info.currentState.isSignatureAvailable) {
    //             // all settings are not available
    //             return from([new Core.CreateExtensions(info.token, { currentState: info.currentState })
    //                 , new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
    //                 , new Core.UpdateSignature(info.token, { currentState: info.currentState })
    //             ]);
    //         } else if (!info.currentState.isExtensionsAvalible) {
    //             // extentions not available
    //             return from([new Core.CreateExtensions(info.token, { currentState: info.currentState })
    //                 , new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
    //                 , new Core.UpdateSignature(info.token, { currentState: info.currentState })
    //             ]);
    //         } else if (!info.currentState.isSignatureAvailable) {
    //             // signature not available
    //             return from([new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
    //                 , new Core.UpdateExtensions(info.token, { currentState: info.currentState })
    //                 , new Core.UpdateSignature(info.token, { currentState: info.currentState })
    //             ]);
    //         }
    //     });

    // @Effect()
    // onUpdateEctensions$ = this.actions$.ofType<Core.UpdateExtensions>(Core.UPDATE_EXTENSIONS)
    //     .switchMap((action: Core.UpdateExtensions) =>
    //         this.organizerSettingsService.updateExtensions(action.payload.currentState).map((response) =>
    //             new Core.UpdateExtensionsSuccess(action.token))
    //             .catch(error => of(new Core.UpdateExtensionsFail(action.token, error)))
    //     );

    // @Effect()
    // onUpdateSignature$ = this.actions$.ofType<Core.UpdateSignature>(Core.UPDATE_SIGNATURE)
    //     .switchMap((action: Core.UpdateSignature) =>
    //         this.organizerSettingsService.updateSignature(action.payload.currentState).map((response) =>
    //             new Core.UpdateSignatureSuccess(action.token))
    //             .catch(error => of(new Core.UpdateSignatureFail(action.token, error)))
    //     );

    // @Effect()
    // onUpdateTimeZone$ = this.actions$.ofType<Core.UpdateTimeZone>(Core.UPDATE_USER_TIME_ZONE)
    //     .switchMap((action: Core.UpdateTimeZone) =>
    //         this.organizerSettingsService.updateUserTimeZone(action.payload.currentState).map((response) =>
    //             new Core.UpdateTimeZoneSuccess(action.token))
    //             .catch(error => of(new Core.UpdateTimeZoneFail(action.token, error)))
    //     );

    // @Effect()
    // onCreateEctensions$ = this.actions$.ofType<Core.CreateExtensions>(Core.CREATE_EXTENSIONS)
    //     .switchMap((action: Core.CreateExtensions) =>
    //         this.organizerSettingsService.createExtensions(action.payload.currentState).map((response) =>
    //             new Core.CreateExtensionsSuccess(action.token))
    //             .catch(error => of(new Core.CreateExtensionsFail(action.token, error)))
    //     );

    // @Effect()
    // updateSignatureDataSuccess$ = this.actions$.ofType<Core.UpdateSignatureSuccess>(Core.UPDATE_SIGNATURE_SUCCESS)
    //     .do(action => console.log('LoadSignatureDataSuccess'))
    //     .switchMap((action: Core.UpdateSignatureSuccess) =>
    //         combineLatest(
    //             this.store.select(getOrganizerSettingSignatureByToken(action.token)),
    //             ((signature) => ({ signature, token: action.token }))
    //         ).take(1)
    //             .map((data) => new AuthCore.LoadSignatureSuccess({ signature: data.signature }))
    //     );

    // @Effect()
    // updateTimeZoneDataSuccess$ = this.actions$.ofType<Core.UpdateTimeZoneSuccess>(Core.UPDATE_USER_TIME_ZONE_SUCCESS)
    //     .do(action => console.log('updateTimeZoneDataSuccess'))
    //     .switchMap((action: Core.UpdateTimeZoneSuccess) =>
    //         combineLatest(
    //             this.store.select(getOrganizerSettingsFullUserTimeZoneByToken(action.token)),
    //             ((userTimeZone) => ({ userTimeZone, token: action.token }))
    //         ).take(1)
    //             .map((data) => new AuthCore.LoadUserTimeZoneSuccess({
    //                 userTimeZone: data.userTimeZone,
    //                 value: data.userTimeZone.displayName.substring(1, 10)
    //             }))

    //     );

    // @Effect()
    // updateExtensionDataSuccess$ = this.actions$.ofType<Core.UpdateExtensionsSuccess>(Core.UPDATE_EXTENSIONS_SUCCESS)
    //     .do(action => console.log('updateExtensionDataSuccess'))
    //     .switchMap((action: Core.UpdateExtensionsSuccess) =>
    //         combineLatest(
    //             this.store.select(getOrganizerSettingsIsChaserEnableByToken(action.token)),
    //             this.store.select(getOrganizerSettingsIsSignatureAutoAddByToken(action.token)),
    //             ((IsChaserEnable, IsSignatureAutoAdd) => ({ IsChaserEnable, IsSignatureAutoAdd, token: action.token }))
    //         ).take(1)
    //             .map((data) => new AuthCore.LoadAllExtensionsSuccess({
    //                 isChaserEnable: data.IsChaserEnable,
    //                 isSignatureAutoAdd: data.IsSignatureAutoAdd
    //             }))
    //     );

    // @Effect()
    // createExtensionDataSuccess$ = this.actions$.ofType<Core.CreateExtensionsSuccess>(Core.CREATE_EXTENSIONS_SUCCESS)
    //     .do(action => console.log('updateExtensionDataSuccess'))
    //     .switchMap((action: Core.CreateExtensionsSuccess) =>
    //         combineLatest(
    //             this.store.select(getOrganizerSettingsIsChaserEnableByToken(action.token)),
    //             this.store.select(getOrganizerSettingsIsSignatureAutoAddByToken(action.token)),
    //             ((IsChaserEnable, IsSignatureAutoAdd) => ({ IsChaserEnable, IsSignatureAutoAdd, token: action.token }))
    //         ).take(1)
    //             .map((data) => new AuthCore.LoadAllExtensionsSuccess({
    //                 isChaserEnable: data.IsChaserEnable,
    //                 isSignatureAutoAdd: data.IsSignatureAutoAdd
    //             }))
    //     );
}


