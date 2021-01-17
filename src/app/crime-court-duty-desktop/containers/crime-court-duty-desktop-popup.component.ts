import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatterKeyInfor } from '../../core/lib/matter';

@Component({

  selector: 'dps-crime-court-duty-desktop-popup',
  template: `<dps-crime-court-duty-desktop-manager #manager [token]="data.token" [inputData]="data.input" (closePopup)="onClose()">
                <dps-crime-court-duty-layout
                [feeEarnerList]="manager.feeEarnerList$|async"
                [branchList]="manager.branchList$|async"
                [isloading]="manager.isloading$|async"
                [model]="manager.model$|async"
                [isDirty]="manager.isDirty$|async"
                [locationLookupList]="manager.locationLookupList$|async"
                [timeRecords]="manager.recordsHistory$|async"
                [isLoadinghistory]="manager.isLoadinghistory$|async"
                [gridDataPaginatorDef]="manager.gridDataPaginatorDef$|async"
                [gridDataFilter]="manager.gridDataFilter$|async"
                (changeModel)="manager.changeModel($event)"
                (exitModule)="manager.onClosePopup()"
                (userAction)="manager.onUserAction($event)"
                (selectItemForEdit)="manager.onSelectItemForEdit($event)"
                (changePage)="manager.onChangePage($event)"
                (changeGridFilter)="manager.onChangeGridFilter($event)">
                </dps-crime-court-duty-layout>
            </dps-crime-court-duty-desktop-manager>`,

})
export class CrimeCourtDutyDesktopPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: string, input: MatterKeyInfor, },
    public dialogRef: MatDialogRef<CrimeCourtDutyDesktopPopupComponent>, private dialog: MatDialog) { }

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }

}
