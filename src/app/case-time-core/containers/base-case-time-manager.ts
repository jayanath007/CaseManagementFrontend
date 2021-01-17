import { getCaseTimePageEventByToken } from '../reducers/case-time';
import {
    CaseTimeViewChange, ViewChangeKind, InitCaseTime, CaseTimeGridRowChange,
    RowItemChangeKind, CaseTimeRefresh
} from '../actions/core';
import { getCaseTimeGridDataByToken, getCaseTimeColumnDefByToken } from '../reducers';
import { Store } from '@ngrx/store';
import { getCaseTimeSearchTextByToken } from '..';
import { TimeItemWrapper } from '../models/interface';
import { getUser, User } from '../../auth';
import { Observable } from 'rxjs';


export class BaseCaseTimeManager {
    public user$: Observable<User>;

    constructor(protected store: Store<any>) {
        this.user$ = this.store.select(getUser);
    }

    refresh(token) {
        this.store.dispatch(new CaseTimeRefresh(token));
    }

    onChange(token, payload) {
        this.store.dispatch(new InitCaseTime(token, payload));
    }

    onRowChange(token: string, item: TimeItemWrapper, kind: RowItemChangeKind, value: any) {
        this.store.dispatch(new CaseTimeGridRowChange(token, { kind, row: item, value: value }));
    }

    onViewChange(token: string, kind: ViewChangeKind, value: any) {
        this.store.dispatch(new CaseTimeViewChange(token, { kind, value }));
    }

    getColumnDef(token) {
        return this.store.select(getCaseTimeColumnDefByToken(token));
    }

    getCurrentGridData(token) {
        return this.store.select(getCaseTimeGridDataByToken(token));
    }

    getSearchText(token) {
        return this.store.select(getCaseTimeSearchTextByToken(token));
    }

    getPageEventByToken(token) {
        return this.store.select(getCaseTimePageEventByToken(token));
    }

    // toggleExpandRow(token: string, value: TimeItemWrapper) {
    //     this.store.dispatch(new CaseTimeGridRowChange(token, { selectedRowItem: value }));
    // }


}
