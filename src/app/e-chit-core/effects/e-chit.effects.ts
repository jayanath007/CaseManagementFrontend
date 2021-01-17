
import { take, catchError, switchMap, map, tap, filter, mergeMap } from 'rxjs/operators';

import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { EChitService } from '../services/e-chit-service';
import * as EChitCore from '../actions/core';
import { of, combineLatest, from } from 'rxjs';
import {
    getReferencesListByToken, getClearanceTypeListByToken, getPayeeListListByToken,
    getReasonListByToken, getBranchListByToken, getVatCodeListByToken, getFeeEarnerListByToken, getNominalListByToken
    , getSupplierDocEnablesByToken, getClientDefaultsByToken, getEChitTypeListByToken,
    getPayerListByToken, getInputDataByToken, getEChitStateByToken, getModelByToken,
    getDisburcementValuByToken, getSelectedWorkTypesByToken, getSelectedDisbuTypesByToken, getEChitTypeByToken
} from '../reducers';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../shared';
import { ChequeRequestType, EChitPopupInputType } from '../models/enum';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MatterViewByClientServices } from '../../matter-view-by-client-core/services/matter-view-by-client-services';
import { GridRequest } from '../../matter-view-by-client-core/models/requests';
import { getUser, checkTimeRecordType } from '../../auth';
import { dpsNewDate } from '../../utils/javascriptDate';
import { eBillingType } from '../../core/lib/matter';
import { MatterRefData, ExtraEChitPopupInput, EChitPrint } from '../models/interfaces';
import { AddTimeType } from '../../core/lib/timeRecord';



@Injectable()
export class EChitEffects {
    constructor(private datePipe: DatePipe, private dialog: MatDialog,
        private actions$: Actions, private store: Store<any>, private service: EChitService,
        private popupService: SystemJsPopupLoaderService,
        private matterServices: MatterViewByClientServices) { }





    @Effect()
    initEChit$ = this.actions$.pipe(ofType<EChitCore.InitEChit>(EChitCore.INIT_E_CHIT),
        switchMap((action) => {

            const supplierDocEnables$ = this.store.select(getSupplierDocEnablesByToken(action.token)).pipe(take(1),
                switchMap((nominalList) => {
                    if (nominalList) {
                        return of(nominalList);
                    } else {
                        return this.service.getSetupValueBoolean();
                    }
                }), take(1));

            const clientDefaults$ = this.store.select(getClientDefaultsByToken(action.token)).pipe(take(1),
                switchMap((nominalList) => {
                    if (nominalList) {
                        return of(nominalList);
                    } else {
                        return this.service.getClientDefaults();
                    }
                }), take(1));

            const allChequeRequests$ = this.store.select(getEChitTypeListByToken(action.token)).pipe(take(1),
                switchMap((nominalList) => {
                    if (nominalList) {
                        return of(nominalList);
                    } else {
                        return this.service.GetAllChequeRequests();
                    }
                }), take(1));

            // presidentH
            // const disbType$ = this.store.select(getDisbursementTypeByToken(action.token)).pipe(take(1),
            //     switchMap((nominalList) => {
            //         if (nominalList) {
            //             return of(nominalList);
            //         } else {
            //             return this.service.GetDisbursementType(action.payload.inputData.matterInfo.data);
            //         }
            //     }), take(1));


            return combineLatest(
                supplierDocEnables$,
                clientDefaults$,
                allChequeRequests$,
                ((supplierDocEnables, clientDefaults, allChequeRequests) => ({
                    supplierDocEnables: supplierDocEnables,
                    clientDefaults: clientDefaults,
                    allChequeRequests: allChequeRequests,
                }))
            ).pipe(take(1), map((data) => {
                return new EChitCore.InitEChitSuccess(action.token,
                    {
                        supplierDocEnables: data.supplierDocEnables,
                        clientDefaults: data.clientDefaults,
                        eChitTypes: data.allChequeRequests,


                    });
            }), catchError(error => of(new EChitCore.EChitTypeChangeFail(action.token, {
                error: error
            }))));

        }));




