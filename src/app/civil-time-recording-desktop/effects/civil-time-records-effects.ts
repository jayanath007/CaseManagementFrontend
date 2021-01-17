import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, from, of } from 'rxjs';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { catchError, map, mergeMap, switchMap, take, filter } from 'rxjs/operators';
import { CivilClassObj } from '../../civil-class-management';
import { InfoDialogType, showInforDialog } from '../../core/utility/DpsUtility';
import { GetFeeEarnerList } from '../../shared-data';
import * as Action from '../actions/core';
import { civilTimeTotal, TimeRecordModel } from '../model/interfaces';
import * as selector from '../reducers';
import { CivilTimeRecordsService } from '../services/civil-time-records.service';

@Injectable()
export class CivilTimeRecordEffects {
    constructor(protected store: Store<any>,
        private actions$: Actions,
        private service: CivilTimeRecordsService,
        private dialog: MatDialog
    ) { }

    @Effect()
    initForNewRecord$ = this.actions$.pipe(ofType<Action.InitCivilTimeRecording>(Action.INIT_MODULE),
        filter(action => !action.payload.inputData.diaryId),
        mergeMap(action =>
            from([new GetFeeEarnerList(true), new Action.GetInitData(action.token), new Action.GetRate(action.token)])
        ));

    @Effect()
    initForEditRecord$ = this.actions$.pipe(ofType<Action.InitCivilTimeRecording>(Action.INIT_MODULE),
        filter(action => !!action.payload.inputData.diaryId),
        map(action => new GetFeeEarnerList(true)));

    @Effect()
    GetEditData$ = this.actions$.pipe(ofType<Action.InitCivilTimeRecording>(Action.INIT_MODULE),
        filter(action => !!action.payload.inputData.diaryId),
        map(action => new Action.GetCivilTimeRecodeInfo(action.token, action.payload.inputData.diaryId, true)));

    @Effect()
    GetInitData$ = this.actions$.pipe(ofType<Action.GetInitData>(Action.GET_INIT_DATA),
        switchMap(action => this.store.select(selector.getCivilClassInfo(action.token)).pipe(
            take(1),
            map(info => ({ classinfo: info, action: action }))
        )),
        switchMap(info => this.service.getViewData(info.classinfo).pipe(
            map(responce => new Action.GetInitDataSuccess(info.action.token, responce, info.action.openWithEditItem)),
            catchError(() => of(new Action.GetInitDataFail(info.action.token))
            ))));

    @Effect()
    claInitialEditValue$ = this.actions$.pipe(ofType<Action.GetInitDataSuccess>(Action.GET_INIT_DATA_SUCCESS),
        filter(action => action.openWithEditItem),
        map(action => new Action.Calculation(action.token))
    );

    @Effect({ dispatch: false })
    CheckRatesAreLoading$ = this.actions$.pipe(ofType<Action.GetRate>(Action.GET_RATE),
        switchMap(action => this.store.select(selector.getRateFromCache(action.token)).pipe(
            take(1),
            map(rate => ({ rate, token: action.token }))
        ))
    );

    @Effect()
    GetRatesFromBackend$ = this.CheckRatesAreLoading$.pipe(
        filter(action => !action.rate),
        switchMap(action =>
            combineLatest(
                this.store.select(selector.getCivilClassInfo(action.token)),
                this.store.select(selector.getCivilClassModelData(action.token)),
                ((classInfo, model) => ({ model, classInfo, token: action.token }))
            ).pipe(take(1))
        ),
        filter(info => info.model.legalAidCaseId > 0),
        switchMap(info => this.service.getRate(info.classInfo, info.model).pipe(
            map(responce => new Action.GetRateSuccess(info.token, responce)),
            catchError(() => of(new Action.GetRateFail(info.token))
            ))));

    @Effect()
    GetRatesFromCache$ = this.CheckRatesAreLoading$.pipe(
        filter(action => !!action.rate),
        map(action => new Action.GetRateSuccess(action.token, action.rate))
    );

