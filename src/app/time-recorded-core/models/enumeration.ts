export enum ViewChangeKind {
    ApplyColumnFilter = 'COLUMN_FILTER',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',
    PageChange = 'PAGE_CHANGE',
}

export enum gridFilterKind {
    type = 'TYPE',
    department = 'DEPARTMENT',
    period = 'PERIOD',
    searchText = 'SEATRCH_TEXT',
    user = 'USER',
    selectRow = 'SELECT_ROW'
}

export enum GridButtonType {
    openCase = 'OPEN_CASE',
    addTimeRecording = 'ADD_TIME_RECORDING',
    editTimeRecording = 'EDIT_TIME_RECORDING',
}

export enum Operator {
    EqualTo = 'eq',
    NotEqualTo = 'neq',
    StartWith = 'startswith',
    Contains = 'contains',
    DoesNotContains = 'doesnotcontain',
    EndWith = 'endswith',
    GreaterThanOrEquel = 'gte',
    LessThanOrEquel = 'lte',
    LessThan = 'lt',
    GreaterThan = 'gt'
}

export enum GroupMode {
    Default = 'View',
    DateGroup = 'DateGroup',
}


