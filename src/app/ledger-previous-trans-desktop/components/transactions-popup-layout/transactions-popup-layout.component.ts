import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { GridFilterType } from '../../../ledger-previous-trans-core/models/enums';
import { GridFilterModel, MatterData, PreviousTransGrid } from '../../../ledger-previous-trans-core/models/interface';
import { Condition, Filter } from '../../../odata';

@Component({
  selector: 'dps-transactions-popup-layout',
  templateUrl: './transactions-popup-layout.component.html',
  styleUrls: ['./transactions-popup-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionsPopupLayoutComponent implements OnInit {

  @Input() isPreviousTransLoading: boolean;
  // @Input() gridCloumnVisibleStatus: any;
  // @Input() columnDef: ColumnDef[];
  @Input() previousTransGridData: PreviousTransGrid;
  @Input() paginetorDef: PaginatorDef;
  @Input() gridFilterData: GridFilterModel;
  @Input() matterData: MatterData;

  @Output() showBalancesCheckChange = new EventEmitter<boolean>();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() gridFilterChangeChange = new EventEmitter<GridFilterType>();
  @Output() columsSortApply = new EventEmitter<ColumnDef>();
  @Output() printReport = new EventEmitter<any>();
  @Output() popupClosed = new EventEmitter<any>();
  @Output() applyColumFilter = new EventEmitter<{ columnDef: ColumnDef, isClear: boolean }>();

  gridFilterType = GridFilterType;
  filterType: GridFilterType;
  balanceOnly: boolean;

  constructor() { }

  ngOnInit() {
  }
  get radioButtonValue() {
    if (this.gridFilterData && this.gridFilterData.showAll) {
      return this.filterType = GridFilterType.showAll;
    } else if (this.gridFilterData && this.gridFilterData.showClient) {
      return this.filterType = GridFilterType.showClient;
    } else if (this.gridFilterData && this.gridFilterData.showOffice) {
      return this.filterType = GridFilterType.showOffice;
    } else {
      return GridFilterType.showAll;
    }
  }
  get getGridColumnDef(): ColumnDef[] {
    if (this.previousTransGridData && this.previousTransGridData.gridColumns) {
      if (!this.gridFilterData) {
        return this.previousTransGridData.gridColumns;
      } else if (this.gridFilterData.showClient) {
        return this.previousTransGridData.gridColumns.filter(c =>
          !(c.fieldName === 'OfficeDr' || c.fieldName === 'OfficeCr' || c.fieldName === 'OfficeBal' ||
            c.fieldName === 'DDACr' || c.fieldName === 'DDADr' || c.fieldName === 'DDAbal'));
      } else if (this.gridFilterData.showOffice) {
        return this.previousTransGridData.gridColumns.filter(c =>
          !(c.fieldName === 'ClientDr' || c.fieldName === 'ClientCr' || c.fieldName === 'ClientBal' ||
            c.fieldName === 'DDACr' || c.fieldName === 'DDADr' || c.fieldName === 'DDAbal'));
      }
      return this.previousTransGridData.gridColumns;
    } else {
      return [];
    }
  }
  onClose(event) {
    this.popupClosed.emit();
  }
  onChangePage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.changePage.emit(pageDef);
  }
  onToggleSorting(def: ColumnDef) {
    this.columsSortApply.emit(def);
  }
  onGridFilterChange(event) {
    this.gridFilterChangeChange.emit(event);
  }
  onShowBalancesChange(value) {
    this.balanceOnly = value;
    this.showBalancesCheckChange.emit(value);
  }
  onPrint() {
    this.printReport.emit();
  }
  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.applyColumFilter.emit({ columnDef: filterDef, isClear: true });
  }
  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.applyColumFilter.emit({ columnDef: filterDef, isClear: false });
    }
  }
  get filterTypeClass(): string {
    let cssClass = '';
    if (this.gridFilterData.showAll) {
      cssClass = 'grid-selected-all';
    } else if (this.gridFilterData.showOffice) {
      cssClass = 'grid-selected-office';
    } else if (this.gridFilterData.showClient) {
      cssClass = 'grid-selected-client';
    }
    return this.balanceOnly ? `${cssClass} balance-checked` : cssClass;
  }
}
