export enum ViewChangeKind {
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',
    PageChange = 'PAGE_CHANGE',
    GroupModeChange = 'GROUP_MODE_CHANGE',
}

export enum GridFilterKind {
    user = 'USER',
    searchText = 'SEATRCH_TEXT',
    department = 'DEPARTMENT'
}

export enum GridButtonType {
    viewDocument = 'VIEW_DOCUMENT',
    closeViewer = 'CLOSE_VIEW',
    deleteItem = 'DELETE_ITEM',
    selectOneItem = 'SELECT_ONE_ITEM',
    selectItem = 'SELECT_ITEM',
    checkItem = 'CHECK_ITEM',
    uncheckItem = 'UNCHECK_ITEM',
}

export enum GroupMode {
    Default = 'View',
    Date = 'Inboxdatecreated',
    ByGroup = 'ByGroup',
    ByGroupDate = 'ByGroupDate',
    DateByGroup = 'DateByGroup'
}

