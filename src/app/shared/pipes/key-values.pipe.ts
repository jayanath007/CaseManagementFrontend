import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValues'
})
export class KeyValuesPipe<T> implements PipeTransform {

  transform(value: any): T[] {
    return Object.keys(value).map(key => value[key]);
  }

}
