import { InforDialogComponent } from '../../../shared/components/infor-dialog/infor-dialog.component';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import {
  WorkflowRuleListData, WorkflowRuleSelectedItemData, WorkflowRuleOperatorItemData,
  WorkflowRuleActionItemData,
  WorkflowRuleTextValuChangeData,
  MatterData,
  WorkflowRuleFileData
} from '../../../workflow-rule-core/models/interfaces';
import { MatDialog } from '@angular/material';
import {
  InforDialogData, ConfirmDialogComponent, ConfirmDialogResultKind,
  ConfirmDialogData, ConfirmDialogWithCancelResultKind
} from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { WorkFlowMenuPopupInput } from '../../../core/lib/workflow';
import {
  ConfirmDialogComponentWithCancel
} from '../../../shared/components/confirm-dialog-with-cancel/confirm-dialog-with-cancel.component';

@Component({
  selector: 'dps-workflow-rule-layout',
  templateUrl: './workflow-rule-layout.component.html',
  styleUrls: ['./workflow-rule-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowRuleLayoutComponent implements OnInit, OnChanges {
  isMaximize = false;
  @Input() isLoading: boolean;
  @Input() isDirty: boolean;
  @Input() workflowRuleList: WorkflowRuleListData[];
  @Input() selectedWorkflowRuleList: WorkflowRuleListData[];
  @Input() columnDef;
  @Input() isSaveApply: boolean;
  @Input() matterData: MatterData;
  @Input() exportData: any;

  @Output() onAddNewRuleClick = new EventEmitter();
  @Output() onSaveWorkflowRuleClick = new EventEmitter();
  @Output() onDeleteWorkflowRulesClick = new EventEmitter();
  @Output() onExitWorkflowRulesClick = new EventEmitter();
  @Output() onRuleUpClick = new EventEmitter();
  @Output() onRuleDownClick = new EventEmitter();

  @Output() onExportRulesClick = new EventEmitter();
  @Output() onImportRulesClick = new EventEmitter<WorkflowRuleFileData>();
  @Output() onRowClick = new EventEmitter<WorkflowRuleSelectedItemData>();
  @Output() onOperatorItemClick = new EventEmitter<WorkflowRuleOperatorItemData>();
  @Output() onActionItemClick = new EventEmitter<WorkflowRuleActionItemData>();
  @Output() onTestVarNoItemClick = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onCriteriaChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onItemChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onItemSelect = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() onDescriptionChange = new EventEmitter<WorkflowRuleTextValuChangeData>();
  @Output() changeRulePopUpToken = new EventEmitter<string>();
  constructor(private dialog: MatDialog, private popupService: SystemJsPopupLoaderService) { }

  WorkflowRuleListToken: string;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.exportData && !changes.exportData.isFirstChange()) {
      if (window.navigator.userAgent.indexOf('Edge') > -1) {
        const binary_string = window.atob(this.exportData.data);
        const blobObject = new Blob([this.base64ToArrayBuffer(this.exportData.data)]);
        return window.navigator.msSaveBlob(blobObject, this.exportData.name);
      } else {
        const url = 'data:application/zip;base64,' + this.exportData.data;
        const link: any = document.createElement('a');
        link.download = this.exportData.name;
        link.href = url;
        link.click();
      }
    }
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onMaximizeClick() {
    this.isMaximize = !this.isMaximize;
  }

  scrollToBottom(): void {
    const ele = document.getElementsByClassName('workflow-scroll');
    const eleArray = <Element[]>Array.prototype.slice.call(ele);
    eleArray.map(val => {
      val.scrollTop = val.scrollHeight;
    });
  }

  addNewRule() {
    this.onAddNewRuleClick.emit();
    setTimeout(() => {
      this.scrollToBottom();
    }, 150);
  }

  rowItemClick(selectedItem) {
    this.onRowClick.emit(selectedItem);
  }

  operatorItemClick(selectedItem) {
    this.onOperatorItemClick.emit(selectedItem);
  }

  actionItemClick(selectedItem) {
    this.onActionItemClick.emit(selectedItem);
  }
  testVarNoItemClick(selectedItem) {
    this.onTestVarNoItemClick.emit(selectedItem);
  }

  criteriaChange(selectedItem) {
    this.onCriteriaChange.emit(selectedItem);
  }
  itemChange(selectedItem) {
    this.onItemChange.emit(selectedItem);
  }
  descriptionChange(selectedItem) {
    this.onDescriptionChange.emit(selectedItem);
  }

  scrollToCustomUp(row: number): void {

    const ele = document.getElementsByClassName('workflow-scroll');
    const eleArray = <Element[]>Array.prototype.slice.call(ele);
    eleArray.map(val => {
      val.scrollTop = ((row - 1) * 36);
    });
  }

  scrollToCustomDown(row: number): void {
    const ele = document.getElementsByClassName('workflow-scroll');
    const eleArray = <Element[]>Array.prototype.slice.call(ele);
    eleArray.map(val => {
      // val.scrollTop = val.scrollTop + row;
      val.scrollTop = ((row) * 36) - val.clientHeight;
    });
  }


  ruleUpClick() {
    this.onRuleUpClick.emit();
    setTimeout(() => {
      this.scrollToCustomUp(this.selectedWorkflowRuleList[0].rowOrder);
    }, 150);
  }

  ruleDownClick() {
    this.onRuleDownClick.emit();
    setTimeout(() => {
      this.scrollToCustomDown(this.selectedWorkflowRuleList[0].rowOrder);
    }, 150);
  }

  exportRulesClick() {
    this.onExportRulesClick.emit();
  }

  importRulesClick(fileData) {
    if (fileData && fileData.length === 1 && fileData[0].type &&
      fileData[0].type === 'text/xml' && fileData[0].name.split('.').pop() === 'xml') {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Import',
          message: `Do you want to Replace or append to the current items? Click Yes to replace, No to append`,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: { displayName: '' },
        data: null,
      };

      const deleteDialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
        // disableClose: true
      });
      deleteDialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
          const fullData: WorkflowRuleFileData = {
            fileData: fileData,
            isReplace: true
          };
          this.onImportRulesClick.emit(fullData);
        } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
          const fullData: WorkflowRuleFileData = {
            fileData: fileData,
            isReplace: false
          };
          this.onImportRulesClick.emit(fullData);
        }
      });
    }

  }

  saveWorkflowRuleClick() {
    this.onSaveWorkflowRuleClick.emit();
  }

  deleteWorkflowRulesClick() {
    if (this.selectedWorkflowRuleList && this.selectedWorkflowRuleList.length > 0) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: ' Delete Row',
          message: `You have selected ` + this.selectedWorkflowRuleList.length + ` row(s) for deletion.\n
          Choose Yes to delete the row or No to Exit.`,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: { displayName: '' },
        data: null,
      };

      const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
        // disableClose: true
      });
      deleteDialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.onDeleteWorkflowRulesClick.emit();
        } else {
        }
      });
    }

  }
  exitWorkflowRulesClick() {
    // if (this.selectedWorkflowRuleList && this.selectedWorkflowRuleList.length > 0) {
    if (this.isDirty) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Exit',
          message: `Changes have been made! Do you want to go back and save them?`,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: { displayName: '' },
        data: null,
      };

      const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
        // disableClose: true
      });
      deleteDialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
          this.onExitWorkflowRulesClick.emit(this.isSaveApply);
        } else if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          if (this.workflowRuleList && this.workflowRuleList.find((row) => !row.wfR_Test)) {
            const msgText = `'Test Var. No' is not a valid variable number.`;
            this.openMsg(msgText);
          } else {
            this.onSaveWorkflowRuleClick.emit();
            setTimeout(() => {
              this.onExitWorkflowRulesClick.emit();
            }, 150);
          }
        } else {

        }
      });
    } else {
      this.onExitWorkflowRulesClick.emit(this.isSaveApply);
    }
  }

  openMsg(msgText) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Invalid Entry',
        message: msgText
      },
      contentParams: {},
      data: { messageType: 'warning'}
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {

    });
  }

  onOpenWorkFlowMenuPopup(rowItem: WorkflowRuleListData) {
    const inputData: WorkFlowMenuPopupInput = {
      appId: this.matterData.appId,
      fileId: this.matterData.fileId,
      branchId: this.matterData.branchId,
      isProspectMatter: this.matterData.isProspectMatter
    };
    this.WorkflowRuleListToken = 'workflowRule-' + inputData.branchId + inputData.appId + inputData.branchId;
    this.changeRulePopUpToken.emit(this.WorkflowRuleListToken);
    this.popupService.openWorkFlowMenuPopup(this.WorkflowRuleListToken, inputData).subscribe(result => {
      if (!result) {
        return '';
      }
      const item: WorkflowRuleTextValuChangeData = {
        item: rowItem,
        value: result.atN_Command,
        value2: result.atN_Desc.slice(0, 49),
        atN_ID: result.atN_ID
      };
      this.onItemSelect.emit(item);
    });
  }
  closePopup() {
    this.onExitWorkflowRulesClick.emit();
  }
}






