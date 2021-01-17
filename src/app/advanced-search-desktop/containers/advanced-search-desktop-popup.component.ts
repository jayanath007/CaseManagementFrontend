import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-advanced-search-desktop-popup',
  template: `<dps-advanced-search-manager #advancedSearchManager [token]="'advancedSearch'">
    <dps-advanced-search-layout
    [columnDef]="advancedSearchManager.columnDef$ | async"
    [clientList]="advancedSearchManager.clientList$ | async"
    [advancedSearchViewMode]="advancedSearchManager.advancedSearchViewMode$ | async"
    [appCodeList]="advancedSearchManager.appCodeList$ | async"
    [gridDataList]="advancedSearchManager.gridDataList$ | async"
    [coloumnArray]="advancedSearchManager.coloumnArray$ | async"
    [isLoading]="advancedSearchManager.isLoading$ | async"
    [branchList]="advancedSearchManager.branchList$ | async"
    [total]="advancedSearchManager.total$| async"
    [paginatorDef]="advancedSearchManager.paginatorDef$| async"

    (viewChange)="advancedSearchManager.onViewChange($event)"
    (saveBranch)="advancedSearchManager.onSaveBranch($event)"
    (openCaseClick)="advancedSearchManager.onOpenCaseClick($event)"
    (changeAppCode)="advancedSearchManager.onChangeAppCode($event)"
    (advancedSearchClick)="advancedSearchManager.onAdvancedSearchClick()"
    (coloumnHeaderRightClick)="advancedSearchManager.onColoumnHeaderRightClick($event)">
    </dps-advanced-search-layout>
  </dps-advanced-search-manager>`,
})
export class AdvancedSearchDesktopPopupComponent implements OnInit {


  constructor() { }

  ngOnInit() {
  }

}
