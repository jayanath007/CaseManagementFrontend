
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Component, OnInit, Input, EventEmitter,
  Output, ChangeDetectionStrategy
} from '@angular/core';





@Component({
  selector: 'dps-file-history-search-input',
  templateUrl: './file-history-search-input.component.html',
  styleUrls: ['./file-history-search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class FileHistorySearchInputComponent implements OnInit {

  @Input() searchText: '';
  @Input() isSearchFullText: boolean;

  @Output() searchTextChanged = new EventEmitter<string>();
  @Output() isSearchFullTextValue = new EventEmitter<boolean>();
  inputCtrl = new FormControl();

  constructor() { }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(1000))
      .subscribe((value: string) => this.onSearchTextChanged(value));
  }
  onSearchTextChanged(event) {
    this.searchTextChanged.emit(event);
  }
  onKeydownSearchText(event: any) {
    if (event.keyCode === 13) {
      this.searchTextChanged.emit(event.currentTarget.value);
    }
  }
  OnIsSearchFullText(value) {
    this.isSearchFullTextValue.emit(value);
  }
}
