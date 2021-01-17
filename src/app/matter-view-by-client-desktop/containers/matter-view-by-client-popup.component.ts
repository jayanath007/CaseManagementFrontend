import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-matter-view-by-client-popup',
  template: `<dps-matter-view-by-client-manager [inputData]="data.input"
  [token]="data.token" (closePopup)="onClose($event)" #matterbyclientmanager>
  <dps-matter-view-by-client-layout
  [isLoading]="matterbyclientmanager.isLoading$ | async"
  [gridColoumn]="matterbyclientmanager.gridColoumn$ | async"
  [paginatorDef]="matterbyclientmanager.paginatorDef$ | async"
  [gridData]="matterbyclientmanager.gridData$ | async"
  [totalItem]="matterbyclientmanager.totalItem$ | async"
  [matterLabel]="matterbyclientmanager.matterLabel"
  [token]="data.token"
  (viewChange) = "matterbyclientmanager.onViewChange($event)"
  (selectedRow)="matterbyclientmanager.onSelectRow($event)">
  </dps-matter-view-by-client-layout>
  </dps-matter-view-by-client-manager>`,

})
export class MatterViewByClientPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MatterViewByClientPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string, input: any }) { }

  ngOnInit() {
  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}

