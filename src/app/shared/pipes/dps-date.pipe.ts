import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dpsDate'
})
export class DpsDatePipe implements PipeTransform {

  constructor(public datePipe: DatePipe) { }

  transform(date: string, args?: any): any {
    const _date = Date.parse(date) ? date : date.replace(' ', 'T');
    if (_date) {
      switch (this.getDateType(date)) {
        case 'today':
          return this.datePipe.transform(_date, 'shortTime');
        case 'thisWeek':
          return this.datePipe.transform(_date, 'EEE, h:mm a');
        default:
          return this.datePipe.transform(_date, 'EEE, MMM d, y');
      }
    } else {
      return '';
    }
  }
  getDateType(date): string {
    let stringDateType = '';

    const originalMailDate = new Date(date);
    const mailDate = originalMailDate.toDateString();
    const toDate = (new Date()).toDateString();
    if (toDate === mailDate) {
      stringDateType = 'today';
    } else {
      const current = new Date;
      const weekstart = current.getDate() - current.getDay() + 1;
      const ThisMonday = new Date(current.setDate(weekstart));
      ThisMonday.setHours(0, 0, 0, 0);
      if (originalMailDate.getTime() >= ThisMonday.getTime()) {
        stringDateType = 'thisWeek';
      } else {
        stringDateType = 'other';
      }
    }

    return stringDateType;
  }
}
