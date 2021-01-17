import { Component, OnInit, Input } from '@angular/core';
import { ContactViewModel } from '../../../contacts-create-core/models/interfaces';

@Component({
  selector: 'dps-case-specific-details',
  templateUrl: './case-specific-details.component.html',
  styleUrls: ['./case-specific-details.component.scss']
})
export class CaseSpecificDetailsComponent implements OnInit {

  constructor() { }

  @Input() selectedContact: ContactViewModel;

  ngOnInit() {
  }

}
