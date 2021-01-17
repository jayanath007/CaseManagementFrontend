import { WorkflowMenuMetaDataWrapper } from '../../workflow-menu-core/models/interfaces';
import { RunWorkflowCommandByIds } from '../../workflow-menu-core/actions/core';
import { getMemListPanelModeByToken } from '../../team-member-core/reducers';
import { Store } from '@ngrx/store';
import { Output, EventEmitter, Injector } from '@angular/core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';

import { FieldType } from '../../odata/enums';
import {
    InitMyTask, GridFilterChange, GridViewChange, GridRowExpand, GridRefresh, RequestToComplete, MyTaskGroupChange,
    ExpandMyTaskGroup, MyTaskGroupLoadMore, GoToOpenCase
} from '../actions/core';
import {
    getMyTasksIsLoadingByToken,
    getMyTasksColumnDefByToken,
    getMyTasksTotalItemByToken,
    getMyTasksPeginatorDefByToken,
    getMyTasksDepartmentsByToken,
    getMyTasksUserPermisionByToken,
    getMyTasksGridDataByToken,
    getMyTasksSelectedInfoByToken,
    getMyTaskSummeryByToken,
    getMyTaskMsgByToken,
    getGroupDataByToken,
    getSelectGroupModeByToken
} from '../reducers';
import { getSelectedTeamMemberByToken, getTeamMemberCountByToken } from '../../team-member-core/reducers';
import { GridFilterUpdate, GridData, GroupMode, GridGroupData } from '../models/interfce';
import { ViewChangeKind } from '../models/enumeration';
import { ChangePanelMode } from '../../team-member-core/actions/team-member';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { getGeneralAllMenueItems } from '../../layout-desktop';
import { take } from 'rxjs/operators';

export class BaseMyTasksManager {

    @Output() closePopup = new EventEmitter();

    isLoading$: any;
    gridColoum$: any;
    paginatorDef$: any;
    department$: any;
    type$: any;
    period$: any;
    selectedInfo$: any;
    public memListPanelMode$: any;
    teamMemberToken = 'TEAM_MEMBER_DATA_MY_TASKS';
    selectedTeamMember$: any;
    teamMemberCount$: any;
    userPermision$: any;
    gridData$: any;
    totalItem$: any;
    summery$: any;
    msg$: any;
    groupData$: any;
    groupMode$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>, protected injector: Injector) {
    }

    columnDef: ColumnDef[] =
        [
            createDefultColumnDef('toggle', { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
            createDefultColumnDef('DateBy', { label: 'Do By', fxFlex: '90px', filterAnchor: 'start' }, FieldType.Date),
            createDefultColumnDef('TaskFor', { label: 'For', fxFlex: '80px', filterAnchor: 'start' }),
            createDefultColumnDef('Client', { label: 'Client', fxFlex: '8', filterAnchor: 'start' }),
            createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '108px', filterAnchor: 'start' }),
            createDefultColumnDef('Note', { label: 'Task', fxFlex: '', filterAnchor: 'start' }),
            createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '25', filterAnchor: 'end' }),
            createDefultColumnDef('Action', { label: 'Action', fxFlex: '82px', filterAnchor: 'end' }, FieldType.Boolen),
        ];
    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    protected initSelectors(token: string) {
        this.user$ = this.store.select(getUser);
        this.init(token);
        // this.store.dispatch(new InitMyTask(token, { columnDef: columnDef, paginatorDef: paginDef }));
        this.isLoading$ = this.store.select(getMyTasksIsLoadingByToken(token));
        this.gridColoum$ = this.store.select(getMyTasksColumnDefByToken(token));
        this.totalItem$ = this.store.select(getMyTasksTotalItemByToken(token));
        this.paginatorDef$ = this.store.select(getMyTasksPeginatorDefByToken(token));
        this.department$ = this.store.select(getMyTasksDepartmentsByToken(token));
        this.userPermision$ = this.store.select(getMyTasksUserPermisionByToken(token));
        this.selectedTeamMember$ = this.store.select(getSelectedTeamMemberByToken(this.teamMemberToken));
        this.teamMemberCount$ = this.store.select(getTeamMemberCountByToken(this.teamMemberToken));
        this.memListPanelMode$ = this.store.select(getMemListPanelModeByToken(this.teamMemberToken));
        this.gridData$ = this.store.select(getMyTasksGridDataByToken(token));
        this.selectedInfo$ = this.store.select(getMyTasksSelectedInfoByToken(token));
        this.summery$ = this.store.select(getMyTaskSummeryByToken(token));
        this.msg$ = this.store.select(getMyTaskMsgByToken(token));

        this.groupData$ = this.store.select(getGroupDataByToken(token));
        this.groupMode$ = this.store.select(getSelectGroupModeByToken(token));
        // groupMode

    }

    init(token) {
        this.store.select(getGeneralAllMenueItems).pipe(take(1)).subscribe(menuItems => {
            const menuItem = menuItems.find(i => i.id === 'client_creation');
            if (menuItem) {
                this.columnDef = this.columnDef
                    .map(column => column.fieldName === 'Client' ?
                        createDefultColumnDef('Client', { label: menuItem.label, fxFlex: '8', filterAnchor: 'start' }) :
                        column
                    );
            }
            this.store.dispatch(new InitMyTask(token, { columnDef: this.columnDef, paginatorDef: this.paginatorDef }));
        });
    }

    updateSelectedInfo(token: string, value: GridFilterUpdate) {
        this.store.dispatch(new GridFilterChange(token, { newData: value }));
    }


    loadMore(token: string, row: GridGroupData) {
        this.store.dispatch(new MyTaskGroupLoadMore(token, { row: row }));
    }

    viewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new GridViewChange(token, { kind, value }));
    }

    expandRow(token: string, rowData) {
        this.store.dispatch(new GridRowExpand(token, { row: rowData }));
    }

    gridRefresh(token: string): void {
        this.store.dispatch(new GridRefresh(token));
    }

    requestToComplete(token: string, item: GridData) {
        this.store.dispatch(new RequestToComplete(token, { row: item }));
    }


    groupChange(token: string, value: GroupMode) {
        this.store.dispatch(new MyTaskGroupChange(token, { groupMode: value }));
    }

    selectedGroupRowChange(token: string, row: GridGroupData) {
        this.store.dispatch(new ExpandMyTaskGroup(token, { row: row }));
    }


    changeTeamMemberPanelMode(viewMode) {
        this.store.dispatch(new ChangePanelMode(this.teamMemberToken, { mode: viewMode }));
    }

    runWorkflowCommand(token: string, item: GridData, menuInfo: WorkflowMenuMetaDataWrapper) {
        this.store.dispatch(new GoToOpenCase(item));
        setTimeout(() =>
            this.store.dispatch(new RunWorkflowCommandByIds(token,
                this.injector, {
                appID: item.appID, fileID: item.fileID,
                branchID: item.branchID, menuInfo: menuInfo
            })), 3000); {

        }

    }

    goToOpenCase(matter: GridData) {
        this.store.dispatch(new GoToOpenCase(matter));
    }
}
