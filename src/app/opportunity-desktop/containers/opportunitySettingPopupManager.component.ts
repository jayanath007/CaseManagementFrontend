import { Component, OnInit, Inject, Input } from '@angular/core';
import { BaseOpportunityManager } from '../../opportunity-core/containers/base-opportunity-manager';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: `dps-Opportunity-settings-popup-manager`,
  template: `
  <dps-opportunities-settings  *ngIf="!data?.input?.isOpportunity"
              [settingIsLoading]="settingIsLoading$|async"
              [appCodes]="appCodeList$|async"
              [screen]="screen$|async"
              [addedScreenList]="addedScreenList$|async"
              (changeAppId)="onChangeSettingAppId($event)"
              (addItem)="onAddScreenItem($event)"
              (editScreenItem)="onEditScreenItem($event)"
              (removeScreenItem)="onRemoveScreenItem($event)"
              (saveScreenList)="onSaveScreenList($event)"
              (colse)="onColse()">
   </dps-opportunities-settings>
  <dps-oppertunity-settings *ngIf="!!data?.input?.isOpportunity"
               [file]="emailTemplete$|async"
               [previousEmailTemplete]="previousEmailTemplete$|async"
               [loading]="settingIsLoading$|async"
              (uploadEmailTemplete)="onUploadEmailTemplete($event)"
              (close)="onColse()">
  </dps-oppertunity-settings>`
})
export class OpportunitySettingPopupManagerComponent extends BaseOpportunityManager implements OnInit {

  constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: {
    input: { isOpportunity: boolean }
  },
    public dialogRef: MatDialogRef<OpportunitySettingPopupManagerComponent>) {
    super(store);
  }

  ngOnInit() {
    this.initOppertunitySetting(this.data.input ? this.data.input.isOpportunity : false);
  }

  onColse() {
    this.dialogRef.close();
  }

}


