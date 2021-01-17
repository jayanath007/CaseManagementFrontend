
import { catchError, tap, map, mergeMap, take, filter, switchMap } from 'rxjs/operators';
import {
    getTaskByToken, getTaskHashByToken, getTaskGridDataByToken,
    getIsDataLoadedByToken
} from '../reducers';
import { TaskRequest } from '../models/task-core-request';
import { combineLatest, of, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import * as TaskCore from '../actions/core';
import { TaskService } from '../services/task-core.service';
import { Task } from '../models/interface';
import { INIT_TASK_CORE, InitTask } from '../actions/core';


@Injectable()
export class TaskEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: TaskService) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<TaskCore.InitTask>(TaskCore.INIT_TASK_CORE),
        tap((data) => console.log('$initNewView', data)),
        map((action) => new TaskCore.LoadTaskDataWithCurrentState(action.token)));


    @Effect()
    TaskViewChange$ = this.actions$.pipe(ofType<TaskCore.TaskViewChange>(TaskCore.TASK_CORE_CHANGE),
        map((action) => new TaskCore.LoadTaskDataWithCurrentState(action.token)));


    @Effect()
    loadCurrentStateData$ = this.actions$.pipe(ofType<TaskCore.LoadTaskDataWithCurrentState>
        (TaskCore.LOAD_TASK_CORE_DATA_WITH_CURRENT_STATE),
            switchMap<TaskCore.LoadTaskDataWithCurrentState, { hasHash: boolean, token: string }>((action) =>
                this.store.select(getIsDataLoadedByToken(action.token)).pipe(
                    map(hasHash => ({ token: action.token, hasHash: hasHash })), take(1))
            ),
            filter((info) => !info.hasHash)).pipe(
                tap((data) => {
                    console.log('Effect excute', TaskCore.LOAD_TASK_CORE_GRID_DATA, ' ', data);
                }),
                mergeMap((action) =>
                    combineLatest(this.store.select(getTaskByToken(action.token)),
                        this.store.select(getTaskHashByToken(action.token)),
                        (state, hash) => ({ state, hash })).pipe(
                            map((info) =>
                                new TaskRequest({
                                    BranchId: info.state ? info.state.matterInfo.BranchId : null,
                                    AppCode: info.state ? info.state.matterInfo.AppCode : '',
                                    FileId: info.state ? info.state.matterInfo.FileId : null,
                                }, {
                                        Take: 0,
                                        Filter: null,
                                        Skip: 0,
                                    },
                                    info.hash)
                            ),
                            take(1),
                            map((request) => new TaskCore.LoadTaskGridData(action.token, request))),
                ));

    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<TaskCore.LoadTaskGridData>
        (TaskCore.LOAD_TASK_CORE_GRID_DATA),
            switchMap((action) =>
                this.service.getTask(action.request).pipe(
                    // tslint:disable-next-line:max-line-length
                    map((result) => new TaskCore
                        .LoadTaskGridDataSuccess(action.token, { response: result, request: action.request })),
                    catchError((error) => of(new TaskCore.LoadTaskGridDataFail(action.token, error))))
            ));


}






