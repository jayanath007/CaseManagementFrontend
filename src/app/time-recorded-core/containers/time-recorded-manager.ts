import { Store } from '@ngrx/store';
import { Output, EventEmitter } from '@angular/core';
import { GridData } from '../models/interfce';
import { gridFilterKind } from '../models/enumeration';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { ViewChangeKind } from '../models/enumeration';
import { PaginatorDef, GridGroupData } from '../../core/lib/grid-model';
import {
    getTimeRecordedIsLoadingByToken, getTimeRecordedColumnDefByToken, getTimeRecordedDepartmentByToken,
    getTimeRecordedTypeByToken, getTimeRecordedPeriodByToken, getTimeRecordedSelectedInfoByToken,
    getTimeRecordedUserPermisionByToken, getTimeRecordedGridDataByToken, getTimeRecordedTotalItemByToken,
    getTimeRecordedPeginatorDefByToken, getTimeRecordedSummeryByToken, getSelectGroupModeByToken,
    getGroupDataByToken
} from '../reducers';
import {
    InitTimeRecorded, GridFilterChange, LoadFromToDate, GridRefresh, GridViewChange, GridChangeSelectRow,
    GroupData, GroupDataRequest, ExportToExcel, DateTypeDange
} from '../actions/core';
import { getSelectedTeamMemberByToken, getTeamMemberCountByToken, getMemListPanelModeByToken } from '../../team-member-core/reducers';
import { GridFilterUpdate, GridTemplete } from '../models/interfce';
import { FieldType } from '../../odata/enums';
import { getHomeCurrency, InitSettingCore } from '../../setting-core';
import { getCanMinimizeViews } from '../../time-recording-core';
import { OpenTimeValidation } from './../../core/lib/timeRecord';
import { TimeRecordingTimeUpdating, StopStartClock, SaveWithoutSubmitTimeRecord } from './../../time-recording-core/actions/core';
import { ChangePanelMode } from '../../team-member-core/actions/team-member';
import { OpenTimeRecordPopupRequest } from './../../shared-data/actions/time-record';
import { Observable } from 'rxjs';
import { User, getUser, LoadOrganizerSettings } from '../../auth';
import { take, filter } from 'rxjs/operators';
import { LocalStorageKey } from '../../core';
import { MainMenuItem } from '../../layout-desktop';

export class BaseTimeRecordedManager {

    @Output() closePopup = new EventEmitter();

