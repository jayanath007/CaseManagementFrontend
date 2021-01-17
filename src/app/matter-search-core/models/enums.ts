
export enum ViewChangeKind {
    MainView = 'MAIN_VIEW',
    Department = 'DEPARTMENT',
    ClosedMatters = 'CLOSED',
    CompletedMatters = 'COMPLETED',
    InactiveFeeEarners = 'FEE_EARNERS',
    SearchText = 'SEARCH_TEXT',
    PageChange = 'PAGE_CHANGE',
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    Employee = 'EMPLOYEE',
    ToggleFieldSort = 'FIELD_SORT',
    IsEnableMLSMatters = 'IS_ENABLE_MLS_MATTERS'
}

export enum MatterViews { Recent = 'Recent50', MyMatter = 'MyMatters', All = 'AllMatters', Suggested = 'SuggestByEmails' }

export enum StatusType {
    Fail = 0,
    Success = 1,
}

export enum MatterMenu {
    AddMatter = 'Add Matter',
    LedgerCard = 'Ledger card',
    eChit = 'eChit',
    AddvanceSearch = 'Advanced Search'
}
