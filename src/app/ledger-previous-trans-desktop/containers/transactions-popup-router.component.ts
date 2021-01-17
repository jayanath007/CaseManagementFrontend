import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PreviousTransactionsManagerComponent } from './previous-transactions-manager.component';


@Component({
    selector: 'dps-transactions-popup-router',
    template: `<dps-previous-transactions-manager [preTransactionsPopupToken]="data.token" [input]="data.input" #transactionsManager
                (closePopup)="onClose()">
  <dps-transactions-popup-layout
    [isPreviousTransLoading]='transactionsManager.isPreviousTransLoading$ | async'
    [previousTransGridData]="transactionsManager.previousTransGridData$ | async"
    [gridFilterData]="transactionsManager.gridFilterData$ | async"
    [matterData]="transactionsManager.matterData$ | async"
    (changePage)="transactionsManager.onChangePage($event)"
    (gridFilterChangeChange)="transactionsManager.onGridFilterChangeType($event)"
    (showBalancesCheckChange)="transactionsManager.onShowBalancesCheckChange($event)"
    (printReport)="transactionsManager.onPrintReport()"
    (popupClosed)="transactionsManager.onPopupClosed()"
    (columsSortApply)="transactionsManager.onGridColumsSortApply($event)"
    (applyColumFilter)="transactionsManager.onApplyColumFilter($event)">
  </dps-transactions-popup-layout>
</dps-previous-transactions-manager>`,
})

export class TransactionsPopupRouterComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<PreviousTransactionsManagerComponent>) { }

    ngOnInit() {
    }
    onClose() {
        this.dialogRef.close();
    }
}
