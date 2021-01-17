import { Pipe, PipeTransform } from '@angular/core';
import { timezoneConversions } from '../../utils/javascriptDate';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'timezone',
  pure: true
})
export class TimezonePipe implements PipeTransform {
  constructor() { }
  transform(date: string, args?: any) {
    return args ? moment(date.includes('Z') ? date : date + 'Z').tz(timezoneConversions[args]).format('YYYY-MM-DDTHH:mm:ss') : date;
  }

}
