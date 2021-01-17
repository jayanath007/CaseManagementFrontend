import { getDiaryFileDetails } from './../reducers/index';
import { TimeRecordAddUpdateViewModel } from './../models/interfaces';
import { filter, catchError, map, take, mergeMap, switchMap, throttle } from 'rxjs/operators';
import { TimeRecordingMsg, TimeRecordSubmitModel, TimeRecordingState } from '../models/interfaces';
import { combineLatest, of, from, interval } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as Core from '../actions/core';
import { TimeRecordingService } from '../services/time_recording_service';
import {
    getTimeRecordingUserByToken,
    getSelectedFeeEarnerByToken,
    getMatterReferenceNoByToken,
    getTimeRecordingViewByToken,
    getTimeRecordEditDataByToken,
    getIsLoadingByToken,
    getFeeEarnerList,
    getEBillingTypeByToken
} from '../reducers';
import { getDiaryModeCurrentUser } from '../../setting-core';
import { DatePipe } from '@angular/common';
import { eBillingType } from '../../core/lib/matter';
import { TimeRecordAddingType } from '../models/enum';
import { getUser } from '../../auth';
import { WebViewService } from '../../azure-storage';

@Injectable()
export class TimeRecordingEffects {
    constructor(private datePipe: DatePipe, private actions$: Actions, private store: Store<any>, private service: TimeRecordingService,
        private webViewService: WebViewService) { }


    protected saveTimeRecord$ = this.actions$.pipe(ofType<Core.SaveTimeRecord>(Core.SAVE_TIME_RECORD),
        switchMap((action: Core.SaveTimeRecord) =>
            this.store.select(getTimeRecordingViewByToken(action.token)).pipe(
                map((store) => ({ store, token: action.token })),
                take(1))
        ));


