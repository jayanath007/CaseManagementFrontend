
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { PDFBundleHeaderViewModel } from '../../../core/lib/bundle';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'dps-bundle-monitor-grid-items',
  templateUrl: './bundle-monitor-grid-items.component.html',
  styleUrls: ['./bundle-monitor-grid-items.component.scss']
})
export class BundleMonitorGridItemsComponent {
  constructor() { }

  @Input() columnDef: ColumnDef[];
  @Input() row: PDFBundleHeaderViewModel;
  @Input() isOdd: boolean;
  @Output() openLog = new EventEmitter<number>();
  @Output() selectRow = new EventEmitter<{ value: boolean, id: number }>();
  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
  onOpenLogFile(bundleId) {
    this.openLog.emit(bundleId);
  }
  onSelectRow(event: MatCheckboxChange, id: number) {
    this.selectRow.emit({ value: event.checked, id });
  }
}
