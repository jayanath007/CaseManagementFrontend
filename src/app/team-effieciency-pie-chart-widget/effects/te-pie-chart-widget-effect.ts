
import { take, map, catchError, switchMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { of } from 'rxjs';
import { TEPieChartWidgetService } from '../services/te-pie-chart-widget-services';
import { getTFPieChartWidgetRequestData } from '../reducers';
@Injectable()
export class TEPieChartEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: TEPieChartWidgetService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitTEPieChartWidget>(Core.INIT_TE_PIECHART_WIDGET),
        map(action =>
            new Core.LoadData()
        ));

    @Effect()
    lnitial$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap(action =>
            this.store.select(getTFPieChartWidgetRequestData()).pipe(
                map(requsetData => (requsetData)),
                take(1))
        ), switchMap(request =>
            this.service.getAgedDebtorsdData(request).pipe(
                map(result => new Core.LoadDataSuccess({ data: result })),
                catchError((error) => of(new Core.LoadDataFail())))
        ));

    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.RefreshTEPieChartData>(Core.REFRESH_TE_PIE_CHART_DATA),
        map(action =>
            new Core.LoadData()
        ));
}
