
import { switchMap, catchError, map } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { of } from 'rxjs';
import { TETimeRecordedWidgetService } from '../services/te-time-recorded-widget-services';
import { getTFBarChartWidgetRequestData } from '../reducers';
@Injectable()
export class MatterWidgetEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: TETimeRecordedWidgetService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitTETimeRecordedWidget>(Core.INIT_TE_TIME_RECORDED_WIDGET),
        map(action =>
            new Core.LoadData()
        ));

    @Effect()
    lnitial$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap(action =>
            this.store.select(getTFBarChartWidgetRequestData()).pipe(
                map(requsetData => (requsetData)))
        ), switchMap(request =>
            this.service.getTimeRecordedData(request).pipe(
                map(result => new Core.LoadDataSuccess({ data: result })),
                catchError((error) => of(new Core.LoadDataFail())))
        ));

    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.RefreshTRChartWidgetData>(Core.REFRESH_TR_CHART_WIGET_DATA_FAIL),
        map(action =>
            new Core.LoadData()
        ));
}
