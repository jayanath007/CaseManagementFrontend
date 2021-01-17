import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as ActionsWidget from '../actions/core';
import { mergeMap, switchMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ActionWidgetService } from '../services/action-widget-service';
import { DatePipe } from '@angular/common';

@Injectable()
export class ActionsWidgetEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: ActionWidgetService,
        private datePipe: DatePipe
    ) { }

    @Effect()
    initewWidget$ = this.actions$.pipe(ofType<ActionsWidget.InitActionsWidget>(ActionsWidget.INIT_ACTIONS_WIDGET_MONITOR),
        mergeMap(action => from([
            new ActionsWidget.LoadBundleData()
        ])
        ));

    // @Effect()
    // loadDataBMData$ = this.actions$.pipe(ofType<ActionsWidget.LoadBundleData>(ActionsWidget.LOAD_DATA_BUNDLE_DATA),
    //     switchMap(() => {
    //         const itemFor: Date = new Date('1901/01/01');
    //         return this.service.getBundleMonitorList(this.datePipe.transform(itemFor.toString(), 'yyyy-MM-dd'), 0).pipe(
    //             map((result) => new ActionsWidget.LoadBundleDataSuccess(result)),
    //             catchError((error) => of(new ActionsWidget.LoadBundleDataFail())));
    //     }));

}
