import { Any } from './../../billing-request-core/actions/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'propertyLength'
})
export class PropertyLengthPipe implements PipeTransform {

  transform(value: Any): any {
    if (!!value) {
      return value.toString().length;
    }
    return 0;
  }

}
