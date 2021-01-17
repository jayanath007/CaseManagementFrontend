import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recipientColorCode',
  pure: true
})
export class RecipientColorCodePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    let sumAsc = 0;
    if ((typeof value === 'string' || <any>value instanceof String) && value) {
      const val = value.toLowerCase();
      for (let i = 0; i < val.length; i++) {
        sumAsc += val.charCodeAt(i);
      }
      switch (sumAsc % 15) {
        case 0:
          return '#99B433';
        case 1:
          return '#7E3878';
        case 2:
          return '#DA532C';
        case 3:
          return '#6BA5E7';
        case 4:
          return '#E11';
        case 5:
          return '#00A300';
        case 6:
          return '#B91D47';
        case 7:
          return '#1E7145';
        case 8:
          return '#2B5797';
        case 9:
          return '#2D89EF';
        case 10:
          return '#E773BD';
        case 11:
          return '#603CBA';
        case 12:
          return '#1D1D1D';
        case 13:
          return '#f759b7';
        case 14:
          return '#00ABA9';
      }
    }
    return '#0D557C';
  }
}

