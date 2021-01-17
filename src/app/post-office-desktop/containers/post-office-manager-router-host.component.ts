import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-post-office-manager-router-host',
  template: `<dps-post-office-manager #postOfficeManager [token]="'postOfficePage'">
    <dps-post-office-layout
    [timeOffset]="(postOfficeManager.authUser$ | async).general.dateTimeOffset"
    [isLoading]="postOfficeManager.isLoading$ | async"
    [columnDef]="postOfficeManager.gridColoum$ | async"
    [groupList]="postOfficeManager.group$ | async"
    [userList]="postOfficeManager.user$ | async"
    [loookForList]="postOfficeManager.loookFors$ | async"
    [departments]="postOfficeManager.departments$|async"
    [gridData]="postOfficeManager.gridData$ | async"
    [totalItem]="postOfficeManager.totalItem$ | async"
    [expandedRow]="postOfficeManager.expandedRow$ | async"
    [selectedInfo]="postOfficeManager.selectedInfo$ | async"
    [passWordRequestRow]="postOfficeManager.passWordRequestRow$ | async"
    [showmsg]="postOfficeManager.showmsg$ | async"
    [paginatorDef]="postOfficeManager.paginatorDef$ | async"
    [groupMode]="postOfficeManager.groupMode$ | async"
    [groupData]="postOfficeManager.groupData$ |async"
    [selectGroupHash]="postOfficeManager.selectGroupHash$ | async"
    [selectedTeamMember]="postOfficeManager.selectedTeamMember$|async"
    [teamMemberCount]="postOfficeManager.teamMemberCount$ | async"
    [memListPanelMode]="postOfficeManager.memListPanelMode$ | async"
    (updateSelectedInfo)="postOfficeManager.onUpdateSelectedInfo($event)"
    (rowSelect)="postOfficeManager.onRowSelect($event)"
    (refresh)="postOfficeManager.onRefresh()"
    (clickGridButton)="postOfficeManager.onClickGridButton($event)"
    (viewChange) = "postOfficeManager.onViewChange($event)"
    (userPassword) = "postOfficeManager.onUserEnterPassword($event)"
    (removePasswordRequest) = "postOfficeManager.removePasswordRequest()"
    (selectGroup)="postOfficeManager.onSelectGroup($event)"
    (loadMoreData)="postOfficeManager.onLoadMoreData($event)"
    (menuChange)="postOfficeManager.onMenuChange($event)"
    (groupChange)="postOfficeManager.onGroupChange($event)"
    >
    </dps-post-office-layout>
  </dps-post-office-manager>`,
})
export class PostOfficeManagerRouterHostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
