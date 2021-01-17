import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-supplier-popup-grid-fix-row',
  templateUrl: './supplier-popup-grid-fix-row.component.html',
  styleUrls: ['./supplier-popup-grid-fix-row.component.scss']
})
export class SupplierPopupGridFixRowComponent implements OnInit {
  @Input() generalPopupRowData: any;
  @Input() columnDef: ColumnDef[];
  @Output() doubleSelectedRow = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onRowClick(rowData) {
    this.doubleSelectedRow.emit(rowData);
  }

}
