import { OpenCaseUpdateRequest } from './../models/requests';
import { tap, mergeMap, take, filter, switchMap, catchError, map } from 'rxjs/operators';
import { OpenCaseValidationRequest, GetClientRequest, TimesFinancialFiguresRequest } from '../models/requests';
import { combineLatest, of, from } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { OpenCaseService } from '../services/open-case.service';
import { getViewByToken, getOpenCaseMatterInfoByToken } from '../reducers';
import { AddOpenCaseInputData } from '../../layout-desktop/actions/main-menu';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { FileLogicStatus } from '../../workflow-core';
import { MainMenuService } from '../../layout-desktop/services/main-menu.service';
import { ScreensContactTypeRequest } from '../models/interface';
import { WorkflowMenuMetaDataWrapper, WorkflowMenuMetaItem } from '../../workflow-menu-core/models/interfaces';
import { RunWorkflowCommand } from '../../workflow-menu-core/actions/core';
import * as Core from '../actions/core';
import * as CoreActions from '../../core/lib/actions';
import * as WorkFlow from '../../workflow-menu-core/actions/core';
import * as FileHistory from '../../file-history-core/actions/core';
import * as CaseContact from '../../case-contact-core/actions/core';
import * as CaseTask from '../../case-task-core/actions/core';
import * as CaseTime from '../../case-time-core/actions/core';
import * as EChit from './../../e-chit-core/actions/core';
import * as ConflictSearch from '../../conflict-search-core/actions/core';
import * as CourtDuty from '../../crime-court-duty-core/actions/court-duty';

