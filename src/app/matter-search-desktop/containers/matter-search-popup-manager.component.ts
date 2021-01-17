
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatterInfo } from '../../chaser-core/models/interfaces';

@Component({
  selector: 'dps-matter-search-popup-manager',
  template: `
  <dps-matter-search-manager #matterPopupManager [isPopup]=true
  [matterSearchToken]="data.token" [inputData]="data.input" (closePopup)="onClose($event)">
  <dps-matter-search-popup fxFlex="" fxFlexFill=""
  [columnDef]="matterPopupManager.columnDef$ | async"
  [matterData]="(matterPopupManager.matterGridData$ | async)"
  [isMatterCreate]="matterPopupManager.isMatterCreate"
  [basePopupType]="matterPopupManager.basePopupType"
  [paginatorDef]="matterPopupManager.paginatorDef$ | async"
  [totalItems]="matterPopupManager.totalItems$ | async"
  [activeView]="matterPopupManager.activeView$ | async"
  [searchText]="matterPopupManager.searchText$ | async"
  [isClosedMatters]="matterPopupManager.isClosedMatters$ | async"
  [isDepartmentLoading]="matterPopupManager.departmentLoading$ | async"
  [isGridLoading]="matterPopupManager.gridLoading$ | async"
  [isPlotUser]="matterPopupManager.isPlotUser$ | async"
  [plotVarValues]="matterPopupManager.plotVarValues$ | async"
  (rowSelect)="matterPopupManager.onRowSelect($event)"
  (selectedRowData)="matterPopupManager.selectedRowData($event)"
  (viewChange)="matterPopupManager.onViewChange($event)"
  (matterPopupClosed)="matterPopupManager.closeMatterPopup()"
  ></dps-matter-search-popup>
  </dps-matter-search-manager>
  `,
  styles: []
})

export class MatterSearchPopupManagerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<MatterSearchPopupManagerComponent>) { }

  ngOnInit() {
  }

  onClose(event) {
    this.dialogRef.close(event);
  }
}


