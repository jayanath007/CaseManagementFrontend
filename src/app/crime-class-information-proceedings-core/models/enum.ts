export enum ModelProperty {
    branchId = 'branchId',
    fileId = 'fileId',
    classId = 'classId',
    stageReached = 'stageReached',
    matterType = 'matterType',
    outcomeCode = 'outComeCode',
    dsccRef = 'dsccRef',
    noOfDefendants = 'noOfDefendants',
    caseType = 'caseType',
    youthChecked = 'isYouth',
    dutySoliChecked = 'isDuty',
    doNotClaimVATChecked = 'doNotClaimVAT',
    gender = 'gender',
    disability = 'disability',
    ethnicCode = 'ethnicCode',
    dateOfMainOffences = 'dateOfMainOffences',
    dateFirstInstructed = 'dateFirstInstructed',
    preOrderWorkDate = 'preOrderWorkDate',
    urbanRates = 'isUrbanRates',
    representationOrderDateAppliedFor = 'representationOrderDateAppliedFor',
    representationOrderWithdrawnDate = 'representationOrderWithdrawnDate',
    maatid = 'maatId',
    wasAssignedCounselInstructed = 'wasAssignedCounselInstructed',
    s61Committal = 's61Committal',
    counselAsigned = 'counselAsigned',
    advacacyAssistanceInCrownCourt = 'advacacyAssistanceInCrownCourt',
    wastedCostOrderMade = 'wastedCostOrderMade',
    extradition = 'extradition',
    locationId = 'locationId',
    locationName = 'locationName',
    isEnhancedRates = 'isEnhancedRates',
    travUplifts = 'travUplifts',
    waitUplifts = 'waitUplifts',
    attUplifts = 'attUplifts',
    prepUplifts = 'prepUplifts',
    advoUplifts = 'advoUplifts',
    letterUplifts = 'letterUplifts',
    callsUplifts = 'callsUplifts',
    openedDate = 'openedDate',
    billedDate = 'billedDate',
    closedDate = 'closedDate',
    excludeFromCDS6Checked = 'excludeFromCDS6Checked',
    roNotGranted = 'roNotGranted',
    seriousFraudCase = 'isSeriousFraud',
    isDesignatedAreaEnabled = 'isDesignatedAreaEnabled',
    committedToCrownCourt = 'committedToCrownCourt',
    committedToCrownCourtType = 'committedToCrownCourtType',
}

export enum Message {
    InvalidRepresentationOrderDate = 'Representation Order Date must be greater than to 01/01/2016, Please select a valide date'
}

export enum Controls {
    btnSave = 'btnSave',
    dtpCloseDate = 'dtpCloseDate',
    dtpBillDate = 'dtpBillDate',
}

export enum LoadinState {
    modelData = 'modelData',
    total = 'total',
}

export enum CommittedToCrownCourtType {
    elected = 'Elected',
    indictable = 'Indictable',
    transferred = 'Transferred'
}
