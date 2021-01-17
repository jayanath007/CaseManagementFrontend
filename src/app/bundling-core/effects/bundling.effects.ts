
import { mergeMap, map, tap, filter, catchError, switchMap, take } from 'rxjs/operators';
import {
    getBundlingSelectedInfoByToken, getColumnDefByToken,
    getSelectedItemsByToken,
    getBundlingItemList,
    getBundlingGridDataByToken,
    getFileHistoryHashByToken,
    getBundlingStateByToken,
    getBundlingItemSaveDataList,
    getMatterInfoByToken,
    getBundleOptionsByToken,
    getSelectedBundlingItem,
    getBundlingCoverPageId,
    getFromToDateObjectByToken,
    getPDFBundleHeaderViewModel,
    getPreserveExistingPagination
} from './../reducers/index';

import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { FileUrlResolverService } from '../../document-view';
import * as Bundling from '../actions/core';
import { BundlingService } from '../services/bundling.service';
import { of, combineLatest } from 'rxjs';
import {
    FileHistoryRequest,
    GridRequest,
    PDFBundleFileRequestViewModel,
    BundleValidatorViewModel,
    BundleValidatorExtensions,
    BundleValidatorFileLocationViewModel
} from '../models/bundling-request';
import { toODataFilter, toODataSort, getPaginatorSkip } from '../../core/lib/grid-helpers';
import { FileHistory, LoadSavedBundleDataResponce, BundleTreeItem } from '../models/interface';
import { BundleSaveSuccessMsg, ItemRequest } from '../models/enum';
import { InfoDialogType, getFileTypeByFullFileName } from '../../core/utility/DpsUtility';
import { getUser } from '../../auth';
import { WebViewService } from '../../azure-storage';
import { v3CanViewExtensions } from '../../core';


@Injectable()
export class BundlingEffects {
    constructor(private actions$: Actions, private store: Store<any>, private datePipe: DatePipe,
        private urlResolver: FileUrlResolverService, private webViewService: WebViewService, private service: BundlingService) { }

    @Effect()
    initewView$ = this.actions$.pipe(ofType<Bundling.InitBundling>(Bundling.INIT_BUNDLING),
        map((action) => new Bundling.LoadBundlingGrid(action.token, null)));

