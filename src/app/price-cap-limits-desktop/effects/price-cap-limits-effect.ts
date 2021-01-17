import { InfoDialogType } from './../../core/utility/DpsUtility';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Core from '../../price-cap-limits-core/actions/core';
import { switchMap, take, filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material';
import {
    getCrimeClassIdentityViewModel, getTimeLimitUserInput,
    getCrimeLimitHistory, getUserForAddLimit
} from '../../price-cap-limits-core/reducers';
import { ValidateAddTimeToHistory } from '../../price-cap-limits-core/validation/validateAddTimeToHistory';
import { showInforDialog } from '../../core/utility/DpsUtility';

@Injectable()
export class PriceCapLimitsEffect {
    constructor(private actions$: Actions, private store: Store<any>, private dialog: MatDialog) {
    }

    @Effect({ dispatch: false })
    requestAddLimitToHistory$ = this.actions$.pipe(ofType<Core.RequestAddToLimit>(Core.REQUEST_ADD_LIMIT_TO_HISTORY),
        switchMap(action =>
            combineLatest(
                this.store.select(getCrimeClassIdentityViewModel(action.token)),
                this.store.select(getTimeLimitUserInput(action.token)),
                this.store.select(getCrimeLimitHistory(action.token)),
                this.store.select(getUserForAddLimit(action.token)),
                ((identifyModel, userInput, history, user) =>
                    ({ identifyModel, userInput, token: action.token, limitHistory: history, user }))
            ).pipe(take(1))),
        map(info => {
            const validate = new ValidateAddTimeToHistory(info.userInput, info.identifyModel, info.limitHistory).validateAddTime();
            if (!validate.valid && !!validate.msg) {
                showInforDialog('DPS Crime Module', validate.msg, InfoDialogType.warning, this.dialog);
            }
        })
    );

}

