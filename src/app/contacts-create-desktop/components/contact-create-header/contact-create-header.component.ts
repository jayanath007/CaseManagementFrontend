import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CaseContactModeChange } from '../../../case-contact-core/actions/core';
import { Store } from '@ngrx/store';
import { ContactMode } from '../../../case-contact-core/models/interface';

@Component({
  selector: 'dps-contact-create-header',
  templateUrl: './contact-create-header.component.html',
  styleUrls: ['./contact-create-header.component.scss']
})
export class ContactCreateHeaderComponent implements OnInit {

  constructor(protected store: Store<any>) { }
  @Input() contactSearchKey: string;
  @Output() searchTextChanged = new EventEmitter<string>();

  inputCtrl = new FormControl();

  // Tem changes // need to be change after complete contact creation #LS
  contactMode = ContactMode.View;
  @Output() changeContactMode = new EventEmitter<string>();

  contactModes = ContactMode;

  ngOnInit() {
  }

  onKeydownSearchText(event) {
    if (event.keyCode === 13) {
      this.searchTextChanged.emit(event.currentTarget.value);
    }
  }
  onSearchTextChanged(key: string) {
    this.searchTextChanged.emit(key);
  }
  // Tem changes // need to be change after complete contact creation #LS
  onCaseContactModeChange(): void {
    if (this.contactMode === ContactMode.All) {
      this.contactMode = ContactMode.View;
    } else {
      this.contactMode = ContactMode.All;
    }
    this.store.dispatch(new CaseContactModeChange('contactSearch', { value: this.contactMode }));
  }

}
