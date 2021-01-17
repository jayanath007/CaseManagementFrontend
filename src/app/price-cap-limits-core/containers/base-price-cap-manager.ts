import { Store } from '@ngrx/store';
import { ComponentBase } from '../../core';
import { InitPriceCapLimit, ClearStore, ChangeUserInput, RequestAddToLimit, DeleteHistoryItem } from '../actions/core';
import { isPriceCapDataLoading, getTimecurrentLimited, getTimeLimitUserInput, getCrimeLimitHistory } from '../reducers';
import { PriceCapLimitInput } from './../../core/lib/priceCapLimit';
import { UserInputDataEnum } from '../models/enum';
import { LimitHistory } from './../models/interfaces';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { take } from 'rxjs/operators';

export class BasePriceCapManager extends ComponentBase {
    public isLoading$: any;
    public currentLimit$: any;
    public userInput$: any;
    public hitory$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>) {
        super();
    }

    protected initSelectors(token: string, input: PriceCapLimitInput) {
        this.user$ = this.store.select(getUser);
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitPriceCapLimit(token, input, user.general.dateTimeOffset));
        }).unsubscribe();
        this.isLoading$ = this.store.select(isPriceCapDataLoading(token));
        this.currentLimit$ = this.store.select(getTimecurrentLimited(token));
        this.userInput$ = this.store.select(getTimeLimitUserInput(token));
        this.hitory$ = this.store.select(getCrimeLimitHistory(token));
    }

    clearStore(token: string) {
        this.store.dispatch(new ClearStore(token));
    }

    changeUserInput(token: string, userInput: { key: UserInputDataEnum, value: any }) {
        this.store.dispatch(new ChangeUserInput(token, userInput));
    }

    onAddToLimitHistory(token: string) {
        this.store.dispatch(new RequestAddToLimit(token));
    }

    onDeleteHistoryRow(token: string, row: LimitHistory) {
        this.store.dispatch(new DeleteHistoryItem(token, row));
    }

}
