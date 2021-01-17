import { emit } from 'cluster';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ContactFieldDef } from '../../../screen-contact-core/models/interface';

@Component({
  selector: 'dps-screen-config-contact-search',
  templateUrl: './screen-config-contact-search.component.html',
  styleUrls: ['./screen-config-contact-search.component.scss']
})
export class ScreenConfigContactSearchComponent implements OnInit {

  @Input()
  public defaultSearchFields: ContactFieldDef[];
  @Input()
  public mappedSearchFields: ContactFieldDef[];
  @Input() isLoading: boolean;
  @Output()
  public onSearchFieldChanged: EventEmitter<ContactFieldDef> = new EventEmitter();
  @Output() onSaveSearchFields = new EventEmitter();
  @Output() onClose = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closePopup() {
    this.onClose.emit();
  }

  saveSearchFields() {
    this.onSaveSearchFields.emit();
  }

  searchFieldChanged(fieldDef: ContactFieldDef) {
    this.onSearchFieldChanged.emit(fieldDef);
  }

}
