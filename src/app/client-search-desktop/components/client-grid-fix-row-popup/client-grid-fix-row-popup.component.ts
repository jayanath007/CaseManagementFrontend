import { ClientPopupType } from './../../../client-search-core/models/enums';
import { ClientSearchPopupData } from '../../../client-search-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PaginatorDef, ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-client-grid-fix-row-popup',
  templateUrl: './client-grid-fix-row-popup.component.html',
  styleUrls: ['./client-grid-fix-row-popup.component.scss']
})
export class ClientGridFixRowPopupComponent implements OnInit {
  @Input() ClientRowData: any;
  @Input() columnDef: ColumnDef[];
  @Input() searchText: string;
  @Input() activeView;
  @Input() isPopup: boolean;
  @Input() popupInputData: ClientSearchPopupData;

  clientPopupType = ClientPopupType;

  constructor() { }

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

}