    @Effect()
    initTimeRecordingData$ = this.actions$.pipe(ofType<Core.InitTimeRecording>(Core.INIT_TIME_RECORDING),
        switchMap(action =>
            combineLatest(
                this.store.select(getTimeRecordingViewByToken(action.token)),
                this.store.select(getSelectedFeeEarnerByToken(action.token)),
                this.store.select(getFeeEarnerList),
                this.store.select(getEBillingTypeByToken(action.token)),
                ((store, feeEarner, feeEarnerList, tabEBillingValue) => ({ store, feeEarner, feeEarnerList, tabEBillingValue, action }))
            ).pipe(take(1))
        ),
        mergeMap(({ store, feeEarner, feeEarnerList, tabEBillingValue, action }) => {
            const actions = [];
            let precedentSLoaded = false;
            let precedentHLoaded = false;
            if (store.activitiList && store.activitiList.length > 0) {
                precedentSLoaded = true;
            }
            if (store.phaseList && store.phaseList.length > 0) {
                precedentSLoaded = true;
            }
            if (store.phaseWiseTaskList && store.phaseWiseTaskList.length > 0) {
                precedentSLoaded = true;
            }
            if (store.workTypeList && store.workTypeList.length > 0) {
                precedentHLoaded = true;
            }
            if (!feeEarnerList) {
                actions.push(new Core.LoadFeeEarnerList(action.token));
            } else if (!feeEarner) {
                actions.push(new Core.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: feeEarnerList }));
            }
            if (action.payload && action.payload.inputData && action.payload.inputData.canMinimize) {
                actions.push(new Core.RequestTimeRecordingInfo(action.token, { isFearnerChange: false }));
            }
            if (action.payload && action.payload.inputData && action.payload.inputData.editData &&
                action.payload.inputData.editData.timeEventId) {
                actions.push(new Core.GetDiaryFileData(action.token, { timeEventId: action.payload.inputData.editData.timeEventId }));
            }
            if ((action.payload && action.payload.inputData) || tabEBillingValue) {
                if (!precedentHLoaded &&
                    (action.payload.inputData.eBilling === eBillingType.PrecedentH || tabEBillingValue === eBillingType.PrecedentH)) {
                    actions.push(new Core.LoadWorkTypeList(action.token, action.payload.inputData.matterReferenceNo));
                    actions.push(new Core.LoadPHRateList(action.token, { matterRef: action.payload.inputData.matterReferenceNo }));
                } else if (!precedentSLoaded &&
                    (action.payload.inputData.eBilling === eBillingType.PrecedentS || tabEBillingValue === eBillingType.PrecedentS)) {
                    return from([
                        new Core.LoadPhaseList(action.token),
                        new Core.LoadActivitiList(action.token),
                        new Core.LoadTaskList(action.token)].concat(actions));
                }
            }
            return from(actions);
        }));
    @Effect()
    timeRecordingTabData$ = this.actions$.pipe(ofType<Core.LoadTabDataInit>(Core.TIME_RECORDING_TAB_DAT_INIT),
        mergeMap((action) => {
            return from([
                new Core.LoadFeeEarnerList(action.token),
                // new Core.LoadWorkTypeList(action.token),
                // new Core.LoadPhaseList(action.token),
                // new Core.LoadActivitiList(action.token),
                // new Core.LoadTaskList(action.token)
            ]);
        }));

    @Effect()
    getDiaryFileData$ = this.actions$.pipe(ofType<Core.GetDiaryFileData>(Core.GET_DIARY_FILE_DATA_TIME_RECORDING),
        switchMap((action: Core.GetDiaryFileData) =>
            this.service.getDiaryFileData(action.payload.timeEventId).pipe(map((response) =>
                new Core.GetDiaryFileDataSuccess(action.token, { diaryDetails: response })),
                catchError(error => of(new Core.GetDiaryFileDataFail(action.token, error))))
        ));

    @Effect()
    loadFeeEarnerListData$ = this.actions$.pipe(ofType<Core.LoadFeeEarnerList>(Core.LOAD_FEEEARNER_LIST),
        switchMap((action: Core.LoadFeeEarnerList) =>
            this.service.getFeeEarnerList().pipe(map((response) =>
                new Core.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: response })),
                catchError(error => of(new Core.CatchTimeRecordingError(action.token,
                    {
                        timeRecordingError: {
                            isError: true, msg: error,
                            isFloatingTimeSave: false
                        }
                    }))))
        ));
    @Effect()
    loadDefaultFeeEarnerData$ = this.actions$.pipe(ofType<Core.LoadFeeEarnerListSuccess>(Core.LOAD_FEEEARNER_LIST_SUCCESS),
        switchMap((action: Core.LoadFeeEarnerListSuccess) =>
            combineLatest(
                this.store.select(getTimeRecordingUserByToken(action.token)),
                this.store.select(getUser),
                this.store.select(getDiaryModeCurrentUser()),
                ((Matteruser, user, isLoginUser) => ({ Matteruser, user, isLoginUser, token: action.token }))
            ).pipe(take(1))
        ), switchMap((info) => {
            if (info.isLoginUser || !info.Matteruser) { // set loging user as a feeEarner
                return of(new Core.LoadDefaultFeeEarnerSuccess(info.token, { user: info.user.general.user }));
            } else {
                return of(new Core.LoadDefaultFeeEarnerSuccess(info.token, { user: info.Matteruser }));
            }
        }));
    @Effect()
    loadDetailsData$ = this.actions$.pipe(ofType<Core.LoadDefaultFeeEarnerSuccess>(Core.LOAD_DEFULT_FEEEARNER_SUCCESS),
        switchMap((action: Core.LoadDefaultFeeEarnerSuccess) =>
            of(new Core.RequestTimeRecordingInfo(action.token, { isFearnerChange: false }))
        ));

    @Effect()
    requestToChangeMatter$ = this.actions$.pipe(ofType<Core.ChangMatter>(Core.CHANG_MATTER),
        switchMap(action =>
            combineLatest(
                this.store.select(getSelectedFeeEarnerByToken(action.token)),
                this.store.select(getFeeEarnerList),
                ((feeEarner, feeEarnerList) => ({ feeEarner, feeEarnerList, action }))
            ).pipe(take(1))
        ),
        mergeMap(({ feeEarner, feeEarnerList, action }) => {
            const actions: any[] = [new Core.CheckTimeRecordEnable(action.token, action.payload)];
            // if (!feeEarner) {
            actions.push(new Core.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: feeEarnerList }));
            // } else {
            //     actions.push(new Core.RequestTimeRecordingInfo(action.token, { isFearnerChange: false }));
            // }
            if (action.payload) {
                if (action.payload.eBilling === eBillingType.PrecedentH) {
                    actions.push(new Core.LoadWorkTypeList(action.token, action.payload.matterRef));
                    actions.push(new Core.LoadPHRateList(action.token, { matterRef: action.payload.precedentHRateID }));

                } else if (action.payload.eBilling === eBillingType.PrecedentS) {
                    return from([
                        new Core.LoadPhaseList(action.token),
                        new Core.LoadActivitiList(action.token),
                        new Core.LoadTaskList(action.token)].concat(actions));
                }
            }
            return from(actions);
        }));

    @Effect()
    checkSelectedMatter = this.actions$.pipe(ofType<Core.CheckTimeRecordEnable>(Core.CHECK_TIME_RECORD_ENABLE),
        switchMap((action: Core.CheckTimeRecordEnable) =>
            this.service.getIsTimeRecordingEnabled(action.payload.matterRef).pipe(map((response) => {
                if (response === true) {
                    return new Core.CheckTimeRecordEnableSuccess(action.token, action.payload);
                } else {
                    return new Core.CatchTimeRecordingError(action.token, {
                        timeRecordingError:
                        {
                            isError: true, msg: `Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.`,
                            isFloatingTimeSave: false
                        }
                    });
                }
            }), catchError(error => of(new Core.CheckTimeRecordEnableFail(action.token))))));

    @Effect()
    changeMatter$ = this.actions$.pipe(ofType<Core.CheckTimeRecordEnableSuccess>(Core.CHECK_TIME_RECORD_ENABLE_SUCCESS),
        mergeMap((info) => {
            if (info.payload && info.payload && info.payload.eBilling) {
                if (info.payload.eBilling === eBillingType.PrecedentH) {
                    return from([new Core.LoadWorkTypeList(info.token, info.payload.matterRef),
                    new Core.LoadPHRateList(info.token, { matterRef: info.payload.matterRef }),
                    new Core.RequestTimeRecordingInfo(info.token, { isFearnerChange: false })]);
                } else if (info.payload.eBilling === eBillingType.PrecedentS) {
                    return from([
                        new Core.LoadPhaseList(info.token),
                        new Core.LoadActivitiList(info.token),
                        new Core.RequestTimeRecordingInfo(info.token, { isFearnerChange: false }),
                        new Core.LoadTaskList(info.token)]);
                }
            }
            return from([]);
        }));

    @Effect()
    loadInfoSucceess$ = this.actions$.pipe(ofType<Core.RequestTimeRecordingInfo>(Core.REQUEST_TIME_RECORDING_INFO),
        switchMap((action: Core.RequestTimeRecordingInfo) =>
            combineLatest(
                this.store.select(getSelectedFeeEarnerByToken(action.token)),
                this.store.select(getMatterReferenceNoByToken(action.token)),
                ((feeEarner, matterRef) => ({ feeEarner, matterRef, token: action.token }))
            ).pipe(filter(val => !!val.matterRef), take(1))
        ),
        switchMap((info) => {
            return this.service.getDetailsList(info.feeEarner, info.matterRef).pipe(map((response) =>
                new Core.LoadTimeRecordingInfo(info.token, { info: response })),
                catchError(error =>
                    of(new Core.CatchTimeRecordingError(info.token, {
                        timeRecordingError: {
                            isError: true,
                            msg: error.error, isFloatingTimeSave: false
                        }
                    }))));
        }));
    @Effect()
    setEditData$ = this.actions$.pipe(ofType<Core.LoadTimeRecordingInfo>(Core.LOAD_TIME_RECORDING_INFO),
        switchMap(action =>
            combineLatest(
                this.store.select(getTimeRecordEditDataByToken(action.token)),
                this.store.select(getIsLoadingByToken(action.token)),
                ((editData, loading) => ({ editData, loading, token: action.token }))
            )
        ), filter(info => !!info.editData && !info.loading),
        map(data =>
            new Core.SetTimeRecordEditData(data.token)
        ));

    @Effect()
    changefeeEarner$ = this.actions$.pipe(ofType<Core.ChangeFeeEarner>(Core.CHANGE_FEEEARNER),
        switchMap((action: Core.ChangeFeeEarner) =>
            this.store.select(getTimeRecordEditDataByToken(action.token)).pipe(
                map((editData) => ({ editData, token: action.token })),
                take(1))),
        filter(i => !i.editData),
        map(info => new Core.RequestTimeRecordingInfo(info.token, { isFearnerChange: true })));

    @Effect()
    submitData$ = this.actions$.pipe(ofType<Core.SubmitTimeRecord>(Core.SUBMIT_TIME_RECORD),
        switchMap((action: Core.SubmitTimeRecord) =>
            this.store.select(getTimeRecordingViewByToken(action.token)).pipe(
                map((store) => ({ store, token: action.token })),
                take(1))
        ), switchMap<any, Core.Any>((info) => {
            const validation: TimeRecordingMsg = this.validateSubmitData(info.store);
            if (!validation.isError) {
                return of(new Core.SaveTimeRecord(info.token));
            } else {
                return of(new Core.CatchTimeRecordingError(info.token, { timeRecordingError: validation }));
            }
        }));
    @Effect()
    saveWithoutsubmitData$ = this.actions$.pipe(ofType<Core.SaveWithoutSubmitTimeRecord>(Core.SAVE_WITHOUT_SUBMIT_TIME_RECORD),
        switchMap((action: Core.SaveWithoutSubmitTimeRecord) =>
            this.store.select(getTimeRecordingViewByToken(action.token)).pipe(
                map((store) => ({ store, token: action.token })),
                take(1))
        ), switchMap<any, Core.Any>((info) => {
            return of(new Core.SaveTimeRecord(info.token));
        }));


    @Effect()
    saveTimeRecord1$ = this.saveTimeRecord$.pipe(
        filter(({ store, token }) => store.timeRecordAddingType !== TimeRecordAddingType.FloatingTimeUnpostToPost),
        switchMap(({ store, token }) => {
            const dateString = store.date;
            let timeRecordObj: TimeRecordSubmitModel[];
            const workTypeID = store.workTypeList ? store.workTypeList.find((detail) => detail.selected) : 0;
            const phaseID = store.phaseList ? store.phaseList.find((detail) => detail.selected) : 0;
            const activitiID = store.activitiList ? store.activitiList.find((detail) => detail.selected) : 0;
            const taskID = store.phaseWiseTaskList ? store.phaseWiseTaskList.find((detail) => detail.selected) : 0;
            const rechTextBody = store.body ? !!store.body.match(/<(?:.|\n)*?>/gm) : false;
            timeRecordObj = [{
                matterRef: store.matterRefNo,
                mpu: Number(store.mpu),
                unit: Number(store.unit),
                amount: Number(store.amount),
                rate: Number(store.hourlyRate),
                note: store.body,
                recordDate: store.editData ? store.editData.dateDone : this.datePipe.transform(dateString, 'yyyy-MM-dd HH:mm'),
                feeEarner: store.feeEarner,
                details: store.selectDetails,
                timeRecordId: store.timeRecordId,
                workType: workTypeID ? workTypeID.key : 0,
                eBillingPhaseID: phaseID ? phaseID.phaseID : 0,
                eBillingActivityID: activitiID ? activitiID.phaseID : 0,
                eBillingTaskID: taskID ? taskID.phaseID : 0,
                timeRecordAddingType: store.timeRecordAddingType,
                TimerValueSeconds: store.timeValue ? store.timeValue : 0,
                isHtmlNote: rechTextBody,
                htmlNote: rechTextBody ? store.body : null
            }];
            // new time recording model
            const timeRecordSaveObject: TimeRecordAddUpdateViewModel = {
                timeRecordingAddViewModels: timeRecordObj,
                timeRecordAddingType: store.timeRecordAddingType
            };
            return this.service.saveTimeRecords(timeRecordSaveObject).pipe(map((respone) =>
                new Core.TimeRecordSaveSuccess(token,
                    { timeRecordId: (respone.data && respone.data.length > 0) ? respone.data[0] : null })),
                catchError(error =>
                    of(new Core.CatchTimeRecordingError(token, {
                        timeRecordingError: {
                            isError: true,
                            msg: error.error, isFloatingTimeSave: false
                        }
                    }))));
        }));

    @Effect()
    saveTimeRecord2$ = this.saveTimeRecord$.pipe(
        filter(({ store, token }) => store.timeRecordAddingType === TimeRecordAddingType.FloatingTimeUnpostToPost),
        throttle(val => interval(1000)), switchMap(({ store, token }) => {
            const dateString = store.date;
            let timeRecordObj: TimeRecordSubmitModel[];
            const workTypeID = store.workTypeList ? store.workTypeList.find((detail) => detail.selected) : 0;
            const phaseID = store.phaseList ? store.phaseList.find((detail) => detail.selected) : 0;
            const activitiID = store.activitiList ? store.activitiList.find((detail) => detail.selected) : 0;
            const taskID = store.phaseWiseTaskList ? store.phaseWiseTaskList.find((detail) => detail.selected) : 0;
            const rechTextBody = !!store.body.match(/<(?:.|\n)*?>/gm);
            timeRecordObj = [{
                matterRef: store.matterRefNo,
                mpu: Number(store.mpu),
                unit: Number(store.unit),
                amount: Number(store.amount),
                rate: Number(store.hourlyRate),
                note: store.body,
                recordDate: store.editData ? store.editData.dateDone : this.datePipe.transform(dateString, 'yyyy-MM-dd HH:mm'),
                feeEarner: store.feeEarner,
                details: store.selectDetails,
                timeRecordId: store.timeRecordId,
                workType: workTypeID ? workTypeID.key : 0,
                eBillingPhaseID: phaseID ? phaseID.phaseID : 0,
                eBillingActivityID: activitiID ? activitiID.phaseID : 0,
                eBillingTaskID: taskID ? taskID.phaseID : 0,
                timeRecordAddingType: store.timeRecordAddingType,
                TimerValueSeconds: store.timeValue ? store.timeValue : 0,
                isHtmlNote: rechTextBody,
                htmlNote: rechTextBody ? store.body : null
            }];
            // new time recording model
            const timeRecordSaveObject: TimeRecordAddUpdateViewModel = {
                timeRecordingAddViewModels: timeRecordObj,
                timeRecordAddingType: store.timeRecordAddingType
            };
            return this.service.saveTimeRecords(timeRecordSaveObject).pipe(map((respone) =>
                new Core.TimeRecordSaveSuccess(token,
                    { timeRecordId: (respone.data && respone.data.length > 0) ? respone.data[0] : null })),
                catchError(error =>
                    of(new Core.CatchTimeRecordingError(token, {
                        timeRecordingError: {
                            isError: true,
                            msg: error.error, isFloatingTimeSave: false
                        }
                    }))));
        }));
    // eBilling Comment
    @Effect()
    loadPrecedentHRateListData$ = this.actions$.pipe(ofType<Core.LoadPHRateList>(Core.LOAD_PH_RATE_LIST),
        switchMap((action: Core.LoadPHRateList) =>
            this.service.getPrecedentHRateList(action.payload.matterRef).pipe(map((response) =>
                new Core.LoadPHRateListSuccess(action.token, { precedentHRateList: response })),
                catchError(error => of(new Core.LoadPHRateListFail(action.token, error))))
        ));
    @Effect()
    loadWorkTypeListData$ = this.actions$.pipe(ofType<Core.LoadWorkTypeList>(Core.LOAD_TIME_WORK_TYPE_LIST),
        switchMap((action: Core.LoadWorkTypeList) =>
            this.service.getWorkTypeList(action.payload).pipe(map((response) =>
                new Core.LoadWorkTypeListSuccess(action.token, { workTypeList: response })),
                catchError(error => of(new Core.LoadWorkTypeListFail(action.token, error))))
        ));
    @Effect()
    loadPhaseListData$ = this.actions$.pipe(ofType<Core.LoadPhaseList>(Core.LOAD_TIME_PHASE_LIST),
        switchMap((action: Core.LoadPhaseList) =>
            this.service.getPhaseList().pipe(map((response) =>
                new Core.LoadPhaseListSuccess(action.token, { phaseList: response })),
                catchError(error => of(new Core.LoadPhaseListFail(action.token, error))))
        ));
    @Effect()
    loadActivitiListData$ = this.actions$.pipe(ofType<Core.LoadActivitiList>(Core.LOAD_TIME_ACTIVITI_LIST),
        switchMap((action: Core.LoadActivitiList) =>
            this.service.getActivitiList().pipe(map((response) =>
                new Core.LoadActivitiListSuccess(action.token, { activitiList: response })),
                catchError(error => of(new Core.LoadActivitiListFail(action.token, error))))
        ));
    @Effect()
    loadTaskListData$ = this.actions$.pipe(ofType<Core.LoadTaskList>(Core.LOAD_TIME_TASK_LIST),
        switchMap((action: Core.LoadTaskList) =>
            this.service.getTaskList().pipe(map((response) =>
                new Core.LoadTaskListSuccess(action.token, { taskList: response })),
                catchError(error => of(new Core.LoadTaskListFail(action.token, error))))
        ));
    @Effect()
    timeRecordingdelete$ = this.actions$.pipe(ofType<Core.DeleteTimeRecording>(Core.DELETE_TIME_RECORDING),
        switchMap((action: Core.DeleteTimeRecording) =>
            this.service.deleteTimeRecording({ timeIdList: [action.payload.timeRecordingId], isFloatingTime: true }).pipe(map((response) =>
                new Core.DeleteTimeRecordingSuccess(action.token, { payload: response })),
                catchError(error => of(new Core.DeleteTimeRecordingFail(action.token, error))))
        ));

    @Effect()
    requestDocViewUrl$ = this.actions$.pipe(ofType<Core.SetTimeRecordEditData>(Core.SET_EDIT_DATA),
        map(action => new Core.EditDoc(action.token))
    );
    @Effect()
    loadDiaryDocViewUrl$ = this.actions$.pipe(ofType<Core.EditDoc>(Core.EDIT_DOC),
        switchMap(action =>
            combineLatest(
                this.store.select(getTimeRecordEditDataByToken(action.token)),
                this.store.select(getDiaryFileDetails(action.token)),
                ((editData, diaryFileData) => ({ token: action.token, editData, diaryFileData }))
            ).pipe(take(1))
        ),
        filter(data => data.editData && !!data.editData.timeEventId && data.diaryFileData && data.diaryFileData.extension === '.html'),
        switchMap((data) => {
            return this.webViewService.getDiaryWebView(
                data.editData.appCode, data.editData.branchId, data.editData.fileId, data.editData.timeEventId, 'note.html').
                pipe(
                    map((html) => new Core.ChangeNote(data.token, { note: html })),
                    catchError(error => of(new Core.EditDocFail(data.token))));
        }));
    validateSubmitData(state: TimeRecordingState) {
        let valid: TimeRecordingMsg = { isError: false, msg: '', isFloatingTimeSave: false };
        const workType = state.workTypeList ? state.workTypeList.find((detail) => detail.selected) : null;
        const activiti = state.activitiList ? state.activitiList.find((detail) => detail.selected) : null;
        const phase = state.phaseList ? state.phaseList.find((detail) => detail.selected) : null;
        const phaseWiseTask = state.phaseWiseTaskList ? state.phaseWiseTaskList.find((detail) => detail.selected) : null;

        if (!state.matterRefNo) {
            valid = {
                isError: true,
                msg: 'The Matter cannot be empty!',
                isFloatingTimeSave: false
            };
        } else if (state.amount === '0.00' && !state.uncharge) {
            valid = {
                isError: true,
                msg: 'The amount cannot be zero!',
                isFloatingTimeSave: false
            };
        } else if (!state.feeEarner) {
            valid = {
                isError: true,
                msg: 'The Fee Earner cannot be empty!',
                isFloatingTimeSave: false
            };
        } else if (!state.selectDetails) {
            valid = {
                isError: true,
                msg: 'The Details cannot be empty!',
                isFloatingTimeSave: false
            };
        } else if (!state.date) {
            valid = {
                isError: true,
                msg: 'The Record Date cannot be empty!',
                isFloatingTimeSave: false
            };
        } else if (state.eBillingType === eBillingType.PrecedentH && !workType) {
            valid = {
                msg: 'The Work Type cannot be empty!',
                isError: true,
                isFloatingTimeSave: false
            };
        } else if (state.eBillingType === eBillingType.PrecedentS && !phase) {
            valid = {
                msg: 'The Phase cannot be empty!',
                isError: true,
                isFloatingTimeSave: false
            };
        } else if (state.eBillingType === eBillingType.PrecedentS && !phaseWiseTask) {
            valid = {
                msg: 'The Task cannot be empty!',
                isError: true,
                isFloatingTimeSave: false
            };
        } else if (state.eBillingType === eBillingType.PrecedentS && !activiti) {
            valid = {
                msg: 'The activity cannot be empty!',
                isError: true,
                isFloatingTimeSave: false
            };
        }

        return valid;
    }
}



