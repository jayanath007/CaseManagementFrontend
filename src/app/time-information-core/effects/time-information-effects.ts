import { filter, take, mergeMap, catchError, map, switchMap, delayWhen } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of, combineLatest } from 'rxjs';
import { TimeInformationService } from '../services/time-information-service';
import * as Core from '../actions/core';
import {
    getCrimeClassIdentityViewModel, getModelByToken, getSaveModelByToken,
    getTimeRecordGridItems, getIsEditTimId, getAttendeesAndWorkLookupDataByToken,
    checkInitialDataLoadedForEdit,
    getPopupInput
} from '../reducers';
import { LocalStorageKey } from '../../core';
import { CrimeTimeDeleteViewModel } from '../models/request';
import { FileUrlResolverService } from './../../document-view/services/file-url-resolver.service';
import { GetPDFURL } from '../../document-view';
import { CrimeClassRequest } from '../../core/lib/crime-managment';
import {
    CrimeTimeLoadingSetting,
    CrimeTimeLoadingSettingSuccess,
    CRIME_TIME_LOADING_SETTINGS_SUCCESS
} from './../../shared-data/actions/time-record';
import { getUser } from '../../auth';
import { TimeInformationModel, RateSource } from '..';
import { CrimeDefs } from '../class/CrimeDefs';
import { GetCrimeLookupList } from '../../shared-data';
import { LookupType } from '../../shared';

