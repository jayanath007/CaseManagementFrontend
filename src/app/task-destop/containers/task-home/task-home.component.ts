import { PageEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentBase } from '../../../core';
import * as taskCore from '../../../task-core';
import { ViewChangeKind, RowItemChangeKind } from '../../../task-core/actions/core';
import { FileItemWrapper } from '../../../task-core/models/interface';
import { MatterInfo } from '../../../core/lib/matter';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'dps-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss']
})
export class TaskHomeComponent extends ComponentBase implements OnInit, OnChanges {


  @Input()
  matterInfo: MatterInfo;

  token: string;
  public taskData$: any;
  public serchText$: any;
  public pageInfo$: any;

  username: string;

  constructor(private store: Store<any>) {
    super();
  }


  IsExpand(item: FileItemWrapper) {
    console.log('IsExpand', item);
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(new taskCore.TaskGridRowChange(this.token, { kind: RowItemChangeKind.IsExpand, row: item, value: '' }));
  }
  PageChangeEvent(pageEvent: PageEvent) {
    // tslint:disable-next-line:max-line-length
    console.log('PageChangeEvent', pageEvent);
    this.store.dispatch(new taskCore.TaskViewChange(this.token, { kind: ViewChangeKind.PageEvent, value: pageEvent }));
  }

  OnSearchTextChanged(searchText) {
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(new taskCore.TaskViewChange(this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }


  handleViewChanges(state) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {
      this.token = 'InitTask' + changes.matterInfo.currentValue.MatterReferenceNo;
      this.store.dispatch(new taskCore.InitTask(this.token, this.matterInfo));
      this.taskData$ = this.store.select(taskCore.getTaskGridDataByToken(this.token));
      this.serchText$ = this.store.select(taskCore.getTaskSearchTextByToken(this.token));
      this.pageInfo$ = this.store.select(taskCore.getTaskPageEventByToken(this.token));
    }
  }

  ngOnInit() {
    const viewUpdate = this.taskData$.pipe(
      takeUntil(this.destroy$))
      .subscribe((state) => {
        this.handleViewChanges(state);
        console.log('data', state);
      });
  }

}
