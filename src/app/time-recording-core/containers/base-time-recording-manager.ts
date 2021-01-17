import {
    ChangeWorkType, ChangePhase, ChangeTask, ChangeActiviti,
    ChangMatter, StopStartClock, SaveWithoutSubmitTimeRecord, PhRateChange
} from './../actions/core';
import { TimeRecordInputData, ClientMatterData } from '../models/interfaces';

import { OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    InitTimeRecording,
    ChangeUnit,
    ChangeRate,
    ChangeFeeEarner,
    ChangeUncharge,
    ChangeDate,
    ChangeDetails,
    ChangeNote,
    SubmitTimeRecord,
    DeleteTimeRecording,
    TRPopupMinimize
} from '../actions/core';
import {
    getDetailListByToken, getMatterReferenceNoByToken, getBodyTextByToken,
    getUnchargeStateByToken, getIsLoadingByToken, getFeeEarnerListByToken,
    getErrorDetailsByToken, getTimeRecordingDateByToken, getMPUByToken,
    getHourlyRateByToken, getAmountByToken, getUnitByToken, getSaveStateToken,
    getIsDirtyByToken,
    getTimeRecordEditDataByToken,
    getLoadWorkTypeListByToken,
    getLoadPrecedentHRateByToken,
    getTaskListByToken,
    getselectedDetailByToken,
    getClientMatterDataByToken,
    getTimeValueByToken,
    getIsActiveByToken,
    getTimeRecordingViewByToken,
    getSelectedPhRateByToken,
} from '../reducers';
import { TimeRecordingClose } from '..';
import { TimeRecordingCloseInfo } from '../models/enum';
import {
    getPhaseListByToken, getActivitiListByToken, getEBillingTypeByToken,
    getIsTimerStartByToken, isMinimizePopupByToken, getSelectedJobTitle, getDiaryFileDetails
} from '../reducers/index';
import { eBillingType } from '../../core/lib/matter';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { take } from 'rxjs/operators';


export class BaseTimeRecordingManager {
    @Output() closePopup = new EventEmitter<TimeRecordingCloseInfo>();

    public myToken: string;
    user$: Observable<User>;

