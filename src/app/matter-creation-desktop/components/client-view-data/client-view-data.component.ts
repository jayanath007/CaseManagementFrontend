import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Client } from './../../../matter-creation-core/models/interfaces';
import { ColumnDef } from './../../../core/lib/grid-model';

@Component({
  selector: 'dps-client-view-data',
  templateUrl: './client-view-data.component.html',
  styleUrls: ['./client-view-data.component.scss']
})
export class ClientViewDataComponent implements OnInit {

  constructor() { }
  @Input() gridData: { client: Client, enableRemove: boolean; }[];
  @Input() gridColoumn: ColumnDef[];

  @Output() removeClient = new EventEmitter();

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index].extras.fxFlex;
  }
  onRemoveClient() {
    this.removeClient.emit();
  }

}
