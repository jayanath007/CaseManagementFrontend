import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { gridFilterKind } from '../../../work-done-core/models/enumeration';
import { SelectedInfo, GroupMode } from '../../../work-done-core/models/interfce';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-work-done-views',
  templateUrl: './work-done-views.component.html',
  styleUrls: ['./work-done-views.component.scss']
})
export class WorkDoneViewsComponent implements OnInit {

  @Input() userPermision: any;
  @Input() selectedInfo: SelectedInfo;
  @Input() periodList: any[];
  @Input() groupMode;
  @Input() isLoading: boolean;
  @Input() timeOffset: number;

  @Output() updateSelectedInfo = new EventEmitter<any>();
  @Output() gridRefresh = new EventEmitter();
  @Output() gridFontSize = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<any>();
  @Output() print = new EventEmitter();

  constructor() { }

  inputCtrl = new FormControl();
  fromDate;
  toDate;

  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;

  GroupMode = GroupMode;

  ngOnInit() {
    this.fromDate = dpsNewDate(this.timeOffset);
    this.toDate = dpsNewDate(this.timeOffset);
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

  get selectedPeriod() {
    if (this.periodList && this.periodList.length > 0 && this.selectedInfo) {
      return this.periodList.find((period) => period.groupId === this.selectedInfo.periodId);
    }
    return this.periodList;
  }

  onSearchTextChanged(value) {
    const newValue = { kind: gridFilterKind.searchText, value: value ? value : null };
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

  onChangePeriod(event) {
    if (event.value) {
      this.fromDate = dpsNewDate(this.timeOffset);
      this.toDate = dpsNewDate(this.timeOffset);
      this.emitPeriodChange(event.value.groupId);
    }
  }

  onChangeFromDateDone(event) {
    this.fromDate = event.value;
    this.emitPeriodChange(5);
  }
  onChangeToDateDone(event) {
    this.toDate = event.value;
    this.emitPeriodChange(5);
  }

  emitPeriodChange(value) {
    const newValue = { kind: gridFilterKind.period, value: value, fromDate: this.fromDate, toDate: this.toDate };
    this.updateSelectedInfo.emit(newValue);
  }

  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      // this.fontSize -= this.fontSize !== 1 ? 1 : 2;
      this.fontSize -= 1;
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
      // this.fontSize += this.fontSize !== -1 ? 1 : 2;
      this.fontSize += 1;
      this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  // onSearchTextClear() {
  //   this.onSearchTextChanged(null);
  // }

  onMenuChange(event) {
    this.menuChange.emit(event);
  }
  onPrint() {
    this.print.emit();
  }
}
