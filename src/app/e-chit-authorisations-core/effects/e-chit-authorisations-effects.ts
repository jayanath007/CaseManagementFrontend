import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import { EChitAuthorisationsService } from '../services/e-chit-authorisations.service';
import { UrlPopupService } from './../../shell-desktop/services/url-popup.service';
import { EChitAuthorisationsState } from '../reducers/e-chit-authorisations';
import { mergeMap, switchMap, catchError, map, take } from 'rxjs/operators';
import { GridDataByUserAndGroupChange, ShowMessage } from '../actions/core';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { getAuthorisationsViewByToken } from './../reducers/index';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as eChitAuthorisations from '../actions/core';
import { GridDataRequest } from '../models/interfaces';
import { PropertyNameList } from '../models/enums';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';

@Injectable()
export class EChitAuthorisationsEffects {
    constructor(
        private actions$: Actions,
        private service: EChitAuthorisationsService,
        private store: Store<any>,
        private dialog: MatDialog,
        private fileUrlResolcer: FileUrlResolverService,
        private urlPopupService: UrlPopupService,
        private popupService: SystemJsPopupLoaderService) {
    }
    @Effect()
    initView$ = this.actions$.pipe(ofType<eChitAuthorisations.InitPage>(eChitAuthorisations.INIT_ECHIT_AUTHORISATIONS),
        mergeMap((action) => {
            return from([
                new eChitAuthorisations.LoadUserGroupList(action.token)
            ]);
        }));
    @Effect()
    loadFeeEarnerListData$ = this.actions$
        .pipe(ofType<eChitAuthorisations.LoadFeeEarnerList>(eChitAuthorisations.ECHIT_AUTHORISATIONS_FEEEARNER_LIST),
            switchMap((action: eChitAuthorisations.LoadFeeEarnerList) =>
                this.service.getFeeEarnerList(action.payload.userGroupId).pipe(map((response) =>
                    new eChitAuthorisations.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: response })),
                    catchError(error => of(new eChitAuthorisations.LoadFeeEarnerListFail(action.token, error))))
            ));
    @Effect()
    loadUserGroupListData$ = this.actions$
        .pipe(ofType<eChitAuthorisations.LoadUserGroupList>(eChitAuthorisations.ECHIT_AUTHORISATIONS_USER_GROUP_LIST),
            switchMap((action: eChitAuthorisations.LoadUserGroupList) =>
                this.service.getUserGroupListList().pipe(map((response) =>
                    new eChitAuthorisations.LoadUserGroupListSuccess(action.token, { userGroupList: response })),
                    catchError(error => of(new eChitAuthorisations.LoadUserGroupListFail(action.token, error))))
            ));

    @Effect()
    loadGridData$ = this.actions$
        .pipe(ofType<eChitAuthorisations.GridDataByUserAndGroupChange>(eChitAuthorisations.ECHIT_AUTHORISATIONS_USER_AND_GROUP_CMB_CHANGE),
            switchMap((action) =>
                this.store.select(getAuthorisationsViewByToken(action.token)).pipe(
                    map((formViewDataInfo: EChitAuthorisationsState) => ({
                        response: new GridDataRequest(
                            {
                                take: formViewDataInfo.paginatorDef.itemPerPage,
                                filter: toODataFilter(formViewDataInfo.columnDef),
                                skip: getPaginatorSkip(formViewDataInfo.paginatorDef),
                                sort: toODataSort(formViewDataInfo.columnDef)
                            },
                            formViewDataInfo.selectedGroupId,
                            formViewDataInfo.selectedFeeEarnerCode,
                        ),
                        token: action.token,
                    })),
                    take(1))),
            switchMap((info) =>
                this.service.getAuthoriseGridData(info.response).pipe(map((response) =>
                    new eChitAuthorisations.GridDataByUserAndGroupChangeSuccess(info.token, { gridDataObject: response })),
                    catchError(error => of(new eChitAuthorisations.GridDataByUserAndGroupChangeFail(info.token, error))))
            ));
    @Effect()
    groupSuccess$ =
        this.actions$
            .pipe(ofType<eChitAuthorisations.LoadUserGroupListSuccess>(eChitAuthorisations.ECHIT_AUTHORISATIONS_USER_GROUP_LIST_SUCCESS),
                switchMap((action: eChitAuthorisations.LoadUserGroupListSuccess) =>
                    this.store.select(getAuthorisationsViewByToken(action.token)).pipe(
                        map((formViewDataInfo: EChitAuthorisationsState) => ({
                            userGroupId: formViewDataInfo.selectedGroupId,
                            token: action.token
                        })),
                        take(1))),
                map((info) =>
                    new eChitAuthorisations.LoadFeeEarnerList(info.token, { userGroupId: info.userGroupId })
                ));
    @Effect()
    callGridData$ =
        this.actions$
            .pipe(ofType<eChitAuthorisations.LoadFeeEarnerListSuccess>(eChitAuthorisations.ECHIT_AUTHORISATIONS_FEEEARNER_LIST_SUCCESS),
                map((info) =>
                    new eChitAuthorisations.GridDataByUserAndGroupChange(info.token)
                ));
    @Effect()
    dropDownChange$ = this.actions$
        .pipe(ofType<eChitAuthorisations.DropDownValueChange>(eChitAuthorisations.ECHIT_AUTHORISATIONS_DROPDOWN_VALUE_CHANGE),
            switchMap((action: eChitAuthorisations.DropDownValueChange) =>
                this.store.select(getAuthorisationsViewByToken(action.token)).pipe(
                    map((formViewDataInfo: EChitAuthorisationsState) => ({
                        propertyName: action.payload.propertyName,
                        userGroupId: formViewDataInfo.selectedGroupId,
                        token: action.token
                    })),
                    take(1))),
            map((info) => {
                if (info.propertyName === PropertyNameList.FeeEarner) {
                    return new eChitAuthorisations.GridDataByUserAndGroupChange(info.token);
                } else {
                    return new eChitAuthorisations.LoadFeeEarnerList(info.token, { userGroupId: info.userGroupId })
                }
            }));
    @Effect()
    saveData$ = this.actions$
        .pipe(ofType<eChitAuthorisations.EChitAuthoriseSave>(eChitAuthorisations.ECHIT_AUTHORISATIONS_SAVE),
            switchMap((action) =>
                this.store.select(getAuthorisationsViewByToken(action.token)).pipe(
                    map((formViewDataInfo: EChitAuthorisationsState) => ({
                        echitAuthoriseViewModel: {
                            echitAuthoriseDataViewModels: formViewDataInfo.authorisationsGridData.filter(item => item.selected).length > 0 ?
                                formViewDataInfo.authorisationsGridData.filter(item => item.selected).map((item) =>
                                    ({
                                        cheReqestId: item.id,
                                        level: item.level
                                    })) : null
                        },
                        token: action.token,
                    })),
                    take(1))),
            switchMap((info) =>
                this.service.saveAuthoriseData(info.echitAuthoriseViewModel).pipe(map((response) =>
                    new eChitAuthorisations.EChitAuthoriseSaveSuccess(info.token, { responceData: response })),
                    catchError(error => of(new eChitAuthorisations.EChitAuthoriseSaveFail(info.token, error))))
            ));
    @Effect()
    rejectData$ = this.actions$
        .pipe(ofType<eChitAuthorisations.EChitAuthoriseReject>(eChitAuthorisations.ECHIT_AUTHORISATIONS_REJECT),
            switchMap((action) =>
                this.store.select(getAuthorisationsViewByToken(action.token)).pipe(
                    map((formViewDataInfo: EChitAuthorisationsState) => ({
                        echitAuthoriseViewModel: {
                            echitAuthoriseDataViewModels: formViewDataInfo.authorisationsGridData.filter(item => item.selected).length > 0 ?
                                formViewDataInfo.authorisationsGridData.filter(item => item.selected).map((item) =>
                                    ({
                                        cheReqestId: item.id,
                                    })) : null
                        },
                        token: action.token,
                    })),
                    take(1))),
            switchMap((info) =>
                this.service.rejectAuthoriseData(info.echitAuthoriseViewModel).pipe(map((response) =>
                    new eChitAuthorisations.EChitAuthoriseRejectSuccess(info.token, { responceData: response })),
                    catchError(error => of(new eChitAuthorisations.EChitAuthoriseRejectFail(info.token, error))))
            ));
    @Effect()
    saveSuccess$ =
        this.actions$
            .pipe(ofType<eChitAuthorisations.EChitAuthoriseSaveSuccess>(eChitAuthorisations.ECHIT_AUTHORISATIONS_SAVE_SUCCESS),
                map((info) =>
                    new eChitAuthorisations.ShowMessage(info.token, {
                        actionType: PropertyNameList.Authorise,
                        responceData: info.payload.responceData
                    })
                ));
    @Effect()
    rejectSuccess$ =
        this.actions$
            .pipe(ofType<eChitAuthorisations.EChitAuthoriseRejectSuccess>(eChitAuthorisations.ECHIT_AUTHORISATIONS_REJECT_SUCCESS),
                map((info) =>
                    new eChitAuthorisations.ShowMessage(info.token, {
                        actionType: PropertyNameList.Reject,
                        responceData: info.payload.responceData
                    })
                ));

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(eChitAuthorisations.ECHIT_AUTHORISATIONS_SHOW_MESSAGE),
        map((action) => {
            const dialogData: InforDialogData = {
                content: {
                    title: (action.payload.actionType === PropertyNameList.Authorise) ? 'Authorised' : 'Reject',
                    message: (action.payload.responceData && action.payload.responceData.detailStatus) ?
                        action.payload.responceData.detailStatus[0].message : (action.payload.actionType === PropertyNameList.Authorise) ?
                            'Authorised 1 eChits' : 'Rejected 1 eChits'
                },
                data: { messageType: 'alert' }
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                hasBackdrop: true,
                panelClass: 'dps-notification'
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
                this.store.dispatch(new GridDataByUserAndGroupChange(action.token));
            });
        }));
    @Effect()
    changePage$ = this.actions$.pipe(ofType<eChitAuthorisations.ChangePaginator>(eChitAuthorisations.ECHIT_AUTHORISATIONS_CHANGE_PAGE),
        map(action => new eChitAuthorisations.GridDataByUserAndGroupChange(action.token))
    );
    @Effect()
    getLogFileUrl$ = this.actions$.pipe(ofType<eChitAuthorisations.ShowDocument>(eChitAuthorisations.ECHIT_AUTHORISATIONS_SHOW_DOCUMENT),
        switchMap(action =>
            this.fileUrlResolcer
                .getChitAuthorisationsLogFile(action.payload.fileDataViewModel.supplierRef,
                    action.payload.fileDataViewModel.fileName).pipe(
                        map(url => new eChitAuthorisations.ShowDocumentSuccess(action.token, url)),
                        catchError(() => of(new eChitAuthorisations.ShowDocumentFail(action.token)))
                    ))
    );
    @Effect({ dispatch: false })
    viewLogFile$ = this.actions$
        .pipe(ofType<eChitAuthorisations.ShowDocumentSuccess>(eChitAuthorisations.ECHIT_AUTHORISATIONS_SHOW_DOCUMENT_SUCCESS),
            map((action) => {
                this.urlPopupService.openWithUrlPoup(action.url, 'authorisationsViewer', true, false, 'View Report', true);
            }));
    @Effect()
    applyColumSort$ = this.actions$.pipe(ofType<eChitAuthorisations.ApplyColumSort>(eChitAuthorisations.ECHIT_AUTHORISATIONS_COLUM_SORTING),
        map(action => new eChitAuthorisations.GridDataByUserAndGroupChange(action.token))
    );

    @Effect()
    getEmailItem$ = this.actions$
        .pipe(ofType<eChitAuthorisations.GetEmailItem>(eChitAuthorisations.ECHIT_AUTHORISATIONS_EMAIL_ITEM),
            switchMap((action: eChitAuthorisations.GetEmailItem) =>
                this.service.getMSGEmailItem(action.payload.fileDataViewModel).pipe(map((response) =>
                    new eChitAuthorisations.GetEmailItemSuccess(action.token,
                        { emailItem: { emailItem: { data: { ...response, popupType: 'eChitAuthorisations' } } } })),
                    catchError(error => of(new eChitAuthorisations.GetEmailItemFail(action.token, error))))
            ));

    @Effect({ dispatch: false })
    viewMSGFile$ = this.actions$
        .pipe(ofType<eChitAuthorisations.GetEmailItemSuccess>(eChitAuthorisations.ECHIT_AUTHORISATIONS_EMAIL_ITEM_SUCCESS),
            map((action) => {
                this.popupService.openMsgFilePopup('ECHIT_AUTHORISATIONS_MSG_FILE_POPUP', action.payload.emailItem)
                    .subscribe((data: any) => {
                    });
            }));

}

