import { RefreshTeamWidget } from './../../team-widget/actions/core';

import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { Injectable, Inject } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, from, combineLatest } from 'rxjs';
import { UserMovementService } from '../services/user-movement-service';
import { switchMap, map, catchError, mergeMap, take, filter } from 'rxjs/operators';
import {
    getUserListByToken, getParaDataUserByToken, getCurrentDateRangeByToken,
    getChangeLocationByToken, getChangeIsOffTodayByToken
} from './../reducers/index';
import { MainMenuService } from './../../layout-desktop/services/main-menu.service';
import { IS_GOOGLE } from '../../shared';
import { getUser } from '../../auth';

@Injectable()
export class UserMovementEffects {
    constructor(
        private actions$: Actions, private store: Store<any>, private service: UserMovementService,
        protected pageService: MainMenuService, @Inject(IS_GOOGLE) public isGoogle: boolean) { }

    @Effect()
    initewView$ = this.actions$.pipe(ofType<Core.InitUserMovement>(Core.INIT_USER_MOVEMENT),
        mergeMap(action => from([
            new Core.GetTeamMovementDepartmentList(action.token),
            new Core.LoadTeamForMovement(action.token),
            //  new Core.RequestCurrentDateUserMovement(action.token, action.userList),
        ])));


    @Effect()
    getCurrentDataUserList$ = this.actions$.pipe(ofType<Core.RequestCurrentDateUserMovement>(Core.REQUEST_CURRENT_DATE_USER_MOVEMENT),
        switchMap((action) => this.service.getCurrentDateUserMovement(action.userList, action.payload.location,
            action.payload.isOffToday).pipe(
                map((result) => new Core.GetCurrentUserMovementSuccess(action.token, result, action.userList)),
                catchError((error) => of(new Core.GetCurrentUserMovementFail(action.token, { error: error }))))
        ));
    @Effect()
    getNextAvailableMovementList$ = this.actions$.pipe(ofType<Core.GetNextAvailableUserMovementType>(Core.
        GET_NEXT_AVAILABLE_USER_MOVEMENT_TYPES),
        switchMap((action) => this.service.GetNextAvailableUserMovementTypes(action.selectedUser.user).pipe(
            map((result) => new Core.GetNextAvailableUserMovementTypeSuccess(action.token, { nextAvailableTypes: result })),
            catchError((error) => of(new Core.GetNextAvailableUserMovementTypeFail(action.token, { error: error }))))
        ));
    @Effect()
    SubmitUserMovement$ = this.actions$.pipe(ofType<Core.AddMovementData>(Core.ADD_MOVEMENT_DATA),
        switchMap((action) => this.service.AddUserMovement(action.payload.submitData).pipe(
            map((result) => new Core.AddMovementDataSuccess(action.token, { data: result, user: action.payload.submitData.userId })),
            catchError((error) => of(new Core.AddMovementDataFail(action.token, { error: error }))))
        ));
    @Effect()
    RefreshMovementList$ = this.actions$.pipe(ofType<Core.RefreshUserMovementList>(Core.REFRESH_USER_MOVEMENT_LIST),
        // switchMap((action) =>
        //     this.store.select(getUserListByToken(action.token)).pipe(
        //         map((info) => ({ userList: info, token: action.token })),
        //         take(1)),
        // ),
        switchMap((action) =>
            combineLatest(

                this.store.select(getChangeIsOffTodayByToken(action.token)),
                this.store.select(getChangeLocationByToken(action.token)),
                this.store.select(getUserListByToken(action.token)), ((isOffToday, location, teamMemberList) =>
                    ({ isOffToday: isOffToday, location: location, userList: teamMemberList, token: action.token }))).pipe(
                        take(1))
        ),
        filter(info => !!info.userList && info.userList.length > 0),
        mergeMap((action) => {
            return from([new Core.RequestCurrentDateUserMovement(action.token, action.userList, {
                location: action.location,
                isOffToday: action.isOffToday
            })]);
        }
        ));

