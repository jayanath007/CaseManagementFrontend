
import { catchError, mergeMap, map, switchMap, take, filter } from 'rxjs/operators';

import { of, from, combineLatest } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { TeamEfficiencyService } from '../services/team-efficiency.service';
import * as Core from '../actions/core';
import {
    getTeamEfficiencySelectedDepartmentByToken, getTeamEfficiencySelectedMonthByToken,
    getTeamEfficiencySelectedUserByToken, getTeamEfficiencySelectedTimeRecordedOptionByToken
} from '..';
import { InitTeamMember } from '../../team-member-core';
import { TeamMemberOpenFrom } from '../../team-member-core/models/enums';
import { ChangeDepartmentOrFeeEranerState } from '../../team-member-core/actions/team-member';
import { getTeamEfficiencyStateByToken, getTeamEffSelectedMatterType } from '../reducers';
import { MatterTypeEnum } from '../models/enums';
import { getTeamMemberCountByToken } from '../../team-member-core/reducers';
@Injectable()
export class TeamEfficiencyEffects {
    constructor(private actions$: Actions,
        private store: Store<any>, private service: TeamEfficiencyService) { }

    @Effect()
    InitTeamEfficiencyData$ = this.actions$.pipe(ofType<Core.InitTeamEfficiency>(Core.INIT_TEAM_EFFICIENCY),
        mergeMap((action: Core.InitTeamEfficiency) =>
            combineLatest(this.store.select(getTeamEfficiencyStateByToken(action.token)),
                (state) => ({ state })).pipe(
                    take(1),
                    mergeMap(info => {
                        if (!info.state.departmentList) {
                            return from([new Core.LoadTEDepartmentList(action.token),
                            new Core.LoadTEMonthList(action.token),
                            //  new Core.LoadChartData(action.token),
                            // new Core.LoadTEAdgedDebData(action.token),
                            // new Core.LoadTEBilledTimes(action.token),
                            new InitTeamMember('TEAM_MEMBER_DATA_TEAM_EFFICIENCY', TeamMemberOpenFrom.TeamEfficiency)
                            ]);
                        } else {
                            return from([]);
                        }
                    }))));

    @Effect()
    loadChartData$ = this.actions$.pipe(ofType<Core.LoadChartData>(Core.LOAD_CHART_DATA),
        mergeMap((action: Core.LoadChartData) => {
            return from([
                new Core.LoadTETimeRecordedData(action.token),
                new Core.LoadTEAdgedDebData(action.token),
                new Core.LoadTEBilledTimes(action.token),
                // new Core.LoadTECashRecived(action.token),
                new Core.LoadTEMatter(action.token),
                new Core.RequestActivityByYearSummeryInEfficiency(action.token)
            ]);
        }));

    @Effect()
    loadDepartmentList$ = this.actions$.pipe(ofType<Core.LoadTEDepartmentList>(Core.LOAD_TE_DEPARTMENT_LIST),
        switchMap((action: Core.LoadTEDepartmentList) =>
            this.service.getDepartmentList().pipe(map((response) =>
                new Core.LoadTEDepartmentListSuccess(action.token, { departmentList: response })),
                catchError(error => of(new Core.LoadTEDepartmentListFail(action.token, error))))
        ));

    @Effect()
    loadMonthList$ = this.actions$.pipe(ofType<Core.LoadTEMonthList>(Core.LOAD_TE_MONTH_LIST),
        switchMap((action: Core.LoadTEMonthList) =>
            this.service.getMonthList().pipe(map((response) =>
                new Core.LoadTEMonthListSuccess(action.token, { monthList: response })),
                catchError(error => of(new Core.LoadTEMonthListFail(action.token, error))))
        ));

