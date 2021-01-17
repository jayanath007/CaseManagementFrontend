import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-team-manager-router-host',
  template: `<dps-team-manager #teamManager [token]="'Team'">
    <dps-team-layout
    (searchTextcahange)="teamManager.onSearchTextcahange($event)"
    (departmentChange)=teamManager.onDepartmentcahange($event)
    (changeViewType)="teamManager.onChangeViewType($event)"
    (selectYearAndMonthClick)="teamManager.onSelectYearAndMonth($event)"
    (teamUserChange)="teamManager.onTeamUserChange($event)"
    (selectedDay)="teamManager.onSelectedDayForDetails($event)"
    [departmentList]="teamManager.departmentList$ | async"
    [selectedViewType]="teamManager.selectedViewType$ | async"
    [teamUsersLoading]="teamManager.teamUsersLoading$ | async"
    [loading] = "teamManager.isLoading$ | async"
    [teamUsersList]  = "teamManager.teamUsersList$ | async"
    [selectYearAndMonth]  = "teamManager.selectedYearAndMonth$ | async"
    [monthActivityList]  = "teamManager.monthActivityList$ | async"
    [selectedTeamUser] = "teamManager.selectedTeamUser$ | async"
    [activityListByDay]  = "teamManager.activityListByDay$ | async"
    [loginUser] = "teamManager.logingUser$ | async"
    [eventYearSummery] = "teamManager.eventYearSummery$ | async">

    </dps-team-layout>

  </dps-team-manager>`,
})
export class TeamManagerRouterHostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
