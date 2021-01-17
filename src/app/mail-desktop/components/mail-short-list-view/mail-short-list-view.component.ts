
import { distinctUntilChanged, takeUntil, throttleTime } from 'rxjs/operators';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { MessageItemWrapper, MessageListItem } from '../../../mail-item-core';
import { MessageListActions } from '../../../mail-core';
import { Subject } from 'rxjs';
import { ComponentBase } from '../../../core';
import { async } from 'rxjs/internal/scheduler/async';


@Component({
  selector: 'dps-mail-short-list-view',
  templateUrl: './mail-short-list-view.component.html',
  styleUrls: ['./mail-short-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailShortListViewComponent extends ComponentBase implements OnInit {

  constructor() { super(); }

  @Input() items: MessageListItem<MsGraphBeta.Message>[];
  @Input() selectedItems: MessageItemWrapper[];
  @Input() timeZone: boolean;
  @Input() total: number;
  @Input() itemsLoading: boolean;
  @Input() companyCode: any;

  @Output() itemsReadUnread = new EventEmitter();
  @Output() itemsFlag = new EventEmitter();
  @Output() itemCheck = new EventEmitter();
  @Output() itemsDelete = new EventEmitter();
  @Output() itemSelect = new EventEmitter();
  @Output() viewChange = new EventEmitter();

  virtualScrolling$ = new Subject();
  viewPortItems = [];

  ngOnInit() {
    this.virtualScrolling$.pipe(
      throttleTime(500, async, { leading: true, trailing: true }),
      takeUntil(this.destroy$)).pipe(
        distinctUntilChanged((x: any, y: any) => x.end === y.end))
      .subscribe((event: any) => {
        this.viewChange.emit([{ kind: MessageListActions.VirtualScroll, value: { end: event.end } }]);
      });
  }

  onItemsReadUnread({ items, isRead }) {
    this.itemsReadUnread.emit({ items: items, isRead: isRead });
  }
  onItemsFlag({ items, flag }) {
    this.itemsFlag.emit({ items: items, flag: flag });
  }
  onItemCheck(item) {
    this.itemCheck.emit(item);
  }
  onItemsDelete({ items, deleteOnlyList }) {
    this.itemsDelete.emit({ items: items, deleteOnlyList: deleteOnlyList });
  }

  onItemSelect(item) {
    this.itemSelect.emit(item);
  }

  onListChange(event: any) {
    // this.viewChange.emit([{ kind: MessageListActions.VirtualScroll, value: { end: event.end } }]);
    this.virtualScrolling$.next(event);
  }

}
