import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContactViewModel } from '../../../contacts-create-core/models/interfaces';
import { Section } from '../../../contacts-create-core/models/enum';

@Component({
  selector: 'dps-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

  constructor() { }

  @Input() selectedContact: ContactViewModel;
  @Output() changeDetails = new EventEmitter<{ type: string, value: string, section: Section }>();

  ngOnInit() {
  }

  onChangeDetails(type: string, value: string) {
    this.changeDetails.emit({ type: type, value: value, section: Section.Company });
  }

}
