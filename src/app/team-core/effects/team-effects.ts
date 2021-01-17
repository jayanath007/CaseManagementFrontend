import { getSelectedViewTypeByToken } from './../reducers/index';
import { LoadActivityMembers, LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER } from './../actions/core';

import { tap, take, catchError, map, switchMap, mergeMap, filter } from 'rxjs/operators';
import { empty, of, from, combineLatest } from 'rxjs';
import {
    getParaDataByToken, getParaDetailsActivityByToken, getParaDetailsWithDepartmentByToken
} from '../reducers/index';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Team from '../actions/core';
import { TeamService } from '../services/team-service';
import { FileUrlResolverService } from '../../document-view';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';

import { SystemJsPopupLoaderService } from '../../shell-desktop';

import { MainMenuService } from '../../layout-desktop/services/main-menu.service';

import { UserViewType } from '../models/enum';




@Injectable()
export class TeamEffects {
    constructor(private actions$: Actions, private store: Store<any>, private datePipe: DatePipe,
        private urlResolver: FileUrlResolverService,
        private windowPopupsManagerService: WindowPopupsManagerService,
        private popupService: SystemJsPopupLoaderService,
        private mainMenuService: MainMenuService,
        private service: TeamService) { }


    @Effect()
    initewView$ = this.actions$.pipe(ofType<Team.InitTeam>(Team.INIT_TEAM),
        mergeMap(action => from([
            new Team.GetTeamDepartmentList(action.token),
            new Team.LoadActivityMembers(action.token),
            // new Team.RequestActivityByYearSummery(action.token),
        ])
        ));

    @Effect()
    loadTeamDepartmentList$ = this.actions$.pipe(ofType<Team.GetTeamDepartmentList>(Team.GET_TEAM_DEPARTMENT_LIST),
        switchMap((action) =>
            this.service.getDepartmentList().pipe(
                map((responce) => new Team.GetTeamDepartmentListSuccess(action.token, { departmetList: responce })),
                catchError((error) => of(new Team.GetTeamDepartmentListFail(action.token, error))))
        ));

    @Effect()
    LoadTeamUserList$ = this.actions$.pipe(ofType<Team.LoadActivityMembers>(Team.LOAD_ACTIVITY_MEMBERS),
        switchMap((action) =>
            this.store.select(getParaDataByToken(action.token)).pipe(
                map((paraData) => ({ paraData, token: action.token })),
                take(1))
        ),
        switchMap<any, Team.Any>((info) => {

            if (info.paraData.departmentId) {
                return this.service.getTeamMembers(info.paraData).pipe(
                    map((result) =>
                        new Team.LoadActivityMembersSuccess(info.token, { teamMemberList: result })),
                    catchError((error) => of(new Team.LoadActivityMembersFail(info.token, error))));
            } else {
                return this.service.getTeamMembers(info.paraData).pipe(
                    map((result) =>
                        new Team.GetLogingTeamUser(info.token, { teamMemberList: result })),
                    catchError((error) => of(new Team.LoadActivityMembersFail(info.token, error))));
            }
        }));


    @Effect()
    requestLastMovement$ = this.actions$.pipe(ofType<Team.LoadActivityMembersSuccess>(Team.LOAD_ACTIVITY_MEMBERS_SUCCESS),
        filter(action => !!action.payload.teamMemberList.data && action.payload.teamMemberList.data.length > 0),
        map((action) => {
            return new Team.GetTeamMemberLastMovement(action.token, { requestLastMovmentData: action.payload.teamMemberList.data });

        }
        ));

    @Effect()
    requestBylogingUser$ = this.actions$.pipe(ofType<Team.GetLogingTeamUser>(Team.GET_LOGING_TEAM_USER),
        filter(action => !!action.payload.teamMemberList.data && action.payload.teamMemberList.data.length > 0),
        map((action) => {

            return new Team.GetTeamMemberLastMovement(action.token, { requestLastMovmentData: action.payload.teamMemberList.data });

        }
        ));



    @Effect()
    getLastMovement$ = this.actions$.pipe(ofType<Team.GetTeamMemberLastMovement>(Team.GET_TEAM_MEMBER_LAST_MOVEMENT),
        switchMap((action) =>
            this.service.getUserLastMovement(action.payload.requestLastMovmentData).pipe(    // to do
                map((responce) => new Team.GetTeamMemberLastMovementSuccess(action.token, { lastMovementList: responce })),
                catchError((error) => of(new Team.GetTeamMemberLastMovementFail(action.token, error))))
        ));

    @Effect()
    initYearSummery$ = this.actions$.pipe(ofType<Team.GetTeamMemberLastMovementSuccess>(Team.GET_TEAM_MEMBER_LAST_MOVEMENT_SUCCESS),
        switchMap((action) =>
            this.store.select(getSelectedViewTypeByToken(action.token)).pipe(
                map((info) => ({ viewType: info, token: action.token })),
                take(1)),
        ),
        map((action) => {
            if (action.viewType === UserViewType.YearView) {
                return new Team.RequestActivityByYearSummery(action.token);
            } else {
                return new Team.RequestActivityByMonth(action.token);
            }
        }
        ));



