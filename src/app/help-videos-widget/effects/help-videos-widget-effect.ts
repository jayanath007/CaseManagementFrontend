import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HelpVideosWidgetService } from '../services/help-videos-widget';
import * as Core from '../actions/core';
import { map, switchMap, filter, take, catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable()
export class HelpVideosWidgetEffect {
    constructor(private actions$: Actions,
        private store: Store<any>, private service: HelpVideosWidgetService) { }

    @Effect()
    InitTeamWidget$ = this.actions$.pipe(ofType<Core.InitHelpVideoWidget>(Core.INIT_HELP_VIDEO_WIDGET),
        map(() => new Core.LoadCountrySideUrlsWidget()));

    @Effect()
    loadData$ = this.actions$.pipe(ofType<Core.LoadCountrySideUrlsWidget>(Core.LOAD_COUNTRY_SIDE_URLS_WIDGET),

        switchMap(user => this.service.getCountrySideUrlsWidget().pipe(
            map(data => new Core.LoadCountrySideUrlsWidgetSuccess(data)),
            catchError(() => of(new Core.LoadCountrySideUrlsWidgetFail()))
        ))
    );

    @Effect()
    refreshData$ = this.actions$.pipe(ofType<Core.RefreshTeamWidget>(Core.REFRESH),
        map(() => new Core.LoadCountrySideUrlsWidget()));

}




