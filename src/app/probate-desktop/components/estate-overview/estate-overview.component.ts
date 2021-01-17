import { Component, Input, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { EstateOverViews } from '../../../probate-core/models/interfaces';



@Component({
  selector: 'dps-estate-overview',
  templateUrl: './estate-overview.component.html',
  styleUrls: ['./estate-overview.component.scss']
})
export class EstateOverviewComponent implements OnInit {
  @Input() estateOverViews: EstateOverViews;
  @Input() selectedRow: any;

  @Output() editEstateClick = new EventEmitter<any>();
  @Output() selectedRowClick = new EventEmitter<any>();



  displayedColumns: string[] = ['Type', 'Category', 'Description', 'Status', 'Assets', 'Liabilities', 'Exemption', 'Gifts'];
  footerTotal: string[] = ['Assets', 'Liabilities', 'Exemption', 'Gifts'];
  dataSource;

  get estateDataSource() {
    return this.estateOverViews && this.estateOverViews.estateViewItems ?
      this.dataSource = new MatTableDataSource(this.estateOverViews.estateViewItems) : [];
  }
  @ViewChild(MatSort) sort: MatSort;



  constructor() { }

  ngOnInit() {

  }

  onEditEstateClick(event, row) {
    event.preventDefault();
    event.stopPropagation();
    this.editEstateClick.emit(row);

  }

  onSelectedRow(event, row, type) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedRowClick.emit({ row: row, type: type });
  }

  roundValue(value) {
    return Math.round(value);
  }
  fixValue(value) {
    if (value === null) {
      return 0;
    } else {
      return value;
    }
  }

}