    @Effect()
    GetRecordInfo$ = this.actions$.pipe(ofType<Action.GetCivilTimeRecodeInfo>(Action.GET_CIVIL_TIME_RECODE_INFO),
        switchMap(action => this.service.getCivilTimeRecodeInfo(action.diaryId).pipe(
            map(responce => new Action.GetCivilTimeRecodeInfoSuccess(action.token, responce, action.openWithEditItem)),
            catchError(() => of(new Action.GetCivilTimeRecodeInfoFail(action.token))
            ))));

    @Effect()
    RequestRateWhenChangeModel$ = this.actions$.pipe(ofType<Action.ChangeModel>(Action.CHANGE_MODEL),
        filter(action => action.payload.key === 'level' || action.payload.key === 'judgeLevel'),
        map(action => new Action.GetRate(action.token))
    );

    @Effect()
    GetRateSuccess$ = this.actions$.pipe(ofType<Action.GetRateSuccess>(Action.GET_RATE_SUCCESS),
        map(action => new Action.Calculation(action.token))
    );

    @Effect()
    ChangeModelForCalculation$ = this.actions$.pipe(ofType<Action.ChangeModel>(Action.CHANGE_MODEL),
        filter(action => action.payload.key === 'attendanceUnit' || action.payload.key === 'preparationUnit' ||
            action.payload.key === 'travelUnit' || action.payload.key === 'waitingUnit' ||
            action.payload.key === 'mileageUnit' || action.payload.key === 'faresIcludingVat' ||
            action.payload.key === 'faresVatExempt' || action.payload.key === 'parkingFees' ||
            action.payload.key === 'conferenceUnit' || action.payload.key === 'advocacyUnit'),
        map(action => new Action.Calculation(action.token))
    );

    @Effect({ dispatch: false })
    SaveTimeRecord$ = this.actions$.pipe(ofType<Action.SaveTimeRecord>(Action.SAVE_TIME_RECORD),
        switchMap(action =>
            combineLatest(
                this.store.select(selector.getCivilClassInfo(action.token)),
                this.store.select(selector.getCivilClassModelData(action.token)),
                ((classInfo, model) => ({ model, classInfo, token: action.token }))
            ).pipe(take(1))
        ),
        map(info => ({ model: info.model, token: info.token, validationMsg: this.validationMessage(info.model, info.classInfo) })));



    @Effect()
    SaveTimeRecordValidatedFail$ = this.SaveTimeRecord$.pipe(
        filter(info => !!info.validationMsg),
        map(info => new Action.ShowMessage(info.token, 'Civil Time Recording', info.validationMsg, InfoDialogType.warning)));


    @Effect()
    SaveTimeRecordValidatedPass$ = this.SaveTimeRecord$.pipe(
        filter(info => !info.validationMsg),
        switchMap(info => this.service.saveTimeRecord(info.model).pipe(
            map(responce => new Action.SaveTimeRecordSuccess(info.token)),
            catchError(() => of(new Action.SaveTimeRecordFail(info.token))
            ))));

