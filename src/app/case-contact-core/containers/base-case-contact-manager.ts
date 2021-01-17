import { getCaseContactPageEventByToken } from '../reducers/case-contact';
import {
    CaseContactViewChange, ViewChangeKind, InitCaseContact, CaseContactGridRowChange, RowItemChangeKind,
    CaseContactRefresh
} from '../actions/core';
import { getCaseContactGridDataByToken, getContactModeByToken, getCaseContactColumnDefByToken } from '../reducers';
import { Store } from '@ngrx/store';
import { getCaseContactSearchTextByToken } from '..';
import { ContactItemWrapper } from '../models/interface';


export class BaseCaseContactManager {

    constructor(protected store: Store<any>) {

    }

    refresh(token) {
        this.store.dispatch(new CaseContactRefresh(token));
    }

    onChange(token, payload) {
        this.store.dispatch(new InitCaseContact(token, payload));
    }

    onRowChange(token: string, item: ContactItemWrapper, kind: RowItemChangeKind, value: any) {
        this.store.dispatch(new CaseContactGridRowChange(token, { kind, row: item, value: value }));
    }

    onViewChange(token: string, kind: ViewChangeKind, value: any) {
        this.store.dispatch(new CaseContactViewChange(token, { kind, value }));
    }

    onSearchTextChange(token, value) {
        this.store.dispatch(new CaseContactViewChange(token, { kind: ViewChangeKind.SearchText, value: value }));
    }

    getColumnDef(token) {
        return this.store.select(getCaseContactColumnDefByToken(token));
    }

    getContactMode(token) {
        return this.store.select(getContactModeByToken(token));
    }


    getCurrentGridData(token) {
        return this.store.select(getCaseContactGridDataByToken(token));
    }

    getSearchText(token) {
        return this.store.select(getCaseContactSearchTextByToken(token));
    }

    getPageEventByToken(token) {
        return this.store.select(getCaseContactPageEventByToken(token));
    }

    // toggleExpandRow(token: string, value: ContactItemWrapper) {
    //     this.store.dispatch(new CaseContactGridRowChange(token, { selectedRowItem: value }));
    // }


}
