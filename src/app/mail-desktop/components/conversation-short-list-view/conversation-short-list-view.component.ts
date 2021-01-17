
import { distinctUntilChanged, takeUntil, throttleTime } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';



import { ConversationListItem } from '../../../mail-core';
import { ComponentBase } from '../../../core';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'dps-conversation-short-list-view',
  templateUrl: './conversation-short-list-view.component.html',
  styleUrls: ['./conversation-short-list-view.component.scss']
})
export class ConversationShortListViewComponent extends ComponentBase implements OnInit {
  @Input() conversations: ConversationListItem[];
  @Input() isConversationsLoading: boolean;
  @Input() timeZone: string;
  @Input() companyCode: string;

  @Output() conversationSelect = new EventEmitter();
  @Output() conversationDelete = new EventEmitter();
  @Output() loadMoreConversations = new EventEmitter();

  virtualScrolling$ = new Subject();
  viewPortItems = [];
  constructor() { super(); }

  ngOnInit() {
    this.virtualScrolling$.pipe(
      throttleTime(500, async, { leading: true, trailing: true }),
      takeUntil(this.destroy$)).pipe(
        distinctUntilChanged((x: any, y: any) => x.end === y.end))
      .subscribe((event: any) => {
        if (this.conversations.length >= 50 && (this.conversations.length - event.end <= 10)) {
          this.loadMoreConversations.emit(this.conversations.length);
        }
      });
  }
  onListChange(event) {
    this.virtualScrolling$.next(event);
  }
  onConversationSelect(event) {
    this.conversationSelect.emit(event);
  }
  onConversationDelete(event) {
    this.conversationDelete.emit(event);
  }
}
