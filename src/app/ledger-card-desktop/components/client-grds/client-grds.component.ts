import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClientGrid, AllGridFilterModel } from '../../../ledger-card-core/models/interfce';
import { Filter, Condition } from '../../../odata';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { ViewChangeKind } from '../../../ledger-card-core/models/enumeration';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'dps-client-grds',
  templateUrl: './client-grds.component.html',
  styleUrls: ['./client-grds.component.scss']
})
export class ClientGrdsComponent implements OnInit {
  @Input() clientGridData: ClientGrid;
  pageSizeOptions = [25, 50, 100];
  @Output() clientGridViewChange = new EventEmitter();
  public selectRow;
  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.clientGridData.gridColumns) { return ''; }
    return this.clientGridData.gridColumns[index]
      && this.clientGridData.gridColumns[index].extras ? this.clientGridData.gridColumns[index].extras.fxFlex : '';
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.clientGridViewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.clientGridViewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.clientGridViewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.clientGridViewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onSelectRow(item) {
    this.selectRow = item;
  }

}
