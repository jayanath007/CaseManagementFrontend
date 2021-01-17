
import { first, switchMap, tap, take, map, filter, share, last, catchError } from 'rxjs/operators';
import { getOpenCaseMatterInfoByToken } from '../../open-case-core/reducers';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { WorkflowSessionManagerService } from '../../workflow-desktop';
import * as CoreActions from '../../workflow-menu-core/actions/core';







import { EMPTY as empty, of, merge } from 'rxjs';
import { getGeneralAllMenueItems } from '../../layout-desktop';


@Injectable()
export class WorkflowSessionEffects {
    constructor(private actions$: Actions, private store: Store<any>, private sessionManager: WorkflowSessionManagerService) { }

    @Effect()
    handleMenuActions = this.actions$.pipe(ofType<CoreActions.RunWorkflowCommand>(CoreActions.RUN_WORKFLOW_COMMAND),
        switchMap((action) =>
            // this.store.select(getMenuMatterInfoByToken(action.token))
            this.store.select(getOpenCaseMatterInfoByToken(action.token)).pipe(
                take(1),
                map((info) => ({
                    itemData: action.menuInfo,
                    matterInfo: info,
                    appId: info.appID,
                    fileId: info.fileID,
                    branchId: info.branchID,
                    injector: action.injector,
                    token: action.token,
                    formLibraryTemplateInfo: action.formLibraryTemplateInfo
                })
                ))
        ),
        tap((info) =>
            this.sessionManager.createFileSession(
                info.appId,
                info.fileId,
                info.branchId,
                info.injector,
                info.token
            )
        ),
        switchMap((info) =>
            this.sessionManager.getSession(
                info.appId,
                info.fileId,
                info.branchId).pipe(filter((session) => !!session), map((session =>
                    ({
                        session: session,
                        menuInfo: info.itemData.data,
                        token: info.token,
                        matterInfo: info.matterInfo,
                        formLibraryTemplateInfo: info.formLibraryTemplateInfo
                    }))),
                    take(1))
        ),
        switchMap(info => this.store.select(getGeneralAllMenueItems).pipe(take(1), map(menueItems => ({ menueItems, info })))),
        switchMap(({ menueItems, info }) => {
            let title = 'Linked Matter';
            const menue = menueItems.find(val => val.id === 'matter_creation');
            if (menue) {
                title = 'Linked ' + menue.label;
            }
            const run = info.session.runWorkflowCommand(info.menuInfo, title, info.matterInfo, info.formLibraryTemplateInfo).pipe(share());
            const init = run.pipe(first(), map(() => new CoreActions.WorkflowSessionReady(info.token, info.menuInfo)));
            const complete = run.pipe(last(), map(() => new CoreActions.WorkflowSessionCompleted(info.token, info.menuInfo)));
            return merge(init, complete).pipe(
                catchError((error) => of(new CoreActions.WorkflowSessionFailed(info.token, info.menuInfo, error))));
        }),
        tap((action) => console.log('run workflow', action)));





    @Effect()
    runWorkflowCommandByIds$ = this.actions$.pipe(ofType<CoreActions.RunWorkflowCommandByIds>(CoreActions.RUN_WORKFLOW_COMMAND_BY_IDS),
        switchMap(data => this.store.select(getGeneralAllMenueItems).pipe(take(1), map(menueItems => ({ menueItems, data })))),
        map(({ menueItems, data }) => {
            let title = 'Linked Matter';
            const menue = menueItems.find(val => val.id === 'matter_creation');
            if (menue) {
                title = 'Linked ' + menue.label;
            }
            return {
                itemData: data.payload.menuInfo,
                matterInfo: data,
                appId: data.payload.appID,
                fileId: data.payload.fileID,
                branchId: data.payload.branchID,
                injector: data.injector,
                token: data.token,
                title
            };
        }
        ), tap((info) =>
            this.sessionManager.createFileSession(
                info.appId,
                info.fileId,
                info.branchId,
                info.injector,
                info.token
            )
        ),
        switchMap((info) =>
            this.sessionManager.getSession(
                info.appId,
                info.fileId,
                info.branchId).pipe(filter((session) => !!session), map((session =>
                    ({ session: session, menuInfo: info.itemData.data, token: info.token, title: info.title }))),
                    take(1))
        ),
        switchMap(info => {
            const run = info.session.runWorkflowCommand(info.menuInfo, info.title).pipe(share());
            const init = run.pipe(first(), map(() => new CoreActions.WorkflowSessionReady(info.token, info.menuInfo)));
            const complete = run.pipe(last(), map(() => new CoreActions.WorkflowSessionCompleted(info.token, info.menuInfo)));
            return merge(init, complete).pipe(
                catchError((error) => of(new CoreActions.WorkflowSessionFailed(info.token, info.menuInfo, error))));
        }),
        tap((action) => console.log('run workflow', action)));



}

