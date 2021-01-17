
import { catchError, take, map, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatterViewByClientServices } from '../services/matter-view-by-client-services';
import * as Core from '../actions/core';
import { GridRequest } from '../models/requests';
import { getMatterViewPeginatorDefByToken, getMatterViewColumnDefByToken, getMatterViewClientRef } from '../reducers';
import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';


@Injectable()
export class MatterViewByClientEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: MatterViewByClientServices
    ) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<Core.InitMatterView>(Core.INIT_MATTER_VIEW),
        map(action => {
            return new Core.GridDataRequest(action.token);
        }));

    @Effect()
    RequestGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.GridDataRequest>(Core.REQUEST_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getMatterViewColumnDefByToken(action.token)),
                this.store.select(getMatterViewPeginatorDefByToken(action.token)),
                this.store.select(getMatterViewClientRef(action.token)),
                ((gridColumn, gridPage, clientRef) => ({ gridColumn, gridPage, clientRef, action: action }))
            ).pipe(take(1),
                map((info) =>
                    new GridRequest(
                        info.clientRef,
                        {
                            take: info.gridPage.itemPerPage,
                            filter: toODataFilter(info.gridColumn),
                            skip: getPaginatorSkip(info.gridPage),
                            sort: toODataSort(info.gridColumn)
                        }
                    )
                ), map((request) => new Core.LoadGrid(action.token, request)))
        ));

    @Effect()
    LoadAllGridData$ = this.actions$.pipe(ofType<Core.LoadGrid>(Core.LOAD_GRID_DATA),
        switchMap(action => {
            if (action.token !== 'E-Chit-Matter-Search') {
                return this.service.getGridData(action.request).pipe(
                    map((response) =>
                        new Core.LoadGridSuccess(action.token, { pageData: response })),
                    catchError(error => of(new Core.LoadGridFail(action.token, error))));
            }
            return this.service.getEChitMatterGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadGridSuccess(action.token, { pageData: response })),
                catchError(error => of(new Core.LoadGridFail(action.token, error))));

        }));

    @Effect()
    GridViewChange$ = this.actions$.pipe(ofType<Core.GridViewChange>(Core.GRID_VIEW_CHANGE),
        map(action => {
            return new Core.GridDataRequest(action.token);
        }));
}
