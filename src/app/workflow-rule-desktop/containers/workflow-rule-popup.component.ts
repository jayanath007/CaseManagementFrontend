import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '../../core/lib/component-base';
import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkflowInputData } from '../../workflow-rule-core/models/interfaces';
@Component({
  selector: 'dps-workflow-rule-popup',
  template: `<dps-workflow-rule-manager [inputData]="data.input" [token]="data.token" (closePopup)="onClose($event)" #manager>
    <dps-workflow-rule-layout
    [isLoading] = "manager.isLoading$ | async"
    [isDirty] = "manager.isDirty$ | async"
    [columnDef] = "manager.columnsForWorkflowRule.columnDef"
    [workflowRuleList] =  "manager.workflowRuleList$ | async"
    [selectedWorkflowRuleList] = "manager.selectedWorkflowRuleList$ | async"
    [isSaveApply] =  "manager.isSaveApply$ | async"
    [matterData] =  "manager.matterData$ | async"
    [exportData] = "manager.exportData$ | async"
    (onAddNewRuleClick) = "manager.onAddNewRuleClick($event)"
    (onSaveWorkflowRuleClick) =" manager.onSaveWorkflowRuleClick($event)"
    (onRuleUpClick) = "manager.onRuleUpClick($event)"
    (onRuleDownClick)= "manager.onRuleDownClick($event)"
    (onDeleteWorkflowRulesClick) ="manager.onDeleteWorkflowRulesClick($event)"
    (onExitWorkflowRulesClick) ="manager.onExitWorkflowRulesClick($event)"
    (onRowClick)= "manager.onRowClick($event)"
    (onExportRulesClick)= "manager.onExportRulesClick($event)"
    (onImportRulesClick)= "manager.onImportRulesClick($event)"
    (onOperatorItemClick) = "manager.onOperatorItemClick($event)"
    (onActionItemClick) = "manager.onActionItemClick($event)"
    (onTestVarNoItemClick) ="manager.onTestVarNoItemClick($event)"
    (onCriteriaChange)="manager.onCriteriaChange($event)"
    (onItemChange)="manager.onItemChange($event)"
    (onItemSelect)="manager.onItemSelect($event)"
    (onDescriptionChange)="manager.onDescriptionChange($event)"
    (changeRulePopUpToken)="manager.onChangeRulePopUpToken($event)">
    </dps-workflow-rule-layout>
    </dps-workflow-rule-manager>`,
  styles: []
})
export class WorkflowRulePopupComponent implements OnInit {
  inputData;
  token: string;
  close = new EventEmitter();

  constructor( @Inject(MAT_DIALOG_DATA) public data: { input: WorkflowInputData, token: string },
    public dialogRef: MatDialogRef<WorkflowRulePopupComponent>) { }

  ngOnInit() {
  }
  onClose(event) {
    this.dialogRef.close(event);
  }
}
