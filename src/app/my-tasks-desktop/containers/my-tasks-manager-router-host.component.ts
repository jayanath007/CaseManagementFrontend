import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dps-my-tasks-manager-router-host',
    template: `<dps-my-tasks-manager #myTaskManager [token]="'MyTasksPage'">
                    <dps-my-tasks-layout
                        [isLoading]="myTaskManager.isLoading$ | async"
                        [gridColoum]="myTaskManager.gridColoum$ | async"
                        [totalItem]="myTaskManager.totalItem$ | async"
                        [paginatorDef]="myTaskManager.paginatorDef$ | async"
                        [department]="myTaskManager.department$ | async"
                        [userPermision]="myTaskManager.userPermision$ | async"
                        [selectedTeamMember]="myTaskManager.selectedTeamMember$ | async"
                        [teamMemberCount]="myTaskManager.teamMemberCount$ | async"
                        [gridData]="myTaskManager.gridData$ | async"
                        [selectedInfo]="myTaskManager.selectedInfo$ | async"
                        [summery]="myTaskManager.summery$ | async"
                        [msg]="myTaskManager. msg$ | async"
                        [memListPanelMode]="myTaskManager.memListPanelMode$ | async"
                        [activeOutlet]="myTaskManager.activeOutlet$ | async"

                        [gridGroupData]="myTaskManager.groupData$ | async"
                        [groupMode]="myTaskManager.groupMode$ | async"

                        (selectedGroupRowChange)="myTaskManager.onSelectedGroupRowChange($event)"
                        (groupChange)="myTaskManager.onGroupChange($event)"
                        (updateSelectedInfo)="myTaskManager.onUpdateSelectedInfo($event)"
                        (viewChange)="myTaskManager.onViewChange($event)"
                        (rowExpanded)="myTaskManager.onRowExpanded($event)"
                        (gridRefresh)="myTaskManager.onRefresh()"
                        (clickGridButton)="myTaskManager.clickGridButton($event)"
                        (updateNewTaskClick)="myTaskManager.newTaskClick()"
                        (changePanelMode)="myTaskManager.onChangeTeamMemberPanelMode($event)"
                        (openAddTaskWithFile)="myTaskManager.onOpenAddTaskWithFile($event)"
                        (loadMore)="myTaskManager.onLoadMore($event)"
                        >
                    </dps-my-tasks-layout>
                </dps-my-tasks-manager>`,

})
export class MyTasksManagerRouterHostComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
