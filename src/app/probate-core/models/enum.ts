export enum EstateType {
    Asset = 'Asset',
    Liability = 'Liability',
    Gift = 'Gift',
    Exemption = 'Exemption'
}

export enum ReceiptType {
    CapitalReceipts = 1,
    QuotedInvestments,
    TaxedInterest,
    UntaxedInterest,
    RentIncome,
    NonTaxable
}
export enum ProbateDealtBy {
    NotApplicable = -1,
    Sold,
    Legacy,
    AssignedInLieu,
    Receipt,
    Payment,
    PassedBySurvivorship,
    DistributionResiduary,
    DistributionPecuniary,
    SpouseExemption,
}