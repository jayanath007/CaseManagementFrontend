import { FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'dps-matter-search-box',
  templateUrl: './matter-search-box.component.html',
  styleUrls: ['./matter-search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterSearchBoxComponent implements OnInit {

  @Input() searchText: string;
  @Input() totalItems: Number;
  @Input() matterDisplyName: string;
  @Output() updateSelectedSearchText = new EventEmitter<string>();
  inputCtrl = new FormControl();
  // filteredData: Observable<>;

  constructor() { }

  ngOnInit() {
    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.OnSearchTextChanged(value);
        }
      });
  }
  onKeydownSearchText(event: any) {
    if (event.keyCode === 13) {
      this.updateSelectedSearchText.emit(event.currentTarget.value);
    }
  }

  OnSearchTextChanged(event) {
    this.updateSelectedSearchText.emit(event);
  }

}
