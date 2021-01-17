
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'dps-matter-search-manager-router-host',
    template: `
        <dps-matter-search-manager #matterManager [matterSearchToken]="'MatterSearchPage'"
         [postingPeriod]="matterManager.postingPeriod$ | async">
        <dps-matter-search-layout
        [departmentList]="matterManager.departmentData$ | async"
        [searchText]="matterManager.searchText$ | async"
        [isInactiveFeeEarner]="matterManager.isInactiveFeeEarner$ | async"
        [isClosedMatters]="matterManager.isClosedMatters$ | async"
        [isCompletedMatters]="matterManager.isCompletedMatters$ | async"
        [columnDef]="matterManager.columnDef$ | async"
        [activeOutlet]="matterManager.activeOutlet$ | async"
        [matterData]="(matterManager.matterGridData$ | async)"
        [paginatorDef]="matterManager.paginatorDef$ | async"
        [totalItems]= "matterManager.totalItems$ | async"
        [totalBillsOutstanding]= "matterManager.totalBillsOutstanding$ | async"
        [totalMatterCount]= "matterManager.totalMatterCount$ | async"
        [activeView]="matterManager.activeView$ | async"
        [selectedDepartment]="matterManager.selectedDepartment$ | async"
        [isDepartmentLoading]="matterManager.departmentLoading$ | async"
        [selectedTeamMember]="matterManager.selectedTeamMember$ | async"
        [teamMemberCount]="matterManager.teamMemberCount$ | async"
        [isUserExpandRow]="matterManager.isUserExpandRow$ | async"
        [isGridLoading]="matterManager.gridLoading$ | async"
        [homeCurrancy]="matterManager.homeCurrancy$ | async"
        [teamMemberToken]="matterManager.teamMemberToken"
        [initView]="matterManager.initView$ | async"
        [memListPanelMode]="matterManager.memListPanelMode$ | async"
        [isMLSEnableMatter]="matterManager.isMLSEnableMatter$|async"
        [menuItem]="matterManager.menuItems"
        [isPlotUser]="matterManager.isPlotUser$ | async"
        [plotVarValues]="matterManager.plotVarValues$ | async"
        (toggleExpand)="matterManager.onToggleRow($event)"
        (viewChange)="matterManager.onViewChange($event)"
        (onUpdateOpenCaseClick)="matterManager.clickOpenCase($event)"
        (onUpdateTimeRecordingClick)="matterManager.clickTimeRecord($event)"
        (onUpdateNewMailClick)="matterManager.clickNewMail($event)"
        (refresh)="matterManager.onRefresh()"
        (ledgerCardClick)="matterManager.onOpenLedgerCard($event)"
        (changePanelMode)="matterManager.onChangeTeamMemberPanelMode($event)"
        (openMLS)="matterManager.onOpenMLS($event)"
        (clickMatterMenu)="matterManager.onMatterMenu($event)"
        (openEChitWithMatter)="matterManager.onOpenEChitWithMatter($event)"
        (openBillingRequest)="matterManager.onOpenBillingRequestPopup($event)"
        (openReferralNoteAndDate)="matterManager.onOpenReferralNoteAndDate($event)"
        ></dps-matter-search-layout>
        </dps-matter-search-manager>
    `,
    styles: []
})
export class MatterSearchManagerRouterHostComponent implements OnInit {
    token;
    constructor() {
    }

    ngOnInit() {
    }
}
