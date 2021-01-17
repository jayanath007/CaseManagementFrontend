import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocRegisterGridRowItemWrapper } from '../../../matter-creation-core/models/interfaces';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-doc-register-view-data',
  templateUrl: './doc-register-view-data.component.html',
  styleUrls: ['./doc-register-view-data.component.scss']
})
export class DocRegisterViewDataComponent implements OnInit {

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
  onRowClick(event: any) {
    this.rowClick.emit(event);
  }
}
