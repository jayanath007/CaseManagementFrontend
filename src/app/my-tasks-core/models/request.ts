import { DataSourceRequestViewModel } from '../../core/lib/grid-model';
import { GridGroupData } from './interfce';

export class GridRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public gridFilterOption: FilterOptionBaseViewModel,
        public row?: GridGroupData) { }

    public GridRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            filterOptionBaseViewModel: this.gridFilterOption
        };
    }
}



export class LoadMyTaskGroupRequest {

    constructor(public filterOptions: FilterOptionBaseViewModel,
        public dataSourceInfo: DataSourceRequestViewModel,
        public hash: string) { }

    public toPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            documentHistoryFilterOptionViewModel: this.filterOptions,
        };
    }
}



export class FilterOptionBaseViewModel {
    user: string;
    departmentId: number;
    searchText: string;
}

export class RequestToCompleteTask {
    constructor(public data: CompletePostRequest, public token: string) { }

    public CompleteTaskToPost() {
        const data = new FormData();
        const dataRow: any = this.data;
        data.append('taskViewModel', JSON.stringify(dataRow));
        return data;
    }
}

export class CompletePostRequest {
    taskFor: string;
    client: string;
    matterReferenceNo: string;
    matterDetails: string;
    columnFolderId: number;
    workflowActions: string;
    note: string;
    dateBy: string;
    // taskID: number;
    putOnBy: string;
    appCode: string;
    appID: number;
    fileID: number;
    date: Date;
    branchID: number;
    diaryId: number;
}




