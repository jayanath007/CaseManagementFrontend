import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { ClientMatterModel } from '../../../client-creation-core';


@Component({
  selector: 'dps-matter-view-data',
  templateUrl: './matter-view-data.component.html',
  styleUrls: ['./matter-view-data.component.scss']
})
export class MatterViewDataComponent implements OnInit, OnChanges {

  @Input() gridData: ClientMatterModel[];
  @Input() gridColoumn: ColumnDef[];
  @Output() rowClick = new EventEmitter<any>();
  @Output() rowDblClick = new EventEmitter<any>();

  selectedItem;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.rowClick.emit(null);
  }

  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }

  onRowClick(event: ClientMatterModel) {
    this.selectedItem = event;
    this.rowClick.emit(event);
  }
  onRowDblClick(event) {
    this.selectedItem = event;
    this.rowDblClick.emit(event);
  }
}

