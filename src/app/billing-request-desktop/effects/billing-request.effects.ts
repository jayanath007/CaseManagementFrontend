import { ConfirmDialogResultKind } from './../../shared/models/dialog';
import { ConfirmDialogComponent } from './../../shared/components/confirm-dialog/confirm-dialog.component';
import { ShowReport } from './../../billing-request-core/actions/core';
import { InforDialogComponent } from './../../shared/components/infor-dialog/infor-dialog.component';
import { uuid } from '../../utils/uuid';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import { map, tap, switchMap, take, filter } from 'rxjs/operators';
import * as billingRequest from '../../billing-request-core/actions/core';
import { ConfirmDialogData } from '../../shared/models/dialog';
import { FailDialogComponent } from '../../shared/components/fail-dialog/fail-dialog.component';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { RequestFormTypes } from '../../billing-request-core/models/enums';
import { getBillingRequestViewByToken } from '../../billing-request-core/reducers/index';
import { from } from 'rxjs';
import { BillingRequestImportDataManagerComponent } from '../containers/billing-request-import-data-manager.Component';
import { AddRecordManagerComponent } from '../containers/add-record-manager.component';
import { PrintSettingManagerComponent } from '../containers/print-setting-manager.component';
import { ShowMessage, BILLING_REQUEST_SHOW_MESSAGE } from '../../billing-request-core/actions/core';
import { BillingRequestEditTimeManagerComponent } from '../containers/billing-request-edit-time-manager.component';
import { showConfirmDialog } from '../../core/utility/DpsUtility';

