import { ConflictSearchGridRowItemWrapper } from '../../../conflict-search-core/models/interfaces';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dps-conflict-search-grid-row',
  templateUrl: './conflict-search-grid-row.component.html',
  styleUrls: ['./conflict-search-grid-row.component.scss']
})
export class ConflictSearchGridRowComponent implements OnInit {

  @Input() rowData: ConflictSearchGridRowItemWrapper;
  @Output() rowClick = new EventEmitter<ConflictSearchGridRowItemWrapper>();


  constructor() { }

  onRowClick(event: ConflictSearchGridRowItemWrapper) {
    this.rowClick.emit(event);
  }

  ngOnInit() {
  }

}
