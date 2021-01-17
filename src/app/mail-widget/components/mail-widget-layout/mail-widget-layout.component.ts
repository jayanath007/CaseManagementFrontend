import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message, MailFolder } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-mail-widget-layout',
  templateUrl: './mail-widget-layout.component.html',
  styleUrls: ['./mail-widget-layout.component.scss']
})
export class MailWidgetLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() data: Message[];
  @Input() inboxInfo: MailFolder;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() layout: number;
  @Output() openMail = new EventEmitter<Message>();
  @Output() toMailView = new EventEmitter();
  @Output() removeWidget = new EventEmitter();
  @Output() newMailOut = new EventEmitter();

  constructor() { }
  get emptyList() {
    if (this.data && this.data.length < 13) {
      return Array(13 - this.data.length).fill('').map((x, i) => i);
    }
    return [];
  }
  get items() {
    // if (this.data) {
    //   return this.data.slice(0, 4);
    // }
    return this.data;
  }
  get unreadCount() {
    if (this.inboxInfo) {
      if (this.inboxInfo.unreadItemCount > 99) {
        return '+99';
      }
      return this.inboxInfo.unreadItemCount;
    }
    return '';
  }

  ngOnInit() {
  }

  openItem(item: Message) {
    this.openMail.emit(item);
  }

  goToMail() {
    this.toMailView.emit();
  }

  onRemove() {
    this.removeWidget.emit();
  }
  newMail() {
    this.newMailOut.emit();
  }
}