@Injectable()
export class BillingRequestEffects {
    constructor(protected store: Store<any>, private actions$: Actions, private dialog: MatDialog,
        private popupService: SystemJsPopupLoaderService, private urlPopupService: UrlPopupService) { }

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(BILLING_REQUEST_SHOW_MESSAGE),
        map((action) => {
            // showInforDialog(action.title, action.message, action.messageType, this.dialog);
            const dialogData: ConfirmDialogData = {
                content: {
                    title: action.payload.title,
                    message: action.payload.message,
                    acceptLabel: 'Yes',
                    rejectLabel: 'No'
                },
                contentParams: {},
                data: null
            };
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                panelClass: 'dps-notification',
                hasBackdrop: true,
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
                if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
                } else if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                    this.store.dispatch(new ShowReport(action.token,
                        {
                            reportType: action.payload.reportType, diaryId: action.payload.diaryId, letterName: action.payload.letterName,
                            matterInfo: action.payload.matterInfo
                        }));
                }
            });
        }));

    @Effect({ dispatch: false })
    headerGridClick$ = this.actions$.pipe(ofType<billingRequest.HeaderGridDoubleClick>(billingRequest
        .BILLING_REQUEST_HEADER_GRID_DOUBLE_CLICK),
        switchMap((action) =>
            this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                map((data) => ({
                    billingRequestView: data,
                    token: action.token,
                    action: action
                })),
                take(1))),
        tap((info) => {
            if (info.action.selectDataModel.popupType === RequestFormTypes.selectTime) {
                this.dialog.open(BillingRequestImportDataManagerComponent, {
                    data: {
                        input: info,
                        token: info.token
                    },
                    width: '60%',
                    height: '65%',
                    maxWidth: 'none',
                    panelClass: 'dps-billing-request-import-popup-panel',
                    disableClose: true
                }).afterClosed().subscribe(result => {
                    if (result === 'ooo') {

                    } else {

                    }
                });
            } else if (info.action.selectDataModel.popupType !== RequestFormTypes.selectTime) {
                this.dialog.open(AddRecordManagerComponent, {
                    data: {
                        input: info,
                        token: info.token
                    },
                    width: '50%',
                    height: '35%',
                    maxWidth: 'none',
                    panelClass: 'dps-billing-request-profit-cost-popup-panel',
                    disableClose: true
                }).afterClosed().subscribe(result => {
                    if (result === 'ooo') {

                    } else {

                    }
                });
            }
        }));

    @Effect({ dispatch: false })
    timeRecordList$ = this.actions$
        .pipe(ofType<billingRequest.GetTimeRecordListSuccessByMatter>(billingRequest.BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER_SUCCESS),
            switchMap((action) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((data) => ({
                        billingRequestGridData: action.payload.timeRecordList,
                        billingRequestView: data, token: action.token
                    })),
                    take(1))),
            tap((info) =>
                this.dialog.open(BillingRequestImportDataManagerComponent, {
                    data: {
                        input: info,
                        token: info.token
                    },
                    width: '60%',
                    height: '65%',
                    maxWidth: 'none',
                    panelClass: 'dps-billing-request-import-popup-panel',
                    disableClose: true
                }).afterClosed().subscribe(result => {
                    if (result === 'ooo') {

                    } else {

                    }
                })));

    @Effect({ dispatch: false })
    ProfitCostList$ = this.actions$
        .pipe(ofType<billingRequest.AddProfitCostAndExpensePopupOpen>(billingRequest.BILLING_REQUEST_PROFIT_COST_AND_EXPENSE_ROW_DATA),
            switchMap((action) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((data) => ({
                        billingRequestView: data, token: action.token
                    })),
                    take(1))),
            tap((info) =>
                this.dialog.open(AddRecordManagerComponent, {
                    data: {
                        input: info,
                        token: info.token
                    },
                    width: '50%',
                    height: '35%',
                    maxWidth: 'none',
                    panelClass: 'dps-billing-request-profit-cost-popup-panel',
                    disableClose: true
                }).afterClosed().subscribe(result => {
                    if (result === 'ooo') {

                    } else {

                    }
                })));
    // @Effect({ dispatch: false })
    // expenseList$ = this.actions$.
    //     pipe(ofType<billingRequest.AddExpenseRowDataPopupOpen>(billingRequest.BILLING_REQUEST_EXPENSE_ROW_DATA),
    //         switchMap((action) =>
    //             this.store.select(getBillingRequestViewByToken(action.token)).pipe(
    //                 map((data) => ({
    //                     billingRequestView: data, token: action.token
    //                 })),
    //                 take(1))),
    //         tap((info) =>
    //             this.dialog.open(AddRecordManagerComponent, {
    //                 data: {
    //                     input: info,
    //                     token: info.token
    //                 },
    //                 width: '50%',
    //                 height: '35%',
    //                 maxWidth: 'none',
    //                 panelClass: 'dps-billing-request-profit-cost-popup-panel',
    //                 disableClose: true
    //             }).afterClosed().subscribe(result => {
    //                 if (result === 'ooo') {

    //                 } else {

    //                 }
    //             })));
    @Effect({ dispatch: false })
    disbursementList$ = this.actions$
        .pipe(ofType<billingRequest.GetDisbursementListByMatterSuccess>(billingRequest.BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER_SUCCESS),
            switchMap((action) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((data) => ({
                        disbursementGridData: action.payload.disbursementList,
                        billingRequestView: data, token: action.token
                    })),
                    take(1))),
            tap((info) =>
                this.dialog.open(BillingRequestImportDataManagerComponent, {
                    data: {
                        input: info,
                        token: info.token
                    },
                    width: '60%',
                    height: '65%',
                    maxWidth: 'none',
                    panelClass: 'dps-billing-request-import-popup-panel',
                    disableClose: true
                }).afterClosed().subscribe(result => {
                    if (result === 'ooo') {

                    } else {

                    }
                })));
    @Effect({ dispatch: false })
    printSetting$ = this.actions$.pipe(ofType<billingRequest.PrintSettingClick>(billingRequest.BILLING_REQUEST_PRINT_SETTING_CLICK),
        switchMap((action) =>
            this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                map((data) => ({
                    billingRequestView: data, token: action.token
                })),
                take(1))),
        tap((info) =>
            this.dialog.open(PrintSettingManagerComponent, {
                data: {
                    input: info,
                    token: info.token
                },
                width: '45%',
                height: '66%',
                maxWidth: 'none',
                panelClass: 'dps-print-options-popup-panel',
                disableClose: true
            }).afterClosed().subscribe(result => {
                if (result === 'ooo') {

                } else {

                }
            })));

    @Effect({ dispatch: false })
    EditTimeEntry$ = this.actions$
        .pipe(ofType<billingRequest.EditTimeEntryPopupOpen>(billingRequest.BILLING_REQUEST_EDIT_TIME_ENTRY),
            switchMap((action) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((data) => ({
                        billingRequestView: data,
                        rowData: action.payload.rowData,
                        token: action.token
                    })),
                    take(1))),
            tap((info) =>
                this.dialog.open(BillingRequestEditTimeManagerComponent, {
                    data: {
                        input: info,
                        token: info.token
                    },
                    width: '50%',
                    height: '35%',
                    maxWidth: 'none',
                    panelClass: 'dps-billing-request-edit-time-entry-popup-panel',
                    disableClose: true
                }).afterClosed().subscribe(result => {
                    if (result === 'ooo') {

                    } else {

                    }
                })));

    @Effect({ dispatch: false })
    deleteWithValidation$ = this.actions$.pipe(ofType<billingRequest.CheckIsValidDeleteRequestSuccess>
        (billingRequest.CHECK_IS_VALID_DELETE_REQUEST_SUCCESS),
        filter(action => action.detailStatus && action.detailStatus.length > 0 && !!action.detailStatus[0].message),
        map(action =>
            showConfirmDialog('Delete', action.detailStatus[0].message, this.dialog)
                .afterClosed().subscribe(dialogResult => {
                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                        this.store.dispatch(new billingRequest.DeleteRequest(action.token))
                    }
                }))
    );

}

