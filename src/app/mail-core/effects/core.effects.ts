
import { tap, takeUntil, mergeMap, delayWhen, map, take, filter, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MSGraphClientService } from '../services/msgraph-client.service';

import { merge } from 'rxjs';

import * as Folders from '../actions/folders';
import * as Items from '../actions/items';
import * as Core from '../actions/core';
import { getIsFolderInit, findFolder, getNextPageItemRequestByViewId, getHasMessageItemLoadedByViewId } from '../reducers/';
import { MailItemRequest } from '../models/requests';
import { SEARCH_VIEWID } from '../models/const';
import { getUser } from '../../auth';
import { LoadGroupList } from '../actions/groups';

@Injectable()
export class CoreEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: MSGraphClientService) { }

    @Effect()
    initFolders$ = this.actions$.pipe(ofType(Core.INIT_MAIL_CORE),
        switchMap(action =>
            this.store.select(getIsFolderInit).pipe(
                take(1))),
        filter(isInit => !isInit),
        take(1),
        map(() => new Folders.LoadFolderList(false, 'me')));

    @Effect()
    initGroups$ = this.actions$.pipe(ofType(Core.INIT_MAIL_CORE),
        switchMap(action =>
            this.store.select(getIsFolderInit).pipe(
                take(1))),
        filter(isInit => !isInit),
        take(1),
        map(() => new LoadGroupList()));

    @Effect()
    initItems$ = this.actions$.pipe(ofType<Core.InitMailCore>(Core.INIT_MAIL_CORE),
        delayWhen(() => this.actions$.pipe(ofType(Folders.FOLDER_LOAD_SUCCESSS), take(1))),
        switchMap(action =>
            this.store.select(findFolder(action.payload.selectedFolder)).pipe(
                take(1))),
        take(1),
        map((folder) => new Folders.SelectFolder(folder)));

    @Effect()
    preloadFolders = this.actions$.pipe(ofType<Core.InitMailCore>(Core.INIT_MAIL_CORE),
        delayWhen(() => this.actions$.pipe(ofType(Folders.FOLDER_LOAD_SUCCESSS), take(1))),
        take(1),
        mergeMap(action =>
            merge(this.store.select(findFolder('drafts')).pipe(take(1)),
                this.store.select(findFolder('sentitems')).pipe(take(1)),
                this.store.select(findFolder('deleteditems')).pipe(take(1)))
        ),
        map((folder) => new Items.EnsureViewChange({ viewId: folder.data.id, changes: [] })));

    @Effect()
    sharedMailBoxes = this.actions$.pipe(ofType<Core.InitMailCore>(Core.INIT_MAIL_CORE),
        switchMap(action =>
            this.store.select(getUser).pipe(filter(user => !!(user && user.dpsSharedMailBoxes)),
                take(1))),
        map((user) => new Folders.GetMailBoxesSuccess(user.dpsSharedMailBoxes)));


    @Effect()
    preloadNextSearchPage$ = this.actions$.pipe(ofType<Items.SearchViewChange>(Items.SEARCH_LIST_VIEW_CHANGE),
        mergeMap(action =>
            this.store.select(getHasMessageItemLoadedByViewId(SEARCH_VIEWID)).pipe(
                take(1),
                map((hasLoaded) => ({ hasLoaded, viewId: SEARCH_VIEWID })))
        ),
        filter(({ hasLoaded }) => !hasLoaded),
        mergeMap(({ viewId }) => {

            const onSuccess = this.actions$.pipe(ofType<Items.MessageItemsLoadSuccess>(Items.MAIL_MESSAGE_ITEM_LOAD_SUCCESS),
                filter((act) => act.payload.request.isSearching));
            const onFail = this.actions$.pipe(ofType<Items.MessageItemsLoadFail>(Items.SEARCH_LIST_VIEW_CHANGE));

            return merge(onSuccess, onFail).pipe(
                tap(result => console.log('laoding done ------------------', result)),
                takeUntil(this.actions$.pipe(ofType<Items.SearchViewChange>(Items.SEARCH_LIST_VIEW_CHANGE))),
                take(1),
                filter((result) => result instanceof Items.MessageItemsLoadSuccess),
                tap(result => console.log(' loading next page ------------------', result)),
                switchMap((act: Items.MessageItemsLoadSuccess) => {
                    return this.store.select(getNextPageItemRequestByViewId(viewId)).pipe(take(1));
                }),
                filter(reqInfo => !!reqInfo),
                switchMap(reqInfo =>

                    this.store.select(findFolder(reqInfo.folderId ? reqInfo.folderId : viewId)).pipe(
                        take(1),
                        map((folder) => ({ folder, reqInfo })))
                ),
                map(({ reqInfo, folder }) => {

                    return new MailItemRequest(
                        true,
                        reqInfo.hash,
                        viewId === SEARCH_VIEWID,
                        reqInfo.start,
                        reqInfo.size,
                        reqInfo.orderBy,
                        reqInfo.sortDir,
                        reqInfo.filter,
                        reqInfo.searchText,
                        reqInfo.isAllFolders,
                        reqInfo.hasAttachment,
                        reqInfo.from,
                        reqInfo.dateType,
                        reqInfo.dateFrom,
                        reqInfo.dateTo,
                        folder ? folder.owner : null,
                        folder ? folder.data.id : null,
                        folder ? folder.data.wellKnownName : null);

                }),
                tap(result => console.log(' loading next page 2 ------------------', result)));
        }),
        map((req: any) => new Items.LoadMessageItems(req, false)));


    @Effect()
    preloadNextPage$ = this.actions$.pipe(ofType<Items.EnsureViewChange>(Items.ENSURE_LIST_VIEW_CHANGE),
        filter(action => action.payload.viewId !== SEARCH_VIEWID),
        mergeMap(action =>
            this.store.select(getHasMessageItemLoadedByViewId(action.payload.viewId)).pipe(
                take(1),
                map((hasLoaded) => ({ hasLoaded, viewId: action.payload.viewId })))
        ),
        filter(({ hasLoaded }) => !hasLoaded),
        mergeMap(({ viewId }) => {

            const onSuccess = this.actions$.pipe(ofType<Items.MessageItemsLoadSuccess>(Items.MAIL_MESSAGE_ITEM_LOAD_SUCCESS),
                filter((act) => act.payload.request.folderId === viewId));
            const onFail = this.actions$.pipe(ofType<Items.MessageItemsLoadFail>(Items.MAIL_MESSAGE_ITEM_LOAD_FAIL));

            return merge(onSuccess, onFail).pipe(
                tap(result => console.log('laoding done ------------------', result)),
                takeUntil(this.actions$.pipe(ofType<Items.EnsureViewChange>(Items.ENSURE_LIST_VIEW_CHANGE),
                    filter((_act) => _act.payload.viewId === viewId))),
                take(1),
                filter((result) => result instanceof Items.MessageItemsLoadSuccess),
                filter((act: Items.MessageItemsLoadSuccess) => act.payload.request.size <= 50),
                filter((act: Items.MessageItemsLoadSuccess) => act.payload.request.start < 50),
                tap(result => console.log(' loading next page ------------------', result)),
                switchMap((act: Items.MessageItemsLoadSuccess) => {
                    return this.store.select(getNextPageItemRequestByViewId(viewId)).pipe(take(1));
                }),
                filter(reqInfo => !!reqInfo),
                switchMap(reqInfo =>

                    this.store.select(findFolder(reqInfo.folderId ? reqInfo.folderId : viewId)).pipe(
                        take(1),
                        map((folder) => ({ folder, reqInfo })))
                ),
                map(({ reqInfo, folder }) => {

                    return new MailItemRequest(
                        true,
                        reqInfo.hash,
                        viewId === SEARCH_VIEWID,
                        reqInfo.start,
                        reqInfo.size,
                        reqInfo.orderBy,
                        reqInfo.sortDir,
                        reqInfo.filter,
                        reqInfo.searchText,
                        reqInfo.isAllFolders,
                        reqInfo.hasAttachment,
                        reqInfo.from,
                        reqInfo.dateType,
                        reqInfo.dateFrom,
                        reqInfo.dateTo,
                        folder ? folder.owner : null,
                        folder ? folder.data.id : null,
                        folder ? folder.data.wellKnownName : null);
                }),
                tap(result => console.log(' loading next page 2 ------------------', result)));
        }),
        map((req: any) => new Items.LoadMessageItems(req, false)));
}