    @Effect()
    changeUsererchText$ = this.actions$.pipe(ofType<Team.ChangeDepartmentOrTeamType>(Team.CHANGE_DEPARTMENT_OR_TEAM_TYPE),
        map((action) => {
            return new Team.LoadActivityMembers(action.token);
        }
        ));

    @Effect()
    changeTeamUser$ = this.actions$.pipe(ofType<Team.TeamUserChange>(Team.TEAM_USER_CHANGE),
        mergeMap((action) =>
            this.store.select(getSelectedViewTypeByToken(action.token)).pipe(
                map((info) => ({ viewType: info, token: action.token })),
                take(1)),
        ),
        map((action) => {
            if (action.viewType === UserViewType.YearView) {
                return new Team.RequestActivityByYearSummery(action.token);
            } else {
                return new Team.RequestActivityByMonth(action.token);

            }
        }
        ));


    @Effect()
    requestActiviryByMonth$ = this.actions$.pipe(ofType<Team.RequestActivityByMonth>(Team.REQUEST_ACTIVITY_BY_MONTH),
        switchMap((action) =>
            this.store.select(getParaDetailsActivityByToken(action.token)).pipe(
                map((paraData) => ({ paraData, token: action.token })),
                take(1)),
        ),
        map((action) => {
            return new Team.GetActivityDataByMonth(action.token, { requestData: action.paraData });
        }
        ));


    @Effect()
    requestActivityByYear$ = this.actions$.pipe(ofType<Team.RequestActivityByYearSummery>(Team.REQUEST_ACTIVITY_BY_YEAR_SUMMARY),
        switchMap((action) =>
            this.store.select(getParaDetailsWithDepartmentByToken(action.token)).pipe(
                map((paraData) => ({ paraData, token: action.token })),
                take(1)),
        ),
        map((action) => {
            return new Team.LoadActivitySummaryYear(action.token, { data: action.paraData });
        }
        ));

    //     @Effect()
    // requestActivityByYearByUser$ = this.actions$.pipe(ofType<Team.RequestActivityByYearSummeryByUser>
    //     (Team.REQUEST_ACTIVITY_BY_YEAR_SUMMARY_BY_USER),
    //     switchMap((action) =>
    //         this.store.select(getParaDetailsWithDepartmentByToken(action.token)).pipe(
    //             map((paraData) => ({ paraData, token: action.token })),
    //             take(1)),
    //     ),
    //     map((action) => {
    //         return new Team.LoadActivitySummaryYear(action.token, { data: action.paraData });
    //     }
    //     ));


    @Effect()
    getActivityByDay$ = this.actions$.pipe(ofType<Team.GetActivityDataByDay>(Team.GET_ACTIVITY_DATA_BY_DAY),
        switchMap((action) =>
            this.service.getUserMovementDetailsById(action.payload.movementIds).pipe(    // to do
                map((responce) => new Team.GetActivityDataByDaySuccess(action.token, { activityDayList: responce })),
                catchError((error) => of(new Team.GetActivityDataByDayFail(action.token, error))))
        ));

    @Effect()
    getActivityByMonth$ = this.actions$.pipe(ofType<Team.GetActivityDataByMonth>(Team.GET_ACTIVITY_DATA_BY_MONTH),
        switchMap((action) =>
            this.service.getActivityByMonth(action.payload.requestData).pipe(    // to do
                map((responce) => new Team.GetActivityDataByMonthSuccess(action.token, { activityMonthList: responce })),
                catchError((error) => of(new Team.GetActivityDataByMonthFail(action.token, error))))
        ));


    @Effect()
    getActivityByYearSun$ = this.actions$.pipe(ofType<Team.LoadActivitySummaryYear>(Team.LOAD_ACTIVITY_SUMMARY_YEAR),
        switchMap((action) =>
            this.service.getActivityYearByDepartment(action.payload.data).pipe(    // to do
                map((responce) => new Team.LoadActivitySummaryYearSuccess(action.token, { eventYearSummery: responce })),
                catchError((error) => of(new Team.LoadActivitySummaryYearFail(action.token, error))))
        ));

    @Effect()
    getActivityByYearSumaryByUser$ = this.actions$.pipe(ofType<Team.LoadActivitySummaryYearByUser>(Team.LOAD_ACTIVITY_SUMMARY_YEAR_BY_USER),
        switchMap((action) =>
            this.service.getActivityYearByUser(action.payload.data).pipe(    // to do
                map((responce) => new Team.LoadActivitySummaryYearByUserSuccess(action.token, { eventYearSummery: responce })),
                catchError((error) => of(new Team.LoadActivitySummaryYearByUserFail(action.token, error))))
        ));


}
