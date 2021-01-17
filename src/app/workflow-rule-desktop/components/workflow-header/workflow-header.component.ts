import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { WorkflowRuleListData } from '../../../workflow-rule-core/models/interfaces';
import { MatDialog } from '@angular/material';
import { SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';

@Component({
  selector: 'dps-workflow-header',
  templateUrl: './workflow-header.component.html',
  styleUrls: ['./workflow-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowHeaderComponent implements OnInit {

  @Input() selectedWorkflowRuleList: WorkflowRuleListData[];
  @Input() workflowRuleList: WorkflowRuleListData[];

  @Output() onAddNewRuleClick = new EventEmitter();
  @Output() onSaveWorkflowRuleClick = new EventEmitter();
  @Output() onDeleteWorkflowRulesClick = new EventEmitter();
  @Output() onExitWorkflowRulesClick = new EventEmitter();
  @Output() onExportRulesClick = new EventEmitter();
  @Output() onImportRulesClick = new EventEmitter();
  @Output() onRuleUpClick = new EventEmitter();
  @Output() onRuleDownClick = new EventEmitter();


  amendScreensWorkflow$ = new Observable<any>();

  constructor(private dialog: MatDialog, private access: AccessControlService) { }

  ngOnInit() {
    this.amendScreensWorkflow$ = this.access.getSettingValue(SettingKey.AmendScreensWorkflow);
  }


  addNewRule() {
    this.onAddNewRuleClick.emit();
  }

  rowMoveUp() {
    this.onRuleUpClick.emit();
  }

  rowMoveDown() {
    this.onRuleDownClick.emit();
  }

  deleteWorkflowRules() {
    this.onDeleteWorkflowRulesClick.emit();
  }

  SaveWorkflowRules() {
    this.onSaveWorkflowRuleClick.emit();
  }
  get upBtnEnable() {

    if (this.workflowRuleList && this.selectedWorkflowRuleList && this.selectedWorkflowRuleList.length === 1 &&
      this.selectedWorkflowRuleList[0].rowOrder > (this.workflowRuleList[0].rowOrder)) {
      return true;
    } else {
      return false;
    }
  }

  get downBtnEnable() {

    if (this.workflowRuleList && this.selectedWorkflowRuleList && this.selectedWorkflowRuleList.length === 1 &&
      this.selectedWorkflowRuleList[0].rowOrder < (this.workflowRuleList[this.workflowRuleList.length - 1].rowOrder)) {
      return true;
    } else {
      return false;
    }
  }

  get btnExportEnable() {
    if (this.workflowRuleList && this.workflowRuleList.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  get getBtnDeleteEnable() {

    if (this.workflowRuleList && this.selectedWorkflowRuleList && this.selectedWorkflowRuleList.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  exportRule() {
    this.onExportRulesClick.emit();
  }
  importRule(fileData) {
    this.onImportRulesClick.emit(fileData);
  }
  closePopup() {
    this.onExitWorkflowRulesClick.emit();
  }

}
