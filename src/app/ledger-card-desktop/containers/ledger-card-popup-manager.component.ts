import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-ledger-card-popup-manager',
  template: `<dps-ledger-card-manager [isPopup]=true [ledgerCardToken]="data.token" [input]="data.input" #ledgerCardManager
  (closePopup)="onClose()">
  <dps-ledger-card-popup-layout
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
  (changeSelectedTab)="ledgerCardManager.onChangeTap($event)"
  (updateAllGridFilter)="ledgerCardManager.onUpdateAllGridFilter($event)"
  (allGridViewChange)="ledgerCardManager.onAllGridViewChange($event)"
  (billGridViewChange)="ledgerCardManager.onBillGridViewChange($event)"
  (disbsGridViewChange)="ledgerCardManager.onDISBSGridViewChange($event)"
  (gbpGridViewChange)="ledgerCardManager.onGBPGridViewChange($event)"
  (ddaGridViewChange)="ledgerCardManager.onDDAGridViewChange($event)"
  (client1GridViewChange)="ledgerCardManager.onClient1GridViewChange($event)"
  (client2GridViewChange)="ledgerCardManager.onClient2GridViewChange($event)"
  (client3GridViewChange)="ledgerCardManager.onClient2GridViewChange($event)"
  (closeLedgerCard)="ledgerCardManager.onCloseLedgerCard()"
  (gridRefresh)="ledgerCardManager.onGridRefresh()"
  (printLedgerCard)="ledgerCardManager.onPrintLedgerCard($event)"
  (openBillingGuide)="ledgerCardManager.onOpenBillingGuide($event)"
  (openPreTransactionPopup)="ledgerCardManager.onOpenPreTransaction($event)"
  >
  </dps-ledger-card-popup-layout>

  <dps-ledger-card-manager>`,

})

export class LedgerCardPopupManagerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<LedgerCardPopupManagerComponent>) { }

  ngOnInit() {
  }
  onClose() {
    this.dialogRef.close();
  }

}
