
import { tap, take, catchError, map, switchMap, mergeMap, filter } from 'rxjs/operators';
import { empty, of, from, combineLatest } from 'rxjs';
import { DocumentLink, DiaryEntryFileInfo } from './../../document-view/models/interfaces';
import {
    getPaginatorDefToken, getFilterViewModelByToken, getSelectedRowDataByToken,
    getGlobalSearchColumnDefByToken
} from './../reducers/index';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as GlobalSearch from '../actions/core';
import { GlobalDocumentSearchService } from '../services/global-document-search-service';
import { FileUrlResolverService } from '../../document-view';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { centerToWindow } from '../../utils/bounds';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MainMenuService } from '../../layout-desktop/services/main-menu.service';
import { InputData } from '../../email-list-core';
import { getFileTypeByFullFileName } from '../../core/utility/DpsUtility';
import { GridDocumentData } from '../../core/lib/matter';
import { WebViewService } from '../../azure-storage';
import { v3CanViewExtensions } from '../../core';



@Injectable()
export class GlobalDocumentSearchEffects {
    constructor(private actions$: Actions, private store: Store<any>, private datePipe: DatePipe,
        private urlResolver: FileUrlResolverService,
        private windowPopupsManagerService: WindowPopupsManagerService,
        private popupService: SystemJsPopupLoaderService,
        private webViewService: WebViewService,
        private mainMenuService: MainMenuService,
        private service: GlobalDocumentSearchService) { }
    @Effect()
    initewView$ = this.actions$.pipe(ofType<GlobalSearch.InitGlobalDocumentSearch>(GlobalSearch.INIT_GLOBAL_DOCUMENT_SEARCH),
        mergeMap(action => from([
            new GlobalSearch.GetGlobalDocFeeEarnerList(action.token),
            new GlobalSearch.GetGlobalDocAppCodeList(action.token),
        ])
        ));
    @Effect()
    getFeeEarnerList$ = this.actions$.pipe(ofType<GlobalSearch.GetGlobalDocFeeEarnerList>(GlobalSearch.GET_GLOBAL_DOC_FEE_EARNER_LIST),
        switchMap((action) =>
            this.service.getFeeEarnerList().pipe(
                map((result) => new GlobalSearch.GetGlobalDocFeeEarnerListSuccess(action.token, result)),
                catchError((error) => of(new GlobalSearch.GetGlobalDocFeeEarnerListFail(action.token, { error: error }))))
        ));
    @Effect()
    GridViewChange$ = this.actions$.pipe(ofType<GlobalSearch.GridViewChange>(GlobalSearch.GRID_VIEW_CHANGE),
        map((action) => {

            return new GlobalSearch.LoadDocumentData(action.token, { searchButton: false });

        }));

