import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'dps-probate-account-desktop-popup',
  template: `<dps-probate-account-desktop-manager (closePopup)="onClose($event)"
  [token]="data.token"
  [openFrom]="data.openFrom"
  [matterData]="data.matterData"
  [isPopup]="data.isPopup"
  [editData]="data.editData"
  [probateTransId]="data.probateTransId"
  [legacyPercentage]="data.legacyPercentage"
   #manager>
  <dps-probate-account-layout
   [matterData]="data.matterData"
   [isPopup]="data.isPopup"
   [title]="data.title"
   [editData]="data.editData"
   [probateTransId]="data.probateTransId"
   [legacyPercentage]="data.legacyPercentage"
   [isLoading]="manager.isLoading$ | async"
   [savedData]="manager.savedData$ | async"
   [openFrom]="data.openFrom"
  (closePopup)="manager.close($event)"
  (submitSaveData)="manager.onSubmitSaveData($event)"
 >
  </dps-probate-account-layout>
  </dps-probate-account-desktop-manager>`,
  styles: []
})

export class ProbateAccountDesktopPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    token: string,
    openFrom: any,
    title: string,
    isPopup: boolean,
    matterData: any,
    editData: any,
    probateTransId: number,
    legacyPercentage: number
  },
    public dialogRef: MatDialogRef<ProbateAccountDesktopPopupComponent>, private dialog: MatDialog) { }

  ngOnInit() {

  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}
