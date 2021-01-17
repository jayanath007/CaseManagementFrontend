import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'strTemplate'
})
export class StrTemplatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const compiled = _.template(value);
    return compiled(args || {});
  }
}