    @Effect()
    saveSuccess$ = this.actions$.pipe(ofType<Action.SaveTimeRecordSuccess>(Action.SAVE_TIME_RECORD_SUCCESS),
        mergeMap(action =>
            from([new Action.GetTimeRecordHistory(action.token), new Action.NewTimeRecord(action.token)])
        ));

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<Action.ShowMessage>(Action.SHOW_MESSAGE),
        map((action) => {
            showInforDialog(action.title, action.message, action.messageType, this.dialog);
        }));

    @Effect()
    DeleteTimeRecord$ = this.actions$.pipe(ofType<Action.DeleteTimeRecord>(Action.DELETE_TIME_RECORD),
        switchMap(action => this.store.select(selector.getCivilClassModelData(action.token)).pipe(
            take(1),
            map(model => ({ model, token: action.token }))
        )),
        switchMap(info => this.service.deleteTimeRecord(info.model.diaryId).pipe(
            map(responce => new Action.DeleteTimeRecordSuccess(info.token)),
            catchError(() => of(new Action.DeleteTimeRecordFail(info.token))
            ))));

    @Effect()
    DeleteTimeRecordSuccess$ = this.actions$.pipe(ofType<Action.DeleteTimeRecordSuccess>(Action.DELETE_TIME_RECORD_SUCCESS),
        mergeMap(action =>
            from([new Action.GetTimeRecordHistory(action.token), new Action.NewTimeRecord(action.token)])
        ));

    @Effect()
    changePage$ = this.actions$.pipe(ofType<Action.ChangeTimeRecordPage>(Action.CHANGE_TIME_RECORD_PAGE),
        map(action => new Action.GetTimeRecordHistory(action.token)));

    @Effect()
    ClearCurrentDataForEdit$ = this.actions$.pipe(ofType<Action.GetCivilTimeRecodeInfo>(Action.GET_CIVIL_TIME_RECODE_INFO),
        map(info => new Action.NewTimeRecord(info.token)));

    @Effect()
    getInitalDataForInitialEdit$ = this.actions$.pipe(ofType<Action.GetCivilTimeRecodeInfoSuccess>(Action.GET_CIVIL_TIME_RECODE_INFO_SUCCESS),
        filter(action => action.openWithEditItem),
        map(info => new Action.GetInitData(info.token, info.openWithEditItem)));

    @Effect()
    setRateForEdit$ = this.actions$.pipe(ofType<Action.GetCivilTimeRecodeInfoSuccess>(Action.GET_CIVIL_TIME_RECODE_INFO_SUCCESS),
        map(info => new Action.GetRate(info.token)));

    @Effect()
    NewTimeRecord$ = this.actions$.pipe(ofType<Action.NewTimeRecord>(Action.NEW_TIME_RECORD),
        map(info => new Action.GetRate(info.token)));


    @Effect()
    GetTimeRecordHistory$ = this.actions$.pipe(ofType<Action.GetTimeRecordHistory>(Action.GET_TIME_RECORD_HISTORY),
        switchMap(action =>
            combineLatest(
                this.store.select(selector.getCivilClassInfo(action.token)),
                this.store.select(selector.getCivilClassViewData(action.token)),
                ((classInfo, viewData) => ({ classInfo, viewData, token: action.token }))
            ).pipe(take(1))
        ),
        switchMap(info => this.service.getRecordHistory(info.classInfo, info.viewData.civilTimeRecordData.pageInfo).pipe(
            map(responce => new Action.GetTimeRecordHistorySuccess(info.token, responce)),
            catchError(() => of(new Action.GetTimeRecordHistoryFail(info.token))
            ))));

    validationMessage(model: TimeRecordModel, civilClassObj: CivilClassObj): string {
        const totalTimeValue = civilTimeTotal(model);
        if (!model.feeEarner) {
            return 'Fee Earner should not be empty. Please select a Fee Earner';
        }
        else if (!model.note) {
            return 'Please enter a diary note before saving the record';
        } else if (!!model.note && model.note.length > 250) {
            return 'Note length must not exceed 250 characters.';
        }
        // else if (civilClassObj && civilClassObj.className === 'Certificated' && !model.detail) {
        //     return 'Details should not be empty. Please enter a Details';
        // }
        else if (!model.level || model.level === 0) {
            return 'Please select Funding level before saving the record.';
        } else if (civilClassObj && civilClassObj.className === 'Certificated' && model.judgeLevel === 0) {
            return 'please select court for valid rates';
        } else if (totalTimeValue <= 0) {
            return 'Total time value must be greater than zero';
        } else if (model.totalValue <= 0) {
            return 'Total value must be greater than zero';
        }
        return null;

    }

}

