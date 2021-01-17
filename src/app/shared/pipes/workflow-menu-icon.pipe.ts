import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'workflowMenuIcon',
    pure: true
})
export class WorkflowMenuIconPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            switch (value) {
                case 1:
                    return 'fa fa-folder dps-menu-icon';
                case 2:
                    return 'fa fa-pencil-square-o dps-screen-icon';
                case 4:
                    return 'fa fa-th-large dps-template-icon';
                case 6:
                    return 'contacts dps-contactscreen-icon';
                case 7:
                    return 'fa fa-file-code-o dps-program-icon';
                default:
                    return 'dps-default-icon';
            }
        }
        return 'dps-empty-menu-icon';
    }

}
