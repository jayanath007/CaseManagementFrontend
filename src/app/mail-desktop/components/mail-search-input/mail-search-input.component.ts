import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatInput } from '@angular/material';
import { SerchMessageListActions } from '../../../mail-core';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'dps-mail-search-input',
  templateUrl: './mail-search-input.component.html',
  styleUrls: ['./mail-search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailSearchInputComponent implements OnInit, OnChanges {
  @Output() searchViewChange = new EventEmitter();
  @Input() isSearching: boolean;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatInput) matInput: MatInput;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSearching && changes.isSearching.currentValue === false) {
      this.matInput.value = '';
    }
  }
  optionSelected(event: MatAutocompleteSelectedEvent) {
    this.onSearch(event.option.value);
  }
  onSearch(value: string) {
    setTimeout(() => {
      this.autocompleteTrigger.closePanel();
    }, 100);
    if (value) {
      this.searchViewChange.emit([{ kind: SerchMessageListActions.SearchText, value: value }]);
    }
  }
}
