
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientSearchKind } from '../../../client-search-core/models/enums';


@Component({
  selector: 'dps-client-search-box',
  templateUrl: './client-search-box.component.html',
  styleUrls: ['./client-search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientSearchBoxComponent implements OnInit {
  @Input() showSearchHint: boolean;
  @Input() searchText: string;
  @Input() totalItems: Number;
  @Output() updateSelectedSearchTextChange = new EventEmitter<string>();
  @Output() updateSearchTextClick = new EventEmitter();
  @Output() updateSelectedSearchTextClear = new EventEmitter<string>();
  @Input() isClientSearchPopup: boolean;
  @Input() clientLabel: boolean;

  inputCtrl = new FormControl();
  // filteredData: Observable<>;

  constructor() { }

  ngOnInit() {
    // to clear
    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.OnSearchTextClear(value);
        }
      });

    // to store
    this.inputCtrl.valueChanges.pipe(
      debounceTime(200))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.OnSearchTextChanged(value);
        }
      });
    const searchBox = document.getElementById('client-search-input')
    if (!!searchBox) {
      searchBox.focus();
    }
  }
  onKeydownSearchText(event: any) {
    if (event.keyCode === 13 && event.currentTarget.value) {
      this.OnSearchTextClick(event.currentTarget.value);
    }
  }

  OnSearchTextChanged(event) {
    console.log('OnSearchTextChanged', event);
    this.updateSelectedSearchTextChange.emit(event);
  }

  OnSearchTextClick(event) {
    this.updateSearchTextClick.emit({ kind: ClientSearchKind.SearchText, value: event });
  }

  OnSearchTextClear(event) {
    console.log('OnSearchTextClear', event);
    this.updateSelectedSearchTextClear.emit(event);
  }

  // onKeydownSearchText(event: any) {
  //   if (event.keyCode === 13) {
  //     this.updateSelectedSearchText.emit(event.currentTarget.value);
  //   }
  // }

  // OnSearchTextChanged(event) {
  //   this.updateSelectedSearchText.emit(event);
  // }
}
