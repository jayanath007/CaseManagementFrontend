import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbols'
})
export class CurrencySymbolsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'ALL':
        return 'Lek';
      case 'AFN':
        return '؋';
      case 'ARS':
        return '$';
      case 'AWG':
        return 'ƒ';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'INR':
        return '₹';
      case 'AUD':
        return '$';
      case 'CAD':
        return '$';
      case 'SGD':
        return '$';
      case 'CHF':
        return 'CHF';
      case 'MYR':
        return 'RM';
      case 'JPY':
        return '¥';
      case 'CNY':
        return '¥';
      case 'SAR':
        return '﷼';
      case 'LKR':
        return '₨';
    }
    return '';
  }

}

