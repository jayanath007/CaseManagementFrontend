import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Filter, Condition } from '../../../odata';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { ViewChangeKind } from '../../../ledger-card-core/models/enumeration';
import { GbpGridData, GBPGrid } from '../../../ledger-card-core/models/interfce';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'dps-gbp-grid',
  templateUrl: './gbp-grid.component.html',
  styleUrls: ['./gbp-grid.component.scss']
})
export class GbpGridComponent implements OnInit {
  @Input() gbpGridData: GBPGrid;
  pageSizeOptions = [25, 50, 100];
  @Output() gbpGridViewChange = new EventEmitter();
  public selectRow;
  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.gbpGridData.gridColumns) { return ''; }
    return this.gbpGridData.gridColumns[index]
      && this.gbpGridData.gridColumns[index].extras ? this.gbpGridData.gridColumns[index].extras.fxFlex : '';
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.gbpGridViewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.gbpGridViewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.gbpGridViewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.gbpGridViewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onSelectRow(item) {
    this.selectRow = item;
  }

}
