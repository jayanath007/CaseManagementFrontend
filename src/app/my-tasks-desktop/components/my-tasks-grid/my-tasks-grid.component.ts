
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { PageEvent } from '@angular/material';
import { GridData, SelectedInfo, GridButtonAction, GroupMode, GridGroupData } from '../../../my-tasks-core/models/interfce';
import { ViewChangeKind, GridButtonType } from '../../../my-tasks-core/models/enumeration';
import { Filter, Condition } from '../../../odata/index';

@Component({
  selector: 'dps-my-tasks-grid',
  templateUrl: './my-tasks-grid.component.html',
  styleUrls: ['./my-tasks-grid.component.scss']
})
export class MyTasksGridComponent implements OnInit {

  constructor() { }

  @Input() isLoading: boolean;
  @Input() columnDef: ColumnDef[];
  @Input() paginatorDef: PaginatorDef;
  @Input() totalItem: Number;
  // @Input() expandedRow: GridData;
  @Input() gridData: GridData[];
  @Input() selectedInfo: SelectedInfo;
  @Input() groupMode: GroupMode;
  @Input() gridGroupData: GridGroupData[];


  @Output() viewChange = new EventEmitter<any>();
  @Output() rowExpand = new EventEmitter<GridData>();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() openAddTaskWithFile = new EventEmitter<{ file: any, row: GridData }>();
  @Output() selectedGroupRowChange = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();




  mytaskGroupMode = GroupMode;


  pageSizeOptions = [25, 50, 100];

  ngOnInit() {
  }

  get columnDefVisibale(): ColumnDef[] {
    return this.columnDef.filter(p => p.extras.hidden !== true);
  }

  onSelectedGroupRowChange(event) {
    this.selectedGroupRowChange.emit(event);
  }


  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.viewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }


  onLoadMore(event) {
    this.loadMore.emit(event);
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
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

  public gridRowExpan(row: GridData): void {
    event.preventDefault();
    this.rowExpand.emit(row);
  }

  public onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  onFileDrop({ event, dragData, dragDataType }, row: GridData) {
    if (dragDataType === 'Files') {
      this.openAddTaskWithFile.emit({ file: dragData[0], row: row });
    }
  }
}
