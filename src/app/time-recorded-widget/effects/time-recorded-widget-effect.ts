
import { take, switchMap, catchError, map, tap } from 'rxjs/operators';

import { combineLatest, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { DataRequest } from '../models/request';
import { DatePipe } from '@angular/common';
import { TimeRecordedWidgetService } from '../services/time-recorded-widget-services';
import { getTimeRecordedWidgetFromToDate } from '../reducers';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MainMenuService } from '../../layout-desktop';
@Injectable()
export class TimeRecordedWidgetEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: TimeRecordedWidgetService,
        private datePipe: DatePipe,
        private mainMenuService: MainMenuService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitTimeRecordedWidget>(Core.INIT_TIME_RECORDED_WIDGET),
        map(action =>
            new Core.LoadFromToDate()
        ));

    @Effect()
    LoadFromDate$ = this.actions$.pipe(ofType<Core.LoadFromToDate>(Core.LOAD_FROM_TO_DATE),
        switchMap(action => {
            return this.service.getFromToDate(null).pipe(
                map((response) =>
                    new Core.LoadFromToDateSuccess({ dates: response })),
                catchError(error => of(new Core.LoadFromToDateFail())));
        }));

    @Effect()
    successFromToDate$ = this.actions$.pipe(ofType<Core.LoadFromToDateSuccess>(Core.LOAD_FROM_TO_DATE_SUCCESS),
        map(action =>
            new Core.RequestData()
        ));

    @Effect()
    RequestDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestData>(Core.REQUEST_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getTimeRecordedWidgetFromToDate()),
                ((fromToDate) => ({ fromToDate }))
            ).pipe(take(1),
                map((info) =>
                    new DataRequest(
                        {
                            take: 4,
                            filter: null,
                            skip: 0,
                            sort: null
                        },
                        {
                            dateFrom: this.datePipe.transform(info.fromToDate.fromDate, 'yyyy-MM-ddTHH:mm:ss'),
                            dateTo: this.datePipe.transform(info.fromToDate.toDate, 'yyyy-MM-ddTHH:mm:ss'),
                            user: null,
                            type: 1,
                            departmentId: null,
                            searchText: null,
                        }
                    )
                ), map((request) => new Core.LoadData(request)))
        ));

    @Effect()
    getData$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap(action =>
            this.service.loadWorkDoneData(action.request).pipe(
                map((result) => new Core.LoadDataSuccess({ dataObj: result })),
                catchError((error) => of(new Core.LoadDataFail())))
        ));

    @Effect()
    Refresh$ = this.actions$.pipe(ofType<Core.RefreshTimeRecordedWidget>(Core.REFRESH_TIME_RECORDED_EIDGET_DATA),
        map(action => new Core.RequestData()));

    @Effect({ dispatch: false })
    goToOpenCase$ = this.actions$.pipe(ofType<Core.GoToOpenCase>(Core.GO_TO_OPEN_CASE),
        switchMap((action) =>
            this.service.getMatterInfoByCaseIdentity(action.matter).pipe(tap(infor => {
                const materData: GridRowItemWrapper = {
                    data: {
                        appID: action.matter.appID,
                        fileID: action.matter.fileId || action.matter.fileNumber,
                        app_Code: action.matter.appCode,
                        branchID: action.matter.branchID,
                        feeEarner: action.matter.by,
                        reviewDate: action.matter.dateDone,
                        clientName: action.matter.client,
                        reviewNote: action.matter.note,
                        company_Name: '',
                        matterDetails: action.matter.details,
                        matterReferenceNo: action.matter.matterReferenceNo,
                        matterCounter: action.matter.matterCounter,
                        ufnValue: action.matter.ufnValue,
                        eBilling: action.matter.eBilling,
                        isPlotMatter: infor.isPlotMatter,
                        isPlotMasterMatter: infor.isPlotMasterMatter,
                        isProspectMatter: action.matter.isProspectMatter,
                        isLegalAid: action.matter.isLegalAid
                    }
                };
                this.mainMenuService.gotoOpenCase(materData);
            }))
        ));
}


