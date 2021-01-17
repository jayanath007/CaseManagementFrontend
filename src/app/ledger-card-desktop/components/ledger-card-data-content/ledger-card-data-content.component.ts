import { CurrenciesView, CurrencyLabel, EChitGrid } from './../../../ledger-card-core/models/interfce';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  MatterData, MatterBalances, AllGridFilterModel,
  AllGridFilterUpdate, AllGrid, BillGrid, DisbsGrid
} from '../../../ledger-card-core/models/interfce';
import { MainMenuItemResolverService } from '../../../layout-desktop';


@Component({
  selector: 'dps-ledger-card-data-content',
  templateUrl: './ledger-card-data-content.component.html',
  styleUrls: ['./ledger-card-data-content.component.scss']
})
export class LedgerCardDataContentComponent implements OnInit {

  @Input() matterData: MatterData;
  @Input() matterBalances: MatterBalances;
  @Input() currencyLabel: CurrencyLabel;
  @Input() selectedTab: number;
  @Input() currencyView: CurrenciesView[];
  @Input() allGridFilterData: AllGridFilterModel;
  @Input() allGridData: AllGrid;
  @Input() billGridData: BillGrid;
  @Input() disbsGridData: DisbsGrid;
  @Input() gbpGridData: BillGrid;
  @Input() ddaGridData: AllGrid;
  @Input() client1GridData: BillGrid;
  @Input() client2GridData: AllGrid;
  @Input() client3GridData: BillGrid;
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
  @Output() gridRefresh = new EventEmitter<string>();
  @Output() updatePeriodFilter = new EventEmitter<string>();
  @Output() printLedgerCard = new EventEmitter<{ matterData: MatterData, allGridFilterData: AllGridFilterModel }>();
  @Output() openBillingGuide = new EventEmitter<any>();
  @Output() openPreTransactionPopup = new EventEmitter<any>();

  isExpandPanel = true;
  constructor(private menu: MainMenuItemResolverService) { }

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

  onRefreshGrid() {
    this.gridRefresh.emit();
  }

  onUpdatePeriodFilter(value) {
    this.updatePeriodFilter.emit(value);
  }

  onPrintLedgerCard() {
    if (this.matterData) {

      this.printLedgerCard.emit({ matterData: this.matterData, allGridFilterData: this.allGridFilterData });
    }
  }
  onOpenBillingGuide() {
    if (this.matterData) {
      this.openBillingGuide.emit(this.matterData);
    }
  }
  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }
  onOpenPreTransactionPopup() {
    this.openPreTransactionPopup.emit();
  }

}
