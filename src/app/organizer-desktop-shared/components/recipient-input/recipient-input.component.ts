
import { map, startWith } from 'rxjs/operators';
import {
  Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, Output, EventEmitter,
  OnChanges, SimpleChanges
} from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent, MatAutocompleteTrigger, MatAutocompleteSelectedEvent, MatInput } from '@angular/material';
import { Observable } from 'rxjs';


import { Recipient, Person, User } from '../../../core/lib/microsoft-graph';
import { ValidateEmailPipe } from '../../../shared/pipes/validate-email.pipe';

const COMMA = 188;
const SEMICOLON = 186;
@Component({
  selector: 'dps-recipient-input',
  templateUrl: './recipient-input.component.html',
  styleUrls: ['./recipient-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipientInputComponent implements OnInit, OnChanges {

  @Input() recipients: [Recipient];
  @Input() people: [Person];
  @Input() isGoogle: boolean;
  @Input() searchedPeople: { text: string, people: [User] };
  @Input() lable: string;

  @Output() searchDirectory = new EventEmitter();
  @Output() addRecipient = new EventEmitter<Recipient>();
  @Output() removeRecipient = new EventEmitter();
  @Output() addPerson = new EventEmitter<Person>();

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatInput) matInput: MatInput;

  inputCtrl = new FormControl();
  filteredPeople: Observable<any[]>;
  separatorKeysCodes = [COMMA, SEMICOLON, ENTER];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  showSearchBtn = true;
  showLoader = true;
  showSearchList = false;
  constructor(public validateEmailPipe: ValidateEmailPipe) { }

  ngOnInit() {
    this.filteredPeople = this.inputCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string) => this.filterPeople(value ? value.trim() : '')));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchedPeople && !changes.searchedPeople.isFirstChange() &&
      changes.searchedPeople.currentValue.text === this.inputCtrl.value) {
      this.showSearchList = true;
      this.showLoader = false;
    }
  }
  filterPeople(name: string) {
    let filtedList = [];
    this.showSearchList = false;
    if (!name) {
      filtedList = this.people ? this.people.slice(0, 5) : [];
      if (filtedList.length < 1) {
        this.showLoader = false;
        this.showSearchBtn = false;
      } else if (filtedList.length < 5) {
        this.showLoader = false;
        this.showSearchBtn = true;
      } else {
        this.showLoader = false;
        this.showSearchBtn = false;
      }
      return filtedList;
    }

    filtedList = this.people.filter(person => {
      const names = person.displayName ?
        person.displayName.trim().split(' ').filter(val => val.toLowerCase().indexOf(name.toLowerCase()) === 0) : [];
      return names.length > 0 || (person.emailAddresses[0].address || '').toLowerCase().indexOf(name.toLowerCase()) === 0;
    }).slice(0, 4);
    if (!filtedList || filtedList.length < 1) {
      if (name) {
        this.onSearchDirectory(name);
      }
    } else {
      this.showSearchBtn = true;
      this.showLoader = false;
    }
    return filtedList;
  }
  optionSelected(event: MatAutocompleteSelectedEvent, inputElement: HTMLInputElement) {
    const value = event.option.value;
    if (value) {
      const searchedPerson = this.searchedPeople.people.find(val => val.id === value);
      const person = this.people.find((val) => val.id === value);
      if (person) {
        this.addRecipient.emit({ emailAddress: { name: person.displayName || '', address: person.emailAddresses[0].address || '' } });
      } else if (searchedPerson) {
        this.addRecipient.emit({ emailAddress: { name: searchedPerson.displayName || '', address: searchedPerson.mail || '' } });
        this.addPerson.emit({
          id: searchedPerson.id,
          displayName: searchedPerson.displayName || '',
          emailAddresses: [{ rank: 0, address: searchedPerson.mail || '' }]
        });
      }
      inputElement.value = '';
      this.inputCtrl.setValue('', { emitEvent: true });
      setTimeout(() => {
        this.autocompleteTrigger.closePanel();
      }, 10);
    } else {
      this.onSearchDirectory(this.inputCtrl.value);
    }
  }
  add(event: MatChipInputEvent): void {
    const value = event.value;
    if ((value || '').trim()) {
      const searchedPerson = this.searchedPeople.people.find(val => (val.mail || '').toLowerCase() === value.trim().toLowerCase() ||
        (val.displayName || '').toLowerCase() === value.trim().toLowerCase());
      const recipients = this.people.find(val => (val.emailAddresses[0].address || '').toLowerCase() === value.trim().toLowerCase() ||
        (val.displayName || '').toLowerCase() === value.trim().toLowerCase());
      if (recipients) {
        this.addRecipient.emit({
          emailAddress: {
            name: (recipients.displayName || ''),
            address: (recipients.emailAddresses[0].address || '')
          }
        });
      } else if (searchedPerson) {
        this.addRecipient.emit({ emailAddress: { name: (searchedPerson.displayName || ''), address: (searchedPerson.mail || '') } });
        this.addPerson.emit({
          id: searchedPerson.id,
          displayName: (searchedPerson.displayName || ''),
          emailAddresses: [{ rank: 0, address: (searchedPerson.mail || '') }]
        });
      } else {
        this.addRecipient.emit({ emailAddress: { name: value.trim(), address: value.trim() } });
        if (this.validateEmailPipe.transform(value.trim())) {
          this.addPerson.emit({ id: value.trim(), displayName: value.trim(), emailAddresses: [{ rank: 0, address: value.trim() }] });
        }
      }

      this.autocompleteTrigger.closePanel();
    }
    this.matInput.value = '';
    this.inputCtrl.setValue('');
    this.showSearchList = false;
  }
  remove(recipient: Recipient): void {
    const index = this.recipients.indexOf(recipient);
    if (index >= 0) {
      this.removeRecipient.emit(recipient);
      this.autocompleteTrigger.closePanel();
    }
    if (index === 0) {
      this.matInput.focus();
      setTimeout(() => {
        this.autocompleteTrigger.openPanel();
      });
    }
  }
  onSearchDirectory(value) {
    this.showSearchBtn = false;
    this.showLoader = true;
    this.showSearchList = false;
    this.searchDirectory.emit(value);
    setTimeout(() => {
      this.autocompleteTrigger.openPanel();
    });
  }
  public focuseOut() {
    if (!this.matInput.focused) {
      this.autocompleteTrigger.closePanel();
      this.add({ value: this.inputCtrl.value, input: null });
      this.matInput.value = '';
      this.inputCtrl.setValue('');
    }
  }
  public focus() {
    this.matInput.focus();
  }
  onDragend(event) {
    const recipient: Recipient = JSON.parse(localStorage.getItem('dpsRecipientDragData'));
    localStorage.removeItem('dpsRecipientDragData');
    if (recipient) {
      this.removeRecipient.emit(this.recipients.find(val => (val.emailAddress.address || '') === (recipient.emailAddress.address || '') &&
        (val.emailAddress.name || '') === (recipient.emailAddress.name || '')));
    }
  }
  onDrop({ event, dragData, dragDataType }) {
    if (dragDataType === 'recipient') {
      this.addRecipient.emit(dragData);
      localStorage.setItem('dpsRecipientDragData', JSON.stringify(dragData));
      event.preventDefault();
    }
  }
}
