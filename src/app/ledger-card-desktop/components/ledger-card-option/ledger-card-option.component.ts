import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AllGridFilterModel, AllGridFilterUpdate } from '../../../ledger-card-core/models/interfce';
import { allGridFilterKind } from '../../../ledger-card-core/models/enumeration';
import { emit } from 'cluster';

@Component({
  selector: 'dps-ledger-card-option',
  templateUrl: './ledger-card-option.component.html',
  styleUrls: ['./ledger-card-option.component.scss']
})
export class LedgerCardOptionComponent implements OnInit {

  @Input() selectedTab: number;
  @Input() filterData: AllGridFilterModel;

  @Output() updateAllGridFilter = new EventEmitter<AllGridFilterUpdate>();
  @Output() updatePeriodFilter = new EventEmitter<number>();
  @Output() printLedgerCard = new EventEmitter<any>();
  @Output() printPreTransaction = new EventEmitter<any>();
  @Output() openBillingGuide = new EventEmitter<any>();
  @Output() openPreTransactionPopup = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onChangeShowDDA(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showDDA, value: isChecked });
  }

  onChangeShowBalanceOnly(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showBalanceOnly, value: isChecked });
  }

  onChangeShowCOS(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showCOS, value: isChecked });
  }

  onChangeShowReversal(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showReversal, value: isChecked });
  }

  onChangeShowURN(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showURN, value: isChecked });
  }

  onChangeHideSysBills(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showSysBills, value: isChecked });
  }

  onChangeShowTransPeriods(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showTransPeriods, value: isChecked });
  }

  onChangeShowOnlyOfficeTrans(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showOnlyOfficeTrans, value: isChecked });
  }

  onChangeShowshowOnlyDisbuersements(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.showOnlyDisbuersements, value: isChecked });
  }

  onChangeShowBillsOnly(isChecked: boolean) {
    this.updateAllGridFilter.emit({ kind: allGridFilterKind.isBillsOnly, value: isChecked });
  }

  onPeriodKeyDown(event, value) {
    if (event.keyCode === 13) {
      this.updatePeriodFilter.emit(value);
    }
  }

  onPeriodAdd(value) {
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
  onOpenPreTransactionPopup() {
    this.openPreTransactionPopup.emit();
  }

}
