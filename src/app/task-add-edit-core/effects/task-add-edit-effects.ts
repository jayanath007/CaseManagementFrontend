
import { take, mergeMap, catchError, map, switchMap, delayWhen } from 'rxjs/operators';
import { LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK } from '../actions/core';
import { TaskAddEditService } from '../services/task-add-edit.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as AddEditTask from '../actions/core';
import { from, of } from 'rxjs';
import { getTaskAddEditMatterInfoByToken, getFeeEarners } from '../reducers';
import { getTaskAddEditDocumentFlowStatusByToken, getTaskAddEditSaveByToken } from '..';



@Injectable()
export class TaskAddEditEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: TaskAddEditService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<AddEditTask.InitAddEditTask>(AddEditTask.INIT_ADD_EDIT_TASK),
        // .do(() => console.log('$initChaserView'))
        mergeMap((action) =>
            from([
                new AddEditTask.LoadDefaultFolderId(action.token),
                new AddEditTask.LoadFeeEarnerList(action.token),
                new AddEditTask.LoadFolderList(action.token),
                new AddEditTask.LoadActionTypeList(action.token),
            ])));
    @Effect()
    matterChanging$ = this.actions$.pipe(ofType<AddEditTask.ChangeMatterData>(AddEditTask.TASK_ADD_EDIT_SELECTED_MATTER_DATA),
        mergeMap((action) =>
            from([
                new AddEditTask.LoadDefaultFolderId(action.token),
                new AddEditTask.LoadFolderList(action.token),
            ])));

    @Effect()
    loadFeeEarner$ = this.actions$.pipe(ofType<AddEditTask.LoadFeeEarnerList>(AddEditTask.LOAD_FE_LIST_ADD_EDIT_TASK),
        switchMap((action) =>
            this.store.select(getFeeEarners).pipe(
                take(1),
                map((feeEarners) => ({ feeEarners, token: action.token }))
            )
        ),
        switchMap((action) => {
            if (action.feeEarners && action.feeEarners.length > 0) {
                return of(new AddEditTask.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: action.feeEarners }));
            }
            return this.service.getFeeEarners().pipe(
                map((result) => new AddEditTask.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: result })),
                catchError((error) => of(new AddEditTask.LoadFeeEarnerListFail(action.token, error))));
        })
    );

    @Effect()
    loadFolders$ = this.actions$.pipe(ofType<AddEditTask.LoadFolderList>(AddEditTask.LOAD_FOLDER_LIST_ADD_EDIT_TASK),
        switchMap((action) =>
            this.store.select(getTaskAddEditMatterInfoByToken(action.token)).pipe(
                map((matterInfo) => ({ matterInfo, token: action.token })),
                take(1))),
        delayWhen(() => this.actions$.pipe(ofType(AddEditTask.LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_SUCCESS), take(1))),
        switchMap<any, AddEditTask.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getFolders(info.matterInfo.appID).pipe(
                    map((result) => new AddEditTask.LoadFolderListSuccess(info.token, { folderList: result })),
                    catchError((error) => of(new AddEditTask.LoadFolderListFail(info.token, error))));
            } else {
                return of();
            }
        }));

    @Effect()
    loadActionList$ = this.actions$.pipe(ofType<AddEditTask.LoadActionTypeList>(AddEditTask.LOAD_ACTION_LIST_ADD_EDIT_TASK),
        switchMap((action) =>
            this.store.select(getTaskAddEditDocumentFlowStatusByToken(action.token)).pipe(
                map((docInfo) => ({ docInfo, token: action.token })),
                take(1))),
        switchMap<any, AddEditTask.Any>((info) => {
            if (info) {
                return this.service.getActionList(info.docInfo).pipe(
                    map((result) => new AddEditTask.LoadActionTypeListSuccess(info.token, { actionTypeList: result })),
                    catchError((error) => of(new AddEditTask.LoadActionTypeListFail(info.token, error))));
            } else {
                return of();
            }
        }));

    @Effect()
    loadDefaultFolders$ = this.actions$.pipe(ofType<AddEditTask.LoadDefaultFolderId>(AddEditTask.LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK),
        switchMap((action) =>
            this.store.select(getTaskAddEditMatterInfoByToken(action.token)).pipe(
                map((matterInfo) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, AddEditTask.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getDefaultFolder(info.matterInfo.appID).pipe(
                    map((result) => new AddEditTask.LoadDefaultFolderIdSuccess(info.token, { folderId: result })),
                    catchError((error) => of(new AddEditTask.LoadDefaultFolderIdFail(info.token, error))));
            } else {
                return of();
            }
        }));

    @Effect()
    saveAddEditTask$ = this.actions$.pipe(ofType<AddEditTask.CheckIsTREnableSuccess>(AddEditTask.CHECK_IS_TIME_RECORDING_ENABLE_SUCCESS),
        switchMap((action) =>
            this.store.select(getTaskAddEditSaveByToken(action.token)).pipe(
                map((dataModel) => ({ dataModel, action: action })),
                take(1))),
        switchMap<any, AddEditTask.Any>((info) => {
            if (info && info.dataModel && info.action.payload.isEnable) {
                return this.service.saveTaskAddEdit(info.dataModel).pipe(
                    map((result) => new AddEditTask.SubmitAddEditTaskSuccess(info.action.token)),
                    catchError((error) => of(new AddEditTask.SubmitAddEditTaskFail(info.action.token, error))));
            } else {
                return of(new AddEditTask.ShowError(info.action.token,
                    { msg: `Current Spitfire version doesn't support this action on this matter.` }));
            }
        }));

    @Effect()
    CheckIsTREnable$ = this.actions$.pipe(ofType<AddEditTask.SubmitAddEditTask>(AddEditTask.SUBMIT_ADD_EDIT_TASK),
        switchMap((action) =>
            this.store.select(getTaskAddEditMatterInfoByToken(action.token)).pipe(
                map((matterInfo) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap((info) => {
            if (info && info.matterInfo) {
                return this.service.getIsTREnable(info.matterInfo.matterReferenceNo).pipe(
                    map((result) => new AddEditTask.CheckIsTREnableSuccess(info.token, { isEnable: result })),
                    catchError((error) => of(new AddEditTask.CheckIsTREnableFail(info.token))));
            } else {
                return of();
            }

        }));

    @Effect()
    CheckUnLockPasword$ = this.actions$.pipe(ofType<AddEditTask.EnterUnLockPassword>(AddEditTask.ENTER_UNLOCK_PW),
        switchMap((action) =>
            this.store.select(getTaskAddEditMatterInfoByToken(action.token)).pipe(
                map((matterInfo) => ({ matterInfo, action: action })),
                take(1))),
        switchMap((info) => {
            if (info && info.matterInfo) {
                return this.service.ValidateTaskDocumentChangePassword(info.action.payload.password, info.matterInfo.taskID).pipe(
                    map((result) => new AddEditTask.PasswordValidationSuccess(info.action.token, { isValid: result })),
                    catchError((error) => of(new AddEditTask.PasswordValidationFail(info.action.token))));
            } else {
                return of();
            }

        }));
}
