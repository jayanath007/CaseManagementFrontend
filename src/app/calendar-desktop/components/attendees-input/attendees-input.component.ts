
import {map, startWith} from 'rxjs/operators';
import {
  Component, OnInit, Input, ChangeDetectionStrategy, ViewChild, Output, EventEmitter,
  OnChanges, SimpleChanges
} from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger, MatAutocompleteSelectedEvent, MatInput, MatSelect } from '@angular/material';
import { Observable } from 'rxjs';


import { Person, User, Attendee } from '../../../core/lib/microsoft-graph';
import { ValidateEmailPipe } from '../../../shared/pipes/validate-email.pipe';

@Component({
  selector: 'dps-attendees-input',
  templateUrl: './attendees-input.component.html',
  styleUrls: ['./attendees-input.component.scss']
})
export class AttendeesInputComponent implements OnInit, OnChanges {
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatInput) matInput: MatInput;
  @Input() requiredAttendees: [Attendee];
  @Input() optionalAttendees: [Attendee];
  @Input() people: [Person];

  @Input() searchedPeople: { text: string, people: [User] };
  @Input() lable: string;
  @Output() searchDirectory = new EventEmitter();
  @Output() addAttendee = new EventEmitter<Attendee>();
  @Output() removeAttendee = new EventEmitter<Attendee>();
  @Output() addPerson = new EventEmitter<Person>();
  inputCtrl = new FormControl();
  filteredPeople: Observable<any[]>;

  showSearchBtn = true;
  showLoader = true;
  showSearchList = false;

  constructor(public validateEmailPipe: ValidateEmailPipe) { }

  ngOnInit() {
    this.filteredPeople = this.inputCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string) => this.filterPeople(value ? value.trim() : '')),);
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
  optionSelected(event: MatAutocompleteSelectedEvent, inputElement: HTMLInputElement, select: MatSelect) {
    const value = event.option.value;
    if (value) {
      const searchedPerson = this.searchedPeople.people.find(val => val.id === value);
      const person = this.people.find((val) => val.id === value);
      if (person) {
        this.addAttendee.emit({
          emailAddress: { name: person.displayName || '', address: person.emailAddresses[0].address || '' },
          type: select.value
        });
      } else if (searchedPerson) {
        this.addAttendee.emit({
          emailAddress: { name: searchedPerson.displayName || '', address: searchedPerson.mail || '' },
          type: select.value
        });
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
  add(event, select: MatSelect): void {
    const value = event.value;
    if ((value || '').trim()) {
      const searchedPerson = this.searchedPeople.people.find(val => (val.mail || '').toLowerCase() === value.trim().toLowerCase() ||
        (val.displayName || '').toLowerCase() === value.trim().toLowerCase());
      const attendees = this.people.find(val => (val.emailAddresses[0].address || '').toLowerCase() === value.trim().toLowerCase() ||
        (val.displayName || '').toLowerCase() === value.trim().toLowerCase());
      if (attendees) {
        this.addAttendee.emit({
          emailAddress: {
            name: (attendees.displayName || ''),
            address: (attendees.emailAddresses[0].address || '')
          },
          type: select.value
        });
      } else if (searchedPerson) {
        this.addAttendee.emit({
          emailAddress: { name: (searchedPerson.displayName || ''), address: (searchedPerson.mail || '') },
          type: select.value
        });
        this.addPerson.emit({
          id: searchedPerson.id,
          displayName: (searchedPerson.displayName || ''),
          emailAddresses: [{ rank: 0, address: (searchedPerson.mail || '') }]
        });
      } else {
        this.addAttendee.emit({ emailAddress: { name: value.trim(), address: value.trim() }, type: select.value });
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
  remove(attendee: Attendee): void {
    this.removeAttendee.emit(attendee);
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
  // public focuseOut() {
  //   if (!this.matInput.focused) {
  //     this.autocompleteTrigger.closePanel();
  //     this.add({ value: this.inputCtrl.value, input: null });
  //     this.matInput.value = '';
  //     this.inputCtrl.setValue('');
  //   }
  // }
}

