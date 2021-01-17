import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, take, catchError, filter, mergeMap } from 'rxjs/operators';
import { of, empty, from, combineLatest, forkJoin } from 'rxjs';


import { TemplateDirectoryService } from '../services/template-directory.service';
import * as TemplateDirectory from '../actions/template-directory';
import { getAppList, getAppViewByAppId, getCopyFrom, getSelectedAppView } from '../reducers';
import { FileUrlResolverService, OpenByUrl } from '../../document-view';
import { fitWindow } from '../../utils/bounds';
import { MatSnackBar } from '@angular/material';
import { RemoveCopyFrom } from '../actions/core';
import { AppInfo } from '../models/interfaces';
import { SafeBoxType } from '../../core';
import { getUser } from '../../auth';

@Injectable()
export class TemplateDirectoryEffects {
    constructor(
        private actions$: Actions, private store: Store<any>, private service: TemplateDirectoryService,
        private urlResolver: FileUrlResolverService, public snackBar: MatSnackBar) { }

    @Effect()
    initTemplateDirectory$ = this.actions$.pipe(ofType<TemplateDirectory.InitTemplateDirectory>(TemplateDirectory.INIT_TEMPLATE_DIRECTORY),
        switchMap((action) =>
            this.store.select(getAppList).pipe(
                take(1),
                filter(list => !(list && list.length > 0)),
                map((list) => (action))
            )),
        map(action => new TemplateDirectory.GetAppList()));

