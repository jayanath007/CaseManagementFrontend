import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validateEmail',
  pure: true
})
export class ValidateEmailPipe implements PipeTransform {

  transform(value: any, args?: any): boolean {
    const atpos = value.indexOf('@');
    const dotpos = value.lastIndexOf('.');
    if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= value.length) {
      return false;
    }
    return true;
  }

}