    @Effect()
    loadTimeRecordData$ = this.actions$.pipe(ofType<Core.LoadTETimeRecordedData>(Core.LOAD_TE_TIME_RECORDED_DATA),
        switchMap((action: Core.LoadTETimeRecordedData) =>
            combineLatest(
                this.store.select(getTeamEfficiencySelectedUserByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedMonthByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedTimeRecordedOptionByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedDepartmentByToken(action.token)),
                ((user, month, option, department) => ({ user, month, option, department, token: action.token }))
            ).pipe(take(1))
        ),
        switchMap((info) =>
            this.service.getTimeRecordedData(info.user, info.month.monthId, info.option, info.department).pipe(map((response) =>
                new Core.LoadTETimeRecordedDataSuccess(info.token, { timeRecordedData: response })),
                catchError(error => of(new Core.LoadTETimeRecordedDataFail(info.token, error))))
        ));

    @Effect()
    loadAdgedDebData$ = this.actions$.pipe(ofType<Core.LoadTEAdgedDebData>(Core.LOAD_TE_AGED_DEBTORS_DATA),
        switchMap((action: Core.LoadTEAdgedDebData) =>
            combineLatest(
                this.store.select(getTeamEfficiencySelectedUserByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedMonthByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedDepartmentByToken(action.token)),
                ((user, month, department) => ({ user, month, department, token: action.token }))
            ).pipe(take(1))
        ),
        switchMap((info) =>
            this.service.getAdgedDebData(info.user, info.month.monthId, info.department).pipe(map((response) =>
                new Core.LoadTEAdgedDebDataSuccess(info.token, { newData: response })),
                catchError(error => of(new Core.LoadTEAdgedDebDataFail(info.token, error))))
        ));

    @Effect()
    loadBilledTimeData$ = this.actions$.pipe(ofType<Core.LoadTEBilledTimes>(Core.LOAD_TE_BILLED_TIMES_DATA),
        switchMap((action: Core.LoadTEBilledTimes) =>
            combineLatest(
                this.store.select(getTeamEfficiencySelectedUserByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedMonthByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedDepartmentByToken(action.token)),
                ((user, month, department) => ({ user, month, department, token: action.token }))
            ).pipe(take(1))
        ),
        switchMap((info) =>
            this.service.getBilledTimeData(info.user, info.month.monthId, info.department).pipe(map((response) =>
                new Core.LoadTEBilledTimesSuccess(info.token, { newData: response })),
                catchError(error => of(new Core.LoadTEBilledTimesFail(info.token, error))))
        ));

    // @Effect()
    // loadCashRecivedData$ = this.actions$.pipe(ofType<Core.LoadTECashRecived>(Core.LOAD_TE_CASH_RECIVED_DATA),
    //     switchMap((action: Core.LoadTECashRecived) =>
    //         combineLatest(
    //             this.store.select(getTeamEfficiencySelectedUserByToken(action.token)),
    //             this.store.select(getTeamEfficiencySelectedMonthByToken(action.token)),
    //             this.store.select(getTeamEfficiencySelectedDepartmentByToken(action.token)),
    //             ((user, month, department) => ({ user, month, department, token: action.token }))
    //         ).pipe(take(1))
    //     ),
    //     switchMap((info) =>
    //         this.service.getCashRecivedData(info.user, info.month.monthId, info.department).pipe(map((response) =>
    //             new Core.LoadTECashRecivedSuccess(info.token, { newData: response })),
    //             catchError(error => of(new Core.LoadTECashRecivedFail(info.token, error))))
    //     ));

    @Effect()
    MattersOpenedData$ = this.actions$.pipe(ofType<Core.LoadTEMatter>(Core.LOAD_TE_MATTER_DATA),
        switchMap((action: Core.LoadTEMatter) =>
            combineLatest(
                this.store.select(getTeamEfficiencySelectedUserByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedMonthByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedDepartmentByToken(action.token)),
                this.store.select(getTeamEffSelectedMatterType(action.token)),
                ((user, month, department, matterType: MatterTypeEnum) => ({ user, month, department, token: action.token, matterType }))
            ).pipe(take(1))
        ),
        switchMap((info) =>
            this.service.getMatterData(info.user, info.month.monthId, info.department, info.matterType).pipe(map((response) =>
                new Core.LoadTEMatterSuccess(info.token, { newData: response })),
                catchError(error => of(new Core.LoadTEMatterFail(info.token, error))))
        ));

