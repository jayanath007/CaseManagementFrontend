import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { TransactionGridRow, Transactions } from '../../../probate-core/models/interfaces';

@Component({
  selector: 'dps-transaction-grid',
  templateUrl: './transaction-grid.component.html',
  styleUrls: ['./transaction-grid.component.scss']
})
export class TransactionGridComponent implements OnInit {
  @Input() transactions: Transactions;
  @Input() selectedRow: TransactionGridRow;


  @Output() edittransactionClick = new EventEmitter<any>();

  @Output() selectedRowClick = new EventEmitter<any>();

  displayedColumns: string[] = ['Trans Date', 'Item', 'Type', 'Details', 'Credit', 'Debit'];
  dataSource;

  get transDataSource() {
    return this.transactions && this.transactions.transactionViewItems ?
      this.dataSource = new MatTableDataSource(this.transactions.transactionViewItems) : [];
  }
  @ViewChild(MatSort) sort: MatSort;


  constructor() { }

  ngOnInit() {
  }

  onEdittransactionClick(event, row) {
    event.preventDefault();
    event.stopPropagation();



    this.edittransactionClick.emit(row);
  }
  onSelectedRow(event, row, type) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedRowClick.emit({ row: row, type: type });
  }


}
