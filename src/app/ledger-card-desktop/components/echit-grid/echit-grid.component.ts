import { Component, OnInit, Input } from '@angular/core';
import { EChitGrid } from '../../../ledger-card-core/models/interfce';

@Component({
  selector: 'dps-echit-grid',
  templateUrl: './echit-grid.component.html',
  styleUrls: ['./echit-grid.component.scss']
})
export class EchitGridComponent {

  constructor() { }
  @Input() eChitGridData: EChitGrid;
  selectRow;

  getFxFlexProperty(index) {
    if (!this.eChitGridData.gridColumns) { return ''; }
    return this.eChitGridData.gridColumns[index]
      && this.eChitGridData.gridColumns[index].extras ? this.eChitGridData.gridColumns[index].extras.fxFlex : '';
  }

  onSelectRow(item) {
    this.selectRow = item;
  }

}
