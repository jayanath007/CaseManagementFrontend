
import { forkJoin as observableForkJoin } from 'rxjs';

import { catchError, map, filter, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { BlobExplorerService } from '../services/blob-explorer.service';
import * as Core from '../actions/core';
import { getSelectedTreeNodeItemByToken, getTreeDataByToken, getCopyFrom } from '../reducers';
import { FileUrlResolverService } from '../../document-view';
import { of } from 'rxjs/internal/observable/of';
import { getExtensionByFileName } from '../../utils/mime-type';
import { SafeBoxType, directDownloadExtensions } from '../../core';
import { getUser, User } from '../../auth';
// import * as mime from 'mime-types';
// mime-types

@Injectable()
export class BlobExplorerEffects {
    constructor(
        private actions$: Actions, private store: Store<any>,
        private service: BlobExplorerService,
        private fileUrlService: FileUrlResolverService
    ) { }


    @Effect()
    initSafeBoxExplorer$ = this.actions$.pipe(ofType<Core.InitSafeBoxExplorer>(Core.INIT_SAFE_BOX_EXPLORER),
        switchMap(action => this.store.select(getTreeDataByToken(action.token)).pipe(
            take(1),
            filter(data => !data),
            map(data => action))),
        switchMap((action) => {
            return this.store.select(getUser).pipe(map((user) => {
                return { user, action };
            }));
        }),
        switchMap(({ user, action }) => {

            return this.service.getExplorerTree().pipe(map((response) => {
                return { action: action, user: user, response: response };
            }), switchMap<{ action: Core.InitSafeBoxExplorer, user: User, response }, any>((responseData) => {

                if (responseData && responseData.response && responseData.response.Code === 'ContainerNotFound') {

                    return this.service.createContainer().pipe(
                        map((response) => {
                            return new Core.InitSafeBoxExplorer(responseData.action.token);

                        }), catchError(error => of(new Core.InitSafeBoxExplorerFail(action.token, error))));
                } else {

                    return of(new Core.InitSafeBoxExplorerSuccess(responseData.action.token,
                        { response: responseData.response, rootNodeName: responseData.user.general.user }));
                }
            }), catchError(error => of(new Core.InitSafeBoxExplorerFail(action.token, error))));
        }));


    @Effect()
    expandSafeBoxExplorer$ = this.actions$.pipe(ofType<Core.ExpandSafeBoxExplorer>(Core.EXPAND_SAFE_BOX_EXPLORER),
        switchMap((action) =>
            this.service.getExplorerTree(action.payload.prefix).pipe(
                map((response) => {
                    return new Core.ExpandSafeBoxExplorerSuccess(action.token,
                        { response: response, prefix: action.payload.prefix });
                }), catchError(error => of(new Core.ExpandSafeBoxExplorerFail(action.token, error))))
        ));

    @Effect()
    downloadBlob$ = this.actions$.pipe(ofType<Core.ItemDownload>(Core.ITEM_DOWNLOAD),
        switchMap(action =>
            this.fileUrlService.mapAccessTokenOnly(`/File/DoSafeBoxFunction/mycontainer/${action.payload.path}`).pipe(
                map(response => {

                    const pieces = action.payload.path.split('/');
                    const fileName = `${pieces[pieces.length - 1]}`;
                    // const mime = require('mime-types');
                    // const extention = mime.extension(mime.lookup(fileName));
                    const extention = getExtensionByFileName(fileName);
                    if (action.payload.isView) {
                        return new Core.ItemView(action.token, { viewUrl: response, extention: extention });
                    } else {

                        if (directDownloadExtensions.filter(p => p === extention).length > 0) {
                            const link: HTMLAnchorElement = document.createElement('a');
                            link.download = fileName;
                            link.href = response;
                            link.click();
                        } else {
                            window.open(response, '_blank');
                        }
                        return new Core.ItemDownloadSuccess(action.token);
                    }
                }
                ), catchError(error => of(new Core.ItemDownloadFail(action.token))))
        ));

    @Effect()
    renameItem$ = this.actions$.pipe(ofType<Core.ItemRename>(Core.ITEM_RENAME),
        switchMap(action => {
            const path = action.payload.path;
            const pieces = path.split('.');
            const newName = `${action.payload.newName}.${pieces[pieces.length - 1]}`; // new path with Extention
            const pieces1 = path.split('/');
            const newPath = path.replace(pieces1[pieces1.length - 1], '') + newName;
            return this.service.copyBlob(path, newPath).pipe(
                map(response => {
                    return new Core.ItemRenameSuccess(action.token, { path: action.payload.path });
                }), catchError(error => of(new Core.ItemRenameFail(action.token))));
        }
        ));

    @Effect()
    renameSuccess$ = this.actions$.pipe(ofType<Core.ItemRenameSuccess>(Core.ITEM_RENAME_SUCCESS),
        map(action => new Core.ItemDelete(action.token, { paths: [action.payload.path] })));



    @Effect()
    moveItem$ = this.actions$.pipe(ofType<Core.ItemMove>(Core.ITEM_MOVE),
        switchMap(action => {
            const observableBatch = [];
            const deletePath = [];
            action.payload.item.forEach(blob => {
                const path = blob.Name;
                const pieces = path.split('/');
                const newPath = action.payload.newPath + pieces[pieces.length - 1];
                deletePath.push(blob.Name);
                if (path !== newPath) {
                    observableBatch.push(this.service.copyBlob(path, newPath));
                }
            });
            return observableForkJoin(observableBatch).pipe(map(response => {
                return new Core.ItemMoveSuccess(action.token, { path: deletePath });
            }), catchError(error => of(new Core.ItemDeleteFail(action.token))));

        }));


    @Effect()
    moveSuccess$ = this.actions$.pipe(ofType<Core.ItemMoveSuccess>(Core.ITEM_MOVE_SUCCESS),
        map(action => new Core.ItemDelete(action.token, { paths: action.payload.path })));


    @Effect()
    deleteItem$ = this.actions$.pipe(ofType<Core.ItemDelete>(Core.ITEM_DELETE),
        switchMap(action => {
            const observableBatch = [];
            action.payload.paths.forEach((path) => {
                observableBatch.push(this.service.deleteBlob(path));
            });
            return observableForkJoin(observableBatch).pipe(map(response => {
                if (action.payload.cutItemPaths) {
                    return new Core.ItemCutSuccess(action.token, { paths: action.payload.cutItemPaths });
                } else {
                    return new Core.ItemDeleteSuccess(action.token);
                }

            }), catchError(error => of(new Core.ItemDeleteFail(action.token))));
        }));


    @Effect()
    deleteSuccess$ = this.actions$.pipe(ofType<Core.ItemDeleteSuccess>(Core.ITEM_DELETE_SUCCESS),
        map(action => new Core.Reload(action.token)));

    @Effect()
    deleteSuccess2$ = this.actions$.pipe(ofType<Core.ItemDeleteSuccess>(Core.ITEM_DELETE_SUCCESS),
        switchMap(action => this.store.select(getCopyFrom).pipe(take(1), filter(val => val === SafeBoxType.Blob), map(val => action))),
        map(action => new Core.RemoveCopyFrom()));

    @Effect()
    cutItemsSuccess$ = this.actions$.pipe(ofType<Core.ItemCutSuccess>(Core.ITEM_CUT_SUCCESS),
        map(action => new Core.Reload(action.token)));

    @Effect()
    deleteFail = this.actions$.pipe(ofType<Core.ItemDeleteFail>(Core.ITEM_DELETE_FAIL),
        map(action => new Core.Reload(action.token)));

    @Effect()
    uploadFileSafeBoxExplorer$ = this.actions$.pipe(ofType<Core.UploadFileSafeBoxExplorer>(Core.UPLOAD_FILE_SAFE_BOX_EXPLORER),
        switchMap(action => {
            const observableBatch = [];
            for (let i = 0; i < action.payload.file.length; i++) {
                observableBatch.push(this.service.uploadFile(action.payload.file[i], action.payload.path));
            }
            return observableForkJoin(observableBatch).pipe(map(response => {
                return new Core.UploadFileSafeBoxExplorerSuccess(action.token, { response: response });
            }), catchError(error => of(new Core.UploadFileSafeBoxExplorerFail(action.token, error))));
        }));

    @Effect()
    uploadSuccess$ = this.actions$.pipe(ofType<Core.UploadFileSafeBoxExplorerSuccess>(Core.UPLOAD_FILE_SAFE_BOX_EXPLORER_SUCCESS),
        map(action => new Core.Reload(action.token)));

    @Effect()
    uploadFail = this.actions$.pipe(ofType<Core.UploadFileSafeBoxExplorerFail>(Core.UPLOAD_FILE_SAFE_BOX_EXPLORER_FAIL),
        map(action => new Core.Reload(action.token)));

    @Effect()
    represh$ = this.actions$.pipe(ofType<Core.Reload>(Core.RELOAD),
        switchMap((action) =>
            this.store.select(getSelectedTreeNodeItemByToken(action.token)).pipe(
                map(selectItem => ({ selectItem, token: action.token })),
                take(1),
                map(info => new Core.ExpandSafeBoxExplorer(info.token, { prefix: info.selectItem.prefix })
                ))));

    @Effect()
    navigete$ = this.actions$.pipe(ofType<Core.Navigete>(Core.NAVIGETE),
        map((action) => {
            return new Core.ExpandSafeBoxExplorer(action.token, { prefix: action.payload.prefix, isNavigete: true });
        }));

    @Effect()
    pasteItems$ = this.actions$.pipe(ofType<Core.ItemPaste>(Core.ITEM_PASTE),
        switchMap(action => {
            const observableBatch = [];
            const newPathList = [];
            action.payload.itemPath.forEach(path => {
                const pieces = path.split('/');
                const newPath = action.payload.newpath + pieces[pieces.length - 1];
                newPathList.push(newPath);
                if (path !== newPath) {
                    observableBatch.push(this.service.copyBlob(path, newPath));
                }
            });
            return observableForkJoin(observableBatch).pipe(map(response => {
                if (action.payload.type === 'cut') {
                    return new Core.ItemDelete(action.token, { paths: action.payload.itemPath, cutItemPaths: newPathList });
                } else {
                    return new Core.ItemCopySuccess(action.token);
                }
            }), catchError(error => of(new Core.ItemDeleteFail(action.token))));
        }));

    @Effect()
    copySuccess$ = this.actions$.pipe(ofType<Core.ItemCopySuccess>(Core.ITEM_COPY_SUCCESS),
        map(action => new Core.Reload(action.token)));
}
