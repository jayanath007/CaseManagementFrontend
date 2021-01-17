import { Component, OnInit, Input, EventEmitter, Inject } from '@angular/core';
import { ITreeOptions } from 'angular-tree-component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dps-screen-edit-popup',
  template: `
  <dps-screen-edit-content-manager [token]="data.token" [type]="data.input.type" #screenEditContentManager (close)="onClose($event)">
    <dps-screen-edit-layout [screenEditComponentTreeData]="screenEditContentManager.screenEditComponentTreeData$|async"
    [screenEditRuleListData]="screenEditContentManager.screenEditRuleListData$|async" [options]="options"
    [isLoading]="screenEditContentManager.isLoading$|async"
    [isSubmited]="screenEditContentManager.isSubmited$|async"
    [componentStructure]="screenEditContentManager.componentStructure$|async"
    (close)="screenEditContentManager.onClose($event)" (submit)="screenEditContentManager.onSubmit($event)">
    </dps-screen-edit-layout>
  </dps-screen-edit-content-manager>
  `,
  styleUrls: []
})
export class ScreenEditPopupComponent implements OnInit {
  options: ITreeOptions;
  close = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: { type: string }, token: string },
    public dialogRef: MatDialogRef<any>) { }

  ngOnInit() {

    this.options = {
      idField: 'scL_Name',
      displayField: 'scL_Caption',
      childrenField: 'children',
      isExpandedField: 'expanded'
    };
  }

  onClose(event) {
    this.dialogRef.close();
  }
}


