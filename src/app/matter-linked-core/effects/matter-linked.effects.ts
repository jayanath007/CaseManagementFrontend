
import { PlotMatterDiaryRecordsInfoViewModel, PlotMatterUpdateViewModel } from './../models/request';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MainMenuService } from './../../layout-desktop/services/main-menu.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of, from, combineLatest } from 'rxjs';
import { MatterLinkedService } from '../services/matter-linked-service';
import { tap, switchMap, map, catchError, mergeMap, take, filter, delay } from 'rxjs/operators';
import { LinkedMatterRequestViewModel, PlotMatterViewModel } from '../models/request';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import {
    getColumnDefByToken, getPaginatorDefByToken,
    getMatterRefByToken, getSelectedMatterDataByToken, getMatterDataByToken, getScreenId, getOpenFromByToken,
    getParentTokenByToken,
    getDiaryId,
    getPlotRangeTokenByToken
} from './../reducers/index';
import { MatterLinkedType } from '../models/enum';
import * as MatterCreationAction from '../../matter-creation-core/actions/core';
import * as Menus from '../../layout-desktop/actions/main-menu';


@Injectable()
export class MatterLinkedEffects {
    constructor(private datePipe: DatePipe, private dialog: MatDialog,
        private actions$: Actions, private store: Store<any>, private service: MatterLinkedService,

        protected pageService: MainMenuService) { }

    @Effect()
    initewView$ = this.actions$.pipe(ofType<Core.InitMatterLinked>(Core.INIT_MATTER_LINKED),
        mergeMap(action => from([
            new Core.RequestLinkedData(action.token),
        ])
        ));


