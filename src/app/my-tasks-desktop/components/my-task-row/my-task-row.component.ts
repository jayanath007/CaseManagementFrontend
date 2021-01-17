import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridButtonAction } from '../../../work-done-core/models/interfce';
import { GridData } from '../../../my-task-widget/models/interfce';

@Component({
  selector: 'dps-my-task-row',
  templateUrl: './my-task-row.component.html',
  styleUrls: ['./my-task-row.component.scss']
})
export class MyTaskRowComponent implements OnInit {


  @Input() columnDef;
  @Input() gridData;
  @Input() selectedInfo;


  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() rowExpand = new EventEmitter<GridData>();
  @Output() openAddTaskWithFile = new EventEmitter<{ file: any, row: GridData }>();

  constructor() { }

  ngOnInit() {
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
}
