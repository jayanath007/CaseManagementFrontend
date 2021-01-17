import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class DataRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public gridFilterOption: FilterOptionBaseViewModel) { }

    public DataRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            filterOptionBaseViewModel: this.gridFilterOption
        };
    }
}

export class FilterOptionBaseViewModel {
    user: string;
    departmentId: number;
    searchText: string;
}

export class RequestToCompleteTask {
    constructor(public data: CompletePostRequest) { }

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





