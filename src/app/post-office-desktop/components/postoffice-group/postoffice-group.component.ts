import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData, SelectedInfo, GridButtonAction } from '../../../post-office-core/models/interfce';
import { ColumnDef, GridGroupData } from '../../../core/lib/grid-model';
import { GroupMode } from '../../../post-office-core/models/enumeration';

@Component({
  selector: 'dps-postoffice-group',
  templateUrl: './postoffice-group.component.html',
  styleUrls: ['./postoffice-group.component.scss']
})
export class PostofficeGroupComponent implements OnInit {


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

  GroupMode = GroupMode;


  constructor() { }

  ngOnInit() {
  }



  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  getPostOfficeGroupData(groupHash) {
    if (this.gridData && this.gridData && this.gridData.length > 0) {
      return this.gridData.filter(row => row.groupHash === groupHash);
    }
    return [];
  }

  get getIsMuiltySelect() {
    if (this.gridData && this.gridData.length > 0) {
      const selectRow = this.gridData.filter(row => row.isChecked);
      return selectRow && selectRow.length > 1 ? true : false;
    }
    return false;
  }

  get selectedRows() {
    if (this.gridData && this.gridData.length > 0) {
      const selectRow = this.gridData.filter(row => row.isChecked);
      return selectRow;
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
