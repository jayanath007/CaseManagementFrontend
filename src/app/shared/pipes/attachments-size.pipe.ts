import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attachmentsSize',
  pure: true
})
export class AttachmentsSizePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    } else if (value > 1048576) {
      return Math.round(value / 1048576) + ' MB';
    } else if (value > 1024) {
      return Math.round(value / 1024) + ' KB';
    } else {
      return value + ' bytes';
    }
  }

}