    @Effect()
    LoadAllGridData$ = this.actions$.pipe(ofType<Bundling.LoadBundlingGrid>(Bundling.LOAD_BUNDLING_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getColumnDefByToken(action.token)),
                this.store.select(getBundlingSelectedInfoByToken(action.token)),
                ((gridColumn, selectedInfo) => ({
                    gridColumn, selectedInfo,
                    token: action.token,
                }))
            ).pipe(take(1),
                map((info) => {
                    const groupFilter = [{ field: 'FolderName', dir: null }];
                    return new GridRequest(
                        {
                            take: action.moveItemTOProfile && action.gridGroupData ? action.gridGroupData.count : ItemRequest.ItemCount,
                            filter: toODataFilter(info.gridColumn),
                            group: action.gridGroupData ? null : groupFilter,
                            skip: action.gridGroupData ? action.gridGroupData.currentItems : 0,
                            sort: action.gridGroupData ? toODataSort(info.gridColumn) : null
                        },
                        {
                            SearchText: info.selectedInfo ? info.selectedInfo.SearchText : '',
                            BranchId: info.selectedInfo ? info.selectedInfo.BranchId : null,
                            AppCode: info.selectedInfo ? info.selectedInfo.AppCode : '',
                            FileId: info.selectedInfo ? info.selectedInfo.FileId : null,
                        }
                    );

                }), switchMap((request) => {
                    return this.service.getGridData(request).pipe(map((response) =>
                        new Bundling.LoadBundlingGridSuccess(action.token, {
                            pageData: response,
                            gridGroupData: action.gridGroupData,
                            moveItemTOProfile: action.moveItemTOProfile
                        })),
                        catchError(error => of(new Bundling.LoadBundlingGridFail(action.token, error))));
                }))));

    @Effect()
    RequstGroupData$ = this.actions$.pipe(ofType<Bundling.GroupBundlingDataRequest>(Bundling.GROUP_BUNDLING_DATA_REQUEST),
        map(action => {
            if (action.payload.gridGroupData.currentItems < action.payload.gridGroupData.count &&
                !action.payload.gridGroupData.hasSubgroups) {
                return new Bundling.LoadBundlingGrid(action.token, action.payload.moveItemTOProfile, action.payload.gridGroupData);
            } else if (action.payload.moveItemTOProfile) {
                return new Bundling.AddItemsWithFolderRequest(action.token, action.payload.gridGroupData.value,
                    action.payload.gridGroupData);
            } else {
                return new Bundling.AllDataUpdate(action.token);
            }
        }));

    @Effect()
    DataLoadAndMoveItems$ = this.actions$.pipe(ofType<Bundling.LoadBundlingGridSuccess>(Bundling.LOAD_BUNDLING_GRID_DATA_SUCCESS),
        filter((action: Bundling.LoadBundlingGridSuccess) => !!action.payload.moveItemTOProfile),
        map((action) =>
            new Bundling.AddItemsWithFolderRequest(action.token, action.payload.gridGroupData.value, action.payload.gridGroupData)));

    @Effect()
    MoveItemWithFolder$ = this.actions$.pipe(ofType<Bundling.AddItemsWithFolderRequest>(Bundling.ADD_ITEMS_WITH_FOLDER_REQUEST),
        switchMap((action: Bundling.AddItemsWithFolderRequest) =>
            combineLatest(
                this.store.select(getBundlingGridDataByToken(action.token)),
                this.store.select(getBundlingItemList(action.token)),
                ((fileHistoryItems, itemList) => ({ fileHistoryItems, itemList: itemList, action: action }))
            ).pipe(take(1))
        ), map(info => new Bundling.RequestTOValidateAddItems(info.action.token,
            info.itemList.find(i => i.selected) ? info.itemList.find(i => i.selected).id : info.itemList[0].id,
            info.action.folderLable,
            info.fileHistoryItems.filter(i => i.groupHash === info.action.gridGroupData.groupHash && !i.isRemove), 'WithNewFolder')));

    @Effect()
    loadFileHistory$ = this.actions$.pipe(ofType<Bundling.LoadFileHistory>(Bundling.LOAD_FILE_HISTORY),
        switchMap((action) =>
            combineLatest(this.store.select(getBundlingStateByToken(action.token)),
                this.store.select(getFileHistoryHashByToken(action.token)),
                (state, hash) => {
                    return { state: state, hash: hash };
                }).pipe(
                    take(1),
                    map((info) => new FileHistoryRequest({
                        SearchText: info.state ? info.state.searchText : '',
                        BranchId: info.state ? info.state.matterInfo.branchID : null,
                        AppCode: info.state ? info.state.matterInfo.app_Code : '',
                        FileId: info.state ? info.state.matterInfo.fileID : null,
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
                    map((request) => new Bundling.LoadBundlingFileHistoryGroup(action.token, request)))));

    @Effect()
    loadValidation$ = this.actions$
        .pipe(ofType<Bundling.LoadBundlingGridSuccess>(Bundling.LOAD_BUNDLING_GRID_DATA_SUCCESS),
            filter(action => !!action.payload && !!action.payload.pageData && !!action.payload.pageData.group
                && action.payload.pageData.group.length === 0),
            map(action =>
                new Bundling.ShowMessage(action.token, 'No Files',
                    `There are no items with valid physical documents.
                 Please make sure that the DPS file has items with associates files that are valid for bundling.`,
                    InfoDialogType.warning)));

    @Effect()
    loadDocumentUrlView$ = this.actions$.pipe(ofType<Bundling.GetDocURL>(Bundling.GET_DOCUMENT_URL),
        map((action) => {
            const extention = this.getFileType(action.payload.gridRow);
            if (extention === 'msg' || extention === 'eml') {
                return new Bundling.GetEmailItemForMSG(action.token, action.payload.gridRow);
            } else if (v3CanViewExtensions.filter(p => p === extention).length > 0) {
                return new Bundling.LoadWebViewUrl(action.token, action.payload.gridRow);
            } else {
                return new Bundling.GetDocURLFail(action.token, { request: action.payload });
            }
        }));

    @Effect()
    loadDiaryWebViewUrl$ = this.actions$.pipe(ofType<Bundling.LoadWebViewUrl>(Bundling.LOAD_WEB_VIEW_URL),
        switchMap(action => this.store.select(getMatterInfoByToken(action.token)).pipe(
            map(matterInfo => ({ matterInfo, action }))
        )
        ),
        mergeMap(({ matterInfo, action }) => {
            return this.webViewService.getDiaryWebViewUrl(matterInfo.app_Code, matterInfo.branchID,
                matterInfo.fileID, action.request.diary_UID, action.request.letter_name).pipe(
                    map((url) => {
                        return new Bundling.GetDocURLSuccess(action.token, { url, gridRow: action.request });
                    }),
                    catchError(() => {
                        return of(new Bundling.GetDocURLFail(action.token, { request: action.request }));
                    }));
        }
        ));

    @Effect()
    emailItemData$ = this.actions$.pipe(ofType<Bundling.GetEmailItemForMSG>(Bundling.LOAD_EMAIL_ITEM_FROM_DIARY),
        map((action) => new Bundling.GetEmailItemForMSGSuccess(action.token, {
            emailItem: true,
            row: action.request
        }))
    );

    @Effect()
    RequestValidateAddItem$ = this.actions$.pipe(ofType<Bundling.RequestTOValidateAddItems>(Bundling.REQUST_TO_VALIDATE_DROPPED_ITEMS),
        switchMap((action: Bundling.RequestTOValidateAddItems) =>
            this.store.select(getMatterInfoByToken(action.token)).pipe(
                map(matterInfo => ({ matterInfo, action: action })),
                take(1),
                map(info => {
                    const extentions: BundleValidatorExtensions[] = [];
                    const diaryIds: BundleValidatorFileLocationViewModel[] = [];
                    info.action.data.forEach(i => {
                        extentions.push({ letterName: i.letter_name, diaryId: i.diary_UID });
                        diaryIds.push({ diaryId: i.diary_UID, offlineStatus: i.offlineStatus });
                    });
                    return new BundleValidatorViewModel(
                        extentions,
                        diaryIds,
                        {
                            branchId: info.matterInfo.branchID,
                            appId: info.matterInfo.appID,
                            fileId: info.matterInfo.fileID,
                            displayDataString: ''
                        }
                    );
                }), map(request => new Bundling.ValidateAddItems(action.token, request, action.anchorId,
                    action.folderName, action.data, action.actionType)))));


    @Effect()
    ValidateAddItem$ = this.actions$.pipe(ofType<Bundling.ValidateAddItems>(Bundling.VALIDATE_DROPPED_ITEMS),
        switchMap(action => this.service.validateItems(action.request).pipe(
            map(result => {
                let filteredData = action.data;
                if (result && result.detailStatus && result.detailStatus.length > 0) {
                    result.detailStatus.forEach(i =>
                        filteredData = filteredData.filter(r => r.diary_UID.toString() !== i.reference.toString())
                    );
                }
                return new Bundling.ValidateAddItemsSuccess(action.token,
                    action.anchorId, action.folderName, filteredData, result, action.actionType);
            }), catchError(() => of(new Bundling.ValidateAddItemsFail(action.token))))));

    @Effect()
    ShowValidateMassage$ = this.actions$.pipe(ofType<Bundling.ValidateAddItemsSuccess>(Bundling.VALIDATE_DROPPED_ITEMS_SUCCESS),
        filter(action => action.validationResponce && action.validationResponce.detailStatus
            && action.validationResponce.detailStatus.length > 0),
        map(action => {
            return new Bundling.ShowValidationFailDialog(action.token, action.validationResponce);
        }));

    @Effect()
    ValidateAddItemSuccess$ = this.actions$.pipe(ofType<Bundling.ValidateAddItemsSuccess>(Bundling.VALIDATE_DROPPED_ITEMS_SUCCESS),
        switchMap(action =>
            combineLatest(
                this.store.select(getBundlingItemList(action.token)),
                this.store.select(getPreserveExistingPagination(action.token)),
                ((itemList, existingPage) => ({ itemList: itemList, isExistingPage: existingPage.checked, action: action }))
            ).pipe(take(1))
        ), filter(info => info.action.data && info.action.data.length > 0),
        map(info => {
            if (info.action.actionType === 'WithNewFolder') {
                return new Bundling.AddItemsWithFolder(info.action.token,
                    info.itemList.find(i => i.selected) ? info.itemList.find(i => i.selected).id : info.itemList[0].id,
                    info.action.folderName, info.action.data);
            } else {
                let selectedIdItem: BundleTreeItem;
                if (info.action.anchorId) {
                    selectedIdItem = info.itemList.find(i => i.id === info.action.anchorId);
                } else {
                    selectedIdItem = info.itemList.find(i => i.selected);
                }
                if (info.isExistingPage && selectedIdItem.isFolder && selectedIdItem.isSavedItem) {
                    return new Bundling.ShowMessage(info.action.token, 'Add New Item',
                        `New Item can only be added between or at the end of
                     existing page if the 'Preserve Extisting Pagination' checkbox is ticked`, InfoDialogType.warning);
                } else {
                    return new Bundling.AddItem(info.action.token, selectedIdItem.id,
                        info.action.data);
                }

            }

        }));

    @Effect()
    requestToAddItems$ = this.actions$.pipe(ofType<Bundling.RequestToAddItems>(Bundling.REQUEST_TO_ADD_ITEM),
        switchMap((action: Bundling.RequestToAddItems) =>
            combineLatest(
                this.store.select(getSelectedItemsByToken(action.token)),
                this.store.select(getBundlingItemList(action.token)),
                ((selectedItems, itemList) => ({ selectedItems, itemList: itemList, action: action }))
            ).pipe(take(1))
        ), filter(info => info.selectedItems && info.selectedItems.length > 0),
        map(info => new Bundling.RequestTOValidateAddItems(info.action.token, info.action.anchorId,
            info.action.folderName, info.selectedItems, info.action.actionType)
        ));

    @Effect()
    requestToAddItemsFromMenu$ = this.actions$.pipe(ofType<Bundling.RequestToAddItemsFromMenu>(Bundling.REQUEST_TO_ADD_ITEM_FROM_MENU),
        switchMap((action: Bundling.RequestToAddItemsFromMenu) =>
            combineLatest(
                this.store.select(getSelectedItemsByToken(action.token)),
                this.store.select(getSelectedBundlingItem(action.token)),
                ((selectedItems, selectedProfileItem, selectedGroupHash) =>
                    ({ selectedItems, selectedProfileItem, action: action }))
            ).pipe(take(1))
        ), filter(info => info.selectedItems && info.selectedItems.length > 0),
        map(info => new Bundling.RequestTOValidateAddItems(info.action.token, '',
            info.selectedItems[0].folderName,
            info.selectedItems,
            info.selectedProfileItem.isRoot ? 'WithNewFolder' : null)
        ));

    @Effect()
    whenEmptySelectedItem$ = this.actions$.pipe(ofType<Bundling.RequestToAddItemsFromMenu>(Bundling.REQUEST_TO_ADD_ITEM_FROM_MENU),
        switchMap((action: Bundling.RequestToAddItemsFromMenu) =>
            this.store.select(getSelectedItemsByToken(action.token)).pipe(
                map(selectedItems => ({ selectedItems, token: action.token })),
                take(1))
        ), filter(info => info.selectedItems && info.selectedItems.length === 0),
        map(info => new Bundling.ShowMessage(info.token,
            'Invalid Selection',
            'You must select a destination item from the above tree and one or more rows from the below grid.', InfoDialogType.warning)));

    @Effect()
    uploadCoverPage$ = this.actions$.pipe(ofType<Bundling.UploadCoverPage>(Bundling.UPLOAD_COVER_PAGE),
        switchMap((action) =>
            this.store.select(getMatterInfoByToken(action.token)).pipe(
                map((matter) => ({
                    caseFileIdentity: {
                        branchId: matter.branchID,
                        appId: matter.appID,
                        fileId: matter.fileID,
                        displayDataString: null
                    }
                })), take(1),
                map(info => {
                    const request: PDFBundleFileRequestViewModel = {
                        filePath: null,
                        caseFileIdentityWithAppIdViewModel: info.caseFileIdentity,
                        isFromDiary: action.payload.isFromDiary,
                        diaryId: action.payload.diaryId
                    };
                    return request;
                }), switchMap(request =>
                    combineLatest(
                        this.store.select(getSelectedItemsByToken(action.token)),
                        this.store.select(getBundlingCoverPageId(action.token)),
                        ((selectFileHistoryItem, coverPageId) => ({
                            action: action,
                            fileHistoryItem: selectFileHistoryItem,
                            coverPageId: coverPageId
                        }))
                    ).pipe(take(1),
                        filter(info => !!info.action.payload.file || info.fileHistoryItem.length === 1),
                        switchMap(info => {
                            let fileHistoryItem: any;
                            if (action.payload.file) {
                                fileHistoryItem = {
                                    note: action.payload.file.name,
                                    letter_name: action.payload.file.name,
                                };
                            } else {
                                fileHistoryItem = info.fileHistoryItem[0];
                            }
                            const data = new FormData();
                            data.append('files', action.payload.file);
                            data.append('fileAttachmentViewModel', JSON.stringify(request));
                            return this.service.uploadCoverPage(data).pipe(
                                map(result => new Bundling.UploadCoverPageSuccess(action.token,
                                    info.coverPageId,
                                    action.payload.file ? action.payload.file.name : info.fileHistoryItem[0].letter_name,
                                    result.filePath,
                                    fileHistoryItem)),
                                catchError(() => of(new Bundling.UploadCoverPageFail(action.token))));
                        }))))
        ));

    @Effect()
    uploadCoverPageValidation$ = this.actions$.pipe(ofType<Bundling.UploadCoverPage>(Bundling.UPLOAD_COVER_PAGE),
        switchMap((action) =>
            this.store.select(getSelectedItemsByToken(action.token)).pipe(
                map((fileHistoryItem) => ({
                    fileHistoryItem: fileHistoryItem, token: action.token
                })),
                take(1))),
        filter(info => !!info.fileHistoryItem && info.fileHistoryItem.length > 1),
        map(action =>
            new Bundling.ShowMessage(action.token, 'Invalid Selection',
                'For a Cover Page You cav only add a single document item from the right grid', InfoDialogType.warning)));

    @Effect()
    CoverPageUploadSuccess$ = this.actions$.pipe(ofType<Bundling.UploadCoverPageSuccess>(Bundling.UPLOAD_COVER_PAGE_SUCCESS),
        map(info => new Bundling.ShowMessage(info.token, 'Cover Page',
            'Please be aware that only the first page of the selected document will be used as a Cover Page', InfoDialogType.alert)));

    @Effect()
    saveBundlingData$ = this.actions$.pipe(ofType<Bundling.BundleSubmit>(Bundling.BUNDLING_DATA_SUBMIT_SAVE),
        switchMap((action) => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) =>
            combineLatest(
                this.store.select(getPDFBundleHeaderViewModel(action.token)),
                this.store.select(getBundlingItemSaveDataList(action.token, user.general.dateTimeOffset)),
                this.store.select(getMatterInfoByToken(action.token)),
                this.store.select(getBundleOptionsByToken(action.token)),
                this.store.select(getFromToDateObjectByToken(action.token)),
                ((bundleHeaderView, bundlingItems, matterInfo, optionPopupData, fromToDateObject) => ({
                    BundlingSaveModel: {
                        PDFBundleHeaderViewModel: bundleHeaderView,
                        PDFBundleTreeItemViewModel: bundlingItems
                    }, matterInfo, optionPopupData, fromToDateObject,
                    token: action.token, bundleName: action.bundleName,
                    IsSendToBundle: action.IsSendToBundle,
                    user
                }))
            ).pipe(take(1))
        ),
        switchMap((info) =>
            this.service.saveBundleData(info.BundlingSaveModel, info.matterInfo,
                info.optionPopupData, info.bundleName, info.fromToDateObject, info.IsSendToBundle, info.user.general.dateTimeOffset).pipe(
                    map((result) => new Bundling.BundlingSubmitSaveSuccess(info.token, {
                        newTreeItemList: result,
                        IsSendToBundle: info.IsSendToBundle
                    })),
                    catchError((error) => of(new Bundling.BundlingDataSubmitFail(info.token, error))))
        ));
    @Effect()
    updateBundleNameBySubmit$ = this.actions$.pipe(ofType<Bundling.BundleSubmit>(Bundling.BUNDLING_DATA_SUBMIT_SAVE),
        map((action) => new Bundling.UpdateLable(action.token, action.bundleObjectId, action.bundleName)));


    @Effect()
    ChangeHistoryGridView$ = this.actions$.pipe(ofType<Bundling.AllGridViewChange>(Bundling.BUNDLING_GRID_VIEW_CHANGE),
        map((action) => new Bundling.LoadBundlingGrid(action.token, null)));

    @Effect()
    getBundleList$ = this.actions$.pipe(ofType<Bundling.LoadSavedBundleData>(Bundling.LOAD_SAVE_BUNDLE_DATA),
        switchMap((action) => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) =>
            this.service.getSaveBundleList(action.rowData.pbH_BundleID).pipe(
                map((result: LoadSavedBundleDataResponce) => new Bundling.LoadSavedBundleDataSuccess(action.token, {
                    coreHeader: result.pdfBundleHeaderDto,
                    itemListList: result.pdfBundleItemDto,
                    selectedRow: action.rowData,
                    timeOffset: user.general.dateTimeOffset
                })),
                catchError((error) => of(new Bundling.LoadSavedBundleDataFail(action.token, error))))
        ));
    @Effect()
    preserveCheckbox$ = this.actions$.pipe(ofType<Bundling.LoadSavedBundleDataSuccess>(Bundling.LOAD_SAVE_BUNDLE_DATA_SUCCESS),
        filter(action => !!action.payload && action.payload.selectedRow.pbH_IsCoreBundle),
        map(action =>
            new Bundling.ShowMessage(action.token, 'Core Bundle',
                'The background colour of the layout has been changed to indicate that you have opened a Core Bundle.',
                InfoDialogType.alert)));
    @Effect()
    updateOptionName$ = this.actions$.pipe(ofType<Bundling.LoadSavedBundleDataSuccess>(Bundling.LOAD_SAVE_BUNDLE_DATA_SUCCESS),
        map(action => new Bundling.ChangeOption(action.token, { key: 'name', value: action.payload.coreHeader.pbH_Name })));

    @Effect()
    bundleDataSaveSuccess$ = this.actions$.pipe(ofType<Bundling.BundlingSubmitSaveSuccess>(Bundling.BUNDLING_DATA_SUBMIT_SAVE_SUCCESS),
        map(action => new Bundling.ShowMessage(action.token, BundleSaveSuccessMsg.Title,
            action.payload.IsSendToBundle
                ? BundleSaveSuccessMsg.SaveWithProcessMsg : BundleSaveSuccessMsg.SaveMsg, InfoDialogType.success)));

    @Effect()
    changedIsCoreBundle$ = this.actions$.pipe(ofType<Bundling.ChangedIsCoreBundle>(Bundling.CHANGE_IS_CORE_BUNDLE),
        map(action => new Bundling.BundleSubmit(action.token, action.payload.rootElementId, action.payload.bundleName, false)));

    @Effect()
    getLogFile$ = this.actions$.pipe(ofType<Bundling.GetLogFile>(Bundling.GET_LOG_FILE),
        switchMap(action =>
            this.urlResolver.getBundleViewLogFileUrl(action.bundleId).pipe(
                map(url => new Bundling.GetLogFileSuccess(action.token, url)),
                catchError(() => of(new Bundling.GetLogFileFail(action.token))))
        ));

    getFileType(fileItem: FileHistory): string {
        if (fileItem && fileItem.letter_name) {
            return getFileTypeByFullFileName(fileItem.letter_name);
            //     if (fileItem.letter_name.split('.')[1].toLocaleLowerCase()) {
            //         return fileItem.letter_name.split('.')[1].toLocaleLowerCase();
            //     }
        }
        return '';
    }

}

