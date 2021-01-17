
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ClientSearchPopupData } from '../../client-search-core/models/interfaces';

@Component({
  selector: 'dps-client-search-popup-manager',
  template: `
  <dps-client-search-manager #clientPopupManager [isPopup]=true [clientSearchToken]="data.token" [inputData]="data.input"
  (closePopup)="onClose($event)">
  <dps-client-search-popup
[clientSearchGridData]="(clientPopupManager.clientSearchGridData$ | async)"
[clientColumnDef]="clientPopupManager.clientColumnDef$ | async"
[searchText] = "clientPopupManager.searchText$ | async"
[clientPaginatorDef]="clientPopupManager.clientPaginatorDef$ | async"
[totalItems]= "clientPopupManager.totalItems$ | async"
[gridLoading] ="clientPopupManager.gridLoading$ | async"
[popupInputData]="clientPopupManager.popupInutData$ | async"
[menuItem]="clientPopupManager.menuItem$ | async"
(viewChange)="clientPopupManager.onViewChange($event)"
(clientPopupClosed)="clientPopupManager.closeClientPopup()"
(selectedClientRowData)="clientPopupManager.selectedRowData($event,data.token)"
(SearchTextChange) = "clientPopupManager.onClientSearchTextChange($event)"
(SearchTextClick) ="clientPopupManager.onClientSearchTextClick($event)"
(updateSelectedSearchTextClear) ="clientPopupManager.onClientSearchTextClear($event)"
(clientSearchSubmit) ="clientPopupManager.onClientSearchTextClick($event)"></dps-client-search-popup>
 </dps-client-search-manager>
  `,
  styles: []
})


export class ClientSearchPopupManagerComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: ClientSearchPopupData, token: string },
    public dialogRef: MatDialogRef<ClientSearchPopupManagerComponent>) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}


