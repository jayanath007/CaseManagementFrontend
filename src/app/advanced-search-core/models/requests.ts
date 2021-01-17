import { Filter, Condition, FieldSort } from '../../odata/interfaces';

export class AdvanceSearchRequest {
    constructor(public advancedMatterSearchViewModel: AdvancedSearchViewModel,
        public dataSourceRequestViewModel: DataSourceRequestViewModel) { }

    public toPost() {
        return {
            advancedMatterSearchViewModel: this.advancedMatterSearchViewModel,
            dataSourceRequestViewModel: this.dataSourceRequestViewModel
        };
    }
}

// export class ClientsRequest {
//     constructor(public searchText: string,
//         public dataSourceInfo: DataSourceRequestViewModel
//     ) { }

//     public toClientPost() {

//         return data;
//     }
// }



export interface AdvancedSearchViewModel {
    searchClients: string;
    searchMatters: string;
    branchId: number;
    matterClosed: boolean;
    appId: number;
    searchColumnOption: string;
    matterSearchMode: string;
    searchFields: string[];
    inString: boolean;
}

export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: Filter<Filter<Condition>> | Filter<Condition>;
    aggregators?: Array<AggregatorViewModel>;
}

export interface SearchAdvancedInfo {
    branchId: number;
    appID: number;
}


export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}

export interface SerchInfoResponce {
    appId: number;
    branchId: number;
    dataSourceRequestViewModel: DataSourceRequestViewModel;
    matterClosed: string;
    matterSearchMode: string;
    searchClients: string;
    columnOptionMode: string;
    searchFields: string;
    searchMatters: string;
    appStaticColumnHeaders: string[];
    appDynamicColumnHeaders: string[];
    inString: boolean;
}




