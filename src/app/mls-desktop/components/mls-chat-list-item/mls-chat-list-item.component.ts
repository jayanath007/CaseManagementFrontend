import { Component, Input } from '@angular/core';
import { MLSUser } from './../../../core/lib/mls';

@Component({
  selector: 'dps-mls-chat-list-item',
  templateUrl: './mls-chat-list-item.component.html',
  styleUrls: ['./mls-chat-list-item.component.scss']
})
export class MlsChatListItemComponent {

  @Input() user: MLSUser;
  @Input() selectedUser: MLSUser;

  constructor() { }

  get senderFullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
}
