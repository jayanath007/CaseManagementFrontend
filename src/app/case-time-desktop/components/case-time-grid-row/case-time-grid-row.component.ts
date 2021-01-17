import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-case-time-grid-row',
  templateUrl: './case-time-grid-row.component.html',
  styleUrls: ['./case-time-grid-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseTimeGridRowComponent {

  constructor() { }

  @Input() rowData: any;
  @Input() columnDef: ColumnDef[];



  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index].extras.fxFlex;
  }

  getHiddenProperty(index) {
    if (!this.columnDef) { return ''; }
    return !this.columnDef[index].extras.hidden;
  }
}