@Injectable()
export class TimeInformationEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: TimeInformationService,
        private fileUrlServic: FileUrlResolverService) { }

    @Effect()
    initTimeRecordingData$ = this.actions$.pipe(ofType<Core.InitTimeInformation>(Core.INIT_TIME_INFORMATION),
        mergeMap((action) => {
            return from([
                new Core.LoadFeeEarnerList(action.token),
                new Core.LoadAttTypeList(action.token),
                new Core.GetCrimeRateFiles(action.token, action.payload.inputData.classId),
                new Core.GetTimeRecords(action.token),
                new Core.GetAssistanceData(action.token),
                new GetCrimeLookupList(LookupType.POLICE_ST_CODES),
            ]);
        }));

    @Effect()
    initTimeRecordingSuccess$ = this.actions$.pipe(ofType<Core.InitTimeInformation>(Core.INIT_TIME_INFORMATION),
        switchMap(info =>
            this.store.select(getTimeRecordGridItems(info.token)).pipe(
                map(rows =>
                    ({
                        rows: rows, editTimeId: info.payload.inputData.crimeTimeId,
                        token: info.token, isEdit: info.payload.inputData.isEdit
                    })))
        ),
        filter(data => data.isEdit && data.rows && data.rows.length > 0),
        take(1)).pipe(
            mergeMap(data => {
                const item = data.rows.find(r => r.timeId === data.editTimeId);
                if (item) {
                    return from([
                        new Core.SelectGridItem(data.token, { item: item }),
                        new Core.GetAssistanceData(data.token)
                    ]);
                } else {
                    return from([
                        new Core.GetAssistanceData(data.token)
                    ]);
                }
            }));


    @Effect()
    getSetting$ = this.actions$.pipe(ofType<Core.InitTimeInformation>(Core.INIT_TIME_INFORMATION),
        filter(action => action.payload.inputData.isEdit === false),
        map(action => new CrimeTimeLoadingSetting(action.token, {
            fileId: action.payload.inputData.fileId,
            branchId: action.payload.inputData.branchId,
            classId: action.payload.inputData.classId
        }, true)));

    @Effect()
    setSetting$ = this.actions$.pipe(ofType<CrimeTimeLoadingSettingSuccess>(CRIME_TIME_LOADING_SETTINGS_SUCCESS),
        switchMap(action =>
            this.store.select(getUser).pipe(
                map(user => ({ user, action })),
                take(1))
        ),
        map(({ user, action }) => new Core.SetSetting(action.token, action.settings, user.general.dateTimeOffset)));

    // @Effect()
    // getRatePrecentage$ = this.actions$.pipe(ofType<Core.GetRateRrecentage>(Core.GET_RATE_PRECENTAGE),
    //     switchMap((action: Core.GetRateRrecentage) =>
    //         this.service.getRatePrecentage().pipe(map((response) =>
    //             new Core.GetRateRrecentageSuccess(action.token, { rate: response })),
    //             catchError(error => of(new Core.GetRateRrecentageFail(action.token))))
    //     ));

    @Effect()
    attTypeListChange$ = this.actions$.pipe(ofType<Core.AttTypeListChange>
        (Core.ATT_TYPE_LIST_CHANGE),
        map(data => {
            return new Core.GetAssistanceData(data.token);
        }));



    @Effect()
    getAssistanceData$ = this.actions$.pipe(ofType<Core.GetAssistanceData>(Core.GET_ASSISTANCE_DATA),
        switchMap((action: Core.GetAssistanceData) =>
            combineLatest(
                this.store.select(getCrimeClassIdentityViewModel(action.token)),
                this.store.select(getModelByToken(action.token)),
                ((crimeClassIdentityViewModel, model) => ({ crimeClassIdentityViewModel, model, token: action.token }))
            ).pipe(take(1))
        ),
        switchMap((info) => {
            if (this.checkNeedLimit(info.model)) {
                return this.service.getCurrentLimitAndTotalsForSpecificClassType({
                    fileId: info.crimeClassIdentityViewModel.fileId,
                    branchId: info.crimeClassIdentityViewModel.branchId,
                    classId: info.crimeClassIdentityViewModel.classId,
                    SubClassId: info.model.attTypeId
                }).pipe(map((response) =>
                    new Core.GetAssistanceDataSuccess(info.token, {
                        adciceAssistanceLimit: response.currentLimit,
                        adciceAssistanceCurrentTotal: response.currentTot,
                    })),
                    catchError(error => of(new Core.GetAssistanceDataFail(info.token))));
            } else {
                return of(new Core.GetAssistanceDataSuccess(info.token, {
                    adciceAssistanceLimit: 0,
                    adciceAssistanceCurrentTotal: 0
                }));
            }
        })
    );


    @Effect()
    loadFeeEarnerListData$ = this.actions$.pipe(ofType<Core.LoadFeeEarnerList>(Core.LOAD_FEEEARNER_LIST),
        switchMap((action: Core.LoadFeeEarnerList) =>
            this.service.getFeeEarnerList().pipe(map((response) =>
                new Core.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: response })),
                catchError(error => of(new Core.LoadFeeEarnerListFail(action.token))))
        ));

    @Effect()
    loadTimeRecords$ = this.actions$.pipe(ofType<Core.GetTimeRecords>(Core.GET_TIME_RECORDS),
        switchMap((action: Core.GetTimeRecords) =>
            combineLatest(
                this.store.select(getCrimeClassIdentityViewModel(action.token)),
                this.store.select(getModelByToken(action.token)),
                ((crimeClassIdentityViewModel, model) => ({ crimeClassIdentityViewModel, model, token: action.token }))
            ).pipe(take(1))
        ), map((info) =>
            ({
                request: new CrimeClassRequest(
                    info.crimeClassIdentityViewModel.branchId,
                    info.crimeClassIdentityViewModel.fileId,
                    info.crimeClassIdentityViewModel.classId,
                ),
                token: info.token
            })
        ), switchMap(info => this.service.getTimeRecords(info.request).pipe(map((response) =>
            new Core.GetTimeRecordsSuccess(info.token, { timeRecordGridItem: response })),
            catchError(error => of(new Core.GetTimeRecordsFail(info.token))))));

    @Effect()
    setEditData$ = this.actions$.pipe(ofType<Core.GetTimeRecordsSuccess>(Core.GET_TIME_RECORDS_SUCCESS),
        switchMap(action =>
            this.store.select(getIsEditTimId(action.token)).pipe(
                map(id => ({ id: id, action: action })),
                take(1))
        ), delayWhen(info => this.store.select(checkInitialDataLoadedForEdit(info.action.token))
            .pipe(filter(ok => ok === true)))).pipe(
                map(info => new Core.SelectGridItem(info.action.token,
                    { item: info.action.payload.timeRecordGridItem.filter(i => i.timeId === info.id)[0] })));

    @Effect()
    getCrimeRateFiles$ = this.actions$.pipe(ofType<Core.GetCrimeRateFiles>(Core.GET_CRIME_RATE_FILES),
        switchMap(action =>
            this.store.select(getUser).pipe(
                map(user => ({ user, action })),
                take(1))
        ),
        switchMap(({ user, action }) => {
            const crimeRateFiles = localStorage.getItem(LocalStorageKey.CrimeRateFiles);
            let rateSource: RateSource = {};
            if (crimeRateFiles) {
                rateSource = JSON.parse(localStorage.getItem(LocalStorageKey.CrimeRateFiles));
            }
            let classId = action.classId;
            if (classId >= CrimeDefs.LGFSCLASSID && classId < CrimeDefs.AGFSCLASSID) {
                classId = 100;
            } else if (classId >= CrimeDefs.AGFSCLASSID && classId < 120) {
                classId = 110;
            }
            if (rateSource && rateSource[classId]) {
                return of(new Core.GetCrimeRateFilesSuccess(action.token,
                    {
                        ratesDataSource: rateSource[classId],
                        timeOffset: user.general.dateTimeOffset
                    }));
            } else {


                return this.service.getCrimeRates(classId).pipe(map((response) => {
                    rateSource[classId] = response;
                    localStorage.setItem(LocalStorageKey.CrimeRateFiles,
                        JSON.stringify(rateSource));

                    return new Core.GetCrimeRateFilesSuccess(action.token,
                        {
                            ratesDataSource: response,
                            timeOffset: user.general.dateTimeOffset
                        });
                }), catchError(() => of(new Core.GetCrimeRateFilesFail(action.token))));
            }

        }));

    @Effect()
    loadAttTypeListData$ = this.actions$.pipe(ofType<Core.LoadAttTypeList>(Core.LOAD_ATT_TYPE_LIST),
        switchMap((action: Core.LoadAttTypeList) =>
            this.store.select(getCrimeClassIdentityViewModel(action.token)).pipe(
                take(1),
                switchMap((info) =>
                    this.service.getCrimeWorkTypes(info).pipe(map((response) =>
                        new Core.LoadAttTypeListSuccess(action.token, { attTypes: response })),
                        catchError(error => of(new Core.LoadAttTypeListFail(action.token))))
                ))));

    @Effect()
    saveTimeRecords$ = this.actions$.pipe(ofType<Core.SaveTimeRecords>(Core.SAVE),
        switchMap((action: Core.SaveTimeRecords) =>
            this.store.select(getSaveModelByToken(action.token)).pipe(
                map((model) => ({ model, token: action.token })),
                take(1),
                switchMap(info =>
                    this.service.saveTimeRecord(info.model).pipe(map((response) =>
                        new Core.SaveTimeRecordsSuccess(info.token)),
                        catchError(error => of(new Core.SaveTimeRecordsFail(info.token))))
                ))));

    @Effect()
    saveTimeRecordsSuccess$ = this.actions$.pipe(ofType<Core.SaveTimeRecordsSuccess>(Core.SAVE_SUCCESS),
        switchMap(action =>
            this.store.select(getUser).pipe(
                map(user => ({ user, action })),
                take(1))
        ),
        mergeMap(({ user, action }) => {
            return from([
                new Core.GetTimeRecords(action.token),
                new Core.NewForm(action.token, { timeOffset: user.general.dateTimeOffset }),
                new Core.GetAssistanceData(action.token),
            ]);
        }));

    @Effect()
    deleteTimeRecords$ = this.actions$.pipe(ofType<Core.DeleteTimeRecords>(Core.DELETE),
        switchMap((action: Core.DeleteTimeRecords) =>
            combineLatest(
                this.store.select(getCrimeClassIdentityViewModel(action.token)),
                this.store.select(getModelByToken(action.token)),
                ((crimeClassIdentityViewModel, model) => ({ crimeClassIdentityViewModel, model }))
            ).pipe(take(1),
                map((info) =>
                    new CrimeTimeDeleteViewModel(
                        info.crimeClassIdentityViewModel,
                        info.model.timeId,
                        info.model.diaryRef
                    )),
                switchMap(request => this.service.deleteTimeRecord(request).pipe(map((response) =>
                    new Core.DeleteTimeRecordsSuccess(action.token)),
                    catchError(error => of(new Core.DeleteTimeRecordsFail(action.token))))))));

    @Effect()
    deleteTimeRecordsSuccess$ = this.actions$.pipe(ofType<Core.DeleteTimeRecordsSuccess>(Core.DELETE_SUCCESS),
        switchMap(action =>
            this.store.select(getUser).pipe(
                map(user => ({ user, action })),
                take(1))
        ),
        mergeMap(({ user, action }) =>
            from([new Core.NewForm(action.token, { timeOffset: user.general.dateTimeOffset }),
            new Core.GetAssistanceData(action.token)])
        ));

    @Effect({ dispatch: false })
    print$ = this.actions$.pipe(ofType<Core.PrintDoc>(Core.PRINT_DOC),
        switchMap(action =>
            this.store.select(getModelByToken(action.token)).pipe(
                take(1))
        ), filter(model => model && !!model.letter)).pipe(
            map(model => {
                const request: GetPDFURL = {
                    branchId: model.branchId,
                    appId: model.appId,
                    fileId: model.fileId,
                    letterName: model.letter,
                    downloadable: false
                };
                return this.fileUrlServic.getDocumentURLWithoutDiaryEntry(request)
                    .subscribe(link => {
                        const popupWidth = 900;
                        const popupHeight = 700;
                        const width = window.innerWidth ? window.innerWidth :
                            document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                        const height = window.innerHeight ? window.innerHeight :
                            document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen['left'];
                        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen['top'];
                        const left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft;
                        const top = ((height / 2) - (popupHeight / 2)) + dualScreenTop;
                        const id = model.appId.toString() + model.fileId.toString() + model.branchId.toString() + model.letter;
                        const newWindow = window.open(link, id, 'scrollbars=yes, width=' + popupWidth + ', height='
                            + popupHeight + ', top=' + top + ', left=' + left);

                        if (window.focus) {
                            newWindow.focus();
                        }
                    });
            }));

    @Effect()
    loadAttendeesAndWorkLookupData$ = this.actions$.pipe(ofType<Core.GetAttendeesAndWorkLookupData>(Core.GET_ATTENDEES_WORK_LOOKUP_DATA),
        switchMap(action =>
            this.store.select(getAttendeesAndWorkLookupDataByToken(action.token, action.lookupType)).pipe(
                map(lookupData => ({
                    lookupData,
                    token: action.token,
                    lookupType: action.lookupType,
                    property: action.property,
                })), take(1))
        )
        , switchMap<any, any>(info => {
            if (info.lookupData && info.lookupData.length === 0) {
                return this.service.GetAttendeesAndWorkLookupData(info.lookupType).pipe(
                    map(result => new Core.GetAttendeesAndWorkLookupDataSuccess(info.token, info.lookupType, info.property, result)),
                    catchError(() => of(new Core.GetAttendeesAndWorkLookupDataFail(info.token))));
            } else {
                return of(new Core.OpenLoockupPopup(info.token, info.lookupType, info.property, info.lookupData));
            }
        }));

    @Effect()
    openAttendeesLockup$ = this.actions$.pipe(ofType<Core.GetAttendeesAndWorkLookupDataSuccess>
        (Core.GET_ATTENDEES_WORK_LOOKUP_DATA_SUCCESS),
        map(action => new Core.OpenLoockupPopup(action.token, action.lookupType, action.property, action.data)));

    @Effect()
    changeClass$ = this.actions$.pipe(ofType<Core.ClassChange>(Core.CLASS_CHANGE),
        switchMap((action: Core.ClassChange) =>
            combineLatest(
                this.store.select(getPopupInput(action.token)),
                this.store.select(getUser),
                ((input, user) => ({ input, user, action: action }))
            ).pipe(take(1),
                map(info => new Core.InitTimeInformation(info.action.token,
                    {
                        inputData: { ...info.input, classId: action.classId },
                        columnDef: action.columnDef,
                        timeOffset: info.user.general.dateTimeOffset
                    }))
            )));

    checkNeedLimit(model: TimeInformationModel): boolean {
        if (model.classId === CrimeDefs.INVESTIGATIONCLASSID && model.attTypeId === 1) {
            return true;
        } else if (model.classId === CrimeDefs.PROCLASSID && model.attTypeId === 3) {
            return true;
        }
        return false;
    }
}


