import { AML_CHECK } from './../actions/core';

import { tap, map, catchError, mergeMap, switchMap, take } from 'rxjs/operators';

import { UpdateClient } from '../actions/core';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as ClientCreation from '../actions/core';
import { from, combineLatest, of } from 'rxjs';
import { getClientModel } from '../reducers';
import { ClientCreationService } from '../services/clientCreation.service';
import { InitClientCreationData } from '../models/interfaces';
import {
    getInitDataModel,
    getClientNotesToken,
    getDeleteNoteIdsToken,
    getRiskAssessmentDataByToken,
    getMatterPaginationDef,
    getCaseFileIdentity
} from '../reducers/index';
import {
    ConfirmDialogResultKind, ConfirmDialogComponent,
    ConfirmDialogData, InforDialogData, InforDialogComponent, InforDialogResult
} from '../../shared';
import { MatDialog } from '@angular/material';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { centerToWindow } from '../../utils/bounds';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import {
    ClientDetilsValidationPopupComponent
} from '../../client-creation-desktop';
import { getUser } from './../../auth';
import { RiskAssesmentRequest } from '../models/risk-assesment-request';
import { MatterGridRequevt } from '../models/matter-grid-requevt';
import { getPaginatorSkip } from '../../core/lib/grid-helpers';




