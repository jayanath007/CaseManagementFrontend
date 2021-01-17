import { MatTabChangeEvent } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactViewModel, ContactType } from '../../../contacts-create-core/models/interfaces';
import { TabIndex, Section } from '../../../contacts-create-core/models/enum';
import { Mode } from './../../../client-creation-core/models/enums';
import { MatterInfo } from '../../../core';
import { CaseContact } from '../../../case-contact-core/models/interface';
import { CaseContactModeChange } from '../../../case-contact-core/actions/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dps-contact-create-data-content',
  templateUrl: './contact-create-data-content.component.html',
  styleUrls: ['./contact-create-data-content.component.scss']
})
export class ContactCreateDataContentComponent implements OnInit {

  constructor() { }

  // @Input() selectedContact: ContactViewModel;
  @Input() contactSearchKey: string;
  @Input() showSearchTab: boolean;
  @Input() selectedTab: TabIndex;
  @Input() token: string;
  @Input() mode: Mode;
  @Input() types: ContactType[];
  @Input() matterData: MatterInfo;
  @Output() changeSelectedTab = new EventEmitter<TabIndex>();
  @Output() selectContact = new EventEmitter<{ contactInfo: CaseContact, close: boolean }>();
  @Output() changeDetails = new EventEmitter<{ type: string, value: string, section: Section }>();
  ModeType = Mode;

  ngOnInit() {
  }

  onChangeTap(tab: MatTabChangeEvent) {
    this.changeSelectedTab.emit(tab.index);
  }

  onChangeContact(contactInfo: CaseContact) {
    this.selectContact.emit({ contactInfo: contactInfo, close: true });
  }

  onChangeDetails(event: { type: string, value: string, section: Section }) {
    this.changeDetails.emit(event);
  }

}
