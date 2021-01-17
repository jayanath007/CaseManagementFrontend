import { PreviousTransInput } from './../../ledger-previous-trans-core/models/interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BasePreviousTransManager } from '../../ledger-previous-trans-core/containers/base-previous-trans-manager';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';

@Component({
  selector: 'dps-previous-transactions-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class PreviousTransactionsManagerComponent extends BasePreviousTransManager implements OnInit {

  @Input() preTransactionsPopupToken: string;
  @Input() input: PreviousTransInput;

  @Output() closePopup = new EventEmitter<any>();

  constructor(store: Store<any>, private popupService: SystemJsPopupLoaderService) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.preTransactionsPopupToken, this.input);
  }
  onPopupClosed(info: any) {
    this.closePopup.emit(info);
  }
  onChangePage(paginatorDef: PaginatorDef) {
    this.changePage(this.preTransactionsPopupToken, paginatorDef);
  }
  onGridFilterChangeType(gridFilterChangeType) {
    this.gridFilterChangeType(this.preTransactionsPopupToken, gridFilterChangeType);
  }
  onGridColumsSortApply(columnDef: ColumnDef) {
    this.applyColumSort(this.preTransactionsPopupToken, columnDef);
  }
  onApplyColumFilter(event: { columnDef: ColumnDef, isClear: boolean }) {
    this.applyColumFilter(this.preTransactionsPopupToken, event);
  }

  onShowBalancesCheckChange(value) {
    this.showBalancesCheckChange(this.preTransactionsPopupToken, value);
  }
  onPrintReport() {
    this.printReport(this.preTransactionsPopupToken);
  }

}
