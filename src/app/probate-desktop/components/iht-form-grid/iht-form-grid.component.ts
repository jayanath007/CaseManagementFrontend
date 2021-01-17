import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { IhtFormsData } from '../../../probate-core/models/interfaces';

@Component({
  selector: 'dps-iht-form-grid',
  templateUrl: './iht-form-grid.component.html',
  styleUrls: ['./iht-form-grid.component.scss']
})
export class IhtFormGridComponent implements OnInit {
  @Input() ihtForms: any;
  @Input() ihtFormsData: IhtFormsData[];
  @Input() selectedIhtRow: IhtFormsData;

  @Output() openIhtFrom = new EventEmitter<any>();

  displayedColumns: string[] = ['Form', 'Date Generated', 'User'];
  dataSource;

  get ihtForm() {
    return this.ihtFormsData ?
      this.dataSource = new MatTableDataSource(this.ihtFormsData) : [];
  }
  constructor() { }

  ngOnInit() {
  }


  onEditIHTClick(row: IhtFormsData) {
    if (row) {
      this.openIhtFrom.emit(row);

    }


  }

  onSelectedIhtRow(event, row: IhtFormsData) {


  }



}
