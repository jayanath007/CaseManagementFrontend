import { DataSourceRequestViewModel } from '../../case-contact-core/models/case-contact-request';

export interface LedgerFilterOptionsViewModel {
    showDDA: boolean;
    showCOS: boolean;
    showReversal: boolean;
    hideSystemBills: boolean;
    showOnlyOfficeTrans: boolean;
    showOnlyDisbuersements: boolean;
    Period?: string;
}

export class AllGridRequest {
    constructor(public filterOptions: LedgerFilterOptionsViewModel, public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public allGridToPost() {
        return {
            filterOptionsViewModel: this.filterOptions,
            matterRef: this.matterRef,
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }
}

export class BillGridRequest {
    constructor(public isBillsOnly: boolean, public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public billGridToPost() {
        return {
            isBillsOnly: this.isBillsOnly,
            matterRef: this.matterRef,
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }
}

export class DisbsGridRequest {
    constructor(public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public disbsGridToPost() {
        return {
            matterRef: this.matterRef,
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }
}

export class GbpGridRequest {
    constructor(public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public gpdGridToPost() {
        return {
            matterRef: this.matterRef,
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }
}

export class DdaGridRequest {
    constructor(public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public ddaGridToPost() {
        return {
            matterRef: this.matterRef,
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }
}

export class ClientGridRequest {
    constructor(public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel,
        public currencyCode: string,
        public hash: string) { }

    public clientGridToPost() {
        return {
            matterRef: this.matterRef,
            dataSourceRequestViewModel: this.dataSourceInfo,
            currencyCode: this.currencyCode
        };
    }
}

