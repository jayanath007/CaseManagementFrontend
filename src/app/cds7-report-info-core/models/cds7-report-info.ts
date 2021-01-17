export interface Cds7ReportInfo {
    branchId: number;
    caseType: string;
    classId: number;
    counselAsigned: boolean;
    dateOfMainOffences: string;
    defStatements: number;
    defWitnesses: number;
    extradition: boolean;
    fileId: number;
    gpToSolDate: string;
    indClaimDate: string;
    isAboveLimit: boolean;
    isCaseBackToCC: boolean;
    isEndInThreeMonths: boolean;
    isEnhancedRates: boolean;
    isPreOrder: boolean;
    isPrepTapeEvidence: boolean;
    isSupClaim: boolean;
    isUrbanRates: boolean;
    isYouth: boolean;
    locationId: string;
    locationName: string;
    noOfDefendants: number;
    ppe: number;
    preOrderWorkDate: string;
    representationOrderWithdrawnDate: string;
    s61Committal: boolean;
    tapeInerviewDu: string;
    warrantIssueDate: string;
    wasAssignedCounselInstructed: boolean;
    wastedCostOrderMade: boolean;
    isDesignatedArea: boolean;
    stageReached: string;
}

// export interface CaseTypeItem {
//     key: string;
//     value: string;
// }

export enum CDS7CloseInfo {
    ExitByUser = 'ExitByUser',
    ExitWithSaveSuccess = 'ExitWithSaveSuccess'
}
