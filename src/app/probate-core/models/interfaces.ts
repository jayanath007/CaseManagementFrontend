export interface ProbateMatterInput {
    appId: number;
    fileID: number;
    branchID: number;
    matterReferenceNo: string;
}
export interface ProbateResponse {
    deceasedInfo: DeceasedInfo;
    distributionViewItems: DistributionViewItems[];
    estateOverViews: EstateOverViews;
    residenceNilRateBandData: ResidenceNilRateBandData;
    spouseorCivilPatnerData: SpouseorCivilPatnerData[];
    transactions: Transactions;
    ihtFormsData: IhtFormsData[];
}

export interface DeceasedInfo {
    dateofDeath: string;
    firstName: string;
    surName: string;
    taxYear: string;
}

export interface DistributionViewItems {
    amount: number;
    beneficiary: string;
    contactId: number;
    date: string;
    dealtBy: number;
    details: string;
    distribution: string;
    outstandingPercentage: number;
    percent: number;
    id: number;
    contactAddress1: string;
    contactAddress2: string;
    contactAddress3: string;
    contactCompany: string;
    contactPostCode: string;
    probateTransId: number;

}


export interface EstateOverViews {
    estateViewItems: EstateViewItems[];
    overviewTotal: OverviewTotal;
}


export interface EstateViewItems {
    assets: number;
    category: number;
    categoryCaption: string;
    dealtByAction: number;
    description: string;
    exemption: number;
    gifts: number;
    id: number;
    liabilites: number;
    status: string;
    type: string;

}

export interface OverviewTotal {
    totalAssets: number;
    totalExcemptions: number;
    totalGifts: number;
    totalLiabilities: number;
}

export interface ResidenceNilRateBandData {
    noOfPreDeceasedSpouses: number;
    previouslyUsedTRNRB: number;
    remainingTRNRB: number;
    rnrbInForceDOD: number;
    trnrbInForceDOD: number;
}

export interface SpouseorCivilPatnerData {
    assetHeldInTrust: number;
    dateofBirth: string;
    dateofDeath: string;
    giftsWithReservation: number;
    inheritanceTax: number;
    isUseFullNilRateBand: boolean;
    isUseRemainingNilRateBand: boolean;
    name: string;
    netValue: number;
    nilRateBand: number;
    nilRateBandAvailableTransfer: number;
    nilRateBandatDOD: number;
    percentageByWhich: number;
    shareofGointly: number;
    totalChargeableAssets: number;
    totalChargeableValueofGift: number;
    totalLegancies: number;
    transferableNilRate: number;
}
export interface Transactions {
    transactionTotal: TransactionTotal;
    transactionViewItems: TransactionViewItems[];

}

export interface TransactionTotal {
    totalCredit: number;
    totalDebit: number;

}
export interface TransactionViewItems {
    credit: number;
    contactId: number;
    dealtBy: number;
    debit: number;
    details: string;
    id: number;
    itemDescription: string;
    quantitySold: string;
    soldDate: string;
    subType: string;
    amount: number;
    receiptType: number;
    probatTransId: number;

}


export interface CategoryResponce {
    assetCategories: DropdownCategory;
    exemptionCategories: DropdownCategory;
    giftCategories: DropdownCategory;
    liabilityCategories: DropdownCategory;
}
export interface DropdownCategory {
    categories: CategoryItem[];
    entryType: string;
}

export interface CategoryItem {
    id: number;
    description: string;
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
    pBS: boolean;
    Scpe: boolean;
    noOfShares: number;
    subType: number;
}

export interface SelectProRow {
    selectedEstateRow: any;
    selectedTransaction: TransactionGridRow;
    selectedDistribution: any;


}

export interface EditAccountItemRow {
    amount: number;
    appId: number;
    branchId: number;
    contactId: number;
    dealtBy: number;
    description: string;
    fileId: number;
    id: number;
    percent: number;
    probateTransId: number;
    receiptType: number;
    soldDate: string;
}
export interface TransactionGridRow {
    amount: number;
    contactId: number;
    credit: number;
    dealtBy: number;
    debit: number;
    details: string;
    id: number;
    itemDescription: string;
    probatTransId: number;
    quantitySold: number;
    receiptType: number;
    soldDate: string;
    subType: string;
}

export interface IhtFormsData {
    dateGenarated: string;
    diaryId: number;
    fileName: string;
    form: string;
    user: string;
}







