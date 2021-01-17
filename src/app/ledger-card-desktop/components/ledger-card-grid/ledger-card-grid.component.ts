import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  AllGridFilterModel, AllGridFilterUpdate, AllGrid,
  BillGrid, DisbsGrid, CurrenciesView, ClientGrid, GBPGrid, DDAGrid, CurrencyLabel, MatterData, EChitGrid
} from '../../../ledger-card-core/models/interfce';
import { MatTabChangeEvent } from '@angular/material';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-ledger-card-grid',
  templateUrl: './ledger-card-grid.component.html',
  styleUrls: ['./ledger-card-grid.component.scss']
})
export class LedgerCardGridComponent implements OnInit {

  @Input() selectedTab: number;
  @Input() currencyView: CurrenciesView[];
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
  @Input() matterData: MatterData;


  @Output() changeSelectedTab = new EventEmitter<number>();
  @Output() updateAllGridFilter = new EventEmitter<AllGridFilterUpdate>();
  @Output() allGridViewChange = new EventEmitter();
  @Output() billGridViewChange = new EventEmitter();
  @Output() dispsGridViewChange = new EventEmitter();
  @Output() gbpGridViewChange = new EventEmitter();
  @Output() ddaGridViewChange = new EventEmitter();
  @Output() client1GridViewChange = new EventEmitter();
  @Output() client2GridViewChange = new EventEmitter();
  @Output() client3GridViewChange = new EventEmitter();
  @Output() refresh = new EventEmitter<string>();
  @Output() updatePeriodFilter = new EventEmitter<string>();
  @Output() printLedgerCard = new EventEmitter<string>();
  @Output() printPreTransaction = new EventEmitter<string>();
  @Output() openBillingGuide = new EventEmitter<any>();
  @Output() openPreTransactionPopup = new EventEmitter<any>();
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  constructor(private menu: MainMenuItemResolverService) { }

  ngOnInit() {
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';
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

  onDISPSGridViewChange(data) {
    this.dispsGridViewChange.emit(data);
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

  // onChangeTap(tab: MatTabChangeEvent) {
  //   this.changeSelectedTab.emit(tab.index);
  // }

  onChangeTap(index: number) {
    this.changeSelectedTab.emit(index);
  }

  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= this.fontSize !== 1 ? 1 : 2;
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += this.fontSize !== -1 ? 1 : 2;
    }
  }
  onRefresh() {
    this.refresh.emit();
  }
  onUpdatePeriodFilter(value) {
    this.updatePeriodFilter.emit(value);
  }

  onPrintLedgerCard() {


    this.printLedgerCard.emit();

  }
  onPrintPreTransaction() {
    this.printPreTransaction.emit();
  }
  onOpenBillingGuide() {

    this.openBillingGuide.emit();
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }
  onOpenPreTransactionPopup() {
    this.openPreTransactionPopup.emit();
  }
}
