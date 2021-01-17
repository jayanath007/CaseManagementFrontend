import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridButtonAction } from '../../../work-done-core/models/interfce';
import { GridGroupData, GridData } from '../../../my-tasks-core/models/interfce';

@Component({
  selector: 'dps-my-task-group',
  templateUrl: './my-task-group.component.html',
  styleUrls: ['./my-task-group.component.scss']
})
export class MyTaskGroupComponent implements OnInit {

  @Input() columnDef;
  @Input() gridData: GridData[];
  @Input() selectedInfo;
  @Input() gridGroupData: GridGroupData[];
  @Input() totalItem: number;


  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() rowExpand = new EventEmitter<GridData>();
  @Output() openAddTaskWithFile = new EventEmitter<{ file: any, row: GridData }>();
  @Output() selectedGroupRowChange = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();




  constructor() { }

  ngOnInit() {
  }


  onLoadMore(event) {
    this.loadMore.emit(event);
  }

  onSelectedGroupRowChange(event) {
    this.selectedGroupRowChange.emit(event);
  }


  getHiddenProperty(index) {
    if (!this.columnDef) { return ''; }
    return !this.columnDef[index].extras.hidden;
  }


  public onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  public gridRowExpan(row: any): void {
    // event.preventDefault();
    this.rowExpand.emit(row);
  }


  onFileDrop({ event, dragData, dragDataType }, row: GridData) {
    if (dragDataType === 'Files') {
      this.openAddTaskWithFile.emit({ file: dragData[0], row: row });
    }
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index]
      && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }


  getGridDataByGroupId(groupHash) {
    if (this.gridData && this.gridData && this.gridData.length > 0) {
      return this.gridData.filter(row => row.groupHash === groupHash);
    }
    return [];
  }


}
