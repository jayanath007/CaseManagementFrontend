import { getfolderFlatData, getappIdData } from './../reducers/index';


import { mergeMap, catchError, switchMap, map, filter, take } from 'rxjs/operators';
import { of, from, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as Core from '../actions/core';
import { DiaryFolderService } from '../services/diary-folder.service';
import { ColumnFolderRequest } from '../models/request';
import { getViewsTokensByAppId, LoadFolderListSuccess, FileHistoryRefresh, LoadFolderList } from './../../file-history-core';


@Injectable()
export class DiaryFolderEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: DiaryFolderService) { }

    @Effect()
    init$ = this.actions$.pipe(
        ofType<Core.InitDiaryFolder>(Core.INIT_DIARY_FOLDER),
        mergeMap(action => {
            return from([new Core.GetFolders(action.token, {
                appId: action.payload.appId
            })]);
        })
    );
    @Effect()
    getFolders$ = this.actions$.pipe(
        ofType<Core.GetFolders>(Core.GET_FOLDERS),
        switchMap(action => this.service.getFolders(action.payload.appId)
            .pipe(
                map(result => new Core.GetFoldersSuccess(action.token, { folders: result })),
                catchError(error => of(new Core.GetFoldersFaild(action.token, error)))
            )
        )
    );
    // @Effect()
    // saveFolders$ = this.actions$.pipe(
    //     ofType<Core.SaveFolders>(Core.SAVE_FOLDERS),
    //     switchMap(action => this.service.saveFolders(new ColumnFolderRequest(action.payload.appId, action.payload.foldersNodes))
    //         .pipe(
    //             map(result => new Core.SaveFoldersSuccess(action.token, action.payload.appId)),
    //             catchError(error => of(new Core.SaveFoldersFaild(action.token, error)))
    //         )
    //     )
    // );
    @Effect()
    saveFoldersSuccess$ = this.actions$.pipe(
        ofType<Core.SaveTreeFolderSuccess>(Core.SAVE_TREE_FOLDERS_SUCCESS),
        switchMap((action) => {
            return this.store.select(getViewsTokensByAppId(action.payload.AppId)).pipe(
                take(1),
                map(tokens => ({ action, tokens })));
        }),
        filter((info) => info.tokens && info.tokens.length > 0),
        switchMap(info => this.service.getFolders(info.action.payload.AppId)
            .pipe(
                mergeMap(result => {
                    const actions = [];
                    info.tokens.forEach(token => {
                        actions.push(new Core.GetFoldersSuccess(token, { folders: result }));
                        actions.push(new FileHistoryRefresh(token));
                        actions.push(new LoadFolderList(token, { AppId: info.action.payload.AppId }));
                    });
                    return from(actions);
                }),
                catchError(error => of(new Core.GetFoldersFaild(info.action.token, error)))
            )
        )
    );


    @Effect()
    saveTreeFolder$ = this.actions$.pipe(ofType<Core.SaveTreeFolder>(Core.SAVE_TREE_FOLDERS),
        switchMap((action) =>
            combineLatest(
                this.store.select(getappIdData(action.token)),
                this.store.select(getfolderFlatData(action.token)),
                ((appId, treeNodes) => ({ appId, treeNodes, token: action.token }))
            ).pipe(
                take(1))
        ),
        switchMap((info) =>
            this.service.saveTreeData(new ColumnFolderRequest(info.appId, info.treeNodes)).pipe(
                map((response) =>
                    new Core.SaveTreeFolderSuccess(info.token, { response: response, AppId: info.appId })
                ),
                catchError(error => of(new Core.SaveTreeFolderFail(info.token, error))))
        ));





}








