
import {debounceTime, takeUntil} from 'rxjs/operators';
import { Component, OnInit,OnDestroy, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dps-general-popup-search-box',
  templateUrl: './general-popup-search-box.component.html',
  styleUrls: ['./general-popup-search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralPopupSearchBoxComponent implements OnDestroy, OnInit {

  @Input() showSearchHint: boolean;
  @Input() searchText: string;
  @Input() totalItems: Number;
  @Output() updateSearchTextClick = new EventEmitter();
  @Output() searchTextValueChanges = new EventEmitter();
  private unsubscribe: Subject<void> = new Subject();


  inputCtrl = new FormControl();

  constructor() { }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
    takeUntil(this.unsubscribe)).pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.OnSearchTextChanged('');
        }
        this.searchTextValueChanges.emit(value);
      });
  }

  onKeydownSearchText(event: any) {
    if (event.keyCode === 13) {
      this.OnSearchTextClick(event.currentTarget.value);
    }
  }

  OnSearchTextChanged(event) {
    this.updateSearchTextClick.emit(event);
  }

  OnSearchTextClick(value) {
    this.updateSearchTextClick.emit(value);
  }

  OnSearchTextClear() {
    this.updateSearchTextClick.emit('');
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
