import { AllGridColumnWidth } from './../../../ledger-previous-trans-core/models/enums';
import { Component, Input, OnInit } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { PreviousTransGrid, GridFilterModel } from '../../../ledger-previous-trans-core/models/interface';

@Component({
  selector: 'dps-previous-transactions-grid',
  templateUrl: './previous-transactions-grid.component.html',
  styleUrls: ['./previous-transactions-grid.component.scss']
})
export class PreviousTransactionsGridComponent implements OnInit {

  @Input() columnDef: ColumnDef[];
  @Input() previousTransGridData: PreviousTransGrid;
  @Input() gridCloumnVisibleStatus: any;
  @Input() balanceOnly: boolean;
  @Input() gridFilterData: GridFilterModel;

  selctedRowindex = null;

  public columnWidth = AllGridColumnWidth;

  constructor() { }

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
  onRowClick(row: any) {

  }
  onRowDbClick(row: any) {

  }
}
