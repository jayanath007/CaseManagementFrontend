import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable } from 'rxjs';
import { InitMLSWidget, RefreshMLSWidget, GetFullMatterDetails, ContinueChat, SendMessage } from '../actions/core';
import { getMLSWidgetIsloading, getMLSWidgetData, getContinueItem, getIsMsgSending, getAllMatterRef } from '../reducers';
import { ChatMessage } from './../../core/lib/mls';

@Component({
  selector: 'dps-mls-widget-manager',
  template: `<dps-mls-widget-layout
                [isLoading]="isLoading$|async"
                [data]="data$|async"
                [layout]="layout"
                [continueChatItem]="continueChatItem$|async"
                [isMsgSending]="isMsgSending$|async"
                [allMatterRef]="allMatterRef$|async"
                (removeWidget)="onRemoveWidget()"
                (openCase)="onOpenCase($event)"
                (replayToChat)="onReplyToChat($event)"
                (sendMsg)="onSendMessage($event)"
                (refreshData)="onRefreshMLSWidget()"
                >
              </dps-mls-widget-layout>`
})
export class MlsWidgetManagerComponent implements OnInit {

  constructor(protected store: Store<any>) { }

  isLoading$: any;
  data$: Observable<ChatMessage[]>;
  continueChatItem$: any;
  isMsgSending$: any;
  allMatterRef$: any;

  @Input() layout: number;

  @Output() removeWidget = new EventEmitter();

  ngOnInit() {
    this.store.dispatch(new InitMLSWidget());
    this.isLoading$ = this.store.select(getMLSWidgetIsloading());
    this.data$ = this.store.select(getMLSWidgetData());
    this.continueChatItem$ = this.store.select(getContinueItem());
    this.isMsgSending$ = this.store.select(getIsMsgSending());
    this.allMatterRef$ = this.store.select(getAllMatterRef());
  }

  onRemoveWidget() {
    this.removeWidget.emit();
  }

  onOpenCase(item: ChatMessage) {
    this.store.dispatch(new GetFullMatterDetails(item));
  }

  onReplyToChat(item: ChatMessage) {
    this.store.dispatch(new ContinueChat(item));
  }

  onSendMessage(msg: string) {
    this.store.dispatch(new SendMessage(msg));
  }

  onRefreshMLSWidget() {
    this.store.dispatch(new RefreshMLSWidget());
  }

}
