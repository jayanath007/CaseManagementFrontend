import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../core/lib/grid-model';
import { getSelectedTeamMemberByToken, getTeamMemberCountByToken, getMemListPanelModeByToken } from '../../team-member-core/reducers';
import {
    getWorkDoneIsLoadingByToken, getWorkDoneColumnDefByToken,
    getWorkDoneSepartmentsByToken, getWorkDonePeriodByToken, getWorkDoneGridDataByToken,
    getWorkDoneTotalItemByToken, getWorkDoneSummeryByToken, getWorkDoneGridExpandedRowByToken,
    getWorkDoneSelectedInfoByToken, getWorkDoneGridPasswordRequestRowByToken, getWorkDoneShowMessgeByToken, getWorkDonePeginatorDefByToken,
    getGroupModeByToken,
    getGroupDataByToken,
    getSelectGroupHashByToken
} from '../reducers';
import {
    InitWorkDone, LoadFromToDate, GridFilterChange, GridRowExpand, GridRefresh,
    GridViewChange, GetDocURL, ViewDoc, ValidatePassword, RemovePaswordRequestRow, GroupData, GroupDataRequest, GoToOpenCase
} from '../actions/core';
import { GridFilterUpdate, GridData } from '../models/interfce';
import { gridFilterKind, ViewChangeKind } from '../models/enumeration';
import { FieldType } from '../../odata/enums';
import { OpenTimeRecordPopupRequest } from './../../shared-data/actions/time-record';
import { OpenTimeValidation } from './../../core/lib/timeRecord';
import { ChangePanelMode } from '../../team-member-core/actions/team-member';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { take } from 'rxjs/operators';
import { getMenuItemDisplayName } from './../../layout-desktop/reducers/index';

export class BaseWorkDoneManager {

    isLoading$: any;
    gridColoum$: any;
    department$: any;
    period$: any;
    teamMemberToken = 'TEAM_MEMBER_DATA_WORK_DONE';
    selectedTeamMember$: any;
    teamMemberCount$: any;
    gridData$: any;
    passWordRequestRow$: any;
    totalItem$: any;
    summery$: any;
    expandedRow$: any;
    selectedInfo$: any;
    showmsg$: any;
    paginatorDef$: any;
    memListPanelMode$: any;
    groupMode$: any;
    groupData$: any;
    selectGroupHash$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>) {
    }

    columnDef: ColumnDef[] = [];

    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(token: string, columnDef: any, paginDef: PaginatorDef) {

        this.store.select(getMenuItemDisplayName('client_search')).subscribe(clientLabel => {
            this.columnDef = [
                createDefultColumnDef('Toggle',
                    { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
                createDefultColumnDef('Diary_DATEDN', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('by', { label: 'By', fxFlex: '66px', filterAnchor: 'start' }),
                createDefultColumnDef('Diary_RECTYPE', {
                    label: 'Type', fxFlex: '54px', filterAnchor: 'start',
                    filterHidden: true, disableShort: true
                }),
                createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                // createDefultColumnDef('Diary_FEE_EARNER', { label: 'For', fxFlex: '55px', filterAnchor: 'start' }),
                createDefultColumnDef('SAL_Account_Name', { label: clientLabel, fxFlex: '8', filterAnchor: 'end' }),
                createDefultColumnDef('Note', { label: 'Work', fxFlex: '18', filterAnchor: 'end' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'end' }),
                createDefultColumnDef('EmailFrom', { label: 'From', fxFlex: '12', filterAnchor: 'end' }),
                createDefultColumnDef('EmailTo', { label: 'To', fxFlex: '12', filterAnchor: 'end' })
            ];
            this.user$ = this.store.select(getUser);
            this.init(token, { columnDef: this.columnDef, paginatorDef: paginDef });

            this.isLoading$ = this.store.select(getWorkDoneIsLoadingByToken(token));
            this.gridColoum$ = this.store.select(getWorkDoneColumnDefByToken(token));
            this.department$ = this.store.select(getWorkDoneSepartmentsByToken(token));
            this.period$ = this.store.select(getWorkDonePeriodByToken(token));
            this.selectedTeamMember$ = this.store.select(getSelectedTeamMemberByToken(this.teamMemberToken));
            this.teamMemberCount$ = this.store.select(getTeamMemberCountByToken(this.teamMemberToken));
            this.memListPanelMode$ = this.store.select(getMemListPanelModeByToken(this.teamMemberToken));
            this.gridData$ = this.store.select(getWorkDoneGridDataByToken(token));
            this.totalItem$ = this.store.select(getWorkDoneTotalItemByToken(token));
            this.summery$ = this.store.select(getWorkDoneSummeryByToken(token));
            this.expandedRow$ = this.store.select(getWorkDoneGridExpandedRowByToken(token));
            this.selectedInfo$ = this.store.select(getWorkDoneSelectedInfoByToken(token));
            this.passWordRequestRow$ = this.store.select(getWorkDoneGridPasswordRequestRowByToken(token));
            this.showmsg$ = this.store.select(getWorkDoneShowMessgeByToken(token));
            this.paginatorDef$ = this.store.select(getWorkDonePeginatorDefByToken(token));
            this.groupMode$ = this.store.select(getGroupModeByToken(token));
            this.groupData$ = this.store.select(getGroupDataByToken(token));
            this.selectGroupHash$ = this.store.select(getSelectGroupHashByToken(token));
        });



    }

    init(token, payload) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitWorkDone(token, { ...payload, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();

    }

    updateSelectedInfo(token: string, value: GridFilterUpdate) {
        if (value.kind === gridFilterKind.period && value.value !== 5) {
            this.store.dispatch(new LoadFromToDate(token, { periodId: value ? value.value : 0 }));
        } else {
            this.store.dispatch(new GridFilterChange(token, { newData: value }));
        }
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

    userEnterPassword(token, { row, password }: { row: GridData, password: string }) {
        this.store.dispatch(new ValidatePassword(token, { row: row, insertPassword: password }));
    }

    removeRequestRow(token) {
        this.store.dispatch(new RemovePaswordRequestRow(token));
    }
    changeTeamMemberPanelMode(viewMode) {
        this.store.dispatch(new ChangePanelMode(this.teamMemberToken, { mode: viewMode }));
    }
    menuChange(token: string, type) {
        this.store.dispatch(new GroupData(token, { type: type }));
    }
    selectGroup(token: string, data: GridGroupData) {
        this.store.dispatch(new GroupDataRequest(token, { gridGroupData: data }));
    }
    loadMoreData(token: string, data: GridGroupData) {
        this.store.dispatch(new GroupDataRequest(token, { gridGroupData: data, isLoadMore: true }));
    }
    requestToOpenTimeRecord(token: string, data: OpenTimeValidation) {
        this.store.dispatch(new OpenTimeRecordPopupRequest(token, data));
    }
    goToOpenCase(matter: GridData) {
        this.store.dispatch(new GoToOpenCase(matter));
    }

}
