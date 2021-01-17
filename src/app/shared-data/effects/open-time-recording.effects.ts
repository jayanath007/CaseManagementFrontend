import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of, combineLatest } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, take, catchError, filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddTimeType, CrimeClassType } from '../../core/lib/timeRecord';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { TimeRecordingCloseInfo } from './../../time-recording-core/models/enum';
import { uuid } from '../../utils/uuid';
import { showInforDialog } from '../../core/utility/DpsUtility';
import { TimeRecordServices } from '../services/time-record.service';
import * as Time from '../actions/time-record';
import {
    getTimeRecordOpeningData, getGenaralTimeRecordInput,
    getCrimeClassRequestMode, getCrimeManagerPopupInput,
    getTimeInformationInput,
    getSettingByKey, getCivilTimePopupInput
} from '../reducers';
import { OptionDialogInput, OptionDialogOptionList } from './../../shared/models/dialog';
import { OptionDialogComponent } from './../../shared/components/option-dialog/option-dialog.component';
import { InfoDialogType } from './../../core/utility/DpsUtility';
import { storeCrimeTimeDataKey } from '../../core/lib/crime-managment';
import { AccessControlService } from '../../auth/services/access-control.service';
import { Module } from '../../core/lib/app-settings';
import { checkTimeRecordType } from '../../auth';

@Injectable()
export class OpenTimeRecordEffects {
    constructor(private actions$: Actions, private timeRecordServices: TimeRecordServices,
        private popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private store: Store<any>,
        private access: AccessControlService) { }

    @Effect()
    requestToOpenTime$ = this.actions$.pipe(ofType<Time.OpenTimeRecordPopupRequest>(Time.OPEN_TIME_RECORD_POPUP_REQUEST),
        filter(action => !!action && !!action.data),
        switchMap(action =>
            this.store.select(checkTimeRecordType(action.data.appCode, action.data.eBilling,
                action.data.isLegalAid)).pipe(
                    map(timeRecordType => ({ ...action, timeRecordType })),
                    take(1))),
        map(action => {
            if (action && action.data && action.data.isProspectMatter) {
                return new Time.ShowNotSupportedMSG(action.token,
                    'Time recording is not enable for prospect matters');
            } else {
                return new Time.GetTimeRecordType(action.token, action.timeRecordType);
            }

        })
    );

    @Effect()
    requestToGenaralTime$ = this.actions$.pipe(ofType<Time.OpenTimeRecordPopupRequest>(Time.OPEN_TIME_RECORD_POPUP_REQUEST),
        filter(action => !action || !action.data),
        map(action => new Time.GetTimeRecordType(action.token, AddTimeType.GenaralTime))
    );

    @Effect()
    openTimePopup$ = this.actions$.pipe(ofType<Time.GetTimeRecordType>(Time.GET_TIME_RECORD_TYPE),
        switchMap(action =>
            combineLatest(
                this.store.select(getTimeRecordOpeningData),
                this.access.checkModuleIsActive(Module.Crime),
                ((data, IsCrimeModuleActive) => ({ data, IsCrimeModuleActive, action: action }))
            ).pipe(take(1))
        ), map(info => {
            switch (info.action.timeType) {
                case AddTimeType.GenaralTime: {
                    return new Time.OpenGenaralTimeRecord(info.action.token);
                }
                case AddTimeType.CrimeTime: {
                    if (!!info.IsCrimeModuleActive) {
                        return new Time.GetCrimeClassList(info.action.token);
                    } else {
                        return new Time.ShowNotSupportedMSG(info.action.token,
                            'Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.');
                    }

                }
                case AddTimeType.CivilTime: {
                    return new Time.OpenCivilTimeRecord(info.action.token);
                }
                case AddTimeType.NotSupport: {
                    return new Time.ShowNotSupportedMSG(info.action.token,
                        'Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.');
                }
                default: {
                    return new Time.OpenGenaralTimeRecord(info.action.token);
                }
            }
        }));

    @Effect()
    getCrimeTimeSetting$ = this.actions$.pipe(ofType<Time.CrimeTimeLoadingSetting>(Time.CRIME_TIME_LOADING_SETTINGS),
        switchMap(action =>
            this.store.select(getSettingByKey(storeCrimeTimeDataKey(action.classModal))).pipe(take(1),
                map(setting => ({ setting: setting, action: action })))
        ),
        switchMap((info => {
            if (!info.setting || info.action.needRefresh) {
                return this.timeRecordServices.getCrimeTimeLoadingSetting(info.action.classModal).pipe(
                    map(responce =>
                        new Time.CrimeTimeLoadingSettingSuccess(info.action.token, info.action.classModal, responce)),
                    catchError(e => of(new Time.CrimeTimeLoadingSettingFail()))
                );
            } else {
                return of(new Time.CrimeTimeLoadingSettingSuccess(info.action.token, info.action.classModal, info.setting));
            }
        })));


