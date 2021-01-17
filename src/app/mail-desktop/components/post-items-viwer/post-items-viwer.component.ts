import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { ConversationListItem, GroupListItem } from '../../../mail-core';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from './../../../auth/services/access-control.service';

@Component({
  selector: 'dps-post-items-viwer',
  templateUrl: './post-items-viwer.component.html',
  styleUrls: ['./post-items-viwer.component.scss']
})
export class PostItemsViwerComponent implements OnInit {
  @Input() selectedConversation: ConversationListItem;
  @Input() selectedGroup: GroupListItem;
  @Input() timeZone: string;
  @Input() companyCode: any;


  @Output() openUrlPoup = new EventEmitter();
  @Output() viewDpsFile = new EventEmitter();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() openAttachement = new EventEmitter();
  @Output() forward = new EventEmitter();
  @Output() deleteReply = new EventEmitter();
  @Output() replyForward = new EventEmitter();

  virtualScrolling$ = new Subject();
  viewPortItems = [];
  module = Module;
  constructor(private access: AccessControlService) { }

  ngOnInit() {
  }
  onReplyAll() {
    this.replyForward.emit({ post: this.selectedConversation.posts[this.selectedConversation.posts.length - 1], type: 'createReplyAll' });
  }
  onForward(event) {
    this.forward.emit(event);
  }
  onReplyForward(event) {
    this.replyForward.emit(event);
  }
  onListChange(event) {

  }
  onDeleteReply(event) {
    this.deleteReply.emit({ conversationId: this.selectedConversation.data.id, id: event });
  }
  onSeparateWindow(event) {
    this.openUrlPoup.emit(event);
  }
  onViewDpsFile(event) {
    this.viewDpsFile.emit(event);
  }
  onDownloardFileAttachment(event) {
    this.downloardFileAttachment.emit(event);
  }
  onOpenAttachement(event) {
    this.openAttachement.emit(event);
  }
  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }
}