@Injectable()
export class OpenCaseEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private openCaseService: OpenCaseService,
        private mainMenuService: MainMenuService,
        private injector: Injector
    ) { }


    @Effect()
    openCaseInit$ = this.actions$.pipe(ofType<Core.InitOpenCase>(Core.INIT_OPEN_CASE),
        switchMap((action) =>
            this.store.select(getViewByToken(action.token)).pipe(take(1),
                filter((info) => !info.fdDetails),
                map((result) => {
                    const request: TimesFinancialFiguresRequest = {
                        matterReferenceNo: action.openCaseMenueData.matterReferenceNo,
                    };
                    return new Core.TimesFinancialFigures(action.token, request);
                }))
        ));

    @Effect()
    getShortCutKeys$ = this.actions$.pipe(ofType<Core.InitOpenCase>(Core.INIT_OPEN_CASE),
        switchMap((action) =>
            this.store.select(getViewByToken(action.token)).pipe(take(1),
                filter((info) => !info.menuMatterShortcuts),
                map((result) =>
                    new Core.LoadMenuMatterShortCutKeys(action.token)))
        ));

    @Effect()
    syncMatterClientToContactLink$ = this.actions$.pipe(ofType<Core.InitOpenCase>(Core.INIT_OPEN_CASE),
        switchMap((action) => {
            return this.store.select(getViewByToken(action.token)).pipe(take(1),
                filter((info) => !info.fdDetails),
                switchMap((state) => {

                    const matterInfo = state.matterInfo;
                    const request: OpenCaseUpdateRequest = {
                        BranchId: matterInfo.data.branchID,
                        AppId: matterInfo.data.appID,
                        FileId: matterInfo.data.fileID,
                    };
                    return this.openCaseService.mtterClientToContactLinkSync(request).pipe(
                        map((result) => {
                            return new Core.LoadSyncMatterClientToContactLinkSuccess(action.token, {});
                        }),
                        catchError((error) => {

                            return of(new Core.LoadSyncMatterClientToContactLinkFail(action.token, error));
                        }
                        ));


                })
            );
        }));


    @Effect()
    openCaseInitScreensLoad$ = this.actions$.pipe(ofType<Core.InitOpenCase>(Core.INIT_OPEN_CASE),
        switchMap((action) =>
            this.store.select(getViewByToken(action.token)).pipe(take(1),
                filter((info) => !info.screensContactTypeList),
                map((state) => {
                    const screensContactTypeRequest = new ScreensContactTypeRequest(
                        +state.matterInfo.data.appID, {
                        take: 0,
                        filter: null,
                        skip: 0,
                        sort: null
                    });
                    return new Core.ContactTypeScreensLoad(action.token, screensContactTypeRequest);
                }))
        ));


    @Effect()
    ContactTypeScreensLoad$ = this.actions$.pipe(ofType<Core.ContactTypeScreensLoad>
        (Core.CONTACT_TYPE_SCREENS_LOAD),
        switchMap((action) => {
            return this.openCaseService.getContactTypeScreensLoad(action.request).pipe(
                map((result) => {
                    return new Core.ContactTypeScreensLoadSuccess(action.token,
                        { response: result });
                }),
                catchError((error) => of(new Core.ContactTypeScreensLoadFail(action.token, error))));
        }));


    @Effect()
    updateFileLogicStatus$ = this.actions$.pipe(ofType<CoreActions.FileLogicStatsChange>(CoreActions.FILE_LOGIG_STATUS_CHANGE),
        switchMap((action) => {
            if (action.status === FileLogicStatus.Success) {
                return from([new Core.OpenCaseWFButtonStatus(action.data)]);
            } else {
                return of();
            }
        }));

    @Effect()
    checkOpenCaseAccess$ = this.actions$.pipe(ofType<Core.CheckOpenCaseAccess>(Core.CHECK_OPEN_CASE_ACCESS),
        tap(() => {
            console.log('CHECK');
        }),
        switchMap((action: Core.CheckOpenCaseAccess) =>
            this.store.select(getViewByToken(action.token)).pipe(take(1), map(state =>
                ({ inputData: action.inputData, state: state, token: action.token })
            ))
        ),
        switchMap<any, any>((data) => {
            if (data.state.validateResponce) {
                const matterInfo = data.state.matterInfo;
                const openCaseValidationRequest: OpenCaseValidationRequest = {
                    BranchID: matterInfo.data.branchID,
                    AppID: matterInfo.data.appID,
                    FileID: matterInfo.data.fileID,
                    AppCode: matterInfo.data.app_Code,
                };
                const clientRequest: GetClientRequest = {
                    appID: matterInfo.data.appID,
                    fileID: matterInfo.data.fileID,
                    branchID: matterInfo.data.branchID,
                };
                return of(new Core.CheckOpenCaseAccessResponseSuccess(data.token,
                    {
                        validateResponce: data.state.validateResponce,
                        clientDetailsResponce: data.state.clientDetailsResponce,
                        isUsingFDResponce: data.state.isUsingFDResponce,
                        matterInfo: matterInfo,
                        deleteEntrySecurityResponce: data.state.deleteEntrySecurityResponce
                    }));

            } else if (data.inputData.matterData) {
                return of(new Core.GetOpenCaseAccessFromReqestFromMatterData(data.token, { matterInfo: data.inputData.matterData }));
            } else if (data.inputData.mailSubject) {
                return of(new Core.GetOpenCaseAccessFromReqestFromMailSubject(data.token, { mailSubject: data.inputData.mailSubject }));
            }
        }));

    @Effect()
    openCaseAccessFromReqestFromMailSubjec$ = this.actions$.pipe(ofType<Core.GetOpenCaseAccessFromReqestFromMailSubject>
        (Core.GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MAIL_SUBJECT),
        switchMap((action: Core.GetOpenCaseAccessFromReqestFromMailSubject) =>
            this.openCaseService.getOpenCaseMaterDataFromMailSubject(action.payload.mailSubject).pipe(
                map((data) => {
                    // this.mainMenuService.gotoOpenCase(data);
                    // return new Core.GetOpenCaseAccessFromReqestFromMatterDataSuccess(action.token, { matterInfo: data });
                    const token = action.token;
                    const input: OpenCaseMenueData = {
                        matterData: data,
                        openCaseToken: token
                    };
                    this.store.dispatch(new AddOpenCaseInputData(input));
                    return new Core.GetOpenCaseAccessFromReqestFromMatterData(token, { matterInfo: data });
                }),
                // .catch((error) => of(new Core.OpenCaseMaterDetailResponseFaill(action.token, { matterInfo: null })))
                catchError(error => of(new Core.CheckOpenCaseAccessResponseFail(action.token, {
                    validateResponce: null,
                    clientDetailsResponce: null,
                    matterInfo: null
                }))))
        ));

    @Effect()
    openCaseAccessFromReqest$ = this.actions$.pipe(ofType<Core.GetOpenCaseAccessFromReqestFromMatterData>
        (Core.GET_OPEN_CASE_ACCESS_FROM_REQEST_FROM_MATTER_DATA),

        switchMap((action: Core.GetOpenCaseAccessFromReqestFromMatterData) => {
            const openCaseValidationRequest: OpenCaseValidationRequest = {
                BranchID: action.payload.matterInfo.data.branchID,
                AppID: action.payload.matterInfo.data.appID,
                FileID: action.payload.matterInfo.data.fileID,
                AppCode: action.payload.matterInfo.data.app_Code,
            };
            const clientRequest: GetClientRequest = {
                appID: action.payload.matterInfo.data.appID,
                fileID: action.payload.matterInfo.data.fileID,
                branchID: action.payload.matterInfo.data.branchID,
            };

            return combineLatest(
                this.openCaseService.checkValidateOpeningCase(openCaseValidationRequest),
                this.openCaseService.getClientDetails(clientRequest),
                this.openCaseService.getIsUsingFD(),
                this.openCaseService.getIsDeleteEnable(),
                ((validateResponce, clientDetailsResponce, isUsingFDResponce, deleteEntrySecurityResponce) => ({
                    validateResponce: validateResponce,
                    clientDetailsResponce: clientDetailsResponce,
                    isUsingFDResponce: isUsingFDResponce,
                    deleteEntrySecurityResponce: deleteEntrySecurityResponce.data
                }))
            ).pipe(take(1), map((data) => {
                return new Core.CheckOpenCaseAccessResponseSuccess(action.token,
                    {
                        validateResponce: data.validateResponce,
                        clientDetailsResponce: data.clientDetailsResponce,
                        isUsingFDResponce: data.isUsingFDResponce,
                        matterInfo: action.payload.matterInfo,
                        deleteEntrySecurityResponce: data.deleteEntrySecurityResponce
                    });
            }), catchError(error => of(new Core.CheckOpenCaseAccessResponseFail(action.token, {
                validateResponce: null,
                clientDetailsResponce: null,
                matterInfo: null
            }))));
        }));



    @Effect()
    openCaseAccessFromCurentState$ = this.actions$.pipe(ofType<Core.GetOpenCaseAccessFromCurrentState>
        (Core.GET_OPEN_CASE_ACCESS_DATA_WITH_CURRENT_STATE),
        switchMap((action: Core.GetOpenCaseAccessFromCurrentState) => {

            return combineLatest(
                this.store.select(getViewByToken(action.token)),
                ((state) => ({ state, token: action.token }))
            ).pipe(take(1), map((data) => {

                return new Core.CheckOpenCaseAccessResponseSuccess(action.token,
                    {
                        validateResponce: data.state.validateResponce,
                        clientDetailsResponce: data.state.clientDetailsResponce,
                        isUsingFDResponce: data.state.isUsingFDResponce,
                        matterInfo: action.payload.matterInfo,
                        deleteEntrySecurityResponce: data.state.deleteEntrySecurityResponce
                    });
            }),
                catchError(error => of(new Core.CheckOpenCaseAccessResponseFail(action.token, {
                    validateResponce: null,
                    clientDetailsResponce: null,
                    matterInfo: null
                }))));
        }));


    @Effect()
    menueOpenCaseAddTab$ = this.actions$.pipe(ofType<CoreActions.MenueOpenCaseAddTab>(CoreActions.MENU_OPEN_CASE_ADD_TAB),
        switchMap((action) =>
            this.store.select(getViewByToken(action.paylod.token)).pipe(take(1),
                filter((info) => !info.fdDetails),
                map((result) => {
                    const request: TimesFinancialFiguresRequest = {
                        matterReferenceNo: action.paylod.menuItem.data.matterReferenceNo,
                    };
                    return new Core.TimesFinancialFigures(action.paylod.token, request);
                }))
        ));
    // <CoreActions.MenueOpenCaseAddTab, { hasHash: boolean, token: string }>

    @Effect()
    timesFinancialFigures$ = this.actions$.pipe(ofType<Core.TimesFinancialFigures>
        (Core.TIMES_FINANCIAL_FIGURES_LOAD),
        switchMap((action) =>
            this.openCaseService.getAllTimeValTotalByMaterRef(action.request).pipe(
                map((result) => {
                    return new Core.TimesFinancialFiguresSuccess(action.token,
                        { response: result });
                }),
                catchError((error) => of(new Core.TimesFinancialFiguresSuccess(action.token, error))))
        ));

    @Effect()
    openCaseRefreshCount$ = this.actions$.pipe(ofType<Core.OpenCaseRefreshCount>
        (Core.OPEN_CASE_REFRESH_COUNT),
        switchMap((action) =>
            this.openCaseService.getAllTimeValTotalByMaterRef({ matterReferenceNo: action.payload.matterRef }).pipe(
                map((result) => {
                    return new Core.TimesFinancialFiguresSuccess(action.token,
                        { response: result });
                }),
                catchError((error) => of(new Core.TimesFinancialFiguresSuccess(action.token, error))))
        ));


    @Effect()
    workFlowCompleted$ = this.actions$.pipe(ofType<WorkFlow.WorkflowSessionCompleted>
        (WorkFlow.WORKFLOW_SESSION_COMPLETED),
        switchMap((action: WorkFlow.WorkflowSessionCompleted) => {
            return combineLatest(
                this.store.select(getViewByToken(action.token)),
                ((state) => ({ state, token: action.token }))
            ).pipe(take(1),
                mergeMap((data) => {
                    const matterReferenceNo = data.state.matterInfo.data.matterReferenceNo;
                    const initFileHistoryToken = 'InitFileHistory' + matterReferenceNo;
                    const initCaseContactToken = 'InitCaseContact' + matterReferenceNo;
                    const initCaseTaskToken = 'InitCaseTask' + matterReferenceNo;
                    const initCaseTimeToken = 'InitCaseTime' + matterReferenceNo;


                    return from([
                        new Core.OpenCaseRefreshCount(action.token, {
                            refreshCount: 0,
                            matterRef: matterReferenceNo
                        }),
                        new FileHistory.FileHistoryRefresh(initFileHistoryToken),
                        new CaseContact.CaseContactRefresh(initCaseContactToken),
                        new CaseTask.CaseTaskRefresh(initCaseTaskToken),
                        new CaseTime.CaseTimeRefresh(initCaseTimeToken),
                    ]);
                }));

        }));


    @Effect()
    eChitClose$ = this.actions$.pipe(ofType<EChit.EChitClosed>(EChit.E_CHIT_CLOSED),
        map((action) => {
            return new Core.OpenCaseRefresh(action.token, {});
        }));

    @Effect()
    courtDutyClose$ = this.actions$.pipe(ofType<CourtDuty.CourtDutyClosed>(CourtDuty.COURT_DUTY_CLOSED),
        map((action) => {
            return new Core.OpenCaseRefresh(action.token, {});
        }));

    @Effect()
    conflictSearchClosed$ = this.actions$.pipe(ofType<ConflictSearch.ConflictSearchClosed>
        (ConflictSearch.CONFLICT_SEARCH_CLOSED),
        map((action) => {
            return new Core.OpenCaseRefresh(action.token, {});
        }));

    @Effect()
    openCaseRefresh$ = this.actions$.pipe(ofType<Core.OpenCaseRefresh>
        (Core.OPEN_CASE_REFRESH),
        switchMap((action: Core.OpenCaseRefresh) => {
            return combineLatest(
                this.store.select(getViewByToken(action.token)),
                ((state) => ({ state, token: action.token }))
            ).pipe(take(1),
                filter((data) => !!(data && data.state && data.state.matterInfo
                    && data.state.matterInfo.data && data.state.matterInfo.data.matterReferenceNo)),
                mergeMap((data) => {

                    const matterReferenceNo = data.state.matterInfo.data.matterReferenceNo;
                    const initFileHistoryToken = 'InitFileHistory' + matterReferenceNo;
                    const initCaseContactToken = 'InitCaseContact' + matterReferenceNo;
                    const initCaseTaskToken = 'InitCaseTask' + matterReferenceNo;
                    const initCaseTimeToken = 'InitCaseTime' + matterReferenceNo;

                    return from([
                        new Core.OpenCaseRefreshCount(action.token, {
                            refreshCount: 0,
                            matterRef: matterReferenceNo
                        }),
                        new FileHistory.FileHistoryRefresh(initFileHistoryToken),
                        new CaseContact.CaseContactRefresh(initCaseContactToken),
                        new CaseTask.CaseTaskRefresh(initCaseTaskToken),
                        new CaseTime.CaseTimeRefresh(initCaseTimeToken),
                    ]);
                }));
        }));


    @Effect()
    getMatterShortCutKyesData$ = this.actions$.pipe(ofType<Core.LoadMenuMatterShortCutKeys>(Core.LOAD_MENU_MATTER_SHORTCUT_KEYS),
        switchMap((action) =>
            this.store.select(getOpenCaseMatterInfoByToken(action.token)).pipe(
                map(matterInfo => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap((info) => {
            if (info && info.matterInfo) {
                return this.openCaseService.getShortCutKeys(info.matterInfo.appID).pipe(
                    map((result) => new Core.LoadMenuMatterShortCutKeysSuccess(info.token, { matterShortcuts: result })),
                    catchError((error) => of(new Core.LoadMenuMatterShortCutKeysFail(info.token, error))));
            } else {
                return of();
            }
        }));




    @Effect()
    requestBanner$ = this.actions$.pipe(ofType<Core.InitOpenCase>(Core.INIT_OPEN_CASE),
        switchMap((action) =>
            this.store.select(getViewByToken(action.token)).pipe(take(1),
                map((state) => {
                    const matterInfo = state.matterInfo;
                    const request: OpenCaseUpdateRequest = {
                        BranchId: matterInfo.data.branchID,
                        AppId: matterInfo.data.appID,
                        FileId: matterInfo.data.fileID,
                    };
                    return new Core.GetMattersBannerMessages(action.token, request);
                }))
        ));


    @Effect()
    GetMatterBannerMsg$ = this.actions$.pipe(ofType<Core.GetMattersBannerMessages>
        (Core.GET_MATTERS_BANNER_MESSAGES),
        switchMap((action) => {
            return this.openCaseService.getMatterBannerMsg(action.request).pipe(
                map((result) => {
                    return new Core.GetMattersBannerMessagesSuccess(action.token,
                        { response: result });
                }),
                catchError((error) => of(new Core.GetMattersBannerMessagesFail(action.token, error))));
        }));



}


