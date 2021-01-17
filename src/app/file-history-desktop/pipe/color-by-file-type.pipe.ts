import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorByFileType',
  pure: true
})
export class ColorByFileTypePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value) {
      switch (value.toUpperCase()) {
        case 'FN':
          return 'file-note';
        case 'CI':
          return 'call-in';
        case 'CO':
          return 'call-out';
        case 'LI':
          return 'letter-in';
        case 'LO':
          return 'letter-out';
        case 'TA':
          return 'tasks';
        case 'KE':
          return 'key-event';
        case 'DB':
          return 'disbs';
        case 'VN':
          return 'voice-note';
        case 'EI':
          return 'email-in';
        case 'EO':
          return 'email-out';
        case 'T0':
          return 'preparation';
        case 'T1':
          return 'attendance-meetings';
        case 'T2':
          return 'engineering-time';
        case 'T3':
          return 'travelling';
        case 'T4':
          return 'waiting';
        default:
          return 'Error';
      }
    }
    return 'Error';
  }

}
