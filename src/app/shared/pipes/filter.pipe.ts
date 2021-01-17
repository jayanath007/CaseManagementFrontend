import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: any[], key: string, keyValue: any, valueKey?: any): any {

    if (!!list && list.length > 0) {
      const item = list.find(i => i[key] === keyValue);
      if (!!valueKey && !!item) {
        return item[valueKey];
      };
      return item;
    }
    return null;
  }

}
