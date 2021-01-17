import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from './../../../core/lib/grid-model';
import { OppertunityHistory } from '../../../opportunity-core/models/interfaces';

@Component({
  selector: 'dps-opportunity-history',
  templateUrl: './opportunity-history.component.html',
  styleUrls: ['./opportunity-history.component.scss']
})
export class OpportunityHistoryComponent {


  @Input() historyColumDef: ColumnDef[];
  @Input() historyData: { isLoading: boolean, data: OppertunityHistory[] };
  @Output() openLogFile = new EventEmitter<OppertunityHistory>();
  selectedRow: OppertunityHistory;
  constructor() { }

  getFxFlexProperty(index) {
    if (!this.historyColumDef) { return ''; }
    return this.historyColumDef[index] && this.historyColumDef[index].extras ? this.historyColumDef[index].extras.fxFlex : '';
  }

  onHistoryRowDBClick(data: OppertunityHistory) {
    this.openLogFile.emit(data);
    this.selectedRow = data;
  }

  selectRow(row: OppertunityHistory) {
    this.selectedRow = row;
  }


}
