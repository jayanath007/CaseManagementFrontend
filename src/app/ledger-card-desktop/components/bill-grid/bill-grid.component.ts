import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BillGrid } from '../../../ledger-card-core/models/interfce';
import { Filter, Condition } from '../../../odata';
import { ColumnDef } from '../../../core/lib/grid-model';
import { ViewChangeKind } from '../../../ledger-card-core/models/enumeration';

@Component({
  selector: 'dps-bill-grid',
  templateUrl: './bill-grid.component.html',
  styleUrls: ['./bill-grid.component.scss']
})
export class BillGridComponent implements OnInit {
  @Input() billGridData: BillGrid;
  @Output() billGridViewChange = new EventEmitter();
  public selectRow;
  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.billGridData.gridColumns) { return ''; }
    return this.billGridData.gridColumns[index]
      && this.billGridData.gridColumns[index].extras ? this.billGridData.gridColumns[index].extras.fxFlex : '';
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.billGridViewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.billGridViewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.billGridViewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  onSelectRow(item) {
    this.selectRow = item;
  }

}
