import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-time-recorded-manager-router-host',
  template: `<dps-time-recorded-manager #timeRecordedManager [token]="'TimeRecordedPage'">
   <dps-time-recorded-layout
   *ngIf="(timeRecordedManager.user$ | async)?.general"
  [departmentList]="timeRecordedManager.department$ | async"
  [timeOffset]="(timeRecordedManager.user$ | async)?.general?.dateTimeOffset"
  [typeList]="timeRecordedManager.type$ | async"
  [periodList]="timeRecordedManager.period$ | async"
  [isLoading]="timeRecordedManager.isLoading$ | async"
  [selectedInfo]="timeRecordedManager.selectedInfo$ | async"
  [selectedTeamMember]="timeRecordedManager.selectedTeamMember$ | async"
  [teamMemberCount]="timeRecordedManager.teamMemberCount$ | async"
  [userPermision]="timeRecordedManager.userPermision$ | async"
  [columnDef]="timeRecordedManager.gridColoum$ | async"
  [paginatorDef]="timeRecordedManager.paginatorDef$ | async"
  [gridData]="timeRecordedManager.gridData$ | async"
  [summery]="timeRecordedManager.summery$ | async"
  [totalItem]="timeRecordedManager.totalItem$ | async"
  [homeCurrancy]="timeRecordedManager.homeCurrancy$ | async"
  [memListPanelMode]="timeRecordedManager.memListPanelMode$ | async"
  [groupMode]="timeRecordedManager.groupMode$ | async"
  [groupData]="timeRecordedManager.groupData$ |async"
  [canMinimizeViews]="timeRecordedManager.canMinimizeViews$ | async"
  (updateSelectedInfo)="timeRecordedManager.onUpdateSelectedInfo($event)"
  (viewChange) = "timeRecordedManager.onViewChange($event)"
  (refresh)="timeRecordedManager.onRefresh()"
  (selectRow)="timeRecordedManager.changeSelectRow($event)"
  (changePanelMode)="timeRecordedManager.onChangeTeamMemberPanelMode($event)"
  (onGroupBy)="timeRecordedManager.groupBy($event)"
  (selectGroup)="timeRecordedManager.onSelectGroup($event)"
  (clickGridButton)="timeRecordedManager.onClickGridButton($event)"
  (loadMoreData)="timeRecordedManager.onLoadMoreData($event)"
  (timeUpdateValue)="timeRecordedManager.onTimeUpdating($event)"
  (timeUpdateStartStop)="timeRecordedManager.onStopStartTimeRecording($event)"
  (saveTimeRecording)="timeRecordedManager.onSaveTimeRecording($event)"
  (exportToExcel)="timeRecordedManager.onExportToExcel()"
  (dateTypeChanged)="timeRecordedManager.onDateTypeChanged($event)"
  ></dps-time-recorded-layout>
  </dps-time-recorded-manager>`,

})
export class TimeRecordedManagerRouterHostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
