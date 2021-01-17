import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllGrid, AllGridFilterModel } from '../../../ledger-card-core/models/interfce';
import { Filter, Condition } from '../../../odata';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { ViewChangeKind, AllGridColumnWidth } from '../../../ledger-card-core/models/enumeration';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'dps-all-grid',
  templateUrl: './all-grid.component.html',
  styleUrls: ['./all-grid.component.scss']
})
export class AllGridComponent implements OnInit {

  @Input() allGridData: AllGrid;
  @Input() allGridFilterData: AllGridFilterModel;
  @Output() allGridViewChange = new EventEmitter();
  public columnWidth = AllGridColumnWidth;
  pageSizeOptions = [25, 50, 100];
  columnIntex = 0;
  public selectRow;

  constructor() { }

  ngOnInit() {

  }

  get getGridColoum() {
    if (this.allGridData.gridColumns && this.allGridFilterData && this.allGridFilterData.showTransPeriods) {
      return this.allGridData.gridColumns;
    }
    return this.allGridData.gridColumns.filter(val => val.fieldName !== 'Period');
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.allGridViewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.allGridViewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.allGridViewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.allGridViewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onSelectRow(item) {
    this.selectRow = item;
  }

}
