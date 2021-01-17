import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'dps-billing-guide-desktop-popup',
  template: `<dps-billing-guide-desktop-manager (closePopup)="onClose($event)" [inputData]="data.input" [token]="data.token" #manager>
                <dps-billing-guide-layout  [isLoading]="manager.isLoading$ | async"
                  [timeOffset]="(manager.user$ | async)?.general?.dateTimeOffset"
                  [billedValueData]="manager.billedValueData$ | async"
                  [billingGuideData]="manager.billingGuideData$ | async"
                  [billingGuideNoFile]="manager.billingGuideNoFile$ | async"
                  [matterDisplyName]="manager.matterDisplyName$|async"
                  (search)="manager.onSearch($event)"
                  (submit)="manager.onSave($event)"
                  (analysisTypeChange)="manager.onAnalysisTypeChange($event)"
                  (saveFile)="manager.onSaveFile($event)"
                  (closePopup)="manager.close($event)">
                </dps-billing-guide-layout>
            </dps-billing-guide-desktop-manager>`,
  styles: []
})

export class BillingGuideDesktopPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: null, token: string },
    public dialogRef: MatDialogRef<BillingGuideDesktopPopupComponent>, private dialog: MatDialog) { }

  ngOnInit() {

  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}
