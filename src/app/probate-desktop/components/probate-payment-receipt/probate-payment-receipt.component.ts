import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProbateDealtBy, ReceiptType } from '../../../probate-core/models/enum';

@Component({
  selector: 'dps-probate-payment-receipt',
  templateUrl: './probate-payment-receipt.component.html',
  styleUrls: ['./probate-payment-receipt.component.scss']
})
export class ProbatePaymentReceiptComponent implements OnInit {
  receiptType = ReceiptType;
  probateDealtBy = ProbateDealtBy;
  @Input() openType: string;
  @Input() loading: string;
  @Input() transactionsEditRow: any;

  @Output() submitSaveData = new EventEmitter<any>();
  get editPaymentData() {
    if (this.transactionsEditRow && this.transactionsEditRow.subType === this.probateDealtBy.Payment) {
      this.id = this.transactionsEditRow.id;
      return this.transactionsEditRow;
    }
  }

  get editReceiptData() {
    if (this.transactionsEditRow && this.transactionsEditRow.subType === this.probateDealtBy.Receipt) {
      this.id = this.transactionsEditRow.id;
      return this.transactionsEditRow;
    }
  }


  constructor() { }
  id: number;
  amount: number;
  description: string;
  soldDate: string;
  dealtBy: number;     // payment or recept
  subType: number;

  ngOnInit() {
  }


  onPaymentDetails(value) {
    this.description = value;
  }

  onPaymentDate(value) {
    this.soldDate = value;


  }

  onPaymentAmount(value) {
    this.amount = value;

  }
  // Rec
  onChangeRecieptType(value) {
    this.subType = value;
  }

  onRecieptDetails(value) {
    this.soldDate = value;
  }
  onRecieptDate(value) {


  }

  onRecieptAmount(value) {
    this.amount = value;

  }


  onSubmitData() {
    const submitData: any = {
      id: this.id === 0 ? 0 : this.id,
      amount: this.amount,
      description: this.description,
      soldDate: this.soldDate,
      dealtBy: this.dealtBy,
      subType: this.subType,

    };
    this.submitSaveData.emit(submitData);
  }

  onCancel() {


  }

}