    @Effect()
    changeTimeRecordedOption$ = this.actions$.pipe(ofType<Core.ChangeTETimeRecordedOption>(Core.CHANGE_TE_TIME_RECORDED_OPTION),
        map((action: Core.ChangeTETimeRecordedOption) =>
            new Core.LoadTETimeRecordedData(action.token)
        ));

    @Effect()
    changeMatterOption$ = this.actions$.pipe(ofType<Core.ChangeTEMatterType>(Core.CHANGE_TE_MATTER_TYPE),
        map((action: Core.ChangeTEMatterType) =>
            new Core.LoadTEMatter(action.token)
        ));

    @Effect()
    changeDepartment$ = this.actions$.pipe(ofType<Core.ChangeTEDepartment>(Core.CHANGE_TE_DEPARTMENT),
        switchMap((action: Core.ChangeTEDepartment) => {
            return of(new Core.LoadChartData(action.token));
        }));

    @Effect()
    $loadTeamMember = this.actions$.pipe(ofType<Core.ChangeTEDepartment>(Core.CHANGE_TE_DEPARTMENT),
        map((action) => {
            const inPutData = {
                departmentId: action.payload.selectedDepartment.groupId,
                isInactiveFeeEarners: false,
                membereSearchText: null
            };
            return new ChangeDepartmentOrFeeEranerState('TEAM_MEMBER_DATA_TEAM_EFFICIENCY', { inPutData: inPutData });
        }
        ));

    @Effect()
    changeMonth$ = this.actions$.pipe(ofType<Core.ChangeTEMonth>(Core.CHANGE_TE_MONTH),
        switchMap((action: Core.ChangeTEMonth) => {
            return of(new Core.LoadChartData(action.token));
        }));

    @Effect()
    changeUser$ = this.actions$.pipe(ofType<Core.ChangeTEUser>(Core.CHANGE_TE_USER),
        switchMap((action: Core.ChangeTEUser) => {
            return of(new Core.LoadChartData(action.token));
        }));


    @Effect()
    requestActivityByYear$ = this.actions$.pipe(ofType<Core.RequestActivityByYearSummeryInEfficiency>
        (Core.REQUEST_ACTIVITY_BY_YEAR_SUMMARY_IN_EFFICIENCY),
        switchMap((action: Core.RequestActivityByYearSummeryInEfficiency) =>
            combineLatest(
                this.store.select(getTeamEfficiencySelectedUserByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedMonthByToken(action.token)),
                this.store.select(getTeamEfficiencySelectedDepartmentByToken(action.token)),
                ((user, month, department) => {

                   return { user, month, department, token: action.token };

                })
            ).pipe(take(1))
        ),
        filter(action => !!action.month && (action.month.monthId === -1 || action.month.monthId === -2)),
        map((action) => {
            return new Core.LoadActivitySummaryUserInEfficiency(action.token, { data: action });
        }
        ));





    @Effect()
    getActivityByYearSumaryByUser$ = this.actions$.pipe(ofType<Core.LoadActivitySummaryUserInEfficiency>
        (Core.LOAD_ACTIVITY_SUMMARY_YEAR_IN_EFFICIENCY),
        switchMap((action) =>
            this.service.getActivityYearByDepartment(action.payload.data).pipe(    // to do
                map((responce) => new Core.LoadActivitySummaryYearInEfficiencySuccess(action.token, { eventYearSummery: responce })),
                catchError((error) => of(new Core.LoadActivitySummaryYearInEfficiencyFail(action.token, error))))
        ));

}


