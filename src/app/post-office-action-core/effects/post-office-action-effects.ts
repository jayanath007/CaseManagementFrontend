import { getSaveModelByToken, getModelByToken } from './../../post-office-action-core/reducers/index';
import { take, mergeMap, catchError, map, switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { PostOfficeActionService } from '../services/post-office-action-service';
import * as Core from '../actions/core';


@Injectable()
export class PostOfficeActionEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: PostOfficeActionService) {

    }

    @Effect()
    initTimeRecordingData$ = this.actions$.pipe(ofType<Core.InitPostOfficeAction>(Core.INIT_POST_OFFICE),
        mergeMap((action) => {
            return from([
                new Core.LoadGroupList(action.token),
                new Core.LoadFeeEarnerList(action.token, { groupId: 0 }),
                new Core.LoadItemTypeList(action.token, { appId: -1 }),
                new Core.LoadDiaryFoldersList(action.token, { appId: -1 }),
            ]);
        }));

    @Effect()
    loadFeeEarnerListData$ = this.actions$.pipe(ofType<Core.LoadFeeEarnerList>(Core.LOAD_FEEEARNER_LIST),
        // filter((action) => !!(action.payload && action.payload.groupId)),
        switchMap((action: Core.LoadFeeEarnerList) => {
            return this.service.getFeeEarnerList(action.payload.groupId).pipe(map((response) => {
                return new Core.LoadFeeEarnerListSuccess(action.token,
                    { feeEarnerList: response.data, groupId: action.payload.groupId });
            }),
                catchError(error => of(new Core.LoadFeeEarnerListFail(action.token))));
        }));


    @Effect()
    loadItemTypeList$ = this.actions$.pipe(ofType<Core.LoadItemTypeList>(Core.LOAD_ITEM_TYPE_LIST),
        switchMap((action: Core.LoadItemTypeList) =>
            this.service.getActionList(-1).pipe(map((response) =>
                new Core.LoadItemTypeListSuccess(action.token, { actions: response })),
                catchError(error => of(new Core.LoadItemTypeListFail(action.token))))
        ));


    @Effect()
    loadDiaryFoldersList$ = this.actions$.pipe(ofType<Core.LoadDiaryFoldersList>(Core.LOAD_DIARY_FOLDERS_LIST),
        switchMap((action: Core.LoadDiaryFoldersList) =>
            this.service.getFolderList(-1).pipe(map((response) =>
                new Core.LoadDiaryFoldersListSuccess(action.token, { folders: response })),
                catchError(error => of(new Core.LoadDiaryFoldersListFail(action.token))))
        ));


    @Effect()
    loadGroupListData$ = this.actions$.pipe(ofType<Core.LoadGroupList>(Core.LOAD_GROUP_LIST),
        switchMap((action) =>
            this.service.getGroups().pipe(map((response) => {
                return new Core.LoadGroupListSuccess(action.token, { groups: response });
            }), catchError(error => of(new Core.LoadGroupListFail(action.token))))
        ));


    @Effect()
    saveTimeRecords$ = this.actions$.pipe(ofType<Core.SaveTimeRecords>(Core.SAVE),
        switchMap((action: Core.SaveTimeRecords) =>
            this.store.select(getSaveModelByToken(action.token)).pipe(
                map((model) => ({ model, token: action.token })),
                take(1),
                switchMap(info =>
                    this.service.savePost(info.model).pipe(map((response) =>
                        new Core.SaveTimeRecordsSuccess(info.token)),
                        catchError(error => of(new Core.SaveTimeRecordsFail(info.token))))
                ))));


    @Effect()
    postOfficeActionModelChange$ = this.actions$.pipe(ofType<Core.PostOfficeActionModelChange>(Core.POST_OFFICE_MODEL_CHANGE),
        switchMap((action: Core.PostOfficeActionModelChange) =>
            this.store.select(getModelByToken(action.token)).pipe(
                map((model) => ({ model, token: action.token })),
                take(1),
                map(info => {
                    if (info.model.group !== action.payload.oldModel.group) {
                        return new Core.LoadFeeEarnerList(action.token, { groupId: info.model.group });
                        // return this.service.getFeeEarnerList(info.model.group).pipe(map((response) =>
                        //     new Core.SaveTimeRecordsSuccess(info.token)),
                        //     catchError(error => of(new Core.SaveTimeRecordsFail(info.token)))
                        //     );
                    } else if (info.model.appId !== action.payload.oldModel.appId) {

                        return new Core.LoadDiaryFoldersList(action.token, { appId: info.model.appId });

                        // return this.service.getFeeEarnerList(info.model.group).pipe(map((response) =>
                        //     new Core.SaveTimeRecordsSuccess(info.token)),
                        //     catchError(error => of(new Core.SaveTimeRecordsFail(info.token)))
                        //     );
                    } else {
                        return new Core.LoadFeeEarnerListCancelled(action.token);
                    }
                }
                ))));


    // @Effect()
    // saveTimeRecordsSuccess$ = this.actions$.pipe(ofType<Core.SaveTimeRecordsSuccess>(Core.SAVE_SUCCESS),
    //     mergeMap((action) => {
    //         return from([new PostOffice.GridRefresh(action.token)]);
    //         // return from([
    //         //     new Core.NewForm(action.token)
    //         // ]);
    //     }));




    // @Effect()
    // RefreshGrid$ = this.actions$.pipe(ofType<Core.GridRefresh>(Core.GRID_REFRESH),
    //     switchMap((action) => {
    //         return from([new Core.GridDataRequest(action.token)]);
    //     }));






}
