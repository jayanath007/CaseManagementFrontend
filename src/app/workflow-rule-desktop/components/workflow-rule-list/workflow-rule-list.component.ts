import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import {
  WorkflowRuleListData, WorkflowRuleSelectedItemData, WorkflowRuleOperatorItemData,
  WorkflowRuleActionItemData, WorkflowRuleTextValuChangeData
} from '../../../workflow-rule-core/models/interfaces';

@Component({
  selector: 'dps-workflow-rule-list',
  templateUrl: './workflow-rule-list.component.html',
  styleUrls: ['./workflow-rule-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowRuleListComponent implements OnInit {
  @Input() workflowRuleList: WorkflowRuleListData[];
  @Input() selectedWorkflowRuleList: WorkflowRuleListData[];
  @Input() columnDef;
  @Input() isMaximize: boolean;

  @Output() onRowClick = new EventEmitter<WorkflowRuleSelectedItemData>();
  @Output() onOperatorItemClick = new EventEmitter<WorkflowRuleOperatorItemData>();
  @Output() onActionItemClick = new EventEmitter<WorkflowRuleActionItemData>();
  @Output() onTestVarNoItemClick = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onCriteriaChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onItemChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onDescriptionChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onDeleteWorkflowRulesClick = new EventEmitter();
  @Output() openWorkFlowMenuPopup = new EventEmitter();



  constructor() { }

  ngOnInit() {
  }

  rowItemClick(event) {
    this.onRowClick.emit(event);
  }

  operatorItemClick(event) {
    this.onOperatorItemClick.emit(event);
  }

  actionItemClick(event) {
    this.onActionItemClick.emit(event);
  }

  testVarNoItemClick(event) {
    this.onTestVarNoItemClick.emit(event);
  }

  criteriaChange(event) {
    this.onCriteriaChange.emit(event);
  }
  itemChange(event) {
    this.onItemChange.emit(event);
  }
  descriptionChange(event) {
    this.onDescriptionChange.emit(event);
  }

  keyUpOnGrid(event) {
    if (event.keyCode === 46) {
      this.onDeleteWorkflowRulesClick.emit();
    }
  }

  onBtnDelete() {

    this.onDeleteWorkflowRulesClick.emit();
  }

  onEditItem(item) {
    this.openWorkFlowMenuPopup.emit(item);
  }

}
