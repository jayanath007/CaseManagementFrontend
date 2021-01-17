import { FileItemWrapper, FileHistoryGroup, } from './interface';
import { FieldSort } from '../../odata/interfaces';




export class FileHistoryRequest {
    constructor(public filterOptions: FileHistorFilterOptionBaseViewModel,
        public dataSourceInfo: DataSourceRequestViewModel,
        public hash: string,
        public row?: FileHistoryGroup) { }

    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            documentHistoryFilterOptionViewModel: this.filterOptions,
        };
    }
}

export interface FileHistorFilterOptionBaseViewModel {
    BranchId?: number;
    AppCode: string;
    FileId: number;
    SearchText: string;
    IsSearchFullText: boolean;
}

export class LoadFileHistoryGroupRequest {

    constructor(public filterOptions: FilterFileHistoryGroupRequest,
        public dataSourceInfo: DataSourceRequestViewModel,
        public hash: string, public fileHistoryGroup: FileHistoryGroup) { }

    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            documentHistoryFilterOptionViewModel: this.filterOptions,
        };
    }
}

export interface FilterFileHistoryGroupRequest {
    BranchId?: number;
    AppCode: string;
    FileId: number;
    SearchText: string;
    IsSearchFullText: boolean;
}
export class LoadFileHistoryGridDataByGroupRequest {
    constructor(public filterOptions: FilterFileHistoryGridDataByGroupRequest,
        public dataSourceInfo: DataSourceRequestViewModel,
        public hash: string, public row: FileHistoryGroup) { }

    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            documentHistoryFilterOptionViewModel: this.filterOptions,
        };
    }
}

export interface FilterFileHistoryGridDataByGroupRequest {
    BranchId?: number;
    AppCode: string;
    FileId: number;
    // FolderId: number;
    // Date: string;
    SearchText: string;
    IsSearchFullText: boolean;
}







export class DocumentURLRequest {
    constructor(public row: FileItemWrapper) { }
}




export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: any;
    aggregators?: Array<AggregatorViewModel>;
    group?: any[];
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
