import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ProbateDealtBy } from '../../../probate-account-core/models/enum';

@Component({
  selector: 'dps-probate-payment-receipt-tab',
  templateUrl: './probate-payment-receipt-tab.component.html',
  styleUrls: ['./probate-payment-receipt-tab.component.scss']
})
export class ProbatePaymentReceiptTabComponent implements OnInit, OnChanges {
  probateDealtBy = ProbateDealtBy;
  @Input() token: string;
  @Input() transactionsEditRow: any;
  @Input() matterData: any;

  @Output() submitSaveData = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();
  constructor() { }
  paymentData;
  receiptData;
  tabIndex: number;

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {

    if (this.transactionsEditRow) {
      if (this.transactionsEditRow.dealtBy === this.probateDealtBy.Payment) {
        this.paymentData = this.transactionsEditRow;
        this.receiptData = null;
        this.tabIndex = 0;
      } else if (this.transactionsEditRow.dealtBy === this.probateDealtBy.Receipt) {
        this.receiptData = this.transactionsEditRow;
        this.paymentData = null;
        this.tabIndex = 1;

      }

    }

  }

  tabChange(event) {
    if (event.index === 0) {
      this.receiptData = null;
    } else {
      this.paymentData = null;
    }
  }

  onSubmitSaveData(submitData) {
    this.submitSaveData.emit(submitData);
  }

  onClear() {
    this.clear.emit();
  }

}

