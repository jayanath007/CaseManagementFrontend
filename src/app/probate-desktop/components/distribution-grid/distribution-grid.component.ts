import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { DistributionViewItems } from '../../../probate-core/models/interfaces';

@Component({
  selector: 'dps-distribution-grid',
  templateUrl: './distribution-grid.component.html',
  styleUrls: ['./distribution-grid.component.scss']
})
export class DistributionGridComponent implements OnInit {
  @Input() token: string;
  @Input() distributionViewItems: DistributionViewItems[];
  @Input() distributionEditRow: any;
  @Input() selectedRow: any;

  @Output() editDistributionClick = new EventEmitter<any>();

  @Output() selectedRowClick = new EventEmitter<any>();

  displayedColumns: string[] = ['Distribution', 'Details', 'Beneficiary', 'Percent', 'Date', 'Amount'];
  dataSource;

  get distributDataSource() {
    return this.distributionViewItems ?
      this.dataSource = new MatTableDataSource(this.distributionViewItems) : [];
  }
  @ViewChild(MatSort) sort: MatSort;


  constructor() { }

  ngOnInit() {
  }

  onEditDistributionClick(rowData) {
    this.editDistributionClick.emit(rowData);


  }

  onSelectedRow(event, row, type) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedRowClick.emit({ row: row, type: type });
  }

}
