import { PageEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentBase } from '../../../core';
import * as timeCore from '../../../time-core';
import { ViewChangeKind, RowItemChangeKind } from '../../../time-core/actions/core';
import { TimeItemWrapper } from '../../../time-core/models/interface';
import { MatterInfo } from '../../../core/lib/matter';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'dps-time-home',
  templateUrl: './time-home.component.html',
  styleUrls: ['./time-home.component.scss']
})
export class TimeHomeComponent extends ComponentBase implements OnInit, OnChanges {


  @Input()
  matterInfo: MatterInfo;

  token: string;
  public timeData$: any;
  public serchText$: any;
  public pageInfo$: any;

  username: string;

  constructor(private store: Store<any>) {
    super();
  }


  IsExpand(item: TimeItemWrapper) {
    console.log('IsExpand', item);
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(new timeCore.TimeGridRowChange(this.token, { kind: RowItemChangeKind.IsExpand, row: item, value: '' }));
  }
  PageChangeEvent(pageEvent: PageEvent) {
    // tslint:disable-next-line:max-line-length
    console.log('PageChangeEvent', pageEvent);
    this.store.dispatch(new timeCore.TimeViewChange(this.token, { kind: ViewChangeKind.PageEvent, value: pageEvent }));
  }

  OnSearchTextChanged(searchText) {
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(new timeCore.TimeViewChange(this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }


  handleViewChanges(state) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {
      this.token = 'InitTime' + changes.matterInfo.currentValue.MatterReferenceNo;
      this.store.dispatch(new timeCore.InitTime(this.token, this.matterInfo));
      this.timeData$ = this.store.select(timeCore.getTimeGridDataByToken(this.token));
      this.serchText$ = this.store.select(timeCore.getTimeSearchTextByToken(this.token));
      this.pageInfo$ = this.store.select(timeCore.getTimePageEventByToken(this.token));
    }
  }

  ngOnInit() {
    const viewUpdate = this.timeData$.pipe(
      takeUntil(this.destroy$))
      .subscribe((state) => {
        this.handleViewChanges(state);
        console.log('data', state);
      });
  }

}
