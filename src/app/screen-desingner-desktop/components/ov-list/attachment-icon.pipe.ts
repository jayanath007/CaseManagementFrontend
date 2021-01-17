import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'controllerIcon',
    pure: true
})
export class ControllerIconPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            switch (value) {
                case 0:
                    return 'fa fa-file-text';
                case 1:
                    return 'fa fa-calendar';
                case 2:
                    return 'fa fa-check-square';
                case 3:
                    return 'fa fa-th-large';
                case 4:
                    return 'fa fa-caret-square-o-down';
                case 5:
                    return 'fa fa-gbp';
                case 6:
                    return 'fa fa-list-ol';
                case 7:
                    return 'fa fa-bars';
                case 8:
                    return 'fa fa-clock-o';
                default:
                    return '&nbsp;';
            }
        }
        return '';
    }

}
