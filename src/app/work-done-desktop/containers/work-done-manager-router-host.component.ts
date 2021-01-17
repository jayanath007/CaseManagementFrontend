import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-work-done-manager-router-host',
  template: `<dps-work-done-manager #workDoneManager [token]="'workDonePage'">
    <dps-work-done-layout
    [activeOutlet]="workDoneManager.activeOutlet$ | async"
    [timeOffset]="(workDoneManager.user$ | async).general.dateTimeOffset"
    [isLoading]="workDoneManager.isLoading$ | async"
    [columnDef]="workDoneManager.gridColoum$ | async"
    [departmentList]="workDoneManager.department$ | async"
    [periodList]="workDoneManager.period$ | async"
    [selectedTeamMember]="workDoneManager.selectedTeamMember$ | async"
    [teamMemberCount]="workDoneManager.teamMemberCount$ | async"
    [gridData]="workDoneManager.gridData$ | async"
    [totalItem]="workDoneManager.totalItem$ | async"
    [summery]="workDoneManager.summery$ | async"
    [expandedRow]="workDoneManager.expandedRow$ | async"
    [selectedInfo]="workDoneManager.selectedInfo$ | async"
    [passWordRequestRow]="workDoneManager.passWordRequestRow$ | async"
    [showmsg]="workDoneManager.showmsg$ | async"
    [paginatorDef]="workDoneManager.paginatorDef$ | async"
    [companyCode]="(workDoneManager.user$ | async)?.general?.companyCode"
    [timeZone]="(workDoneManager.user$ | async)?.userTimeZone?.info.alias"
    [memListPanelMode]="workDoneManager.memListPanelMode$|async"
    [groupMode]="workDoneManager.groupMode$ | async"
    [groupData]="workDoneManager.groupData$ |async"
    [selectGroupHash]="workDoneManager.selectGroupHash$ | async"
    (updateSelectedInfo)="workDoneManager.onUpdateSelectedInfo($event)"
    (rowSelect)="workDoneManager.onRowSelect($event)"
    (refresh)="workDoneManager.onRefresh()"
    (clickGridButton)="workDoneManager.onClickGridButton($event)"
    (viewChange) = "workDoneManager.onViewChange($event)"
    (userPassword) = "workDoneManager.onUserEnterPassword($event)"
    (removePasswordRequest) = "workDoneManager.removePasswordRequest()"
    (changePanelMode)="workDoneManager.onChangeTeamMemberPanelMode($event)"
    (menuChange)="workDoneManager.onMenuChange($event)"
    (selectGroup)="workDoneManager.onSelectGroup($event)"
    (loadMoreData)="workDoneManager.onLoadMoreData($event)"
    >

    </dps-work-done-layout>
  </dps-work-done-manager>`,
})
export class WorkDoneManagerRouterHostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