    public isLoading$: any;
    public detailList$: any;
    public selectDetail$: any;
    public matterReferenceNo$: any;
    public clientMatterData$: any;
    public isUncharge$: any;
    public homeCurrancy$: any;
    public feeEarnerList$: any;
    public error$: any;
    public date$: any;
    public bodyText$: any;
    public mpu$: any;
    public unit$: any;
    public hourlyRate$: any;
    public amount$: any;
    public saved$: any;
    public isDirty$: any;
    public editData$: any;
    public workTypeListData$: any;
    public phaseListData$: any;
    public activitiListData$: any;
    public taskListData$: any;
    public eBillingType$: any;
    public precedentHRateListData$: any;
    // public canMinimizeViews$: any;
    public timeValue$: any;
    public isActiveToken$: any;
    public timeRecordingView$: any;
    public isTimerStart$: any;
    public isMinimizePopup$: any;
    public selectedPhRate$: any;
    public selectedJobTitle$: any;
    public diaryFileDetails$: any;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, inputData: TimeRecordInputData) {
        this.myToken = myToken;
        this.user$ = this.store.select(getUser);
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitTimeRecording(myToken, { inputData: inputData, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
        this.detailList$ = this.store.select(getDetailListByToken(myToken));
        this.matterReferenceNo$ = this.store.select(getMatterReferenceNoByToken(myToken));
        this.clientMatterData$ = this.store.select(getClientMatterDataByToken(myToken));
        this.isLoading$ = this.store.select(getIsLoadingByToken(myToken));
        this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken(myToken));
        this.error$ = this.store.select(getErrorDetailsByToken(myToken));
        this.date$ = this.store.select(getTimeRecordingDateByToken(myToken));
        this.bodyText$ = this.store.select(getBodyTextByToken(myToken));
        this.mpu$ = this.store.select(getMPUByToken(myToken));
        this.unit$ = this.store.select(getUnitByToken(myToken));
        this.hourlyRate$ = this.store.select(getHourlyRateByToken(myToken));
        this.amount$ = this.store.select(getAmountByToken(myToken));
        this.isUncharge$ = this.store.select(getUnchargeStateByToken(myToken));
        this.saved$ = this.store.select(getSaveStateToken(myToken));
        this.isDirty$ = this.store.select(getIsDirtyByToken(myToken));
        this.editData$ = this.store.select(getTimeRecordEditDataByToken(myToken));

        this.eBillingType$ = this.store.select(getEBillingTypeByToken(myToken));
        this.precedentHRateListData$ = this.store.select(getLoadPrecedentHRateByToken(myToken));
        this.workTypeListData$ = this.store.select(getLoadWorkTypeListByToken(myToken));
        this.phaseListData$ = this.store.select(getPhaseListByToken(myToken));
        this.activitiListData$ = this.store.select(getActivitiListByToken(myToken));
        this.taskListData$ = this.store.select(getTaskListByToken(myToken));
        this.selectDetail$ = this.store.select(getselectedDetailByToken(myToken));
        this.selectedPhRate$ = this.store.select(getSelectedPhRateByToken(myToken));

        // this.canMinimizeViews$ = this.store.select(getCanMinimizeViews);

        this.timeValue$ = this.store.select(getTimeValueByToken(myToken));
        this.isActiveToken$ = this.store.select(getIsActiveByToken(myToken));
        this.timeRecordingView$ = this.store.select(getTimeRecordingViewByToken(myToken));
        this.isTimerStart$ = this.store.select(getIsTimerStartByToken(myToken));
        this.isMinimizePopup$ = this.store.select(isMinimizePopupByToken(myToken));
        this.selectedJobTitle$ = this.store.select(getSelectedJobTitle(myToken));
        this.diaryFileDetails$ = this.store.select(getDiaryFileDetails(myToken));

    }
    onChangeUnit(unit) {
        this.store.dispatch(new ChangeUnit(this.myToken, unit));
    }
    onChangeRate(rate) {
        this.store.dispatch(new ChangeRate(this.myToken, rate));
    }
    onChangeFeeEarner(feeEarner) {
        this.store.dispatch(new ChangeFeeEarner(this.myToken, feeEarner));
    }
    onChangeUncharge(uncharge) {
        this.store.dispatch(new ChangeUncharge(this.myToken, uncharge));
    }
    onUpateSelectedDate(date) {
        this.store.dispatch(new ChangeDate(this.myToken, date));
    }
    onUpateSelectedDetails(details) {
        this.store.dispatch(new ChangeDetails(this.myToken, details));
    }
    updateNote(note) {
        this.store.dispatch(new ChangeNote(this.myToken, { note }));
    }
    // eBilling Comment
    updateWorkType(value) {
        this.store.dispatch(new ChangeWorkType(this.myToken, value));
    }
    updatePhase(value) {
        this.store.dispatch(new ChangePhase(this.myToken, { selectedPhase: value }));
    }
    updateTask(value) {
        this.store.dispatch(new ChangeTask(this.myToken, { selectedTask: value }));
    }
    updateActivity(value) {
        this.store.dispatch(new ChangeActiviti(this.myToken, { selectedActiviti: value }));
    }
    onSave() {
        this.store.dispatch(new SaveWithoutSubmitTimeRecord(this.myToken));
    }
    onSubmit(saveType) {
        this.store.dispatch(new SubmitTimeRecord(this.myToken));
    }
    onDeleteTimeRecording(timeRecordingId) {
        this.store.dispatch(new DeleteTimeRecording(this.myToken, { timeRecordingId: timeRecordingId }));
    }
    close(info: TimeRecordingCloseInfo) {
        this.closePopup.emit(info);
        if (info !== TimeRecordingCloseInfo.Minimize) {
            this.store.dispatch(new TimeRecordingClose(this.myToken));
        } else if (info === TimeRecordingCloseInfo.Minimize) {
            this.store.dispatch(new TRPopupMinimize(this.myToken));
        }
    }
    onMatterSearch(event: { matRef: string, eBilling: eBillingType, feeEarner: string; clientMatterData: ClientMatterData; }) {
        this.store.dispatch(new ChangMatter(this.myToken,
            {
                matterRef: event.matRef, eBilling: event.eBilling, feeEarner: event.feeEarner,
                clientMatterData: event.clientMatterData, precedentHRateID: event.matRef
            }));
    }
    onStopStartClock(isPulse) {
        this.store.dispatch(new StopStartClock(this.myToken, { isPulse: isPulse }));
    }
    onPHRateChange(value) {
        this.store.dispatch(new PhRateChange(this.myToken, { pHRate: value }));
    }
}
