
import { Component, OnInit, Inject } from '@angular/core';
import { SystemJsPopupLoaderService } from './../../shell-desktop/services/system-js-popup-loader.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PostingPeriodManagerComponent } from './posting-period-manager.component';

@Component({
  selector: 'dps-posting-period-router-host.component',
  template: `<dps-posting-period-manager #manager [postingPeriodToken]="data.token" 
  (closePopup)="onClose($event)">
                  <dps-posting-period-layout
                  [dataLoading]="manager.PostingPeriodLoading$ | async"
                  [postingPeriodList]="manager.postingPeriodList$ | async"
                  [selectedPostingPeriod]="manager.selectedPostingPeriod$ | async"
                  (postingPeriodClose)="manager.onClosePostingPeriod($event)"
                  (setSelectedPostingPeriod)="manager.onSetSelectedPostingPeriod($event)">
                  </dps-posting-period-layout>
            </dps-posting-period-manager>`
})
export class PostingPeriodRouterHostComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: string },
    public dialogRef: MatDialogRef<PostingPeriodManagerComponent>) { }
  // constructor(private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}
