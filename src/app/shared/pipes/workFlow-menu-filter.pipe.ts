import { WorkflowMenuMetaDataWrapper } from '../../workflow-menu-core/models/interfaces';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'workflowMenuFilter',
    pure: true
})
export class WorkflowMenuFilterPipe implements PipeTransform {

    transform(items: WorkflowMenuMetaDataWrapper[], args?: any): any {
        if (!items) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.data.atN_Type === 1);
    }
}
