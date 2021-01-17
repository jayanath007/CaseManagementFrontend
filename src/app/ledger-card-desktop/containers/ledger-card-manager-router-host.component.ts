import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-ledger-card-manager-router-host',
  template: `<dps-ledger-card-manager [isPopup]="false" [ledgerCardToken]="'LedgerCardPage'" [input]="" #ledgerCardManager>
  <dps-ledger-card-layout
  [isLoading]="ledgerCardManager.isLoading$ | async"
  [matterData]="ledgerCardManager.matterData$ | async"
  [selectedTab]="ledgerCardManager.selectedTab$ | async"
  [matterBalances]="ledgerCardManager.matterBalances$ | async "
  [currencyLabel]="ledgerCardManager.currencyLabel$ | async "
  [allGridFilterData]="ledgerCardManager.allGridFilterData$ | async"
  [allGridData]="ledgerCardManager.allGridData$ | async"
  [billGridData]="ledgerCardManager.billGridData$ | async"
  [disbsGridData]="ledgerCardManager.disbsGridData$ | async"
  [gbpGridData]="ledgerCardManager.gbpGridData$ | async"
  [ddaGridData]="ledgerCardManager.ddaGridData$ | async"
  [client1GridData]="ledgerCardManager.client1GridData$ | async"
  [client2GridData]="ledgerCardManager.client2GridData$ | async"
  [client3GridData]="ledgerCardManager.client3GridData$ | async"
  [eChitGridData]="ledgerCardManager.eChitGridData$| async"
  [currencyView]="ledgerCardManager.currencyView$ | async"
  [allMatterCount]="ledgerCardManager.allMatterCount$ | async"
  (changeSelectedTab)="ledgerCardManager.onChangeTap($event)"
  (updateMatterRef)="ledgerCardManager.onUpdateMatterRef($event)"
  (updateAllGridFilter)="ledgerCardManager.onUpdateAllGridFilter($event)"
  (allGridViewChange)="ledgerCardManager.onAllGridViewChange($event)"
  (billGridViewChange)="ledgerCardManager.onBillGridViewChange($event)"
  (disbsGridViewChange)="ledgerCardManager.onDISBSGridViewChange($event)"
  (gbpGridViewChange)="ledgerCardManager.onGBPGridViewChange($event)"
  (ddaGridViewChange)="ledgerCardManager.onDDAGridViewChange($event)"
  (client1GridViewChange)="ledgerCardManager.onClient1GridViewChange($event)"
  (client2GridViewChange)="ledgerCardManager.onClient2GridViewChange($event)"
  (client3GridViewChange)="ledgerCardManager.onClient2GridViewChange($event)"
  (gridRefresh)="ledgerCardManager.onGridRefresh()"
  (openMatter)="ledgerCardManager.onOpenMatter($event)"
  (resetData)="ledgerCardManager.onResetData()"
  (printLedgerCard)="ledgerCardManager.onPrintLedgerCard($event)"
  (openBillingGuide)="ledgerCardManager.onOpenBillingGuide($event)"
  (openPreTransactionPopup)="ledgerCardManager.onOpenPreTransaction($event)"
 >
  </dps-ledger-card-layout>
  <dps-ledger-card-manager>`,

})
export class LedgerCardManagerRouterHostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
