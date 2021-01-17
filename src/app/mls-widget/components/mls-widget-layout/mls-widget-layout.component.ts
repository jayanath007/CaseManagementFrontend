import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChatMessage } from '../../../core/lib/mls';
import { MatterRefMap } from './../../models/interface';

@Component({
  selector: 'dps-mls-widget-layout',
  templateUrl: './mls-widget-layout.component.html',
  styleUrls: ['./mls-widget-layout.component.scss']
})
export class MlsWidgetLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() data: ChatMessage[];
  @Input() layout: number;
  @Input() continueChatItem: ChatMessage;
  @Input() isMsgSending: boolean;
  @Input() allMatterRef: MatterRefMap[];

  @Output() removeWidget = new EventEmitter();
  @Output() openCase = new EventEmitter<ChatMessage>();
  @Output() replayToChat = new EventEmitter<ChatMessage>();
  @Output() sendMsg = new EventEmitter<string>();
  @Output() refreshData = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onRemove() {
    this.removeWidget.emit();
  }

  onOpenCase(item: ChatMessage) {
    this.openCase.emit(item);
  }

  onReplyToChat(item: ChatMessage) {
    this.replayToChat.emit(item);
  }

  onSendMessage(msg: string) {
    this.sendMsg.emit(msg);
  }

  onRefreshData() {
    this.refreshData.emit();
  }
}
