import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { ColumnDef } from '../../../core/lib/grid-model';
import { ConflictSearchGridRowItemWrapper } from '../../../conflict-search-core/models/interfaces';

@Component({
  selector: 'dps-conflict-search-grid-contant',
  templateUrl: './conflict-search-grid-contant.component.html',
  styleUrls: ['./conflict-search-grid-contant.component.scss']
})
export class ConflictSearchGridContantComponent implements OnInit {

  @Input() gridData: ConflictSearchGridRowItemWrapper[];
  @Input() gridColoumn: ColumnDef[];
  @Output() rowClick = new EventEmitter<ConflictSearchGridRowItemWrapper>();

  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }

  onRowClick(event: ConflictSearchGridRowItemWrapper) {
    this.rowClick.emit(event);
  }
}
