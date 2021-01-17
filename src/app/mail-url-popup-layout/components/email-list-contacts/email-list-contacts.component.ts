import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipient } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-email-list-contacts',
  templateUrl: './email-list-contacts.component.html',
  styleUrls: ['./email-list-contacts.component.scss']
})
export class EmailListContactsComponent implements OnInit {
  @Input() contactList: { contactType: string, recipient: Recipient }[];
  @Output() hideRecipientsList = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  onHideRecipientsList() {
    this.hideRecipientsList.emit();
  }
}
