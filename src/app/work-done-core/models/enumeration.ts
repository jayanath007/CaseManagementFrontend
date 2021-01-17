export enum ViewChangeKind {
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',
    PageChange = 'PAGE_CHANGE',
    GroupModeChange = 'GROUP_MODE_CHANGE',
}

export enum gridFilterKind {
    department = 'DEPARTMENT',
    period = 'PERIOD',
    searchText = 'SEATRCH_TEXT',
    user = 'USER'
}

export enum GridButtonType {
    openCase = 'OPEN_CASE',
    openTimeRecording = 'TIME_RECORDING',
    openNewMail = 'NEW_MAIL',
    openLedgerCard = 'LEDGER_CARD',
    viewDocument = 'VIEW_DOCUMENT',
    closeViewer = 'CLOSE_VIEW'
}


