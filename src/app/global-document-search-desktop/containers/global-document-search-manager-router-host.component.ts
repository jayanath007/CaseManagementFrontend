import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-global-document-search-manager-router-host',
  template: `<dps-global-document-search-manager #globalDocumentSearchManager [token]="'globalDocumentSearch'">
    <dps-global-document-search-layout
    [columnDef]="globalDocumentSearchManager.gridColoum$ | async"
    [isLoading]="globalDocumentSearchManager.isLoading$ | async"
    [filterViewModel]="globalDocumentSearchManager.filterViewModel$ | async"
    [feeEarnerList] ="globalDocumentSearchManager.feeEarnerList$ | async"
    [appCodeList] ="globalDocumentSearchManager.appCodeList$ | async"
    [gridData] ="globalDocumentSearchManager.gridData$ | async"
    [documentViewOpened] ="globalDocumentSearchManager.DocumentViewOpened$ | async"
    [totalItem] ="globalDocumentSearchManager.totalItem$ | async"
    [filterExpanded] ="globalDocumentSearchManager.filterExpanded$ | async"
    [paginatorDef] ="globalDocumentSearchManager.paginatorDef$ | async"

    (closeViewer)="globalDocumentSearchManager.onCloseViewer($event)"
    (removeFilterRow)="globalDocumentSearchManager.onRemoveFilterRow($event)"
    (clickGridRow)="globalDocumentSearchManager.onClickGridRow($event)"
    (addFilterRow) = "globalDocumentSearchManager.onAddFilterRow($event)"
    (changeSearchText) = "globalDocumentSearchManager.onChangeSearchText($event)"
    (documentClear)="globalDocumentSearchManager.onDocumentClear($event)"
    (searchDoc) = "globalDocumentSearchManager.onSearchDocument($event)"
    (viewChange)="globalDocumentSearchManager.onViewChange($event)"
    (refresh)="globalDocumentSearchManager.onRefresh($event)"
    (openInPopup) = "globalDocumentSearchManager.onOpenInPopup($event)"
    (openCaseClick)="globalDocumentSearchManager.onOpenCaseClick($event)"
    (share)="globalDocumentSearchManager.onShareClick($event)"
    (filterItemChange) = "globalDocumentSearchManager.onFilterItemChange($event)">

    </dps-global-document-search-layout>
  </dps-global-document-search-manager>`,
})
export class GlobalDocumentSearchManagerRouterHostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
