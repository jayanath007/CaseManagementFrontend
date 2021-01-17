
import { Component, OnInit, Inject } from '@angular/core';
import { SystemJsPopupLoaderService } from './../../shell-desktop/services/system-js-popup-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BillingNarrativeManagerComponent } from './billing-narrative-manager.component';

@Component({
  selector: 'dps-billing-narrative-router-host.component',
  template: `<dps-billing-narrative-manager #manager [narrativeToken]="data.token" [inputData]="data.input"
              (closePopup)="onClose($event)">
              <dps-billing-narrative-layout
              [isLoading]="manager.isLoading$ | async"
              [narrativeData]="manager.narrativeGroups$ | async"
              [narrativeGroupItems]="manager.narrativeGroupItems$ | async"
              [narrativeInfo]="manager.narrativeInfo$ | async"

              (selectNarrativeGroup) = "manager.onSelectNarrativeGroup($event)"
              (selectNarrativeGroupItem) = "manager.onSelectNarrativeGroupItem($event)"
              (saveNarrativeInfo) = "manager.onSaveNarrativeInfo($event)"
              (viewChange) = "manager.onViewChange($event)"
              (selectNarrativePopup)="onClose($event)"
              (deleteNarratives)="manager.onDeleteNarrativeItem($event)"
              (deleteGroup)="manager.onDeleteGroup($event)"
              (closeNarrativePopup)="manager.onClosePopup($event)">
              </dps-billing-narrative-layout>
            </dps-billing-narrative-manager>`
})
export class BillingNarrativeRouterHostComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: string, token: string },
    public dialogRef: MatDialogRef<BillingNarrativeManagerComponent>) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}
