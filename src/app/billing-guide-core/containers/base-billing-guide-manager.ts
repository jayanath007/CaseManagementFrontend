import { getUser, User } from './../../auth';
import { getBilledValueDataByToken, getBillingViewModaleDataByToken, getBillingbillingGuideNoFileByToken } from '../reducers';

import { BillingGuideSubmit, BillingGuideAnalysisChange, BillingGuideAnalysisCloseSave } from '../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitBillingGuide } from '..';
import { BillingGuidePopupData } from '../models/interfaces';
import { Observable } from 'rxjs';
import { getMenuItemDisplayName } from './../../layout-desktop/reducers/index';

export class BaseBillingGuideManager {
    @Output() closePopup = new EventEmitter<any>();

    public myToken: string;
    public inputValue: any;
    public isLoading$: any;
    public billedValueData$: any;
    public billingGuideData$: any;
    public billingGuideNoFile$: any;
    public matterDisplyName$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, inputValue: BillingGuidePopupData) {

        this.myToken = myToken;
        this.inputValue = inputValue;
        this.billedValueData$ = this.store.select(getBilledValueDataByToken(myToken));
        this.billingGuideData$ = this.store.select(getBillingViewModaleDataByToken(myToken));
        this.billingGuideNoFile$ = this.store.select(getBillingbillingGuideNoFileByToken(myToken));
        this.user$ = this.store.select(getUser);
        this.matterDisplyName$ = this.store.select(getMenuItemDisplayName('matter_search'));
        this.store.dispatch(new InitBillingGuide(myToken,
            {
                inputValue: inputValue
            }));
        //  this.searchModel$ = this.store.select(getEChitModelToken(myToken));
        //  this.initDataModel$ = this.store.select(getBillingGuideByToken(myToken));
    }


    onSearch(event) {
        //  this.store.dispatch(new EChitSearchClient(this.myToken, { searchModel: event }));
    }

    onSaveFile() {


        this.store.dispatch(new BillingGuideAnalysisCloseSave(this.myToken, { data: null }));
    }
    onSave(event) {

        this.store.dispatch(new BillingGuideSubmit(this.myToken, { inputData: event }));

    }
    onAnalysisTypeChange(event) {

        this.store.dispatch(new BillingGuideAnalysisChange(this.myToken, { selectedType: event.value }));
    }

    close() {

        this.closePopup.emit();
    }
}
