import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class DataRequest {
    constructor(public filterOptions: MatterFilterOptionViewModel,
        public dataSourceInfo: DataSourceRequestViewModel) { }

    public toPost() {
        return { matterFilterOptionViewModel: this.filterOptions, dataSourceRequestViewModel: this.dataSourceInfo };
    }
}

export interface MatterFilterOptionViewModel extends FilterOptionBaseViewModel {
    matterFilterType: string;
    isInactiveFeeearners: boolean;
    isOnlyOpen: boolean;
    isGeneralSearch: boolean;
}

export interface FilterOptionBaseViewModel {
    user: string;
    departmentId: number;
    searchText: string;
}




