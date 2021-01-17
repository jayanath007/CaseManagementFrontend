import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PoliceStationList } from '../../../core/lib/police-station';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-police-station-grid-fix-row',
  templateUrl: './police-station-grid-fix-row.component.html',
  styleUrls: ['./police-station-grid-fix-row.component.scss']
})
export class PoliceStationGridFixRowComponent implements OnInit {

  constructor() { }

  @Input() generalPopupRowData: PoliceStationList[];
  @Input() columnDef: ColumnDef[];
  @Output() selectedRow = new EventEmitter<PoliceStationList>();

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onRowClick(rowData: PoliceStationList) {
    this.selectedRow.emit(rowData);
  }

}
