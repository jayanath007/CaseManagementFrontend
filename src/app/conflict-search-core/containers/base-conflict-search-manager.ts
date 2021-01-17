import { OpportunityConflictSearchSave } from './../actions/core';
import {
    ConflictSearchSelectItem, ConflictSearchSearchClient,
    ConflictSearchSave, ConflictSearchGridPageEventChange,
    ClientMatterGridPageEventChange,
    ConflictSearchClientDetails,
    ConflictSearchClosed,
    OpportunityConflictSearch,
    OpportunityComanyListUpdate
} from '../actions/core';

import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitConflictSearch } from '..';
import {
    getConflictSearchModelToken, getClientMatterListToken, getConflictSearchListToken,
    getSearchStateToken, getClientToken, getClientMatterPageInforToken, getConflictSearchPageInforToken,
    getConflictLoadingDataToken, getClientMatterLoadingToken, getIsExitToken, getConflictCheckTypeToken,
    getCommonParaDataByToken, getCompanyListByToken
} from '../reducers';
import { ConflictSearchDetailRequest, Client, ConflictSearchGridRowItemWrapper, ConflictSearchPopupInput } from '../models/interfaces';
import { getConflictSearchSaveTypeToken } from '../reducers/conflict-search';




export class BaseConflictSearchManager {
    @Output() closePopup = new EventEmitter<any>();

    public myToken: string;
    public inputData: any;
    public isLoading$: any;
    public searchModel$: any;
    public clientMatterList$: any;
    public conflictSearchList$: any;
    public client$: any;
    public searchState$: any;
    public clientMatterPageEvent$: any;
    public conflictSearchPageEvent$: any;
    public isConfilictSearchSave$: any;
    public saveType$: any;
    public loadingData$: any;
    public clientMatterLoading$: any;
    public isExit$: any;
    public conflictCheckType$: any;
    public popupCommonPara$: any;
    public companyList$: any;
    // public clientDtoData$: any;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, inputData: ConflictSearchPopupInput) {
        this.myToken = myToken;
        this.inputData = inputData;
        this.store.dispatch(new InitConflictSearch(myToken,
            {
                inputData: inputData
            }));
        this.searchModel$ = this.store.select(getConflictSearchModelToken(myToken));
        this.clientMatterList$ = this.store.select(getClientMatterListToken(myToken));
        this.conflictSearchList$ = this.store.select(getConflictSearchListToken(myToken));
        this.client$ = this.store.select(getClientToken(myToken));
        this.searchState$ = this.store.select(getSearchStateToken(myToken));
        this.clientMatterPageEvent$ = this.store.select(getClientMatterPageInforToken(myToken));
        this.conflictSearchPageEvent$ = this.store.select(getConflictSearchPageInforToken(myToken));
        this.saveType$ = this.store.select(getConflictSearchSaveTypeToken(myToken));
        this.loadingData$ = this.store.select(getConflictLoadingDataToken(myToken));
        this.clientMatterLoading$ = this.store.select(getClientMatterLoadingToken(myToken));
        this.isExit$ = this.store.select(getIsExitToken(myToken));
        this.conflictCheckType$ = this.store.select(getConflictCheckTypeToken(myToken));
        this.popupCommonPara$ = this.store.select(getCommonParaDataByToken(myToken));
        this.companyList$ = this.store.select(getCompanyListByToken(myToken));
        // this.clientDtoData$ = this.store.select(getClientDtoByToken(myToken));
    }
    onUpateSelectedDetails(details) {

    }
    onSearch(event) {
        this.store.dispatch(new ConflictSearchSearchClient(this.myToken, { searchModel: event }));
    }
    onClear(event) {
        this.store.dispatch(new InitConflictSearch(this.myToken, { inputData: this.inputData }));
    }
    onSave(event) {
        this.store.dispatch(new ConflictSearchSave(this.myToken, { type: event }));
    }
    onRowClick(event: ConflictSearchGridRowItemWrapper) {

        this.store.dispatch(new ConflictSearchSelectItem(this.myToken, { item: event }));
        const request = new ConflictSearchDetailRequest(event.data.ref);
        this.store.dispatch(new ConflictSearchClientDetails(this.myToken, { request: request }));
    }
    onConflictSearchPageChange(event) {
        this.store.dispatch(new ConflictSearchGridPageEventChange(this.myToken, { pageEvent: event }));
    }
    onClientMatterGridPageChange(event) {
        this.store.dispatch(new ClientMatterGridPageEventChange(this.myToken, { pageEvent: event }));
    }
    close(event) {
        this.store.dispatch(new ConflictSearchClosed(this.myToken));
        this.closePopup.emit(event);
    }
    onCompanyListOut(event) {
        this.store.dispatch(new OpportunityComanyListUpdate(this.myToken, { companyList: event }));
    }
    onOpportunityConflictSearch(event) {
        this.store.dispatch(new OpportunityConflictSearch(this.myToken, { searchModel: event }));
    }
    onOpportunityConflictSearchSave(event) {
        this.store.dispatch(new OpportunityConflictSearchSave(this.myToken, { type: event }));
    }
}
