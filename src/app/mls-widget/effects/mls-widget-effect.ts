import { Effect, Actions, ofType } from '@ngrx/effects';
import * as Core from '../actions/core';
import { take, switchMap, filter } from 'rxjs/operators';
import { map } from 'rxjs/internal/operators/map';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/internal/operators/catchError';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { MlsWidgetServices } from '../services/mls-widget-services';
import { CaseFileIdentityWithAppIdViewModel } from './../../core/lib/files';
import { GridRowItemWrapper } from './../../core/lib/matter';
import { MainMenuService } from './../../layout-desktop/services/main-menu.service';
import { getContinueItem, getAllMatterRef } from '../reducers';
import { SendMessageRequest } from './../../mls-core/models/request';
import { combineLatest } from 'rxjs';
import { getUser } from '../../auth';

@Injectable()
export class MlsWidgetEffect {
    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private service: MlsWidgetServices,
        private pageService: MainMenuService
    ) {
    }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitMLSWidget>(Core.INIT_MLS_WIDGET),
        map(action =>
            new Core.RequestData()
        ));

    @Effect()
    requestData$ = this.actions$.pipe(ofType<Core.RequestData>(Core.REQUEST_DATA),
        switchMap(() =>
            this.store.select(getUser).pipe(
                filter(user => !!user.general),
                take(1),
                map((user) => ({
                    handlerEmail: user.general.userEmail,
                    // handlerEmail: 'mzufry@dpssoftware.co.uk',
                    pageSize: 50,
                    page: 1
                })), map(request => new Core.LoadData(request)))));

    @Effect()
    loadData$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap(action =>
            this.service.loadData(action.request).pipe(
                map((result) => new Core.LoadDataSuccess({ dataObj: result })),
                catchError((error) => of(new Core.LoadDataFail())))
        ));


    @Effect()
    loadDataSuccess$ = this.actions$.pipe(ofType<Core.LoadDataSuccess>(Core.LOAD_DATA_SUCCESS),
        // filter(action => action.payload.chatlist  && action.payload.chatlist.length > 0),
        switchMap(action =>
            this.store.select(getAllMatterRef()).pipe(
                map(allMatterRef => ({ allMatterRef: allMatterRef, chatList: action.payload.dataObj.chatMessageList })
                ))
        ), take(1)
        , map(info => {
            const unreResolvedMatIds: { processAppId: number, fileId: number, branchId: number }[] = [];
            info.chatList.forEach(i => {
                if (!info.allMatterRef.find(m => m.processAppId === i.appId && m.branchId === i.branchId && m.fileId === i.fileId)) {
                    unreResolvedMatIds.push({ processAppId: i.appId, fileId: i.fileId, branchId: i.branchId });
                }
            });
            return new Core.LoadMatterRef({ unResolvedMatters: unreResolvedMatIds });

        }),
    );

    @Effect() getMatterRef$ = this.actions$.pipe(ofType<Core.LoadMatterRef>(Core.LOAD_MATTER_REF),
        filter(action => action.payload.unResolvedMatters && action.payload.unResolvedMatters.length > 0),
        switchMap(action =>
            this.service.LoadMatterRef(action.payload.unResolvedMatters).pipe(
                map(result => new Core.LoadMatterRefSuccess({ matterRef: result })),
                catchError(e => of(new Core.LoadMatterRefFail()))
            )));


    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.RefreshMLSWidget>(Core.REFRESH),
        map(() => new Core.RequestData()));

    @Effect()
    getMatterDetails$ = this.actions$.pipe(ofType<Core.GetFullMatterDetails>(Core.GET_FULL_MATTER_DETAILS),
        switchMap((action) => {
            const request: CaseFileIdentityWithAppIdViewModel = {
                branchId: action.item.branchId,
                appId: action.item.appId,
                fileId: action.item.fileId,
                displayDataString: '',
            };
            return this.service.getFullMatterDetails(request).pipe(
                map(result => new Core.GetFullMatterDetailsSucceess(result)),
                catchError(error => of(new Core.GetFullMatterDetailsFail()))
            );
        }));

    @Effect({ dispatch: false })
    openCase$ = this.actions$.pipe(ofType<Core.GetFullMatterDetailsSucceess>(Core.GET_FULL_MATTER_DETAILS_SUCCESS),
        switchMap(action => {
            const matter: GridRowItemWrapper = {
                data: {
                    branchID: action.item.branchID,
                    app_Code: action.item.app_Code,
                    fileID: action.item.fileID,
                    matterReferenceNo: action.item.matterReferenceNo,
                    appID: action.item.appID ? action.item.appID : null,
                    closed: null,
                    lastUsed: null,
                    feeEarner: action.item.feeEarner,
                    reviewDate: null,
                    clientName: null,
                    reviewNote: null,
                    company_Name: null,
                    matterDetails: action.item.matterDetails,
                    matterCounter: action.item.matterCounter,
                    ufnValue: action.item.ufnValue,
                    eBilling: action.item.eBilling,
                    isPlotMatter: action.item.isPlotMatter,
                    isPlotMasterMatter: action.item.isPlotMasterMatter,
                    isProspectMatter: action.item.isProspectMatter,
                    isLegalAid: action.item.isLegalAid
                },
                selected: false,
                expanded: false,
                financeDetails: null
            };
            return this.pageService.gotoOpenCase(matter);
        }));


    @Effect()
    sendMessage$ = this.actions$.pipe(ofType<Core.SendMessage>(Core.SEND_MESSAGE),
        switchMap(action =>
            combineLatest(
                this.store.select(getContinueItem()),
                this.store.select(getUser),
                ((item, loginUser) =>
                    ({ item, loginUser, msg: action.msg }))
            ).pipe(take(1))
        ), map(info => {
            const request = new SendMessageRequest(
                info.msg,
                info.loginUser.general.userEmail,
                info.item.messageSender.emailAddress,
                info.item.appId,
                info.item.branchId,
                info.item.fileId
            );
            return request;
        }), switchMap(request =>
            this.service.sendMessage(request).pipe(
                map(respone => new Core.SendMessageSuccess()),
                catchError(() => of(new Core.SendMessageFail())))
        )
    );

    @Effect()
    sendMessageSuccess$ = this.actions$.pipe(ofType<Core.SendMessageSuccess>(Core.SEND_MESSAGE_SUCCESS),
        map(action => new Core.RequestData())
    );
}
