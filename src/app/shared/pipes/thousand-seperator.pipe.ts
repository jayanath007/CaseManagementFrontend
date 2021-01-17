import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeperator'
})
export class ThousandSeperatorPipe implements PipeTransform {

  transform(value: any): any {

    const reg = new RegExp('^[0-9]+$');

    if (!!value) {
      value = value.toString().replace(!reg, '');
      return value.replace(/\,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return '';
  }

}
