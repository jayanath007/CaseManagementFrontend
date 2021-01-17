import { CheckoutTempalteFiles } from './../actions/document-editing';
import { switchMap, catchError, mergeMap, filter, take, tap, map, retryWhen } from 'rxjs/operators';
import { of, empty, Observable, throwError as _throw, from } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FileUrlResolverService } from '../services/file-url-resolver.service';
import * as EditAct from '../actions/document-editing';
import { WindowPopupsManagerService } from '../services/window-popups-manager.service';
import { fitWindow } from '../../utils/bounds';
import * as Auth from '../../auth';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../shared';
import { MatDialog } from '@angular/material';
import * as WindowPopup from '../../document-view/actions/window-popups';
import { LocalStorageKey } from '../../core';
import { OfficeUriSchemes } from '../../core/lib/office-uri-schemes';
import { FileManagerType } from '../models/interfaces';
@Injectable()
export class DocumentEditingEffect {

    constructor(protected store: Store<any>, private actions$: Actions,
        public dialog: MatDialog,
        private urlResolver: FileUrlResolverService,
        private popupService: WindowPopupsManagerService,
    ) { }

    @Effect()
    checkoutDiraryItemDoc$ = this.actions$.pipe(ofType<EditAct.CheckoutDiaryItemDoc>(EditAct.CHECKOUT_DIARY_ENTRY_DOC),
        mergeMap((action) => {
            return this.urlResolver.checkOutFileWithDiaryEntry(action.payload.diaryId).pipe(
                map((docCheckin) => new EditAct.FileCheckoutSuccess(docCheckin, action.payload)),
                catchError((error) => of(new EditAct.FileCheckoutFailed(FileManagerType.FileWithDiaryEntryManager, action.payload)))
            );
        }));


    @Effect()
    checkoutDiaryFile$ = this.actions$.pipe(ofType<EditAct.CheckoutDocWithPathInfo>(EditAct.CHECKOUT_DOC_WITH_PATH_INFO),
        mergeMap((action) => {
            return this.urlResolver.checkOutFileWithOutDiaryEntry(action.payload.branchId,
                action.payload.appId, action.payload.fileId, action.payload.fileName).pipe(
                    map((docCheckin) => new EditAct.FileCheckoutSuccess(docCheckin, action.payload)),
                    catchError((error) => of(new EditAct.FileCheckoutFailed(FileManagerType.FileWithOutDiaryEntryManager, action.payload)))
                );
        }));

    @Effect()
    checkoutTempalte$ = this.actions$.pipe(ofType<EditAct.CheckoutTempalteFiles>(EditAct.CHECKOUT_TEMPALTE_FILE),
        mergeMap((action) => {
            const appId = action.payload.appId;
            const fileName = action.payload.fileName;
            const isCommon = action.payload.isCommon;
            return this.urlResolver.checkOutDpsTempalte(appId, fileName, isCommon)
                .pipe(
                    retryWhen(this.genericTempalteRetryStrategy(appId, fileName)),
                    map((data) => {
                        if (data.data) {
                            const docCheckin = {
                                fileManagerType: isCommon ? FileManagerType.CommonTemplateManager : FileManagerType.TemplateManager,
                                url: data.data.url,
                                name: data.data.fileName,
                                path: data.data.parentReferencePath,
                                hashKey: data.data.hashKey
                            };
                            return new EditAct.FileCheckoutSuccess(docCheckin, action.payload);
                        } else {
                            const payload = { ...action.payload, response: data };
                            return new EditAct.FileViewOnly(payload);
                        }
                    }),
                    catchError((error) =>
                        of(new EditAct.FileCheckoutFailed(isCommon ?
                            FileManagerType.CommonTemplateManager : FileManagerType.TemplateManager, action.payload))
                    )
                );
        }));




