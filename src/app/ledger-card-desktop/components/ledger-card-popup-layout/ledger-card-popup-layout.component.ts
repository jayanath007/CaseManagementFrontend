import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  CurrenciesView, MatterBalances, CurrencyLabel, AllGridFilterModel, AllGrid, BillGrid,
  DisbsGrid, GBPGrid, DDAGrid, ClientGrid, AllGridFilterUpdate, MatterData, EChitGrid
} from '../../../ledger-card-core/models/interfce';

@Component({
  selector: 'dps-ledger-card-popup-layout',
  templateUrl: './ledger-card-popup-layout.component.html',
  styleUrls: ['./ledger-card-popup-layout.component.scss']
})
export class LedgerCardPopupLayoutComponent implements OnInit {

  constructor() { }
  @Input() isLoading: boolean;
  // @Input() matterData: MatterData;
  @Input() selectedTab: number;
  @Input() currencyView: CurrenciesView[];
  @Input() matterData: MatterData;
  @Input() matterBalances: MatterBalances;
  @Input() currencyLabel: CurrencyLabel;
  @Input() allGridFilterData: AllGridFilterModel;
  @Input() allGridData: AllGrid;
  @Input() billGridData: BillGrid;
  @Input() disbsGridData: DisbsGrid;
  @Input() gbpGridData: GBPGrid;
  @Input() ddaGridData: DDAGrid;
  @Input() client1GridData: ClientGrid;
  @Input() client2GridData: ClientGrid;
  @Input() client3GridData: ClientGrid;
  @Input() eChitGridData: EChitGrid;

  @Output() changeSelectedTab = new EventEmitter<number>();
  @Output() updateAllGridFilter = new EventEmitter<AllGridFilterUpdate>();
  @Output() allGridViewChange = new EventEmitter();
  @Output() billGridViewChange = new EventEmitter();
  @Output() disbsGridViewChange = new EventEmitter();
  @Output() gbpGridViewChange = new EventEmitter();
  @Output() ddaGridViewChange = new EventEmitter();
  @Output() client1GridViewChange = new EventEmitter();
  @Output() client2GridViewChange = new EventEmitter();
  @Output() client3GridViewChange = new EventEmitter();
  @Output() closeLedgerCard = new EventEmitter();
  @Output() gridRefresh = new EventEmitter<string>();
  @Output() printLedgerCard = new EventEmitter<{ matterData: MatterData, allGridFilterData: AllGridFilterModel }>();
  @Output() openBillingGuide = new EventEmitter<any>();
  @Output() openPreTransactionPopup = new EventEmitter<any>();

  ngOnInit() {
  }

  onUpdateAllGridFilter(data: AllGridFilterUpdate) {
    this.updateAllGridFilter.emit(data);
  }

  onAllGridViewChange(data) {
    this.allGridViewChange.emit(data);
  }

  onBillGridViewChange(data) {
    this.billGridViewChange.emit(data);
  }

  onDISBSGridViewChange(data) {
    this.disbsGridViewChange.emit(data);
  }

  onGBPGridViewChange(data) {
    this.gbpGridViewChange.emit(data);
  }

  onDDAGridViewChange(data) {
    this.ddaGridViewChange.emit(data);
  }

  onClient1GridViewChange(data) {
    this.client1GridViewChange.emit(data);
  }

  onClient2GridViewChange(data) {
    this.client2GridViewChange.emit(data);
  }
  onClient3GridViewChange(data) {
    this.client3GridViewChange.emit(data);
  }
  onChangeTap(tabIndex: number) {
    this.changeSelectedTab.emit(tabIndex);
  }
  onClose() {
    this.closeLedgerCard.emit();
  }
  onGridRefresh() {
    this.gridRefresh.emit();
  }
  onPrintLedgerCard() {
    this.printLedgerCard.emit({ matterData: this.matterData, allGridFilterData: this.allGridFilterData });
  }
  onOpenBillingGuided() {
    this.openBillingGuide.emit(this.matterData);
  }
  onOpenPreTransactionPopup() {
    this.openPreTransactionPopup.emit(this.matterData);
  }

}
