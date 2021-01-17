export enum Operator {
    EqualTo = 'eq',
    NotEqualTo = 'ne',
    GreaterThan = 'gt',
    LessThan = 'lt',
    GreaterThanOrEquel = 'ge',
    LessThanOrEquel = 'le',

}

export enum FilterType {
    FeeEarner = 'FeeEarner',
    FromDate = 'DPSLastModified',
    ToDate = 'DPSLastModified',
    AppType = 'MatterCode',
    DocType = 'DocumentType'
}

export enum Logic {
    And = 'and',
    Or = 'or',
}


export enum ViewChangeKind {
    ApplyColumnFilter = 'COLUMN_FILTER',
    PageChange = 'PAGE_EVENT',
    ClearColumnFilter = 'CLEAR_COLUMN_FILTER',
    ToggleFieldSort = 'FIELD_SORT',

}

export enum DocTypes {
    Docx = 'WordDocuments',
    Excel = 'ExcelDocuments',
    Pdf = 'PDPDocuments',
    Text = 'TextFiles',
    Eml = 'Message',
    Image = 'Image',
    All = 'Unknown'
}


