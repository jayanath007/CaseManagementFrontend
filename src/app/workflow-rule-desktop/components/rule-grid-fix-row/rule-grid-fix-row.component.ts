import { Observable } from 'rxjs';
import {
  Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  WorkflowRuleListData, WorkflowRuleSelectedItemData,
  RuleOperator, WorkflowRuleOperatorItemData, WorkflowRuleActionItemData, WorkflowRuleTextValuChangeData
} from '../../../workflow-rule-core/models/interfaces';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog} from '@angular/material';
import * as _ from 'lodash';
import { SettingKey } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';

@Component({
  selector: 'dps-rule-grid-fix-row',
  templateUrl: './rule-grid-fix-row.component.html',
  styleUrls: ['./rule-grid-fix-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuleGridFixRowComponent implements OnInit, OnChanges {
  @Input() ruleRowData: WorkflowRuleListData;
  @Input() selectedWorkflowRuleList: WorkflowRuleListData[];
  @Input() columnDef;

  @Output() onRowClick = new EventEmitter<WorkflowRuleSelectedItemData>();
  @Output() openWorkFlowMenuPopup = new EventEmitter<WorkflowRuleListData>();
  @Output() onOperatorItemClick = new EventEmitter<WorkflowRuleOperatorItemData>();
  @Output() onActionItemClick = new EventEmitter<WorkflowRuleActionItemData>();
  RuleOperator = RuleOperator;
  @Output() onTestVarNoItemClick = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onCriteriaChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onItemChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onDescriptionChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() btnDelete = new EventEmitter();

  @ViewChild('wfRTest') private wfRTest: ElementRef;

   constructor(private dialog: MatDialog, private access: AccessControlService) { }

  amendScreensWorkflow$ = new Observable<any>();

  ngOnInit() {
    this.amendScreensWorkflow$ = this.access.getSettingValue(SettingKey.AmendScreensWorkflow);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isNotDeleted) {

    }
  }


  rowItemClick(SelectedItem, event) {
    const item: WorkflowRuleSelectedItemData = {
      item: SelectedItem,
      isWithShiftKey: event.shiftKey,
      isWithCtrlKey: event.ctrlKey
    };
    this.onRowClick.emit(item);
  }
  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
  onEditItem(selectedItem: WorkflowRuleListData) {
    this.openWorkFlowMenuPopup.emit(selectedItem);
  }

  operatorItemClick(selectedItem: WorkflowRuleListData, operator: RuleOperator) {
    console.log('operatorItemClick', operator);
    const item: WorkflowRuleOperatorItemData = {
      item: selectedItem,
      operator: operator
    };
    this.onOperatorItemClick.emit(item);
  }

  actionItemClick(selectedItem: WorkflowRuleListData, action: number) {
    console.log('actionItemClick', action);
    const item: WorkflowRuleActionItemData = {
      item: selectedItem,
      action: action
    };
    this.onActionItemClick.emit(item);
  }

  testVarNoChange(selectedItem: WorkflowRuleListData, event) {
    if (event && !event.target.value) {
      this.onBtnDelete();
      // const msgText = `'Test Var. No' is not a valid variable number.`;
      // this.openMsg(msgText);
    } else if (event) {
      this.IsTestVarValidation(selectedItem, event.target.value);
    } else {
      this.addNewTestVarRow(selectedItem, event.target.value);
    }
  }
  addNewTestVarRow(selectedItem: WorkflowRuleListData, value) {
    const item: WorkflowRuleTextValuChangeData = {
      item: selectedItem,
      value: value
    };
    this.onTestVarNoItemClick.emit(item);
  }
  openMsg(msgText) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Invalid Entry',
        message: msgText
      },
      contentParams: {},
      data: { messageType: 'warning' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.wfRTest.nativeElement.focus();
    });
  }
  neumericValidation(selectedItem: WorkflowRuleListData, value: string): boolean {
    let rtn = false;
    if (+value) {
      if (5000 < +value) {
        // const msgText = `The variable number entered is out of range.`;
        // this.openMsg(msgText);
        rtn = false;
      } else {
        rtn = true;
      }
    }
    return rtn;
  }
  IsTestVarValidation(selectedItem: WorkflowRuleListData, value: string) {
    if (+value && this.neumericValidation(selectedItem, value)) {
      this.addNewTestVarRow(selectedItem, value);
    } else if (value) {
      // const first = value.slice(0, 1);
      const firstTwo = value.slice(0, 2);
      const otherPart = value.slice(2);
      if ((firstTwo === 'o' || firstTwo === 'O' || firstTwo === 'ov' || firstTwo === 'OV')
        && this.neumericValidation(selectedItem, otherPart)) {
        this.addNewTestVarRow(selectedItem, value);
      } else {
        const msgText = `'Test Var. No' is not a valid variable number.`;
        this.openMsg(msgText);
      }
    } else {
      const msgText = `'Test Var. No' is not a valid variable number.`;
      this.openMsg(msgText);
    }
  }

  criteriaChange(selectedItem: WorkflowRuleListData, event) {
    console.log('actionItemClick', event.target.value);
    const item: WorkflowRuleTextValuChangeData = {
      item: selectedItem,
      value: event.target.value
    };
    this.onCriteriaChange.emit(item);

  }

  itemChange(selectedItem: WorkflowRuleListData, event) {
    console.log('actionItemClick', event.target.value);
    const item: WorkflowRuleTextValuChangeData = {
      item: selectedItem,
      value: event.target.value
    };
    this.onItemChange.emit(item);

  }
  descriptionChange(selectedItem: WorkflowRuleListData, event) {
    console.log('actionItemClick', event.target.value);
    const item: WorkflowRuleTextValuChangeData = {
      item: selectedItem,
      value: event.target.value
    };
    this.onDescriptionChange.emit(item);

  }
  get checkIsSelected() {

    if (this.selectedWorkflowRuleList &&
      this.selectedWorkflowRuleList.length > 0 && this.selectedWorkflowRuleList.find((row) => row.rowOrder === this.ruleRowData.rowOrder)) {
      return true;
    } else {
      return false;
    }
  }
  onBtnDelete() {
    this.btnDelete.emit();
  }

  get isDeleteBtnShow() {
    if (this.selectedWorkflowRuleList && this.selectedWorkflowRuleList.length === 1 &&
      this.selectedWorkflowRuleList[0].rowOrder === this.ruleRowData.rowOrder) {
      return true;
    } else {
      return false;
    }
  }

  getSettingValueByKey(setingKey: SettingKey) {
    this.access.getSettingValue(setingKey);
  }

}
