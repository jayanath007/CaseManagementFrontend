
import { Pipe, PipeTransform } from '@angular/core';
import { TreeItemType } from '../../forms-library/models/enums';
import { TreeDataWrapper } from '../../forms-library/models/interfce';

@Pipe({
    name: 'formsLibraryFilter',
    pure: true
})
export class FormsLibraryFilterPipe implements PipeTransform {

    transform(items: TreeDataWrapper[], args?: any): any {
        if (!items) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.nodeType === TreeItemType.Folder);
    }
}
