import { Pipe, PipeTransform } from '@angular/core';
import { HtmlParser } from '@angular/compiler';

@Pipe({
  name: 'plainTexttoHTML',
  pure: true
})
export class PlainTexttoHTML implements PipeTransform {

  transform(value: string, args?: any): any {
    // const regex = new RegExp('/(\\r\\n)|([\r\n])|(\\n)|(\\r)/', 'g');
    value = value.replace('\\n', '<br>');
    // value = value
    //   .replace(/\\n/g, '<br>')
    //   .replace(/&/g, '&amp;')
    //   .replace(/"/g, '&quot;')
    //   .replace(/'/g, '&#39;')
    //   .replace(/</g, '&lt;')
    //   .replace(/>/g, '&gt;');
    return value;
  }

}