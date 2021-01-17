import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameInitials',
  pure: true
})
export class NameInitialsPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value === undefined || !value) {
      return '';
    }
    const names = value.trim().replace(/[^a-zA-Z0-9\s]+/g, '').split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[1].substring(0, 1).toUpperCase();
    }
    return initials ? initials : '?';
  }

}
