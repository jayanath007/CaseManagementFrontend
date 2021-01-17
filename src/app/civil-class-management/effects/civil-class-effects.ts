import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import * as Action from '../actions/core';
import * as selector from '../reducers';
import { CivilManagementService } from '../services/civil-management.service';

@Injectable()
export class CivilClassEffects {
    constructor(protected store: Store<any>,
        private actions$: Actions,
        private service: CivilManagementService
    ) { }

    @Effect()
    GetClassType$ = this.actions$.pipe(ofType<Action.InitCivilManagement>(Action.INIT_MODULE),
        map(action =>
            new Action.GetClassList(action.token)
        ));


    @Effect()
    GetClassList$ = this.actions$.pipe(ofType<Action.GetClassList>(Action.GET_CLASS_LIST),
        switchMap(action => this.store.select(selector.getInputData(action.token)).pipe(
            take(1),
            map(input => ({ input: input, action: action }))
        )),
        switchMap(info => this.service.getClassList(info.input).pipe(
            map(responce => new Action.GetClassListSuccess(info.action.token, { list: responce })),
            catchError(() => of(new Action.GetClassListFail(info.action.token))
            ))));


}
