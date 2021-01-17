
import { filter, catchError, take, map, switchMap, mergeMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, combineLatest, from } from 'rxjs';

import { LedgerCardService } from '../services/ledger-card-services';
import * as Core from '../actions/core';
import {
    getLedgerCardAllGridFilterDataByToken, getLedgerCardMatterDataByToken,
    getLedgerCardAllGridDataByToken, getLedgerCardBillGridDataByToken,
    getLedgerCardDisbsGridDataByToken, getLedgerCardGbpGridDataByToken, getLedgerCardDdaGridDataByToken,
    getLedgeCardCurrencyViewByToken, getLedgeClient1GridDataByToken, getLedgeClient2GridDataByToken,
    getLedgeClient3GridDataByToken
} from '../reducers';
import { AllGridRequest, BillGridRequest, DisbsGridRequest, GbpGridRequest, DdaGridRequest, ClientGridRequest } from '../models/request';
import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import { allGridFilterKind, ViewChangeKind } from '../models/enumeration';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { centerToWindow } from '../../utils/bounds';
import { uuid } from '../../utils/uuid';

@Injectable()
export class LedgerCardEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: LedgerCardService,
        private fileUrlResolverService: FileUrlResolverService,
        private windowPopupsManagerService: WindowPopupsManagerService
    ) { }

    @Effect()
    OnInit$ = this.actions$.pipe(ofType<Core.InitLedgerCard>(Core.INIT_LEDGER_CARD),
        switchMap(action =>
            this.store.select(getLedgerCardMatterDataByToken(action.token)).pipe(
                map((matterData) => ({ matterData, action: action })),
                take(1))),
        mergeMap<any, any>(info => {
            if (info.action.payload.isPopup) {
                return from([new Core.LoadMatterData(info.action.token, { matterRef: info.action.payload.input.matterRef }),
                new Core.LoadMatterBalances(info.action.token, { matterRef: info.action.payload.input.matterRef })
                ]);
            } else {
                return of(new Core.AllDataUpdate(info.action.token));
            }

        }));


    @Effect()
    LoadAllData$ = this.actions$.pipe(ofType<Core.UpdateMatterRef>(Core.UPDATE_MATTER_REF),
        mergeMap((action) => {
            return from([new Core.LoadMatterData(action.token, { matterRef: action.payload.matterRef }),
            new Core.LoadMatterBalances(action.token, { matterRef: action.payload.matterRef }),
                // new Core.LoadAllGrid(action.token, { matterRef: action.payload.matterRef })
            ]);
        }));

    @Effect()
    LoadMatterData$ = this.actions$.pipe(ofType<Core.LoadMatterData>(Core.LOAD_MATTER_DATA),
        switchMap(action => {
            return this.service.getMatterFromMatRef(action.payload.matterRef).pipe(
                map((response) =>
                    new Core.LoadMatterDataSuccess(action.token, { matterData: response })),
                catchError(error => of(new Core.LoadMatterDataFail(action.token, error))));

        }));

    @Effect()
    LoadMatterDataSuccess$ = this.actions$.pipe(ofType<Core.LoadMatterDataSuccess>(Core.LOAD_MATTER_DATA_SUCCESS),
        switchMap(action =>
            this.store.select(getLedgerCardMatterDataByToken(action.token)).pipe(
                map((matterData) => ({ matterData, token: action.token })),
                take(1))
        ),
        mergeMap<any, any>((info) => {
            if (info.matterData && info.matterData.app_Code) {
                return from([new Core.RequestAllGrid(info.token),
                new Core.RequestBillGrid(info.token),
                new Core.RequestDisbsGrid(info.token),
                new Core.RequestGbpGrid(info.token),
                new Core.RequestDdaGrid(info.token),
                new Core.LoadCurrency(info.token),
                new Core.LoadAllMatterCount(info.token),
                new Core.LoadEchitGrid(info.token, { matterRef: info.matterData.matterReferenceNo })
                ]);
            } else {
                return of(new Core.AllDataUpdate(info.token));
            }
        }));

    @Effect()
    LoadClientGridDataSuccess$ = this.actions$.pipe(ofType<Core.LoadCurrencySuccess>(Core.LOAD_CURRENCY_DATA_SUCCESS),
        mergeMap((action) => {
            return from([new Core.RequestClient1Grid(action.token),
            new Core.RequestClient2Grid(action.token),
            new Core.RequestClient3Grid(action.token)
            ]);
        }));

    @Effect()
    ChangeAllGridView$ = this.actions$.pipe(ofType<Core.AllGridViewChange>(Core.All_GRID_VIEW_CHANGE),
        switchMap(action => this.store.select(getLedgerCardMatterDataByToken(action.token)).pipe(
            map((matterData) => ({ matterData, token: action.token })),
            take(1),
            switchMap<any, Core.Any>(info => {
                if (info.matterData) {
                    return of(new Core.RequestAllGrid(info.token));
                } else {
                    return of(new Core.AllDataUpdate(info.token));
                }

            }))));


    @Effect()
    ChangeAllGridFilter$ = this.actions$.pipe(ofType<Core.AllGridFilterChange>(Core.All_GRID_FILTER_UPDATE),
        switchMap(action => this.store.select(getLedgerCardMatterDataByToken(action.token)).pipe(
            map((matterData) => ({ matterData, action: action })),
            take(1),
            switchMap<any, Core.Any>((info) => {
                if ((info.action.payload.data.kind === allGridFilterKind.showCOS ||
                    info.action.payload.data.kind === allGridFilterKind.showSysBills ||
                    info.action.payload.data.kind === allGridFilterKind.showDDA ||
                    info.action.payload.data.kind === allGridFilterKind.showOnlyDisbuersements ||
                    info.action.payload.data.kind === allGridFilterKind.showOnlyOfficeTrans ||
                    info.action.payload.data.kind === allGridFilterKind.showReversal) && info.matterData) {
                    return of(new Core.RequestAllGrid(info.action.token));
                } else if (info.action.payload.data.kind === allGridFilterKind.isBillsOnly && info.matterData) {
                    return of(new Core.RequestBillGrid(info.action.token));
                } else {
                    return of(new Core.AllDataUpdate(info.action.token));
                }
            }))));

    @Effect()
    LoadMatterBalance$ = this.actions$.pipe(ofType<Core.LoadMatterBalances>(Core.LOAD_MATTER_BALANCES),
        switchMap(action => {
            return this.service.getMatterFromMatterBalances(action.payload.matterRef).pipe(
                map((response) =>
                    new Core.LoadMatterBalancesSuccess(action.token, { matterBalances: response })),
                catchError(error => of(new Core.LoadMatterBalancesFail(action.token, error))));

        }));

    @Effect()
    LoadAllGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestAllGrid>(Core.REQUEST_ALL_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardAllGridFilterDataByToken(action.token)),
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgerCardAllGridDataByToken(action.token)),
                ((filterData, matterData, allGrid) => ({ filterData, matterData, allGrid, token: action.token }))
            ).pipe(take(1),
                map((info) =>
                    new AllGridRequest({
                        showDDA: info.filterData.showDDA,
                        showCOS: info.filterData.showCOS,
                        showReversal: info.filterData.showReversal,
                        hideSystemBills: info.filterData.showSysBills,
                        showOnlyOfficeTrans: info.filterData.showOnlyOfficeTrans,
                        showOnlyDisbuersements: info.filterData.showOnlyDisbuersements,
                        Period: info.filterData.periodText
                    },
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.allGrid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.allGrid.gridColumns),
                            skip: getPaginatorSkip(info.allGrid.PaginatorDef),
                            sort: toODataSort(info.allGrid.gridColumns)
                        }, 'info.hash')
                ), map((request) => new Core.LoadAllGrid(action.token, request)))
        ));


    @Effect()
    LoadAllGridData$ = this.actions$.pipe(ofType<Core.LoadAllGrid>(Core.LOAD_ALL_GRID_DATA),
        switchMap(action => {
            return this.service.getAllGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadAllGridSuccess(action.token, { allGridPageData: response })),
                catchError(error => of(new Core.LoadAllGridFail(action.token, error))));

        }));

    @Effect()
    LoadBillGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestBillGrid>(Core.REQUEST_BILL_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardAllGridFilterDataByToken(action.token)),
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgerCardBillGridDataByToken(action.token)),
                ((filterData, matterData, billGrid) => ({ filterData, matterData, billGrid, token: action.token }))
            ).pipe(take(1),
                filter(info => !!info.matterData),
                map((info) =>
                    new BillGridRequest(
                        info.filterData.isBillsOnly,
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.billGrid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.billGrid.gridColumns),
                            skip: getPaginatorSkip(info.billGrid.PaginatorDef),
                            sort: toODataSort(info.billGrid.gridColumns)
                        }, 'info.hash')
                ), map((request) => new Core.LoadBillGrid(action.token, request)))
        ));

    @Effect()
    LoadBillGridData$ = this.actions$.pipe(ofType<Core.LoadBillGrid>(Core.LOAD_BILL_GRID_DATA),
        switchMap(action => {
            return this.service.getBillGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadBillGridSuccess(action.token, { billData: response })),
                catchError(error => of(new Core.LoadBillGridFail(action.token, error))));

        }));

    @Effect()
    ChangeBillGridView$ = this.actions$.pipe(ofType<Core.BillGridViewChange>(Core.BILL_GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.RequestBillGrid(action.token)]);
        }));

    @Effect()
    LoadDisbsGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestDisbsGrid>(Core.REQUEST_DISBS_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgerCardDisbsGridDataByToken(action.token)),
                ((matterData, disbsGrid) => ({ matterData, disbsGrid, token: action.token }))
            ).pipe(take(1),
                filter(info => !!info.matterData),
                map((info) =>
                    new DisbsGridRequest(
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.disbsGrid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.disbsGrid.gridColumns),
                            skip: getPaginatorSkip(info.disbsGrid.PaginatorDef),
                            sort: toODataSort(info.disbsGrid.gridColumns)
                        }, 'info.hash')
                ), map((request) => new Core.LoadDisbsGrid(action.token, request)))
        ));

    @Effect()
    LoadDisbsGridData$ = this.actions$.pipe(ofType<Core.LoadDisbsGrid>(Core.LOAD_DISBS_GRID_DATA),
        switchMap(action => {
            return this.service.getDisbsGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadDisbsGridSuccess(action.token, { disbsGridPageData: response })),
                catchError(error => of(new Core.LoadDisbsGridFail(action.token, error))));

        }));

    @Effect()
    ChangeDisbsGridView$ = this.actions$.pipe(ofType<Core.DisbsGridViewChange>(Core.DISBS_GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.RequestDisbsGrid(action.token)]);
        }));

    @Effect()
    LoadGbpGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestGbpGrid>(Core.REQUEST_GBP_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgerCardGbpGridDataByToken(action.token)),
                ((matterData, gbpGrid) => ({ matterData, gbpGrid, token: action.token }))
            ).pipe(take(1),
                filter(info => !!info.matterData),
                map((info) =>
                    new GbpGridRequest(
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.gbpGrid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.gbpGrid.gridColumns),
                            skip: getPaginatorSkip(info.gbpGrid.PaginatorDef),
                            sort: toODataSort(info.gbpGrid.gridColumns)
                        }, 'info.hash')
                ), map((request) => new Core.LoadGbpGrid(action.token, request)))
        ));

    @Effect()
    LoadGbpGridData$ = this.actions$.pipe(ofType<Core.LoadGbpGrid>(Core.LOAD_GBP_GRID_DATA),
        switchMap(action => {
            return this.service.getGbpGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadGbpGridSuccess(action.token, { gbpGridPageData: response })),
                catchError(error => of(new Core.LoadGbpGridFail(action.token, error))));

        }));

    @Effect()
    ChangeGbpGridView$ = this.actions$.pipe(ofType<Core.GbpGridViewChange>(Core.GBP_GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.RequestGbpGrid(action.token)]);
        }));

    @Effect()
    LoadDdaGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestDdaGrid>(Core.REQUEST_DDA_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgerCardDdaGridDataByToken(action.token)),
                ((matterData, ddaGrid) => ({ matterData, ddaGrid, token: action.token }))
            ).pipe(take(1),
                filter(info => !!info.matterData),
                map((info) =>
                    new DdaGridRequest(
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.ddaGrid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.ddaGrid.gridColumns),
                            skip: getPaginatorSkip(info.ddaGrid.PaginatorDef),
                            sort: toODataSort(info.ddaGrid.gridColumns)
                        }, 'info.hash')
                ), map((request) => new Core.LoadDdaGrid(action.token, request)))
        ));

    @Effect()
    LoadDdaGridData$ = this.actions$.pipe(ofType<Core.LoadDdaGrid>(Core.LOAD_DDA_GRID_DATA),
        switchMap(action => {
            return this.service.getDdaGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadDdaGridSuccess(action.token, { ddaGridPageData: response })),
                catchError(error => of(new Core.LoadDdaGridFail(action.token, error))));

        }));

    @Effect()
    ChangeDdaGridView$ = this.actions$.pipe(ofType<Core.DdaGridViewChange>(Core.DDA_GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.RequestDdaGrid(action.token)]);
        }));

    @Effect()
    LoadCurrencyViewData$ = this.actions$.pipe(ofType<Core.LoadCurrency>(Core.LOAD_CURRENCY_DATA),
        switchMap(action =>
            this.store.select(getLedgerCardMatterDataByToken(action.token)).pipe(
                map(matter => ({ matter, token: action.token })),
                take(1),
                switchMap(info => {
                    return this.service.getCurrencyData(info.matter.matterReferenceNo).pipe(
                        map(cureencyData =>
                            new Core.LoadCurrencySuccess(action.token, { currencyView: cureencyData })),
                        catchError(error => of(new Core.LoadCurrencyFail(action.token, error))));

                }))));

    @Effect()
    GetAllMatterCount$ = this.actions$.pipe(ofType<Core.LoadAllMatterCount>(Core.LOAD_ALL_MATTER_COUNT),
        switchMap(action =>
            this.store.select(getLedgerCardMatterDataByToken(action.token)).pipe(
                map(matter => ({ matter, token: action.token })),
                take(1),
                switchMap(info => {
                    return this.service.getAllMatterData(info.matter.clientRef).pipe(
                        map((response) =>
                            new Core.LoadAllMatterCountSuccess(action.token, { allMatterCount: response })),
                        catchError(error => of(new Core.LoadAllMatterCountFail(action.token, error))));

                }))));

    @Effect()
    LoadClient1GridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestClient1Grid>(Core.REQUEST_CLIENT1_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgeClient1GridDataByToken(action.token)),
                this.store.select(getLedgeCardCurrencyViewByToken(action.token)),
                ((matterData, client1Grid, currencyView) => ({ matterData, client1Grid, currencyView, token: action.token }))
            ).pipe(take(1),
                map(info =>
                    new ClientGridRequest(
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.client1Grid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.client1Grid.gridColumns),
                            skip: getPaginatorSkip(info.client1Grid.PaginatorDef),
                            sort: toODataSort(info.client1Grid.gridColumns)
                        },
                        info.currencyView[0] ? info.currencyView[0].currencyCode : '',
                        'info.hash')
                ), switchMap<any, any>(request => {
                    if (request.currencyCode) {
                        return of(new Core.LoadClient1Grid(action.token, request));
                    } else {
                        return of(new Core.AllDataUpdate(action.token));
                    }
                }))
        ));

    @Effect()
    LoadClient1GridGridData$ = this.actions$.pipe(ofType<Core.LoadClient1Grid>(Core.LOAD_CLIENT1_GRID_DATA),
        switchMap(action => {
            return this.service.getClientGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadClient1GridSuccess(action.token, { client1GridPageData: response })),
                catchError(error => of(new Core.LoadClient1GridFail(action.token, error))));

        }));

    @Effect()
    ChangeClient1GridView$ = this.actions$.pipe(ofType<Core.Client1GridViewChange>(Core.CLIENT1_GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.RequestClient1Grid(action.token)]);
        }));






    @Effect()
    LoadClient2GridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestClient2Grid>(Core.REQUEST_CLIENT2_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgeClient2GridDataByToken(action.token)),
                this.store.select(getLedgeCardCurrencyViewByToken(action.token)),
                ((matterData, client2Grid, currencyView) => ({ matterData, client2Grid, currencyView, token: action.token }))
            ).pipe(take(1),
                map((info) =>
                    new ClientGridRequest(
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.client2Grid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.client2Grid.gridColumns),
                            skip: getPaginatorSkip(info.client2Grid.PaginatorDef),
                            sort: toODataSort(info.client2Grid.gridColumns)
                        },
                        info.currencyView[1] ? info.currencyView[1].currencyCode : '',
                        'info.hash')
                ), switchMap<any, any>(request => {
                    if (request.currencyCode) {
                        return of(new Core.LoadClient2Grid(action.token, request));
                    } else {
                        return of(new Core.AllDataUpdate(action.token));
                    }
                }))
        ));

    @Effect()
    LoadClient2GridGridData$ = this.actions$.pipe(ofType<Core.LoadClient2Grid>(Core.LOAD_CLIENT2_GRID_DATA),
        switchMap(action => {
            return this.service.getClientGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadClient2GridSuccess(action.token, { client2GridPageData: response })),
                catchError(error => of(new Core.LoadClient2GridFail(action.token, error))));

        }));

    @Effect()
    ChangeClient2GridView$ = this.actions$.pipe(ofType<Core.Client1GridViewChange>(Core.CLIENT2_GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.RequestClient2Grid(action.token)]);
        }));

    @Effect()
    LoadClient3GridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.RequestClient3Grid>(Core.REQUEST_CLIENT3_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getLedgerCardMatterDataByToken(action.token)),
                this.store.select(getLedgeClient3GridDataByToken(action.token)),
                this.store.select(getLedgeCardCurrencyViewByToken(action.token)),
                ((matterData, client3Grid, currencyView) => ({ matterData, client3Grid, currencyView, token: action.token }))
            ).pipe(take(1),
                map((info) =>
                    new ClientGridRequest(
                        info.matterData ? info.matterData.matterReferenceNo : '',
                        {
                            take: info.client3Grid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.client3Grid.gridColumns),
                            skip: getPaginatorSkip(info.client3Grid.PaginatorDef),
                            sort: toODataSort(info.client3Grid.gridColumns)
                        },
                        info.currencyView[2] ? info.currencyView[2].currencyCode : '',
                        'info.hash')
                ), switchMap<any, any>(request => {
                    if (request.currencyCode) {
                        return of(new Core.LoadClient3Grid(action.token, request));
                    } else {
                        return of(new Core.AllDataUpdate(action.token));
                    }
                }))
        ));

    @Effect()
    LoadClient3GridGridData$ = this.actions$.pipe(ofType<Core.LoadClient3Grid>(Core.LOAD_CLIENT3_GRID_DATA),
        switchMap(action => {
            return this.service.getClientGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadClient3GridSuccess(action.token, { client3GridPageData: response })),
                catchError(error => of(new Core.LoadClient3GridFail(action.token, error))));

        }));

    @Effect()
    ChangeClient3GridView$ = this.actions$.pipe(ofType<Core.Client3GridViewChange>(Core.CLIENT3_GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.RequestClient3Grid(action.token)]);
        }));

    @Effect()
    GridRefresh$ = this.actions$.pipe(ofType<Core.GridRefresh>(Core.GRID_REFRESH),
        switchMap(action =>
            this.store.select(getLedgerCardMatterDataByToken(action.token)).pipe(
                map((matterData) => ({ matterData, token: action.token })),
                take(1))
        ),
        mergeMap<any, any>((info) => {
            if (info.matterData && info.matterData.app_Code) {
                return from([new Core.RequestAllGrid(info.token),
                new Core.RequestBillGrid(info.token),
                new Core.RequestDisbsGrid(info.token),
                new Core.RequestGbpGrid(info.token),
                new Core.RequestDdaGrid(info.token),
                new Core.LoadEchitGrid(info.token, { matterRef: info.matterData.matterReferenceNo })

                ]);
            } else {
                return of(new Core.AllDataUpdate(info.token));
            }
        }));



    @Effect()
    PrintLedgerCard$ = this.actions$.pipe(ofType<Core.PrintLedgerCard>(Core.PRINT_LEDGER_CARD),
        switchMap(action => {
            return this.fileUrlResolverService.getLedgerCardPrintReportUrl(action.payload.matterData,
                action.payload.allGridFilterData).pipe(
                    map((data) => {

                        console.log(data);
                        const spec = {
                            ...centerToWindow(800, 600),
                            toolbar: false,
                            location: false,
                            directories: false,
                            status: false,
                            menubar: false,
                            scrollbars: false,
                        };
                        this.windowPopupsManagerService.openWindow(uuid(), data, spec, 'pdf');

                        return new Core.PrintLedgerCardSuccess(action.token, { url: data });
                    }),
                    catchError(error => of(new Core.PrintLedgerCardFail(action.token, error))));
        }));

    @Effect()
    LoadEChitGridData$ = this.actions$.pipe(ofType<Core.LoadEchitGrid>(Core.LOAD_ECHIT_GRID_DATA),
        switchMap(action => {
            return this.service.getEchitGridData(action.payload.matterRef).pipe(
                map((response) =>
                    new Core.LoadEchitGridSuccess(action.token, { eChitGrid: response })),
                catchError(error => of(new Core.LoadEchitGridFail(action.token))));
        }));

}




