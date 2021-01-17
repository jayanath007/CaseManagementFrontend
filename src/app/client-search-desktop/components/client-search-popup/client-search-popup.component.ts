import { Filter, Condition } from '../../../odata/interfaces';
import { PaginatorDef, ColumnDef } from '../../../core/lib/grid-model';
import { ClientSearchPopupData, ClientGridRowRapper } from '../../../client-search-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ClientSearchKind, ViewChangeKind, ClientPopupType } from '../../../client-search-core/models/enums';
import { MainMenuItem } from './../../../layout-desktop/models/interfaces';

@Component({
  selector: 'dps-client-search-popup',
  templateUrl: './client-search-popup.component.html',
  styleUrls: ['./client-search-popup.component.scss']
})
export class ClientSearchPopupComponent implements OnInit {
  length = 50;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;

  @Input() clientSearchGridData: any;
  @Input() clientPaginatorDef: PaginatorDef;
  @Input() activeView;
  @Input() clientColumnDef: ColumnDef[];
  @Input() clientData: any;
  @Input() searchText: string;
  @Input() isPopup: boolean;
  @Input() totalItems: number;
  @Input() gridLoading: boolean;
  @Input() popupInputData: ClientSearchPopupData;
  @Input() menuItem: MainMenuItem<any>[];

  @Output() viewChange = new EventEmitter();
  @Output() clientPopupClosed = new EventEmitter<string>();
  @Output() updateSelectedSearchTextClear = new EventEmitter<string>();
  @Output() clientSearchSubmit = new EventEmitter();
  @Output() selectedClientRowData = new EventEmitter();

  clientPopupType = ClientPopupType;

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.clientPopupClosed.emit('close');
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.viewChange.emit({ kind: ClientSearchKind.ClientPageChange, value: pageDef });
  }

  public popupRowdblclick(row: ClientGridRowRapper): void {
    this.selectedClientRowData.emit({ item: row, gridData: this.clientSearchGridData });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.clientSearchSubmit.emit({ kind: ClientSearchKind.ApplyClientColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.clientSearchSubmit.emit({ kind: ClientSearchKind.ClearClientColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    if (def.fieldName !== 'MatterCount') {
      this.clientSearchSubmit.emit({ kind: ClientSearchKind.ToggleClientFieldSort, value: def });
    }
  }

  onSearchTextChanged(value) {
    this.clientSearchSubmit.emit(value);
  }

  onSearchTextClear() {
    this.updateSelectedSearchTextClear.emit();

  }
  // onUpdateSearchTextClick(value) {

  //   this.clientSearchSubmit.emit(value);
  // }

  popupRowclick(item) {

  }

  get getClientTitle(): string {
    return this.menuItem.find(i => i.id === 'client_search').label;
  }

}
