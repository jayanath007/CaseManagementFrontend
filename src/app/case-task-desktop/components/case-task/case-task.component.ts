
import { WorkflowMenuMetaDataWrapper, WorkflowMenuMetaItem } from '../../../workflow-menu-core/models/interfaces';

import { CaseTaskViewState, TaskItemWrapper } from '../../../case-task-core';
import {
  Component, OnInit,
  ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, ViewChild
} from '@angular/core';
import { PageEvent } from '@angular/material';
import { ViewChangeKind } from '../../../case-task-core/actions/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { Filter, Condition } from '../../../odata';
import { GridButtonType } from '../../../my-tasks-core';


@Component({
  selector: 'dps-case-task',
  templateUrl: './case-task.component.html',
  styleUrls: ['./case-task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseTaskComponent implements OnInit, OnChanges {



  @ViewChild('caseTaskGridContent') caseTaskGridContent;

  @Input() columnDef;
  @Input() caseTaskData: CaseTaskViewState;
  @Input() pageInfo;
  @Input() fontSizeClass: string;
  @Output() selectRow = new EventEmitter<TaskItemWrapper>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() addEditTaskOut = new EventEmitter<{ kind: any, value: any }>();


  selectRowItem: any;


  onSelectRow(item) {
    this.selectRow.emit(item);
    // this.selectRowItem = item;
  }

  onExpand(item: TaskItemWrapper, row: number) {
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      console.log('apply column filter', data);
      this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.viewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  opened(e) {
  }
  constructor() {
  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: any) {

  }
  public onAddTaskClick(item) {
    this.addEditTaskOut.emit({ kind: GridButtonType.AddTask, value: item });
  }

  public onEditTaskClick(item) {
    this.addEditTaskOut.emit({ kind: GridButtonType.EditTask, value: item });
  }

  public onCompeteTaskClick(item) {
    this.addEditTaskOut.emit({ kind: GridButtonType.Complete, value: item });
  }

  public onRunCommandClick(item) {
    const newItemScreen = getCreateItemNewMenuItem(item);
    this.addEditTaskOut.emit({ kind: GridButtonType.RunCommand, value: newItemScreen });
  }

  // runCommandTemplate(item) {
  //   const newItemScreen = getCreateItemNewMenuItem({}, {});
  //   this.runCommand.emit({ value: newItemScreen });
  // }

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




