import { ContactItemWrapper } from './interface';
import { Filter, Condition, FieldSort } from '../../odata/interfaces';


export class CaseContactRequest {
    constructor(public filterOptions: CaseContactFilterOptionBaseViewModel,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string
        , public matterInfo?: any
    ) { }
    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            caseFileIdentityWithAppIdViewModel: this.filterOptions
        };
    }
}

export class ScreensContactTypeRequest {
    constructor(public appId: number,
        public dataSourceInfo: DataSourceRequestViewModel
    ) { }

    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            appId: this.appId,
        };
    }
}


export class MainContactRequest {
    constructor(
        public searchText,
        public typeFilterId: number,
        public typeId: number,
        public dataSourceInfo: DataSourceRequestViewModel,
        public hash: string,
        public matterInfo?: any
    ) { }
    public toPost() {
        return {
            searchedText: this.searchText,
            typeFilterId: this.typeFilterId,
            typeId: this.typeId,
            dataSourceRequestViewModel: this.dataSourceInfo,
        };
    }
}

export interface CaseContactFilterOptionBaseViewModel {
    SearchText?: string;
    BranchId: Number;
    AppId: Number;
    FileId: Number;
}

export interface MainContactFilterOptionBaseViewModel {
    SearchText: string;
    typeFilterId: Number;
    typeId: Number;
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
