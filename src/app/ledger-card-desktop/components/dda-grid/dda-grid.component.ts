import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DDAGrid, DDAGridPageInfo } from '../../../ledger-card-core/models/interfce';
import { Filter, Condition } from '../../../odata';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { ViewChangeKind } from '../../../ledger-card-core/models/enumeration';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'dps-dda-grid',
  templateUrl: './dda-grid.component.html',
  styleUrls: ['./dda-grid.component.scss']
})
export class DdaGridComponent implements OnInit {

  @Input() ddaGridData: DDAGrid;
  pageSizeOptions = [25, 50, 100];
  @Output() ddaGridViewChange = new EventEmitter();
  public selectRow;
  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.ddaGridData.gridColumns) { return ''; }
    return this.ddaGridData.gridColumns[index]
      && this.ddaGridData.gridColumns[index].extras ? this.ddaGridData.gridColumns[index].extras.fxFlex : '';
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.ddaGridViewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.ddaGridViewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.ddaGridViewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.ddaGridViewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onSelectRow(item) {
    this.selectRow = item;
  }

}