    isLoading$: any;
    gridColoum$: any;
    paginatorDef$: any;
    department$: any;
    type$: any;
    period$: any;
    selectedInfo$: any;
    teamMemberToken = 'TEAM_MEMBER_DATA_TIME_RECORDED';
    selectedTeamMember$: any;
    teamMemberCount$: any;
    userPermision$: any;
    gridData$: any;
    totalItem$: any;
    summery$: any;
    homeCurrancy$: any;
    memListPanelMode$: any;
    groupMode$: any;
    groupData$: any;
    canMinimizeViews$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>) {
    }

    menuItem: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
    clientLabel = this.menuItem.find(i => i.id === 'client_search').label;
    gridTemplete = {
        allColumnDef:
            [
                createDefultColumnDef('toggle', {
                    label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true,
                    disableShort: true
                }),
                createDefultColumnDef('TimeDate', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                createDefultColumnDef('Client_Account_Name', { label: this.clientLabel, fxFlex: '10', filterAnchor: 'start' }),
                createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('TimeDetails', { label: 'Work', fxFlex: '14', filterAnchor: 'start' }),
                createDefultColumnDef('Note', { label: 'Notes', fxFlex: '14', filterAnchor: 'start' }),
                createDefultColumnDef('Units', { label: 'Units', fxFlex: '4', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('value', { label: 'Value', fxFlex: '7', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('Billed', { label: 'Billed', fxFlex: '52px', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('BillFE', { label: 'Bill F/E', fxFlex: '5', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('BillNo', { label: 'Bill No', fxFlex: '5', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('datebilled', { label: 'Bill Date', fxFlex: '95px', filterAnchor: 'end' }, FieldType.Date),
                createDefultColumnDef('netbilled', { label: 'Bill Net', fxFlex: '7', filterAnchor: 'end' })
            ],
        billdColumnDef:
            [
                createDefultColumnDef('toggle', {
                    label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true,
                    disableShort: true
                }),
                createDefultColumnDef('TimeDate', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                createDefultColumnDef('Client_Account_Name', { label: this.clientLabel, fxFlex: '10', filterAnchor: 'start' }),
                createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('TimeDetails', { label: 'Work', fxFlex: '14', filterAnchor: 'start' }),
                createDefultColumnDef('Note', { label: 'Notes', fxFlex: '14', filterAnchor: 'start' }),
                createDefultColumnDef('Units', { label: 'Units', fxFlex: '4', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('value', { label: 'Value', fxFlex: '7', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('BillFE', { label: 'Bill F/E', fxFlex: '5', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('BillNo', { label: 'Bill No', fxFlex: '5', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('datebilled', { label: 'Bill Date', fxFlex: '80px', filterAnchor: 'end' }, FieldType.Date),
                createDefultColumnDef('netbilled', { label: 'Bill Net', fxFlex: '7', filterAnchor: 'end' })
            ],
        unBilldColumnDef:
            [
                createDefultColumnDef('toggle', {
                    label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true,
                    disableShort: true
                }),
                createDefultColumnDef('TimeDate', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
                createDefultColumnDef('Client_Account_Name', { label: this.clientLabel, fxFlex: '12', filterAnchor: 'start' }),
                createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('TimeDetails', { label: 'Work', fxFlex: '20', filterAnchor: 'end' }),
                createDefultColumnDef('Note', { label: 'Notes', fxFlex: '20', filterAnchor: 'end' }),
                createDefultColumnDef('units', { label: 'Units', fxFlex: '4', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('value', { label: 'Value', fxFlex: '10', filterAnchor: 'end', filterHidden: true }),
            ],

    };

    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(token: string, gridTemplete: GridTemplete, paginDef: PaginatorDef) {
        this.user$ = this.store.select(getUser);
        this.init(token, { gridTemplete: gridTemplete, paginatorDef: paginDef });
        this.isLoading$ = this.store.select(getTimeRecordedIsLoadingByToken(token));
        this.gridColoum$ = this.store.select(getTimeRecordedColumnDefByToken(token));
        this.paginatorDef$ = this.store.select(getTimeRecordedPeginatorDefByToken(token));
        this.department$ = this.store.select(getTimeRecordedDepartmentByToken(token));
        this.type$ = this.store.select(getTimeRecordedTypeByToken(token));
        this.period$ = this.store.select(getTimeRecordedPeriodByToken(token));
        this.selectedInfo$ = this.store.select(getTimeRecordedSelectedInfoByToken(token));
        this.selectedTeamMember$ = this.store.select(getSelectedTeamMemberByToken(this.teamMemberToken));
        this.teamMemberCount$ = this.store.select(getTeamMemberCountByToken(this.teamMemberToken));
        this.userPermision$ = this.store.select(getTimeRecordedUserPermisionByToken(token));
        this.gridData$ = this.store.select(getTimeRecordedGridDataByToken(token));
        this.totalItem$ = this.store.select(getTimeRecordedTotalItemByToken(token));
        this.summery$ = this.store.select(getTimeRecordedSummeryByToken(token));
        this.homeCurrancy$ = this.store.select(getHomeCurrency());
        this.memListPanelMode$ = this.store.select(getMemListPanelModeByToken(this.teamMemberToken));
        this.groupMode$ = this.store.select(getSelectGroupModeByToken(token));
        this.groupData$ = this.store.select(getGroupDataByToken(token));
        this.canMinimizeViews$ = this.store.select(getCanMinimizeViews);
    }

    init(token, payload) {
        this.store.dispatch(new InitSettingCore());
        this.store.dispatch(new LoadOrganizerSettings());
        const _user$ = this.user$.pipe(filter(user => !!user.general), take(1)).subscribe(user => {
            this.store.dispatch(new InitTimeRecorded(token, { ...payload, timeOffset: user.general.dateTimeOffset }));
        });
    }

    updateSelectedInfo(token: string, value: GridFilterUpdate) {
        if (value.kind === gridFilterKind.period && value.value !== 5) {
            this.store.dispatch(new LoadFromToDate(token, { periodId: value ? value.value : 0 }));
        } else {
            this.store.dispatch(new GridFilterChange(token, { newData: value }));
        }
    }

    gridRefresh(token: string) {
        this.store.dispatch(new GridRefresh(token));
    }

    viewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new GridViewChange(token, { kind, value }));
    }

    onSelectRowChange(token: string, gridRow: GridData) {
        this.store.dispatch(new GridChangeSelectRow(token, { row: gridRow }));
    }
    changeTeamMemberPanelMode(viewMode) {
        this.store.dispatch(new ChangePanelMode(this.teamMemberToken, { mode: viewMode }));
    }
    groupData(token: string, type) {
        this.store.dispatch(new GroupData(token, { type: type }));
    }
    selectGroup(token: string, data: GridGroupData) {
        this.store.dispatch(new GroupDataRequest(token, { gridGroupData: data }));
    }
    loadMoreData(token: string, data: GridGroupData) {
        this.store.dispatch(new GroupDataRequest(token, { gridGroupData: data, isLoadMore: true }));
    }
    updatingTimeRecording(token: string, TimeRecordValue: any) {
        this.store.dispatch(new TimeRecordingTimeUpdating(token, { timeRecordValue: TimeRecordValue }));
    }
    timeUpdateStartStop(token: string) {
        this.store.dispatch(new StopStartClock(token, { isPulse: false }));
    }
    saveTR(token: string) {
        this.store.dispatch(new SaveWithoutSubmitTimeRecord(token));
    }
    requestToOpenTimeRecord(token: string, data: OpenTimeValidation) {
        this.store.dispatch(new OpenTimeRecordPopupRequest(token, data));
    }
    exportToExcel(token: string) {
        this.store.dispatch(new ExportToExcel(token));
    }
    dateTypeChanged(token: string, dateTypeValue: boolean) {
        this.store.dispatch(new DateTypeDange(token, dateTypeValue));
    }
}
