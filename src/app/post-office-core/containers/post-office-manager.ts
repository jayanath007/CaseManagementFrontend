import { PostOfficeGridRowChange } from './../actions/core';
import { Store } from '@ngrx/store';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../core/lib/grid-model';
import {
    getPostOfficeIsLoadingByToken, getPostOfficeColumnDefByToken,
    getLoookForsByToken,
    getPostOfficeGroupsByToken, getPostOfficeUserByToken, getPostOfficeGridDataByToken,
    getPostOfficeTotalItemByToken, getPostOfficeGridExpandedRowByToken,
    getPostOfficeSelectedInfoByToken, getPostOfficeGridPasswordRequestRowByToken,
    getPostOfficeShowMessgeByToken, getPostOfficePeginatorDefByToken,
    getGroupModeByToken,
    getGroupDataByToken,
    getSelectGroupHashByToken,
    getDepartmentsByToken
} from '../reducers';
import {
    InitPostOffice, GridFilterChange, GridRowExpand, GridRefresh,
    GridViewChange, GetDocURL, ViewDoc, ValidatePassword, RemovePaswordRequestRow, GroupData, GroupDataRequest,
} from '../actions/core';
import { GridFilterUpdate, GridData, GridButtonAction } from '../models/interfce';
import { ViewChangeKind } from '../models/enumeration';
import { getSelectedTeamMemberByToken, getTeamMemberCountByToken, getMemListPanelModeByToken } from './../../team-member-core/reducers';
import { GroupMode } from './../models/enumeration';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';

export class BasePostOfficeManager {

    teamMemberToken = 'TEAM_MEMBER_DATA_POST_CODE';
    isLoading$: any;
    gridColoum$: any;
    group$: any;
    loookFors$: any;
    user$: any;
    selectedTeamMember$: any;
    teamMemberCount$: any;
    gridData$: any;
    passWordRequestRow$: any;
    totalItem$: any;
    expandedRow$: any;
    selectedInfo$: any;
    showmsg$: any;
    paginatorDef$: any;
    groupMode$: any;
    groupData$: any;
    selectGroupHash$: any;
    departments$: any;
    memListPanelMode$: any;
    authUser$: Observable<User>;

    constructor(protected store: Store<any>) {
    }

    columnDef: ColumnDef[] = [];

    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(token: string, columnDef: any, paginDef: PaginatorDef) {
        this.init(token, { columnDef: columnDef, paginatorDef: paginDef });
        this.authUser$ = this.store.select(getUser);
        this.isLoading$ = this.store.select(getPostOfficeIsLoadingByToken(token));
        this.user$ = this.store.select(getPostOfficeUserByToken(token));
        this.gridData$ = this.store.select(getPostOfficeGridDataByToken(token));
        this.totalItem$ = this.store.select(getPostOfficeTotalItemByToken(token));
        this.expandedRow$ = this.store.select(getPostOfficeGridExpandedRowByToken(token));
        this.selectedInfo$ = this.store.select(getPostOfficeSelectedInfoByToken(token));
        this.passWordRequestRow$ = this.store.select(getPostOfficeGridPasswordRequestRowByToken(token));
        this.showmsg$ = this.store.select(getPostOfficeShowMessgeByToken(token));
        this.paginatorDef$ = this.store.select(getPostOfficePeginatorDefByToken(token));
        this.gridColoum$ = this.store.select(getPostOfficeColumnDefByToken(token));
        this.loookFors$ = this.store.select(getLoookForsByToken(token));
        this.group$ = this.store.select(getPostOfficeGroupsByToken(token));
        this.groupMode$ = this.store.select(getGroupModeByToken(token));
        this.groupData$ = this.store.select(getGroupDataByToken(token));
        this.selectGroupHash$ = this.store.select(getSelectGroupHashByToken(token));
        this.departments$ = this.store.select(getDepartmentsByToken(token));
        this.selectedTeamMember$ = this.store.select(getSelectedTeamMemberByToken(this.teamMemberToken));
        this.teamMemberCount$ = this.store.select(getTeamMemberCountByToken(this.teamMemberToken));
        this.memListPanelMode$ = this.store.select(getMemListPanelModeByToken(this.teamMemberToken));
    }

    init(token, payload) {
        this.store.dispatch(new InitPostOffice(token, payload));
    }

    updateSelectedInfo(token: string, value: GridFilterUpdate) {
        this.store.dispatch(new GridFilterChange(token, { newData: value }));
    }

    expandRow(token: string, rowData: GridData) {
        this.store.dispatch(new GridRowExpand(token, { row: rowData }));
    }

    gridRefresh(token: string) {
        this.store.dispatch(new GridRefresh(token));
    }

    viewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new GridViewChange(token, { kind, value }));
    }

    viewDocument(token: string, value: GridData) {
        this.store.dispatch(new GetDocURL(token, { gridRow: value }));
    }

    closeViewer(token: string, value: GridData) {
        this.store.dispatch(new ViewDoc(token, value));
    }

    rowChange(token: string, value: GridButtonAction) {
        this.store.dispatch(new PostOfficeGridRowChange(token, value));
    }

    userEnterPassword(token, { row, password }: { row: GridData, password: string }) {
        this.store.dispatch(new ValidatePassword(token, { row: row, insertPassword: password }));
    }

    removeRequestRow(token) {
        this.store.dispatch(new RemovePaswordRequestRow(token));
    }

    selectGroup(token: string, data: GridGroupData) {
        this.store.dispatch(new GroupDataRequest(token, { gridGroupData: data }));
    }

    loadMoreData(token: string, data: GridGroupData) {
        this.store.dispatch(new GroupDataRequest(token, { gridGroupData: data, isLoadMore: true }));
    }

    menuChange(token: string, type) {
        this.store.dispatch(new GroupData(token, { type: type }));
    }

    groupChange(token: string, value: GroupMode) {
        this.store.dispatch(new GroupData(token, { type: value }));
    }

}
