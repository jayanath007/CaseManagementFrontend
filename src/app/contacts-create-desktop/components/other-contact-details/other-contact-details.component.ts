import { Component, OnInit, Input } from '@angular/core';
import { ContactViewModel } from '../../../contacts-create-core/models/interfaces';

@Component({
  selector: 'dps-other-contact-details',
  templateUrl: './other-contact-details.component.html',
  styleUrls: ['./other-contact-details.component.scss']
})
export class OtherContactDetailsComponent implements OnInit {

  constructor() { }

  @Input() selectedContact: ContactViewModel;

  ngOnInit() {
  }

}
