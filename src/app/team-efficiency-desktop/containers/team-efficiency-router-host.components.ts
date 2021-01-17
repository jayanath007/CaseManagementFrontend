import { Component } from '@angular/core';
@Component({
    selector: 'dps-team-efficiency-router-host',
    template: `<dps-team-efficiency-manager #tEManager [teamEfficiencyToken]="token">
    <dps-team-efficiency-layout
    [monthList] = "tEManager.monthList$ | async"
    [departmentList]= "tEManager.departmentList$ | async"
    [timeRecodedData] = "tEManager.timeRecodedData$ | async"
    [timeRecordOption] = "tEManager.timeRecordOption$ | async"
    [isTimeRecordDataLoading] ="tEManager.isTimeRecordDataLoading$ | async"
    [selectedMonth] = "tEManager.selectedMonth$ | async"
    [selectedDepartment] = "tEManager.selectedDepartment$ | async"
    [selectedTeamMember] = "tEManager.selectedTeamMember$ | async"
    [teamMemberCount] = "tEManager.teamMemberCount$ | async"
    [isPageLoading] = "tEManager.isPageLoading$ | async"
    [timeRecordChartTitle] = "tEManager.timeRecordChartTitle$ | async"
    [adgedDebData] = "tEManager.adgedDebData$ | async"
    [billeTimesData] = "tEManager.billeTimesData$ | async"
    [matterData] = "tEManager.matterData$ | async"
    [homeCurrency] = "tEManager.homeCurrency$ | async"
    [eventYearSummery] = "tEManager.eventYearSummery$ | async"
    [userActivityLoading] = "tEManager. userActivityLoading$ | async"
    [activityTitle] = "tEManager. activityTitle$ | async"
    (updateTimeRecordOption) = "tEManager.updateTimeRecordOption($event)"
    (updateDepartment) = "tEManager.updateDepartment($event)"
    (updateMonth) = "tEManager.updateMonth($event)"
    (updateUser) = "tEManager.updateUser($event)"
    (updateMatterType) = "tEManager.onUpdateMatterType($event)"
    >
    </dps-team-efficiency-layout>
    </dps-team-efficiency-manager>`,
    styles: []
})

export class TeamEfficiencyRouterHostComponent {
    token = 'TeamEfficiencyPage';
    constructor() {
    }
}
