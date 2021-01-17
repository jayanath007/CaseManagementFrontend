import { DataSource } from '@angular/cdk/collections';

import { TimeItemWrapper } from '../../../time-core/models/interface';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';


@Component({
  selector: 'dps-time-grid',
  templateUrl: './time-grid.component.html',
  styleUrls: ['./time-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeGridComponent implements OnInit, OnChanges {

  // tslint:disable-next-line:max-line-length
  displayedColumns = ['DateDone', 'FeeEarner', 'Description',
    'Details', 'Units', 'Value', 'Billed', 'DateBilled', 'NetBilled'
    , 'BillNo', 'FileNumber'];

  dataSource: any;
  pageSizeOptions = [10, 50, 100];


  @Input() TimeData;
  @Input() PageInfo;
  @Output() IsExpandSelection = new EventEmitter<TimeItemWrapper>();
  @Output() PageEvent = new EventEmitter<PageEvent>();
  data: BehaviorSubject<TimeItemWrapper[]> = new BehaviorSubject<TimeItemWrapper[]>([]);


  IsExpand(item: TimeItemWrapper) {
    this.IsExpandSelection.emit(item);
  }
  PageChange(pageEvent: PageEvent) {
    this.PageEvent.emit(pageEvent);
  }
  constructor() {

  }
  ngOnInit(): void {
    this.dataSource = new GridDataSource(this.data);
  }

  ngOnChanges(changes: any) {
    if (!changes.TimeData.loading) {
      if (this.TimeData.total) {
        this.data.next(this.TimeData.data);
      }
    }
  }

}



export class GridDataSource extends DataSource<any> {

  constructor(public data: Observable<TimeItemWrapper[]>) {
    super();
  }

  connect(): Observable<TimeItemWrapper[]> {
    return this.data;
  }

  disconnect() { }
}









