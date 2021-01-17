import { DayActivity, MonthActivityResponce } from './../../../team-core/models/interface';
import { UserViewType } from './../../../team-core/models/enum';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'dps-team-layout-content',
  templateUrl: './team-layout-content.component.html',
  styleUrls: ['./team-layout-content.component.scss']
})
export class TeamLayoutContentComponent implements OnInit {
  @Input() columnDef;
  @Input() eventYearSummery;
  @Input() activityListByDay: DayActivity[];
  @Input() monthActivityList: MonthActivityResponce[];
  @Input() selectYearAndMonth: Moment;
  @Input() selectedViewType: UserViewType;
  @Input() loading: boolean;

  @Output() selectedDay = new EventEmitter<any>();
  @Output() selectYearAndMonthClick = new EventEmitter<{ selectdate: any, kind: UserViewType }>();
  @Output() changeViewType = new EventEmitter<any>();

  viewType = UserViewType;


  constructor() { }

  ngOnInit() {
  }

  onSelectedDay(event) {
    this.selectedDay.emit(event);

  }


  chosenDateHandler(normalized: Moment, picker: MatDatepicker<Moment>) {

    if (this.selectedViewType === UserViewType.YearView) {
      this.selectYearAndMonthClick.emit({ selectdate: normalized, kind: this.viewType.YearView });
      picker.close();
    } else if (this.selectedViewType === UserViewType.MonthView) {
      this.selectYearAndMonthClick.emit({ selectdate: normalized, kind: this.viewType.MonthView });
      picker.close();
    }
  }

  getViewType() {
    if (this.selectedViewType === this.viewType.YearView) {
      return 'multi-year';
    } else if (this.selectedViewType === this.viewType.MonthView) {
      return 'year';
    }

  }

  onChangeViewType(value) {
    this.changeViewType.emit(value);

  }


}
