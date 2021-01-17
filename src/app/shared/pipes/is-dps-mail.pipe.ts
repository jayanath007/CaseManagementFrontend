import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isDPSMail'
})
export class IsDpsMailPipe implements PipeTransform {

  transform(subject: string, args?: any): any {
    if (subject) {
      if (subject.trim().toUpperCase().indexOf('(DPS:') !== -1) {
        return true;
      } else if (subject.trim().toUpperCase().indexOf('#DPS:') !== -1 &&
        (!args || subject.split('#DPS:')[1].split(':')[0] === 'ZZ' || subject.split('#DPS:')[1].split(':')[0] === args)) {
        return true;
      } else if (subject.trim().toUpperCase().indexOf('[DPS:') !== -1 &&
        (!args || subject.split('[DPS:')[1].split(':')[0] === 'ZZ' || subject.split('[DPS:')[1].split(':')[0] === args)) {
        return true;
      }
    }
    return false;
  }

}
