
import { catchError, take, map, switchMap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { TeamMemberService } from '../services/team-member.service';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import * as TeamMember from '../actions/team-member';
import { getParaDataByToken } from '../reducers';



@Injectable()
export class TeamMembersEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: TeamMemberService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<TeamMember.InitTeamMember>(TeamMember.INIT_TEAM_MEMBER),
        switchMap(action =>
            this.store.select(getParaDataByToken(action.token)).pipe(
                map((paraData) => ({ paraData, token: action.token })),
                take(1))
        ),
        switchMap((info) => {
            return this.service.getTeamMembers(info.paraData).pipe(
                map((result) =>
                    new TeamMember.GetLogingUser(info.token, { TeamMembersData: result })),
                catchError((error) => of(new TeamMember.LoadTeamMemberFail(info.token, error))));
        }));


    @Effect()
    changeDepartmentOrFeeEranerState$ =
        this.actions$.pipe(ofType<TeamMember.ChangeDepartmentOrFeeEranerState>(TeamMember.UPDATE_DEPARTMENT),
            map((action) =>
                new TeamMember.LoadTeamMemberList(action.token)
            ));
    @Effect()
    changeSerchKeyWord$ = this.actions$.pipe(ofType<TeamMember.ChangeTeamMemberSearchKey>(TeamMember.UPDATE_SEARCH_KEY),
        map((action) =>
            new TeamMember.LoadTeamMemberList(action.token)
        ));


    @Effect()
    LoadTeamMemberList$ = this.actions$.pipe(ofType<TeamMember.LoadTeamMemberList>(TeamMember.LOAD_TEAM_MEMBER),
        switchMap((action: TeamMember.LoadTeamMemberList) =>
            this.store.select(getParaDataByToken(action.token)).pipe(
                map((paraData) => ({ paraData, token: action.token })),
                take(1))
        ),
        switchMap<any, TeamMember.Any>((info) => {

            if (info.paraData.departmentId) {
                return this.service.getTeamMembers(info.paraData).pipe(
                    map((result) =>
                        new TeamMember.LoadTeamMemberSuccess(info.token, { TeamMembersData: result })),
                    catchError((error) => of(new TeamMember.LoadTeamMemberFail(info.token, error))));
            } else {
                return this.service.getTeamMembers(info.paraData).pipe(
                    map((result) =>
                        new TeamMember.GetLogingUser(info.token, { TeamMembersData: result })),
                    catchError((error) => of(new TeamMember.LoadTeamMemberFail(info.token, error))));
            }
        }));

}
