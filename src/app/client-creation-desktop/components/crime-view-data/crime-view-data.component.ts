import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrimeGridRowItemWrapper } from '../../../client-creation-core/models/interfaces';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-crime-view-data',
  templateUrl: './crime-view-data.component.html',
  styleUrls: ['./crime-view-data.component.scss']
})
export class CrimeViewDataComponent implements OnInit {

  @Input() gridData: CrimeGridRowItemWrapper[];
  @Input() gridColoumn: ColumnDef[];

  @Output() rowClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }

  onRowClick(event: CrimeGridRowItemWrapper) {
    this.rowClick.emit({ gridType: 'Crime', row: event });
  }
}
