
import { catchError, take, switchMap, map, filter } from 'rxjs/operators';


import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { getRequestParam, getGridItems } from '../reducers';
import { BundleMonitorService } from '../services/bundle-monitor-service';
import { DatePipe } from '@angular/common';
import { of, combineLatest } from 'rxjs';
import { FileUrlResolverService } from '../../document-view';
import { getUser } from '../../auth';
import { dpsNewDate } from '../../utils/javascriptDate';



@Injectable()

export class BundleMonitorEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: BundleMonitorService,
        private datePipe: DatePipe, private fileUrlResolver: FileUrlResolverService) {

    }

    @Effect()
    initBundleMonitor$ = this.actions$.pipe(ofType<Core.InitBundleMonitor>(Core.INIT_BUNDLE_MONITOR),
        map(action => new Core.LoadData(action.token)));

    @Effect()
    loadData$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap((action) =>
            combineLatest(
                this.store.select(getUser),
                this.store.select(getRequestParam(action.token)), ((user, request) => ({ user, request, token: action.token }))).pipe(
                    take(1))
        ), switchMap(info => {
            let itemFor: Date = new Date('1901/01/01');
            if (info.request.itemFor !== '*') {
                itemFor = dpsNewDate(info.user.general.dateTimeOffset);
                itemFor.setDate(itemFor.getDate() - parseInt(info.request.itemFor.toString(), 0));
            }
            return this.service.getBundleMonitorList(this.datePipe.transform(itemFor.toString(), 'yyyy-MM-dd'), info.request.bundleId).pipe(
                map((result) => new Core.LoadDataSuccess(info.token, result)),
                catchError((error) => of(new Core.LoadDataFail(info.token))));
        }));

    @Effect()
    changeItemFor$ = this.actions$.pipe(ofType<Core.SelectItem>(Core.SELECT_ITEM),
        map(action => new Core.LoadData(action.token)));

    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.Refresh>(Core.REFRESH),
        map(action => new Core.LoadData(action.token)));

    @Effect()
    searchBundle$ = this.actions$.pipe(ofType<Core.ChangeSearchBundleId>(Core.CHANGE_SEARCH_BUNDLE_ID),
        map(action => new Core.LoadData(action.token)));

    @Effect()
    getLogFile$ = this.actions$.pipe(ofType<Core.GetLogFile>(Core.GET_LOG_FILE),
        switchMap(action =>
            this.fileUrlResolver.getBundleViewLogFileUrl(action.bundleId).pipe(
                map(url => new Core.GetLogFileSuccess(action.token, url)),
                catchError(() => of(new Core.GetLogFileFail(action.token))))
        ));
    @Effect()
    deleteRow$ = this.actions$.pipe(ofType<Core.DeleteRows>(Core.DELETE_ROWS),
        switchMap(action => this.store.select(getGridItems(action.token))
            .pipe(
                take(1),
                map(items => ({ ids: items.filter(item => item.selected).map(item => item.pbH_BundleID), token: action.token })),
                filter(({ ids }) => ids.length > 0)
            )
        ),
        switchMap(({ ids, token }) => this.service.deleteInactiveBundles(ids)
            .pipe(
                map(data => new Core.Refresh(token)),
                catchError((error) => of(new Core.Refresh(token))
                )
            )
        )
    );
}