    @Effect()
    refreshTeamWidget$ = this.actions$.pipe(ofType<Core.AddMovementDataSuccess>(Core.ADD_MOVEMENT_DATA_SUCCESS),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                filter(user => !!(user && user.general)),
                map(user => ({ logingUser: user.general.user, selectedUser: action.payload.user })
                ), take(1)
            )),
        filter(info => info.logingUser === info.selectedUser),
        map(() => new RefreshTeamWidget())

    );

    @Effect()
    changeSearchText$ = this.actions$.pipe(ofType<Core.ChangeUserSearchText>(Core.CHANGE_USER_SEARCH_TEXT),
        map((action) => {
            return new Core.LoadTeamForMovement(action.token);
        }
        ));

    @Effect()
    changeIsAllDay$ = this.actions$.pipe(ofType<Core.ChangeIsAlldayEvent>(Core.CHANGE_IS_ALLDAY_EVENT),
        map((action) => {
            return new Core.LoadTeamForMovement(action.token);
        }
        ));

    @Effect()
    requestCalanderEvent$ = this.actions$.pipe(ofType<Core.GetCurrentUserMovementSuccess>(Core.GET_CURRENT_DATE_USER_MOVEMENT_SUCCESS),
        map((action) => {
            return new Core.GetUserEventList(action.token, action.userList);
        }
        ));

    // @Effect()
    // getCalanderEvent$ = this.actions$.pipe(ofType<Core.GetUserEventList>(Core.GET_USER_EVENT_LIST),
    //     switchMap(action => {
    //         let emails: string[] = [];
    //         action.teamMemberList.map(r => {
    //             emails = r.email;
    //         });

    //     }));
    //         return this.service.getSchedule(emails).pipe(
    //         map((responce) => new Core.GetUserEventListSuccess(action.token, { data: responce })),
    //         catchError((error) => of(new Core.GetUserEventListFail(action.token, error))));
    //         )


    @Effect()
    getCalanderEvent$ = this.actions$.pipe(ofType<Core.GetUserEventList>(Core.GET_USER_EVENT_LIST),
        filter(() => !this.isGoogle),
        switchMap((action) =>
            combineLatest(
                this.store.select(getUser),
                this.store.select(getCurrentDateRangeByToken(action.token)), ((user, currentDate) =>
                    ({ timeOffset: user.general.dateTimeOffset, currentDate, token: action.token, userList: action.teamMemberList }))).pipe(
                        take(1))
        ),
        switchMap(info => {
            const emails = info.userList ? info.userList.filter(a => a.userEmail !== '').map(x => x.userEmail) : null;
            const start = new Date(info.currentDate);
            start.setDate(start.getDate() - 1);
            const end = new Date(info.currentDate);
            end.setDate(end.getDate() + 2);
            return this.service.getSchedule(emails, start.toDpsString(), end.toDpsString()).pipe(
                map((responce) => {
                    return new Core.GetUserEventListSuccess(info.token, { data: responce, timeOffset: info.timeOffset });
                }),
                catchError((error) => of(new Core.GetUserEventListFail(info.token, error))));
        }));

    // @Effect()
    // LoadTeamForMovement$ = this.actions$.pipe(ofType<Core.LoadTeamForMovement>(Core.LOAD_TEAM_FOR_MOVEMENT),
    //     switchMap((action) =>
    //         this.store.select(getUserListByToken(action.token)).pipe(
    //             map((info) => ({ paraData: info, token: action.token })),
    //             take(1)),
    //     ),
    //     map((info) =>
    //         this.service.getTeamUsers(info.paraData).pipe(
    //             map((result) =>
    //                 new Core.LoadTeamForMovementSuccess(info.token, { teamMemberList: result })),
    //             catchError((error) => of(new Core.LoadTeamForMovementFail(info.token, error))));

    @Effect()
    LoadTeamForMovement$ = this.actions$.pipe(ofType<Core.LoadTeamForMovement>(Core.LOAD_TEAM_FOR_MOVEMENT),
        switchMap((action) =>
            this.store.select(getParaDataUserByToken(action.token)).pipe(
                map((paraData) => ({ paraData, token: action.token })),
                take(1))
        ),
        switchMap<any, Core.Any>((info) => {
            return this.service.getTeamUsers(info.paraData).pipe(
                map((result) =>
                    new Core.LoadTeamForMovementSuccess(info.token, { teamMemberList: result })),
                catchError((error) => of(new Core.LoadTeamForMovementFail(info.token, error))));
        }));
    @Effect()
    refreshMovementListInSerchMmber$ = this.actions$.pipe(ofType<Core.LoadTeamForMovementSuccess>(Core.LOAD_TEAM_FOR_MOVEMENT_SUCCESS),
        map((action) => {
            return new Core.RefreshUserMovementList(action.token);
        }));
    @Effect()
    loadTeamDepartmentList$ = this.actions$.pipe(ofType<Core.GetTeamMovementDepartmentList>(Core.TEAM_MOVEMENT_DEPARTMENT_LIST),
        switchMap((action) =>
            this.service.getDepartmentList().pipe(
                map((responce) => new Core.GetTeamMovementDepartmentListSuccess(action.token, { departmetList: responce })),
                catchError((error) => of(new Core.GetTeamMovementDepartmentListFail(action.token, error))))
        ));

    @Effect()
    getLocation$ = this.actions$.pipe(ofType<Core.GetMovementLocation>(Core.GET_MOVEMENT_LOCATION),
        switchMap((action) => this.service.getMovementLocation().pipe(
            map((result) => new Core.GetMovementLocationSuccess(action.token, result)),
            catchError((error) => of(new Core.GetMovementLocationFail(action.token, { error: error }))))
        ));
}
