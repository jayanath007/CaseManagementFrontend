import { CaseFileIdentityWithAppIdViewModel } from './../../billing-guide-core/models/interfaces';
import { Filter, Condition, FieldSort } from './enum';

export class LinkedMatterRequestViewModel {
    constructor(public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel) { }

    public toPost() {
        return { DataSourceRequestViewModel: this.dataSourceInfo, MatterRef: this.matterRef };
    }
}

export class PlotMatterViewModel {
    constructor(public plotNumbers: string, public matterRef: string,
        public appId: number, public branchId: number, public filedId: number) { }

    public toPost() {
        return {
            plotNumbers: this.plotNumbers, MatterRef: this.matterRef,
            appId: this.appId, BranchId: this.branchId, FileId: this.filedId,
        };
    }
}

export class PlotMatterDiaryRecordsInfoViewModel {
    constructor(public PlotMatters: string[],
        public DiaryId: number[], public matterRef: string, public LinkMatterRange: string,
        public caseFileIdentityWithAppIdViewModel: CaseFileIdentityWithAppIdViewModel) { }

    public toPost() {
        return {
            PlotMatters: this.PlotMatters, DiaryId: this.DiaryId, LinkMatterRange: this.LinkMatterRange,
            CaseFileIdentityWithAppIdViewModel: this.caseFileIdentityWithAppIdViewModel

        };
    }
}

export class PlotMatterUpdateViewModel {
    constructor(public masterMatterRef: string,
        public linkMatters: string[],
        public LinkMatterRange: string, ) { }

    public toPost() {
        return { MasterMatterRef: this.masterMatterRef, linkMatters: this.linkMatters, LinkMatterRange: this.LinkMatterRange, };
    }
}



export interface DataSourceRequestViewModel {
    Take: number;
    Skip: number;
    Sort?: Array<FieldSort>;
    Filter?: Filter<Filter<Condition>> | Filter<Condition>;
    Aggregators?: Array<AggregatorViewModel>;
}


export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}





