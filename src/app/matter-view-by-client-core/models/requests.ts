import { DataSourceRequestViewModel } from '../../core/lib/grid-model';


export class GridRequest {
    constructor(public clientRef: string,
        public dataSourceInfo: DataSourceRequestViewModel) { }

    public gridToPost() {
        return {
            clientRef: this.clientRef,
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }

    public gridToPostEchit() {
        return {
            matterFilterOptionViewModel: { searchText: this.clientRef },
            dataSourceRequestViewModel: this.dataSourceInfo
        };
    }
}
