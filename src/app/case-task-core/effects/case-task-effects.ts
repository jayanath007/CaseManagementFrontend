
import { catchError, map, filter, take, switchMap, tap } from 'rxjs/operators';
import {
    getCaseTaskByToken, getCaseTaskHashByToken, getCaseTaskGridDataByToken,
    getIsDataLoadedByToken
} from '../reducers';
import { CaseTaskRequest } from '../models/case-task-request';
import { combineLatest, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as CaseTaskCore from '../actions/core';
import { CaseTaskService } from '../services/case-task.service';
import { RequestToCompleteTask } from '../models/interface';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { DatePipe } from '@angular/common';

@Injectable()
export class CaseTaskEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: CaseTaskService,
        private datePipe: DatePipe) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<CaseTaskCore.InitCaseTask>(CaseTaskCore.INIT_CASE_TASK),
        // .do((data) => console.log('$initNewView', data))
        map((action) => new CaseTaskCore.LoadCaseTaskDataWithCurrentState(action.token)));


    @Effect()
    fileHistoryViewChange$ = this.actions$.pipe(ofType<CaseTaskCore.CaseTaskViewChange>(CaseTaskCore.CASE_TASK_CHANGE),
        map((action) => new CaseTaskCore.LoadCaseTaskDataWithCurrentState(action.token)));

    @Effect()
    caseTaskRefresh$ = this.actions$.pipe(ofType<CaseTaskCore.CaseTaskRefresh>(CaseTaskCore.CASE_TASK_REFRESH),
        tap((data) => {
            console.log('refresh ',
                CaseTaskCore.LOAD_CASE_TASK_GRID_DATA, ' ', data);
        }),
        switchMap((action) =>
            combineLatest(this.store.select(getCaseTaskByToken(action.token)),
                this.store.select(getCaseTaskHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    tap((data) => {
                        console.log('refresh ',
                            CaseTaskCore.LOAD_CASE_TASK_GRID_DATA, ' ', data);
                    }),
                    map((info) =>
                        new CaseTaskRequest({
                            SearchText: info.state ? info.state.searchText : '',
                            BranchId: info.state ? info.state.matterInfo.BranchId : null,
                            AppCode: info.state ? info.state.matterInfo.AppCode : '',
                            FileId: info.state ? info.state.matterInfo.FileId : null,
                        }, {
                            take: info.state.pageEvent.pageSize,
                            filter: toODataFilter(info.state.columnDef),
                            skip: getPaginatorSkip({
                                total: info.state.pageEvent.length,
                                currentPage: info.state.pageEvent.pageIndex,
                                itemPerPage: info.state.pageEvent.pageSize
                            }),
                            sort: toODataSort(info.state.columnDef)
                        }, info.hash)
                    ),
                    take(1),
                    map((request) => new CaseTaskCore.LoadCaseTaskGridData(action.token, request)))));



    @Effect()
    loadCurrentStateData$ = this.actions$
        .pipe(ofType<CaseTaskCore.LoadCaseTaskDataWithCurrentState>(CaseTaskCore.LOAD_CASE_TASK_DATA_WITH_CURRENT_STATE),
            switchMap<CaseTaskCore.LoadCaseTaskDataWithCurrentState, { hasHash: boolean, token: string }>((action) =>
                this.store.select(getIsDataLoadedByToken(action.token)).pipe(
                    map(hasHash => ({ token: action.token, hasHash: hasHash })), take(1),
                    tap((data) => {
                        console.log('hasHash', data);
                    }))
            ),
            filter((info) => !info.hasHash),
            switchMap((action) =>
                combineLatest(this.store.select(getCaseTaskByToken(action.token)),
                    this.store.select(getCaseTaskHashByToken(action.token)),
                    (state, hash) => ({ state, hash })).pipe(
                        tap((data) => {
                            console.log('CaseTaskCore  getCaseTaskHashByToken',
                                CaseTaskCore.LOAD_CASE_TASK_GRID_DATA, ' ', data);
                        }),
                        map((info) =>
                            new CaseTaskRequest({
                                SearchText: info.state ? info.state.searchText : '',
                                BranchId: info.state ? info.state.matterInfo.BranchId : null,
                                AppCode: info.state ? info.state.matterInfo.AppCode : '',
                                FileId: info.state ? info.state.matterInfo.FileId : null,
                            }, {
                                take: info.state.pageEvent.pageSize,
                                filter: toODataFilter(info.state.columnDef),
                                skip: getPaginatorSkip({
                                    total: info.state.pageEvent.length,
                                    currentPage: info.state.pageEvent.pageIndex,
                                    itemPerPage: info.state.pageEvent.pageSize
                                }),
                                sort: toODataSort(info.state.columnDef)
                            }, info.hash)
                        ),
                        take(1),
                        map((request) => new CaseTaskCore.LoadCaseTaskGridData(action.token, request))),
            ));

    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<CaseTaskCore.LoadCaseTaskGridData>(CaseTaskCore.LOAD_CASE_TASK_GRID_DATA),
        switchMap((action) =>
            this.service.getCaseTaskData(action.request).pipe(
                map((result) => new CaseTaskCore
                    .LoadCaseTaskGridDataSuccess(action.token, { response: result, request: action.request })),
                catchError((error) => of(new CaseTaskCore.LoadCaseTaskGridDataFail(action.token, error))))
        ));


    // @Effect()
    // fileHistoryGridRowChange$ = this.actions$.ofType<CaseTaskCore.CaseTaskGridRowChange>(CaseTaskCore.CASE_TASK_GRID_ROW_CHANGE)
    //     .filter((action) => !action.payload.row.isExpand);
    // // .map((action) => new CaseTaskCore.LoadDocumentURL(action.token, new DocumentURLRequest(action.payload.row)));


    @Effect()
    CheckIsEnableTimeRecords$ = this.actions$.pipe(ofType<CaseTaskCore.RequestToComplete>(CaseTaskCore.CASE_TASK_REQUEST_TO_COMPLETE),
        map(action => {
            if (!action.payload.row.checkTREnable) {
                return new CaseTaskCore.CheckTREnabaleCase(action.token, { row: action.payload.row });
            } else {
                return new CaseTaskCore.CheckTREnabaleSuccessCase(action.token, {
                    row: action.payload.row, isEnable: action.payload.row.isTimeRecordingEnabled
                });
            }
        }));


    @Effect()
    GetIsTimeEnable$ = this.actions$.pipe(ofType<CaseTaskCore.CheckTREnabaleCase>(CaseTaskCore.CASE_TASK_CHECK_TIME_RECORDED_ENABLE),
        switchMap(action => {
            return this.service.isTimeRecordingEnabled(action.payload.row.matterReferenceNo).pipe(
                map((response) =>
                    new CaseTaskCore.CheckTREnabaleSuccessCase(action.token,
                        { row: action.payload.row, isEnable: response })),
                catchError(error => of(new CaseTaskCore.CheckTREnabaleFailCase(action.token, error))));
        }));

    @Effect()
    CompleteTask$ = this.actions$.pipe(ofType<CaseTaskCore.CompleteTaskCase>(CaseTaskCore.CASE_TASK_COMPLETE_TASK),
        switchMap(action => {
            return this.service.completeTask(action.payload.request).pipe(
                map((response) =>
                    new CaseTaskCore.CompleteTaskSuccessCase(action.token)),
                catchError(error => of(new CaseTaskCore.CompleteTaskFailCase(action.token, error))));

        }));

    @Effect()
    CompmleteTaskRquest$ = this.actions$
        .pipe(ofType<CaseTaskCore.CheckTREnabaleSuccessCase>(CaseTaskCore.CASE_TASK_CHECK_TIME_RECORDED_ENABLE_SUCCESS),
            map(action => {
                if (action.payload.isEnable) {
                    return new CaseTaskCore.CompleteTaskRequest(action.token, { row: action.payload.row });
                } else {
                    const msgModel = {
                        isShow: true,
                        msg: `Current Spitfire version doesn't support this action on this matter.`
                    };

                    return new CaseTaskCore.ShowMsg(action.token, { msgModel: msgModel });
                }
            }));

    @Effect()
    RequestToCompleteTask$ = this.actions$.pipe(ofType<CaseTaskCore.CompleteTaskRequest>(CaseTaskCore.CASE_TASK_COMPLETE_TASK_REQUEST),
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
                },
                action.token
            )
        ), map(request => new CaseTaskCore.CompleteTaskCase(request.token, { request: request })));

    @Effect()
    ReloadData$ = this.actions$.pipe(ofType<CaseTaskCore.CompleteTaskSuccessCase>(CaseTaskCore.CASE_TASK_COMPLETE_TASK_SUCCESS),
        map((action) => new CaseTaskCore.CaseTaskRefresh(action.token)));
}







