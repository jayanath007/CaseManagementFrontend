import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GroupListItem, ConversationListItem } from '../../../mail-core';

@Component({
  selector: 'dps-group-content-short-layout',
  templateUrl: './group-content-short-layout.component.html',
  styleUrls: ['./group-content-short-layout.component.scss']
})
export class GroupContentShortLayoutComponent implements OnInit {
  @Input() hidden: boolean;
  @Input() selectedGroup: GroupListItem;
  @Input() conversations: ConversationListItem[];
  @Input() isConversationsLoading: boolean;
  @Input() timeZone: string;
  @Input() companyCode: string;
  @Input() selectedconversation: ConversationListItem;

  @Output() conversationSelect = new EventEmitter();
  @Output() conversationDelete = new EventEmitter();
  @Output() loadMoreConversations = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  onConversationSelect(event) {
    this.conversationSelect.emit(event);
  }
  onConversationDelete(event) {
    this.conversationDelete.emit({ groupsId: this.selectedGroup.data.id, id: event });
  }
  onLoadMoreConversations(event) {
    this.loadMoreConversations.emit({ id: this.selectedGroup.data.id, currentCount: event });
  }
}
