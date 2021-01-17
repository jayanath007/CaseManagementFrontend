
import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { CustomeRecurrenceDialogInput } from '../../../calendar-core';
import { RecurrencePatternType, DayOfWeek, WeekIndex } from '../../../core/lib/microsoft-graph';
import { RepeatType } from '../../../calendar-core/models/interfaces';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';
import { InforDialogData, InforDialogComponent } from '../../../shared';

@Component({
  selector: 'dps-custome-recurrence-dialog',
  templateUrl: './custome-recurrence-dialog.component.html',
  styleUrls: ['./custome-recurrence-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomeRecurrenceDialogComponent implements OnInit {
  type: RecurrencePatternType = 'daily';
  interval = 1;
  month = 1;
  dayOfMonth = 1;
  daysOfWeek: DayOfWeek[] = ['monday'];
  dayOfWeek: DayOfWeek = 'monday';
  index: WeekIndex = 'first';
  maxDateOfMonth = 31;
  constructor(@Inject(MAT_DIALOG_DATA) public data: CustomeRecurrenceDialogInput,
    public dialogRef: MatDialogRef<CustomeRecurrenceDialogComponent>, private dialog: MatDialog) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.recurrence) {
        this.type = this.data.recurrence.type || this.type;
        this.interval = this.data.recurrence.interval || 1;
        this.month = this.data.recurrence.month || this.data.repeatList.find(val => val.val === 'yearly').recurrence.month;
        this.dayOfWeek = this.data.recurrence.daysOfWeek && this.data.recurrence.daysOfWeek.length > 0 ?
          this.data.recurrence.daysOfWeek[0] : this.dayOfWeek;
        this.index = this.data.recurrence.index || this.index;
        this.dayOfMonth = this.data.recurrence.dayOfMonth;
        this.daysOfWeek = this.data.recurrence.daysOfWeek ? this.data.recurrence.daysOfWeek.slice(0) : this.daysOfWeek;
      } else {
        this.month = this.data.repeatList.find(val => val.val === 'yearly').recurrence.month;
        this.dayOfMonth = this.data.repeatList.find(val => val.val === 'day_x_of_every_month').recurrence.dayOfMonth;
        this.daysOfWeek = this.data.repeatList.find(val => val.val === 'every_x_week_day').recurrence.daysOfWeek.slice(0);
        this.index = this.data.repeatList.find(val => val.val === 'monthly').recurrence.index;
      }
      // this.selectWeekDays(this.daysOfWeek);
    }
  }

  get getSelectMonth() {
    if (this.data.monthList && this.data.monthList.length > 0) {
      return this.data.monthList.find(month => month.val === this.month);
    }
  }

  getIsDaySelect(monthVal: MsGraphBeta.DayOfWeek) {
    if (this.daysOfWeek.find(val => val === monthVal)) {
      return true;
    } else {
      return false;
    }
  }

  onOccursChange(itemValue: RecurrencePatternType) {
    // this.selectWeekDays(this.daysOfWeek);
    console.log(this.data.dayOfWeekList);
    this.type = itemValue;
  }

  onWeekIndexChange(weekIndex: WeekIndex) {
    this.index = weekIndex;
  }

  ondayOfWeekChange(dayOfWeek: DayOfWeek) {
    this.dayOfWeek = dayOfWeek;
  }

  onMonthChange(month: { val: number, label: string, maxDay: number }) {
    this.month = month.val;
    this.maxDateOfMonth = month.maxDay;
    this.checkIsValidDayOfMonth(month.maxDay, this.dayOfMonth);
  }

  onDayChange(day: DayOfWeek) {
    this.dayOfWeek = day;
  }

  onChangedayOfMonth(dayOfMonth: number) {
    this.checkIsValidDayOfMonth(this.maxDateOfMonth, dayOfMonth);
  }

  onChangeWeekDays(isCheck, dayVal, index) {
    if (isCheck && !this.daysOfWeek.find(val => val === dayVal)) {
      // this.daysOfWeek.splice(index, 0, dayVal);
      this.daysOfWeek.push(dayVal);
    } else if (!isCheck && this.daysOfWeek.find(val => val === dayVal)) {
      this.daysOfWeek = this.daysOfWeek.filter(val => val !== dayVal);
    }
  }

  checkIsValidDayOfMonth(maxDateOfMonth: number, dayOfMonth: number) {
    if (dayOfMonth > maxDateOfMonth) {
      this.dayOfMonth = maxDateOfMonth;
    } else {
      this.dayOfMonth = dayOfMonth < 1 ? 1 : dayOfMonth;
    }
  }

  onChangeInterval(newInterval) {
    this.interval = newInterval;
  }

  onSaveClick() {
    // 'daily' | 'weekly' | 'absoluteMonthly' | 'relativeMonthly' | 'absoluteYearly' | 'relativeYearly';
    let tempRecurrencePattern: MsGraphBeta.RecurrencePattern;
    switch (this.type) {
      case 'daily': {
        if (this.interval) {
          tempRecurrencePattern = {
            type: this.type,
            interval: this.interval,
          };
          this.dialogRef.close(tempRecurrencePattern);
        } else {
          this.showMsg('You need to specify a valid interval.');
        }
        break;
      }
      case 'weekly': {
        if (!this.interval) {
          this.showMsg('You need to specify a valid interval.');
        } else if (this.daysOfWeek.length === 0) {
          this.showMsg('Select one or multiple days of the week.');
        } else {
          tempRecurrencePattern = {
            type: this.type,
            interval: this.interval,
            daysOfWeek: this.daysOfWeek,
          };
          this.dialogRef.close(tempRecurrencePattern);
        }
        break;
      }
      case 'absoluteMonthly': {
        if (!this.interval) {
          this.showMsg('You need to specify a valid interval.');
        } else if (!this.dayOfMonth) {
          this.showMsg('You need to specify a valid date.');
        } else {
          tempRecurrencePattern = {
            type: this.type,
            interval: this.interval,
            dayOfMonth: this.dayOfMonth
          };
          this.dialogRef.close(tempRecurrencePattern);
        }
        break;
      }
      case 'relativeMonthly': {
        if (!this.interval) {
          this.showMsg('You need to specify a valid interval.');
        } else {
          tempRecurrencePattern = {
            type: this.type,
            interval: this.interval,
            index: this.index,
            daysOfWeek: this.daysOfWeek
          };
          this.dialogRef.close(tempRecurrencePattern);
        }
        break;
      }
      case 'absoluteYearly': {
        if (!this.dayOfMonth) {
          this.showMsg('You need to specify a valid date.');
        } else {
          tempRecurrencePattern = {
            type: this.type,
            month: this.month,
            dayOfMonth: this.dayOfMonth,
            interval: this.interval,
          };
          this.dialogRef.close(tempRecurrencePattern);
        }
        break;
      }
      case 'relativeYearly': {
        tempRecurrencePattern = {
          type: this.type,
          index: this.index,
          daysOfWeek: this.daysOfWeek,
          month: this.month,
          interval: this.interval,
        };
        this.dialogRef.close(tempRecurrencePattern);
        break;
      }
      default: {
        break;
      }
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
  showMsg(errorMsg) {
    if (errorMsg) {
      const dialogData: InforDialogData = {
        content: {
          title: '',
          message: errorMsg
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '200px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
    }
  }

}
