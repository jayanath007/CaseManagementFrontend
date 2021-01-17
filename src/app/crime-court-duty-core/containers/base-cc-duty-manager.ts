
import { Store } from '@ngrx/store';
import { getFeeEarnerList, getBranchList, getCrimeLookupList } from '../../shared-data';
import {
    getIsLoadingByToken, getModel, isDirty, getRecordHistory, getIsLoadinghistoryByToken,
    gridDataPaginatorDef, gridDataFilter
} from '../reducers';
import { getDPSSettingValueByKey, getUser, User } from '../../auth';
import { SettingKey } from '../../core/lib/app-settings';
import { combineLatest } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DropdownListItem } from '../../shared-data/model/interface';
import { LookupType } from '../../shared';
import {
    InitCcourtDutyInformation, ChangeModel, ClearModel, Save, Delete, EditItem,
    ChangePage, ChangeGridFilter, CourtDutyClosed, PrintDoc
} from '../actions/court-duty';
import { CourtDutyTimeRecord } from '../model/interface';
import { PaginatorDef } from '../../core/lib/grid-model';
import { MatterKeyInfor } from '../../core/lib/matter';
import { EventEmitter, Output } from '@angular/core';


export class BaseCcDutyManager {
    @Output() closePopup = new EventEmitter<any>();

    constructor(protected store: Store<any>) { }

    feeEarnerList$: any;
    branchList$: any;
    isloading$: any;
    isLoadinghistory$: any;
    model$: any;
    isDirty$: any;
    locationLookupList$: any;
    recordsHistory$: any;
    gridDataPaginatorDef$: any;
    gridDataFilter$: any;

    init(token: string, inputData: MatterKeyInfor) {
        this.store.dispatch(new InitCcourtDutyInformation(token, { matterKeyInfor: inputData }));
        const userBranchId$ = this.store.select(getDPSSettingValueByKey(SettingKey.UserBranchId));
        this.branchList$ = this.store.select(getBranchList);
        const logingUser$ = this.store.select(getUser);
        combineLatest(userBranchId$, this.branchList$, logingUser$,
            (userBranchId: number, branchList: DropdownListItem[], logingUser: User) => ({
                userBranchId: userBranchId,
                branchList: branchList,
                logingUser: logingUser
            })).pipe(filter(data => data.branchList && data.branchList.length > 0), take(1))
            .subscribe(data => {
                const branchId = data.userBranchId > 0 ? data.userBranchId : data.branchList[0].key;
                this.store.dispatch(new ChangeModel(token, { key: 'branchId', value: branchId }, true));
                this.store.dispatch(new ChangeModel(token, { key: 'feeEarner', value: data.logingUser.general.user }, true));
            });

        this.feeEarnerList$ = this.store.select(getFeeEarnerList(true));
        this.isloading$ = this.store.select(getIsLoadingByToken(token));
        this.model$ = this.store.select(getModel(token));
        this.isDirty$ = this.store.select(isDirty(token));
        this.locationLookupList$ = this.store.select(getCrimeLookupList(LookupType.MA_COURT_CODES));
        this.recordsHistory$ = this.store.select(getRecordHistory(token));
        this.isLoadinghistory$ = this.store.select(getIsLoadinghistoryByToken(token));
        this.gridDataPaginatorDef$ = this.store.select(gridDataPaginatorDef(token));
        this.gridDataFilter$ = this.store.select(gridDataFilter(token));
    }

    onChangeModel(token: string, event: { key: string, value: string }) {
        this.store.dispatch(new ChangeModel(token, event));
    }

    userAction(token: string, userAction: string) {
        switch (userAction) {
            case 'New':
                this.store.dispatch(new ClearModel(token));
                break;
            case 'Save':
                this.store.dispatch(new Save(token));
                break;
            case 'Delete':
                this.store.dispatch(new Delete(token));
                break;
            case 'Print':
                this.store.dispatch(new PrintDoc(token));
                break;
            default:
                break;
        }
    }

    selectItemForEdit(token: string, model: CourtDutyTimeRecord) {
        this.store.dispatch(new EditItem(token, model));
    }

    changePage(token: string, def: PaginatorDef) {
        this.store.dispatch(new ChangePage(token, def));
    }

    changeGridFilter(token: string, filterData: { key: string, value: any }) {
        this.store.dispatch(new ChangeGridFilter(token, filterData));
    }
    close(token: string) {
        this.store.dispatch(new CourtDutyClosed(token));
        this.closePopup.emit();
    }
}
