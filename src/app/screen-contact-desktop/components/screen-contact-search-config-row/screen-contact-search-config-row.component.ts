import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ContactFieldDef } from '../../../screen-contact-core/models/interface';

@Component({
  selector: 'dps-screen-contact-search-config-row',
  templateUrl: './screen-contact-search-config-row.component.html',
  styleUrls: ['./screen-contact-search-config-row.component.scss']
})
export class ScreenContactSearchConfigRowComponent implements OnInit {

  @Input()
  public searchFields: ContactFieldDef[];
  @Output()
  public onSearchFieldChanged: EventEmitter<ContactFieldDef> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  searchFieldChanged($event, fieldDef: ContactFieldDef) {
    this.onSearchFieldChanged.emit({...fieldDef, modified: true, checked: $event.target.checked});
  }

}
