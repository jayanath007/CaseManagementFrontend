

export interface ProbateMatterInput {
    appId: number;
    fileID: number;
    branchID: number;
    matterReferenceNo: string;
}



export interface AccountItem {
    branchId: number;
    appId: number;
    fileId: number;
    id: number;
    probateTransId: number;
    dealtBy: number;
    percent: number;
    description: string;
    contactId: number;
    soldDate: string;
    amount: number;
    receiptType: number;
    noOfShares?: number;
}





