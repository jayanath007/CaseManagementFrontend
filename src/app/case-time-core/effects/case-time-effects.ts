
import { catchError, filter, map, tap, take, switchMap, mergeMap } from 'rxjs/operators';
import {
    getCaseTimeByToken, getCaseTimeHashByToken, getCaseTimeGridDataByToken,
    getIsDataLoadedByToken
} from '../reducers';
import { CaseTimeRequest, CaseTimeDeleteRequest } from '../models/case-time-request';
import { combineLatest, of, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as CaseTimeCore from '../actions/core';
import { CaseTimeService } from '../services/case-time.service';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { LocalStorageKey } from './../../core/lib/local-storage';
import { OpenCaseMenueData } from './../../core/lib/open-case';
import { MainMenuItem } from './../../layout-desktop/models/interfaces';
import { TimesFinancialFigures } from './../../open-case-core/actions/core';
import { TimesFinancialFiguresRequest } from './../../open-case-core/models/requests';


@Injectable()
export class CaseTimeEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: CaseTimeService) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<CaseTimeCore.InitCaseTime>(CaseTimeCore.INIT_CASE_TIME),
        // .do((data) => console.log('$initNewView', data))
        map((action) => new CaseTimeCore.LoadCaseTimeDataWithCurrentState(action.token)));


    @Effect()
    fileHistoryViewChange$ = this.actions$.pipe(ofType<CaseTimeCore.CaseTimeViewChange>(CaseTimeCore.CASE_TIME_CHANGE),
        map((action) => new CaseTimeCore.LoadCaseTimeDataWithCurrentState(action.token)));

    @Effect()
    caseContactRefresh$ = this.actions$.pipe(ofType<CaseTimeCore.CaseTimeRefresh>(CaseTimeCore.CASE_TIME_REFRESH),
        switchMap((action) =>
            combineLatest(this.store.select(getCaseTimeByToken(action.token)),
                this.store.select(getCaseTimeHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) =>
                        new CaseTimeRequest({
                            SearchText: info.state ? info.state.searchText : '',
                            matterRef: info.state ? info.state.matterInfo.MatterReferenceNo : null,
                        }, {
                                take: info.state.pageEvent.pageSize,
                                filter: toODataFilter(info.state.columnDef),
                                skip: getPaginatorSkip({
                                    total: info.state.pageEvent.length,
                                    currentPage: info.state.pageEvent.pageIndex,
                                    itemPerPage: info.state.pageEvent.pageSize
                                }),
                                sort: toODataSort(info.state.columnDef)
                            }, info.hash)
                    ),
                    take(1),
                    map((request) => new CaseTimeCore.LoadCaseTimeGridData(action.token, request)))));


    @Effect()
    loadCurrentStateData$ = this.actions$.pipe(ofType<CaseTimeCore.LoadCaseTimeDataWithCurrentState>
        (CaseTimeCore.LOAD_CASE_TIME_DATA_WITH_CURRENT_STATE),
        switchMap<CaseTimeCore.LoadCaseTimeDataWithCurrentState, { hasHash: boolean, token: string }>((action) =>
            this.store.select(getIsDataLoadedByToken(action.token)).pipe(
                map(hasHash => ({ token: action.token, hasHash: hasHash })), take(1),
                tap((data) => {
                    console.log('hasHash', data);
                }))
        ),
        filter((info) => !info.hasHash),
        switchMap((action) =>
            combineLatest(this.store.select(getCaseTimeByToken(action.token)),
                this.store.select(getCaseTimeHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) =>
                        new CaseTimeRequest({
                            SearchText: info.state ? info.state.searchText : '',
                            matterRef: info.state ? info.state.matterInfo.MatterReferenceNo : null,
                        }, {
                                take: info.state.pageEvent.pageSize,
                                filter: toODataFilter(info.state.columnDef),
                                skip: getPaginatorSkip({
                                    total: info.state.pageEvent.length,
                                    currentPage: info.state.pageEvent.pageIndex,
                                    itemPerPage: info.state.pageEvent.pageSize
                                }),
                                sort: toODataSort(info.state.columnDef)
                            }, info.hash)
                    ),
                    take(1),
                    map((request) => new CaseTimeCore.LoadCaseTimeGridData(action.token, request))),
        ));

    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<CaseTimeCore.LoadCaseTimeGridData>
        (CaseTimeCore.LOAD_CASE_TIME_GRID_DATA),
        switchMap((action) =>
            this.service.getCaseTimeData(action.request).pipe(
                map((result) => new CaseTimeCore
                    .LoadCaseTimeGridDataSuccess(action.token, { response: result, request: action.request })),
                catchError((error) => of(new CaseTimeCore.LoadCaseTimeGridDataFail(action.token, error))))
        ));


    @Effect()
    deleteTimeReord$ = this.actions$.pipe(ofType<CaseTimeCore.DeleteTime>(CaseTimeCore.DELETE_TIME),
        map(action => ({
            request: new CaseTimeDeleteRequest(
                [action.payload.CaseTime.data.timeUniqueRef],
                action.payload.matterRef
            ),
            token: action.token
        })), switchMap(info =>
            this.service.getCaseTimeDelete(info.request).pipe(
                map((result) => new CaseTimeCore.DeleteTimeSuccess(info.token)),
                catchError((error) => of(new CaseTimeCore.DeleteTimeFail(info.token))))
        ));

    @Effect()
    deleteTimeReordSuccess$ = this.actions$.pipe(ofType<CaseTimeCore.DeleteTimeSuccess>(CaseTimeCore.DELETE_TIME_SUCCESS),
        mergeMap(action => {

            const openCases: MainMenuItem<OpenCaseMenueData>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.OpenCaseMenuItems));
            const selectOpenCase = openCases.find(c => c.isSelected);
            const request: TimesFinancialFiguresRequest = {
                matterReferenceNo: selectOpenCase.data.matterReferenceNo,
            };
            return from([new CaseTimeCore.CaseTimeRefresh(action.token),
            new TimesFinancialFigures(selectOpenCase.token, request)]);
        }));



}






