
export enum GridKind {
    all = 'ALL',
    billsReceipts = 'Bills & Receipts',
    disbs = 'Disbs',
    client1 = 'Client1',
    client2 = 'Client2',
    client3 = 'Client3',
    clientGBP = 'Client GBP',
    dda = 'DDA'
}

export enum allGridFilterKind {
    showDDA = 'showDDA',
    showBalanceOnly = 'showBalanceOnly',
    showCOS = 'showCOS',
    showReversal = 'showReversal',
    showURN = 'showURN',
    showSysBills = 'showSysBills',
    showTransPeriods = 'showTransPeriods',
    showOnlyOfficeTrans = 'showOnlyOfficeTrans',
    showOnlyDisbuersements = 'showOnlyDisbuersements',
    periodText = 'periodText',
    isActiveClass = 'isActiveClass',
    isBillsOnly = 'isBillsOnly',
}

export enum ViewChangeKind {
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',
    PageChange = 'PAGE_CHANGE',
    periodColumnFilter = 'PERIOD_COLUMN_FILTER',
}

export enum AllGridColumnWidth {
    Date = '80px',
    Type = '85px',
    URN = '85px',
    Ref = '90px',
    Details = '',
    VAT = '85px',
    Period = '80px',
    OfficeDr = '95px',
    OfficeCr = '95px',
    OfficeBal = '98px',
    ClientDr = '115px',
    ClientCr = '115px',
    ClientBal = '115px',
    DDADr = '95px',
    DDDCr = '95px',
    DDDbal = '95px'
}
