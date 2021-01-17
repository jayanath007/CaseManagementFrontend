import { ChatMessage } from './../../../core/lib/mls';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatterRefMap } from './../../models/interface';
import { MenuPositionX } from '@angular/material';

@Component({
  selector: 'dps-mls-widget-item',
  templateUrl: './mls-widget-item.component.html',
  styleUrls: ['./mls-widget-item.component.scss']
})
export class MlsWidgetItemComponent implements OnInit {

  @Input() item: ChatMessage;
  @Input() layout: number;
  @Input() continueChatItem: ChatMessage;
  @Input() isMsgSending: boolean;
  @Input() allMatterRef: MatterRefMap[];

  @Output() openCase = new EventEmitter<ChatMessage>();
  @Output() replayToChat = new EventEmitter<ChatMessage>();
  @Output() sendMsg = new EventEmitter<string>();

  xPosition: MenuPositionX = 'before';

  constructor() { }

  ngOnInit() {
  }

  get senderFullName(): string {
    return `${this.item.messageSender.firstName} ${this.item.messageSender.lastName}`;
  }

  onClickItem(item: ChatMessage, event, compose) {
    event.preventDefault();
    event.stopPropagation();
    if (this.continueChatItem && this.continueChatItem.id !== item.id) {
      if (compose && compose.value.length > 0) {
        return;
      }
      this.replayToChat.emit(null);
    } else {
      this.openCase.emit(item);
    }

  }

  onReplyToChat(item: ChatMessage, event) {
    event.preventDefault();
    event.stopPropagation();
    this.replayToChat.emit(item);
  }

  onSendMessage(msg: string, event) {
    event.preventDefault();
    event.stopPropagation();
    if (!!msg) {
      this.sendMsg.emit(msg);
    }

  }

  onClickCompose(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onInsertMessageKeydown(event: any, text: string) {
    if (event.keyCode === 13) {
      this.sendMsg.emit(text);
    }
  }

  onExitCompose() {
    event.preventDefault();
    event.stopPropagation();
    this.replayToChat.emit(null);
  }

  get resolveMatterRef(): string {
    if (this.allMatterRef) {
      const matterDetals = this.allMatterRef.find(i => i.processAppId ===
        this.item.appId && i.branchId === this.item.branchId && i.fileId === this.item.fileId);
      return matterDetals ? matterDetals.matterRef : '';
    }
    return '';
  }

  get isXmlStatueIsNew(): boolean {
    return this.item.xmlStatus.trim() === 'New';
  }

  get isFormFillingStatuesIsNew(): boolean {
    return this.item.documentDetails ? this.item.documentDetails.status.trim() === 'New' : false;
  }

}

