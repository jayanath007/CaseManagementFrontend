
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'dps-client-search-manager-router-host',
    template: `
        <dps-client-search-manager #clientManager [clientSearchToken]="token">
      <dps-client-search-layout
      [clientColumnDef]="clientManager.clientColumnDef$ | async"
      [clientPaginatorDef]="clientManager.clientPaginatorDef$ | async"
      [clientSearchGridData] = "clientManager.clientSearchGridData$ | async"
      [matterColumnDef]="clientManager.matterColumnDef$ | async"
      [searchText] = "clientManager.searchText$ | async"
      [gridLoading] = "clientManager.gridLoading$ | async"
      [totalItems]= "clientManager.totalItems$ | async"
      [user]="clientManager.user$ | async"
      [showSearchHint]="clientManager.showSearchHint$ | async"
      [menuItem]="clientManager.menuItem$ | async"
      [isPlotUser]="clientManager.isPlotUser"
      (SearchTextChange) = "clientManager.onClientSearchTextChange($event)"
      (SearchTextClick) ="clientManager.onClientSearchTextClick($event)"
      (SearchTextClear) ="clientManager.onClientSearchTextClear($event)"
      (toggleClientSearchExpand) = "clientManager.toggleClientExpand($event)"
      (toggleMatterExpand) = "clientManager.toggleMatterExpand($event)"
      (onUpdateOpenCaseClick)="clientManager.clickOpenCase($event)"
      (onUpdateTimeRecordingClick)="clientManager.clickTimeRecord($event)"
      (onUpdateNewMailClick)="clientManager.clickNewMail($event)"
      (refresh)="clientManager.onRefresh()"
      (onUpdateLedgerCardClick)="clientManager.clickLedgerCard($event)"
      (clickClientMenu)="clientManager.onClickClientMenu($event)"
      (openEchitPopup)="clientManager.onOpenEchitPopup($event)"
      (matterGridPageChange)="clientManager.onMatterGridPageChange($event)"
      >
      </dps-client-search-layout>
        </dps-client-search-manager>
    `,
    styles: []
})

export class ClientSearchManagerRouterHostComponent implements OnInit {
    token = 'ClientSearchPage';
    constructor() {
    }

    ngOnInit() {

    }
}
