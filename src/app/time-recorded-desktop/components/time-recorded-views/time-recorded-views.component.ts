import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserPermission, SelectedInfo, GridFilterUpdate, Periods } from '../../../time-recorded-core/models/interfce';
import { gridFilterKind, GroupMode } from '../../../time-recorded-core/models/enumeration';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { dpsNewDate } from '../../../utils/javascriptDate';
import { ColumnDef } from './../../../core/lib/grid-model';

@Component({
  selector: 'dps-time-recorded-views',
  templateUrl: './time-recorded-views.component.html',
  styleUrls: ['./time-recorded-views.component.scss']
})
export class TimeRecordedViewsComponent implements OnInit {

  @Input() userPermision: UserPermission;
  @Input() selectedInfo: SelectedInfo;
  @Input() groupMode: GroupMode;
  @Input() periodList: Periods[];
  @Input() timeOffset: number;
  @Input() columnDef: ColumnDef[];

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  @Output() gridRefresh = new EventEmitter();
  @Output() gridFontSize = new EventEmitter<string>();
  @Output() onGroupBy = new EventEmitter<string>();
  @Output() newTime = new EventEmitter();
  @Output() exportToExcel = new EventEmitter();
  @Output() dateTypeChanged = new EventEmitter();

  inputCtrl = new FormControl();
  fromDate;
  toDate;
  groupModes = GroupMode;
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;

  constructor() { }

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
    if (this.periodList && this.selectedInfo) {
      return this.periodList.find((period) => period.groupId === this.selectedInfo.periodId);
    }
    return this.periodList;
  }

  onSearchTextChanged(value) {
    let newValue = { kind: gridFilterKind.searchText, value: null };
    if (value) {
      newValue = { kind: gridFilterKind.searchText, value: value };
    }
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
      this.fontSize += 1;
      this.gridFontSize.emit(this.fontSizeClassTag + this.fontSize);
    }
  }

  groupBy(type: string) {
    this.onGroupBy.emit(type);
  }

  newTimeClick() {
    this.newTime.emit();
  }

  onExportToExcel() {
    this.exportToExcel.emit();
  }
  onDateTypeChanged(eventValue) {
    this.dateTypeChanged.emit((eventValue === 'BillDate' ? true : false));
  }

}
