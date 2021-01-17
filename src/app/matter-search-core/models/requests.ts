import { Filter, Condition, FieldSort } from '../../odata/interfaces';

export class MatterRequest {
    constructor(public filterOptions: MatterFilterOptionViewModel,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public toPost() {
        return { matterFilterOptionViewModel: this.filterOptions, dataSourceRequestViewModel: this.dataSourceInfo };
    }
}
//  JSON.stringify(_.sortBy(this.dataSourceInfo.Sort, function(obj) { return obj.Sort; })) + '/' +
//  JSON.stringify(_.sortBy(this.dataSourceInfo.Filter, function(obj) { return obj.Field; })) + '/' +

// =======Matter create ============
export class MatterRequestForMatterCreate {
    constructor(public matterCreateInputModel: MatterCreateInputModel,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo, matterSearchFieldsViewModel: this.matterCreateInputModel,
            searchText: this.matterCreateInputModel.searchText
        };
    }
}
export interface MatterCreateInputModel {
    BranchId: number;
    ClientName: string;
    ClientReference: string;
    MatterDetails: string;
    MatterReference: string;
    searchText: string;
}
export interface MatterCreateFilterOptionViewModel {
    matterFilterType: string;
    isInactiveFeeearners: boolean;
    isOnlyOpen: boolean;
    isGeneralSearch: boolean;
    user: string;
    departmentId: number;
    matterCreateInput: MatterCreateInputModel;
}
// =======Matter create end ============


export interface FilterOptionBaseViewModel {
    user: string;
    departmentId: number;
    searchText: string;
}

export interface MatterFilterOptionViewModel extends FilterOptionBaseViewModel {
    matterFilterType: string;
    isInactiveFeeearners: boolean;
    // isOnlyOpen: boolean;
    includeClosedMatters: boolean;
    includeCompleteMatters: boolean;
    isGeneralSearch: boolean;
    emailAddress?: any;
}

export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: Filter<Filter<Condition>> | Filter<Condition>;
    aggregators?: Array<AggregatorViewModel>;
}

export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}

