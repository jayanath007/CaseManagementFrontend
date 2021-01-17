import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'balancesColor',
  pure: true
})
export class BalancesColorPipe implements PipeTransform {

  transform(value: number, args?: string): any {
    if (value && args) {
      value = !isNaN(parseInt(value.toString(), 0)) ? parseInt(value.toString(), 0) : value;
      switch (args) {
        case 'Client Balance':
          if (value < 0) {
            return 'dps-ledgerCard-balances-color-red';
          } else {
            return 'dps-ledgerCard-balances-color-palegreen';
          }
        case 'Office Balance':
          if (value < 0) {
            return 'dps-ledgerCard-balances-color-red';
          } else {
            return 'dps-ledgerCard-balances-color-paleturquoise';
          }
        case 'DDA Balance':
          if (value < 0) {
            return 'dps-ledgerCard-balances-color-red';
          } else {
            return 'dps-ledgerCard-balances-color-lightpink';
          }
        default: {
          return 'dps-ledgerCard-balances-color-blue';
        }
      }
    } else {
      return 'dps-ledgerCard-balances-color-blue';
    }
  }

}
