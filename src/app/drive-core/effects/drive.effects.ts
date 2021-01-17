
import { delay, mergeMap, catchError, map, tap, take, filter, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as DriveCore from '../actions/core';
import { of, empty, merge, combineLatest, Observable, from } from 'rxjs';
import { MSGraphClientService } from '../services/msgraph-client.service';
import * as _ from 'lodash';
import { DriveItem } from '../../core/lib/microsoft-graph';
import { createViewPath } from '../reducers/drive';
import {
    getNextRequestInfoByViewPath, isItemLoaded, getItemClipboard, getActiveView,
    getItemViewByViewPath, getStikeyFolders, getCopyingItems
} from '../reducers';
import { OpenByUrl } from '../../document-view';
import { centerToWindow } from '../../utils/bounds';
import { SEARCH_VIEW_ID, SESSION_UPLOAD_MAX } from '../models/const';
import { getUser } from '../../auth';
import { getTemplateClipboard, RemoveCopyFrom, getCopyFrom } from '../../safe-box-explorer-core';
import { MatSnackBar } from '@angular/material';
import { SafeBoxType, LocalStorageKey } from '../../core';
import { OpenByOfficeUriSchemes } from '../../document-view/actions/window-popups';
import { OfficeUriSchemes } from '../../core/lib/office-uri-schemes';

@Injectable()
export class DriveEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: MSGraphClientService, public snackBar: MatSnackBar) { }

    @Effect()
    initEChit$ = this.actions$.pipe(ofType<DriveCore.InitDrive>(DriveCore.INIT_DRIVE),
        switchMap(action => this.store.select(getStikeyFolders(action.token)).pipe(take(1), map(root => ({ root, action })))),
        filter(({ root }) => !(root && root.length > 0)),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, action: action.action })))),
        switchMap(({ user, action }) => {
            return combineLatest(this.service.ensureSpitfireSpecialFolders(),
                this.service.getMyDrive().pipe(switchMap((myDrive) => {
                    return this.service.getRootFolder(myDrive.id).pipe(
                        map((root) => ({ root, drive: myDrive })));
                })),
                this.service.getSharedDrive(user.profile.upn.split('@')[0]),
                (special, myDrive, sharedDrive) => new DriveCore.InitDriveSuccess(action.token, [{ ...myDrive, folders: special },
                    sharedDrive].filter((item) => !!item))).pipe(
                        catchError((error) => of(new DriveCore.InitDriveFail(action.token, error))));
        }));

    @Effect()
    onInitOk$ = this.actions$.pipe(ofType<DriveCore.InitDriveSuccess>(DriveCore.INIT_DRIVE_SUCCESS),
        map(action => new DriveCore.ViewFolder(action.token, action.roots[0].root)));
    @Effect()
    clearItemView$ = this.actions$.pipe(ofType<DriveCore.ClearOrRefreshItemView>(DriveCore.CLEAR_OR_REFRESH_ITEM_VIEW),
        switchMap((action) => {
            return this.store.select(getActiveView(action.token)).pipe(
                take(1),
                filter((view) => view && view.viewPath === action.viewPath),
                map((view) => ({ action, owner: view.owner })),
                filter(({ owner }) => !!owner));
        }), map(({ action, owner }) => {
            return new DriveCore.ViewFolder(action.token, owner); // only active folder will be realod
        }));
    @Effect()
    changeSortOrder$ = this.actions$.pipe(ofType<DriveCore.ChangeSortOrder>(DriveCore.CHANGE_SORT_ORDER),
        switchMap((action) => {
            return this.store.select(getActiveView(action.token)).pipe(
                take(1),
                filter((view) => view && view.viewPath === action.viewPath),
                map((view) => ({ action, owner: view.owner })),
                filter(({ owner }) => !!owner));
        }), map(({ action, owner }) => {
            return new DriveCore.ViewFolder(action.token, owner); // only active folder will be realod
        }));

    @Effect()
    viewFolder$ = this.actions$.pipe(ofType<DriveCore.ViewFolder>(DriveCore.VIEW_FOLDER),
        switchMap((action) => {
            const viewPath = createViewPath(action.item);
            return this.store.select(isItemLoaded(viewPath, action.token)).pipe(take(1),
                filter(isLoded => !isLoded),
                map((isLoded) => ({
                    viewPath,
                    token: action.token
                })));
        }),
        switchMap((action) => this.store.select(getNextRequestInfoByViewPath(action.viewPath, action.token)).pipe(
            take(1), map(reqInfo => ({ action, reqInfo })))
        ),
        filter(({ reqInfo }) => !!reqInfo),
        map(({ action, reqInfo }) =>
            new DriveCore.ListItems(action.token, reqInfo.path, reqInfo.startIndex,
                reqInfo.skipToken, reqInfo.path, reqInfo.sortBy, reqInfo.orderBy)));

    @Effect()
    searchDrive$ = this.actions$.pipe(ofType<DriveCore.SearchDrive>(DriveCore.SEARCH_DRIVE),
        switchMap((action) => this.store.select(getNextRequestInfoByViewPath(SEARCH_VIEW_ID, action.token)).pipe(
            take(1), map(reqInfo => ({ action, reqInfo })))
        ),
        filter(({ reqInfo }) => !!reqInfo),
        map(({ action, reqInfo }) =>
            new DriveCore.ListItems(action.token, reqInfo.path, reqInfo.startIndex,
                reqInfo.skipToken, SEARCH_VIEW_ID, reqInfo.sortBy, reqInfo.orderBy)));

    @Effect()
    viewFolderByPath$ = this.actions$.pipe(ofType<DriveCore.ViewFolderByViewPath>(DriveCore.VIEW_FOLDER_BY_PATH),
        switchMap((action) => {
            return this.store.select(getItemViewByViewPath(action.viewPath, action.token)).pipe(take(1),
                map((view) => ({
                    view: view,
                    viewPath: action.viewPath,
                    token: action.token
                })));
        }),
        switchMap(({ view, viewPath, token }) => {
            if (!!view && !!view.order) {
                return of(new DriveCore.ViewFolder(token, view.owner));
            }
            const path = viewPath.replace(/:$/, '');
            return this.service.getItemByPath(path).pipe(map(item => new DriveCore.ViewFolder(token, item)), catchError(() => empty()));
        }));
    // .map(({ item, token }) => new DriveCore.ViewFolder(item));

    @Effect()
    fetchItems$ = this.actions$.pipe(ofType<DriveCore.ListItems>(DriveCore.LIST_ITEMS),
        mergeMap((action) => {
            let items$: Observable<{ items: DriveItem[], skipToken: string }> = null;
            if (action.viewPath === SEARCH_VIEW_ID) {
                items$ = this.service.searchByPath(action.sortBy, action.orderBy, action.fullPath, action.skipToken);
            } else {
                items$ = this.service.listChildrenByPath(action.sortBy, action.orderBy, action.fullPath, action.skipToken);
            }
            return items$.pipe(map((result) => new DriveCore.ListItemSuccess(action.token, action.viewPath, result, action.skipCount)),
                catchError((error) => of(new DriveCore.ListItemFaild(action.token, action.viewPath, error))));
        }));

    @Effect()
    loadNextItems$ = this.actions$.pipe(ofType<DriveCore.LoadNextItems>(DriveCore.LOAD_NEXT_ITEMS),
        switchMap((action) => this.store.select(getNextRequestInfoByViewPath(action.viewPath, action.token)).pipe(
            take(1), map(reqInfo => ({ action, reqInfo })))
        ),
        map(({ action, reqInfo }) =>
            new DriveCore.ListItems(action.token, reqInfo.path, reqInfo.startIndex,
                reqInfo.skipToken, reqInfo.path, reqInfo.sortBy, reqInfo.orderBy)
        ));

    @Effect()
    openItem$ = this.actions$.pipe(ofType<DriveCore.OpenItem>(DriveCore.OPEN_ITEM),
        map((action) => {
            if (action.wrapper.data.folder) {
                return new DriveCore.ViewFolder(action.token, action.wrapper.data);
            } else if (action.wrapper.data.webUrl) {
                if (localStorage.getItem(LocalStorageKey.DocumentOpenType) === 'Descktop Office') {
                    const schemes = new OfficeUriSchemes(
                        action.wrapper.data.webUrl,
                        action.wrapper.data.name,
                        action.wrapper.data.parentReference.path);
                    if (schemes.getSchemeName()) {
                        return new OpenByOfficeUriSchemes(schemes, true);
                    }

                }

                return new OpenByUrl({
                    url: action.wrapper.data.webUrl,
                    id: action.wrapper.data.id,
                    spec: { ...centerToWindow(800, 600) },
                    attachmentName: action.wrapper.data.name
                });
            }
            return null;
        }), filter(action => action !== null));

    pastItem$ = this.actions$.pipe(ofType<DriveCore.PasteItems>(DriveCore.PASTE_ITEMS),
        filter(action => action.copyFrom === SafeBoxType.Drive),
        switchMap(action => {
            return this.store.select(getItemClipboard(action.token)).pipe(
                take(1),
                filter((clip) => clip && clip.items.length > 0),
                map((clip) => ({
                    clipbord: clip,
                    destViewPath: action.viewPath,
                    destItem: action.destItem,
                    token: action.token
                })));
        }));

    @Effect()
    copyPaste$ = this.pastItem$.pipe(filter(info => info.clipbord.type === 'copy'), switchMap(info => {
        return this.service.bulkCopy(info.clipbord.items,
            { id: info.destItem.id, driveId: info.destItem.parentReference.driveId }).pipe(
                mergeMap(result => {
                    const temp: any[] = result.map(val => new DriveCore.SetCopyingItem(info.token, {
                        location: val.location,
                        destItem: info.destItem,
                        viewPath: info.destViewPath,
                        item: info.clipbord.items.find(item => item.id === val.id),
                        operation: { status: 'inProgress', percentComplete: 0, percentageComplete: 0 }
                    }));
                    temp.push(new DriveCore.ClearClipBoard(info.token));
                    // temp.push(new DriveCore.ClearOrRefreshParentItemView(info.token, info.destViewPath));
                    return from(temp);
                }),
                catchError(() => empty()));
    }));

    @Effect()
    cutPaste$ = this.pastItem$.pipe(filter(info => info.clipbord.type === 'cut'), map(info => {
        return new DriveCore.MoveItems(info.token, info.clipbord.viewPath, info.clipbord.items, info.destItem);
    }));

    @Effect()
    moveItems$ = this.actions$.pipe(ofType<DriveCore.MoveItems>(DriveCore.MOVE_ITEMS),
        filter(action => action.moveItems && action.moveItems.length > 0 &&
            action.destItem.parentReference.driveId === action.moveItems[0].parentReference.driveId),
        switchMap(action => {
            return this.service.bulkMove(
                action.moveItems,
                { id: action.destItem.id, driveId: action.destItem.parentReference.driveId }).pipe(
                    mergeMap(result => {
                        const temp: any[] = _.uniq(action.moveItems
                            .map(item => item.parentReference.path.slice(-1) === ':' ?
                                item.parentReference.path.slice(0, -1) : item.parentReference.path + ':'))
                            .map(path => new DriveCore.ClearOrRefreshParentItemView(action.token, path));
                        temp.push(new DriveCore.ClearOrRefreshItemView(action.token, createViewPath(action.destItem)));
                        temp.push(new DriveCore.ClearOrRefreshItemView(action.token, action.viewPath));
                        temp.push(new DriveCore.ClearClipBoard(action.token));
                        temp.push(new DriveCore.ClearOrRefreshParentItemView(action.token, createViewPath(action.destItem)));
                        temp.push(new RemoveCopyFrom());
                        return from(temp);
                    }),
                    catchError(() => empty()));
        }));

    @Effect()
    _moveItems$ = this.actions$.pipe(ofType<DriveCore.MoveItems>(DriveCore.MOVE_ITEMS),
        filter(action => action.moveItems && action.moveItems.length > 0 &&
            action.destItem.parentReference.driveId !== action.moveItems[0].parentReference.driveId),
        switchMap(action => {
            return this.service.bulkCopy(action.moveItems,
                { id: action.destItem.id, driveId: action.destItem.parentReference.driveId }).pipe(
                    mergeMap(result => {
                        const temp: any[] = result.map(val => new DriveCore.SetCopyingItem(action.token, {
                            location: val.location,
                            destItem: action.destItem,
                            viewPath: action.viewPath,
                            item: action.moveItems.find(item => item.id === val.id),
                            operation: { status: 'inProgress', percentComplete: 0, percentageComplete: 0 }
                        }));
                        temp.push(new DriveCore.ClearClipBoard(action.token));
                        temp.push(new RemoveCopyFrom());
                        return from(temp);
                    }),
                    catchError(() => empty()));
        }));

    @Effect()
    setCopyingItem$ = this.actions$.pipe(ofType<DriveCore.SetCopyingItem>(DriveCore.SET_COPYING_ITEM),
        filter(action => action.payload.operation.status === 'inProgress'),
        delay(1000),
        mergeMap(action => {
            return this.service.retrieveCopyItemStatusReport(action.payload.location).pipe(
                map(result => new DriveCore.SetCopyingItem(action.token, { ...action.payload, operation: result })),
                catchError(() => empty()));
        }));

    @Effect()
    removeCopyingItem$ = this.actions$.pipe(ofType<DriveCore.SetCopyingItem>(DriveCore.SET_COPYING_ITEM),
        filter(action => action.payload.operation.status === 'completed'),
        switchMap(action => this.store.select(getCopyingItems(action.token)).pipe(
            take(1),
            map((items) => ({ action, items })))
        ),
        filter(({ action, items }) => !items.find(item => item.operation.status === 'inProgress')),
        mergeMap(({ action, items }) => {
            const temp: any[] = _.uniq(items.map(item => createViewPath(item.destItem)))
                .map(path => new DriveCore.ClearOrRefreshItemView(action.token, path));
            const temp2: any[] = _.uniq(items.map(item => item.destItem.parentReference.path.slice(-1) === ':' ?
                item.destItem.parentReference.path.slice(0, -1) : item.destItem.parentReference.path + ':'))
                .map(path => new DriveCore.ClearOrRefreshItemView(action.token, path));

            return from(temp.concat(temp2));
        }));

    @Effect()
    renameItem$ = this.actions$.pipe(ofType<DriveCore.RenameItem>(DriveCore.RENAME_ITEM),
        switchMap(action => {
            return this.service.renameItem(action.item.id, action.newName, action.item.parentReference.driveId).pipe(
                map(result => new DriveCore.RenameItemSuccess(action.token, result)),
                catchError(() => empty()));
        }));

    @Effect()
    deleteItems$ = this.actions$.pipe(ofType<DriveCore.DeleteItems>(DriveCore.DELETE_ITEMS),
        switchMap(action => {
            return this.service.bulkDelete(action.deleteItems).pipe(
                mergeMap(result => {
                    return from([
                        new DriveCore.ClearClipBoard(action.token),
                        new DriveCore.DeleteItemsSuccess(action.token, action.deleteItems)
                    ]);
                }),
                catchError((error) => empty()));
        }));

    @Effect()
    deleteItemsSuccess$ = this.actions$.pipe(ofType<DriveCore.DeleteItemsSuccess>(DriveCore.DELETE_ITEMS_SUCCESS),
        map(action => ({
            token: action.token,
            paths: _.uniq(action.items
                .map(val => val.parentReference.path.slice(-1) === ':' ?
                    val.parentReference.path.slice(0, -1) : val.parentReference.path + ':'))
        })
        ),
        mergeMap(({ token, paths }) => {
            return from(paths.map(val => new DriveCore.ClearOrRefreshParentItemView(token, val)));

        }));

    @Effect()
    deleteItemsSuccess2$ = this.actions$.pipe(ofType<DriveCore.DeleteItemsSuccess>(DriveCore.DELETE_ITEMS_SUCCESS),
        switchMap(action => this.store.select(getCopyFrom).pipe(take(1), filter(val => val === SafeBoxType.Drive))),
        map((action) => new RemoveCopyFrom()));

    @Effect()
    clearOrRefreshParentItemView$ = this.actions$
        .pipe(ofType<DriveCore.ClearOrRefreshParentItemView>(DriveCore.CLEAR_OR_REFRESH_PARENT_ITEM_VIEW),
            switchMap(action => this.store.select(getItemViewByViewPath(action.viewPath, action.token)).pipe(
                take(1),
                map((item) => ({ action, item })))
            ),
            filter(({ action, item }) => !!item),
            map(({ action, item }) => new DriveCore.ClearOrRefreshItemView(action.token,
                item.owner.parentReference.path.slice(-1) === ':' ?
                    item.owner.parentReference.path.slice(0, -1) : item.owner.parentReference.path + ':')));

    @Effect({ dispatch: false })
    downloadItem$ = this.actions$.pipe(ofType<DriveCore.DownloadItem>(DriveCore.DOWNLOAD_ITEM),
        switchMap(acttion => this.service.getItem(acttion.item.parentReference.driveId, acttion.item.id).pipe(
            tap(item => {
                if (item['@microsoft.graph.downloadUrl']) {
                    window.open(item['@microsoft.graph.downloadUrl'], '_blank');
                }
            }))
        ));

    @Effect()
    createFolder$ = this.actions$.pipe(ofType<DriveCore.CreateFolder>(DriveCore.CREATE_FOLDER),
        switchMap(action => {
            return this.service.createFolder(action.destItem.id, action.name, action.destItem.parentReference.driveId).pipe(
                mergeMap(result => from([
                    new DriveCore.ViewFolder(action.token, result),
                    new DriveCore.ClearOrRefreshItemView(action.token, action.viewPath),
                ])),
                catchError((error) => empty()));
        }));

    @Effect()
    uploadItem$ = this.actions$.pipe(ofType<DriveCore.UploadItem>(DriveCore.UPLOAD_ITEM),
        mergeMap(action => {
            const path = createViewPath(action.destItem);
            return this.service.createUploadSession(`${action.destItem.parentReference.path ? path.replace(/:$/, '') : path.concat(':')}`,
                action.file.name).pipe(
                    map(result => new DriveCore.SessionUpload(action.token, action.file, result, 0, path, 'inProgress')));
        }));
    //     const path = createViewPath(action.destItem);
    //     map(result => new DriveCore.ClearOrRefreshItemView(action.token, path)),
    // catchError((error) => empty()));
    @Effect()
    sessionUpload$ = this.actions$.pipe(ofType<DriveCore.SessionUpload>(DriveCore.SESSION_UPLOAD),
        filter(action => action.status === 'inProgress'),
        mergeMap(action => {
            const min = (action.index * SESSION_UPLOAD_MAX);
            let max = 0;
            if (((action.index + 1) * SESSION_UPLOAD_MAX) > action.file.size) {
                max = action.file.size - 1;
            } else {
                max = ((action.index + 1) * SESSION_UPLOAD_MAX) - 1;
            }
            return this.service.uploadBytesToTheSession(action.file, action.uploadUrl, max, min).pipe(
                map(result => {
                    if (result.nextExpectedRanges && (result.nextExpectedRanges.length > 1 || max === action.file.size - 1)) {
                        return new DriveCore.SessionUpload(action.token, action.file, action.uploadUrl,
                            action.index, action.destPath, 'inProgress');
                    } else if (result.nextExpectedRanges && result.nextExpectedRanges.length === 1) {
                        return new DriveCore.SessionUpload(action.token, action.file, action.uploadUrl,
                            action.index + 1, action.destPath, 'inProgress');
                    }
                    return new DriveCore.SessionUpload(action.token, action.file, action.uploadUrl,
                        action.index, action.destPath, 'completed');
                }),
                catchError((error) => of(new DriveCore.SessionUpload(action.token, action.file, action.uploadUrl,
                    action.index, action.destPath, 'error'))));
        }));

    @Effect()
    sessionUploadCompleted$ = this.actions$.pipe(ofType<DriveCore.SessionUpload>(DriveCore.SESSION_UPLOAD),
        filter(action => action.status === 'completed'),
        map(action => new DriveCore.ClearOrRefreshItemView(action.token, action.destPath))
    );

    @Effect()
    addNewFile$ = this.actions$.pipe(ofType<DriveCore.AddNewFile>(DriveCore.ADD_NEW_FILE),
        switchMap(action => {
            return this.service.addNewFile(action.destItem.id, action.name, action.destItem.parentReference.driveId).pipe(
                mergeMap(result => {
                    const array: any[] = [new DriveCore.ClearOrRefreshItemView(action.token, action.viewPath)];
                    if (localStorage.getItem(LocalStorageKey.DocumentOpenType) === 'Descktop Office') {
                        const schemes = new OfficeUriSchemes(
                            result.webUrl,
                            result.name,
                            result.parentReference.path);
                        if (schemes.getSchemeName()) {
                            array.push(new OpenByOfficeUriSchemes(schemes, true));
                            return from(array);
                        }

                    }
                    array.push(new OpenByUrl({
                        url: result.webUrl,
                        id: result.id,
                        spec: { ...centerToWindow(800, 600) },
                        attachmentName: result.name
                    }));
                    return from(array);
                }),
                catchError(() => empty()));
        }));

    @Effect()
    pasteFromTemplates$ = this.actions$.pipe(ofType<DriveCore.PasteItems>(DriveCore.PASTE_ITEMS),
        filter(action => action.copyFrom === SafeBoxType.Template),
        switchMap(action => {
            return this.store.select(getTemplateClipboard).pipe(
                take(1),
                filter((clip) => clip && clip.templates.length > 0),
                map((clip) => ({
                    clipboard: clip,
                    destViewPath: action.viewPath,
                    destItem: action.destItem,
                    token: action.token
                })));
        }),
        switchMap(info => {
            const msg = info.clipboard.type === 'cut' ? 'The action “Cut and Paste” is not supported. Copying file(s)…' :
                'Copying file(s)…';
            const snackBar = this.snackBar.open(msg, null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            const files = info.clipboard.templates.map(val => info.clipboard.filePath + '\\' + val.name);
            return this.service.copyTemplateFileToDrive(info.clipboard.appId, files,
                info.destItem.parentReference.driveId, info.destItem.id).pipe(
                    map(result => {
                        snackBar.dismiss();
                        this.snackBar.open('Completed.', null, {
                            duration: 5000,
                            verticalPosition: 'top',
                            horizontalPosition: 'right'
                        });
                        return new DriveCore.ClearOrRefreshItemView(info.token, info.destViewPath);
                    }),
                    catchError(() => {
                        snackBar.dismiss();
                        return empty();
                    }));
        }));

}

