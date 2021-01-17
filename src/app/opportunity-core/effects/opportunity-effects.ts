import { of, from, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Opportunity from '../actions/core';
import { switchMap, map, take, catchError, mergeMap, filter, tap } from 'rxjs/operators';
import { GridRequest, CostDiscount } from '../models/interfaces';
import { QuoteRequest, PropertyQuRequest, MLSOpportunitySendRequest } from '../models/request';
import { UrlPopupService } from './../../shell-desktop/services/url-popup.service';
import { FileUrlResolverService } from '../../document-view';
import { getUser } from '../../auth';
import { PropertyQuoteService } from '../services/property-quote.service';
import { PropertyQuoteRequestKey, PropertyQuoteValidation, OpportunityType } from '../models/enums';
import { InfoDialogType } from './../../core/utility/DpsUtility';
import {
    GridDataResponceViewModel, OpportunityValidationInfo,
    OpportunitySaveViewModel, PropertyQuoteRequest
} from './../models/interfaces';
import {
    getOpportunityColumnDefByToken, getOpportunityPaginatorDefByToken, getOpportunitySelectedStatusByToken,
    getClientDataModelByToken, getTempleteList, getFeeEarnerListByToken,
    getIntroducerListByToken, getStatusListByToken, propertyQuoteTypeList, propertyQuoteRequest, getPropertyQuReportData,
    getAppCodes,
    getScreenListForSelectedApp,
    getAddedScreenList,
    getWebQuoteVars,
    getWequoteCompanyDetails,
    getPreviesEmailTemplete,
    editEnquaryId,
    getClientDataModelForSaveByToken,
    getwebQuoteData
} from './../reducers/index';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { PropertyQuoteSend } from './../models/request';
import { OpportunityService } from '../services/opportunity.service';
import { PropertyQuoteApp, getQuoteType } from '../../core/lib/web-quote';
import { GetDepartment, GetWorkTypeList, GetLookupList } from '../../shared-data';


@Injectable()
export class OpportunityEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: OpportunityService,
        private propertyQuoteService: PropertyQuoteService,
        private urlPopupService: UrlPopupService, private fileUrlResolcer: FileUrlResolverService) {
    }
    @Effect()
    initOpportunity$ = this.actions$.pipe(ofType<Opportunity.InitOpportunityPage>(Opportunity.INIT_OPPORTUNITY),
        mergeMap(action => from([
            new Opportunity.GetFeeEarnerList(action.token),
            new GetDepartment(),
            new GetWorkTypeList(),
            new GetLookupList('SALTITLE'),
            new Opportunity.GetIntroductionList(action.token),
            new Opportunity.GetStatusList(action.token),
            new Opportunity.GetPropertQuoteType(action.token),
            new Opportunity.GetWebQuoteCompnayDetals()
        ])
        ));

    @Effect()
    initOpportunityEdit$ = this.actions$.pipe(ofType<Opportunity.InitOpertunityEdit>(Opportunity.INIT_OPPORTUNITY_EDIT),
        mergeMap(action => from([
            new Opportunity.GetOpprtunityHistory(action.token, action.opertunityId),
            new Opportunity.GetEditEnquaryData(action.token)
        ])
        ));

    @Effect()
    initOppertunitySetting$ = this.actions$.pipe(ofType<Opportunity.InitOppertunitySetting>(Opportunity.INIT_OPPERTUNITY_SETTING),
        switchMap(() =>
            this.store.select(getAppCodes).pipe(
                take(1))),
        filter(list => !list || list.length === 0),
        mergeMap(() => from([new Opportunity.GetAppCodeList(), new Opportunity.LoadInitScreenList()])));

    @Effect()
    initialScreenList$ = this.actions$.pipe(ofType<Opportunity.LoadInitScreenList>(Opportunity.LOAD_INIT_SCREEN_LIST),
        switchMap(() =>
            this.service.getInitialScreenList().pipe(
                map((result) => new Opportunity.LoadInitScreenListSuccess(result)),
                catchError((error) => of(new Opportunity.LoadInitScreenListFail())))));

    @Effect()
    getAppCodeList$ = this.actions$.pipe(ofType<Opportunity.GetAppCodeList>(Opportunity.GET_APP_CODE_LIST),
        switchMap(() =>
            this.service.getAppCodeList().pipe(
                map((result) => new Opportunity.GetAppCodeListSuccess(result)),
                catchError((error) => of(new Opportunity.GetAppCodeListFail())))));

    @Effect()
    changeApp$ = this.actions$.pipe(ofType<Opportunity.ChangeSettingAppID>(Opportunity.CHANGE_SETTING_APP_ID),
        switchMap((action) =>
            this.store.select(getScreenListForSelectedApp(action.selectedAppId)).pipe(
                take(1), map(list => ({ list: list, appId: action.selectedAppId })),
                filter(info => (!info.list || info.list.length < 1) && !!info.appId),
                map(info => new Opportunity.LoadScreenList(info.appId))
            )));

    @Effect()
    loadScreenList = this.actions$.pipe(ofType<Opportunity.LoadScreenList>(Opportunity.LOAD_SCREEN_LIST),
        switchMap(action =>
            this.service.getMLSOpportunityScreenList(action.appId).pipe(
                map((result) => new Opportunity.LoadScreenListSuccess(action.appId, result)),
                catchError((error) => of(new Opportunity.LoadScreenListFail())))
        ));

    @Effect()
    saveScreenList$ = this.actions$.pipe(ofType<Opportunity.SaveScreenList>(Opportunity.SAVE_SCREEN_LIST),
        filter(action => !action.payload.hasNonAddingItem),
        switchMap(() =>
            this.store.select(getAddedScreenList).pipe(
                take(1))),
        switchMap((list) =>
            this.service.saveScreenList(new MLSOpportunitySendRequest(list)).pipe(
                map(() => new Opportunity.SaveScreenListSuccess()),
                catchError((error) => of(new Opportunity.SaveScreenListFail())))
        ));

    @Effect()
    getInitialGridData$ = this.actions$.pipe(ofType<Opportunity.GetStatusListSuccess>(Opportunity.GET_OPPORTUNITY_STATUS_LIST_SUCCESS),
        map(action => new Opportunity.SetOpportunityGridDataRequest(action.token))
    );

    @Effect()
    changePage$ = this.actions$.pipe(ofType<Opportunity.ChangePaginator>(Opportunity.CHANGE_PAGE),
        map(action => new Opportunity.SetOpportunityGridDataRequest(action.token))
    );

    @Effect()
    applyColumSort$ = this.actions$.pipe(ofType<Opportunity.ApplyColumSort>(Opportunity.APPLY_COLUM_SORTING),
        map(action => new Opportunity.SetOpportunityGridDataRequest(action.token))
    );

    @Effect()
    applyColumFilter$ = this.actions$.pipe(ofType<Opportunity.ChangeColumFilteration>(Opportunity.CHANGE_COLUM_FILTERATION),
        map(action => new Opportunity.SetOpportunityGridDataRequest(action.token))
    );


    @Effect()
    loadStats$ = this.actions$.pipe(ofType<Opportunity.SetOpportunityGridDataRequest>(Opportunity.GET_SAVE_OPPORTUNITY_GRID_DATA_REQUEST),
        map(action => new Opportunity.GetOpportunityStatusSummary(action.token)));

    @Effect()
    loadCurrentStateData$ = this.actions$
        .pipe(ofType<Opportunity.SetOpportunityGridDataRequest>(Opportunity.GET_SAVE_OPPORTUNITY_GRID_DATA_REQUEST),
            switchMap((action) =>
                combineLatest(this.store.select(getOpportunitySelectedStatusByToken(action.token)),
                    this.store.select(getOpportunityPaginatorDefByToken(action.token)),
                    this.store.select(getOpportunityColumnDefByToken(action.token)),
                    (status, paginatorDef, columnDef) =>
                        ({ status, paginatorDef, columnDef })).pipe(
                            take(1),
                            map((info) =>
                                new GridRequest(
                                    {
                                        take: info.paginatorDef.itemPerPage,
                                        filter: toODataFilter(info.columnDef),
                                        skip: getPaginatorSkip(info.paginatorDef),
                                        sort: toODataSort(info.columnDef)
                                    },
                                    info.status ? info.status.key : 1)
                            ), map((request) => new Opportunity.GetSaveOpportunityGridData(action.token, request))),
            ));
    @Effect()
    getSaveOpportunityList$ = this.actions$.pipe(ofType<Opportunity.GetSaveOpportunityGridData>(Opportunity.GET_SAVE_OPPORTUNITY_GRID_DATA),
        switchMap((action) =>
            this.service.getSaveOpportunityGridDataList(action.request).pipe(
                map((result: GridDataResponceViewModel) => new Opportunity.GetSaveOpportunityGridDataSuccess(action.token,
                    { data: result })),
                catchError((error) => of(new Opportunity.GetSaveOpportunityGridDataFail(action.token, { error: error }))))
        ));

    @Effect()
    GetEditDataAfterRefresh$ = this.actions$.pipe(ofType<Opportunity.GetSaveOpportunityGridDataSuccess>
        (Opportunity.GET_SAVE_OPPORTUNITY_GRID_DATA_SUCCESS),
        map(action => new Opportunity.GetEditEnquaryData(action.token))
    );


    @Effect()
    loadFeeEarnerListData$ = this.actions$.pipe(ofType<Opportunity.GetFeeEarnerList>(Opportunity.GET_OPPORTUNITY_FEE_EARNER_LIST),
        switchMap((action) =>
            this.store.select(getFeeEarnerListByToken(action.token)).pipe(
                map((feeEarners) => ({ feeEarners: feeEarners, action: action })),
                take(1))),
        filter(info => info.feeEarners.length < 1),
        switchMap((info) =>
            this.service.getFeeEarnerList(true).pipe(map((response) =>
                new Opportunity.GetFeeEarnerListSuccess(info.action.token, { feeEarnerList: response })),
                catchError(error => of(new Opportunity.GetFeeEarnerListFail(info.action.token, error))))
        ));
    // @Effect()
    // getDepartmentList$ = this.actions$.pipe(ofType<Opportunity.GetOpportunityDepartment>(Opportunity.GET_OPPORTUNITY_DEPARTMENT_LIST),
    //     switchMap((action) =>
    //         this.store.select(getDepartmentListByToken(action.token)).pipe(
    //             map((departments) => ({ departments: departments, action: action })),
    //             take(1))),
    //     filter(info => info.departments.length < 1),
    //     switchMap((info) =>
    //         this.service.getOpportunityDepartmentList().pipe(
    //             map((result) => new Opportunity.GetOpportunityDepartmentSuccess(info.action.token, { departmentList: result })),
    //             catchError((error) => of(new Opportunity.GetOpportunityDepartmentFail(info.action.token, { error: error }))))
    //     ));
    // @Effect()
    // departmentChange$ = this.actions$
    //     .pipe(ofType<Opportunity.OpportunityDepartmentChange>(Opportunity.GET_OPPORTUNITY_DEPARTMENT_SELECTION_CHANGE),
    //         map((action) => {
    //             return new Opportunity.GetWorkTypeList(action.token, { departmentId: action.selectedItem.key });
    //         }));
    @Effect()
    statusChange$ = this.actions$
        .pipe(ofType<Opportunity.OpportunityStatusChange>(Opportunity.GET_OPPORTUNITY_STATUS_SELECTION_CHANGE),
            map((action) => {
                return new Opportunity.SetOpportunityGridDataRequest(action.token);
            }));
    // @Effect()
    // getWorkTypeList$ = this.actions$.pipe(ofType<Opportunity.GetWorkTypeList>(Opportunity.GET_OPPORTUNITY_WORK_TYPE_LIST),
    //     switchMap((action) => {
    //         return this.service.getWorkTypeListByDepartmentId(action.payload.departmentId).pipe(
    //             map((result) => new Opportunity.GetWorkTypeListSuccess(action.token,
    //                 { workTypeList: result })),
    //             catchError((error) => of(new Opportunity.GetWorkTypeListFail(action.token, { error: error }))));
    //     }));
    @Effect()
    getIntroductionList$ = this.actions$.pipe(ofType<Opportunity.GetIntroductionList>(Opportunity.OPPORTUNITY_INTRODUCTION_LIST),
        switchMap((action) =>
            this.store.select(getIntroducerListByToken(action.token)).pipe(
                map((list) => ({ list: list, action: action })),
                take(1))),
        filter(info => (info.list.length < 1) || !!info.action.needRefresh),
        switchMap(info =>
            this.service.getIntroductionList().pipe(
                map((result) => new Opportunity.GetIntroductionListSuccess(info.action.token, { introductionList: result })),
                catchError((error) => of(new Opportunity.GetIntroductionListFail(info.action.token, { error: error }))))
        ));
    @Effect()
    getStatusList$ = this.actions$.pipe(ofType<Opportunity.GetStatusList>(Opportunity.GET_OPPORTUNITY_STATUS_LIST),
        switchMap((action) =>
            this.store.select(getStatusListByToken(action.token)).pipe(
                map((list) => ({ list: list, action: action })),
                take(1))),
        filter(info => info.list.length < 1),
        switchMap((info) =>
            this.service.getOpportunityStatusList().pipe(
                map((result) => new Opportunity.GetStatusListSuccess(info.action.token, { statusList: result })),
                catchError((error) => of(new Opportunity.GetStatusListFail(info.action.token, { error: error }))))
        ));
    @Effect()
    sendAndSave$ = this.actions$.pipe(ofType<Opportunity.SendAndSaveOpportunities>(Opportunity.SEND_AND_SAVE_OPPORTUNITY_DATA),
        switchMap((action) =>
            this.store.select(getClientDataModelForSaveByToken(action.token)).pipe(
                map((data) => ({ opportunityModel: data, action: action })),
                take(1))),
        switchMap<any, any>((info) => {
            const validInformation: OpportunityValidationInfo = this.opportunityValidation(info.opportunityModel);
            if (validInformation.status) {
                return this.service.saveAndSendOpportunity(info.opportunityModel).pipe(
                    map((result) => new Opportunity.SendAndSaveOpportunitiesSuccess(info.action.token, {
                        responceData: result,
                        newIndorduser: this.isNewIndroduser(info.opportunityModel)
                    })),
                    catchError((error) => of(new Opportunity.SendAndSaveOpportunitiesFail(info.action.token, { error: error }))));
            } else {
                return of(new Opportunity.ShowMessage(info.action.token, 'Message', validInformation.msg, InfoDialogType.warning));
            }
        }));

    @Effect()
    editOppertunity$ = this.actions$.pipe(ofType<Opportunity.SaveEditOpportunities>(Opportunity.SAVE_EDIT_OPPORTUNITY_DATA),
        switchMap(action =>
            this.service.saveAndSendOpportunity(action.data).pipe(
                map((result) => new Opportunity.SaveEditOpportunitiesSuccess(action.token, {
                    responceData: result, newIndorduser: this.isNewIndroduser(action.data)
                })),
                catchError((error) => of(new Opportunity.SaveEditOpportunitiesFail(action.token))))
        ));

    @Effect()
    refreshGridDataAfterEdit$ = this.actions$.pipe(ofType<Opportunity.SaveEditOpportunitiesSuccess>(
        Opportunity.SAVE_EDIT_OPPORTUNITY_DATA_SUCCESS),
        mergeMap(action => from([
            new Opportunity.SetOpportunityGridDataRequest(action.token),
            new Opportunity.GetIntroductionList(action.token, action.payload.newIndorduser)
        ])));

    @Effect()
    sendAndQuote$ = this.actions$.pipe(ofType<Opportunity.SaveAndQuoteOpportunities>(Opportunity.SAVE_AND_QUOTE_OPPORTUNITY_DATA),
        switchMap((action) =>
            combineLatest(this.store.select(getClientDataModelForSaveByToken(action.token)),
                this.store.select(propertyQuoteTypeList(action.token)),
                (opportunityModel, profertyQuoteTypes) => ({ opportunityModel, profertyQuoteTypes, action: action })).pipe(take(1))),
        switchMap<any, any>((info) => { // <any, any>
            const validInfor: OpportunityValidationInfo = this.opportunityValidation(info.opportunityModel);
            if (validInfor.status) {
                return this.service.saveAndSendOpportunity(info.opportunityModel).pipe(
                    map((result) => new Opportunity.SaveAndQuoteOpportunitiesSuccess(info.action.token,
                        {
                            responceData: result,
                            quoteType: getQuoteType(info.profertyQuoteTypes, result.data.appCode),
                            newIndorduser: this.isNewIndroduser(info.opportunityModel)
                        })),
                    catchError((error) =>
                        of(new Opportunity.SaveAndQuoteOpportunitiesFail(info.action.token, { error: error }))));
            } else {
                return of(new Opportunity.ShowMessage(info.action.token, 'Message', validInfor.msg, InfoDialogType.warning));
            }
        }));

    @Effect()
    opportunityAccepted$ = this.actions$.pipe(ofType<Opportunity.CloseOpportunitiesAccepted>(Opportunity.CLOSE_OPPORTUNITY_ACCEPTED),
        switchMap((action) =>
            this.service.saveAcceptedCloseOpportunity(action.closeOpportunityData).pipe(
                map((result) => new Opportunity.CloseOpportunitiesAcceptedSuccess(action.token, {
                    responceData: result,
                    opportunityId: action.closeOpportunityData ? action.closeOpportunityData.opportunityId : null,
                    oppertunityItem: action.oppertunityItem
                })),
                catchError((error) => of(new Opportunity.CloseOpportunitiesAcceptedFail(action.token, { error: error }))))
        ));
    @Effect()
    opportunityRejected$ = this.actions$.pipe(ofType<Opportunity.CloseOpportunitiesRejected>(Opportunity.CLOSE_OPPORTUNITY_REJECTED),
        switchMap((action) =>
            this.service.saveRejectedCloseOpportunity(action.closeOpportunityData).pipe(
                map((result) => new Opportunity.CloseOpportunitiesRejectedSuccess(action.token, { responceData: result })),
                catchError((error) => of(new Opportunity.CloseOpportunitiesRejectedFail(action.token, { error: error }))))
        ));

    @Effect()
    requestTemplete$ = this.actions$.pipe(ofType<Opportunity.GenarateQuoteRequest>(Opportunity.GENARATE_QUOTE_REQUEST),
        switchMap(action =>
            this.store.select(getTempleteList(action.token)).pipe(
                map(templete => ({ templete: templete, action: action })),
                take(1))),
        filter(info => !info.templete || info.templete.length === 0),
        map(info =>
            new Opportunity.GetTemplete(info.action.token, { item: info.action.payload.item })
        ));

    @Effect()
    loadTemplete$ = this.actions$.pipe(ofType<Opportunity.GetTemplete>(Opportunity.GET_TEMPLETE),
        switchMap(action =>
            this.service.getTemplete().pipe(
                map(result => new Opportunity.GetTempleteSuccess(action.token, { item: action.payload.item, templete: result })),
                catchError(error => of(new Opportunity.GetTempleteFail(action.token))
                ))
        ));

    @Effect()
    refreshGridData$ = this.actions$.pipe(ofType<Opportunity.OpportunityRefreshGridData>(Opportunity.REFRESH_OPPORTUNITY_GRID_DATA),
        mergeMap(action => from([
            new Opportunity.SetOpportunityGridDataRequest(action.token),
        ])));

    @Effect()
    genarateQuote$ = this.actions$.pipe(ofType<Opportunity.GenarateQuote>(Opportunity.GENARATE_QUOTE),
        switchMap(action =>
            this.service.genarateQuote(new QuoteRequest(action.payload.item)).pipe(
                map(result => new Opportunity.GenarateQuoteSuccess(action.token,
                    { responce: result, emailAddress: action.payload.item.email1, item: action.payload.item })),
                catchError(e => of(new Opportunity.GenarateQuoteFail(action.token)))
            )));

    @Effect()
    QuoteGenarateWithOutError$ = this.actions$.pipe(ofType<Opportunity.GenarateQuoteSuccess>(Opportunity.GENARATE_QUOTE_SUCCESS),
        filter(action =>
            action.payload.responce && action.payload.responce.detailStatus && action.payload.responce.detailStatus.length === 0),
        mergeMap(action => from([
            new Opportunity.OpenMailComposePopup(action.token, action.payload.responce.data, action.payload.emailAddress),
            new Opportunity.SendNotificationAfterQuoteAdded(action.token, { item: action.payload.item })]))
    );



    @Effect()
    QuoteGenarateWithError$ = this.actions$.pipe(ofType<Opportunity.GenarateQuoteSuccess>(Opportunity.GENARATE_QUOTE_SUCCESS),
        filter(action =>
            action.payload.responce && action.payload.responce.detailStatus && action.payload.responce.detailStatus.length > 0),
        map(action => new Opportunity.GenarateQuoteWithError(action.token,
            { info: action.payload.responce, emailAddress: action.payload.emailAddress }))
    );

    @Effect({ dispatch: false })
    openMailComposePopup = this.actions$.pipe(ofType<Opportunity.OpenMailComposePopup>(Opportunity.OPEN_MAIL_COMPOSE_POPUP),
        tap(action => {
            const encodeId = encodeURIComponent(action.payload.id);
            const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
            this.urlPopupService.openWithUrlPoup(urlPath, action.payload.id, false, false);
        })
    );
    @Effect()
    closePopup$ = this.actions$.pipe(ofType<Opportunity.PopupClose>(Opportunity.POPUP_CLOSE),
        map(action => new Opportunity.OpportunityRefreshGridData(action.token))
    );
    @Effect()
    sendEmailToFeeEarner$ = this.actions$.pipe(ofType<Opportunity.SendOpportunityFeeEarnerEmail>(Opportunity.SEND_FEE_EARNER_EMAIL),
        switchMap((action) =>
            this.service.SendOpportunityFeeEarnerEmail(action.opportunityId).pipe(
                map((result) => new Opportunity.SendOpportunityFeeEarnerEmailSuccess(action.token, { responce: result })),
                catchError((error) => of(new Opportunity.SendOpportunityFeeEarnerEmailFail(action.token, { error: error }))))
        ));


    @Effect()
    errorClear$ = this.actions$.pipe(ofType<Opportunity.SendOpportunityFeeEarnerEmailFail>(Opportunity.
        SEND_FEE_EARNER_EMAIL_FAIL),
        map((action) =>
            new Opportunity.OpportunityModelClear(action.token))
    );

    @Effect()
    createCaseFile$ = this.actions$.pipe(ofType<Opportunity.OpportunityCaseFileCreate>(Opportunity.CASE_FILE_CREATE),
        switchMap(action => this.store.select(getUser).pipe(map(user => ({ user, action })))),
        switchMap(({ user, action }) =>
            this.service.getMatterData(action.payload.item.enquiryId).pipe(
                map((result) => new Opportunity.OpportunityCaseFileCreateSuccess(action.token, {
                    responceData: result,
                    opportunityId: action.payload.item ? action.payload.item.enquiryId : null,
                    dateTimeOffset: user.general.dateTimeOffset
                })),
                catchError((error) => of(new Opportunity.OpportunityCaseFileCreateFail(action.token, { error: error }))))
        ));

    @Effect()
    getOppetunityHistory$ = this.actions$.pipe(ofType<Opportunity.GetOpprtunityHistory>(Opportunity.GET_OPPERTUNITY_HISTORY),
        switchMap((action) =>
            this.service.getOppertunityHistory(action.opertunityId).pipe(
                map((result) => new Opportunity.GetOpprtunityHistorySuccess(action.token, result)),
                catchError((error) => of(new Opportunity.GetOpprtunityHistoryFail(action.token))))
        ));

    @Effect()
    getLogFileUrl$ = this.actions$.pipe(ofType<Opportunity.GetLogFile>(Opportunity.GET_LOG_FILE),
        switchMap(action =>
            this.fileUrlResolcer.getOppertunityLogFile(action.id).pipe(
                map(url => new Opportunity.GetLogFileSuccess(action.token, url)),
                catchError(() => of(new Opportunity.GetLogFileFail(action.token)))
            ))
    );
    @Effect()
    getWeQuoteCompany$ = this.actions$.pipe(ofType<Opportunity.GetWebQuoteCompnayDetals>(Opportunity.GET_WEB_QUOTE_COMPANY),
        switchMap(() => this.store.select(getWequoteCompanyDetails).pipe(
            take(1))),
        filter(info => !info),
        switchMap(() => this.propertyQuoteService.getWebQuoteCompnayDetails().pipe(
            map(responce => new Opportunity.GetWebQuoteCompnayDetalsSuccess(responce)),
            catchError(() => of(new Opportunity.GetWebQuoteCompnayDetalsFail()))
        ))
    );
    @Effect()
    getPropertyquoteType$ = this.actions$.pipe(ofType<Opportunity.GetPropertQuoteType>(Opportunity.GET_PROPERTY_QUOTE_TYPE),
        switchMap(action => this.store.select(propertyQuoteTypeList(action.token)).pipe(
            map(typeList => ({ typeList, token: action.token })),
            take(1))),
        filter(info => info.typeList.length < 1),
        switchMap(info => this.propertyQuoteService.getTypeList().pipe(
            map(responce => new Opportunity.GetPropertQuoteTypeSuccess(info.token, responce)),
            catchError(() => of(new Opportunity.GetPropertQuoteTypeFail(info.token)))
        ))
    );

    @Effect()
    getWebQuoteData$ = this.actions$.pipe(ofType<Opportunity.GetPropertQuoteTypeSuccess>(Opportunity.GET_PROPERTY_QUOTE_TYPE_SUCCESS),
        map(action => new Opportunity.LoadWebQuoteComboData(action.token)));

    @Effect()
    webQuoteDataLoading$ = this.actions$.pipe(ofType<Opportunity.LoadWebQuoteComboData>(Opportunity.LOAD_PROPERT_QUOTE_COMBO_DATA),
        switchMap(action =>
            combineLatest(this.propertyQuoteService.getBranchs(),
                this.propertyQuoteService.getLocalAuth(),
                this.propertyQuoteService.getCost(),
                (branch, localAuth, cost) => ({ branch, localAuth, cost, token: action.token })).pipe(take(1),
                    map(info => new Opportunity.LoadWebQuoteComboDataSuccess(info.token,
                        { branchList: info.branch, localAuth: info.localAuth, costList: info.cost })),
                    catchError(() => of(new Opportunity.LoadWebQuoteComboDataFail(action.token)))
                )
        ));

    @Effect({ dispatch: false })
    propertyQuoteReport$ = this.actions$.pipe(ofType<Opportunity.RequestPropertyQuoteReport>(Opportunity.REQUEST_PROPERTY_QUOTE_REPORT),
        switchMap(action =>
            this.store.select(propertyQuoteRequest(action.token)).pipe(
                map(request => ({ request: request, error: this.checkPropertyQuReportRequestValid(request), action: action })),
                take(1)
            ))
    );

    @Effect()
    propertyQuRequestValidFail$ = this.propertyQuoteReport$.pipe(
        filter(info => !!info.error),
        map(info => new Opportunity.ShowMessage(info.action.token, 'Property Quote', info.error, InfoDialogType.warning)
        ));

    @Effect()
    propertyQuReportLoad$ = this.propertyQuoteReport$.pipe(
        filter(info => !info.error),
        map(info => new Opportunity.PropertyQuoteReportLoading(info.action.token, info.request, info.action.isEdit)));

    @Effect()
    getpropertyQuReport$ = this.actions$.pipe(ofType<Opportunity.PropertyQuoteReportLoading>(Opportunity.PROPERTY_QUOTE_REPORT_LOADING),
        switchMap(action => this.propertyQuoteService.getRepoertData(new PropertyQuRequest(action.request)).pipe(
            map(responce =>
                new Opportunity.PropertyQuoteReportLoadingSuccess(action.token, responce, action.isEdit)
            ), catchError(() => of(new Opportunity.PropertyQuoteReportLoadingFail(action.token)))
        )));

    @Effect()
    getReportLoaded$ = this.actions$.pipe(ofType<Opportunity.PropertyQuoteReportLoadingSuccess>
        (Opportunity.PROPERTY_QUOTE_REPORT_LOADING_SUCCESS),
        map(action => new Opportunity.ChangePropertQuStep(action.token, action.isEdit ? 1 : 2))
    );

    @Effect({ dispatch: false })
    checkNeedToSaveReport$ = this.actions$.pipe(ofType<Opportunity.RequestToSendPropertyQuote>(Opportunity.REQUEST_TO_SEND_PROPERTY_QUOTE),
        switchMap(action => combineLatest(this.store.select(propertyQuoteRequest(action.token)),
            this.store.select(getPropertyQuReportData(action.token)),
            (request) => ({ request }))
            .pipe(take(1)
                , map(data => {
                    if (data.request.reportId > 0) {
                        return { saveReport: false, action };
                    } else {
                        return { saveReport: true, action };
                    }
                }))),
    );

    @Effect()
    requestSaveQuoute$ = this.checkNeedToSaveReport$.pipe(
        filter(data => !data.saveReport),
        map(data => new Opportunity.SendPropertyQuote(data.action.token, data.action.reportContent, data.action.editedOpportunity))
    );

    @Effect()
    requestReportSaveQuoute$ = this.checkNeedToSaveReport$.pipe(
        filter(data => !!data.saveReport),
        map(data => new Opportunity.SaveReport(data.action.token, data.action.reportContent, data.action.editedOpportunity))
    );

    @Effect()
    saveReport$ = this.actions$.pipe(ofType<Opportunity.SaveReport>(Opportunity.SAVE_REPORT_DATA),
        switchMap(action =>
            combineLatest(this.store.select(propertyQuoteRequest(action.token)),
                this.store.select(getPropertyQuReportData(action.token)),
                (request, report) =>
                    ({ request, report, action }))
                .pipe(take(1))
        ),
        switchMap(info => this.propertyQuoteService.saveRepotrtData(info.report, info.request.appId).pipe(
            map(reportId => new Opportunity.SaveReportSuccess(
                info.action.token,
                info.action.reportContent,
                info.action.editedOpportunity,
                reportId
            )),
            catchError(() => of(new Opportunity.SaveReportFail(info.action.token)))
        ))
    );

    @Effect()
    reportSaveSuccess$ = this.actions$.pipe(ofType<Opportunity.SaveReportSuccess>(Opportunity.SAVE_REPORT_DATA_SUCCESS),
        map(action => new Opportunity.SendPropertyQuote(action.token, action.reportContent, action.editedOpportunity))
    );

    @Effect()
    sendPropertyQuote$ = this.actions$.pipe(ofType<Opportunity.SendPropertyQuote>(Opportunity.SEND_PROPERTY_QUOTE),
        switchMap(action =>
            combineLatest(this.store.select(propertyQuoteRequest(action.token)),
                this.store.select(getPropertyQuReportData(action.token)),
                this.store.select(getClientDataModelByToken(action.token)),
                this.store.select(getWebQuoteVars),
                this.store.select(getWequoteCompanyDetails),
                this.store.select(getwebQuoteData(action.token)),
                this.store.select(propertyQuoteTypeList(action.token)),
                (request, reportData, enquiry, vars, webQuoteCompany, webQuoteData, webQuoteAppList) =>
                    ({ request, reportData, enquiry, vars, webQuoteCompany, webQuoteData, webQuoteAppList, action }))
                .pipe(take(1))
        ),
        switchMap(info => this.propertyQuoteService.sendQuote(
            new PropertyQuoteSend(
                !!info.action.editedOpportunity ? info.action.editedOpportunity.enquiryId : info.enquiry.enquiryId,
                info.request,
                info.action.reportContent,
                info.reportData,
                !!info.action.editedOpportunity ? info.action.editedOpportunity.email1 : info.enquiry.email1,
                info.vars,
                info.webQuoteCompany,
                !!info.webQuoteData ? info.webQuoteData.branch : [],
                info.webQuoteAppList
            )
        ).pipe(map((responce) => new Opportunity.SendPropertyQuoteSuccess(
            info.action.token,
            responce,
            !!info.action.editedOpportunity ? info.action.editedOpportunity.email1 : info.enquiry.email1,
            info.action.editedOpportunity)),
            catchError(() => of(new Opportunity.SendPropertyQuoteFail(info.action.token))))
        ));

    @Effect()
    sendPropertyQuoteSuccess$ = this.actions$.pipe(ofType<Opportunity.SendPropertyQuoteSuccess>(Opportunity.SEND_PROPERTY_QUOTE_SUCCESS),

        mergeMap(action => from([
            new Opportunity.OpenMailComposePopup(action.token, action.data, action.email1),
            new Opportunity.SendNotificationAfterQuoteAdded(action.token, { item: action.item }),
            new Opportunity.OpportunityModelClear(action.token)]))
    );

    @Effect()
    requestToOpenMatter$ = this.actions$.pipe(ofType<Opportunity.RequestToOpenMatter>(Opportunity.REQUEST_TO_OPEN_MATTER),
        filter(action => !!action.item.matterRef),
        map(action => new Opportunity.ValidateMatterInfo(action.token, action.item, 'openCase'))
    );

    @Effect()
    validateMatter$ = this.actions$.pipe(ofType<Opportunity.ValidateMatterInfo>(Opportunity.VALIDATE_MATTER_DETAIL),
        switchMap(action => this.service.validateMatterInfo(action.item.enquiryId, action.continueProcess).pipe(
            map(responce => new Opportunity.ValidateMatterInfoSuccess(action.token,
                { item: action.item, continueProcess: action.continueProcess, validationData: responce })),
            catchError(() => of(new Opportunity.ValidateMatterInfoFail(action.token)))
        ))
    );

    @Effect()
    getStats$ = this.actions$.pipe(ofType<Opportunity.GetOpportunityStatusSummary>(Opportunity.GET_OPPORTUNITY_STATUS_SUMMARY),
        switchMap((action) =>
            this.service.getStats().pipe(
                map(result =>
                    new Opportunity.GetOpportunityStatusSummarySuccess(action.token, result),
                    catchError((error) => of(new Opportunity.GetOpportunityStatusSummaryFail(action.token))))
            )));

    @Effect()
    getWebQuoteVars$ = this.actions$.pipe(ofType<Opportunity.PropertyQuoteReportLoading>(Opportunity.PROPERTY_QUOTE_REPORT_LOADING),
        switchMap(() => this.store.select(getWebQuoteVars).pipe(
            filter(vars => !vars || vars.length === 0),
            map(() => new Opportunity.PropertyQuoteGetVars()),
            take(1)
        )));

    @Effect()
    loadWebQuoteVars$ = this.actions$.pipe(ofType<Opportunity.PropertyQuoteGetVars>(Opportunity.PROPERTY_QUOTE_GET_VARS),
        switchMap(action => this.propertyQuoteService.loadWebQuoteVars().pipe(
            map(responce => new Opportunity.PropertyQuoteGetVarsSuccess(responce)),
            catchError(() => of(new Opportunity.PropertyQuoteGetVarsFail()))
        ))
    );

    @Effect()
    uploadEmailTemplete$ = this.actions$.pipe(ofType<Opportunity.UploadEmailTemplete>(Opportunity.UPLOAD_EMAIL_TEMPLETE),
        switchMap(action =>
            this.service.uploadEmailTemplete(action.file).pipe(
                map((result) => new Opportunity.UploadEmailTempleteSuccess()),
                catchError((error) => of(new Opportunity.UploadEmailTempleteFail())))
        ));


    @Effect()
    getQuotrEditData$ = this.actions$.pipe(ofType<Opportunity.GetEditEnquaryData>(Opportunity.GET_EDIT_ENQUARY_DATA),
        switchMap((action) =>
            this.store.select(editEnquaryId(action.token)).pipe(
                map(id => ({ id, token: action.token })),
                take(1))),
        filter(info => !!info.id),
        switchMap(info =>
            this.service.getEditQuoteData(info.id).pipe(
                map(result => new Opportunity.GetEditEnquaryDataSuccess(info.token, info.id, result)),
                catchError((error) => of(new Opportunity.GetEditEnquaryDataFail(info.token))))
        ));

    @Effect()
    OpenSettingPanel$ = this.actions$.pipe(ofType<Opportunity.OpenSettingPanel>(Opportunity.OPEN_SETTING_PANEL),
        switchMap(() => this.store.select(getPreviesEmailTemplete).pipe(
            take(1))),
        filter(view => !view),
        map(() => new Opportunity.ViewMailHeaderAttachment())
    );

    @Effect()
    ViewMailHeaderAttachment$ = this.actions$.pipe(ofType<Opportunity.ViewMailHeaderAttachment>(Opportunity.VIEW_MAIL_HEADER_ATTACHMENT),
        switchMap(action =>
            this.service.viewMailHeaderAttachment().pipe(
                map((result) => new Opportunity.ViewMailHeaderAttachmentSuccess(result)),
                catchError((error) => of(new Opportunity.ViewMailHeaderAttachmentFail())))
        ));
    @Effect()
    SendNotification$ = this.actions$.pipe(ofType<Opportunity.SendNotification>(Opportunity.SEND_NOTIFICATION),
        switchMap(action => this.store.select(getUser).pipe(
            map(user => ({ user, action })),
            take(1))),
        switchMap(({ user, action }) =>
            this.service.sendNotification(action.payload.data, user.general.user).pipe(
                map((result) => new Opportunity.SendNotificationSuccess(action.token)),
                catchError((error) => of(new Opportunity.SendNotificationFail(action.token))))
        ));


    @Effect()
    sendNotificationAfterQuoteAdd$ = this.actions$.pipe(ofType<Opportunity.SendNotificationAfterQuoteAdded>
        (Opportunity.SEND_NOTIFICATION_AFTER_QUOTE_ADD),
        filter(action => action.payload.item.opportunityType === OpportunityType.Solicitor),
        map(action => new Opportunity.SendNotification(action.token, {
            data: {
                email: action.payload.item.email1, feeEarnerCode: action.payload.item.feeEarner,
                message: 'New quotation has been sent to your email',
                enquiryId: action.payload.item.enquiryId
            }
        }))
    );

    @Effect()
    saveAndQuoteOpportunitiesSuccess$ = this.actions$.pipe(ofType<Opportunity.SaveAndQuoteOpportunitiesSuccess>
        (Opportunity.SAVE_AND_QUOTE_OPPORTUNITY_DATA_SUCCESS),
        map(action => new Opportunity.GetIntroductionList(action.token, action.payload.newIndorduser))
    );

    @Effect()
    sendAndSaveOpportunitiesSuccess$ = this.actions$.pipe(ofType<Opportunity.SendAndSaveOpportunitiesSuccess>
        (Opportunity.SEND_AND_SAVE_OPPORTUNITY_DATA_SUCCESS),
        map(action => new Opportunity.GetIntroductionList(action.token, action.payload.newIndorduser))
    );

    @Effect()
    requestReportDataForEdit$ = this.actions$.pipe(ofType<Opportunity.InitPropertyQuote>(Opportunity.INIT_PROPERTY_QUOTE),
        switchMap(action => this.store.select(propertyQuoteRequest(action.token)).pipe(
            take(1),
            filter(request => request && request.reportId > 0),
            map(request => new Opportunity.LoadExistingReport(action.token, request.reportId)),
        )));

    @Effect()
    getReportDataForEdit$ = this.actions$.pipe(ofType<Opportunity.LoadExistingReport>(Opportunity.LOAD_EXISTING_REPORT),
        switchMap(action =>
            this.propertyQuoteService.getExistingRepoertData(action.reportId).pipe(
                map(responce =>
                    new Opportunity.PropertyQuoteReportLoadingSuccess(action.token, responce, true)
                ), catchError(() => of(new Opportunity.PropertyQuoteReportLoadingFail(action.token)))
            )
        ));


    @Effect()
    createMatter$ = this.actions$.pipe(ofType<Opportunity.CreateAMatter>(Opportunity.CREATE_A_MATTER),
        switchMap(action => this.service.createMatter(action.item.enquiryId).pipe(
            map(responce => new Opportunity.CreateAMatterSuccess(action.token, action.item)),
            catchError(() => of(new Opportunity.CreateAMatterFail(action.token)))
        ))
    );

    @Effect()
    openNewlyCreadedMatter$ = this.actions$.pipe(ofType<Opportunity.CreateAMatterSuccess>(Opportunity.CREATE_A_MATTER_SUCCESS),
        map(action => new Opportunity.ValidateMatterInfo(action.token, action.item, 'openCase'))
    );

    opportunityValidation(requiredField: OpportunitySaveViewModel) {
        let validInformation: OpportunityValidationInfo;
        validInformation = {
            msg: 'Information is valid',
            status: true
        };
        if (!requiredField.lastName) {
            validInformation = {
                msg: `Please enter last name.`,
                status: false
            };
        } else if (!requiredField.firstName) {
            validInformation = {
                msg: `Please enter first name.`,
                status: false
            };
        } else if (!requiredField.address1) {
            validInformation = {
                msg: `Please enter address 1.`,
                status: false
            };
        } else if (!requiredField.town) {
            validInformation = {
                msg: `Please enter town.`,
                status: false
            };
        } else if (!requiredField.postCode) {
            validInformation = {
                msg: `Please enter Postcode.`,
                status: false
            };
        } else if (!requiredField.email1) {
            validInformation = {
                msg: `Please enter email 1.`,
                status: false
            };
        } else if (requiredField.departmentId === -1) {
            validInformation = {
                msg: `Please enter department.`,
                status: false
            };
        } else if (requiredField.workTypeId === -1) {
            validInformation = {
                msg: `Please enter workType.`,
                status: false
            };
        } else if (!requiredField.feeEarner) {
            validInformation = {
                msg: `Please enter feeEarner.`,
                status: false
            };
        } else if (!requiredField.note) {
            validInformation = {
                msg: `Please enter note.`,
                status: false
            };
        } else if (requiredField.email1) {
            let serchfind: boolean;
            // tslint:disable-next-line:max-line-length
            const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            serchfind = regexp.test(requiredField.email1);
            if (!serchfind) {
                validInformation = {
                    msg: `Email 1 is not valid.`,
                    status: false
                };
            } else if (requiredField.email2) {
                let serchfind2: boolean;
                serchfind2 = regexp.test(requiredField.email2);
                if (!serchfind2) {
                    validInformation = {
                        msg: `Email 2 is not valid.`,
                        status: false
                    };
                } else {
                    validInformation = {
                        msg: 'Information is valid',
                        status: true
                    };
                }
            } else {
                validInformation = {
                    msg: 'Information is valid',
                    status: true
                };
            }
        }
        return validInformation;
    }

    checkPropertyQuReportRequestValid(request: PropertyQuoteRequest): string {
        switch (request[PropertyQuoteRequestKey.appId]) {
            case PropertyQuoteApp.Buying: {
                if (!request[PropertyQuoteRequestKey.purchesValue] || request[PropertyQuoteRequestKey.purchesValue] <= 0) {
                    return PropertyQuoteValidation.purchesValue;
                } else if (!request[PropertyQuoteRequestKey.isEngProperty]) {
                    return PropertyQuoteValidation.isEngProperty;
                }
                break;
            }
            case PropertyQuoteApp.Selling: {
                if (!request[PropertyQuoteRequestKey.saleValue] || request[PropertyQuoteRequestKey.saleValue] <= 0) {
                    return PropertyQuoteValidation.saleValue;
                } else if (!request[PropertyQuoteRequestKey.isEngProperty]) {
                    return PropertyQuoteValidation.isEngProperty;
                }
                break;
            }
            case PropertyQuoteApp.BuyingAndSelling: {
                if (!request[PropertyQuoteRequestKey.purchesValue] || request[PropertyQuoteRequestKey.purchesValue] <= 0) {
                    return PropertyQuoteValidation.purchesValue;
                } else if (!request[PropertyQuoteRequestKey.isEngProperty]) {
                    return PropertyQuoteValidation.isEngProperty;
                } else if (!request[PropertyQuoteRequestKey.saleValue] || request[PropertyQuoteRequestKey.saleValue] <= 0) {
                    return PropertyQuoteValidation.saleValue;
                } else if (!request[PropertyQuoteRequestKey.isEngProperty]) {
                    return PropertyQuoteValidation.isEngProperty;
                }
                break;
            }
            default: {
                if (!request[PropertyQuoteRequestKey.hIPsValue] || request[PropertyQuoteRequestKey.hIPsValue] <= 0) {
                    return PropertyQuoteValidation.value;
                } else if (!request[PropertyQuoteRequestKey.isEngProperty]) {
                    return PropertyQuoteValidation.isEngProperty;
                }
                break;
            }
        }
        // if (!request[PropertyQuoteRequestKey.branchId]) {
        //     return PropertyQuoteValidation.branch;
        // }
    }

    isNewIndroduser(model: OpportunitySaveViewModel): boolean {
        if (!!model && (!model.introducer || model.introducer === null || model.introducer <= 0) && !!model.introducerDescription) {
            return true;
        } else {
            return false;
        }
    }

}
