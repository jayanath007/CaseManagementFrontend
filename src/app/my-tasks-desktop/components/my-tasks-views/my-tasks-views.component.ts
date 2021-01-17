import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectedInfo, GridFilterUpdate, GroupMode, GridGroupData } from '../../../my-tasks-core/models/interfce';
import { gridFilterKind } from '../../../my-tasks-core/models/enumeration';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'dps-my-tasks-views',
  templateUrl: './my-tasks-views.component.html',
  styleUrls: ['./my-tasks-views.component.scss']
})
export class MyTasksViewsComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() selectedInfo: SelectedInfo;
  @Input() groupMode: GroupMode;
  @Input() gridGroupData: GridGroupData;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  @Output() gridRefresh = new EventEmitter();
  @Output() gridFontSize = new EventEmitter<string>();
  @Output() updateNewTaskClick = new EventEmitter();
  @Output() groupChange = new EventEmitter();
  @Output() print = new EventEmitter();

  constructor() { }

  inputCtrl = new FormControl();

  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;

  mytaskGroupMode = GroupMode;

  ngOnInit() {
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';

    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.onSearchTextChanged(value);
        }
      });
  }

  groupBy(value) {
    this.groupChange.emit(value);
  }



  newTaskClick() {
    this.updateNewTaskClick.emit();
  }

  onSearchTextChanged(value) {
    const newValue = { kind: gridFilterKind.searchText, value: value };
    this.updateSelectedInfo.emit(newValue);
  }

  onKeydownSearchText(event: any) {
    if (event.keyCode === 13) {
      this.onSearchTextChanged(event.currentTarget.value);
    }
  }

  onRefresh() {
    this.gridRefresh.emit();
  }

  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= this.fontSize !== 1 ? 1 : 2;
      this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
    this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += this.fontSize !== -1 ? 1 : 2;
      this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
    }
  }

  onPrint() {
    this.print.emit();
  }

  // onSearchTextClear() {
  //   this.onSearchTextChanged(null);
  // }

}
