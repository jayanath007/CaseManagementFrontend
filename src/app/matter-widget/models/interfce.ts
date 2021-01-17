import { MatterSearchGridData } from '../../matter-search-core';

export interface DataObjectResponse {
    data: DataObj;
    total: number;
    status: StatusType;
}

export interface DataObj {
    data: MatterSearchGridData[];
    totalMatterCount: number;
}


// export interface Matters {
//     matters: GridData[];
//     total: number;
//     status: StatusType;
// }


// export interface GridData {
//     appID: number;
//     fileID: number;
//     closed: boolean;
//     lastUsed: Date;
//     app_Code: string;
//     branchID: number;
//     feeEarner: string;
//     reviewDate: Date;
//     clientName: string;
//     reviewNote: string;
//     company_Name: string;
//     matterDetails: string;
//     matterReferenceNo: string;
//     rateCategory?: string;
//     matterCounter?: number;
//     ufnValue: string;
//     eBilling: eBillingType;
//     isPlotMatter?: boolean;
//     isPlotMasterMatter?: boolean;
//     isProspectMatter: boolean;
// }

export enum StatusType {
    Fail = 0,
    Success = 1,
}

