
import { catchError, map, switchMap, mergeMap, filter, take } from 'rxjs/operators';
import { MyTaskWidgetService } from '../services/my-task-widget-services';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { of, from } from 'rxjs';
import { DataRequest, RequestToCompleteTask } from '../models/request';
import { DatePipe } from '@angular/common';
import { RefreshWorkDoneWidget } from '../../work-done-widget/actions/core';
import { getUser } from '../../auth';
@Injectable()
export class MyTaskWidgetEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private service: MyTaskWidgetService,
        private datePipe: DatePipe,
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitMyTaskWidget>(Core.INIT_MY_TASK_WIDGET),
        map(action =>
            new Core.RequestData()
        ));

    @Effect()
    requestData$ = this.actions$.pipe(ofType<Core.RequestData>(Core.REQUEST_DATA),
        switchMap(() =>
            this.store.select(getUser).pipe(
                filter(user => !!(user && user.general)),
                take(1),
                map((user) =>
                    new DataRequest(
                        {
                            take: 4,
                            filter: null,
                            skip: 0,
                            sort: null
                        },
                        {
                            user: user.general.user,
                            departmentId: -1,
                            searchText: null,
                        }
                    )
                ), map(request => new Core.LoadData(request)))));

    @Effect()
    lnitial$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap(action =>
            this.service.loadMyTaskData(action.request).pipe(
                map((result) => new Core.LoadDataSuccess({ dataObj: result })),
                catchError((error) => of(new Core.LoadDataFail())))
        ));

    @Effect()
    RequestToCompleteTask$ = this.actions$.pipe(ofType<Core.CompleteTaskRequest>(Core.COMPLETE_TASK_REQUEST),
        map(action =>
            new RequestToCompleteTask(
                {
                    taskFor: action.payload.row.taskFor,
                    client: action.payload.row.client,
                    matterReferenceNo: action.payload.row.matterReferenceNo,
                    matterDetails: action.payload.row.matterDetails,
                    columnFolderId: action.payload.row.columnFolderId,
                    workflowActions: 'Complete',
                    note: action.payload.row.note,
                    dateBy: this.datePipe.transform(action.payload.row.dateBy, 'yyyy-MM-dd HH:mm'),
                    // taskID: action.payload.row.taskID,
                    putOnBy: action.payload.row.putOnBy,
                    appCode: action.payload.row.appCode,
                    appID: action.payload.row.appID,
                    fileID: action.payload.row.fileID,
                    date: action.payload.row.date,
                    branchID: action.payload.row.branchID,
                    diaryId: action.payload.row.taskID
                }
            )
        ), map(request => new Core.CompleteTask({ request: request })));


    @Effect()
    CompleteTask$ = this.actions$.pipe(ofType<Core.CompleteTask>(Core.COPMLETE_TASK),
        switchMap(action => {
            return this.service.completeTask(action.payload.request).pipe(
                map(response =>
                    new Core.CompleteTaskSuccess()),
                catchError(error => of(new Core.CompleteTaskFail())));

        }));

    @Effect()
    AffterCompleteTask$ = this.actions$.pipe(ofType<Core.CompleteTask>(Core.COMPLETE_TASK_SUCCESS),
        mergeMap(action => {
            return from([new Core.RequestData(),
            new RefreshWorkDoneWidget]);
        }));


    @Effect()
    Refresh$ = this.actions$.pipe(ofType<Core.RefreshMyTaskWidget>(Core.REFRESH_DATA),
        map(action => new Core.RequestData()));
}


