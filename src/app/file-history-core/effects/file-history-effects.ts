
import { tap, take, catchError, map, switchMap, filter, mergeMap } from 'rxjs/operators';
import { TimeInformationInputData } from './../../core/lib/crime-managment';
import { DiaryEditTypes } from './../models/interface';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import * as FileHistory from '../actions/core';
import {
    getFileHistoryByToken,
    getFileHistoryHashByToken,
    getFileHistoryGridDataByToken,
    getCurrentHashByToken,
    getIsDataLoadedByToken,
    getFileHistoryGroupDataByRow,
    getSelectedAttachmentsByToken
} from '../reducers';
import {
    FileHistoryRequest, DocumentURLRequest, LoadFileHistoryGridDataByGroupRequest,
    FilterFileHistoryGridDataByGroupRequest, DataSourceRequestViewModel
} from '../models/file-history-request';
import { combineLatest, of, empty, from, ObservableInput, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as FileHistoryCore from '../actions/core';
import { FileHistoryService } from '../services/file-history.service';
import { FileItemWrapper, GroupMode } from '../models/interface';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { RowItemChangeKind } from '../actions/core';
import { FileUrlResolverService } from '../../document-view';
import { centerToWindow } from '../../utils/bounds';
import { isMobile } from '../../utils/is-mobile';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { LocalStorageKey } from '../../core/lib/local-storage';
import { getUser } from '../../auth';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { AddNoteCloseInfo, AddNoteInPutData } from '../../core/lib/addNote';
import { MatDialog } from '@angular/material';
import { TimeRecordingCloseInfo } from '../../time-recording-core/models/enum';
import { TimeRecordInputData } from '../../time-recording-core/models/interfaces';
import { FileHistoryUiService } from '../services/file-history-ui.service';
import { dpsNewDate } from '../../utils/javascriptDate';
import { getFileTypeByFullFileName } from '../../core/utility/DpsUtility';
import { WebViewService } from '../../azure-storage';
import { v3CanViewExtensions, MatterInfo } from '../../core';
import { CivilTimeRecordingModuleInput } from '../../civil-time-recording-desktop';
import { RemoveOutlookJournalStatus } from '../../mail-item-core';


@Injectable()
export class FileHistoryEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private popupService: SystemJsPopupLoaderService,
        private service: FileHistoryService,
        private windowPopupsManagerService: WindowPopupsManagerService,
        private urlResolver: FileUrlResolverService,
        private webViewService: WebViewService,
        private urlPopupService: UrlPopupService, private dialog: MatDialog, private uiService: FileHistoryUiService) { }


    @Effect()
    initNewView$ = this.actions$.pipe(ofType<FileHistoryCore.InitFileHistory>(FileHistoryCore.INIT_FILE_HISTORY),
        mergeMap((action) => {
            return from([new FileHistoryCore.LoadFileHistoryDataWithCurrentState(action.token),
            new FileHistoryCore.LoadFolderList(action.token, { AppId: action.payload.matterInfo.AppId })
            ]);
        }));



    @Effect()
    LoadFromDate$ = this.actions$.pipe(ofType<FileHistoryCore.LoadFolderList>(FileHistoryCore.LOAD_FOLDER_LIST),
        filter(action => {
            return (action.payload.AppId !== null);
        }),
        switchMap(action => {
            return this.service.getFolders(action.payload.AppId).pipe(
                map((response) =>
                    new FileHistoryCore.LoadFolderListSuccess(action.token, { folderList: response })),
                catchError(error => of(new FileHistoryCore.LoadFolderListFail(action.token))));
        }));

    @Effect()
    fileHistoryViewChange$ = this.actions$.pipe(ofType<FileHistoryCore.FileHistoryViewChange>(FileHistoryCore.FILE_HISTORY_CHANGE),
        map((action) => new FileHistoryCore.LoadFileHistoryDataWithCurrentState(action.token)));
    @Effect()
    fullTextChange$ = this.actions$.
        pipe(ofType<FileHistoryCore.FileHistoryFullTextSearch>(FileHistoryCore.GET_FILE_HISTORY_FULL_TEXT_SEARCH),
            map((action) => new FileHistoryCore.LoadFileHistoryDataWithCurrentState(action.token)));

    @Effect()
    fileHistoryRefresh$ = this.actions$.pipe(ofType<FileHistoryCore.FileHistoryRefresh>
        (FileHistoryCore.FILE_HISTORY_REFRESH),
        switchMap((action) => {
            return this.store.select(getCurrentHashByToken(action.token)).pipe(
                map(hash => ({ token: action.token, hash: hash })), take(1), tap((item) => {
                    return item;
                }));
        }),
        filter((info) => {
            return (info.hash !== null && info.hash !== undefined);
        }),
        switchMap((action) => {
            return combineLatest(this.store.select(getFileHistoryByToken(action.token)),
                this.store.select(getFileHistoryHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) => {
                        console.log('FILE_HISTORY_REFRESH');
                        return new FileHistoryRequest({
                            SearchText: info.state ? info.state.searchText : '',
                            BranchId: info.state ? info.state.matterInfo.BranchId : null,
                            AppCode: info.state ? info.state.matterInfo.AppCode : '',
                            FileId: info.state ? info.state.matterInfo.FileId : null,
                            IsSearchFullText: info.state ? info.state.isSearchFullText : false,
                        }, {
                            take: info.state.pageEvent.pageSize,
                            filter: toODataFilter(info.state.columnDef),
                            skip: getPaginatorSkip({
                                currentPage: info.state.pageEvent.pageIndex,
                                itemPerPage: info.state.pageEvent.pageSize
                            }),
                            sort: toODataSort(info.state.columnDef)
                        }, info.hash);
                    }),
                    take(1),
                    map((request) => {
                        return new FileHistoryCore.LoadFileHistoryGridData(action.token, request);
                    }));
        }));


    @Effect()
    loadCurrentStateData$ = this.actions$.pipe(ofType<FileHistoryCore.LoadFileHistoryDataWithCurrentState>
        (FileHistoryCore.LOAD_FILE_HISTORY_DATA_WITH_CURRENT_STATE),
        switchMap<FileHistoryCore.LoadFileHistoryDataWithCurrentState, { hasHash: boolean, token: string }>((action) =>
            this.store.select(getIsDataLoadedByToken(action.token)).pipe(
                map(hasHash => ({ token: action.token, hasHash: hasHash })), take(1))
        ),
        filter((info) => !info.hasHash),
        switchMap((action) =>

            combineLatest(this.store.select(getFileHistoryByToken(action.token)),
                this.store.select(getFileHistoryHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) =>
                        new FileHistoryRequest({
                            SearchText: info.state ? info.state.searchText : '',
                            BranchId: info.state ? info.state.matterInfo.BranchId : null,
                            AppCode: info.state ? info.state.matterInfo.AppCode : '',
                            FileId: info.state ? info.state.matterInfo.FileId : null,
                            IsSearchFullText: info.state ? info.state.isSearchFullText : false,
                        }, {
                            take: info.state.pageEvent.pageSize,
                            filter: toODataFilter(info.state.columnDef),
                            skip: getPaginatorSkip({
                                currentPage: info.state.pageEvent.pageIndex,
                                itemPerPage: info.state.pageEvent.pageSize
                            }),
                            sort: toODataSort(info.state.columnDef)
                        }, info.hash)
                    ),
                    take(1),
                    map((request) => new FileHistoryCore.LoadFileHistoryGridData(action.token, request))),
        ));







    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<FileHistoryCore.LoadFileHistoryGridData>(FileHistoryCore.LOAD_FILE_HISTORY_GRID_DATA),
        switchMap((action) =>
            this.store.select(getFileHistoryByToken(action.token)).pipe(
                map((state) => {
                    return { state: state, action: action };
                }), take(1))
        ),
        switchMap((data) => {
            if (data.state.groupMode === GroupMode.Default) {

                return this.service.getFilehistory(data.action.request).pipe(
                    map((result) => {
                        return new FileHistoryCore.LoadFileHistoryGridDataSuccess(data.action.token,
                            { response: result, request: data.action.request });
                    }),
                    catchError((error) => of(new FileHistoryCore.LoadFileHistoryGridDataFail(data.action.token, error)))
                ) as ObservableInput<any>;

            } else {
                return this.service.getFilehistoryGroup(data.action.request, data.state.groupMode).pipe(
                    map((result) => {
                        return new FileHistoryCore.LoadFileHistoryGroupSuccess(data.action.token, result);
                    }),
                    catchError((error) => of(new FileHistoryCore.LoadFileHistoryGridDataByGroupFail(data.action.token, error)))
                ) as ObservableInput<any>;
            }
        }));



    @Effect()
    GetSignToken$ = this.actions$.pipe(ofType<FileHistoryCore.GetSignatureToken>(FileHistoryCore.GET_SIGN_TOKEN),
        switchMap(action =>
            this.service.getSingToken(action.payload.password, action.payload.needPasswordHash,
                action.payload.row.data.diary_UID, action.payload.passwordHash).pipe(
                    map((result) =>
                        new FileHistoryCore.GetSignatureTokenSuccess(action.token,
                            { row: action.payload.row, signatureTokenResponce: result, needToSaveHash: action.payload.needPasswordHash })),
                    catchError((error) => of(new FileHistoryCore.GetSignatureTokenFail(action.token))))
        ));

    @Effect({ dispatch: false })
    savedSignaturePWHash$ = this.actions$.pipe(ofType<FileHistoryCore.GetSignatureTokenSuccess>(FileHistoryCore.GET_SIGN_TOKEN_SUCCESS),
        filter(action => !!action.payload.signatureTokenResponce.passwordHash && action.payload.needToSaveHash),
        tap(action => localStorage.setItem(LocalStorageKey.SignatureTokenHash, action.payload.signatureTokenResponce.passwordHash))
    );

    @Effect({ dispatch: false })
    clearSignaturePWHash$ = this.actions$.pipe(ofType<FileHistoryCore.GetSignatureTokenFail>(FileHistoryCore.GET_SIGN_TOKEN_FAIL),
        tap(() => localStorage.removeItem(LocalStorageKey.SignatureTokenHash))
    );

    @Effect()
    GetSignAndSendUrl$ = this.actions$.pipe(ofType<FileHistoryCore.GetSignatureTokenSuccess>(FileHistoryCore.GET_SIGN_TOKEN_SUCCESS),
        switchMap(action =>
            this.urlResolver.getSignAndSendPDFDocumentUrl(action.payload.row.data.diary_UID, action.payload.signatureTokenResponce.signatureToken).pipe(
                map((result) =>
                    new FileHistoryCore.GetSignatureDocUrl(action.token,
                        {
                            row: action.payload.row,
                            url: result
                        }
                    )
                ))
        ));

    @Effect()
    loadSignAndSend$ = this.actions$.pipe(ofType<FileHistoryCore.GetSignatureDocUrl>(FileHistoryCore.GET_SIGN_AND_SEND_DOC_URL),
        map(action => new FileHistoryCore.LoadSignAndSendDocSuccess(action.token,
            { url: action.payload.url, request: new DocumentURLRequest(action.payload.row) }
        ))
    );

    @Effect()
    fileHistoryGridRowChangeIsExpand$ = this.actions$.pipe(
        ofType<FileHistoryCore.FileHistoryGridRowChange>(FileHistoryCore.FILE_HISTORY_GRID_ROW_CHANGE),
        filter((action) => (!action.payload.row.isExpand) &&
            (action.payload.kind === RowItemChangeKind.IsExpand ||
                action.payload.kind === RowItemChangeKind.SetPassword ||
                action.payload.kind === RowItemChangeKind.ValidateUserPassword
            )),
        switchMap<any, any>((action) => {
            if (action.payload.kind === RowItemChangeKind.IsExpand || action.payload.kind === RowItemChangeKind.SetPassword) {
                return of(new FileHistoryCore.LoadDocumentURL(action.token, new DocumentURLRequest(action.payload.row)));
            } else if (action.payload.kind === RowItemChangeKind.ValidateUserPassword) {

                return this.service.checkPassword(action.payload.row.data.diary_UID.toString(),
                    action.payload.value).pipe(map((data) => {
                        if (data.data) {
                            // action.payload.row.password =   action.payload.value;
                            const newRow = Object.freeze({ ...action.payload.row, password: action.payload.value });
                            return new FileHistoryCore.FileHistoryGridRowChange
                                (action.token, { kind: RowItemChangeKind.SetPassword, row: newRow, value: action.payload.value });
                        } else {
                            this.service.passwordInvalid();
                            return new FileHistoryCore.FileHistoryGridRowChange
                                (action.token,
                                    { kind: RowItemChangeKind.IsCollapse, row: action.payload.row, value: action.payload.value });
                        }
                    }), catchError((data) => {
                        return empty();
                    }));
            }
        }));



    @Effect()
    fileHistoryGridRowChangeDeleteRow$ = this.actions$.pipe(
        ofType<FileHistoryCore.FileHistoryGridRowChange>(FileHistoryCore.FILE_HISTORY_GRID_ROW_CHANGE),
        filter((action) => action.payload.kind === RowItemChangeKind.DeleteRow),
        switchMap((action) => {
            return this.service.deleteDiaryRecords([action.payload.row.data.diary_UID]).pipe(
                map((result) => new FileHistoryCore.DeleteDiaryRecordsSuccess(action.token,
                    { isMulti: false, diaryIds: [action.payload.row.data.diary_UID] })
                ),
                catchError((error) => of(new FileHistoryCore.DeleteDiaryRecordsFail(action.token))));
        }));

    @Effect()
    fileHistoryGridMultipleDeleteRow$ = this.actions$.pipe(
        ofType<FileHistoryCore.DeleteMultipleDiaryRecords>(FileHistoryCore.DELETE_MULTIPLE_DIARY_RECORDS),
        switchMap(action =>
            this.store.select(getSelectedAttachmentsByToken(action.token)).pipe(
                take(1),
                map(rows => ({ rows, action }))
            )
        ),
        switchMap(({ rows, action }) => {
            if (rows && rows.length > 0) {
                return this.service.deleteDiaryRecords(rows.map(row => row.data.diary_UID)).pipe(
                    map((result) => new FileHistoryCore.DeleteDiaryRecordsSuccess(action.token,
                        { isMulti: true, diaryIds: rows.map(row => row.data.diary_UID) }
                    )),
                    catchError((error) => of(new FileHistoryCore.DeleteDiaryRecordsFail(action.token)))
                ) as Observable<any>;
            } else {
                return of(new FileHistoryCore.AllDataUpdate(action.token));
            }

        })
    );

    @Effect()
    deleteDiaryRecordsSuccess$ = this.actions$.pipe(
        ofType<FileHistoryCore.DeleteDiaryRecordsSuccess>(FileHistoryCore.DELETE_DIARY_RECORDS_SUCCESS),
        map(action => new FileHistoryCore.FileHistoryRefresh(action.token))
    );

    @Effect()
    removeOutlookJournalStatus$ = this.actions$.pipe(
        ofType<FileHistoryCore.DeleteDiaryRecordsSuccess>(FileHistoryCore.DELETE_DIARY_RECORDS_SUCCESS),
        map(action => new RemoveOutlookJournalStatus(action.payload.diaryIds))
    );

    @Effect()
    loadDocumentUrlView$ = this.actions$.pipe(ofType<FileHistoryCore.LoadDocumentURL>
        (FileHistoryCore.LOAD_DOCUMENT_URL_LOAD),
        map((action) => {

            const extention = this.getFileType(action.request.row);
            if (extention === 'msg' || extention === 'eml') {
                return new FileHistoryCore.GetEmailItemForMSG(action.token, action.request);
            } else if (v3CanViewExtensions.filter(p => p === extention).length > 0) {
                return new FileHistoryCore.LoadWebViewUrl(action.token, action.request);
            } else {
                return new FileHistoryCore.LoadDocumentURLFail(action.token, { request: action.request });
            }
        }));

    @Effect({ dispatch: false })
    openInNewTab$ = this.actions$.pipe(ofType<FileHistoryCore.LoadDocumentURLSuccess>
        (FileHistoryCore.LOAD_DOCUMENT_URL_LOAD_SUCCESS), tap((data) => {
            const isMobileDevice = isMobile().any();
            if (isMobileDevice) {
                console.log(data);
                const spec = {
                    ...centerToWindow(800, 600),
                    toolbar: false,
                    location: false,
                    directories: false,
                    status: false,
                    menubar: false,
                    scrollbars: false,
                };
                this.windowPopupsManagerService.openWindow(data.payload.request.row.data.diary_UID.toString(),
                    data.payload.url, spec, data.payload.request.row.data.letter_icon);
            }
        }));


    @Effect({ dispatch: false })
    openInNewTabMsg$ = this.actions$.pipe(
        ofType<FileHistoryCore.GetEmailItemForMSGSuccess>(FileHistoryCore.LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS),
        switchMap(action => this.store.select(getFileHistoryByToken(action.token)).pipe(
            take(1),
            map(state => ({ matterInfo: state.matterInfo, data: action.payload }))
        )),
        tap(({ matterInfo, data }) => {
            const isMobileDevice = isMobile().any();
            if (isMobileDevice) {
                this.popupService.openMsgViewer({
                    viewerFrom: 'diary',
                    diaryInput: {
                        appCode: matterInfo.AppCode, branchId: matterInfo.BranchId, fileId: matterInfo.FileId,
                        itemRef: data.row.data.diary_UID, attachmentName: data.row.data.letter_name
                    }
                });
            }
        }));


    @Effect()
    loadDiaryWebViewUrl$ = this.actions$.pipe(
        ofType<FileHistoryCore.LoadWebViewUrl>(FileHistoryCore.LOAD_WEB_VIEW_URL),
        switchMap(action => this.store.select(getFileHistoryByToken(action.token)).pipe(
            take(1),
            map(state => ({ matterInfo: state.matterInfo, action }))
        )),
        mergeMap(({ matterInfo, action }) => {
            const data = action.request.row.data;
            return this.webViewService.getDiaryWebViewUrl(matterInfo.AppCode, matterInfo.BranchId,
                matterInfo.FileId, data.diary_UID, data.letter_name).pipe(
                    map((url) => {
                        return new FileHistoryCore.LoadDocumentURLSuccess(action.token, { url: url, request: action.request });
                    }),
                    catchError(() => {
                        return of(new FileHistoryCore.LoadDocumentURLFail(action.token, { request: action.request }));
                    }));
        }
        ));


    @Effect()
    shareDiaryItemOnSafebox$ = this.actions$.pipe(ofType<FileHistoryCore.ShareDiaryItemOnSafebox>
        (FileHistoryCore.SHARE_DIARY_ITEM_ON_SAFE_BOX),
        switchMap((action) => {
            return this.service.shareDiaryItemOnSafebox(action.payload.matterRef,
                action.payload.rows.map(data => ({ DiaryId: data.row.data.diary_UID, Password: data.password }))).pipe(
                    map((data) => {
                        if (data.data) {
                            if (data.data.lokuoList) {
                                localStorage.setItem(
                                    LocalStorageKey.SECommandEmailList,
                                    JSON.stringify(data.data.lokuoList.filter(val => !!val.email).map(val => {
                                        return {
                                            contactType: val.contactType, recipient:
                                                { emailAddress: { address: val.email, name: val.name || val.email } }
                                        };
                                    }))
                                );
                            }
                            const encodeId = encodeURIComponent(data.data.id.id);
                            const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                            this.urlPopupService.openWithUrlPoup(urlPath, data.data.id.id, false, false);

                            return new FileHistoryCore.ShareDiaryItemOnSafeboxSuccess(action.token, action.payload);
                        } else {
                            return new FileHistoryCore.ShareDiaryItemOnSafeboxFail(action.token, action.payload);
                        }
                    }), catchError((error) => {
                        return of(new FileHistoryCore.ShareDiaryItemOnSafeboxFail(action.token, action.payload));
                    }));
        }));


    @Effect()
    xdrftOnEdit$ = this.actions$.pipe(
        ofType<FileHistoryCore.FileHistoryGridRowChange>(FileHistoryCore.FILE_HISTORY_GRID_ROW_CHANGE),
        filter((action) => action.payload.kind === RowItemChangeKind.DocumentEditUpdate),
        filter((action) => action.payload.row.data.offlineStates === 3), // achive file
        switchMap((action) => this.uiService.showArchiveXDraftConfirm(action.payload.row)
            .pipe(map((data) => ({ note: data.xNote, item: action.payload.row, token: action.token })))),
        filter((data) => !!data.note && data.note !== ''),
        map(data => new FileHistoryCore.XdraftItemChange(data.token,
            { kind: RowItemChangeKind.Xdraft, row: data.item, value: data.note }))
    );

    @Effect()
    XdraftItem$ = this.actions$.pipe(ofType<FileHistoryCore.XdraftItem>(FileHistoryCore.XDRAFT_ITEM),
        switchMap(action =>
            this.service.selectXdraftItem(action.payload.itemKey, action.payload.row.data.diary_UID).pipe(
                map((result) =>
                    new FileHistoryCore.XdraftItemSuccess(action.token, { responce: result, selectData: action.payload })),
                catchError((error) => of(new FileHistoryCore.XdraftItemFail(action.token))))
        ));

    @Effect()
    XdraftItemChange$ = this.actions$.pipe(ofType<FileHistoryCore.XdraftItemChange>(FileHistoryCore.XDRAFT_ITEM_CHANGE),
        switchMap(action => this.store.select(getUser).pipe(map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            return this.service.XdraftItemSubmit(action.payload.kind, action.payload.row.data.diary_UID,
                action.payload.value, user.general.dateTimeOffset).pipe(
                    mergeMap((result) => {
                        return from([new FileHistoryCore.XdraftItemChangeSuccess(action.token, {
                            responce: result,
                            inputItem: action.payload.row
                        })]);
                    })).pipe(catchError(error => of(new FileHistoryCore.XdraftItemChangeFail(action.token))));
        }));

    @Effect()
    xdraftItemChangeSuccess$ = this.actions$.pipe(ofType<FileHistoryCore.XdraftItemChangeSuccess>
        (FileHistoryCore.XDRAFT_ITEM_CHANGE_SUCCESS),
        switchMap((action) =>
            combineLatest(this.store.select(getFileHistoryByToken(action.token)),
                this.store.select(getFileHistoryHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) => {
                        if (info.state.groupMode === GroupMode.Default) {
                            return new FileHistoryRequest({
                                SearchText: info.state ? info.state.searchText : '',
                                BranchId: info.state ? info.state.matterInfo.BranchId : null,
                                AppCode: info.state ? info.state.matterInfo.AppCode : '',
                                FileId: info.state ? info.state.matterInfo.FileId : null,
                                IsSearchFullText: info.state ? info.state.isSearchFullText : false,
                            }, {
                                take: info.state.pageEvent.pageSize,
                                filter: toODataFilter(info.state.columnDef),
                                skip: getPaginatorSkip({
                                    currentPage: info.state.pageEvent.pageIndex,
                                    itemPerPage: info.state.pageEvent.pageSize
                                }),
                                sort: toODataSort(info.state.columnDef)
                            }, info.hash);
                        } else {
                            const filterOptions: FilterFileHistoryGridDataByGroupRequest = {
                                SearchText: info.state ? info.state.searchText : '',
                                BranchId: info.state ? info.state.matterInfo.BranchId : null,
                                AppCode: info.state ? info.state.matterInfo.AppCode : '',
                                FileId: info.state ? info.state.matterInfo.FileId : null,
                                IsSearchFullText: info.state ? info.state.isSearchFullText : false,
                            };
                            const dataSourceInfo: DataSourceRequestViewModel = {
                                take: info.state.pageEvent.pageSize,
                                // filter: filter,
                                filter: toODataFilter(info.state.columnDef),
                                skip: getPaginatorSkip({
                                    currentPage: info.state.pageEvent.pageIndex,
                                    itemPerPage: info.state.pageEvent.pageSize
                                }),
                                sort: toODataSort(info.state.columnDef)
                            };
                            return new LoadFileHistoryGridDataByGroupRequest(filterOptions,
                                dataSourceInfo,
                                info.hash,
                                action.payload.inputItem);
                        }



                    }),
                    take(1),
                    switchMap((request) => {
                        if (request instanceof FileHistoryRequest) {
                            return this.service.getFilehistory(request).pipe(
                                map((result) => {
                                    return new FileHistoryCore.XdraftFileHistoryGridDataSuccess(action.token,
                                        { response: result, request: request, fileUid: action.payload.responce });
                                }));
                        } else {
                            request['row'] = action.payload.inputItem.groupRow;
                            return this.service.getFileHistoryByGroup(request).pipe(
                                map((result) => {
                                    return new FileHistoryCore.XdraftFileHistoryGridDataSuccess(action.token,
                                        { response: result, request: request, fileUid: action.payload.responce });
                                }));
                        }
                    }))));


    @Effect()
    XdraftIdtem$ = this.actions$.pipe(ofType<FileHistoryCore.XdraftFileHistoryGridDataSuccess>
        (FileHistoryCore.XDRAFT_LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS),
        switchMap(info =>
            combineLatest(
                this.store.select(getIsDataLoadedByToken(info.token)),
                this.store.select(getFileHistoryGridDataByToken(info.token)),
                (isDataLoad, gridData) =>
                    ({ isDataLoad, gridData, token: info.token, payload: info.payload })
            ).pipe(take(1),
                filter((data) => data.isDataLoad !== undefined),
                map((data) => {
                    const row = data.gridData.data.find(r => r.data.diary_UID === data.payload.fileUid);
                    return new FileHistory.FileHistoryGridRowChange(data.token,
                        { kind: RowItemChangeKind.IsExpand, row: row, value: 'IsXdrafChange' });

                }))
        ));



    @Effect()
    emailItemData$ = this.actions$.pipe(ofType<FileHistoryCore.GetEmailItemForMSG>(FileHistoryCore.LOAD_EMAIL_ITEM_FROM_DIARY),
        map((action) => new FileHistoryCore.GetEmailItemForMSGSuccess(action.token, {
            emailItem: true,
            row: action.request.row
        }))
        // switchMap((action) => {
        //     return this.service.getMailItemByDiary(action.request.row).pipe(
        //         map((result) => new FileHistoryCore.GetEmailItemForMSGSuccess(action.token, {
        //             emailItem: result,
        //             row: action.request.row
        //         })),
        //         catchError((data) => {
        //             return of(new FileHistoryCore.LoadDocumentURLFail(action.token, { request: action.request }));
        //         }));
        // })
    );








    @Effect()
    fileHistoryGroupChange$ = this.actions$.pipe(ofType<FileHistoryCore.ExpandFileHistoryGroup>
        (FileHistoryCore.EXPAND_FILE_HISTORY_GROUP),
        filter((action) => action.payload.row.isLefNode),
        switchMap((action) => {
            return this.store.select(getFileHistoryGroupDataByRow(action.token, action.payload.row)).pipe(
                map((gridData) => {
                    return { hasData: (gridData.length > 0) ? true : false, action: action };
                }), take(1));
        }),
        filter((actionInfo) => !actionInfo.hasData),
        switchMap((actionInfo) => {
            return combineLatest(this.store.select(getFileHistoryByToken(actionInfo.action.token)),
                this.store.select(getFileHistoryHashByToken(actionInfo.action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) => {

                        const filterOptions: FilterFileHistoryGridDataByGroupRequest = {
                            SearchText: info.state ? info.state.searchText : '',
                            BranchId: info.state ? info.state.matterInfo.BranchId : null,
                            AppCode: info.state ? info.state.matterInfo.AppCode : '',
                            FileId: info.state ? info.state.matterInfo.FileId : null,
                            IsSearchFullText: info.state ? info.state.isSearchFullText : false,
                        };
                        const dataSourceInfo: DataSourceRequestViewModel = {
                            take: 50,
                            filter: toODataFilter(info.state.columnDef),
                            skip: 0,
                            sort: toODataSort(info.state.columnDef)
                        };
                        return new LoadFileHistoryGridDataByGroupRequest(filterOptions,
                            dataSourceInfo,
                            info.hash,
                            actionInfo.action.payload.row);
                    }),
                    take(1), map((request) => {

                        return new FileHistoryCore.LoadFileHistoryGridDataByGroup(actionInfo.action.token, {
                            request: request
                        });
                    }));
        }));



    @Effect()
    fileHistoryGroupLoadMore$ = this.actions$.pipe(ofType<FileHistoryCore.FileHistoryGroupLoadMore>
        (FileHistoryCore.FILE_HISTORY_GROUP_LOAD_MORE),
        switchMap((action) => {
            return combineLatest(this.store.select(getFileHistoryByToken(action.token)),
                this.store.select(getFileHistoryHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) => {

                        const filterOptions: FilterFileHistoryGridDataByGroupRequest = {
                            SearchText: info.state ? info.state.searchText : '',
                            BranchId: info.state ? info.state.matterInfo.BranchId : null,
                            AppCode: info.state ? info.state.matterInfo.AppCode : '',
                            FileId: info.state ? info.state.matterInfo.FileId : null,
                            IsSearchFullText: info.state ? info.state.isSearchFullText : false,
                        };
                        const dataSourceInfo: DataSourceRequestViewModel = {
                            take: 50,
                            filter: toODataFilter(info.state.columnDef),
                            skip: action.payload.row.currentItems,
                            sort: toODataSort(info.state.columnDef)
                        };
                        return new LoadFileHistoryGridDataByGroupRequest(filterOptions,
                            dataSourceInfo,
                            info.hash,
                            action.payload.row);
                    }),
                    take(1), map((request) => {

                        return new FileHistoryCore.LoadFileHistoryGridDataByGroup(action.token, {
                            request: request
                        });
                    }));
        }));




    @Effect()
    loadFileHistoryGridData$ = this.actions$.pipe(ofType<FileHistoryCore.LoadFileHistoryGridDataByGroup>
        (FileHistoryCore.LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP),
        switchMap((action) => {
            return this.service.getFileHistoryByGroup(action.payload.request).pipe(
                map((result) => new FileHistoryCore.LoadFileHistoryGridDataByGroupSuccess(action.token,
                    { response: result, request: action.payload.request })),
                catchError((error) => of(new FileHistoryCore.LoadFileHistoryGridDataByGroupFail(action.token, error))));
        }));



    @Effect()
    MoveSelectedFolder$ = this.actions$.pipe(ofType<FileHistoryCore.MoveSelectedFolder>(FileHistoryCore.MOVE_SELECTED_FOLDER),
        switchMap(action => {
            let ids: number[] = [];
            action.payload.rows.map(r => {
                ids = ids.concat(r.data.diary_UID);
            });
            return this.service.moveSelctedFolder(ids, action.payload.folderId).pipe(
                map(() => {
                    return new FileHistoryCore.FileHistoryRefresh(action.token);
                }),
                catchError((error) => of(new FileHistoryCore.MoveSelectedFolderFail(action.token))));
        }));


    @Effect()
    fileHistoryGridRowChangeIsEditRow$ = this.actions$.pipe(
        ofType<FileHistoryCore.FileHistoryGridRowChange>(FileHistoryCore.FILE_HISTORY_GRID_ROW_CHANGE),
        filter((action) => (action.payload.kind === RowItemChangeKind.EditRow)),
        switchMap((action) => combineLatest(
            this.store.select(getFileHistoryByToken(action.token)),
            this.store.select(getUser),
            (data, user) => ({ state: data, action, user })).pipe(take(1))),
        switchMap((infor) => {
            const matterInfo = infor.state.matterInfo;
            return this.service.getDiaryEditItemType(
                infor.action.payload.row.data.diary_UID,
                matterInfo.FileId,
                matterInfo.AppId,
                matterInfo.BranchId,
            ).pipe(map((data) => {
                return { data: data, action: infor.action, user: infor.user, matterInfo };
            }));
        }), switchMap((infor) => {

            if (infor.data === DiaryEditTypes.StandardEvent) {

                return this.openAddNotePopup(infor.action, infor.matterInfo);

            } else if (infor.data === DiaryEditTypes.RecordTimeEvent) {

                return this.service.getFloatingTimeEntryInfo
                    (infor.action.payload.row.data.diary_UID).pipe(filter((data) => (!!data)),
                        switchMap((data) => {
                            return this.openTimeRecordingPopup(infor.action, data, infor.user.general.dateTimeOffset,
                                infor.matterInfo, infor.action.payload.row.data.diary_UID);
                        }));
            } else if (infor.data === DiaryEditTypes.LegalAidCrimeTimeEvent) {

                return this.openCrimeTimeRecordPopup(infor.action, infor.matterInfo);

            } else if (infor.data === DiaryEditTypes.CivilTimeCertificated || infor.data === DiaryEditTypes.CivilTimeLegalHelp) {

                return this.openCivilTimeRecordPopup(infor.action, infor.matterInfo, infor.data);

            } else if (infor.data === DiaryEditTypes.InvalidTimeEvent) {
                return this.openNotSupportMassege(infor.action.token);
            }
            return of();
        }), catchError(error => of()));


    openCrimeTimeRecordPopup(infor: FileHistory.FileHistoryGridRowChange, matterInfo: MatterInfo) {
        const row = infor.payload.row;
        const token = infor.token;
        const input: TimeInformationInputData = {
            matterReferenceNo: matterInfo.MatterReferenceNo,
            branchId: matterInfo.BranchId,
            appId: matterInfo.AppId,
            fileId: matterInfo.FileId,
            classId: row.data.classId,
            crimeTimeId: row.data.crimeTimeId,
            isEdit: true,
            ufnDate: row.data.ufnValue,
        };
        return this.popupService.openTimeInformationPopup('mainTimeInformationPopup', input).pipe(map((value) => {
            return new FileHistoryCore.FileHistoryRefresh(token);
        }), catchError(error => of()));
    }

    openCivilTimeRecordPopup(info: FileHistory.FileHistoryGridRowChange, matterInfo: MatterInfo, civilTime: DiaryEditTypes) {
        const row = info.payload.row;
        const token = info.token;
        const className = civilTime === DiaryEditTypes.CivilTimeCertificated ? 'Certificated' : 'Legal Help';
        const input: CivilTimeRecordingModuleInput = {
            civilClassObj: {
                legalAidCaseId: 0,
                branchId: 0,
                appId: 0,
                fileId: 0,
                openDate: null,
                closeDate: null,
                billDate: null,
                caseId: null,
                licensedOptions: 0,
                caseStageLevel: null,
                feeEarner: null,
                className: className,
                classType: 0,
            },
            diaryId: info.payload.row.data.diary_UID
        };
        return this.popupService.openCiviltimeRecordingPopup('civilTimeInformationPopup', input).pipe(map((value) => {
            return new FileHistoryCore.FileHistoryRefresh(token);
        }), catchError(error => of()));

    }


    openTimeRecordingPopup(infor: FileHistory.FileHistoryGridRowChange, data: any, timeOffset, matterInfo: MatterInfo, diary_UID) {

        const row = infor.payload.row;
        const token = infor.token;

        const input: TimeRecordInputData = {
            matterReferenceNo: matterInfo.MatterReferenceNo,
            feeEarner: data.feeEarner,
            editData: {
                appId: matterInfo.AppId,
                appCode: matterInfo.AppCode,
                bigNote: '',
                billNo: data.billNo,
                billed: data.billed,
                branchId: matterInfo.BranchId,
                client: row.data.client,
                clientName: row.data.client,
                dateBilled: data.dateBilled,
                dateDone: data.dateDone,
                department: '',
                fileId: matterInfo.FileId,
                matter: matterInfo.MatterReferenceNo,
                matterReferenceNo: matterInfo.MatterReferenceNo,
                mpu: data.mpu,
                netBilled: data.netBilled,
                timeEditNote: '', // TimeEditNote
                postingDate: data.postingDate, // PostingDate
                rate: data.rate,
                reviewDate: dpsNewDate(timeOffset),
                timeDetails: data.details,
                timeFeeEarner: data.feeEarner,
                timeUniqueRef: data.timeUniqueRef,
                units: data.units,
                value: data.value,
                timeEditDetails: data.details,
                timerValue: '',
                workType: data.workType,
                eBillingPhaseID: data.eBillingPhaseID,
                eBillingTaskID: data.eBillingTaskID,
                eBillingActivityID: data.eBillingActivityID,
                timeEventId: diary_UID ? diary_UID : 0
            },
            eBilling: matterInfo.eBilling,
        };
        return this.popupService.openTimeRecordingPopup('TimeRecordingEditRecord-'
            + matterInfo.MatterReferenceNo, input).pipe(
                map((value) => {
                    if (value === TimeRecordingCloseInfo.ExitWithSaveSuccess) {
                        return new FileHistoryCore.FileHistoryRefresh(token);
                    } else {
                        return new FileHistoryCore.FileHistoryGridRowEditCancel(token, '');
                    }
                }), catchError(error => of()));
    }


    openNotSupportMassege(token) {
        const dialogData: InforDialogData = {
            content: {
                title: 'Edit',
                message: 'Sorry...\nCurrent Spitfire version doesn\'t support this action on this matter.'
            },
            data: { messageType: 'warning' }
        };
        console.log('dialogData', dialogData);
        // popup dialog
        return this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '400px',
            disableClose: true,
            hasBackdrop: false,
            panelClass: 'dps-notification'
        }).afterClosed().pipe(map((data) => {
            return new FileHistoryCore.FileHistoryGridRowEditCancel(token, '');
        }));
    }

    openAddNotePopup(infor: FileHistory.FileHistoryGridRowChange, matterInfo: MatterInfo) {
        const row = infor.payload.row;
        const token = infor.token;
        if (row.data.type === 'TA') {
            return this.openNotSupportMassege(token);
        } else {

            const diaryType = null;
            const matterData = {
                MatterReferenceNo: matterInfo.MatterReferenceNo,
                BranchID: matterInfo.BranchId,
                AppID: matterInfo.AppId,
                FeeEarner: row.data.for,
                ClientName: row.data.client,
                RateCategory: null,
                FileID: matterInfo.FileId,
                AppCode: matterInfo.AppCode,
                eBilling: matterInfo.eBilling,
                isPlotMasterMatter: matterInfo.isPlotMasterMatter,
                isProspectMatter: row.data.isProspectMatter,
                isLegalAid: matterInfo.isLegalAid
            };
            const legalAid = null;
            const input: AddNoteInPutData = {
                isEdit: true,
                type: row.data.type,
                uid: row.data.diary_UID,
                matterData: matterData,
                diaryType: diaryType,
                legalAid: legalAid,
            };
            return this.popupService.openAddNotePopup('editAddNoteNotePopup', input).pipe(map((data) => {
                if (data === AddNoteCloseInfo.ExitWithSaveSuccess) {
                    return new FileHistoryCore.FileHistoryRefresh(token);
                } else {
                    return new FileHistoryCore.FileHistoryGridRowEditCancel(token, '');
                }

            }), catchError(error => of()));
        }
    }

    getFileType(fileItem: FileItemWrapper): string {
        if (fileItem && fileItem.data && fileItem.data.letter_name) {
            return getFileTypeByFullFileName(fileItem.data.letter_name);
            // if (fileItem.data.letter_name.split('.')[1].toLocaleLowerCase()) {
            //     return fileItem.data.letter_name.split('.')[1].toLocaleLowerCase();
            // }
        }
        return '';
    }





}






