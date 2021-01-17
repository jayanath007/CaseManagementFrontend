
import { take, mergeMap, filter, catchError, map, switchMap } from 'rxjs/operators';
import { of, from, combineLatest } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import {
    getOrganizerSettingStateByToken, getReminderSoundEnableByToken, getNewMailSoundEnableByToken,
    getMessageFormatByToken,
    getIsGlobalSignatureByToken
} from '../reducers';
import { OrganizerSettingsService } from '../services/organizer-settings-service';
import * as AuthCore from '../../auth';
import {
    getOrganizerSettingSignatureByToken, getOrganizerSettingsFullUserTimeZoneByToken
    , getOrganizerSettingsIsSignatureAutoAddByToken, getOrganizerSettingsIsChaserEnableByToken
} from '..';
import { getTimeZones } from '../../setting-core';
import { GetGlobalSignatureTemplete } from '../../auth/actions/auth';

@Injectable()
export class OrganizerSettingsEffects {

    constructor(private actions$: Actions, private store: Store<any>, private organizerSettingsService: OrganizerSettingsService) {

    }

    @Effect()
    initOrganizerSettingsdata$ = this.actions$.pipe(ofType<Core.InitOrganizerSettings>(Core.INIT_ORGANIZER_SETTINGS),
        mergeMap((action) => {
            return from([new Core.CheckSignature(action.token),
            new Core.LoadTimeZones(action.token),
            new Core.LoadUserTimeZone(action.token),
            new Core.LoadExtensions(action.token),
            new Core.LoadAutomaticRepliesSetting(action.token),
            new GetGlobalSignatureTemplete()
            ]);
        }));

    @Effect()
    LoadExtensionsData$ = this.actions$.pipe(ofType<Core.LoadExtensions>(Core.LOAD_EXTENSIONS),
        switchMap((action: Core.LoadExtensions) =>
            this.organizerSettingsService.getExtensions().pipe(map((response) =>
                new Core.LoadExtensionsSuccess(action.token, { extensions: response })),
                catchError(error => of(new Core.LoadExtensionsFail(action.token, error))))
        ));

    @Effect()
    checkSignatureData$ = this.actions$.pipe(ofType<Core.CheckSignature>(Core.CHECK_SIGNATURE),
        switchMap((action: Core.CheckSignature) =>
            this.organizerSettingsService.checkSignature().pipe(map((response) =>
                new Core.LoadSignature(action.token, { signatureUrl: response['@microsoft.graph.downloadUrl'] })),
                catchError(error => of(new Core.LoadSignatureFail(action.token, error))))
        ));

    @Effect()
    LoadSignatureData$ = this.actions$.pipe(ofType<Core.LoadSignature>(Core.LOAD_SIGNATURE),
        switchMap((action: Core.LoadSignature) =>
            this.organizerSettingsService.getSignature(action.payload.signatureUrl).pipe(map((response) =>
                new Core.LoadSignatureSuccess(action.token, { signature: response })),
                catchError(error => of(new Core.LoadSignatureFail(action.token, error))))
        ));


    @Effect()
    LoadTimeZonesData$ = this.actions$.pipe(ofType<Core.LoadTimeZones>(Core.LOAD_TIME_ZONES),
        switchMap((action: Core.LoadTimeZones) =>
            this.store.select(getTimeZones()).pipe(
                filter((timeZones) => !!timeZones && timeZones.length > 0),
                take(1),
                switchMap(val => {
                    return of(new Core.LoadTimeZonesSuccess(action.token, { timeZones: val })).pipe(
                        catchError(error => of(new Core.LoadTimeZonesFail(action.token, error))));
                }))
        ));
    @Effect()
    loadAutomaticRepliesSetting$ = this.actions$.pipe(ofType<Core.LoadAutomaticRepliesSetting>(Core.LOAD_AUTOMATIC_REPLIES_SETTING),
        switchMap(action =>
            this.organizerSettingsService.getAutomaticRepliesSetting().pipe(map((response) =>
                new Core.LoadAutomaticRepliesSettingSuccess(action.token, { automaticRepliesSetting: response })),
                catchError(error => of(new Core.LoadAutomaticRepliesSettingFail(action.token, error))))
        ));
    @Effect()
    LoadUserTimeZoneData$ = this.actions$.pipe(ofType<Core.LoadUserTimeZone>(Core.LOAD_USER_TIME_ZONE),
        switchMap((action: Core.LoadUserTimeZone) =>
            this.organizerSettingsService.getUserTimeZone().pipe(map((response) =>
                new Core.LoadUserTimeZoneSuccess(action.token, { userTimeZone: response })),
                catchError(error => of(new Core.LoadUserTimeZoneFail(action.token, error))))
        ));

