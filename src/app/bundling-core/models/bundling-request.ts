import { FileHistoryGroup } from './interface';
import { FieldSort } from '../../odata';
import { GridGroupData } from '../../core/lib/grid-model';
import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';

export class GridRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public fileHistoryFilter: FileHistoryFilterModel) { }

    public GridRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            documentHistoryFilterOptionViewModel: this.fileHistoryFilter
        };
    }
}
export class FileHistoryFilterModel {
    BranchId?: number;
    AppCode: string;
    FileId: number;
    SearchText: string;
}
export interface FilterFileHistoryGroupRequest {
    BranchId?: number;
    AppCode: string;
    FileId: number;
    SearchText: string;
}
export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: any;
    aggregators?: Array<AggregatorViewModel>;
    group?: any[];
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
export interface AggregatorViewModel {
    Field: string;
    Aggregate: string;
}
export class LoadFileHistoryGridDataByGroupRequest {
    constructor(public filterOptions: FilterFileHistoryGridDataByGroupRequest,
        public dataSourceInfo: DataSourceRequestViewModel,
        public hash: string, public row: GridGroupData) { }

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
}
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
}
export interface DataSourceRequestViewModel {
    take: number;
    skip: number;
    sort?: Array<FieldSort>;
    filter?: any;
    aggregators?: Array<AggregatorViewModel>;
    group?: any[];
}

export interface PDFBundleFileRequestViewModel {
    filePath: string;
    caseFileIdentityWithAppIdViewModel: CaseFileIdentityWithAppIdViewModel;
    isFromDiary: boolean;
    diaryId: number;
}

export class BundleValidatorViewModel {
    constructor(public bundleValidatorExtensions: BundleValidatorExtensions[],
        public bundleValidatorFileLocationViewModel: BundleValidatorFileLocationViewModel[],
        public caseFileIdentityWithAppIdViewModel: CaseFileIdentityWithAppIdViewModel) { }

    public GridToPost() {
        return {
            BundleValidatorExtensions: this.bundleValidatorExtensions,
            BundleValidatorFileLocations: this.bundleValidatorFileLocationViewModel,
            CaseFileIdentityWithAppIdViewModel: this.caseFileIdentityWithAppIdViewModel
        };
    }
}

export interface BundleValidatorExtensions {
    letterName: string;
    diaryId: number;
}

export interface BundleValidatorFileLocationViewModel {
    diaryId: number;
    offlineStatus: number;
}

