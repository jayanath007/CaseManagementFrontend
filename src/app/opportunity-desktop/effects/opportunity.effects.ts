import { QuoteType } from './../../opportunity-core/models/enums';
import { InfoDialogType } from './../../core/utility/DpsUtility';
import { uuid } from './../../utils/uuid';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import { showInforDialog, showConfirmDialog } from '../../core/utility/DpsUtility';
import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import { map, tap, switchMap, take, filter } from 'rxjs/operators';
import * as Opportunity from './../../opportunity-core/actions/core';
import { ConfirmDialogResultKind } from './../../shared/models/dialog';
import { FailDialogComponent } from './../../shared/components/fail-dialog/fail-dialog.component';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { getClientDataModelByToken, propertyQuoteTypeList } from './../../opportunity-core/reducers/index';
import { ConflictCheckType, ConflictSearchOpenFrom } from './../../conflict-search-core/models/enum';
import { MainMenuService } from '../../layout-desktop';
import { PropertyQuoteType, OpportunitySaveViewModel } from '../../opportunity-core/models/interfaces';
import { getQuoteType } from '../../core/lib/web-quote';
@Injectable()
export class OpportunityEffects {
    constructor(protected store: Store<any>, private actions$: Actions, private dialog: MatDialog,
        private popupService: SystemJsPopupLoaderService, private urlPopupService: UrlPopupService,
        private pageService: MainMenuService) { }

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<Opportunity.ShowMessage>(Opportunity.OPPORTUNITY_VALIDATION_MESSAGE),
        map((action) => {
            showInforDialog(action.title, action.message, action.messageType, this.dialog);
        }));

    @Effect({ dispatch: false })
    saveScreenListSuccess$ = this.actions$.pipe(ofType<Opportunity.SaveScreenListSuccess>(Opportunity.SAVE_SCREEN_LIST_SUCCESS),
        map((action) => {
            showInforDialog('MLS Inquiry forms', 'Form(s) submitted successfully.', InfoDialogType.success, this.dialog);
        }));

    @Effect({ dispatch: false })
    saveScreenListValidationFail$ = this.actions$.pipe(ofType<Opportunity.SaveScreenList>(Opportunity.SAVE_SCREEN_LIST),
        filter(action => !!action.payload.hasNonAddingItem),
        map((action) => {
            showInforDialog('MLS Inquiry forms', 'Please add or remove the selected screen from screen selection.',
                InfoDialogType.warning, this.dialog);
        })
    );

    @Effect({ dispatch: false })
    conflictSearchPopUp$ = this.actions$.pipe(ofType<Opportunity.SendAndSaveOpportunitiesSuccess>(Opportunity.
        SEND_AND_SAVE_OPPORTUNITY_DATA_SUCCESS),
        switchMap((action) =>
            this.store.select(getClientDataModelByToken(action.token)).pipe(
                map((data) => ({ opportunityModel: data, action: action })),
                take(1))),
        tap((info) =>
            this.popupService.openConflictSearchPopup('OpportunityConflictSearchPopup',
                {
                    conflictCheckType: ConflictCheckType.OpportunitySave,
                    clientDto: info.opportunityModel,
                    openFrom: ConflictSearchOpenFrom.OpportunitySave,
                    commonPara: {
                        data: info.action.payload ? info.action.payload.responceData ?
                            info.action.payload.responceData.data : null : null,
                        status: info.action.payload ? info.action.payload.responceData.status : null
                    }
                })
                .subscribe((result) => {
                    this.store.dispatch(new Opportunity.OpportunityRefreshGridData(info.action.token));
                    if (info.action.payload && info.action.payload.responceData && info.action.payload.responceData &&
                        info.action.payload.responceData.data && info.action.payload.responceData.data.enquiryId) {
                        const opportunityId = info.action.payload.responceData.data.enquiryId;
                        this.store.dispatch(new Opportunity.SendOpportunityFeeEarnerEmail(info.action.token,
                            opportunityId));
                    } else {
                        showInforDialog('Message', `Cannot send mail`, InfoDialogType.alert, this.dialog)
                            .afterClosed().subscribe(() => this.store.
                                dispatch(new Opportunity.OpportunityModelClear(info.action.token)));
                    }

                })
        ));
    @Effect({ dispatch: false })
    conflictSearchQuote$ = this.actions$.pipe(ofType<Opportunity.SaveAndQuoteOpportunitiesSuccess>(Opportunity.
        SAVE_AND_QUOTE_OPPORTUNITY_DATA_SUCCESS),
        filter(action => action.payload.responceData && action.payload.responceData.data),
        switchMap((action) =>
            this.store.select(getClientDataModelByToken(action.token)).pipe(
                map(opportunityModel => ({ opportunityModel, action: action })),
                take(1))
        ), tap((info) => {
            this.popupService.openConflictSearchPopup('OpportunityConflictSearchPopup',
                {
                    conflictCheckType: ConflictCheckType.OpportunityQuote,
                    clientDto: info.opportunityModel,
                    openFrom: ConflictSearchOpenFrom.OpportunityQuote,
                    commonPara: {
                        data: info.action.payload ? info.action.payload.responceData ?
                            info.action.payload.responceData.data : null : null,
                        status: info.action.payload ? info.action.payload.responceData.status : null
                    }
                }).subscribe((result) => {
                    if (info.action.payload.quoteType === QuoteType.PropertyQuote) {
                        this.popupService.propertyQuote(info.action.token);
                    } else {
                        this.popupService.opportunityQuoteRun(info.action.token, info.action.payload.responceData.data, true);
                    }
                });
        }));
    @Effect({ dispatch: false })
    qouteRunWithConfirm$ = this.actions$.pipe(ofType<Opportunity.QuoteRun>(Opportunity.QUOUTE_RUN),
        filter(action => action.payload.item.conflictCount === 0),
        switchMap((action) =>
            this.store.select(propertyQuoteTypeList(action.token)).pipe(
                map((webQuoteTypes) => ({ webQuoteTypes: webQuoteTypes, action: action })),
                take(1))),
        map(info =>
            showConfirmDialog('Quote Run', 'Generate quote without conflict check?', this.dialog)
                .afterClosed().subscribe(dialogResult => {
                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                        this.openQuoteRunPopup(info.webQuoteTypes, info.action.payload.item, info.action.token, info.action.payload.isEdit);
                    }
                })));

    @Effect({ dispatch: false })
    qouteRun$ = this.actions$.pipe(ofType<Opportunity.QuoteRun>(Opportunity.QUOUTE_RUN),
        filter(action => action.payload.item.conflictCount > 0),
        switchMap((action) =>
            this.store.select(propertyQuoteTypeList(action.token)).pipe(
                map((webQuoteTypes) => ({ webQuoteTypes: webQuoteTypes, action: action })),
                take(1))),
        map(info =>
            this.openQuoteRunPopup(info.webQuoteTypes, info.action.payload.item, info.action.token, info.action.payload.isEdit)
        ));

    @Effect({ dispatch: false })
    closeOpertunityWithConfirm$ = this.actions$.pipe(ofType<Opportunity.CloseOpportunity>(Opportunity.CLOSE_OPPORTUNITY),
        filter(action => action.payload.item.quoteCount === 0),
        map(action =>
            showConfirmDialog('Close Opportunity', 'Close Opportunity without generating quote?', this.dialog)
                .afterClosed().subscribe(dialogResult => {
                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                        this.popupService.opportunityClosePopup(action.token, action.payload.item);
                    }
                })));
    @Effect({ dispatch: false })
    closeOpertunity$ = this.actions$.pipe(ofType<Opportunity.CloseOpportunity>(Opportunity.CLOSE_OPPORTUNITY),
        filter(action => action.payload.item.quoteCount > 0),
        map(action =>
            this.popupService.opportunityClosePopup(action.token, action.payload.item)
        ));

    @Effect({ dispatch: false })
    showGenarateQuoteError$ = this.actions$.pipe(ofType<Opportunity.GenarateQuoteWithError>(Opportunity.GENARATE_QUOTE_SUCCESS_WITH_ERROR),
        map((action) => {
            const dialogRef = this.dialog.open(FailDialogComponent, {
                data: action.payload.info,
                width: '400px',
                disableClose: true,
                hasBackdrop: true,
                panelClass: 'dps-notification'
            });
            dialogRef.afterClosed().subscribe(() =>
                this.store.dispatch(new Opportunity.OpenMailComposePopup(action.token,
                    action.payload.info.data, action.payload.emailAddress)));
        }));


    @Effect({ dispatch: false })
    showSuccessMessage$ = this.actions$.pipe(ofType<Opportunity.OpenMailComposePopup>(Opportunity.OPEN_MAIL_COMPOSE_POPUP),
        map((action) => {
            showInforDialog('Quote Run', `Quote generated and sent to: ${action.emailAddress}`, InfoDialogType.success, this.dialog)
                .afterClosed().subscribe(() => this.store.dispatch(new Opportunity.PopupClose(action.token)));
        }));

    @Effect({ dispatch: false })
    conflictSearchRun$ = this.actions$.pipe(ofType<Opportunity.ConflictRunOpportunities>(Opportunity.
        CONFLICT_RUN_OPPORTUNITY),
        switchMap((action) =>
            this.store.select(getClientDataModelByToken(action.token)).pipe(
                map((data) => ({ opportunityModel: data, action: action })),
                take(1))),
        tap((info) =>
            this.popupService.openConflictSearchPopup('OpportunityConflictSearchPopup',
                {
                    conflictCheckType: ConflictCheckType.OpportunityConflictRun,
                    clientDto: info.action.payload ? info.action.payload.selectedItem : null,
                    openFrom: ConflictSearchOpenFrom.OpportunitySave,
                    commonPara: {
                        data: info.action.payload ? info.action.payload.selectedItem ?
                            info.action.payload.selectedItem : null : null,
                        status: null
                    }
                })
                .subscribe((result) => {
                    this.store.dispatch(new Opportunity.GetOpprtunityHistory(info.action.token,
                        info.action.payload.selectedItem.enquiryId));
                    this.store.dispatch(new Opportunity.SetOpportunityGridDataRequest(info.action.token));
                })
        ));

    @Effect({ dispatch: false })
    matterCreationPopup$ = this.actions$.pipe(ofType<Opportunity.CloseOpportunitiesAcceptedSuccess>(Opportunity.
        CLOSE_OPPORTUNITY_ACCEPTED_SUCCESS),
        switchMap((action) =>
            this.store.select(getClientDataModelByToken(action.token)).pipe(
                map((data) => ({ opportunityModel: data, action: action })),
                take(1))),
        map(info => {
            if (!!info.action.payload.responceData && !!info.action.payload.responceData.data) {
                showInforDialog('Close Opportunity', 'Enquiry closed. The Matter screen will be shown for to create a new matter.',
                    InfoDialogType.success, this.dialog)
                    .afterClosed().subscribe(dialogResult => {
                        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                            this.popupService.openMatterCreationPopup(uuid(), {
                                matterModel: info.action.payload.responceData.data.matter,
                                opportunityId: info.action.payload.opportunityId, confirmBeforeOpenCase: true,
                                clientList: info.action.payload.responceData.data.clientContactLink,
                                client1: info.action.payload.responceData.data.client1,
                                client2: info.action.payload.responceData.data.client2,
                            }).subscribe((result: any) => {
                                this.store.dispatch(new Opportunity.PopupClose(info.action.token));
                            });
                        } else {
                            this.store.dispatch(new Opportunity.PopupClose(info.action.token));
                        }
                    });
            } else {
                showConfirmDialog('Close Opportunity', 'Do you want open the case?', this.dialog)
                    .afterClosed().subscribe(dialogResult => {
                        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                            this.store.dispatch(new Opportunity.RequestToOpenMatter(info.action.token,
                                info.action.payload.oppertunityItem));
                        } else {
                            this.store.dispatch(new Opportunity.PopupClose(info.action.token));
                        }
                    });


                // showInforDialog('Close Opportunity', 'Enquiry closed', InfoDialogType.success, this.dialog).afterClosed().subscribe(() =>
                //     this.store.dispatch(new Opportunity.PopupClose(info.action.token)));
            }
            this.store.dispatch(new Opportunity.CloseOpportunityPopupClose(info.action.token));
        }
        ));

    @Effect({ dispatch: false })
    rejectedOpportunity$ = this.actions$.pipe(ofType<Opportunity.CloseOpportunitiesRejectedSuccess>(Opportunity.
        CLOSE_OPPORTUNITY_REJECTED_SUCCESS),
        map(action => {
            showInforDialog('Close Opportunity', 'Enquiry closed.'
                , InfoDialogType.alert, this.dialog)
                .afterClosed().subscribe(dialogResult => {
                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                        this.store.dispatch(new Opportunity.CloseOpportunityPopupClose(action.token));
                        this.store.dispatch(new Opportunity.PopupClose(action.token));
                    }
                });
        }));

    @Effect({ dispatch: false })
    sendFeeEarnerEmail$ = this.actions$.pipe(ofType<Opportunity.SendOpportunityFeeEarnerEmailSuccess>(Opportunity.
        SEND_FEE_EARNER_EMAIL_SUCCESS),
        tap((action) => {
            this.store.dispatch(new Opportunity.OpportunityModelClear(action.token));
        }));

    @Effect({ dispatch: false })
    caseFileCreate$ = this.actions$.pipe(ofType<Opportunity.OpportunityCaseFileCreateSuccess>(Opportunity.
        CASE_FILE_CREATE_SUCCESS),
        switchMap((action) =>
            this.store.select(getClientDataModelByToken(action.token)).pipe(
                map((data) => ({ opportunitySaveViewModel: data, action: action })),
                take(1))),
        map(info => {
            this.popupService.openMatterCreationPopup(uuid(), {
                matterModel: info.action.payload.responceData ? info.action.payload.responceData.data ?
                    info.action.payload.responceData.data.matter : null : null,
                opportunityId: info.action.payload.opportunityId
            }).subscribe((result: any) => {
                if (result && result !== 'close') {
                }
                this.store.dispatch(new Opportunity.PopupClose(info.action.token));
            });
        }));
    @Effect({ dispatch: false })
    viewFile$ = this.actions$.pipe(ofType<Opportunity.GetLogFileSuccess>(Opportunity.GET_LOG_FILE_SUCCESS),
        map((action) => {
            this.urlPopupService.openWithUrlPoup(action.url, 'opportunityFileView', true, false, 'File View', true);
        }));

    @Effect({ dispatch: false })
    ValidateMatInfoSuccess$ = this.actions$.pipe(ofType<Opportunity.ValidateMatterInfoSuccess>(Opportunity.VALIDATE_MATTER_DETAIL_SUCCESS),
        map(action => {
            if (!!action.payload.validationData) {
                if (!!action.payload.validationData.detailStatus && !!action.payload.validationData.detailStatus[0]) {
                    showConfirmDialog('Opportunity', action.payload.validationData.detailStatus[0].message,
                        this.dialog, 'Edit Matter', 'Cancel')
                        .afterClosed().subscribe(dialogResult => {
                            if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                                this.popupService.openMatterCreationPopup(action.token,
                                    { matterId: action.payload.validationData.data.matterCounter });
                            }
                            this.store.dispatch(new Opportunity.PopupClose(action.token));
                        });
                } else if (action.payload.continueProcess === 'openCase') {
                    this.pageService.gotoOpenCase({ data: action.payload.validationData.data });
                    this.store.dispatch(new Opportunity.PopupClose(action.token));
                } else if (action.payload.continueProcess === 'closeOppertunity') {
                    this.store.dispatch(new Opportunity.CloseOpportunity(action.token, { item: action.payload.item }));
                }
            }
        })
    );

    @Effect({ dispatch: false })
    requestToOpenMatter$ = this.actions$.pipe(ofType<Opportunity.RequestToOpenMatter>(Opportunity.REQUEST_TO_OPEN_MATTER),
        filter(action => !action.item.matterRef),
        map(action => {
            const message = `No matter for this opportunity item. <br> <b> Do you want to create a matter and change opportunity status from open to pending? </b>`;
            showConfirmDialog('Matter Creation', message,
                this.dialog, 'Yes', 'No')
                .afterClosed().subscribe(dialogResult => {
                    if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
                        this.store.dispatch(new Opportunity.CreateAMatter(action.token, action.item));
                    }
                });
        }));

    openQuoteRunPopup(types: PropertyQuoteType[], item: OpportunitySaveViewModel, token: string, isEdit: boolean): void {
        if (getQuoteType(types, item.appCode) === QuoteType.PropertyQuote) {
            this.popupService.propertyQuote(token, item, isEdit);
        } else {
            this.popupService.opportunityQuoteRun(token, item, false, isEdit);
        }
    }

}

