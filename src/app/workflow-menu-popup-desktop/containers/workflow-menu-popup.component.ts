import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkFlowMenuPopupInput } from '../../core/lib/workflow';

@Component({
  selector: 'dps-work-flow-menu-popup',
  template: `<dps-workflow-menu-popup-manager #workFlowPopup [inputData]="data.input" [token]="data.token" (closePopup)="onClose($event)">
  <dps-workflow-menu-popup-layout
    [list]="workFlowPopup.WorkflowMenuList$ | async"
    [loading] = "workFlowPopup.loading$ | async"
    (selectNood)="workFlowPopup.onSelectNood($event)"
    (close)="workFlowPopup.close()">
  </dps-workflow-menu-popup-layout>
</dps-workflow-menu-popup-manager>`,

})
export class WorkflowMenuPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WorkflowMenuPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkFlowMenuPopupInput) { }

  ngOnInit() {
  }

  onClose(event) {
    this.dialogRef.close(event);
  }

}



