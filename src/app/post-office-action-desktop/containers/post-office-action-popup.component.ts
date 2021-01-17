import { PostOfficeActionInputData } from './../../post-office-action-core/models/interfaces';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';





@Component({
  selector: 'dps-post-office-action-popup.component',
  template: `<dps-post-office-action-manager [inputData]="data.input" [token]="data.token" (closePopup)="onClose()" #manager>
  <dps-post-office-action-layout
                       [isLoading]="manager.isLoading$|async"
                       [model]="manager.model$|async"
                       [inputData]="manager.inputData$|async"
                       [isClose]="manager.isClose$|async"
                       [enabaleControlers]="manager.enabaleControlers$|async"
                       [feeEarnerList]="manager.feeEarnerList$|async"
                       [groupList]="manager.groupList$|async"
                       [actionList]="manager.actionList$|async"
                       [itemTypeList]="manager.itemTypeList$|async"
                       [diaryFoldesList]="manager.diaryFoldesList$|async"
                       (modelChange)="manager.onModelChange($event)"
                       (groupChange)="manager.onGroupChange($event)"
                       (closePopup)="onClose()"
                       (clickAction)="manager.onClickAction($event)"
                       >
                  </dps-post-office-action-layout>
             </dps-post-office-action-manager>`
})
export class PostOfficeActionPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: PostOfficeActionInputData, token: string },
    public dialogRef: MatDialogRef<PostOfficeActionPopupComponent>
    , private dialog: MatDialog) { }

  ngOnInit() {

  }

  onClose() {
    this.dialogRef.close();
  }

}
