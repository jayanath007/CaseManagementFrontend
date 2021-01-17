import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { ClassObj } from '../../../crime-management-core/models/interfaces';

@Component({
  selector: 'dps-crime-class-grid-row',
  templateUrl: './crime-class-grid-row.component.html',
  styleUrls: ['./crime-class-grid-row.component.scss']
})
export class CrimeClassGridRowComponent implements OnInit {
  @Input() rowData: ClassObj;
  @Input() columnDef: ColumnDef[];

  constructor() { }

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
  onDeleteClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

}
