import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData, SelectedInfo, GridButtonAction } from '../../../work-done-core/models/interfce';
import { ColumnDef, GridGroupData } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-workdone-group',
  templateUrl: './workdone-group.component.html',
  styleUrls: ['./workdone-group.component.scss']
})
export class WorkdoneGroupComponent implements OnInit {


  @Input() gridData: GridData[];
  @Input() group: any;
  @Input() selectedGroup: string;
  @Input() expandedRow: GridData;
  @Input() homeCurrancy;
  @Input() searchText: string;
  @Input() selectedInfo: SelectedInfo;
  @Input() columnDef: ColumnDef[];
  @Input() selectGroupHash: string[];

  @Output() rowExpand = new EventEmitter<GridData>();
  @Output() selectGroup = new EventEmitter<GridGroupData>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  constructor() { }

  ngOnInit() {
  }



  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  getWorkDoneGroupData(groupHash) {
    if (this.gridData && this.gridData && this.gridData.length > 0) {
      return this.gridData.filter(row => row.groupHash === groupHash);
    }
    return [];
  }

  isGroupExpand(groupHash: string) {
    if (this.selectGroupHash.find(gh => gh === groupHash)) {
      return true;
    }
    return false;
  }

  loadMore(data: GridGroupData) {
    this.loadMoreData.emit(data);
  }

  public onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  public gridRowExpan(row: GridData, event: MouseEvent): void {
    this.rowExpand.emit(row);
  }

}
