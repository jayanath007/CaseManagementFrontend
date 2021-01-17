

export interface OpenCaseValidationRequest {
    BranchID: number;
    AppID: number;
    FileID: number;
    AppCode: string;
}

export interface OpenCaseUpdateRequest {
    AppId: number;
    BranchId: number;
    FileId: number;
}
export interface GetClientRequest {
    appID: number;
    fileID: number;
    branchID: number;
}

export interface TimesFinancialFiguresRequest {
    matterReferenceNo: string;
}







