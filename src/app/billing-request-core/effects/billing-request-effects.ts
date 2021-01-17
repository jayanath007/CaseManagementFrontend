import { getUser } from './../../auth';
import { BillingRequestReportType, DropDownPropertyName } from './../models/enums';
import { UrlPopupService } from './../../shell-desktop/services/url-popup.service';

import { BillingRequestService } from '../services/billing-request.service';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as billingRequest from '../actions/core';
import { switchMap, map, catchError, mergeMap, take, filter, tap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { BillingTimeRecordResponseModel } from '../models/interfaces';
import { BillingOptions, RecordTypes, AddressType, SaveButtonTypeText, PopupOpenMode } from '../models/enums';
import { BillingRequestState } from '../reducers/billing-request';
import { getBillingRequestViewByToken, getMatterInfoByToken } from '../reducers';
import { dpsNewDate } from '../../utils/javascriptDate';
import { WebViewService } from '../../azure-storage';
import { AppConfig } from './../../core/configs/app-config';

@Injectable()
export class BillingRequestEffects {
    constructor(
        private actions$: Actions,
        private service: BillingRequestService,
        private store: Store<any>,
        private webViewService: WebViewService,
        private urlPopupService: UrlPopupService,
        private appConfig: AppConfig) {
    }

    @Effect()
    initView$ = this.actions$.pipe(ofType<billingRequest.InitPage>(billingRequest.INIT_BILLING_REQUEST),
        mergeMap((action) => {
            if (action && action.payload && action.payload.inputData && action.payload.inputData.matterData) {
                const matterReference = action.payload.inputData.matterData.matterReferenceNo; // need to check
                return from([
                    new billingRequest.GetMatterDataByRef(action.token, matterReference),
                    new billingRequest.LoadFeeEarnerList(action.token),
                    new billingRequest.GetVatCode(action.token),
                    new billingRequest.GetDescriptionList(action.token, '0'),
                    // new billingRequest.GetUserDefaultPrintSettings(action.token),
                    new billingRequest.GetMatterBalances(action.token, { matterRef: matterReference }),
                    new billingRequest.GetPrintSettingComboboxData(action.token, { dropdownRequestData: ['Bill', 'BillTime', 'BillDisb'] })
                ]);
            } else {
                return from([
                    new billingRequest.LoadFeeEarnerList(action.token),
                    new billingRequest.GetVatCode(action.token),
                    new billingRequest.GetDescriptionList(action.token, '0'),
                    // new billingRequest.GetUserDefaultPrintSettings(action.token),
                    new billingRequest.GetPrintSettingComboboxData(action.token, { dropdownRequestData: ['Bill', 'BillTime', 'BillDisb'] })
                ]);
            }
            return null;
        }));
    @Effect()
    requestEditData$ =
        this.actions$.pipe(ofType<billingRequest.InitPage>(billingRequest.INIT_BILLING_REQUEST),
            filter(action => action.payload.inputData.billRequestId > 0),
            map(action => new billingRequest.GetEditData(
                action.token,
                action.payload.inputData.matterData.matterReferenceNo,
                action.payload.inputData.matterData.branchID,
                action.payload.inputData.billRequestId
            )));

    @Effect()
    getEditData$ =
        this.actions$.pipe(ofType<billingRequest.GetEditData>(billingRequest.GET_EDIT_DATA),
            switchMap(action =>
                this.service.getBillRequestEditData(action.billReqId, action.materRef, action.branchid)
                    .pipe(map((response) =>
                        new billingRequest.GetEditDataSuccess(action.token, response)),
                        catchError(error => of(new billingRequest.GetEditDataFail(action.token))))
            ));

    @Effect()
    matterDataChange$ =
        this.actions$
            .pipe(ofType<billingRequest.MatterDataChange>(billingRequest.BILLING_REQUEST_MATTER_DATA_CHANGE),
                switchMap((action: billingRequest.MatterDataChange) =>
                    this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                        map((formViewDataInfo: BillingRequestState) => ({
                            nominalCodeRequestViewModel: {
                                matterRef: action.payload.matterData ? action.payload.matterData.matterRef : '',
                                feeEarner: action.payload.matterData ? action.payload.matterData.feeEarner : ''
                            },
                            matterRef: action.payload.matterData ? action.payload.matterData.matterRef : '',
                            token: action.token
                        })),
                        take(1))),
                mergeMap((info) => {
                    return from([
                        new billingRequest.GetNominalList(info.token, info.nominalCodeRequestViewModel),
                        new billingRequest.GetMatterBalances(info.token, { matterRef: info.matterRef })
                    ]);
                }));

    @Effect()
    loadMaterFromMatterRef$ =
        this.actions$.pipe(ofType<billingRequest.GetMatterDataByRef>(billingRequest.BILLING_REQUEST_MATTER_INFO_BY_REF),
            switchMap((action: billingRequest.GetMatterDataByRef) =>
                this.service.getMatterDataByRef(action.matterRef).pipe(map((response) =>
                    new billingRequest.GetMatterDataByRefSuccess(action.token, { matterData: response })),
                    catchError(error => of(new billingRequest.GetMatterDataByRefFail(action.token, error))))
            ));

    @Effect()
    matterDataSuccess$ =
        this.actions$.pipe(ofType<billingRequest.GetMatterDataByRefSuccess>(billingRequest.BILLING_REQUEST_MATTER_INFO_BY_REF_SUCCESS),
            filter(action => action.payload && action.payload.matterData && !!action.payload.matterData.feeEarner
                && !!action.payload.matterData.matterRef),
            map(action => {
                return new billingRequest.GetNominalList(action.token, {
                    feeEarner: action.payload.matterData.feeEarner,
                    matterRef: action.payload.matterData.matterRef
                });
            }));
    // Load grid data
    @Effect()
    LoadAllDataGrid$ =
        this.actions$.pipe(ofType<billingRequest.SelectTimePopupOpen>(billingRequest.BILLING_REQUEST_SELECT_TIME_OPEN),
            switchMap((action: billingRequest.SelectTimePopupOpen) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((formViewDataInfo: BillingRequestState) => ({
                        billingRequestViewModel: {
                            billingOption: BillingOptions.billSelectTime,
                            billToAmount: formViewDataInfo.quickBillAmmount,
                            billToDate: formViewDataInfo.quickBillDate,
                            matterRef: formViewDataInfo.matterData.matterRef,
                            timRef: 0 // As requested by Suren
                        },
                        disbursmentRequestViewModel: {
                            matterRef: formViewDataInfo.matterData.matterRef,
                            disbursementsBeforeDate: formViewDataInfo.quickBillDate,
                        },
                        nominalCodeRequestViewModel: {
                            matterRef: formViewDataInfo.matterData.matterRef,
                            feeEarner: formViewDataInfo.matterData.feeEarner
                        },
                        token: action.token
                    })),
                    take(1))),
            mergeMap((info) => {
                return from([
                    new billingRequest.GetTimeRecordListByMatter(info.token, info.billingRequestViewModel),
                    new billingRequest.GetNominalList(info.token, info.nominalCodeRequestViewModel),
                    new billingRequest.GetNominalDefaultByInit(info.token)
                ]);
            }));

    @Effect()
    LoadAllDataGridFromMatterChange$ =
        this.actions$.pipe(ofType<billingRequest.DisbursmentPopupOpen>(billingRequest.BILLING_REQUEST_DISBURSMENT_OPEN),
            switchMap((action: billingRequest.DisbursmentPopupOpen) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((formViewDataInfo: BillingRequestState) => ({
                        billRequestViewModel: {
                            billingOption: BillingOptions.billSelectTime,
                            billToAmount: formViewDataInfo.quickBillAmmount,
                            billToDate: formViewDataInfo.quickBillDate,
                            matterRef: formViewDataInfo.matterData.matterRef,
                            timRef: 0 // As requested by Suren
                        },
                        disbursmentRequestViewModel: {
                            billingOption: BillingOptions.billSelectTime,
                            billToAmount: formViewDataInfo.quickBillAmmount,
                            billToDate: formViewDataInfo.quickBillDate,
                            matterRef: formViewDataInfo.matterData.matterRef,
                            disbursementsBeforeDate: formViewDataInfo.quickBillDate,
                        },
                        token: action.token
                    })),
                    take(1))),
            switchMap((info) => {
                return from([
                    new billingRequest.GetDisbursementListByMatter(info.token, info.disbursmentRequestViewModel),
                ]);
            }));

    @Effect()
    loadQuickBillData$ =
        this.actions$
            .pipe(ofType<billingRequest.GetQuickBillProcess>(billingRequest.BILLING_REQUEST_QUICK_BILL_PROCESS_DATA),
                switchMap((action: billingRequest.GetQuickBillProcess) =>
                    this.service.GetQuickBillProcessedData(action.getTimeModel).pipe(map((response) =>
                        new billingRequest.GetQuickBillProcessSuccess(action.token, { timeAndDisbursementRecordList: response })),
                        catchError(error => of(new billingRequest.GetQuickBillProcessFail(action.token, error))))
                ));
    @Effect()
    loadTimeRecodingData$ =
        this.actions$.pipe(ofType<billingRequest.GetTimeRecordListByMatter>(billingRequest.BILLING_REQUEST_TIME_RECORD_LIST_BY_MATTER),
            switchMap((action: billingRequest.GetTimeRecordListByMatter) =>
                this.service.GetUnbilledTimeRecord(action.getTimeModel).pipe(map((response) => // change service call
                    new billingRequest.GetTimeRecordListSuccessByMatter(action.token, { timeRecordList: response })),
                    catchError(error => of(new billingRequest.GetTimeRecordListFailByMatter(action.token, error))))
            ));
    @Effect()
    loadDisbursementData$ =
        this.actions$.pipe(ofType<billingRequest.GetDisbursementListByMatter>(billingRequest.BILLING_REQUEST_DISBURSEMENT_LIST_BY_MATTER),
            switchMap((action: billingRequest.GetDisbursementListByMatter) =>
                this.service.GetUnbilledDisbursements(action.getDisbursementModel).pipe(map((response) => // change service call
                    new billingRequest.GetDisbursementListByMatterSuccess(action.token, { disbursementList: response })),
                    catchError(error => of(new billingRequest.GetDisbursementListByMatterFail(action.token, error))))
            ));
    // Load grid data end
    @Effect()
    loadFeeEarnerListData$ = this.actions$.pipe(ofType<billingRequest.LoadFeeEarnerList>(billingRequest.BILLING_REQUEST_FEEEARNER_LIST),
        switchMap((action: billingRequest.LoadFeeEarnerList) =>
            this.service.getFeeEarnerList().pipe(map((response) =>
                new billingRequest.LoadFeeEarnerListSuccess(action.token, { feeEarnerList: response })),
                catchError(error => of(new billingRequest.LoadFeeEarnerListFail(action.token, error))))
        ));
    @Effect()
    vatCodeListData$ = this.actions$.pipe(ofType<billingRequest.GetVatCode>(billingRequest.GET_BILLING_REQUEST_VAT_CODE_LIST),
        switchMap((action: billingRequest.GetVatCode) =>
            this.service.getVatCodeList().pipe(map((response) =>
                new billingRequest.GetVatCodeSuccess(action.token, { vatCodeList: response })),
                catchError(error => of(new billingRequest.GetVatCodeFail(action.token, error))))
        ));
    @Effect()
    nominalListData$ = this.actions$.pipe(ofType<billingRequest.GetNominalList>(billingRequest.BILLING_REQUEST_NOMINAL_LIST),
        switchMap((action: billingRequest.GetNominalList) =>
            this.service.getNominalList(action.nominalCodeRequestViewModel).pipe(map((response) =>
                new billingRequest.GetNominalListListSuccess(action.token, { nominalList: response })),
                catchError(error => of(new billingRequest.GetNominalListListFail(action.token, error))))
        ));
    @Effect()
    descriptionListData$ =
        this.actions$.pipe(ofType<billingRequest.GetDescriptionList>(billingRequest.BILLING_REQUEST_DESCRIPTION_LIST),
            switchMap((action: billingRequest.GetDescriptionList) =>
                this.service.getShortcutDescriptionsByType(action.shortCutType).pipe(map((response) =>
                    new billingRequest.GetDescriptionSuccess(action.token, { descriptionList: response })),
                    catchError(error => of(new billingRequest.GetDescriptionFail(action.token, error))))
            ));
    @Effect()
    timeGridHeaderLoad$ =
        this.actions$.pipe(ofType<billingRequest.TimeAndProfitProcess>(billingRequest.BILLING_REQUEST_TIME_COST_OK_CLICK),
            switchMap((action: billingRequest.TimeAndProfitProcess) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((formViewDataInfo: BillingRequestState) => {
                        let billingDetailsData: BillingTimeRecordResponseModel[] = [];
                        formViewDataInfo.timeAndProfitHeaderGridData.filter(item => item.data.timTType !== RecordTypes.ProfitCost)
                            .forEach(val => {
                                billingDetailsData = billingDetailsData.concat(val.data.billingDetails);
                            });
                        if (billingDetailsData && billingDetailsData.length > 0) {
                            if (formViewDataInfo.importAndAddRecordPopupMode === PopupOpenMode.Edit) {
                                action.model.billingDetails.forEach((val) => {
                                    for (let i = billingDetailsData.length - 1; i >= 0; i--) {
                                        if (billingDetailsData[i].timUniqueRef === val.timUniqueRef) {
                                            billingDetailsData.splice(i, 1);
                                        }
                                    }
                                });
                                return {
                                    model:
                                        { ...action.model, billingDetails: billingDetailsData }
                                    , token: action.token
                                };
                            } else {
                                return {
                                    model:
                                        { ...action.model, billingDetails: action.model.billingDetails.concat(billingDetailsData) }
                                    , token: action.token
                                };
                            }

                        } else {
                            return {
                                model:
                                    { ...action.model, billingDetails: action.model.billingDetails }
                                , token: action.token
                            };
                        }
                    }),
                    take(1))),
            switchMap((info) =>
                this.service.GetTimeProfitHeaderData(info.model).pipe(map((response) =>
                    new billingRequest.TimeAndProfitProcessSuccess(info.token, { timeProfitHeaderDataViewModel: response })),
                    catchError(error => of(new billingRequest.TimeAndProfitProcessFail(info.token, error))))
            ));

    @Effect()
    loadNominalByProfit$ =
        this.actions$
            .pipe(ofType<billingRequest.AddProfitCostAndExpensePopupOpen>(billingRequest.BILLING_REQUEST_PROFIT_COST_AND_EXPENSE_ROW_DATA),
                switchMap((action: billingRequest.AddProfitCostAndExpensePopupOpen) =>
                    this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                        map((formViewDataInfo: BillingRequestState) => ({
                            nominalCodeRequestViewModel: {
                                matterRef: formViewDataInfo.matterData.matterRef,
                                feeEarner: formViewDataInfo.matterData.feeEarner
                            },
                            token: action.token
                        })),
                        take(1))),
                mergeMap((info) => {
                    return from([
                        new billingRequest.GetNominalList(info.token, info.nominalCodeRequestViewModel),
                        new billingRequest.GetNominalDefaultByInit(info.token)
                    ]);
                }));
    @Effect()
    printSetting$ =
        this.actions$.pipe(ofType<billingRequest.GetUserDefaultPrintSettings>(billingRequest.BILLING_REQUEST_PRINT_SETTING),
            switchMap((action: billingRequest.GetUserDefaultPrintSettings) =>
                this.service.getDefaultBillSettings().pipe(map((response) =>
                    new billingRequest.GetUserDefaultPrintSettingsSuccess(action.token, { printSetting: response })),
                    catchError(error => of(new billingRequest.GetUserDefaultPrintSettingsFail(action.token, error))))
            ));
    @Effect()
    matterBalances$ =
        this.actions$.pipe(ofType<billingRequest.GetMatterBalances>(billingRequest.BILLING_REQUEST_MATTER_BALANCES),
            switchMap((action: billingRequest.GetMatterBalances) =>
                this.service.getMatterBalances(action.payload.matterRef).pipe(map((response) =>
                    new billingRequest.GetMatterBalancesSuccess(action.token, { matterBalances: response })),
                    catchError(error => of(new billingRequest.GetMatterBalancesFail(action.token, error))))
            ));

    @Effect()
    initewPrintSettingView$ =
        this.actions$
            .pipe(ofType<billingRequest.PrintSettingClick>(billingRequest.BILLING_REQUEST_PRINT_SETTING_CLICK),
                switchMap((action: billingRequest.PrintSettingClick) =>
                    this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                        map((formViewDataInfo: BillingRequestState) => ({
                            addressRequestViewModel: {
                                matterRef: formViewDataInfo.matterData.matterRef,
                                clientRef: formViewDataInfo.matterData.clientRef,
                                addCorrespondence: false,
                                addStatement: false,
                                addBilling: false,
                                addOther: true
                            },
                            dropdownRequestData: ['Bill', 'BillTime', 'BillDisb'],
                            token: action.token
                        })),
                        take(1))),
                mergeMap((info) => {
                    return from([
                        new billingRequest.GetPrintSettingAddress(info.token, { addressRequestViewModel: info.addressRequestViewModel }),
                        // new billingRequest.GetPrintSettingComboboxData(info.token, { dropdownRequestData: info.dropdownRequestData })
                    ]);
                }));
    @Effect()
    printSettingAddress$ =
        this.actions$.pipe(ofType<billingRequest.GetPrintSettingAddress>(billingRequest.BILLING_REQUEST_PRINT_SETTING_ADDRESS),
            switchMap((action: billingRequest.GetPrintSettingAddress) =>
                this.service.getAddress(action.payload.addressRequestViewModel).pipe(map((response) =>
                    new billingRequest.GetPrintSettingAddressSuccess(action.token, { addressList: response })),
                    catchError(error => of(new billingRequest.GetPrintSettingAddressFail(action.token, error))))
            ));
    @Effect()
    comboboxData$ =
        this.actions$.pipe(ofType<billingRequest.GetPrintSettingComboboxData>(billingRequest.BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA),
            switchMap((action: billingRequest.GetPrintSettingComboboxData) =>
                this.service.getComboBoxData(action.payload.dropdownRequestData).pipe(map((response) =>
                    new billingRequest.GetPrintSettingComboboxDataSuccess(action.token, { allDropdownData: response })),
                    catchError(error => of(new billingRequest.GetPrintSettingComboboxDataFail(action.token, error))))
            ));
    @Effect()
    printSettingByCombo$ =
        this.actions$
            .pipe(ofType<billingRequest.GetPrintSettingComboboxDataSuccess>(billingRequest
                .BILLING_REQUEST_PRINT_SETTING_COMBOBOX_DATA_SUCCESS),
                switchMap((action: billingRequest.GetPrintSettingComboboxDataSuccess) => {
                    return from([new billingRequest.GetUserDefaultPrintSettings(action.token)]);
                }));

    @Effect()
    saveData$ =
        this.actions$.pipe(ofType<billingRequest.BillingRequestSaveData>(billingRequest.BILLING_REQUEST_SAVE_POST_PRINT_DATA),
            switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
            switchMap(({ user, action }) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((formViewDataInfo: BillingRequestState) => ({
                        billingRequestSavePrintViewModel: {
                            billingHeaderOptions: {
                                billRequestType: (action.payload.totalsAndbuttonTypeModel
                                    && action.payload.totalsAndbuttonTypeModel.buttonTypeText === SaveButtonTypeText.Print) ?
                                    'PrintReport' :
                                    action.payload.totalsAndbuttonTypeModel.buttonTypeText === SaveButtonTypeText.Request ?
                                        'Request' : 'PostRequest',
                                printSaveMode: (action.payload.totalsAndbuttonTypeModel
                                    && action.payload.totalsAndbuttonTypeModel.buttonTypeText === SaveButtonTypeText.Print) ?
                                    'DontSave' : 'SaveRequest', // 'SaveRequest', // DontSave,SaveRequest,SaveBill // Post
                                billFormMode: 'CreateBill', // CreateBill,CreatePrepareBillOnly, ....
                                caseFileIdentity: {
                                    branchId: formViewDataInfo.matterData.branchId,
                                    appId: formViewDataInfo.matterData.appId,
                                    fileId: formViewDataInfo.matterData.fileId,
                                    displayDataString: ''
                                },
                                matterRef: formViewDataInfo.matterData ? formViewDataInfo.matterData.matterRef : '',
                                billRequestID: formViewDataInfo.billRequestID,
                                diaryId: formViewDataInfo.diaryId,
                                billNo: setBillNoValidation(action.payload.totalsAndbuttonTypeModel.buttonTypeText,
                                    formViewDataInfo.isProforma, formViewDataInfo.billOrProformaText, formViewDataInfo.billOrProformaNo),
                                billText: setBillTextValidation(action.payload.totalsAndbuttonTypeModel.buttonTypeText,
                                    formViewDataInfo.isProforma, formViewDataInfo.billOrProformaText, formViewDataInfo.billOrProformaNo),
                                matterDetails: formViewDataInfo.matterData ? formViewDataInfo.matterData.matterDetails : '',
                                billDate: dpsNewDate(user.general.dateTimeOffset).toDpsString(),
                                narrative: formViewDataInfo.narrativeItemText,
                                billAddressee: formViewDataInfo.billOrProformaAddress,
                                adminNotes: formViewDataInfo.note,
                                radAddCorrespondence: false,
                                radAddStatement: false,
                                radAddBilling: false,
                                letterAddressee: formViewDataInfo.billOrProformaAddress,
                                clientRef: formViewDataInfo.matterData.clientRef,
                                clientName: formViewDataInfo.matterData.clientName,
                                addressBillingAddr1: formViewDataInfo.selectedprintSettingAddress ?
                                    formViewDataInfo.selectedprintSettingAddress.addressBillingAddr1 : '',
                                addressBillingAddr2: formViewDataInfo.selectedprintSettingAddress ?
                                    formViewDataInfo.selectedprintSettingAddress.addressBillingAddr2 : '',
                                addressBillingTown: formViewDataInfo.selectedprintSettingAddress ?
                                    formViewDataInfo.selectedprintSettingAddress.addressBillingAddr3 : '',
                                addressBillingCounty: formViewDataInfo.selectedprintSettingAddress ?
                                    formViewDataInfo.selectedprintSettingAddress.addressBillingAddr4 : '',
                                addressBillingPostcode: formViewDataInfo.selectedprintSettingAddress ?
                                    formViewDataInfo.selectedprintSettingAddress.addressBillingPostcode : '',
                                amountOnAccount: 0,
                                vatTotal: action.payload.totalsAndbuttonTypeModel ?
                                    action.payload.totalsAndbuttonTypeModel.totalValues.totalVatSum : 0,
                                timeVAT: action.payload.totalsAndbuttonTypeModel ?
                                    action.payload.totalsAndbuttonTypeModel.totalValues.totalFeesVat : 0,
                                netTotal: action.payload.totalsAndbuttonTypeModel ?
                                    action.payload.totalsAndbuttonTypeModel.totalValues.totalNetSum : 0,
                                grossTotal: action.payload.totalsAndbuttonTypeModel ?
                                    action.payload.totalsAndbuttonTypeModel.totalValues.billTotal : 0,
                                chkProforma: formViewDataInfo.isProforma,
                                chkBill: formViewDataInfo.isChkBill,
                                isMultiCurrency: false, // backend
                                showIndividualWIPOnBill: false, // backend
                                billingRequestOptions: {
                                    userRef: '',
                                    isExsitBillLayoutLocation: formViewDataInfo.printSettingModel.isExsitBillLayoutLocation ?
                                        formViewDataInfo.printSettingModel.isExsitBillLayoutLocation : 0,
                                    chkShowTimeBreakdown: formViewDataInfo.printSettingModel.chkShowTimeBreakdown,
                                    chkShowDisbBreakdown: formViewDataInfo.printSettingModel.chkShowDisbBreakdown,
                                    chkGroupTimeReportByFeeEarner: formViewDataInfo.printSettingModel.chkGroupTimeReportByFeeEarner,
                                    chkShowGrandTotal: formViewDataInfo.printSettingModel.chkShowGrandTotal,
                                    chkShowFESubTotals: formViewDataInfo.printSettingModel.chkShowFESubTotals,
                                    chkShowValues: formViewDataInfo.printSettingModel.chkShowValues,
                                    chkShowTimeNotes: formViewDataInfo.printSettingModel.chkShowTimeNotes,
                                    chkShowMinutes: formViewDataInfo.printSettingModel.chkShowMinutes,
                                    chkPromptForMoneyOnAccount: formViewDataInfo.printSettingModel.chkPromptForMoneyOnAccount,
                                    chkSaveAsWord: formViewDataInfo.printSettingModel.chkSaveAsWord,
                                    chkShowTimeDates: formViewDataInfo.printSettingModel.chkShowTimeDates,
                                    chkShowTimeDetails: formViewDataInfo.printSettingModel.chkShowTimeDetails,

                                    groupTime: formViewDataInfo.printSettingModel.groupTime,
                                    bIL_ShowPreviousDPB: formViewDataInfo.printSettingModel.bIL_ShowPreviousDPB,

                                    billDefaultLayout: formViewDataInfo.billDropDownSelectedData ?
                                        formViewDataInfo.billDropDownSelectedData.userRepID : 0,
                                    timeDefaultLayout: formViewDataInfo.timeDropDownSelectedData ?
                                        formViewDataInfo.timeDropDownSelectedData.userRepID : 0,
                                    disbDefaultLayout: formViewDataInfo.disbDropDownSelectedData ?
                                        formViewDataInfo.disbDropDownSelectedData.userRepID : 0,

                                    billLayoutSelectedLocation: formViewDataInfo.billDropDownSelectedData ?
                                        formViewDataInfo.billDropDownSelectedData.userRepLocation : '',
                                    timeLayOutSelectedLocation: formViewDataInfo.timeDropDownSelectedData ?
                                        formViewDataInfo.timeDropDownSelectedData.userRepLocation : '',
                                    disLayOutSelectedLocation: formViewDataInfo.disbDropDownSelectedData ?
                                        formViewDataInfo.disbDropDownSelectedData.userRepLocation : '',
                                },
                            },
                            billingReport: [],
                            billingTime: formViewDataInfo.timeAndProfitHeaderGridData.reduce((all, topItem) => {
                                return all.concat(topItem.data.billingDetails);
                            }, []),
                            billingDisbs: formViewDataInfo.disbsAndExpenseHeaderGridData.reduce((all, topItem) => {
                                return all.concat(topItem.data.disbursmentItemDetails);
                            }, []),
                        },
                        successMessage: formViewDataInfo.isProforma ?
                            'Proforma posted successfully. \n Would you like to print a copy of the proforma now? '
                            : 'Bill Request successfully sent to Accounts.\n Would you like to print a copy of the bill now?',
                        token: action.token,
                        payload: action.payload,
                        user
                    })),
                    take(1))),
            switchMap<any, any>((info) => {
                if (info.payload && info.payload.totalsAndbuttonTypeModel
                    && info.payload.totalsAndbuttonTypeModel.buttonTypeText === SaveButtonTypeText.Print) {
                    return this.service.printBillingRequestData(info.billingRequestSavePrintViewModel).pipe(map((response) =>
                        new billingRequest.BillingRequestPrintDataSuccess(info.token, { printSuccessDataModel: response })),
                        catchError(error => of(new billingRequest.BillingRequestSaveDataFail(info.token, error))));
                } else {
                    return this.service.saveBillingRequestData(info.billingRequestSavePrintViewModel).pipe(map((response) =>
                        new billingRequest.BillingRequestSaveDataSuccess(info.token,
                            {
                                successMessage: info.successMessage, saveSuccessDataModel: response,
                                timeOffset: info.user.general.dateTimeOffset
                            })),
                        catchError(error => of(new billingRequest.BillingRequestSaveDataFail(info.token, error))));
                }
            }));

    @Effect()
    printSuccessData$ = this.actions$
        .pipe(ofType<billingRequest.BillingRequestSaveDataSuccess>(billingRequest.BILLING_REQUEST_SAVE_POST_PRINT_DATA_SUCCESS),
            switchMap(action => this.store.select(getMatterInfoByToken(action.token)).pipe(
                take(1),
                map(matterInfo => ({ matterInfo, action }))
            )),
            switchMap(({ matterInfo, action }) => {
                return from([new billingRequest.ShowMessage(action.token,
                    {
                        title: 'Message',
                        message: action.payload.successMessage,
                        reportType: BillingRequestReportType.Request,
                        diaryId: action.payload.saveSuccessDataModel.id,
                        letterName: action.payload.saveSuccessDataModel.name,
                        matterInfo
                    })]);
            }));

    @Effect({ dispatch: false })
    saveSuccess$ = this.actions$
        .pipe(ofType<billingRequest.ShowReport>(billingRequest.BILLING_REQUEST_SHOW_REPORT),
            switchMap((action) =>
                this.webViewService.getDiaryWebViewUrl(action.payload.matterInfo.appCode || action.payload.matterInfo.matterCode,
                    action.payload.matterInfo.branchId,
                    action.payload.matterInfo.fileId, action.payload.diaryId, action.payload.letterName).pipe(
                        map(url => this.urlPopupService.openWithUrlPoup(url, 'billing-request-print', true, false, 'Billing Request', true))
                    )
            ));

    // @Effect({ dispatch: false })
    // printSuccess$ = this.actions$
    //     .pipe(ofType<billingRequest.BillingRequestPrintDataSuccess>(billingRequest.BILLING_REQUEST_PRINT_DATA_SUCCESS),
    //         map((action) => {
    //             const link: HTMLAnchorElement = document.createElement('a');
    //             link.download = 'Billing Request';
    //             link.href = 'data:application/pdf;base64,' + action.payload.printSuccessDataModel.filePath;
    //             link.click();
    //         }
    //         ));

    @Effect()
    printSuccess$ = this.actions$
        .pipe(ofType<billingRequest.BillingRequestPrintDataSuccess>(billingRequest.BILLING_REQUEST_PRINT_DATA_SUCCESS),
            map(action => new billingRequest.GetDocumentPreviewToken(action.token, action.payload.printSuccessDataModel.fileName))
        );

    @Effect()
    GetWebViewToken$ = this.actions$.pipe(ofType<billingRequest.GetDocumentPreviewToken>(billingRequest.GET_DOCUMENT_PREVIEW_TOKEN),
        switchMap(action =>
            this.service.getBillingRequestWebViewToken(action.fileName).pipe(map((response) =>
                new billingRequest.GetDocumentPreviewTokenSuccess(action.token, response.token, action.fileName)),
                catchError(error => of(new billingRequest.GetDocumentPreviewTokenFail(action.token))))
        ));

    @Effect({ dispatch: false })
    printPreview$ = this.actions$
        .pipe(ofType<billingRequest.GetDocumentPreviewTokenSuccess>(billingRequest.GET_DOCUMENT_PREVIEW_TOKEN_SUCCESS),
            tap((action) => {
                let url = `${this.appConfig.apiv3StorageProxy}/Download/${action.fileName}?id=${action.viewToken}`;
                if (!url.includes('http')) {
                    url = `${window.origin}${url}`;
                }
                this.urlPopupService.openWithUrlPoup(url, 'billing-request-print', true, false, 'Billing Request', true);
            }
            ));


    @Effect()
    saveDefaultPrintSetting$ = this.actions$
        .pipe(ofType<billingRequest.SavePrintMakeDefaultAllBill>(billingRequest.SAVE_PRINT_MAKE_DEFAULT_ALL_BILL),
            switchMap((action) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((formViewDataInfo) => ({
                        billSettingRequestViewModel: {
                            userRef: formViewDataInfo.printSettingModel.userRef,
                            timeDefaultLayout: formViewDataInfo.printSettingModel.timeDefaultLayout,
                            billDefaultLayout: formViewDataInfo.printSettingModel.billDefaultLayout,
                            disbDefaultLayout: formViewDataInfo.printSettingModel.disbDefaultLayout,
                            isExsitBillLayoutLocation: formViewDataInfo.printSettingModel.isExsitBillLayoutLocation,
                            chkShowTimeBreakdown: formViewDataInfo.printSettingModel.chkShowTimeBreakdown,
                            groupTime: formViewDataInfo.printSettingModel.groupTime,
                            chkShowGrandTotal: formViewDataInfo.printSettingModel.chkShowGrandTotal,
                            chkShowValues: formViewDataInfo.printSettingModel.chkShowValues,
                            chkGroupTimeReportByFeeEarner: formViewDataInfo.printSettingModel.chkGroupTimeReportByFeeEarner,
                            chkShowFESubTotals: formViewDataInfo.printSettingModel.chkShowFESubTotals,
                            chkShowTimeNotes: formViewDataInfo.printSettingModel.chkShowTimeNotes,
                            chkShowMinutes: formViewDataInfo.printSettingModel.chkShowMinutes,
                            chkPromptForMoneyOnAccount: formViewDataInfo.printSettingModel.chkPromptForMoneyOnAccount,
                            chkShowDisbBreakdown: formViewDataInfo.printSettingModel.chkShowDisbBreakdown,
                            bIL_ShowPreviousDPB: formViewDataInfo.printSettingModel.bIL_ShowPreviousDPB,
                            chkShowTimeDates: formViewDataInfo.printSettingModel.chkShowTimeDates,
                            chkSaveAsWord: formViewDataInfo.printSettingModel.chkSaveAsWord,
                            chkShowTimeDetails: formViewDataInfo.printSettingModel.chkShowTimeDetails,
                        },
                        token: action.token
                    })),
                    take(1),
                    switchMap((Info) =>
                        this.service.saveDefaultPrintSetting(Info.billSettingRequestViewModel).pipe(map((response) =>
                            new billingRequest.SavePrintMakeDefaultAllBillSuccess(action.token, { savePrintSettingResponce: response })),
                            catchError(error => of(new billingRequest.SavePrintMakeDefaultAllBillFail(action.token, error))))
                    ))));

    @Effect()
    saveBillingAddress$ = this.actions$
        .pipe(ofType<billingRequest.SaveBillingAddress>(billingRequest.SAVE_BILLING_ADDRESS),
            switchMap((action) =>
                this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                    map((formViewDataInfo) => ({
                        billingAddressUpdateRequestViewModel: {
                            billingAddressRequestModel: {
                                matterRef: formViewDataInfo.matterData.matterRef,
                                clientRef: formViewDataInfo.matterData.clientRef,
                                addCorrespondence: action.selectedData.addresType === AddressType.Correspondence ? true : false,
                                addStatement: action.selectedData.addresType === AddressType.Statement ? true : false,
                                addBilling: action.selectedData.addresType === AddressType.Billing ? true : false,
                                addOther: action.selectedData.addresType === AddressType.Other ? true : false,
                            },
                            billingAddressResponceModel: {
                                addresType: action.selectedData.addresType,
                                addressBillingAddr1: action.selectedData.addressBillingAddr1,
                                addressBillingAddr2: action.selectedData.addressBillingAddr2,
                                addressBillingAddr3: action.selectedData.addressBillingAddr3,
                                addressBillingAddr4: action.selectedData.addressBillingAddr4,
                                addressBillingPostcode: action.selectedData.addressBillingPostcode,
                                // addressBillingCounty: action.selectedData.addressBillingCounty,
                                // addressBillingTown: action.selectedData.addressBillingTown
                            },
                        },
                        token: action.token
                    })),
                    take(1))),
            switchMap((info) =>
                this.service.saveBillingAddress(info.billingAddressUpdateRequestViewModel).pipe(map((response) =>
                    new billingRequest.SaveBillingAddressSuccess(info.token, { savedAddressList: response })),
                    catchError(error => of(new billingRequest.SaveBillingAddressFail(info.token, error))))
            ));

    @Effect()
    printcSuccessData$ =
        this.actions$
            .pipe(ofType<billingRequest.DropDownSelectChangeValue>(billingRequest.BILLING_REQUEST_DROP_DOWN_SELCT_CHANGE),
                switchMap((action: billingRequest.DropDownSelectChangeValue) =>
                    this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                        map((formViewDataInfo: BillingRequestState) => ({
                            requestViewModel: action.payload.propertyName === DropDownPropertyName.FeeEarner ? {
                                feeEarner: action.payload.selectedValue.key,
                                matterRef: formViewDataInfo.matterData.matterRef,
                                branchId: formViewDataInfo.matterData.branchId,
                            } : null,
                            dropDownName: action.payload.propertyName,
                            token: action.token
                        })),
                        take(1))),
                switchMap<any, any>((info) => {
                    if (info.dropDownName === DropDownPropertyName.FeeEarner) {
                        return this.service.getDefaultNominalValueByFE(info.requestViewModel).pipe(map((response) =>
                            new billingRequest.GetNominalByUserSuccess(info.token, { selectingNominalCode: response })),
                            catchError(error => of(new billingRequest.GetNominalByUserFail(info.token, error))));
                    } else {
                        return null;
                    }
                }));
    @Effect()
    editTimeRecord$ =
        this.actions$.pipe(ofType<billingRequest.EditTimeEntrySave>(billingRequest.BILLING_REQUEST_EDIT_TIME_ENTRY_SAVE),
            switchMap((action: billingRequest.EditTimeEntrySave) =>
                this.service.saveEditTimeRecord(action.payload.timeEditModel).pipe(map((response) =>
                    new billingRequest.GetEditTimeRecordDataSuccess(action.token, { responceModel: response })),
                    catchError(error => of(new billingRequest.GetEditTimeRecordDataFail(action.token, error))))
            ));

    @Effect()
    defaultNominalValue$ =
        this.actions$
            .pipe(ofType<billingRequest.GetNominalDefaultByInit>(billingRequest.BILLING_REQUEST_NOMINAL_BY_USER),
                switchMap((action: billingRequest.GetNominalDefaultByInit) =>
                    this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                        map((formViewDataInfo: BillingRequestState) => ({
                            requestViewModel: formViewDataInfo && formViewDataInfo.matterData ? {
                                feeEarner: formViewDataInfo.matterData.feeEarner,
                                matterRef: formViewDataInfo.matterData.matterRef,
                                branchId: formViewDataInfo.matterData.branchId,
                            } : null,
                            token: action.token
                        })),
                        take(1))),
                switchMap<any, any>((info) => {
                    return this.service.getDefaultNominalValueByFE(info.requestViewModel).pipe(map((response) =>
                        new billingRequest.GetNominalByUserSuccess(info.token, { selectingNominalCode: response })),
                        catchError(error => of(new billingRequest.GetNominalByUserFail(info.token, error))));
                }));

    @Effect()
    isValidDeleteRequest$ = this.actions$.pipe(ofType<billingRequest.CheckIsValidDeleteRequest>
        (billingRequest.CHECK_IS_VALID_DELETE_REQUEST),
        switchMap(action =>
            this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                map((formViewDataInfo: BillingRequestState) => ({
                    formViewDataInfo: formViewDataInfo,
                    token: action.token
                })),
                take(1))),
        switchMap(info =>
            this.service.IsValidDeleteRequest(info.formViewDataInfo.billOrProformaData).pipe(map((response) =>
                new billingRequest.CheckIsValidDeleteRequestSuccess(info.token, response)),
                catchError(error => of(new billingRequest.CheckIsValidDeleteRequestFail(info.token))))
        ));

    @Effect()
    deleteWhenNoValidation$ = this.actions$.pipe(ofType<billingRequest.CheckIsValidDeleteRequestSuccess>
        (billingRequest.CHECK_IS_VALID_DELETE_REQUEST_SUCCESS),
        filter(action => !action.detailStatus || action.detailStatus.length === 0),
        map(action => new billingRequest.DeleteRequest(action.token))
    );

    @Effect()
    deleteRequest$ = this.actions$.pipe(ofType<billingRequest.DeleteRequest>(billingRequest.DELETE_REQUEST),
        switchMap(action =>
            this.store.select(getBillingRequestViewByToken(action.token)).pipe(
                map((formViewDataInfo: BillingRequestState) => ({
                    formViewDataInfo: formViewDataInfo,
                    token: action.token
                })),
                take(1))),
        switchMap(info =>
            this.service.deleteBilligRequest(info.formViewDataInfo.billRequestID, info.formViewDataInfo.diaryId).pipe(map((response) =>
                new billingRequest.DeleteRequestSuccess(info.token, response)),
                catchError(error => of(new billingRequest.DeleteRequestFail(info.token))))
        ));


}



function setBillTextValidation(saveButtonTypeText, chkProforma, billTextValue, billNoValue) {
    let billText = billTextValue;
    if (saveButtonTypeText === SaveButtonTypeText.Post && chkProforma && billTextValue && billTextValue === 'Bill') {
        billText = 'Proforma';
    } else if (saveButtonTypeText === SaveButtonTypeText.Request && billNoValue === '*NEW*') {
        billText = 'Bill';
    }
    return billText;
}
function setBillNoValidation(saveButtonTypeText, chkProforma, billTextValue, billNoValue) {
    let billNo = billNoValue;
    if (saveButtonTypeText === SaveButtonTypeText.Post && chkProforma && billNoValue && billNoValue === 'Bill Request') {
        billNo = 'Proforma';
    } else if (saveButtonTypeText === SaveButtonTypeText.Request && billNo === '*NEW*') {
        billNo = 'Bill Request';
    }
    return billNo;
}
