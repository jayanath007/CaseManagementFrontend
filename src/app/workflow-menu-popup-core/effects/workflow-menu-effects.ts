
import {map, catchError, switchMap, take, mergeMap} from 'rxjs/operators';
import { WorkflowMenuPopupService } from '../services/workflowMenuPopup.service';
import { MatterSearchGridData } from '../../core/lib/matter';
import { getMenuMatterInfoByToken } from '../reducers';
import { of ,  from ,  combineLatest } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { getPopupMenuTreeViewByToken } from '..';

@Injectable()
export class WorkflowMenuPopupEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: WorkflowMenuPopupService) {
    }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitWorkFlowMenu>(Core.INIT_WORKFLOW_MENU),
        mergeMap(action =>
            this.store.select(getPopupMenuTreeViewByToken(action.token)).pipe(
                map(data => ({ data, action: action })),
                take(1),
                mergeMap<any, any>(info => {
                    if (!info.data) {
                        return from([new Core.LoadMenuList(info.action.token, { inputData: info.action.payload.inputData })]);
                    } else {
                        return from([new Core.AllDataUpdate(info.action.token)]);
                    }
                }
                ),)));

    @Effect()
    initWorkflowMenuData$ = this.actions$.pipe(ofType<Core.LoadMenuList>(Core.LOAD_WORKFLOW_MENU_LIST),
        switchMap(action =>
            this.service.getMenuList(action.payload.inputData.appId, action.payload.inputData.fileId, action.payload.inputData.branchId).pipe(
                map((result) => new Core.LoadMenuListSuccess(action.token, { menuList: result.data })),
                catchError((error) => of(new Core.LoadMenuListFail(action.token, error))),)
        ));
}


