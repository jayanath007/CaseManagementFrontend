export enum FieldType {
  Date = 'DATE',
  Text = 'TEXT',
  TextEqulOrNot = 'TEXT_EQUEL_OR_NOT',
  TextAfterBefore = 'TEXT_GT_OR_LT',
  Boolen = 'BOOLEN',
  Number = 'NUMBER',
  DropValue = 'DROP_VALUE',
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
    GreaterThan = 'gt',
    NotEqual = 'ne'
}

export enum Logic {
    Or = 'or',
    And = 'and'
}

export enum SortDirections {
    Desc = 'desc',
    Asc = 'asc'
}

export enum DocType {
    Docx = 'WordDocuments',
    Excel = 'ExcelDocuments',
    Pdf = 'PDPDocuments',
    Text = 'TextFiles',
    Eml = 'Message',
    Image = 'Image',
 //   All = 'Unknown'
}

