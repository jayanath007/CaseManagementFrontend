import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class GridRequest {
    constructor(public dataSourceRequestViewModel: DataSourceRequestViewModel,
        public postOfficeInboxFilterOptionViewModel: PostOfficeFilterModel) { }

    public GridRequestToPost() {

        return {
            dataSourceRequestViewModel: this.dataSourceRequestViewModel,
            postOfficeInboxFilterOptionViewModel: this.postOfficeInboxFilterOptionViewModel
        };
    }
}

export class PostOfficeFilterModel {
    groupId: number;
    userID: string;
    searchText: string;
}


