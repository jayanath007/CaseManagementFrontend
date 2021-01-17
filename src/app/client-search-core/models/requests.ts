import { ClientSearchPopupData, OpportunityClientFilterOptionViewModel } from './interfaces';
import { Filter, Condition, FieldSort } from '../../odata/interfaces';

export class ClientSearchRequest {
    constructor(public searchText: string,
        public dataSourceInfo: DataSourceRequestViewModel,
        public clientRef?: string) { }

    public toPost() {
        return { dataSourceRequestViewModel: this.dataSourceInfo, searchText: this.searchText };
    }

    public toPostGetMatters() {
        return { dataSourceRequestViewModel: this.dataSourceInfo, searchText: this.searchText, clientRef: this.clientRef };
    }
}
export class ClientPopupRequest {
    constructor(public filterOptions: ClientSearchPopupData,
        public dataSourceInfo: DataSourceRequestViewModel) { }

    public toPopupPost() {
        return { filterOptionViewModel: this.filterOptions, dataSourceRequestViewModel: this.dataSourceInfo };
    }
}
export class OpportunityClientPopupRequest {
    constructor(public filterOptions: OpportunityClientFilterOptionViewModel,
        public dataSourceInfo: DataSourceRequestViewModel) { }

    public toPopupPost() {
        return { OpportunityClientFilterOptionViewModel: this.filterOptions, DataSourceRequestViewModel: this.dataSourceInfo };
    }
}
export interface DataSourceRequestViewModel {
    Take: number;
    Skip: number;
    Sort?: Array<FieldSort>;
    Filter?: Filter<Filter<Condition>> | Filter<Condition>;
    Aggregators?: Array<AggregatorViewModel>;
}

export interface FilterOptionBaseViewModel {
    ClientName: string;
    ClientRef: string;
    BranchId: number;
    searchText: string;
}

export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}