    @Effect()
    onSubmit$ = this.actions$.pipe(ofType<Core.Submit>(Core.SUBMIT),
        switchMap((action: Core.Submit) =>
            this.store.select(getOrganizerSettingStateByToken(action.token)).pipe(
                map((currentState) => ({ currentState, token: action.token })),
                take(1))
        ),
        switchMap<any, Core.Any>((info) => {
            if (info.currentState.isExtensionsAvalible ) {
                // all settings are available
                if (info.currentState.isDirty) {
                    return from([new Core.UpdateExtensions(info.token, { currentState: info.currentState })
                        , new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
                        , new Core.UpdateAutomaticRepliesSetting(info.token, { currentState: info.currentState })
                        , new Core.UpdateSignature(info.token, { currentState: info.currentState })
                    ]).pipe(catchError(error => of(new Core.UpdateFail(info.token, error)))); // newly added
                } else {
                    return of(new Core.NoUpdateNeed(info.token));
                }
            } else if (!info.currentState.isExtensionsAvalible && !info.currentState.isSignatureAvailable) {
                // all settings are not available
                return from([new Core.CreateExtensions(info.token, { currentState: info.currentState })
                    , new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
                    , new Core.UpdateAutomaticRepliesSetting(info.token, { currentState: info.currentState })
                    , new Core.UpdateSignature(info.token, { currentState: info.currentState })
                ]).pipe(catchError(error => of(new Core.UpdateFail(info.token, error)))); // newly added
            } else if (!info.currentState.isExtensionsAvalible) {
                // extentions not available
                return from([new Core.CreateExtensions(info.token, { currentState: info.currentState })
                    , new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
                    , new Core.UpdateAutomaticRepliesSetting(info.token, { currentState: info.currentState })
                    , new Core.UpdateSignature(info.token, { currentState: info.currentState })
                ]).pipe(catchError(error => of(new Core.UpdateFail(info.token, error)))); // newly added
            } else if (!info.currentState.isSignatureAvailable) {
                // signature not available
                return from([new Core.UpdateTimeZone(info.token, { currentState: info.currentState })
                    , new Core.UpdateAutomaticRepliesSetting(info.token, { currentState: info.currentState })
                    , new Core.UpdateExtensions(info.token, { currentState: info.currentState })
                    , new Core.UpdateSignature(info.token, { currentState: info.currentState })
                ]).pipe(catchError(error => of(new Core.UpdateFail(info.token, error)))); // newly added
            }
        }));

    @Effect()
    onUpdateEctensions$ = this.actions$.pipe(ofType<Core.UpdateExtensions>(Core.UPDATE_EXTENSIONS),
        switchMap((action: Core.UpdateExtensions) =>
            this.organizerSettingsService.updateExtensions(action.payload.currentState).pipe(map((response) =>
                new Core.UpdateExtensionsSuccess(action.token)),
                catchError(error => of(new Core.UpdateExtensionsFail(action.token, error))))
        ));

    @Effect()
    onUpdateSignature$ = this.actions$.pipe(ofType<Core.UpdateSignature>(Core.UPDATE_SIGNATURE),
        switchMap((action: Core.UpdateSignature) =>
            this.organizerSettingsService.updateSignature(action.payload.currentState).pipe(map((response) =>
                new Core.UpdateSignatureSuccess(action.token)),
                catchError(error => of(new Core.UpdateSignatureFail(action.token, error))))
        ));

    @Effect()
    onUpdateTimeZone$ = this.actions$.pipe(ofType<Core.UpdateTimeZone>(Core.UPDATE_USER_TIME_ZONE),
        switchMap((action: Core.UpdateTimeZone) =>
            this.organizerSettingsService.updateUserTimeZone(action.payload.currentState).pipe(map((response) =>
                new Core.UpdateTimeZoneSuccess(action.token)),
                catchError(error => of(new Core.UpdateTimeZoneFail(action.token, error))))
        ));
    @Effect()
    updateAutomaticRepliesSetting$ = this.actions$.pipe(ofType<Core.UpdateAutomaticRepliesSetting>(Core.UPDATE_AUTOMATIC_REPLIES_SETTING),
        switchMap((action) =>
            this.organizerSettingsService.updateAutomaticRepliesSetting(action.payload.currentState).pipe(map((response) =>
                new Core.UpdateAutomaticRepliesSettingSuccess(action.token)),
                catchError(error => of(new Core.UpdateAutomaticRepliesSettingFail(action.token, error))))
        ));

    @Effect()
    onCreateEctensions$ = this.actions$.pipe(ofType<Core.CreateExtensions>(Core.CREATE_EXTENSIONS),
        switchMap((action: Core.CreateExtensions) =>
            this.organizerSettingsService.createExtensions(action.payload.currentState).pipe(map((response) =>
                new Core.CreateExtensionsSuccess(action.token)),
                catchError(error => of(new Core.CreateExtensionsFail(action.token, error))))
        ));