    @Effect()
    loadAppIdList$ = this.actions$.pipe(ofType<GlobalSearch.GetGlobalDocAppCodeList>(GlobalSearch.GET_GLOBAL_DOC_APP_CODE_LIST),
        switchMap((action) =>
            this.service.getAppCodeList().pipe(
                map((result) => new GlobalSearch.GetGlobalDocAppCodeListSuccess(action.token, result)),
                catchError((error) => of(new GlobalSearch.GetGlobalDocAppCodeListFail(action.token, error))))
        ));
    @Effect()
    loadDocumentData$ = this.actions$.pipe(ofType<GlobalSearch.LoadDocumentData>(GlobalSearch.LOAD_DOCUMENT_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getFilterViewModelByToken(action.token)),
                this.store.select(getPaginatorDefToken(action.token)),
                this.store.select(getGlobalSearchColumnDefByToken(action.token)),
                (filterViewModel, paginatorDef, columnDef) =>
                    ({ filterViewModel, paginatorDef, columnDef })).pipe(
                        take(1),
                        switchMap((info) =>
                            this.service.getGlobalDocumentData(info.filterViewModel, info.paginatorDef, info.columnDef).pipe(
                                map((result) => new GlobalSearch.LoadDocumentDataSuccess(action.token, { data: result })),
                                catchError((error) => of(new GlobalSearch.LoadDocumentDataFail(action.token, error))))
                        ))));


    @Effect()
    loadDocumentUrl$ = this.actions$.pipe(ofType<GlobalSearch.GetGlobalDocURL>(GlobalSearch.GET_GLOBAL_DOCUMENT_URL),
        switchMap(action =>
            this.urlResolver.getGlobalSearchDocumentUrl(action.payload.gridRowUrlRequest).pipe(
                map((result) =>
                    new GlobalSearch.GetGlobalDocURLSuccess(action.token,
                        { gridRow: action.payload.gridRowUrlRequest, url: result })))
        ));

    @Effect()
    RefreshGrid$ = this.actions$.pipe(ofType<GlobalSearch.GlobalSearchDocumentRefresh>(GlobalSearch.GLOBAL_SEARCH_DOCUMENT_REFRESH),
        switchMap((action) => {
            return from([new GlobalSearch.LoadDocumentData(action.token, { searchButton: false })]);
        }));


    @Effect()
    loadDocumentUrlView$ = this.actions$.pipe(ofType<GlobalSearch.LoadGlobalDocumentDocumentURL>
        (GlobalSearch.LOAD_GLOBAL_SEARCH_DOCUMENT_DOCUMENT_URL_LOAD),
        map((action) => {
            const extention = this.getFileType(action.request);
            if (extention === 'msg' || extention === 'eml') {
                return new GlobalSearch.GetGlobalDocumentEmailItemForMSG(action.token, action.request);
            } else if (v3CanViewExtensions.filter(p => p === extention).length > 0) {
                return new GlobalSearch.LoadWebViewUrl(action.token, action.request);
            } else {
                return new GlobalSearch.GetGlobalSearchDocumentPopupUrlFail(action.token, { request: action.request });
            }
        }));

    @Effect()
    loadDiaryWebViewUrl$ = this.actions$.pipe(ofType<GlobalSearch.LoadWebViewUrl>
        (GlobalSearch.LOAD_WEB_VIEW_URL),
        mergeMap((action) => {
            const data = action.request;
            return this.webViewService.getDiaryWebViewUrl(data.matterCode, data.branchId,
                data.fileId, data.diaryId, data.letterName).pipe(
                    map((url) => {
                        return new GlobalSearch.GetGlobalSearchDocumentPopupUrlSuccess(action.token,
                            { popupUrl: url, request: action.request });
                    }),
                    catchError(() => {
                        return of(new GlobalSearch.GetGlobalSearchDocumentPopupUrlFail(action.token, { request: action.request }));
                    }));
        }
        ));

    @Effect({ dispatch: false })
    openInNewTab$ = this.actions$.pipe(ofType<GlobalSearch.GetGlobalSearchDocumentPopupUrlSuccess>
        (GlobalSearch.GET_GLOBAL_DOCUMENT_POPUP_URL_SUCCESS), tap((data) => {

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
            this.windowPopupsManagerService.openWindow(data.payload.request.diaryId.toString(),
                data.payload.popupUrl, spec, data.payload.request.letterName);

        }));

    @Effect()
    loadDocumentPopupUrl$ = this.actions$.pipe(ofType<GlobalSearch.GetGlobalSearchDocumentPopupUrl>
        (GlobalSearch.GET_GLOBAL_SEARCH_DOCUMENT_POPUP_URL),
        switchMap(action =>
            this.store.select(getSelectedRowDataByToken(action.token)).pipe(
                map(state => ({ state }))).pipe(
                    take(1),
                    map((info) => {
                        return new GlobalSearch.LoadGlobalDocumentDocumentURL(action.token, info.state);
                    }))
        ));

    @Effect({ dispatch: false })
    emailItemData$ = this.actions$.pipe(
        ofType<GlobalSearch.GetGlobalDocumentEmailItemForMSG>(GlobalSearch.LOAD_GLOBAL_DOCUMENT_EMAIL_ITEM_FROM_DIARY),
        tap(({ request }) => {
            this.popupService.openMsgViewer({
                viewerFrom: 'diary',
                diaryInput: {
                    appCode: request.matterCode, branchId: request.branchId, fileId:
                        request.fileId,
                    itemRef: request.diaryId, attachmentName: request.letterName
                }
            });
        }));


    @Effect()
    fetMenuOpenCaseData$ = this.actions$.pipe(ofType<GlobalSearch.GetGlobalDocumentMenuOpenCaseData>
        (GlobalSearch.GET_GLOBAL_DOCUMENT_MENU_OPEN_CASE_DATA),
        filter((action: GlobalSearch.GetGlobalDocumentMenuOpenCaseData) => !!action.payload.openCaseRequestData.matterRef),
        switchMap((action: GlobalSearch.GetGlobalDocumentMenuOpenCaseData) => {
            // if (action.payload.openCaseRequestData && action.payload.openCaseRequestData.matterRef) {
            return this.service.getOpenCaseMaterDataFromMatterRef(action.payload.openCaseRequestData.matterRef.toString()).pipe(
                map((result) => {
                    this.mainMenuService.gotoOpenCase(result);
                    return new GlobalSearch.GetGlobalDocumentMenuOpenCaseDataSuccess(action.token, { inputData: result });
                }),
                catchError(error => of(new GlobalSearch.GetGlobalDocumentMenuOpenCaseDataFail(action.token, error))));

            // } else if (action.payload.openCaseRequestData.appId && action.payload.openCaseRequestData.fileId
            //     && action.payload.openCaseRequestData.branchId) {
            //     const materData: GridRowItemWrapper = {
            //         data: {
            //             appID: action.payload.openCaseRequestData.appId,
            //             fileID: action.payload.openCaseRequestData.fileId,
            //             app_Code: action.payload.openCaseRequestData.matterCode,
            //             branchID: action.payload.openCaseRequestData.branchId,
            //             feeEarner: '',
            //             reviewDate: null,
            //             clientName: null,
            //             reviewNote: null,
            //             company_Name: '',
            //             matterDetails: null,
            //             matterReferenceNo: null,
            //             matterCounter: null,
            //             ufnValue: null,
            //             eBilling: null,
            //             isPlotMatter: false,
            //             isPlotMasterMatter: false,
            //             isProspectMatter: false,
            //             isLegalAid: false
            //         }
            //     };
            //     this.mainMenuService.gotoOpenCase(materData);
            //     return of(new GlobalSearch.GetGlobalDocumentMenuOpenCaseDataSuccess(action.token, { inputData: materData }));
            // } else {
            //     return of();
            // }

        }));


    @Effect()
    getShareData$ = this.actions$.pipe(ofType<GlobalSearch.GetGlobalDocumentShareData>
        (GlobalSearch.GET_GLOBAL_DOCUMENT_SHARE_DATA),
        switchMap((action: GlobalSearch.GetGlobalDocumentShareData) => {
            return this.service.getShareDataFromMatterRef(action.payload.shareRequestData.matterRef.toString()
                , action.payload.shareRequestData.diaryId, action.payload.shareRequestData.letterName,
                action.payload.shareRequestData.note).pipe(
                    map((result) => {
                        this.showEmailListPopup(result);
                        return new GlobalSearch.GetGlobalDocumentShareDataSuccess(action.token, { inputData: result });
                    }),
                    catchError(error => of(new GlobalSearch.GetGlobalDocumentShareDataFail(action.token, error))));
        }));


    getFileType(fileItem: GridDocumentData): string {
        if (fileItem && fileItem.letterName) {
            return getFileTypeByFullFileName(fileItem.letterName);
            // if (fileItem.letterName.split('.')[1].toLocaleLowerCase()) {
            //     return fileItem.letterName.split('.')[1].toLocaleLowerCase();
            // }
        }
        return '';
    }

    showEmailListPopup(input: InputData) {
        return this.popupService.openEmailListPopup('EmailListPopup', input).pipe(map(data => {
        }));
    }

}
