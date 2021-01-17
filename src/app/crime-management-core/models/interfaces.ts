export interface CrimeClassRequestModel {
    classId: number;
    className: string;
    openDate: string;
}


export interface ClassObj {
    branchid: number;
    classTotalsViewModel: ClassTotalsViewModel;
    classname: string;
    classtype: string;
    datebill: number;
    dateclsd: number;
    dateopen: string;
    feeearn: string;
    isAGFS: boolean;
    isUnclosedClass: boolean;
    leadUFNMasterClass: any;
    linkedclassid: number;
    note: string;
    rectype: number;
    u_MATTER: number;
    subClassMode: number;
    selected?: boolean;
}

export interface ClassTotalsViewModel {
    classTotal: number;
    disbursements: number;
    disbursementsTotal?: number;
    fixedClassTotal: number;
    isFixedClassTotalVisible: boolean;
    total: number;
}