    @Effect()
    fileViewOnly$ = this.actions$.pipe(ofType<EditAct.FileViewOnly>(EditAct.FILE_VIEW_ONLY),
        switchMap((action: EditAct.FileViewOnly) => {

            const message = action.payload.response.detailStatus[0].message;
            const dialogData: ConfirmDialogData = {
                content: {
                    title: 'Document View',
                    message: message,
                    acceptLabel: 'View File',
                    rejectLabel: 'Close'
                },
                data: null
            };
            const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                disableClose: true,
                width: '350px',
                panelClass: 'dps-notification'
            });
            return confirmDialogRef.afterClosed().pipe(mergeMap((dialogResult) => {
                if (dialogResult && dialogResult.kind === ConfirmDialogResultKind.Confirmed) {

                    return this.urlResolver.getTemplateDataUrl(action.payload.appId, action.payload.fileName)
                        .pipe(mergeMap((url) => {
                            return from([
                                new WindowPopup.OpenByUrl({
                                    id: action.payload.appId + '_' + action.payload.fileName,
                                    url: url,
                                    spec: {
                                        ...fitWindow(),
                                    },
                                    attachmentName: ''
                                }),
                                new EditAct.FileCheckoutFailed(FileManagerType.TemplateManager, action.payload)
                            ]);
                        }),
                            catchError((error) =>
                                of(new EditAct.FileCheckoutFailed(FileManagerType.TemplateManager, action.payload))
                            ));

                }
                return from([
                    new EditAct.FileCheckoutFailed(FileManagerType.TemplateManager, action.payload)
                ]);
            }));

        }));

    @Effect({ dispatch: false })
    openDriveEditDoc$ = this.actions$.pipe(ofType<EditAct.FileCheckoutSuccess>(EditAct.FILE_CHECKOUT_SUCCESS),
        tap(action => {
            const schemes = new OfficeUriSchemes(
                action.docCheckin.url,
                action.docCheckin.name,
                action.docCheckin.path);
            if (localStorage.getItem(LocalStorageKey.DocumentOpenType) === 'Descktop Office' && schemes.getSchemeName()) {
                this.store.dispatch(new WindowPopup.OpenByOfficeUriSchemes(schemes, true));
            } else {
                this.popupService.openCheckinWindow(action.docCheckin,
                    {
                        ...fitWindow(),
                        toolbar: false,
                        location: false,
                        directories: false,
                        status: false,
                        menubar: false,
                        scrollbars: false
                    });
            }
        }));

    @Effect()
    checkinFile$ = this.actions$.pipe(ofType<EditAct.CheckinFile>(EditAct.CHECKIN_FILE),
        mergeMap((action) => {
            return this.urlResolver.checkinFile(action.docCheckin.hashKey, action.docCheckin.fileManagerType).pipe(
                map(() => new EditAct.CheckinFileSuccess(action.docCheckin)),
                catchError((error) => of(new EditAct.CheckinFileFail(action.docCheckin)))
            );
        }));

    @Effect()
    discardCheckin$ = this.actions$.pipe(ofType<EditAct.DiscardCheckout>(EditAct.DISCARD_CHECKOUT),
        mergeMap((action) => {
            return this.urlResolver.discardCheckout([action.docCheckin.hashKey]).pipe(
                map(() => new EditAct.DiscardCheckoutSuccess(action.docCheckin)),
                catchError((error) => of(new EditAct.DiscardCheckoutFail(action.docCheckin)))
            );
        }));

    @Effect({ dispatch: false })
    cleanupOnLogin$ = this.actions$.pipe(ofType(Auth.LOGIN_SUCCESS),
        switchMap(() => {
            return this.urlResolver.cleanCheckedOutFiles().pipe(catchError(() => empty()));
        }));

    private genericTempalteRetryStrategy(appId, tempalteName) {
        return (attempts: Observable<any>) => {
            return attempts.pipe(
                mergeMap((error, i) => {
                    if (i === 0 && ([404].includes(error.status) || (error.status === 200 && this.isFileNotExistsError(error.body)))) {
                        return of(true);
                    }
                    return _throw(error);
                }),
                mergeMap(() => {
                    return this.popupService.showtempalteCreateDialog();
                }),
                mergeMap((result) => {
                    return result ? of(true) : _throw('cancel');
                }),
                mergeMap(() => {
                    return this.urlResolver.generateTemplate(appId, tempalteName);
                })
            );
        };
    }

    private isFileNotExistsError(result) {
        // hask to check backend error that comes in 200 status
        if (result.detailStatus && result.detailStatus.length > 0) {
            const error = result.detailStatus[0];
            if (error.message && error.message.includes('not found')) {
                return true;
            }
        }
        return false;
    }


}

