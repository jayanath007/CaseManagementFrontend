
import { eBillingType } from './../../core/lib/matter';
import { CaseFileIdentityWithAppIdViewModel } from './../../core/lib/files';
import { DetailStatus } from '../../shared';


export interface GridData {
    appID: number;
    appCode: string;
    branchID: number;
    eBilling: eBillingType;
    feeEarner: string;
    fileId: number;
    isMasterMatter: boolean;
    lastUsed: string;
    masterMatterId: number;
    matterCounter: number;
    matterDetails: string;
    matterReferenceNo: string;
    startDate: string;
    closed: boolean;
    ufnValue: string;
    clientName: string;
}


export enum MaterLinkType {
    MatterCreation = 'MatterCreation',
}


// export interface PlotViewModel {
//     fromPlotNo: number;
//     toPlotNo: number;
//     matterRef: string;
// }

export interface PlotSaleScreenDataViewModel {
    caseFileIdentityWithAppIdViewModel: CaseFileIdentityWithAppIdViewModel;
    screenId: string;
    linkMatters: string[];
    linkMatterRange?: string;
}

export interface PlotMatterValidationResponce {
    data: any;
    detailStatus: DetailStatus[];
    messageBody: string;
    messageHeader: string;
    status: string;
    title?: string;
}

// export interface DetailStatus {
//     code: any;
//     exceptionType: any;
//     message: string;
//     messageType: string;
//     reference: string;
//     severityLevel: string;
// }


export interface PlotSyncSuccessInfo {
    isSuccess: boolean;
    msg: string;
}

export interface MatterDataInput {
    appId: number;
    branchID: number;
    fileID: number;
    isPlotMasterMatter: boolean;
}






