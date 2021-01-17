import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TeamWidgetService } from '../services/team-widget';
import * as Core from '../actions/core';
import { map, switchMap, filter, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { getUser } from '../../auth';


@Injectable()
export class TeamWidgetEffect {
    constructor(private actions$: Actions,
        private store: Store<any>, private service: TeamWidgetService) { }

    @Effect()
    InitTeamWidget$ = this.actions$.pipe(ofType<Core.InitTeamWidget>(Core.INIT_TEAN_WIDGET),
        map(() => new Core.LoadActivitySummaryUserInTeamWidget()));

    @Effect()
    loadData$ = this.actions$.pipe(ofType<Core.LoadActivitySummaryUserInTeamWidget>(Core.LOAD_ACTIVITY_SUMMARY_YEAR_IN_TEAM_WIDGET),
        switchMap(() =>
            this.store.select(getUser).pipe(
                filter(user => !!(user && user.general)),
                take(1),
                map(user => user.general.user
                ), take(1)
            )),
        switchMap(user => this.service.getActivityYearByDepartment(user).pipe(
            map(data => new Core.LoadActivitySummaryYearInTeamWidgetSuccess(data)),
            catchError(() => of(new Core.LoadActivitySummaryYearInTeamWidgetFail()))
        ))
    );

    @Effect()
    refreshData$ = this.actions$.pipe(ofType<Core.RefreshTeamWidget>(Core.REFRESH),
        map(() => new Core.LoadActivitySummaryUserInTeamWidget()));

}




