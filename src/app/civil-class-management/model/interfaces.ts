export interface CivilClassObj {
    legalAidCaseId: number;
    branchId: number;
    appId: number;
    fileId: number;
    openDate: string;
    closeDate: string;
    billDate: string;
    caseId: string;
    licensedOptions: number;
    caseStageLevel: string;
    feeEarner: string;
    className: string;
    classType: number;
    selected?: boolean;
}

export interface CivilManagementModuleInput {
    appId: number;
    branchId: number;
    fileId: number;
}
