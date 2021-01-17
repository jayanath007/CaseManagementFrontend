export enum InputNameList {
    LastName = 'LastName',
    FirstName = 'FirstName',
    CompanyName = 'CompanyName',
    HouseNo = 'HouseNo',
    Address1 = 'Address1',
    Address2 = 'Address2',
    Town = 'Town',
    County = 'County',
    PostCode = 'PostCode',
    Email1 = 'Email1',
    Email2 = 'Email2',
    Note = 'Note',
    MatterDetails1 = 'MatterDetails1',
    MatterDetails2 = 'MatterDetails2',
    Mobileno = 'MobileNo',
    WorkTelNo = 'WorkTelNo',
    Title = 'Title'
}
export enum SaveButtonType {
    OpportunitySave = 'OPPORTUNITY_SAVE',
    OpportunityQuote = 'OPPORTUNITY_QUOTE'
}
export enum QuoteType {
    GenaralQuote = 'GenaralQuote',
    PropertyQuote = 'PropertyQuote'
}

export enum LeaseHold {
    Yes = 'l',
    No = 'f',
    Both = 'b'
}
export enum PropertyQuoteRequestKey {
    reportId = 'reportId',
    appId = 'appId',
    isEngProperty = 'isEngProperty',
    martgage = 'martgage',
    sellShare = 'sellShare',
    buyShare = 'buyShare',
    buyLeasehold = 'buyLeasehold',
    saleleasehold = 'saleleasehold',
    hipsLeasehold = 'hipsLeasehold',
    branchId = 'branchId',
    purchesValue = 'purchesValue',
    saleValue = 'saleValue',
    hIPsValue = 'hIPsValue',
    lasId = 'lasId',
    isBuyHouse = 'isBuyHouse',
    isFirstTimeBuyer = 'isFirstTimeBuyer',
    isNewBuild = 'isNewBuild',
    isBuyToLet = 'isBuyToLet',
    isSecondProperty = 'isSecondProperty',
    isRightToBuy = 'isRightToBuy',
    isSaleHouse = 'isSaleHouse',

    purchesProfCostDis = 'purchesProfCostDis',
    saleProfCostDis = 'saleProfCostDis',
    hipsProfCostDis = 'hipsProfCostDis',
}

export enum PropertyQuoteValidation {
    purchesValue = 'Enter buying amount',
    saleValue = 'Enter selling amount',
    value = 'Please enter a correct amount',
    isEngProperty = 'We are only able to act for you if the property is in England and Wales',
    branch = 'Please select a branch'
}

export enum OpportunityType {
    Normal = 'Normal',
    WebQuote = 'WebQuote',
    Solicitor = 'Solicitor',
}