    @Effect()
    LoadLinkedMatterData$ = this.actions$.pipe(ofType<Core.RequestLinkedData>(Core.REQUEST_LINKED_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getPaginatorDefByToken(action.token)),
                this.store.select(getColumnDefByToken(action.token)),
                this.store.select(getMatterRefByToken(action.token)),
                ((paginatorDef, columnDef, matterRef) => (
                    { paginatorDef, columnDef, matterRef }))
            ).pipe(take(1),
                map((info) =>
                    new LinkedMatterRequestViewModel(
                        info.matterRef,
                        {
                            Take: 0,
                            Filter: toODataFilter(info.columnDef),
                            Skip: 0,             // getPaginatorSkip(info.paginatorDef),
                            Sort: toODataSort(info.columnDef)
                        })
                ), map((request) => new Core.GetMatterLinked(action.token, request)))
        ));


    @Effect()
    getLinkedMatterList$ = this.actions$.pipe(ofType<Core.GetMatterLinked>(Core.GET_MATTER_LINKED),
        switchMap((action) => this.service.getLinkedMatter(action.request).pipe(
            map((result) => new Core.InitMatterLinkedSuccess(action.token, result)),
            catchError((error) => of(new Core.InitMatterLinkedFail(action.token, { error: error }))))

        ));





    @Effect()
    createLinkedMatter$ = this.actions$.pipe(ofType<Core.CreateLinkedMatter>(Core.CREATE_LINKED_MATTER),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterRefByToken(action.token)),
                this.store.select(getColumnDefByToken(action.token)),
                this.store.select(getMatterDataByToken(action.token)),
                ((matterRef, columnDef, matterData) => (
                    { matterRef, columnDef, matterData }))
            ).pipe(take(1),
                map((info) =>
                    new PlotMatterViewModel(
                        action.plotNumbers,
                        info.matterRef,
                        info.matterData.appId,
                        info.matterData.branchID,
                        info.matterData.fileID
                    )
                ), map((request) => new Core.SavePlotLinkedMatter(action.token, request)))
        ));

    @Effect()
    savePlotNo$ = this.actions$.pipe(ofType<Core.SavePlotLinkedMatter>(Core.SAVE_PLOT_LINKED_MATTER),
        switchMap((action) =>
            this.service.createLinkedMatter(action.request).pipe(
                map((responce) => {
                    return new Core.GetPlotStatus(action.token, responce, action.request);
                }),
                catchError((error) => of(new Core.SavePlotFail(action.token, { error: error }))))
        ));

    // @Effect()
    // checkStatus$ = this.actions$.pipe(ofType<SavePlotSuccess>(FIND_NEW_REMINDERS),
    //     switchMap(action => interval(1000).pipe(take(1), map(() => new GetPlotStatus()))
    //     ));

    @Effect()
    getPlotStatus$ = this.actions$.pipe(ofType<Core.GetPlotStatus>(Core.GET_PLOT_STATUS),
        delay(2000),
        switchMap((action) =>
            this.service.getPlotStatus(action.request).pipe(
                map((result) => {
                    if (result.data.status === 'In Progress') {
                        return new Core.GetPlotStatus(action.token, action.responce, action.request);
                    } else if (result.data.status === 'Ok') {
                        return new Core.GetPlotStatusSuccess(action.token, result);
                    }
                    return new Core.GetPlotStatusFail(action.token, result);
                }),
                catchError((error) => of(new Core.GetPlotStatusFail(action.token, { error: error }))))
        ));


    @Effect()
    linkedMatterRefresh$ = this.actions$.pipe(ofType<Core.GetPlotStatusSuccess>(Core.GET_PLOT_STATUS_SUCCESS),
        mergeMap(action => from([
            new Core.RequestLinkedData(action.token),
            new Menus.MenuItemOpenCaseMatterDatilsUpdate({ matter: action.responce.data.allMatterDetailsViewModel.matter })
        ])
            // map((action) => {
            //     return new Core.RequestLinkedData(action.token);

            //     return new Menus.MenuItemOpenCaseMatterDatilsUpdate({ matter: action.payload.matter });
        ));


    // @Effect()
    // linkedMatterRefresh$ = this.actions$.pipe(ofType<Core.SavePlotSuccess>(Core.SAVE_PLOT_SUCCESS),
    //     switchMap((action) =>
    //         this.store.select(getMatterDataByToken(action.token)).pipe(
    //             map((model) => ({ model, action })),
    //             take(1))),
    //     mergeMap(({ model, action }) =>
    //         from([
    //             new Core.RequestLinkedData(action.token),
    //             new Menus.MenuItemOpenCaseMatterDatilsUpdate({ matter: model.ma })
    //         ])
    //     ));


    @Effect()
    savePlotSuccess$ = this.actions$.pipe(ofType<Core.SavePlotSuccess>(Core.SAVE_PLOT_SUCCESS),
        switchMap((action) => {

            return combineLatest(
                this.store.select(getOpenFromByToken(action.token)),
                this.store.select(getParentTokenByToken(action.token)),
                ((matterLinkedType, token) => (
                    { matterLinkedType, token }))
            ).pipe(take(1),
                filter((data) => {
                    return data.matterLinkedType === MatterLinkedType.MatterCreation;
                }),
                map((data) => {

                    return new MatterCreationAction.PlotSalesSuccessUpdate(data.token, {});

                })
            );

        }));


    @Effect()
    linkedMatterRefresh2$ = this.actions$.pipe(ofType<Core.SavePlotFail>(Core.SAVE_PLOT_FAIL),
        map((action) => {

            return new Core.RequestLinkedData(action.token);

        }));

    @Effect({ dispatch: false })
    LinkedMatterOpenCase$ = this.actions$.pipe(ofType<Core.LinkedMatterOpenCase>(Core.LINKED_MATTER_OPEN_CASE),
        map(action => {
            const matter: GridRowItemWrapper = {
                data: {
                    branchID: action.payload.branchID,
                    app_Code: action.payload.app_Code,
                    fileID: action.payload.fileID ? action.payload.fileID : null,
                    matterReferenceNo: action.payload.matterReferenceNo,
                    appID: action.payload.appID ? action.payload.appID : null,
                    closed: action.payload.closed,
                    lastUsed: null,
                    feeEarner: action.payload.feeEarner,
                    reviewDate: null,
                    clientName: action.payload.clientName,
                    reviewNote: null,
                    company_Name: null,
                    matterDetails: action.payload.matterDetails,
                    matterCounter: action.payload.matterCounter,
                    ufnValue: action.payload.ufnValue,
                    eBilling: action.payload.eBilling,
                    isPlotMatter: action.payload.isPlotMatter,
                    isPlotMasterMatter: action.payload.isMasterMatter,
                    isProspectMatter: action.payload.isProspectMatter,
                    isLegalAid: action.payload.isLegalAid
                },
                selected: true,
                expanded: true,
                financeDetails: null
            };
            this.pageService.gotoOpenCase(matter);
        }));

    @Effect()
    addDiaryRecord$ = this.actions$.pipe(ofType<Core.AddDiaryRecordsForPlotMattters>(Core.ADD_DIARY_RECORD_FOR_PLOT_MATTER),
        mergeMap((action) =>
            this.service.addDiaryRecordsForPlot(action.request).pipe(
                map((result) => new Core.AddDiaryRecordsForPlotMatttersSuccess(action.token,
                    { plotSyncSuccessInfo: { isSuccess: true, msg: 'Linked plots synced.' } })),
                catchError((error) => of(new Core.AddDiaryRecordsForPlotMattterstFail(action.token, { error: error }))))
        ));




    @Effect()
    addNoteLinkedMatter$ = this.actions$.pipe(ofType<Core.RequestAddDiaryRecordsForPlotMattters>
        (Core.REQUEST_ADD_DIARY_RECORD_FOR_PLOT_MATTER),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterRefByToken(action.token)),
                this.store.select(getSelectedMatterDataByToken(action.token)),
                this.store.select(getPlotRangeTokenByToken(action.token)),
                ((matterRef, selectedMatterRef, plotRange) => ({ matterRef, selectedMatterRef, plotRange }))
            ).pipe(take(1),
                filter(i => !!i.selectedMatterRef && i.selectedMatterRef.length > 0 || i.plotRange !== null),
                map((info) =>
                    new PlotMatterDiaryRecordsInfoViewModel(
                        info.selectedMatterRef,
                        action.payload.diaryIds,
                        info.matterRef,
                        info.plotRange,
                        {
                            branchId: action.payload.branchId,
                            appId: action.payload.appId,
                            fileId: action.payload.fileId

                        }
                    )
                ), map((request) => new Core.AddDiaryRecordsForPlotMattters(action.token, request)))
        ));

    @Effect()
    SavePlotSaleScreenData$ = this.actions$.pipe(ofType<Core.SavePlotSaleScreenData>(Core.SAVE_PLOT_SALE_SCREEN_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getSelectedMatterDataByToken(action.token)),
                this.store.select(getMatterDataByToken(action.token)),
                this.store.select(getScreenId(action.token)),
                this.store.select(getPlotRangeTokenByToken(action.token)),
                (matterList, matterData, screenId, plotRange) => ({ matterList, matterData, screenId, plotRange })
            ).pipe(take(1), filter(info => info.matterList && (info.matterList.length > 0 || info.plotRange !== null) && !!info.matterData),
                switchMap(info =>
                    this.service.savePlotSaleScreenData({
                        caseFileIdentityWithAppIdViewModel: {
                            branchId: info.matterData.branchID,
                            appId: info.matterData.appId,
                            fileId: info.matterData.fileID,
                            displayDataString: '',
                        },
                        screenId: info.screenId,
                        linkMatters: info.matterList,
                        linkMatterRange: info.plotRange,
                    }).pipe(map(response => new Core.SavePlotSaleScreenDataSuccess(action.token,
                        { plotSyncSuccessInfo: { isSuccess: true, msg: 'Linked plots synced.' } })),
                        catchError(() => of(new Core.SavePlotSaleScreenDataFail(action.token))))
                )
            )
        )
    );
    @Effect()
    requestUpdatePlotMatter$ = this.actions$.pipe(ofType<Core.RequestUpdateLinkedMatter>(Core.REQUEST_UPDATE_LINKED_MATTER),
        switchMap(action =>
            combineLatest(
                this.store.select(getSelectedMatterDataByToken(action.token)),
                this.store.select(getPlotRangeTokenByToken(action.token)),
                ((selectedMatterRef, plotRange) => (
                    { selectedMatterRef, plotRange }))
            ).pipe(take(1),
                map((info) =>
                    new PlotMatterUpdateViewModel(
                        action.masterMatterRef,
                        info.selectedMatterRef,
                        info.plotRange,
                    )
                ), map((request) => new Core.UpdatePlotLinkedMatter(action.token, request)))
        ));

    @Effect()
    updatePlotMatter$ = this.actions$.pipe(ofType<Core.UpdatePlotLinkedMatter>(Core.UPDATE_PLOT_LINKED_MATTER),
        switchMap((action) =>
            this.service.updatePlotMatters(action.request).pipe(
                map((result) => new Core.UpdatePlotLinkedMatterSuccess(action.token, result)),
                catchError((error) => of(new Core.UpdatePlotLinkedMatterFail(action.token, { error: error }))))
        ));



    @Effect()
    linkedMatterRefresh3$ = this.actions$.pipe(ofType<Core.UpdatePlotLinkedMatterSuccess>(Core.UPDATE_PLOT_LINKED_MATTER_SUCCESS),
        map((action) => {

            return new Core.RequestLinkedData(action.token);

        }));

    @Effect()
    ShowValidateMassage$ = this.actions$.pipe(ofType<Core.SavePlotSuccess>(Core.SAVE_PLOT_SUCCESS),
        filter(action => action.responce && action.responce.detailStatus
            && action.responce.detailStatus.length > 0),
        map(action => {
            return new Core.ShowValidationFailDialog(action.token, action.responce);
        }));

    @Effect()
    addDiaryChaser$ = this.actions$.pipe(ofType<Core.RequestAddDiaryChaserData>
        (Core.REQUEST_ADD_DIARY_CHASER_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterRefByToken(action.token)),
                this.store.select(getSelectedMatterDataByToken(action.token)),
                this.store.select(getDiaryId(action.token)),
                this.store.select(getMatterDataByToken(action.token)),
                this.store.select(getPlotRangeTokenByToken(action.token)),
                ((matterRef, selectedMatterRef, diaryIds, matterData, plotRange) =>
                    ({ matterRef, selectedMatterRef, diaryIds, matterData, plotRange }))
            ).pipe(take(1),
                filter(i => !!i.selectedMatterRef && i.selectedMatterRef.length > 0 || i.plotRange !== null),
                map((info) =>
                    new PlotMatterDiaryRecordsInfoViewModel(
                        info.selectedMatterRef,
                        info.diaryIds,
                        info.matterRef,
                        info.plotRange,
                        {
                            branchId: info.matterData.branchID,
                            appId: info.matterData.appId,
                            fileId: info.matterData.fileID,

                        }
                    )
                ), map((request) => new Core.AddDiaryRecordsForPlotMattters(action.token, request)))
        ));

}