    @Effect()
    eChitTypeChange$ = this.actions$.pipe(ofType<EChitCore.EChitTypeChange>(EChitCore.E_CHIT_TYPE_CHANGE),
        switchMap((action) => {
            const references$ = this.store.select(getReferencesListByToken(action.token)).pipe(take(1),
                switchMap((references) => {
                    if (references) {
                        return of(references);
                    } else {
                        return this.service.getReferencesList();
                    }
                }), take(1));

            const clearanceTypeList$ = this.store.select(getClearanceTypeListByToken(action.token)).pipe(take(1),
                switchMap((clearanceTypeList) => {
                    if (clearanceTypeList) {
                        return of(clearanceTypeList);
                    } else {
                        return this.service.getClearanceTypes();
                    }
                }), take(1));


            const vatCodeList$ = this.store.select(getVatCodeListByToken(action.token)).pipe(take(1),
                switchMap((vatCodeList) => {
                    if (vatCodeList) {
                        return of(vatCodeList);
                    } else {
                        return this.service.getVatCodes();
                    }
                }), take(1));

            const branchList$ = this.store.select(getBranchListByToken(action.token)).pipe(take(1),
                switchMap((branchList) => {
                    if (branchList) {
                        return of(branchList);
                    } else {
                        return this.service.getBranches();
                    }
                }), take(1));

            const reasonList$ = this.store.select(getReasonListByToken(action.token)).pipe(take(1),
                switchMap((reasonList) => {
                    if (reasonList) {
                        return of(reasonList);
                    } else {
                        return this.service.getShortcutDescriptionsByType('Details');
                    }
                }), take(1));


            const payeeList$ = this.store.select(getPayeeListListByToken(action.token)).pipe(take(1),
                switchMap((payeeList) => {
                    if (payeeList) {
                        return of(payeeList);
                    } else {
                        return this.service.getShortcutDescriptionsByType('Payee');
                    }
                }), take(1));




            const feeEarneList$ = this.store.select(getFeeEarnerListByToken(action.token)).pipe(take(1),
                switchMap((feeEarneList) => {
                    if (feeEarneList) {
                        return of(feeEarneList);
                    } else {
                        return this.service.getFeeEarneList();
                    }
                }), take(1));

            const nominalList$ = this.store.select(getNominalListByToken(action.token)).pipe(take(1),
                switchMap((nominalList) => {
                    if (nominalList) {
                        return of(nominalList);
                    } else {
                        return this.service.getNominalList();
                    }
                }), take(1));

            const payerList$ = this.store.select(getPayerListByToken(action.token)).pipe(take(1),
                switchMap((payerList) => {
                    if (payerList) {
                        return of(payerList);
                    } else {
                        return this.service.getShortcutDescriptionsByType('Payer');
                    }
                }), take(1));

            return combineLatest(
                references$,
                clearanceTypeList$,
                vatCodeList$,
                branchList$,
                reasonList$,
                payeeList$,
                feeEarneList$,
                nominalList$,
                payerList$,
                ((referencesList, clearanceTypeList, vatCodeList, branchList, reasonList,
                    payeeList, feeEarneList, nominalList, payerList) => ({
                        referencesList: referencesList,
                        clearanceTypeList: clearanceTypeList,
                        vatCodeList: vatCodeList,
                        branchList: branchList,
                        reasonList: reasonList,
                        payeeList: payeeList,
                        payerList: payerList,
                        feeEarneList: feeEarneList,
                        nominalList: nominalList,
                    }))
            ).pipe(take(1), map((data) => {
                return new EChitCore.EChitTypeChangeSuccess(action.token,
                    {
                        payload: action.payload,
                        referencesList: data.referencesList,
                        clearanceTypeList: data.clearanceTypeList,
                        vatCodeList: data.vatCodeList,
                        branchList: data.branchList,
                        reasonList: data.reasonList,
                        payeeList: data.payeeList,
                        payerList: data.payerList,
                        feeEarneList: data.feeEarneList,
                        nominalList: data.nominalList,
                    });
            }), catchError(error => of(new EChitCore.EChitTypeChangeFail(action.token, {
                error: error
            }))));
        }));

