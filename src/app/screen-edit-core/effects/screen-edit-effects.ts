import { take, catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ScreenEditService } from '../services/screen-edit-service';
import * as core from '../actions/screen-edit';
import { from, of, combineLatest } from 'rxjs';
import {
    getIsInitByToken, getScreenEditRuleListData
} from '../reducers';
import { GetMenuItem } from './../../layout-desktop/actions/main-menu';

@Injectable()
export class ScreenEditEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: ScreenEditService) { }

    @Effect()
    initScreenEditData$ = this.actions$.pipe(ofType<core.InitScreenEdit>(core.INIT_SCREEN_EDIT),
        switchMap(action =>
            combineLatest(
                this.store.select(getIsInitByToken(action.token)),
                this.store.select(getScreenEditRuleListData),
                ((isInit, ruleList) => ({ isInit: isInit, ruleList: ruleList, action: action }))
            ).pipe(take(1))),
        mergeMap(({ isInit, ruleList, action }) => {
            const actionList = [];
            if (isInit) {
                actionList.push(new core.LoadScreenEditComponentList(action.token, { type: action.payload.type }));
            }
            if (!ruleList || ruleList.length < 1) {
                actionList.push(new core.LoadScreenEditRuleList(action.token));
            }
            return from(actionList);
        }));

    @Effect()
    loadScreenEditRuleListData$ = this.actions$.pipe(ofType<core.LoadScreenEditRuleList>(core.LOAD_SCREEN_EDIT_RULE_LIST),
        switchMap((action) =>
            this.service.getRuleTypeList().pipe(
                map((result) => new core.LoadScreenEditRuleListSuccess(action.token, { response: result })),
                catchError((error) => of(new core.LoadScreenEditRuleListFail(action.token, error))))
        ));

    @Effect()
    loadScreenEditComponentListData$ = this.actions$.pipe(ofType<core.LoadScreenEditComponentList>(core.LOAD_SCREEN_EDIT_COMPONENT_LIST),
        switchMap((action) =>
            this.service.getComponentTree(action.payload.type).pipe(
                map((result) => new core.LoadScreenEditComponentListSuccess(action.token, { response: result })),
                catchError((error) => of(new core.LoadScreenEditComponentListFail(action.token, error))))
        ));

    @Effect()
    submitData$ = this.actions$.pipe(ofType<core.SubmitScreenEdit>(core.SCREEN_EDIT_SUBMIT),
        switchMap((action) => {
            return this.service.updateData(action.payload.updatedData).pipe(
                map((respone) => new core.SubmitScreenEditSuccess(action.token,
                    { treeData: action.payload.treeData })),
                catchError(error => of(new core.SubmitScreenEditFail(action.token, error))));
        }));

    @Effect()
    getMenuItem$ = this.actions$.pipe(ofType<core.SubmitScreenEditSuccess>(core.SCREEN_EDIT_SUBMIT_SUCCESS),
        map(action => new GetMenuItem())
    );
}
