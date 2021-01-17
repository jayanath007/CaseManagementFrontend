import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strDefault'
})
export class StrDefaultPipe implements PipeTransform {

  transform(value: string, defaultValue: string = ''): any {
    if (!!value) {
      return value;
    }
    return defaultValue;
  }

}
