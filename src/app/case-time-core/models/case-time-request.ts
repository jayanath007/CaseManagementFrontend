import { Filter, Condition, FieldSort } from '../../odata/interfaces';


export class CaseTimeRequest {
    constructor(public filterOptions: CaseTimeFilterOptionBaseViewModel,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }
    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            matterRef: this.filterOptions.matterRef
        };
    }
}

export interface CaseTimeFilterOptionBaseViewModel {
    SearchText?: string;
    matterRef: string;
}

export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: Filter<Filter<Condition>> | Filter<Condition>;
    aggregators?: Array<AggregatorViewModel>;
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

export class CaseTimeDeleteRequest {
    constructor(public timeIdList: number[],
    public matterRef: string) { }
    public toPost() {
        return {
            timeIdList: this.timeIdList,
            matterRef: this.matterRef
        };
    }
}
