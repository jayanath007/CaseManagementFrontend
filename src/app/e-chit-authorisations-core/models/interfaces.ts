import { DataSourceRequestViewModel } from '../../core/lib/grid-model';

export class GridDataRequest {
    constructor(public dataSourceInfo: DataSourceRequestViewModel,
        public groupId: number,
        public users: string) { }

    public GridRequestToPost() {
        return {
            dataSourceRequestViewModel: this.dataSourceInfo,
            groupId: this.groupId,
            user: this.users,
        };
    }
}
export interface FeeEarner {
    code: string;
    name: string;
}
export interface AuthorisationsGroup {
    groupId: number;
    groupName: string;
}
export interface FeeEarnerResponce {
    data: FeeEarner[];
    Status: StatusType;
}
export enum StatusType {
    Fail = 0,
    Success = 1,
}
export interface DpsSelectModel<T> {
    data: T;
    selected: boolean;
}
export interface EChitAuthorisationsResponse {
    data: AuthorisationsDataViewModel;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
}
export interface AuthorisationsDataViewModel {
    data: AuthorisationsGridData[];
    total: number;
    aggregates: Array<AggregatorViewModel>;
}
export interface DetailStatusViewModel {
    code: string;
    message: string;
    reference: string;
    messageType: string;
    severityLevel: string;
    exceptionType: string;
}
export interface AggregatorViewModel {
    field: string;
    aggregate: string;
}
export interface AuthorisationsGridData {
    id: number;
    dateReqst: string;
    type: string;
    dateReqrd: string;
    ref: string;
    matterRef: string;
    matterDetails: string;
    clientName: string;
    reason: string;
    notes: string;
    net: number;
    vat: number;
    payee: string;
    feeEarner: string;
    requestedBy: string;
    level: number;
    selected: boolean;
    authorisedBy: string;
}
export interface AuthorisationsGridDataObject {
    data: AuthorisationsGridData[];
    total: number;
    aggregates: Array<AggregatorViewModel>;
}
export interface EchitAuthoriseViewModel {
    cheReqestId: number;
    level: number;
}
export interface FileDataViewModel {
    supplierRef: string;
    fileName: string;
}

