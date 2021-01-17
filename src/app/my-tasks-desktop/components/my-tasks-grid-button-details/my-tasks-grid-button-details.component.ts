import { Component, Output, ChangeDetectionStrategy, EventEmitter, Input } from '@angular/core';
import { GridData, GridButtonAction } from '../../../my-tasks-core/models/interfce';
import { GridButtonType } from '../../../my-tasks-core/models/enumeration';
import { Module, SettingKey } from '../../../core/lib/app-settings';
import { WorkflowMenuMetaDataWrapper, WorkflowMenuMetaItem } from '../../../workflow-menu-core/models/interfaces';
import { AccessControlService } from '../../../auth/services/access-control.service';

@Component({
  selector: 'dps-my-tasks-grid-button-details',
  templateUrl: './my-tasks-grid-button-details.component.html',
  styleUrls: ['./my-tasks-grid-button-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTasksGridButtonDetailsComponent {

  @Input() selectedTaskData: GridData;
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();

  module = Module;
  settingKey = SettingKey;

  constructor(private access: AccessControlService) { }

  public onOpenCaseClick() {
    this.clickGridButton.emit({ kind: GridButtonType.OpenCase, value: this.selectedTaskData });
  }

  public onAddTaskClick() {
    this.clickGridButton.emit({ kind: GridButtonType.AddTask, value: this.selectedTaskData });
  }

  public onEditTaskClick() {
    this.clickGridButton.emit({ kind: GridButtonType.EditTask, value: this.selectedTaskData });
  }

  public onCompeteTaskClick() {
    this.clickGridButton.emit({ kind: GridButtonType.Complete, value: this.selectedTaskData });
  }
  public onRunCommandClick() {
    const newItemScreen = getCreateItemNewMenuItem(this.selectedTaskData);
    this.clickGridButton.emit({ kind: GridButtonType.RunCommand, value: this.selectedTaskData, menuInfo: newItemScreen });
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }

  getSettingValue(key: SettingKey) {
    return this.access.getSettingValue(key);
  }

}

function getCreateItemNewMenuItem(item) {
  let newShortcutKuyNode: WorkflowMenuMetaDataWrapper = null;
  if (item) {
    const newMenuNode: WorkflowMenuMetaItem = {
      atN_AppID: +item.appID,
      atN_Command: item.template,
      // atN_Command: 'template.xml',
      atN_Desc: item.note,
      atN_Help: '',
      atN_ID: null,
      atN_Level: 0,
      atN_Order: 1,
      atN_ParentID: null,
      atN_ParentMenu: null,
      atN_Type: 4, // Menu
      createUser: '',
      dateDone: '',
      nodeStatus: 1,
    };
    const newNode: WorkflowMenuMetaDataWrapper = {
      treeId: null,
      parentId: null,
      treeLevel: 0,
      isRowEdit: false,
      isRightClick: false,
      isRowSelected: false,
      indexId: 0,
      data: newMenuNode,
      items: [],
      enabled: true,
      isTreeNodeExpand: false,
    };
    newShortcutKuyNode = newNode;
  }
  return newShortcutKuyNode;
}