    @Effect()
    getMatterBalances$ = this.actions$.pipe(ofType<EChitCore.GetMatterBalances>(EChitCore.GET_MATTER_BALANCES),
        switchMap((action) => {
            return this.service.getMatterBalances(action.payload.matterRef).pipe(
                map((result) => new EChitCore.GetMatterBalancesSuccess(action.token,
                    { data: result, controlName: action.payload.controlName })),
                catchError((error) => of(new EChitCore.GetMatterBalancesFail(action.token, error))));
        }));



    @Effect()
    saveEchit$ = this.actions$.pipe(ofType<EChitCore.InitEChitSave>(EChitCore.INIT_E_CHIT_SAVE),
        switchMap(action => combineLatest(
            this.store.select(getEChitStateByToken(action.token)),
            this.store.select(getUser),
            (state, user) => ({
                file: state.formDataModel.file, action: action, eChitOpenType: state.eChitOpenType,
                inputData: state.inputData, user, selectedWorktype: state.selectedWorkType
            })).pipe(take(1))),
        switchMap(({ file, action, eChitOpenType, inputData, user, selectedWorktype }) => {
            const data = new FormData();
            if (file) {
                data.append('files', file);
            }

            const dateRequired = this.datePipe.transform(action.payload.model.dateRequired, 'yyyy-MM-dd')
                + this.datePipe.transform(dpsNewDate(user.general.dateTimeOffset), ' HH:mm');
            const currentDate = this.datePipe.transform(dpsNewDate(user.general.dateTimeOffset), 'yyyy-MM-dd HH:mm');
            const model = { ...action.payload.model, dateRequired: dateRequired, currentDate: currentDate };


            data.append('postChequeRequestViewModel', JSON.stringify(model));
            return this.service.saveEchit(data).pipe(
                switchMap<EChitPrint, any>((result) => {
                    if (result.isSameAmountOnMatter) {

                        const dialogData: ConfirmDialogData = {
                            content: {
                                title: 'E-Chit Posting',
                                message: '<p>There is an already pending eChit for same amount on this matter,'
                                    + ' do you want to continue posting?</p>',
                                acceptLabel: 'Yes',
                                rejectLabel: 'No'
                            },
                            contentParams: {},
                            data: null
                        };
                        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                            data: dialogData,
                            width: '600px',
                            disableClose: true,
                            panelClass: 'dps-notification',
                            hasBackdrop: true,
                        });

                        return dialogRef.afterClosed().pipe(map((dialogResult) => {

                            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {

                                action.payload.model.isCheckSameAmount = false;
                                return new EChitCore.InitEChitSave(action.token, { model: action.payload.model });

                            } else {
                                return new EChitCore.InitEChitSaveFail(action.token, null);
                            }

                        }));


                    }
                    if (eChitOpenType === EChitPopupInputType.Workflow) {

                        if (inputData && inputData.data.addDiaryEntry) {
                            const date = this.datePipe.transform(dpsNewDate(user.general.dateTimeOffset), 'yyyy-MM-dd HH:mm');
                            this.service.eChitPrint(result, date, action.payload.model.telephoneAdvice, selectedWorktype).subscribe();
                            return of(new EChitCore.EChitClose(action.token, { data: action.payload.model }));
                        } else {
                            return of(new EChitCore.EChitClose(action.token, { data: action.payload.model }));
                        }
                    } else if (action.payload.model.typeValue !== ChequeRequestType.PIN) {

                        const dialogData: ConfirmDialogData = {
                            content: {
                                title: 'E-Chit submitted',
                                message: '<p>E-Chit submitted. Do you want to print E-Chit ?</p>',
                                acceptLabel: 'Yes',
                                rejectLabel: 'No'
                            },
                            contentParams: {},
                            data: null
                        };
                        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                            data: dialogData,
                            width: '600px',
                            disableClose: true,
                            panelClass: 'dps-notification',
                            hasBackdrop: true,
                        });

                        return dialogRef.afterClosed().pipe(switchMap((dialogResult) => {
                            const date = this.datePipe.transform(dpsNewDate(user.general.dateTimeOffset), 'yyyy-MM-dd HH:mm');
                            return this.service.eChitPrint(result, date, action.payload.model.telephoneAdvice, selectedWorktype).pipe(
                                map((response: { diaryId: number, path: string }) => {


                                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {

                                        if (response.diaryId > 0) {
                                            return new EChitCore.PrintEChit(action.token,
                                                {
                                                    diaryId: response.diaryId, appCode: inputData.appCode,
                                                    branchId: inputData.branchId, fileId: inputData.fileId,
                                                    attachmentName: result.eChitID + '.pdf', model: model
                                                }
                                            );
                                        } else {
                                            // print by path
                                            return new EChitCore.PrintEChitWithFilePath(action.token, {
                                                path: response.path,
                                                diaryId: response.diaryId
                                            }); // add diaryId for president h disbu
                                        }
                                    } else {

                                        this.store.dispatch(new EChitCore.SaveDisburcement(action.token,
                                            { diaryId: response.diaryId, model: model }));
                                        return new EChitCore.EChitClear(action.token,
                                            { inputData: null, timeOffset: user.general.dateTimeOffset, diaryId: response.diaryId });
                                    }

                                }));


                        }));

                    }

                    return of(new EChitCore.EChitClear(action.token, {
                        inputData: null, timeOffset: user.general.dateTimeOffset,
                        diaryId: result.diaryId
                    }));
                }),
                catchError((error) => of(new EChitCore.InitEChitSaveFail(action.token, error))));

        }));


    @Effect()
    printEChit$ = this.actions$.pipe(ofType<EChitCore.PrintEChit>(EChitCore.PRINT_ECHIT),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, info: action })))),
        switchMap(({ info, user }) =>
            this.service.getEChiteportReport(info.payload.diaryId, info.payload.appCode,
                info.payload.branchId, info.payload.fileId, info.payload.attachmentName).pipe(
                    map((response) => new EChitCore.EChitClear(info.token, { inputData: null, timeOffset: user.general.dateTimeOffset })),
                    catchError(error => of(new EChitCore.PrintEChitFail(info.token, error)))
                )
        ));


    @Effect()
    printEChitWithFilePath$ = this.actions$.pipe(ofType<EChitCore.PrintEChitWithFilePath>(EChitCore.PRINT_ECHIT_WITH_FILE_PATH),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, info: action })))),
        switchMap(({ info, user }) =>
            this.service.getEChiteportReportWithpath(info.payload.path).pipe(map((response) =>
                new EChitCore.EChitClear(info.token, {
                    inputData: null, timeOffset: user.general.dateTimeOffset,
                    diaryId: info.payload.diaryId
                })),
                catchError(error => of(new EChitCore.PrintEChitWithFilePathFail(info.token, error))))
        ));

    @Effect()
    getDefaultVatCode$ = this.actions$.pipe(ofType<EChitCore.GetSupplierVatCode>(EChitCore.GET_SUPPLIER_VAT_CODE),
        switchMap((action) => {
            return this.service.getDefaultVatCode(action.payload.supplierRef).pipe(
                map((result) => new EChitCore.GetSupplierVatCodeSuccess(action.token,
                    { data: result })),
                catchError((error) => of(new EChitCore.GetSupplierVatCodeFail(action.token, error))));
        }));


    @Effect()
    eChitMatterSearchPoupOpen$ = this.actions$.pipe(ofType<EChitCore.EChitMatterSearchPoupOpen>
        (EChitCore.E_CHIT_MATTER_SEARCH_POUP_OPEN),
        switchMap((action) => {
            if (action) {
                const request = new GridRequest(
                    action.payload.text,
                    {
                        take: 5,
                        filter: null,
                        skip: 0,
                        sort: null
                    }
                );
                return this.matterServices.getEChitMatterGridData(request).pipe(switchMap<any, any>((response) => {
                    if (response.data.length === 0) {
                        const matterRefData: MatterRefData = {
                            matterRef: '',
                            details: null,
                            feeEarner: '',
                            accountName: ''

                        };
                        return of(new EChitCore.EChitMatterSearchPoupOpenFail
                            (action.token, { matterRefData: matterRefData }));

                    } else if (response.data.length === 1) {

                        const dataRow = response.data[0];
                        const matterRefData: MatterRefData = {
                            matterRef: dataRow.matterReferenceNo,
                            details: dataRow.matterDetails,
                            feeEarner: dataRow.feeEarner,
                            accountName: dataRow.clientName

                        };

                        const extraData: ExtraEChitPopupInput = {
                            appCode: dataRow.app_Code,
                            matterEBilling: dataRow.eBilling,
                            matterIsLegalAid: dataRow.isLegalAid,
                            branchId: dataRow.branchID,
                            appId: dataRow.appID,
                            fileId: dataRow.fileID
                        };

                        return of(new EChitCore.EChitMatterSearchPoupOpenSuccess
                            (action.token, { matterRefData: matterRefData, extraData: extraData }));

                    } else {

                        return this.popupService.openMatterByClientPopup
                            ('E-Chit-Matter-Search', { clientRef: action.payload.text }).pipe(map((materdata) => {
                                const extraData: ExtraEChitPopupInput = {
                                    appCode: materdata.appCode,
                                    matterEBilling: materdata.matterEBilling,
                                    matterIsLegalAid: materdata.matterIsLegalAid,
                                    branchId: materdata.branchId,
                                    appId: materdata.appId,
                                    fileId: materdata.fileId
                                };
                                return new EChitCore.EChitMatterSearchPoupOpenSuccess
                                    (action.token, { matterRefData: materdata, extraData: extraData });
                            }));

                    }
                }));

            }
        }));


    @Effect()
    eChitToMatterSearchPoupOpen$ = this.actions$.pipe(ofType<EChitCore.EChitToMatterSearchPoupOpen>
        (EChitCore.E_CHIT_TO_MATTER_SEARCH_POUP_OPEN),
        switchMap((action) => {
            if (action) {
                const request = new GridRequest(
                    action.payload.text,
                    {
                        take: 5,
                        filter: null,
                        skip: 0,
                        sort: null
                    }
                );
                return this.matterServices.getEChitToMatterGridData(request).pipe(
                    switchMap<any, any>((response) => {

                        if (response.data.length === 0) {
                            const matterRefData = {
                                matterRef: '',
                                details: null,
                                feeEarner: '',
                                accountName: ''
                            };
                            return of(new EChitCore.EChitToMatterSearchPoupOpenFail
                                (action.token, { toMatterRefData: matterRefData }));

                        } else if (response.data.length === 1) {

                            const dataRow = response.data[0];
                            const matterRefData = {
                                matterRef: dataRow.matterReferenceNo,
                                details: dataRow.matterDetails,
                                feeEarner: dataRow.feeEarner,
                                accountName: dataRow.clientName
                            };

                            return of(new EChitCore.EChitToMatterSearchPoupOpenSuccess
                                (action.token, { toMatterRefData: matterRefData }));
                        } else {
                            return this.popupService.openMatterByClientPopup
                                ('E-Chit-Matter-Search', { clientRef: action.payload.text }).pipe(map((materdata) => {
                                    return new EChitCore.EChitToMatterSearchPoupOpenSuccess
                                        (action.token, { toMatterRefData: materdata });
                                }));
                        }
                    }));
            }
        }));




    @Effect()
    eChitTypeChangeSuccess$ = this.actions$.pipe(ofType<EChitCore.EChitTypeChangeSuccess>(EChitCore.E_CHIT_TYPE_CHANGE_SUCCESS),
        tap((item) => {
            console.log(item);
        }),
        filter((action) => (action.payload.payload.eChitType === ChequeRequestType.WidthMatterId
            || (action.payload.payload.workflowEchitData && action.payload.payload.workflowEchitData.matterRef)
        )),
        switchMap(action => this.store.select(getInputDataByToken(action.token)).pipe(take(1),
            map((inputData) => {

                // tslint:disable-next-line:no-debugger
                // debugger;

                const matterRef = (inputData.matterId) ? inputData.matterId : action.payload.payload.workflowEchitData.matterRef;
                const matterDetailsName = (inputData.matterDetailsName) ? inputData.matterDetailsName
                    : action.payload.payload.workflowEchitData.matterDetail;
                return new EChitCore.GetMatterBalances(action.token,
                    { matterRef: matterRef, controlName: 'matterRef', matterDetailsName: matterDetailsName });
            }))
        ));



    // @Effect()
    // changeDisbTypes$ = this.actions$.pipe(ofType<EChitCore.ChangeDisbTypes>
    //     (EChitCore.CHANGE_DISBU_TYPES),
    //     filter(action => action.payload.kind === 'WORK_TYPE'),
    //     map((action) => {
    //         return new EChitCore.GetPrecedentHIncDisbBreakDown(action.token,
    //             { value: action.payload.value, kind: action.payload.kind, feeEarner: action.payload.feeEarner });

    //     }));


    // @Effect()
    // getDisbuBreakDown$ = this.actions$.pipe(ofType<EChitCore.GetPrecedentHIncDisbBreakDown>
    // (EChitCore.GET_PRECEDENTH_INC_DISB_BREAK_DOWN),
    //     switchMap(info =>
    //         this.store.select(getMatterInfoByToken(info.token)).pipe(
    //             map(data => ({ matterInfo: data, disbData: info.payload, token: info.token })),
    //             take(1),
    //             switchMap((action) =>
    //                 this.service.GetPrecedentHIncDisbBreakDown(action.matterInfo.data, action.disbData).pipe(
    //                     map((result) => new EChitCore.GetPrecedentHIncDisbBreakDownSuccess(action.token, result)),
    //                     catchError((error) => of(new EChitCore.GetPrecedentHIncDisbBreakDownFail(action.token, error))))
    //             ))));

    // @Effect()
    // savePrecidentHDosbByprinEchit$ = this.actions$.pipe(ofType<EChitCore.PrintEChit>
    //     (EChitCore.PRINT_ECHIT),

    @Effect()
    saveDisb$ = this.actions$.pipe(ofType<EChitCore.PrintEChit>
        (EChitCore.PRINT_ECHIT),
        map((action) => {
            return new EChitCore.SaveDisburcement(action.token, { diaryId: action.payload.diaryId, model: action.payload.model });

        }));
    @Effect()
    savePrecidentHDosbByprinEchit$ = this.actions$.pipe(ofType<EChitCore.SaveDisburcement>
        (EChitCore.SAVE_DISBURCEMENT),
        switchMap(info =>
            this.store.select(getEChitStateByToken(info.token)).pipe(
                map(data => ({ steteData: data, diaryId: info.payload.diaryId, model: info.payload.model, token: info.token })),
                take(1),
                filter(action => action.steteData && action.steteData.inputData.matterEBilling === eBillingType.PrecedentH
                    && (action.steteData.eChitType === 'DPU' || action.steteData.eChitType === 'DUU')),
                map((action) => {
                    return new EChitCore.AddPrecedentHDisbursement(action.token, { diaryId: action.diaryId, model: action.model });

                }))));


    @Effect()
    savePrecedentHDisb$ = this.actions$.pipe(ofType<EChitCore.AddPrecedentHDisbursement>(EChitCore.ADD_PRECEDENT_H_DISBURSEMENT),
        switchMap(action => combineLatest(
            this.store.select(getEChitStateByToken(action.token)),
            this.store.select(getModelByToken(action.token)),
            this.store.select(getSelectedDisbuTypesByToken(action.token)),
            this.store.select(getDisburcementValuByToken(action.token)),
            this.store.select(getSelectedWorkTypesByToken(action.token)),
            (state, model, disbType, disbValu, workType) => ({
                stateData: state,
                modelData: action.payload.model,
                diaryId: action.payload.diaryId,
                disbData: {
                    selectDisbType: disbType,
                    disbuValus: disbValu,
                    selectWorkType: workType
                },
                token: action.token
            })).pipe(take(1))),
        switchMap((info) =>
            this.service.savePresidentHDisb(info.modelData, info.diaryId, info.disbData).pipe(
                map((result) => new EChitCore.AddPrecedentHDisbursementSuccess(info.token, result)),
                catchError((error) => of(new EChitCore.AddPrecedentHDisbursementFail(info.token, error))))
        ));


    @Effect()
    getCrimeCalss$ = this.actions$.pipe(ofType<EChitCore.EChitTypeChange>(EChitCore.E_CHIT_TYPE_CHANGE),
        filter(action => action.payload.eChitType === ChequeRequestType.DPU || action.payload.eChitType === ChequeRequestType.DUU),
        switchMap(action =>
            this.store.select(getInputDataByToken(action.token)).pipe(
                map(inputData => ({ inputData: inputData, token: action.token })),
                take(1))),
        switchMap(action =>
            this.store.select(checkTimeRecordType(action.inputData.appCode, action.inputData.matterEBilling,
                action.inputData.matterIsLegalAid)).pipe(
                    map(timeRecordType => ({ ...action, timeRecordType })),
                    take(1))),
        filter(info => info.timeRecordType === AddTimeType.CrimeTime),
        map(info =>
            new EChitCore.GetClassType(info.token, {
                branchId: info.inputData.branchId,
                appId: info.inputData.appId,
                fileId: info.inputData.fileId
            }),
        )
    );

    @Effect()
    changeMatterWithoutSerchPopup$ = this.actions$.pipe(ofType<EChitCore.EChitMatterSearchPoupOpenSuccess>
        (EChitCore.E_CHIT_MATTER_SEARCH_POUP_OPEN_SUCSEES),
        filter(action => !!action.payload.extraData),
        map(action => new EChitCore.ChangeExtraEChitPopupInput(action.token, action.payload.extraData))
    );

    @Effect()
    changeExtraInputForCrime$ = this.actions$.pipe(ofType<EChitCore.ChangeExtraEChitPopupInput>(EChitCore.CHANGE_EXTRA_INPUT),
        switchMap(action => combineLatest(
            this.store.select(checkTimeRecordType(action.input.appCode, action.input.matterEBilling, action.input.matterIsLegalAid)),
            this.store.select(getEChitTypeByToken(action.token)),
            (timeRecordType, ecitType) => ({ ...action, timeRecordType, ecitType })).pipe(take(1))),
        filter(info => info.timeRecordType === AddTimeType.CrimeTime &&
            (info.ecitType === ChequeRequestType.DPU || info.ecitType === ChequeRequestType.DUU)),
        map(info =>
            new EChitCore.GetClassType(info.token, {
                branchId: info.input.branchId,
                appId: info.input.appId,
                fileId: info.input.fileId
            }),
        )

    );


    @Effect()
    getClassType$ = this.actions$.pipe(ofType<EChitCore.GetClassType>(EChitCore.GET_CLASS_TYPE),
        switchMap(action =>
            this.service.getClassType(action.payload).pipe(
                map(responce => new EChitCore.GetClassTypeSuccess(action.token, { list: responce })),
                catchError(e => of(new EChitCore.GetClassTypeFail(action.token))))));

    @Effect()
    changeClassType$ = this.actions$.pipe(ofType<EChitCore.ChangeClassType>(EChitCore.CHANGE_CLASS_TYPE),
        filter(action => action.payload.selectedClass > 0),
        map(action => new EChitCore.LoadAttTypeList(action.token, action.payload.selectedClass)));


    @Effect()
    loadAttTypeListData$ = this.actions$.pipe(ofType<EChitCore.LoadAttTypeList>(EChitCore.LOAD_ATT_TYPE_LIST),
        switchMap((action: EChitCore.LoadAttTypeList) =>
            this.store.select(getInputDataByToken(action.token)).pipe(
                map(inputData => ({ inputData: inputData, action: action })),
                take(1))),
        switchMap((info) =>
            this.service.getCrimeWorkTypes(info.inputData, info.action.classId).pipe(map((response) =>
                new EChitCore.LoadAttTypeListSuccess(info.action.token, { attTypes: response })),
                catchError(error => of(new EChitCore.LoadAttTypeListFail(info.action.token))))
        ));

    // @Effect() // initial
    // getClassTypeSuccess$ = this.actions$.pipe(ofType<EChitCore.GetClassTypeSuccess>(EChitCore.GET_CLASS_TYPE_SUCCESS),
    //     filter(action => action.payload.list && action.payload.list.length > 0),
    //     map(action => new EChitCore.ChangeClassType(action.token, { selectedClass: action.payload.list[0].rectype })));

    // @Effect() // initial
    // getSubClassTypeSuccess$ = this.actions$.pipe(ofType<EChitCore.LoadAttTypeListSuccess>(EChitCore.LOAD_ATT_TYPE_LIST_SUCCESS),
    //     filter(action => action.payload.attTypes && !!action.payload.attTypes.filter(i => i.attId === 2)),
    //     map(action => new EChitCore.cha(action.token, 3)));



    @Effect()
    DisbursementType$ = this.actions$.pipe(ofType<EChitCore.EChitTypeChange>(EChitCore.E_CHIT_TYPE_CHANGE),
        filter(action => action.payload.eChitType === 'DPU' || action.payload.eChitType === 'DUU'),
        switchMap(action =>
            this.store.select(getInputDataByToken(action.token)).pipe(
                map(inputData => ({ inputData: inputData, token: action.token })),
                take(1))),

        // combineLatest(
        // this.store.select(getInputDataByToken(action.token)),
        // this.store.select(getTimeRecordType(action.token)),
        // (inputData, timeRecordType) => ({
        //     inPutData: inputData, timeRecordType: timeRecordType, token: action.token
        // })).pipe(take(1))),
        filter(info => info.inputData.matterEBilling === AddTimeType.PrecedentH),
        map(info =>
            new EChitCore.GetDisbursementType(info.token, {
                branchId: info.inputData.branchId,
                appId: info.inputData.appId,
                fileId: info.inputData.fileId
            }),
        )
    );
    @Effect()
    GetDisbursementType$ = this.actions$.pipe(ofType<EChitCore.GetDisbursementType>(EChitCore.GET_DISBURSEMENT_TYPE),
        switchMap(action =>
            this.service.GetDisbursementType(action.matterDate).pipe(
                map(responce => new EChitCore.GetDisbursementTypeSuccess(action.token, { disburcementTypes: responce })),
                catchError(e => of(new EChitCore.GetDisbursementTypeFail(action.token))))));


    @Effect()
    matterChangeDisbType$ = this.actions$.pipe(ofType<EChitCore.ChangeExtraEChitPopupInput>(EChitCore.CHANGE_EXTRA_INPUT),
        filter(action => action.input.matterEBilling === AddTimeType.PrecedentH),
        map(action => new EChitCore.GetDisbursementType(action.token, {
            branchId: action.input.branchId,
            appId: action.input.appId,
            fileId: action.input.fileId
        })));

}



