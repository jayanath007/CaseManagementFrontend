export enum SearchColumnOption {
    Speed = 'Speed',
    All = 'All',
    Client = 'Client',
    Date = 'Date',
    Custom = 'Custom',
}

export enum MatterSearchMode {
    Setup = 'Setup',
    Application = 'Application',
    Client = 'Client',
    Date = 'Date',
    AllApplications = 'AllApplications',
}

export enum ViewChangeKind {
    ChangeAppCode = 'CHANGE_APP_CODE',
    SearchClient = 'SEARCH_CLIENT',
    SearchMatter = 'SEARCH_MATTER',
    RightClickHeader = 'RIGHT_CLICK_HEADER',
    FindAllClick = 'FIND_ALL_CLICK',
    SpeedSearchClick = 'SPEED_SEARCH_CLICK',
    ChangeBranch = 'CHANGE_BRANCH',
    IsMatterClosed = 'IS_MATTER_CLOSED',
    Default= 'DEFAULT',
    PageEvent = 'PAGE_EVENT',
    ToggleFieldSort = 'TOGGLE_FIELD_SORT'
}

export enum StatusType {
    Fail = 0,
    Success = 1,
}