@Injectable()
export class ClientCreationEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: ClientCreationService,
        private windowPopupsManagerService: WindowPopupsManagerService, private dialog: MatDialog,
        private popupService: SystemJsPopupLoaderService,
    ) { }


    @Effect()
    addUpdateClient$ = this.actions$.pipe(ofType<ClientCreation.AddUpdateClient>(ClientCreation.ADD_UPDATE_CLIENT),
        switchMap(action =>
            combineLatest(
                this.store.select(getInitDataModel),
                this.store.select(getClientNotesToken(action.token)),
                this.store.select(getDeleteNoteIdsToken(action.token)),
                this.store.select(getCaseFileIdentity),
                ((initData, clientNotes, deleteNote, caseFileIdentity) => ({
                    initData,
                    clientNotes,
                    deleteNote,
                    caseFileIdentity,
                    payload: action.payload,
                    token: action.token
                })
                )).pipe(take(1))

        ),
        switchMap(action => {
            return this.service.addUpdateClient(action.payload.clientModel, action.clientNotes, action.deleteNote, action.caseFileIdentity)
                .pipe(mergeMap<any, any>((result) => {

                    if (action.payload.clientModel.client.clientId === -1) {
                        return from([
                            new ClientCreation.AddUpdateClientSuccess(action.token, result, action.payload.withClose, true),
                            new ClientCreation.SwitchAmlAndClientSave(action.token, {
                                clientModel: action.payload.clientModel,
                                withClose: action.payload.withClose,
                                onlyAml: true
                            }),
                            // new ClientCreation.AMLCheckForClient(action.token, {
                            //     clientModel: action.payload.clientModel,
                            //     isAMLShow: action.initData.isAMLShow,
                            //     gridPara: ['ClientEvents'],
                            //     withClose: action.payload.withClose,
                            //     addUpdateClientResult: result,
                            // })
                        ]);
                    } else {
                        return from([
                            new ClientCreation.AddUpdateClientSuccess(action.token, result, action.payload.withClose, false),
                            // new ClientCreation.GetFullClientDataGridParams(action.token,
                            //     {
                            //         clientId: action.payload.clientModel.client.clientId, gridPara: [],
                            //         withClose: action.payload.withClose, addUpdateClientResult: result
                            //     })
                        ]);
                    }
                }),
                    // .map((result) => {

                    //     if (action.payload.clientModel.client.clientId === -1) {

                    //         return (new ClientCreation.AMLCheckForClient(action.token, {
                    //             clientModel: action.payload.clientModel,
                    //             isAMLShow: action.initData.isAMLShow,
                    //             gridPara: ['ClientEvents'],
                    //             withClose: action.payload.withClose,
                    //             addUpdateClientResult: result,
                    //         }));
                    //     } else {
                    //         return (new ClientCreation.GetFullClientDataGridParams(action.token,
                    //             {
                    //                 clientId: action.payload.clientModel.client.clientId, gridPara: [],
                    //                 withClose: action.payload.withClose, addUpdateClientResult: result
                    //             }));
                    //     }
                    // })
                    catchError((error) => {
                        return of(new ClientCreation.AddUpdateClientFail(action.token, { error: error }));
                    }));
        }));

    @Effect()
    AddUpdateClientSuccess$ = this.actions$.pipe(ofType<ClientCreation.AddUpdateClientSuccess>(ClientCreation.ADD_UPDATE_CLIENT_SUCCESS),
        map(action =>
            new ClientCreation.GetFullClientDataGridParams(action.token,
                {
                    clientId: action.payload.client.clientId, gridPara: [],
                    withClose: action.withClose, addUpdateClientResult: action.payload
                })
        )
    );

    @Effect()
    amlCheck$ = this.actions$.pipe(ofType<ClientCreation.AmlCheck>(ClientCreation.AML_CHECK),
        switchMap(action =>
            // this.store.select(getInitDataModel).pipe(
            //     map((data) => ({ data: data, action: action })),
            //     take(1))
            combineLatest(
                this.store.select(getInitDataModel),
                this.store.select(getClientModel(action.token)),
                ((initData, clientModel) => ({
                    initData,
                    clientModel,
                    token: action.token,
                    action: action
                })
                )).pipe(take(1))

        ),
        map(info =>
            new ClientCreation.AMLCheckForClient(info.token, {
                clientModel: info.clientModel,
                isAMLShow: info.initData.isAMLShow,
                gridPara: ['ClientEvents'],
                withClose: info.action.withClose,
                addUpdateClientResult: info.action.payload,
                isAMLNeedToCheck: info.action.isAMLNeedToCheck
            })));

    @Effect()
    aMLCheckForClient$ = this.actions$.pipe(ofType<ClientCreation.AMLCheckForClient>(ClientCreation.AML_CHECK_FOR_CLIENT),
        switchMap(action => {
            if (action.payload.isAMLShow) {
                return this.service.addAMLCheckForClient(action.payload.clientModel).pipe(
                    switchMap((result) => {
                        // if (result && result.data && result.data.ErrorResponse) { // removed .data
                        if (result && result.errorResponse) {

                            const dialogData: InforDialogData = {
                                content: {
                                    title: 'AML Check',
                                    message: 'Errors were returned by your submission.\n Please rectify errors and resubmit'
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: dialogData,
                                width: '400px',
                                disableClose: true,
                                panelClass: 'dps-notification'
                            });
                            return dialogRef.afterClosed().pipe(map<InforDialogResult, any>(dialogResult => {

                                // return (new ClientCreation.GetFullClientDataGridParams(action.token,
                                //     {
                                //         clientId: action.payload.clientModel.client.clientId, gridPara: action.payload.gridPara
                                //         , withClose: action.payload.withClose
                                //         , addUpdateClientResult: action.payload.addUpdateClientResult
                                //     }));
                            }));
                        } else if (result && result.amlResult) {

                            this.store.dispatch(new UpdateClient(result.token,
                                { property: 'amlSearchResult', value: result.amlResult }));

                            const amlResult = result.amlResult;
                            let messageText = 'AML Search Result: ';
                            if (amlResult === 0) {
                                messageText += 'PASS';
                            } else if (amlResult === 1) {
                                messageText += 'REFER';
                            } else if (amlResult === -1) {
                                messageText += 'ERROR';
                            }

                            const dialogData: InforDialogData = {
                                content: {
                                    title: 'DPS Software',
                                    message: messageText
                                },
                                data: { messageType: 'warning' }
                            };
                            const dialogRef = this.dialog.open(InforDialogComponent, {
                                data: dialogData,
                                width: '400px',
                                disableClose: true,
                                panelClass: 'dps-notification'
                            });
                            return dialogRef.afterClosed().pipe(map<InforDialogResult, any>(dialogResult => {
                                return (new ClientCreation.EventGridRefresh(action.token, {
                                    clientId: action.payload.clientModel.client.clientId
                                }));

                                // return (new ClientCreation.GetFullClientDataGridParams(action.token,
                                //     {
                                //         clientId: action.payload.clientModel.client.clientId, gridPara: action.payload.gridPara,
                                //         withClose: action.payload.withClose
                                //         , addUpdateClientResult: action.payload.addUpdateClientResult
                                //     }));
                            }));

                        } else {

                            // return of(new ClientCreation.GetFullClientDataGridParams(action.token,
                            //     {
                            //         clientId: action.payload.clientModel.client.clientId, gridPara: action.payload.gridPara
                            //         , withClose: action.payload.withClose
                            //         , addUpdateClientResult: action.payload.addUpdateClientResult
                            //     }));
                        }

                    }),
                    catchError((error) => of(new ClientCreation.AMLCheckForClientFail(action.token, { error: error }))));
            } else {
                // return of(new ClientCreation.GetFullClientDataGridParams(action.token,
                //     {
                //         clientId: action.payload.clientModel.client.clientId, gridPara: action.payload.gridPara
                //         , withClose: action.payload.withClose
                //         , addUpdateClientResult: action.payload.addUpdateClientResult
                //     }));
            }
        }));


    @Effect()
    deleteMatter$ = this.actions$.pipe(ofType<ClientCreation.DeleteClient>(ClientCreation.DELETE_CLIENT),
        switchMap(action =>
            this.service.deleteClient(action.payload.clientId).pipe(
                map((result) => new ClientCreation.DeleteClientSuccess(action.token)),
                catchError((error) => of(new ClientCreation.DeleteClientFail(action.token, { error: error }))))
        ));



    @Effect()
    deleteDocumentNote$ = this.actions$.pipe(ofType<ClientCreation.DeleteDocumentNote>(ClientCreation.DELETE_DOCUMENT_NOTE),
        switchMap(action =>
            this.service.deleteClientEvent(action.payload.row.eventId).pipe(
                map((result) => new ClientCreation.DeleteDocumentNoteSuccess(action.token, { row: action.payload.row })),
                catchError((error) => of(new ClientCreation.DeleteDocumentNoteFail(action.token, { error: error }))))
        ));

    @Effect()
    initView$ = this.actions$.pipe(ofType<ClientCreation.InitClientCreation>(ClientCreation.INIT_CLIENT_CREATION),
        map((action) => {
            return new ClientCreation.GetInitClientCreationData(action.token, {});
        }));

    @Effect()
    openCaseAccessFromReqest$ = this.actions$.pipe(ofType<ClientCreation.GetInitClientCreationData>
        (ClientCreation.GET_CLIENT_CREATION_INT_DATA),
        switchMap(action =>
            this.store.select(getInitDataModel).pipe(
                map((data) => ({ data: data, token: action.token })),
                take(1))),
        switchMap(({ data, token }) => {

            if (!data || !data.loadInitData) {

                return combineLatest(
                    this.service.getBranchList(),
                    this.service.getClientTypeList(),
                    this.service.getCreditControlStagesList(),
                    this.service.getCreditAccountTypeList(),
                    this.service.getVATCodeAndDescriptionList(),
                    this.service.getFeeEarnerCodeAndNameList(),
                    this.service.getEthnicOriginCodeAndNameList(),
                    this.service.getDisabilityCodeAndNameList(),
                    this.service.getAMLRiskLevelList(),
                    this.service.getGenderCodeAndNameList(),
                    this.service.getCurrencyCodeAndNameList(),
                    this.service.getCompanyProofsList(),
                    this.service.getClientInterestSchemeList(),
                    this.service.getClientLookupList('SALTITLE'),
                    this.service.getClientLookupList('SALINTRO'),
                    this.service.getClientLookupList('SALTERMS'),
                    this.service.getClientLookupList('MATPROOFOFID'),
                    this.service.getClientLookupList('MATPROOFOFADDR'),
                    this.service.getAMLProvider(),
                    this.service.getClientDefaults(),
                    this.service.getMatCliRefSettings(),
                    this.service.getUserDefaultBranch(),

                    ((branchResponce,
                        clientTypeListResponce,
                        creditControlStagesResponce,
                        creditAccountTypeResponce,
                        vatCodeAndDescriptionResponce,
                        feeEarnerCodeAndNameResponce,
                        ethnicOriginCodeAndNameResponce,
                        disabilityCodeAndNameResponce,
                        amlRiskLevelResponce,
                        genderCodeAndNameResponce,
                        currencyCodeAndNameResponce,
                        companyProofsListResponce,
                        clientInterestSchemeListResponce,
                        salTitleLookupResponce,
                        salIntroLookupResponce,
                        salTermsLookupResponce,
                        matProofOfIdLookupResponce,
                        matProofOfAddrLookupResponce,
                        aMLProviderResponce,
                        clientDefaultsResponce,
                        matClientSettingResponce,
                        userDefaultBranchResponce
                    ) => ({
                        branchList: branchResponce,
                        clientTypeList: clientTypeListResponce,
                        creditControlStageList: creditControlStagesResponce,
                        creditAccountTypeList: creditAccountTypeResponce,
                        vatCodeAndDescriptionList: vatCodeAndDescriptionResponce,
                        feeEarnerCodeAndNameList: feeEarnerCodeAndNameResponce,
                        ethnicOriginCodeAndNameList: ethnicOriginCodeAndNameResponce,
                        disabilityCodeAndNameList: disabilityCodeAndNameResponce,
                        amlRiskLevelResponceList: amlRiskLevelResponce,
                        genderCodeAndNameList: genderCodeAndNameResponce,
                        currencyCodeAndNameList: currencyCodeAndNameResponce,

                        companyProofsList: companyProofsListResponce,
                        clientInterestSchemeList: clientInterestSchemeListResponce,

                        lookupTitleType: salTitleLookupResponce,
                        lookupIntroductionType: salIntroLookupResponce,
                        lookupTermsType: salTermsLookupResponce,
                        lookupProofIDType: matProofOfIdLookupResponce,
                        lookupProofAddressType: matProofOfAddrLookupResponce,
                        isAMLShow: aMLProviderResponce,
                        clientDefaults: clientDefaultsResponce,
                        matRefSetting: matClientSettingResponce,
                        userDefaultBranch: userDefaultBranchResponce
                    }))
                ).pipe(take(1), map((response: InitClientCreationData) => {

                    return new ClientCreation.GetInitClientCreationDataSuccess(token, { response: response });

                }), catchError(error => of(new ClientCreation.GetInitClientCreationDataFail(token, null))));
            } else {
                this.store.dispatch(new ClientCreation.SetUserBarnchToNewClient(token));
                return of();
            }
        }));


    @Effect()
    changeInitialBarnch$ = this.actions$.pipe(ofType<ClientCreation.GetInitClientCreationDataSuccess>
        (ClientCreation.GET_CLIENT_CREATION_INT_DATA_SUCESS),
        mergeMap(action => from([new ClientCreation.SetUserBarnchToNewClient(action.token),
        new ClientCreation.GetDefuiltRiskAseesData()])));


    @Effect()
    getDefulitRiskAssesData$ = this.actions$.pipe(ofType<ClientCreation.GetDefuiltRiskAseesData>
        (ClientCreation.GET_DEFUILT_RISK_ASSESMENT_DATA),
        switchMap(action =>
            this.service.getDefaultRiskAssesemntData().pipe(
                map((result) => new ClientCreation.GetDefuiltRiskAseesDataSuccess(result)),
                catchError((error) => of(new ClientCreation.GetDefuiltRiskAseesDataFail())))
        ));

    @Effect()
    getFullClientData$ = this.actions$.pipe(ofType<ClientCreation.GetFullClientData>(ClientCreation.GET_FULL_CLIENT_DATA),
        switchMap((action) => {
            if (!action.payload.clientId) {
                return this.service.getMatterAndClientID(action.payload.matter).pipe(switchMap((clientData) => {
                    return this.service.getAllClientDetails(clientData.clientId).pipe(switchMap((clientModel) => {
                        return this.service.getHasCrimematters(clientModel.client.clientReference).pipe(map((hasCrimematters) => {
                            return new ClientCreation.GetFullClientDataSuccess(action.token, {
                                clientModel: clientModel,
                                clientSeatchList: action.payload.clientSeatchList,
                                clientIndex: action.payload.clientIndex,
                                hasCrimematters: hasCrimematters,
                            });
                        }), catchError((error) => of(new ClientCreation.GetFullClientDataFail(action.token, { error: error }))));
                    }), catchError((error) => of(new ClientCreation.GetFullClientDataFail(action.token, { error: error }))));
                }), catchError((error) => of(new ClientCreation.GetFullClientDataFail(action.token, { error: error }))));

            } else {
                return this.service.getAllClientDetails(action.payload.clientId).pipe(switchMap((clientModel) => {
                    return this.service.getHasCrimematters(clientModel.client.clientReference).pipe(map((hasCrimematters) => {
                        return new ClientCreation.GetFullClientDataSuccess(action.token, {
                            clientModel: clientModel,
                            clientSeatchList: action.payload.clientSeatchList,
                            clientIndex: action.payload.clientIndex,
                            hasCrimematters: hasCrimematters,
                        });
                    }), catchError((error) => of(new ClientCreation.GetFullClientDataFail(action.token, { error: error }))));
                }), catchError((error) => of(new ClientCreation.GetFullClientDataFail(action.token, { error: error }))));

            }

        }));


    @Effect()
    getFullClientDataGridParams$ = this.actions$.pipe(ofType<ClientCreation.GetFullClientDataGridParams>
        (ClientCreation.GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS),
        switchMap(action => this.service.getAllClientDetails(action.payload.clientId, action.payload.gridPara).pipe(
            map((result) => new ClientCreation.GetFullClientDataGridParamsSuccess(action.token, {
                clientModel: result,
                withClose: action.payload.withClose
            })),
            catchError((error) => of(new ClientCreation.GetFullClientDataGridParamsFail(action.token, { error: error }))
            ))));


    @Effect()
    getScreenLookupData$ = this.actions$.pipe(ofType<ClientCreation.GetScreenLookupData>(ClientCreation.GET_SCREEN_LOOKUP_DATA),
        tap(action => console.log('GetScreenLookupData')),
        switchMap((info) =>
            this.service.getClientLookupList(info.payload.lookupTypeTag).pipe(map((response) =>
                new ClientCreation.GetScreenLookupSuccess(info.token,
                    { lookupList: response, lookupTypeTag: info.payload.lookupTypeTag })),
                catchError(error => of(new ClientCreation.GetScreenLookupFail(info.token, error))))
        ));

    @Effect()
    uploadDocumnet$ = this.actions$.pipe(ofType<ClientCreation.UploadDocument>(ClientCreation.FILE_UPLOAD),
        switchMap(action => {
            const data = new FormData();
            data.append('note', action.payload.note);
            data.append('ClientRef', action.payload.clientRef);
            data.append('files', action.payload.file);
            return this.service.documnetUpload(data).pipe(map((response) =>
                new ClientCreation.UploadDocumentSuccess(action.token, {
                    clientId: action.payload.clientId,
                    uploadDocumentType: action.payload.uploadDocumentType
                })),
                catchError(error => of(new ClientCreation.UploadDocumentFail(action.token, {
                    clientId: action.payload.clientId,
                    uploadDocumentType: action.payload.uploadDocumentType
                }))));
        }));

    @Effect()
    uploadSuccess$ = this.actions$.pipe(ofType<ClientCreation.UploadDocumentSuccess>(ClientCreation.FILE_UPLOAD_SUCCESS),
        map(action =>
            new ClientCreation.EventGridRefresh(action.token, {
                clientId: action.payload.clientId
            })));

    @Effect()
    eventGridRefresh$ = this.actions$.pipe(ofType<ClientCreation.EventGridRefresh>
        (ClientCreation.CLIENT_EVENT_GRID_REFRESH),
        switchMap(action => this.service.getAllClientDetails(action.payload.clientId, ['ClientEvents']).pipe(
            map((result) => new ClientCreation.EventGridRefreshSuccess(action.token, result)),
            catchError((error) => of(new ClientCreation.EventGridRefreshFail(action.token, { error: error }))
            ))));

    @Effect()
    clientLoadDocument$ = this.actions$.pipe(ofType<ClientCreation.ClientLoadDocument>
        (ClientCreation.CLIENTL_LOAD_DOCUMENT_URL_LOAD),
        switchMap((action) => {
            return this.service.getClientEventFile(action.payload.row.eventId).pipe(
                map((url) => {

                    const spec = {
                        ...centerToWindow(800, 600),
                        toolbar: false,
                        location: false,
                        directories: false,
                        status: false,
                        menubar: false,
                        scrollbars: false,
                    };
                    this.windowPopupsManagerService.openWindow(action.payload.row.eventId.toString(), url, spec, action.payload.row.type);

                    return new ClientCreation.ClientLoadDocumentURLSuccess(action.token,
                        { url: url });
                }), catchError(error => of(new ClientCreation.ClientLoadDocumentURLFail(action.token, error))));
        }));

    @Effect()
    clientMattersGridRefresh$ = this.actions$.pipe(ofType<ClientCreation.ClientMattersGridRefresh>
        (ClientCreation.CLIENT_MATTERS_GRID_REFRESH),
        switchMap(action => this.service.getAllClientDetails(action.payload.clientId, ['ClientEvents']).pipe(
            map((result) => new ClientCreation.ClientMattersGridRefreshSuccess(action.token, result)),
            catchError((error) => of(new ClientCreation.ClientMattersGridRefreshFail(action.token, { error: error }))
            ))));

    @Effect()
    coppyAndOpenMatter$ = this.actions$.pipe(ofType<ClientCreation.CoppyAndOpenMatter>(ClientCreation.COPPY_AND_OPEN_MATTER),
        switchMap(action =>
            this.service.copyMatter(action.payload.matterId).pipe(
                switchMap((result) => {
                    return this.popupService.
                        openMatterCreationPopup('matter_creation', { matterId: result }).pipe(map((popupClose) => {
                            if (popupClose && popupClose !== 'close') {
                                return new ClientCreation.ClientCreationPopupClose(action.token);
                            } else {
                                return new ClientCreation.ClientMattersGridRefresh(action.token, {
                                    clientId: action.payload.clientId,
                                });
                            }
                        }));

                }),
                catchError((error) => of(new ClientCreation.CoppyAndOpenMatterFail(action.token, { error: error }))))
        ));

    @Effect()
    changeInitialdata$ = this.actions$.pipe(ofType<ClientCreation.ClearClientData>
        (ClientCreation.CLEAR_CLIENT_DATA),
        map(action => new ClientCreation.SetUserBarnchToNewClient(action.token)));

    @Effect()
    amlCheckSuccessRefresh$ = this.actions$.pipe(ofType<ClientCreation.GetFullClientDataGridParams>
        (ClientCreation.GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS),
        map(action =>
            new ClientCreation.EventGridRefresh(action.token, {
                clientId: action.payload.clientId
            })));

    @Effect()
    clientValidationPopup$ = this.actions$.pipe(ofType<ClientCreation.ClientValidationPopup>(ClientCreation
        .CLIENT_VALIDATION_POPUP),
        switchMap((action) =>
            this.store.select(getClientModel(action.token)).pipe(
                map((data) => ({
                    data: data,
                    token: action.token,
                    action: action
                })),
                take(1))),
        mergeMap((info) => {
            if (true) {
                return this.dialog.open(ClientDetilsValidationPopupComponent, {
                    data: {
                        input: info.data,
                        token: info.token
                    },
                    height: '55%',
                    width: '617px',

                    panelClass: 'dps-aml-client-id-popup',
                    disableClose: true,
                }).afterClosed().pipe(mergeMap((dialogResult) => {
                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {

                        return from([
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'firstName', value: dialogResult.directorForename }),
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'lastName', value: dialogResult.directorSurname }),
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'clientAddress1', value: dialogResult.houseNo }),
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'clientAddress2', value: dialogResult.directorAddressLine }),
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'dateOfBirth', value: dialogResult.dateOfBirth }),
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'clientPostCode', value: dialogResult.clientPostCode }),
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'clientTown', value: dialogResult.clientTown }),
                            new ClientCreation.UpdateClient(dialogResult.clientModel.token,
                                { property: 'niNumber', value: dialogResult.niNumber }),
                            new ClientCreation.CheckAndUpdate(dialogResult.clientModel.token),
                            new ClientCreation.AmlCheck(dialogResult.clientModel.token, dialogResult.clientModel.input, false, true),

                            // new ClientCreation.AddUpdateClientSuccess(dialogResult.clientModel.token,
                            //     dialogResult.clientModel.input, false, false),
                            // new ClientCreation.AMLCheckForClient(dialogResult.clientModel.token,
                            // new ClientCreation.AMLCheckForClient(dialogResult.clientModel.token, {
                            //     clientModel: dialogResult.clientModel.token,
                            //     isAMLShow: dialogResult.clientModel.isAMLShow,
                            //     gridPara: ['ClientEvents'],
                            //     withClose: dialogResult.clientModel.withClose,
                            //     addUpdateClientResult: info.action.payload,
                            //     isAMLNeedToCheck: true
                            // })

                        ]);

                    } else {
                        return from([
                            // new ScreenDesingner.SaveScreenDesigner(action.token, new SaveScreenDesignerRequest('', false, true)),
                            // new ScreenDesingner.CloseScreenDesignerSuccess(action.token)
                        ]);
                    }

                }));
            }
        }));


    @Effect({ dispatch: false })
    switchAmlAndSave$ = this.actions$.pipe(ofType<ClientCreation.SwitchAmlAndClientSave>(ClientCreation.SWITCH_AML_AND_CLIENT_SAVE),
        switchMap(client =>
            this.store.select(getInitDataModel).pipe(
                map((data) => ({ initData: data, info: client })),
                take(1))),
        tap((action) => {
            if (action.initData.isAMLShow && action.info.payload.clientModel.client.clientId === -1 ||
                (action.info.payload.clientModel.client.clientId !== -1 && action.info.payload.onlyAml)) {
                let messageText = 'Perform AML check on this client?';
                if (action.info.payload.clientModel.client.amlSearchResult) {
                    messageText = 'Request new AML check on this client?';
                }

                const dialogData: ConfirmDialogData = {
                    content: {
                        title: 'DPS Software',
                        message: messageText
                    },
                    contentParams: {},
                    data: null
                };
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                    data: dialogData,
                    width: '400px',
                    disableClose: true,
                    panelClass: 'dps-notification'
                });
                //  const self = this;
                dialogRef.afterClosed().subscribe((dialogResult) => {
                    if ((dialogResult.kind === ConfirmDialogResultKind.Confirmed)) {
                        // return { results: true, action: action.payload, token: action.token };
                        this.store.dispatch(new ClientCreation.ClientValidationPopup(action.info.token,
                            { clientModel: action.info.payload.clientModel }));
                        // return new ClientCreation.ClientValidationPopup(action.info.token,
                        //     { clientModel: action.info.payload.clientModel });
                    } else {
                        if (!action.info.payload.onlyAml) {
                            this.store.dispatch(new ClientCreation.AddUpdateClient(action.info.token,
                                { clientModel: action.info.payload.clientModel }));
                        }

                        //   return false;
                    }
                });

            }
            //  else {
            //     this.store.dispatch(new ClientCreation.AddUpdateClient(action.info.token,
            //         { clientModel: action.info.payload.clientModel }));


            // }
        }));

    @Effect()
    xyz$ = this.actions$.pipe(ofType<ClientCreation.CheckAndUpdate>(ClientCreation.CHECK_AND_UPDATE),
        switchMap((action) =>
            combineLatest(
                this.store.select(getInitDataModel),
                this.store.select(getClientModel(action.token)),
                (initData, model) =>
                    ({ initData, model, token: action.token })
            ).pipe(
                take(1))
        ), switchMap((info) => {
            return from([
                new ClientCreation.AddUpdateClient(info.token, { clientModel: info.model, withClose: false }),
                // new ClientCreation.AddUpdateClientSuccess(info.token, info.model, false, true)
            ]);
        }));

    @Effect()
    addUpdateRiskAssessment$ = this.actions$.pipe(ofType<ClientCreation.AddUpdateRiskAssessment>
        (ClientCreation.ADD_UPDATE_RISK_ASSESSMENT_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getUser),
                this.store.select(getRiskAssessmentDataByToken(action.token)),
                this.store.select(getClientModel(action.token)),
                ((user, data, model) => ({
                    user,
                    data,
                    model: model,
                    token: action.token
                })
                )).pipe(take(1))
        ),
        switchMap(info =>
            this.service.addUpdateRiskAssessmentData(new RiskAssesmentRequest(info.user, info.data, info.model.client.clientReference)).
                pipe(
                    map((response) => new ClientCreation.AddUpdateRiskAssessmentSuccess(info.token, response, info.model)),
                    catchError((error) => of(new ClientCreation.AddUpdateRiskAssessmentFail(info.token))))));

    @Effect()
    AddUpdateRiskAssetSuccess$ = this.actions$.pipe(ofType<ClientCreation.AddUpdateRiskAssessmentSuccess>
        (ClientCreation.ADD_UPDATE_RISK_ASSESSMENT_DATA_SUCCESS),
        map(action =>
            new ClientCreation.GetFullClientDataGridParams(action.token,
                {
                    clientId: action.model.client.clientId, gridPara: [],
                    withClose: false, addUpdateClientResult: action.model
                })
        )
    );

    @Effect()
    GetFullClientDataSuccess$ = this.actions$.pipe(ofType<ClientCreation.GetFullClientDataSuccess>
        (ClientCreation.GET_FULL_CLIENT_DATA_SUCCESS),
        map((action) => new ClientCreation.GetMatters(action.token)));

    @Effect()
    ChangeMatterPage$ = this.actions$.pipe(ofType<ClientCreation.ChangeMatterPage>(ClientCreation.CHANGE_MATTERS_PAGE),
        map((action) => new ClientCreation.GetMatters(action.token)));


    @Effect()
    getMatters$ = this.actions$.pipe(ofType<ClientCreation.GetMatters>(ClientCreation.GET_MATTERS),
        switchMap(action =>
            // this.store.select(getMatterPaginationDef(action.token))
            //     .pipe(map(paginatorDef => ({ token: action.token, clientRef: action.clientRef, paginatorDef })))
            combineLatest(
                this.store.select(getClientModel(action.token)),
                this.store.select(getMatterPaginationDef(action.token)),
                (clientModel, paginatorDef) =>
                    ({ clientRef: clientModel.client.clientReference, paginatorDef, token: action.token })
            ).pipe(
                take(1))
        ),
        switchMap((info) => {
            const request = new MatterGridRequevt(
                {
                    take: info.paginatorDef.itemPerPage,
                    filter: null,
                    skip: getPaginatorSkip(info.paginatorDef),
                    sort: null
                },
                info.clientRef);
            return this.service.getMatters(request).pipe(
                map((result) => new ClientCreation.GetMattersSuccess(info.token, result)),
                catchError((error) => of(new ClientCreation.GetMattersFail(info.token))));
        }));

}
