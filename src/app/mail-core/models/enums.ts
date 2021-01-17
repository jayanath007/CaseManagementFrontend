
export enum MessageListActions {
    Filter = 'FILTER',
    SortDir = 'SORT_DIR',
    OrderBy = 'ORDER_BY',
    PageChange = 'PAGE_CHANGE',
    VirtualScroll = 'VIRTUAL_SCROLL'
}

export enum FilterTypes {
    All = 'ALL',
    Unread = 'UNREAD',
    ToMe = 'TOME',
    Flagged = 'FLAGGED'
}

export enum OrderBy {
    Date = 'DATE',
    From = 'FROM',
    Size = 'SIZE',
    Subject = 'SUBJECT',
    Type = 'TYPE',
    Attachment = 'ATTACHMENT',
    Importance = 'IMPORTANCE'
}

export enum SortDir {
    Asc = 'ASC',
    Desc = 'DESC'
}
export enum SerchDateTypes {
    All = 'ALL',
    ThisWeek = 'THIS_WEEK',
    ThisMonth = 'THIS_MONTH',
    SelectRange = 'SELECT_RANGE'
}
export enum SerchMessageListActions {
    SearchText = 'SEARCH_TEXT',
    From = 'FROM',
    HasAttachment = 'HAS_ATTACHMENT',
    IsAllFolders = 'IS_ALL_FOLDERS',
    DateType = 'DATE_TYPE',
}
export enum PermissionLevel {
    None = 'None',
    Owner = 'Owner',
    PublishingEditor = 'PublishingEditor',
    Editor = 'Editor',
    PublishingAuthor = 'PublishingAuthor',
    Author = 'Author',
    NoneditingAuthor = 'NoneditingAuthor',
    Reviewer = 'Reviewer',
    Contributor = 'Contributor',
    Custom = 'Custom',
}
export enum ReadItems {
    None = 'None',
    FullDetails = 'FullDetails',
}

export enum EditDeleteItems {
    None = 'None',
    Owned = 'Owned',
    All = 'All',
}

