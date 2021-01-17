export enum ClientPopupType {
    GeneralClientSearch = 'GENERAL_CLIENT_SEARCH',
    OpportunityClientSearch = 'OPPOTUNITIES_CLIENT_SEARCH'
}
export enum ClientSearchKind {
    SearchText = 'SEARCH_TEXT',
    SearchTextClear = 'SEARCH_TEXT_CLEAR',
    ClientPageChange = 'CLIENT_PAGE_CHANGE',
    ApplyClientColumnFilter = 'CLIENT_COLUMN_FILTER',
    ClearClientColumnFilter = 'CLIENT_CLEAR_COLUMN_FILTER',
    Refresh = 'REFRESH',
    ToggleClientFieldSort = 'CLIENT_FIELD_SORT',
}
export enum ViewChangeKind {
    // MainView = 'MAIN_VIEW',
    // Department = 'DEPARTMENT',
    // ClosedMatters = 'CLOSED',
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',



    // InactiveFeeEarners = 'FEE_EARNERS',
    // SearchText = 'SEARCH_TEXT',
    PageChange = 'PAGE_CHANGE',
    // Employee = 'EMPLOYEE',
}
export enum ClientMenu  {
    AddClient = 'Add Client',
    LedgerCard = 'Ledger card',
    eChit = 'eChit'
}
