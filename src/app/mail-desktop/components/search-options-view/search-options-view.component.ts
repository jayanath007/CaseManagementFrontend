
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter,
  ViewChild, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {
  MatRadioChange, MatRadioGroup, MatAutocompleteSelectedEvent
  , MatAutocompleteTrigger,
  MatSelectionListChange
} from '@angular/material';
import { Person, User } from '../../../core/lib/microsoft-graph';
import { SerchDateTypes, SerchMessageListActions } from '../../../mail-core';
import { Observable } from 'rxjs';


@Component({
  selector: 'dps-search-options-view',
  templateUrl: './search-options-view.component.html',
  styleUrls: ['./search-options-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchOptionsViewComponent implements OnInit, OnChanges {
  @Output() searchViewChange = new EventEmitter();
  @Output() exitSearch = new EventEmitter();
  @Output() onCurrentFolderSelect = new EventEmitter();
  @Output() searchDirectory = new EventEmitter();

  @Input() fromList: [Person];
  @Input() searchedPeople: { text: string, people: [User] };

  @ViewChild(MatRadioGroup) dateType: MatRadioGroup;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  SerchDateTypes = SerchDateTypes;
  filteredPeople: Observable<any[]>;
  inputCtrl = new FormControl();
  selectedFrom: Person;
  fromDate;
  toDate;
  showSearchBtn = true;
  showLoader = true;
  showSearchList = false;
  showProfileImg = false;

  constructor() { }

  ngOnInit() {
    this.filteredPeople = this.inputCtrl.valueChanges.pipe(
      startWith(null),
      map(value => this.filterPeople(value)));
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
      filtedList = this.fromList ? this.fromList.slice(0, 5) : [];
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

    filtedList = this.fromList.filter(person => {
      const names = person.displayName ?
        person.displayName.trim().split(' ').filter(val => val.toLowerCase().indexOf(name.toLowerCase()) === 0) : [];
      return names.length > 0 || person.emailAddresses[0].address.toLowerCase().indexOf(name.toLowerCase()) === 0;
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
  onSearchDirectory(value) {
    this.showSearchBtn = false;
    this.showLoader = true;
    this.showSearchList = false;
    this.searchDirectory.emit(value);
    setTimeout(() => {
      if (this.autocompleteTrigger) {
        this.autocompleteTrigger.openPanel();
      }
    });
  }
  optionSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (value) {
      const searchedPerson = this.searchedPeople.people.find(val => val.id === value);
      const person = this.fromList.find((val) => val.id === value);
      this.showProfileImg = false;
      if (person) {
        this.selectedFrom = person;
        this.searchViewChange.emit([{ kind: SerchMessageListActions.From, value: this.selectedFrom.emailAddresses[0].address }]);
      } else if (searchedPerson) {
        this.selectedFrom = {
          id: searchedPerson.id,
          displayName: searchedPerson.displayName,
          emailAddresses: [{ rank: 0, address: searchedPerson.mail }]
        };
        this.searchViewChange.emit([{ kind: SerchMessageListActions.From, value: this.selectedFrom.emailAddresses[0].address }]);
      }
      this.inputCtrl.setValue('', { emitEvent: true });
      setTimeout(() => {
        if (this.autocompleteTrigger) {
          this.autocompleteTrigger.closePanel();
        }
      }, 10);
    } else {
      this.onSearchDirectory(this.inputCtrl.value);
    }
  }
  removeFrom() {
    this.showProfileImg = false;
    this.selectedFrom = null;
    this.inputCtrl.setValue('', { emitEvent: true });
    this.searchViewChange.emit([{ kind: SerchMessageListActions.From, value: '' }]);
  }
  onDateTypeChange(event: MatRadioChange) {
    if (event.value !== SerchDateTypes.SelectRange) {
      this.searchViewChange.emit([{
        kind: SerchMessageListActions.DateType,
        value: { dateType: event.value, dateFrom: '', dateTo: '' }
      }]);
    }
  }
  onFromDateChange(event) {
    this.fromDate = event.value;
    this.onDatesChange(this.fromDate, this.toDate);
  }
  onToDateChange(event) {
    this.toDate = event.value;
    this.onDatesChange(this.fromDate, this.toDate);
  }
  onDatesChange(dateFrom, dateTo) {
    this.searchViewChange.emit([{
      kind: SerchMessageListActions.DateType,
      value: { dateType: SerchDateTypes.SelectRange, dateFrom: dateFrom, dateTo: dateTo }
    }]);
  }
  onWithAttachements(event: MatSelectionListChange) {
    this.searchViewChange.emit([{ kind: SerchMessageListActions.HasAttachment, value: event.option.selected }]);
  }
  onAllFolders(event: MatSelectionListChange) {
    this.searchViewChange.emit([{ kind: SerchMessageListActions.IsAllFolders, value: event.option.selected }]);
  }
  onExitSearch() {
    this.exitSearch.emit();
    this.onCurrentFolderSelect.emit();
  }
}
