
import { filter, catchError, tap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import {
    getTimeByToken, getTimeHashByToken, getTimeGridDataByToken,
    getIsDataLoadedByToken
} from '../reducers';
import { TimeRequest } from '../models/time-core-request';
import { combineLatest, of, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import * as TimeCore from '../actions/core';
import { TimeService } from '../services/time-core.service';
import { Time } from '../models/interface';
import { INIT_TIME_CORE, InitTime } from '../actions/core';




@Injectable()
export class TimeEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: TimeService) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<TimeCore.InitTime>(TimeCore.INIT_TIME_CORE),
        tap((data) => console.log('$initNewView', data)),
        map((action) => new TimeCore.LoadTimeDataWithCurrentState(action.token)));


    @Effect()
    TimeViewChange$ = this.actions$.pipe(ofType<TimeCore.TimeViewChange>(TimeCore.TIME_CORE_CHANGE),
        map((action) => new TimeCore.LoadTimeDataWithCurrentState(action.token)));


    @Effect()
    loadCurrentStateData$ = this.actions$.pipe(ofType<TimeCore.LoadTimeDataWithCurrentState>
        (TimeCore.LOAD_TIME_CORE_DATA_WITH_CURRENT_STATE),
            switchMap<TimeCore.LoadTimeDataWithCurrentState, { hasHash: boolean, token: string }>((action) =>
                this.store.select(getIsDataLoadedByToken(action.token)).pipe(
                    map(hasHash => ({ token: action.token, hasHash: hasHash })), take(1))
            ),
            filter((info) => !info.hasHash)).pipe(
                tap((data) => {
                    console.log('Effect excute', TimeCore.LOAD_TIME_CORE_GRID_DATA, ' ', data);
                }),
                mergeMap((action) =>
                    combineLatest(this.store.select(getTimeByToken(action.token)),
                        this.store.select(getTimeHashByToken(action.token)),
                        (state, hash) => ({ state, hash })).pipe(
                            map((info) =>
                                new TimeRequest({
                                    MatterReferenceNo: info.state ? info.state.matterInfo.MatterReferenceNo : '',
                                }, {
                                        Take: 0,
                                        Filter: null,
                                        Skip: 0,
                                    },
                                    info.hash)
                            ),
                            take(1),
                            map((request) => new TimeCore.LoadTimeGridData(action.token, request)), ),
                ), );

    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<TimeCore.LoadTimeGridData>(TimeCore.LOAD_TIME_CORE_GRID_DATA),
            switchMap((action) =>
                this.service.getTime(action.request).pipe(
                    // tslint:disable-next-line:max-line-length
                    map((result) => new TimeCore
                        .LoadTimeGridDataSuccess(action.token, { response: result, request: action.request })),
                    catchError((error) => of(new TimeCore.LoadTimeGridDataFail(action.token, error))))
            ));


}






