import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, take, switchMap, catchError, filter, mergeMap } from 'rxjs/operators';
import { combineLatest, of, from } from 'rxjs';
import * as Core from '../actions/core';
import { getCrimeClassIdentityViewModel, getTimeLimitUserInput, getCrimeLimitHistory, getUserForAddLimit } from '../reducers';
import { PriceCapLimitService } from '../services/price-cap-limits-services';
import { UserInputDataEnum } from './../models/enum';
import { ValidateAddTimeToHistory } from '../validation/validateAddTimeToHistory';
import { CrimeLimitHistoryViewModel } from '../models/request';
import { UserInputData } from './../models/interfaces';

@Injectable()
export class PriceCapLimitsEffect {
    constructor(private actions$: Actions, private store: Store<any>, private services: PriceCapLimitService) {
    }

    @Effect()
    init$ = this.actions$.pipe(ofType<Core.InitPriceCapLimit>(Core.INIT_PRICE_CAP),
        map(action => new Core.GetTimeCurrentLimit(action.token)));

    @Effect()
    getPriceCapLimit$ = this.actions$.pipe(ofType<Core.GetTimeCurrentLimit>(Core.GET_TIME_CURRENT_LIMITS),
        switchMap((action) =>
            this.store.select(getCrimeClassIdentityViewModel(action.token)).pipe(
                map((identifyModel) =>
                    ({ identifyModel, action: action.token })), take(1))),
        switchMap(info => this.services.getTimeCurrentLimits(info.identifyModel).pipe(
            map(results => new Core.GetTimeCurrentLimitSuccess(info.action, results)),
            catchError(() => of(new Core.GetTimeCurrentLimitFail(info.action)))
        )));

    @Effect()
    successCurrentlimitLoad$ = this.actions$.pipe(ofType<Core.GetTimeCurrentLimitSuccess>(Core.GET_TIME_CURRENT_LIMITS_SUCCESS),
        map(action => new Core.GetLimitHistoryDetails(action.token)));

    @Effect()
    loadHistory$ = this.actions$.pipe(ofType<Core.GetLimitHistoryDetails>(Core.GET_LIMIT_HISTORY_DETAILS),
        switchMap(action =>
            combineLatest(
                this.store.select(getCrimeClassIdentityViewModel(action.token)),
                this.store.select(getTimeLimitUserInput(action.token)),
                ((identifyModel, userInput) => ({ identifyModel, userInput, token: action.token }))
            ).pipe(take(1))),
        filter(info => info.userInput && info.userInput[UserInputDataEnum.limitedType] > 0),
        switchMap((info) =>
            this.services.getLimitHistoryDetails(info.identifyModel, info.userInput[UserInputDataEnum.limitedType])
                .pipe(map(result => new Core.GetLimitHistoryDetailsSuccess(info.token, result)),
                    catchError(() => of(new Core.GetLimitHistoryDetailsFail(info.token)))
                )
        ));

    @Effect()
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
        filter(info => {
            const validate = new ValidateAddTimeToHistory(info.userInput, info.identifyModel, info.limitHistory).validateAddTime();
            return validate.valid;
        }),
        map(info => new Core.AddToLimit(info.token, { identifyModel: info.identifyModel, userInput: info.userInput, user: info.user }))
    );

    @Effect()
    saveNewLimit$ = this.actions$.pipe(ofType<Core.AddToLimit>(Core.ADD_LIMIT_TO_HISTORY),
        switchMap((action) =>
            this.services.saveExceedLimit(new CrimeLimitHistoryViewModel(action.payload.identifyModel,
                action.payload.userInput, action.payload.user))
                .pipe(map(result => new Core.AddToLimitSuccess(action.token)),
                    catchError(() => of(new Core.AddToLimitFail(action.token)))
                )
        )
    );

    @Effect()
    addLimitSuccess$ = this.actions$.pipe(ofType<Core.AddToLimitSuccess>(Core.ADD_LIMIT_TO_HISTORY_SUCCESS),
        map(action => new Core.GetTimeCurrentLimit(action.token)));

    @Effect()
    deleteHistoryItem$ = this.actions$.pipe(ofType<Core.DeleteHistoryItem>(Core.DELETE_HISTORY_ITEM),
        switchMap(action =>
            this.store.select(getCrimeClassIdentityViewModel(action.token)).pipe(
                map(model => ({ model, action })), take(1))),
        switchMap(info => {
            const userInput: UserInputData = {
                [UserInputDataEnum.postingData]: info.action.item.postedDate,
                [UserInputDataEnum.newLimit]: info.action.item.limitValue,
                [UserInputDataEnum.grantedDate]: info.action.item.generatedDate,
                [UserInputDataEnum.limitedType]: info.action.item.limitType
            };
            return this.services.deleteLimitHistory(new CrimeLimitHistoryViewModel(info.model, userInput, info.action.item.user))
                .pipe(map(result => new Core.DeleteHistoryItemSucess(info.action.token)),
                    catchError(() => of(new Core.DeleteHistoryItemFail(info.action.token)))
                );
        })
    );

    @Effect()
    deleteHistoryItemSucess$ = this.actions$.pipe(ofType<Core.DeleteHistoryItemSucess>(Core.DELETE_HISTORY_ITEM_SUCCESS),
        map(action => new Core.GetTimeCurrentLimit(action.token)));

    @Effect()
    getHistory$ = this.actions$.pipe(ofType<Core.ChangeUserInput>(Core.CHANGE_USER_INPUT),
        filter(action => action.payload.key === UserInputDataEnum.limitedType),
        map(action => new Core.GetLimitHistoryDetails(action.token)));


}


