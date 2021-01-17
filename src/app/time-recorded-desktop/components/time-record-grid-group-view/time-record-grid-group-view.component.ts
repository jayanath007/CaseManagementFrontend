import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { SelectedInfo, GridButtonAction } from '../../../work-done-core/models/interfce';
import { GridGroupData } from '../../../my-tasks-core/models/interfce';
import { GridData } from '../../../time-recorded-core/models/interfce';


@Component({
  selector: 'dps-time-record-grid-group-view',
  templateUrl: './time-record-grid-group-view.component.html',
  styleUrls: ['./time-record-grid-group-view.component.scss']
})
export class TimeRecordGridGroupViewComponent implements OnInit {

  @Input() columnDef: ColumnDef[];
  @Input() gridData: GridData[];
  @Input() selectedInfo: SelectedInfo;
  @Input() groupData: GridGroupData[];
  @Input() homeCurrancy: string;
  @Input() groupMode: string;

  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() selectRow = new EventEmitter<GridData>();
  @Output() selectGroup = new EventEmitter<GridGroupData>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();

  constructor() { }

  ngOnInit() {
  }

  groupItems(data: GridGroupData): GridData[] {
    if (this.gridData && this.gridData.length > 0) {
      return this.gridData.filter(row => row.groupHash === data.groupHash);
    }
    return [];
  }

  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  SelectRow(item: GridData) {
    this.selectRow.emit(item);
  }

  loadMore(data) {
    this.loadMoreData.emit(data);
  }

}


