
import {observeOn, catchError, switchMap, last, tap, mergeMap, filter, map, take, share} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { Store } from '@ngrx/store';
import { WorkflowSessionManagerService } from '../../workflow-desktop';
import {  empty ,  of ,  merge } from 'rxjs';
import { CreateWorkflowSession, CREATE_WORKFLOW_SESSION } from '../../core';
import * as Core from '../../core/lib/actions';
import { FileLogicStatus } from '../../workflow-core';
import { async } from 'rxjs/internal/scheduler/async';




@Injectable()
export class WorkflowSessionEffects {
    constructor(private actions$: Actions, private store: Store<any>, private sessionManager: WorkflowSessionManagerService) { }

    @Effect()
    createWorkflowSession = this.actions$.pipe(ofType<CreateWorkflowSession>(CREATE_WORKFLOW_SESSION),
        tap((action) => {
            this.sessionManager.createFileSession(
                action.appId,
                action.fileId,
                action.branchId,
                action.injector,
                action.token
            );
        }),
        mergeMap((action) =>
            this.sessionManager
                .getSession(action.appId, action.fileId, action.branchId).pipe(
                filter((session) => !!session),
                map((session =>
                    ({ session: session, action: action }))),
                take(1),)
        ),
        mergeMap(info =>
            info.session.entryLogicStatus.pipe(map((status) => ({ ...info, logicStatus: status })))
        ),
        filter(info => info.logicStatus === FileLogicStatus.NotStarted),
        // .filter(() => false)
        mergeMap(info => {
            const run = info.session.runEntryLogic().pipe(share());
            const status = info.session.entryLogicStatus.pipe(
                map((st) => new Core.FileLogicStatsChange('ENTRY', info.action.appId, info.action.fileId,
                    info.action.branchId, st, info.action.token))).pipe(
                observeOn(async));
            const complete = run.pipe(last(),switchMap(() => empty()),catchError(() => empty()),);
            return merge(status, complete);
        }),);

}

