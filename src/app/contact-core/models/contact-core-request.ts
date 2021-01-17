export class ContactRequest {
    constructor(public filterOptions: ContactFilterOptionBaseViewModel,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }
}

export interface ContactFilterOptionBaseViewModel {
    SearchText?: string;
    BranchId: Number;
    AppId: Number;
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
