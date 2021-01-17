import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from './../../../core/lib/mls';
import { User } from '../../../auth';

@Component({
  selector: 'dps-mls-chat-item',
  templateUrl: './mls-chat-item.component.html',
  styleUrls: ['./mls-chat-item.component.scss']
})
export class MlsChatItemComponent implements OnInit {

  @Input() message: ChatMessage;
  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

  get isXmlStatueIsNew(): boolean {
    return this.message.xmlStatus ? this.message.xmlStatus.trim() === 'New' : false;
  }

  get isFormFillingStatuesIsNew(): boolean {
    return this.message.documentDetails && this.message.documentDetails.status ?
      this.message.documentDetails.status.trim() === 'New' : false;
  }

  isSendMsg(message: ChatMessage): boolean {
    if (this.user && message.messageSender.emailAddress.toLocaleLowerCase() === this.user.general.userEmail.toLocaleLowerCase()) {
      return true;
    }
    return false;
  }
}
