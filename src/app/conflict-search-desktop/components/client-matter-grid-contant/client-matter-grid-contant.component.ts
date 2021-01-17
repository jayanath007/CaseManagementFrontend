import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ClientMatterRowItemWrapper } from '../../../conflict-search-core/models/interfaces';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-client-matter-grid-contant',
  templateUrl: './client-matter-grid-contant.component.html',
  styleUrls: ['./client-matter-grid-contant.component.scss']
})
export class ClientMatterGridContantComponent implements OnInit {

  @Input() gridData: ClientMatterRowItemWrapper[];
  @Input() gridColoumn: ColumnDef[];
  @Output() rowClick = new EventEmitter<ClientMatterRowItemWrapper>();

  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }


}
