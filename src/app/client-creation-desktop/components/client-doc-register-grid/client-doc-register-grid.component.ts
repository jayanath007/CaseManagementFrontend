import { CrimeGridRowItemWrapper, DocumentRegistryModel } from '../../../client-creation-core/models/interfaces';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-client-doc-register-grid',
  templateUrl: './client-doc-register-grid.component.html',
  styleUrls: ['./client-doc-register-grid.component.scss']
})
export class ClientDocRegisterGridComponent implements OnInit {
  @Input() gridData: any[];
  @Input() gridColoumn: ColumnDef[];

  @Output() rowClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }

  onRowClick(event: DocumentRegistryModel) {
    this.rowClick.emit({ gridType: 'docRegister', row: event });
  }
}
