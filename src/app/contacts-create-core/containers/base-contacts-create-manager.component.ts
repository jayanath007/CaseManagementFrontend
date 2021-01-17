import { Store } from '@ngrx/store';
import { ContactCreateInputData } from '../models/interfaces';
import { InitContactCreation, ChangeSearchText, ChangeTab, ChangeContact, ChangeDetails } from './../actions/core';
import {
    getIsLoadingByToken,
    getSelectedContactByToken,
    getContactSearchKeyByToken,
    getIsShowSearchTabByToken,
    getSelectedTabIndexByToken,
    getOtherContactColuByToken,
    getModeByToken,
    getContactTypeByToken,
    getMatterData
} from './../../contacts-create-core/reducers';
import { Section } from '../models/enum';

export class BaseContacCreateManager {
    constructor(protected store: Store<any>) {
    }
    token: string;
    isLoading$: any;
    selectedContact$: any;
    contactSearchKey$: any;
    showSearchTab$: any;
    selectedTab$: any;
    otherContactCol$: any;
    mode$: any;
    types$: any;
    matterData$ : any;

    protected initSelectors(token: string, isPopup: boolean, inputData: ContactCreateInputData) {
        this.token = token;
        this.store.dispatch(new InitContactCreation(token,
            {
                inputData: inputData,
                isPopup: isPopup
            }));
        this.isLoading$ = this.store.select(getIsLoadingByToken(token));
        this.selectedContact$ = this.store.select(getSelectedContactByToken(token));
        this.contactSearchKey$ = this.store.select(getContactSearchKeyByToken(token));
        this.showSearchTab$ = this.store.select(getIsShowSearchTabByToken(token));
        this.selectedTab$ = this.store.select(getSelectedTabIndexByToken(token));
        this.otherContactCol$ = this.store.select(getOtherContactColuByToken(token));
        this.mode$ = this.store.select(getModeByToken(token));
        this.types$ = this.store.select(getContactTypeByToken(token));
        this.matterData$ = this.store.select(getMatterData(token));
    }

    onSearchTextChanged(text: string) {
        this.store.dispatch(new ChangeSearchText(this.token, { searchText: text }));
    }

    onChangeSelectedTab(selectTabIndex) {
        this.store.dispatch(new ChangeTab(this.token, { selectTabIndex: selectTabIndex }));
    }

    onSelectContact(data: { contactId: number, closeSearch: boolean }) {
        this.store.dispatch(new ChangeContact(this.token, { contactId: data.contactId, closeSearch: data.closeSearch }));
    }

    onChangeDetails(event: { type: string, value: string, section: Section }) {
        this.store.dispatch(new ChangeDetails(this.token, event));

    }
}
