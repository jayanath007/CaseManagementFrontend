import { BillingGuideAnalysisType, BillingGuideSortBy, BillingGuideShowTime } from './enum';
import { AttachmentType } from '../../core/lib/graph-enums';

export interface BillingGuideViewModel {
    activity: boolean;
    // billingDate: string;
    fromDate: string;
    toDate: string;
    clientName: string;
    matterRef: string;
    analysisType: BillingGuideAnalysisType;
    billingGuideSortBy: BillingGuideSortBy;
    billingGuideShowTime: BillingGuideShowTime;
    chkFeeEarner: boolean;
    chkType: boolean;
    chkActivity: boolean;
    chkHideZeroValues: boolean;
    chkBillingSummaryReport: boolean;
    chkIncludeDisbursement: boolean;
    caseFileIdentityWithAppIdViewModel: CaseFileIdentityWithAppIdViewModel;

}




export interface CaseFileIdentityWithAppIdViewModel {
    branchId: Number;
    appId: Number;
    fileId: Number;
}

export interface BillingGuidePopupData {
    clientName: string;
    matterRef: string;
    branchId: Number;
    appId: Number;
    fileId: Number;
    analysisType: BillingGuideAnalysisType;
}


export interface BillingGuideReportData {
    Id: string;
    Name: string;
    ContentType: string;
    Base64String: string;
    Data: any;
    size: number;
    IsInline: boolean;
    ContentId: boolean;
    AttachmentType: AttachmentType;
    ItemType: any;
    ItemId: any;
    ItemClass: string;

}

export interface AttachmentDTO {
    data: any;
    name: string;
    ContentType: string;
}

export interface BilledValueResponse {
    data: BillValue;
    detailStatus: any[];
    messageBody: string;
    messageHeader: string;
    status: string;
}

export interface BillValue {
    billedValue: number;
    unbilledValue: number;
}






