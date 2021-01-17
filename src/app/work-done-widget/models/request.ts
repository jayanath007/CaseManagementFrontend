import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class DataRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public timeRecordedFilter: WorkDoneFilterModel) { }

    public DataRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            filterOptionViewModel: this.timeRecordedFilter
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
