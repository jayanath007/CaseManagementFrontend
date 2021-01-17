export class TaskRequest {
    constructor(public filterOptions: TaskFilterOptionBaseViewModel,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }
}

export interface TaskFilterOptionBaseViewModel {
    SearchText?: string;
    BranchId: Number;
    AppCode: string;
    FileId: Number;
}

export interface DataSourceRequestViewModel {
    Take: number;
    Skip: number;
    Sort?: Array<SortViewModel>;
    Filter?: FilterViewModel;
    Aggregators?: Array<AggregatorViewModel>;
}


export interface SortViewModel {
    Field: string;
    Dir: string;
}
export interface FilterViewModel {
    Field: string;
    Operator: string;
    Value: object;
    Logic: string;
    Filters: Array<FilterViewModel>;
}

export interface AggregatorViewModel {
    Field: string;
    Aggregate: string;
}