    @Effect()
    openTimeGenaralPopup$ = this.actions$.pipe(ofType<Time.OpenGenaralTimeRecord>(Time.OPEN_GENARAL_TIME_RECORD),
        switchMap(action =>
            this.store.select(getGenaralTimeRecordInput).pipe(take(1),
                map(input => ({ input: input, action: action })))
        ),
        switchMap(info => {
            return this.popupService.openTimeRecordingPopup(info.action.token || uuid(), info.input).pipe(
                map(sucess => {
                    if (sucess === TimeRecordingCloseInfo.ExitWithSaveSuccess) {
                        return new Time.TimeRecordClose(info.action.token, true);
                    } else {
                        return new Time.TimeRecordClose(info.action.token, false);
                    }
                }));
        }));

    @Effect()
    getCrimeClassList$ = this.actions$.pipe(ofType<Time.GetCrimeClassList>(Time.GET_CRIME_CLASS_LIST),
        switchMap(action =>
            this.store.select(getCrimeClassRequestMode).pipe(take(1),
                map(request => ({ request: request, action: action })))
        ), switchMap(info =>
            this.timeRecordServices.getCrimeClassList(info.request).pipe(map(responce =>
                new Time.GetCrimeClassListSuccess(info.action.token, { list: responce })),
                catchError(e => of(new Time.GetCrimeClassListFail())))
        ));

    @Effect()
    showNotSupportMSG$ = this.actions$.pipe(ofType<Time.ShowNotSupportedMSG>(Time.SHOW_NOT_SUPPORTED_MSG),
        switchMap(action =>
            showInforDialog('Time Record', action.msg,
                InfoDialogType.alert, this.dialog).afterClosed().pipe(
                    map(() => new Time.TimeRecordClose(action.token, false)))));


    @Effect()
    openCrimeTimePopup$ = this.actions$.pipe(ofType<Time.GetCrimeClassListSuccess>(Time.GET_CRIME_CLASS_LIST_SUCCESS),
        map(action => {
            if (!action.payload.list || action.payload.list.length === 0) {
                return new Time.OpenCrimeTimeManager(action.token);
            } else {
                const enableClassList = action.payload.list.filter(i => (i.rectype === 3 || i.rectype === 4 ||
                    (i.rectype >= 100 && i.rectype <= 119)));
                if (enableClassList.length > 0) {
                    return new Time.OpenCrimeTimeInformation(action.token);
                } else {
                    return new Time.ShowNotSupportedMSG(action.token,
                        'Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.');
                }
            }
        }));

    @Effect()
    openCrimeTimeManager$ = this.actions$.pipe(ofType<Time.OpenCrimeTimeManager>(Time.OPEN_CRIME_TIME_MANAGER),
        switchMap(action =>
            this.store.select(getCrimeManagerPopupInput).pipe(take(1),
                map(input => ({ input: input, token: action.token })))
        ), switchMap(info => {

            return this.popupService.openCrimeManagerPopup(info.token, info.input)
                .pipe(map(() => new Time.TimeRecordClose(info.token, false)));

        }));


    @Effect()
    openTimeInformation$ = this.actions$.pipe(ofType<Time.OpenCrimeTimeInformation>(Time.OPEN_CRIME_TIME_INFORMATION),
        switchMap(action =>
            this.store.select(getTimeInformationInput).pipe(take(1),
                map(input => ({ input: input, token: action.token })))
        ), switchMap(info => {
            return this.popupService.openTimeInformationPopup(info.token, info.input)
                .pipe(map(() => new Time.TimeRecordClose(info.token, true)));
        }
        ));

    @Effect()
    openCivilTimePopup$ = this.actions$.pipe(ofType<Time.OpenCivilTimeRecord>(Time.OPEN_CIVIL_TIME_RECORD),
        switchMap(action =>
            this.store.select(getCivilTimePopupInput).pipe(take(1),
                map(input => ({ input: input, action: action })))
        ),
        switchMap(info => {
            return this.popupService.civilClassManagement(info.action.token || uuid(), info.input).pipe(
                map(sucess => new Time.TimeRecordClose(info.action.token, true)));
        }));


}
