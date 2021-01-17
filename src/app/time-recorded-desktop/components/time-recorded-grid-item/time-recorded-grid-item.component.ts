import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { GridData, SelectedInfo, GridButtonAction } from '../../../time-recorded-core/models/interfce';
import { GroupMode } from '../../../my-tasks-core/models/interfce';

@Component({
  selector: 'dps-time-recorded-grid-item',
  templateUrl: './time-recorded-grid-item.component.html',
  styleUrls: ['./time-recorded-grid-item.component.scss']
})
export class TimeRecordedGridItemComponent implements OnInit {

  @Input() columnDef: ColumnDef[];
  @Input() gridData: GridData[];
  @Input() selectedInfo: SelectedInfo;
  @Input() groupMode: GroupMode;
  @Input() homeCurrancy: string;

  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() selectRow = new EventEmitter<GridData>();

  mode = GroupMode;
  columnIntex = 0;
  pressTimer: any;

  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    this.columnIntex = this.columnIntex + 1;
    if (!this.columnDef) { return ''; }
    if (this.columnDef && (this.columnDef.length) === this.columnIntex) {
      this.columnIntex = 0;
    }
    return this.columnDef[index]
      && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  clickOnRow(item: GridData) {
    const mouseUpTimer: any = new Date();
    if (mouseUpTimer - this.pressTimer < 300) {
      this.selectRow.emit(item);
    }
  }

  rowMouseDown() {
    this.pressTimer = new Date();
  }

}
