
import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { PageSetupManagerComponent } from './page-setup-manager.component';

@Component({
  selector: 'dps-page-setup-router-host.component',
  template: `<dps-page-setup-manager #manager [pageSetupToken]="data.token" [inputData]="data.input"
  (closePopup)="onClose()">
                  <dps-page-setup-layout
                  (close)="onClose()"
                  (changePageSetupValue)="manager.onChangePageSetupValue($event)"
                  (saveChanges)="manager.onSaveChanges()"
                  (differentFirstPage)="manager.onDifferentFirstPage($event)"
                  (differentPageHeaderFooter)="manager.onDifferentPageHeaderFooter($event)"
                  [isLoading]="manager.PageSetupLoading$ | async"
                  [setupData]="manager.PageSetupData$ | async"
                  [popupClose]="manager.PopupClose$ | async"
                  [differentPage]="manager.DifferentPage$ | async"
                  [isDifferentPageHeaderFooter]="manager.isDifferentPageHeaderFooter$ | async"
                  >
                  </dps-page-setup-layout>
            </dps-page-setup-manager>`
})
export class PageSetupRouterHostComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: string, token: string },
    public dialogRef: MatDialogRef<PageSetupManagerComponent>) { }
  // constructor(private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  onClose() {
    this.dialogRef.close();
  }
}
