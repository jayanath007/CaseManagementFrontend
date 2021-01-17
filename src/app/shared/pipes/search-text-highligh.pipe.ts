import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seacrhTextHighligh',
  pure: true
})
export class SearchTextHighlighPipe implements PipeTransform {

  transform(value: string, args?: string): any {
    if (value && args) {

      // remove unwanted character
      if (args[args.length - 1] === ',') {
        args = args.substr(0, args.length - 1);
      }
      const argsList = args.trim().split(',').map(val => val.trim());

      let allMatchin: string[];
      // get All the matching test with case
      argsList.forEach((argsText, i) => {
        allMatchin = value.match(new RegExp('(' + argsText + ')', 'gi'));
        if (allMatchin && allMatchin.length > 0) {
          value = value.replace(new RegExp('(' + allMatchin.join('|') + ')', 'g'),
            `<span class="dps-highlight-${'' + (i < 4 ? i : 3)}">$1</span>`);
        }
      });
      return value;
    } else {
      return value;
    }
  }

}
