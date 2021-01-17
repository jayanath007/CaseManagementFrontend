import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MatterInputData } from '../../../core/lib/matter';
import {
  MatterData, MatterBalances, AllGridFilterModel,
  AllGridFilterUpdate, AllGrid, BillGrid, DisbsGrid, CurrenciesView, ClientGrid, GBPGrid, DDAGrid, CurrencyLabel, EChitGrid
} from './../../../ledger-card-core/models/interfce';
import { ViewChangeKind } from '../../../ledger-card-core/models/enumeration';

@Component({
  selector: 'dps-ledger-card-layout',
  templateUrl: './ledger-card-layout.component.html',
  styleUrls: ['./ledger-card-layout.component.scss']
})
export class LedgerCardLayoutComponent implements OnInit, OnChanges {

  constructor(private popupService: SystemJsPopupLoaderService) { }

  @Input() isLoading: boolean;
  @Input() matterData: MatterData;
  @Input() selectedTab: number;
  @Input() currencyView: CurrenciesView[];
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
  @Input() allMatterCount: number;
  @Input() eChitGridData: EChitGrid;

  @Output() changeSelectedTab = new EventEmitter<number>();
  @Output() updateMatterRef = new EventEmitter<string>();
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
  @Output() openMatter = new EventEmitter<MatterData>();
  @Output() resetData = new EventEmitter();
  @Output() printLedgerCard = new EventEmitter<{ matterData: MatterData, allGridFilterData: AllGridFilterModel }>();
  @Output() openBillingGuide = new EventEmitter<any>();
  @Output() openPreTransactionPopup = new EventEmitter<any>();

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterData && this.matterData) {
      if (!this.matterData.app_Code && !changes.matterData.isFirstChange()) {
        this.openMatterSearchPopup();
      }
    }
  }
  openMatterSearchPopup() {
    const matterInputData: MatterInputData = { isMatterSearch: false };
    this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result) => {
      if (!result) {
        return '';
      }
      this.updateMatterRef.emit(result.MatterReferenceNo ? result.MatterReferenceNo : null);
    });
  }

  onOpenMatterSearch(searchKey) {
    if (!searchKey) {
      this.openMatterSearchPopup();
    } else {
      this.updateMatterRef.emit(searchKey ? searchKey : null);
    }

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

  onGridRefresh() {
    this.gridRefresh.emit();
  }

  onOpenAllMattersPopup() {
    const clientRef = this.matterData.clientRef;
    this.popupService.openMatterByClientPopup('LedgerCard-MatterViewByClient', { clientRef: clientRef }
    ).subscribe((result) => {
      if (!result) {
        return '';
      }
      this.updateMatterRef.emit(result.matterRef ? result.matterRef : null);
    });
  }

  onOpenMatter(matterData) {
    this.openMatter.emit(matterData);
  }

  onResetData() {
    this.resetData.emit();
  }

  onUpdatePeriodFilter(value) {
    this.allGridViewChange.emit({ kind: ViewChangeKind.periodColumnFilter, value });
  }

  onPrintLedgerCard() {
    this.printLedgerCard.emit({ matterData: this.matterData, allGridFilterData: this.allGridFilterData });
  }
  onOpenBillingGuide() {
    this.openBillingGuide.emit(this.matterData);
  }
  onOpenPreTransactionPopup() {
    this.openPreTransactionPopup.emit(this.matterData);
  }

}
