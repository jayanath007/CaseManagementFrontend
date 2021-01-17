
import {debounceTime} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import {
  Component, OnInit, Input, EventEmitter,
  Output, ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'dps-screen-contact-search-input',
  templateUrl: './screen-contact-search-input.component.html',
  styleUrls: ['./screen-contact-search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenContactSearchInputComponent implements OnInit {

  @Input() searchText;
  @Output() searchTextChanged = new EventEmitter<string>();
  inputCtrl = new FormControl();

  constructor() { }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
    debounceTime(500))
    .subscribe((value: string) => {
      if (value.length <= 0) {
        this.onSearchTextChanged(value);
      }
    });
  }

  onSearchTextChanged(event) {
    this.searchTextChanged.emit(event);
  }
  onKeydownSearchText(event: any) {
    if (event.keyCode === 13) {
      this.searchTextChanged.emit(event.currentTarget.value);
    }
  }

}
