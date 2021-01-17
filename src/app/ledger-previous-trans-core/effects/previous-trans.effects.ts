import { getPreviousTransGridDataByToken, getPreviousTransMatterDataByToken, getGridFilterDataByToken } from './../reducers/index';
import { PreviousTransactionsService } from '../services/previous-trans-service';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, combineLatest, from } from 'rxjs';
import * as PreviousTrans from '../actions/core';
import { uuid } from '../../utils/uuid';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AllGridRequest } from '../models/request';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { centerToWindow } from '../../utils/bounds';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';

@Injectable()
export class PreviousTransactionsEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: PreviousTransactionsService,
        private fileUrlResolverService: FileUrlResolverService,
        private windowPopupsManagerService: WindowPopupsManagerService) {
    }
    @Effect()
    initDatat$ = this.actions$.pipe(ofType<PreviousTrans.InitPreviousTransaction>(PreviousTrans.INIT_PREVIOUS_TRANSACTION),
        switchMap((action: PreviousTrans.InitPreviousTransaction) => {
            return of(new PreviousTrans.RequestGridData(action.token));
        }));
    @Effect()
    changeGridFilter$ = this.actions$.pipe(ofType<PreviousTrans.
        ChangeGridFilterType>(PreviousTrans.GET_PREVIOUS_TRANSACTION_GRID_FILTER_TYPE),
        switchMap((action: PreviousTrans.ChangeGridFilterType) => {
            return of(new PreviousTrans.RequestGridData(action.token));
        }));
    @Effect()
    changePaginator$ = this.actions$.pipe(ofType<PreviousTrans.
        ChangePaginator>(PreviousTrans.GET_PREVIOUS_TRANSACTION_GRID_CHANGE_PAGE),
        switchMap((action: PreviousTrans.ChangePaginator) => {
            return of(new PreviousTrans.RequestGridData(action.token));
        }));
    @Effect()
    applyGridFilter$ = this.actions$.pipe(ofType<PreviousTrans.ApplyColumFilter>(PreviousTrans.APPLY_COLUM_FILTER),
        map(action => new PreviousTrans.RequestGridData(action.token)));

    @Effect()
    applyGridShort$ = this.actions$.pipe(ofType<PreviousTrans.ApplyColumSort>(PreviousTrans.APPLY_COLUM_SORTING),
        map(action => new PreviousTrans.RequestGridData(action.token)));

    @Effect()
    loadAllGridData$ = this.actions$.pipe(ofType<PreviousTrans.RequestGridData>(PreviousTrans.REQUEST_PREVIOUS_TRANSACTION_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getGridFilterDataByToken(action.token)),
                this.store.select(getPreviousTransMatterDataByToken(action.token)),
                this.store.select(getPreviousTransGridDataByToken(action.token)),
                ((filterData, matterData, allGrid) => ({ filterData, matterData, allGrid, token: action.token }))
            ).pipe(take(1),
                map((info) =>
                    new AllGridRequest({
                        showAll: info.filterData.showAll,
                        showOffice: info.filterData.showOffice,
                        showClient: info.filterData.showClient,
                    },
                        info.matterData.matterReferenceNo,
                        {
                            take: info.allGrid.PaginatorDef.itemPerPage,
                            filter: toODataFilter(info.allGrid.gridColumns),
                            skip: getPaginatorSkip(info.allGrid.PaginatorDef),
                            sort: toODataSort(info.allGrid.gridColumns)
                        }, 'info.hash')
                ), map((request) => new PreviousTrans.GetPreviousTransGridData(action.token, request)))
        ));
    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<PreviousTrans.GetPreviousTransGridData>(PreviousTrans.GET_PREVIOUS_TRANSACTION_GRID_DATA),
        switchMap(action => {
            return this.service.getPreviousTransGridData(action.request).pipe(
                map((response: any) =>
                    new PreviousTrans.GetPreviousTransGridDataSuccess(action.token, { allGridPageData: response })),
                catchError(error => of(new PreviousTrans.GetPreviousTransGridDataFail(action.token, error))));
        }));

    @Effect()
    printReport$ = this.actions$.pipe(ofType<PreviousTrans.PrintPreviousTrans>(PreviousTrans.PRINT_PREVIOUS_TRANSACTION),
        switchMap(action =>
            this.store.select(getPreviousTransMatterDataByToken(action.token)).pipe(
                map((matterData) => ({ matterData, token: action.token })),
                take(1))),
        switchMap(action => {
            return this.fileUrlResolverService.getPreviousTransPrintReportUrl(action.matterData).pipe(
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

                    return new PreviousTrans.PrintPreviousTransSuccess(action.token, { url: data });
                }),
                catchError(error => of(new PreviousTrans.PrintPreviousTransFail(action.token, error))));
        }));

}
