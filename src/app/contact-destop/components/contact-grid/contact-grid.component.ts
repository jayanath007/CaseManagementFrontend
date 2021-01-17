import { DataSource } from '@angular/cdk/collections';

import { ContactItemWrapper } from '../../../contact-core/models/interface';
import { BehaviorSubject ,  Observable } from 'rxjs';



import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';


@Component({
  selector: 'dps-contact-grid',
  templateUrl: './contact-grid.component.html',
  styleUrls: ['./contact-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactGridComponent implements OnInit, OnChanges {

  // tslint:disable-next-line:max-line-length
  displayedColumns = ['Name', 'Company', 'Telephone',
    'Email', 'PostCode', 'RoleOnFile', 'Address'];
  dataSource: any;
  pageSizeOptions = [10, 50, 100];
  selectedRow: any;

  @Input() ContactData;
  @Input() PageInfo;
  @Output() IsExpandSelection = new EventEmitter<ContactItemWrapper>();
  @Output() PageEvent = new EventEmitter<PageEvent>();
  data: BehaviorSubject<ContactItemWrapper[]> = new BehaviorSubject<ContactItemWrapper[]>([]);


  IsExpand(item: ContactItemWrapper) {
    this.IsExpandSelection.emit(item);
  }
  PageChange(pageEvent: PageEvent) {
    this.PageEvent.emit(pageEvent);
  }
  constructor() {

  }

  mouseOverSelectedRow(row) {
    this.selectedRow = row;
  }

  ngOnInit(): void {
    this.dataSource = new GridDataSource(this.data);
  }

  ngOnChanges(changes: any) {
    if (!changes.ContactData.loading) {
      if (this.ContactData.total) {
        this.data.next(this.ContactData.data);
      }
    }
  }

}



export class GridDataSource extends DataSource<any> {

  constructor(public data: Observable<ContactItemWrapper[]>) {
    super();
  }

  connect(): Observable<ContactItemWrapper[]> {
    return this.data;
  }

  disconnect() { }
}









