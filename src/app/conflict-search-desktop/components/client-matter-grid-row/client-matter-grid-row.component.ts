import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ClientMatterRowItemWrapper } from '../../../conflict-search-core/models/interfaces';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-client-matter-grid-row',
  templateUrl: './client-matter-grid-row.component.html',
  styleUrls: ['./client-matter-grid-row.component.scss']
})
export class ClientMatterGridRowComponent implements OnInit {



  @Input() gridData: ClientMatterRowItemWrapper[];
  @Input() gridColoumn: ColumnDef[];
  @Output() rowClick = new EventEmitter<ClientMatterRowItemWrapper>();

  @Input() rowData: ClientMatterRowItemWrapper;



  constructor() { }

  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }

  onRowClick(event: ClientMatterRowItemWrapper) {
    this.rowClick.emit(event);
  }

  ngOnInit() {
  }





}
