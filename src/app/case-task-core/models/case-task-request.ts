import { TaskItemWrapper } from './interface';
import { Filter, Condition, FieldSort } from '../../odata/interfaces';


export class CaseTaskRequest {
    constructor(public filterOptions: CaseTaskFilterOptionBaseViewModel,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }
        public toPost() {
            return { dataSourceRequestViewModel: this.dataSourceInfo, caseFileIdentityWithAppCodeViewModel: this.filterOptions};
        }
}

export interface CaseTaskFilterOptionBaseViewModel {
    SearchText?: string;
    BranchId: Number;
    AppCode: string;
    FileId: Number;
}

export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: Filter<Filter<Condition>> | Filter<Condition>;
    aggregators?: Array<AggregatorViewModel> ;
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
