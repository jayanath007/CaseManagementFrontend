export enum FormType {
    Asset = 'Asset',
    Liability = 'Liability',
    Gift = 'Gift',
    Exemption = 'Exemption'
}
export enum Mode {
    AddMode = 'Add Mode',
    EditMode = 'Edit Mode'
}
export enum CommonControllerTypes {
    Label = 'label',
    Input = 'input',
    InputNumber = 'numberInput',
    Amount = 'amount',
    TwoDecimal = 'TwoDecimal',
    FourDecimal = 'FourDecimal',
    Percentage = 'Percentage',
    TextBox = 'textBox',
    CheckBox = 'checkBox',
    DropDown = 'dropDown',
    DatePicker = 'datePicker',
    RadioBtn = 'radioBtn',
    SingleRadioBtn = 'singleRadioBtn',
    InputMatPrefix = 'inputMatPrefix',
    TableInputBox = 'tableInputBox',
    TableAmount = 'tableAmount',
    LiabilityAssetDropDown = 'liabilityAssetDropDown',
    ExemptionAssetDropDown = 'exemptionAssetDropDown',
    JointlyOwnedAssetsTypes = 'JointlyOwnedAssetsTypes'
}
export enum ProbateEntryType {
    NotApplicable = -1,
    Asset = 0,
    Liability = 1,
    Exemption = 2,
    Gift = 3,
    Accounts = 4,
    All = 5
}
export enum ProbateDealtBy {
    NotApplicable = '-1',
    Sold = 0,
    Legacy = '1',
    AssignedInLieu = '2',
    Receipt = '3',
    Payment = '4',
    PassedBySurvivorship = '5',
    DistributionResiduary = '6',
    DistributionPecuniary = '7',
    SpouseExemption = 8,
}
export enum ProbateDealtByString {
    Sold = 'Sold',
    Legacy = 'Legacy',
    AssignedInLieu = 'AssignedInLieu',
    Receipt = 'Receipt',
    Payment = 'Payment',
    PassedBySurvivorship = 'PassedBySurvivorship',
    DistributionResiduary = 'DistributionResiduary',
    DistributionPecuniary = 'DistributionPecuniary',
    SpouseExemption = 'SpouseExemption',
}
export enum ItemChangeProperty {
    // category
    Category = 'category',
    // cat7
    BankOrBuildingSociety = 'bankOrBuildingSociety',
    BankAccountNo = 'bankAccountNo',
    BankAmountHeld = 'bankAmountHeld',
    BankInterest = 'bankInterest',
    TotalBank = 'totalBank',
    // cal 8
    NationalSavingsAmountHeld = 'nationalSavingsAmountHeld',
    NationalSavingsInterest = 'nationalSavingsInterest',
    // cat9
    BondValue = 'bondValue',
    ValueUnclaimedPrizes = 'valueUnclaimedPrizes',
    // cat32
    Capital = 'capital',
    Interest = 'interest',
    // cat 20,21,22,23,24
    NoOfShares = 'noOfShares',
    MarketPriceOfShare = 'marketPriceOfShare',
    IsRateOfBR100 = 'isRateOfBR100',
    IsRateOfBR50 = 'isRateOfBR50',
    IsRateOfBR0 = 'isRateOfBR0',
    // cat 18/19
    AmountOfStockHeld = 'amountOfStockHeld',
    MarketPricePerUnit = 'marketPricePerUnit',
    // 27/28
    ValueForeignCurrency = 'valueForeignCurrency',
    ExchangeRate = 'exchangeRate',
    // 11 need to validate
    IsAgriRelief = 'isAgriRelief',
    IsBusinessRelief = 'isBusinessRelief',
    // Liability funeral
    FuneralCosts = 'funeralCosts',
    Headstone = 'headstone',
    FuneralValue1 = 'funeralValue1',
    FuneralValue2 = 'funeralValue2',
    FuneralValue3 = 'funeralValue3',
    FuneralValue4 = 'funeralValue4',

}
export enum RedeemedCategoryCode {
    Cash = 5,
    Pension = 6,
    NationalSavingsAccounts = 8,
    PremiumBonds = 9,
    OtherNationalSavingsInvestmentsProducts = 10,
    DebtsDueToTheEstate = 32,
    LifeAssurancePolicies = 36,
    LifeAssurancePoliciesThatBenefitDeceased = 37,
    PaymentsMadeAfterTheDeceasedsDeath = 38,
    LumpSumPaymentMadeOnTheDeceasedsDeath = 39,
    IncomeTaxOrCapitalGainsTaxRepayment = 30,
    TrustIncomeDueToTheDeceased = 31,
    OtherAssetsOrIncomeDueToTheDeceased = 33,
}

export enum SaleofShareCategoryCode {
    Stocksandshares1 = 18,
    Stocksandshares2 = 19,
    Stocksandshares3 = 20,
    Stocksandshares4 = 21,
    Stocksandshares5 = 22,
    Stocksandshares6 = 23,
    Stocksandshares7 = 24,

}