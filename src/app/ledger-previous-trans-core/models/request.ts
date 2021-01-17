import { DataSourceRequestViewModel, GridFilterModel } from './interface';

export class AllGridRequest {
    constructor(public filterOptions: GridFilterModel, public matterRef: string,
        public dataSourceInfo: DataSourceRequestViewModel, public hash: string) { }

    public allGridToPost() {
        return {
            filterOptionsViewModel: this.filterOptions,
            matterRef: this.matterRef,
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }
}