    @Effect()
    getAppCodeList$ = this.actions$.pipe(ofType<TemplateDirectory.GetAppList>(TemplateDirectory.GET_APP_LIST),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                take(1),
                filter(user => !!(user && user.general && user.general.amendScreensWorkflow))
            )),
        switchMap((action) => this.service.getAppCodeList().pipe(
            map((result) => new TemplateDirectory.GetAppListSuccess(result)),
            catchError((error) => of(new TemplateDirectory.GetAppListFail({ error: error }))))
        ));

    @Effect()
    getAppCodeList2$ = this.actions$.pipe(ofType<TemplateDirectory.GetAppList>(TemplateDirectory.GET_APP_LIST),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                take(1),
                filter(user => !(user && user.general && user.general.amendScreensWorkflow))
            )),
        map((action) => new TemplateDirectory.GetAppListFail({ error: 'No permissions ammendTemplatesMenus' })));

    @Effect()
    selectApp$ = this.actions$.pipe(ofType<TemplateDirectory.SelectApp>(TemplateDirectory.SELECT_APP),
        switchMap((action) =>
            this.store.select(getAppViewByAppId(action.payload.appId)).pipe(
                take(1),
                filter(view => !(view && (view.appPathTemplate || view.appCommonPathTemplates))),
                map((list) => (action.payload))
            )),
        map(app => new TemplateDirectory.GetTemplateList(app)));

    @Effect()
    selectApp2$ = this.actions$.pipe(ofType<TemplateDirectory.SelectApp>(TemplateDirectory.SELECT_APP),
        switchMap((action) =>
            this.store.select(getAppViewByAppId(action.payload.appId)).pipe(
                take(1),
                filter(view => !!(view && (view.appPathTemplate || view.appCommonPathTemplates))),
                map((list) => (action.payload))
            )),
        map(app => new TemplateDirectory.GetCheckedOutFiles(app)));

    @Effect()
    getTemplateList$ = this.actions$.pipe(ofType<TemplateDirectory.GetTemplateList>(TemplateDirectory.GET_TEMPLATE_LIST),
        mergeMap((action) => {
            return this.service.getTemplateListWithCheckedOutData(action.payload.appId).pipe(
                map((result) => new TemplateDirectory.GetTemplateListSuccess({
                    templates: result.templateList, checkedOutList: result.checkedOutList, app: action.payload
                })),
                catchError((error) => of(new TemplateDirectory.GetTemplateListFail({ error: error, app: action.payload }))));
        }));

    @Effect()
    getCheckedOutFiles$ = this.actions$.pipe(ofType<TemplateDirectory.GetCheckedOutFiles>(TemplateDirectory.GET_CHECKED_OUT_FILES),
        switchMap((action) => {
            return this.service.getCheckedOutFiles(action.payload.appId).pipe(
                map((result) => new TemplateDirectory.GetCheckedOutFilesSuccess({
                    checkedOutList: result, app: action.payload
                })),
                catchError((error) => of(new TemplateDirectory.GetCheckedOutFilesFail({ error: error, app: action.payload }))));
        }));

    @Effect()
    viewTemplate$ = this.actions$.pipe(ofType<TemplateDirectory.ViewTemplate>(TemplateDirectory.VIEW_TEMPLATE),
        switchMap((action) => {
            return this.urlResolver
                .getTemplateDataUrl(action.payload.appId, action.payload.fileName, action.payload.isCommon).pipe(map((url) =>
                    new OpenByUrl({
                        id: action.payload.appId + '_' + action.payload.fileName,
                        url: url,
                        spec: {
                            ...fitWindow(),
                        },
                        attachmentName: ''
                    })
                ));
        }));

    @Effect()
    pasteFromDrive$ = this.actions$.pipe(ofType<TemplateDirectory.PasteItems>(TemplateDirectory.PASTE_ITEMS),
        filter(action => action.payload.copyFrom === SafeBoxType.Drive),
        switchMap(action => {
            const msg = action.payload.diveClipboard.type === 'cut' ? 'The action “Cut and Paste” is not supported. Copying file(s)…' :
                'Copying file(s)…';
            const snackBar = this.snackBar.open(msg, null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            const files = action.payload.diveClipboard.items.map(val => val.id);
            return this.service.copyDriveToTemplateDirectory(action.payload.diveClipboard.items[0].parentReference.driveId, files,
                action.payload.appId, action.payload.path).pipe(
                    map(result => {
                        snackBar.dismiss();
                        this.snackBar.open('Completed.', null, {
                            duration: 5000,
                            verticalPosition: 'top',
                            horizontalPosition: 'right'
                        });
                        return new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: action.payload.appId });
                    }),
                    catchError(() => {
                        snackBar.dismiss();
                        return empty();
                    }));
        }));

    pasteTemplates$ = this.actions$.pipe(ofType<TemplateDirectory.PasteItems>(TemplateDirectory.PASTE_ITEMS),
        filter(action => action.payload.copyFrom === SafeBoxType.Template));

    @Effect()
    copyPasteTemplates$ = this.pasteTemplates$.pipe(filter(action => action.payload.clipboard.type === 'copy'),
        switchMap(action => {
            const snackBar = this.snackBar.open('Copying file(s)…', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            const files = action.payload.clipboard.templates.map(val => action.payload.clipboard.filePath + '\\' + val.name);
            return this.service.copyTemplateFileToSameDirectory(action.payload.path, files).pipe(
                map(result => {
                    snackBar.dismiss();
                    this.snackBar.open('Completed.', null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    });
                    return new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: action.payload.appId });
                }),
                catchError(() => {
                    snackBar.dismiss();
                    return empty();
                }));
        }));
    @Effect()
    cutPasteTemplates$ = this.pasteTemplates$.pipe(filter(action => action.payload.clipboard.type === 'cut'),
        switchMap(action => {
            const snackBar = this.snackBar.open('Moving file(s)…', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            const files = action.payload.clipboard.templates.map(val => action.payload.clipboard.filePath + '\\' + val.name);
            return this.service.cutPasteTemplateFileToSameDirectory(action.payload.path, files).pipe(
                mergeMap(result => {
                    snackBar.dismiss();
                    this.snackBar.open('Completed.', null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    });
                    return from([
                        new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: action.payload.appId }),
                        new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: action.payload.clipboard.appId }),
                        new RemoveCopyFrom()
                    ]);
                }),
                catchError(() => {
                    snackBar.dismiss();
                    return empty();
                }));
        }));

    @Effect()
    deleteItems$ = this.actions$.pipe(ofType<TemplateDirectory.DeleteItems>(TemplateDirectory.DELETE_ITEMS),
        switchMap(action => {
            const snackBar = this.snackBar.open('Deleting file(s)…', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            const files = action.payload.templates.map(val => action.payload.path + '\\' + val.name);
            return this.service.deleteTemplateFile(files).pipe(
                mergeMap(result => {
                    snackBar.dismiss();
                    this.snackBar.open('Completed.', null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    });
                    return from([
                        new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: action.payload.appId }),
                        new TemplateDirectory.DeleteItemsSuccess(action.payload)
                    ]);
                }),
                catchError(() => {
                    snackBar.dismiss();
                    return empty();
                }));
        }));
    @Effect()
    deleteItemsSuccess$ = this.actions$.pipe(ofType<TemplateDirectory.DeleteItemsSuccess>(TemplateDirectory.DELETE_ITEMS_SUCCESS),
        switchMap(action => this.store.select(getCopyFrom).pipe(take(1), filter(val => val === SafeBoxType.Template))),
        map((action) => new RemoveCopyFrom()));

    @Effect()
    renameItem$ = this.actions$.pipe(ofType<TemplateDirectory.RenameItem>(TemplateDirectory.RENAME_ITEM),
        switchMap(action => {
            const file = action.payload.path + '\\' + action.payload.template.name;
            return this.service.renameTemplateFile(file, action.payload.newName).pipe(
                map(result => {
                    return new TemplateDirectory.RenameItemSuccess(action.payload);
                }),
                catchError(() => empty()));
        }));
    @Effect()
    renameItemSuccess$ = this.actions$.pipe(ofType<TemplateDirectory.RenameItemSuccess>(TemplateDirectory.RENAME_ITEM_SUCCESS),
        switchMap(action => this.store.select(getCopyFrom).pipe(take(1), filter(val => val === SafeBoxType.Template))),
        map((action) => new RemoveCopyFrom()));

    @Effect()
    uploadFiles$ = this.actions$.pipe(ofType<TemplateDirectory.UploadFiles>(TemplateDirectory.UPLOAD_FILES),
        switchMap(action => combineLatest(
            this.store.select(getSelectedAppView),
            (appView) => ({ appView })
        ).pipe(
            take(1),
            switchMap(({ appView }) => {
                const snackBar = this.snackBar.open('Uploading file(s)…', null, {
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                });
                const observableBatch = action.payload.files.map(file => {
                    const data = new FormData();
                    data.append('files', <any>file);
                    data.append('filefullPath', action.payload.path);
                    return this.service.uploadTemplateFile(data);
                });
                return forkJoin(observableBatch).pipe(map(response => {
                    snackBar.dismiss();
                    this.snackBar.open('Completed.', null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    });
                    return new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: appView.app.appId });
                }), catchError(error => {
                    snackBar.dismiss();
                    return of(new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: appView.app.appId }));
                }));
            })
        )));

    @Effect()
    addNewItem$ = this.actions$.pipe(ofType<TemplateDirectory.AddNewItem>(TemplateDirectory.ADD_NEW_ITEM),
        switchMap((action) => {
            const snackBar = this.snackBar.open('Creating new Template...', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            return this.service.generateTemplate(action.payload.name + action.payload.type, action.payload.appId,
                action.payload.isCommon).pipe(map(response => {
                    snackBar.dismiss();
                    this.snackBar.open('Completed.', null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right'
                    });
                    return new TemplateDirectory.GetTemplateList(<AppInfo>{ appId: action.payload.appId });
                }), catchError(error => {
                    snackBar.dismiss();
                    return empty();
                }));
        }));

}