    @Effect()
    updateSignatureDataSuccess$ = this.actions$.pipe(ofType<Core.UpdateSignatureSuccess>(Core.UPDATE_SIGNATURE_SUCCESS),
        switchMap((action: Core.UpdateSignatureSuccess) =>
            combineLatest(
                this.store.select(getOrganizerSettingSignatureByToken(action.token)),
                ((signature) => ({ signature, token: action.token }))
            ).pipe(take(1),
                map((data) => new AuthCore.LoadSignatureSuccess({ signature: data.signature })))
        ));

    @Effect()
    updateTimeZoneDataSuccess$ = this.actions$.pipe(ofType<Core.UpdateTimeZoneSuccess>(Core.UPDATE_USER_TIME_ZONE_SUCCESS),
        switchMap((action: Core.UpdateTimeZoneSuccess) =>
            combineLatest(
                this.store.select(getOrganizerSettingsFullUserTimeZoneByToken(action.token)),
                ((userTimeZone) => ({ userTimeZone, token: action.token }))
            ).pipe(take(1),
                map((data) => new AuthCore.LoadUserTimeZoneSuccess({
                    userTimeZone: data.userTimeZone,
                    value: data.userTimeZone.alias === 'UTC' ? 'UTC' : data.userTimeZone.displayName.substring(1, 10)
                })))

        ));

    @Effect()
    updateExtensionDataSuccess$ = this.actions$.pipe(ofType<Core.UpdateExtensionsSuccess>(Core.UPDATE_EXTENSIONS_SUCCESS),
        switchMap((action: Core.UpdateExtensionsSuccess) =>
            combineLatest(
                this.store.select(getOrganizerSettingsIsChaserEnableByToken(action.token)),
                this.store.select(getOrganizerSettingsIsSignatureAutoAddByToken(action.token)),
                this.store.select(getReminderSoundEnableByToken(action.token)),
                this.store.select(getNewMailSoundEnableByToken(action.token)),
                this.store.select(getMessageFormatByToken(action.token)),
                this.store.select(getIsGlobalSignatureByToken(action.token)),
                ((isChaserEnable, isSignatureAutoAdd, reminderSoundEnable, newMailSoundEnable, messageFormat, useGlobalSignature) =>
                    ({
                        isChaserEnable, isSignatureAutoAdd, reminderSoundEnable, newMailSoundEnable, messageFormat,
                        useGlobalSignature, token: action.token
                    }))
            ).pipe(take(1),
                map((data) => new AuthCore.LoadAllExtensionsSuccess({
                    isChaserEnable: data.isChaserEnable,
                    isSignatureAutoAdd: data.isSignatureAutoAdd,
                    reminderSoundEnable: data.reminderSoundEnable,
                    newMailSoundEnable: data.newMailSoundEnable,
                    messageFormat: data.messageFormat,
                    useGlobalSignature: data.useGlobalSignature
                })))
        ));

    @Effect()
    createExtensionDataSuccess$ = this.actions$.pipe(ofType<Core.CreateExtensionsSuccess>(Core.CREATE_EXTENSIONS_SUCCESS),
        switchMap((action: Core.CreateExtensionsSuccess) =>
            combineLatest(
                this.store.select(getOrganizerSettingsIsChaserEnableByToken(action.token)),
                this.store.select(getOrganizerSettingsIsSignatureAutoAddByToken(action.token)),
                this.store.select(getReminderSoundEnableByToken(action.token)),
                this.store.select(getNewMailSoundEnableByToken(action.token)),
                this.store.select(getMessageFormatByToken(action.token)),
                this.store.select(getIsGlobalSignatureByToken(action.token)),
                ((isChaserEnable, isSignatureAutoAdd, reminderSoundEnable, newMailSoundEnable, messageFormat, useGlobalSignature) =>
                    ({
                        isChaserEnable, isSignatureAutoAdd, reminderSoundEnable, newMailSoundEnable, messageFormat,
                        useGlobalSignature, token: action.token
                    }))
            ).pipe(take(1),
                map((data) => new AuthCore.LoadAllExtensionsSuccess({
                    isChaserEnable: data.isChaserEnable,
                    isSignatureAutoAdd: data.isSignatureAutoAdd,
                    reminderSoundEnable: data.reminderSoundEnable,
                    newMailSoundEnable: data.newMailSoundEnable,
                    messageFormat: data.messageFormat,
                    useGlobalSignature: data.useGlobalSignature
                })))
        ));

    @Effect()
    updateGlobalSignTemplete$ = this.actions$.pipe(ofType<Core.ChangeGlobalSignatureTemplete>(Core.CHANGE_GLOBAL_SIGNATURE_TEMPLETE),
        switchMap(action => this.organizerSettingsService.saveGlobalSignature(action.templete).pipe(
            map(() => new Core.ChangeGlobalSignatureTempleteSuccess(action.token, action.templete)),
            catchError(() => of(new Core.ChangeGlobalSignatureTempleteFail(action.token)))
        ))
        // map(action => new Core.ChangeGlobalSignatureTempleteSuccess(action.token, action.templete))
    );





}


