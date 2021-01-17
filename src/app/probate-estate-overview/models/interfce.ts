import { FormType, ProbateDealtBy } from './enums';

export interface ValidationInfo {
    status: boolean;
    msg: string;
}
export interface ProbateCategoryList {
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
export interface ContactDetails {
    contactId: number;
    letterTitle: string;
    name: string;
    address: string;
    postCode: string;
}
export interface ContactResponse {
    contactId: number;
    contactAddress1: string;
    contactAddress2: string;
    contactAddress3: string;
    contactCompany: string;
    contactName: string;
    contactPostCode: string;
}
export interface EstateOverviewModel {
    branchId: number;
    appId: number;
    fileId: number;
    probateTransId: number;
    probateEntryType: number;
    category: number;
    dealtBy: ProbateDealtBy;
    contactId: number;
    roleId: number;
    description: string;
    spouceCivilPartnerExemption: boolean;
    charityExemption: boolean;
    itemData: AssetItem | LiabilityItem | ExemptionItem | GiftItem;
    transactionItems: EditPaymentGridData[];
    contactInfo: ContactResponse;
}
export interface EditPaymentGridData {
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
    noOfShares: number;
}
export interface PaymentGridDataModel<T> {
    data: T;
    rowId: number;
    selected: boolean;
}
// export interface TransactionItems {
//     id: number;
//     description: string;
//     date: string;
//     precentage: number;
//     amount: number;
//     contact: number;
// }
export interface AssetItem {
    jewelleryMarketValue: number;
    vehicleManufacturer: string;
    vehicleModel: string;
    yearOfManufacture: string;
    regNumber: string;
    condition: string;
    openMarketValue: number;
    total: number;
    pensionTotal: number;
    isPensionChanges2Years: boolean;
    itemGivenTo: string;
    whatDeceasedDidWithProceeds: string;
    bankOrBuildingSociety: string;
    bankAccountNo: string;
    totalBank: number;
    bankAmountHeld: number;
    bankInterest: number;
    typeOfAccount: string;
    nationalSavingsAccountNo: string;
    nationalSavingsTotal: number;
    nationalSavingsAmountHeld: number;
    nationalSavingsInterest: number;
    bondNo: string;
    bondValue: number;
    valueUnclaimedPrizes: number;
    totalBondValue: number;
    otherTypeOfAccount: string;
    certificateNo: string;
    otherNationalAmount: number;
    propertyItemNo: number;
    residencePostCode: string;
    tenure: string;
    detailsOfLettings: string;
    valueOfAgriBusiness: number;
    openMarketValueProperty: number;
    buildingLandType: string;
    isAgriRelief: boolean;
    isBusinessRelief: boolean;
    isRnrbOwnedByDeceased: boolean;
    isRnrbInheritedByDescendents: boolean;
    jointAssetType: string;
    jointAssetIDNo: number;
    jointOwner: string;
    isJointNotApplicable: boolean;
    jointOwnershipStartDate: string;
    jointContribution: number;
    jointShare: number;
    jointValueDateOfDeath: number;
    jointDeceasedShare: number;
    nameOfCharity: string;
    valueOfCharityItems: number;
    amountOfStockHeld: number;
    marketPricePerUnit: number;
    totalValueOfStock: number;
    interestOrDividendDue: number;
    noOfShares: number;
    marketPriceOfShare: number;
    totalValueOfShares: number;
    dividendDue: number;
    isOwnedForTwoYearsYes: boolean;
    amountOfBrDue: number;
    isRateOfBR100: boolean;
    isRateOfBR50: boolean;
    isRateOfBR0: boolean;
    valueForeignCurrency: number;
    exchangeRate: number;
    valueSterling: number;
    totalCapitalInterest: number;
    capital: number;
    interest: number;
    payableInsuranceCompany: string;
    payablePolicyNo: string;
    amountPayable: number;
    lifeAssuranceCompany: string;
    lifeAssurancePolicyNo: string;
    personAssured: string;
    valueLifeAssurance: string;
    companyThatProvidedPolicy: string;
    frequencyOfPayments: string;
    detailsOfIncrease: string;
    finalPaymentDate: string; // Date;
    valueOfPayment: number;
    lumpSumCompany: string;
    explaination: string;
    valueLumpSum: number;
    partnershipValue: number;
    partnershipRelief: number;
}
export interface LiabilityItem {
    total: number;
    jointLiabilities: number;
    jointLiabilityCreditor: string;
    jointLiabilityAmount: number;
    jointLiabilityShare: number;
    isAMortgage: boolean;
    mortgageCreditor: string;
    mortgageAmount: number;
    funeralCosts: number;
    headstone: number;
    otherFuneral1: string;
    otherFuneral2: string;
    otherFuneral3: string;
    otherFuneral4: string;
    funeralValue1: number;
    funeralValue2: number;
    funeralValue3: number;
    funeralValue4: number;
    totalFuneral: number;
    personSpentMoney: string;
    spentRelationship: string;
    whatMoneySpentOn: string;
    whyDeceasedMoneyNotUsed: string;
    whyMoneyWasntRepaid: string;
    amountSpent: number;
    nameOfGuaranteed: string;
    guaranteedRelationship: string;
    isCalledUptoToRepay: boolean;
    whyLoanDeducted: string;
    amountDebtGuaranteed: number;
    loanDate: string;
    amountLoan: number;
    amountOfPayments: number;
    whereIsMoney: string;
    valueForeignCurrency: number;
    exchangeRate: number;
    valueSterling: number;
    loanLender: string;
    loanRelationship: string;
    loanStartDate: string; // Date
    loanPurpose: string;
    isLoanSecured: boolean;
    loanOriginalAmount: number;
    loanOutstandingDOD: number;
}
export interface ExemptionItem {
    total: number;
    totalJointExemption: number;
    jointExemption: number;
}
export interface GiftItem {
    dateOfGift: string; // Date
    valueDateOfGift: number;
    giftBeneficiary: string;
    giftExemption: string;
    reliefPercentage: number;
    exemptionAllowance: number;
    preOwnedAssetDateOfGift: string;
    preOwnedAssetValueGift: number;
    preOwnedAssetBeneficary: string;
    preOwnedAssetExemption: string;
    preOwnedAssetRefNo: string;
    preOwnedAssetRelief: number;
}
export interface ProbCategoryWishControllersData {
    formType: FormType;
    categoryId: number;
    categoryCode: string;
    categorDescription: string;
    formName: string;
    formControllers: FormControllerData[];
}
export interface FormControllerData {
    type: string;
    name: string;
    text: string;
    cols: number;
    rows: number;
    disabled?: boolean;
    requiredField?: boolean;
    valueArray?: Array<string>;
    styleSheet: ControllersStyleSheet;
}

export interface ControllersStyleSheet {
    width?: number;
    hight?: number;
    class?: string;
    padding?: number;
    align?: string;
}
export interface AssetItemForDropDown {
    id: number;
    description: string;
}
export interface EOMatterData {
    appId: number;
    fileId: number;
    branchId: number;
}
