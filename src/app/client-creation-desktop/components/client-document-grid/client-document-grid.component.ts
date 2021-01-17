import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentGridRowItemWrapper } from '../../../client-creation-core/models/interfaces';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-client-document-grid',
  templateUrl: './client-document-grid.component.html',
  styleUrls: ['./client-document-grid.component.scss']
})
export class ClientDocumentGridComponent implements OnInit {

  @Input() gridData: any[];
  @Input() gridColoumn: ColumnDef[];

  @Output() rowClick = new EventEmitter<any>();
  @Output() rowDeleteClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }

  onRowClick(event: any) {
    this.rowClick.emit({ gridType: 'Document', row: event });
  }
  onRowDeleteClick(row: any) {
    this.rowDeleteClick.emit(row);
  }
}
