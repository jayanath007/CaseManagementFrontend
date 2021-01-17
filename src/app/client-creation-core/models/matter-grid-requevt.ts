import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class MatterGridRequevt {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public clientRef?: string) { }

    public toPost() {
        return { dataSourceRequestViewModel: this.dataSourceInfo, searchText: null, clientRef: this.clientRef };
    }
}
