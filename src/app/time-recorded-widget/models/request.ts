import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class DataRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public timeRecordedFilter: TimeRecordedFilterModel) { }

    public DataRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            filterOptionViewModel: this.timeRecordedFilter
        };
    }
}

export class TimeRecordedFilterModel {
    dateFrom: string | Date;
    dateTo: string | Date;
    type: number;
    user: string;
    departmentId: number;
    searchText: string;
}
