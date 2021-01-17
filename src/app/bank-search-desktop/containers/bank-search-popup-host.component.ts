import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'dps-authorisations-router-host',
  template: `<dps-bank-search-manager #manager [authorisationsToken]="data.token" [inputData]="data.input"
              (closePopup)="onClose($event)">
              <dps-bank-search-layout
              [viewData]="manager.viewData$ | async"
              [columnDef]="manager.columnDef$ | async"
              [paginatorDef]="manager.paginatorDef$ | async"
              [groupList]="manager.groupList$ | async"
              [feeEarnerList]="manager.feeEarnerList$ | async"
              [user]="manager.user$ | async"
              [selectedRowCount]="manager.selectedRowCount$ | async"
              (selectedRowItem)="manager.onSelectedRowItem($event)"
              (closeAuthorisationsPopup)="manager.onClosePopup($event)"
              (controllersValueChange)="manager.onControllersValueChange($event)"
              (changePage)="manager.onChangePage($event)"
              (viewReportData)="manager.onViewReport($event)"
              (columsSortApply)="manager.onToggleSorting($event)">
              </dps-bank-search-layout>
              </dps-bank-search-manager>`
})
export class BankSearchPopupHostComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<BankSearchPopupHostComponent>) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}
