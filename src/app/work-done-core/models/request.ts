import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class GridRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public workDoneFilter: WorkDoneFilterModel) { }

    public GridRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            filterOptionViewModel: this.workDoneFilter
        };
    }
}

export class WorkDoneFilterModel {
    dateFrom: string | Date;
    dateTo: string | Date;
    user: string;
    departmentId: number;
    searchText: string;
}

