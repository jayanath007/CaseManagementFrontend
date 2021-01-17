import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactViewModel, ContactType } from '../../../contacts-create-core/models/interfaces';
import { Section } from '../../../contacts-create-core/models/enum';

@Component({
  selector: 'dps-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  @Input() types: ContactType[];

  constructor() { }

  @Input() selectedContact: ContactViewModel;
  @Output() changeDetails = new EventEmitter<{ type: string, value: string, section: Section }>();

  ngOnInit() {
  }

  onChangeDetails(type: string, value: string) {
    this.changeDetails.emit({ type: type, value: value, section: Section.Contact });
  }

}
