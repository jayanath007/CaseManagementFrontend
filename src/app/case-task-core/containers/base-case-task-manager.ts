import { getCaseTaskPageEventByToken } from '../reducers/case-task';
import { CaseTaskViewChange, ViewChangeKind, InitCaseTask, CaseTaskGridRowChange, RowItemChangeKind,
     CaseTaskRefresh,
     RequestToComplete} from '../actions/core';
import { getCaseTaskGridDataByToken, getCaseTaskColumnDefByToken } from '../reducers';
import { Store } from '@ngrx/store';
import { getCaseTaskSearchTextByToken } from '..';
import { TaskItemWrapper, GridData } from '../models/interface';


export class BaseCaseTaskManager {

    constructor(protected store: Store<any>) {

    }

    refresh(token) {
        this.store.dispatch(new CaseTaskRefresh(token));
    }

    onChange(token, payload) {
        this.store.dispatch(new InitCaseTask(token, payload));
    }

    onRowChange(token: string, item: TaskItemWrapper, kind: RowItemChangeKind, value: any) {
        this.store.dispatch(new CaseTaskGridRowChange(token, { kind, row: item, value: value }));
    }

    onViewChange(token: string, kind: ViewChangeKind, value: any) {
        this.store.dispatch(new CaseTaskViewChange(token, { kind, value }));
    }

    getColumnDef(token) {
        return this.store.select(getCaseTaskColumnDefByToken(token));
    }

    getCurrentGridData(token) {
        return this.store.select(getCaseTaskGridDataByToken(token));
    }

    getSearchText(token) {
        return this.store.select(getCaseTaskSearchTextByToken(token));
    }

    getPageEventByToken(token) {
        return this.store.select(getCaseTaskPageEventByToken(token));
    }

    requestToComplete(token: string, item: GridData) {
        this.store.dispatch(new RequestToComplete(token, { row: item }));
    }

    // toggleExpandRow(token: string, value: TaskItemWrapper) {
    //     this.store.dispatch(new CaseTaskGridRowChange(token, { selectedRowItem: value }));
    // }


}
