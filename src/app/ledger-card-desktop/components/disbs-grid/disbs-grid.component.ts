import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DisbsGrid } from '../../../ledger-card-core/models/interfce';
import { Filter, Condition } from '../../../odata';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { ViewChangeKind } from '../../../ledger-card-core/models/enumeration';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'dps-disbs-grid',
  templateUrl: './disbs-grid.component.html',
  styleUrls: ['./disbs-grid.component.scss']
})
export class DisbsGridComponent implements OnInit {
  @Input() disbsGridData: DisbsGrid;
  pageSizeOptions = [25, 50, 100];
  @Output() disbsGridViewChange = new EventEmitter();
  public selectRow;
  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.disbsGridData.gridColumns) { return ''; }
    return this.disbsGridData.gridColumns[index]
      && this.disbsGridData.gridColumns[index].extras ? this.disbsGridData.gridColumns[index].extras.fxFlex : '';
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.disbsGridViewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.disbsGridViewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.disbsGridViewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.disbsGridViewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onSelectRow(item) {
    this.selectRow = item;
  }

}
